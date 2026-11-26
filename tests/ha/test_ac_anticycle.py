"""Klimaanlage: Mindestlaufzeit und Mindestpause gegen Takten."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.const import CONF_AC_MIN_OFF, CONF_AC_MIN_ON
from custom_components.raumklima.room_extra_trvs import AcSource
from custom_components.raumklima.shared import domain_data

from .conftest import hub_entry, room_entry

AC = "climate.ac"


async def _setup_room(hass: HomeAssistant, **options):
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**options)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return room, domain_data(hass)["rooms"][room.entry_id]


def _ac(hass: HomeAssistant, ctrl):
    hass.states.async_set(
        AC,
        "off",
        {"hvac_modes": ["heat", "cool", "off"], "min_temp": 16, "max_temp": 30, "target_temp_step": 0.5},
    )
    return AcSource(ctrl, {"entity": AC, "name": "AC"})


async def test_min_on_prevents_immediate_off(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(
        hass, **{CONF_AC_MIN_ON: 60, CONF_AC_MIN_OFF: 60}
    )
    ac = _ac(hass, ctrl)

    async def call(domain, service, data, blocking=False):
        if domain == "climate" and service == "set_hvac_mode":
            st = hass.states.get(data["entity_id"])
            hass.states.async_set(data["entity_id"], data["hvac_mode"], dict(st.attributes))

    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock(side_effect=call)):
        await ac.apply(True, 22.0)
        assert ac._is_on()
        await ac.apply(False, 22.0)
        assert ac._is_on()  # Mindestlaufzeit läuft noch
        ac._last_change = dt_util.utcnow() - timedelta(hours=2)
        await ac.apply(False, 22.0)
        assert not ac._is_on()


async def test_min_off_prevents_immediate_restart(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(
        hass, **{CONF_AC_MIN_ON: 60, CONF_AC_MIN_OFF: 60}
    )
    ac = _ac(hass, ctrl)
    ac._last_change = dt_util.utcnow()

    async def call(domain, service, data, blocking=False):
        if domain == "climate" and service == "set_hvac_mode":
            st = hass.states.get(data["entity_id"])
            hass.states.async_set(data["entity_id"], data["hvac_mode"], dict(st.attributes))

    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock(side_effect=call)):
        await ac.apply(True, 22.0)
        assert not ac._is_on()  # Mindestpause läuft noch
        ac._last_change = dt_util.utcnow() - timedelta(hours=2)
        await ac.apply(True, 22.0)
        assert ac._is_on()


async def test_summary_has_anti_cycling_values(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(
        hass, **{CONF_AC_MIN_ON: 15, CONF_AC_MIN_OFF: 20}
    )
    ac = _ac(hass, ctrl)
    summary = ac.summary()
    assert summary["min_on"] == 15
    assert summary["min_off"] == 20
    assert "last_change" in summary and "on_since" in summary


async def test_sollwert_nur_bei_aenderung(hass: HomeAssistant, trv, sensors) -> None:
    """#95: kein set_temperature je Regelzyklus, wenn der Sollwert schon stimmt (Piepton an der Anlage)."""
    _room, ctrl = await _setup_room(hass)
    hass.states.async_set(
        AC, "heat",
        {"hvac_modes": ["heat", "cool", "off"], "min_temp": 16, "max_temp": 30, "target_temp_step": 1.0, "temperature": 22.0},
    )
    ac = AcSource(ctrl, {"entity": AC, "name": "AC"})
    calls = []

    async def call(domain, service, data, blocking=False):
        calls.append(service)

    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock(side_effect=call)):
        await ac.apply(True, 22.0)
        assert "set_temperature" not in calls
        await ac.apply(True, 24.0)
        assert calls.count("set_temperature") == 1


async def test_takt_schutz_uebersteht_neustart(hass: HomeAssistant, trv, sensors) -> None:
    _room, ctrl = await _setup_room(hass, **{CONF_AC_MIN_ON: 60, CONF_AC_MIN_OFF: 60})
    ac = _ac(hass, ctrl)
    ctrl.ac_sources = [ac]
    ac._last_change = dt_util.utcnow() - timedelta(minutes=10)
    data = ctrl._stored_data()
    assert AC in data["ac_last_change"]
    fresh = AcSource(ctrl, {"entity": AC, "name": "AC"})
    ctrl.ac_sources = [fresh]
    ctrl._load_stored(data)
    assert fresh._last_change is not None
    assert fresh._blocked(dt_util.utcnow(), True) is True  # Mindestpause läuft noch
