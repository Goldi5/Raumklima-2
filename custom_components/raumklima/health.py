"""Gesundheitscheck der Heizung (ohne Home-Assistant-Abhängigkeit, separat testbar)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

from .msg import sdec, tr

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
# Betriebsarten, in denen ein Thermostat seinen eigenen Zeitplan abarbeitet
TRV_SCHEDULE_MODES = ("auto",)
TRV_SCHEDULE_PRESETS = ("auto", "schedule", "program", "programme", "timed", "timer")
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
            issues.append(Issue(f"battery:{name}", SEV_ALERT, tr("Batterie fast leer"), tr("{name}: noch {level} % – bald wechseln.", name=name, level=f"{level:.0f}")))
        elif level < BATTERY_WARN:
            issues.append(Issue(f"battery:{name}", SEV_WARN, tr("Batterie schwach"), tr("{name}: noch {level} %.", name=name, level=f"{level:.0f}")))
    return issues


def check_trv_mode(mode: str | None, preset: str | None) -> Issue | None:
    """Thermostat arbeitet seinen eigenen Zeitplan ab (Issue #13).

    Viele Geräte (Tuya, Bosch, Homematic) führen im Modus „Auto“ einen eingebauten Wochenplan.
    Der überschreibt den Sollwert, den Raumklima schreibt – der Raum heizt dann gegen den Plan.
    """
    schedule = str(mode or "").lower() in TRV_SCHEDULE_MODES or str(preset or "").lower() in TRV_SCHEDULE_PRESETS
    if not schedule:
        return None
    return Issue(
        "trv_mode",
        SEV_WARN,
        tr("Thermostat arbeitet nach eigenem Zeitplan"),
        tr(
            "Das Gerät steht auf „Auto“ und folgt seinem eingebauten Wochenplan – damit kann es dem "
            "widersprechen, was Raumklima vorgibt. Am Thermostat auf „Heat“ stellen (nicht „Auto“), dann "
            "regelt Raumklima allein."
        ),
    )


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
        tr("Raum wird nicht warm"),
        tr(
            "Ventil seit 2 h zu {valve} % offen, Temperatur nur {rise} K. Heizkörper entlüften, Ventilstift oder Vorlauf prüfen.",
            valve=f"{sum(valves) / len(valves):.0f}",
            rise=sdec(last.temp - first.temp),
        ),
    )


def check_sensor_frozen(hours_unchanged: float | None, trv_delta: float | None) -> Issue | None:
    """Fühlerwert seit Stunden gleich, obwohl sich am Thermostat etwas tut."""
    if hours_unchanged is None or trv_delta is None:
        return None
    if hours_unchanged >= FROZEN_HOURS and abs(trv_delta) >= FROZEN_TRV_DELTA:
        return Issue(
            "sensor_frozen",
            SEV_WARN,
            tr("Fühler meldet sich nicht"),
            tr(
                "Seit {hours} h derselbe Wert, das Thermostat misst {delta} K Änderung. Batterie/Funk des Fühlers prüfen.",
                hours=f"{hours_unchanged:.0f}",
                delta=sdec(trv_delta),
            ),
        )
    return None


SENSOR_MISSING_HOURS = 1.0
CONNECTION_BLIPS = 10  # kurze Gesamtausfälle in 24 h


def check_sensor_missing(hours_without_value: float | None, *, available: bool) -> Issue | None:
    """Raumfühler ist nicht erreichbar (unavailable/unknown).

    Ein Fühler, der nur bei Änderung sendet, ist *nicht* ausgefallen – sein Wert bleibt gültig,
    auch wenn er stundenlang derselbe ist. Abweichungen zum Thermostatfühler prüft
    ``check_sensor_frozen`` (Issue #14).
    """
    if available or hours_without_value is None or hours_without_value < SENSOR_MISSING_HOURS:
        return None
    return Issue(
        "sensor_missing",
        SEV_WARN,
        tr("Raumfühler meldet sich nicht"),
        tr(
            "Seit {hours} h keine Werte – geregelt wird solange mit dem Fühler am Thermostat. Batterie und Funk des Fühlers prüfen.",
            hours=f"{hours_without_value:.0f}",
        ),
    )


def check_connection(blips_24h: int, typical_seconds: float | None) -> Issue | None:
    """Alle Thermostate gleichzeitig kurz weg → Verbindung (Zigbee2MQTT/MQTT/VPN), nicht die Geräte."""
    if blips_24h < CONNECTION_BLIPS:
        return None
    dur = tr(", je ~{s} s", s=f"{typical_seconds:.0f}") if typical_seconds else ""
    return Issue(
        "connection",
        SEV_INFO,
        tr("Verbindung zu den Thermostaten wackelt"),
        tr(
            "In 24 h waren {n}× alle Thermostate gleichzeitig kurz weg{dur}. Das liegt an Zigbee2MQTT, MQTT oder dem VPN, nicht an den Geräten; die Regelung holt alles nach.",
            n=blips_24h,
            dur=dur,
        ),
    )


def check_radio(unavailable_events_24h: int, sync_failed: bool) -> Issue | None:
    if sync_failed:
        return Issue("radio", SEV_ALERT, tr("Thermostat reagiert nicht"), tr("Befehle werden nicht bestätigt – Funkverbindung oder Batterie prüfen."))
    if unavailable_events_24h >= RADIO_EVENTS:
        return Issue("radio", SEV_WARN, tr("Funk wackelt"), tr("Thermostat war in 24 h {n}× nicht erreichbar.", n=unavailable_events_24h))
    return None


def check_window(open_hours: float | None, unavailable_hours: float | None) -> Issue | None:
    if unavailable_hours is not None and unavailable_hours >= WINDOW_UNAVAILABLE_HOURS:
        return Issue("window_sensor", SEV_WARN, tr("Fensterkontakt meldet sich nicht"), tr("Seit {hours} h keine Rückmeldung – Batterie prüfen.", hours=f"{unavailable_hours:.0f}"))
    if open_hours is not None and open_hours >= WINDOW_OPEN_HOURS:
        return Issue("window_open_long", SEV_INFO, tr("Fenster seit über einem Tag offen"), tr("Seit {hours} h offen – Kontakt verrutscht oder wirklich offen?", hours=f"{open_hours:.0f}"))
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
        tr("Heizkörper kommt kaum hinterher"),
        tr(
            "In den letzten 24 h war das Ventil {wide} % der Heizzeit fast ganz offen, das Ziel wurde nur {reached} % der Zeit erreicht. "
            "Mögliche Ursachen: hydraulischer Abgleich fehlt, Vorlauftemperatur der Heizung zu niedrig oder Heizkörper zu klein für den Raum.",
            wide=f"{wide * 100:.0f}",
            reached=f"{reached * 100:.0f}",
        ),
    )
