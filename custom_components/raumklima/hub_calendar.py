"""Kalender und Schulferien der Zentrale: Urlaub/Homeoffice aus Terminen, Schul-Verschiebung (Teil von RaumklimaHub)."""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta
import logging
from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    CONF_CALENDAR,
    CONF_CALENDAR_AWAY,
    CONF_CALENDAR_HOME,
    CONF_SCHOOL_CALENDAR,
    CONF_SCHOOL_SHIFT,
)
from .decision_log import (
    CAT_PRESENCE,
)
from .msg import tr
from .planning import (
    CAL_AWAY,
    CAL_HOME,
    calendar_mode,
)

_LOGGER = logging.getLogger(__name__.rsplit(".", 1)[0] + ".hub_presence")

CALENDAR_REFRESH = timedelta(seconds=60)
CALENDAR_OTHER_REFRESH = timedelta(minutes=10)  # weitere Kalender seltener abfragen


class CalendarMixin:
    """Kalender und Schulferien der Zentrale: Urlaub/Homeoffice aus Terminen, Schul-Verschiebung (Teil von RaumklimaHub)."""

    def calendar_event(self) -> tuple[str | None, str | None]:
        """(Modus, Termin) des laufenden Kalendertermins: „away“ wie Urlaub, „home“ wie Gäste.

        Geprüft wird zuerst der eingestellte Kalender, dann die übrigen Kalender –
        damit ein Termin auch dann zählt, wenn er in einem anderen Kalender liegt
        (z. B. Geburtstage). Ein „freier“/ganztägiger Termin im eingestellten Kalender
        zählt ebenfalls, auch wenn HA ihn als ``off`` meldet.
        """
        configured = self.opt(CONF_CALENDAR)
        candidates: list[tuple[str, Any]] = []
        if configured:
            state = self.hass.states.get(configured)
            if state is not None:
                candidates.append((configured, state))
        for state in self.hass.states.async_all("calendar"):
            if state.entity_id != configured:
                candidates.append((state.entity_id, state))
        now = dt_util.now()
        for entity_id, state in candidates:
            summary = state.attributes.get("message")
            if not summary:
                continue
            # Bei „off“ zeigt HA in ``message`` den *nächsten* Termin – zählt nur, wenn seine
            # Zeit (start_time/end_time) wirklich jetzt ist. Früher senkte ein Urlaub nächste
            # Woche schon heute ab.
            active = state.state == "on" or self._state_event_now(state, now)
            mode = self._calendar_mode_for(entity_id, active, summary)
            if mode:
                self.calendar_source = entity_id
                return mode, summary
        self.calendar_source = None
        return None, None

    def _calendar_mode_for(self, entity_id: str, active: bool, summary: str | None) -> str | None:
        """Modus eines Termins. „Weg/Urlaub“ nur aus dem eingestellten Kalender.

        Andere Kalender (geteilte Familien- oder Arbeitskalender) dürfen „zu Hause/Homeoffice“
        melden, aber nicht die ganze Wohnung auf Urlaub schalten – „Urlaub Müller“ im
        Teamkalender ist nicht der eigene Urlaub.
        """
        mode = calendar_mode(active, summary, self.opt(CONF_CALENDAR_AWAY), self.opt(CONF_CALENDAR_HOME))
        if mode == CAL_AWAY and entity_id != self.opt(CONF_CALENDAR):
            return calendar_mode(active, summary, "", self.opt(CONF_CALENDAR_HOME))
        return mode

    @staticmethod
    def _state_event_now(state: Any, now: datetime) -> bool:
        """Läuft der in ``message`` gemeldete Termin laut start_time/end_time gerade?"""
        start, end = state.attributes.get("start_time"), state.attributes.get("end_time")
        if not start or not end:
            return False
        sdt, edt = dt_util.parse_datetime(str(start)), dt_util.parse_datetime(str(end))
        if sdt is None or edt is None:
            return False
        if sdt.tzinfo is None:
            sdt = sdt.replace(tzinfo=now.tzinfo)
        if edt.tzinfo is None:
            edt = edt.replace(tzinfo=now.tzinfo)
        return sdt <= now < edt

    @property
    def school_shift_minutes(self) -> int:
        """Eingestellte Verschiebung der Morgen-Zeitfenster an Schulferien."""
        try:
            return max(0, min(180, int(self.opt(CONF_SCHOOL_SHIFT) or 0)))
        except (TypeError, ValueError):
            return 0

    @property
    def school_holiday_shift(self) -> int:
        """So viele Minuten starten Morgen-Zeitfenster an Schulferien später."""
        return self.school_shift_on(dt_util.now().date())

    def school_shift_on(self, day: date) -> int:
        """Verschiebung für einen konkreten Tag (auch Vorlauf für morgen)."""
        return self.school_shift_minutes if day in self.school_holiday_dates else 0

    def calendar_debug(self) -> dict[str, Any]:
        """Rohzustand des eingestellten Kalenders für die Diagnose."""
        configured = self.opt(CONF_CALENDAR)
        state = self.hass.states.get(configured) if configured else None
        return {
            "mode": self.calendar_mode,
            "summary": self.calendar_summary,
            "source": self.calendar_source,
            "configured": configured,
            "state": state.state if state is not None else None,
            "message": state.attributes.get("message") if state is not None else None,
            "fetched": self._calendar_fetched.isoformat() if self._calendar_fetched else None,
            "events": list(self._calendar_last_events),
            "upcoming": list(self._calendar_upcoming),
            "school_calendar": self.opt(CONF_SCHOOL_CALENDAR),
            "school_holiday": self.school_holiday,
            "school_shift_minutes": self.school_shift_minutes,
        }

    def _apply_calendar(self, mode: str | None, summary: str | None, source: str | None) -> bool:
        """Kalendermodus setzen und Wechsel protokollieren. True = geändert."""
        changed = (mode, summary, source) != (self.calendar_mode, self.calendar_summary, self.calendar_source)
        if mode != self.calendar_mode:
            if mode == CAL_AWAY:
                self.log.add(CAT_PRESENCE, tr("Kalender: „{s}“ – wie Urlaub", s=summary), tr("Termin läuft; Absenkung „länger weg“, sobald niemand da ist"))
            elif mode == CAL_HOME:
                self.log.add(CAT_PRESENCE, tr("Kalender: „{s}“ – jemand bleibt zu Hause", s=summary), tr("Termin läuft; es wird nicht abgesenkt"))
            else:
                self.log.add(CAT_PRESENCE, tr("Kalender: Termin vorbei"), tr("Anwesenheit wieder nach Ortung"))
        self.calendar_mode = mode
        self.calendar_summary = summary
        self.calendar_source = source
        return changed

    def _apply_school_holiday(self, summary: str | None, dates: set[date] | None = None) -> bool:
        """Schulferien setzen und Wechsel protokollieren. True = geändert."""
        changed = summary != self.school_holiday
        if changed:
            if summary:
                self.log.add(
                    CAT_PRESENCE,
                    tr("Schulferien: „{s}“", s=summary),
                    tr("Zeitplan morgens {n} min später", n=f"{self.school_shift_minutes:.0f}"),
                )
            elif self.school_holiday:
                self.log.add(CAT_PRESENCE, tr("Schulferien vorbei"), tr("Zeitplan wieder wie eingestellt"))
        self.school_holiday = summary
        self.school_holiday_dates = set(dates or ())
        return changed

    def _maybe_refresh_calendar(self) -> None:
        """Get_events höchstens einmal pro Minute im Hintergrund abfragen."""
        if not (self.opt(CONF_CALENDAR) or self.opt(CONF_SCHOOL_CALENDAR)) or self._calendar_fetch_pending:
            return
        if self._calendar_fetched is not None and dt_util.utcnow() - self._calendar_fetched < CALENDAR_REFRESH:
            return
        self._calendar_fetch_pending = True
        self.hass.async_create_task(self.async_check_calendar())

    async def async_check_calendar(self) -> None:
        """Alle laufenden Termine prüfen – auch überlappende und ganztägige.

        Der Zustand einer Kalender-Entität liefert nur **eine** `message`. Bei
        überlappenden Terminen (z. B. Ganztags „Büro“ + „Test HA“) geht der
        Homeoffice-Termin sonst unter. Deshalb werden die Termine über
        ``calendar.get_events`` im Zeitfenster abgefragt und einzeln geprüft.
        """
        try:
            configured = self.opt(CONF_CALENDAR)
            school_calendar = self.opt(CONF_SCHOOL_CALENDAR)
            if not configured and not school_calendar:
                return
            now = dt_util.now()
            start = now - timedelta(hours=1)
            end = now + timedelta(days=7)
            entities: list[str] = []
            if configured and self.hass.states.get(configured) is not None:
                entities.append(configured)
            if configured:
                for st in self.hass.states.async_all("calendar"):
                    if st.entity_id == configured:
                        continue
                    if st.state == "on" or st.attributes.get("message"):
                        entities.append(st.entity_id)
            if (
                school_calendar
                and self.hass.states.get(school_calendar) is not None
                and school_calendar not in entities
            ):
                entities.append(school_calendar)
            found_mode: str | None = None
            found_summary: str | None = None
            found_source: str | None = None
            found_school: str | None = None
            school_dates: set[date] = set()
            active: list[dict[str, Any]] = []
            all_events: list[dict[str, Any]] = []
            errors = 0
            for entity_id in entities:
                primary = entity_id == configured or (configured is None and entity_id == school_calendar)
                events = await self._calendar_events_cached(entity_id, primary, start, end)
                if events is None:
                    errors += 1
                    continue
                for event in events:
                    summary = event.get("summary")
                    item = {
                        "summary": summary,
                        "start": event.get("start"),
                        "end": event.get("end"),
                        "source": entity_id,
                        "all_day": len(str(event.get("start") or "")) <= 10,
                        "mode": self._calendar_mode_for(entity_id, True, summary),
                    }
                    all_events.append(item)
                    if entity_id == school_calendar:
                        school_dates |= self._event_dates(event, now)
                    if not self._event_active(event, now):
                        continue
                    active.append(item)
                    if entity_id == school_calendar and found_school is None and summary:
                        found_school = str(summary)
                    if entity_id == school_calendar and entity_id != configured:
                        continue
                    if found_mode is None and item["mode"]:
                        found_mode, found_summary, found_source = item["mode"], summary, entity_id
            if configured and (not entities or errors == len(entities)):
                # Fallback: Zustands-Message (falls get_events nicht verfügbar ist)
                found_mode, found_summary = self.calendar_event()
                found_source = self.calendar_source
                active = []
                all_events = []
            elif not configured:
                found_mode = found_summary = found_source = None
            if school_calendar and found_school is None and (not entities or errors == len(entities)):
                # Fallback für den Ferienkalender, wenn get_events nicht verfügbar ist.
                state = self.hass.states.get(school_calendar)
                if state is not None and (state.state == "on" or self._state_event_now(state, now)):
                    message = state.attributes.get("message")
                    if message:
                        found_school = str(message)
                        school_dates.add(now.date())
            self._calendar_last_events = active
            self._calendar_upcoming = sorted(
                (e for e in all_events if not any(a is e for a in active) and str(e.get("start") or "") > now.isoformat()),
                key=lambda e: str(e.get("start") or ""),
            )[:10]
            if self._apply_calendar(found_mode, found_summary, found_source):
                self._evaluate_presence()
            self._apply_school_holiday(found_school, school_dates)
        finally:
            self._calendar_fetched = dt_util.utcnow()
            self._calendar_fetch_pending = False

    async def _calendar_events_cached(
        self, entity_id: str, primary: bool, start: datetime, end: datetime
    ) -> list[dict[str, Any]] | None:
        """Eingestellter Kalender jede Minute, alle anderen höchstens alle 10 Minuten.

        Jede Abfrage geht bei Cloud-Kalendern (Google) ins Netz – minütlich für jeden Kalender
        im Haus wären das über 1 400 Abrufe am Tag pro Kalender.
        """
        if primary:
            return await self._calendar_events(entity_id, start, end)
        cache: dict[str, tuple[datetime, list[dict[str, Any]]]] = getattr(self, "_calendar_other_cache", None) or {}
        self._calendar_other_cache = cache
        now = dt_util.utcnow()
        hit = cache.get(entity_id)
        if hit is not None and now - hit[0] < CALENDAR_OTHER_REFRESH:
            return hit[1]
        events = await self._calendar_events(entity_id, start, end)
        if events is not None:
            cache[entity_id] = (now, events)
        return events

    async def _calendar_events(self, entity_id: str, start: datetime, end: datetime) -> list[dict[str, Any]] | None:
        """Termine einer Kalender-Entität im Zeitfenster holen (None = Fehler)."""
        try:
            response = await asyncio.wait_for(
                self.hass.services.async_call(
                    "calendar",
                    "get_events",
                    {
                        "entity_id": entity_id,
                        "start_date_time": start.isoformat(),
                        "end_date_time": end.isoformat(),
                    },
                    blocking=True,
                    return_response=True,
                ),
                timeout=10,
            )
        except Exception as err:  # noqa: BLE001 – Kalender darf die Regelung nicht aufhalten
            _LOGGER.debug("Kalender %s: get_events fehlgeschlagen: %s", entity_id, err)
            return None
        if not isinstance(response, dict):
            return []
        data = response.get(entity_id)
        if isinstance(data, dict):
            events = data.get("events")
        else:
            events = response.get("events")
        return events if isinstance(events, list) else []

    @staticmethod
    def _event_active(event: dict[str, Any], now: datetime) -> bool:
        """Läuft der Termin gerade? (Ganztags-Termine haben nur ein Datum.)"""
        start, end = event.get("start"), event.get("end")
        if not start or not end:
            return False
        s, e = str(start), str(end)
        try:
            if len(s) <= 10 and len(e) <= 10:
                return date.fromisoformat(s[:10]) <= now.date() < date.fromisoformat(e[:10])
            sdt, edt = dt_util.parse_datetime(s), dt_util.parse_datetime(e)
            if sdt is None or edt is None:
                return False
            if sdt.tzinfo is None:
                sdt = sdt.replace(tzinfo=now.tzinfo)
            if edt.tzinfo is None:
                edt = edt.replace(tzinfo=now.tzinfo)
            return sdt <= now < edt
        except (TypeError, ValueError):
            return False

    @staticmethod
    def _event_dates(event: dict[str, Any], now: datetime) -> set[date]:
        """Alle Kalendertage, die ein Termin berührt (für den Vorlauf)."""
        start, end = event.get("start"), event.get("end")
        if not start or not end:
            return set()
        s, e = str(start), str(end)
        try:
            if len(s) <= 10 and len(e) <= 10:
                first = date.fromisoformat(s[:10])
                last = date.fromisoformat(e[:10]) - timedelta(days=1)
            else:
                sdt, edt = dt_util.parse_datetime(s), dt_util.parse_datetime(e)
                if sdt is None or edt is None:
                    return set()
                if sdt.tzinfo is None:
                    sdt = sdt.replace(tzinfo=now.tzinfo)
                if edt.tzinfo is None:
                    edt = edt.replace(tzinfo=now.tzinfo)
                first = sdt.astimezone(now.tzinfo).date()
                last = (edt - timedelta(microseconds=1)).astimezone(now.tzinfo).date()
        except (TypeError, ValueError):
            return set()
        days: set[date] = set()
        day = first
        while day <= last and len(days) < 31:
            days.add(day)
            day += timedelta(days=1)
        return days
