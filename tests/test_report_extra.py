"""Zusatz-Auswertungen des PDF-Berichts."""

from datetime import date, datetime, timedelta

from custom_components.raumklima import report_extra as rx
from custom_components.raumklima.report_data import build
from custom_components.raumklima.report_pdf import render
from custom_components.raumklima.stats import RoomSample, add_home_sample, add_room_sample, summarize

TODAY = date(2026, 11, 1)  # Sonntag


def _rooms(days=28, night_heat=False, humid=False, warm=False):
    rooms = {"Bad": {}, "Wohnzimmer": {}, "Schlafzimmer": {}}
    home = {}
    for i in range(days):
        d = TODAY - timedelta(days=i)
        key = d.isoformat()
        for name, r in rooms.items():
            day = r.setdefault(key, {})
            for h in range(24):
                heat = (7 <= h <= 21) or (night_heat and h < 5)
                if name == "Bad":
                    heat = heat and h % 2 == 0  # Bad heizt weniger
                temp = 23.0 if warm and name == "Wohnzimmer" else 20.5
                hum = 76.0 if humid and name == "Bad" else 50.0
                add_room_sample(day, RoomSample(heat, 50.0 if heat else 0.0, "normal", 21.0, 21.0, True, False, temp, hum, 70.0, False, False, co2=1100.0 if name == "Schlafzimmer" and h < 7 else 600.0, hour=h), 3600)
            day["airings"] = 3
            day["airings_long"] = 1 if name == "Wohnzimmer" else 0
            day["vent_open_n"] = 2
            day["vent_done_n"] = 1
        for h in range(24):
            add_home_sample(home.setdefault(key, {}), d.weekday() < 5 and 8 <= h < 17, 4.0, 3600)
    return rooms, home


def test_heatmap_and_night_ratio():
    rooms, _ = _rooms(night_heat=True)
    grid = rx.heatmap(rooms, TODAY - timedelta(days=6), TODAY)
    assert len(grid) == 7 and len(grid[0]) == 24
    assert grid[0][3] > 0.5 and grid[0][6] == 0.0
    assert rx.night_ratio(grid) >= 0.6
    rooms2, _ = _rooms()
    assert rx.night_ratio(rx.heatmap(rooms2, TODAY - timedelta(days=6), TODAY)) == 0.0


def test_heatmap_none_without_hourly_data():
    assert rx.heatmap({"Bad": {TODAY.isoformat(): {"seconds": 3600}}}, TODAY, TODAY) is None


def test_humidity_light_and_problem_room():
    rooms, home = _rooms(humid=True)
    cur = summarize(rooms, home, TODAY - timedelta(days=6), TODAY)
    assert rx.humidity_light(cur["rooms"]["Bad"], 1) == "red"
    assert rx.humidity_light(cur["rooms"]["Wohnzimmer"], 1) == "green"
    assert rx.problem_room(cur) == "Bad"


def test_weekday_weekend_split():
    rooms, home = _rooms()
    wk = rx.weekday_weekend(rooms, home, TODAY - timedelta(days=6), TODAY)
    assert wk["weekday"]["days"] == 5 and wk["weekend"]["days"] == 2
    assert wk["weekday"]["away_h"] == 9.0 and wk["weekend"]["away_h"] == 0.0


def test_ranking_and_score():
    rooms, home = _rooms(warm=True)
    cur = summarize(rooms, home, TODAY - timedelta(days=6), TODAY)
    rank = rx.ranking(cur, None)
    assert rank["eco"][0] == "Bad"
    assert rank["warm"] == ("Wohnzimmer", 23.0)
    points, grade = rx.score(cur)
    assert 0 <= points <= 100 and grade in "ABCDEF"
    hist = rx.score_history(rooms, home, "week", TODAY, 4)
    assert len(hist) == 4 and hist[-1][0] == "W44"


def test_money_and_tips():
    rooms, home = _rooms(warm=True, night_heat=True)
    cur = summarize(rooms, home, TODAY - timedelta(days=6), TODAY)
    assert rx.money(cur, None) is None
    m = rx.money(cur, 1300)
    assert m["per_degree_year"] == 78
    daily = [{"date": (TODAY - timedelta(days=i)).isoformat(), "heating_h": 10, "outdoor": 16.0} for i in range(3)]
    tips = rx.saving_tips(cur, daily, rx.heatmap(rooms, TODAY - timedelta(days=6), TODAY), 1300, {}, "de")
    text = " ".join(tips)
    assert "Wohnzimmer lag im Schnitt bei 23,0 °C" in text
    assert "Nachts (0–5 Uhr)" in text
    assert "3 milden Tagen" in text
    assert "≈ 78 € im Jahr" in text


def test_season_highlights():
    daily = [
        {"date": "2025-10-01", "heating_h": 0, "outdoor": 14.0, "recorded": True},
        {"date": "2025-10-02", "heating_h": 5, "outdoor": 8.0, "recorded": True},
        {"date": "2025-10-03", "heating_h": 0, "outdoor": 12.0, "recorded": True},
        {"date": "2025-10-04", "heating_h": 0, "outdoor": 13.0, "recorded": True},
        {"date": "2025-10-05", "heating_h": 0, "outdoor": 13.0, "recorded": True},
        {"date": "2025-10-06", "heating_h": 9, "outdoor": -3.0, "recorded": True},
    ]
    hl = rx.season_highlights(daily, [{"date": "2025-10-01", "heating_h": 14}])
    assert hl["first"] == "2025-10-02" and hl["last"] == "2025-10-06"
    assert hl["coldest"] == ("2025-10-06", -3.0)
    assert hl["pause"] == (3, "2025-10-05")
    assert hl["top_month"] == ("2025-10-01", 14)


def test_airing_rows():
    rooms, home = _rooms()
    cur = summarize(rooms, home, TODAY - timedelta(days=6), TODAY)
    rows = {r["room"]: r for r in rx.airing_rows(cur)}
    assert rows["Wohnzimmer"]["long"] == 7
    assert rows["Bad"]["success_pct"] == 50


def test_full_report_renders_all_sections():
    rooms, home = _rooms(days=60, humid=True, night_heat=True)
    extras = {"annual_cost": 1400, "room_types": {"Bad": "bathroom"}, "heatup": {"Bad": 25}, "batteries": {"Bad": {"Bad Fühler": 12.0}}}
    for kind, start in (("week", TODAY - timedelta(days=6)), ("month", date(2026, 10, 1)), ("season", date(2026, 9, 1))):
        for lang in ("de", "en"):
            data = build(rooms, home, kind, start, TODAY if kind != "month" else date(2026, 10, 31), [], lang, extras=extras)
            assert data["heatmap"] and data["score"] and data["money"] and data["tips"]
            assert data["co2"]["Schlafzimmer"]["high_h"] > 0
            if kind == "season":
                assert data["highlights"]
            pdf = render(data, "Berlin", datetime(2026, 11, 1, 18))
            assert pdf[:4] == b"%PDF"
