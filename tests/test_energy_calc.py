"""Energie-Rechnungen: Preise, Preisvorschau, Kosten je Stunde."""

from __future__ import annotations

from datetime import UTC, datetime

from custom_components.raumklima.energy_calc import (
    battery_shares,
    computed_house,
    heat_prices,
    heating_curve,
    hourly_cost,
    house_bill,
    parse_forecast,
    ratio,
    self_share,
    shift_potential,
    short_label,
    split_total,
    step_means,
    suggest_from_ha_energy,
    tariff_to_kwh,
    week_grid,
)
from custom_components.raumklima.report_extra import money


def test_tariff_units_and_net():
    assert tariff_to_kwh(32.0, "ct/kWh") == 0.32
    assert tariff_to_kwh(120.0, "€/MWh") == 0.12
    assert tariff_to_kwh(1.10, "€/m³", factor=11.0) == 0.1
    assert tariff_to_kwh(0.10, "€/kWh", basis="net", vat=19, extra=0.15) == round(0.25 * 1.19, 5)


def test_forecast_formats():
    """EPEX Spot (data), 1KOMMA5° (forecast), Nordpool (raw_today) und Tibber (startsAt/total)."""
    attrs = {
        "data": [{"start_time": "2026-11-15T21:00:00+01:00", "end_time": "2026-11-15T22:00:00+01:00", "price_per_kwh": 0.32}],
        "forecast": [{"datetime": "2026-11-15T21:15:00+00:00", "price": 0.31}],
        "raw_today": [{"start": "2026-11-15T22:00:00+00:00", "end": "2026-11-15T23:00:00+00:00", "value": 0.30}],
        "today": [{"startsAt": "2026-11-15T23:00:00.000+00:00", "total": 0.29}, "kaputt"],
    }
    points = parse_forecast(attrs)
    assert [p for _, p in points] == [0.32, 0.31, 0.30, 0.29]
    assert points[0][0] == datetime(2026, 11, 15, 20, 0, tzinfo=UTC)
    assert parse_forecast({}) == [] and parse_forecast(None) == []


def test_hourly_cost_weighs_each_hour():
    """Kosten = Σ kWh × Stundenpreis, PV/Batterie-Anteil kostet nichts."""
    rows = [
        {"ts": 1, "day": "d", "kwh": 2.0, "price": 0.20},
        {"ts": 2, "day": "d", "kwh": 1.0, "ww": 1.0, "price": 0.40, "self": 0.5},
        {"ts": 3, "day": "d", "kwh": 1.0, "price": None},
        {"ts": 4, "day": "d", "kwh": 0.0, "price": 0.50},
    ]
    out = hourly_cost(rows, fallback_price=0.30)
    assert out["kwh"] == 5.0
    assert out["self_kwh"] == 1.0
    assert out["cost"] == round(2 * 0.2 + 1 * 0.4 + 1 * 0.3, 2)
    # ungewichteter Mittelwert der Preise ≠ bezahlter Preis
    assert out["price_avg"] == round((0.2 + 0.4 + 0.5) / 3, 4)
    assert out["price_paid"] == round(out["cost"] / 4.0, 4)
    assert out["daily"]["d"] == {"kwh": 4.0, "ww": 1.0, "cost": out["cost"]}


def test_step_means_time_weighted():
    pts = [(0.0, 0.2), (1800.0, 0.4), (5400.0, 0.1)]
    out = step_means(pts, [0.0, 3600.0, -3600.0])
    assert out[0.0] == 0.3
    assert round(out[3600.0], 4) == 0.25
    assert -3600.0 not in out


def test_self_share_and_ratio():
    assert self_share(10.0, 4.0) == 0.6
    assert self_share(0.0, 1.0) is None
    assert self_share(5.0, 9.0) == 0.0
    assert ratio(41.0, 10.0) == 4.1
    assert ratio(5.0, 0.5) is None  # zu wenig Strom für eine Aussage


def test_money_counts_hot_water_and_weighted_cost():
    cur = {"hdd": 100.0, "total": {"saving_pct": 0.0}}
    energy = {"kwh": 100.0, "ww_kwh": 20.0, "price": 0.30, "cost_energy": 30.0, "days": 30, "base": 0.0, "source": "heatpump"}
    out = money(cur, None, energy)
    assert out["period_cost"] == 30.0
    assert out["kwh"] == 120.0
    # Hochrechnung: Heizung nach Gradtagen, Warmwasser nach Tagen
    from custom_components.raumklima.report_extra import REF_HDD
    expected = 30.0 * (100 / 120) * REF_HDD / 100 + 30.0 * (20 / 120) * 365 / 30
    assert out["annual"] == round(expected, 2)


