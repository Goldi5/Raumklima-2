"""Schimmelschutz im Raum: Feuchte-Boden, Wandfeuchte, Stundenbudget, Feuchtequelle.

Teil von ``RaumklimaController`` (als Mixin, damit controller.py überschaubar bleibt)."""

from __future__ import annotations

from datetime import datetime
import logging

from homeassistant.util import dt as dt_util

from .const import (
    CONF_MOLD_CAP,
    CONF_MOLD_MODE,
    CONF_WALL,
    KIND_MOISTURE,
    MOLD_CAP_MAX,
    WALL_FRSI,
)
from .decision_log import (
    CAT_SETTINGS,
)
from .hub import RaumklimaHub
from .msg import tr
from .planning import (
    round_up_half,
    saturation_pressure,
)
from .room_const import (
    MESSAGE_MOISTURE_DAMP,
    MESSAGE_MOISTURE_DRY,
    MOISTURE_COOLDOWN,
    MOISTURE_RISE,
    MOLD_CAP_DEFAULT,
    MOLD_CAP_NIGHT,
    MOLD_EXEMPT,
    MOLD_MIN_HOURS,
    MOLD_OFF,
    MOLD_STRICT,
    MOLD_WISH,
    REASON_MOLD,
)

_LOGGER = logging.getLogger(f"{__package__}.controller")  # gleicher Logger-Name wie bisher


