"""Aufheizzeit lernen: wie schnell wird ein Raum warm – abhängig von draußen.

Eine Aufheiz-Episode beginnt, wenn der Raum mindestens 1 °C unter dem Ziel liegt und
geregelt wird, und endet, wenn das Ziel (bis auf 0,2 °C) erreicht ist. Fenster, Pausen
oder ein geändertes Ziel brechen sie ab. Aus den letzten 30 Episoden ergibt sich die
Rate in °C pro Stunde, bei genug Streuung als Gerade über der Außentemperatur.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from statistics import median
from typing import Any

START_DEFICIT = 1.0  # K unter Ziel, damit es eine Aufheiz-Episode ist
DONE_MARGIN = 0.2  # K: gilt als erreicht
MIN_DURATION = timedelta(minutes=10)
MAX_DURATION = timedelta(hours=6)
MIN_RISE = 0.5
KEEP = 30
MIN_EPISODES = 3
MIN_SPREAD = 4.0  # K Außentemperatur-Streuung für eine Gerade


@dataclass
class Episode:
    rate: float  # K/h
    outdoor: float | None
    minutes: float
    rise: float

    def as_dict(self) -> dict[str, Any]:
        return {"rate": round(self.rate, 2), "outdoor": None if self.outdoor is None else round(self.outdoor, 1),
                "minutes": round(self.minutes), "rise": round(self.rise, 1)}


class HeatupTracker:
    def __init__(self) -> None:
        self.episodes: list[dict[str, Any]] = []
        self._active: dict[str, Any] | None = None

    def load(self, data: list[dict[str, Any]] | None) -> None:
        self.episodes = [e for e in (data or []) if isinstance(e, dict) and e.get("rate")][-KEEP:]

    def dump(self) -> list[dict[str, Any]]:
        return self.episodes

    @property
    def active(self) -> bool:
        return self._active is not None

    def update(
        self, now: datetime, temp: float | None, target: float, regulating: bool, outdoor: float | None
    ) -> Episode | None:
        """Jede Minute aufrufen. Gibt eine abgeschlossene Episode zurück."""
        act = self._active
        if not regulating or temp is None:
            self._active = None
            return None
        if act is None:
            if target - temp >= START_DEFICIT:
                self._active = {"t": now, "temp": temp, "target": target, "out_sum": 0.0, "out_n": 0}
            return None
        if abs(target - act["target"]) > 0.4:
            self._active = None  # Ziel geändert: neu anfangen
            return self.update(now, temp, target, regulating, outdoor)
        if outdoor is not None:
            act["out_sum"] += outdoor
            act["out_n"] += 1
        elapsed = now - act["t"]
        if elapsed > MAX_DURATION:
            self._active = None
            return None
        if temp < act["target"] - DONE_MARGIN:
            return None
        self._active = None
        rise = temp - act["temp"]
        if elapsed < MIN_DURATION or rise < MIN_RISE:
            return None
        ep = Episode(
            rate=rise / (elapsed.total_seconds() / 3600),
            outdoor=act["out_sum"] / act["out_n"] if act["out_n"] else None,
            minutes=elapsed.total_seconds() / 60,
            rise=rise,
        )
        self.episodes = (self.episodes + [ep.as_dict()])[-KEEP:]
        return ep

    def rate(self, outdoor: float | None) -> float | None:
        """Erwartete Aufheizrate (K/h) bei dieser Außentemperatur."""
        if len(self.episodes) < MIN_EPISODES:
            return None
        rates = [e["rate"] for e in self.episodes]
        med = median(rates)
        pts = [(e["outdoor"], e["rate"]) for e in self.episodes if e.get("outdoor") is not None]
        if outdoor is None or len(pts) < 5:
            return round(med, 2)
        xs = [p[0] for p in pts]
        if max(xs) - min(xs) < MIN_SPREAD:
            return round(med, 2)
        mx = sum(xs) / len(xs)
        my = sum(p[1] for p in pts) / len(pts)
        sxx = sum((x - mx) ** 2 for x in xs)
        slope = sum((x - mx) * (y - my) for x, y in pts) / sxx
        est = my + slope * (outdoor - mx)
        return round(max(0.3 * med, min(2 * med, est), 0.1), 2)

    def minutes_needed(self, deficit: float, outdoor: float | None) -> int | None:
        """Wie lange, um „deficit“ °C aufzuheizen?"""
        if deficit <= 0:
            return 0
        rate = self.rate(outdoor)
        if not rate:
            return None
        return int(round(deficit / rate * 60))
