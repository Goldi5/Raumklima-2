"""Zentrale „Allgemein“: Empfänger, Anwesenheit, Heizsaison – gilt für alle Räume."""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CONF_AWAY_DELAY,
    CONF_BUILDING,
    CONF_COLD_SNAP_TEMP,
    CONF_FROST_FLOOR,
    CONF_HEATING_LIMIT,
    CONF_LONG_AWAY_HOURS,
    CONF_PREHEAT_KM,
    CONF_RECIPIENTS,
    CONF_RESIDENTS,
    CONF_SEASON_END,
    CONF_SEASON_MODE,
    CONF_SEASON_START,
    CONF_TTS,
    CONF_VALVE_CARE,
    CONF_ZONE,
    DOMAIN,
    HUB_DEFAULTS,
    KIND_PRESENCE,
    KIND_SEASON,
    URGENT_KINDS,
)
from .logic import to_float
from .planning import (
    AWAY_STAGES,
    BUILDING_FRSI,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    STAGE_GUESTS,
    STAGE_HOME,
    STAGE_PREHEAT,
    Fix,
    PresenceInput,
    SeasonConfig,
    SeasonState,
    TrackerFilter,
    ETA_MAX_KM,
    approaching,
    eta_minutes,
    combined_mean,
    haversine_km,
    in_season,
    in_time_window,
    presence_stage,
    season_allows_heating,
    season_decision,
    season_step,
)
from .decision_log import (
    CAT_MANUAL,
    CAT_NOTIFY,
    CAT_PRESENCE,
    CAT_SEASON,
    CAT_SETTINGS,
    DecisionLog,
    fmt_temp,
)
from .holidays_de import holiday_name
from .insights import Insights
from .sleep import BED, WAKE, SignalTracker, SleepLearner, effective_times, is_weekend_night, night_of

if TYPE_CHECKING:
    from .controller import RaumklimaController

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1
PRESENCE_INTERVAL = timedelta(seconds=60)
SAMPLE_INTERVAL = timedelta(minutes=10)
FORECAST_INTERVAL = timedelta(minutes=30)
PREHEAT_HOLD = timedelta(minutes=90)
HEAT_TODAY = timedelta(hours=24)


def domain_data(hass: HomeAssistant) -> dict[str, Any]:
    """Gemeinsame Daten: Zentrale und alle Räume."""
    return hass.data.setdefault(DOMAIN, {"hub": None, "rooms": {}})


def get_hub(hass: HomeAssistant) -> RaumklimaHub | None:
    return domain_data(hass).get("hub")


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def _parse(value: Any) -> datetime | None:
    return dt_util.parse_datetime(value) if isinstance(value, str) else None


STAGE_TEXT = {
    STAGE_HOME: "jemand da",
    STAGE_GUESTS: "Gäste da",
    STAGE_PREHEAT: "Vorheizen",
    STAGE_AWAY_SHORT: "kurz weg",
    STAGE_AWAY_LONG: "länger weg",
}
SEASON_TEXT = {
    "heating": "Heizen",
    "pause": "Heizpause",
    "cold_snap": "Kälteeinbruch",
    "heat_today": "Heute heizen",
    "always": "Immer heizen",
    "manual_pause": "Heizpause (von Hand)",
}


def _who(target: str) -> str:
    name = target.split(".", 1)[-1].removeprefix("mobile_app_")
    return " ".join(w.capitalize() for w in name.split("_") if w) or target


def _short(value: Any) -> str:
    text = str(value)
    return text if len(text) <= 40 else text[:37] + "…"


