"""Anwesenheit der Wohnung: Ortung, Abwesenheitsstufen, Vorheizen nach Ankunftszeit."""

from __future__ import annotations

import asyncio
from collections import deque
from datetime import date, datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, EventStateChangedData, callback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_AWAY_DELAY,
    CONF_CALENDAR,
    CONF_CALENDAR_AWAY,
    CONF_CALENDAR_HOME,
    CONF_GUESTS_ROOMS,
    CONF_HOME_SENSORS,
    CONF_LONG_AWAY_HOURS,
    CONF_PREHEAT_KM,
    CONF_PRESENCE_OFF,
    CONF_ROOM_PERSONS,
    CONF_VACATION_HOURS,
    CONF_VACATION_KM,
    CONF_WORK_ZONE_MINUTES,
    CONF_WORK_ZONES,
    KIND_PRESENCE,
)
from .decision_log import (
    CAT_PRESENCE,
)
from .logic import to_float
from .msg import N_, dec, tr
from .occupancy import KIND_MMWAVE, KIND_PIR
from .planning import (
    AWAY_STAGES,
    CAL_AWAY,
    CAL_HOME,
    ETA_MAX_KM,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    STAGE_GUESTS,
    STAGE_HOME,
    STAGE_PREHEAT,
    Fix,
    PresenceInput,
    TrackerFilter,
    approaching,
    calendar_mode,
    eta_minutes,
    haversine_km,
    presence_stage,
)
from .shared import all_hubs

if TYPE_CHECKING:
    pass


_LOGGER = logging.getLogger(__name__)

PREHEAT_HOLD = timedelta(minutes=90)
CALENDAR_REFRESH = timedelta(seconds=60)

STAGE_TEXT = {
    STAGE_HOME: N_("jemand da"),
    STAGE_GUESTS: N_("Gäste da"),
    STAGE_PREHEAT: N_("Vorheizen"),
    STAGE_AWAY_SHORT: N_("kurz weg"),
    STAGE_AWAY_LONG: N_("länger weg"),
}


