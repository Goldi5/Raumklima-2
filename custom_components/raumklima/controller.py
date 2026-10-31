"""Kernlogik: ein Raum mit TRV, externem Fühler und Fensterkontakten."""

from __future__ import annotations

import asyncio
from collections import deque
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.components.climate import HVACAction
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID, ATTR_TEMPERATURE
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, State, callback
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_INTERVAL,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_COMFORT_TEMP,
    CONF_ROOM_TYPE,
    CONF_FOLLOW_TRV,
    CONF_HUMIDITY_SENSOR,
    CONF_NAME,
    CONF_NOTIFY,
    CONF_OFF_METHOD,
    CONF_OFFSET_MIN_INTERVAL,
    CONF_OFFSET_THRESHOLD,
    CONF_SENSOR_STALE_MINUTES,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WEATHER,
    CONF_WINDOWS,
    DEFAULTS,
    EVENT_RAUMKLIMA,
    DOMAIN,
    MAX_SENSOR_JUMP,
    OFF_AUTO,
    OFF_HVAC,
    OFF_MIN_TEMP,
    OFF_PRESET,
    OFFSET_MATCH_TOLERANCE,
    OFFSET_MAX,
    OFFSET_MIN,
    OFFSET_STEP,
    PRESET_GRACE_SECONDS,
    CONF_ON_PRESET,
    CONF_SETBACK_LONG,
    CONF_NIGHT_AIRING,
    CONF_NIGHT_END,
    CONF_NIGHT_START,
    CONF_SETBACK_SHORT,
    KIND_TRV_FAILURE,
    ON_PRESET_AUTO,
    ON_PRESET_AVOID,
    ON_PRESET_CANDIDATES,
    RECONCILE_INTERVAL,
    SENSOR_JUMP_WINDOW,
    SETPOINT_MATCH_TOLERANCE,
    SLOW_RETRY_INTERVAL,
    STATUS_HEATING,
    STATUS_IDLE,
    STATUS_OFF,
    STATUS_SEASON,
    STATUS_SENSOR,
    STATUS_SETBACK,
    STATUS_NIGHT,
    STATUS_TRV,
    STATUS_WINDOW,
)
from .health import (
    HistoryPoint,
    Issue,
    check_battery,
    check_not_warming,
    check_radio,
    check_sensor_frozen,
    check_window,
)
from .hub import RaumklimaHub, domain_data, get_hub
from .stats import RoomSample
from .decision_log import (
    CAT_DEVICE,
    CAT_MANUAL,
    CAT_TARGET,
    CAT_WINDOW,
    fmt_temp,
)
from .planning import (
    NIGHT_OFF,
    NIGHT_ON,
    NIGHT_ROOM_TYPES,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    AWAY_STAGES,
    NIGHT_AUTO,
    in_time_window,
    mold_safe_min_temp,
    night_airing_applies,
    setback_defaults,
    setback_target,
)
from .logic import (
    any_open,
    calc_offset,
    choose_on_preset,
    calc_target_setpoint,
    clamp,
    is_valid,
    plausible_reading,
    to_float,
    values_match,
)
from .sync import SyncJob, SyncManager
from .vent_manager import VentilationManager
from .ventilation import MIN_USEFUL_TARGET, comfort_temperature

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1
MANUAL_OVERRIDE = timedelta(hours=3)  # Drehen am Regler während Absenkung
VALVE_CARE = timedelta(minutes=3)

REASON_NORMAL = "normal"
REASON_MANUAL = "manual"
REASON_SEASON = "season"
REASON_FROST = "frost"
REASON_VALVE_CARE = "valve_care"


