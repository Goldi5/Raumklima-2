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
from homeassistant.const import ATTR_TEMPERATURE
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, State, callback
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_INTERVAL,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_COMFORT_TEMP,
    CONF_FOLLOW_TRV,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_NIGHT_AIRING,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_ON_PRESET,
    CONF_ROOM_TYPE,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
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
    RECONCILE_INTERVAL,
    SENSOR_JUMP_WINDOW,
    SETPOINT_MATCH_TOLERANCE,
    SLOW_RETRY_INTERVAL,
    STATUS_HEATING,
    STATUS_IDLE,
    STATUS_NIGHT,
    STATUS_OFF,
    STATUS_SEASON,
    STATUS_SENSOR,
    STATUS_SETBACK,
    STATUS_TRV,
    STATUS_WINDOW,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_MANUAL,
    CAT_SETTINGS,
    CAT_TARGET,
    fmt_temp,
)
from .health import (
    HistoryPoint,
)
from .heatup import HeatupTracker
from .hub import RaumklimaHub
from .logic import (
    any_open,
    clamp,
    is_valid,
    plausible_reading,
    to_float,
    values_match,
)
from .planning import (
    AWAY_STAGES,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    mold_safe_min_temp,
    setback_defaults,
    setback_target,
)
from .room_health import HealthMixin
from .room_trv import HEAT_PRESETS, MANUAL_OVERRIDE, TrvMixin
from .room_windows import WindowMixin
from .shared import domain_data, get_hub
from .sync import SyncManager
from .vent_manager import VentilationManager
from .ventilation import MIN_USEFUL_TARGET, comfort_temperature

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1
VALVE_CARE = timedelta(minutes=3)

TRV_OUTAGE_SECONDS = 60  # kürzere Aussetzer gelten nicht als Ausfall
REASON_NORMAL = "normal"
REASON_MANUAL = "manual"
REASON_SEASON = "season"
REASON_FROST = "frost"
REASON_VALVE_CARE = "valve_care"
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
    }
)


