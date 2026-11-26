"""Reine Rechenlogik ohne Home-Assistant-Abhängigkeit (separat testbar)."""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from datetime import datetime
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


DEFAULT_STEP = 0.5


def round_device(value: float, step: float) -> float:
    """Auf die Schrittweite des **Geräts** runden – halbe Stufen aufwärts.

    `round_step` rundet kaufmännisch-neutral (Pythons `round`), ein BRT-100 rundet 18,5 aber auf
    19,0. Wer 18,0 schreibt, bekommt 19,0 zurück und hält den Wert für nicht bestätigt.
    """
    return round(math.floor(value / step + 0.5) * step, 2)


def device_step(attr: object) -> float:
    """Schrittweite eines Thermostats aus dessen `target_temp_step` (Standard 0,5 K).

    Nicht jedes Gerät kennt halbe Grad: ein Moes BRT-100 meldet `target_temp_step: 1.0` und macht
    aus 21,5 ein 22,0. Wer trotzdem in 0,5-Schritten schreibt, fordert einen Wert, den das Gerät
    nie bestätigen kann — der Auftrag bleibt ewig „pending".
    """
    step = to_float(attr)
    return step if step and step > 0 else DEFAULT_STEP


POSITIVE_SHIFT_FADE = 0.3  # K unter dem Ziel, ab denen ein Aufschlag ausgeblendet wird (#89)


def compensated_shift(
    shift: float, target: float, room: float | None, margin: float = 0.2, fade: float = POSITIVE_SHIFT_FADE
) -> float:
    """Abgleich, aber nie bremsend, solange der Raum zu kalt ist – und nie treibend, wenn er warm ist.

    Ein negativer Abgleich senkt den Sollwert, damit das Gerät früher aufhört — sinnvoll, wenn der
    Raum am Ziel ist oder darüber. Ist er deutlich darunter, verzögert derselbe Abschlag nur das
    Aufheizen: im gemeldeten Fall (Issue #31) stand der Sollwert zwei Stunden lang unter dem
    Wunschwert, weil der Gerätefühler kälter maß als der Raumfühler.

    Spiegelbildlich (#89): Ein positiver Abgleich hebt den Sollwert, weil das Thermostat am heißen
    Heizkörper wärmer misst. Ist der Raum am Ziel, hält genau dieser Aufschlag das Ventil offen – das
    Gerät sitzt dann auf seinem eigenen Sollwert und der Raum heizt über. Deshalb wird der Aufschlag
    auf den letzten ``fade`` Kelvin vor dem Ziel gleitend ausgeblendet und ist am Ziel null.
    """
    if room is None:
        return shift
    if shift < 0 and room < target - margin:
        return 0.0
    if shift > 0:
        if room >= target:
            return 0.0
        if fade > 0 and room > target - fade:
            return shift * (target - room) / fade
    return shift


def setpoint_tolerance(step: float, base: float) -> float:
    """Bestätigungstoleranz: nie enger als die halbe Schrittweite des Geräts.

    `base` ist die hausübliche Toleranz (0,25 K); bei einem Gerät mit 1,0-K-Raster ist eine
    Abweichung von 0,5 K aber unvermeidbar und darf nicht als „nicht bestätigt" gelten.
    """
    return max(base, step / 2)


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
    limit: float = 2.0,
) -> float:
    """Sollwert fürs TRV bei Kalibrierart "target".

    Misst das TRV z. B. 2 °C mehr als der Raum, wird sein Sollwert um 2 °C
    angehoben, damit der Raum das eigentliche Ziel erreicht.

    Der Abgleich wird auf ``limit`` begrenzt: ein Fühler direkt am Heizkörper liest leicht 5 K zu
    warm, und aus Ziel 21 würde sonst ein Sollwert von 26,5 °C – eine Zahl, die niemand erklären
    kann und die am Gerät nichts bewirkt (Issue #38).
    """
    if external is None or trv_reported is None:
        return clamp(round_device(target, step), low, high)
    delta = trv_reported - external
    delta = max(-limit, min(limit, delta))
    return clamp(round_device(target + delta, step), low, high)


def values_match(actual: object, expected: float, tolerance: float) -> bool:
    """Vergleich mit Toleranz (Tuya rundet Werte)."""
    value = to_float(actual)
    return value is not None and abs(value - expected) <= tolerance


COVER_OPEN_STATES = ("open", "opening")


