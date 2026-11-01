"""Schreibt echte Zustände und WebSocket-Antworten für die Browser-Tests der Karte.

Läuft mit den übrigen Tests; die Datei frontend/test/fixture.json wird nur
geschrieben, wenn RK_WRITE_FIXTURE=1 gesetzt ist.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .conftest import WINDOW, FakeTrv

OUT = Path(__file__).parents[2] / "frontend" / "test" / "fixture.json"


async def test_card_fixture(hass: HomeAssistant, setup, hass_ws_client, trv: FakeTrv) -> None:
    hass.states.async_set("sensor.bad_feuchte", "64", {"unit_of_measurement": "%", "device_class": "humidity"})
    hass.states.async_set(WINDOW, "on", {"device_class": "window", "friendly_name": "Bad Fenster"})
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    async def ws(msg: dict) -> dict:
        await client.send_json_auto_id(msg)
        res = await client.receive_json()
        assert res["success"], res
        return res["result"]

    reg = er.async_get(hass)
    entities = {
        e.entity_id: {
            "entity_id": e.entity_id,
            "platform": e.platform,
            "translation_key": e.translation_key,
            "device_id": e.device_id,
        }
        for e in reg.entities.values()
    }
    states = {
        s.entity_id: {
            "entity_id": s.entity_id,
            "state": s.state,
            "attributes": json.loads(json.dumps(dict(s.attributes), default=str)),
            "last_changed": s.last_changed.isoformat(),
            "last_updated": s.last_updated.isoformat(),
        }
        for s in hass.states.async_all()
    }
    data = {
        "states": states,
        "entities": entities,
        "ws": {
            "raumklima/config": await ws({"type": "raumklima/config"}),
            "raumklima/report": await ws({"type": "raumklima/report"}),
            "raumklima/log": await ws({"type": "raumklima/log", "limit": 300}),
        },
    }
    assert any(e["platform"] == "raumklima" for e in entities.values())
    if os.environ.get("RK_WRITE_FIXTURE"):
        OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False, default=str))