class RaumklimaController(WindowMixin, TrvMixin, HealthMixin):
    """Steuert genau einen Raum."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = {**DEFAULTS, **entry.data, **entry.options}
        self.name: str = self.config[CONF_NAME]
        self.trv: str = self.config[CONF_TRV]
        self.temp_sensor: str = self.config[CONF_TEMP_SENSOR]
        self.humidity_sensor: str | None = self.config.get(CONF_HUMIDITY_SENSOR)
        self.windows: list[str] = list(self.config.get(CONF_WINDOWS) or [])
        self.cal_mode: str = self.config[CONF_CALIBRATION_MODE]
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
        self._frost_active = False
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
        self._virtual_low: float = 0.0
        self._virtual_cancel: Callable[[], None] | None = None
        self._batteries: dict[str, str] = {}
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}"
        )

        self.vent = VentilationManager(self, None)
        self.sync = SyncManager(
            schedule=self._schedule,
            run_task=lambda coro: hass.async_create_task(coro),
            is_target_available=self.trv_available,
            verify_delay=float(self.config[CONF_SYNC_VERIFY_DELAY]),
            max_retries=int(self.config[CONF_SYNC_MAX_RETRIES]),
            slow_interval=SLOW_RETRY_INTERVAL,
            on_change=self._notify,
            on_failed=self._on_sync_failed,
            on_recovered=self._on_sync_recovered,
            on_event=self._on_sync_event,
        )
        self._last_plan: tuple[bool, float, str] | None = None

    # ================================================================ Lifecycle
    async def async_start(self) -> None:
        """Gespeicherten Zustand laden, Listener registrieren, abgleichen."""
        stored = await self._store.async_load()
        if stored:
            self.target_temp = float(stored.get("target_temp", self.target_temp))
            self.hvac_on = bool(stored.get("hvac_on", self.hvac_on))
            self.window_logic = bool(stored.get("window_logic", self.window_logic))
            self.trv_on_preset = stored.get("trv_on_preset")
            self.preset_learned = stored.get("preset_learned")
            self.heatup.load(stored.get("heatup"))
        elif self.trv_available():
            # Erster Start: Wunschtemperatur statt Zufallswert am TRV (Eco-Speicher, 5 °C …)
            self.target_temp = self.comfort_temp
            self.hvac_on = not self._is_trv_off(self._trv_state(), self._off_method())
            preset = self._trv_attr("preset_mode")
            if preset and preset != "off":
                self.trv_on_preset = preset
            self._save()

        self.vent.load((stored or {}).get("vent"))
        self.valve_sensor = self._find_valve_sensor()
        self._batteries = self._find_batteries()

        tracked = [self.trv, self.temp_sensor, *self.windows]
        if self.humidity_sensor:
            tracked.append(self.humidity_sensor)
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

        # Startzustand: Fenster ohne Verzögerung übernehmen
        for entity in self.windows:
            state = self.hass.states.get(entity)
            if state and is_valid(state.state):
                self._last_valid_windows[entity] = state.state
        self._window_raw = any_open(self._last_valid_windows, self.windows)
        self.window_paused = self._window_raw
        if self._window_raw and self.night_applies():
            self.night_since = dt_util.utcnow()
        self._ingest_sensor(self.hass.states.get(self.temp_sensor))
        await self.vent.async_start()

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
        if self.vent:
            self.vent.async_stop()
        await self._store.async_save(self._stored_data())

    def _stored_data(self) -> dict[str, Any]:
        return {
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "window_logic": self.window_logic,
            "trv_on_preset": self.trv_on_preset,
            "preset_learned": self.preset_learned,
            "vent": self.vent.export() if self.vent else None,
            "heatup": self.heatup.dump(),
        }

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
        return {
            "entry_id": self.entry.entry_id,
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
            "virtual_active": self.virtual_enabled(),
            "heatup": {
                "episodes": len(self.heatup.episodes),
                "rate": self.heatup.rate(self.hub.outdoor_temp() if self.hub else None),
                "minutes_2k": self.heatup.minutes_needed(2.0, self.hub.outdoor_temp() if self.hub else None),
            },
            "humidity_sensor": cfg.get(CONF_HUMIDITY_SENSOR),
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
        # self.config ist dasselbe Objekt, das auch der Lüftungsassistent nutzt
        self.config.update(changed)
        self.log(
            CAT_SETTINGS,
            "Einstellungen geändert",
            ", ".join(f"{k}: {self._fmt_opt(v)}" for k, v in changed.items()),
        )
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
            return "Standard"
        if isinstance(value, float):
            return fmt_temp(value) if value < 40 else f"{value:.0f}"
        return str(value)

    def fire_event(self, kind: str, data: dict[str, Any]) -> None:
        """Ereignis für eigene Automationen (raumklima_event)."""
        self.hass.bus.async_fire(
            EVENT_RAUMKLIMA,
            {"type": kind, "room": self.name, "entry_id": self.entry.entry_id, **data},
        )




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
        return async_call_later(self.hass, delay, callback(lambda _now: action()))







    @property
    def sensor_ok(self) -> bool:
        """Externer Fühler vorhanden und aktuell?"""
        state = self.hass.states.get(self.temp_sensor)
        if state is None or not is_valid(state.state) or self._ext_value is None:
            return False
        last = getattr(state, "last_reported", None) or state.last_updated
        age = (dt_util.utcnow() - last).total_seconds() / 60
        return age <= float(self.config[CONF_SENSOR_STALE_MINUTES])





    def log(self, cat: str, msg: str, why: str | None = None, level: str = "info", **data: Any) -> None:
        """Ins Entscheidungsprotokoll schreiben (falls die Zentrale läuft)."""
        hub = self.hub
        if hub is not None:
            hub.log.add(cat, msg, why, room=self.name, entry_id=self.entry.entry_id, level=level, **data)



    @property
    def current_temperature(self) -> float | None:
        """Raumtemperatur: externer Fühler, im Notfall das TRV."""
        if self.sensor_ok:
            return self._ext_value
        return self.trv_temperature

    @property
    def current_humidity(self) -> float | None:
        if not self.humidity_sensor:
            return None
        state = self.hass.states.get(self.humidity_sensor)
        return to_float(state.state) if state else None

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
    def setback_short(self) -> float:
        value = to_float(self.config.get(CONF_SETBACK_SHORT))
        return value if value is not None else setback_defaults(self.config.get(CONF_ROOM_TYPE))[0]

    @property
    def setback_long(self) -> float:
        value = to_float(self.config.get(CONF_SETBACK_LONG))
        return value if value is not None else setback_defaults(self.config.get(CONF_ROOM_TYPE))[1]

    def plan(self) -> tuple[bool, float, str]:
        """(heizen?, Zieltemperatur, Grund) aus Heizsaison, Anwesenheit und Wunsch."""
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
                self._frost_active = False
            elif not self._frost_active and cur is not None and cur < floor:
                self._frost_active = True
            if self._frost_active:
                return True, min(floor + 1, self.trv_max), REASON_FROST
            return False, self.target_temp, REASON_SEASON
        self._frost_active = False
        if hub.stage in AWAY_STAGES:
            if self._manual_until and now < self._manual_until:
                return True, self.target_temp, REASON_MANUAL
            mold = None
            if self.humidity_sensor:
                mold = mold_safe_min_temp(
                    self.current_temperature, self.current_humidity, hub.outdoor_temp(), hub.frsi
                )
            target = setback_target(
                self.target_temp, hub.stage, self.setback_short, self.setback_long, mold
            )
            if target < self.target_temp:
                return True, target, hub.stage
        self._manual_until = None
        return True, self.target_temp, REASON_NORMAL

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
        return HVACAction.IDLE

    @property
    def status(self) -> str:
        if not self.trv_available():
            return STATUS_TRV
        if not self.hvac_on:
            return STATUS_OFF
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
        if override:
            # Jemand will es trotz Abwesenheit wärmer → Absenkung für 3 h aussetzen
            self._manual_until = dt_util.utcnow() + MANUAL_OVERRIDE
        if new != self.target_temp:
            self.log(
                CAT_MANUAL,
                f"Wunschtemperatur {fmt_temp(self.target_temp)} → {fmt_temp(new)}",
                "in Home Assistant geändert" + ("; Absenkung für 3 h ausgesetzt" if override else ""),
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
            self.log(CAT_MANUAL, f"Raum {'eingeschaltet' if on else 'ausgeschaltet'}", "in Home Assistant")
        self.hvac_on = on
        self._save()
        self._notify()
        await self._apply()

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

        if entity_id in self.windows:
            self._on_window(entity_id, new)
        elif entity_id == self.temp_sensor:
            if self._ingest_sensor(new):
                self.hass.async_create_task(self.async_calibrate())
        elif entity_id == self.trv:
            self._on_trv(old, new)
        elif entity_id == self.cal_entity:
            self.sync.check_all()
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
                    self.log(CAT_DEVICE, "Thermostat wieder erreichbar", f"nach {seconds / 60:.0f} min – offene Befehle werden sofort gesendet")
            self.hass.async_create_task(self.sync.retry_all_now())
            return
        if not (is_ok and was_ok):
            return
        if old.attributes.get("preset_mode") != new.attributes.get("preset_mode"):
            self._preset_changed_at = dt_util.utcnow()
        # Vor check_all: bestätigt dieses Update einen eigenen Befehl, sind die
        # Jobs noch offen und es wird nicht als manuelle Änderung gewertet.
        self._detect_manual_change(old, new)
        self.sync.check_all()
        if self.cal_mode == CAL_OFFSET:
            if old.attributes.get("current_temperature") != new.attributes.get(
                "current_temperature"
            ):
                self.hass.async_create_task(self.async_calibrate())
        elif self.cal_mode == CAL_TARGET:
            self.hass.async_create_task(self._apply(from_measurement=True))


    @callback
    def _on_reconcile(self, _now: datetime) -> None:
        """Sicherheitsnetz: Fenster neu bewerten und Soll-Zustand abgleichen."""
        for entity in self.windows:
            state = self.hass.states.get(entity)
            if state and is_valid(state.state):
                self._last_valid_windows[entity] = state.state
        self._evaluate_windows()
        self.hass.async_create_task(self._apply())

    @callback
    def _on_cal_interval(self, _now: datetime) -> None:
        self.hass.async_create_task(self.async_calibrate())







    async def _apply(self, from_measurement: bool = False) -> None:
        """Soll-Zustand berechnen und ans TRV senden (mit Prüfung)."""
        async with self._apply_lock:
            if not self._started:
                return  # Raum wird gerade entladen/neu geladen – nichts mehr senden
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
                        f"Minimaltemperatur {fmt_temp(low)}",
                        lambda: self._call_climate("set_temperature", temperature=low),
                        lambda: self._is_trv_off(self._trv_state(), OFF_MIN_TEMP),
                    )
                return

            # --- an: zuerst Modus, dann Sollwert
            if method == OFF_PRESET:
                preset = self._on_preset()
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
            if self.sync.is_pending("mode"):
                await asyncio.sleep(2)  # Tuya braucht kurz nach Preset-Wechsel
            self._last_target_setpoint = setpoint
            if self.cal_mode == CAL_TARGET:
                self._last_cal_send = dt_util.utcnow()
            await self.sync.request(
                "setpoint",
                f"Sollwert {fmt_temp(setpoint)}",
                lambda: self._call_climate("set_temperature", temperature=setpoint),
                lambda: values_match(
                    self._trv_attr(ATTR_TEMPERATURE), setpoint, SETPOINT_MATCH_TOLERANCE
                ),
            )

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
            REASON_NORMAL: f"Wunschtemperatur {fmt_temp(self.target_temp)}",
            REASON_MANUAL: "von Hand wärmer gestellt – Absenkung 3 h ausgesetzt",
            REASON_SEASON: "Heizpause (mild draußen)",
            REASON_FROST: f"Heizpause, aber unter der Sicherung {fmt_temp(hub.frost_floor if hub else None)}",
            REASON_VALVE_CARE: "Sommerpflege: Ventil kurz öffnen",
            STAGE_AWAY_SHORT: f"alle weg – Absenkung „kurz weg“ {fmt_temp(self.setback_short)}",
            STAGE_AWAY_LONG: f"länger weg – Absenkung {fmt_temp(self.setback_long)}",
        }.get(reason, reason)
        if reason == STAGE_AWAY_LONG and target > self.setback_long:
            why += f", Schimmelschutz hält {fmt_temp(target)} (Feuchte {self.current_humidity or 0:.0f} %)"
        msg = f"Ziel {fmt_temp(target)}" if on else "Heizung aus"
        self.log(CAT_TARGET, ("Start: " if first else "") + msg, why, target=target, reason=reason)









