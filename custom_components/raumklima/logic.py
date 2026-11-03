"""Reine Rechenlogik ohne Home-Assistant-Abhängigkeit (separat testbar)."""

from __future__ import annotations

from collections.abc import Iterable, Mapping
import math
from typing import Any

INVALID = ("unavailable", "unknown", None, "")


def is_valid(state: str | None) -> bool:
    """True, wenn ein Zustand ein echter Messwert / Zustand ist."""
    return state not in INVALID


def to_float(value: object) -> float | None:
    """Wert robust in float umwandeln, sonst None."""
    if value in INVALID:
        return None
    try:
        result = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    if math.isnan(result) or math.isinf(result):
        return None
    return result


def round_step(value: float, step: float) -> float:
    """Auf Schrittweite runden (z. B. 0.1 oder 0.5)."""
    return round(round(value / step) * step, 2)


def clamp(value: float, low: float, high: float) -> float:
    """Wert begrenzen."""
    return max(low, min(high, value))


def calc_offset(
    external: float | None,
    trv_reported: float | None,
    current_offset: float | None,
    *,
    threshold: float = 0.3,
    low: float = -10.0,
    high: float = 10.0,
    step: float = 0.1,
) -> float | None:
    """Neuen Kalibrier-Offset berechnen.

    Das TRV meldet ``trv_reported`` = Rohwert + aktueller Offset.
    Ziel: Rohwert + neuer Offset == externer Fühler.
    Gibt ``None`` zurück, wenn nichts gesendet werden soll.
    """
    if external is None or trv_reported is None:
        return None
    current = current_offset or 0.0
    raw = trv_reported - current
    new = clamp(round_step(external - raw, step), low, high)
    if abs(new - current) < threshold:
        return None
    return new


def calc_target_setpoint(
    target: float,
    external: float | None,
    trv_reported: float | None,
    *,
    low: float = 5.0,
    high: float = 30.0,
    step: float = 0.5,
) -> float:
    """Sollwert fürs TRV bei Kalibrierart "target".

    Misst das TRV z. B. 2 °C mehr als der Raum, wird sein Sollwert um 2 °C
    angehoben, damit der Raum das eigentliche Ziel erreicht.
    """
    if external is None or trv_reported is None:
        return clamp(round_step(target, step), low, high)
    return clamp(round_step(target + (trv_reported - external), step), low, high)


def values_match(actual: object, expected: float, tolerance: float) -> bool:
    """Vergleich mit Toleranz (Tuya rundet Werte)."""
    value = to_float(actual)
    return value is not None and abs(value - expected) <= tolerance


COVER_OPEN_STATES = ("open", "opening")


def window_open_state(entity_id: str, state: Any) -> str | None:
    """Fensterkontakt **oder** Dachluke/Dachfenster (``cover``) auf „on"/„off" bringen.

    Eine Kuppel zum Lüften liefert ``open``/``closed`` statt ``on``/``off``; eine
    teilweise geöffnete Luke (``current_position`` > 0) lüftet ebenfalls.
    """
    raw = str(getattr(state, "state", state) or "")
    if not is_valid(raw):
        return None
    if str(entity_id).startswith("cover."):
        if raw in COVER_OPEN_STATES:
            return "on"
        attrs = getattr(state, "attributes", None) or {}
        pos = attrs.get("current_position")
        try:
            return "on" if pos is not None and float(pos) > 0 else "off"
        except (TypeError, ValueError):
            return "off"
    return "on" if raw == "on" else "off"


def any_open(last_valid: Mapping[str, str | None], entities: Iterable[str]) -> bool:
    """Ist mindestens ein Fenster (letzter gültiger Zustand) offen?"""
    return any(last_valid.get(entity) == "on" for entity in entities)


def retry_delay(attempt: int, base: float, max_retries: int, slow: float) -> float:
    """Wartezeit vor der Prüfung von Versuch ``attempt`` (1-basiert).

    Wächst linear (20, 40, 60 …) bis max_retries, danach langsamer Takt.
    """
    if attempt > max_retries:
        return slow
    return base * attempt


def choose_on_preset(
    presets: Iterable[str],
    configured: str | None,
    remembered: str | None,
    *,
    candidates: Iterable[str],
    avoid: Iterable[str],
    auto_value: str = "auto_detect",
) -> str | None:
    """Preset wählen, mit dem das TRV auf einen frei gesetzten Sollwert regelt.

    Reihenfolge: fest eingestellt > bekannte Regel-Presets > zuletzt genutztes
    (sofern nicht auf der Meiden-Liste) > erstes nicht gemiedenes.
    """
    available = [p for p in presets if p and p != "off"]
    if not available:
        return None
    if configured and configured != auto_value and configured in available:
        return configured
    for candidate in candidates:
        if candidate in available:
            return candidate
    avoid_set = set(avoid)
    if remembered and remembered in available and remembered not in avoid_set:
        return remembered
    for preset in available:
        if preset not in avoid_set:
            return preset
    return available[0]


def heating_demand(room: float | None, target: float | None, threshold: float = 0.3) -> bool:
    """Liegt der Raum deutlich unter dem Sollwert? (Für Geräte ohne eigenen Heiz-Zustand.)

    Aqara E1 und Homematic-Wandthermostate melden weder ``hvac_action`` noch ``running_state``
    noch eine Ventilstellung – dort bleibt sonst nur „erreicht" übrig (Issues #18, #11).
    """
    room_f, target_f = to_float(room), to_float(target)
    if room_f is None or target_f is None:
        return False
    return target_f - room_f > threshold


def plausible_reading(
    new: float,
    last: float | None,
    seconds_since_last: float | None,
    *,
    max_jump: float = 3.0,
    window: float = 300.0,
) -> bool:
    """Ausreißer erkennen: großer Sprung in kurzer Zeit ist unplausibel."""
    if last is None or seconds_since_last is None:
        return True
    if seconds_since_last > window:
        return True
    return abs(new - last) <= max_jump
