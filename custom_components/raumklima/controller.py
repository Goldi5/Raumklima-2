"""Kernlogik: ein Raum mit TRV, externem Fühler und Fensterkontakten.

Aufgeteilt in room_windows (Fensterlogik), room_trv (Thermostat ansteuern,
Offset, Schutz gegen Endlosschleifen) und room_health (Gesundheitscheck, Diagnose).
"""

from __future__ import annotations

import asyncio
from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.components.climate import HVACAction
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    Event,
    EventStateChangedData,
    HassJob,
    HomeAssistant,
    State,
    callback,
)
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .airing_profile import AiringProfile
from .const import (
    BOOST_MINUTES_MAX,
    BOOST_MINUTES_MIN,
    BOOST_TEMP_MAX,
    BOOST_TEMP_MIN,
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_INTERVAL,
    CONF_AIRING_OCCUPIED_ONLY,
    CONF_AIRING_WINDOWS,
    CONF_BOOST_MINUTES,
    CONF_BOOST_TEMP,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_CO2_SENSOR,
    CONF_COMFORT_TEMP,
    CONF_EXTRA_TRVS,
    CONF_FAST_POLL,
    CONF_FOLLOW_TRV,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_LEARN_AIRING,
    CONF_LIGHT_SIGNALS,
    CONF_LIGHTS,
    CONF_LONG_AIRING,
    CONF_LONG_AIRING_REMIND,
    CONF_NAME,
    CONF_NIGHT_AIRING,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_ON_PRESET,
    CONF_OVERRIDE_MINUTES,
    CONF_PM25_SENSOR,
    CONF_PRESENCE,
    CONF_PRESENCE_KIND,
    CONF_PRESENCE_OFF,
    CONF_QUIET_SETBACK,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_TYPE,
    CONF_SCHEDULE_FROM,
    CONF_SCHEDULES,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_VIRTUAL_WINDOW,
    CONF_WEATHER,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WINDOWS,
    DEFAULTS,
    DOMAIN,
    EVENT_RAUMKLIMA,
    MAX_SENSOR_JUMP,
    OFF_HVAC,
    OFF_MIN_TEMP,
    OFF_PRESET,
    OFF_SOURCE_TRV,
    OFF_SOURCE_USER,
    PREHEAT_MARGIN_MINUTES,
    RECONCILE_INTERVAL,
    SENSOR_JUMP_WINDOW,
    SLOW_RETRY_INTERVAL,
    STATUS_HEATING,
    STATUS_IDLE,
    STATUS_MONITOR,
    STATUS_NIGHT,
    STATUS_OFF,
    STATUS_OFF_TRV,
    STATUS_SEASON,
    STATUS_SENSOR,
    STATUS_SETBACK,
    STATUS_TRV,
    STATUS_WINDOW,
    VALVE_HEATING_MIN,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_MANUAL,
    CAT_NOTIFY,
    CAT_SETTINGS,
    CAT_TARGET,
    fmt_temp,
)
from .health import (
    HistoryPoint,
)
from .heatup import HeatupTracker
from .hub import RaumklimaHub, _change_text
from .logic import (
    any_open,
    clamp,
    heating_demand,
    is_valid,
    plausible_reading,
    to_float,
    values_match,
    window_open_state,
)
from .msg import tr
from .occupancy import room_eco_target
from .planning import (
    AWAY_STAGES,
    NIGHT_ROOM_TYPES,
    SOLAR_REDUCTION,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    frost_night_setback,
    mold_safe_min_temp,
    next_schedule_window,
    schedule_target,
    setback_defaults,
    setback_target,
)
from .room_extra_trvs import ExtraTrv
from .room_health import HealthMixin
from .room_lights import LightSignal
from .room_presence import PresenceMixin
from .room_trv import HEAT_PRESETS, MANUAL_OVERRIDE, TrvMixin
from .room_windows import WindowMixin
from .shared import domain_data, get_hub, iso, parse_dt
from .sync import SyncManager
from .usage_profile import UsageProfile
from .vent_manager import VentilationManager
from .ventilation import MIN_USEFUL_TARGET, comfort_temperature

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1
VALVE_CARE = timedelta(minutes=3)

TRV_OUTAGE_SECONDS = 60  # kürzere Aussetzer gelten nicht als Ausfall
REASON_NORMAL = "normal"
REASON_MONITOR = "monitor"
REASON_MANUAL = "manual"
REASON_SEASON = "season"
REASON_FROST = "frost"
REASON_VALVE_CARE = "valve_care"
REASON_SOLAR = "solar"
REASON_EMPTY = "room_empty"
REASON_SCHEDULE = "schedule"
REASON_BOOST = "boost"
REASON_SCHEDULE_PREHEAT = "schedule_preheat"
REASON_SLEEP = "sleep"
# Diese Einstellungen wirken sofort, ohne den Raum neu zu laden
LIVE_OPTIONS = frozenset(
    {
        CONF_COMFORT_TEMP,
        CONF_SETBACK_SHORT,
        CONF_SETBACK_LONG,
        CONF_WINDOW_OPEN_DELAY,
        CONF_WINDOW_CLOSE_DELAY,
        CONF_NIGHT_AIRING,
        CONF_VIRTUAL_WINDOW,
        CONF_HOME,
        CONF_SOLAR,
        CONF_SOLAR_FACADE,
        CONF_LIGHTS,
        CONF_LIGHT_SIGNALS,
        CONF_PRESENCE,
        CONF_PRESENCE_KIND,
        CONF_ROOM_ECO,
        CONF_ROOM_ECO_AFTER,
        CONF_ROOM_ECO_DROP,
        CONF_SCHEDULES,
        CONF_BOOST_TEMP,
        CONF_BOOST_MINUTES,
        CONF_OVERRIDE_MINUTES,
        CONF_AIRING_OCCUPIED_ONLY,
        CONF_FAST_POLL,
        CONF_LONG_AIRING,
        CONF_LONG_AIRING_REMIND,
        CONF_AIRING_WINDOWS,
        CONF_LEARN_AIRING,
    }
)


