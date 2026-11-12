"""Tests für das Lernen der Schlaf- und Aufstehzeiten."""

from datetime import date, datetime, timedelta

from rk.sleep import BED, WAKE, SignalTracker, SleepLearner, effective_times


def _week(learner, start, bed_h, bed_m, wake_h, wake_m, nights):
    for i in range(nights):
        d = start + timedelta(days=i)
        learner.record(BED, d.replace(hour=bed_h, minute=bed_m), "test")
        learner.record(WAKE, (d + timedelta(days=1)).replace(hour=wake_h, minute=wake_m), "test")


def test_learn_weekday_and_weekend():
    lr = SleepLearner()
    mon = datetime(2026, 10, 5)  # Montag
    for week in range(3):
        base = mon + timedelta(days=7 * week)
        _week(lr, base, 23, 10, 6, 50, 4)  # So–Do-Nächte: Mo..Do
        _week(lr, base + timedelta(days=4), 0, 0, 9, 20, 0)
        lr.record(BED, (base + timedelta(days=5)).replace(hour=0, minute=30), "test")  # Fr-Nacht nach Mitternacht
        lr.record(WAKE, (base + timedelta(days=5)).replace(hour=9, minute=20), "test")
        lr.record(BED, (base + timedelta(days=5)).replace(hour=23, minute=50), "test")  # Sa-Nacht
        lr.record(WAKE, (base + timedelta(days=6)).replace(hour=9, minute=40), "test")
    wd, we = lr.learned(False), lr.learned(True)
    assert wd.as_dict()["bed"] == "23:10" and wd.as_dict()["wake"] == "06:50"
    assert we.nights_bed == 6 and we.as_dict()["wake"] == "09:30"
    assert we.as_dict()["bed"] in ("00:10", "00:05", "00:15")


def test_earliest_event_per_night_and_windows():
    lr = SleepLearner()
    d = datetime(2026, 10, 6)
    assert lr.record(BED, d.replace(hour=23, minute=30), "a")
    assert lr.record(BED, d.replace(hour=22, minute=45), "b")  # früher → ersetzt
    assert not lr.record(BED, d.replace(hour=23, minute=59), "c")
    assert not lr.record(BED, d.replace(hour=15), "x")  # nachmittags zählt nicht
    assert not lr.record(WAKE, (d + timedelta(days=1)).replace(hour=3), "x")  # zu früh
    assert lr.nights["2026-10-06"]["bed_src"] == "b"


def test_not_enough_nights():
    lr = SleepLearner()
    _week(lr, datetime(2026, 10, 5), 23, 0, 7, 0, 3)
    assert lr.learned(False).bed is None


def test_effective_only_extends():
    from rk.sleep import Learned
    late = Learned(bed=30, wake=9 * 60 + 15, nights_bed=6, nights_wake=6)  # 00:30 / 09:15
    eff = effective_times(late, "22:00", "07:00", "20:00", "03:00")
    assert eff["quiet_start"] == "22:00"  # später ins Bett verkürzt nichts
    assert eff["quiet_end"] == "09:45" and eff["source"]["quiet_end"] == "learned"
    assert eff["night_end"] == "03:00" or eff["night_end"] >= "02:30"
    early = Learned(bed=21 * 60, wake=6 * 60, nights_bed=6, nights_wake=6)
    eff = effective_times(early, "22:00", "07:00", "20:00", "03:00")
    assert eff["quiet_start"] == "20:30" and eff["quiet_end"] == "07:00"
    assert eff["night_start"] == "20:00"
    off = effective_times(late, "22:00", "07:00", "20:00", "03:00", enabled=False)
    assert off["quiet_end"] == "07:00"


def test_signal_tracker():
    st = SignalTracker()
    d = datetime(2026, 10, 30, 23, 0)
    assert st.update(False, d) is None
    assert st.tick(d + timedelta(minutes=10)) is None
    assert st.tick(d + timedelta(minutes=21)) == BED and st.bed_at == d
    assert st.update(True, d + timedelta(hours=3)) is None  # 02:00 Bad-Licht: noch Nacht
    assert st.asleep
    st.update(False, d + timedelta(hours=3, minutes=5))
    assert st.update(True, d + timedelta(hours=8, minutes=40)) == WAKE  # 07:40
    assert not st.asleep
    st2 = SignalTracker()
    st2.update(False, datetime(2026, 10, 31, 14, 0))  # nachmittags aus: keine Bettzeit
    assert st2.tick(datetime(2026, 10, 31, 15, 0)) is None


