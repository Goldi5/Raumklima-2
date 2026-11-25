"""Ortung und Anwesenheit: Entfernung, Sprungfilter, Annäherung, Anwesenheits-Stufe."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
import math

from .plan_const import AWAY_STAGES, STAGE_AWAY_LONG, STAGE_AWAY_SHORT, STAGE_GUESTS, STAGE_HOME, STAGE_PREHEAT
from .plan_mold import round_up_half


# ------------------------------------------------------------------ Ortung
def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Entfernung zweier Koordinaten in km."""
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


@dataclass
class Fix:
    """Eine Ortung."""

    lat: float
    lon: float
    when: datetime
    accuracy: float = 0.0


@dataclass
class TrackerFilter:
    """Sprung- und Genauigkeitsfilter für einen Tracker.

    Verwirft Ortungen, die eine unmögliche Geschwindigkeit bedeuten würden
    (z. B. ein Sprung zwischen zwei Wohnungen in Minuten durch einen VPN-Ausreißer). Bleibt ein
    „Sprung“ länger als `confirm_minutes` bestehen, wird er übernommen (echte Reise).
    """

    max_speed_kmh: float = 300.0
    max_accuracy_m: float = 200.0
    confirm_minutes: float = 30.0
    accepted: Fix | None = None
    pending: Fix | None = None
    pending_since: datetime | None = None

    def feed(self, fix: Fix) -> bool:
        """Neue Ortung prüfen. True, wenn sie übernommen wurde."""
        if fix.accuracy and fix.accuracy > self.max_accuracy_m:
            return False
        if self.accepted is None:
            self.accepted = fix
            return True
        hours = max((fix.when - self.accepted.when).total_seconds() / 3600, 1 / 3600)
        dist = haversine_km(self.accepted.lat, self.accepted.lon, fix.lat, fix.lon)
        if dist <= 1.0 or dist / hours <= self.max_speed_kmh:
            self.accepted = fix
            self.pending = None
            self.pending_since = None
            return True
        # Unmöglicher Sprung: merken, erst nach Bestätigung übernehmen
        if self.pending and haversine_km(self.pending.lat, self.pending.lon, fix.lat, fix.lon) <= 5.0:
            if self.pending_since and fix.when - self.pending_since >= timedelta(minutes=self.confirm_minutes):
                self.accepted = fix
                self.pending = None
                self.pending_since = None
                return True
        else:
            self.pending = fix
            self.pending_since = fix.when
        return False


def approaching(history: list[tuple[datetime, float]], now: datetime, min_drop_km: float = 0.5) -> bool:
    """Nähert sich jemand? Vergleich mit dem jüngsten Messpunkt, der ≥ 5 min alt ist."""
    if len(history) < 2:
        return False
    current = history[-1][1]
    for when, dist in reversed(history[:-1]):
        if now - when >= timedelta(minutes=5):
            return dist - current >= min_drop_km
    return False


ETA_MIN_SPEED = 10.0  # km/h – langsamer zählt nicht als Anfahrt
ETA_MAX_SPEED = 160.0
ETA_MAX_KM = 150.0  # weiter weg wird nicht nach Ankunftszeit vorgeheizt


def eta_minutes(history: list[tuple[datetime, float]], now: datetime) -> float | None:
    """Geschätzte Ankunft in Minuten aus der Annäherung der letzten 5–20 Minuten."""
    if len(history) < 2:
        return None
    current = history[-1][1]
    for when, dist in history[:-1]:
        age = now - when
        if timedelta(minutes=5) <= age <= timedelta(minutes=20):
            hours = age.total_seconds() / 3600
            speed = min((dist - current) / hours, ETA_MAX_SPEED)
            if speed < ETA_MIN_SPEED:
                return None
            return round(current / speed * 60)
    return None


# ------------------------------------------------------------------ Anwesenheit
@dataclass
class PresenceInput:
    configured: bool
    anyone_present: bool
    minutes_since_present: float | None
    away_delay_min: float
    long_away_hours: float
    vacation: bool
    guests: bool
    preheat: bool


def presence_stage(p: PresenceInput) -> str:
    """Stufe der Wohnung bestimmen."""
    if not p.configured or p.anyone_present:
        return STAGE_HOME
    if p.guests:
        return STAGE_GUESTS
    if p.preheat:
        return STAGE_PREHEAT
    if p.vacation:
        return STAGE_AWAY_LONG
    minutes = p.minutes_since_present
    if minutes is None or minutes < p.away_delay_min:
        return STAGE_HOME
    if minutes >= p.long_away_hours * 60:
        return STAGE_AWAY_LONG
    return STAGE_AWAY_SHORT


def setback_target(
    user_target: float,
    stage: str,
    short: float,
    long: float,
    mold_min: float | None,
) -> float:
    """Zieltemperatur bei Abwesenheit (nie über dem Wunsch).

    Der Schimmelschutz greift nur bei längerer Abwesenheit: Einige Stunden mit
    niedrigerer Temperatur verursachen kein Feuchteproblem (vzbv), kritisch wird
    es erst, wenn die Wandoberfläche über Tage feucht bleibt (DIN 4108-2).
    """
    if stage not in AWAY_STAGES:
        return user_target
    target = min(user_target, short if stage == STAGE_AWAY_SHORT else long)
    if stage == STAGE_AWAY_LONG and mold_min is not None:
        target = max(target, min(user_target, round_up_half(mold_min)))
    return target
