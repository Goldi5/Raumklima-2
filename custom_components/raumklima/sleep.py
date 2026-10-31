"""Schlaf- und Aufstehzeiten lernen (ohne Home-Assistant-Abhängigkeit, separat testbar).

Quellen:
- Nachtlüften: Fenster geht abends im Schlafraum auf → „ins Bett“, geht morgens zu → „aufgestanden“.
- Schlaf-Signale (z. B. Licht im Wohnzimmer): abends alle aus → „ins Bett“, morgens eins an → „aufgestanden“.

Jede Nacht zählt einmal (früheste Bettzeit, frühestes Aufstehen). Werktags- und
Wochenend-Nächte (Fr→Sa, Sa→So) werden getrennt gelernt. Gelernte Zeiten verlängern die
Ruhezeit und das Nachtlüften-Fenster nur – sie verkürzen nie, was eingestellt ist.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
from statistics import median
from typing import Any

BED = "bed"
WAKE = "wake"
KEEP_DAYS = 42  # 6 Wochen
MIN_NIGHTS = 4  # ab so vielen Nächten gilt ein Wert als gelernt
BED_WINDOW = ("19:00", "03:30")  # nur hier zählt „ins Bett“
WAKE_WINDOW = ("04:30", "12:30")  # nur hier zählt „aufgestanden“
SIGNAL_OFF_MINUTES = 20  # so lange müssen abends alle Signale aus sein
QUIET_BEFORE_BED = 30  # Ruhezeit beginnt so viel vor der Bettzeit
QUIET_AFTER_WAKE = 30  # und endet so viel nach dem Aufstehen
NIGHT_MARGIN = 30  # Nachtlüften-Fenster um so viel weiter als gelernt
NIGHT_END_CAP = "06:00"
ROUND = 5  # Minuten


def _minutes(value: str) -> int:
    h, m = (value or "0:0").split(":")[:2]
    return int(h) * 60 + int(m)


def hhmm(minutes: int) -> str:
    minutes %= 1440
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def in_window(local: datetime, window: tuple[str, str]) -> bool:
    now = local.hour * 60 + local.minute
    s, e = _minutes(window[0]), _minutes(window[1])
    return s <= now < e if s < e else now >= s or now < e


def night_of(local: datetime) -> date:
    """Zu welcher Nacht gehört der Zeitpunkt? (Nacht = Datum des Abends)."""
    return (local - timedelta(hours=12)).date()


def is_weekend_night(night: date) -> bool:
    """Fr→Sa und Sa→So: am nächsten Morgen ist kein Werktag."""
    return night.weekday() in (4, 5)


def _from_noon(local: datetime) -> int:
    """Minuten seit 12:00 – damit 23:30 und 00:30 sauber nebeneinander liegen."""
    return (local.hour * 60 + local.minute - 720) % 1440


def _to_clock(from_noon: float) -> int:
    return int(round((from_noon + 720) / ROUND) * ROUND) % 1440


@dataclass
class Learned:
    bed: int | None  # Uhrzeit in Minuten seit Mitternacht
    wake: int | None
    nights_bed: int
    nights_wake: int

    def as_dict(self) -> dict[str, Any]:
        return {
            "bed": hhmm(self.bed) if self.bed is not None else None,
            "wake": hhmm(self.wake) if self.wake is not None else None,
            "nights_bed": self.nights_bed,
            "nights_wake": self.nights_wake,
        }


class SleepLearner:
    """Sammelt Ereignisse und berechnet die typischen Zeiten."""

    def __init__(self) -> None:
        # Nacht (ISO-Datum) → {"bed": iso, "bed_src": str, "wake": iso, "wake_src": str}
        self.nights: dict[str, dict[str, str]] = {}

    # ------------------------------------------------------------ Speicher
    def load(self, data: dict[str, Any] | None) -> None:
        self.nights = dict((data or {}).get("nights", {}))

    def dump(self) -> dict[str, Any]:
        return {"nights": self.nights}

    # ------------------------------------------------------------ Ereignisse
    def record(self, kind: str, local: datetime, source: str) -> bool:
        """Ereignis übernehmen. True, wenn es die Nacht verändert hat."""
        window = BED_WINDOW if kind == BED else WAKE_WINDOW
        if not in_window(local, window):
            return False
        night = night_of(local).isoformat()
        entry = self.nights.setdefault(night, {})
        current = entry.get(kind)
        if current is not None and datetime.fromisoformat(current) <= local:
            return False  # frühestes Ereignis der Nacht zählt
        if kind == WAKE and entry.get(BED) and datetime.fromisoformat(entry[BED]) >= local:
            return False
        entry[kind] = local.isoformat()
        entry[f"{kind}_src"] = source
        return True

    def prune(self, today: date) -> None:
        cutoff = (today - timedelta(days=KEEP_DAYS)).isoformat()
        for key in [k for k in self.nights if k < cutoff]:
            del self.nights[key]

    # ------------------------------------------------------------ Auswertung
    def learned(self, weekend: bool) -> Learned:
        beds: list[int] = []
        wakes: list[int] = []
        for night, entry in self.nights.items():
            if is_weekend_night(date.fromisoformat(night)) != weekend:
                continue
            if entry.get(BED):
                beds.append(_from_noon(datetime.fromisoformat(entry[BED])))
            if entry.get(WAKE):
                wakes.append(_from_noon(datetime.fromisoformat(entry[WAKE])))
        return Learned(
            bed=_to_clock(median(beds)) if len(beds) >= MIN_NIGHTS else None,
            wake=_to_clock(median(wakes)) if len(wakes) >= MIN_NIGHTS else None,
            nights_bed=len(beds),
            nights_wake=len(wakes),
        )


def _earlier(a: int, b: int) -> int:
    """Frühere Abendzeit (über Mitternacht gerechnet)."""
    return a if (a - 720) % 1440 < (b - 720) % 1440 else b


def _later(a: int, b: int) -> int:
    """Spätere Morgenzeit (über Mitternacht gerechnet)."""
    return a if (a - 720) % 1440 > (b - 720) % 1440 else b


def effective_times(
    learned: Learned,
    quiet_start: str,
    quiet_end: str,
    night_start: str,
    night_end: str,
    enabled: bool = True,
) -> dict[str, Any]:
    """Wirksame Zeiten: eingestellt, durch Gelerntes höchstens verlängert."""
    qs, qe, ns, ne = (_minutes(x) for x in (quiet_start, quiet_end, night_start, night_end))
    src = {"quiet_start": "set", "quiet_end": "set", "night_start": "set", "night_end": "set"}
    if enabled and learned.bed is not None:
        cand = learned.bed - QUIET_BEFORE_BED
        if _earlier(cand, qs) != qs:
            qs, src["quiet_start"] = cand % 1440, "learned"
        cand = learned.bed - NIGHT_MARGIN
        if _earlier(cand, ns) != ns:
            ns, src["night_start"] = cand % 1440, "learned"
        cand = min(learned.bed + 120, _minutes(NIGHT_END_CAP)) if learned.bed < 720 else ne
        if learned.bed < 720 and _later(cand, ne) != ne:
            ne, src["night_end"] = cand, "learned"
    if enabled and learned.wake is not None:
        cand = learned.wake + QUIET_AFTER_WAKE
        if _later(cand, qe) != qe:
            qe, src["quiet_end"] = cand % 1440, "learned"
    return {
        "quiet_start": hhmm(qs),
        "quiet_end": hhmm(qe),
        "night_start": hhmm(ns),
        "night_end": hhmm(ne),
        "source": src,
    }


@dataclass
class SignalTracker:
    """Schlaf-Signale (Lichter): erkennt „alle aus“ abends und „eins an“ morgens."""

    all_off_since: datetime | None = None
    asleep: bool = False
    bed_at: datetime | None = None

    def update(self, any_on: bool, local: datetime) -> str | None:
        """Neuer Gesamtzustand. Gibt BED/WAKE zurück, wenn etwas erkannt wurde."""
        if any_on:
            self.all_off_since = None
            if self.asleep and in_window(local, WAKE_WINDOW):
                self.asleep = False
                return WAKE
            return None
        if self.all_off_since is None:
            self.all_off_since = local
        return self.tick(local)

    def tick(self, local: datetime) -> str | None:
        """Regelmäßig aufrufen: wird „alle aus“ lang genug zur Bettzeit?"""
        if self.asleep or self.all_off_since is None:
            if self.asleep and not in_window(local, BED_WINDOW) and not in_window(local, WAKE_WINDOW):
                self.asleep = False  # Mittag: Nacht ist sicher vorbei
            return None
        if local - self.all_off_since < timedelta(minutes=SIGNAL_OFF_MINUTES):
            return None
        if not in_window(self.all_off_since, BED_WINDOW):
            return None
        self.asleep = True
        self.bed_at = self.all_off_since
        return BED
