"""Protokoll: mehrere Räume zugleich filtern (#81)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.raumklima.decision_log import DecisionLog


async def test_mehrere_raeume(hass: HomeAssistant) -> None:
    log = DecisionLog(hass, "_test_rooms")
    log.add("manual", "Küche", room="Küche", entry_id="k")
    log.add("manual", "Bad", room="Bad", entry_id="b")
    log.add("manual", "Flur", room="Flur", entry_id="f")
    log.add("presence", "Alle weg")
    log.add("settings", "Zentrale geändert")
    msgs = [e["msg"] for e in log.query(entry_ids=["k", "b"])]
    assert "Küche" in msgs and "Bad" in msgs and "Alle weg" in msgs
    assert "Flur" not in msgs and "Zentrale geändert" not in msgs
    # Einzelraum wie bisher
    assert [e["msg"] for e in log.query(entry_id="f") if e["msg"] in ("Flur", "Bad")] == ["Flur"]
