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
    CONF_PRESENCE_KIND,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_TYPE,
)
from .logic import to_float
from .occupancy import (
    HOLD,
    ROOM_ECO_AFTER,
    ROOM_ECO_DROP,
    Reading,
    occupancy,
    recently_seen,
    room_eco_enabled,
    sensor_kind,
)


class PresenceMixin:
    """Präsenz-Teil des Raum-Controllers."""

    _presence_timer: Callable[[], None] | None = None
    _presence_unsub: Callable[[], None] | None = None
    _occupied: bool | None = None
    _empty_since: datetime | None = None
    _eco_active: bool = False

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
        return room_eco_enabled(self.room_eco_mode, self.config.get(CONF_ROOM_TYPE), self.sensor_kinds().values())

    # ------------------------------------------------------------ Zustand
    def presence_readings(self) -> list[Reading]:
        readings = []
        for entity_id, kind in self.sensor_kinds().items():
            st = self.hass.states.get(entity_id)
            if st is None or st.state not in ("on", "off"):
                readings.append(Reading(kind, None, dt_util.utcnow()))
            else:
                readings.append(Reading(kind, st.state == "on", st.last_changed))
        return readings

    @property
    def occupied(self) -> bool | None:
        """True/False – None ohne Melder oder wenn keiner erreichbar ist."""
        return self._occupied

    def seen_recently(self, kinds: tuple[str, ...]) -> bool:
        return recently_seen(self.presence_readings(), dt_util.utcnow(), kinds)

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
            return
        now = dt_util.utcnow()
        readings = self.presence_readings()
        was = self._occupied
        self._occupied, self._empty_since = occupancy(readings, now)
        # Nächster interessanter Zeitpunkt: Nachlauf vorbei bzw. Absenk-Wartezeit vorbei
        wake: datetime | None = None
        off = [r for r in readings if r.on is False]
        if self._occupied and off and not any(r.on for r in readings):
            wake = max(r.changed + HOLD[r.kind] for r in off)  # Nachlauf endet
        elif self._occupied is False and self._empty_since is not None:
            due = self._empty_since + timedelta(minutes=self.room_eco_after)
            if due > now:
                wake = due
        if wake is not None:
            self._presence_timer = self._schedule(max(1.0, (wake - now).total_seconds() + 1), self.update_presence)
        eco = self.room_eco_applies()
        self._eco_active = eco
        if initial:
            return
        if was != self._occupied or eco:
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
        }
