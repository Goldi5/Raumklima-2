"""Tests für Abwesenheit, Schimmelschutz und Heizsaison."""

from datetime import date, datetime, timedelta

from rk.planning import (
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    STAGE_GUESTS,
    STAGE_HOME,
    STAGE_PREHEAT,
    Fix,
    PresenceInput,
    SeasonConfig,
    SeasonState,
    TrackerFilter,
    approaching,
    combined_mean,
    haversine_km,
    in_season,
    mold_safe_min_temp,
    parse_md,
    presence_stage,
    season_allows_heating,
    season_decision,
    season_step,
    setback_target,
)

BERLIN = (52.5146, 13.4986)  # Lichtenberg
REMSCHEID = (51.1787, 7.1897)
T0 = datetime(2026, 11, 2, 12, 0)


# ------------------------------------------------------------ Schimmelschutz
def test_mold_dry_air_allows_deep_setback():
    # 18 °C / 45 % bei 0 °C draußen → unbedenklich deutlich unter 16 °C
    m = mold_safe_min_temp(18, 45, 0, frsi=0.70)
    assert m is not None and m < 15


def test_mold_humid_air_blocks_setback():
    # Bad nach dem Duschen: 22 °C / 88 % → muss warm bleiben
    m = mold_safe_min_temp(22, 88, 0, frsi=0.70)
    assert m is not None and m > 22


def test_mold_din_reference():
    # Normfall 20 °C / 50 %, −5 °C, fRsi 0,70 → genau grenzwertig (~20 °C)
    m = mold_safe_min_temp(20, 50, -5, frsi=0.70)
    assert 19.0 <= m <= 21.0


def test_mold_better_building_allows_lower():
    old = mold_safe_min_temp(19, 60, 0, frsi=0.60)
    new = mold_safe_min_temp(19, 60, 0, frsi=0.80)
    assert new < old


def test_mold_missing_values():
    assert mold_safe_min_temp(None, 50, 0) is None
    assert mold_safe_min_temp(20, 50, None) is None


def test_mold_warm_outside_no_limit():
    assert mold_safe_min_temp(20, 40, 18) is None


# ------------------------------------------------------------ Absenkung
def test_setback_short_long():
    assert setback_target(21, STAGE_AWAY_SHORT, 18, 16, None) == 18
    assert setback_target(21, STAGE_AWAY_LONG, 18, 16, None) == 16
    assert setback_target(21, STAGE_HOME, 18, 16, None) == 21


def test_setback_never_above_wish():
    assert setback_target(17, STAGE_AWAY_SHORT, 18, 16, None) == 17


def test_mold_guard_only_for_long_absence():
    assert setback_target(21, STAGE_AWAY_SHORT, 18, 16, 20.0) == 18


def test_setback_respects_mold_guard_but_not_above_wish():
    assert setback_target(21, STAGE_AWAY_LONG, 18, 16, 17.2) == 17.5
    assert setback_target(21, STAGE_AWAY_LONG, 18, 16, 30.0) == 21


# ------------------------------------------------------------ Ortung
def test_haversine_berlin_remscheid():
    assert 440 < haversine_km(*BERLIN, *REMSCHEID) < 470


def test_filter_rejects_vpn_jump():
    f = TrackerFilter()
    assert f.feed(Fix(*BERLIN, T0, 20))
    assert not f.feed(Fix(*REMSCHEID, T0 + timedelta(minutes=2), 50))
    assert f.accepted.lat == BERLIN[0]


def test_filter_accepts_persistent_real_travel():
    f = TrackerFilter()
    f.feed(Fix(*BERLIN, T0))
    assert not f.feed(Fix(*REMSCHEID, T0 + timedelta(minutes=5)))
    assert not f.feed(Fix(*REMSCHEID, T0 + timedelta(minutes=20)))
    assert f.feed(Fix(*REMSCHEID, T0 + timedelta(minutes=40)))


def test_filter_accepts_normal_motion():
    f = TrackerFilter()
    f.feed(Fix(52.50, 13.40, T0))
    assert f.feed(Fix(52.55, 13.45, T0 + timedelta(minutes=15)))  # ~6,6 km in 15 min


def test_filter_rejects_inaccurate():
    f = TrackerFilter()
    assert not f.feed(Fix(*BERLIN, T0, accuracy=1500))


