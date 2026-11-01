"""Präsenzmelder: leeren Raum absenken, „jemand zu Hause“, Lichtsignal nur bei Anwesenheit."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .conftest import FakeTrv
from .test_features import _setup

RADAR = "binary_sensor.wohnen_praesenz"
PIR = "binary_sensor.wohnen_bewegung"


def _radar(hass: HomeAssistant, on: bool) -> None:
    hass.states.async_set(RADAR, "on" if on else "off", {"device_class": "occupancy"})


def _pir(hass: HomeAssistant, on: bool) -> None:
    hass.states.async_set(PIR, "on" if on else "off", {"device_class": "motion"})


async def _later(hass: HomeAssistant, freezer, minutes: float) -> None:
    freezer.tick(timedelta(minutes=minutes))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()


async def test_empty_room_is_lowered_and_comes_back(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    _radar(hass, True)
    _hub, room = await _setup(hass, room_type="living", presence_sensors=[RADAR])
    c = room.runtime_data
    wish = c.target_temp
    assert c.occupied is True
    assert trv.setpoint == wish

    _radar(hass, False)
    await hass.async_block_till_done()
    await _later(hass, freezer, 4)  # Nachlauf mmWave (3 min) vorbei
    assert c.occupied is False
    assert trv.setpoint == wish  # Wartezeit (30 min) läuft noch

    await _later(hass, freezer, 31)
    on, target, reason = c.plan()
    assert reason == "room_empty"
    assert target == wish - 1.5
    assert trv.setpoint == wish - 1.5
    assert hass.states.get("climate.bad").attributes["room_eco"] is True

    _radar(hass, True)  # jemand kommt rein → sofort zurück
    await hass.async_block_till_done()
    assert c.plan()[2] == "normal"
    assert trv.setpoint == wish


async def test_pir_only_does_not_lower_automatically(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    _pir(hass, False)
    _hub, room = await _setup(hass, room_type="living", presence_sensors=[PIR])
    c = room.runtime_data
    await _later(hass, freezer, 25)
    assert c.occupied is False
    await _later(hass, freezer, 40)
    assert c.plan()[2] == "normal"  # „Automatisch“: nur mit mmWave
    assert c.settings_summary()["presence_sensors"] == {PIR: "pir"}


async def test_pir_switched_on_lowers_after_long_hold(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    _pir(hass, True)
    _hub, room = await _setup(hass, room_type="bedroom", presence_sensors=[PIR], room_eco="on", room_eco_after=10)
    c = room.runtime_data
    _pir(hass, False)
    await hass.async_block_till_done()
    await _later(hass, freezer, 15)
    assert c.occupied is True  # PIR: 20 min Nachlauf
    await _later(hass, freezer, 16)  # 31 min: seit 11 min leer
    assert c.plan()[2] == "room_empty"


async def test_radar_keeps_home_occupied(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    hass.states.async_set("zone.home", "0", {"latitude": 52.5, "longitude": 13.4, "radius": 100})
    hass.states.async_set("person.antje", "not_home", {"device_trackers": []})
    _radar(hass, True)
    hub, _room = await _setup(
        hass, {"residents": ["person.antje"], "zone": "zone.home", "away_delay": 10}, room_type="living", presence_sensors=[RADAR]
    )
    h = hub.runtime_data
    await _later(hass, freezer, 30)
    assert h.stage == "home"
    assert h.sensed == ["Bad"]
    assert not h.nobody_home

    _radar(hass, False)
    await hass.async_block_till_done()
    await _later(hass, freezer, 20)
    assert h.sensed == []
    assert h.stage == "away_short"


async def test_pir_does_not_count_for_home_by_default(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    hass.states.async_set("zone.home", "0", {"latitude": 52.5, "longitude": 13.4, "radius": 100})
    hass.states.async_set("person.antje", "not_home", {"device_trackers": []})
    _pir(hass, True)
    hub, _room = await _setup(hass, {"residents": ["person.antje"], "zone": "zone.home", "away_delay": 10}, presence_sensors=[PIR])
    h = hub.runtime_data
    await _later(hass, freezer, 15)
    assert h.sensed == []
    assert h.stage == "away_short"
    hass.config_entries.async_update_entry(hub, options={**hub.options, "home_sensors": "all"})
    await hass.async_block_till_done()
    await _later(hass, freezer, 1)
    assert hub.runtime_data.sensed == ["Bad"]


async def test_vacation_ignores_sensors(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    hass.states.async_set("zone.home", "0", {"latitude": 52.5, "longitude": 13.4, "radius": 100})
    hass.states.async_set("person.antje", "not_home", {"device_trackers": []})
    _radar(hass, True)
    hub, _room = await _setup(hass, {"residents": ["person.antje"], "zone": "zone.home"}, presence_sensors=[RADAR])
    h = hub.runtime_data
    h.set_vacation(True)
    await hass.async_block_till_done()
    assert h.stage == "away_long"
    assert h.vacation is True  # Katze vor dem Radar beendet den Urlaub nicht


async def test_websocket_presence_live(hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator) -> None:
    _radar(hass, True)
    _hub, room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"presence_sensors": [RADAR], "room_eco_drop": 2}}
    )
    msg = await client.receive_json()
    assert msg["result"] == {"ok": True, "reloaded": False}
    c = room.runtime_data
    assert c.occupied is True and c.room_eco_drop == 2
    await client.send_json_auto_id({"type": "raumklima/config"})
    msg = await client.receive_json()
    assert {"id": RADAR, "name": msg["result"]["choices"]["presence"][0]["name"], "kind": "mmwave"} in msg["result"]["choices"]["presence"]
