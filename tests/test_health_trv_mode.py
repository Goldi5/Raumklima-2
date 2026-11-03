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


def test_dauer_preset_wird_erkannt() -> None:
    issue = check_trv_mode("heat", "off")
    assert issue is not None
    assert issue.title == "Thermostat steht auf Dauerbetrieb"
    assert check_trv_mode("heat", "antifrost") is not None





def test_geraeteabschlag_wird_erkannt() -> None:
    issue = check_trv_mode("heat", "eco")
    assert issue is not None
    assert issue.title == "Thermostat rechnet mit eigenem Abschlag"
    assert check_trv_mode("heat", "comfort") is not None


def test_manuelles_preset_ist_in_ordnung() -> None:
    assert check_trv_mode("heat", "none") is None
    assert check_trv_mode("heat", None) is None


def test_zeitplan_hat_vorrang_vor_preset() -> None:
    issue = check_trv_mode("auto", "eco")
    assert issue is not None
    assert issue.title == "Thermostat arbeitet nach eigenem Zeitplan"


def test_geraete_preset_comfort_ist_kein_abschlag() -> None:
    """Beim TRV602Z ist comfort der richtige Modus (Sollwert über comfort_temperature)."""
    assert check_trv_mode("heat", "comfort", device_preset=True) is None
    assert check_trv_mode("heat", "comfort", device_preset=False) is not None


def test_preset_on_warnt_als_dauer_offen() -> None:
    issue = check_trv_mode("heat", "on")
    assert issue is not None
    assert issue.title == "Thermostat öffnet das Ventil dauerhaft"
    assert check_trv_mode("heat", "on", device_preset=True) is None