def test_money_base_fee_share_by_usage():
    cur = {"hdd": 100.0, "total": {"saving_pct": 0.0}}
    energy = {"kwh": 100.0, "price": 0.30, "days": 30.44, "base": 20.0, "base_share": "usage", "house_kwh": 400.0}
    out = money(cur, None, energy)
    assert out["period_cost"] == round(100 * 0.30 + 20.0 * 30 / 30.44 * 0.25, 2)


def test_split_total_meter():
    """Zähler misst Heizung + Warmwasser: Warmwasser teilt nur auf."""
    assert split_total(100.0, 30.0) == (70.0, 30.0)
    assert split_total(20.0, 30.0) == (0.0, 20.0)
    assert split_total(50.0, None) == (50.0, None)
    assert split_total(50.0, -3.0) == (50.0, 0.0)


def test_short_label():
    raw = "Heartbeat Electricity Price 0323a81a-29e5-45fa-87f7-9c6e5c70c639"
    assert short_label(raw) == "Heartbeat Electricity Price"
    assert short_label("EPEX Spot Data Total Price", "Energy-Charts.info (DE-LU)") == "EPEX Spot Data Total Price · Energy-Charts.info (DE-LU)"
    assert short_label("Tibber Preis Tibber", "Tibber") == "Tibber Preis Tibber"
    # gleicher Name, nur anders geschrieben – nicht doppelt anhängen
    assert short_label("Heartbeat Max - Mustermann Electricity Price", "Max Mustermann") == "Heartbeat Max - Mustermann Electricity Price"


def test_money_no_degree_day_forecast_with_short_outdoor_history():
    """Zähler seit einem Jahr, Außentemperatur erst seit zwei Wochen: keine Gradtag-Hochrechnung."""
    cur = {"hdd": 120.0, "total": {"saving_pct": 0.0}}
    year = {"kwh": 5000.0, "price": 0.30, "cost_energy": 900.0, "days": 365, "base": 0.0, "outdoor_days": 15}
    out = money(cur, None, year)
    assert out["annual"] == 900.0  # ein ganzes Jahr gemessen: das ist die Jahreszahl
    short = {**year, "days": 120}
    out = money(cur, None, short)
    assert out["annual"] is None and out["per_degree_year"] is None
    good = {**year, "days": 30, "outdoor_days": 30}
    assert money(cur, None, good)["annual"] is not None


def test_battery_charged_from_grid_is_not_free():
    """Akku nachts aus dem Netz geladen (20 ct), morgens entladen: kostet den Ladepreis, nicht 0."""
    hours = [
        # Nacht: Haus 1 kWh, Netz 5 kWh, Akku lädt 4 kWh – 4 kWh aus dem Netz in den Akku
        {"ts": 0, "house": 1.0, "grid": 5.0, "charge": 4.0, "discharge": 0.0, "price": 0.20},
        # Morgen: Haus 2 kWh, nichts aus dem Netz, Akku entlädt 2 kWh
        {"ts": 3600, "house": 2.0, "grid": 0.0, "charge": 0.0, "discharge": 2.0, "price": 0.40},
    ]
    sums = battery_shares(hours)
    assert sums["grid_charge"] == 4.0
    assert hours[0]["self"] == 0.0
    assert hours[1]["batt"] == 1.0 and hours[1]["self"] == 0.0
    assert hours[1]["batt_price"] == 0.20
    rows = [{"ts": 3600, "day": "d", "kwh": 1.0, "price": 0.40, **{k: hours[1][k] for k in ("self", "batt", "batt_price")}}]
    out = hourly_cost(rows, 0.30)
    assert out["cost"] == 0.20 and out["batt_kwh"] == 1.0 and out["self_kwh"] == 0.0


def test_battery_with_pv_stays_free():
    """Tagsüber mit PV geladen (kein Netzbezug), abends entladen: kostenlos."""
    hours = [
        {"ts": 0, "house": 1.0, "grid": 0.0, "charge": 3.0, "discharge": 0.0, "price": 0.30},
        {"ts": 3600, "house": 2.0, "grid": 0.0, "charge": 0.0, "discharge": 2.0, "price": 0.45},
    ]
    battery_shares(hours)
    assert hours[1]["self"] == 1.0 and hours[1]["batt"] == 0.0


