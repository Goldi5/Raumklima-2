"""Raum mit simuliertem Thermostat: Regeln, Fenster, Bedienung, Neuladen."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.raumklima.const import DOMAIN

from .conftest import SENSOR, WINDOW, FakeTrv


async def advance(hass: HomeAssistant, seconds: float) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))
    await hass.async_block_till_done()


async def test_setup_creates_entities_and_sends_target(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hub, room = setup
    assert hub.state is ConfigEntryState.LOADED
    assert room.state is ConfigEntryState.LOADED
    state = hass.states.get("climate.bad")
    assert state is not None
    # Erster Start: Wunschtemperatur des Raumtyps Bad (22 °C) statt 18 °C vom Thermostat
    assert state.attributes["temperature"] == 22.0
    assert trv.setpoint == 22.0


async def test_set_temperature_from_ha(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": "climate.bad", "temperature": 20.5}, blocking=True
    )
    await hass.async_block_till_done()
    assert trv.setpoint == 20.5
    assert hass.states.get("climate.bad").attributes["temperature"] == 20.5


async def test_window_pauses_and_resumes(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    assert not trv.is_off  # Verzögerung 10 s läuft noch
    await advance(hass, 11)
    assert trv.is_off
    assert hass.states.get("climate.bad").attributes.get("hvac_action") == "off"

    hass.states.async_set(WINDOW, "off", {"device_class": "window"})
    await hass.async_block_till_done()
    await advance(hass, 11)
    assert not trv.is_off
    assert trv.setpoint == 22.0


async def test_short_window_blip_is_ignored(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hass.states.async_set(WINDOW, "on")
    await hass.async_block_till_done()
    await advance(hass, 3)
    hass.states.async_set(WINDOW, "off")
    await hass.async_block_till_done()
    await advance(hass, 20)
    assert not any(c == ("set_preset_mode", {"preset_mode": "off"}) for c in trv.calls)


async def test_window_contact_unavailable_keeps_last_state(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    hass.states.async_set(WINDOW, "unavailable")
    await hass.async_block_till_done()
    await advance(hass, 20)
    assert not trv.is_off


async def test_manual_change_at_trv_is_followed(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    trv.set(temperature=19.0)
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["temperature"] == 19.0


async def test_eco_comfort_flip_does_not_fight(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Tuya springt selbst zwischen eco und comfort – nicht zurückstellen (0.8.5)."""
    before = len(trv.calls)
    for preset in ("comfort", "eco", "comfort", "eco"):
        trv.set(preset_mode=preset)
        await hass.async_block_till_done()
    preset_calls = [c for c in trv.calls[before:] if c[0] == "set_preset_mode"]
    assert preset_calls == []


async def test_lost_command_is_repeated(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    trv.connected = False
    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": "climate.bad", "temperature": 21.0}, blocking=True
    )
    assert trv.setpoint == 22.0
    trv.connected = True
    await advance(hass, 25)
    assert trv.setpoint == 21.0


async def test_turn_off_and_on(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    await hass.services.async_call("climate", "turn_off", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()
    assert trv.is_off
    assert hass.states.get("climate.bad").state == "off"
    await hass.services.async_call("climate", "turn_on", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()
    assert not trv.is_off


async def test_unload_stops_all_timers(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    hass.states.async_set(WINDOW, "on")
    await hass.async_block_till_done()
    assert await hass.config_entries.async_unload(room.entry_id)
    await hass.async_block_till_done()
    calls = len(trv.calls)
    await advance(hass, 3600)
    assert len(trv.calls) == calls  # nach dem Entladen wird nichts mehr gesendet


async def test_sensor_outlier_is_ignored(hass: HomeAssistant, setup) -> None:
    hass.states.async_set(SENSOR, "30.0")
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["current_temperature"] == 19.0
    hass.states.async_set(SENSOR, "30.1")  # bestätigt → übernehmen
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes["current_temperature"] == 30.1


async def test_diagnostics(hass: HomeAssistant, setup) -> None:
    from custom_components.raumklima.diagnostics import async_get_config_entry_diagnostics

    hub, room = setup
    data = await async_get_config_entry_diagnostics(hass, room)
    assert data["trv_available"] is True
    hub_data = await async_get_config_entry_diagnostics(hass, hub)
    assert "decision_log" in hub_data
    assert hass.data[DOMAIN]["rooms"][room.entry_id].name == "Bad"
