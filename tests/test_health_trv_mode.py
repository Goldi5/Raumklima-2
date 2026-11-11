"""Gesundheit: Thermostat im eigenen Zeitplan-Modus (Issue #13)."""

from __future__ import annotations

from custom_components.raumklima.health import check_notify_targets, check_trv_mode


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


def test_valve_heating_min_konstante() -> None:
    from custom_components.raumklima.const import VALVE_HEATING_MIN
    assert 0 < VALVE_HEATING_MIN <= 20


def test_auto_ist_ok_wenn_wir_comfort_temperature_schreiben() -> None:
    """Beim TRV602Z heißt unser Schreibweg „comfort“ – dann ist Systemmodus auto gewollt."""
    assert check_trv_mode("auto", "comfort", device_preset=True) is None


def test_missing_notify_target_is_reported() -> None:
    """Eingerichteter Empfänger, den es nicht mehr gibt (Issue: Meldungen liefen ins Leere)."""
    issue = check_notify_targets(["notify.a"])
    assert issue is not None
    assert issue.code == "notify_targets"
    assert "notify.a" in issue.message
    assert check_notify_targets([]) is None
