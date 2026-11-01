"""Mehrere Heizkörper im Raum: weitere Thermostate laufen mit."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant
import pytest

from .conftest import SENSOR, WINDOW, FakeTrv
from .test_features import _setup

TRV2 = "climate.trv_bad_2"


@pytest.fixture
def trv2(hass: HomeAssistant):
    fake = FakeTrv(hass, TRV2)
    fake.set(current_temperature=17.0, temperature=16.0)

    async def call(self, service: str, **data: Any) -> None:
        if self.entity_id == TRV2:
            await fake.call(service, **data)

    with patch("custom_components.raumklima.room_extra_trvs.ExtraTrv._call", call):
        yield fake


async def test_second_radiator_follows_target_and_off(hass: HomeAssistant, trv: FakeTrv, trv2: FakeTrv, sensors) -> None:
    _hub, room = await _setup(hass, extra_trvs=[TRV2])
    c = room.runtime_data
    assert len(c.extra_trvs) == 1
    assert trv2.setpoint == trv.setpoint == c.target_temp

    await hass.services.async_call("climate", "set_temperature", {"entity_id": "climate.bad", "temperature": 21.5}, blocking=True)
    await hass.async_block_till_done()
    assert trv.setpoint == trv2.setpoint == 21.5

    await hass.services.async_call("climate", "turn_off", {"entity_id": "climate.bad"}, blocking=True)
    await hass.async_block_till_done()
    assert trv.is_off and trv2.is_off


async def test_window_pauses_all_radiators(hass: HomeAssistant, trv: FakeTrv, trv2: FakeTrv, sensors, freezer) -> None:
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    _hub, room = await _setup(hass, extra_trvs=[TRV2])
    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    freezer.tick(timedelta(seconds=15))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert trv.is_off and trv2.is_off


async def test_target_compensation_per_radiator(hass: HomeAssistant, trv: FakeTrv, trv2: FakeTrv, sensors) -> None:
    hass.states.async_set(SENSOR, "20.0", {"unit_of_measurement": "°C", "device_class": "temperature"})
    trv.set(current_temperature=22.0)  # Haupt-Heizkörper misst 2 °C mehr
    trv2.set(current_temperature=20.0)  # zweiter misst wie der Raum
    _hub, room = await _setup(hass, extra_trvs=[TRV2], calibration_mode="target")
    c = room.runtime_data
    target = c.effective_target
    assert trv2.setpoint == pytest.approx(target, abs=0.5)
    assert trv.setpoint > trv2.setpoint  # jedes Thermostat bekommt seinen eigenen Ausgleich


async def test_extra_unavailable_is_reported_and_sync_combined(hass: HomeAssistant, trv: FakeTrv, trv2: FakeTrv, sensors) -> None:
    _hub, room = await _setup(hass, extra_trvs=[TRV2])
    c = room.runtime_data
    assert c.sync_state == "ok"
    hass.states.async_set(TRV2, "unavailable", {})
    await hass.async_block_till_done()
    issues = [i.code for i in c.health_issues(__import__("homeassistant.util.dt", fromlist=["utcnow"]).utcnow())]
    assert f"extra_trv_down:{TRV2}" in issues
    summary = c.settings_summary()["extra_trvs"][0]
    assert summary["entity_id"] == TRV2 and summary["available"] is False


async def test_main_trv_not_duplicated(hass: HomeAssistant, trv: FakeTrv, trv2: FakeTrv, sensors) -> None:
    _hub, room = await _setup(hass, extra_trvs=[TRV2, "climate.trv_bad"])
    assert [x.entity_id for x in room.runtime_data.extra_trvs] == [TRV2]
