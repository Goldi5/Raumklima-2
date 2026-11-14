"""Wärmeanforderung: Summe über die Räume und Vorlauf-Empfehlung."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.shared import domain_data, get_hub

from .conftest import hub_entry, room_entry


async def _setup(hass: HomeAssistant):
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry()
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return get_hub(hass), domain_data(hass)["rooms"][room.entry_id]


async def test_heat_demand_aggregates_deficit(hass: HomeAssistant, trv, sensors) -> None:
    hub, ctrl = await _setup(hass)
    ctrl.hvac_on = True
    ctrl.target_temp = 22.0
    ctrl._ext_value = 19.0
    await hass.async_block_till_done()
    h = hub.heat_summary()
    assert h["active"] is True
    assert h["rooms_heating"] == 1
    assert h["sum_deficit"] == 3.0
    assert h["flow_target"] == 50.0
    assert hub.summary()["heat"]["active"] is True


async def test_no_heat_demand_when_all_rooms_are_warm(hass: HomeAssistant, trv, sensors) -> None:
    hub, ctrl = await _setup(hass)
    ctrl.hvac_on = True
    ctrl.target_temp = 20.0
    ctrl._ext_value = 22.0
    await hass.async_block_till_done()
    h = hub.heat_summary()
    assert h["active"] is False
    assert h["flow_target"] is None
