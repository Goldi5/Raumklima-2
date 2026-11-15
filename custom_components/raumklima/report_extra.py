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
def metric_value(room: dict[str, Any], metric: str) -> float:
    """Wärmemenge eines Raums in der gewählten Kennzahl (siehe insights.report_metric)."""
    if metric == "hours":
        return float(room.get("heating_h") or 0.0)
    if metric == "deficit":
        return float(room.get("deficit_kh") or 0.0)
    return float(room.get("valve_h") or 0.0)


def ranking(cur: dict[str, Any], prev: dict[str, Any] | None, metric: str = "valve") -> dict[str, tuple[str, float]]:
    """Sparsamster, wärmster, gemütlichster Raum und größte Verbesserung."""
    rooms = {n: r for n, r in cur["rooms"].items() if r["hours"] >= 24}
    out: dict[str, tuple[str, float]] = {}
    if len(rooms) < 2:
        return out
    eco = min(rooms.items(), key=lambda x: metric_value(x[1], metric) / x[1]["hours"])
    out["eco"] = (eco[0], round(metric_value(eco[1], metric) / eco[1]["hours"] * 24, 1))
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
            cur_v, prev_v = metric_value(r, metric), metric_value(p, metric) if p else 0.0
            if p and p["hours"] >= 24 and prev_v > 0:
                changes.append((n, round(100 * ((cur_v / cur["hdd"]) / (prev_v / prev["hdd"]) - 1))))
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
def pv_split(pv_kwh: float | None, self_use_pct: float | None) -> dict[str, float] | None:
    """PV-Ertrag in selbst genutzten Anteil und Überschuss aufteilen."""
    if pv_kwh is None:
        return None
    pv = max(0.0, float(pv_kwh))
    share = max(0.0, min(100.0, float(self_use_pct or 0))) / 100
    self_kwh = pv * share
    return {"pv_kwh": round(pv, 1), "self_kwh": round(self_kwh, 1), "surplus_kwh": round(pv - self_kwh, 1)}


def energy_kwh(
    value: float | None,
    unit: str | None,
    factor: float = 10.0,
    source: str | None = None,
) -> float | None:
    """Zählerstand in kWh umrechnen.

    Gas in m³ über Brennwert/Zustandszahl. Heizöl in Litern über kWh je Liter;
    ein Öl-Tank in m³ wird zuerst in Liter umgerechnet.
    """
    if value is None:
        return None
    try:
        amount = float(value)
    except (TypeError, ValueError):
        return None
    u = (unit or "").strip().lower().replace("³", "3")
    factor = factor or 10.0
    if source == "oil":
        if u in ("l", "liter", "liters", "litre", "litres"):
            return amount * factor
        if u in ("m3", "m^3"):
            return amount * 1000.0 * factor
        if u in ("%", "percent"):
            return None  # Füllstand ist kein Verbrauchszähler
    if u in ("m3", "m^3"):
        return amount * factor
    if u == "wh":
        return amount / 1000
    if u == "mwh":
        return amount * 1000
    return amount


def base_cost(energy: dict[str, Any], kwh: float, days: int) -> float:
    """Grundgebühr für den Zeitraum – ganz oder nach Anteil am Hausverbrauch."""
    base = max(0.0, float(energy.get("base") or 0)) * days / 30.44
    house = energy.get("house_kwh")
    if energy.get("base_share") == "usage" and house:
        base *= max(0.0, min(1.0, kwh / float(house)))
    return base


