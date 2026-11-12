"""Zahl-Einstellungen: Einheit, Schrittweite und Grenzen – die eine Quelle für Backend und Karte.

Die Karte bekommt daraus ``frontend/src/fields.js`` (``python scripts/gen_fields.py``); ein Test prüft,
dass die Datei aktuell ist. Die Grenzen der Karte (``ui_min``/``ui_max``) dürfen enger sein als das,
was das Backend annimmt (``lo``/``hi``) – z. B. „… wenn belegt seit“: Karte 0–30 min, Backend bis 120.
Ohne HA-Abhängigkeit, damit das Skript und die Tests es direkt laden können.
"""

from __future__ import annotations

from typing import NamedTuple


class NumField(NamedTuple):
    unit: str
    step: float
    ui_min: float
    ui_max: float
    dec: int
    kind: str | None = "float"  # Zahlentyp im Backend: "float", "int" – None = eigene Prüfung
    lo: float | None = None  # Backend-Grenzen
    hi: float | None = None
    nullable: bool = False  # None erlaubt (= Standardwert)


NUM: dict[str, NumField] = {
    "away_delay": NumField(" min", 5, 0, 240, 0, 'float', 0, 600),
    "long_away_hours": NumField(" h", 1, 2, 168, 0, 'float', 1, 720),
    "preheat_km": NumField(" km", 1, 0, 200, 0, 'float', 0, 500),
    "vacation_km": NumField(" km", 10, 0, 1000, 0, 'float', 0, 1000),
    "vacation_hours": NumField(" h", 1, 1, 96, 0, 'float', 1, 336),
    "work_zone_minutes": NumField(" min", 1, 0, 120, 0, 'float', 0, 120),
    "heating_limit": NumField(" °C", 0.5, 5, 25, 1, 'float', 5, 25),
    "cold_snap_temp": NumField(" °C", 0.5, 0, 20, 1, 'float', 0, 20),
    "frost_floor": NumField(" °C", 0.5, 5, 20, 1, 'float', 5, 20),
    "night_alarm_temp": NumField(" °C", 0.5, 5, 20, 1, 'float', 5, 20),
    "storm_gust_kmh": NumField(" km/h", 10, 30, 200, 0, 'float', 30, 200),
    "storm_rain_mm": NumField(" mm/h", 1, 1, 50, 0, 'float', 1, 50),
    "repeat_minutes": NumField(" min", 1, 1, 60, 0, None, None, None),
    "boost_temperature": NumField(" K", 0.5, 0.5, 5, 1, 'float', 0.5, 5),
    "boost_minutes": NumField(" min", 5, 5, 240, 0, 'int', 5, 240),
    "override_minutes": NumField(" min", 15, 0, 480, 0, 'float', 0, 480),
    "airing_min_minutes": NumField(" min", 1, 0, 30, 0, 'int', 0, 30),
    "long_airing_minutes": NumField(" min", 5, 0, 180, 0, 'float', 0, 180),
    "long_airing_remind": NumField(" min", 15, 0, 240, 0, 'float', 0, 240),
    "comfort_temperature": NumField(" °C", 0.5, 12, 26, 1, 'float', 12, 26, nullable=True),
    "setback_short": NumField(" °C", 0.5, 10, 24, 1, 'float', 10, 24),
    "setback_long": NumField(" °C", 0.5, 8, 22, 1, 'float', 8, 22),
    "preheat_lead_min": NumField(" min", 15, 15, 360, 0, 'int', 0, 360),
    "mold_cap": NumField(" K", 0.5, 0, 6, 1, 'float', 0, 6),
    "window_open_delay": NumField(" s", 5, 0, 600, 0, 'float', 0, 600),
    "window_close_delay": NumField(" s", 5, 0, 600, 0, 'float', 0, 600),
    "presence_target": NumField(" °C", 0.5, 5, 30, 1, 'float', 0, 30),
    "presence_delay_min": NumField(" min", 1, 0, 30, 0, 'float', 0, 120),
    "presence_release_min": NumField(" min", 1, 1, 30, 0, 'float', 1, 120),
    "room_eco_after": NumField(" min", 5, 5, 240, 0, 'float', 5, 240),
    "room_eco_drop": NumField(" °C", 0.5, 0.5, 4, 1, 'float', 0.5, 4),
}


def to_js() -> str:
    """Inhalt von frontend/src/fields.js."""
    lines = [
        "// ERZEUGT aus custom_components/raumklima/fields.py – nicht von Hand ändern",
        "// (python scripts/gen_fields.py). Einheit, Schrittweite, Grenzen und Nachkommastellen der Karte.",
        "export const RK_NUM = {",
    ]

    def num(x: float) -> str:
        return str(int(x)) if float(x).is_integer() else str(x)

    for key, f in NUM.items():
        lines.append(
            f'  {key}: {{ unit: "{f.unit}", step: {num(f.step)}, min: {num(f.ui_min)}, max: {num(f.ui_max)}, dec: {f.dec} }},'
        )
    lines.append("};")
    return "\n".join(lines) + "\n"
