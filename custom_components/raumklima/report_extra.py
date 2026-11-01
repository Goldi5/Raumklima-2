"""Zusätzliche Auswertungen für den PDF-Bericht (ohne Home Assistant).

Feuchte-Ampel, Lüft-Bilanz, Werktag/Wochenende, Rangliste, Verläufe je Raum, Wärmebild
(Wochentag × Uhrzeit), Saison-Highlights, Spartipps, Raumklima-Note und Euro-Schätzung.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from .stats import ENERGY_PER_KELVIN, summarize, summarize_keys

REF_HDD = 2600.0  # typische Heizgradtage eines Jahres in Deutschland (Basis 15 °C) – für die Euro-Schätzung
GRADES = ((85, "A"), (75, "B"), (65, "C"), (55, "D"), (45, "E"))

Rooms = dict[str, dict[str, dict[str, Any]]]
Home = dict[str, dict[str, Any]]


def _keys(start: date, end: date) -> list[date]:
    return [start + timedelta(days=i) for i in range((end - start).days + 1)]


# ------------------------------------------------------------------ Feuchte
def humidity_light(r: dict[str, Any], weeks: float) -> str | None:
    """Ampel je Raum: green / yellow / red (None ohne Feuchtefühler)."""
    if r.get("humidity_avg") is None:
        return None
    if r["mold_h"] >= 1 or r["humid_h"] >= 12 * weeks:
        return "red"
    if r["humid_h"] >= 3 * weeks:
        return "yellow"
    return "green"


def problem_room(cur: dict[str, Any]) -> str | None:
    """Raum mit den meisten Stunden über der Feuchtegrenze (mind. 1 h)."""
    rooms = [(n, r["humid_h"] + 3 * r["mold_h"]) for n, r in cur["rooms"].items() if r["hours"]]
    rooms = [x for x in rooms if x[1] >= 1]
    return max(rooms, key=lambda x: x[1])[0] if rooms else None


# ------------------------------------------------------------------ Lüften
def airing_rows(cur: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for name, r in sorted(cur["rooms"].items()):
        if not r["hours"] or not (r["airings"] or r["vent_open_n"]):
            continue
        out.append(
            {
                "room": name,
                "airings": r["airings"],
                "avg_min": round(r["airing_h"] * 60 / r["airings"]) if r["airings"] else None,
                "long": r["airings_long"],
                "asked": r["vent_open_n"],
                "done": r["vent_done_n"],
                "cold": r["vent_cold_n"],
                "success_pct": round(100 * min(r["vent_done_n"], r["vent_open_n"]) / r["vent_open_n"]) if r["vent_open_n"] else None,
            }
        )
    return out


# ------------------------------------------------------------------ Werktag / Wochenende
def weekday_weekend(rooms: Rooms, home: Home, start: date, end: date) -> dict[str, Any] | None:
    days = _keys(start, end)
    work = [d for d in days if d.weekday() < 5]
    free = [d for d in days if d.weekday() >= 5]
    if not work or not free:
        return None
    out = {}
    for key, ds in (("weekday", work), ("weekend", free)):
        s = summarize_keys(rooms, home, [d.isoformat() for d in ds], ds[0], ds[-1])
        n = max(len([d for d in ds if any(d.isoformat() in r for r in rooms.values())]), 1)
        out[key] = {
            "days": n,
            "heating_h": round(s["total"]["heating_h"] / n, 1),
            "comfort": s["total"]["on_target_pct"],
            "away_h": round(s["away_h"] / n, 1),
            "temp_avg": s["total"]["temp_avg"],
        }
    return out


# ------------------------------------------------------------------ Rangliste
def ranking(cur: dict[str, Any], prev: dict[str, Any] | None) -> dict[str, tuple[str, float]]:
    """Sparsamster, wärmster, gemütlichster Raum und größte Verbesserung."""
    rooms = {n: r for n, r in cur["rooms"].items() if r["hours"] >= 24}
    out: dict[str, tuple[str, float]] = {}
    if len(rooms) < 2:
        return out
    eco = min(rooms.items(), key=lambda x: x[1]["valve_h"] / x[1]["hours"])
    out["eco"] = (eco[0], round(eco[1]["valve_h"] / eco[1]["hours"] * 24, 1))  # Volllast-h pro Tag
    warm = [(n, r["temp_avg"]) for n, r in rooms.items() if r["temp_avg"] is not None]
    if warm:
        out["warm"] = max(warm, key=lambda x: x[1])
    comfy = [(n, r["on_target_pct"]) for n, r in rooms.items() if r["on_target_pct"] is not None]
    if comfy:
        out["comfort"] = max(comfy, key=lambda x: x[1])
    if prev and cur["hdd"] >= 5 and prev["hdd"] >= 5:
        changes = []
        for n, r in rooms.items():
            p = prev["rooms"].get(n)
            if p and p["hours"] >= 24 and p["valve_h"] > 0 and r["valve_h"] >= 0:
                changes.append((n, round(100 * ((r["valve_h"] / cur["hdd"]) / (p["valve_h"] / prev["hdd"]) - 1))))
        best = min(changes, key=lambda x: x[1]) if changes else None
        if best and best[1] <= -5:
            out["improved"] = best
    return out


# ------------------------------------------------------------------ Verläufe je Raum
def room_trends(rooms: Rooms, home: Home, kind: str, start: date, end: date) -> dict[str, dict[str, list[float | None]]]:
    """Tageswerte (Saison: Wochenwerte) für Temperatur und Feuchte je Raum."""
    step = 7 if kind == "season" else 1
    out: dict[str, dict[str, list[float | None]]] = {n: {"temp": [], "hum": []} for n in rooms}
    d = start
    while d <= end:
        s = summarize(rooms, home, d, min(end, d + timedelta(days=step - 1)))
        for n in rooms:
            r = s["rooms"][n]
            out[n]["temp"].append(r["temp_avg"])
            out[n]["hum"].append(r["humidity_avg"])
        d += timedelta(days=step)
    return out


# ------------------------------------------------------------------ Wärmebild
def heatmap(rooms: Rooms, start: date, end: date) -> list[list[float | None]] | None:
    """7 × 24 Anteil „heizt“ (0–1) je Wochentag und Stunde, über alle Räume."""
    heat = [[0.0] * 24 for _ in range(7)]
    seen = [[0.0] * 24 for _ in range(7)]
    any_data = False
    for d in _keys(start, end):
        key = d.isoformat()
        for days in rooms.values():
            day = days.get(key)
            if not day or "hh" not in day:
                continue
            any_data = True
            wd = d.weekday()
            for h in range(24):
                heat[wd][h] += day["hh"][h]
                seen[wd][h] += day.get("hn", [0.0] * 24)[h]
    if not any_data:
        return None
    return [[round(heat[w][h] / seen[w][h], 3) if seen[w][h] >= 600 else None for h in range(24)] for w in range(7)]


def night_ratio(grid: list[list[float | None]] | None) -> float | None:
    """Heizen nachts (0–5 Uhr) im Verhältnis zum Tag (7–21 Uhr)."""
    if not grid:
        return None
    night = [v for row in grid for v in row[0:5] if v is not None]
    day = [v for row in grid for v in row[7:21] if v is not None]
    if not night or not day or sum(day) / len(day) < 0.05:
        return None
    return round((sum(night) / len(night)) / (sum(day) / len(day)), 2)


# ------------------------------------------------------------------ Saison
def season_highlights(series_daily: list[dict[str, Any]], monthly: list[dict[str, Any]]) -> dict[str, Any]:
    heat_days = [p for p in series_daily if (p["heating_h"] or 0) >= 1]
    temps = [p for p in series_daily if p["outdoor"] is not None]
    out: dict[str, Any] = {}
    if heat_days:
        out["first"] = heat_days[0]["date"]
        out["last"] = heat_days[-1]["date"]
    if temps:
        cold = min(temps, key=lambda p: p["outdoor"])
        out["coldest"] = (cold["date"], cold["outdoor"])
    run = best = 0
    best_end = None
    for p in series_daily:
        run = run + 1 if (p["heating_h"] or 0) < 0.5 and p.get("recorded") else 0
        if run > best:
            best, best_end = run, p["date"]
    if best >= 2:
        out["pause"] = (best, best_end)
    if monthly:
        top = max(monthly, key=lambda p: p["heating_h"] or 0)
        if top["heating_h"]:
            out["top_month"] = (top["date"], top["heating_h"])
    return out


# ------------------------------------------------------------------ Note
def score(summary: dict[str, Any]) -> tuple[int, str] | None:
    """Raumklima-Note aus Wohlfühlzeit (45 %), Feuchte (35 %) und Sparen (20 %)."""
    total = summary["total"]
    if total["hours"] < 24:
        return None
    comfort = total["on_target_pct"] if total["on_target_pct"] is not None else 70
    hum_rooms = [r for r in summary["rooms"].values() if r["hours"] and r["humidity_avg"] is not None]
    if hum_rooms:
        share = sum(r["humid_h"] for r in hum_rooms) / max(sum(r["hours"] for r in hum_rooms), 1)
        humidity = max(0.0, 100 - share * 400) - (20 if any(r["mold_h"] >= 1 for r in hum_rooms) else 0)
    else:
        humidity = 80.0
    saving = min(100.0, total["saving_pct"] * 12)
    points = round(0.45 * comfort + 0.35 * max(humidity, 0) + 0.2 * saving)
    grade = next((g for limit, g in GRADES if points >= limit), "F")
    return points, grade


def score_history(rooms: Rooms, home: Home, kind: str, end: date, count: int = 8) -> list[tuple[str, str | None]]:
    """Noten der letzten Zeiträume (älteste zuerst) – Wochen bzw. Monate."""
    out = []
    for i in range(count - 1, -1, -1):
        if kind == "month" or kind == "season":
            first = end.replace(day=1)
            for _ in range(i):
                first = (first - timedelta(days=1)).replace(day=1)
            last = min(end, (first + timedelta(days=32)).replace(day=1) - timedelta(days=1))
            label = first.isoformat()[:7]
        else:
            last = end - timedelta(days=7 * i)
            first = last - timedelta(days=6)
            label = f"W{first.isocalendar()[1]}"
        s = score(summarize(rooms, home, first, last))
        out.append((label, s[1] if s else None))
    return out


# ------------------------------------------------------------------ Euro
def money(cur: dict[str, Any], annual_cost: float | None) -> dict[str, float] | None:
    """Grobe Schätzung aus den jährlichen Heizkosten (Abrechnung) und den Heizgradtagen."""
    if not annual_cost or cur["hdd"] < 3:
        return None
    period_cost = annual_cost * cur["hdd"] / REF_HDD
    s = cur["total"]["saving_pct"]
    saved = period_cost * s / max(100 - s, 1)
    return {"period_cost": round(period_cost), "saved": round(saved), "per_degree_year": round(annual_cost * ENERGY_PER_KELVIN)}


# ------------------------------------------------------------------ Spartipps
TIPS = {
    "de": {
        "share": "{room} hat {p} % der Heizstunden – 1 °C weniger dort spart ≈ 6 % seiner Heizenergie{eur}.",
        "warm": "{room} lag im Schnitt bei {t} °C – jedes Grad weniger spart ≈ 6 %.",
        "night": "Nachts (0–5 Uhr) wird {p} % so viel geheizt wie tagsüber – eine Nachtabsenkung spart Energie (z. B. Wunschtemperatur abends per Automation senken).",
        "mild": "An {n} milden Tagen (Tagesmittel ≥ 15 °C) wurde trotzdem geheizt – Heizgrenze oder Wunschtemperaturen prüfen.",
        "all": "1 °C weniger in allen Räumen spart ≈ {e} € im Jahr (Schätzung aus deinen Heizkosten).",
        "tilt": "{n}× wurde länger als 30 min gelüftet – Kippfenster kühlen Wände aus; besser 5–10 min stoßlüften.",
        "eur": " (≈ {e} € im Jahr)",
    },
    "en": {
        "share": "{room} accounts for {p} % of heating hours – 1 °C less there saves ≈ 6 % of its heating energy{eur}.",
        "warm": "{room} averaged {t} °C – each degree less saves ≈ 6 %.",
        "night": "At night (0–5 am) heating runs at {p} % of the daytime level – a night setback saves energy (e.g. lower the desired temperature in the evening with an automation).",
        "mild": "Heating ran on {n} mild days (daily mean ≥ 15 °C) – check the heating limit or desired temperatures.",
        "all": "1 °C less in all rooms saves ≈ {e} € a year (estimate from your heating costs).",
        "tilt": "{n}× the window was open longer than 30 min – tilted windows cool the walls; better air wide open for 5–10 min.",
        "eur": " (≈ {e} € a year)",
    },
}


def _n(v: float, lang: str, d: int = 1) -> str:
    t = f"{v:.{d}f}"
    return t.replace(".", ",") if lang == "de" else t


def saving_tips(
    cur: dict[str, Any],
    series_daily: list[dict[str, Any]],
    grid: list[list[float | None]] | None,
    annual_cost: float | None,
    room_types: dict[str, str],
    lang: str,
) -> list[str]:
    tx = TIPS[lang]
    tips: list[str] = []
    rooms = {n: r for n, r in cur["rooms"].items() if r["hours"]}
    total_heat = sum(r["heating_h"] for r in rooms.values())
    if total_heat >= 5 and len(rooms) >= 2:
        top = max(rooms.items(), key=lambda x: x[1]["heating_h"])
        share = top[1]["heating_h"] / total_heat
        if share >= 0.3:
            eur = tx["eur"].format(e=round(annual_cost * share * ENERGY_PER_KELVIN)) if annual_cost else ""
            tips.append(tx["share"].format(room=top[0], p=round(share * 100), eur=eur))
    for n, r in rooms.items():
        limit = 23.5 if room_types.get(n) == "bathroom" else 22.0
        if r["temp_avg"] is not None and r["temp_avg"] >= limit and r["heating_h"] >= 2:
            tips.append(tx["warm"].format(room=n, t=_n(r["temp_avg"], lang)))
    ratio = night_ratio(grid)
    if ratio is not None and ratio >= 0.6:
        tips.append(tx["night"].format(p=round(ratio * 100)))
    mild = [p for p in series_daily if p["outdoor"] is not None and p["outdoor"] >= 15 and (p["heating_h"] or 0) >= 1]
    if len(mild) >= 2:
        tips.append(tx["mild"].format(n=len(mild)))
    long_airings = sum(r["airings_long"] for r in rooms.values())
    if long_airings >= 3:
        tips.append(tx["tilt"].format(n=long_airings))
    if annual_cost:
        tips.append(tx["all"].format(e=round(annual_cost * ENERGY_PER_KELVIN)))
    return tips[:6]
