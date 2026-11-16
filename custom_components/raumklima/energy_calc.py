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
    ``ww`` (Warmwasser), optional ``price`` (€/kWh), ``self`` (0–1: Anteil, den PV und
    Batterie in dieser Stunde kostenlos gedeckt haben) und ``batt`` (0–1: Anteil aus dem Akku,
    der vorher aus dem Netz geladen wurde – kostet ``batt_price`` €/kWh, den Preis beim Laden).
    """
    rows = list(hours)
    prices = {r["ts"]: float(r["price"]) for r in rows if r.get("price") is not None}
    cheap = cheap_set(prices, {r["ts"]: r.get("day", "") for r in rows})
    total_kwh = billed = cost = cheap_kwh = priced_kwh = self_kwh = batt_kwh = 0.0
    daily: dict[str, dict[str, float]] = {}
    for r in rows:
        kwh = max(0.0, float(r.get("kwh") or 0)) + max(0.0, float(r.get("ww") or 0))
        if kwh <= 0:
            continue
        share = max(0.0, min(1.0, float(r.get("self") or 0)))
        batt = max(0.0, min(1.0 - share, float(r.get("batt") or 0)))
        price = r.get("price")
        price = float(price) if price is not None else fallback_price
        batt_price = r.get("batt_price")
        batt_price = float(batt_price) if batt_price is not None else price
        paid_kwh = kwh * (1 - share - batt)
        total_kwh += kwh
        self_kwh += kwh * share
        batt_kwh += kwh * batt
        billed += paid_kwh
        hour_cost = paid_kwh * price + kwh * batt * batt_price
        cost += hour_cost
        if r.get("price") is not None:
            priced_kwh += paid_kwh
            if r["ts"] in cheap:
                cheap_kwh += paid_kwh
        day = daily.setdefault(r.get("day", ""), {"kwh": 0.0, "ww": 0.0, "cost": 0.0})
        day["kwh"] += max(0.0, float(r.get("kwh") or 0))
        day["ww"] += max(0.0, float(r.get("ww") or 0))
        day["cost"] += hour_cost
    plain = list(prices.values())
    paid_total = billed + batt_kwh
    return {
        "kwh": round(total_kwh, 2),
        "billed_kwh": round(billed, 2),
        "self_kwh": round(self_kwh, 2),
        "batt_kwh": round(batt_kwh, 2),
        "cost": round(cost, 2),
        "price_paid": round(cost / paid_total, 4) if paid_total > 0 else None,
        "price_avg": round(sum(plain) / len(plain), 4) if plain else None,
        "cheap_share": round(100 * cheap_kwh / priced_kwh) if priced_kwh > 0 else None,
        "daily": {d: {k: round(v, 2) for k, v in vals.items()} for d, vals in daily.items()},
    }


def battery_shares(hours: list[dict[str, Any]]) -> dict[str, float]:
    """Akku Stunde für Stunde verfolgen: welcher Teil seines Stroms kam aus dem Netz?

    Jede Stunde braucht ``house`` (Hausverbrauch), ``grid`` (Netzbezug), ``charge`` und
    ``discharge`` (Akku geladen/entladen, kWh) und ``price``. Lädt der Akku, während mehr aus dem
    Netz kommt, als das Haus braucht, stammt dieser Teil aus dem Netz – zum Preis dieser Stunde.
    Entlädt er später, ist der Anteil „aus dem Netz“ nicht kostenlos, sondern kostet den Ladepreis.

    Setzt je Stunde ``self`` (kostenlos aus PV/Akku-mit-PV-Strom), ``batt`` (aus dem Akku, vorher
    aus dem Netz geladen) und ``batt_price``. Gibt die Summen zurück.
    """
    pool = pool_grid = pool_cost = 0.0
    sums = {"charge": 0.0, "discharge": 0.0, "grid_charge": 0.0, "grid_charge_cost": 0.0}
    for r in sorted(hours, key=lambda x: x["ts"]):
        h, g = r.get("house"), r.get("grid")
        if h is None or g is None:
            continue
        h, g = max(0.0, float(h)), max(0.0, float(g))
        c = max(0.0, float(r.get("charge") or 0))
        d = max(0.0, float(r.get("discharge") or 0))
        price = r.get("price")
        s = max(0.0, min(1.0, 1 - g / h)) if h > 0 else 0.0
        r["self"], r["batt"], r["batt_price"] = s, 0.0, None
        if c > 0:
            from_grid = min(c, max(0.0, g - h))
            pool += c
            pool_grid += from_grid
            pool_cost += from_grid * (float(price) if price is not None else 0.0)
            sums["charge"] += c
            sums["grid_charge"] += from_grid
            sums["grid_charge_cost"] += from_grid * (float(price) if price is not None else 0.0)
        if d > 0:
            sums["discharge"] += d
        if d > 0 and pool > 0 and h > 0:
            out = min(d, pool)
            frac = pool_grid / pool if pool > 0 else 0.0
            grid_out = out * frac
            cost_out = pool_cost * (grid_out / pool_grid) if pool_grid > 0 else 0.0
            pool -= out
            pool_grid = max(0.0, pool_grid - grid_out)
            pool_cost = max(0.0, pool_cost - cost_out)
            used = min(out, s * h)  # entladener Strom, der im Haus ankam
            paid = used * frac
            if paid > 0:
                r["batt"] = paid / h
                r["self"] = max(0.0, s - r["batt"])
                r["batt_price"] = cost_out / grid_out if grid_out > 0 else None
    return {k: round(v, 2) for k, v in sums.items()}


def week_grid(hours: Iterable[Mapping[str, Any]]) -> dict[str, Any] | None:
    """Mittlerer Verbrauch je Wochentag × Stunde und mittlerer Preis je Stunde des Tages.

    Jede Stunde braucht ``local`` (lokale datetime), ``kwh``/``ww`` und optional ``price``.
    """
    sums = [[0.0] * 24 for _ in range(7)]
    counts = [[0] * 24 for _ in range(7)]
    psum = [0.0] * 24
    pcount = [0] * 24
    any_kwh = False
    for r in hours:
        local = r.get("local")
        if local is None:
            continue
        kwh = max(0.0, float(r.get("kwh") or 0)) + max(0.0, float(r.get("ww") or 0))
        wd, hr = local.weekday(), local.hour
        sums[wd][hr] += kwh
        counts[wd][hr] += 1
        any_kwh = any_kwh or kwh > 0
        if r.get("price") is not None:
            psum[hr] += float(r["price"])
            pcount[hr] += 1
    if not any_kwh:
        return None
    return {
        "kwh": [[round(sums[d][h] / counts[d][h], 3) if counts[d][h] else None for h in range(24)] for d in range(7)],
        "price": [round(psum[h] / pcount[h], 4) if pcount[h] else None for h in range(24)],
    }


def shift_potential(hours: Iterable[Mapping[str, Any]]) -> float | None:
    """Obergrenze: so viel € weniger, wenn der bezahlte Strom eines Tages im günstigsten Viertel
    seiner Stunden gelaufen wäre. Nur zur Einordnung – Raumklima steuert die Wärmepumpe nicht."""
    by_day: dict[str, list[tuple[float, float]]] = {}
    for r in hours:
        if r.get("price") is None:
            continue
        kwh = max(0.0, float(r.get("kwh") or 0)) + max(0.0, float(r.get("ww") or 0))
        paid = kwh * (1 - max(0.0, min(1.0, float(r.get("self") or 0))))
        by_day.setdefault(r.get("day", ""), []).append((float(r["price"]), paid))
    if not by_day:
        return None
    saving = 0.0
    for rows in by_day.values():
        if len(rows) < 8:
            continue
        paid_kwh = sum(k for _, k in rows)
        cost = sum(p * k for p, k in rows)
        cheapest = sorted(p for p, _ in rows)[: max(1, len(rows) // 4)]
        saving += max(0.0, cost - paid_kwh * sum(cheapest) / len(cheapest))
    return round(saving, 2)


def heating_curve(days: Iterable[Mapping[str, Any]]) -> dict[str, Any] | None:
    """Heizkennlinie: Strom (bzw. Energie) je Tag gegen die Außentemperatur – eine Gerade.

    Gibt Steigung (kWh mehr je 1 °C kälter), Achsenabschnitt und Heizgrenze (Außentemperatur,
    bei der die Gerade null erreicht) zurück. Erst ab 7 Tagen mit mindestens 3 K Spanne.
    """
    pts = [
        (float(d["outdoor"]), float(d.get("kwh") or 0))
        for d in days
        if d.get("outdoor") is not None and float(d.get("kwh") or 0) > 0
    ]
    if len(pts) < 7:
        return None
    xs = [p[0] for p in pts]
    if max(xs) - min(xs) < 3:
        return None
    n = len(pts)
    mx = sum(xs) / n
    my = sum(p[1] for p in pts) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    slope = sum((x - mx) * (y - my) for x, y in pts) / sxx
    if slope >= 0:
        return None  # wärmer, aber mehr Verbrauch – keine Heizkennlinie erkennbar
    intercept = my - slope * mx
    ss_tot = sum((y - my) ** 2 for _, y in pts)
    ss_res = sum((y - (intercept + slope * x)) ** 2 for x, y in pts)
    return {
        "per_kelvin": round(-slope, 2),
        "intercept": round(intercept, 2),
        "limit": round(-intercept / slope, 1),
        "r2": round(1 - ss_res / ss_tot, 2) if ss_tot > 0 else None,
        "n": n,
        "points": [{"t": round(x, 1), "kwh": round(y, 2)} for x, y in pts],
    }


def heat_prices(
    source: str,
    own: float | None,
    grid_only: float | None,
    gas: float,
    oil_l: float,
    power: float,
    cop_guess: float = 3.5,
    boiler_eff: float = 0.9,
) -> list[dict[str, Any]]:
    """Was kostet 1 kWh Wärme – die eigene Heizung im Vergleich mit den anderen Wegen."""
    out: list[dict[str, Any]] = []
    if own is not None:
        out.append({"id": "own", "ct": round(own * 100, 1)})
    if grid_only is not None and source in ("heatpump", "electric") and (own is None or abs(grid_only - own) > 0.001):
        out.append({"id": "own_grid", "ct": round(grid_only * 100, 1)})
    if source != "heatpump" and power > 0:
        out.append({"id": "heatpump", "ct": round(power / cop_guess * 100, 1)})
    if source != "gas" and gas > 0:
        out.append({"id": "gas", "ct": round(gas / boiler_eff * 100, 1)})
    if source != "oil" and oil_l > 0:
        out.append({"id": "oil", "ct": round(oil_l / 10.0 / boiler_eff * 100, 1)})
    return out


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
    if integration:
        flat = re.sub(r"[^0-9a-zäöüß]", "", integration.lower())
        if flat and flat not in re.sub(r"[^0-9a-zäöüß]", "", out.lower()):
            out = f"{out} · {integration}"
    return out
