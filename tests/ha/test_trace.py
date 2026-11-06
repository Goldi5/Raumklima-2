"""Debug-Spur der Karte: Ereignisse landen im Speicher und im Protokoll."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima import trace


def test_spur_wird_aufgenommen(hass: HomeAssistant) -> None:
    trace.TRACES.clear()
    trace.add(hass, "card", {"version": "0.59.18b1"})
    trace.add(hass, "click", {"what": "sichern"})
    items = trace.recent()
    assert [i["event"] for i in items] == ["card", "click"]
    assert items[0]["data"]["version"] == "0.59.18b1"


def test_lange_werte_werden_gekuerzt(hass: HomeAssistant) -> None:
    trace.TRACES.clear()
    trace.add(hass, "x" * 200, {"ua": "y" * 500})
    item = trace.recent()[0]
    assert len(item["event"]) <= 60
    assert len(item["data"]["ua"]) <= 200


def test_spur_ist_begrenzt(hass: HomeAssistant) -> None:
    trace.TRACES.clear()
    for i in range(250):
        trace.add(hass, "t", {"i": i})
    assert len(trace.recent()) == trace.MAX_TRACES
