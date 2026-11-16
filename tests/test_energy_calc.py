"""Energie-Rechnungen: Preise, Preisvorschau, Kosten je Stunde."""

from __future__ import annotations

from datetime import UTC, datetime

from custom_components.raumklima.energy_calc import (
    hourly_cost,
    parse_forecast,
    ratio,
    self_share,
    short_label,
    split_total,
    step_means,
    tariff_to_kwh,
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
