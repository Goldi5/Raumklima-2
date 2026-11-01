"""Zentrale „Allgemein“: Empfänger, Anwesenheit, Heizsaison – gilt für alle Räume.

Aufgeteilt in hub_presence (Anwesenheit), hub_sleep (Schlafenszeiten),
hub_season (Heizsaison) und hub_notify (Benachrichtigungen).
"""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CONF_BUILDING,
    CONF_CALENDAR,
    CONF_FROST_FLOOR,
    CONF_RESIDENTS,
    CONF_ZONE,
    DOMAIN,
    HUB_DEFAULTS,
    HUB_UNIQUE_ID,
)
from .decision_log import (
    CAT_SETTINGS,
    DecisionLog,
)
from .hub_notify import NotifyMixin
from .hub_presence import PresenceMixin
from .hub_season import SeasonMixin
from .hub_sleep import SleepMixin
from .insights import Insights
from .planning import (
    BUILDING_FRSI,
    STAGE_HOME,
    STAGE_PREHEAT,
    ForecastHour,
    SeasonState,
    TrackerFilter,
)
from .shared import domain_data, iso, parse_dt
from .sleep import SignalTracker, SleepLearner

if TYPE_CHECKING:
    from .controller import RaumklimaController

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1
PRESENCE_INTERVAL = timedelta(seconds=60)
SAMPLE_INTERVAL = timedelta(minutes=10)
FORECAST_INTERVAL = timedelta(minutes=30)


def _short(value: Any) -> str:
    text = str(value)
    return text if len(text) <= 40 else text[:37] + "…"


