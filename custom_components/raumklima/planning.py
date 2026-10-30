"""Planung ohne Home-Assistant-Abhängigkeit (separat testbar).

- Ortung: Entfernung, Sprungfilter (WireGuard/VPN-Ausreißer), Annäherung
- Anwesenheits-Stufen: da / kurz weg / länger weg / vorheizen / Gäste
- Schimmelschutz: minimale Raumtemperatur nach DIN 4108-2 (fRsi, 80 % an der Wand)
- Heizsaison: Heizgrenze mit Tagesmittel + Vorhersage, Hysterese, Kälteeinbruch
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
import math

# ------------------------------------------------------------------ Konstanten
STAGE_HOME = "home"
STAGE_GUESTS = "guests"
STAGE_PREHEAT = "preheat"
STAGE_AWAY_SHORT = "away_short"
STAGE_AWAY_LONG = "away_long"
STAGES = [STAGE_HOME, STAGE_GUESTS, STAGE_PREHEAT, STAGE_AWAY_SHORT, STAGE_AWAY_LONG]
AWAY_STAGES = (STAGE_AWAY_SHORT, STAGE_AWAY_LONG)

SEASON_HEATING = "heating"
SEASON_PAUSE = "pause"
SEASON_COLD_SNAP = "cold_snap"
SEASON_HEAT_TODAY = "heat_today"
SEASON_ALWAYS = "always"
SEASON_MANUAL_PAUSE = "manual_pause"
SEASON_STATES = [
    SEASON_HEATING,
    SEASON_PAUSE,
    SEASON_COLD_SNAP,
    SEASON_HEAT_TODAY,
    SEASON_ALWAYS,
    SEASON_MANUAL_PAUSE,
]

# Temperaturfaktor fRsi der kältesten Stelle (Außenecke) je Bauart
BUILDING_FRSI = {"unrenovated": 0.60, "renovated": 0.70, "new": 0.80}
SURFACE_RH_LIMIT = 0.80  # DIN 4108-2: Schimmelkriterium an der Oberfläche

# Absenkwerte je Raumtyp (kurz weg, länger weg) – Verbraucherzentrale/vzbv:
# kurze Abwesenheit ~18 °C, länger nicht unter 16 °C
SETBACK_BY_ROOM = {
    "living": (18.0, 16.0),
    "kitchen": (18.0, 16.0),
    "children": (18.0, 16.0),
    "bathroom": (18.0, 16.0),
    "bedroom": (16.0, 16.0),
    "rarely_used": (16.0, 16.0),
}


def setback_defaults(room_type: str | None) -> tuple[float, float]:
    """Absenkwerte (kurz, länger) für einen Raumtyp."""
    return SETBACK_BY_ROOM.get(room_type or "living", (18.0, 16.0))


# ------------------------------------------------------------------ Physik
def saturation_pressure(temp: float) -> float:
    """Sättigungsdampfdruck in hPa (Magnus)."""
    if temp >= 0:
        return 6.112 * math.exp(17.62 * temp / (243.12 + temp))
    return 6.112 * math.exp(22.46 * temp / (272.62 + temp))


def temp_for_pressure(pressure: float) -> float:
    """Umkehrung: Temperatur, bei der der Sättigungsdruck erreicht wird."""
    x = math.log(pressure / 6.112)
    return 243.12 * x / (17.62 - x)


def mold_safe_min_temp(
    room_temp: float | None,
    rel_humidity: float | None,
    outdoor_temp: float | None,
    frsi: float = 0.70,
    limit: float = SURFACE_RH_LIMIT,
) -> float | None:
    """Niedrigste Raumtemperatur, bei der die kälteste Wandstelle unter 80 % bleibt.

    Wandtemperatur θsi = θe + fRsi · (θi − θe). Der Dampfdruck der Raumluft bleibt
    beim Absenken ungefähr gleich (es kommt keine Feuchte hinzu). Gesucht ist θi,
    bei dem die relative Feuchte an der Wand genau `limit` erreicht.
    """
    if room_temp is None or rel_humidity is None or outdoor_temp is None:
        return None
    if rel_humidity <= 0 or not 0 < frsi < 1:
        return None
    vapour = rel_humidity / 100.0 * saturation_pressure(room_temp)
    surface_min = temp_for_pressure(vapour / limit)
    if surface_min <= outdoor_temp:
        return None  # draußen wärmer als die kritische Wandtemperatur
    return round(outdoor_temp + (surface_min - outdoor_temp) / frsi, 1)


def round_up_half(value: float) -> float:
    """Auf 0,5 aufrunden (TRV-Schrittweite)."""
    return math.ceil(value * 2) / 2


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
    (z. B. Berlin → Remscheid in Minuten durch einen VPN-Ausreißer). Bleibt ein
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


# ------------------------------------------------------------------ Heizsaison
def parse_md(value: str, fallback: tuple[int, int]) -> tuple[int, int]:
    """'10-01' oder '01.10.' → (Monat, Tag)."""
    try:
        text = str(value).strip().strip(".")
        if "." in text:
            d, m = text.split(".")[:2]
            return int(m), int(d)
        m, d = text.split("-")[-2:]
        return int(m), int(d)
    except (ValueError, AttributeError):
        return fallback


def in_season(today: date, start: str, end: str) -> bool:
    """Liegt das Datum in der Heizsaison (auch über den Jahreswechsel)?"""
    sm, sd = parse_md(start, (10, 1))
    em, ed = parse_md(end, (4, 30))
    t = (today.month, today.day)
    s, e = (sm, sd), (em, ed)
    if s <= e:
        return s <= t <= e
    return t >= s or t <= e


def combined_mean(past: float | None, forecast: float | None) -> float | None:
    """Mittel aus den letzten 24 h und den nächsten 24 h (was vorhanden ist)."""
    values = [v for v in (past, forecast) if v is not None]
    return round(sum(values) / len(values), 1) if values else None


@dataclass
class SeasonState:
    """Merker der Heizsaison-Logik (wird gespeichert)."""

    heating: bool | None = None
    mild_since: datetime | None = None
    cold_since: datetime | None = None
    cold_snap: bool = False
    extra: dict = field(default_factory=dict)


@dataclass
class SeasonConfig:
    start: str = "10-01"
    end: str = "04-30"
    limit: float = 15.0
    off_hysteresis: float = 1.0
    off_after_hours: float = 48.0
    cold_temp: float = 12.0
    cold_days: float = 3.0


def season_step(
    state: SeasonState,
    now: datetime,
    mean_past: float | None,
    mean_forecast: float | None,
    cfg: SeasonConfig,
) -> SeasonState:
    """Heizbedarf neu bewerten (automatische Betriebsart)."""
    season = in_season(now.date(), cfg.start, cfg.end)
    mean = combined_mean(mean_past, mean_forecast)

    # Kälteeinbruch (auch außerhalb der Saison): 3 Tage Tagesmittel unter 12 °C
    if mean_past is not None and mean_past < cfg.cold_temp:
        state.cold_since = state.cold_since or now
        if now - state.cold_since >= timedelta(days=cfg.cold_days):
            state.cold_snap = True
    else:
        state.cold_since = None
        if state.cold_snap and mean_past is not None and mean_past > cfg.cold_temp + 1:
            state.cold_snap = False

    if not season:
        state.heating = False
        state.mild_since = None
        return state

    if mean is None:
        state.heating = True if state.heating is None else state.heating
        return state
    if state.heating is None:
        state.heating = mean < cfg.limit + cfg.off_hysteresis
        return state
    if state.heating:
        if mean > cfg.limit + cfg.off_hysteresis:
            state.mild_since = state.mild_since or now
            if now - state.mild_since >= timedelta(hours=cfg.off_after_hours):
                state.heating = False
                state.mild_since = None
        else:
            state.mild_since = None
    elif mean < cfg.limit:
        state.heating = True
        state.mild_since = None
    return state


def season_decision(
    mode: str,
    state: SeasonState,
    heat_today: bool,
    season: bool,
) -> str:
    """Ergebnis für die Anzeige und die Räume."""
    if heat_today:
        return SEASON_HEAT_TODAY
    if mode == "always":
        return SEASON_ALWAYS
    if mode == "pause":
        return SEASON_MANUAL_PAUSE
    if state.heating and season:
        return SEASON_HEATING
    if state.cold_snap:
        return SEASON_COLD_SNAP
    return SEASON_PAUSE


def season_allows_heating(decision: str) -> bool:
    return decision in (SEASON_HEATING, SEASON_COLD_SNAP, SEASON_HEAT_TODAY, SEASON_ALWAYS)


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


def in_time_window(local: datetime, start: str, end: str) -> bool:
    """Uhrzeit im Fenster [start, end), auch über Mitternacht."""
    now = local.hour * 60 + local.minute
    s, e = _minutes(start), _minutes(end)
    if s == e:
        return False
    return s <= now < e if s < e else now >= s or now < e


def night_airing_applies(mode: str, room_type: str | None, in_window: bool, someone_home: bool) -> bool:
    """Fenster geht gerade auf: Schlafen bei offenem Fenster statt Stoßlüften?"""
    if mode == NIGHT_OFF or not in_window or not someone_home:
        return False
    return mode == NIGHT_ON or room_type in NIGHT_ROOM_TYPES


def morning_after(night_since_local: datetime, morning: str) -> datetime:
    """Erster Zeitpunkt „morning“ (Ende der Ruhezeit) nach Beginn des Nachtlüftens."""
    m = _minutes(morning)
    candidate = night_since_local.replace(hour=m // 60, minute=m % 60, second=0, microsecond=0)
    if candidate <= night_since_local:
        candidate += timedelta(days=1)
    return candidate


def mute_until(local: datetime, morning: str, evening_hour: int = 18) -> datetime:
    """„Heute nicht mehr“: tagsüber bis Mitternacht, abends/nachts bis zum Morgen."""
    midnight = (local + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    m = _minutes(morning)
    next_morning = local.replace(hour=m // 60, minute=m % 60, second=0, microsecond=0)
    if next_morning <= local:
        next_morning += timedelta(days=1)
    if local.hour >= evening_hour or local.hour * 60 + local.minute < m:
        return next_morning
    return midnight