def test_approaching():
    hist = [(T0, 12.0), (T0 + timedelta(minutes=6), 9.0)]
    assert approaching(hist, T0 + timedelta(minutes=6))
    hist = [(T0, 9.0), (T0 + timedelta(minutes=6), 12.0)]
    assert not approaching(hist, T0 + timedelta(minutes=6))


def test_leaving_home_is_not_approaching():
    # vorher von weit weg gekommen (7 km → 0), jetzt wieder weg (5 km)
    hist = [(T0, 7.0), (T0 + timedelta(minutes=10), 0.0), (T0 + timedelta(minutes=20), 5.0)]
    assert not approaching(hist, T0 + timedelta(minutes=20))


# ------------------------------------------------------------ Stufen
def _p(**kw):
    base = dict(configured=True, anyone_present=False, minutes_since_present=0,
                away_delay_min=30, long_away_hours=24, vacation=False, guests=False, preheat=False)
    base.update(kw)
    return PresenceInput(**base)


def test_stages():
    assert presence_stage(_p(anyone_present=True)) == STAGE_HOME
    assert presence_stage(_p(minutes_since_present=10)) == STAGE_HOME  # Wartezeit
    assert presence_stage(_p(minutes_since_present=45)) == STAGE_AWAY_SHORT
    assert presence_stage(_p(minutes_since_present=60 * 30)) == STAGE_AWAY_LONG
    assert presence_stage(_p(vacation=True, minutes_since_present=1)) == STAGE_AWAY_LONG
    assert presence_stage(_p(guests=True, minutes_since_present=999)) == STAGE_GUESTS
    assert presence_stage(_p(preheat=True, minutes_since_present=999)) == STAGE_PREHEAT
    assert presence_stage(_p(configured=False)) == STAGE_HOME


# ------------------------------------------------------------ Heizsaison
def test_parse_md():
    assert parse_md("10-01", (1, 1)) == (10, 1)
    assert parse_md("01.10.", (1, 1)) == (10, 1)
    assert parse_md("murks", (4, 30)) == (4, 30)


def test_in_season_wraps_year():
    assert in_season(date(2026, 12, 24), "10-01", "04-30")
    assert in_season(date(2027, 3, 1), "10-01", "04-30")
    assert not in_season(date(2027, 7, 1), "10-01", "04-30")


def test_combined_mean():
    assert combined_mean(10, 14) == 12
    assert combined_mean(None, 14) == 14
    assert combined_mean(None, None) is None


def test_season_switches_off_only_after_48h_mild():
    cfg = SeasonConfig()
    st = SeasonState(heating=True)
    now = datetime(2026, 10, 10, 12)
    st = season_step(st, now, 18, 18, cfg)
    assert st.heating
    st = season_step(st, now + timedelta(hours=47), 18, 18, cfg)
    assert st.heating
    st = season_step(st, now + timedelta(hours=49), 18, 18, cfg)
    assert not st.heating


def test_season_switches_on_when_cold():
    cfg = SeasonConfig()
    st = SeasonState(heating=False)
    st = season_step(st, datetime(2026, 10, 10, 12), 13, 14, cfg)
    assert st.heating


def test_season_off_outside_but_cold_snap():
    cfg = SeasonConfig()
    st = SeasonState()
    now = datetime(2027, 5, 10, 12)
    st = season_step(st, now, 10, 9, cfg)
    assert not st.heating and not st.cold_snap
    st = season_step(st, now + timedelta(days=3, minutes=1), 10, 9, cfg)
    assert st.cold_snap
    assert season_decision("auto", st, False, False) == "cold_snap"


def test_season_decision_modes():
    st = SeasonState(heating=False)
    assert season_decision("auto", st, True, True) == "heat_today"
    assert season_decision("always", st, False, False) == "always"
    assert season_decision("pause", SeasonState(heating=True), False, True) == "manual_pause"
    assert not season_allows_heating("pause")
    assert season_allows_heating("cold_snap")


# ------------------------------------------------------------------ Nachtlüften
from rk.planning import in_time_window, morning_after, mute_until, night_airing_applies


def test_night_window():
    d = datetime(2026, 10, 30)
    assert in_time_window(d.replace(hour=22, minute=40), "20:00", "03:00")
    assert in_time_window(d.replace(hour=2, minute=59), "20:00", "03:00")
    assert not in_time_window(d.replace(hour=3), "20:00", "03:00")
    assert not in_time_window(d.replace(hour=14), "20:00", "03:00")


