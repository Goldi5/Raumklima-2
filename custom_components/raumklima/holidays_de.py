"""Gesetzliche Feiertage in Deutschland je Bundesland (ohne externe Bibliothek)."""

from __future__ import annotations

from datetime import date, timedelta
from functools import lru_cache

STATES = {
    "BW": "Baden-Württemberg",
    "BY": "Bayern",
    "BE": "Berlin",
    "BB": "Brandenburg",
    "HB": "Bremen",
    "HH": "Hamburg",
    "HE": "Hessen",
    "MV": "Mecklenburg-Vorpommern",
    "NI": "Niedersachsen",
    "NW": "Nordrhein-Westfalen",
    "RP": "Rheinland-Pfalz",
    "SL": "Saarland",
    "SN": "Sachsen",
    "ST": "Sachsen-Anhalt",
    "SH": "Schleswig-Holstein",
    "TH": "Thüringen",
}


def easter(year: int) -> date:
    """Ostersonntag (gregorianisch, Meeus/Jones/Butcher)."""
    a = year % 19
    b, c = divmod(year, 100)
    d, e = divmod(b, 4)
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = divmod(c, 4)
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month, day = divmod(h + l - 7 * m + 114, 31)
    return date(year, month, day + 1)


@lru_cache(maxsize=64)
def holidays(year: int, state: str | None) -> dict[date, str]:
    e = easter(year)
    out = {
        date(year, 1, 1): "Neujahr",
        e - timedelta(days=2): "Karfreitag",
        e + timedelta(days=1): "Ostermontag",
        date(year, 5, 1): "Tag der Arbeit",
        e + timedelta(days=39): "Christi Himmelfahrt",
        e + timedelta(days=50): "Pfingstmontag",
        date(year, 10, 3): "Tag der Deutschen Einheit",
        date(year, 12, 25): "1. Weihnachtstag",
        date(year, 12, 26): "2. Weihnachtstag",
    }
    s = (state or "").upper()
    if s in ("BW", "BY", "ST"):
        out[date(year, 1, 6)] = "Heilige Drei Könige"
    if s == "BE" or (s == "MV" and year >= 2023):
        out[date(year, 3, 8)] = "Frauentag"
    if s in ("BW", "BY", "HE", "NW", "RP", "SL"):
        out[e + timedelta(days=60)] = "Fronleichnam"
    if s == "SL":
        out[date(year, 8, 15)] = "Mariä Himmelfahrt"
    if s == "TH":
        out[date(year, 9, 20)] = "Weltkindertag"
    if s in ("BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"):
        out[date(year, 10, 31)] = "Reformationstag"
    if s in ("BW", "BY", "NW", "RP", "SL"):
        out[date(year, 11, 1)] = "Allerheiligen"
    if s == "SN":
        nov23 = date(year, 11, 23)
        out[nov23 - timedelta(days=(nov23.weekday() - 2) % 7 or 7)] = "Buß- und Bettag"
    return out


def holiday_name(day: date, state: str | None) -> str | None:
    if not state:
        return None
    return holidays(day.year, state).get(day)