class RaumklimaController:
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
        if self._window_timer:
            self._window_timer()
            self._window_timer = None
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
            "vent": self.vent.export() if self.vent else None,
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

    def fire_event(self, kind: str, data: dict[str, Any]) -> None:
        """Ereignis für eigene Automationen (raumklima_event)."""
        self.hass.bus.async_fire(
            EVENT_RAUMKLIMA,
            {"type": kind, "room": self.name, "entry_id": self.entry.entry_id, **data},
        )

    def _find_valve_sensor(self) -> str | None:
        """Ventilstellung (sensor …position) am selben Gerät wie das TRV."""
        registry = er.async_get(self.hass)
        trv_entry = registry.async_get(self.trv)
        if trv_entry is None or trv_entry.device_id is None:
            return None
        for entry in er.async_entries_for_device(registry, trv_entry.device_id):
            if entry.domain == "sensor" and (
                "position" in entry.entity_id or entry.translation_key == "position"
            ):
                return entry.entity_id
        return None

    def _find_batteries(self) -> dict[str, str]:
        """Batterie-Sensoren der beteiligten Geräte (TRV, Fühler, Kontakte): Gerätename → Entität."""
        ents = er.async_get(self.hass)
        devs = dr.async_get(self.hass)
        found: dict[str, str] = {}
        for entity_id in [self.trv, self.temp_sensor, self.humidity_sensor, *self.windows]:
            entry = ents.async_get(entity_id) if entity_id else None
            if entry is None or entry.device_id is None:
                continue
            device = devs.async_get(entry.device_id)
            name = (device.name_by_user or device.name) if device else entity_id
            for cand in er.async_entries_for_device(ents, entry.device_id):
                dclass = cand.device_class or cand.original_device_class
                if cand.domain == "sensor" and dclass == "battery" and not cand.disabled_by:
                    found.setdefault(name or cand.entity_id, cand.entity_id)
                    break
        return found

    @property
    def valve_position(self) -> float | None:
        if not self.valve_sensor:
            return None
        state = self.hass.states.get(self.valve_sensor)
        return to_float(state.state) if state else None

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

    # ================================================================ Zustände
    def _trv_state(self) -> State | None:
        return self.hass.states.get(self.trv)

    def _trv_attr(self, attr: str, default: Any = None) -> Any:
        state = self._trv_state()
        return state.attributes.get(attr, default) if state else default

    def trv_available(self) -> bool:
        """TRV erreichbar?"""
        state = self._trv_state()
        return state is not None and is_valid(state.state)

    @property
    def trv_min(self) -> float:
        return to_float(self._trv_attr("min_temp")) or 5.0

    @property
    def trv_max(self) -> float:
        return to_float(self._trv_attr("max_temp")) or 30.0

    @property
    def trv_temperature(self) -> float | None:
        """Vom TRV gemeldete Ist-Temperatur (inkl. Offset)."""
        return to_float(self._trv_attr("current_temperature"))

    @property
    def sensor_ok(self) -> bool:
        """Externer Fühler vorhanden und aktuell?"""
        state = self.hass.states.get(self.temp_sensor)
        if state is None or not is_valid(state.state) or self._ext_value is None:
            return False
        last = getattr(state, "last_reported", None) or state.last_updated
        age = (dt_util.utcnow() - last).total_seconds() / 60
        return age <= float(self.config[CONF_SENSOR_STALE_MINUTES])

    @property
    def paused(self) -> bool:
        """Heizung wegen offenem Fenster pausiert?"""
        return self.window_logic and self.window_paused

    @property
    def night_mode(self) -> str:
        return str(self.config.get(CONF_NIGHT_AIRING) or NIGHT_AUTO)

    def night_applies(self) -> bool:
        """Würde ein jetzt geöffnetes Fenster als Nachtlüften zählen?"""
        return self.night_reason()[0]

    def night_reason(self) -> tuple[bool, str]:
        """(Nachtlüften?, Begründung für das Protokoll)."""
        hub = self.hub
        if hub is None:
            return False, "keine Zentrale"
        local = dt_util.now()
        room_type = self.vent.room_type if self.vent else self.config.get(CONF_ROOM_TYPE)
        start, end = str(hub.opt(CONF_NIGHT_START))[:5], str(hub.opt(CONF_NIGHT_END))[:5]
        in_window = in_time_window(local, start, end)
        home = not hub.nobody_home
        applies = night_airing_applies(self.night_mode, room_type, in_window, home)
        if self.night_mode == NIGHT_OFF:
            why = "Nachtlüften ist für diesen Raum aus"
        elif self.night_mode != NIGHT_ON and room_type not in NIGHT_ROOM_TYPES:
            why = "kein Schlafraum"
        elif not in_window:
            why = f"{local:%H:%M} liegt nicht im Nachtlüften-Fenster {start}–{end}"
        elif not home:
            why = "niemand zu Hause"
        else:
            why = f"{'Schlafraum' if self.night_mode != NIGHT_ON else 'Nachtlüften an'}, {local:%H:%M} im Fenster {start}–{end}, jemand da"
        return applies, why

    def log(self, cat: str, msg: str, why: str | None = None, level: str = "info", **data: Any) -> None:
        """Ins Entscheidungsprotokoll schreiben (falls die Zentrale läuft)."""
        hub = self.hub
        if hub is not None:
            hub.log.add(cat, msg, why, room=self.name, entry_id=self.entry.entry_id, level=level, **data)

    @property
    def night_airing(self) -> bool:
        """Fenster offen, weil bei offenem Fenster geschlafen wird."""
        return self._window_raw and self.night_since is not None

    @property
    def window_open(self) -> bool:
        """Mindestens ein Fenster offen (ohne Verzögerung)."""
        return self._window_raw

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
        return get_hub(self.hass)

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

    # ================================================================ Bericht & Gesundheit
    def stats_sample(self) -> RoomSample:
        on, target, reason = self.plan()
        return RoomSample(
            heating=self.status == STATUS_HEATING,
            valve=self.valve_position,
            reason=reason,
            target=self.target_temp,
            effective=target,
            plan_on=on and self.hvac_on,
            paused=self.paused,
            temp=self.current_temperature,
            humidity=self.current_humidity,
            humidity_limit=self.vent.humidity_limit if self.humidity_sensor else None,
            mold=self.vent.mold_risk,
            window_open=self.window_open,
            night=self.night_airing,
        )

    def record_history(self, now: datetime) -> None:
        on, target, _reason = self.plan()
        self.health_hist.append(
            HistoryPoint(
                when=now,
                valve=self.valve_position,
                temp=self.current_temperature,
                target=target,
                regulating=on and self.hvac_on and not self.paused and self.trv_available(),
            )
        )

    def health_issues(self, now: datetime) -> list[Issue]:
        issues: list[Issue] = []
        levels = {}
        for name, entity in self._batteries.items():
            state = self.hass.states.get(entity)
            value = to_float(state.state) if state else None
            if value is not None:
                levels[name] = value
        issues += check_battery(levels)
        for check in (
            check_not_warming(list(self.health_hist), now),
            check_sensor_frozen(
                (now - self._ext_changed_at).total_seconds() / 3600 if self._ext_changed_at else None,
                (self.trv_temperature - self._trv_at_ext_change)
                if self.trv_temperature is not None and self._trv_at_ext_change is not None
                else None,
            ),
            check_radio(
                sum(1 for t in self._unavail_events if now - t <= timedelta(hours=24)),
                self.sync.state == "failed",
            ),
            check_window(
                self.vent.open_minutes / 60 if self.window_open else None,
                max(((now - t).total_seconds() / 3600 for t in self._window_unavail_since.values()), default=None),
            ),
        ):
            if check is not None:
                issues.append(check)
        return issues

    @property
    def issues(self) -> list[Issue]:
        hub = self.hub
        return hub.insights.issues.get(self.entry.entry_id, []) if hub else []

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
        ):
            # Ausreißer? Nur übernehmen, wenn der nächste Wert ihn bestätigt
            if self._ext_candidate is None or abs(value - self._ext_candidate) > 0.5:
                _LOGGER.debug("%s: unplausibler Messwert %s verworfen", self.name, value)
                self._ext_candidate = value
                return False
        self._ext_candidate = None
        if value != self._ext_value:
            self._ext_changed_at = now
            self._trv_at_ext_change = self.trv_temperature
        self._ext_value = value
        self._ext_time = now
        return True

    def _on_window(self, entity_id: str, new: State | None) -> None:
        if new is None or not is_valid(new.state):
            self._window_unavail_since.setdefault(entity_id, dt_util.utcnow())
            return  # Verbindungsabbruch: letzten echten Zustand behalten
        self._window_unavail_since.pop(entity_id, None)
        self._last_valid_windows[entity_id] = new.state
        self._evaluate_windows()

    def _evaluate_windows(self) -> None:
        raw = any_open(self._last_valid_windows, self.windows)
        if raw == self._window_raw and (self._window_timer or raw == self.window_paused):
            return
        self._window_raw = raw
        if raw and self.night_since is None:
            night, why = self.night_reason()
            if night:
                self.night_since = dt_util.utcnow()
                self.log(CAT_WINDOW, "Fenster auf – Nachtlüften", f"{why}: keine Lüft-Hinweise, Heizung wartet bis zum Schließen")
            else:
                self.log(CAT_WINDOW, "Fenster auf", f"normales Lüften ({why})" if self.night_mode != NIGHT_OFF and why != "kein Schlafraum" else None)
        elif not raw:
            if self.night_since is not None:
                hours = (dt_util.utcnow() - self.night_since).total_seconds() / 3600
                self.log(CAT_WINDOW, "Fenster zu – Nachtlüften beendet", f"nach {hours:.1f} h".replace(".", ","))
            else:
                self.log(CAT_WINDOW, "Fenster zu")
            self.night_since = None
        if self.vent:
            self.vent.on_window_raw(raw)
        if self._window_timer:
            self._window_timer()
            self._window_timer = None
        if raw == self.window_paused:
            return  # vor Ablauf der Verzögerung zurückgewechselt
        delay = float(
            self.config[CONF_WINDOW_OPEN_DELAY if raw else CONF_WINDOW_CLOSE_DELAY]
        )
        self._window_timer = self._schedule(delay, self._window_timer_done)

    @callback
    def _window_timer_done(self) -> None:
        self._window_timer = None
        raw = any_open(self._last_valid_windows, self.windows)
        if raw != self.window_paused:
            self.window_paused = raw
            _LOGGER.info(
                "%s: Fenster %s", self.name, "offen – pausiere" if raw else "zu – fortsetzen"
            )
            delay = float(self.config[CONF_WINDOW_OPEN_DELAY if raw else CONF_WINDOW_CLOSE_DELAY])
            if not self.window_logic:
                pass
            elif raw:
                self.log(CAT_TARGET, "Heizung pausiert", f"Fenster seit {delay:.0f} s offen")
            else:
                self.log(CAT_TARGET, "Heizung läuft weiter", f"Fenster seit {delay:.0f} s zu – Ziel {fmt_temp(self.plan()[1])}")
            self._notify()
            self.hass.async_create_task(self._apply())

    def _on_trv(self, old: State | None, new: State | None) -> None:
        was_ok = old is not None and is_valid(old.state)
        is_ok = new is not None and is_valid(new.state)
        if was_ok and not is_ok:
            self._unavail_events.append(dt_util.utcnow())
        if was_ok and not is_ok:
            self.log(CAT_DEVICE, "Thermostat nicht erreichbar", "Funk/Zigbee meldet „nicht verfügbar“ – letzter Stand bleibt, Befehle werden nachgeholt", level="warn")
        if is_ok and not was_ok:
            _LOGGER.info("%s: TRV wieder erreichbar – sende Ausstehendes", self.name)
            if old is not None:
                self.log(CAT_DEVICE, "Thermostat wieder erreichbar", "offene Befehle werden sofort gesendet")
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

    def _detect_manual_change(self, old: State, new: State) -> None:
        """Änderungen direkt am TRV erkennen (nicht von uns gesendet)."""
        if self.sync.jobs or self.paused or self._apply_lock.locked():
            return
        method = self._off_method()
        follow = bool(self.config[CONF_FOLLOW_TRV])
        was_off = self._is_trv_off(old, method)
        now_off = self._is_trv_off(new, method)
        old_p = old.attributes.get("preset_mode")
        new_p = new.attributes.get("preset_mode")
        if was_off != now_off and method != OFF_MIN_TEMP:
            if follow:
                self.hvac_on = not now_off
                self._save()
                _LOGGER.info("%s: TRV am Gerät %s", self.name, "aus" if now_off else "an")
                self.log(CAT_MANUAL, f"Am Thermostat {'ausgeschaltet' if now_off else 'eingeschaltet'}", "„Drehen am Thermostat übernehmen“ ist an")
            else:
                self.log(CAT_MANUAL, "Am Thermostat geschaltet – zurückgestellt", "„Drehen am Thermostat übernehmen“ ist aus")
                self.hass.async_create_task(self._apply())
            return
        if now_off:
            return
        if new_p != old_p:
            # Preset-Wechsel lädt am TRV oft einen gespeicherten Wert (z. B.
            # eco_temperature). Den nicht als Wunsch übernehmen, sondern
            # Preset und Sollwert der Integration wiederherstellen.
            _LOGGER.info(
                "%s: Preset am TRV auf '%s' geändert – stelle '%s' wieder her",
                self.name,
                new_p,
                self._on_preset(),
            )
            self.log(CAT_DEVICE, f"Preset am Thermostat „{new_p}“ – stelle „{self._on_preset()}“ wieder her", "Preset-Wechsel laden am Gerät alte Werte, das ist kein Wunsch")
            self.hass.async_create_task(self._apply())
            return
        if self.cal_mode == CAL_TARGET:
            return
        old_t = to_float(old.attributes.get(ATTR_TEMPERATURE))
        new_t = to_float(new.attributes.get(ATTR_TEMPERATURE))
        if new_t is None or old_t == new_t:
            return
        if values_match(new_t, self._desired_setpoint(), SETPOINT_MATCH_TOLERANCE):
            return
        if self._preset_changed_at and dt_util.utcnow() - self._preset_changed_at < timedelta(
            seconds=PRESET_GRACE_SECONDS
        ):
            # Tuya lädt beim Preset-Wechsel den gespeicherten Wert oft erst im
            # nächsten Update nach – das ist kein Wunsch des Nutzers.
            _LOGGER.debug("%s: Sollwert %s kurz nach Preset-Wechsel ignoriert", self.name, new_t)
            self.hass.async_create_task(self._apply())
            return
        if follow:
            _LOGGER.info("%s: Sollwert am TRV geändert auf %s", self.name, new_t)
            away = self.plan()[2] in AWAY_STAGES
            self.log(
                CAT_MANUAL,
                f"Am Thermostat gedreht: {fmt_temp(new_t)}",
                "wird neue Wunschtemperatur" + ("; Absenkung für 3 h ausgesetzt" if away else ""),
            )
            if away:
                self._manual_until = dt_util.utcnow() + MANUAL_OVERRIDE
            self.target_temp = new_t
            self._save()
        else:
            self.hass.async_create_task(self._apply())

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

    # ================================================================ TRV steuern
    def _off_method(self) -> str:
        method = self.config[CONF_OFF_METHOD]
        if method != OFF_AUTO:
            return method
        if "off" in (self._trv_attr("preset_modes") or []):
            return OFF_PRESET
        if "off" in (self._trv_attr("hvac_modes") or []):
            return OFF_HVAC
        return OFF_MIN_TEMP

    def _is_trv_off(self, state: State | None, method: str) -> bool:
        if state is None:
            return False
        if method == OFF_PRESET:
            return state.attributes.get("preset_mode") == "off"
        if method == OFF_HVAC:
            return state.state == "off"
        return values_match(
            state.attributes.get(ATTR_TEMPERATURE), self.trv_min, SETPOINT_MATCH_TOLERANCE
        )

    def _on_preset(self) -> str | None:
        return choose_on_preset(
            self._trv_attr("preset_modes") or [],
            self.config.get(CONF_ON_PRESET),
            self.trv_on_preset,
            candidates=ON_PRESET_CANDIDATES,
            avoid=ON_PRESET_AVOID,
            auto_value=ON_PRESET_AUTO,
        )

    def _desired_setpoint(self) -> float:
        target = self.effective_target
        if self.cal_mode == CAL_TARGET and self.sensor_ok:
            return calc_target_setpoint(
                target,
                self._ext_value,
                self.trv_temperature,
                low=self.trv_min,
                high=self.trv_max,
            )
        return clamp(target, self.trv_min, self.trv_max)

    async def _call_climate(self, service: str, **data: Any) -> None:
        await self.hass.services.async_call(
            "climate",
            service,
            {ATTR_ENTITY_ID: self.trv, **data},
            blocking=True,
        )

    async def _apply(self, from_measurement: bool = False) -> None:
        """Soll-Zustand berechnen und ans TRV senden (mit Prüfung)."""
        async with self._apply_lock:
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
                        f"Minimaltemperatur {low} °C",
                        lambda: self._call_climate("set_temperature", temperature=low),
                        lambda: self._is_trv_off(self._trv_state(), OFF_MIN_TEMP),
                    )
                return

            # --- an: zuerst Modus, dann Sollwert
            if method == OFF_PRESET:
                preset = self._on_preset()
                if preset:
                    await self.sync.request(
                        "mode",
                        f"Preset '{preset}'",
                        lambda: self._call_climate("set_preset_mode", preset_mode=preset),
                        lambda: self._trv_attr("preset_mode") == preset,
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
                f"Sollwert {setpoint} °C",
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

    @callback
    def _on_sync_event(self, event: str, job: SyncJob) -> None:
        if event == "send":
            self.log(CAT_DEVICE, f"Thermostat: {job.description}", job.why)
        elif event == "confirmed":
            self.log(CAT_DEVICE, f"Thermostat bestätigt: {job.description}", f"nach {job.attempts} Versuchen")
        elif event == "failed":
            self.log(CAT_DEVICE, f"Thermostat reagiert nicht: {job.description}", f"{job.attempts} Versuche ohne Bestätigung – versuche weiter alle 5 min", level="warn")

    # ================================================================ Offset
    def _cal_interval_passed(self) -> bool:
        if self._last_cal_send is None:
            return True
        minutes = float(self.config[CONF_OFFSET_MIN_INTERVAL])
        return dt_util.utcnow() - self._last_cal_send >= timedelta(minutes=minutes)

    async def async_calibrate(self, force: bool = False) -> None:
        """Automatischen Offset berechnen und senden."""
        if self.cal_mode != CAL_OFFSET or not self.cal_entity:
            if self.cal_mode == CAL_TARGET and force:
                self._last_cal_send = None
                self._last_target_setpoint = None
                await self._apply(from_measurement=True)
            return
        if self.paused and not force:
            return  # Zugluft verfälscht den Fühler
        if not self.sensor_ok or not self.trv_available():
            return
        cal_state = self.hass.states.get(self.cal_entity)
        if cal_state is None or cal_state.state == "unavailable":
            return
        if self.sync.is_pending("offset"):
            return  # vorherigen Offset erst bestätigen lassen
        if cal_state.state == "unknown":
            # Tuya-TRVs melden den Offset erst nach dem ersten Setzen. Einmal 0
            # senden, damit ein bekannter Ausgangswert für die Rechnung existiert.
            await self._send_offset(0.0)
            return
        if not force and not self._cal_interval_passed():
            return

        low = max(OFFSET_MIN, to_float(cal_state.attributes.get("min")) or OFFSET_MIN)
        high = min(OFFSET_MAX, to_float(cal_state.attributes.get("max")) or OFFSET_MAX)
        step = to_float(cal_state.attributes.get("step")) or OFFSET_STEP
        new = calc_offset(
            self._ext_value,
            self.trv_temperature,
            to_float(cal_state.state),
            threshold=0.0 if force else float(self.config[CONF_OFFSET_THRESHOLD]),
            low=low,
            high=high,
            step=step,
        )
        if new is None:
            return
        _LOGGER.debug(
            "%s: Offset %s -> %s (Raum %s, TRV %s)",
            self.name,
            cal_state.state,
            new,
            self._ext_value,
            self.trv_temperature,
        )
        await self._send_offset(new)

    async def _send_offset(self, new: float) -> None:
        if not self.cal_entity:
            return
        self._last_cal_send = dt_util.utcnow()
        self._last_cal_value = new
        entity = self.cal_entity
        await self.sync.request(
            "offset",
            f"Offset {new} °C",
            lambda: self.hass.services.async_call(
                "number",
                "set_value",
                {ATTR_ENTITY_ID: entity, "value": new},
                blocking=True,
            ),
            lambda: values_match(
                (self.hass.states.get(entity) or State(entity, "unknown")).state,
                new,
                OFFSET_MATCH_TOLERANCE,
            ),
            why=f"Raumfühler {fmt_temp(self._ext_value)}, Thermostat misst {fmt_temp(self.trv_temperature)}",
        )

    # ================================================================ Meldungen
    def _notification_id(self) -> str:
        return f"{DOMAIN}_{self.entry.entry_id}_sync"

    @callback
    def _on_sync_failed(self, job: SyncJob) -> None:
        hub = self.hub
        if hub and hub.has_targets(KIND_TRV_FAILURE):
            hub.notify(
                KIND_TRV_FAILURE,
                f"⚠️ {self.name}: Thermostat reagiert nicht",
                f"{job.description} wurde nach {job.attempts} Versuchen nicht bestätigt.",
                speak=False,
            )
        notify_bell = hub.opt("notify_on_failure") if hub else self.config[CONF_NOTIFY]
        if not notify_bell:
            return
        persistent_notification.async_create(
            self.hass,
            (
                f"{job.description} wurde nach {job.attempts} Versuchen nicht vom "
                f"Thermostat bestätigt. Raumklima versucht es alle "
                f"{SLOW_RETRY_INTERVAL // 60} min weiter."
            ),
            title=f"Raumklima {self.name}: Thermostat reagiert nicht",
            notification_id=self._notification_id(),
        )

    @callback
    def _on_sync_recovered(self) -> None:
        persistent_notification.async_dismiss(self.hass, self._notification_id())

    # ================================================================ Diagnose
    def diagnostics(self) -> dict[str, Any]:
        return {
            "config": self.config,
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "window_logic": self.window_logic,
            "window_raw": self._window_raw,
            "window_paused": self.window_paused,
            "last_valid_windows": self._last_valid_windows,
            "external_temperature": self._ext_value,
            "external_time": self._ext_time.isoformat() if self._ext_time else None,
            "sensor_ok": self.sensor_ok,
            "trv_available": self.trv_available(),
            "trv_temperature": self.trv_temperature,
            "trv_setpoint": self._trv_attr(ATTR_TEMPERATURE),
            "trv_preset": self._trv_attr("preset_mode"),
            "trv_on_preset": self.trv_on_preset,
            "off_method": self._off_method(),
            "calibration_mode": self.cal_mode,
            "offset": self.offset,
            "last_offset_sent": self._last_cal_value,
            "last_cal_send": self._last_cal_send.isoformat() if self._last_cal_send else None,
            "sync_state": self.sync.state,
            "sync_jobs": {
                key: {"description": job.description, "attempts": job.attempts}
                for key, job in self.sync.jobs.items()
            },
            "status": self.status,
            "plan": list(self.plan()),
            "manual_until": self._manual_until.isoformat() if self._manual_until else None,
            "valve_sensor": self.valve_sensor,
            "valve_position": self.valve_position,
            "ventilation": self.vent.diagnostics() if self.vent else None,
        }

