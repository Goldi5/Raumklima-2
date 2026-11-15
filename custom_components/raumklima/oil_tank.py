"""Heizöl-Tank: Füllstand, Verbrauch und Bestellhinweis (ohne Home Assistant).

Der Tankfüllstand ist kein kumulativer Zähler: Er fällt beim Heizen und steigt beim
Nachfüllen. Für den Verbrauch zählen deshalb nur Rückgänge; ein Sprung nach oben wird
als Lieferung ignoriert. Die tägliche Statistik glättet Messrauschen.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

LITERS_UNITS = {"l", "liter", "liters", "litre", "litres"}
M3_UNITS = {"m3", "m^3"}
PERCENT_UNITS = {"%", "percent"}
ORDER_DAYS = 14


def _unit(unit: str | None) -> str:
    return (unit or "").strip().lower().replace("³", "3")


def liters_from_level(value: float | None, unit: str | None, capacity_l: float) -> float | None:
    """Füllstand in Liter – Liter, m³ oder Prozent mit Tankinhalt."""
    if value is None:
        return None
    u = _unit(unit)
    try:
        amount = float(value)
    except (TypeError, ValueError):
        return None
    if u in LITERS_UNITS:
        return amount
    if u in M3_UNITS:
        return amount * 1000.0
    if u in PERCENT_UNITS and capacity_l > 0:
        return amount / 100.0 * capacity_l
    return None


def price_per_litre(
    value: float | None,
    unit: str | None,
    factor_kwh_per_l: float = 10.0,
) -> float | None:
    """Preis auf €/Liter normalisieren – €/L, ct/L, €/m³ oder €/kWh."""
    if value is None:
        return None
    u = _unit(unit)
    try:
        amount = float(value)
    except (TypeError, ValueError):
        return None
    if u in ("eur/l", "eur/liter", "€/l", "€/liter"):
        return amount
    if u in ("ct/l", "ct/liter", "cent/l"):
        return amount / 100.0
    if u in ("eur/m3", "eur/m^3", "€/m3"):
        return amount / 1000.0
    if u in ("eur/kwh", "€/kwh"):
        return amount * (factor_kwh_per_l or 10.0)
    return None


def percent_from_level(value: float | None, unit: str | None, capacity_l: float) -> float | None:
    """Füllstand in Prozent – Prozent direkt, Liter/m³ über den Tankinhalt."""
    if value is None:
        return None
    u = _unit(unit)
    try:
        amount = float(value)
    except (TypeError, ValueError):
        return None
    if u in PERCENT_UNITS:
        return amount
    liters = liters_from_level(value, unit, capacity_l)
    if liters is None or capacity_l <= 0:
        return None
    return liters / capacity_l * 100.0


def tank_summary(
    history: list[tuple[date, float]] | None,
    current_value: float | None,
    unit: str | None,
    capacity_l: float = 0.0,
    min_percent: float = 20.0,
    factor_kwh_per_l: float = 10.0,
    oil_price_per_l: float = 0.0,
    today: date | None = None,
) -> dict[str, Any] | None:
    """Tankzustand, Verbrauch der letzten 14 Tage und Restlaufzeit schätzen."""
    today = today or date.today()
    capacity = max(0.0, float(capacity_l or 0.0))
    minimum = max(0.0, min(100.0, float(min_percent or 0.0)))
    factor = float(factor_kwh_per_l or 0.0)
    price = max(0.0, float(oil_price_per_l or 0.0))

    current_l = liters_from_level(current_value, unit, capacity)
    current_pct = percent_from_level(current_value, unit, capacity)

    points: list[tuple[date, float | None, float | None]] = []
    for day, value in history or []:
        liters = liters_from_level(value, unit, capacity)
        percent = percent_from_level(value, unit, capacity)
        if liters is not None or percent is not None:
            points.append((day, liters, percent))
    if current_value is not None:
        points = [p for p in points if p[0] < today]
        points.append((today, current_l, current_pct))
    points.sort(key=lambda p: p[0])
    if current_value is None and points:
        current_l, current_pct = points[-1][1], points[-1][2]
    if points:
        first = points[-1][0] - timedelta(days=14)
        points = [p for p in points if p[0] >= first]

    span = max(1, (points[-1][0] - points[0][0]).days) if len(points) > 1 else 1

    # Verbrauch pro Segment zwischen zwei Tankfüllungen. Ein Segment endet nur bei
    # einem echten Füllstandssprung; normales Prellen (±20 l) hebt sich in der
    # Netto-Differenz auf.
    segments: list[list[tuple[date, float | None, float | None]]] = []
    for point in points:
        if not segments:
            segments.append([point])
            continue
        prev = segments[-1][-1]
        refill = False
        if prev[1] is not None and point[1] is not None:
            refill = point[1] > prev[1] + max(50.0, capacity * 0.03)
        elif prev[2] is not None and point[2] is not None:
            refill = point[2] > prev[2] + 3.0
        if refill:
            segments.append([point])
        else:
            segments[-1].append(point)

    consumed_l = None
    consumed_pct = None
    liter_segments = [seg for seg in segments if all(p[1] is not None for p in seg)]
    if len(points) > 1 and liter_segments:
        consumed_l = sum(max(0.0, seg[0][1] - seg[-1][1]) for seg in liter_segments)
    pct_segments = [seg for seg in segments if all(p[2] is not None for p in seg)]
    if len(points) > 1 and pct_segments:
        consumed_pct = sum(max(0.0, seg[0][2] - seg[-1][2]) for seg in pct_segments)

    avg_l_day = consumed_l / span if consumed_l is not None else None
    avg_pct_day = consumed_pct / span if consumed_pct is not None else None
    threshold_l = capacity * minimum / 100.0 if capacity > 0 else None

    days_left = None
    if avg_l_day and avg_l_day > 0 and current_l is not None and threshold_l is not None:
        days_left = max(0.0, (current_l - threshold_l) / avg_l_day)
    elif avg_pct_day and avg_pct_day > 0 and current_pct is not None:
        days_left = max(0.0, (current_pct - minimum) / avg_pct_day)

    order = bool(
        (current_pct is not None and current_pct <= minimum)
        or (current_l is not None and threshold_l is not None and current_l <= threshold_l)
        or (days_left is not None and days_left <= ORDER_DAYS)
    )
    supported = current_l is not None or current_pct is not None
    return {
        "supported": supported,
        "unit": unit,
        "capacity_l": capacity or None,
        "min_percent": minimum,
        "current": current_value,
        "current_l": round(current_l, 1) if current_l is not None else None,
        "current_percent": round(current_pct, 1) if current_pct is not None else None,
        "threshold_l": round(threshold_l, 1) if threshold_l is not None else None,
        "consumed_l": round(consumed_l, 1) if consumed_l is not None else None,
        "consumed_kwh": round(consumed_l * factor, 1) if consumed_l is not None and factor > 0 else None,
        "cost": round(consumed_l * price, 2) if consumed_l is not None and price > 0 else None,
        "avg_l_day": round(avg_l_day, 2) if avg_l_day is not None else None,
        "avg_percent_day": round(avg_pct_day, 2) if avg_pct_day is not None else None,
        "days_left": round(days_left) if days_left is not None else None,
        "order": order,
        "enough_data": len(points) > 1 and span >= 1,
    }
