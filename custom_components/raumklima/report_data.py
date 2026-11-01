"""PDF-Heizbericht: Zeiträume, Vergleiche und Auffälligkeiten (ohne Home Assistant).

Drei Berichte: Woche (Mo–So), Monat und Heizsaison. Verglichen wird wetterbereinigt
(Ventil-Volllaststunden je Heizgradtag) mit dem Vorzeitraum und – sobald Daten da sind –
mit demselben Zeitraum im Vorjahr.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from .stats import compare, summarize

WEEK = "week"
MONTH = "month"
SEASON = "season"
REPORT_KINDS = (WEEK, MONTH, SEASON)

MIN_COVERAGE = 0.5  # Vorjahr nur, wenn mind. die Hälfte der Zeit Daten da sind


def report_lang(language: str | None) -> str:
    """Deutsch bleibt Deutsch, alles andere wird Englisch."""
    return "de" if (language or "").lower().startswith("de") else "en"


def _md(value: str, year: int) -> date:
    month, day = (int(x) for x in value.split("-"))
    return date(year, month, min(day, 28) if month == 2 else day)


def period(kind: str, today: date, season_start: str = "10-01", season_end: str = "04-30", current: bool = False) -> tuple[date, date]:
    """Zeitraum des Berichts. current=False: letzter abgeschlossener Zeitraum, True: bis heute."""
    if kind == WEEK:
        if current:
            return today - timedelta(days=today.weekday()), today
        end = today if today.weekday() == 6 else today - timedelta(days=today.weekday() + 1)
        return end - timedelta(days=6), end
    if kind == MONTH:
        if current:
            return today.replace(day=1), today
        end = today.replace(day=1) - timedelta(days=1)
        return end.replace(day=1), end
    # Heizsaison, z. B. 01.10. bis 30.04.
    start_this = _md(season_start, today.year)
    if current:
        start = start_this if start_this <= today else _md(season_start, today.year - 1)
        return start, today
    end = _md(season_end, today.year)
    if end >= today:
        end = _md(season_end, today.year - 1)
    start = _md(season_start, end.year - 1 if _md(season_start, end.year) > end else end.year)
    return start, end


def previous(kind: str, start: date, end: date, season_start: str = "10-01", season_end: str = "04-30") -> tuple[date, date]:
    """Vorzeitraum: Vorwoche, Vormonat bzw. vorige Saison (gleiche Länge, wenn noch nicht vorbei)."""
    if kind == WEEK:
        return start - timedelta(days=7), start - timedelta(days=7) + (end - start)
    if kind == MONTH:
        prev_end_full = start - timedelta(days=1)
        prev_start = prev_end_full.replace(day=1)
        return prev_start, min(prev_end_full, prev_start + (end - start))
    return year_ago(kind, start, end)


def year_ago(kind: str, start: date, end: date) -> tuple[date, date]:
    """Gleicher Zeitraum ein Jahr früher (Woche: 52 Wochen, damit die Wochentage passen)."""
    if kind == WEEK:
        return start - timedelta(days=364), end - timedelta(days=364)

    def back(d: date) -> date:
        try:
            return d.replace(year=d.year - 1)
        except ValueError:  # 29.02.
            return d.replace(year=d.year - 1, day=28)

    return back(start), back(end)


def _coverage(summary: dict[str, Any], start: date, end: date) -> float:
    rooms = [r for r in summary["rooms"].values() if r["hours"]]
    if not rooms:
        return 0.0
    days = (end - start).days + 1
    return summary["total"]["hours"] / len(rooms) / (days * 24)


def series(rooms: dict[str, dict[str, dict[str, float]]], home: dict[str, dict[str, float]], kind: str, start: date, end: date) -> list[dict[str, Any]]:
    """Balken fürs Diagramm: je Tag (Woche/Monat) bzw. je Monat (Saison)."""
    out = []
    if kind == SEASON:
        d = start.replace(day=1)
        while d <= end:
            nxt = (d + timedelta(days=32)).replace(day=1)
            s = summarize(rooms, home, max(d, start), min(nxt - timedelta(days=1), end))
            out.append({"date": d.isoformat(), "heating_h": s["total"]["heating_h"], "outdoor": s["outdoor_avg"], "hdd": s["hdd"]})
            d = nxt
        return out
    d = start
    while d <= end:
        s = summarize(rooms, home, d, d)
        out.append({"date": d.isoformat(), "heating_h": s["total"]["heating_h"], "outdoor": s["outdoor_avg"], "hdd": s["hdd"], "recorded": s["total"]["hours"] > 0})
        d += timedelta(days=1)
    return out


TEXT = {
    "de": {
        "humid": "{room}: {h} h über der Feuchtegrenze – öfter kurz stoßlüften (5–10 min).",
        "mold": "{room}: {h} h mit Schimmelrisiko – lüften und nicht zu stark absenken.",
        "target": "{room}: nur {p} % der Zeit auf Zieltemperatur – Ventil, Heizkörper oder Vorlauftemperatur prüfen.",
        "tilt": "{room}: Fenster {h} h offen bei {n}× Lüften – lieber kurz stoßlüften statt kippen.",
        "night": "{room}: {h} h bei offenem Fenster geschlafen.",
        "arrive": "Nur bei {p} % der Ankünfte war es schon warm – Vorheizen-Entfernung erhöhen.",
        "more": "Wetterbereinigt {c} % mehr geheizt als im Vorzeitraum.",
        "less": "Wetterbereinigt {c} % weniger geheizt als im Vorzeitraum.",
        "more_ya": "Wetterbereinigt {c} % mehr als vor einem Jahr.",
        "less_ya": "Wetterbereinigt {c} % weniger als vor einem Jahr.",
        "saving": "Die Absenkung hat etwa {s} % Heizenergie gespart.",
        "empty": "{room}: {h} h abgesenkt, weil niemand im Raum war.",
        "issue": "{room}: {title}",
        "fine": "Keine Auffälligkeiten – alles im grünen Bereich.",
    },
    "en": {
        "humid": "{room}: {h} h above the humidity limit – air briefly more often (5–10 min).",
        "mold": "{room}: {h} h with mould risk – air the room and don't lower too much.",
        "target": "{room}: only {p} % of the time at target – check valve, radiator or flow temperature.",
        "tilt": "{room}: window open {h} h with {n} airings – better short, wide airing than a tilted window.",
        "night": "{room}: slept {h} h with the window open.",
        "arrive": "Only {p} % of arrivals found it warm – increase the preheating distance.",
        "more": "Weather-adjusted {c} % more heating than in the previous period.",
        "less": "Weather-adjusted {c} % less heating than in the previous period.",
        "more_ya": "Weather-adjusted {c} % more than a year ago.",
        "less_ya": "Weather-adjusted {c} % less than a year ago.",
        "saving": "Setback saved roughly {s} % of heating energy.",
        "empty": "{room}: {h} h lowered because nobody was in the room.",
        "issue": "{room}: {title}",
        "fine": "Nothing unusual – everything looks good.",
    },
}
ORDER = {"alert": 0, "warn": 1, "info": 2, "good": 3}


def _n(value: float, lang: str, digits: int = 0) -> str:
    text = f"{value:.{digits}f}"
    return text.replace(".", ",") if lang == "de" else text


def findings(data: dict[str, Any], issues: list[dict[str, Any]], lang: str) -> list[tuple[str, str]]:
    """Auffälligkeiten und Tipps als (Schwere, Text), wichtigste zuerst."""
    tx = TEXT[lang]
    cur = data["current"]
    weeks = max(data["days"] / 7, 1 / 7)
    out: list[tuple[str, str]] = []
    for name, r in cur["rooms"].items():
        if not r["hours"]:
            continue
        if r["mold_h"] >= 1:
            out.append(("alert", tx["mold"].format(room=name, h=_n(r["mold_h"], lang))))
        if r["humid_h"] >= 4 * weeks:
            out.append(("warn", tx["humid"].format(room=name, h=_n(r["humid_h"], lang))))
        if r["on_target_pct"] is not None and r["on_target_pct"] < 70 and r["heating_h"] >= 2 * weeks:
            out.append(("warn", tx["target"].format(room=name, p=r["on_target_pct"])))
        if r["airing_h"] >= 6 * weeks and r["airings"] and r["airing_h"] * 60 / r["airings"] > 30:
            out.append(("warn", tx["tilt"].format(room=name, h=_n(r["airing_h"], lang), n=r["airings"])))
        if r["night_h"] >= 1:
            out.append(("info", tx["night"].format(room=name, h=_n(r["night_h"], lang))))
        if r["empty_h"] >= 1:
            out.append(("good", tx["empty"].format(room=name, h=_n(r["empty_h"], lang))))
    total = cur["total"]
    if total["arrivals"] >= 2 and total["arrivals_warm_pct"] is not None and total["arrivals_warm_pct"] < 70:
        out.append(("info", tx["arrive"].format(p=total["arrivals_warm_pct"])))
    change = data.get("change")
    if change is not None and abs(change) >= 10:
        out.append(("warn" if change > 0 else "good", tx["more" if change > 0 else "less"].format(c=abs(change))))
    change_ya = data.get("change_year")
    if change_ya is not None and abs(change_ya) >= 10:
        out.append(("info" if change_ya > 0 else "good", tx["more_ya" if change_ya > 0 else "less_ya"].format(c=abs(change_ya))))
    if total["saving_pct"] >= 3:
        out.append(("good", tx["saving"].format(s=_n(total["saving_pct"], lang))))
    for issue in issues:
        sev = issue.get("severity", "warn")
        out.append(("alert" if sev == "alert" else "warn", tx["issue"].format(room=issue.get("room", ""), title=issue.get("title", ""))))
    if not [f for f in out if f[0] in ("alert", "warn")]:
        out.append(("good", tx["fine"]))
    out.sort(key=lambda f: ORDER[f[0]])
    return out[:12]


def build(
    rooms: dict[str, dict[str, dict[str, float]]],
    home: dict[str, dict[str, float]],
    kind: str,
    start: date,
    end: date,
    issues: list[dict[str, Any]] | None = None,
    lang: str = "de",
    season: tuple[str, str] = ("10-01", "04-30"),
    extras: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Alle Zahlen für einen Bericht."""
    cur = summarize(rooms, home, start, end)
    p_start, p_end = previous(kind, start, end, *season)
    prev = summarize(rooms, home, p_start, p_end)
    y_start, y_end = year_ago(kind, start, end)
    ya = summarize(rooms, home, y_start, y_end)
    has_ya = _coverage(ya, y_start, y_end) >= MIN_COVERAGE
    data = {
        "kind": kind,
        "start": start.isoformat(),
        "end": end.isoformat(),
        "days": (end - start).days + 1,
        "current": cur,
        "previous": prev if _coverage(prev, p_start, p_end) > 0 else None,
        "previous_range": [p_start.isoformat(), p_end.isoformat()],
        "year_ago": ya if has_ya else None,
        "change": compare(cur, prev),
        "change_year": compare(cur, ya) if has_ya else None,
        "series": series(rooms, home, kind, start, end),
        "lang": lang,
    }
    data["findings"] = findings(data, issues or [], lang)
    add_extras(data, rooms, home, extras or {})
    return data