def money(
    cur: dict[str, Any],
    annual_cost: float | None,
    energy: dict[str, Any] | None = None,
) -> dict[str, Any] | None:
    """Grobe Euro-Schätzung – aus Abrechnung oder aus Zähler und Tarif.

    Die Abrechnung hat Vorrang: sie ist die belastbarste Zahl und der einfache Weg
    für Mietwohnungen. Ohne Abrechnung zählt der Zähler, sofern Verbrauch und Preis
    für den Berichtszeitraum vorliegen.
    """
    if cur["hdd"] < 3:
        return None
    energy = energy or {}
    kwh: float | None = None
    if annual_cost:
        annual = float(annual_cost)
        period_cost = annual * cur["hdd"] / REF_HDD
        basis = "bill"
    else:
        kwh = energy.get("kwh")
        price = energy.get("price")
        if kwh is None or float(kwh) <= 0 or price is None or float(price) <= 0:
            return None
        kwh = float(kwh) + max(0.0, float(energy.get("ww_kwh") or 0))  # Warmwasser zählt mit
        price = float(price)
        days = max(int(energy.get("days") or 1), 1)
        if energy.get("cost_energy") is not None:
            # Stunde für Stunde: kWh × Preis dieser Stunde, PV/Batterie schon abgezogen
            energy_cost = float(energy["cost_energy"])
        else:
            offset = 0.0
            if energy.get("source") in ("electric", "heatpump") and energy.get("pv_kwh"):
                share = max(0.0, min(100.0, float(energy.get("pv_self_use") or 0))) / 100
                offset = max(0.0, float(energy["pv_kwh"])) * share
            energy_cost = max(0.0, kwh - offset) * price
        base = base_cost(energy, kwh, days)
        period_cost = energy_cost + base
        if period_cost <= 0:
            return None
        # Hochrechnung: Heizung nach Gradtagen, Warmwasser und Grundgebühr nach Tagen
        ww_part = max(0.0, float(energy.get("ww_kwh") or 0)) / kwh if kwh > 0 else 0.0
        annual = (
            energy_cost * (1 - ww_part) * REF_HDD / cur["hdd"]
            + (energy_cost * ww_part + base) * 365 / days
        )
        basis = "meter"
    s = cur["total"]["saving_pct"]
    saved = period_cost * s / max(100 - s, 1)
    out: dict[str, Any] = {
        "period_cost": round(period_cost, 2),
        "saved": round(saved),
        "per_degree_year": round(annual * ENERGY_PER_KELVIN),
        "annual": round(annual, 2),
        "basis": basis,
        "source": energy.get("source") if basis == "meter" else "bill",
    }
    if kwh is not None:
        out["kwh"] = round(kwh, 1)
    return out


# ------------------------------------------------------------------ Spartipps
TIPS = {
    "de": {
        "share": "{room} hat {p} % der Heizstunden – 1 °C weniger dort spart ≈ 6 % seiner Heizenergie{eur}.",
        "warm": "{room} lag im Schnitt bei {t} °C – jedes Grad weniger spart ≈ 6 %.",
        "night": "Nachts (0–5 Uhr) wird {p} % so viel geheizt wie tagsüber – eine Nachtabsenkung spart Energie (z. B. Wunschtemperatur abends per Automation senken).",
        "mild": "An {n} milden Tagen (Tagesmittel ≥ 15 °C) wurde trotzdem geheizt – Heizgrenze oder Wunschtemperaturen prüfen.",
        "all": "1 °C weniger in allen Räumen spart ≈ {e} € im Jahr (Schätzung aus deinen Heizkosten).",
        "tilt": "{n}× wurde länger als 30 min gelüftet – lange offene Fenster kühlen die Wände aus; besser 5–10 min stoßlüften.",
        "eur": " (≈ {e} € im Jahr)",
    },
    "en": {
        "share": "{room} accounts for {p} % of heating hours – 1 °C less there saves ≈ 6 % of its heating energy{eur}.",
        "warm": "{room} averaged {t} °C – each degree less saves ≈ 6 %.",
        "night": "At night (0–5 am) heating runs at {p} % of the daytime level – a night setback saves energy (e.g. lower the desired temperature in the evening with an automation).",
        "mild": "Heating ran on {n} mild days (daily mean ≥ 15 °C) – check the heating limit or desired temperatures.",
        "all": "1 °C less in all rooms saves ≈ {e} € a year (estimate from your heating costs).",
        "tilt": "{n}× the window was open longer than 30 min – long-open windows cool the walls; better air wide open for 5–10 min.",
        "eur": " (≈ {e} € a year)",
    },
    "fr": {
        "share": "{room} représente {p} % des heures de chauffe – 1 °C de moins y économise ≈ 6 % de son énergie de chauffage{eur}.",
        "warm": "{room} était en moyenne à {t} °C – chaque degré de moins économise ≈ 6 %.",
        "night": "La nuit (0–5 h), le chauffage tourne à {p} % de son niveau de jour – un abaissement nocturne économise de l’énergie (p. ex. baisser la température souhaitée le soir par une automatisation).",
        "mild": "Le chauffage a fonctionné {n} jours doux (moyenne journalière ≥ 15 °C) – vérifier le seuil de chauffage ou les températures souhaitées.",
        "all": "1 °C de moins dans toutes les pièces économise ≈ {e} € par an (estimation d’après vos coûts de chauffage).",
        "tilt": "{n}× la fenêtre est restée ouverte plus de 30 min – l’oscillo-battant refroidit les murs ; mieux vaut aérer en grand 5–10 min.",
        "eur": " (≈ {e} € par an)",
    },
}


