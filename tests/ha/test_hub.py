"""Zentrale: Heizsaison, Frostschutz, Optionen."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from .conftest import SENSOR, FakeTrv, hub_entry, room_entry


async def _setup(hass: HomeAssistant, **hub_options) -> tuple[MockConfigEntry, MockConfigEntry]:
    hub = hub_entry(**hub_options)
    hub.add_to_hass(hass)
    room = room_entry()
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


async def test_season_pause_turns_trv_off(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    await _setup(hass, season_mode="pause")
    assert trv.is_off
    assert hass.states.get("climate.bad").attributes.get("hvac_action") == "off"


async def test_frost_floor_in_pause(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hass.states.async_set(SENSOR, "14.0")
    await _setup(hass, season_mode="pause", frost_floor=16)
    assert not trv.is_off
    assert trv.setpoint == 17.0  # Sicherung + 1 °C


async def test_raum_frostschutz_heizt_unter_5_grad(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Jeder Raum hat einen eigenen Frostschutz wie das Gerät – Standard 5 °C."""
    from custom_components.raumklima.shared import domain_data

    # Heizpause mit niedriger Wohnungs-Sicherung: nur der Raum-Frostschutz darf greifen.
    _hub, room = await _setup(hass, season_mode="pause", frost_floor=3)
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.frost_temp == 5.0
    await _cool_down(hass)
    on, target, reason = ctrl.plan()
    assert on is True
    assert target == 5.0
    assert reason == "frost"


async def _cool_down(hass: HomeAssistant, values=(16.1, 13.2, 10.3, 7.4, 4.5)) -> None:
    # In kleinen Schritten, sonst verwirft der Ausreißer-Schutz den Sprung von 19 auf 4 °C.
    for value in values:
        hass.states.async_set(SENSOR, str(value), {"device_class": "temperature", "unit_of_measurement": "°C"})
        await hass.async_block_till_done()


async def test_raum_frostschutz_ist_untergrenze_kein_deckel(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Unter 5 °C gilt ein höherer Wunsch weiter – der Frostschutz verdrängt ihn nicht."""
    from custom_components.raumklima.shared import domain_data

    _hub, room = await _setup(hass)
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    ctrl.target_temp = 21.0
    await _cool_down(hass)
    on, target, reason = ctrl.plan()
    assert on is True
    assert target == 21.0
    assert reason != "frost"


async def test_raum_frostschutz_hysterese(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    from custom_components.raumklima.shared import domain_data

    _hub, room = await _setup(hass, season_mode="pause", frost_floor=3)
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    await _cool_down(hass)
    assert ctrl.plan()[2] == "frost"
    await _cool_down(hass, (5.2,))
    assert ctrl.plan()[2] == "frost", "an der Grenze nicht sofort wieder aus"
    await _cool_down(hass, (5.6,))
    assert ctrl.plan()[2] != "frost"


async def test_nacht_frostschutz_bleibt_wohnungs_sicherung(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """„Frostschutz“ in der Nachtabsenkung hieß bis 1.1 die Sicherung der Wohnung (16 °C)."""
    from custom_components.raumklima.shared import domain_data

    hub, room = await _setup(hass, frost_floor=16, night_level="frost")
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    assert ctrl.hub.night_target(ctrl) == 16.0


async def test_switch_to_always_via_options(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Saisonwechsel über die Zentrale wirkt sofort auf die Entscheidung des Raums.

    Der physische Schreibvorgang hängt an Funk-Bestätigung und Preset-Kämpfen – das ist hier
    nicht der Prüfpunkt (und war als Zeitrennen die Ursache für sporadische rote Läufe).
    """
    from custom_components.raumklima.shared import domain_data

    hub, room = await _setup(hass, season_mode="pause")
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    allow, _target, reason = ctrl.plan()
    assert not allow
    assert reason == "season"

    hass.config_entries.async_update_entry(hub, options={**hub.options, "season_mode": "always"})
    await hass.async_block_till_done()

    allow, target, reason = ctrl.plan()
    assert allow, f"Raum bleibt bei {reason} statt zu heizen"
    assert reason != "season"
    assert target > 0


async def test_choices_skip_virtual_room_thermostats(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client
) -> None:
    """Der Assistent darf keine von Raumklima erzeugten Raum-Thermostate anbieten."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/config"})
    climate_ids = [item["id"] for item in (await client.receive_json())["result"]["choices"]["climate"]]
    assert "climate.bad" not in climate_ids
    assert "climate.trv_bad" in climate_ids


async def test_vacation_switch(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    await _setup(hass)
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": "switch.raumklima_allgemein_vacation"}, blocking=True
    )
    await hass.async_block_till_done()
    assert hass.states.get("switch.raumklima_allgemein_vacation").state == "on"


async def test_away_message_names_home_only_with_several_homes(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hub_cfg, _room = await _setup(hass)
    hub = hub_cfg.runtime_data
    assert hub._where() == ""
    second = MockConfigEntry(
        domain="raumklima", title="Wohnung B", unique_id="raumklima_home_b",
        data={"entry_type": "hub"}, options={"name": "Wohnung B", "season_mode": "always"},
    )
    second.add_to_hass(hass)
    assert await hass.config_entries.async_setup(second.entry_id)
    await hass.async_block_till_done()
    assert hub._where() == " in Allgemein"
    assert second.runtime_data._where() == " in Wohnung B"


async def test_unwetter_merker_ueberlebt_neustart(hass: HomeAssistant, trv: FakeTrv, sensors, hass_storage) -> None:
    """Sonst kam nach jedem Neustart dieselbe Unwetter-Warnung noch einmal."""
    hass_storage["raumklima.hub"] = {"version": 1, "key": "raumklima.hub", "data": {"storm_notified": "2026-11-14T18|gust"}}
    hub, _room = await _setup(hass)
    assert hub.runtime_data._storm_notified == "2026-11-14T18|gust"


async def test_sprachansage_nur_an_anwesende(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """„Nur wenn jemand zu Hause ist“ gilt auch für Sprachausgaben, nicht nur für Push."""
    from unittest.mock import AsyncMock

    hub, _room = await _setup(hass)
    h = hub.runtime_data
    h._async_send = AsyncMock()
    h.targets = lambda kind, how="push": ["notify.alexa"] if how == "tts" else ["notify.handy"]
    h.quiet_now = lambda: False
    import custom_components.raumklima.hub_notify as hn

    orig = hn.keep_present
    hn.keep_present = lambda targets, persons, only: [x for x in targets if x == "notify.handy"]
    try:
        await h.async_notify(next(iter(hn.PRESENT_ONLY_KINDS)), "Titel", "Text")
    finally:
        hn.keep_present = orig
    sent = [c.args[0] for c in h._async_send.await_args_list]
    assert sent == ["notify.handy"], f"Sprachausgabe trotz Filter: {sent}"
