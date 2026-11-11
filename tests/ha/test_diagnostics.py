"""Diagnose-Datei: Umfang, Rohdaten der Entitäten, Redaktion."""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant

from custom_components.raumklima.diagnostics import async_get_config_entry_diagnostics


async def test_diagnostics_contains_environment_and_rooms(hass: HomeAssistant, setup) -> None:
    hub, room = setup
    data = await async_get_config_entry_diagnostics(hass, hub)

    assert data["environment"]["integration"]
    assert data["environment"]["home_assistant"]
    assert data["environment"]["python"]
    assert data["hub"] is not None
    assert data["entry"]["title"] == "Allgemein"
    assert data["home_name"] == "Allgemein"
    # Block der Wohnungs-Entitäten ist vorhanden (Urlaub/Gäste, Heute heizen)
    assert isinstance(data["hub_entities"]["entities"], dict)
    assert isinstance(data["hub_entities"]["unavailable"], list)

    assert len(data["rooms"]) == 1
    bad = data["rooms"][0]
    assert bad["name"] == "Bad"
    # Eigene Entitäten und die konfigurierten Fremd-Entitäten landen mit Rohzustand drin
    assert "climate.bad" in bad["entities"]
    assert "sensor.bad_temperatur" in bad["entities"]
    assert bad["entities"]["sensor.bad_temperatur"]["state"] == "19.0"
    assert "attributes" in bad["entities"]["sensor.bad_temperatur"]
    # Gelerntes (Abgleich, Aufheizrate, Preset) ist dabei
    assert "shift" in bad["learned"]["abgleich"]
    assert "episodes" in bad["learned"]["heatup"]
    assert bad["learned"]["preset"]["configured"]
    assert "flags" in data["hub"]["learned"]
    # Die rohen Viertelstunden-Raster werden nicht mehr ausgeliefert
    assert "presence_profile" not in data["hub"]
    # Live-Werte des Raums
    assert bad["values"]["status"]
    assert bad["values"]["calibration_mode"]


async def test_diagnostics_enthaelt_kurve_und_ereignisse(hass: HomeAssistant, setup) -> None:
    """Die Datei ist keine Momentaufnahme mehr: je Raum eine Kurve, dazu Sollwertwechsel mit Quelle."""
    hub, _room = setup
    hass.states.async_set(
        "sensor.bad_temperatur", "19.5", {"unit_of_measurement": "°C", "device_class": "temperature"}
    )
    await hass.async_block_till_done()

    data = await async_get_config_entry_diagnostics(hass, hub)
    bad = data["rooms"][0]
    series = bad["series"]
    assert series["t0"], "die Kurve hat einen Startzeitpunkt"
    assert series["i"] and isinstance(series["i"][0], float)
    assert len(series["t"]) == len(series["i"]) == len(series["z"]) == len(series["v"])
    assert set(series["legend"]) >= {"h", "i", "o"}

    assert isinstance(data["events"], list)
    assert all("source" in e for e in data["events"])


async def test_diagnostics_room_entry_contains_hub(hass: HomeAssistant, setup) -> None:
    _hub, room = setup
    data = await async_get_config_entry_diagnostics(hass, room)
    assert data["rooms"][0]["name"] == "Bad"
    assert data["hub"] is not None
    assert data["hub"]["stage"]


async def test_diagnostics_redacts_secrets(hass: HomeAssistant, setup) -> None:
    hub, _room = setup
    hass.config_entries.async_update_entry(
        hub, options={**hub.options, "mail_password": "streng-geheim-4711", "mail_user": "post@example.org"}
    )
    await hass.async_block_till_done()

    text = str(await async_get_config_entry_diagnostics(hass, hub))
    assert "streng-geheim-4711" not in text
    assert "post@example.org" not in text


async def test_diagnostics_includes_debug_lines(hass: HomeAssistant, setup) -> None:
    hub, _room = setup
    logging.getLogger("custom_components.raumklima.controller").warning("Testzeile für die Diagnose")
    data = await async_get_config_entry_diagnostics(hass, hub)
    messages = [line["message"] for line in data["debug"]]
    assert "Testzeile für die Diagnose" in messages



async def test_notify_targets_are_services_not_entities(hass: HomeAssistant, setup) -> None:
    """`notify.*` ist ein Dienst – er darf nicht als fehlende Entität auftauchen."""
    hub, _room = setup
    hass.config_entries.async_update_entry(
        hub, options={**hub.options, "recipients": {"notify.a": ["health"]}}
    )
    await hass.async_block_till_done()

    data = await async_get_config_entry_diagnostics(hass, hub)
    assert "notify.a" in data["services"]
    assert data["services"]["notify.a"]["exists"] is False  # im Test gibt es den Dienst nicht
    assert "notify.a" not in data["rooms"][0]["unavailable"]
