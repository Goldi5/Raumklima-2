"""Planung ohne Home-Assistant-Abhängigkeit (separat testbar).

- Ortung: Entfernung, Sprungfilter (WireGuard/VPN-Ausreißer), Annäherung
- Anwesenheits-Stufen: da / kurz weg / länger weg / vorheizen / Gäste
- Schimmelschutz: minimale Raumtemperatur nach DIN 4108-2 (fRsi, 80 % an der Wand)
- Heizsaison: Heizgrenze mit Tagesmittel + Vorhersage, Hysterese, Kälteeinbruch
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta
import math
from typing import Any

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
    "office": (18.0, 16.0),  # tagsüber genutzt: kurz weg nur 2 K
    "guest": (17.0, 16.0),  # meist unbenutzt, bei Besuch wird hochgestellt
    "hallway": (16.0, 15.0),  # Durchgangsraum, darf kühler
    "gym": (17.0, 15.0),  # beim Sport kühl, sonst selten genutzt
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


MOLD_WINDOW = timedelta(hours=24)  # Schimmel braucht anhaltende Feuchte, keine Koch-/Duschspitze
MOLD_SAMPLE_EVERY = timedelta(minutes=5)
MOLD_MIN_SPAN = timedelta(hours=1)  # darunter (z. B. frisch eingerichtet) zählt der aktuelle Wert mit
MOLD_LOWER_HYSTERESIS = 0.7  # K: Boden sinkt erst, wenn die Rechnung so weit darunter liegt


def floor_from_vapour(vapour: float, outdoor_temp: float, frsi: float, limit: float = SURFACE_RH_LIMIT) -> float | None:
    """Raumtemperatur, bei der die Wand bei diesem Dampfdruck (hPa) gerade `limit` erreicht."""
    if vapour <= 0 or not 0 < frsi < 1:
        return None
    surface_min = temp_for_pressure(vapour / limit)
    if surface_min <= outdoor_temp:
        return None
    return outdoor_temp + (surface_min - outdoor_temp) / frsi


class MoldGuard:
    """Feuchte-Boden aus dem 24-Stunden-Mittel des Wasserdampfs – ruhig und in 0,5er-Schritten.

    DIN 4108-2 rechnet mit Monatsmitteln, Schimmel wächst erst bei anhaltend > 80 % an der Wand.
    Die momentane Feuchte (Kochen, Duschen, ein schlafender Mensch) würde den Boden alle paar Minuten
    um Zehntelgrade verschieben und das Thermostat ständig umstellen.
    """

    def __init__(self) -> None:
        self.samples: list[tuple[datetime, float, float, float]] = []
        self._floor: float | None = None

    def load(self, data: list[Any] | None) -> None:
        out: list[tuple[datetime, float, float]] = []
        for item in data or []:
            try:
                # Altbestand: (Zeit, Dampfdruck) bzw. (Zeit, Dampfdruck, Feuchte)
                rh = float(item[2]) if len(item) > 2 else 0.0
                surface = float(item[3]) if len(item) > 3 else 0.0
                out.append((datetime.fromisoformat(item[0]), float(item[1]), rh, surface))
            except (TypeError, ValueError, IndexError):
                continue
        self.samples = out[-400:]

    def dump(self) -> list[list[Any]]:
        return [
            [t.isoformat(), round(v, 2), round(rh, 1), round(surf, 1)]
            for t, v, rh, surf in self.samples
        ]

    def add(
        self,
        now: datetime,
        temp: float | None,
        rel_humidity: float | None,
        surface_rh: float | None = None,
    ) -> bool:
        """Messwert merken (höchstens alle 5 min). True, wenn gespeichert werden sollte.

        ``surface_rh`` ist die relative Feuchte an der kältesten Wandstelle – daraus wird
        das Stundenbudget gerechnet (Schimmel braucht anhaltend > 80 %, nicht Minuten).
        """
        if temp is None or rel_humidity is None or not 0 < rel_humidity <= 100:
            return False
        if self.samples and now - self.samples[-1][0] < MOLD_SAMPLE_EVERY:
            return False
        self.samples.append(
            (
                now,
                rel_humidity / 100.0 * saturation_pressure(temp),
                float(rel_humidity),
                float(surface_rh) if surface_rh is not None else 0.0,
            )
        )
        cutoff = now - MOLD_WINDOW
        while self.samples and self.samples[0][0] < cutoff:
            self.samples.pop(0)
        return True

    def vapour(self, now: datetime, temp: float | None, rel_humidity: float | None) -> float | None:
        """Mittlerer Dampfdruck der letzten 24 h (hPa)."""
        cutoff = now - MOLD_WINDOW
        values = [v for t, v, _rh, _s in self.samples if t >= cutoff]
        span = (now - min(t for t, _v, _rh, _s in self.samples if t >= cutoff)) if values else timedelta(0)
        if (not values or span < MOLD_MIN_SPAN) and temp is not None and rel_humidity and 0 < rel_humidity <= 100:
            values.append(rel_humidity / 100.0 * saturation_pressure(temp))
        return sum(values) / len(values) if values else None

    def floor(
        self,
        now: datetime,
        temp: float | None,
        rel_humidity: float | None,
        outdoor_temp: float | None,
        frsi: float = 0.70,
    ) -> float | None:
        """Feuchte-Mindesttemperatur (auf 0,5 aufgerundet, steigt sofort, sinkt mit Hysterese)."""
        vapour = self.vapour(now, temp, rel_humidity)
        raw = None if vapour is None or outdoor_temp is None else floor_from_vapour(vapour, outdoor_temp, frsi)
        if raw is None:
            self._floor = None
            return None
        new = round_up_half(raw)
        old = self._floor
        if old is not None and new < old and raw > old - MOLD_LOWER_HYSTERESIS:
            new = old  # nicht bei jeder kleinen Entspannung wieder absenken
        self._floor = new
        return new


    def mean_rh(self, now: datetime, window: timedelta = MOLD_WINDOW) -> float | None:
        """Mittlere relative Feuchte der letzten 24 h (für „+2 °C wegen 63 %")."""
        cutoff = now - window
        values = [rh for t, _v, rh, _s in self.samples if t >= cutoff and rh > 0]
        return round(sum(values) / len(values), 0) if values else None

    def surface_rh_hours(self, now: datetime, limit: float = SURFACE_RH_LIMIT * 100) -> float:
        """Stunden der letzten 24 h, in denen die Wandfläche über der Grenze lag.

        Schimmel entsteht durch anhaltende Feuchte (DIN 4108-2 rechnet mit Monatsmitteln);
        kurze Spitzen – Kochen, Duschen – sind unkritisch. Deshalb wird nicht die Gradzahl,
        sondern die Dauer über der Grenze bewertet. ``limit`` ist in Prozent (die
        Planungsgrenze ``SURFACE_RH_LIMIT`` dagegen ein Bruchteil).
        """
        cutoff = now - MOLD_WINDOW
        window = [(t, surf) for t, _v, _rh, surf in self.samples if t >= cutoff and surf > 0]
        if len(window) < 3:
            return 0.0
        step = (window[-1][0] - window[0][0]).total_seconds()
        if step <= 0:
            return 0.0
        step /= max(1, len(window) - 1)
        hours = sum(step for _t, surf in window if surf > limit) / 3600
        return round(hours, 1)

    def rh_change(self, now: datetime, hours: float = 6.0) -> tuple[float, float, float] | None:
        """Relative Feuchte am Anfang und Ende des Zeitraums – für den Meldungstext."""
        recent_from = now - timedelta(hours=hours)
        before_from = now - timedelta(hours=2 * hours)
        recent = [rh for t, _v, rh, _s in self.samples if t >= recent_from and rh > 0]
        earlier = [rh for t, _v, rh, _s in self.samples if before_from <= t < recent_from and rh > 0]
        if len(recent) < 3 or not earlier:
            return None
        return (round(earlier[0], 0), round(recent[-1], 0), hours)

    def trend(self, now: datetime, hours: float = 6.0) -> float | None:
        """Zuwachs des Wasserdampfs (hPa) in den letzten `hours` gegenüber dem Abschnitt davor.

        Steigende Feuchte bei geschlossenem Fenster und laufender Heizung heißt: die Feuchte
        entsteht im Raum (Wäsche, Duschen, viele Personen) – nicht durch zu wenig Heizen.
        """
        recent_from = now - timedelta(hours=hours)
        before_from = now - timedelta(hours=2 * hours)
        recent = [v for t, v, _rh, _s in self.samples if t >= recent_from]
        earlier = [v for t, v, _rh, _s in self.samples if before_from <= t < recent_from]
        if len(recent) < 3 or len(earlier) < 3:
            return None
        return (sum(recent) / len(recent)) - (sum(earlier) / len(earlier))


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


# ------------------------------------------------------------------ Fenster ohne Kontakt
VIRT_AUTO = "auto"
VIRT_ON = "on"
VIRT_OFF = "off"
VIRT_MODES = [VIRT_AUTO, VIRT_ON, VIRT_OFF]
VIRT_DROP = 1.0  # K Abfall …
VIRT_SPAN = timedelta(minutes=6)  # … innerhalb dieser Zeit
VIRT_OUTDOOR_GAP = 5.0  # K: draußen muss deutlich kälter sein
VIRT_MIN_OPEN = timedelta(minutes=10)
VIRT_MAX_OPEN = timedelta(minutes=30)
VIRT_RECOVER = 0.3  # K über dem Tiefstwert = Fenster wohl wieder zu


def detect_temp_drop(
    points: list[tuple[datetime, float]], now: datetime, outdoor: float | None
) -> float | None:
    """Schneller Temperatursturz (Fenster offen)? Gibt den Abfall in K zurück."""
    recent = [(t, v) for t, v in points if now - t <= VIRT_SPAN]
    if len(recent) < 2:
        return None
    latest = recent[-1][1]
    peak = max(v for _t, v in recent[:-1])
    drop = peak - latest
    if drop < VIRT_DROP:
        return None
    if outdoor is not None and latest - outdoor < VIRT_OUTDOOR_GAP:
        return None  # draußen kaum kälter – eher Messrauschen oder Sonne weg
    return round(drop, 1)


def virtual_window_close_reason(
    opened_at: datetime, now: datetime, lowest: float, current: float | None
) -> str | None:
    """Wann gilt das geschätzte Fenster wieder als zu?"""
    if now - opened_at >= VIRT_MAX_OPEN:
        return "max"
    if current is not None and now - opened_at >= VIRT_MIN_OPEN and current >= lowest + VIRT_RECOVER:
        return "recovered"
    return None


# ------------------------------------------------------------------ Kalender
CAL_AWAY = "away"
CAL_HOME = "home"
CAL_AWAY_WORDS = "Urlaub, Reise, Dienstreise, verreist, vacation, trip"
CAL_HOME_WORDS = "Homeoffice, Home-Office, zu Hause, home office, wfh"


def _words(text: str | None) -> list[str]:
    return [w.strip().lower() for w in str(text or "").split(",") if w.strip()]


def calendar_mode(active: bool, summary: str | None, away_words: str | None, home_words: str | None) -> str | None:
    """Laufender Kalendertermin → „away“ (wie Urlaub), „home“ (wie Gäste: nicht absenken) oder None."""
    if not active or not summary:
        return None
    text = summary.lower()
    if any(w in text for w in _words(away_words)):
        return CAL_AWAY
    if any(w in text for w in _words(home_words)):
        return CAL_HOME
    return None


# ------------------------------------------------------------------ Wettervorhersage
SUNNY_CONDITIONS = frozenset({"sunny", "clear"})
SUNNY_CLOUDS = 30.0  # % Bewölkung – darunter zählt eine Stunde als sonnig
SOLAR_HOURS = 3  # so weit vorausschauen …
SOLAR_MIN_SUNNY = 2  # … davon so viele sonnig
SOLAR_REDUCTION = 1.0  # K weniger, wenn die Sonne mitheizt

# Fassaden: Azimut der Außenwand (0 = Nord, 90 = Ost, 180 = Süd, 270 = West)
FACADES: dict[str, float] = {
    "N": 0.0,
    "NO": 45.0,
    "O": 90.0,
    "SO": 135.0,
    "S": 180.0,
    "SW": 225.0,
    "W": 270.0,
    "NW": 315.0,
}
FACADE_SPREAD = 75.0  # ± so viel Grad strahlt die Sonne noch auf die Fassade
SUN_MIN_ELEVATION = 10.0  # flacher steht sie zu tief (früh/abends, kein Eintrag)


def sun_position(local: datetime, lat: float, lon: float) -> tuple[float, float]:
    """Azimut und Höhe der Sonne in Grad (Azimut 0 = Nord, 90 = Ost, 180 = Süd).

    Vereinfachte NOAA-Rechnung ohne Zeitgleichung (±1°) – für Stundenwerte genau genug.
    """
    moment = local if local.tzinfo else local.replace(tzinfo=UTC)
    utc = moment.astimezone(UTC)
    day = utc.timetuple().tm_yday
    decl = math.radians(-23.44 * math.cos(math.radians(360.0 / 365.0 * (day + 10))))
    hours = utc.hour + utc.minute / 60.0 + utc.second / 3600.0
    hour_angle = math.radians(15.0 * (hours + lon / 15.0 - 12.0))
    lat_r = math.radians(lat)
    sin_el = math.sin(lat_r) * math.sin(decl) + math.cos(lat_r) * math.cos(decl) * math.cos(hour_angle)
    elevation = math.degrees(math.asin(max(-1.0, min(1.0, sin_el))))
    cos_el, cos_lat = math.cos(math.radians(elevation)), math.cos(lat_r)
    if abs(cos_el * cos_lat) < 1e-9:  # Sonne im Zenit: Azimut unbestimmt
        return 180.0, elevation
    cos_az = (math.sin(decl) - sin_el * math.sin(lat_r)) / (cos_el * cos_lat)
    azimuth = math.degrees(math.acos(max(-1.0, min(1.0, cos_az))))
    if hour_angle > 0:  # Nachmittag: weiter über Süd hinaus nach Westen
        azimuth = 360.0 - azimuth
    return azimuth % 360.0, elevation


def location_known(lat: float | None, lon: float | None) -> bool:
    """Echter Standort bekannt? Home Assistant liefert ohne Einrichtung 0/0."""
    return lat is not None and lon is not None and not (lat == 0 and lon == 0)


def facade_angle(facade: str | None) -> float | None:
    """Azimut einer Fassade („W" → 270). Leer oder unbekannt → None."""
    if not facade:
        return None
    return FACADES.get(str(facade).strip().upper())


def sun_on_facade(azimuth: float, elevation: float, facade: float, spread: float = FACADE_SPREAD) -> bool:
    """Steht die Sonne so, dass sie auf diese Fassade scheint?"""
    if elevation < SUN_MIN_ELEVATION:
        return False
    return abs((azimuth - facade + 180.0) % 360.0 - 180.0) <= spread
FROST_NIGHT_TEMP = -5.0  # °C
FROST_NIGHT_AHEAD = timedelta(hours=12)


@dataclass(frozen=True)
class ForecastHour:
    when: datetime
    temperature: float | None
    condition: str | None
    cloud_coverage: float | None = None
    gust: float | None = None  # Windböen km/h
    precipitation: float | None = None  # mm in der Stunde


def first_storm(
    hourly: list[ForecastHour],
    now: datetime,
    gust_kmh: float,
    rain_mm: float,
    horizon_hours: int = 6,
) -> tuple[datetime, str, float] | None:
    """Erste Stunde in den nächsten Stunden mit Sturm oder Starkregen.

    Rückgabe: (Zeitpunkt, "gust" oder "rain", Wert) – oder None.
    """
    limit = now + timedelta(hours=horizon_hours)
    for hour in hourly:
        if hour.when < now or hour.when > limit:
            continue
        if hour.gust is not None and hour.gust >= gust_kmh:
            return (hour.when, "gust", hour.gust)
        if hour.precipitation is not None and hour.precipitation >= rain_mm:
            return (hour.when, "rain", hour.precipitation)
    return None


def _is_sunny(h: ForecastHour) -> bool:
    if h.cloud_coverage is not None:
        return h.cloud_coverage <= SUNNY_CLOUDS and h.condition not in ("rainy", "pouring", "snowy", "fog")
    return h.condition in SUNNY_CONDITIONS


def sun_expected(
    hourly: list[ForecastHour],
    now: datetime,
    facade: str | None = None,
    lat: float | None = None,
    lon: float | None = None,
) -> bool:
    """Scheint in den nächsten Stunden überwiegend die Sonne – und zwar auf diese Fassade?

    Ohne Fassade (oder ohne Standort) zählt wie bisher jede sonnige Stunde. Mit Fassade zählt
    nur, was nach Azimut und Höhenwinkel wirklich hereinscheint – ein Westzimmer reagiert so
    erst nachmittags, ein Ostzimmer nur morgens.
    """
    ahead = [h for h in hourly if now - timedelta(minutes=30) <= h.when <= now + timedelta(hours=SOLAR_HOURS)]
    # „clear“ nachts zählt nicht – die Sonne muss auch scheinen
    sunny = [h for h in ahead if _is_sunny(h) and h.condition != "clear-night"]
    angle = facade_angle(facade)
    if angle is not None and location_known(lat, lon):
        sunny = [h for h in sunny if sun_on_facade(*sun_position(h.when, lat, lon), angle)]
    return len(sunny) >= SOLAR_MIN_SUNNY


def frost_night_min(hourly: list[ForecastHour], now: datetime) -> float | None:
    """Tiefste vorhergesagte Temperatur der nächsten 12 h, wenn sie unter −5 °C liegt."""
    temps = [h.temperature for h in hourly if now <= h.when <= now + FROST_NIGHT_AHEAD and h.temperature is not None]
    low = min(temps, default=None)
    return low if low is not None and low <= FROST_NIGHT_TEMP else None


def frost_night_setback(setback: float, wish: float) -> float:
    """In Frostnächten nur halb so tief absenken – der Raum kühlt sonst stark aus und braucht lange zum Aufheizen."""
    return round_up_half((setback + wish) / 2)
