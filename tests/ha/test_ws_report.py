"""WebSocket-Befehle für Protokoll, Spur und Diagnose."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.raumklima.shared import get_hub

from .conftest import FakeTrv
from .test_features import _setup


async def test_protokoll_live_abonnieren(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/log/subscribe"})
    res = await client.receive_json()
    assert res["success"], res
    get_hub(hass, None).log.add("settings", "Testeintrag", "aus dem Test")
    event = await client.receive_json()
    assert event["type"] == "event"
    assert event["event"]["msg"] == "Testeintrag"


async def test_spur_aufnehmen_und_lesen(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/trace", "event": "test:klick", "data": {"x": 1}})
    assert (await client.receive_json())["success"]
    await client.send_json_auto_id({"type": "raumklima/trace/list"})
    res = await client.receive_json()
    assert res["success"], res
    assert any("test:klick" in str(item) for item in res["result"]["items"])


async def test_diagnose_ueber_die_karte(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/diagnostics"})
    res = await client.receive_json()
    assert res["success"], res
    assert isinstance(res["result"], dict) and res["result"]


async def test_protokoll_mehrere_raeume(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _hub, room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/log", "entry_ids": [room.entry_id, "anderer"]})
    res = await client.receive_json()
    assert res["success"], res
    assert all(e.get("eid") in (room.entry_id, "anderer", None) for e in res["result"]["entries"])
    assert res["result"]["categories"]
