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
    STAGE_HOME,
    STAGE_PREHEAT,
    Fix,
    PresenceInput,
    SeasonConfig,
    SeasonState,
    TrackerFilter,
    approaching,
    combined_mean,
    haversine_km,
    in_season,
    presence_stage,
    season_allows_heating,
    season_decision,
    season_step,
)
from .insights import Insights
from .ventilation import in_quiet_hours

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
        # Heizsaison
        self.season = SeasonState()
        self.decision = "heating"
        self.heat_today_until: datetime | None = None
        self.samples: list[tuple[datetime, float]] = []
        self.mean_past: float | None = None
        self.mean_forecast: float | None = None
        self.insights = Insights(hass, self)

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
        self._unsubscribe()
        await self._store.async_save(self._stored())

    async def async_options_updated(self) -> None:
        """Einstellungen geändert: neu laden, ohne die Räume neu zu starten."""
        self.load_config()
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
            if not anyone and coming:
                self._preheat_until = now + PREHEAT_HOLD
                self._preheat_by = coming[0]["name"]
            if self._preheat_until and (now > self._preheat_until or not near):
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
            self._announce_season(old, new)
            self._save()
            self._changed()
        else:
            self._save()
            self._changed(rooms=False)

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
        self.heat_today_until = dt_util.utcnow() + HEAT_TODAY
        self._evaluate_season()

    def cancel_heat_today(self) -> None:
        self.heat_today_until = None
        self._evaluate_season()

    @callback
    def _on_valve_care(self, now: datetime) -> None:
        if dt_util.as_local(now).weekday() != 2 or not self.opt(CONF_VALVE_CARE):
            return
        if self.heating_allowed:
            return
        _LOGGER.info("Sommerpflege: Ventile werden kurz bewegt")
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
        return in_quiet_hours(
            now.hour, now.minute, str(self.opt("quiet_start")), str(self.opt("quiet_end"))
        )

    def notify(
        self,
        kind: str,
        title: str,
        message: str,
        data: dict[str, Any] | None = None,
        speak: bool = True,
    ) -> None:
        self.hass.async_create_task(self.async_notify(kind, title, message, data, speak))

    async def async_notify(
        self,
        kind: str,
        title: str,
        message: str,
        data: dict[str, Any] | None = None,
        speak: bool = True,
        only: str | None = None,
    ) -> None:
        """An alle Empfänger senden, die diese Nachrichtenart gewählt haben."""
        quiet = self.quiet_now()
        data = dict(data or {})
        if quiet and kind not in URGENT_KINDS:
            data["push"] = {"interruption-level": "passive"}
        elif kind in URGENT_KINDS:
            data.setdefault("push", {"interruption-level": "time-sensitive"})
        push = [only] if only else self.targets(kind)
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
        }

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
            "filters": {
                t: {
                    "accepted": [f.accepted.lat, f.accepted.lon, _iso(f.accepted.when)] if f.accepted else None,
                    "pending": bool(f.pending),
                }
                for t, f in self._filters.items()
            },
        }
