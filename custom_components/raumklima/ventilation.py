"""Lüftungslogik ohne Home-Assistant-Abhängigkeit (separat testbar).

Grundlagen:
- Lüftdauer nach Außentemperatur, Rückfall auf Monatstabelle (co2online / UBA)
- Mindesttemperatur: Wohnräume 18 °C, Schlafräume/selten genutzt 16 °C (UBA, LAUG)
- Lüften trocknet nur, wenn die absolute Feuchte draußen niedriger ist als drinnen
"""

from __future__ import annotations

from dataclasses import dataclass
import math

# Lüftdauer (Minuten) nach Außentemperatur: (obere Grenze °C, Minuten)
DURATION_BY_OUTDOOR = [(0.0, 4), (5.0, 5), (10.0, 10), (15.0, 15), (20.0, 20)]
DURATION_HOT = 30
# Monatstabelle co2online (Jan..Dez)
DURATION_BY_MONTH = [5, 5, 10, 15, 20, 30, 30, 30, 15, 20, 10, 5]

ROOM_TYPES = {
    # typ: (Mindesttemperatur °C, Feuchte-Grenze %)
    "living": (18.0, 70.0),
    "kitchen": (18.0, 70.0),
    "bedroom": (16.0, 70.0),
    "bathroom": (18.0, 75.0),
    "children": (18.0, 70.0),
    "rarely_used": (16.0, 70.0),
}
DEFAULT_ROOM_TYPE = "living"

# Wunschtemperatur je Raumtyp (UBA-Empfehlungen)
COMFORT_BY_ROOM = {
    "living": 20.0,
    "children": 20.0,
    "kitchen": 19.0,
    "bathroom": 22.0,
    "bedroom": 17.0,
    "rarely_used": 17.0,
}
MIN_USEFUL_TARGET = 12.0  # darunter gilt ein Sollwert als "aus"-Rest (z. B. 5 °C)

# CO₂ (UBA/Pettenkofer): unter 1000 ppm unbedenklich, 1000–2000 auffällig
CO2_LIMIT = 1000.0  # ab hier „Bitte lüften“
CO2_DONE = 800.0  # darunter ist die Luft beim Lüften ausgetauscht


def comfort_temperature(configured: float | None, room_type: str | None) -> float:
    """Wunschtemperatur: eingestellt oder Standard des Raumtyps."""
    if configured not in (None, "", 0):
        return float(configured)
    return COMFORT_BY_ROOM.get(room_type or DEFAULT_ROOM_TYPE, 20.0)

VENT_OK = "ok"
VENT_PLEASE_OPEN = "please_open"
VENT_AIRING = "airing"
VENT_DONE = "done"
VENT_PLEASE_CLOSE = "please_close"
VENT_TOO_COLD = "too_cold"
VENT_STATES = [VENT_OK, VENT_PLEASE_OPEN, VENT_AIRING, VENT_DONE, VENT_PLEASE_CLOSE, VENT_TOO_COLD]


def dew_point(temp: float | None, rel_humidity: float | None) -> float | None:
    """Taupunkt nach Magnus-Formel (°C)."""
    if temp is None or rel_humidity is None or rel_humidity <= 0:
        return None
    a, b = (17.62, 243.12) if temp >= 0 else (22.46, 272.62)
    gamma = math.log(rel_humidity / 100.0) + a * temp / (b + temp)
    return round(b * gamma / (a - gamma), 1)


def absolute_humidity(temp: float | None, rel_humidity: float | None) -> float | None:
    """Absolute Feuchte in g/m³."""
    if temp is None or rel_humidity is None:
        return None
    sat = 6.112 * math.exp(17.62 * temp / (243.12 + temp))  # hPa
    return round(216.7 * (rel_humidity / 100.0 * sat) / (273.15 + temp), 1)


def recommended_duration(outdoor_temp: float | None, month: int) -> int:
    """Empfohlene Stoßlüft-Dauer in Minuten."""
    if outdoor_temp is not None:
        for limit, minutes in DURATION_BY_OUTDOOR:
            if outdoor_temp < limit:
                return minutes
        return DURATION_HOT
    return DURATION_BY_MONTH[(month - 1) % 12]


def airing_dries(indoor_abs: float | None, outdoor_abs: float | None, margin: float = 1.0) -> bool:
    """Trocknet Lüften den Raum? Ohne Außenwerte: ja (Winterfall)."""
    if indoor_abs is None or outdoor_abs is None:
        return True
    return outdoor_abs + margin < indoor_abs


@dataclass
class VentInput:
    """Momentaufnahme für die Bewertung."""

    window_open: bool
    open_minutes: float
    room_temp: float | None
    temp_at_open: float | None
    humidity: float | None
    humidity_high_minutes: float
    humidity_limit: float
    humidity_hysteresis: float
    min_temp: float
    max_drop: float
    duration: int
    dries: bool
    high_delay_minutes: float = 15.0
    co2: float | None = None
    co2_limit: float = CO2_LIMIT
    co2_done: float = CO2_DONE


def evaluate(v: VentInput) -> str:
    """Lüftungszustand bestimmen (Priorität: Auskühlen > Schließen > ...)."""
    if v.window_open:
        if v.room_temp is not None:
            if v.room_temp < v.min_temp:
                return VENT_TOO_COLD
            if v.temp_at_open is not None and v.temp_at_open - v.room_temp >= v.max_drop:
                return VENT_TOO_COLD
        if v.open_minutes >= v.duration:
            return VENT_PLEASE_CLOSE
        if v.open_minutes >= 2 and air_exchanged(v):
            return VENT_DONE
        return VENT_AIRING
    if v.co2 is not None and v.co2 >= v.co2_limit:
        return VENT_PLEASE_OPEN  # verbrauchte Luft: lüften hilft immer, auch wenn es draußen feucht ist
    if (
        v.humidity is not None
        and v.humidity >= v.humidity_limit
        and v.humidity_high_minutes >= v.high_delay_minutes
        and v.dries
    ):
        return VENT_PLEASE_OPEN
    return VENT_OK


def air_exchanged(v: VentInput) -> bool:
    """Beim Lüften: sind alle vorhandenen Werte (Feuchte, CO₂) wieder gut?"""
    if v.humidity is None and v.co2 is None:
        return False
    if v.humidity is not None and v.humidity >= v.humidity_limit - v.humidity_hysteresis:
        return False
    return v.co2 is None or v.co2 < v.co2_done


def vent_reason(v: VentInput) -> str:
    """Warum „Bitte lüften“? „co2“ oder „humidity“."""
    return "co2" if v.co2 is not None and v.co2 >= v.co2_limit else "humidity"


def mold_risk(humidity: float | None, room_temp: float | None, high_hours: float) -> bool:
    """Grobe Schimmel-Warnung: dauerhaft > 70 % oder kalter, feuchter Raum."""
    if humidity is None:
        return False
    if humidity >= 70 and high_hours >= 3:
        return True
    return room_temp is not None and room_temp < 16 and humidity >= 65


def in_quiet_hours(hour: int, minute: int, start: str, end: str) -> bool:
    """Liegt die Uhrzeit in den Ruhezeiten (z. B. 22:00–07:00)?"""
    def parse(value: str) -> int:
        h, m = (value or "0:0").split(":")[:2]
        return int(h) * 60 + int(m)

    now = hour * 60 + minute
    s, e = parse(start), parse(end)
    if s == e:
        return False
    return s <= now < e if s < e else now >= s or now < e