class RaumklimaController(WindowMixin, TrvMixin, HealthMixin, PresenceMixin):
    """Steuert genau einen Raum."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = {**DEFAULTS, **entry.data, **entry.options}
        self.name: str = self.config[CONF_NAME]
        # Leeres Thermostat = Überwachungsraum (nur Sensoren, keine Heizung)
        self.trv: str = str(self.config.get(CONF_TRV) or "")
        self.monitor: bool = not self.trv
        self.temp_sensor: str = self.config[CONF_TEMP_SENSOR]
        self.humidity_sensor: str | None = self.config.get(CONF_HUMIDITY_SENSOR)
        self.co2_sensor: str | None = self.config.get(CONF_CO2_SENSOR) or None
        self.pm25_sensor: str | None = self.config.get(CONF_PM25_SENSOR) or None
        self.windows: list[str] = list(self.config.get(CONF_WINDOWS) or [])
        self._extra_ids: list[str] = [
            e for e in (self.config.get(CONF_EXTRA_TRVS) or []) if e and e != self.trv
        ]
        self.cal_mode: str = self.config[CONF_CALIBRATION_MODE]
        # Geglättete Abweichung „Thermostat misst − Raumfühler misst“.
        # Wird gelernt und bleibt erhalten, auch wenn der Fühler lange nicht meldet (Livisi/HMIP).
        self.shift: float = 0.0
        self.cal_entity: str | None = self.config.get(CONF_CALIBRATION_ENTITY)
        if self.cal_mode == CAL_OFFSET and not self.cal_entity:
            _LOGGER.warning(
                "%s: Kalibrierart Offset ohne Kalibrier-Entität – nutze 'target'",
                self.name,
            )
            self.cal_mode = CAL_TARGET

        # Dauerhafter Zustand (Store)
        self.target_temp: float = 20.0
        self.hvac_on: bool = True
        # Warum der Raum aus ist (None = an): OFF_SOURCE_USER / OFF_SOURCE_TRV
        self.off_source: str | None = None
        # Boost: zeitlich begrenzt wärmer (None = kein Boost)
        self.boost_until: datetime | None = None
        self.boost_temperature: float | None = None
        self.window_logic: bool = True
        self.trv_on_preset: str | None = None

        # Laufzeit
        self.window_paused = False
        self._window_raw = False
        self.night_since: datetime | None = None  # Schlafen bei offenem Fenster seit
        self._last_valid_windows: dict[str, str | None] = {}
        self._window_timer: Callable[[], None] | None = None
        self._ext_value: float | None = None
        self._ext_time: datetime | None = None
        self._ext_candidate: float | None = None
        self._last_cal_send: datetime | None = None
        self._last_cal_value: float | None = None
        self._last_target_setpoint: float | None = None
        self._preset_changed_at: datetime | None = None
        self._unsubs: list[Callable[[], None]] = []
        self._listeners: list[Callable[[], None]] = []
        self._apply_lock = asyncio.Lock()
        self.valve_sensor: str | None = None
        self._valve_hunt_until: datetime | None = None  # Zeitfenster für die Nachsuche
        self._valve_last_try: datetime | None = None
        self._frost_active = False
        self._solar_active = False
        self.frost_night_low: float | None = None
        self._manual_until: datetime | None = None
        self._valve_care_until: datetime | None = None
        self._started = False
        # Gesundheitscheck
        self.health_hist: deque[HistoryPoint] = deque(maxlen=150)
        self._unavail_events: deque[datetime] = deque(maxlen=50)
        self._ext_changed_at: datetime | None = None
        self._trv_at_ext_change: float | None = None
        self._window_unavail_since: dict[str, datetime] = {}
        # Fenster ohne Kontakt (Temperatursturz)
        self._temp_hist: deque[tuple[datetime, float]] = deque(maxlen=40)
        self.virtual_open_at: datetime | None = None
        self._raw_virtual = False
        self._trv_down_since: datetime | None = None
        self._started_at: datetime = dt_util.utcnow()
        # Schutz gegen Endlosschleifen mit dem Thermostat
        self.preset_learned: str | None = None
        self._preset_flips: deque[tuple[datetime, str]] = deque(maxlen=20)
        self._restore_paused_until: datetime | None = None
        self._sends: deque[datetime] = deque(maxlen=200)
        self.throttled_until: datetime | None = None
        self._trv_down_cancel: Callable[[], None] | None = None
        self.heatup = HeatupTracker()
        self.airing = AiringProfile()
        self.usage = UsageProfile()
        self._virtual_low: float = 0.0
        self._virtual_cancel: Callable[[], None] | None = None
        self._batteries: dict[str, str] = {}
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}"
        )

        self.vent = VentilationManager(self, None)
        self.lights = LightSignal(self)
        self.extra_trvs = [ExtraTrv(self, e) for e in self._extra_ids]
        self.sync = SyncManager(
            schedule=self._schedule,
            run_task=lambda coro: hass.async_create_task(coro),
            is_target_available=self.trv_available,
            verify_delay=float(self.config[CONF_SYNC_VERIFY_DELAY]),
            max_retries=int(self.config[CONF_SYNC_MAX_RETRIES]),
            slow_interval=SLOW_RETRY_INTERVAL,
            device_interval=lambda: self.trv_report_interval,
            on_change=self._notify,
            on_failed=self._on_sync_failed,
            on_recovered=self._on_sync_recovered,
            on_event=self._on_sync_event,
        )
        self._last_plan: tuple[bool, float, str] | None = None
        self._peeking = False  # plan() nur lesen, keine Zustände verbrauchen
        self._trv_reports: deque[datetime] = deque(maxlen=6)

    # ================================================================ Lifecycle
    async def async_start(self) -> None:
        """Gespeicherten Zustand laden, Listener registrieren, abgleichen."""
        stored = await self._store.async_load()
        if stored:
            self.target_temp = float(stored.get("target_temp", self.target_temp))
            self.hvac_on = bool(stored.get("hvac_on", self.hvac_on))
            self.off_source = stored.get("off_source") or (None if self.hvac_on else OFF_SOURCE_USER)
            self.boost_until = parse_dt(stored.get("boost_until"))
            self.boost_temperature = stored.get("boost_temperature")
            self.window_logic = bool(stored.get("window_logic", self.window_logic))
            self.trv_on_preset = stored.get("trv_on_preset")
            self.preset_learned = stored.get("preset_learned")
            if stored.get("shift") is not None:
                self.shift = float(stored.get("shift") or 0.0)
            self.heatup.load(stored.get("heatup"))
            self.airing.load(stored.get("airing_profile"))
            self.usage.load(stored.get("usage_profile"))
        elif self.trv_available():
            # Erster Start: Wunschtemperatur statt Zufallswert am TRV (Eco-Speicher, 5 °C …)
            self.target_temp = self.comfort_temp
            self.hvac_on = not self._is_trv_off(self._trv_state(), self._off_method())
            self.off_source = None if self.hvac_on else OFF_SOURCE_TRV
            preset = self._trv_attr("preset_mode")
            if preset and preset != "off":
                self.trv_on_preset = preset
            self._save()

        self.vent.load((stored or {}).get("vent"))
        self.valve_sensor = self._find_valve_sensor()
        for extra in self.extra_trvs:
            extra.discover()
        self._batteries = self._find_batteries()

        tracked = [self.trv, self.temp_sensor, *self.windows, *(e for x in self.extra_trvs for e in x.tracked())]
        if self.humidity_sensor:
            tracked.append(self.humidity_sensor)
        if self.co2_sensor:
            tracked.append(self.co2_sensor)
        if self.pm25_sensor:
            tracked.append(self.pm25_sensor)
        if self.config.get(CONF_WEATHER):
            tracked.append(self.config[CONF_WEATHER])
        if self.valve_sensor:
            tracked.append(self.valve_sensor)
        if self.cal_entity:
            tracked.append(self.cal_entity)
        self._unsubs.append(
            async_track_state_change_event(self.hass, tracked, self._on_state_change)
        )
        self._unsubs.append(
            async_track_time_interval(
                self.hass, self._on_reconcile, timedelta(seconds=RECONCILE_INTERVAL)
            )
        )
        self._unsubs.append(
            async_track_time_interval(
                self.hass, self._on_cal_interval, timedelta(seconds=CALIBRATION_INTERVAL)
            )
        )
        # Träge Geräte (Homematic & Co.) melden Ventilstellungen erst spät – optional nachfragen.
        self._unsubs.append(
            async_track_time_interval(self.hass, self._on_fast_poll, timedelta(seconds=120))
        )

        # Startzustand: Fenster ohne Verzögerung übernehmen
        for entity in self.windows:
            state = self.hass.states.get(entity)
            if state and is_valid(state.state):
                self._last_valid_windows[entity] = window_open_state(entity, state)
        self._window_raw = any_open(self._last_valid_windows, self.windows)
        self.window_paused = self._window_raw
        if self._window_raw and self.night_applies():
            self.night_since = dt_util.utcnow()
        self._ingest_sensor(self.hass.states.get(self.temp_sensor))
        await self.vent.async_start()
        self.track_presence()
        self.update_presence(initial=True)

        domain_data(self.hass)["rooms"][self.entry.entry_id] = self
        self._started = True
        self.hass.async_create_task(self._apply())
        self.hass.async_create_task(self.async_calibrate())

    async def async_stop(self) -> None:
        """Alles abmelden."""
        self._started = False
        domain_data(self.hass)["rooms"].pop(self.entry.entry_id, None)
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        for attr in ("_window_timer", "_trv_down_cancel", "_virtual_cancel"):
            cancel = getattr(self, attr)
            if cancel:
                cancel()
                setattr(self, attr, None)
        self.sync.cancel_all()
        self.lights.stop()
        for extra in self.extra_trvs:
            extra.stop()
        self.stop_presence()
        if self.vent:
            self.vent.async_stop()
        await self._store.async_save(self._stored_data())

    def _stored_data(self) -> dict[str, Any]:
        return {
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "off_source": self.off_source,
            "boost_until": iso(self.boost_until),
            "boost_temperature": self.boost_temperature,
            "window_logic": self.window_logic,
            "trv_on_preset": self.trv_on_preset,
            "preset_learned": self.preset_learned,
            "shift": self.shift,
            "vent": self.vent.export() if self.vent else None,
            "heatup": self.heatup.dump(),
            "airing_profile": self.airing.export(),
            "usage_profile": self.usage.export(),
        }

    # ---------------------------------------------------------------- Gewohntes Lüften
    def record_airing(self, when: datetime, minutes: float) -> None:
        """Einen abgeschlossenen Lüftvorgang für das Lernen merken."""
        self.airing.record(dt_util.as_local(when), minutes)
        self._save()

    @callback
    def record_usage(self) -> None:
        """Belegung für das Nutzungsprofil festhalten (nur mit Präsenzmelder)."""
        if not self.presence_sensors:
            return
        if self.usage.mark(dt_util.now(), self.occupied is True):
            self._save()

    @property
    def usage_summary(self) -> dict[str, Any]:
        return self.usage.summary() if self.presence_sensors else {}

    def airing_learned(self, when: datetime) -> bool:
        return self.airing.learned(when)

    def airing_count(self, when: datetime) -> int:
        return self.airing.count(when)

    def _save(self) -> None:
        self._store.async_delay_save(self._stored_data, 5)

    def save(self) -> None:
        """Öffentlich: Zustand speichern (z. B. vom Lüftungsassistenten)."""
        self._save()

    @callback
    def notify_listeners(self) -> None:
        self._notify()

    @callback
    def settings_summary(self) -> dict[str, Any]:
        """Was eingestellt ist – für die Einstellungs-Karte."""
        cfg = self.config
        vent = self.vent
        hub = self.hub
        entry = self.hass.config_entries.async_get_entry(self.entry.entry_id) or self.entry
        own = {**(entry.data or {}), **(entry.options or {})}
        # Struktur (Raumtyp, erkannte Abgleichart) ist keine Einstellung – nicht mitzählen.
        skip = {CONF_ROOM_TYPE, CONF_CALIBRATION_MODE}
        changed = sorted(k for k, v in DEFAULTS.items() if k in own and own.get(k) != v and k not in skip)
        for key in (CONF_SCHEDULES, CONF_PRESENCE, CONF_LIGHTS, CONF_SOLAR_FACADE):
            if own.get(key):
                changed.append(key)
        return {
            "entry_id": self.entry.entry_id,
            "changed": changed,
            "trv": self.trv,
            "room_type": vent.room_type if vent else cfg.get(CONF_ROOM_TYPE),
            "weather_entity": vent.weather if vent else cfg.get(CONF_WEATHER),
            "notify_targets": vent.notify_targets if vent else [],
            "tts_targets": vent.tts_targets if vent else [],
            "quiet_start": vent.quiet_start if vent else None,
            "quiet_end": vent.quiet_end if vent else None,
            "repeat_minutes": vent.repeat_minutes if vent else None,
            "max_drop": vent.max_drop if vent else None,
            "hub": bool(hub),
            "comfort_temperature": cfg.get(CONF_COMFORT_TEMP),
            "setback_short": self.setback_short,
            "setback_long": self.setback_long,
            "night_airing": self.night_mode,
            "virtual_window": self.virtual_mode,
            "solar_gain": bool(self.config.get(CONF_SOLAR)),
            "solar_facade": self.config.get(CONF_SOLAR_FACADE) or "",
            "schedules": self.schedules,
            "schedule_from": self.config.get(CONF_SCHEDULE_FROM) or "",
            "boost_temperature": cfg.get(CONF_BOOST_TEMP),
            "boost_minutes": cfg.get(CONF_BOOST_MINUTES),
            "presence_sensors": self.sensor_kinds(),
            "presence_kind": self.config.get(CONF_PRESENCE_KIND) or "auto",
            "room_eco": self.room_eco_mode,
            "room_eco_enabled": self.room_eco_enabled(),
            "room_eco_after": self.room_eco_after,
            "room_eco_drop": self.room_eco_drop,
            "extra_trvs": [x.summary() for x in self.extra_trvs],
            "signal_lights": self.lights.lights,
            "light_signals": self.lights.signals,
            "virtual_active": self.virtual_enabled(),
            "heatup": {
                "episodes": len(self.heatup.episodes),
                "rate": self.heatup.rate(self.hub.outdoor_temp() if self.hub else None),
                "minutes_2k": self.heatup.minutes_needed(2.0, self.hub.outdoor_temp() if self.hub else None),
            },
            "humidity_sensor": cfg.get(CONF_HUMIDITY_SENSOR),
            "co2_sensor": self.co2_sensor,
            "pm25_sensor": self.pm25_sensor,
            "temperature_sensor": cfg.get(CONF_TEMP_SENSOR),
            "windows": self.windows,
            "comfort_configured": cfg.get(CONF_COMFORT_TEMP) not in (None, "", 0),
            "window_open_delay": cfg.get(CONF_WINDOW_OPEN_DELAY),
            "window_close_delay": cfg.get(CONF_WINDOW_CLOSE_DELAY),
            "calibration_mode": cfg.get(CONF_CALIBRATION_MODE),
            "calibration_entity": cfg.get(CONF_CALIBRATION_ENTITY),
            "on_preset": cfg.get(CONF_ON_PRESET),
            "off_method": cfg.get(CONF_OFF_METHOD),
            "follow_trv": cfg.get(CONF_FOLLOW_TRV),
            "notify_on_failure": cfg.get(CONF_NOTIFY),
            "sensor_stale_minutes": cfg.get(CONF_SENSOR_STALE_MINUTES),
            "sync_verify_delay": cfg.get(CONF_SYNC_VERIFY_DELAY),
            "sync_max_retries": cfg.get(CONF_SYNC_MAX_RETRIES),
        }

    def apply_live_options(self, changes: dict[str, Any]) -> bool:
        """Einstellungen aus der Karte übernehmen, ohne den Raum neu zu laden.

        False, wenn eine Änderung einen Neustart braucht (z. B. Raumtyp mit eigenen Standardwerten).
        """
        if not self._started or not set(changes) <= LIVE_OPTIONS:
            return False
        changed = {k: v for k, v in changes.items() if self.config.get(k) != v}
        if not changed:
            return True
        old_hub = self.hub
        old_values = {k: self.config.get(k) for k in changed}
        # self.config ist dasselbe Objekt, das auch der Lüftungsassistent nutzt
        self.config.update(changed)
        self.log(
            CAT_SETTINGS,
            tr("Einstellungen geändert"),
            ", ".join(_change_text(k, old_values[k], v) for k, v in changed.items()),
        )
        # Wunschtemperatur aus den Einstellungen muss den laufenden Sollwert nachziehen –
        # sonst heizt der Raum weiter auf den alten Wert, bis er neu geladen wird (Issue #22).
        if changed.keys() & {CONF_COMFORT_TEMP, CONF_ROOM_TYPE}:
            new_wish = self.comfort_temp
            if new_wish != self.target_temp:
                self.target_temp = new_wish
                self.log(
                    CAT_SETTINGS,
                    tr("Wunschtemperatur übernommen"),
                    tr("neuer Sollwert {t} °C aus den Einstellungen", t=fmt_temp(new_wish)),
                )
        if changed.keys() & {CONF_PRESENCE, CONF_PRESENCE_KIND, CONF_ROOM_ECO, CONF_ROOM_ECO_AFTER, CONF_ROOM_ECO_DROP}:
            self.track_presence()
            self.update_presence()
        if self.virtual_open_at is not None and not self.virtual_enabled():
            self._close_virtual("off")
        new_hub = self.hub
        if new_hub is not old_hub:
            for hub in (old_hub, new_hub):
                if hub is not None:
                    hub.notify_entities()
        self._notify()
        self.hass.async_create_task(self._apply())
        return True

    @staticmethod
    def _fmt_opt(value: Any) -> str:
        if value is None or value == "":
            return tr("Standard")
        if isinstance(value, float):
            return fmt_temp(value) if value < 40 else f"{value:.0f}"
        return str(value)

    def fire_event(self, kind: str, data: dict[str, Any]) -> None:
        """Ereignis für eigene Automationen (raumklima_event)."""
        self.hass.bus.async_fire(
            EVENT_RAUMKLIMA,
            {"type": kind, "room": self.name, "entry_id": self.entry.entry_id, **data},
        )
        self.lights.on_event(kind, data)
        field = {"please_open": "vent_open_n", "done": "vent_done_n", "please_close": "vent_close_n", "too_cold": "vent_cold_n"}.get(data.get("state")) if kind == "ventilation" else None
        hub = self.hub
        if field and hub is not None:
            hub.insights.count(self.entry.entry_id, field)

    def log_light(self, what: str, lights: list[str]) -> None:
        names = []
        for entity_id in lights:
            st = self.hass.states.get(entity_id)
            names.append(st.name if st else entity_id)
        self.log(CAT_NOTIFY, tr("Lichtsignal: {what}", what=tr(what)), ", ".join(names))




    # ================================================================ Listener
    @callback
    def async_add_listener(self, update: Callable[[], None]) -> Callable[[], None]:
        """Entitäten melden sich hier für Updates an."""
        self._listeners.append(update)

        @callback
        def remove() -> None:
            self._listeners.remove(update)

        return remove

    @callback
    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

    @callback
    def _schedule(self, delay: float, action: Callable[[], Any]) -> Callable[[], None]:
        job = HassJob(callback(lambda _now: action()), cancel_on_shutdown=True)
        return async_call_later(self.hass, delay, job)







    def _update_shift(self) -> None:
        """Abweichung zwischen Thermostat- und Raumfühler nachführen und dauerhaft merken.

        Die Livisi/HMIP-Thermostate regeln auf ihren eigenen Fühler. Liegt der um 1,2 K unter dem
        Raumfühler, muss der Sollwert um 1,2 K tiefer gesetzt werden – sonst heizt der Raum über.
        Früher wurde das nur im Moment einer Messung gerechnet; meldet der Fühler danach lange nicht
        (Batteriegeräte), blieb der unkompensierte Wert stehen.
        """
        ext = self._ext_value
        trv = self.trv_temperature
        if ext is None or trv is None:
            return
        diff = trv - ext
        if abs(diff) > 6.0:  # unplausibel (Fühler defekt, Fenster offen) – nicht übernehmen
            return
        diff = max(-4.0, min(4.0, diff))
        # Beim ersten Mal direkt übernehmen, danach sanft nachführen.
        new = round(diff if self.shift == 0.0 else self.shift * 0.7 + diff * 0.3, 2)
        if abs(new - self.shift) < 0.05:
            return
        self.shift = new
        self._save()

    @property
    def sensor_ok(self) -> bool:
        """Externer Fühler liefert einen brauchbaren Wert.

        Das Alter allein zählt nicht: batteriebetriebene Fühler (Homematic, Danfoss) senden nur bei
        Änderung. Ein drei Stunden alter Wert ist bei stabiler Temperatur weiterhin gültig – vorher
        meldete der Raum „Fühler ausgefallen", obwohl das Gerät erreichbar war (Issue #11).
        Ein echter Ausfall zeigt sich am Entitätszustand (unavailable/unknown/kein Wert).
        """
        state = self.hass.states.get(self.temp_sensor)
        if state is None or not is_valid(state.state):
            return False
        # Ein gültiger Zustand genügt: der gemerkte Wert kann fehlen, wenn der Fühler beim Start
        # der Zentrale noch nicht bereit war (Tuya ZTH01 meldet erst Minuten später) – Issue #10.
        return self._ext_value is not None or to_float(state.state) is not None

    @property
    def sensor_age_minutes(self) -> float | None:
        """Minuten seit der letzten Meldung des Fühlers (nur für Diagnose/Protokoll)."""
        state = self.hass.states.get(self.temp_sensor)
        if state is None:
            return None
        last = getattr(state, "last_reported", None) or state.last_updated
        return (dt_util.utcnow() - last).total_seconds() / 60





    def log(self, cat: str, msg: str, why: str | None = None, level: str = "info", **data: Any) -> None:
        """Ins Entscheidungsprotokoll schreiben (falls die Zentrale läuft)."""
        hub = self.hub
        if hub is not None:
            hub.log.add(cat, msg, why, room=self.name, entry_id=self.entry.entry_id, level=level, **data)



    @property
    def current_temperature(self) -> float | None:
        """Raumtemperatur: externer Fühler, im Notfall das TRV."""
        if self.sensor_ok:
            if self._ext_value is not None:
                return self._ext_value
            state = self.hass.states.get(self.temp_sensor)
            return to_float(state.state) if state is not None else None
        return self.trv_temperature

    @property
    def current_humidity(self) -> float | None:
        if not self.humidity_sensor:
            return None
        state = self.hass.states.get(self.humidity_sensor)
        return to_float(state.state) if state else None

    @property
    def current_pm25(self) -> float | None:
        if not self.pm25_sensor:
            return None
        state = self.hass.states.get(self.pm25_sensor)
        return to_float(state.state) if state else None

    @property
    def current_co2(self) -> float | None:
        if not self.co2_sensor:
            return None
        state = self.hass.states.get(self.co2_sensor)
        return to_float(state.state) if state else None

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
    def offset(self) -> float | None:
        if not self.cal_entity:
            return None
        state = self.hass.states.get(self.cal_entity)
        return to_float(state.state) if state else None

    # ================================================================ Planung
    @property
    def hub(self) -> RaumklimaHub | None:
        return get_hub(self.hass, self.config.get(CONF_HOME))

    @property
    def manual_until(self) -> datetime | None:
        """Bis wann eine Handverstellung gilt (Abwesenheit oder pausierter Zeitplan)."""
        if self._manual_until is None:
            return None
        return self._manual_until if self._manual_until > dt_util.utcnow() else None

    @property
    def override_minutes(self) -> float:
        """So lange pausiert ein Zeitplan, wenn jemand von Hand die Temperatur stellt (0 = aus)."""
        value = to_float(self.config.get(CONF_OVERRIDE_MINUTES))
        return value if value is not None else 120.0

    @property
    def setback_short(self) -> float:
        value = to_float(self.config.get(CONF_SETBACK_SHORT))
        return value if value is not None else setback_defaults(self.config.get(CONF_ROOM_TYPE))[0]

    @property
    def setback_long(self) -> float:
        value = to_float(self.config.get(CONF_SETBACK_LONG))
        return value if value is not None else setback_defaults(self.config.get(CONF_ROOM_TYPE))[1]

    def plan(self) -> tuple[bool, float, str]:
        """(heizen?, Zieltemperatur, Grund) aus Heizsaison, Anwesenheit und Wunsch."""
        if self.monitor:
            return False, self.target_temp, REASON_MONITOR
        now = dt_util.utcnow()
        if self._valve_care_until and now < self._valve_care_until:
            return True, self.trv_max, REASON_VALVE_CARE
        hub = self.hub
        if hub is None:
            return True, self.target_temp, REASON_NORMAL
        if not hub.heating_allowed:
            floor = hub.frost_floor
            cur = self.current_temperature
            if self._frost_active and (cur is None or cur >= floor + 1):
                if not self._peeking:
                    self._frost_active = False
            elif not self._frost_active and cur is not None and cur < floor:
                self._frost_active = True
            if self._frost_active:
                return True, min(floor + 1, self.trv_max), REASON_FROST
            return False, self.target_temp, REASON_SEASON
        self._frost_active = False
        # Boost: bewusste Nutzeraktion – schlägt die Absenkung bei Abwesenheit
        if self.boost_until is not None:
            if now < self.boost_until:
                boost = self.boost_temperature if self.boost_temperature is not None else self.target_temp
                return True, min(boost, self.trv_max), REASON_BOOST
            self.boost_until = None
            self.boost_temperature = None
            self._save()
        stage = hub.stage_for_room(self.entry.entry_id) if hasattr(hub, "stage_for_room") else hub.stage
        if stage in AWAY_STAGES:
            if self._manual_until and now < self._manual_until:
                return True, self.target_temp, REASON_MANUAL
            mold = None
            if self.humidity_sensor:
                mold = mold_safe_min_temp(
                    self.current_temperature, self.current_humidity, hub.outdoor_temp(), hub.frsi
                )
            target = setback_target(
                self.target_temp, stage, self.setback_short, self.setback_long, mold
            )
            frost = hub.frost_night
            self.frost_night_low = frost if target < self.target_temp else None
            if frost is not None and target < self.target_temp:
                target = min(self.target_temp, max(target, frost_night_setback(target, self.target_temp)))
            if target < self.target_temp:
                return True, target, stage
            # Nichts zu senken (Wunsch liegt schon auf dem Absenkwert, z. B. Sportzimmer 18,0 °C):
            # trotzdem als „abgesenkt" melden – außer ein Zeitplanfenster gilt gerade.
            if schedule_target(self.schedules, dt_util.now()) is None:
                return True, target, stage
        manual_until = self._manual_until
        if not self._peeking:
            # Nur *abgelaufene* Handverstellungen verwerfen – eine laufende muss bleiben,
            # sonst wäre sie nach dem ersten plan()-Aufruf schon weg (Zeitplan-Pause).
            if manual_until is not None and manual_until <= now:
                manual_until = None
                self._manual_until = None
                self._save()
            self.frost_night_low = None
        # Zeitplan: eigener Wunsch für dieses Fenster, schlägt Leer-Absenkung und Sonne
        local_now = dt_util.now()
        sched = schedule_target(self.schedules, local_now)
        if sched is not None:
            if manual_until and now < manual_until and not values_match(self.target_temp, sched, 0.05):
                # Von Hand gestellt: der Zeitplan pausiert bis override_minutes abgelaufen sind
                return True, min(self.target_temp, self.trv_max), REASON_MANUAL
            return True, min(sched, self.trv_max), REASON_SCHEDULE
        # Ruhezeit: Schlafräume werden abgesenkt, auch wenn jemand zu Hause ist – nach einer
        # Nachtschicht wird tagsüber geschlafen. Der Regler am Thermostat gilt weiter.
        if (
            hub.opt(CONF_QUIET_SETBACK)
            and hub.quiet_now()
            and self.config.get(CONF_ROOM_TYPE) in NIGHT_ROOM_TYPES
        ):
            if manual_until and now < manual_until:
                return True, self.target_temp, REASON_MANUAL
            return True, self.setback_long, REASON_SLEEP
        # Vorheizen auf das nächste Zeitfenster – nur mit gelernter Aufheizzeit
        nxt = next_schedule_window(self.config.get(CONF_SCHEDULES), local_now)
        cur = self.current_temperature
        if nxt is not None and cur is not None:
            start, want = nxt
            need = self.heatup.minutes_needed(want - cur, hub.outdoor_temp())
            if need is not None and local_now + timedelta(minutes=need + PREHEAT_MARGIN_MINUTES) >= start:
                return True, min(want, self.trv_max), REASON_SCHEDULE_PREHEAT
        # „Anwesenheit aus": auch der leere Raum senkt nicht ab (Issue #10)
        if self.room_eco_applies() and not hub.opt(CONF_PRESENCE_OFF):
            floor = self.setback_short
            if self.humidity_sensor:
                mold = mold_safe_min_temp(self.current_temperature, self.current_humidity, hub.outdoor_temp(), hub.frsi)
                if mold is not None:
                    floor = max(floor, mold)
            target = room_eco_target(self.target_temp, self.room_eco_drop, floor)
            if target < self.target_temp:
                return True, target, REASON_EMPTY
        if self._solar_applies(hub):
            return True, self.target_temp - SOLAR_REDUCTION, REASON_SOLAR
        return True, self.target_temp, REASON_NORMAL

    def _solar_applies(self, hub: RaumklimaHub) -> bool:
        """Sonnen-Raum: bei erwarteter Sonne 1 °C weniger – einmal an, bis die Sonne weg ist (keine Schwingung)."""
        if not self.config.get(CONF_SOLAR) or not hub.sun_expected(self.config.get(CONF_SOLAR_FACADE)):
            self._solar_active = False
            return False
        if not self._solar_active:
            cur = self.current_temperature
            self._solar_active = cur is not None and cur >= self.target_temp - 0.5
        return self._solar_active

    @property
    def effective_target(self) -> float:
        return self.plan()[1]

    @callback
    def on_hub_change(self) -> None:
        """Zentrale hat sich geändert (Anwesenheit, Heizsaison, Einstellungen)."""
        if not self._started:
            return
        self._notify()
        self.hass.async_create_task(self._apply())

    async def async_valve_care(self) -> None:
        """Sommerpflege: Ventil kurz ganz öffnen, damit es nicht festsitzt."""
        if not self.trv_available() or not self.hvac_on:
            return
        self._valve_care_until = dt_util.utcnow() + VALVE_CARE
        await self._apply()

        @callback
        def _done() -> None:
            self._valve_care_until = None
            self.hass.async_create_task(self._apply())

        self._schedule(VALVE_CARE.total_seconds() + 1, _done)

    @property
    def hvac_action(self) -> HVACAction:
        if not self.hvac_on or self.paused or not self.plan()[0]:
            return HVACAction.OFF
        action = self._trv_attr("hvac_action")
        if action == HVACAction.HEATING or self._trv_attr("running_state") == "heat":
            return HVACAction.HEATING
        # Manche Geräte (z. B. Homematic IP) lassen hvac_action auf "idle", obwohl das Ventil regelt.
        # Dann entscheidet die Ventilstellung – zusammen mit Soll/Ist, damit "offen, aber Ziel erreicht"
        # nicht als Heizen gilt.
        valve = self._trv_attr("valve_position")
        try:
            valve_open = valve is not None and float(valve) >= VALVE_HEATING_MIN
        except (TypeError, ValueError):
            valve_open = False
        if valve is None and action is None and self._trv_attr("running_state") is None:
            # Geräte ohne jeden Heiz-Signalwert (Aqara E1, HmIP-WTH): aus der Nachfrage ableiten.
            return HVACAction.HEATING if heating_demand(self.current_temperature, self.effective_target) else HVACAction.IDLE
        if valve_open:
            current, target = self._trv_attr("current_temperature"), self._trv_attr("temperature")
            try:
                if current is None or target is None or float(current) < float(target) + 0.3:
                    return HVACAction.HEATING
            except (TypeError, ValueError):
                return HVACAction.HEATING
        return HVACAction.IDLE

    @property
    def status(self) -> str:
        if self.monitor:
            return STATUS_MONITOR
        if not self.trv_available():
            return STATUS_TRV
        if not self.hvac_on:
            return STATUS_OFF_TRV if self.off_source == OFF_SOURCE_TRV else STATUS_OFF
        if self.paused:
            return STATUS_NIGHT if self.night_airing else STATUS_WINDOW
        on, _target, reason = self.plan()
        if not on and reason == REASON_SEASON:
            return STATUS_SEASON
        if not self.sensor_ok:
            return STATUS_SENSOR
        if reason in AWAY_STAGES:
            return STATUS_SETBACK
        if self.hvac_action == HVACAction.HEATING:
            return STATUS_HEATING
        return STATUS_IDLE






    # ================================================================ Bedienung
    async def async_set_target(self, temperature: float) -> None:
        new = clamp(float(temperature), self.trv_min, self.trv_max)
        on, current, reason = self.plan()
        override = reason in AWAY_STAGES and new > current
        now = dt_util.utcnow()
        if override:
            # Jemand will es trotz Abwesenheit wärmer → Absenkung für 3 h aussetzen
            self._manual_until = now + MANUAL_OVERRIDE
        elif self.override_minutes > 0 and schedule_target(self.schedules, dt_util.now()) is not None:
            # In einem laufenden Zeitfenster: von Hand gestellt heißt „für X Minuten mein Wunsch".
            self._manual_until = now + timedelta(minutes=self.override_minutes)
        if new != self.target_temp:
            self.log(
                CAT_MANUAL,
                tr("Wunschtemperatur {old} → {new}", old=fmt_temp(self.target_temp), new=fmt_temp(new)),
                tr("in Home Assistant geändert") + (tr("; Absenkung für 3 h ausgesetzt") if override else ""),
            )
        self.target_temp = new
        self._save()
        self._notify()
        await self._apply()

    @property
    def comfort_temp(self) -> float:
        """Wunschtemperatur (eingestellt oder Standard des Raumtyps)."""
        return comfort_temperature(
            self.config.get(CONF_COMFORT_TEMP), self.config.get(CONF_ROOM_TYPE)
        )

    async def async_set_hvac_on(self, on: bool) -> None:
        if on and not self.hvac_on and self.target_temp < MIN_USEFUL_TARGET:
            # Raum war aus (Sollwert-Rest wie 5 °C) → mit Wunschtemperatur starten
            self.target_temp = self.comfort_temp
        if on != self.hvac_on:
            self.log(CAT_MANUAL, tr("Raum eingeschaltet") if on else tr("Raum ausgeschaltet"), tr("in Home Assistant"))
        self.hvac_on = on
        self.off_source = None if on else OFF_SOURCE_USER
        self._save()
        self._notify()
        await self._apply()

    async def async_set_boost(self, minutes: int | None = None, temperature: float | None = None) -> None:
        """Zeitlich begrenzt wärmer heizen („30 min wärmer“), danach gilt wieder der Rest."""
        duration = int(self.config.get(CONF_BOOST_MINUTES) or 30) if minutes is None else int(minutes)
        duration = max(BOOST_MINUTES_MIN, min(BOOST_MINUTES_MAX, duration))
        offset = float(self.config.get(CONF_BOOST_TEMP) or 2.0) if temperature is None else float(temperature)
        offset = max(BOOST_TEMP_MIN, min(BOOST_TEMP_MAX, offset))
        self.boost_temperature = min(self.comfort_temp + offset, self.trv_max)
        self.boost_until = dt_util.utcnow() + timedelta(minutes=duration)
        if not self.hvac_on:
            self.hvac_on = True
            self.off_source = None
        self.log(
            CAT_MANUAL,
            tr("Boost {t} für {m} min", t=fmt_temp(self.boost_temperature), m=duration),
            tr("in Home Assistant"),
        )
        self._save()
        self._notify()
        await self._apply()

    async def async_clear_boost(self) -> None:
        """Laufenden Boost vorzeitig beenden."""
        if self.boost_until is None:
            return
        self.boost_until = None
        self.boost_temperature = None
        self.log(CAT_MANUAL, tr("Boost beendet"), tr("in Home Assistant"))
        self._save()
        self._notify()
        await self._apply()

    @property
    def boost_active(self) -> bool:
        return self.boost_until is not None and dt_util.utcnow() < self.boost_until

    async def async_set_window_logic(self, enabled: bool) -> None:
        self.window_logic = enabled
        self._save()
        self._notify()
        await self._apply()

    # ================================================================ Ereignisse
    @callback
    def _on_state_change(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        old = event.data["old_state"]
        new = event.data["new_state"]

        if self.valve_sensor is None:
            # MQTT/Zigbee legen die Ventilstellung erst nach dem Start an (#15). Nachgesehen wird
            # in den ersten 30 Minuten, aber höchstens alle 15 Sekunden – beim Startfeuer sonst
            # sofort aufgebraucht.
            now = dt_util.utcnow()
            if self._valve_hunt_until is None:
                self._valve_hunt_until = now + timedelta(minutes=30)
            if now < self._valve_hunt_until and (
                self._valve_last_try is None or (now - self._valve_last_try).total_seconds() >= 15
            ):
                self._valve_last_try = now
                self._try_valve_sensor()

        if entity_id in self.windows:
            self._on_window(entity_id, new)
        elif entity_id == self.temp_sensor:
            if self._ingest_sensor(new):
                self.hass.async_create_task(self.async_calibrate())
        elif entity_id == self.trv:
            self._trv_reports.append(dt_util.utcnow())
            self._on_trv(old, new)
        elif entity_id == self.cal_entity:
            self.sync.check_all()
        else:
            for extra in self.extra_trvs:
                if entity_id in extra.tracked():
                    extra.sync.check_all()
                    if self.cal_mode == CAL_OFFSET and entity_id == extra.entity_id and old is not None and new is not None and old.attributes.get("current_temperature") != new.attributes.get("current_temperature"):
                        self.hass.async_create_task(extra.calibrate())
        if self.vent:
            self.vent.update()
        self._notify()

    def _ingest_sensor(self, state: State | None) -> bool:
        """Messwert prüfen und übernehmen. True bei neuem gültigem Wert."""
        if state is None:
            return False
        value = to_float(state.state)
        if value is None:
            return False  # unavailable/unknown: letzten Wert behalten
        now = dt_util.utcnow()
        since = (now - self._ext_time).total_seconds() if self._ext_time else None
        if not plausible_reading(
            value,
            self._ext_value,
            since,
            max_jump=MAX_SENSOR_JUMP,
            window=SENSOR_JUMP_WINDOW,
        ) and (self._ext_candidate is None or abs(value - self._ext_candidate) > 0.5):
            # Ausreißer? Nur übernehmen, wenn der nächste Wert ihn bestätigt
            _LOGGER.debug("%s: unplausibler Messwert %s verworfen", self.name, value)
            self._ext_candidate = value
            return False
        self._ext_candidate = None
        if value != self._ext_value:
            self._ext_changed_at = now
            self._trv_at_ext_change = self.trv_temperature
        self._ext_value = value
        self._ext_time = now
        self._temp_hist.append((now, value))
        self._check_virtual_window(now, value)
        return True











    def _on_trv(self, old: State | None, new: State | None) -> None:
        was_ok = old is not None and is_valid(old.state)
        is_ok = new is not None and is_valid(new.state)
        if was_ok and not is_ok:
            # Erst nach einer Minute als Ausfall werten – kurze Aussetzer (MQTT/VPN) sind normal
            self._trv_down_since = dt_util.utcnow()
            if self._trv_down_cancel:
                self._trv_down_cancel()
            self._trv_down_cancel = self._schedule(TRV_OUTAGE_SECONDS, self._trv_down_confirmed)
        if is_ok and not was_ok:
            _LOGGER.info("%s: TRV wieder erreichbar – sende Ausstehendes", self.name)
            if self._trv_down_cancel:
                self._trv_down_cancel()
                self._trv_down_cancel = None
            if self._trv_down_since is not None:
                seconds = (dt_util.utcnow() - self._trv_down_since).total_seconds()
                self._trv_down_since = None
                if seconds < TRV_OUTAGE_SECONDS:
                    if self.hub is not None:
                        self.hub.note_trv_blip(self, seconds)
                else:
                    self.log(CAT_DEVICE, tr("Thermostat wieder erreichbar"), tr("nach {m} min – offene Befehle werden sofort gesendet", m=f"{seconds / 60:.0f}"))
            self.hass.async_create_task(self.sync.retry_all_now())
            return
        if not (is_ok and was_ok):
            return
        if old.attributes.get("preset_mode") != new.attributes.get("preset_mode"):
            self._preset_changed_at = dt_util.utcnow()
        # Vor check_all: bestätigt dieses Update einen eigenen Befehl, sind die
        # Jobs noch offen und es wird nicht als manuelle Änderung gewertet.
        self._detect_manual_change(old, new)
        self._update_shift()
        self.sync.check_all()
        if self.cal_mode == CAL_OFFSET:
            if old.attributes.get("current_temperature") != new.attributes.get(
                "current_temperature"
            ):
                self.hass.async_create_task(self.async_calibrate())
        elif self.cal_mode == CAL_TARGET:
            self.hass.async_create_task(self._apply(from_measurement=True))


    @callback
    def _try_valve_sensor(self) -> bool:
        """Ventilsensor nachträglich suchen (MQTT/Zigbee legen ihn erst nach dem Start an, #15)."""
        if self.valve_sensor is not None:
            return True
        found = self._find_valve_sensor()
        if not found:
            return False
        self.valve_sensor = found
        self._unsubs.append(async_track_state_change_event(self.hass, [found], self._on_state_change))
        return True

    @callback
    def _on_fast_poll(self, _now: datetime) -> None:
        """Alle zwei Minuten beim Gerät nachfragen (nur wenn der Raum es verlangt)."""
        if not self.config.get(CONF_FAST_POLL):
            return
        ids = [self.trv] + [t.entity_id for t in self.extra_trvs if getattr(t, "entity_id", None)]
        if not ids:
            return
        self.hass.async_create_task(
            self.hass.services.async_call(
                "homeassistant", "update_entity", {"entity_id": ids}, blocking=False
            )
        )

    @callback
    def _on_reconcile(self, _now: datetime) -> None:
        """Sicherheitsnetz: Fenster neu bewerten und Soll-Zustand abgleichen."""
        if self.valve_sensor is None:
            # Sicherheitsnetz, falls der schnelle Nachlauf schon beendet ist.
            self._try_valve_sensor()
        for entity in self.windows:
            state = self.hass.states.get(entity)
            if state and is_valid(state.state):
                self._last_valid_windows[entity] = window_open_state(entity, state)
        self._evaluate_windows()
        self.hass.async_create_task(self._apply())

    @callback
    def _on_cal_interval(self, _now: datetime) -> None:
        """Alle 10 Minuten: Abgleich nachführen.

        Bei Kalibrierart „target“ wird der Sollwert neu gesendet – so kommt der gelernte Versatz auch
        dann an, wenn das Thermostat zwischendurch keine Messwerte meldet (Livisi/HMIP, Batteriegeräte).
        """
        if self.cal_mode == CAL_TARGET:
            self.hass.async_create_task(self._apply(from_measurement=True))
            return
        self.hass.async_create_task(self.async_calibrate())







    async def _apply(self, from_measurement: bool = False) -> None:
        """Soll-Zustand berechnen und ans TRV senden (mit Prüfung)."""
        async with self._apply_lock:
            if not self._started:
                return  # Raum wird gerade entladen/neu geladen – nichts mehr senden
            if self.monitor:
                return  # Überwachungsraum: nichts zu regeln, nichts zu senden
            if self.throttled_until and dt_util.utcnow() < self.throttled_until:
                return  # Bremse aktiv – zu viele Befehle in kurzer Zeit
            method = self._off_method()
            plan_on, _target, reason = self.plan()
            self._log_plan(plan_on, _target, reason)
            want_on = self.hvac_on and not self.paused and plan_on
            if reason == REASON_VALVE_CARE and self.hvac_on:
                want_on = True

            if not want_on:
                self.sync.cancel("setpoint")
                if method == OFF_PRESET:
                    current = self._trv_attr("preset_mode")
                    if current and current != "off":
                        self.trv_on_preset = current
                        self._save()
                    await self.sync.request(
                        "mode",
                        "Preset 'off'",
                        lambda: self._call_climate("set_preset_mode", preset_mode="off"),
                        lambda: self._is_trv_off(self._trv_state(), OFF_PRESET),
                    )
                elif method == OFF_HVAC:
                    await self.sync.request(
                        "mode",
                        "HVAC 'off'",
                        lambda: self._call_climate("set_hvac_mode", hvac_mode="off"),
                        lambda: self._is_trv_off(self._trv_state(), OFF_HVAC),
                    )
                else:
                    low = self.trv_min
                    await self.sync.request(
                        "mode",
                        tr("Minimaltemperatur {t}", t=fmt_temp(low)),
                        lambda: self._write_setpoint(low),
                        lambda: self._is_trv_off(self._trv_state(), OFF_MIN_TEMP),
                    )
                await self._apply_extras(False, method)
                return

            # --- an: zuerst Modus, dann Sollwert
            if method == OFF_PRESET:
                preset = "comfort" if self.target_via == "comfort_temperature" else self._on_preset()
                current = self._trv_attr("preset_mode")
                if current in HEAT_PRESETS and current != "none" or (current == "none" and preset == "none"):
                    self.sync.cancel("mode")  # regelt schon auf den Sollwert – Preset nicht umstellen
                elif preset:
                    await self.sync.request(
                        "mode",
                        f"Preset '{preset}'",
                        lambda: self._call_climate("set_preset_mode", preset_mode=preset),
                        lambda: self._trv_attr("preset_mode") in HEAT_PRESETS,
                    )
            elif method == OFF_HVAC:
                modes = [m for m in (self._trv_attr("hvac_modes") or []) if m != "off"]
                hvac = "heat" if "heat" in modes else (modes[0] if modes else "heat")
                await self.sync.request(
                    "mode",
                    f"HVAC '{hvac}'",
                    lambda: self._call_climate("set_hvac_mode", hvac_mode=hvac),
                    lambda: self.trv_available()
                    and getattr(self._trv_state(), "state", "off") != "off",
                )
            else:
                self.sync.cancel("mode")

            setpoint = self._desired_setpoint()
            if from_measurement:
                # Bei Kalibrierart "target" nur bei echter Änderung senden
                if self._last_target_setpoint is not None and abs(
                    setpoint - self._last_target_setpoint
                ) < 0.5:
                    return
                if not self._cal_interval_passed():
                    return
            if self.target_via == "comfort_temperature" and getattr(self.sync, "verify_delay", 20) < 120:
                # Batteriegeräte melden selten – nicht nach 5 Minuten „nicht bestätigt" rufen.
                self.sync.verify_delay = 120
            if self.sync.is_pending("mode"):
                await asyncio.sleep(2)  # Tuya braucht kurz nach Preset-Wechsel
            self._last_target_setpoint = setpoint
            if self.cal_mode == CAL_TARGET:
                self._last_cal_send = dt_util.utcnow()
            await self.sync.request(
                "setpoint",
                tr("Sollwert {t}", t=fmt_temp(setpoint)),
                lambda: self._write_setpoint(setpoint),
                lambda: self._setpoint_matches(setpoint),
            )
            await self._apply_extras(True, method)

    async def _apply_extras(self, want_on: bool, method: str) -> None:
        """Weitere Thermostate im Raum auf denselben Stand bringen."""
        if not self.extra_trvs:
            return
        target = self.effective_target
        for extra in self.extra_trvs:
            try:
                await extra.apply(want_on, method, target)
            except Exception as err:  # noqa: BLE001 – ein Heizkörper darf die anderen nicht aufhalten
                _LOGGER.warning("%s: weiteres Thermostat %s: %s", self.name, extra.entity_id, err)

    def peek_plan(self) -> tuple[bool, float, str]:
        """Wie ``plan()``, aber ohne den Von-Hand-Vorrang zu verbrauchen (für die Anzeige)."""
        self._peeking = True
        try:
            return self.plan()
        finally:
            self._peeking = False

    @property
    def trv_report_interval(self) -> float | None:
        """Abstand, in dem das Thermostat von sich aus meldet (Sekunden, Median)."""
        if len(self._trv_reports) < 3:
            return None
        deltas = [
            (b - a).total_seconds()
            for a, b in zip(self._trv_reports, list(self._trv_reports)[1:], strict=False)
        ]
        deltas = [d for d in deltas if 0 < d <= 7200]
        if len(deltas) < 2:
            return None
        deltas.sort()
        return deltas[len(deltas) // 2]

    @property
    def applied_target(self) -> float:
        """Was gerade gilt: berechnetes Ziel (Zeitplan, Boost, Absenkung), sonst der Wunsch."""
        on, target, _reason = self.peek_plan()
        return target if on else self.target_temp

    @property
    def sync_state(self) -> str:
        """Übertragung über alle Thermostate: failed > pending > ok."""
        states = [self.sync.state, *(x.sync.state for x in self.extra_trvs)]
        for s in ("failed", "pending"):
            if s in states:
                return s
        return "ok"

    # ================================================================ Protokoll
    def _log_plan(self, on: bool, target: float, reason: str) -> None:
        """Zieländerungen mit Begründung protokollieren (nur bei Änderung)."""
        key = (on, round(target, 1), reason)
        if key == self._last_plan:
            return
        first = self._last_plan is None
        self._last_plan = key
        hub = self.hub
        why = {
            REASON_NORMAL: tr("Wunschtemperatur {t}", t=fmt_temp(self.target_temp)),
            REASON_MANUAL: tr("von Hand wärmer gestellt – Absenkung 3 h ausgesetzt"),
            REASON_SEASON: tr("Heizpause (mild draußen)"),
            REASON_FROST: tr("Heizpause, aber unter der Sicherung {t}", t=fmt_temp(hub.frost_floor if hub else None)),
            REASON_VALVE_CARE: tr("Sommerpflege: Ventil kurz öffnen"),
            REASON_EMPTY: tr(
                "Raum seit {m} min leer (Präsenzmelder) – {d} weniger (Wunsch {t})",
                m=f"{self.room_eco_after:.0f}", d=fmt_temp(self.room_eco_drop), t=fmt_temp(self.target_temp),
            ),
            REASON_SOLAR: tr("Sonne erwartet – {d} weniger, sie heizt mit (Wunsch {t})", d=fmt_temp(SOLAR_REDUCTION), t=fmt_temp(self.target_temp)),
            REASON_SLEEP: tr("Ruhezeit – Schlafraum abgesenkt auf {t}", t=fmt_temp(self.setback_long)),
            STAGE_AWAY_SHORT: tr("alle weg – Absenkung „kurz weg“ {t}", t=fmt_temp(self.setback_short)),
            STAGE_AWAY_LONG: tr("länger weg – Absenkung {t}", t=fmt_temp(self.setback_long)),
        }.get(reason, reason)
        if self.frost_night_low is not None and reason in AWAY_STAGES:
            why += tr(", Frostnacht ({t} erwartet): nur halb so tief abgesenkt", t=fmt_temp(self.frost_night_low))
        elif reason == STAGE_AWAY_LONG and target > self.setback_long:
            why += tr(", Schimmelschutz hält {t} (Feuchte {h} %)", t=fmt_temp(target), h=f"{self.current_humidity or 0:.0f}")
        msg = tr("Ziel {t}", t=fmt_temp(target)) if on else tr("Heizung aus")
        self.log(CAT_TARGET, (tr("Start: ") if first else "") + msg, why, target=target, reason=reason)









