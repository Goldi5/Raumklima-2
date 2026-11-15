"""Kühlen mit der Klimaanlage: Fenster, Ausschalten, Hysterese, Rückweg zum Heizen."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_COOL_SETPOINT, CONF_COOLING, CONF_HEAT_SOURCES
from custom_components.raumklima.room_extra_trvs import AcSource
from custom_components.raumklima.shared import domain_data

from .conftest import SENSOR, hub_entry, room_entry

AC = "climate.ac"


async def _setup(hass: HomeAssistant):
    hass.states.async_set(
        AC, "off", {"hvac_modes": ["heat", "cool", "off"], "min_temp": 16, "max_temp": 30, "target_temp_step": 0.5}
    )
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**{
        CONF_COOLING: True,
        CONF_COOL_SETPOINT: 26.0,
        CONF_HEAT_SOURCES: [{"id": "ac1", "entity": AC, "name": "AC", "type": "ac"}],
    })
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return domain_data(hass)["rooms"][room.entry_id]


async def _temp(hass: HomeAssistant, *values: float) -> None:
    for value in values:
        hass.states.async_set(SENSOR, str(value), {"device_class": "temperature", "unit_of_measurement": "°C"})
        await hass.async_block_till_done()


async def test_kuehlen_mit_hysterese(hass: HomeAssistant, trv, sensors) -> None:
    ctrl = await _setup(hass)
    assert ctrl.ac_sources
    await _temp(hass, 20.0, 22.0, 24.0, 26.5)
    assert ctrl.plan()[2] == "cool"
    await _temp(hass, 25.8)
    assert ctrl.plan()[2] == "cool", "knapp unter der Grenze weiter kühlen (Hysterese)"
    await _temp(hass, 24.9)
    assert ctrl.plan()[2] != "cool"


async def test_kein_kuehlen_bei_offenem_fenster_oder_aus(hass: HomeAssistant, trv, sensors) -> None:
    ctrl = await _setup(hass)
    await _temp(hass, 20.0, 22.0, 24.0, 26.5)
    ctrl.window_paused = True
    assert ctrl.plan()[2] != "cool"
    ctrl.window_paused = False
    ctrl.hvac_on = False
    assert ctrl.plan()[2] != "cool"


async def test_klimaanlage_wechselt_von_kuehlen_auf_heizen(hass: HomeAssistant, trv, sensors) -> None:
    ctrl = await _setup(hass)
    hass.states.async_set(AC, "cool", dict(hass.states.get(AC).attributes))
    ac = AcSource(ctrl, {"entity": AC, "name": "AC"})

    async def call(domain, service, data, blocking=False):
        if domain == "climate" and service == "set_hvac_mode":
            st = hass.states.get(data["entity_id"])
            hass.states.async_set(data["entity_id"], data["hvac_mode"], dict(st.attributes))

    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock(side_effect=call)):
        await ac.apply(True, 21.0)
    assert hass.states.get(AC).state == "heat"
