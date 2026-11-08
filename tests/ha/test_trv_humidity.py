"""Feuchte aus dem Thermostat, wenn kein eigener Fühler gesetzt ist.

Anlass (Facebook-Frage Daniel Z.): Viele Thermostate (Livisi, Bosch, FRITZ!DECT, Tuya) messen
selbst Luftfeuchte – bei einigen steht der Wert nur als Attribut an der `climate`-Entität und
lässt sich im Einrichtungsdialog nicht auswählen. Vorher blieben Lüftungshinweise und
Schimmelschutz dort stumm, obwohl die Zahl im System vorhanden war.

Vorrang bleibt der eigene Raumfühler: er sitzt in der Raummitte, der Thermostatfühler am
Heizkörper und liest im Heizbetrieb zu trocken.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.raumklima.const import CONF_HUMIDITY_SENSOR, DOMAIN

from .conftest import SENSOR, FakeTrv, hub_entry, room_entry

HUM = "sensor.bad_feuchte"


async def _start(hass: HomeAssistant, **room_options: object):
    """Zentrale + ein Raum, einmal gestartet (die Zentrale lädt den Raum mit)."""
    if hass.states.get(SENSOR) is None:
        hass.states.async_set(SENSOR, "19.0", {"device_class": "temperature"})
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**room_options)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


async def test_fuechte_kommt_vom_thermostat_wenn_kein_fuehler_gesetzt(hass: HomeAssistant, trv: FakeTrv) -> None:
    """Ohne eigenen Feuchtefühler zählt der Wert des Thermostats."""
    trv.set(current_humidity=61.0)
    _, room = await _start(hass)

    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    assert ctrl.current_humidity == 61.0
    assert ctrl.humidity_source == "trv"
    assert ctrl.humidity_capable is True


async def test_eigener_fuehler_hat_vorrang(hass: HomeAssistant, trv: FakeTrv) -> None:
    """Steht ein Raumfühler zur Verfügung, gewinnt er – nicht das Gerät am Heizkörper."""
    trv.set(current_humidity=61.0)
    hass.states.async_set(HUM, "44.0", {"device_class": "humidity"})
    _, room = await _start(hass, **{CONF_HUMIDITY_SENSOR: HUM})

    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    assert ctrl.current_humidity == 44.0
    assert ctrl.humidity_source == "sensor"


async def test_ohne_quelle_bleibt_die_feuchte_leer(hass: HomeAssistant, trv: FakeTrv) -> None:
    """Meldet das Thermostat keine Feuchte, bleibt es beim alten Verhalten."""
    _, room = await _start(hass)

    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    assert ctrl.current_humidity is None
    assert ctrl.humidity_source is None
    assert ctrl.humidity_capable is False


async def test_fuehler_faellt_aus_dann_zaehlt_das_thermostat(hass: HomeAssistant, trv: FakeTrv) -> None:
    """Ein konfigurierter, aber nicht verfügbarer Fühler verschenkt die Auswertung nicht."""
    trv.set(current_humidity=58.0)
    hass.states.async_set(HUM, "unavailable", {"device_class": "humidity"})
    _, room = await _start(hass, **{CONF_HUMIDITY_SENSOR: HUM})

    ctrl = hass.data[DOMAIN]["rooms"][room.entry_id]
    assert ctrl.current_humidity == 58.0
    assert ctrl.humidity_source == "trv"


async def test_entitaeten_entstehen_auch_ohne_eigenen_fuehler(hass: HomeAssistant, trv: FakeTrv) -> None:
    """Taupunkt, Feuchtegrenze und Schimmelrisiko sind da, sobald das Gerät Feuchte meldet."""
    trv.set(current_humidity=61.0)
    _, room = await _start(hass)

    registry = er.async_get(hass)
    unique_ids = {
        entry.unique_id for entry in er.async_entries_for_config_entry(registry, room.entry_id)
    }
    for key in ("dew_point", "abs_humidity", "ventilation", "humidity_limit"):
        assert f"{room.entry_id}_{key}" in unique_ids, f"{key} fehlt"
