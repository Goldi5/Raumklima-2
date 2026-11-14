"""Fußbodenheizung: begrenzter Sollwert, Trägheit, Vor-/Rücklauf."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import (
    CONF_FLOOR_BAND,
    CONF_FLOOR_CYCLE_MIN,
    CONF_FLOOR_HEATING,
    CONF_FLOOR_MAX_TEMP,
    CONF_FLOOR_MIN_TEMP,
    CONF_FLOOR_RETURN,
    CONF_FLOOR_SUPPLY,
)
from custom_components.raumklima.room_floor import STATE_NO_SENSORS, STATE_OK
from custom_components.raumklima.shared import domain_data

from .conftest import hub_entry, room_entry

SUPPLY = "sensor.bad_vorlauf"
RETURN = "sensor.bad_ruecklauf"


async def _setup_room(hass: HomeAssistant, **options):
    for entity_id, value in ((SUPPLY, "45.0"), (RETURN, "35.0")):
        hass.states.async_set(
            entity_id, value, {"unit_of_measurement": "°C", "device_class": "temperature"}
        )
    hub = hub_entry()
    hub.add_to_hass(hass)
    opts = {
        CONF_FLOOR_HEATING: True,
        CONF_FLOOR_SUPPLY: SUPPLY,
        CONF_FLOOR_RETURN: RETURN,
        CONF_FLOOR_MAX_TEMP: 27.0,
        CONF_FLOOR_MIN_TEMP: 18.0,
        CONF_FLOOR_BAND: 1.0,
        CONF_FLOOR_CYCLE_MIN: 30,
    }
    opts.update(options)
    room = room_entry(**opts)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return room, domain_data(hass)["rooms"][room.entry_id]


async def test_floor_clamps_setpoint_and_holds_within_cycle(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass)
    assert ctrl.floor_mode
    assert ctrl.floor_target(30.0) == 27.0
    assert ctrl.floor_target(10.0) == 18.0
    ctrl._floor_last_setpoint = None
    ctrl._floor_last_change = None
    assert ctrl.floor_setpoint(30.0) == 27.0
    ctrl._floor_last_setpoint = None
    ctrl._floor_last_change = None
    assert ctrl.floor_setpoint(22.0) == 22.0
    # Innerhalb des Takts bleibt der alte Sollwert stehen – Trägheit.
    assert ctrl.floor_setpoint(24.0) == 22.0


async def test_floor_summary_reports_flow_and_delta(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass)
    summary = ctrl.floor_summary()
    assert summary["enabled"] is True
    assert summary["supply"] == 45.0
    assert summary["return"] == 35.0
    assert summary["delta"] == 10.0
    assert summary["flow_ok"] is True
    assert summary["state"] == STATE_OK


async def test_floor_summary_without_sensors(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(
        hass,
        **{CONF_FLOOR_SUPPLY: "", CONF_FLOOR_RETURN: ""},
    )
    summary = ctrl.floor_summary()
    assert summary["delta"] is None
    assert summary["state"] == STATE_NO_SENSORS
