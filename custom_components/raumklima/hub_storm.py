"""Sturm- und Starkregenwarnung für die ganze Wohnung.

Die Wettervorhersage (Böen, Regen) wird ohnehin alle 30 Minuten geholt. Wenn in den
nächsten Stunden Sturm oder Starkregen angekündigt ist **und** ein Fenster offen steht,
gibt es einmal pro Ereignis eine Warnung – auch in der Ruhezeit, weil sie dringend ist.
"""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.util import dt as dt_util

from .const import CONF_STORM_GUST, CONF_STORM_RAIN, CONF_STORM_WARNING, KIND_STORM
from .msg import dec, tr
from .planning import first_storm


class StormMixin:
    """Teil der Zentrale: Unwetterwarnung bei offenem Fenster."""

    @property
    def storm_enabled(self) -> bool:
        value = self.opt(CONF_STORM_WARNING)
        return True if value is None else bool(value)

    @property
    def storm_gust(self) -> float:
        return float(self.opt(CONF_STORM_GUST) or 70.0)

    @property
    def storm_rain(self) -> float:
        return float(self.opt(CONF_STORM_RAIN) or 8.0)

    @callback
    def check_storm(self) -> None:
        """Vorhersage prüfen und bei Bedarf einmal warnen."""
        if not self.storm_enabled:
            self._storm_notified = None
            return
        hit = first_storm(
            getattr(self, "forecast_hourly", []) or [],
            dt_util.utcnow(),
            self.storm_gust,
            self.storm_rain,
        )
        if hit is None:
            self._storm_notified = None
            return
        when, kind, value = hit
        key = f"{when.isoformat()[:13]}|{kind}"
        if self._storm_notified == key:
            return
        rooms = [room.name for room in self.rooms.values() if getattr(room, "paused", False)]
        if not rooms:
            return  # kein Fenster offen – keine Warnung nötig
        self._storm_notified = key
        self._save()
        moment = dt_util.as_local(when).strftime("%H:%M")
        if kind == "gust":
            title = tr("🌪 Sturm angekündigt: {rooms}", rooms=", ".join(rooms))
            message = tr(
                "Böen bis {v} km/h ab {t} Uhr – Fenster offen in {rooms}. Bitte schließen.",
                v=f"{value:.0f}",
                t=moment,
                rooms=", ".join(rooms),
            )
        else:
            title = tr("🌧 Starkregen angekündigt: {rooms}", rooms=", ".join(rooms))
            message = tr(
                "{v} mm Regen pro Stunde ab {t} Uhr – Fenster offen in {rooms}. Bitte schließen.",
                v=dec(value),
                t=moment,
                rooms=", ".join(rooms),
            )
        self.notify(KIND_STORM, title, message, speak=False)

    def storm_summary(self) -> dict[str, object]:
        """Kurzfassung für Diagnose und Einstellungsseite."""
        hit = first_storm(
            getattr(self, "forecast_hourly", []) or [],
            dt_util.utcnow(),
            self.storm_gust,
            self.storm_rain,
        )
        return {
            "enabled": self.storm_enabled,
            "gust_kmh": self.storm_gust,
            "rain_mm": self.storm_rain,
            "next": None
            if hit is None
            else {
                "when": dt_util.as_local(hit[0]).isoformat(timespec="minutes"),
                "kind": hit[1],
                "value": round(hit[2], 1),
            },
            "windows_open": [r.name for r in self.rooms.values() if getattr(r, "paused", False)],
        }
