"""Klimaanlage als Wärmequelle: nur wenn COP und Gaspreis günstiger sind."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import (
    CONF_AC_COP,
    CONF_AC_HEAT,
    CONF_ENERGY_PRICE,
    CONF_GAS_PRICE,
)
from custom_components.raumklima.room_extra_trvs import AcSource
from custom_components.raumklima.shared import domain_data, get_hub

from .conftest import hub_entry, room_entry

AC = "climate.ac"


async def _setup(hass: HomeAssistant, **options):
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**options)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return get_hub(hass), domain_data(hass)["rooms"][room.entry_id]


def _ac(ctrl, hass: HomeAssistant):
    hass.states.async_set(
        AC, "off",
        {"hvac_modes": ["heat", "cool", "off"], "min_temp": 16, "max_temp": 30, "target_temp_step": 0.5},
    )
    return AcSource(ctrl, {"entity": AC, "name": "AC"})


async def test_ac_heat_only_when_cheaper(hass: HomeAssistant, trv, sensors) -> None:
    hub, ctrl = await _setup(hass, **{CONF_AC_HEAT: True})
    hub.config[CONF_ENERGY_PRICE] = 0.15
    hub.config[CONF_GAS_PRICE] = 0.10
    hub.config[CONF_AC_COP] = 3.0
    ac = _ac(ctrl, hass)
    ctrl.ac_sources = [ac]
    assert ctrl.ac_heat_active is True

    async def call(domain, service, data, blocking=False):
        if domain == "climate" and service == "set_hvac_mode":
            st = hass.states.get(data["entity_id"])
            hass.states.async_set(data["entity_id"], data["hvac_mode"], dict(st.attributes))

    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock(side_effect=call)):
        await ctrl._apply()
    assert ac._is_on()
    assert trv.is_off


async def test_ac_heat_off_when_gas_cheaper(hass: HomeAssistant, trv, sensors) -> None:
    hub, ctrl = await _setup(hass, **{CONF_AC_HEAT: True})
    hub.config[CONF_ENERGY_PRICE] = 0.15
    hub.config[CONF_GAS_PRICE] = 0.04
    hub.config[CONF_AC_COP] = 3.0
    ac = _ac(ctrl, hass)
    ctrl.ac_sources = [ac]
    assert ctrl.ac_heat_active is False
    assert hub.ac_heat_cheaper() is False
