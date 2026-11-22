"""Anwesenheit über Handy-Ortung: Tracker direkt, und ein klarer Hinweis ohne Ortung (Issue #29)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.const import CONF_RESIDENTS, CONF_ZONE
from custom_components.raumklima.shared import get_hub

from .conftest import FakeTrv
from .test_features import _setup

HOME = {"latitude": 50.11, "longitude": 8.68}
ZONE = {**HOME, "radius": 100, "friendly_name": "Zuhause"}


def _zone(hass: HomeAssistant) -> None:
    hass.states.async_set("zone.home", "0", ZONE)


async def test_handy_ohne_koordinaten_meldet_sich_zu_wort(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    """Kein Handy meldet einen Standort → verständlicher Hinweis statt stiller Absenkung.

    Erst nach 15 Minuten Laufzeit – direkt nach dem Start melden sich die Handys noch.
    """
    _zone(hass)
    hass.states.async_set("person.b", "not_home", {"device_trackers": ["device_tracker.handy"]})
    hass.states.async_set("device_tracker.handy", "not_home")  # ohne Koordinaten
    hub, _room = await _setup(hass, {CONF_RESIDENTS: ["person.b"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    assert hub is not None

    texte = [str(entry.get("msg") or "") for entry in live.log.entries]
    assert not any("Keine Ortung" in t for t in texte), "direkt nach dem Start noch keine Warnung"
    from datetime import timedelta

    freezer.tick(timedelta(minutes=16))
    live._evaluate_presence()
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


async def test_tracker_direkt_home_ohne_koordinaten(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """Auch ein direkt eingetragener Tracker zählt ohne GPS über seinen Zustand „home“."""
    _zone(hass)
    hass.states.async_set("device_tracker.handy", "home")
    await _setup(hass, {CONF_RESIDENTS: ["device_tracker.handy"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    live._evaluate_presence()
    assert live.persons["device_tracker.handy"]["present"] is True
    assert live.persons["device_tracker.handy"]["distance_km"] is None


async def test_personen_zustand_home_zaehlt_auch_ohne_ortung(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    """Ohne GPS (z. B. nur WLAN/Router) bleibt „home“ der Person dauerhaft anwesend."""
    from datetime import timedelta

    _zone(hass)
    hass.states.async_set("person.b", "home", {"device_trackers": ["device_tracker.handy"]})
    hass.states.async_set("device_tracker.handy", "home")  # ohne Koordinaten
    await _setup(hass, {CONF_RESIDENTS: ["person.b"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    live._evaluate_presence()
    assert live.persons["person.b"]["present"] is True
    assert live.persons["person.b"]["distance_km"] is None
    assert not live.nobody_home

    freezer.tick(timedelta(minutes=11))
    live._evaluate_presence()
    assert live.persons["person.b"]["present"] is True


async def test_personen_zustand_not_home_ohne_ortung_bleibt_weg(hass: HomeAssistant, trv: FakeTrv, sensors, freezer) -> None:
    """„not_home“ ohne GPS zählt weiterhin als abwesend."""
    from datetime import timedelta

    _zone(hass)
    hass.states.async_set("person.b", "not_home", {"device_trackers": ["device_tracker.handy"]})
    hass.states.async_set("device_tracker.handy", "not_home")  # ohne Koordinaten
    await _setup(hass, {CONF_RESIDENTS: ["person.b"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    live.last_present = None
    freezer.tick(timedelta(minutes=16))
    live._evaluate_presence()
    assert live.persons["person.b"]["present"] is False
    assert live.persons["person.b"]["distance_km"] is None


async def test_quelle_wlan_und_gps(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#79: Router-Tracker „home“ zählt, auch wenn ein zweites Handy eine alte, ferne GPS-Position hat."""

    _zone(hass)
    hass.states.async_set("person.b", "not_home", {"device_trackers": ["device_tracker.router_b", "device_tracker.app_b"]})
    hass.states.async_set("device_tracker.router_b", "home", {"source_type": "router"})
    hass.states.async_set("device_tracker.app_b", "not_home", {"latitude": 51.0, "longitude": 9.5, "gps_accuracy": 20})
    await _setup(hass, {CONF_RESIDENTS: ["person.b"], CONF_ZONE: "zone.home"})
    live = get_hub(hass, None)
    live._evaluate_presence()
    assert live.persons["person.b"]["present"] is True
    assert live.persons["person.b"]["source"] == "wifi"



async def test_quelle_nur_gps_ignoriert_router(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#79: „nur GPS“ – ein Router-Tracker allein macht niemanden anwesend."""
    from custom_components.raumklima.const import CONF_PRESENCE_SOURCE

    _zone(hass)
    hass.states.async_set("person.b", "home", {"device_trackers": ["device_tracker.router_b"]})
    hass.states.async_set("device_tracker.router_b", "home", {"source_type": "router"})
    await _setup(hass, {CONF_RESIDENTS: ["person.b"], CONF_ZONE: "zone.home", CONF_PRESENCE_SOURCE: "gps"})
    live = get_hub(hass, None)
    live._evaluate_presence()
    assert live.persons["person.b"]["present"] is False


async def test_quelle_nur_wlan_ohne_zonen_koordinaten(hass: HomeAssistant, trv: FakeTrv, sensors) -> None:
    """#79: „nur WLAN“ braucht keine Zone mit Koordinaten."""
    from custom_components.raumklima.const import CONF_PRESENCE_SOURCE

    hass.states.async_set("zone.home", "0", {"friendly_name": "Zuhause"})  # ohne Koordinaten
    hass.states.async_set("person.b", "home", {"device_trackers": ["device_tracker.router_b"]})
    hass.states.async_set("device_tracker.router_b", "home", {"source_type": "router"})
    await _setup(hass, {CONF_RESIDENTS: ["person.b"], CONF_ZONE: "zone.home", CONF_PRESENCE_SOURCE: "wifi"})
    live = get_hub(hass, None)
    live._evaluate_presence()
    assert live.persons["person.b"]["present"] is True
    assert live.persons["person.b"]["distance_km"] is None
