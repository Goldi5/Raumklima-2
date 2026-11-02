"""Zentrale: Heizsaison, Frostschutz, Optionen."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

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


async def test_switch_to_always_via_options(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hub, _room = await _setup(hass, season_mode="pause")
    assert trv.is_off
    hass.config_entries.async_update_entry(hub, options={**hub.options, "season_mode": "always"})
    await hass.async_block_till_done()
    # Der Raum wendet die neue Saison verzögert an (Timer/Debounce). Die Zeit in
    # Ein-Sekunden-Schritten vorstellen, bis das Thermostat schaltet – sonst hängt der
    # Test von der Rechner-Geschwindigkeit ab (CI-Flake).
    base = dt_util.utcnow()
    for step in range(1, 121):
        if not trv.is_off:
            break
        async_fire_time_changed(hass, base + timedelta(seconds=step))
        await hass.async_block_till_done()
    assert not trv.is_off


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
        domain="raumklima", title="Remscheid", unique_id="raumklima_home_remscheid",
        data={"entry_type": "hub"}, options={"name": "Remscheid", "season_mode": "always"},
    )
    second.add_to_hass(hass)
    assert await hass.config_entries.async_setup(second.entry_id)
    await hass.async_block_till_done()
    assert hub._where() == " in Allgemein"
    assert second.runtime_data._where() == " in Remscheid"
