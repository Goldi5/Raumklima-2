"""Anwesenheitsprofil: Viertelstunden-Raster, keine Personen."""

from datetime import datetime

from custom_components.raumklima.presence_profile import SLOTS, PresenceProfile


def _t(day: int, hour: int, minute: int) -> datetime:
    # 2026-01-05 ist ein Montag
    return datetime(2026, 1, 5 + day, hour, minute)


def test_leeres_profil_liefert_nullen() -> None:
    p = PresenceProfile()
    s = p.summary()
    assert len(s["weekday"]) == SLOTS
    assert set(s["weekday"]) == {0.0}
    assert s["days"]["weekday"] == 0
    assert s["complete"] is False


def test_anwesenheit_wird_je_viertelstunde_gezaehlt() -> None:
    p = PresenceProfile()
    p.mark(_t(0, 8, 0), True)
    p.mark(_t(0, 8, 7), True)   # gleiche Viertelstunde
    p.mark(_t(0, 8, 20), True)  # naechste Viertelstunde
    p.mark(_t(0, 9, 0), False)
    s = p.summary()
    assert s["days"]["weekday"] == 1
    assert s["weekday"][32] == 1.0   # 08:00 – einmal gezaehlt, Tag zaehlt einmal
    assert s["weekday"][33] == 1.0   # 08:15
    assert s["weekday"][36] == 0.0   # 09:00 – abwesend


def test_zwei_tage_ergeben_anteil() -> None:
    p = PresenceProfile()
    p.mark(_t(0, 7, 0), True)     # Montag anwesend
    p.mark(_t(1, 7, 0), False)    # Dienstag nicht
    s = p.summary()
    assert s["days"]["weekday"] == 2
    assert s["weekday"][28] == 0.5


def test_wochenende_getrennt() -> None:
    p = PresenceProfile()
    p.mark(_t(5, 10, 0), True)    # Samstag
    p.mark(_t(0, 10, 0), False)   # Montag
    s = p.summary()
    assert s["weekend"][40] == 1.0
    assert s["weekday"][40] == 0.0


def test_speichern_und_laden() -> None:
    p = PresenceProfile()
    p.mark(_t(0, 18, 30), True)
    q = PresenceProfile()
    q.load(p.dump())
    assert q.summary()["weekday"] == p.summary()["weekday"]
    assert PresenceProfile.slot_label(74) == "18:30"


def test_alte_tage_werden_verworfen() -> None:
    p = PresenceProfile()
    p.mark(datetime(2025, 1, 6, 8, 0), True)   # lange her
    p.mark(datetime(2026, 1, 6, 8, 0), True)
    assert all(k.startswith("2026") for k in p.days)


def test_typische_zeit_erst_ab_genug_tagen() -> None:
    p = PresenceProfile()
    for day in range(3):
        p.mark(_t(day, 17, 0), True)
        p.mark(_t(day, 17, 15), True)
    tip = p.typical(min_days=7)
    assert tip["ready"] is False


def test_typische_zeit_liefert_fenster() -> None:
    p = PresenceProfile()
    # fünf Werktage mit Anwesenheit ab 17:00
    for day in range(5):
        p.mark(_t(day, 17, 0), True)
        p.mark(_t(day, 17, 15), True)
        p.mark(_t(day, 8, 0), False)
    for day in (5, 6):
        p.mark(_t(day, 10, 0), True)
    tip = p.typical(min_days=2, threshold=0.6)
    assert tip["ready"] is True
    assert tip["weekday"]["from"] == "17:00"
    assert tip["weekday"]["to"] == "17:30"
    assert tip["weekend"]["from"] == "10:00"