def _n(v: float, lang: str, d: int = 1) -> str:
    t = f"{v:.{d}f}"
    return t.replace(".", ",") if lang in ("de", "fr") else t


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


# ------------------------------------------------------------------ Kosten je Raum
def room_costs(cur: dict[str, Any], money_: dict[str, Any] | None, energy: dict[str, Any] | None, metric: str) -> list[dict[str, Any]]:
    """Heizkosten je Raum nach Ventilöffnung × Stunden (bzw. Kennzahl) – ohne Warmwasser."""
    if not money_ or not money_.get("period_cost"):
        return []
    energy = energy or {}
    kwh = float(energy.get("kwh") or 0)
    ww = float(energy.get("ww_kwh") or 0)
    heat_part = kwh / (kwh + ww) if kwh + ww > 0 else 1.0
    values = {name: metric_value(r, metric) for name, r in cur["rooms"].items()}
    total = sum(values.values())
    if total <= 0:
        return []
    heat_cost = float(money_["period_cost"]) * heat_part
    rows = [
        {"name": name, "share": round(100 * v / total, 1), "cost": round(heat_cost * v / total, 2)}
        for name, v in values.items()
        if v > 0
    ]
    return sorted(rows, key=lambda r: -r["share"])


# ------------------------------------------------------------------ Kurzfassung
STORY = {
    "de": {
        "cost": "Das Heizen hat in diesem Zeitraum etwa {cost} € gekostet – {day} € pro Tag{ww}.",
        "ww": ", Warmwasser eingeschlossen",
        "less": "Wetterbereinigt wurde {c} % weniger geheizt als im Vorzeitraum.",
        "more": "Wetterbereinigt wurde {c} % mehr geheizt als im Vorzeitraum.",
        "same": "Wetterbereinigt wurde etwa so viel geheizt wie im Vorzeitraum.",
        "weather": "Draußen war es im Schnitt {t} °C ({hdd} Heizgradtage).",
        "room": "Die meiste Wärme brauchte {room} – {share} % der Heizung.",
        "comfort": "{p} % der Zeit lagen die Räume auf ihrer Zieltemperatur.",
        "cop": "Die Wärmepumpe machte aus 1 kWh Strom im Schnitt {cop} kWh Wärme.",
        "cheap": "{p} % des Stroms lief in den günstigsten Stunden des Tages.",
        "hints": "Wichtigste Hinweise:",
        "tip": "Tipp:",
        "more_pdf": "Alle Räume, Diagramme und Details stehen im PDF im Anhang.",
    },
    "en": {
        "cost": "Heating cost about {cost} € in this period – {day} € per day{ww}.",
        "ww": ", hot water included",
        "less": "Weather-adjusted, heating was {c} % lower than in the previous period.",
        "more": "Weather-adjusted, heating was {c} % higher than in the previous period.",
        "same": "Weather-adjusted, heating was about the same as in the previous period.",
        "weather": "Outside it averaged {t} °C ({hdd} heating degree days).",
        "room": "{room} needed the most heat – {share} % of the heating.",
        "comfort": "Rooms were at their target {p} % of the time.",
        "cop": "The heat pump turned 1 kWh of electricity into {cop} kWh of heat on average.",
        "cheap": "{p} % of the electricity was used in the cheapest hours of the day.",
        "hints": "Key points:",
        "tip": "Tip:",
        "more_pdf": "All rooms, charts and details are in the attached PDF.",
    },
    "fr": {
        "cost": "Le chauffage a coûté environ {cost} € sur cette période – {day} € par jour{ww}.",
        "ww": ", eau chaude comprise",
        "less": "Corrigé du climat, on a chauffé {c} % de moins que la période précédente.",
        "more": "Corrigé du climat, on a chauffé {c} % de plus que la période précédente.",
        "same": "Corrigé du climat, on a chauffé à peu près autant que la période précédente.",
        "weather": "Dehors, il faisait en moyenne {t} °C ({hdd} degrés-jours).",
        "room": "{room} a demandé le plus de chaleur – {share} % du chauffage.",
        "comfort": "Les pièces étaient à leur consigne {p} % du temps.",
        "cop": "La pompe à chaleur a produit en moyenne {cop} kWh de chaleur pour 1 kWh d’électricité.",
        "cheap": "{p} % de l’électricité a été consommée aux heures les moins chères.",
        "hints": "Points importants :",
        "tip": "Conseil :",
        "more_pdf": "Toutes les pièces, graphiques et détails sont dans le PDF joint.",
    },
}


