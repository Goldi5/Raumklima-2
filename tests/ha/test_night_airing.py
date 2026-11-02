"""Nachtlüften: beim Schlafen mit offenem Fenster keine Lüft-Hinweise in Karte, Sensor und Ereignissen."""

from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_capture_events, async_fire_time_changed

from .conftest import WINDOW, FakeTrv
from .test_features import _setup


async def test_no_close_notice_while_sleeping_with_window_open(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    freezer.move_to(datetime(2026, 11, 2, 23, 30, tzinfo=dt_util.get_default_time_zone()))
    events = async_capture_events(hass, "raumklima_event")
    _hub, room = await _setup(hass, room_type="bedroom", night_airing="on")
    c = room.runtime_data

    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    assert c.night_airing

    # Lange nach der empfohlenen Lüftdauer
    for _ in range(6):
        freezer.tick(timedelta(minutes=10))
        async_fire_time_changed(hass, dt_util.utcnow())
        await hass.async_block_till_done()
    c.vent.update()
    await hass.async_block_till_done()

    attrs = hass.states.get("climate.bad").attributes
    assert attrs["night_airing"] is True
    assert attrs["ventilation"] == "ok"  # kein „bitte schließen“ auf der Karte
    vent_states = [e.data["state"] for e in events if e.data["type"] == "ventilation"]
    assert "please_close" not in vent_states and "done" not in vent_states

    # Fenster zu → normal weiter
    hass.states.async_set(WINDOW, "off", {"device_class": "window"})
    await hass.async_block_till_done()
    c.vent.update()
    assert not c.night_airing
