"""WebSocket-Schnittstelle der Karte."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import DOMAIN

from .conftest import FakeTrv


async def test_config(hass: HomeAssistant, setup, hass_ws_client) -> None:
    hub, room = setup
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/config"})
    msg = await client.receive_json()
    assert msg["success"]
    result = msg["result"]
    assert result["hub"]["entry_id"] == hub.entry_id
    assert [r["entry_id"] for r in result["rooms"]] == [room.entry_id]
    assert result["admin"] is True


async def test_room_update_live_without_reload(hass: HomeAssistant, setup, hass_ws_client, trv: FakeTrv) -> None:
    _hub, room = setup
    controller = hass.data[DOMAIN]["rooms"][room.entry_id]
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"setback_short": 17.5, "window_open_delay": 30}}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["reloaded"] is False
    assert hass.data[DOMAIN]["rooms"][room.entry_id] is controller  # derselbe Raum, kein Neustart
    assert controller.setback_short == 17.5
    assert controller.config["window_open_delay"] == 30
    assert room.options["setback_short"] == 17.5


async def test_room_update_room_type_reloads(hass: HomeAssistant, setup, hass_ws_client) -> None:
    _hub, room = setup
    controller = hass.data[DOMAIN]["rooms"][room.entry_id]
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"room_type": "living"}}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["reloaded"] is True
    await hass.async_block_till_done()
    assert hass.data[DOMAIN]["rooms"][room.entry_id] is not controller


async def test_room_update_invalid(hass: HomeAssistant, setup, hass_ws_client) -> None:
    _hub, room = setup
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"setback_short": 99}}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid"


async def test_hub_update_and_log(hass: HomeAssistant, setup, hass_ws_client) -> None:
    hub, _room = setup
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/hub/update", "changes": {"heating_limit": 14}})
    msg = await client.receive_json()
    assert msg["success"], msg
    await hass.async_block_till_done()
    assert hub.options["heating_limit"] == 14

    await client.send_json_auto_id({"type": "raumklima/log", "limit": 50})
    msg = await client.receive_json()
    assert msg["success"]
    titles = [e["msg"] for e in msg["result"]["entries"]]
    assert "Einstellungen geändert" in titles


async def test_hub_action_heat_today(hass: HomeAssistant, setup, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/hub/action", "action": "heat_today"})
    msg = await client.receive_json()
    assert msg["success"]
    assert hass.data[DOMAIN]["hub"].heat_today_until is not None


async def test_report(hass: HomeAssistant, setup, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/report"})
    msg = await client.receive_json()
    assert msg["success"]
    assert "issues" in msg["result"]


async def test_no_hub_error(hass: HomeAssistant, hass_ws_client) -> None:
    from custom_components.raumklima.websocket_api import async_register_websocket

    async_register_websocket(hass)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/report"})
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "no_hub"

async def test_password_never_in_log(hass: HomeAssistant, setup, hass_ws_client) -> None:
    _hub, _room = setup
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "raumklima/hub/update", "changes": {"mail_password": "Geheim-123,x", "mail_port": 587}}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    await hass.async_block_till_done()
    await client.send_json_auto_id({"type": "raumklima/log", "limit": 50})
    msg = await client.receive_json()
    text = str(msg["result"]["entries"])
    assert "Geheim-123" not in text
    assert "mail_password: gesetzt" in text


def test_scrub_old_entries() -> None:
    from custom_components.raumklima.decision_log import scrub

    old = "mail_password: None → ab,c.9, mail_port: None → 587"
    assert scrub(old) == "mail_password: geändert, mail_port: None → 587"
    assert scrub("x: 1 → 2") == "x: 1 → 2"
