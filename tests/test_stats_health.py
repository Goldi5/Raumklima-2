"""Tests für Heizbericht und Gesundheitscheck."""

from datetime import date, datetime, timedelta

from rk.health import (
    HistoryPoint,
    check_battery,
    check_not_warming,
    check_radio,
    check_sensor_frozen,
    check_window,
)
from rk.stats import (
    RoomSample,
    add_home_sample,
    add_room_sample,
    compare,
    heating_degree_days,
    prune,
    summarize,
    week_message,
)

T0 = datetime(2026, 11, 2, 12, 0)


def _s(**kw):
    base = dict(heating=False, valve=0.0, reason="normal", target=20.0, effective=20.0, plan_on=True,
                paused=False, temp=20.0, humidity=50.0, humidity_limit=70.0, mold=False, window_open=False)
    base.update(kw)
    return RoomSample(**base)


def test_room_accumulation_and_summary():
    day: dict = {}
    for _ in range(60):  # 1 h heizen, Ventil 50 %
        add_room_sample(day, _s(heating=True, valve=50.0), 60)
    for _ in range(120):  # 2 h abgesenkt um 2 K
        add_room_sample(day, _s(reason="away_short", effective=18.0, temp=18.2), 60)
    for _ in range(60):  # 1 h zu feucht
        add_room_sample(day, _s(humidity=75.0), 60)
    r = summarize({"Bad": {"2026-11-02": day}}, {}, date(2026, 11, 2), date(2026, 11, 2))["rooms"]["Bad"]
    assert r["hours"] == 4.0
    assert r["heating_h"] == 1.0
    assert r["valve_h"] == 0.5
    assert r["setback_h"] == 2.0 and r["setback_avg_k"] == 2.0
    assert r["humid_h"] == 1.0
    assert r["on_target_pct"] == 100
    # 2 K über 2 von 4 h → 6 % × 1 K Mittel = 6 %
    assert r["saving_pct"] == 6.0


def test_hdd_and_compare():
    home = {}
    for i in range(7):
        d = {}
        add_home_sample(d, False, 5.0, 86400)  # 10 HGT pro Tag
        home[(date(2026, 11, 2) + timedelta(days=i)).isoformat()] = d
    assert heating_degree_days(list(home.values())) == 70.0
    cur = {"hdd": 70.0, "total": {"valve_h": 90.0}}
    prev = {"hdd": 50.0, "total": {"valve_h": 80.0}}
    assert compare(cur, prev) == -20  # 1,29 vs 1,6 Ventil-h je HGT
    assert compare({"hdd": 2, "total": {"valve_h": 1}}, prev) is None


def test_prune():
    days = {"2025-01-01": {}, "2026-11-01": {}}
    prune(days, date(2026, 11, 2))
    assert list(days) == ["2026-11-01"]


def test_week_message():
    msg = week_message(
        {"total": {"heating_h": 34, "setback_h": 11, "saving_pct": 4.2, "on_target_pct": 94},
         "rooms": {"Bad": {"humid_h": 6}, "Küche": {"humid_h": 1}}},
        -12,
    )
    assert "34 Heizstunden" in msg and "−12 %" in msg and "Bad 6 h zu feucht" in msg and "Küche" not in msg


def test_battery():
    issues = check_battery({"Bad Thermostat": 15, "Küche Thermostat": 8, "Wohnzimmer": 80})
    assert [i.severity for i in issues] == ["warn", "alert"]


def test_not_warming():
    hist = [HistoryPoint(T0 + timedelta(minutes=m), 85.0, 18.0 + m * 0.001, 21.0, True) for m in range(0, 121, 5)]
    assert check_not_warming(hist, T0 + timedelta(minutes=120)) is not None
    warming = [HistoryPoint(T0 + timedelta(minutes=m), 85.0, 18.0 + m * 0.01, 21.0, True) for m in range(0, 121, 5)]
    assert check_not_warming(warming, T0 + timedelta(minutes=120)) is None
    short = hist[:10]
    assert check_not_warming(short, T0 + timedelta(minutes=45)) is None
    window = [HistoryPoint(p.when, p.valve, p.temp, p.target, False) for p in hist]
    assert check_not_warming(window, T0 + timedelta(minutes=120)) is None


def test_sensor_radio_window():
    assert check_sensor_frozen(13, 2.0) is not None
    assert check_sensor_frozen(13, 0.4) is None
    assert check_radio(0, True).severity == "alert"
    assert check_radio(3, False).severity == "warn"
    assert check_radio(1, False) is None
    assert check_window(None, 3).code == "window_sensor"
    assert check_window(30, None).code == "window_open_long"
    assert check_window(2, 0.5) is None


def test_sensor_missing_and_connection():
    from rk.health import check_connection, check_sensor_missing
    assert check_sensor_missing(None) is None
    assert check_sensor_missing(0.5) is None
    assert check_sensor_missing(6.2).code == "sensor_missing"
    assert check_connection(5, 7) is None
    c = check_connection(34, 6.7)
    assert c.severity == "info" and "34×" in c.message and "~7 s" in c.message
