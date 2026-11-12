"""Nutzungsprofil: Zählwerte, typische Fenster, lesbarer Vorschlag."""

from datetime import date, datetime, timedelta

from rk.usage_profile import UsageProfile, days_label, describe

MONDAY = datetime(2026, 11, 2, 8, 0)  # ein Montag


def _profile(*slots, weekday_offset: int = 0, days: int = 3) -> UsageProfile:
    """Pro Tag ein Montag (7 Tage Abstand), damit derselbe Wochentag mehrfach zählt."""
    prof = UsageProfile()
    for day in range(days):
        base = MONDAY + timedelta(days=7 * day + weekday_offset)
        for hour, minute in slots:
            prof.mark(base.replace(hour=hour, minute=minute), True)
    return prof


def test_zaehlt_ein_raster_pro_tag() -> None:
    prof = UsageProfile()
    prof.mark(MONDAY.replace(hour=8, minute=5), True)
    prof.mark(MONDAY.replace(hour=8, minute=10), True)  # gleiches Raster
    prof.mark(MONDAY.replace(hour=8, minute=30), True)  # nächstes Raster
    assert prof.counts["0:32"] == 1
    assert prof.counts["0:34"] == 1


def test_nicht_belegt_zaehlt_nicht() -> None:
    prof = UsageProfile()
    prof.mark(MONDAY, False)
    assert prof.counts == {}


def test_typische_zeit_erst_ab_drei_tagen() -> None:
    prof = _profile((8, 0), days=2)
    assert prof.typical_slots() == {}
    prof.mark(MONDAY + timedelta(days=14), True)
    assert prof.typical_slots() == {0: [32]}


def test_fenster_werden_zusammengefasst() -> None:
    prof = _profile((8, 0), (8, 15), (8, 30), (8, 45))
    windows = prof.suggested_windows()
    assert len(windows) == 1
    assert windows[0]["start"] == "08:00"
    assert windows[0]["end"] == "09:00"
    assert windows[0]["minutes"] == 60


def test_lesbarer_vorschlag() -> None:
    windows = [
        {"weekday": 0, "start": "08:00", "end": "11:30", "minutes": 210},
        {"weekday": 1, "start": "08:00", "end": "11:30", "minutes": 210},
        {"weekday": 2, "start": "08:00", "end": "11:30", "minutes": 210},
    ]
    assert describe(windows) == "Mo–Mi 08:00–11:30"
    assert days_label([0, 1, 2, 3, 4]) == "Mo–Fr"
    assert days_label([0, 2]) == "Mo, Mi"


def test_speichern_und_laden() -> None:
    prof = _profile((9, 0), (9, 15), (9, 30), days=3)
    data = prof.export()
    other = UsageProfile()
    other.load(data, today=(MONDAY + timedelta(days=15)).date())
    assert other.counts == prof.counts
    assert other.summary()["text"]


def test_kaputte_werte_werden_ignoriert() -> None:
    prof = UsageProfile()
    prof.load({"counts": {"quatsch": 5, "9:5": 1, "1:99": 1, "1:4": 7}}, today=MONDAY.date())
    assert prof.counts == {"1:4": 4}  # höchstens 4 gleiche Wochentage in vier Wochen


def test_summary_ohne_daten() -> None:
    assert UsageProfile().summary() == {"days_seen": 0, "windows": [], "text": ""}


def test_vergisst_nach_vier_wochen() -> None:
    """Früher stiegen die Zähler nur – eine alte Gewohnheit galt für immer als typisch."""
    prof = _profile((8, 0), days=3)
    assert prof.typical_slots() == {0: [32]}
    later = MONDAY + timedelta(days=7 * 6)  # sechs Wochen später, Raum nicht mehr genutzt
    prof.mark(later, False)
    assert prof.typical_slots() == {}


def test_alte_zaehler_laufen_aus() -> None:
    prof = UsageProfile()
    prof.load({"counts": {"0:32": 9}}, today=date(2026, 11, 12))
    assert prof.typical_slots() == {0: [32]}
    prof.mark(datetime(2026, 12, 20, 8, 0), False)  # gut fünf Wochen später
    assert prof.counts == {}


def test_naechster_block() -> None:
    prof = _profile((8, 0), (8, 15), (8, 30), (8, 45), days=3)  # Mo 08:00–09:00
    next_monday = MONDAY + timedelta(days=21)
    sunday_evening = next_monday - timedelta(hours=14)  # So 18:00
    assert prof.next_block(sunday_evening) == (next_monday.replace(hour=8, minute=0), next_monday.replace(hour=9, minute=0))
    inside = next_monday.replace(hour=8, minute=20)
    assert prof.next_block(inside)[0] == next_monday.replace(hour=8, minute=0)  # laufender Block
    assert prof.next_block(next_monday.replace(hour=9, minute=5)) is None  # vorbei, nächster erst in 7 Tagen


def test_kurze_bloecke_zaehlen_nicht() -> None:
    prof = _profile((8, 0), (8, 15), days=3)  # nur 30 min
    assert prof.next_block(MONDAY + timedelta(days=20)) is None