def test_week_grid_and_shift():
    from datetime import datetime as dt

    rows = []
    for h in range(24):
        local = dt(2026, 11, 16, h)  # Montag
        rows.append({"ts": h, "day": "2026-11-16", "local": local, "kwh": 1.0, "price": 0.20 if h < 6 else 0.40})
    grid = week_grid(rows)
    assert grid["kwh"][0][3] == 1.0 and grid["kwh"][1][3] is None
    assert grid["price"][2] == 0.20
    # 24 kWh: bezahlt 6×0,20 + 18×0,40 = 8,40 €; alles im günstigsten Viertel: 24×0,20 = 4,80 €
    assert shift_potential(rows) == 3.6


def test_heating_curve():
    days = [{"outdoor": t, "kwh": 40 - 3 * t} for t in (2, 4, 5, 6, 7, 8, 10)]
    curve = heating_curve(days)
    assert curve["per_kelvin"] == 3.0 and curve["limit"] == 13.3 and curve["r2"] == 1.0
    assert heating_curve(days[:5]) is None


def test_heat_prices_compare():
    out = heat_prices("heatpump", 0.05, 0.09, gas=0.11, oil_l=1.10, power=0.30)
    ids = [x["id"] for x in out]
    assert ids == ["own", "own_grid", "gas", "oil"]
    assert out[2]["ct"] == 12.2
    gas_home = heat_prices("gas", 0.12, None, gas=0.11, oil_l=1.10, power=0.30)
    assert [x["id"] for x in gas_home] == ["own", "heatpump", "oil"]


def test_house_bill_with_feed_in():
    """Ganzes Haus: Netzbezug × Stundenpreis + Grundgebühr − Einspeisevergütung."""
    out = house_bill(240.0, 90.0, 3.45, 7, house_kwh=320.0, feed_kwh=40.0, feed_price=0.0758, heat_cost=47.5)
    assert out["bill"] == 93.45
    assert out["feed_eur"] == 3.03
    assert out["net"] == 90.42
    assert out["price_avg"] == 0.375
    assert out["self_share"] == 25
    assert out["rest_cost"] == 42.5
    assert house_bill(10.0, 3.0, 1.0, 1)["feed_eur"] is None


def test_suggest_from_ha_energy_current_and_old_format():
    prefs = {
        "energy_sources": [
            {"type": "grid", "stat_energy_from": "sensor.netz_in", "entity_energy_price": "sensor.preis",
             "stat_energy_to": "sensor.netz_out", "number_energy_price_export": 0.08},
            {"type": "solar", "stat_energy_from": "sensor.pv"},
            {"type": "battery", "stat_energy_from": "sensor.akku_aus", "stat_energy_to": "sensor.akku_ein"},
        ],
        "device_consumption": [{"stat_consumption": "sensor.kuehlschrank", "name": "Kühlschrank"},
                               {"stat_consumption": "sensor.wp_strom", "name": "Wärmepumpe"}],
    }
    got = {x["key"]: x["value"] for x in suggest_from_ha_energy(prefs, "heatpump")}
    assert got == {
        "energy_grid_entity": "sensor.netz_in", "energy_tariff": "sensor.preis",
        "energy_feed_entity": "sensor.netz_out", "energy_feed_price": 0.08, "pv_entity": "sensor.pv",
        "energy_battery_out_entity": "sensor.akku_aus", "energy_battery_in_entity": "sensor.akku_ein",
        "energy_meter": "sensor.wp_strom",
    }
    old = {"energy_sources": [{"type": "grid", "flow_from": [{"stat_energy_from": "sensor.a", "number_energy_price": 0.3}],
                               "flow_to": [{"stat_energy_to": "sensor.b", "number_energy_price": 0.07}]},
                              {"type": "gas", "stat_energy_from": "sensor.gas", "number_energy_price": 1.2}]}
    got = {x["key"]: x["value"] for x in suggest_from_ha_energy(old, "gas")}
    assert got == {"energy_grid_entity": "sensor.a", "energy_feed_entity": "sensor.b", "energy_feed_price": 0.07,
                   "energy_meter": "sensor.gas", "energy_price": 1.2}
    assert suggest_from_ha_energy(None) == []


def test_computed_house():
    house = computed_house({0: 1.0, 1: 0.0}, {0: 0.0, 1: 3.0}, {1: 1.0}, charge={1: 0.5}, discharge={0: 0.5})
    assert house == {0: 1.5, 1: 1.5}
