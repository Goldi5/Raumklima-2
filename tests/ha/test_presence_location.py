"""Anwesenheit über Handy-Ortung: Tracker direkt, und ein klarer Hinweis ohne Ortung (Issue #29)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_RESIDENTS, CONF_ZONE
from custom_components.raumklima.shared import get_hub

from .conftest import FakeTrv
from .test_features import _setup

HOME = {"latitude": 51.19, "longitude": 7.18}
ZONE = {**HOME, "radius": 100, "friendly_name": "Zuhause"}


def _zone(hass: HomeAssistant) -> None:
    hass.states.async_set("zone.home", "0", ZONE)


async def test_handy_ohne_koordinaten_meldet_sich_zu_wort(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Kein Handy meldet einen Standort → verständlicher Hinweis statt stiller Absenkung."""
    _zone(hass)
    hass.states.async_set("person.antje", "not_home", {"device_trackers": ["device_tracker.handy"]})
    hass.states.async_set("device_tracker.handy", "not_home")  # ohne Koordinaten
    hub, _room = await _setup(hass, {CONF_RESIDENTS: ["person.antje"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    assert hub is not None

    texte = [str(entry.get("msg") or "") for entry in live.log.entries]
    assert any("Ortung" in t for t in texte), f"Hinweis fehlt im Protokoll: {texte[:6]}"


async def test_tracker_direkt_als_bewohner(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Wer einen Gerätetracker statt einer Person einträgt, soll trotzdem erkannt werden."""
    _zone(hass)
    hass.states.async_set("device_tracker.handy", "home", {**HOME, "gps_accuracy": 20})
    await _setup(hass, {CONF_RESIDENTS: ["device_tracker.handy"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    live._evaluate_presence()
    assert live.persons["device_tracker.handy"]["present"] is True
