"""Heizöl-Tank: Verbrauch aus fallendem Füllstand und Bestellhinweis."""

from __future__ import annotations

from datetime import date

from custom_components.raumklima.oil_tank import liters_from_level, percent_from_level, tank_summary


def test_level_conversion() -> None:
    assert liters_from_level(1500, "L", 3000) == 1500
    assert liters_from_level(2, "m³", 0) == 2000
    assert liters_from_level(50, "%", 3000) == 1500
    assert liters_from_level(50, "%", 0) is None
    assert percent_from_level(1500, "L", 3000) == 50


def test_tank_consumption_and_remaining_days() -> None:
    today = date(2026, 1, 15)
    history = [
        (date(2026, 1, 1), 3000),
        (date(2026, 1, 2), 2980),
        (date(2026, 1, 3), 2960),
    ]
    out = tank_summary(
        history,
        2500,
        "L",
        capacity_l=3000,
        min_percent=20,
        factor_kwh_per_l=10,
        oil_price_per_l=1.10,
        today=today,
    )
    assert out is not None
    assert out["current_l"] == 2500
    assert out["current_percent"] == 83.3
    assert out["consumed_l"] == 500
    assert out["consumed_kwh"] == 5000
    assert out["cost"] == 550
    assert out["avg_l_day"] == 35.71
    assert out["threshold_l"] == 600
    assert out["days_left"] == 53
    assert out["order"] is False


def test_refill_is_not_negative_consumption() -> None:
    today = date(2026, 1, 20)
    history = [
        (date(2026, 1, 10), 3000),
        (date(2026, 1, 11), 2800),
        (date(2026, 1, 12), 3100),  # Lieferung
        (date(2026, 1, 13), 3000),
    ]
    out = tank_summary(
        history,
        2900,
        "L",
        capacity_l=3000,
        min_percent=20,
        factor_kwh_per_l=10,
        oil_price_per_l=1.10,
        today=today,
    )
    assert out is not None
    assert out["consumed_l"] == 400
    assert out["consumed_kwh"] == 4000
    assert out["order"] is False


def test_percent_tank_without_capacity_orders_at_threshold() -> None:
    out = tank_summary(
        [(date(2026, 1, 1), 30), (date(2026, 1, 2), 25)],
        18,
        "%",
        capacity_l=0,
        min_percent=20,
        factor_kwh_per_l=10,
        oil_price_per_l=1.10,
        today=date(2026, 1, 3),
    )
    assert out is not None
    assert out["current_percent"] == 18
    assert out["current_l"] is None
    assert out["order"] is True


def test_unsupported_unit_does_not_invent_numbers() -> None:
    out = tank_summary([(date(2026, 1, 1), 120)], 110, "cm", capacity_l=3000, today=date(2026, 1, 2))
    assert out is not None
    assert out["supported"] is False
    assert out["current_l"] is None
    assert out["current_percent"] is None


def test_tank_jitter_is_not_consumption() -> None:
    """±20 l Auf/Ab am Tag dürfen nicht als Verbrauch gezählt werden."""
    today = date(2026, 2, 1)
    history = [
        (date(2026, 1, 25), 3000),
        (date(2026, 1, 26), 3020),
        (date(2026, 1, 27), 2980),
        (date(2026, 1, 28), 3010),
        (date(2026, 1, 29), 2990),
    ]
    out = tank_summary(
        history,
        2950,
        "L",
        capacity_l=3000,
        min_percent=20,
        factor_kwh_per_l=10,
        oil_price_per_l=1.10,
        today=today,
    )
    assert out is not None
    assert out["consumed_l"] == 50
    assert out["consumed_kwh"] == 500
