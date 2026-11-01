"""Lichtsignal pro Raum und Lüft-Countdown auf dem Sperrbildschirm."""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import async_mock_service
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.raumklima import room_lights
from custom_components.raumklima.live_activity import live_payload
from custom_components.raumklima.room_lights import restore_data, signal_for

from .conftest import WINDOW, FakeTrv
from .test_features import _setup

LAMP = "light.bad_spiegel"
PHONE = "notify.mobile_app_antje"


@pytest.fixture(autouse=True)
def fast_blink():
    with (
        patch.object(room_lights, "ON_SECONDS", 0),
        patch.object(room_lights, "OFF_SECONDS", 0),
        patch("custom_components.raumklima.hub.RaumklimaHub.quiet_now", return_value=False),
    ):
        yield


def _lamp(hass: HomeAssistant, on: bool = True) -> None:
    attrs = {"supported_color_modes": ["color_temp", "hs"], "friendly_name": "Spiegel"}
    if on:
        attrs |= {"color_mode": "color_temp", "brightness": 120, "color_temp_kelvin": 2700}
    hass.states.async_set(LAMP, "on" if on else "off", attrs)


async def _wait(hass: HomeAssistant, room) -> None:
    task = room.runtime_data.lights._task
    if task is not None:
        await task
    await hass.async_block_till_done()


# ------------------------------------------------------------------ reine Logik
def test_signal_for_events() -> None:
    assert signal_for("ventilation", {"state": "please_open"}) == "open"
    assert signal_for("ventilation", {"state": "too_cold"}) == "close"
    assert signal_for("ventilation", {"state": "done"}) == "done"
    assert signal_for("ventilation", {"state": "airing"}) is None
    assert signal_for("health", {"state": "problem"}) == "problem"
    assert signal_for("window", {"state": "open"}) is None


def test_live_payload_countdown_and_updates() -> None:
    first = live_payload("Bad", "airing", 5, 300, True, "/raumklima")
    assert first["title"] == "Lüften · Bad"
    assert first["data"]["live_update"] is True
    assert first["data"]["chronometer"] is True and first["data"]["when"] == 300
    assert first["data"]["url"] == "/raumklima"
    assert "silent" not in first["data"]
    later = live_payload("Bad", "please_close", 5, 0, False, None)
    assert "chronometer" not in later["data"]
    assert later["data"]["silent"] is True
    assert "schließen" in later["message"]


# ------------------------------------------------------------------ Lichtsignal
async def test_light_blinks_blue_and_restores(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _lamp(hass)
    on = async_mock_service(hass, "light", "turn_on")
    off = async_mock_service(hass, "light", "turn_off")
    _hub, room = await _setup(hass, signal_lights=[LAMP])
    room.runtime_data.fire_event("ventilation", {"state": "please_open"})
    await _wait(hass, room)
    assert on[0].data["rgb_color"] == [0, 90, 255]
    assert len(off) == 2  # zwischen den drei Blinkern
    # zurück auf warmweiß mit alter Helligkeit
    assert on[-1].data == {"entity_id": LAMP, "brightness": 120, "color_temp_kelvin": 2700}


async def test_light_that_was_off_stays_off(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _lamp(hass, on=False)
    async_mock_service(hass, "light", "turn_on")
    off = async_mock_service(hass, "light", "turn_off")
    _hub, room = await _setup(hass, signal_lights=[LAMP])
    room.runtime_data.fire_event("ventilation", {"state": "please_close"})
    await _wait(hass, room)
    assert off[-1].data == {"entity_id": LAMP}


async def test_light_only_for_chosen_signals_and_not_in_quiet_time(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    _lamp(hass)
    on = async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "light", "turn_off")
    _hub, room = await _setup(hass, signal_lights=[LAMP])
    room.runtime_data.fire_event("ventilation", {"state": "done"})  # „fertig“ ist standardmäßig aus
    await _wait(hass, room)
    assert on == []
    with patch("custom_components.raumklima.hub.RaumklimaHub.quiet_now", return_value=True):
        room.runtime_data.fire_event("ventilation", {"state": "please_open"})
    await _wait(hass, room)
    assert on == []


def test_restore_data_for_colour_light() -> None:
    from homeassistant.core import State

    st = State(LAMP, "on", {"color_mode": "hs", "brightness": 80, "hs_color": (30.0, 60.0)})
    assert restore_data(st) == {"brightness": 80, "hs_color": [30.0, 60.0]}
    assert restore_data(State(LAMP, "off")) is None


async def test_websocket_lights_live_and_test(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _lamp(hass)
    on = async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "light", "turn_off")
    _hub, room = await _setup(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "raumklima/room/light_test", "entry_id": room.entry_id})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "no_lights"

    await client.send_json_auto_id(
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"signal_lights": [LAMP], "light_signals": ["open", "done"]}}
    )
    msg = await client.receive_json()
    assert msg["result"] == {"ok": True, "reloaded": False}
    assert room.runtime_data.lights.signals == ["open", "done"]

    await client.send_json_auto_id({"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"signal_lights": ["switch.x"]}})
    msg = await client.receive_json()
    assert not msg["success"]

    await client.send_json_auto_id({"type": "raumklima/room/light_test", "entry_id": room.entry_id})
    msg = await client.receive_json()
    assert msg["success"]
    await _wait(hass, room)
    assert on[0].data["rgb_color"] == [0, 90, 255]


# ------------------------------------------------------------------ Live-Aktivität
async def test_live_countdown_starts_and_ends(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_antje")
    _hub, room = await _setup(hass, {"recipients": {PHONE: ["live"]}})
    vent = room.runtime_data.vent

    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    vent.update()
    await hass.async_block_till_done()
    assert vent.state == "airing"
    live = [c for c in calls if c.data.get("data", {}).get("live_update")]
    assert live, calls
    data = live[0].data["data"]
    assert data["tag"] == f"raumklima_live_{room.entry_id}"
    assert data["chronometer"] is True and data["when"] > 0

    hass.states.async_set(WINDOW, "off", {"device_class": "window"})
    await hass.async_block_till_done()
    vent.update()
    await hass.async_block_till_done()
    assert calls[-1].data == {"message": "clear_notification", "data": {"tag": f"raumklima_live_{room.entry_id}"}}


async def test_live_countdown_only_when_chosen(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_antje")
    _hub, room = await _setup(hass, {"recipients": {PHONE: ["vent_open"]}})
    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    room.runtime_data.vent.update()
    await hass.async_block_till_done()
    assert not [c for c in calls if c.data.get("data", {}).get("live_update")]
