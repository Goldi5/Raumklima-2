"""Anwesenheitsprofil: wann ist meist jemand zu Hause?

Bewusst ohne Personenbezug: Es wird nur gezählt, ob **jemand** anwesend war – nie wer.
Raster: 15 Minuten × 7 Wochentage, rollierend über 4 Wochen.

Nutzen: Vorheizen und „Absenken nach“ lassen sich damit begründen statt raten.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

SLOTS = 96  # 24 h in 15-Minuten-Schritten
KEEP_DAYS = 28
SLOT_MINUTES = 15


class PresenceProfile:
    """Zählt je Wochentag und Viertelstunde, wie oft jemand zu Hause war."""

    def __init__(self) -> None:
        self.hits: list[list[int]] = [[0] * SLOTS for _ in range(7)]
        self.days: dict[str, int] = {}  # ISO-Datum -> Wochentag (0 = Montag)
        self._last: dict[str, int] = {}  # ISO-Datum -> zuletzt gezählter Slot
        self.present: bool | None = None

    # ---------------------------------------------------------------- Speichern
    def load(self, data: dict[str, Any] | None) -> None:
        if not data:
            return
        hits = data.get("hits") or []
        if len(hits) == 7 and all(isinstance(r, list) and len(r) == SLOTS for r in hits):
            self.hits = [[int(v) for v in row] for row in hits]
        days = data.get("days") or {}
        if isinstance(days, dict):
            self.days = {str(k): int(v) for k, v in days.items() if str(v).isdigit()}
        last = data.get("last") or {}
        if isinstance(last, dict):
            self._last = {str(k): int(v) for k, v in last.items() if str(v).isdigit()}

    def dump(self) -> dict[str, Any]:
        return {"hits": self.hits, "days": self.days, "last": self._last}

    # ---------------------------------------------------------------- Erfassen
    def mark(self, now: datetime, present: bool) -> bool:
        """Einen Messpunkt setzen. Gibt True zurück, wenn sich etwas geändert hat."""
        self.present = present
        day = now.date()
        key = day.isoformat()
        if key not in self.days:
            self.days[key] = day.weekday()
            self._prune(day)
        if not present:
            return True
        slot = (now.hour * 60 + now.minute) // SLOT_MINUTES
        if not 0 <= slot < SLOTS:
            return False
        # Je Tag und Viertelstunde nur einmal zählen – sonst zählt die Minutentaktung 15-mal.
        if self._last.get(key) == slot:
            return False
        self._last[key] = slot
        weekday = day.weekday()
        if self.hits[weekday][slot] < 1000:  # Deckel gegen Überlauf
            self.hits[weekday][slot] += 1
        return True

    def _prune(self, today) -> None:
        oldest = (today - timedelta(days=KEEP_DAYS)).isoformat()
        for key in [k for k in self.days if k < oldest]:
            del self.days[key]
            self._last.pop(key, None)

    # ---------------------------------------------------------------- Auswerten
    def _day_count(self, weekday: int) -> int:
        return sum(1 for wd in self.days.values() if wd == weekday)

    def weekday_ratio(self, weekday: int) -> list[float]:
        """Anteil der Tage mit Anwesenheit je Viertelstunde (0 … 1)."""
        n = self._day_count(weekday)
        if not n:
            return [0.0] * SLOTS
        return [round(min(1.0, v / n), 3) for v in self.hits[weekday]]

    def summary(self) -> dict[str, Any]:
        """Für die Anzeige: Werktag (Mo–Fr) und Wochenende (Sa/So) zusammengefasst."""
        def merge(days: list[int]) -> list[float]:
            total = sum(self._day_count(d) for d in days)
            if not total:
                return [0.0] * SLOTS
            return [
                round(min(1.0, sum(self.hits[d][i] for d in days) / total), 3)
                for i in range(SLOTS)
            ]

        weekday = merge([0, 1, 2, 3, 4])
        weekend = merge([5, 6])
        return {
            "weekday": weekday,
            "weekend": weekend,
            "days": {
                "weekday": sum(self._day_count(d) for d in (0, 1, 2, 3, 4)),
                "weekend": sum(self._day_count(d) for d in (5, 6)),
            },
            "complete": len(self.days) >= 7,
        }

    @staticmethod
    def slot_label(index: int) -> str:
        minutes = index * SLOT_MINUTES
        return f"{minutes // 60:02d}:{minutes % 60:02d}"
