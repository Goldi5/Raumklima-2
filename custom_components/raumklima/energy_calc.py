"""Energie-Rechnungen ohne Home Assistant – Preise, Preisvorschau, Kosten je Stunde.

Alles hier ist reine Rechnung, damit es ohne laufendes Home Assistant getestet werden kann.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from datetime import datetime
import re
from typing import Any

# Schlüssel, unter denen Preis-Integrationen ihre Vorschau ablegen
#   EPEX Spot (mampfes):  data       = [{start_time, end_time, price_per_kwh}]
#   1KOMMA5° Heartbeat:   forecast   = [{datetime, price}]
#   Nordpool:             raw_today / raw_tomorrow = [{start, end, value}]
#   Tibber (HACS u. a.):  prices / today / tomorrow = [{startsAt, total}]
FORECAST_KEYS = ("data", "forecast", "prices", "raw_today", "raw_tomorrow", "today", "tomorrow")
_START_KEYS = ("start_time", "start", "startsAt", "starts_at", "datetime", "time", "from")
_PRICE_KEYS = ("price_per_kwh", "price", "total", "value", "price_ct_per_kwh")

# Stunden, die zum günstigsten Viertel eines Tages gehören, gelten als „günstig“
CHEAP_QUANTILE = 0.25


def tariff_to_kwh(
    value: float,
    unit: str | None,
    factor: float = 10.0,
    basis: str = "gross",
    vat: float = 0.0,
    extra: float = 0.0,
) -> float:
    """Preis auf €/kWh brutto bringen.

    ct → €, €/MWh → €/kWh, €/m³ bzw. €/L über den Energieinhalt. Bei „netto“ kommt die
    Mehrwertsteuer drauf, ``extra`` (€/kWh, z. B. Netzentgelt) in beiden Fällen.
    """
    u = str(unit or "").lower().replace("³", "3")
    if "ct" in u or "cent" in u:
        value /= 100
    elif "/mwh" in u:
        value /= 1000
    elif "/m3" in u or "/m^3" in u or "/l" in u or "/liter" in u:
        value /= factor or 10.0
    if basis == "net":
        value = (value + extra) * (1 + vat / 100)
    else:
        value = value + extra
    return round(value, 5) if value > 0 else 0.0


def _parse_time(raw: Any) -> datetime | None:
    if isinstance(raw, datetime):
        return raw if raw.tzinfo else None
    if not isinstance(raw, str):
        return None
    try:
        stamp = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return None
    return stamp if stamp.tzinfo else None


def parse_forecast(attrs: Mapping[str, Any] | None) -> list[tuple[datetime, float]]:
    """Preisvorschau aus den Attributen einer Preis-Entität – sortiert, ohne Doppelte."""
    out: dict[datetime, float] = {}
    for key in FORECAST_KEYS:
        items = (attrs or {}).get(key)
        if not isinstance(items, list):
            continue
        for item in items:
            if not isinstance(item, Mapping):
                continue
            start = next((_parse_time(item.get(k)) for k in _START_KEYS if item.get(k) is not None), None)
            price = next((item.get(k) for k in _PRICE_KEYS if item.get(k) is not None), None)
            if start is None or price is None:
                continue
            try:
                out[start] = float(price)
            except (TypeError, ValueError):
                continue
    return sorted(out.items())


def cheap_set(prices: Mapping[Any, float], day_of: Mapping[Any, str]) -> set[Any]:
    """Schlüssel, deren Preis im günstigsten Viertel ihres Tages liegt."""
    by_day: dict[str, list[float]] = {}
    for key, price in prices.items():
        by_day.setdefault(day_of.get(key, ""), []).append(price)
    limits: dict[str, float] = {}
    for day, values in by_day.items():
        values = sorted(values)
        limits[day] = values[max(0, int(len(values) * CHEAP_QUANTILE) - 1)] if values else 0.0
    return {k for k, p in prices.items() if p <= limits.get(day_of.get(k, ""), -1)}


def hourly_cost(
    hours: Iterable[Mapping[str, Any]],
    fallback_price: float,
) -> dict[str, Any]:
    """Kosten aus Stundenwerten: Σ kWh × Preis dieser Stunde.

    Jede Stunde: ``ts`` (Schlüssel), ``day`` (lokales Datum), ``kwh`` (Heizung),
    ``ww`` (Warmwasser), optional ``price`` (€/kWh) und ``self`` (0–1: Anteil, den PV und
    Batterie in dieser Stunde gedeckt haben – kostet nichts).
    """
    rows = list(hours)
    prices = {r["ts"]: float(r["price"]) for r in rows if r.get("price") is not None}
    cheap = cheap_set(prices, {r["ts"]: r.get("day", "") for r in rows})
    total_kwh = billed = cost = cheap_kwh = priced_kwh = self_kwh = 0.0
    daily: dict[str, dict[str, float]] = {}
    for r in rows:
        kwh = max(0.0, float(r.get("kwh") or 0)) + max(0.0, float(r.get("ww") or 0))
        if kwh <= 0:
            continue
        share = max(0.0, min(1.0, float(r.get("self") or 0)))
        price = r.get("price")
        price = float(price) if price is not None else fallback_price
        paid_kwh = kwh * (1 - share)
        total_kwh += kwh
        self_kwh += kwh * share
        billed += paid_kwh
        cost += paid_kwh * price
        if r.get("price") is not None:
            priced_kwh += paid_kwh
            if r["ts"] in cheap:
                cheap_kwh += paid_kwh
        day = daily.setdefault(r.get("day", ""), {"kwh": 0.0, "ww": 0.0, "cost": 0.0})
        day["kwh"] += max(0.0, float(r.get("kwh") or 0))
        day["ww"] += max(0.0, float(r.get("ww") or 0))
        day["cost"] += paid_kwh * price
    plain = [p for p in prices.values()]
    return {
        "kwh": round(total_kwh, 2),
        "billed_kwh": round(billed, 2),
        "self_kwh": round(self_kwh, 2),
        "cost": round(cost, 2),
        "price_paid": round(cost / billed, 4) if billed > 0 else None,
        "price_avg": round(sum(plain) / len(plain), 4) if plain else None,
        "cheap_share": round(100 * cheap_kwh / priced_kwh) if priced_kwh > 0 else None,
        "daily": {d: {k: round(v, 2) for k, v in vals.items()} for d, vals in daily.items()},
    }


def self_share(house_kwh: float | None, grid_kwh: float | None) -> float | None:
    """Anteil des Hausverbrauchs, der nicht aus dem Netz kam (PV, Batterie)."""
    if house_kwh is None or grid_kwh is None or house_kwh <= 0:
        return None
    return max(0.0, min(1.0, 1 - grid_kwh / house_kwh))


def split_total(total: float, ww: float | None) -> tuple[float, float | None]:
    """Gesamtzähler (Heizung + Warmwasser) aufteilen: (Heizung, Warmwasser).

    Der Warmwasser-Zähler teilt nur auf – er wird nie dazugezählt und nie mehr als das Ganze.
    """
    total = max(0.0, float(total))
    if ww is None:
        return round(total, 2), None
    part = max(0.0, min(total, float(ww)))
    return round(total - part, 2), round(part, 2)


def ratio(out: float | None, into: float | None) -> float | None:
    """Arbeitszahl: erzeugte Wärme je kWh Strom – erst ab einer sinnvollen Menge."""
    if out is None or into is None or into < 1.0 or out <= 0:
        return None
    return round(out / into, 2)


def step_means(points: list[tuple[float, float]], starts: Iterable[float], width: float = 3600.0) -> dict[float, float]:
    """Zeitgewichteter Mittelwert einer Treppenfunktion je Zeitfenster [s, s + width).

    ``points``: (Zeitstempel, Wert) – der Wert gilt bis zum nächsten Punkt. Fenster vor dem
    ersten Punkt bleiben leer, ebenso Fenster, die nur zur Hälfte abgedeckt sind.
    """
    pts = sorted(points)
    out: dict[float, float] = {}
    if not pts:
        return out
    j = 0
    for s in sorted(starts):
        e = s + width
        while j + 1 < len(pts) and pts[j + 1][0] <= s:
            j += 1
        acc = dur = 0.0
        k = j
        while k < len(pts) and pts[k][0] < e:
            t0, v = pts[k]
            t1 = pts[k + 1][0] if k + 1 < len(pts) else e
            a, b = max(s, t0), min(e, t1)
            if b > a:
                acc += v * (b - a)
                dur += b - a
            k += 1
        if dur >= width * 0.5:
            out[s] = acc / dur
    return out


_UUID = re.compile(r"\s*[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.IGNORECASE)


def short_label(name: str, integration: str | None = None) -> str:
    """Name einer Preisquelle ohne Kennungs-Ziffern, bei Bedarf mit dem Namen der Integration."""
    out = _UUID.sub("", str(name)).strip()
    if integration and integration.lower() not in out.lower():
        out = f"{out} · {integration}"
    return out
