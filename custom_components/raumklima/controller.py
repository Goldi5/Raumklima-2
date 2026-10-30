"""Kernlogik: ein Raum mit TRV, externem Fühler und Fensterkontakten."""

from __future__ import annotations

import asyncio
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
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CALIBRATION_INTERVAL,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
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
    CONF_WINDOWS,
    DEFAULTS,
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
    CONF_ON_PRESET,
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
    STATUS_SENSOR,
    STATUS_TRV,
    STATUS_WINDOW,
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

_LOGGER = logging.getLogger(__name__)
STORAGE_VERSION = 1


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
        self._last_valid_windows: dict[str, str | None] = {}
        self._window_timer: Callable[[], None] | None = None
        self._ext_value: float | None = None
        self._ext_time: datetime | None = None
        self._ext_candidate: float | None = None
        self._last_cal_send: datetime | None = None
        self._last_cal_value: float | None = None
        self._last_target_setpoint: float | None = None
        self._unsubs: list[Callable[[], None]] = []
        self._listeners: list[Callable[[], None]] = []
        self._apply_lock = asyncio.Lock()
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}"
        )

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
        )

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
            # Erster Start: aktuelle TRV-Einstellung übernehmen statt zu überschreiben
            trv_target = to_float(self._trv_attr(ATTR_TEMPERATURE))
            if trv_target is not None:
                self.target_temp = trv_target
            self.hvac_on = not self._is_trv_off(self._trv_state(), self._off_method())
            preset = self._trv_attr("preset_mode")
            if preset and preset != "off":
                self.trv_on_preset = preset
            self._save()

        tracked = [self.trv, self.temp_sensor, *self.windows]
        if self.humidity_sensor:
            tracked.append(self.humidity_sensor)
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
        self._ingest_sensor(self.hass.states.get(self.temp_sensor))

        self.hass.async_create_task(self._apply())
        self.hass.async_create_task(self.async_calibrate())

    async def async_stop(self) -> None:
        """Alles abmelden."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        if self._window_timer:
            self._window_timer()
            self._window_timer = None
        self.sync.cancel_all()
        await self._store.async_save(self._stored_data())

    def _stored_data(self) -> dict[str, Any]:
        return {
            "target_temp": self.target_temp,
            "hvac_on": self.hvac_on,
            "window_logic": self.window_logic,
            "trv_on_preset": self.trv_on_preset,
        }

    def _save(self) -> None:
        self._store.async_delay_save(self._stored_data, 5)

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

    @property
    def hvac_action(self) -> HVACAction:
        if not self.hvac_on or self.paused:
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
            return STATUS_WINDOW
        if not self.sensor_ok:
            return STATUS_SENSOR
        if self.hvac_action == HVACAction.HEATING:
            return STATUS_HEATING
        return STATUS_IDLE

    # ================================================================ Bedienung
    async def async_set_target(self, temperature: float) -> None:
        self.target_temp = clamp(float(temperature), self.trv_min, self.trv_max)
        self._save()
        self._notify()
        await self._apply()

    async def async_set_hvac_on(self, on: bool) -> None:
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
        self._ext_value = value
        self._ext_time = now
        return True

    def _on_window(self, entity_id: str, new: State | None) -> None:
        if new is None or not is_valid(new.state):
            return  # Verbindungsabbruch: letzten echten Zustand behalten
        self._last_valid_windows[entity_id] = new.state
        self._evaluate_windows()

    def _evaluate_windows(self) -> None:
        raw = any_open(self._last_valid_windows, self.windows)
        if raw == self._window_raw and (self._window_timer or raw == self.window_paused):
            return
        self._window_raw = raw
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
            self._notify()
            self.hass.async_create_task(self._apply())

    def _on_trv(self, old: State | None, new: State | None) -> None:
        was_ok = old is not None and is_valid(old.state)
        is_ok = new is not None and is_valid(new.state)
        if is_ok and not was_ok:
            _LOGGER.info("%s: TRV wieder erreichbar – sende Ausstehendes", self.name)
            self.hass.async_create_task(self.sync.retry_all_now())
            return
        if not (is_ok and was_ok):
            return
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
            else:
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
        if follow:
            _LOGGER.info("%s: Sollwert am TRV geändert auf %s", self.name, new_t)
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
        if self.cal_mode == CAL_TARGET and self.sensor_ok:
            return calc_target_setpoint(
                self.target_temp,
                self._ext_value,
                self.trv_temperature,
                low=self.trv_min,
                high=self.trv_max,
            )
        return clamp(self.target_temp, self.trv_min, self.trv_max)

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
            want_on = self.hvac_on and not self.paused

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
        if cal_state is None or not is_valid(cal_state.state):
            return
        if not force and not self._cal_interval_passed():
            return
        if self.sync.is_pending("offset"):
            return  # vorherigen Offset erst bestätigen lassen

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
        )

    # ================================================================ Meldungen
    def _notification_id(self) -> str:
        return f"{DOMAIN}_{self.entry.entry_id}_sync"

    @callback
    def _on_sync_failed(self, job: SyncJob) -> None:
        if not self.config[CONF_NOTIFY]:
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
        }

