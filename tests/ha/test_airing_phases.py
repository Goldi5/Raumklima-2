"""Dauerlüftung, Lüftfenster und gewohntes Lüften im Raum."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.raumklima.const import DOMAIN

from .conftest import WINDOW, FakeTrv, hub_entry, room_entry


async def advance(hass: HomeAssistant, seconds: float) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))
    await hass.async_block_till_done()


async def _setup_room(hass: HomeAssistant, **options) -> tuple[object, object]:
    hub = hub_entry()
    hub.add_to_hass(hass)
    room = room_entry(**options)
    room.add_to_hass(hass)
    assert await hass.config_entries.async_setup(hub.entry_id)
    await hass.async_block_till_done()
    return hub, room


async def test_long_airing_phase_after_limit(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Fenster länger offen als eingestellt → „Dauerlüftung" statt Mahnen."""
    _hub, room = await _setup_room(hass, long_airing_minutes=1, long_airing_remind=0)
    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    await advance(hass, 12)
    assert hass.states.get("climate.bad").attributes.get("airing_phase") == "short"

    # Öffnungszeitpunkt fünf Minuten zurückdatieren (deterministisch statt Zeitreise)
    controller = hass.data[DOMAIN]["rooms"][room.entry_id]
    controller.vent.window_open_since = dt_util.utcnow() - timedelta(minutes=5)
    controller.vent.update()
    await hass.async_block_till_done()
    assert hass.states.get("climate.bad").attributes.get("airing_phase") == "long"

    hass.states.async_set(WINDOW, "off", {"device_class": "window"})
    await hass.async_block_till_done()
    await advance(hass, 12)
    assert hass.states.get("climate.bad").attributes.get("airing_phase") is None

    # Beim Schließen wird der Vorgang für das Lernen gemerkt
    assert controller.airing.episodes


async def test_planned_airing_window(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Innerhalb eines Lüftfensters wird nicht gemahnt."""
    now = dt_util.now()
    start = f"{(now - timedelta(minutes=30)).hour:02d}:{(now - timedelta(minutes=30)).minute:02d}"
    end = f"{(now + timedelta(minutes=30)).hour:02d}:{(now + timedelta(minutes=30)).minute:02d}"
    await _setup_room(hass, long_airing_minutes=0, airing_windows=[{"days": [], "start": start, "end": end}])

    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    await advance(hass, 12)
    assert hass.states.get("climate.bad").attributes.get("airing_phase") == "planned"


async def test_learned_airing_suppresses_reminders(hass: HomeAssistant, trv: FakeTrv, sensors: None) -> None:
    """Dreimal zur gleichen Zeit gelüftet → diese Zeit gilt als gewohnt."""
    _hub, room = await _setup_room(hass, long_airing_minutes=0, learn_airing=True)
    controller = hass.data[DOMAIN]["rooms"][room.entry_id]
    now = dt_util.now()
    for weeks in range(3):
        controller.airing.record(now - timedelta(weeks=weeks), 60)
    assert controller.airing_learned(now) is True

    hass.states.async_set(WINDOW, "on", {"device_class": "window"})
    await hass.async_block_till_done()
    await advance(hass, 12)
    assert hass.states.get("climate.bad").attributes.get("airing_phase") == "learned"
