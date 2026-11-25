"""WebSocket-Befehle eines Raums: Boost, Ändern, Darstellung, Fortsetzen, Zurücksetzen, Löschen."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .conftest import FakeTrv
from .test_features import _setup


async def _ws(client, msg: dict) -> dict:
    await client.send_json_auto_id(msg)
    return await client.receive_json()


async def test_boost_minuten_unbegrenzt_und_aus(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _hub, room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)

    res = await _ws(client, {"type": "raumklima/boost", "entry_id": room.entry_id, "mode": "minutes", "minutes": 30})
    assert res["success"], res
    assert res["result"]["boost_active"] is True
    assert res["result"]["boost_until"] is not None
    assert res["result"]["boost_open"] is False

    res = await _ws(client, {"type": "raumklima/boost", "entry_id": room.entry_id, "mode": "unlimited"})
    assert res["result"]["boost_open"] is True
    assert res["result"]["boost_active"] is True

    res = await _ws(client, {"type": "raumklima/boost", "entry_id": room.entry_id, "mode": "off"})
    assert res["result"]["boost_active"] is False
    assert res["result"]["boost_open"] is False
    assert res["result"]["boost_until"] is None


async def test_unbekannter_raum_meldet_not_found(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    for msg in (
        {"type": "raumklima/boost", "entry_id": "gibtsnicht", "mode": "off"},
        {"type": "raumklima/room/resume", "entry_id": "gibtsnicht"},
        {"type": "raumklima/room/why", "entry_id": "gibtsnicht"},
        {"type": "raumklima/room/light_test", "entry_id": "gibtsnicht"},
        {"type": "raumklima/room/update", "entry_id": "gibtsnicht", "changes": {}},
        {"type": "raumklima/room/reset", "entry_id": "gibtsnicht"},
        {"type": "raumklima/room/delete", "entry_id": "gibtsnicht"},
    ):
        res = await _ws(client, msg)
        assert not res["success"], msg
        assert res["error"]["code"] == "not_found", msg


async def test_zentrale_laesst_sich_nicht_als_raum_loeschen(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    hub, _room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    for kind in ("delete", "reset"):
        res = await _ws(client, {"type": f"raumklima/room/{kind}", "entry_id": hub.entry_id})
        assert res["error"]["code"] == "not_found"
    assert hass.config_entries.async_get_entry(hub.entry_id) is not None


async def test_entfeuchter_schwellen_muessen_passen(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _hub, room = await _setup(hass, room_type="bathroom")
    client = await hass_ws_client(hass)
    res = await _ws(
        client,
        {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"dehumidifier_on": 60, "dehumidifier_off": 65}},
    )
    assert not res["success"]
    assert res["error"]["code"] == "invalid"


async def test_ungueltige_aenderung_wird_abgelehnt(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _hub, room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    res = await _ws(client, {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"presence_sensors": ["light.flur"]}})
    assert res["error"]["code"] == "invalid"
    assert "presence_sensors" not in room.options


async def test_raumtyp_wechsel_zieht_standardwerte_nach(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _hub, room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    res = await _ws(client, {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"room_type": "bedroom"}})
    assert res["success"], res
    assert room.options["room_type"] == "bedroom"
    # gleicher Typ noch einmal: nichts nachzuziehen
    res = await _ws(client, {"type": "raumklima/room/update", "entry_id": room.entry_id, "changes": {"room_type": "bedroom"}})
    assert res["success"]
    assert "adjusted" not in res["result"]


async def test_darstellung_speichern_und_lesen(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    hub, room = await _setup(hass, room_type="living")
    client = await hass_ws_client(hass)
    res = await _ws(client, {"type": "raumklima/layout/get"})
    assert res["success"], res
    assert res["result"]["home"] == hub.entry_id
    assert res["result"]["layout"]["beta_floors"] is False

    layout = {"order": ["climate.bad"], "hidden": [], "size": {"climate.bad": "medium"}, "color": {}, "beta_floors": True}
    res = await _ws(client, {"type": "raumklima/layout/save", "layout": layout})
    assert res["success"], res
    assert res["result"]["layout"]["beta_floors"] is True
    res = await _ws(client, {"type": "raumklima/layout/get", "home": hub.entry_id})
    assert res["result"]["layout"]["size"] == {"climate.bad": "medium"}
    assert res["result"]["layout"]["order"] == ["climate.bad"]


async def test_fortsetzen_warum_und_zuruecksetzen(
    hass: HomeAssistant, trv: FakeTrv, sensors, hass_ws_client: WebSocketGenerator
) -> None:
    _hub, room = await _setup(hass, room_type="living", comfort_temperature=22.5)
    client = await hass_ws_client(hass)
    res = await _ws(client, {"type": "raumklima/room/resume", "entry_id": room.entry_id})
    assert res["success"], res
    assert res["result"] == {"ok": True, "override_until": None}

    res = await _ws(client, {"type": "raumklima/room/why", "entry_id": room.entry_id})
    assert res["success"], res
    assert isinstance(res["result"], dict) and res["result"]

    res = await _ws(client, {"type": "raumklima/room/light_test", "entry_id": room.entry_id})
    assert res["error"]["code"] == "no_lights"

    res = await _ws(client, {"type": "raumklima/room/reset", "entry_id": room.entry_id})
    assert res["success"], res
    await hass.async_block_till_done()
    assert room.options.get("comfort_temperature") != 22.5  # Standard steht wieder
    assert room.data["trv"] == trv.entity_id  # Geräte bleiben
