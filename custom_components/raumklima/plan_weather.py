"""Wettervorhersage: Sonnenstand, Sonne auf der Fassade, Sturm, Frostnacht."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
import math

from .plan_mold import round_up_half

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
