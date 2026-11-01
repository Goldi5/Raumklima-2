"""Gesundheitscheck der Heizung (ohne Home-Assistant-Abhängigkeit, separat testbar)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

SEV_INFO = "info"
SEV_WARN = "warn"
SEV_ALERT = "alert"

BATTERY_WARN = 20.0
BATTERY_ALERT = 10.0
NOT_WARM_WINDOW = timedelta(hours=2)
NOT_WARM_VALVE = 60.0  # % Ventil im Mittel
NOT_WARM_RISE = 0.3  # K Anstieg in 2 h
FROZEN_HOURS = 12.0
FROZEN_TRV_DELTA = 1.5  # K: TRV hat sich bewegt, der Fühler nicht
RADIO_EVENTS = 3  # Ausfälle in 24 h
WINDOW_OPEN_HOURS = 24.0
WINDOW_UNAVAILABLE_HOURS = 2.0


@dataclass(frozen=True)
class Issue:
    code: str
    severity: str
    title: str
    message: str

    def as_dict(self) -> dict[str, str]:
        return {"code": self.code, "severity": self.severity, "title": self.title, "message": self.message}


@dataclass
class HistoryPoint:
    when: datetime
    valve: float | None
    temp: float | None
    target: float
    regulating: bool  # Heizung soll arbeiten (an, kein Fenster, keine Heizpause)


def check_battery(levels: dict[str, float]) -> list[Issue]:
    """Batteriestände (Name → %) prüfen."""
    issues = []
    for name, level in sorted(levels.items()):
        if level is None:
            continue
        if level < BATTERY_ALERT:
            issues.append(Issue(f"battery:{name}", SEV_ALERT, "Batterie fast leer", f"{name}: noch {level:.0f} % – bald wechseln."))
        elif level < BATTERY_WARN:
            issues.append(Issue(f"battery:{name}", SEV_WARN, "Batterie schwach", f"{name}: noch {level:.0f} %."))
    return issues


def check_not_warming(history: list[HistoryPoint], now: datetime) -> Issue | None:
    """Ventil lange weit offen, Raum wird trotzdem nicht wärmer → Heizkörper prüfen."""
    window = [p for p in history if now - p.when <= NOT_WARM_WINDOW]
    if not window or now - window[0].when < NOT_WARM_WINDOW - timedelta(minutes=10):
        return None  # noch keine 2 h Daten
    if not all(p.regulating and p.valve is not None and p.temp is not None for p in window):
        return None
    valves = [p.valve for p in window]
    if sum(valves) / len(valves) < NOT_WARM_VALVE or min(valves) < NOT_WARM_VALVE / 2:
        return None
    first, last = window[0], window[-1]
    if last.target - last.temp < 0.5:
        return None  # Ziel praktisch erreicht
    if last.temp - first.temp >= NOT_WARM_RISE:
        return None
    return Issue(
        "not_warming",
        SEV_WARN,
        "Raum wird nicht warm",
        f"Ventil seit 2 h zu {sum(valves) / len(valves):.0f} % offen, Temperatur nur "
        f"{last.temp - first.temp:+.1f} K. Heizkörper entlüften, Ventilstift oder Vorlauf prüfen.",
    )


def check_sensor_frozen(hours_unchanged: float | None, trv_delta: float | None) -> Issue | None:
    """Fühlerwert seit Stunden gleich, obwohl sich am Thermostat etwas tut."""
    if hours_unchanged is None or trv_delta is None:
        return None
    if hours_unchanged >= FROZEN_HOURS and abs(trv_delta) >= FROZEN_TRV_DELTA:
        return Issue(
            "sensor_frozen",
            SEV_WARN,
            "Fühler meldet sich nicht",
            f"Seit {hours_unchanged:.0f} h derselbe Wert, das Thermostat misst {trv_delta:+.1f} K Änderung. Batterie/Funk des Fühlers prüfen.",
        )
    return None


SENSOR_MISSING_HOURS = 1.0
CONNECTION_BLIPS = 10  # kurze Gesamtausfälle in 24 h


def check_sensor_missing(hours_without_value: float | None) -> Issue | None:
    """Raumfühler liefert seit über einer Stunde keine Werte."""
    if hours_without_value is None or hours_without_value < SENSOR_MISSING_HOURS:
        return None
    return Issue(
        "sensor_missing",
        SEV_WARN,
        "Raumfühler meldet sich nicht",
        f"Seit {hours_without_value:.0f} h keine Werte – geregelt wird solange mit dem Fühler am Thermostat. Batterie und Funk des Fühlers prüfen.",
    )


def check_connection(blips_24h: int, typical_seconds: float | None) -> Issue | None:
    """Alle Thermostate gleichzeitig kurz weg → Verbindung (Zigbee2MQTT/MQTT/VPN), nicht die Geräte."""
    if blips_24h < CONNECTION_BLIPS:
        return None
    dur = f", je ~{typical_seconds:.0f} s" if typical_seconds else ""
    return Issue(
        "connection",
        SEV_INFO,
        "Verbindung zu den Thermostaten wackelt",
        f"In 24 h waren {blips_24h}× alle Thermostate gleichzeitig kurz weg{dur}. Das liegt an Zigbee2MQTT, MQTT oder dem VPN, nicht an den Geräten; die Regelung holt alles nach.",
    )


def check_radio(unavailable_events_24h: int, sync_failed: bool) -> Issue | None:
    if sync_failed:
        return Issue("radio", SEV_ALERT, "Thermostat reagiert nicht", "Befehle werden nicht bestätigt – Funkverbindung oder Batterie prüfen.")
    if unavailable_events_24h >= RADIO_EVENTS:
        return Issue("radio", SEV_WARN, "Funk wackelt", f"Thermostat war in 24 h {unavailable_events_24h}× nicht erreichbar.")
    return None


def check_window(open_hours: float | None, unavailable_hours: float | None) -> Issue | None:
    if unavailable_hours is not None and unavailable_hours >= WINDOW_UNAVAILABLE_HOURS:
        return Issue("window_sensor", SEV_WARN, "Fensterkontakt meldet sich nicht", f"Seit {unavailable_hours:.0f} h keine Rückmeldung – Batterie prüfen.")
    if open_hours is not None and open_hours >= WINDOW_OPEN_HOURS:
        return Issue("window_open_long", SEV_INFO, "Fenster seit über einem Tag offen", f"Seit {open_hours:.0f} h offen – Kontakt verrutscht oder wirklich offen?")
    return None


HYDRAULIC_WINDOW = timedelta(hours=24)
HYDRAULIC_MIN_HOURS = 8.0  # so viel Heizzeit muss im Fenster liegen
HYDRAULIC_VALVE = 90.0  # % – „fast ganz offen“
HYDRAULIC_VALVE_SHARE = 0.5  # in mehr als der Hälfte der Heizzeit …
HYDRAULIC_REACHED_SHARE = 0.3  # … und das Ziel nur selten erreicht


def check_hydraulic(history: list[HistoryPoint], now: datetime, step_minutes: float = 10.0) -> Issue | None:
    """Ventil dauernd fast ganz offen und der Raum erreicht sein Ziel trotzdem kaum.

    Anders als „Raum wird nicht warm“ (2 h, akut) ist das ein Muster über einen Tag:
    der Heizkörper bekommt zu wenig Wärme – typisch für einen fehlenden hydraulischen
    Abgleich, eine zu niedrige Vorlauftemperatur oder einen zu kleinen Heizkörper.
    """
    window = [p for p in history if now - p.when <= HYDRAULIC_WINDOW and p.regulating and p.valve is not None and p.temp is not None]
    hours = len(window) * step_minutes / 60
    if hours < HYDRAULIC_MIN_HOURS:
        return None
    wide = sum(1 for p in window if p.valve >= HYDRAULIC_VALVE) / len(window)
    reached = sum(1 for p in window if p.temp >= p.target - 0.5) / len(window)
    if wide <= HYDRAULIC_VALVE_SHARE or reached >= HYDRAULIC_REACHED_SHARE:
        return None
    return Issue(
        "hydraulic",
        SEV_INFO,
        "Heizkörper kommt kaum hinterher",
        f"In den letzten 24 h war das Ventil {wide * 100:.0f} % der Heizzeit fast ganz offen, das Ziel wurde nur "
        f"{reached * 100:.0f} % der Zeit erreicht. Mögliche Ursachen: hydraulischer Abgleich fehlt, "
        "Vorlauftemperatur der Heizung zu niedrig oder Heizkörper zu klein für den Raum.",
    )
