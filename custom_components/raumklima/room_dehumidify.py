"""Entfeuchter je Raum: nach Feuchtegrenze schalten, nicht gegen die Heizung arbeiten.

Die Steuerung ist absichtlich schlau, aber nicht überladen:

* an ab einer eigenen Einschaltschwelle (Standard: Raum-Feuchtegrenze)
* aus unter einer eigenen Ausschaltschwelle (Standard: fünf Prozent darunter)
* mindestens zehn Minuten laufen und zehn Minuten pausieren (Kompressorschutz)
* bei offenem Fenster oder fehlendem Feuchtewert ausschalten
* nach drei Stunden ohne Besserung den Schimmelschutz wieder zulassen (Heizung als Rückfall)
* eine manuelle Bedienung am Gerät wird für zwei Stunden respektiert
"""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.util import dt as dt_util

from .const import CONF_DEHUMIDIFIER, CONF_DEHUMIDIFIER_OFF, CONF_DEHUMIDIFIER_ON
from .decision_log import CAT_DEVICE
from .msg import tr

_LOGGER = logging.getLogger(f"{__package__}.dehumidifier")

HYSTERESIS = 5.0
MIN_ON = 10
MIN_OFF = 10
MAX_RUN = 180
MANUAL_OVERRIDE_MIN = 120
UNAVAILABLE_STATES = {"unavailable", "unknown"}


