"""Bettzeit aus dem Präsenzmelder im Schlafzimmer."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv


def _at(hour: int, minute: int = 0):
    """Ortszeit heute um die Uhrzeit."""
    return dt_util.now().replace(hour=hour, minute=minute, second=0, microsecond=0)


async def test_belegtes_schlafzimmer_ergibt_bettzeit(
    hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch
) -> None:
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data

    ctrl.config["room_type"] = "bedroom"
    monkeypatch.setattr(type(ctrl), "presence_sensors", property(lambda self: ["binary_sensor.praesenz"]))
    monkeypatch.setattr(type(ctrl), "occupied", property(lambda self: True))

    now = _at(22, 30)
    monkeypatch.setattr("custom_components.raumklima.hub_sleep.dt_util.now", lambda: now)
    hub._presence_bed_since = {room.entry_id: now - timedelta(minutes=25)}

    hub._check_presence_sleep()

    assert hub.signals.asleep is True
    assert hub.signals.bed_at is not None


async def test_kurze_belegung_reicht_nicht(
    hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch
) -> None:
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data

    ctrl.config["room_type"] = "bedroom"
    monkeypatch.setattr(type(ctrl), "presence_sensors", property(lambda self: ["binary_sensor.praesenz"]))
    monkeypatch.setattr(type(ctrl), "occupied", property(lambda self: True))

    now = _at(22, 30)
    monkeypatch.setattr("custom_components.raumklima.hub_sleep.dt_util.now", lambda: now)
    hub._presence_bed_since = {room.entry_id: now - timedelta(minutes=5)}

    hub._check_presence_sleep()

    assert hub.signals.asleep is False


async def test_tagsueber_keine_bettzeit(hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch) -> None:
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data

    ctrl.config["room_type"] = "bedroom"
    monkeypatch.setattr(type(ctrl), "presence_sensors", property(lambda self: ["binary_sensor.praesenz"]))
    monkeypatch.setattr(type(ctrl), "occupied", property(lambda self: True))

    now = _at(14, 0)
    monkeypatch.setattr("custom_components.raumklima.hub_sleep.dt_util.now", lambda: now)
    hub._presence_bed_since = {room.entry_id: now - timedelta(minutes=60)}

    hub._check_presence_sleep()

    assert hub.signals.asleep is False
    assert hub._presence_bed_since == {}


async def test_wohnzimmer_zaehlt_nicht(hass: HomeAssistant, setup, trv: FakeTrv, monkeypatch) -> None:
    """Nur Räume vom Typ Schlafzimmer lösen die Bettzeit aus."""
    hub_entry, room = setup
    ctrl = domain_data(hass)["rooms"][room.entry_id]
    hub = hub_entry.runtime_data

    ctrl.config["room_type"] = "living"
    monkeypatch.setattr(type(ctrl), "presence_sensors", property(lambda self: ["binary_sensor.praesenz"]))
    monkeypatch.setattr(type(ctrl), "occupied", property(lambda self: True))

    now = _at(22, 30)
    monkeypatch.setattr("custom_components.raumklima.hub_sleep.dt_util.now", lambda: now)
    hub._presence_bed_since = {room.entry_id: now - timedelta(minutes=60)}

    hub._check_presence_sleep()

    assert hub.signals.asleep is False