def add_extras(data: dict[str, Any], rooms: dict[str, Any], home: dict[str, Any], extras: dict[str, Any]) -> None:
    """Weitere Auswertungen: Feuchte, Lüften, Werktag/WE, Rangliste, Verläufe, Wärmebild, Note, Euro, Tipps."""
    from . import report_extra as rx

    kind, lang = data["kind"], data["lang"]
    start, end = date.fromisoformat(data["start"]), date.fromisoformat(data["end"])
    cur = data["current"]
    weeks = max(data["days"] / 7, 1 / 7)
    annual_cost = extras.get("annual_cost") or None
    daily = data["series"] if kind != SEASON else series(rooms, home, MONTH, start, end)
    grid = rx.heatmap(rooms, start, end)
    data["humidity"] = {
        "lights": {n: rx.humidity_light(r, weeks) for n, r in cur["rooms"].items() if r["hours"]},
        "problem": rx.problem_room(cur),
    }
    data["airing"] = rx.airing_rows(cur)
    data["weekday"] = rx.weekday_weekend(rooms, home, start, end)
    data["ranking"] = rx.ranking(cur, data["previous"])
    data["trends"] = rx.room_trends(rooms, home, kind, start, end)
    data["heatmap"] = grid
    data["highlights"] = rx.season_highlights(daily, data["series"]) if kind == SEASON else None
    data["score"] = rx.score(cur)
    data["score_history"] = rx.score_history(rooms, home, kind, end, 6 if kind != WEEK else 8)
    data["money"] = rx.money(cur, annual_cost)
    data["tips"] = rx.saving_tips(cur, daily, grid, annual_cost, extras.get("room_types", {}), lang)
    data["presence"] = {
        "away_h": cur["away_h"],
        "preheats": cur["preheats"],
        "arrivals": cur["total"]["arrivals"],
        "arrivals_warm_pct": cur["total"]["arrivals_warm_pct"],
        "occupied": {n: r["occupied_pct"] for n, r in cur["rooms"].items() if r.get("occupied_pct") is not None},
        "heatup": extras.get("heatup", {}),
    }
    data["reliability"] = {
        "rooms": {n: {"sync_failed_h": r["sync_failed_h"], "trv_down_h": r["trv_down_h"]} for n, r in cur["rooms"].items() if r["hours"]},
        "blips": cur.get("blips", 0),
        "batteries": extras.get("batteries", {}),
    }
    data["co2"] = {n: {"avg": r["co2_avg"], "high_h": r["co2_high_h"]} for n, r in cur["rooms"].items() if r.get("co2_avg") is not None}