class DehumidifierManager:
    """Schaltet eine optional gewählte Entfeuchter-Entität nach der Raumfeuchte."""

    def __init__(self, controller: Any) -> None:
        self.c = controller
        self.hass = controller.hass
        self._on_since: datetime | None = None
        self._off_since: datetime | None = None
        self._last_cmd_at: datetime | None = None
        self._last_cmd_on: bool | None = None
        self._last_seen: str | None = None
        self._expecting: str | None = None
        self._expect_at: datetime | None = None
        self._manual_until: datetime | None = None
        self._maxed = False

    @property
    def entity_id(self) -> str | None:
        """Gewählte Entität oder None (Funktion ist dann aus)."""
        return self.c.config.get(CONF_DEHUMIDIFIER) or None

    @property
    def room_limit(self) -> float:
        """Feuchtegrenze des Raums – dieselbe Zahl wie beim Lüfthinweis."""
        return float(self.c.vent.humidity_limit)

    @property
    def on_limit(self) -> float:
        """Einschaltschwelle; ohne eigene Wahl gilt die Raum-Feuchtegrenze."""
        value = self.c.config.get(CONF_DEHUMIDIFIER_ON)
        return float(value) if value is not None else self.room_limit

    @property
    def off_limit(self) -> float:
        """Ausschaltschwelle; ohne eigene Wahl fünf Prozent unter dem Einschalten."""
        value = self.c.config.get(CONF_DEHUMIDIFIER_OFF)
        off = float(value) if value is not None else self.on_limit - HYSTERESIS
        # Eine Ausschaltschwelle auf oder über dem Einschalten würde dauerhaft laufen.
        return min(off, self.on_limit - 1.0)

    @property
    def limit(self) -> float:
        """Bisheriger Name für die Einschaltschwelle (Karte, Protokoll)."""
        return self.on_limit

    @property
    def humidity(self) -> float | None:
        return self.c.current_humidity

    @property
    def window_open(self) -> bool:
        return bool(self.c.window_paused)

    @property
    def state(self) -> str | None:
        state = self.hass.states.get(self.entity_id) if self.entity_id else None
        return state.state if state is not None else None

    @property
    def available(self) -> bool:
        if not self.entity_id:
            return False
        state = self.hass.states.get(self.entity_id)
        return state is not None and state.state not in UNAVAILABLE_STATES

    @property
    def active(self) -> bool:
        """Läuft der Entfeuchter gerade?"""
        return self.available and self.state == "on"

    @property
    def maxed(self) -> bool:
        """Zu lange ohne Besserung – Heizung darf wieder schützen."""
        return self._maxed

    @property
    def suppresses_mold(self) -> bool:
        """Darf der Entfeuchter den Schimmelschutz-Heizboost übernehmen?"""
        return self.active and not self._maxed

    def update(self, now: datetime | None = None) -> None:
        """Zustand und Feuchte prüfen und bei Bedarf schalten."""
        now = now or dt_util.utcnow()
        entity = self.entity_id
        if not entity:
            self._reset()
            return
        state = self.hass.states.get(entity)
        if state is None:
            self._last_seen = None
            return
        available = state.state not in UNAVAILABLE_STATES
        if not available:
            if state.state == "on":
                self._command(False, now, "unavailable")
            self._last_seen = None
            return

        # Auf eine bestätigte Änderung warten: keine Fremdbedienung vermuten.
        if self._expecting and self._expect_at and now < self._expect_at:
            if state.state == self._expecting:
                self._last_seen = state.state
                self._expecting = None
                self._expect_at = None
            return
        if self._last_seen is not None and state.state != self._last_seen:
            # Am Gerät oder an der Steckdose selbst bedient – zwei Stunden nicht dagegensteuern.
            self._manual_until = now + timedelta(minutes=MANUAL_OVERRIDE_MIN)
            self._maxed = False
        self._last_seen = state.state
        self._expecting = None
        self._expect_at = None

        is_on = state.state == "on"
        hum = self.humidity
        if hum is None:
            if is_on:
                self._command(False, now, "sensor")
            return

        if self.window_open:
            if is_on:
                self._command(False, now, "window")
            self._on_since = None
            return

        # Laufzeit auch zählen, wenn jemand von Hand eingeschaltet hat – die Karte zeigt „seit …“
        if is_on and self._on_since is None:
            recent = self._last_cmd_on and self._last_cmd_at and now - self._last_cmd_at < timedelta(minutes=5)
            self._on_since = self._last_cmd_at if recent else now
        elif not is_on:
            self._on_since = None

        if self._manual_until and now < self._manual_until:
            return

        if is_on:
            if (now - self._on_since) >= timedelta(minutes=MAX_RUN) and hum > self.off_limit:
                if not self._maxed:
                    self._maxed = True
                    self.c.log(
                        CAT_DEVICE,
                        tr("Entfeuchter läuft seit {m} min ohne Besserung – Heizung schützt weiter", m=MAX_RUN),
                        tr("Feuchte {h} % bleibt über {l} %", h=f"{hum:.0f}", l=f"{self.off_limit:.0f}"),
                        level="warn",
                    )
            else:
                self._maxed = False
        else:
            self._on_since = None
            if hum < self.off_limit:
                self._maxed = False

        if not is_on and hum >= self.on_limit and not self._maxed and self._ready_start(now):
            self._command(True, now, "humidity")
        elif is_on and hum <= self.off_limit and (
            self._on_since is None or now - self._on_since >= timedelta(minutes=MIN_ON)
        ):
            self._command(False, now, "humidity")

    def _ready_start(self, now: datetime) -> bool:
        """Kompressorschutz: nach dem Ausgehen erst einmal pausieren."""
        if self._last_cmd_at and now - self._last_cmd_at < timedelta(seconds=60):
            return False
        return not (self._off_since and now - self._off_since < timedelta(minutes=MIN_OFF))

    def _command(self, on: bool, now: datetime, reason: str) -> None:
        """Befehl senden und die erwartete Bestätigung vormerken."""
        entity = self.entity_id
        if not entity or reason == "unavailable":
            return
        if self._last_cmd_at and now - self._last_cmd_at < timedelta(seconds=60):
            return
        self._last_cmd_at = now
        self._last_cmd_on = on
        self._expecting = "on" if on else "off"
        self._expect_at = now + timedelta(seconds=30)
        if on:
            self._off_since = None
        else:
            self._off_since = now
        title = tr("Entfeuchter an") if on else tr("Entfeuchter aus")
        body = tr(
            "Feuchte {h} % · an {on} % / aus {off} %",
            h=f"{self.humidity or 0:.0f}",
            on=f"{self.on_limit:.0f}",
            off=f"{self.off_limit:.0f}",
        )
        self.c.log(CAT_DEVICE, title, body)
        self.hass.async_create_task(self._call(entity, on))

    async def _call(self, entity: str, on: bool) -> None:
        """Entfeuchter je nach Domäne schalten (switch, fan, humidifier, input_boolean)."""
        domain = entity.split(".", 1)[0]
        service = "turn_on" if on else "turn_off"
        try:
            await self.hass.services.async_call(domain, service, {"entity_id": entity}, blocking=True)
        except Exception as err:  # noqa: BLE001 – ein unbekanntes Gerät darf den Raum nicht blockieren
            self.c.log(
                CAT_DEVICE,
                tr("Entfeuchter nicht erreichbar"),
                f"{entity}: {err}",
                level="warn",
            )

    def _reset(self) -> None:
        self._on_since = None
        self._off_since = None
        self._last_cmd_at = None
        self._last_cmd_on = None
        self._last_seen = None
        self._expecting = None
        self._expect_at = None
        self._manual_until = None
        self._maxed = False

    def summary(self) -> dict[str, Any]:
        """Kompakter Zustand für Karte, Diagnose und Protokoll."""
        return {
            "entity": self.entity_id,
            "state": self.state,
            "available": self.available,
            "active": self.active,
            "since": self._on_since.isoformat() if self._on_since else None,
            "maxed": self._maxed,
            "manual_until": self._manual_until.isoformat() if self._manual_until else None,
            "room_limit": self.room_limit,
            "on_limit": self.on_limit,
            "off_limit": self.off_limit,
            "limit": self.on_limit,
        }