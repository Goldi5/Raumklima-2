"""Gesundheit: Thermostat im eigenen Zeitplan-Modus (Issue #13)."""

from __future__ import annotations

from custom_components.raumklima.health import check_trv_mode


def test_auto_modus_wird_gemeldet() -> None:
    issue = check_trv_mode("auto", "manual")
    assert issue is not None
    assert issue.code == "trv_mode"
    assert issue.severity == "warn"
    assert "Auto" in issue.message


def test_zeitplan_preset_wird_gemeldet() -> None:
    assert check_trv_mode("heat", "schedule") is not None
    assert check_trv_mode("heat", "Program") is not None


def test_handbetrieb_ist_in_ordnung() -> None:
    assert check_trv_mode("heat", "manual") is None
    assert check_trv_mode("off", "manual") is None
    assert check_trv_mode(None, None) is None
