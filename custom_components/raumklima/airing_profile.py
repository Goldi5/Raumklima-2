"""Gewohntes Lüften lernen: wann wird bei dir regelmäßig lange gelüftet?

Hintergrund: Wer morgens um fünf trainiert und dafür eine Stunde das Fenster offen
braucht, bekommt sonst alle paar Minuten „bitte schließen". Das Modul merkt sich
Öffnungsvorgänge (Wochentag, Viertelstunde, Dauer) und erkennt Muster: dreimal im
gleichen Raster innerhalb von vier Wochen gilt als gewohnt.

Die Liste ist hart begrenzt (MAX_EPISODES) und wird nach KEEP_DAYS beschnitten –
sie wächst also nicht mit der Laufzeit.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

MAX_EPISODES = 300
KEEP_DAYS = 28
SLOTS = 96  # Viertelstunden pro Tag
LEARN_COUNT = 3  # so oft muss ein Raster vorkommen


class AiringProfile:
    """Öffnungsvorgänge mit Wochentag, Viertelstunde und Dauer."""

    def __init__(self) -> None:
        # (ISO-Datum, Wochentag 0–6, Slot 0–95, Minuten)
        self.episodes: list[tuple[str, int, int, float]] = []

    # ---------------------------------------------------------------- Speichern
    def load(self, data: Any) -> None:
        if not isinstance(data, list):
            return
        out: list[tuple[str, int, int, float]] = []
        for item in data[-MAX_EPISODES:]:
            if not isinstance(item, (list, tuple)) or len(item) != 4:
                continue
            day, weekday, slot, minutes = item
            try:
                out.append((str(day), int(weekday), int(slot), float(minutes)))
            except (TypeError, ValueError):
                continue
        self.episodes = out
        self._prune(datetime.fromisoformat(out[-1][0]) if out else None)

    def export(self) -> list[list[Any]]:
        return [[day, weekday, slot, minutes] for day, weekday, slot, minutes in self.episodes]

    # ---------------------------------------------------------------- Lernen
    def record(self, when: datetime, minutes: float) -> None:
        """Einen abgeschlossenen Lüftvorgang merken."""
        if minutes < 1:
            return
        slot = min(SLOTS - 1, max(0, (when.hour * 60 + when.minute) // 15))
        self.episodes.append((when.date().isoformat(), when.weekday(), slot, round(minutes, 1)))
        self.episodes = self.episodes[-MAX_EPISODES:]
        self._prune(when)

    def _prune(self, reference: datetime | None) -> None:
        if reference is None:
            return
        oldest = (reference - timedelta(days=KEEP_DAYS)).date().isoformat()
        self.episodes = [e for e in self.episodes if e[0] >= oldest]

    # ---------------------------------------------------------------- Auswertung
    def count(self, when: datetime) -> int:
        """Wie oft wurde in diesem Wochentag/Raster zuletzt gelüftet?"""
        slot = min(SLOTS - 1, max(0, (when.hour * 60 + when.minute) // 15))
        oldest = (when - timedelta(days=KEEP_DAYS)).date().isoformat()
        return sum(
            1
            for day, weekday, episode_slot, _minutes in self.episodes
            if day >= oldest and weekday == when.weekday() and episode_slot == slot
        )

    def learned(self, when: datetime, threshold: int = LEARN_COUNT) -> bool:
        """Ist diese Zeit ein gewohnter Lüftzeitpunkt?"""
        return self.count(when) >= threshold

    def typical(self) -> dict[str, Any]:
        """Für die Anzeige: die drei häufigsten Zeitfenster."""
        buckets: dict[tuple[int, int], list[float]] = {}
        for _day, weekday, slot, minutes in self.episodes:
            buckets.setdefault((weekday, slot), []).append(minutes)
        top = sorted(buckets.items(), key=lambda kv: len(kv[1]), reverse=True)[:3]
        return {
            "episodes": len(self.episodes),
            "learned": [
                {
                    "weekday": weekday,
                    "slot": slot,
                    "time": f"{slot // 4:02d}:{(slot % 4) * 15:02d}",
                    "count": len(minutes),
                    "minutes": round(sum(minutes) / len(minutes), 0),
                }
                for (weekday, slot), minutes in top
                if len(minutes) >= LEARN_COUNT
            ],
        }

    def summary(self) -> dict[str, Any]:
        return {"episodes": len(self.episodes), "days": len({e[0] for e in self.episodes})}
