"""PDF-Bericht: Inhalt und Zeichnen ohne Home Assistant."""

from datetime import date, datetime, timedelta

from custom_components.raumklima.report_data import build, findings, report_lang
from custom_components.raumklima.report_pdf import clean, render
from custom_components.raumklima.stats import RoomSample, add_home_sample, add_room_sample

TODAY = date(2026, 11, 1)


def _data(days: int = 60, humidity: float = 55.0, mold: bool = False):
    rooms = {"Bad": {}, "Wohnzimmer": {}}
    home = {}
    for i in range(days):
        key = (TODAY - timedelta(days=i)).isoformat()
        for name, r in rooms.items():
            day = r.setdefault(key, {})
            for h in range(24):
                add_room_sample(day, RoomSample(h % 2 == 0, 40.0, "normal", 21.0, 21.0, True, False, 20.8, humidity if name == "Bad" else 50.0, 70.0, mold, False), 3600)
        for _h in range(24):
            add_home_sample(home.setdefault(key, {}), False, 5.0, 3600)
    return rooms, home


def test_lang():
    assert report_lang("de") == "de"
    assert report_lang("de-CH") == "de"
    assert report_lang("fr") == "fr"
    assert report_lang("it") == "en"
    assert report_lang(None) == "en"


def test_findings_humid_and_mold():
    rooms, home = _data(humidity=78.0, mold=True)
    data = build(rooms, home, "week", TODAY - timedelta(days=6), TODAY, [], "de")
    texts = " ".join(t for _, t in data["findings"])
    assert "Bad: 168 h über der Feuchtegrenze" in texts
    assert "Schimmelrisiko" in texts
    assert data["findings"][0][0] == "alert"


def test_findings_fine_and_issues_en():
    rooms, home = _data()
    data = build(rooms, home, "month", date(2026, 10, 1), date(2026, 10, 31), [{"room": "Bad", "title": "Battery low", "severity": "warn"}], "en")
    texts = [t for _, t in data["findings"]]
    assert "Bad: Battery low" in texts
    data["findings"] = findings(data, [], "en")
    assert any("Nothing unusual" in t for _, t in data["findings"])


def test_render_pdf_de_en_and_empty():
    rooms, home = _data()
    for lang in ("de", "en", "fr"):
        for kind, start in (("week", TODAY - timedelta(days=6)), ("month", date(2026, 10, 1)), ("season", date(2026, 10, 1))):
            pdf = render(build(rooms, home, kind, start, TODAY, [], lang), "Wohnung A", datetime(2026, 11, 1, 18))
            assert pdf[:4] == b"%PDF" and len(pdf) > 3000
    empty = render(build({}, {}, "week", TODAY - timedelta(days=6), TODAY, [], "de"), "", datetime(2026, 11, 1))
    assert empty[:4] == b"%PDF"


def test_clean_keeps_german_and_replaces_rest():
    assert clean("Bäder – „ok“ 21,5 °C €") == "Bäder – „ok“ 21,5 °C €"
    assert clean("CO₂ → ≈ 5 % 📊") == "CO2 -> ~ 5 %"


def test_energy_page_data_and_pdf() -> None:
    rooms, home = _data()
    extras = {
        "energy": {
            "enabled": True,
            "source": "oil",
            "meter": "sensor.oil",
            "meter_unit": "L",
            "kwh": 5000,
            "liter": 500,
            "price": 0.11,
            "base": 10,
            "oil_price": 1.10,
            "tank": {
                "current_l": 1200,
                "current_percent": 40,
                "days_left": 21,
                "order": False,
                "consumed_l": 50,
                "threshold_l": 600,
            },
            "pv_kwh": 100,
            "heat_kwh": 200,
        }
    }
    data = build(rooms, home, "week", TODAY - timedelta(days=6), TODAY, [], "de", extras=extras)
    assert data["energy"]["source"] == "oil"
    assert data["energy"]["tank"]["current_l"] == 1200
    pdf = render(data, "Wohnung A", datetime(2026, 11, 1, 18))
    assert pdf[:4] == b"%PDF" and len(pdf) > 3000


def _heatpump_extras():
    daily = [
        {"date": (TODAY - timedelta(days=i)).isoformat(), "kwh": 8.0 + i % 4, "ww": 2.0, "cost": 3.1, "outdoor": 4.0 + i % 5}
        for i in range(29, -1, -1)
    ]
    return {
        "energy": {
            "enabled": True, "source": "heatpump", "meter": "sensor.wp_strom", "meter_unit": "kWh",
            "kwh": 300.0, "ww_kwh": 60.0, "heat_kwh": 1230.0, "ww_heat_kwh": 198.0, "cop": 4.1, "cop_ww": 3.3,
            "price": 0.33, "price_paid": 0.31, "price_avg": 0.34, "cheap_share": 38, "tariff_dynamic": True,
            "cost_energy": 101.6, "self_kwh": 25.0, "house_kwh": 1300.0, "house_share": 27.7, "base": 15.0,
            "tariff": "sensor.preis", "tariff_fallbacks": ["sensor.epex"], "ww_meter": "sensor.ww",
            "house_entity": "sensor.haus", "grid_entity": "sensor.netz", "days": 30, "daily": daily,
        }
    }


def test_heatpump_report_story_rooms_and_mail() -> None:
    """Neuer Bericht: Kurzfassung, Kosten je Raum, Warmwasser und E-Mail-Text (de/en/fr)."""
    from custom_components.raumklima.report_extra import mail_text

    rooms, home = _data()
    for lang in ("de", "en", "fr"):
        data = build(rooms, home, "month", date(2026, 10, 2), TODAY, [], lang, extras=_heatpump_extras())
        assert data["money"]["period_cost"] > 100
        assert data["room_costs"] and abs(sum(r["share"] for r in data["room_costs"]) - 100) < 0.5
        assert len(data["story"]) >= 3
        text = mail_text(data, lang)
        assert data["story"][0] in text and "PDF" in text
        pdf = render(data, "Wohnung A", datetime(2026, 11, 1, 18))
        assert pdf[:4] == b"%PDF" and len(pdf) > 5000
    de = build(rooms, home, "week", TODAY - timedelta(days=6), TODAY, [], "de", extras=_heatpump_extras())
    assert any("Warmwasser eingeschlossen" in s for s in de["story"])
    assert any("Wärmepumpe" in s for s in de["story"])
