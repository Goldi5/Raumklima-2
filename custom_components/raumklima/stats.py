"""Heizbericht: Tageswerte sammeln und auswerten (ohne Home-Assistant-Abhängigkeit).

Pro Raum und Tag werden Sekunden bzw. Integrale aufsummiert – klein genug,
um über ein Jahr im eigenen Speicher zu liegen, ohne die Datenbank zu belasten.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any

ENERGY_PER_KELVIN = 0.06  # Faustregel Verbraucherzentrale: ~6 % Heizenergie je Grad
HDD_BASE = 15.0  # Heizgradtage-Basis = Heizgrenze
MAX_DAYS = 400

ROOM_FIELDS = (
    "seconds",  # erfasste Zeit
    "heating_s",  # Status „heizt“
    "valve_pct_s",  # ∫ Ventilöffnung % · s
    "setback_s",  # abgesenkt (Abwesenheit)
    "setback_ks",  # ∫ (Wunsch − Ziel) K · s
    "window_pause_s",  # Heizung wegen Fenster pausiert
    "season_off_s",  # Heizpause
    "on_target_s",  # |Raum − Ziel| ≤ 1 K (wenn geregelt wird)
    "regulated_s",  # Zeit, in der geregelt wird (Bezug für on_target)
    "humid_s",  # Feuchte ≥ Grenze
    "mold_s",  # Schimmelrisiko
    "temp_s",  # ∫ Temperatur · s (für Mittelwert)
    "temp_n_s",  # Zeit mit gültiger Temperatur
    "hum_s",  # ∫ Feuchte · s
    "hum_n_s",
    "airings",  # Anzahl Fenster-Öffnungen
    "airing_s",  # Fenster offen
    "arrivals",  # Ankünfte (Stufe → da)
    "arrivals_warm",  # davon Raum schon warm
)
HOME_FIELDS = ("seconds", "away_s", "outdoor_s", "outdoor_n_s", "preheats")


@dataclass
class RoomSample:
    """Momentaufnahme eines Raums (jede Minute)."""

    heating: bool
    valve: float | None
    reason: str
    target: float
    effective: float
    plan_on: bool
    paused: bool
    temp: float | None
    humidity: float | None
    humidity_limit: float | None
    mold: bool
    window_open: bool


def _empty(fields: tuple[str, ...]) -> dict[str, float]:
    return {f: 0.0 for f in fields}


def add_room_sample(day: dict[str, float], s: RoomSample, dt: float) -> None:
    """Eine Minute (dt Sekunden) eines Raums aufsummieren."""
    for f in ROOM_FIELDS:
        day.setdefault(f, 0.0)
    day["seconds"] += dt
    if s.heating:
        day["heating_s"] += dt
    if s.valve is not None:
        day["valve_pct_s"] += max(0.0, min(100.0, s.valve)) * dt
    if s.reason in ("away_short", "away_long"):
        day["setback_s"] += dt
        day["setback_ks"] += max(0.0, s.target - s.effective) * dt
    if s.paused:
        day["window_pause_s"] += dt
    if s.reason == "season":
        day["season_off_s"] += dt
    if s.plan_on and not s.paused and s.temp is not None:
        day["regulated_s"] += dt
        if abs(s.temp - s.effective) <= 1.0:
            day["on_target_s"] += dt
    if s.humidity is not None:
        day["hum_s"] += s.humidity * dt
        day["hum_n_s"] += dt
        if s.humidity_limit is not None and s.humidity >= s.humidity_limit:
            day["humid_s"] += dt
    if s.mold:
        day["mold_s"] += dt
    if s.temp is not None:
        day["temp_s"] += s.temp * dt
        day["temp_n_s"] += dt
    if s.window_open:
        day["airing_s"] += dt


def add_home_sample(day: dict[str, float], away: bool, outdoor: float | None, dt: float) -> None:
    for f in HOME_FIELDS:
        day.setdefault(f, 0.0)
    day["seconds"] += dt
    if away:
        day["away_s"] += dt
    if outdoor is not None:
        day["outdoor_s"] += outdoor * dt
        day["outdoor_n_s"] += dt


def prune(days: dict[str, Any], today: date, keep: int = MAX_DAYS) -> None:
    """Alte Tage entfernen."""
    cutoff = (today - timedelta(days=keep)).isoformat()
    for key in [k for k in days if k < cutoff]:
        del days[key]


# ------------------------------------------------------------------ Auswertung
def _sum(days: list[dict[str, float]], field: str) -> float:
    return sum(d.get(field, 0.0) for d in days)


def heating_degree_days(home_days: list[dict[str, float]], base: float = HDD_BASE) -> float:
    """Heizgradtage: Σ max(0, Basis − Tagesmittel außen)."""
    total = 0.0
    for d in home_days:
        n = d.get("outdoor_n_s", 0.0)
        if n >= 6 * 3600:  # mind. 6 h Messung, sonst unsicher
            total += max(0.0, base - d["outdoor_s"] / n)
    return round(total, 1)


def summarize_room(days: list[dict[str, float]]) -> dict[str, Any]:
    """Kennzahlen eines Raums über mehrere Tage."""
    seconds = _sum(days, "seconds")
    regulated = _sum(days, "regulated_s")
    temp_n = _sum(days, "temp_n_s")
    hum_n = _sum(days, "hum_n_s")
    arrivals = _sum(days, "arrivals")
    setback_ks = _sum(days, "setback_ks")
    return {
        "hours": round(seconds / 3600, 1),
        "heating_h": round(_sum(days, "heating_s") / 3600, 1),
        "valve_h": round(_sum(days, "valve_pct_s") / 100 / 3600, 1),
        "setback_h": round(_sum(days, "setback_s") / 3600, 1),
        "setback_avg_k": round(setback_ks / max(_sum(days, "setback_s"), 1), 1),
        "window_pause_h": round(_sum(days, "window_pause_s") / 3600, 1),
        "season_off_h": round(_sum(days, "season_off_s") / 3600, 1),
        "on_target_pct": round(100 * _sum(days, "on_target_s") / regulated) if regulated else None,
        "humid_h": round(_sum(days, "humid_s") / 3600, 1),
        "mold_h": round(_sum(days, "mold_s") / 3600, 1),
        "temp_avg": round(_sum(days, "temp_s") / temp_n, 1) if temp_n else None,
        "humidity_avg": round(_sum(days, "hum_s") / hum_n) if hum_n else None,
        "airings": int(_sum(days, "airings")),
        "airing_h": round(_sum(days, "airing_s") / 3600, 1),
        "arrivals": int(arrivals),
        "arrivals_warm_pct": round(100 * _sum(days, "arrivals_warm") / arrivals) if arrivals else None,
        # Einsparung durch Absenkung: 6 % je Grad, gewichtet mit der Zeit
        "saving_pct": round(100 * ENERGY_PER_KELVIN * setback_ks / seconds, 1) if seconds else 0.0,
    }


def summarize(
    rooms: dict[str, dict[str, dict[str, float]]],
    home: dict[str, dict[str, float]],
    start: date,
    end: date,
) -> dict[str, Any]:
    """Zeitraum [start, end] auswerten: je Raum und gesamt."""
    keys = [(start + timedelta(days=i)).isoformat() for i in range((end - start).days + 1)]
    per_room = {
        name: summarize_room([days[k] for k in keys if k in days]) for name, days in rooms.items()
    }
    home_days = [home[k] for k in keys if k in home]
    total = summarize_room([d for days in rooms.values() for k, d in days.items() if k in keys])
    n_rooms = max(len([r for r in per_room.values() if r["hours"]]), 1)
    # Gesamtwerte: Stunden summiert, Prozente gemittelt
    total["saving_pct"] = round(sum(r["saving_pct"] for r in per_room.values()) / n_rooms, 1)
    outdoor_n = _sum(home_days, "outdoor_n_s")
    return {
        "start": start.isoformat(),
        "end": end.isoformat(),
        "rooms": per_room,
        "total": total,
        "hdd": heating_degree_days(home_days),
        "outdoor_avg": round(_sum(home_days, "outdoor_s") / outdoor_n, 1) if outdoor_n else None,
        "away_h": round(_sum(home_days, "away_s") / 3600, 1),
        "preheats": int(_sum(home_days, "preheats")),
    }


def compare(current: dict[str, Any], previous: dict[str, Any]) -> float | None:
    """Ventil-Stunden je Heizgradtag gegenüber dem Vorzeitraum in % (negativ = besser)."""
    cur_hdd, prev_hdd = current["hdd"], previous["hdd"]
    cur_v, prev_v = current["total"]["valve_h"], previous["total"]["valve_h"]
    if cur_hdd < 5 or prev_hdd < 5 or prev_v <= 0:
        return None  # zu mild oder zu wenig Daten für einen fairen Vergleich
    return round(100 * ((cur_v / cur_hdd) / (prev_v / prev_hdd) - 1))


def week_message(cur: dict[str, Any], change: float | None) -> str:
    """Kurztext für die Wochen-Push."""
    t = cur["total"]
    parts = [f"{t['heating_h']:.0f} Heizstunden"]
    if change is not None:
        parts[0] += f" ({'+' if change > 0 else '−' if change < 0 else '±'}{abs(change):.0f} % ggü. Vorwoche, wetterbereinigt)"
    if t["setback_h"]:
        parts.append(f"{t['setback_h']:.0f} h abgesenkt, ≈ {cur['total']['saving_pct']:.0f} % gespart")
    if t["on_target_pct"] is not None:
        parts.append(f"{t['on_target_pct']} % auf Zieltemperatur")
    humid = sorted(((n, r["humid_h"]) for n, r in cur["rooms"].items() if r["humid_h"] >= 2), key=lambda x: -x[1])
    if humid:
        parts.append(", ".join(f"{n} {h:.0f} h zu feucht" for n, h in humid[:2]))
    return " · ".join(parts)
