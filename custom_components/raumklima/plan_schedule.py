"""Zeitfenster: Nachtlüften, Zeitpläne, Schulzeiten, Ruhezeiten und Stummschalten."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

# ------------------------------------------------------------------ Nachtlüften
NIGHT_AUTO = "auto"
NIGHT_ON = "on"
NIGHT_OFF = "off"
NIGHT_MODES = [NIGHT_AUTO, NIGHT_ON, NIGHT_OFF]
NIGHT_ROOM_TYPES = frozenset({"bedroom", "rarely_used"})
NIGHT_START = "20:00"
NIGHT_END = "03:00"
NIGHT_ALARM_TEMP = 12.0
NIGHT_MORNING_REPEAT = timedelta(minutes=30)


def _minutes(value: str) -> int:
    h, m = (value or "0:0").split(":")[:2]
    return int(h) * 60 + int(m)


def _hhmm(value: int) -> str:
    value %= 24 * 60
    return f"{value // 60:02d}:{value % 60:02d}"


SCHOOL_MORNING_END = "12:00"


def shift_school_schedules(
    schedules: list[dict[str, Any]] | None,
    minutes: int | float | None,
    morning_end: str = SCHOOL_MORNING_END,
) -> list[dict[str, Any]]:
    """Morgen-Zeitfenster an Schulferien um ``minutes`` nach hinten verschieben.

    Nur Fenster, die vor ``morning_end`` beginnen, werden verschoben. Die gespeicherten
    Zeitpläne bleiben unverändert; die Regelung rechnet mit der Kopie.
    """
    if not schedules:
        return []
    try:
        shift = int(minutes or 0)
        cutoff = _minutes(morning_end)
    except (TypeError, ValueError):
        return list(schedules)
    if shift <= 0:
        return list(schedules)
    out: list[dict[str, Any]] = []
    for item in schedules:
        if not isinstance(item, dict):
            out.append(item)
            continue
        try:
            start = _minutes(str(item.get("start") or ""))
            end = _minutes(str(item.get("end") or ""))
        except (TypeError, ValueError):
            out.append(item)
            continue
        if start >= cutoff:
            out.append(item)
            continue
        out.append({**item, "start": _hhmm(start + shift), "end": _hhmm(end + shift)})
    return out


def in_time_window(local: datetime, start: str, end: str) -> bool:
    """Uhrzeit im Fenster [start, end), auch über Mitternacht."""
    now = local.hour * 60 + local.minute
    s, e = _minutes(start), _minutes(end)
    if s == e:
        # 00:00–00:00 bedeutet ganzer Tag, nicht „leer“.
        return True
    return s <= now < e if s < e else now >= s or now < e


def schedule_target(schedules: list[dict[str, Any]] | None, local: datetime) -> float | None:
    """Zieltemperatur des gerade laufenden Zeitfensters (oder None).

    ``days`` sind Wochentage (0 = Montag); leer oder fehlend heißt „jeden Tag“.
    Überlappen sich Fenster, gewinnt das später in der Liste.
    """
    if not schedules:
        return None
    weekday = local.weekday()
    target: float | None = None
    for item in schedules:
        if not isinstance(item, dict):
            continue
        days = item.get("days") or []
        if days and weekday not in days:
            continue
        try:
            inside = in_time_window(local, str(item.get("start") or ""), str(item.get("end") or ""))
        except (TypeError, ValueError):
            continue  # kaputte Zeitangabe ignorieren statt die Regelung zu stören
        if not inside:
            continue
        temp = item.get("temperature")
        if temp is None:
            continue
        try:
            target = float(temp)
        except (TypeError, ValueError):
            continue
    return target


def schedule_window(schedules: list[dict[str, Any]] | None, local: datetime) -> dict[str, Any] | None:
    """Das gerade laufende Zeitfenster (inkl. Quellen-Auswahl) oder None.

    Wie ``schedule_target``, aber das Fenster selbst – damit die Regelung weiß, welche
    Heizquellen in diesem Fenster aktiv sein sollen. Überlappungen: das spätere gewinnt.
    """
    if not schedules:
        return None
    weekday = local.weekday()
    found: dict[str, Any] | None = None
    for item in schedules:
        if not isinstance(item, dict):
            continue
        days = item.get("days") or []
        if days and weekday not in days:
            continue
        try:
            inside = in_time_window(local, str(item.get("start") or ""), str(item.get("end") or ""))
        except (TypeError, ValueError):
            continue
        if not inside or item.get("temperature") is None:
            continue
        found = item
    return found


def schedule_window_end(schedules: list[dict[str, Any]] | None, local: datetime) -> datetime | None:
    """Ende des gerade laufenden Zeitfensters – None ohne Fenster oder bei „ganztägig“."""
    item = schedule_window(schedules, local)
    if item is None:
        return None
    try:
        s, e = _minutes(str(item.get("start") or "")), _minutes(str(item.get("end") or ""))
    except (TypeError, ValueError):
        return None
    if s == e:
        return None
    end = local.replace(hour=e // 60, minute=e % 60, second=0, microsecond=0)
    if end <= local:
        end += timedelta(days=1)
    return end


def next_schedule_window(
    schedules: list[dict[str, Any]] | None, local: datetime, horizon_minutes: int = 24 * 60
) -> tuple[datetime, float] | None:
    """Beginn und Zieltemperatur des nächsten kommenden Zeitfensters (noch nicht begonnen).

    Damit lässt sich vorheizen: ist der Raum früher warm als das Fenster beginnt, wird
    rechtzeitig angefangen. ``days`` wie bei :func:`schedule_target`.
    """
    if not schedules:
        return None
    best: tuple[datetime, float] | None = None
    for item in schedules:
        if not isinstance(item, dict) or item.get("temperature") is None:
            continue
        try:
            parts = (str(item.get("start") or "").split(":") + ["0", "0"])[:2]
            start_h, start_m = int(parts[0]), int(parts[1])
            temp = float(item["temperature"])
        except (TypeError, ValueError):
            continue
        days = item.get("days") or []
        for offset in range(0, 8):
            day = local.date() + timedelta(days=offset)
            if days and day.weekday() not in days:
                continue
            when = local.replace(
                year=day.year, month=day.month, day=day.day,
                hour=start_h, minute=start_m, second=0, microsecond=0,
            )
            if when <= local:
                continue  # heute schon vorbei → nächster passender Tag
            if (when - local).total_seconds() <= horizon_minutes * 60 and (best is None or when < best[0]):
                best = (when, temp)
            break  # der früheste Termin dieses Fensters genügt
    return best


def night_airing_applies(mode: str, room_type: str | None, in_window: bool, someone_home: bool) -> bool:
    """Fenster geht gerade auf: Schlafen bei offenem Fenster statt Stoßlüften?"""
    if mode == NIGHT_OFF or not in_window or not someone_home:
        return False
    return mode == NIGHT_ON or room_type in NIGHT_ROOM_TYPES


def quiet_end_on(day: date, end: str, end_weekend: str | None = None) -> str:
    """Ende der Ruhezeit an diesem Morgen (Sa/So ggf. später)."""
    return end_weekend if end_weekend and day.weekday() >= 5 else end


def in_quiet(local: datetime, start: str, end: str, end_weekend: str | None = None) -> bool:
    """Ruhezeit jetzt? Am Wochenende endet sie morgens später."""
    return in_time_window(local, start, quiet_end_on(local.date(), end, end_weekend))


def _next_morning(local: datetime, end: str, end_weekend: str | None) -> datetime:
    for add in (0, 1, 2):
        day = (local + timedelta(days=add)).date()
        m = _minutes(quiet_end_on(day, end, end_weekend))
        candidate = local.replace(year=day.year, month=day.month, day=day.day, hour=m // 60, minute=m % 60, second=0, microsecond=0)
        if candidate > local:
            return candidate
    raise ValueError("kein Morgen gefunden")


def morning_after(night_since_local: datetime, morning: str, morning_weekend: str | None = None) -> datetime:
    """Erstes Ende der Ruhezeit nach Beginn des Nachtlüftens."""
    return _next_morning(night_since_local, morning, morning_weekend)


def mute_until(local: datetime, morning: str, morning_weekend: str | None = None, evening_hour: int = 18) -> datetime:
    """„Heute nicht mehr“: tagsüber bis Mitternacht, abends/nachts bis zum Morgen."""
    midnight = (local + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    next_morning = _next_morning(local, morning, morning_weekend)
    if local.hour >= evening_hour or next_morning.date() == local.date():
        return next_morning
    return midnight
