"""Präsenzmelder eines Raums: besetzt/leer, leeren Raum absenken, Meldung an die Zentrale."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import callback
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import (
    CONF_HOME_OFFICE_ENTITY,
    CONF_PRESENCE,
    CONF_PRESENCE_DELAY,
    CONF_PRESENCE_KIND,
    CONF_PRESENCE_LIGHTS,
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
    KIND_LIGHT,
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
    _ext_heat_timer: Callable[[], None] | None = None
    _ext_heat_off_at: datetime | None = None
    _ext_heat_tracked: str | None = None
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
    def room_home_office_entity(self) -> str | None:
        """Eigener Homeoffice-Schalter dieses Raums (ersetzt das allgemeine Homeoffice, #72)."""
        entity_id = self.config.get(CONF_HOME_OFFICE_ENTITY)
        return entity_id if isinstance(entity_id, str) and entity_id else None

    @property
    def room_home_office_on(self) -> bool:
        """Eigener Homeoffice-Schalter des Raums an?"""
        entity_id = self.room_home_office_entity
        if not entity_id:
            return False
        state = self.hass.states.get(entity_id)
        return bool(state and state.state == "on")

    @property
    def presence_sensors(self) -> list[str]:
        return [e for e in (self.config.get(CONF_PRESENCE) or []) if isinstance(e, str)]

    @property
    def presence_lights(self) -> list[str]:
        """Lampen, deren „an“ als Anwesenheit im Raum zählt (z. B. Schreibtischlampe)."""
        return [e for e in (self.config.get(CONF_PRESENCE_LIGHTS) or []) if isinstance(e, str)]

    @property
    def presence_inputs(self) -> list[str]:
        """Alles, was Belegung meldet: Melder und Lampen."""
        return [*self.presence_sensors, *self.presence_lights]

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
        kinds = (KIND_MMWAVE, KIND_PIR) if self.config.get(CONF_PRESENCE_PIR) else (KIND_MMWAVE,)
        return (*kinds, KIND_LIGHT) if self.presence_lights else kinds

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
        for entity_id in self.presence_lights:
            st = self.hass.states.get(entity_id)
            if st is not None and st.state in ("on", "off"):
                readings.append(Reading(KIND_LIGHT, st.state == "on", st.last_changed, st.last_updated))
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
        if not self.presence_inputs:
            self._occupied, self._empty_since = None, None
            self._occupied_since = None
            self._ph_active, self._ph_since = False, None
            return
        now = dt_util.utcnow()
        readings = self.presence_readings()
        was = self._occupied
        before = self._empty_since
        self._occupied, self._empty_since = occupancy(readings, now)
        restored = getattr(self, "_restored_empty", None)
        if restored is not None:
            usable = [r for r in readings if r.on is not None]
            if any(r.on for r in usable):
                self._restored_empty = None  # inzwischen jemand da gewesen: verwerfen
            elif usable and restored <= now and (self._empty_since is None or restored < self._empty_since):
                # Nach dem Neustart melden die Melder „aus“ mit neuer Uhrzeit – sonst gälte der Raum
                # für die Nachlaufzeit als belegt und „leer seit“ finge bei null an. Der Raum war aber
                # schon vorher leer: den gespeicherten, früheren Zeitpunkt nehmen (#87).
                self._occupied, self._empty_since = False, restored
        if self._empty_since != before:
            self._save()
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
        watched = [*self.presence_inputs]
        if self.room_home_office_entity:
            watched.append(self.room_home_office_entity)
        ext = getattr(self, "external_heat_entity", None)
        if ext != getattr(self, "_ext_heat_tracked", None):
            # anderer Ofen-Schalter: ein laufender Nachlauf gehörte zum alten
            self._ext_heat_tracked = ext
            self._ext_heat_off_at = None
            self._cancel_ext_heat_timer()
        if ext:
            watched.append(ext)  # Kamin/Holzofen an/aus (#83): sofort neu planen
        if watched:
            self._presence_unsub = async_track_state_change_event(
                self.hass, watched, self._on_presence_input
            )

    @callback
    def _on_presence_input(self, event: Any) -> None:
        entity_id = event.data.get("entity_id")
        ext = getattr(self, "external_heat_entity", None)
        if ext and entity_id == ext:
            self._on_external_heat(event)
            return
        if entity_id == self.room_home_office_entity:
            # Homeoffice dieses Büros umgeschaltet: sofort neu planen, nicht erst beim nächsten Takt
            self._notify()
            self.hass.async_create_task(self._apply())
            return
        self.update_presence()

    @callback
    def _on_external_heat(self, event: Any) -> None:
        """Kamin/Holzofen (#83): Nachlauf nur nach echtem „an → aus“.

        Ein Neustart oder ein kurzes „unbekannt“ des Sensors ist kein Ausgehen des Ofens – sonst
        blieben die Thermostate nach jedem Neustart grundlos eine halbe Stunde zu.
        """
        old = event.data.get("old_state")
        new = event.data.get("new_state")
        old_on = old is not None and old.state == "on"
        new_state = new.state if new is not None else None
        self._cancel_ext_heat_timer()
        if new_state == "on":
            self._ext_heat_off_at = None
        elif old_on and new_state == "off":
            self._ext_heat_off_at = dt_util.utcnow()
            after = self.external_heat_after_minutes
            if after > 0:
                self._ext_heat_timer = async_call_later(
                    self.hass, timedelta(minutes=after, seconds=5), self._external_heat_done
                )
        elif new_state != "off":
            self._ext_heat_off_at = None  # unbekannt/nicht verfügbar: kein Nachlauf
        self._notify()
        self.hass.async_create_task(self._apply())

    @callback
    def _external_heat_done(self, _now: Any) -> None:
        """Nachlauf vorbei: sofort neu planen, nicht erst beim nächsten Abgleich."""
        self._ext_heat_timer = None
        self._notify()
        self.hass.async_create_task(self._apply())

    def _cancel_ext_heat_timer(self) -> None:
        timer = getattr(self, "_ext_heat_timer", None)
        if timer:
            timer()
        self._ext_heat_timer = None

    def stop_presence(self) -> None:
        if self._presence_unsub:
            self._presence_unsub()
            self._presence_unsub = None
        self._cancel_ext_heat_timer()
        if self._presence_timer:
            self._presence_timer()
            self._presence_timer = None

    def presence_attributes(self) -> dict[str, Any]:
        if not self.presence_inputs:
            return {}
        return {
            "occupied": self._occupied,
            "empty_since": self._empty_since.isoformat() if self._empty_since else None,
            "room_eco": self._eco_active,
            "presence_heat": self.presence_heat_active,
            "presence_since": self._ph_since.isoformat() if self._ph_since and self.presence_target > 0 else None,
        }
