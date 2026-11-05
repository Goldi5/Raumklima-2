"""Sprachsteuerung: Werkzeuge für Assist mit KI-Agenten."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
import pytest

from custom_components.raumklima import assist
from custom_components.raumklima.shared import domain_data

from .conftest import FakeTrv

llm = pytest.importorskip("homeassistant.helpers.llm")


def _ctrl(hass: HomeAssistant, room):
    return domain_data(hass)["rooms"][room.entry_id]


def _call(tool, hass: HomeAssistant, **args):
    return tool.async_call(hass, llm.ToolInput(tool_name=tool.name, tool_args=args), None)


async def test_werkzeuge_sind_angemeldet(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Nach dem Einrichten findet jeder KI-Agent die Raumklima-Werkzeuge."""
    apis = {api.id: api for api in llm.async_get_apis(hass)}
    assert "raumklima" in apis

    inst = await apis["raumklima"].async_get_api_instance(None)
    namen = {tool.name for tool in inst.tools}
    assert namen == {"raumklima_rooms", "raumklima_room_status", "raumklima_set_room_temperature"}

    # Die Parameter müssen ein echtes Schema der laufenden HA-Version sein
    # (2026.10 nutzt probatio, davor voluptuous) – sonst kann der KI-Agent sie nicht aufrufen.
    by_name = {tool.name: tool for tool in inst.tools}
    assert by_name["raumklima_room_status"].parameters({"room": "Bad"})
    assert by_name["raumklima_set_room_temperature"].parameters({"room": "Bad", "temperature": "22"})["temperature"] == 22.0
    assert by_name["raumklima_rooms"].parameters({}) == {}


async def test_raumstatus_liefert_werte(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """„Wie warm ist es im Bad?" – Ist, Soll und Feuchte kommen aus dem Regler."""
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    status = assist.room_status(ctrl)
    assert status["room"] == ctrl.name
    assert status["current_temperature_c"] == 19.0
    assert status["wish_temperature_c"] == ctrl.target_temp
    assert status["needs_airing"] is False


async def test_lueftbedarf_wird_erkannt(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Hohe Feuchte → Lüften empfohlen, mit Dauer."""
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    hass.states.async_set("sensor.bad_feuchte", "72", {"unit_of_measurement": "%"})
    ctrl.humidity_sensor = "sensor.bad_feuchte"
    status = assist.room_status(ctrl)
    assert status["needs_airing"] is True
    assert status["airing_minutes"] > 0


async def test_temperatur_setzen(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """„Stell das Bad auf 22 Grad" setzt die Wunschtemperatur."""
    _hub, room = setup
    ctrl = _ctrl(hass, room)
    tool = assist.SetTemperatureTool()
    res = await _call(tool, hass, room=ctrl.name, temperature=22)
    assert res["success"] is True
    assert ctrl.target_temp == 22.0
    assert res["wish_temperature_c"] == 22.0


async def test_unbekannter_raum_erklaert_die_namen(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    """Falscher Raumname: das Werkzeug nennt die bekannten Räume statt zu raten."""
    tool = assist.SetTemperatureTool()
    res = await _call(tool, hass, room="Keller", temperature=20)
    assert res["success"] is False
    assert "Keller" in res["error"]
    assert "Bad" in res["error"]


async def test_raumliste(hass: HomeAssistant, setup, trv: FakeTrv) -> None:
    _hub, room = setup
    res = await _call(assist.RoomListTool(), hass)
    assert res["success"] is True
    assert [r["room"] for r in res["rooms"]] == [_ctrl(hass, room).name]
