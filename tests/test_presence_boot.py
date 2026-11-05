"""Nach einem Neustart zählt ein wiederhergestellter Melder-Zustand nicht als Anwesenheit."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from rk.occupancy import KIND_MMWAVE, Reading, recently_seen

NOW = datetime(2026, 11, 5, 8, 25, tzinfo=UTC)
BOOT = NOW - timedelta(minutes=9)


def _ago(minutes: float) -> datetime:
    return NOW - timedelta(minutes=minutes)


def test_frischer_zustand_zaehlt() -> None:
    reading = Reading(KIND_MMWAVE, False, _ago(1), updated=_ago(1))
    assert recently_seen([reading], NOW, (KIND_MMWAVE,), since=BOOT) is True


def test_wiederhergestellter_zustand_von_vor_dem_start_zaehlt_nicht() -> None:
    """Melder war beim Start noch „an" – Zustand stammt aber aus der Zeit davor."""
    stale = Reading(KIND_MMWAVE, False, _ago(30), updated=_ago(30))
    assert recently_seen([stale], NOW, (KIND_MMWAVE,), since=BOOT) is False


def test_alter_zustand_bleibt_aktiv_wenn_er_jetzt_an_ist() -> None:
    """Ist der Melder aktuell „an", zählt er – auch wenn die Meldung alt ist."""
    reading = Reading(KIND_MMWAVE, True, _ago(30), updated=_ago(30))
    assert recently_seen([reading], NOW, (KIND_MMWAVE,), since=BOOT) is True


def test_nachlauf_zaehlt_nur_wenn_an_seit_start_gesehen() -> None:
    """Melder war beim Neustart „an" und ging dann aus – der Nachlauf darf nicht greifen."""
    off = Reading(KIND_MMWAVE, False, _ago(3), updated=_ago(3))
    assert recently_seen([off], NOW, (KIND_MMWAVE,), since=BOOT, seen_on=set()) is False
    assert recently_seen([off], NOW, (KIND_MMWAVE,), since=BOOT, seen_on={KIND_MMWAVE}) is True


def test_ohne_startzeitpunkt_bleibt_alles_wie_bisher() -> None:
    reading = Reading(KIND_MMWAVE, False, _ago(1), updated=_ago(1))
    assert recently_seen([reading], NOW, (KIND_MMWAVE,)) is True