def story(data: dict[str, Any], lang: str) -> list[str]:
    """Drei bis fünf Sätze: was in diesem Zeitraum los war (Seite 1 und E-Mail)."""
    tx = STORY[lang]
    cur = data["current"]
    total = cur["total"]
    out: list[str] = []
    money_ = data.get("money") or {}
    energy = data.get("energy") or {}
    days = max(int(data.get("days") or 1), 1)
    if money_.get("period_cost"):
        out.append(tx["cost"].format(
            cost=_n(money_["period_cost"], lang, 0),
            day=_n(money_["period_cost"] / days, lang, 2),
            ww=tx["ww"] if energy.get("ww_kwh") else "",
        ))
    change = data.get("change")
    if change is not None:
        key = "same" if abs(change) < 3 else ("less" if change < 0 else "more")
        out.append(tx[key].format(c=abs(round(change))))
    if cur.get("outdoor_avg") is not None:
        out.append(tx["weather"].format(t=_n(cur["outdoor_avg"], lang, 1), hdd=_n(cur["hdd"], lang, 0)))
    rooms = data.get("room_costs") or []
    if rooms:
        out.append(tx["room"].format(room=rooms[0]["name"], share=_n(rooms[0]["share"], lang, 0)))
    if energy.get("cop"):
        out.append(tx["cop"].format(cop=_n(energy["cop"], lang, 1)))
    if energy.get("cheap_share") is not None:
        out.append(tx["cheap"].format(p=energy["cheap_share"]))
    if total.get("on_target_pct") is not None:
        out.append(tx["comfort"].format(p=total["on_target_pct"]))
    return out[:6]


def mail_text(data: dict[str, Any], lang: str) -> str:
    """E-Mail-Text: oben die Kurzfassung, darunter die wichtigsten Hinweise – das PDF hängt an."""
    tx = STORY[lang]
    lines = list(data.get("story") or story(data, lang))
    hints = [t for sev, t in data.get("findings") or [] if sev in ("alert", "warn")][:3]
    if hints:
        lines += ["", tx["hints"], *[f"• {h}" for h in hints]]
    tips = data.get("tips") or []
    if tips:
        lines += ["", f"{tx['tip']} {tips[0]}"]
    lines += ["", tx["more_pdf"]]
    return "\n".join(lines)