class RaumklimaHub:
    """Einstellungen und Zustände, die für die ganze Wohnung gelten."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = {}
        self.load_config()
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.hub")
        self._listeners: list[Callable[[], None]] = []
        self._unsubs: list[Callable[[], None]] = []
        # Anwesenheit
        self.vacation = False
        self.guests = False
        self.last_present: datetime | None = None
        self.stage = STAGE_HOME
        self.persons: dict[str, dict[str, Any]] = {}
        self._filters: dict[str, TrackerFilter] = {}
        self._seen: dict[str, datetime] = {}
        self._history: dict[str, deque[tuple[datetime, float]]] = {}
        self._was_present: bool | None = None
        self._preheat_until: datetime | None = None
        self._preheat_by: str | None = None
        self._preheat_reason: str | None = None
        # Heizsaison
        self.season = SeasonState()
        self.decision = "heating"
        self.heat_today_until: datetime | None = None
        self.samples: list[tuple[datetime, float]] = []
        self.mean_past: float | None = None
        self.mean_forecast: float | None = None
        self.insights = Insights(hass, self)
        self.log = DecisionLog(hass)
        self._reject_logged: dict[str, datetime] = {}
        # Schlafenszeiten
        self.sleep = SleepLearner()
        self.signals = SignalTracker()
        self._woke_night: str | None = None  # Nacht, in der Signale „aufgestanden“ gemeldet haben

    # ------------------------------------------------------------ Konfiguration
    def load_config(self) -> None:
        self.config = {**HUB_DEFAULTS, **self.entry.data, **self.entry.options}

    def opt(self, key: str) -> Any:
        return self.config.get(key, HUB_DEFAULTS.get(key))

    @property
    def residents(self) -> list[str]:
        return list(self.opt(CONF_RESIDENTS) or [])

    @property
    def zone(self) -> str | None:
        return self.opt(CONF_ZONE) or None

    @property
    def presence_configured(self) -> bool:
        return bool(self.residents and self.zone)

    @property
    def frsi(self) -> float:
        return BUILDING_FRSI.get(self.opt(CONF_BUILDING), 0.70)

    @property
    def frost_floor(self) -> float:
        return float(self.opt(CONF_FROST_FLOOR))

    @property
    def weather(self) -> str | None:
        weather = self.opt("weather_entity")
        if weather:
            return weather
        for room in self.rooms.values():  # Rückfall: Wetter aus einem Raum
            if room.config.get("weather_entity"):
                return room.config["weather_entity"]
        return None

    @property
    def rooms(self) -> dict[str, RaumklimaController]:
        return domain_data(self.hass)["rooms"]

    # ------------------------------------------------------------ Lebenszyklus
    async def async_start(self) -> None:
        await self.log.async_load()
        stored = await self._store.async_load() or {}
        self.vacation = bool(stored.get("vacation", False))
        self.guests = bool(stored.get("guests", False))
        self.last_present = _parse(stored.get("last_present"))
        self.heat_today_until = _parse(stored.get("heat_today_until"))
        season = stored.get("season") or {}
        self.season = SeasonState(
            heating=season.get("heating"),
            mild_since=_parse(season.get("mild_since")),
            cold_since=_parse(season.get("cold_since")),
            cold_snap=bool(season.get("cold_snap", False)),
        )
        self.decision = stored.get("decision", self.decision)
        self.stage = stored.get("stage", self.stage)
        for when, temp in stored.get("samples", []):
            parsed = _parse(when)
            if parsed and temp is not None:
                self.samples.append((parsed, float(temp)))
        self.sleep.load(stored.get("sleep"))
        sig = stored.get("signals") or {}
        self.signals.asleep = bool(sig.get("asleep", False))
        self.signals.bed_at = _parse(sig.get("bed_at"))
        self._woke_night = sig.get("woke_night")
        self._migrate_kinds()
        self._subscribe()
        await self.insights.async_start()
        self._evaluate_presence(initial=True)
        self._sample_outdoor()
        self.hass.async_create_task(self._async_update_forecast())
        _LOGGER.info("Raumklima Allgemein gestartet (Anwesenheit %s)", "an" if self.presence_configured else "aus")

    def _subscribe(self) -> None:
        tracked: list[str] = []
        for person in self.residents:
            tracked.append(person)
            state = self.hass.states.get(person)
            if state:
                tracked += list(state.attributes.get("device_trackers") or [])
        if self.zone:
            tracked.append(self.zone)
        if tracked:
            self._unsubs.append(
                async_track_state_change_event(self.hass, tracked, self._on_tracker_change)
            )
        self._unsubs.append(
            async_track_time_interval(self.hass, self._on_presence_tick, PRESENCE_INTERVAL)
        )
        if self.sleep_signals:
            self._unsubs.append(
                async_track_state_change_event(self.hass, self.sleep_signals, self._on_signal_change)
            )
        self._unsubs.append(
            async_track_time_interval(self.hass, self._on_sample_tick, SAMPLE_INTERVAL)
        )
        self._unsubs.append(
            async_track_time_interval(self.hass, self._on_forecast_tick, FORECAST_INTERVAL)
        )
        # Sommerpflege: mittwochs 11:00 Ventile kurz bewegen
        self._unsubs.append(
            async_track_time_change(self.hass, self._on_valve_care, hour=11, minute=0, second=0)
        )

    def _unsubscribe(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()

    def _migrate_kinds(self) -> None:
        """Neue Nachrichtenarten (Gesundheit, Bericht) bei bisherigen Push-Empfängern ergänzen."""
        if int(self.entry.options.get("kinds_version", 1)) >= 2:
            return
        recipients = {
            t: sorted(set(k or []) | {"health", "report"}) for t, k in (self.opt("recipients") or {}).items()
        }
        self.hass.config_entries.async_update_entry(
            self.entry, options={**self.entry.options, "recipients": recipients, "kinds_version": 2}
        )
        self.load_config()

    @callback
    def notify_entities(self) -> None:
        """Nur die Entitäten der Zentrale aktualisieren."""
        self._changed(rooms=False)

    async def async_stop(self) -> None:
        await self.insights.async_stop()
        await self.log.async_save()
        self._unsubscribe()
        await self._store.async_save(self._stored())

    async def async_options_updated(self) -> None:
        """Einstellungen geändert: neu laden, ohne die Räume neu zu starten."""
        old = dict(self.config)
        self.load_config()
        changed = sorted(k for k in set(old) | set(self.config) if old.get(k) != self.config.get(k))
        if changed:
            self.log.add(
                CAT_SETTINGS,
                "Einstellungen geändert",
                ", ".join(f"{k}: {_short(old.get(k))} → {_short(self.config.get(k))}" for k in changed[:8]),
            )
        self._unsubscribe()
        self._filters.clear()
        self._seen.clear()
        self._subscribe()
        self._evaluate_presence()
        self._evaluate_season()
        self._changed()

    def _stored(self) -> dict[str, Any]:
        cutoff = dt_util.utcnow() - timedelta(hours=72)
        return {
            "vacation": self.vacation,
            "guests": self.guests,
            "last_present": _iso(self.last_present),
            "heat_today_until": _iso(self.heat_today_until),
            "stage": self.stage,
            "decision": self.decision,
            "season": {
                "heating": self.season.heating,
                "mild_since": _iso(self.season.mild_since),
                "cold_since": _iso(self.season.cold_since),
                "cold_snap": self.season.cold_snap,
            },
            "samples": [[_iso(w), t] for w, t in self.samples if w >= cutoff],
            "sleep": self.sleep.dump(),
            "signals": {"asleep": self.signals.asleep, "bed_at": _iso(self.signals.bed_at), "woke_night": self._woke_night},
        }

    def _save(self) -> None:
        self._store.async_delay_save(self._stored, 10)

    # ------------------------------------------------------------ Listener
    @callback
    def async_add_listener(self, update: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(update)

        @callback
        def remove() -> None:
            self._listeners.remove(update)

        return remove

    @callback
    def _changed(self, rooms: bool = True) -> None:
        for update in list(self._listeners):
            update()
        if rooms:
            for room in list(self.rooms.values()):
                room.on_hub_change()

    # ------------------------------------------------------------ Anwesenheit
    @callback
    def _on_tracker_change(self, _event: Event[EventStateChangedData]) -> None:
        self._evaluate_presence()

    @callback
    def _on_presence_tick(self, _now: datetime) -> None:
        self._evaluate_presence()
        if self.sleep_signals:
            self._handle_signal(self.signals.tick(dt_util.now()))

    # ------------------------------------------------------------ Schlafenszeiten
    @property
    def holiday_state(self) -> str | None:
        return str(self.opt("holiday_state") or "") or None

    @property
    def sleep_signals(self) -> list[str]:
        return [e for e in (self.opt("sleep_signals") or []) if isinstance(e, str)]

    def _signals_on(self) -> bool:
        return any(
            (st := self.hass.states.get(e)) is not None and st.state == "on" for e in self.sleep_signals
        )

    @callback
    def _on_signal_change(self, event: Any) -> None:
        new = event.data.get("new_state")
        if new is None or new.state in ("unavailable", "unknown"):
            return
        self._handle_signal(self.signals.update(self._signals_on(), dt_util.now()), event.data.get("entity_id"))

    def _handle_signal(self, kind: str | None, entity_id: str | None = None) -> None:
        if kind is None:
            return
        local = dt_util.now()
        if kind == BED:
            when = dt_util.as_local(self.signals.bed_at) if self.signals.bed_at else local
            names = ", ".join(self._entity_name(e) for e in self.sleep_signals)
            self.log.add(CAT_PRESENCE, "Schlafenszeit erkannt", f"{names} seit {when:%H:%M} aus – Ruhezeit gilt ab jetzt")
            self.record_sleep(BED, when, "Licht")
        else:
            self._woke_night = night_of(local).isoformat()
            self.log.add(CAT_PRESENCE, "Aufgestanden erkannt", f"{self._entity_name(entity_id or '')} ist an – Ruhezeit endet")
            self.record_sleep(WAKE, local, "Licht")
        self._save()
        self._changed()

    def _entity_name(self, entity_id: str) -> str:
        st = self.hass.states.get(entity_id)
        return str(st.name) if st is not None and getattr(st, "name", None) else entity_id

    def record_sleep(self, kind: str, local: datetime, source: str) -> None:
        """Bett-/Aufstehereignis lernen (auch von Räumen beim Nachtlüften)."""
        night = night_of(local)
        weekend = is_weekend_night(night, self.holiday_state)
        before = self.sleep.learned(weekend).as_dict()
        if not self.sleep.record(kind, local, source):
            return
        self.sleep.prune(local.date())
        after = self.sleep.learned(weekend).as_dict()
        if (before["bed"], before["wake"]) != (after["bed"], after["wake"]) and (after["bed"] or after["wake"]):
            label = "Wochenende" if weekend else "werktags"
            self.log.add(
                CAT_SETTINGS,
                f"Schlafenszeiten gelernt ({label})",
                f"ins Bett ~{after['bed'] or '–'} ({after['nights_bed']} Nächte), aufstehen ~{after['wake'] or '–'} ({after['nights_wake']} Nächte)",
            )
        self._save()

    def times_for(self, local: datetime | None = None) -> dict[str, Any]:
        """Wirksame Ruhe- und Nachtlüftzeiten für die Nacht, zu der „local“ gehört."""
        local = local or dt_util.now()
        self.sleep.state = self.holiday_state
        night = night_of(local)
        weekend = is_weekend_night(night, self.holiday_state)
        end = str(self.opt("quiet_end_weekend") or self.opt("quiet_end")) if weekend else str(self.opt("quiet_end"))
        out = effective_times(
            self.sleep.learned(weekend),
            str(self.opt("quiet_start")),
            end,
            str(self.opt("night_start")),
            str(self.opt("night_end")),
            enabled=bool(self.opt("learn_times")),
        )
        out["weekend"] = weekend
        out["night"] = night.isoformat()
        out["holiday"] = holiday_name(night + timedelta(days=1), self.holiday_state)
        return out

    def morning_after(self, since_local: datetime) -> datetime:
        """Ende der Ruhezeit am Morgen nach „since“ (gelernt, Wochenende beachtet)."""
        times = self.times_for(since_local)
        night = night_of(since_local)
        h, m = (int(x) for x in times["quiet_end"].split(":"))
        morning = datetime.combine(night + timedelta(days=1), datetime.min.time(), since_local.tzinfo).replace(hour=h, minute=m)
        return morning

    def woke_after(self, since_local: datetime) -> bool:
        """Haben Schlaf-Signale nach „since“ schon „aufgestanden“ gemeldet?"""
        return bool(self.sleep_signals) and self._woke_night == night_of(since_local).isoformat() and not self.signals.asleep

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
                    vacation=self.vacation,
                    guests=self.guests,
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

    def preheat_needed_minutes(self) -> int | None:
        """Längste gelernte Aufheizzeit aller Räume (None = noch nichts gelernt)."""
        needs = [n for r in list(self.rooms.values()) if (n := r.heatup_needed()) is not None]
        return max(needs) if needs else None

    def _presence_why(self, stage: str) -> str:
        parts = []
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
            self.notify(KIND_PRESENCE, "🏠 Alle weg", "Heizung in Berlin ist abgesenkt (kurze Abwesenheit).")
        elif new == STAGE_AWAY_LONG:
            self.notify(KIND_PRESENCE, "🧳 Länger weg", "Heizung ist auf die Abwesenheits-Temperatur abgesenkt.")
        elif new == STAGE_PREHEAT:
            who = self._preheat_by or "Jemand"
            dist = next((p["distance_km"] for p in self.persons.values() if p["name"] == who), None)
            extra = f" ({dist:.0f} km)" if dist is not None else ""
            self.notify(KIND_PRESENCE, f"🚗 {who} kommt{extra}", "Heize schon mal vor.")
        elif old in AWAY_STAGES and new == STAGE_HOME:
            self.notify(KIND_PRESENCE, "👋 Willkommen", "Räume heizen wieder auf Wunschtemperatur.")

    @property
    def away(self) -> bool:
        return self.stage in AWAY_STAGES

    @property
    def nobody_home(self) -> bool:
        """Niemand da (auch während der Wartezeit/beim Vorheizen)."""
        if not self.presence_configured or self.guests:
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

    # ------------------------------------------------------------ Heizsaison
    def outdoor_temp(self) -> float | None:
        weather = self.weather
        state = self.hass.states.get(weather) if weather else None
        if state is None:
            return None
        if weather.startswith("weather."):
            return to_float(state.attributes.get("temperature"))
        return to_float(state.state)

    @callback
    def _on_sample_tick(self, _now: datetime) -> None:
        self._sample_outdoor()

    def _sample_outdoor(self) -> None:
        now = dt_util.utcnow()
        temp = self.outdoor_temp()
        if temp is not None:
            self.samples.append((now, temp))
        cutoff = now - timedelta(hours=72)
        self.samples = [(w, t) for w, t in self.samples if w >= cutoff]
        last24 = [t for w, t in self.samples if w >= now - timedelta(hours=24)]
        span = (now - min((w for w, _ in self.samples), default=now)).total_seconds() / 3600
        self.mean_past = round(sum(last24) / len(last24), 1) if last24 and span >= 3 else None
        self._evaluate_season()

    @callback
    def _on_forecast_tick(self, _now: datetime) -> None:
        self.hass.async_create_task(self._async_update_forecast())

    async def _async_update_forecast(self) -> None:
        weather = self.weather
        if not weather or not weather.startswith("weather."):
            self.mean_forecast = None
            return
        temps: list[float] = []
        for kind in ("hourly", "daily"):
            try:
                resp = await self.hass.services.async_call(
                    "weather",
                    "get_forecasts",
                    {"entity_id": weather, "type": kind},
                    blocking=True,
                    return_response=True,
                )
            except Exception as err:  # noqa: BLE001 – Wetterdienst nicht erreichbar o. ä.
                _LOGGER.debug("Vorhersage (%s) nicht verfügbar: %s", kind, err)
                continue
            forecast = ((resp or {}).get(weather) or {}).get("forecast") or []
            now = dt_util.utcnow()
            if kind == "hourly":
                for item in forecast:
                    when = _parse(item.get("datetime"))
                    temp = to_float(item.get("temperature"))
                    if when and temp is not None and when <= now + timedelta(hours=24):
                        temps.append(temp)
            elif forecast:
                hi = to_float(forecast[0].get("temperature"))
                lo = to_float(forecast[0].get("templow"))
                temps = [t for t in (hi, lo) if t is not None]
            if temps:
                break
        self.mean_forecast = round(sum(temps) / len(temps), 1) if temps else None
        self._evaluate_season()

    def _season_config(self) -> SeasonConfig:
        return SeasonConfig(
            start=str(self.opt(CONF_SEASON_START)),
            end=str(self.opt(CONF_SEASON_END)),
            limit=float(self.opt(CONF_HEATING_LIMIT)),
            cold_temp=float(self.opt(CONF_COLD_SNAP_TEMP)),
        )

    @property
    def in_season(self) -> bool:
        cfg = self._season_config()
        return in_season(dt_util.now().date(), cfg.start, cfg.end)

    @property
    def mean_combined(self) -> float | None:
        return combined_mean(self.mean_past, self.mean_forecast)

    def _evaluate_season(self) -> None:
        now = dt_util.now()
        if self.heat_today_until and dt_util.utcnow() > self.heat_today_until:
            self.heat_today_until = None
        self.season = season_step(self.season, now, self.mean_past, self.mean_forecast, self._season_config())
        new = season_decision(
            str(self.opt(CONF_SEASON_MODE)),
            self.season,
            self.heat_today_until is not None,
            self.in_season,
        )
        if new != self.decision:
            old, self.decision = self.decision, new
            _LOGGER.info("Heizbetrieb: %s → %s", old, new)
            self.log.add(
                CAT_SEASON,
                f"Heizbetrieb: {SEASON_TEXT.get(old, old)} → {SEASON_TEXT.get(new, new)}",
                self._season_why(new),
                decision=new,
                mean_past=self.mean_past,
                mean_forecast=self.mean_forecast,
            )
            self._announce_season(old, new)
            self._save()
            self._changed()
        else:
            self._save()
            self._changed(rooms=False)

    def _season_why(self, decision: str) -> str:
        limit = float(self.opt(CONF_HEATING_LIMIT))
        base = (
            f"Ø letzte 24 h {fmt_temp(self.mean_past)}, Vorhersage 24 h {fmt_temp(self.mean_forecast)}, "
            f"zusammen {fmt_temp(self.mean_combined)} – Heizgrenze {fmt_temp(limit, 0)}"
        )
        reason = {
            "heating": "unter der Heizgrenze" if self.in_season else "Heizsaison",
            "pause": "seit 48 h mild" if self.in_season else "außerhalb der Heizsaison",
            "cold_snap": f"3 Tage unter {fmt_temp(float(self.opt(CONF_COLD_SNAP_TEMP)), 0)} – Kälteeinbruch",
            "heat_today": "„Heute heizen“ gedrückt (24 h)",
            "always": "Betriebsart „Immer heizen“",
            "manual_pause": "Betriebsart „Heizpause“",
        }.get(decision, "")
        return f"{reason}; {base}" if reason else base

    def _announce_season(self, old: str, new: str) -> None:
        mean = self.mean_combined
        limit = float(self.opt(CONF_HEATING_LIMIT))
        detail = f"Außen-Mittel {mean:.1f} °C, Heizgrenze {limit:.0f} °C." if mean is not None else ""
        heating_now = season_allows_heating(new)
        if heating_now == season_allows_heating(old):
            return
        if old in ("heat_today", "always", "manual_pause") or new in ("heat_today", "always", "manual_pause"):
            return  # von Hand ausgelöst – keine Meldung nötig
        if new == "heating":
            self.notify(KIND_SEASON, "🍂 Heizsaison", f"Es ist kühl genug – die Heizung arbeitet wieder. {detail}")
        elif new == "cold_snap":
            self.notify(KIND_SEASON, "🥶 Kälteeinbruch", f"Seit 3 Tagen kalt – es wird trotz Sommerzeit geheizt. {detail}")
        elif new == "pause":
            self.notify(KIND_SEASON, "☀️ Heizpause", f"Draußen ist es mild genug – die Heizung pausiert. {detail}")

    @property
    def heating_allowed(self) -> bool:
        return season_allows_heating(self.decision)

    def heat_today(self) -> None:
        self.log.add(CAT_MANUAL, "„Heute heizen“ gedrückt", "heizt 24 h, egal wie mild es ist")
        self.heat_today_until = dt_util.utcnow() + HEAT_TODAY
        self._evaluate_season()

    def cancel_heat_today(self) -> None:
        self.log.add(CAT_MANUAL, "„Heute heizen“ beendet")
        self.heat_today_until = None
        self._evaluate_season()

    @callback
    def _on_valve_care(self, now: datetime) -> None:
        if dt_util.as_local(now).weekday() != 2 or not self.opt(CONF_VALVE_CARE):
            return
        if self.heating_allowed:
            return
        _LOGGER.info("Sommerpflege: Ventile werden kurz bewegt")
        self.log.add(CAT_SEASON, "Sommerpflege: Ventile werden kurz geöffnet", "mittwochs 11 Uhr in der Heizpause, damit nichts festsitzt")
        for room in list(self.rooms.values()):
            self.hass.async_create_task(room.async_valve_care())

    # ------------------------------------------------------------ Benachrichtigen
    def targets(self, kind: str, channel: str = "push") -> list[str]:
        table = self.opt(CONF_RECIPIENTS if channel == "push" else CONF_TTS) or {}
        return [t for t, kinds in table.items() if kind in (kinds or [])]

    def has_targets(self, kind: str) -> bool:
        return bool(self.targets(kind) or self.targets(kind, "tts"))

    def quiet_now(self) -> bool:
        now = dt_util.now()
        if self.sleep_signals:
            if self.signals.asleep:
                return True
            if self._woke_night == night_of(now).isoformat():
                return False  # Licht an am Morgen: alle wach
        times = self.times_for(now)
        return in_time_window(now, times["quiet_start"], times["quiet_end"])

    def notify(
        self,
        kind: str,
        title: str,
        message: str,
        data: dict[str, Any] | None = None,
        speak: bool = True,
        room: Any = None,
    ) -> None:
        self.hass.async_create_task(self.async_notify(kind, title, message, data, speak, room=room))

    async def async_notify(
        self,
        kind: str,
        title: str,
        message: str,
        data: dict[str, Any] | None = None,
        speak: bool = True,
        only: str | None = None,
        room: Any = None,
    ) -> None:
        """An alle Empfänger senden, die diese Nachrichtenart gewählt haben."""
        quiet = self.quiet_now()
        data = dict(data or {})
        if quiet and kind not in URGENT_KINDS:
            data["push"] = {"interruption-level": "passive"}
        elif kind in URGENT_KINDS:
            data.setdefault("push", {"interruption-level": "time-sensitive"})
        push = [only] if only else self.targets(kind)
        tts = [] if not speak or quiet or only else self.targets(kind, "tts")
        if push or tts:
            level = (data.get("push") or {}).get("interruption-level", "active")
            how = {"passive": "leise", "time-sensitive": "dringend (auch in der Ruhezeit)"}.get(level, "normal")
            self.log.add(
                CAT_NOTIFY,
                f"{title}",
                f"{message} → " + ", ".join([_who(t) for t in push] + [f"{_who(t)} (Sprache)" for t in tts])
                + f"; {how}" + (" – Ruhezeit" if quiet else ""),
                kind=kind,
                room=getattr(room, "name", None),
                entry_id=getattr(getattr(room, "entry", None), "entry_id", None),
            )
        for target in push:
            domain, _, service = target.partition(".")
            if domain != "notify" or not service:
                continue
            try:
                await self.hass.services.async_call(
                    "notify", service, {"title": title, "message": message, "data": data}
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Benachrichtigung an %s fehlgeschlagen: %s", target, err)
        if not speak or quiet or only:
            return
        for target in self.targets(kind, "tts"):
            domain, _, service = target.partition(".")
            if domain != "notify" or not service:
                continue
            try:
                await self.hass.services.async_call(
                    "notify", service, {"message": f"{title}. {message}", "data": {"type": "announce"}}
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Sprachansage an %s fehlgeschlagen: %s", target, err)

    async def async_test(self, target: str) -> None:
        """Testnachricht an einen Empfänger."""
        domain, _, service = target.partition(".")
        if domain != "notify" or not service:
            raise ValueError(f"Kein notify-Dienst: {target}")
        await self.hass.services.async_call(
            "notify",
            service,
            {"title": "✅ Raumklima", "message": "Testnachricht – so sehen Hinweise der Heizung aus."},
            blocking=True,
        )

    # ------------------------------------------------------------ Anzeige
    def summary(self) -> dict[str, Any]:
        return {
            "stage": self.stage,
            "vacation": self.vacation,
            "guests": self.guests,
            "persons": self.persons,
            "last_present": _iso(self.last_present),
            "preheat_by": self._preheat_by if self.stage == STAGE_PREHEAT else None,
            "presence_configured": self.presence_configured,
            "decision": self.decision,
            "heating_allowed": self.heating_allowed,
            "in_season": self.in_season,
            "mean_past": self.mean_past,
            "mean_forecast": self.mean_forecast,
            "mean_combined": self.mean_combined,
            "heat_today_until": _iso(self.heat_today_until),
            "outdoor_temperature": self.outdoor_temp(),
            "frsi": self.frsi,
            "issues": self.insights.all_issues(),
            "sleep": self.sleep_summary(),
        }

    def sleep_summary(self) -> dict[str, Any]:
        now = dt_util.now()
        out: dict[str, Any] = {
            "asleep": self.signals.asleep if self.sleep_signals else None,
            "quiet_now": self.quiet_now(),
            "tonight": self.times_for(now),
        }
        for key, weekend in (("weekday", False), ("weekend", True)):
            sample = now
            while is_weekend_night(night_of(sample), self.holiday_state) != weekend:
                sample += timedelta(days=1)
            out[key] = {**self.sleep.learned(weekend).as_dict(), "effective": self.times_for(sample)}
        return out

    def diagnostics(self) -> dict[str, Any]:
        return {
            "config": self.config,
            **self.summary(),
            "season_state": {
                "heating": self.season.heating,
                "mild_since": _iso(self.season.mild_since),
                "cold_since": _iso(self.season.cold_since),
                "cold_snap": self.season.cold_snap,
            },
            "samples": len(self.samples),
            "decision_log": self.log.query(limit=300),
            "filters": {
                t: {
                    "accepted": [f.accepted.lat, f.accepted.lon, _iso(f.accepted.when)] if f.accepted else None,
                    "pending": bool(f.pending),
                }
                for t, f in self._filters.items()
            },
        }