class RaumklimaHub(PresenceMixin, SleepMixin, SeasonMixin, NotifyMixin):
    """Einstellungen und Zustände, die für die ganze Wohnung gelten."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = {}
        self.load_config()
        self.is_default = entry.unique_id in (None, HUB_UNIQUE_ID)
        self.store_suffix = "" if self.is_default else f"_{entry.entry_id}"
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.hub{self.store_suffix}")
        self._listeners: list[Callable[[], None]] = []
        self._unsubs: list[Callable[[], None]] = []
        # Anwesenheit
        self.vacation = False
        self.guests = False
        self.last_present: datetime | None = None
        self.stage = STAGE_HOME
        self.persons: dict[str, dict[str, Any]] = {}
        self.sensed: list[str] = []  # Räume, in denen ein Präsenzmelder jemanden sieht
        self._filters: dict[str, TrackerFilter] = {}
        self._seen: dict[str, datetime] = {}
        self._history: dict[str, deque[tuple[datetime, float]]] = {}
        self._was_present: bool | None = None
        self._preheat_until: datetime | None = None
        self._preheat_by: str | None = None
        self._preheat_reason: str | None = None
        self.calendar_mode: str | None = None  # laufender Termin: away / home
        self.calendar_summary: str | None = None
        # Heizsaison
        self.season = SeasonState()
        self.decision = "heating"
        self.heat_today_until: datetime | None = None
        self.samples: list[tuple[datetime, float]] = []
        self.mean_past: float | None = None
        self.mean_forecast: float | None = None
        self.forecast_hourly: list[ForecastHour] = []
        self.insights = Insights(hass, self)
        self.log = DecisionLog(hass, self.store_suffix)
        self._reject_logged: dict[str, datetime] = {}
        # Kurze Gesamtausfälle aller Thermostate (Verbindung, nicht Geräte)
        self._blips: dict[str, datetime] = {}
        self.connection_blips: deque[tuple[datetime, float]] = deque(maxlen=500)
        self._blip_logged: datetime | None = None
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
        """Räume dieser Wohnung."""
        return {eid: r for eid, r in domain_data(self.hass)["rooms"].items() if r.hub is self}

    @property
    def name(self) -> str:
        return str(self.opt("name") or "") or ("Allgemein" if self.is_default else self.entry.title)

    @property
    def dashboard(self) -> str:
        if self.opt("dashboard"):
            return str(self.opt("dashboard")).strip("/")
        slug = "".join(c if c.isalnum() else "-" for c in self.name.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")).strip("-")
        return f"heizung-{slug}" if slug and slug != "allgemein" else "heizung"

    # ------------------------------------------------------------ Lebenszyklus
    async def async_start(self) -> None:
        await self.log.async_load()
        stored = await self._store.async_load() or {}
        self._loaded = True
        self.vacation = bool(stored.get("vacation", False))
        self.guests = bool(stored.get("guests", False))
        self.last_present = parse_dt(stored.get("last_present"))
        self.heat_today_until = parse_dt(stored.get("heat_today_until"))
        season = stored.get("season") or {}
        self.season = SeasonState(
            heating=season.get("heating"),
            mild_since=parse_dt(season.get("mild_since")),
            cold_since=parse_dt(season.get("cold_since")),
            cold_snap=bool(season.get("cold_snap", False)),
        )
        self.decision = stored.get("decision", self.decision)
        self.stage = stored.get("stage", self.stage)
        for when, temp in stored.get("samples", []):
            parsed = parse_dt(when)
            if parsed and temp is not None:
                self.samples.append((parsed, float(temp)))
        self.sleep.load(stored.get("sleep"))
        sig = stored.get("signals") or {}
        self.signals.asleep = bool(sig.get("asleep", False))
        self.signals.bed_at = parse_dt(sig.get("bed_at"))
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
        if self.opt(CONF_CALENDAR):
            tracked.append(self.opt(CONF_CALENDAR))
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
        if getattr(self, "_loaded", False):
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
            "last_present": iso(self.last_present),
            "heat_today_until": iso(self.heat_today_until),
            "stage": self.stage,
            "decision": self.decision,
            "season": {
                "heating": self.season.heating,
                "mild_since": iso(self.season.mild_since),
                "cold_since": iso(self.season.cold_since),
                "cold_snap": self.season.cold_snap,
            },
            "samples": [[iso(w), t] for w, t in self.samples if w >= cutoff],
            "sleep": self.sleep.dump(),
            "signals": {"asleep": self.signals.asleep, "bed_at": iso(self.signals.bed_at), "woke_night": self._woke_night},
        }

    def _save(self) -> None:
        if getattr(self, "_loaded", False):
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


    # ------------------------------------------------------------ Schlafenszeiten






















    # ------------------------------------------------------------ Heizsaison















    # ------------------------------------------------------------ Benachrichtigen






    # ------------------------------------------------------------ Anzeige
    def summary(self) -> dict[str, Any]:
        return {
            "stage": self.stage,
            "vacation": self.vacation,
            "guests": self.guests,
            "persons": self.persons,
            "sensed": self.sensed,
            "last_present": iso(self.last_present),
            "preheat_by": self._preheat_by if self.stage == STAGE_PREHEAT else None,
            "presence_configured": self.presence_configured,
            "calendar": {"mode": self.calendar_mode, "summary": self.calendar_summary} if self.opt(CONF_CALENDAR) else None,
            "decision": self.decision,
            "heating_allowed": self.heating_allowed,
            "in_season": self.in_season,
            "mean_past": self.mean_past,
            "mean_forecast": self.mean_forecast,
            "mean_combined": self.mean_combined,
            "heat_today_until": iso(self.heat_today_until),
            "outdoor_temperature": self.outdoor_temp(),
            "frsi": self.frsi,
            "issues": self.insights.all_issues(),
            "sleep": self.sleep_summary(),
        }


    def diagnostics(self) -> dict[str, Any]:
        return {
            "config": self.config,
            **self.summary(),
            "season_state": {
                "heating": self.season.heating,
                "mild_since": iso(self.season.mild_since),
                "cold_since": iso(self.season.cold_since),
                "cold_snap": self.season.cold_snap,
            },
            "samples": len(self.samples),
            "decision_log": self.log.query(limit=300),
            "filters": {
                t: {
                    "accepted": [f.accepted.lat, f.accepted.lon, iso(f.accepted.when)] if f.accepted else None,
                    "pending": bool(f.pending),
                }
                for t, f in self._filters.items()
            },
        }