def test_learns_per_weekday_for_shift_work():
    """Schichtdienst: je Wochentag eigene Zeiten, sonst greift das Übliche."""
    lr = SleepLearner()
    mon = datetime(2026, 10, 5)  # Montag
    for week in range(5):
        base = mon + timedelta(days=7 * week)
        # Montagnacht: spät ins Bett, früh raus
        lr.record(BED, base.replace(hour=23, minute=30), "test")
        lr.record(WAKE, (base + timedelta(days=1)).replace(hour=6, minute=0), "test")
        # Dienstagnacht: früh ins Bett, spät raus
        lr.record(BED, (base + timedelta(days=1)).replace(hour=21, minute=0), "test")
        lr.record(WAKE, (base + timedelta(days=2)).replace(hour=8, minute=30), "test")

    montag = lr.learned(False, date(2026, 10, 5))
    assert montag.as_dict()["bed"] == "23:30" and montag.as_dict()["wake"] == "06:00"
    dienstag = lr.learned(False, date(2026, 10, 6))
    assert dienstag.as_dict()["bed"] == "21:00" and dienstag.as_dict()["wake"] == "08:30"
    # Mittwoch hat keine eigenen Nächte → Rückfall auf den Tagestyp, nichts erfunden
    mittwoch = lr.learned(False, date(2026, 10, 7))
    assert mittwoch.bed is not None and mittwoch.bed not in (montag.bed, dienstag.bed or 0)
    # ohne Nacht-Angabe bleibt es wie bisher der Tagestyp
    assert lr.learned(False).nights_bed == 10


def test_shift_windows_learn_daytime_sleep():
    """Ohne Schichtdienst zählt 07:00 nicht als Bettzeit, mit Schichtdienst schon."""
    nachtschicht = datetime(2026, 10, 6, 7, 0)  # 07:00 nach der Nachtschicht
    mittag = datetime(2026, 10, 6, 14, 0)  # 14:00 aufgestanden

    plain = SleepLearner()
    assert not plain.record(BED, nachtschicht, "test")
    assert not plain.record(WAKE, mittag, "test")

    shift = SleepLearner()
    shift.shift = True
    assert shift.record(BED, nachtschicht, "test")
    assert shift.record(WAKE, mittag, "test")
    # Bettzeit und Aufstehen gehören zur selben Nacht (der Nacht davor)
    nacht = shift.nights["2026-10-05"]
    assert nacht["bed"].endswith("07:00:00") and nacht["wake"].endswith("14:00:00")
    assert shift.night_for(datetime(2026, 10, 6, 7, 0)) == date(2026, 10, 5)
    assert shift.night_for(datetime(2026, 10, 6, 14, 0)) == date(2026, 10, 5)
    assert plain.night_for(datetime(2026, 10, 6, 14, 0)) == date(2026, 10, 6)


def test_signal_tracker_shift_detects_daytime_sleep():
    """Licht aus um 08:00: nur mit Schichtdienst gilt das als „ins Bett“."""
    st = SignalTracker(shift=True)
    d = datetime(2026, 10, 6, 8, 0)
    assert st.update(False, d) is None
    assert st.tick(d + timedelta(minutes=21)) == BED
    assert st.asleep



def test_zwischenfenster_erkennt_die_nacht_nicht_neu() -> None:
    """03:30–04:30: dieselbe Nacht darf nicht bei jedem Tick erneut erkannt werden."""
    from datetime import datetime, timedelta

    st = SignalTracker()
    evening = datetime(2026, 11, 11, 22, 0)
    assert st.update(False, evening) is None
    # 20 Minuten später ist es „Bettzeit“
    assert st.tick(evening + timedelta(minutes=21)) == BED
    assert st.asleep is True

    # Zwischenfenster: 03:45 – außerhalb Bett- und Aufsteh-Fenster
    gap = datetime(2026, 11, 12, 3, 45)
    assert st.tick(gap) is None
    assert st.asleep is False
    assert st.all_off_since is None, "sonst wird dieselbe Nacht gleich wieder erkannt"

    # nächster Tick im Zwischenfenster bleibt still
    assert st.tick(gap + timedelta(minutes=2)) is None