def test_night_applies():
    assert night_airing_applies("auto", "bedroom", True, True)
    assert night_airing_applies("auto", "rarely_used", True, True)
    assert not night_airing_applies("auto", "living", True, True)
    assert night_airing_applies("on", "living", True, True)
    assert not night_airing_applies("off", "bedroom", True, True)
    assert not night_airing_applies("auto", "bedroom", False, True)  # tagsüber = Stoßlüften
    assert not night_airing_applies("auto", "bedroom", True, False)  # niemand da


def test_morning_and_mute():
    eve = datetime(2026, 10, 30, 22, 40)
    assert morning_after(eve, "07:00:00") == datetime(2026, 10, 31, 7, 0)
    assert morning_after(datetime(2026, 10, 31, 1, 0), "07:00") == datetime(2026, 10, 31, 7, 0)
    assert mute_until(eve, "07:00") == datetime(2026, 10, 31, 7, 0)
    assert mute_until(datetime(2026, 10, 31, 2, 0), "07:00") == datetime(2026, 10, 31, 7, 0)
    assert mute_until(datetime(2026, 10, 31, 14, 0), "07:00") == datetime(2026, 11, 1, 0, 0)


def test_weekend_quiet():
    from rk.planning import in_quiet
    fri = datetime(2026, 10, 30, 22, 30)
    sat8 = datetime(2026, 10, 31, 8, 0)
    mon8 = datetime(2026, 11, 2, 8, 0)
    assert in_quiet(fri, "22:00", "07:00", "09:00")
    assert in_quiet(sat8, "22:00", "07:00", "09:00")
    assert not in_quiet(mon8, "22:00", "07:00", "09:00")
    assert not in_quiet(sat8, "22:00", "07:00")  # ohne Wochenend-Wert wie bisher
    assert morning_after(fri, "07:00", "09:00") == datetime(2026, 10, 31, 9, 0)
    assert morning_after(datetime(2026, 11, 1, 23, 0), "07:00", "09:00") == datetime(2026, 11, 2, 7, 0)
    assert mute_until(fri, "07:00", "09:00") == datetime(2026, 10, 31, 9, 0)
    assert mute_until(datetime(2026, 10, 31, 8, 0), "07:00", "09:00") == datetime(2026, 10, 31, 9, 0)


def test_virtual_window():
    from rk.planning import detect_temp_drop, virtual_window_close_reason
    t0 = datetime(2026, 11, 2, 8, 0)
    pts = [(t0 + timedelta(minutes=m), v) for m, v in [(0, 20.5), (2, 20.4), (4, 19.8), (5, 19.3)]]
    assert detect_temp_drop(pts, t0 + timedelta(minutes=5), 6.0) == 1.2
    assert detect_temp_drop(pts, t0 + timedelta(minutes=5), 16.0) is None  # draußen mild
    slow = [(t0 + timedelta(minutes=m), 20.5 - m * 0.05) for m in range(0, 30, 3)]
    assert detect_temp_drop(slow, t0 + timedelta(minutes=27), 6.0) is None
    assert virtual_window_close_reason(t0, t0 + timedelta(minutes=5), 19.0, 19.5) is None  # zu früh
    assert virtual_window_close_reason(t0, t0 + timedelta(minutes=12), 19.0, 19.4) == "recovered"
    assert virtual_window_close_reason(t0, t0 + timedelta(minutes=12), 19.0, 19.1) is None
    assert virtual_window_close_reason(t0, t0 + timedelta(minutes=31), 19.0, 19.0) == "max"


def test_eta():
    from rk.planning import eta_minutes
    t0 = datetime(2026, 11, 2, 17, 0)
    hist = [(t0 + timedelta(minutes=m), 80 - m * 1.5) for m in range(0, 11)]  # 90 km/h
    eta = eta_minutes(hist, t0 + timedelta(minutes=10))
    assert 40 <= eta <= 44  # 65 km bei 90 km/h
    walk = [(t0 + timedelta(minutes=m), 3 - m * 0.05) for m in range(0, 11)]
    assert eta_minutes(walk, t0 + timedelta(minutes=10)) is None
