"""Präsenzmelder eines Raums: besetzt/leer, leeren Raum absenken, Meldung an die Zentrale."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import (
    CONF_PRESENCE,
    CONF_PRESENCE_DELAY,
    CONF_PRESENCE_KIND,
    CONF_PRESENCE_PIR,
    CONF_PRESENCE_RELEASE,
    CONF_PRESENCE_TARGET,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_TYPE,
)
from .logic import to_float
from .occupancy import (
    HOLD,
    KIND_MMWAVE,
    KIND_PIR,
    PRESENCE_DELAY,
    PRESENCE_RELEASE,
    ROOM_ECO_AFTER,
    ROOM_ECO_DROP,
    Reading,
    occupancy,
    presence_heat,
    recently_seen,
    room_eco_enabled,
    sensor_kind,
)


class PresenceMixin:
    """Präsenz-Teil des Raum-Controllers."""

    _presence_timer: Callable[[], None] | None = None
    _presence_unsub: Callable[[], None] | None = None
    _occupied: bool | None = None
    _occupied_since: datetime | None = None
    _empty_since: datetime | None = None
    _started_at: datetime | None = None  # Startzeitpunkt dieses Prozesses (für Melder-Zustände)
    _seen_on: set[str] = set()  # Melder-Arten, die seit dem Start schon „an" gemeldet haben
    _eco_active: bool = False
    _ph_active: bool = False  # Anwesenheits-Temperatur gilt gerade
    _ph_since: datetime | None = None  # belegt seit (für die Anwesenheits-Temperatur)

    # ------------------------------------------------------------ Einstellungen
    @property
    def presence_sensors(self) -> list[str]:
        return [e for e in (self.config.get(CONF_PRESENCE) or []) if isinstance(e, str)]

    def sensor_kinds(self) -> dict[str, str]:
        override = self.config.get(CONF_PRESENCE_KIND)
        kinds = {}
        for entity_id in self.presence_sensors:
            st = self.hass.states.get(entity_id)
            kinds[entity_id] = sensor_kind(st.attributes.get("device_class") if st else None, override)
        return kinds

    @property
    def room_eco_mode(self) -> str:
        return str(self.config.get(CONF_ROOM_ECO) or "auto")

    @property
    def room_eco_after(self) -> float:
        value = to_float(self.config.get(CONF_ROOM_ECO_AFTER))
        return value if value is not None else ROOM_ECO_AFTER

    @property
    def room_eco_drop(self) -> float:
        value = to_float(self.config.get(CONF_ROOM_ECO_DROP))
        return value if value is not None else ROOM_ECO_DROP

    def room_eco_enabled(self) -> bool:
        # Mit Anwesenheits-Temperatur ist der Wunsch schon der Wert für den leeren Raum – „Automatisch"
        # senkt dann nicht noch zusätzlich ab (sonst käme nach dem Verlassen nicht der Wert von vorher).
        if self.room_eco_mode == "auto" and self.presence_target > 0:
            return False
        return room_eco_enabled(self.room_eco_mode, self.config.get(CONF_ROOM_TYPE), self.sensor_kinds().values())

    # ------------------------------------------------------------ Anwesenheits-Temperatur
    @property
    def presence_target(self) -> float:
        """Temperatur, solange jemand im Raum ist (0 = aus)."""
        value = to_float(self.config.get(CONF_PRESENCE_TARGET))
        return value if value is not None and value > 0 else 0.0

    @property
    def presence_delay_min(self) -> float:
        """So lange muss jemand im Raum sein, bevor die Anwesenheits-Temperatur gilt."""
        value = to_float(self.config.get(CONF_PRESENCE_DELAY))
        return max(0.0, value) if value is not None else PRESENCE_DELAY

    @property
    def presence_release_min(self) -> float:
        """So lange ohne Belegung, dann gilt wieder der Wert von vorher."""
        value = to_float(self.config.get(CONF_PRESENCE_RELEASE))
        return max(1.0, value) if value is not None else PRESENCE_RELEASE

    @property
    def presence_kinds(self) -> tuple[str, ...]:
        """Welche Melder-Arten für die Anwesenheits-Temperatur zählen (PIR nur auf Wunsch)."""
        return (KIND_MMWAVE, KIND_PIR) if self.config.get(CONF_PRESENCE_PIR) else (KIND_MMWAVE,)

    @property
    def presence_heat_active(self) -> bool:
        """Gilt die Anwesenheits-Temperatur gerade?"""
        return self.presence_target > 0 and self._ph_active

    # ------------------------------------------------------------ Zustand
    def presence_readings(self) -> list[Reading]:
        readings = []
        for entity_id, kind in self.sensor_kinds().items():
            st = self.hass.states.get(entity_id)
            if st is None or st.state not in ("on", "off"):
                # nicht erreichbar: seit wann, damit ein laufender Zustand nur kurz gehalten wird
                readings.append(Reading(kind, None, st.last_changed if st is not None else dt_util.utcnow()))
            else:
                readings.append(Reading(kind, st.state == "on", st.last_changed, st.last_updated))
        return readings

    @property
    def occupied(self) -> bool | None:
        """True/False – None ohne Melder oder wenn keiner erreichbar ist."""
        return self._occupied

    @property
    def occupied_since(self) -> datetime | None:
        """Seit wann der Raum als besetzt gilt (None, wenn nicht besetzt)."""
        return self._occupied_since

    def _boot_time(self) -> datetime:
        if self._started_at is None:
            self._started_at = dt_util.utcnow()
        return self._started_at

    def seen_recently(self, kinds: tuple[str, ...]) -> bool:
        readings = self.presence_readings()
        now, boot = dt_util.utcnow(), self._boot_time()
        for r in readings:
            if r.on and (r.updated is None or r.updated >= boot):
                self._seen_on.add(r.kind)
        return recently_seen(readings, now, kinds, since=boot, seen_on=self._seen_on)

    def room_eco_applies(self) -> bool:
        """Leer lange genug und Absenken eingeschaltet?"""
        if self._occupied is not False or self._empty_since is None or not self.room_eco_enabled():
            return False
        return dt_util.utcnow() - self._empty_since >= timedelta(minutes=self.room_eco_after)

    # ------------------------------------------------------------ Ablauf
    @callback
    def update_presence(self, initial: bool = False) -> None:
        """Melder neu auswerten (bei Zustandswechsel und zu den berechneten Zeitpunkten)."""
        if self._presence_timer:
            self._presence_timer()
            self._presence_timer = None
        if not self.presence_sensors:
            self._occupied, self._empty_since = None, None
            self._occupied_since = None
            self._ph_active, self._ph_since = False, None
            return
        now = dt_util.utcnow()
        readings = self.presence_readings()
        was = self._occupied
        self._occupied, self._empty_since = occupancy(readings, now)
        if self._occupied and was is not True:
            self._occupied_since = now
        elif not self._occupied:
            self._occupied_since = None
        # Nächster interessanter Zeitpunkt: Nachlauf vorbei bzw. Absenk-Wartezeit vorbei
        wake: datetime | None = None
        off = [r for r in readings if r.on is False]
        if self._occupied and off and not any(r.on for r in readings):
            wake = max(r.changed + HOLD[r.kind] for r in off)  # Nachlauf endet
        elif self._occupied is False and self._empty_since is not None:
            due = self._empty_since + timedelta(minutes=self.room_eco_after)
            if due > now:
                wake = due
        ph_was = self._ph_active
        if self.presence_target > 0:
            self._ph_active, self._ph_since, due = presence_heat(
                readings,
                now,
                self._ph_since,
                timedelta(minutes=self.presence_delay_min),
                timedelta(minutes=self.presence_release_min),
                self.presence_kinds,
            )
            if due is not None and due > now and (wake is None or due < wake):
                wake = due
        else:
            self._ph_active, self._ph_since = False, None
        if wake is not None:
            self._presence_timer = self._schedule(max(1.0, (wake - now).total_seconds() + 1), self.update_presence)
        eco = self.room_eco_applies()
        self._eco_active = eco
        if initial:
            return
        if was != self._occupied or eco or ph_was != self._ph_active:
            hub = self.hub
            if hub is not None:
                hub.on_room_presence()
        self._notify()
        self.hass.async_create_task(self._apply())

    @callback
    def track_presence(self) -> None:
        """Melder abonnieren (auch nach Änderung in der Karte)."""
        if self._presence_unsub:
            self._presence_unsub()
            self._presence_unsub = None
        if self.presence_sensors:
            self._presence_unsub = async_track_state_change_event(
                self.hass, self.presence_sensors, callback(lambda _event: self.update_presence())
            )

    def stop_presence(self) -> None:
        if self._presence_unsub:
            self._presence_unsub()
            self._presence_unsub = None
        if self._presence_timer:
            self._presence_timer()
            self._presence_timer = None

    def presence_attributes(self) -> dict[str, Any]:
        if not self.presence_sensors:
            return {}
        return {
            "occupied": self._occupied,
            "empty_since": self._empty_since.isoformat() if self._empty_since else None,
            "room_eco": self._eco_active,
            "presence_heat": self.presence_heat_active,
            "presence_since": self._ph_since.isoformat() if self._ph_since and self.presence_target > 0 else None,
        }
