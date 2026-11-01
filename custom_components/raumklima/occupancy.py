"""Präsenzmelder: Ist jemand im Raum? (ohne Home Assistant, gut testbar)

Zwei Arten von Meldern werden unterschiedlich gewichtet:

- **mmWave** (Radar, z. B. Aqara FP2/FP1E, Everything Presence): sieht auch Stillsitzende und
  Schlafende. Ein Raum gilt schon kurz nach der letzten Meldung als leer.
- **PIR** (klassischer Bewegungsmelder): sieht nur Bewegung. Wer still am Schreibtisch sitzt,
  wird nach ein paar Minuten „unsichtbar“. Darum gilt ein Raum erst nach langer Ruhe als leer,
  und PIR zählt standardmäßig nicht für „jemand ist zu Hause“ (Haustiere lösen ihn auch aus).

Fällt ein Melder aus, wird er ignoriert; fallen alle aus, ist der Zustand unbekannt – dann wird
nie abgesenkt.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timedelta

KIND_MMWAVE = "mmwave"
KIND_PIR = "pir"

# Nachlaufzeit: so lange nach der letzten Meldung gilt der Raum noch als besetzt
HOLD = {KIND_MMWAVE: timedelta(minutes=3), KIND_PIR: timedelta(minutes=20)}
# „Jemand zu Hause“: Meldung in den letzten … Minuten
HOME_RECENT = {KIND_MMWAVE: timedelta(minutes=5), KIND_PIR: timedelta(minutes=15)}

ROOM_ECO_AFTER = 30.0  # min leer, bevor abgesenkt wird
ROOM_ECO_DROP = 1.5  # °C
# Bei „Automatisch“ nur in diesen Raumtypen – und nur mit mmWave-Melder
ROOM_ECO_AUTO_TYPES = ("living", "kitchen", "rarely_used")


def sensor_kind(device_class: str | None, override: str | None = None) -> str:
    """mmWave oder PIR – aus der Geräteklasse oder fest eingestellt."""
    if override in (KIND_MMWAVE, KIND_PIR):
        return override
    if device_class in ("occupancy", "presence"):
        return KIND_MMWAVE
    return KIND_PIR  # „motion“ und Unbekanntes: vorsichtig wie PIR behandeln


@dataclass(frozen=True)
class Reading:
    """Zustand eines Melders."""

    kind: str
    on: bool | None  # None = nicht erreichbar
    changed: datetime  # letzter Wechsel


def occupancy(readings: Iterable[Reading], now: datetime) -> tuple[bool | None, datetime | None]:
    """(besetzt?, leer seit). None = unbekannt (kein Melder erreichbar)."""
    usable = [r for r in readings if r.on is not None]
    if not usable:
        return None, None
    if any(r.on for r in usable):
        return True, None
    # leer ab: letzte Meldung + Nachlaufzeit (der späteste Melder entscheidet)
    empty_from = max(r.changed + HOLD[r.kind] for r in usable)
    if now < empty_from:
        return True, None
    return False, empty_from


def recently_seen(readings: Iterable[Reading], now: datetime, kinds: tuple[str, ...]) -> bool:
    """Hat ein Melder der gewählten Arten gerade oder vor Kurzem jemanden gesehen?"""
    for r in readings:
        if r.kind not in kinds or r.on is None:
            continue
        if r.on or now - r.changed <= HOME_RECENT[r.kind]:
            return True
    return False


def room_eco_enabled(mode: str | None, room_type: str | None, kinds: Iterable[str]) -> bool:
    """Leeren Raum absenken? „auto“: nur Wohnraum/Küche/selten genutzt und nur mit mmWave."""
    kinds = set(kinds)
    if not kinds:
        return False
    if mode == "on":
        return True
    if mode == "off":
        return False
    return (room_type or "living") in ROOM_ECO_AUTO_TYPES and KIND_MMWAVE in kinds


def room_eco_target(target: float, drop: float, floor: float) -> float:
    """Zieltemperatur für den leeren Raum: Wunsch minus Absenkung, nie unter die Untergrenze."""
    return max(target - drop, min(floor, target))