def shadow_opening(
    target: float | None,
    current: float | None,
    *,
    heating: bool = True,
    dead_zone: float = 0.15,
    span: float = 2.0,
    min_pct: float = 8.0,
    max_pct: float = 100.0,
    base: float = 0.0,
    integral: float = 0.0,
) -> float | None:
    """Berechneter Ventil-Öffnungsgrad (%), nur zum Vergleichen – wird nie geschrieben.

    Einfache P-Regelung auf die Regelabweichung: knapp unter dem Ziel bleibt das Ventil zu
    (Totzone gegen Takten), ab der Totzone linear bis zum vollen Öffnen über ``span`` Kelvin.
    Der Mindesthub (``min_pct``) ist der Punkt, ab dem ein Heizkörper spürbar fördert – ohne ihn
    würde die Rechnung „1 %" verlangen, was real nur ein Zucken des Stifts ist.

    Rückgabe ``None``, wenn keine Regelung möglich ist (keine Werte, Überwachungsraum, Heizung aus).
    """
    if not heating or target is None or current is None:
        return None
    dev = float(target) - float(current)
    hold = max(0.0, base) + max(0.0, integral)
    if dev > dead_zone:
        pct = hold + min_pct + (dev - dead_zone) / max(span, 0.1) * (max_pct - min_pct)
    elif dev < -dead_zone:
        # zu warm: Grundlast abbauen, je weiter drüber, desto mehr
        pct = hold - (-dev - dead_zone) / max(span, 0.1) * max_pct
    else:
        pct = hold  # am Ziel: nur so viel, wie der Raum zum Halten braucht (#28)
    if pct < min_pct:
        # unterhalb des Mindesthubs fördert der Heizkörper nicht – ab der Hälfte aufrunden
        pct = min_pct if pct >= min_pct / 2 else 0.0
    return round(max(0.0, min(max_pct, pct)), 1)


class ValveModel:
    """Grundlast und Nachlauf für die berechnete Ventilöffnung (#28).

    Eine reine P-Regelung rechnet am Ziel 0 % – um einen Raum zu *halten*, braucht er aber
    laufend Wärme, proportional zur Differenz innen/außen. Gelernt wird deshalb, wie viel
    der Zeit das Thermostat heizt, während der Raum am Ziel steht, je Kelvin Differenz zur
    Außentemperatur (``k``, %/K). Dazu ein langsamer Nachlauf (``integral``), wenn der Raum
    länger unter dem Ziel bleibt; er baut sich über dem Ziel wieder ab.
    """

    TAU_H = 24.0  # Lernzeit der Grundlast (ein Tag – glättet den Tagesgang)
    NEAR_K = 0.3  # „am Ziel“
    KI = 4.0  # Nachlauf: % je K und Stunde
    I_MAX = 30.0

    def __init__(self, k: float | None = None) -> None:
        self.k: float | None = k
        self.integral = 0.0
        self.samples = 0

    def base(self, target: float | None, outdoor: float | None) -> float:
        if self.k is None or target is None or outdoor is None:
            return 0.0
        return max(0.0, min(100.0, self.k * max(0.0, float(target) - float(outdoor))))

    def update(
        self,
        *,
        dt_s: float,
        heating_plan: bool,
        device_heating: bool,
        target: float | None,
        current: float | None,
        outdoor: float | None,
        learn_base: bool = True,
    ) -> None:
        if not heating_plan or target is None or current is None or dt_s <= 0:
            self.integral = max(0.0, self.integral - self.KI * (dt_s / 3600.0))
            return
        dev = float(target) - float(current)
        hours = dt_s / 3600.0
        self.integral = max(0.0, min(self.I_MAX, self.integral + self.KI * dev * hours))
        if not learn_base or outdoor is None or abs(dev) > self.NEAR_K:
            return
        delta = float(target) - float(outdoor)
        if delta < 2.0:
            return  # kaum Heizbedarf – nichts Verlässliches zu lernen
        sample = (100.0 if device_heating else 0.0) / delta
        # anfangs echter Mittelwert (sonst bestimmt die erste Minute alles), danach gleitend
        self.samples += 1
        alpha = max(1.0 / self.samples, 1.0 - math.exp(-hours / self.TAU_H))
        self.k = sample if self.k is None else self.k + alpha * (sample - self.k)


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


def in_airing_window(windows: list[dict[str, Any]] | None, now: datetime) -> bool:
    """Liegt ``now`` in einem Lüftfenster (Zeit, in der nicht erinnert wird)?"""
    if not windows:
        return False
    minutes = now.hour * 60 + now.minute
    weekday = now.weekday()
    for window in windows:
        if not isinstance(window, dict):
            continue
        days = window.get("days") or []
        if days and weekday not in days:
            continue
        start = _clock_minutes(window.get("start"))
        end = _clock_minutes(window.get("end"))
        if start is None or end is None:
            continue
        if start <= end:
            if start <= minutes < end:
                return True
        elif minutes >= start or minutes < end:  # über Mitternacht
            return True
    return False


def _clock_minutes(value: Any) -> int | None:
    text = str(value or "").strip()
    if ":" not in text:
        return None
    hour, _, minute = text.partition(":")
    if not (hour.isdigit() and minute.isdigit()):
        return None
    return int(hour) * 60 + int(minute)


def reading_fresh(last: datetime | None, now: datetime | None, max_minutes: float) -> bool:
    """Ist eine Meldung jünger als ``max_minutes``? Ohne Zeitstempel gilt sie als frisch."""
    if last is None or now is None:
        return True
    return (now - last).total_seconds() <= max_minutes * 60