class MoldMixin:
    """Schimmelschutz im Raum: Feuchte-Boden, Wandfeuchte, Stundenbudget, Feuchtequelle."""

    def _mold_floor(self, on: bool, target: float, reason: str) -> tuple[bool, float, str]:
        """Schimmelschutz als Boden – Stufe je Raum (streng / nur bis Wunsch / aus).

        Drei Bremsen verhindern, dass die Rechnung ins Absurde läuft:

        * offenes Fenster: kein Boden (Heizen gegen ein offenes Fenster ist Verschwendung)
        * Stundenbudget: nur wenn die Wandfläche über längere Zeit über 80 % lag
        * Deckel: höchstens Wunsch + 2,5 K (nachts 1,5 K), weil Heizen kein Feuchteproblem löst
        """
        mode = self.config.get(CONF_MOLD_MODE) or MOLD_STRICT
        window_open = bool(self.paused or self.window_paused)
        if mode == MOLD_OFF or not on or reason in MOLD_EXEMPT or not self.humidity_capable or window_open:
            self._mold_raw = None  # Schutz greift nicht: Hysterese zurücksetzen
            self._mold_capped = False
            return on, target, reason
        hub = self.hub
        if hub is None:
            return on, target, reason
        mold = self.mold_min(hub)
        if mold is None:
            self._mold_raw = None
            self._mold_capped = False
            return on, target, reason

        # Stundenbudget: kurze Spitzen (Kochen, Duschen) heizen wir nicht weg.
        budget = self.mold_guard.surface_rh_hours(dt_util.utcnow())
        if budget < MOLD_MIN_HOURS:
            self._mold_capped = False
            return on, target, reason

        if mode == MOLD_WISH:
            mold = min(mold, self.target_temp)  # nur bis zum Wunsch anheben

        cap = self.mold_cap
        if self.hub is not None and self.hub.quiet_now():
            cap = min(cap, MOLD_CAP_NIGHT)
        limit = round_up_half(self.target_temp + cap)
        capped = mold > limit + 0.05
        mold = min(mold, limit)
        self._mold_capped = capped
        if target >= mold - 0.05:
            return on, target, reason
        return True, min(mold, self.trv_max), REASON_MOLD

    @property
    def mold_cap(self) -> float:
        """Wie weit der Feuchte-Boden den Wunsch höchstens anheben darf (K)."""
        try:
            value = float(self.config.get(CONF_MOLD_CAP, MOLD_CAP_DEFAULT))
        except (TypeError, ValueError):
            value = MOLD_CAP_DEFAULT
        return max(0.0, min(MOLD_CAP_MAX, value))

    @property
    def mold_capped(self) -> bool:
        """Hat der Deckel begrenzt? Dann ist Lüften die Antwort, nicht Heizen."""
        return bool(getattr(self, "_mold_capped", False))

    @property
    def mold_risk_hours(self) -> float:
        """Stunden der letzten 24 h mit kritischer Wandfeuchte."""
        return self.mold_guard.surface_rh_hours(dt_util.utcnow())

    def surface_humidity(self) -> float | None:
        """Relative Feuchte an der kältesten Wandstelle in Prozent."""
        hub = self.hub
        temp = self.current_temperature
        rh = self.current_humidity
        if hub is None or temp is None or rh is None or rh <= 0:
            return None
        outdoor = hub.outdoor_temp()
        if outdoor is None:
            return None
        vapour = rh / 100.0 * saturation_pressure(temp)
        surface_temp = outdoor + self.room_frsi * (temp - outdoor)
        saturation = saturation_pressure(surface_temp)
        if saturation <= 0:
            return None
        return round(100.0 * vapour / saturation, 1)

    @property
    def room_frsi(self) -> float:
        """Temperaturfaktor der kältesten Wandstelle – Raum vor Wohnung.

        Eine Außenecke (0,62) wird deutlich kälter als eine Innenwand (0,82) und braucht
        deshalb mehr Schutz; ein innenliegendes Bad praktisch keinen.
        """
        wall = str(self.config.get(CONF_WALL) or "auto")
        if wall in WALL_FRSI:
            return WALL_FRSI[wall]
        hub = self.hub
        return hub.frsi if hub is not None else 0.70

    def mold_min(self, hub: RaumklimaHub) -> float | None:
        """Feuchte-Mindesttemperatur aus dem 24-h-Mittel (siehe ``MoldGuard``)."""
        return self.mold_guard.floor(
            dt_util.utcnow(), self.current_temperature, self.current_humidity, hub.outdoor_temp(), self.room_frsi
        )

    def _count_rf(self, attempts: int) -> None:
        """Funkbefehl zählen – je Tag, mit Wiederholungen (Batterie-Diagnose)."""
        today = dt_util.now().date().isoformat()
        if self._rf.get("day") != today:
            self._rf = {"day": today, "sent": 0, "retries": 0}
        self._rf["sent"] = int(self._rf.get("sent") or 0) + 1
        if attempts > 1:
            self._rf["retries"] = int(self._rf.get("retries") or 0) + 1
        self._save()

    @property
    def rf_today(self) -> dict[str, int]:
        """Funkbefehle heute: gesamt und davon Wiederholungen."""
        today = dt_util.now().date().isoformat()
        if self._rf.get("day") != today:
            return {"sent": 0, "retries": 0}
        return {"sent": int(self._rf.get("sent") or 0), "retries": int(self._rf.get("retries") or 0)}

    @property
    def mold_rh(self) -> float | None:
        """Mittlere relative Feuchte der letzten 24 h (Grundlage des Feuchte-Bodens)."""
        return self.mold_guard.mean_rh(dt_util.utcnow())

    def check_moisture_source(self, now: datetime) -> None:
        """Steigt die Feuchte im Raum, obwohl geheizt wird? Dann liegt die Ursache im Zimmer."""
        if self.monitor or not self.humidity_capable or self.paused or self.window_logic and self.window_paused:
            return
        sent = getattr(self, "_moisture_sent", None)
        if sent is not None and now - sent < MOISTURE_COOLDOWN:
            return
        delta = self.mold_guard.trend(now)
        change = self.mold_guard.rh_change(now)
        if delta is None or change is None or delta < MOISTURE_RISE:
            return
        hub = self.hub
        if hub is None:
            return
        start, end, hours = change
        vent = self.vent
        dries = vent.dries if vent is not None else True
        title_key, body_key = MESSAGE_MOISTURE_DRY if dries else MESSAGE_MOISTURE_DAMP
        fields = {
            "room": self.name,
            "hours": f"{hours:.0f}",
            "from": f"{start:.0f}",
            "to": f"{end:.0f}",
        }
        title = tr(title_key, **fields)
        body = tr(body_key, **fields)
        self._moisture_sent = now
        self.log(CAT_SETTINGS, title, body)
        hub.notify(
            KIND_MOISTURE,
            title,
            body,
            data={"tag": f"{self.entry.entry_id}_moisture", "group": "raumklima"},
            speak=False,
            room=self,
        )

    def record_mold_sample(self, now: datetime) -> None:
        """Jede Minute aus der Statistik: Feuchte für das 24-h-Mittel merken."""
        # Bei offenem Fenster nicht mitschreiben: die Lüftzeit würde das 24-h-Mittel
        # verwässern und den Boden nach dem Schließen unnötig hoch halten.
        if (
            self.humidity_sensor
            and not self.paused
            and not self.window_paused
            and self.mold_guard.add(
                now, self.current_temperature, self.current_humidity, self.surface_humidity()
            )
        ):
            self._save()
        self.check_moisture_source(now)
