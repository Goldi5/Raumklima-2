"""Direkte Ventilsteuerung: number-Stellglied statt Sollwert am Thermostat."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_VALVE_CONTROL
from custom_components.raumklima.shared import domain_data

from .conftest import hub_entry, room_entry

NUM = "number.bad_valve_position"


async def _setup_room(hass: HomeAssistant, **options):
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**options)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return room, domain_data(hass)["rooms"][room.entry_id]


async def test_direct_valve_writes_opening(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass, **{CONF_VALVE_CONTROL: "on"})
    hass.states.async_set(NUM, "0", {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"})
    ctrl.valve_actuator = NUM
    ctrl.target_temp = 22.0
    hass.states.async_set(ctrl.temp_sensor, "19.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        await ctrl._apply()
    number_calls = [c for c in call.await_args_list if c.args[:2] == ("number", "set_value")]
    assert number_calls
    assert number_calls[-1].args[2]["entity_id"] == NUM
    assert number_calls[-1].args[2]["value"] == 100.0


async def test_direct_valve_closes_when_not_heating(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass, **{CONF_VALVE_CONTROL: "on"})
    hass.states.async_set(NUM, "50", {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"})
    ctrl.valve_actuator = NUM
    ctrl.hvac_on = False
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        await ctrl._apply()
    number_calls = [c for c in call.await_args_list if c.args[:2] == ("number", "set_value")]
    assert number_calls and number_calls[-1].args[2]["value"] == 0.0


async def test_setpoint_mode_does_not_write_valve(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass, **{CONF_VALVE_CONTROL: "off"})
    hass.states.async_set(NUM, "0", {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"})
    ctrl.valve_actuator = NUM
    ctrl.target_temp = 22.0
    hass.states.async_set(ctrl.temp_sensor, "19.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        await ctrl._apply()
    assert not [c for c in call.await_args_list if c.args[:2] == ("number", "set_value")]


async def test_valve_summary_reports_direct_state(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass, **{CONF_VALVE_CONTROL: "auto"})
    hass.states.async_set(NUM, "0", {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"})
    ctrl.valve_actuator = NUM
    ctrl.target_temp = 22.0
    hass.states.async_set(ctrl.temp_sensor, "19.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()
    summary = ctrl.valve_summary()
    assert summary["mode"] == "auto"
    assert summary["actuator"] == NUM
    assert summary["direct"] is True
    assert summary["opening"] == 100.0
