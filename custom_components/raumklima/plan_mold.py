"""Bauphysik für den Schimmelschutz: Sättigungsdruck, Mindesttemperatur nach DIN 4108-2, MoldGuard."""

from __future__ import annotations

from datetime import datetime, timedelta
from itertools import pairwise
import math
from statistics import median
from typing import Any

from .plan_const import SURFACE_RH_LIMIT


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
        vapour_cap: float | None = None,
    ) -> float | None:
        """Feuchte-Mindesttemperatur (auf 0,5 aufgerundet, steigt sofort, sinkt mit Hysterese).

        ``vapour_cap`` begrenzt den Dampfdruck, solange der Schutz selbst heizt (#85): Zieht der
        Feuchtefühler beim Aufheizen nicht nach (träge, ungünstig platziert), steigt der
        berechnete Dampfdruck mit der Raumtemperatur – und damit der Boden, der weiter heizt.
        """
        vapour = self.vapour(now, temp, rel_humidity)
        if vapour is not None and vapour_cap is not None:
            vapour = min(vapour, vapour_cap)
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
        # Jeder Messwert zählt für die Zeit bis zum nächsten (der letzte bis jetzt) – aber höchstens
        # zwei übliche Messabstände. Bei offenem Fenster wird nicht gemessen; solche Lücken dürfen
        # nicht auf die übrigen Werte verteilt werden (sonst zählt nach einer Nacht mit offenem
        # Fenster jede Stunde 1,5-fach).
        times = [t for t, _surf in window]
        gaps = [(b - a).total_seconds() for a, b in pairwise(times)]
        cap = 2 * max(median(gaps), MOLD_SAMPLE_EVERY.total_seconds())
        seconds = 0.0
        for i, (t, surf) in enumerate(window):
            if surf > limit:
                nxt = times[i + 1] if i + 1 < len(times) else now
                seconds += min(max((nxt - t).total_seconds(), 0.0), cap)
        return round(seconds / 3600, 1)

    def rh_change(self, now: datetime, hours: float = 6.0) -> tuple[float, float, float] | None:
        """Mittlere relative Feuchte vorher und jetzt – dieselben Fenster wie ``trend``.

        Früher stand hier der allererste gegen den letzten Wert: Das passte nicht zur Prüfung
        und ergab Meldungen wie „Feuchte steigt … von 58 auf 57 %“ (Issue #55).
        """
        recent_from = now - timedelta(hours=hours)
        before_from = now - timedelta(hours=2 * hours)
        recent = [rh for t, _v, rh, _s in self.samples if t >= recent_from and rh > 0]
        earlier = [rh for t, _v, rh, _s in self.samples if before_from <= t < recent_from and rh > 0]
        if len(recent) < 3 or not earlier:
            return None
        return (round(sum(earlier) / len(earlier), 0), round(sum(recent) / len(recent), 0), hours)

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
