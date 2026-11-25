"""Zeitpläne und Hilfs-Entitäten eines Raums: Fenster, Helfer, nächster Block (Teil von RaumklimaController)."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import (
    callback,
)
from homeassistant.helpers.event import (
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util

from .const import (
    CONF_ROOM_PERSONS,
    CONF_SCHEDULE_BY_PLAN,
    CONF_SCHEDULE_ENTITY,
    CONF_SCHEDULE_FROM,
    CONF_SCHEDULES,
    PLAN_ALWAYS,
    PLAN_NEVER,
    PLAN_OWN,
)
from .logic import (
    to_float,
)
from .planning import (
    next_schedule_window,
    shift_school_schedules,
)


class ScheduleMixin:
    """Zeitpläne und Hilfs-Entitäten eines Raums: Fenster, Helfer, nächster Block (Teil von RaumklimaController)."""

    @property
    def schedules(self) -> list[dict[str, Any]]:
        """Zeitplan dieses Raums – oder der eines anderen Raums (geteilt).

        Geteilt wird nur eine Ebene: der Zielraum nutzt dessen eigenen Zeitplan, damit
        keine Ketten oder Ringe entstehen können.
        """
        source = str(self.config.get(CONF_SCHEDULE_FROM) or "").strip()
        if source and source != self.entry.entry_id and self.hub is not None:
            other = (getattr(self.hub, "rooms", {}) or {}).get(source)
            if other is not None and other is not self:
                return list((other.config or {}).get(CONF_SCHEDULES) or [])
        return list(self.config.get(CONF_SCHEDULES) or [])

    @property
    def plan_schedules(self) -> list[dict[str, Any]]:
        """Zeitplan für die Regelung – an Schulferien morgens nach hinten verschoben."""
        hub = self.hub
        shift = hub.school_holiday_shift if hub is not None else 0
        return shift_school_schedules(self.schedules, shift)

    # ------------------------------------------------------------ Zeitplan-Helfer (Issue #52)
    @property
    def schedule_entity(self) -> str | None:
        """Zeitplan-Quelle statt der eigenen Zeitfenster: ``schedule.*``, ``always`` oder ``never``.

        Mit Plan-Umschalter (Issue #52) gilt, was für den aktuellen Plan eingetragen ist;
        ``own`` heißt: die eigenen Zeitfenster des Raums.
        """
        hub = self.hub
        plan = hub.plan_now() if hub is not None else None
        by_plan = self.config.get(CONF_SCHEDULE_BY_PLAN) or {}
        if plan is not None and plan in by_plan:
            choice = by_plan[plan]
            return None if choice == PLAN_OWN else choice
        return self.config.get(CONF_SCHEDULE_ENTITY) or None

    def helper_window(self) -> tuple[bool, float | None, datetime | None] | None:
        """(läuft gerade?, Temperatur aus dem Helfer-Block, nächster Wechsel) – None ohne Helfer."""
        entity = self.schedule_entity
        if entity == PLAN_ALWAYS:
            return True, None, None
        if entity == PLAN_NEVER:
            return False, None, None
        state = self.hass.states.get(entity) if entity else None
        if state is None or state.state not in ("on", "off"):
            return None
        attrs = state.attributes
        temp = to_float(attrs.get("temperature", attrs.get("target_temperature")))
        nxt = attrs.get("next_event")
        if isinstance(nxt, str):
            nxt = dt_util.parse_datetime(nxt)
        if isinstance(nxt, datetime):
            nxt = dt_util.as_local(nxt)
        else:
            nxt = None
        return state.state == "on", temp, nxt

    @callback
    def track_aux(self) -> None:
        """Zeitplan-Helfer und Personen-Schalter beobachten – bei Änderung neu planen."""
        if getattr(self, "_aux_unsub", None):
            self._aux_unsub()
            self._aux_unsub = None
        watch = [e for e in (self.config.get(CONF_ROOM_PERSONS) or []) if not str(e).startswith("person.")]
        helpers = {self.config.get(CONF_SCHEDULE_ENTITY), *(self.config.get(CONF_SCHEDULE_BY_PLAN) or {}).values()}
        watch += sorted(h for h in helpers if h and str(h).startswith("schedule."))
        # Entfeuchter: Ein- und Ausschalten von außen (App, Taster, Automation) sofort auf der Karte zeigen
        dehum = self.dehumidifier.entity_id
        if dehum:
            watch.append(dehum)
        if not watch:
            return

        @callback
        def _changed(event: Any) -> None:
            if dehum and event.data.get("entity_id") == dehum:
                self.dehumidifier.update()
                self._notify()
                return
            self._notify()
            self.hass.async_create_task(self._apply())

        self._aux_unsub = async_track_state_change_event(self.hass, watch, _changed)

    def next_plan_window(self, local_now: datetime) -> tuple[datetime, tuple[int, int, int] | None] | None:
        """Nächstes Zeitfenster mit der Verschiebung seines eigenen Tages."""
        if self.schedule_entity:
            helper = self.helper_window()
            if helper is None or helper[0] or helper[2] is None or helper[2] <= local_now:
                return None
            return helper[2], self.target_temp
        nxt = next_schedule_window(self.schedules, local_now)
        if nxt is None:
            return None
        hub = self.hub
        shift = hub.school_shift_on(nxt[0].date()) if hub is not None else 0
        return (nxt[0] + timedelta(minutes=shift), nxt[1]) if shift else nxt
