"""Einrichtungsassistent: erster Raum legt die Zentrale mit an."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.raumklima.const import CONF_ENTRY_TYPE, DOMAIN, ENTRY_HUB

from .conftest import SENSOR, TRV, WINDOW, FakeTrv


async def test_first_room_creates_hub(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": TRV})
    assert result["step_id"] == "devices"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bad", "temperature_sensor": SENSOR, "window_sensors": [WINDOW]}
    )
    assert result["step_id"] == "room"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"room_type": "bathroom", "advanced": {"calibration_mode": "target", "off_method": "auto", "on_preset": "auto_detect",
                                               "window_open_delay": 10, "window_close_delay": 10, "follow_trv_changes": True}},
    )
    assert result["step_id"] == "hub"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"building_type": "renovated"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Bad"
    await hass.async_block_till_done()

    entries = hass.config_entries.async_entries(DOMAIN)
    assert len(entries) == 2
    assert sum(1 for e in entries if e.data.get(CONF_ENTRY_TYPE) == ENTRY_HUB) == 1


async def test_same_trv_twice_aborts(hass: HomeAssistant, setup) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": TRV})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"



async def test_extra_thermostat_cannot_be_main(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    hass.states.async_set("climate.trv_bad_2", "heat", {})
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"trv": TRV})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bad", "temperature_sensor": SENSOR, "extra_trvs": [TRV]}
    )
    assert result["errors"] == {"extra_trvs": "extra_is_main"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bad", "temperature_sensor": SENSOR, "extra_trvs": ["climate.trv_bad_2"]}
    )
    assert result["step_id"] == "room"
