"""Aufheizzeit und Wärmeverlust lernen: wie schnell wird ein Raum warm oder kalt?

Eine Aufheiz-Episode beginnt, wenn der Raum mindestens 1 °C unter dem Ziel liegt und
geregelt wird, und endet, wenn das Ziel (bis auf 0,2 °C) erreicht ist. Fenster, Pausen
oder ein geändertes Ziel brechen sie ab. Aus den letzten 30 Episoden ergibt sich die
Rate in °C pro Stunde, bei genug Streuung als Gerade über der Außentemperatur.

Zusätzlich werden Abkühl-Episoden außerhalb der Regelung lernen: Sie liefern den
Wärmeverlust des Raums. Ein Sonnensystem vergleicht Aufheizraten mit und ohne Sonne
und schätzt daraus den solaren Zugewinn.
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
MAX_PRE_STOP = 0.5  # K, die das Modell höchstens vor dem Ziel abstoppt


@dataclass
class Episode:
    rate: float  # K/h
    outdoor: float | None
    minutes: float
    rise: float
    sun: bool = False

    def as_dict(self) -> dict[str, Any]:
        return {"rate": round(self.rate, 2), "outdoor": None if self.outdoor is None else round(self.outdoor, 1),
                "minutes": round(self.minutes), "rise": round(self.rise, 1), "sun": bool(self.sun)}


class HeatupTracker:
    def __init__(self) -> None:
        self.episodes: list[dict[str, Any]] = []
        self.cool_episodes: list[dict[str, Any]] = []
        self._active: dict[str, Any] | None = None
        self._cool: dict[str, Any] | None = None

    def load(self, data: list[dict[str, Any]] | None) -> None:
        self.episodes = [
            {**e, "sun": bool(e.get("sun"))}
            for e in (data or [])
            if isinstance(e, dict) and e.get("rate")
        ][-KEEP:]

    def cool_load(self, data: list[dict[str, Any]] | None) -> None:
        self.cool_episodes = [e for e in (data or []) if isinstance(e, dict) and e.get("rate")][-KEEP:]

    def dump(self) -> list[dict[str, Any]]:
        return self.episodes

    def cool_dump(self) -> list[dict[str, Any]]:
        return self.cool_episodes

    @property
    def active(self) -> bool:
        return self._active is not None

    @property
    def cooling(self) -> bool:
        return self._cool is not None

    def _cool_tick(self, now: datetime, temp: float | None, outdoor: float | None, regulating: bool) -> None:
        """Abkühlen außerhalb der Regelung als Episode mitzählen."""
        if regulating or temp is None:
            self._cool = None
            return
        if self._cool is None:
            self._cool = {"t": now, "temp": temp, "out_sum": 0.0, "out_n": 0}
        if outdoor is not None:
            self._cool["out_sum"] += outdoor
            self._cool["out_n"] += 1
        elapsed = now - self._cool["t"]
        if elapsed > MAX_DURATION:
            self._cool = {"t": now, "temp": temp, "out_sum": 0.0, "out_n": 0}
            return
        drop = self._cool["temp"] - temp
        if drop >= MIN_RISE:
            if elapsed >= MIN_DURATION:
                ep = {
                    "rate": round(drop / (elapsed.total_seconds() / 3600), 2),
                    "outdoor": round(self._cool["out_sum"] / self._cool["out_n"], 1) if self._cool["out_n"] else None,
                    "minutes": round(elapsed.total_seconds() / 60),
                    "drop": round(drop, 1),
                }
                self.cool_episodes = (self.cool_episodes + [ep])[-KEEP:]
            self._cool = {"t": now, "temp": temp, "out_sum": 0.0, "out_n": 0}
        elif temp > self._cool["temp"] + MIN_RISE:
            self._cool = {"t": now, "temp": temp, "out_sum": 0.0, "out_n": 0}

    def update(
        self, now: datetime, temp: float | None, target: float, regulating: bool,
        outdoor: float | None, sun: bool = False,
    ) -> Episode | None:
        """Jede Minute aufrufen. Gibt eine abgeschlossene Aufheiz-Episode zurück."""
        act = self._active
        if not regulating or temp is None:
            self._active = None
            self._cool_tick(now, temp, outdoor, regulating)
            return None
        self._cool = None
        if act is None:
            if target - temp >= START_DEFICIT:
                self._active = {"t": now, "temp": temp, "target": target, "out_sum": 0.0, "out_n": 0, "sun": sun}
            return None
        if abs(target - act["target"]) > 0.4:
            self._active = None  # Ziel geändert: neu anfangen
            return self.update(now, temp, target, regulating, outdoor, sun)
        if outdoor is not None:
            act["out_sum"] += outdoor
            act["out_n"] += 1
        act["sun"] = act["sun"] or sun
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
            sun=act["sun"],
        )
        self.episodes = (self.episodes + [ep.as_dict()])[-KEEP:]
        return ep

    def _fit(self, episodes: list[dict[str, Any]], outdoor: float | None) -> float | None:
        """Median oder Gerade über der Außentemperatur – für Heizen und Abkühlen."""
        if len(episodes) < MIN_EPISODES:
            return None
        rates = [float(e["rate"]) for e in episodes]
        med = median(rates)
        pts = [(float(e["outdoor"]), float(e["rate"])) for e in episodes if e.get("outdoor") is not None]
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

    def rate(self, outdoor: float | None) -> float | None:
        """Erwartete Aufheizrate (K/h) bei dieser Außentemperatur."""
        return self._fit(self.episodes, outdoor)

    def cool_rate(self, outdoor: float | None) -> float | None:
        """Erwartete Abkühlrate (K/h) bei dieser Außentemperatur."""
        return self._fit(self.cool_episodes, outdoor)

    def solar_gain(self) -> float | None:
        """Sonnenzugewinn (K/h) aus Aufheizraten mit und ohne Sonne."""
        sun = [float(e["rate"]) for e in self.episodes if e.get("sun")]
        shade = [float(e["rate"]) for e in self.episodes if not e.get("sun")]
        if len(sun) < 2 or len(shade) < 2:
            return None
        return round(max(0.0, median(sun) - median(shade)), 2)

    def pre_stop(self) -> float:
        """Wie viele Kelvin vor dem Ziel die Regelung abstoppt (gegen Überschwingen)."""
        if len(self.episodes) < MIN_EPISODES:
            return 0.0
        gain = self.solar_gain()
        if gain is None or gain < 0.1:
            return 0.0
        return round(min(MAX_PRE_STOP, 0.1 + gain * 0.2), 2)

    def minutes_needed(self, deficit: float, outdoor: float | None) -> int | None:
        """Wie lange, um „deficit“ °C aufzuheizen?"""
        if deficit <= 0:
            return 0
        rate = self.rate(outdoor)
        if not rate:
            return None
        return int(round(deficit / rate * 60))

    def summary(self, outdoor: float | None) -> dict[str, Any]:
        """Kurzfassung für Einstellungen, Lernkarte und Diagnose."""
        return {
            "episodes": len(self.episodes),
            "rate": self.rate(outdoor),
            "minutes_2k": self.minutes_needed(2.0, outdoor),
            "cool_episodes": len(self.cool_episodes),
            "cool_rate": self.cool_rate(outdoor),
            "solar_gain": self.solar_gain(),
            "pre_stop": self.pre_stop(),
            "ready": len(self.episodes) >= MIN_EPISODES,
        }
