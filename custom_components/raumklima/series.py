"""Kurven je Raum: die letzten ~24 Stunden für die Diagnose-Datei.

Die Diagnose war bisher eine Momentaufnahme. Bei Meldungen wie „heizt, obwohl der Raum zu warm
ist“ fehlte damit der Verlauf – man sieht nur den Zustand *jetzt* und kann nicht unterscheiden,
ob das Gerät gegen den Sollwert arbeitet oder ob der Raum einfach noch nachkühlt.

Der Puffer hält je Raum Temperatur, Ziel, Gerätesollwert, Ventilstellung und Heiz-Zustand. Er
wird im 4-Minuten-Raster gefüllt, zusätzlich bei jeder größeren Änderung, und liegt im
Raumzustand – er übersteht damit einen Neustart (und einen Deploy).
"""

from __future__ import annotations

from collections import deque
from datetime import UTC, datetime
from typing import Any

# Kürzeste Zeit zwischen zwei Punkten. Änderungen werden zusätzlich sofort aufgenommen.
STEP_SECONDS = 240
# 400 Punkte ≈ 24 h im Raster; Änderungspunkte verdrängen die ältesten.
MAX_SAMPLES = 400
TEMP_DELTA = 0.3
SETPOINT_DELTA = 0.1
VALVE_DELTA = 10.0

# Kurzschlüssel für den Heiz-Zustand – die Datei bleibt lesbar, ohne Wörter zu wiederholen.
ACTION_LEGEND = {
    "h": "heating",
    "i": "idle",
    "o": "off",
    "w": "window_open",
    "m": "monitor",
    "?": "unbekannt",
}


def _temp(value: Any) -> float | None:
    try:
        return round(float(value), 1)
    except (TypeError, ValueError):
        return None


def _valve(value: Any) -> int | None:
    try:
        return int(round(float(value)))
    except (TypeError, ValueError):
        return None


def _delta(a: float | None, b: float | None) -> float:
    if a is None or b is None:
        return 0.0 if a is b else 999.0
    return abs(a - b)


class RoomSeries:
    """Ringpuffer mit Messpunkten eines Raums (RAM, im Raumzustand gespeichert)."""

    def __init__(self) -> None:
        # (epoch, ist, ziel, geraetesollwert, ventil, zustand)
        self._samples: deque[tuple[int, float | None, float | None, float | None, int | None, str]] = deque(
            maxlen=MAX_SAMPLES
        )

    def clear(self) -> None:
        self._samples.clear()

    def __len__(self) -> int:
        return len(self._samples)

    def maybe_add(
        self,
        now: datetime,
        *,
        current: float | None,
        target: float | None,
        setpoint: float | None,
        valve: float | None,
        action: str,
    ) -> bool:
        """Einen Punkt aufnehmen, wenn das Raster erreicht ist oder sich etwas geändert hat."""
        stamp = int(now.timestamp())
        sample = (stamp, _temp(current), _temp(target), _temp(setpoint), _valve(valve), action or "?")
        if self._samples:
            last = self._samples[-1]
            fresh = stamp - last[0]
            changed = (
                _delta(sample[1], last[1]) >= TEMP_DELTA
                or _delta(sample[2], last[2]) >= SETPOINT_DELTA
                or _delta(sample[3], last[3]) >= SETPOINT_DELTA
                or _delta(sample[4], last[4]) >= VALVE_DELTA
                or sample[5] != last[5]
            )
            if fresh < STEP_SECONDS and not changed:
                return False
        self._samples.append(sample)
        return True

    def export(self) -> dict[str, Any]:
        """Kompakt für die Diagnose-Datei: Zeitoffsets in Sekunden statt voller Zeitstempel."""
        if not self._samples:
            return {"t0": None, "t": [], "i": [], "z": [], "s": [], "v": [], "a": [], "legend": ACTION_LEGEND}
        t0 = self._samples[0][0]
        return {
            "t0": datetime.fromtimestamp(t0, tz=UTC).isoformat(),
            "t": [s[0] - t0 for s in self._samples],
            "i": [s[1] for s in self._samples],
            "z": [s[2] for s in self._samples],
            "s": [s[3] for s in self._samples],
            "v": [s[4] for s in self._samples],
            "a": [s[5] for s in self._samples],
            "legend": ACTION_LEGEND,
        }

    def load(self, stored: Any) -> None:
        """Gespeicherte Kurve übernehmen (nach einem Neustart)."""
        if not isinstance(stored, dict):
            return
        t0_raw = stored.get("t0")
        offsets = stored.get("t")
        if not t0_raw or not isinstance(offsets, list):
            return
        try:
            t0 = int(datetime.fromisoformat(str(t0_raw)).timestamp())
        except (TypeError, ValueError):
            return
        cols = {key: stored.get(key) or [] for key in ("i", "z", "s", "v", "a")}
        self._samples.clear()
        for index, offset in enumerate(offsets):
            try:
                stamp = t0 + int(offset)
            except (TypeError, ValueError):
                continue
            row = []
            for key in ("i", "z", "s", "v", "a"):
                values = cols[key]
                row.append(values[index] if index < len(values) else None)
            self._samples.append((stamp, row[0], row[1], row[2], row[3], str(row[4] or "?")))
