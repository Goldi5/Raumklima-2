"""Anwesenheit der Wohnung: Ortung, Abwesenheitsstufen, Vorheizen nach Ankunftszeit."""

from __future__ import annotations

from collections import deque
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, EventStateChangedData, callback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_AWAY_DELAY,
    CONF_CALENDAR,
    CONF_CALENDAR_AWAY,
    CONF_CALENDAR_HOME,
    CONF_LONG_AWAY_HOURS,
    CONF_PREHEAT_KM,
    KIND_PRESENCE,
)
from .decision_log import (
    CAT_PRESENCE,
)
from .logic import to_float
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

STAGE_TEXT = {
    STAGE_HOME: "jemand da",
    STAGE_GUESTS: "Gäste da",
    STAGE_PREHEAT: "Vorheizen",
    STAGE_AWAY_SHORT: "kurz weg",
    STAGE_AWAY_LONG: "länger weg",
}


class PresenceMixin:
    """Anwesenheits-Teil der Zentrale."""

    @callback
    def _on_tracker_change(self, _event: Event[EventStateChangedData]) -> None:
        self._evaluate_presence()

    @callback
    def _on_presence_tick(self, _now: datetime) -> None:
        self._evaluate_presence()
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

    def _person_status(self, person: str, geo: tuple[float, float, float], now: datetime) -> dict[str, Any]:
        """Ist eine Person da? Zählt, sobald irgendeins ihrer Handys in der Zone ist."""
        state = self.hass.states.get(person)
        name = state.name if state else person
        present = False
        distance: float | None = None
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
                            f"Ortung von {name} ignoriert",
                            (f"{tracker}: Sprung auf {far:.0f} km" if far is not None else tracker)
                            + (f", Genauigkeit {accuracy:.0f} m" if accuracy > 200 else " – zu schnell für echte Bewegung (z. B. VPN)")
                            + "; wird erst übernommen, wenn sie 30 min stabil bleibt",
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
        cal = self._check_calendar()
        now = dt_util.utcnow()
        geo = self._zone_geo()
        if not self.presence_configured or geo is None:
            self.persons = {}
            new = STAGE_HOME
            anyone = True
        else:
            self.persons = {p: self._person_status(p, geo, now) for p in self.residents}
            anyone = any(p["present"] for p in self.persons.values())
            if anyone:
                if self._was_present is False and self.vacation:
                    _LOGGER.info("Ankunft – Urlaub beendet")
                    self.vacation = False
                    self.log.add(CAT_PRESENCE, "Urlaub beendet", "jemand ist angekommen")
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
                        f"{who['name']} ist in ~{who['eta_min']:.0f} min da, Aufheizen dauert ~{need} min"
                        if who in timely else None
                    )
                self._preheat_until = now + PREHEAT_HOLD
                self._preheat_by = (coming or timely)[0]["name"]
            if self._preheat_until and (now > self._preheat_until or not (near or timely)):
                self._preheat_until = None
            minutes = (now - self.last_present).total_seconds() / 60 if self.last_present else None
            new = presence_stage(
                PresenceInput(
                    configured=True,
                    anyone_present=anyone,
                    minutes_since_present=minutes,
                    away_delay_min=float(self.opt(CONF_AWAY_DELAY)),
                    long_away_hours=float(self.opt(CONF_LONG_AWAY_HOURS)),
                    vacation=self.vacation or cal == CAL_AWAY,
                    guests=self.guests or cal == CAL_HOME,
                    preheat=self._preheat_until is not None,
                )
            )
        self._was_present = anyone
        if new != self.stage:
            old, self.stage = self.stage, new
            _LOGGER.info("Anwesenheit: %s → %s", old, new)
            self.log.add(
                CAT_PRESENCE,
                f"Anwesenheit: {STAGE_TEXT.get(old, old)} → {STAGE_TEXT.get(new, new)}",
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
        day = [b for b in self.connection_blips if now - b[0] <= timedelta(hours=24)]
        if self._blip_logged is None or now - self._blip_logged >= timedelta(minutes=30):
            self._blip_logged = now
            self.log.add(
                "device",
                "Kurze Verbindungsunterbrechung zu allen Thermostaten",
                f"{seconds:.0f} s – heute {len(day)}× (Zigbee2MQTT, MQTT oder VPN); die Regelung holt alles nach",
                level="info",
            )

    def preheat_needed_minutes(self) -> int | None:
        """Längste gelernte Aufheizzeit aller Räume (None = noch nichts gelernt)."""
        needs = [n for r in list(self.rooms.values()) if (n := r.heatup_needed()) is not None]
        return max(needs) if needs else None

    def calendar_event(self) -> tuple[str | None, str | None]:
        """(Modus, Termin) des laufenden Kalendertermins: „away“ wie Urlaub, „home“ wie Gäste."""
        entity = self.opt(CONF_CALENDAR)
        state = self.hass.states.get(entity) if entity else None
        if state is None:
            return None, None
        summary = state.attributes.get("message")
        mode = calendar_mode(state.state == "on", summary, self.opt(CONF_CALENDAR_AWAY), self.opt(CONF_CALENDAR_HOME))
        return mode, summary

    def _check_calendar(self) -> str | None:
        """Kalender lesen und Wechsel protokollieren."""
        mode, summary = self.calendar_event()
        if mode != self.calendar_mode:
            if mode == CAL_AWAY:
                self.log.add(CAT_PRESENCE, f"Kalender: „{summary}“ – wie Urlaub", "Termin läuft; Absenkung „länger weg“, sobald niemand da ist")
            elif mode == CAL_HOME:
                self.log.add(CAT_PRESENCE, f"Kalender: „{summary}“ – jemand bleibt zu Hause", "Termin läuft; es wird nicht abgesenkt")
            else:
                self.log.add(CAT_PRESENCE, "Kalender: Termin vorbei", "Anwesenheit wieder nach Ortung")
            self.calendar_mode = mode
            self.calendar_summary = summary
        return mode

    def _presence_why(self, stage: str) -> str:
        parts = []
        if self.calendar_mode:
            parts.append(f"Kalender: „{self.calendar_summary}“")
        if stage == STAGE_GUESTS:
            parts.append("Schalter „Gäste da“ ist an")
        if self.vacation:
            parts.append("Urlaub ist an")
        if stage == STAGE_PREHEAT and self._preheat_by:
            parts.append(self._preheat_reason or f"{self._preheat_by} nähert sich (Vorheizen ab {float(self.opt(CONF_PREHEAT_KM)):.0f} km)")
        for p in self.persons.values():
            if p["present"]:
                parts.append(f"{p['name']} ist da")
            elif p["distance_km"] is not None:
                parts.append(f"{p['name']} {p['distance_km']:.1f} km entfernt".replace(".", ",") + (" und kommt näher" if p["approaching"] else ""))
            else:
                parts.append(f"{p['name']}: Ort unbekannt")
        if stage in AWAY_STAGES and self.last_present:
            mins = (dt_util.utcnow() - self.last_present).total_seconds() / 60
            parts.append(
                f"seit {mins / 60:.0f} h niemand da" if mins >= 120 else f"seit {mins:.0f} min niemand da (Wartezeit {float(self.opt(CONF_AWAY_DELAY)):.0f} min)"
            )
        if not self.presence_configured:
            parts.append("Anwesenheit nicht eingerichtet – gilt als da")
        return "; ".join(parts)

    def _announce_stage(self, old: str, new: str) -> None:
        if new == STAGE_AWAY_SHORT:
            self.notify(KIND_PRESENCE, "🏠 Alle weg", f"Heizung{self._where()} ist abgesenkt (kurze Abwesenheit).")
        elif new == STAGE_AWAY_LONG:
            self.notify(KIND_PRESENCE, "🧳 Länger weg", f"Heizung{self._where()} ist auf die Abwesenheits-Temperatur abgesenkt.")
        elif new == STAGE_PREHEAT:
            who = self._preheat_by or "Jemand"
            dist = next((p["distance_km"] for p in self.persons.values() if p["name"] == who), None)
            extra = f" ({dist:.0f} km)" if dist is not None else ""
            self.notify(KIND_PRESENCE, f"🚗 {who} kommt{extra}", "Heize schon mal vor.")
        elif old in AWAY_STAGES and new == STAGE_HOME:
            self.notify(KIND_PRESENCE, "👋 Willkommen", "Räume heizen wieder auf Wunschtemperatur.")

    def _where(self) -> str:
        """„ in Berlin“ – nur wenn es mehrere Wohnungen gibt."""
        return f" in {self.name}" if len(all_hubs(self.hass)) > 1 else ""

    @property
    def away(self) -> bool:
        return self.stage in AWAY_STAGES

    @property
    def nobody_home(self) -> bool:
        """Niemand da (auch während der Wartezeit/beim Vorheizen)."""
        if not self.presence_configured or self.guests or self.calendar_mode == CAL_HOME:
            return False
        return not any(p.get("present") for p in self.persons.values())

    def set_vacation(self, on: bool) -> None:
        self.vacation = on
        self._evaluate_presence()
        self._save()
        self._changed()

    def set_guests(self, on: bool) -> None:
        self.guests = on
        self._evaluate_presence()
        self._save()
        self._changed()