class PresenceMixin:
    """Anwesenheits-Teil der Zentrale."""

    @callback
    def _on_tracker_change(self, event: Event[EventStateChangedData]) -> None:
        # Kalender-Termin geändert: Cache verwerfen, damit sofort neu gelesen wird.
        if event.data.get("entity_id") == self.opt(CONF_CALENDAR):
            self._calendar_fetched = None
            self._calendar_fetch_pending = False
        self._evaluate_presence()

    @callback
    def _on_presence_tick(self, _now: datetime) -> None:
        # Anwesenheitsprofil: bei jedem Takt ein Messpunkt (nur ja/nein, keine Namen).
        self.presence_profile.mark(_now, self.stage not in AWAY_STAGES and not self.vacation)
        self._evaluate_presence()
        self.check_storm()  # Unwetter bei offenem Fenster
        self._check_presence_sleep()  # belegtes Schlafzimmer = Bettzeit
        for room in list(self.rooms.values()):
            room.record_usage()  # Nutzungsprofil (nur Räume mit Melder)
        if self.sleep_signals:
            self._handle_signal(self.signals.tick(dt_util.now()))

    def _zone_geo(self) -> tuple[float, float, float] | None:
        state = self.hass.states.get(self.zone) if self.zone else None
        if state is None:
            return None
        lat = to_float(state.attributes.get("latitude"))
        lon = to_float(state.attributes.get("longitude"))
        radius = to_float(state.attributes.get("radius")) or 100.0
        if lat is None or lon is None:
            return None
        return lat, lon, radius

    def _trackers_for(self, person: str) -> list[str]:
        """Handys/Geräte einer Person – auch wenn direkt ein Tracker eingetragen ist."""
        state = self.hass.states.get(person)
        if state is not None and not person.startswith("person."):
            return [person]
        return list((state.attributes.get("device_trackers") if state else None) or [])

    def _work_zone_hold(self, person: str, now: datetime) -> bool:
        """Ist die Person seit genug Minuten an einem eingetragenen Arbeitsplatz?

        Dann kommt sie so schnell nicht zurück: kein Vorheizen, keine Wartezeit.
        """
        zones = list(self.opt(CONF_WORK_ZONES) or [])
        if not zones:
            return False
        names = set()
        for zone in zones:
            state = self.hass.states.get(zone)
            if state is not None:
                names.add(str(state.attributes.get("friendly_name") or state.name or ""))
        names.discard("")
        if not names:
            return False
        inside = any(
            (st := self.hass.states.get(tracker)) is not None and st.state in names
            for tracker in self._trackers_for(person)
        )
        if not inside:
            self._work_since.pop(person, None)
            return False
        since = self._work_since.setdefault(person, now)
        return (now - since) >= timedelta(minutes=float(self.opt(CONF_WORK_ZONE_MINUTES) or 0))

    def _person_status(self, person: str, geo: tuple[float, float, float], now: datetime) -> dict[str, Any]:
        """Ist eine Person da? Zählt, sobald irgendeins ihrer Handys in der Zone ist."""
        state = self.hass.states.get(person)
        name = state.name if state else person
        present = False
        distance: float | None = None
        if state is not None and not person.startswith("person."):
            # Kein person.*, sondern ein Gerätetracker direkt: als einzige Quelle nehmen
            trackers = [person]
        else:
            trackers = list((state.attributes.get("device_trackers") if state else None) or [])
        for tracker in trackers:
            tstate = self.hass.states.get(tracker)
            if tstate is None:
                continue
            lat = to_float(tstate.attributes.get("latitude"))
            lon = to_float(tstate.attributes.get("longitude"))
            if lat is None or lon is None:
                continue  # Router-/Bluetooth-Tracker ohne Koordinaten ignorieren
            when = getattr(tstate, "last_reported", None) or tstate.last_updated
            accuracy = to_float(tstate.attributes.get("gps_accuracy")) or 0.0
            flt = self._filters.setdefault(tracker, TrackerFilter())
            if self._seen.get(tracker) != when:
                self._seen[tracker] = when
                if not flt.feed(Fix(lat, lon, when, accuracy)):
                    _LOGGER.debug("%s: Ortung von %s verworfen (Sprung/ungenau)", name, tracker)
                    last = self._reject_logged.get(tracker)
                    if last is None or now - last > timedelta(hours=1):
                        self._reject_logged[tracker] = now
                        far = haversine_km(lat, lon, geo[0], geo[1]) if lat is not None and lon is not None else None
                        self.log.add(
                            CAT_PRESENCE,
                            tr("Ortung von {name} ignoriert", name=name),
                            (tr("{tracker}: Sprung auf {km} km", tracker=tracker, km=f"{far:.0f}") if far is not None else tracker)
                            + (tr(", Genauigkeit {m} m", m=f"{accuracy:.0f}") if accuracy > 200 else tr(" – zu schnell für echte Bewegung (z. B. VPN)"))
                            + tr("; wird erst übernommen, wenn sie 30 min stabil bleibt"),
                        )
            fix = flt.accepted
            if fix is None:
                continue
            dist = haversine_km(fix.lat, fix.lon, geo[0], geo[1])
            if dist * 1000 <= geo[2] + min(fix.accuracy, 100.0):
                present = True
            distance = dist if distance is None else min(distance, dist)
        hist = self._history.setdefault(person, deque(maxlen=60))
        if distance is not None and (not hist or abs(hist[-1][1] - distance) > 0.05):
            hist.append((now, distance))
        while hist and now - hist[0][0] > timedelta(minutes=45):
            hist.popleft()
        return {
            "name": name,
            "present": present,
            "distance_km": round(distance, 1) if distance is not None else None,
            "approaching": approaching(list(hist), now) if distance is not None else False,
            "eta_min": eta_minutes(list(hist), now) if distance is not None and not present else None,
        }

    def _evaluate_presence(self, initial: bool = False) -> None:
        self._maybe_refresh_calendar()
        cal = self.calendar_mode
        now = dt_util.utcnow()
        geo = self._zone_geo()
        # Harter Schalter: keine Auswertung, keine Absenkung, kein Vorheizen (Issue #10)
        if self.opt(CONF_PRESENCE_OFF) or not self.presence_configured or geo is None:
            self.persons = {}
            self.sensed = []
            new = STAGE_HOME
            anyone = True
        else:
            self.persons = {p: self._person_status(p, geo, now) for p in self.residents}
            phones = any(p["present"] for p in self.persons.values())
            # Präsenzmelder: jemand ist zu Hause, auch ohne Handy (nicht im Urlaub – Katze, Blumengießer)
            self.sensed = [] if (self.vacation or cal == CAL_AWAY) else self.sensed_rooms()
            anyone = phones or bool(self.sensed)
            # Arbeitsplatz: dort ist niemand „auf dem Weg nach Hause“
            at_work = [p for p in self.persons if self._work_zone_hold(p, now)]
            for p in at_work:
                self.persons[p]["approaching"] = False
                self.persons[p]["eta_min"] = None
            self._auto_vacation(anyone, now)
            if anyone:
                if self._was_present is False and self.vacation and phones:
                    _LOGGER.info("Ankunft – Urlaub beendet")
                    self.vacation = False
                    self.log.add(CAT_PRESENCE, tr("Urlaub beendet"), tr("jemand ist angekommen"))
                self.last_present = now
                self._preheat_until = None
            elif self.last_present is None:
                self.last_present = now  # Erster Start: als gerade gegangen werten
            # Vorheizen: jemand nähert sich und ist nah genug
            near = [
                p for p in self.persons.values()
                if p["distance_km"] is not None and p["distance_km"] <= float(self.opt(CONF_PREHEAT_KM))
            ]
            coming = [p for p in near if p["approaching"]]
            # Nach Ankunftszeit: so früh, wie der langsamste Raum zum Aufheizen braucht
            need = self.preheat_needed_minutes()
            timely = [
                p for p in self.persons.values()
                if p not in near and p["approaching"] and p.get("eta_min") is not None
                and need is not None and p["distance_km"] is not None and p["distance_km"] <= ETA_MAX_KM
                and p["eta_min"] <= need + 10
            ]
            if not anyone and (coming or timely):
                if self._preheat_until is None:
                    who = (coming or timely)[0]
                    self._preheat_reason = (
                        tr("{who} ist in ~{eta} min da, Aufheizen dauert ~{need} min", who=who["name"], eta=f"{who['eta_min']:.0f}", need=need)
                        if who in timely else None
                    )
                self._preheat_until = now + PREHEAT_HOLD
                self._preheat_by = (coming or timely)[0]["name"]
            if self._preheat_until and (now > self._preheat_until or not (near or timely)):
                self._preheat_until = None
            if not anyone and not self.sensed and self.persons:
                blind = [p for p in self.persons.values() if p["distance_km"] is None]
                stale = self._blind_logged is None or now - self._blind_logged > timedelta(hours=6)
                if len(blind) == len(self.persons) and stale:
                    self._blind_logged = now
                    self.log.add(
                        CAT_PRESENCE,
                        tr("Keine Ortung verfügbar"),
                        tr(
                            "Kein Handy der Bewohner meldet einen Standort – Standortfreigabe („Immer“), VPN oder Zonenradius prüfen."
                        ),
                    )
            minutes = (now - self.last_present).total_seconds() / 60 if self.last_present else None
            new = presence_stage(
                PresenceInput(
                    configured=True,
                    anyone_present=anyone,
                    minutes_since_present=minutes,
                    # Am Arbeitsplatz wartet niemand auf eine Rückkehr: sofort „weg“
                    away_delay_min=0.0 if (at_work and not anyone) else float(self.opt(CONF_AWAY_DELAY)),
                    long_away_hours=float(self.opt(CONF_LONG_AWAY_HOURS)),
                    vacation=self.vacation or cal == CAL_AWAY,
                    guests=self.guests or cal == CAL_HOME,
                    preheat=self._preheat_until is not None,
                )
            )
        self._was_present = anyone
        # Anwesenheitsprofil: nur „jemand da“ oder nicht – keine Namen.
        self.presence_profile.mark(dt_util.now(), anyone and not self.vacation)
        if new != self.stage:
            old, self.stage = self.stage, new
            _LOGGER.info("Anwesenheit: %s → %s", old, new)
            self.log.add(
                CAT_PRESENCE,
                tr("Anwesenheit: {old} → {new}", old=tr(STAGE_TEXT.get(old, old)), new=tr(STAGE_TEXT.get(new, new))),
                self._presence_why(new),
                stage=new,
            )
            if not initial:
                self._announce_stage(old, new)
                if new == STAGE_HOME and old in (*AWAY_STAGES, STAGE_PREHEAT):
                    self.insights.on_arrival()
                if new == STAGE_PREHEAT:
                    self.insights.on_preheat()
            self._save()
            self._changed()
        else:
            self._save()
            self._changed(rooms=False)

    def _auto_vacation(self, anyone: bool, now: datetime) -> None:
        """Urlaub erkennen: alle Bewohner weit weg – und das schon eine Weile.

        Bewusst nicht relativ zum Zonenradius (100 m): „doppelt so weit" wäre der Supermarkt.
        Ohne gültige Ortung aller Bewohner wird nichts erkannt – ein Handy, das zu Hause
        liegen bleibt, soll keinen Urlaub auslösen.
        """
        km = float(self.opt(CONF_VACATION_KM) or 0)
        if km <= 0 or not self.persons:
            self._far_since = None
            return
        valid = [p for p in self.persons.values() if p.get("distance_km") is not None]
        far = (
            len(valid) == len(self.persons)
            and all(p["distance_km"] > km for p in valid)
            and not any(p.get("approaching") for p in valid)
        )
        if anyone or not far:
            self._far_since = None
            return
        if getattr(self, "_far_since", None) is None:
            self._far_since = now
            return
        hours = float(self.opt(CONF_VACATION_HOURS) or 12)
        if not self.vacation and now - self._far_since >= timedelta(hours=hours):
            self.vacation = True
            self.log.add(
                CAT_PRESENCE,
                tr("Urlaub erkannt"),
                tr(
                    "alle Bewohner seit {h} h weiter als {km} km entfernt",
                    h=f"{hours:.0f}",
                    km=f"{km:.0f}",
                ),
            )
            self._save()

    def stage_for_room(self, entry_id: str) -> str:
        """Stufe für einen Raum – „Gäste da" kann auf ausgewählte Räume begrenzt sein.

        Ohne Auswahl gilt sie wie bisher für die ganze Wohnung.
        """
        # Raum gehört bestimmten Personen: ist keine von ihnen da, wird abgesenkt – auch wenn
        # andere Bewohner zu Hause sind (Kinderzimmer, Gästezimmer).
        room = self.rooms.get(entry_id)
        if room is not None and not self.guests:
            persons = list(room.config.get(CONF_ROOM_PERSONS) or [])
            if persons and not any(self.persons.get(p, {}).get("present") for p in persons):
                return STAGE_AWAY_LONG if self.stage == STAGE_AWAY_LONG else STAGE_AWAY_SHORT
        if self.stage != STAGE_GUESTS:
            return self.stage
        chosen = list(self.opt(CONF_GUESTS_ROOMS) or [])
        if chosen and entry_id not in chosen:
            minutes = (
                (dt_util.utcnow() - self.last_present).total_seconds() / 60 if self.last_present else None
            )
            if minutes is None or minutes < float(self.opt(CONF_AWAY_DELAY)):
                return STAGE_HOME
            return (
                STAGE_AWAY_LONG
                if minutes >= float(self.opt(CONF_LONG_AWAY_HOURS)) * 60
                else STAGE_AWAY_SHORT
            )
        return self.stage

    def note_trv_blip(self, room: Any, seconds: float) -> None:
        """Ein Thermostat war kurz weg. Waren es alle gleichzeitig, ist es die Verbindung."""
        now = dt_util.utcnow()
        self._blips[room.entry.entry_id] = now
        rooms = list(self.rooms)
        if len(rooms) < 2:
            return
        recent = [eid for eid in rooms if (t := self._blips.get(eid)) and now - t <= timedelta(seconds=20)]
        if len(recent) < len(rooms):
            return
        if self.connection_blips and now - self.connection_blips[-1][0] <= timedelta(seconds=30):
            return
        self.connection_blips.append((now, seconds))
        self.insights.count("", "blips", home=True)
        day = [b for b in self.connection_blips if now - b[0] <= timedelta(hours=24)]
        if self._blip_logged is None or now - self._blip_logged >= timedelta(minutes=30):
            self._blip_logged = now
            self.log.add(
                "device",
                tr("Kurze Verbindungsunterbrechung zu allen Thermostaten"),
                tr("{s} s – heute {n}× (Zigbee2MQTT, MQTT oder VPN); die Regelung holt alles nach", s=f"{seconds:.0f}", n=len(day)),
                level="info",
            )

    def preheat_needed_minutes(self) -> int | None:
        """Längste gelernte Aufheizzeit aller Räume (None = noch nichts gelernt)."""
        needs = [n for r in list(self.rooms.values()) if (n := r.heatup_needed()) is not None]
        return max(needs) if needs else None

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
        for entity_id, state in candidates:
            summary = state.attributes.get("message")
            if not summary:
                continue
            # HA meldet freie/ganztägige Termine als „off“, liefert aber die message.
            active = state.state == "on" or (state.state == "off" and bool(summary))
            mode = calendar_mode(active, summary, self.opt(CONF_CALENDAR_AWAY), self.opt(CONF_CALENDAR_HOME))
            if mode:
                self.calendar_source = entity_id
                return mode, summary
        self.calendar_source = None
        return None, None

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

    def _maybe_refresh_calendar(self) -> None:
        """Get_events höchstens einmal pro Minute im Hintergrund abfragen."""
        if not self.opt(CONF_CALENDAR) or self._calendar_fetch_pending:
            return
        if self._calendar_fetched is not None and dt_util.utcnow() - self._calendar_fetched < CALENDAR_REFRESH:
            return
        self._calendar_fetch_pending = True
        self.hass.async_create_task(self.async_check_calendar())

    async def async_check_calendar(self) -> None:
        """Alle laufenden Termine prüfen – auch überlappende und ganztägige.

        Der Zustand einer Kalender-Entität liefert nur **eine** `message`. Bei
        überlappenden Terminen (z. B. Ganztags „Goldschmidt“ + „Test HA“) geht der
        Homeoffice-Termin sonst unter. Deshalb werden die Termine über
        ``calendar.get_events`` im Zeitfenster abgefragt und einzeln geprüft.
        """
        try:
            configured = self.opt(CONF_CALENDAR)
            if not configured:
                return
            now = dt_util.now()
            start = now - timedelta(hours=1)
            end = now + timedelta(days=7)
            entities: list[str] = []
            if self.hass.states.get(configured) is not None:
                entities.append(configured)
            for st in self.hass.states.async_all("calendar"):
                if st.entity_id == configured:
                    continue
                if st.state == "on" or st.attributes.get("message"):
                    entities.append(st.entity_id)
            found_mode: str | None = None
            found_summary: str | None = None
            found_source: str | None = None
            active: list[dict[str, Any]] = []
            all_events: list[dict[str, Any]] = []
            errors = 0
            for entity_id in entities:
                events = await self._calendar_events(entity_id, start, end)
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
                        "mode": calendar_mode(True, summary, self.opt(CONF_CALENDAR_AWAY), self.opt(CONF_CALENDAR_HOME)),
                    }
                    all_events.append(item)
                    if not self._event_active(event, now):
                        continue
                    active.append(item)
                    if found_mode is None and item["mode"]:
                        found_mode, found_summary, found_source = item["mode"], summary, entity_id
            if not entities or errors == len(entities):
                # Fallback: Zustands-Message (falls get_events nicht verfügbar ist)
                found_mode, found_summary = self.calendar_event()
                found_source = self.calendar_source
                active = []
                all_events = []
            self._calendar_last_events = active
            self._calendar_upcoming = sorted(
                (e for e in all_events if not any(a is e for a in active) and str(e.get("start") or "") > now.isoformat()),
                key=lambda e: str(e.get("start") or ""),
            )[:10]
            if self._apply_calendar(found_mode, found_summary, found_source):
                self._evaluate_presence()
        finally:
            self._calendar_fetched = dt_util.utcnow()
            self._calendar_fetch_pending = False

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

    def _presence_why(self, stage: str) -> str:
        parts = []
        if self.calendar_mode:
            parts.append(tr("Kalender: „{s}“", s=self.calendar_summary))
        if stage == STAGE_GUESTS:
            parts.append(tr("Schalter „Gäste da“ ist an"))
        if self.vacation:
            parts.append(tr("Urlaub ist an"))
        if stage == STAGE_PREHEAT and self._preheat_by:
            parts.append(self._preheat_reason or tr("{who} nähert sich (Vorheizen ab {km} km)", who=self._preheat_by, km=f"{float(self.opt(CONF_PREHEAT_KM)):.0f}"))
        for p in self.persons.values():
            if p["present"]:
                parts.append(tr("{name} ist da", name=p["name"]))
            elif p["distance_km"] is not None:
                parts.append(tr("{name} {km} km entfernt", name=p["name"], km=dec(p["distance_km"])) + (tr(" und kommt näher") if p["approaching"] else ""))
            else:
                parts.append(tr("{name}: Ort unbekannt", name=p["name"]))
        if stage in AWAY_STAGES and self.last_present:
            mins = (dt_util.utcnow() - self.last_present).total_seconds() / 60
            parts.append(
                tr("seit {h} h niemand da", h=f"{mins / 60:.0f}") if mins >= 120 else tr("seit {m} min niemand da (Wartezeit {w} min)", m=f"{mins:.0f}", w=f"{float(self.opt(CONF_AWAY_DELAY)):.0f}")
            )
        if self.sensed:
            parts.append(tr("Präsenzmelder: jemand in {rooms}", rooms=", ".join(self.sensed)))
        if not self.presence_configured:
            parts.append(tr("Anwesenheit nicht eingerichtet – gilt als da"))
        return "; ".join(parts)

    def _announce_stage(self, old: str, new: str) -> None:
        if new == STAGE_AWAY_SHORT:
            self.notify(KIND_PRESENCE, tr("🏠 Alle weg"), tr("Heizung{where} ist abgesenkt (kurze Abwesenheit).", where=self._where()))
        elif new == STAGE_AWAY_LONG:
            self.notify(KIND_PRESENCE, tr("🧳 Länger weg"), tr("Heizung{where} ist auf die Abwesenheits-Temperatur abgesenkt.", where=self._where()))
        elif new == STAGE_PREHEAT:
            who = self._preheat_by or tr("Jemand")
            dist = next((p["distance_km"] for p in self.persons.values() if p["name"] == who), None)
            extra = f" ({dist:.0f} km)" if dist is not None else ""
            self.notify(KIND_PRESENCE, tr("🚗 {who} kommt{extra}", who=who, extra=extra), tr("Heize schon mal vor."))
        elif old in AWAY_STAGES and new == STAGE_HOME:
            self.notify(KIND_PRESENCE, tr("👋 Willkommen"), tr("Räume heizen wieder auf Wunschtemperatur."))

    def _where(self) -> str:
        """„ in <Wohnung>“ – nur wenn es mehrere Wohnungen gibt."""
        return tr(" in {name}", name=self.name) if len(all_hubs(self.hass)) > 1 else ""

    @property
    def away(self) -> bool:
        return self.stage in AWAY_STAGES

    @property
    def nobody_home(self) -> bool:
        """Niemand da (auch während der Wartezeit/beim Vorheizen)."""
        if (
            not self.presence_configured
            or self.guests
            or self.calendar_mode == CAL_HOME
            or self.home_office_active
        ):
            return False
        return not any(p.get("present") for p in self.persons.values()) and not self.sensed

    def sensed_rooms(self) -> list[str]:
        """Räume, in denen ein Präsenzmelder gerade jemanden sieht (je nach Einstellung nur mmWave)."""
        mode = self.opt(CONF_HOME_SENSORS) or "mmwave"
        if mode == "off":
            return []
        kinds = (KIND_MMWAVE, KIND_PIR) if mode == "all" else (KIND_MMWAVE,)
        return [r.name for r in self.rooms.values() if r.presence_sensors and r.seen_recently(kinds)]

    def on_room_presence(self) -> None:
        """Ein Raum meldet: jemand gekommen oder gegangen."""
        if self.presence_configured:
            self._evaluate_presence()

    def set_vacation(self, on: bool) -> None:
        self.vacation = on
        self._evaluate_presence()
        self._save()
        self._changed()

    def set_home_office(self, on: bool) -> None:
        """Schalter „Homeoffice“: im eingestellten Fenster Wunsch statt Zeitplan."""
        self.home_office = on
        self._evaluate_presence()
        self._save()
        self._changed()

    def set_guests(self, on: bool) -> None:
        self.guests = on
        self._evaluate_presence()
        self._save()
        self._changed()
