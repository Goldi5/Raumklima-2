"""Mehrere Heizkörper im Raum: weitere Thermostate laufen mit dem Haupt-Thermostat mit.

Das Haupt-Thermostat regelt wie gewohnt (Entscheidungen, Lernen, Bremse bei zu vielen Befehlen).
Jedes weitere Thermostat bekommt dieselben Befehle – an/aus, Preset, Sollwert – aber mit eigener
Prüfung und Wiederholung (eigener SyncManager) und eigenem Korrekturwert: Offset-Kalibrierung bzw.
Sollwert-Ausgleich nach seiner eigenen Temperatur. Fällt eins aus, heizen die anderen weiter; der
Gesundheitscheck meldet es.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.const import ATTR_ENTITY_ID, ATTR_TEMPERATURE
from homeassistant.core import State, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import (
    CAL_OFFSET,
    CAL_TARGET,
    CONF_ON_PRESET,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    OFF_HVAC,
    OFF_MIN_TEMP,
    OFF_PRESET,
    OFFSET_MATCH_TOLERANCE,
    OFFSET_MAX,
    OFFSET_MIN,
    OFFSET_STEP,
    ON_PRESET_AUTO,
    ON_PRESET_AVOID,
    ON_PRESET_CANDIDATES,
    SETPOINT_MATCH_TOLERANCE,
    SLOW_RETRY_INTERVAL,
)
from .decision_log import CAT_DEVICE, fmt_temp
from .health import Issue
from .logic import calc_offset, calc_target_setpoint, choose_on_preset, clamp, is_valid, to_float, values_match
from .sync import SyncJob, SyncManager

if TYPE_CHECKING:
    from .controller import RaumklimaController

_LOGGER = logging.getLogger(__name__)
HEAT_PRESETS = frozenset({"manual", "heat", "eco", "comfort", "none"})


class ExtraTrv:
    """Ein weiteres Thermostat im Raum."""

    def __init__(self, controller: RaumklimaController, entity_id: str) -> None:
        self.c = controller
        self.hass = controller.hass
        self.entity_id = entity_id
        self.cal_entity: str | None = None
        self.valve_sensor: str | None = None
        self.sync = SyncManager(
            schedule=controller._schedule,
            run_task=lambda coro: controller.hass.async_create_task(coro),
            is_target_available=self.available,
            verify_delay=float(controller.config[CONF_SYNC_VERIFY_DELAY]),
            max_retries=int(controller.config[CONF_SYNC_MAX_RETRIES]),
            slow_interval=SLOW_RETRY_INTERVAL,
            on_change=controller._notify,
            on_event=self._on_event,
        )

    # ------------------------------------------------------------ Gerät
    def discover(self) -> None:
        """Offset-Entität und Ventilstellung am selben Gerät suchen."""
        if self.c.cal_mode == CAL_OFFSET:
            from .config_flow import find_calibration_entity

            self.cal_entity = find_calibration_entity(self.hass, self.entity_id)
        registry = er.async_get(self.hass)
        entry = registry.async_get(self.entity_id)
        if entry and entry.device_id:
            for cand in er.async_entries_for_device(registry, entry.device_id):
                if cand.domain == "sensor" and ("position" in cand.entity_id or cand.translation_key == "position"):
                    self.valve_sensor = cand.entity_id
                    break

    @property
    def name(self) -> str:
        st = self.state
        if st is not None and st.name:
            return st.name
        registry = er.async_get(self.hass)
        entry = registry.async_get(self.entity_id)
        if entry and entry.device_id:
            dev = dr.async_get(self.hass).async_get(entry.device_id)
            if dev:
                return dev.name_by_user or dev.name or self.entity_id
        return self.entity_id

    @property
    def state(self) -> State | None:
        return self.hass.states.get(self.entity_id)

    def attr(self, key: str, default: Any = None) -> Any:
        st = self.state
        return st.attributes.get(key, default) if st else default

    def available(self) -> bool:
        st = self.state
        return st is not None and is_valid(st.state)

    @property
    def temperature(self) -> float | None:
        return to_float(self.attr("current_temperature"))

    @property
    def tmin(self) -> float:
        return to_float(self.attr("min_temp")) or 5.0

    @property
    def tmax(self) -> float:
        return to_float(self.attr("max_temp")) or 30.0

    @property
    def valve(self) -> float | None:
        if not self.valve_sensor:
            return None
        st = self.hass.states.get(self.valve_sensor)
        return to_float(st.state) if st else None

    def tracked(self) -> list[str]:
        return [e for e in (self.entity_id, self.cal_entity) if e]

    # ------------------------------------------------------------ Befehle
    async def _call(self, service: str, **data: Any) -> None:
        await self.hass.services.async_call("climate", service, {ATTR_ENTITY_ID: self.entity_id, **data}, blocking=True)

    def _is_off(self, method: str) -> bool:
        st = self.state
        if st is None or not is_valid(st.state):
            return False
        if method == OFF_PRESET:
            return st.attributes.get("preset_mode") == "off"
        if method == OFF_HVAC:
            return st.state == "off"
        return values_match(st.attributes.get(ATTR_TEMPERATURE), self.tmin, SETPOINT_MATCH_TOLERANCE)

    def _on_preset(self) -> str | None:
        available = self.attr("preset_modes") or []
        if self.c.preset_learned and self.c.preset_learned in available:
            return self.c.preset_learned
        return choose_on_preset(
            available,
            self.c.config.get(CONF_ON_PRESET),
            self.c.trv_on_preset if self.c.trv_on_preset in available else None,
            candidates=ON_PRESET_CANDIDATES,
            avoid=ON_PRESET_AVOID,
            auto_value=ON_PRESET_AUTO,
        )

    def setpoint_for(self, target: float) -> float:
        """Sollwert für dieses Thermostat (Sollwert-Ausgleich nach seiner eigenen Temperatur)."""
        if self.c.cal_mode == CAL_TARGET and self.c.sensor_ok:
            return calc_target_setpoint(target, self.c._ext_value, self.temperature, low=self.tmin, high=self.tmax)
        return clamp(target, self.tmin, self.tmax)

    async def apply(self, want_on: bool, method: str, target: float) -> None:
        """Denselben Zustand wie das Haupt-Thermostat herstellen."""
        if not want_on:
            self.sync.cancel("setpoint")
            if method == OFF_PRESET and "off" in (self.attr("preset_modes") or []):
                await self.sync.request("mode", "Preset 'off'", lambda: self._call("set_preset_mode", preset_mode="off"), lambda: self._is_off(OFF_PRESET))
            elif method in (OFF_PRESET, OFF_HVAC) and "off" in (self.attr("hvac_modes") or []):
                await self.sync.request("mode", "HVAC 'off'", lambda: self._call("set_hvac_mode", hvac_mode="off"), lambda: self._is_off(OFF_HVAC))
            else:
                low = self.tmin
                await self.sync.request(
                    "mode", f"Minimaltemperatur {fmt_temp(low)}", lambda: self._call("set_temperature", temperature=low), lambda: self._is_off(OFF_MIN_TEMP)
                )
            return
        if method == OFF_PRESET:
            preset = self._on_preset()
            current = self.attr("preset_mode")
            if current in HEAT_PRESETS and current != "none" or (current == "none" and preset == "none"):
                self.sync.cancel("mode")
            elif preset:
                await self.sync.request(
                    "mode", f"Preset '{preset}'", lambda: self._call("set_preset_mode", preset_mode=preset), lambda: self.attr("preset_mode") in HEAT_PRESETS
                )
        elif method == OFF_HVAC or (self.state is not None and self.state.state == "off"):
            modes = [m for m in (self.attr("hvac_modes") or []) if m != "off"]
            hvac = "heat" if "heat" in modes else (modes[0] if modes else "heat")
            await self.sync.request(
                "mode", f"HVAC '{hvac}'", lambda: self._call("set_hvac_mode", hvac_mode=hvac), lambda: self.available() and self.state.state != "off"
            )
        else:
            self.sync.cancel("mode")
        setpoint = self.setpoint_for(target)
        await self.sync.request(
            "setpoint",
            f"Sollwert {fmt_temp(setpoint)}",
            lambda: self._call("set_temperature", temperature=setpoint),
            lambda: values_match(self.attr(ATTR_TEMPERATURE), setpoint, SETPOINT_MATCH_TOLERANCE),
        )

    async def calibrate(self, force: bool = False) -> None:
        """Offset nach der eigenen Temperatur (wie beim Haupt-Thermostat)."""
        if self.c.cal_mode != CAL_OFFSET or not self.cal_entity or not self.c.sensor_ok or not self.available():
            return
        if self.c.paused and not force:
            return
        cal = self.hass.states.get(self.cal_entity)
        if cal is None or cal.state == "unavailable" or self.sync.is_pending("offset"):
            return
        if cal.state == "unknown":
            await self._send_offset(0.0)
            return
        new = calc_offset(
            self.c._ext_value,
            self.temperature,
            to_float(cal.state),
            threshold=0.0 if force else float(self.c.config.get("offset_threshold", 0.3)),
            low=max(OFFSET_MIN, to_float(cal.attributes.get("min")) or OFFSET_MIN),
            high=min(OFFSET_MAX, to_float(cal.attributes.get("max")) or OFFSET_MAX),
            step=to_float(cal.attributes.get("step")) or OFFSET_STEP,
        )
        if new is not None:
            await self._send_offset(new)

    async def _send_offset(self, new: float) -> None:
        entity = self.cal_entity
        if not entity:
            return
        await self.sync.request(
            "offset",
            f"Offset {fmt_temp(new)}",
            lambda: self.hass.services.async_call("number", "set_value", {ATTR_ENTITY_ID: entity, "value": new}, blocking=True),
            lambda: values_match((self.hass.states.get(entity) or State(entity, "unknown")).state, new, OFFSET_MATCH_TOLERANCE),
            why=f"Raumfühler {fmt_temp(self.c._ext_value)}, Thermostat misst {fmt_temp(self.temperature)}",
        )

    @callback
    def _on_event(self, event: str, job: SyncJob) -> None:
        if event == "send":
            self.c.log(CAT_DEVICE, f"{self.name}: {job.description}", job.why)
        elif event == "failed":
            self.c.log(CAT_DEVICE, f"{self.name} reagiert nicht: {job.description}", f"{job.attempts} Versuche ohne Bestätigung", level="warn")

    def issues(self) -> list[Issue]:
        if not self.available():
            return [Issue(f"extra_trv_down:{self.entity_id}", "warn", f"{self.name} nicht erreichbar", "Ein weiteres Thermostat im Raum meldet sich nicht – Batterie oder Funk prüfen. Die anderen Heizkörper heizen weiter.")]
        if self.sync.state == "failed":
            return [Issue(f"extra_trv_sync:{self.entity_id}", "warn", f"{self.name} reagiert nicht", "Befehle an dieses Thermostat werden nicht bestätigt – es wird weiter versucht.")]
        return []

    def summary(self) -> dict[str, Any]:
        return {
            "entity_id": self.entity_id,
            "name": self.name,
            "available": self.available(),
            "temperature": self.temperature,
            "setpoint": to_float(self.attr(ATTR_TEMPERATURE)),
            "valve": self.valve,
            "sync": self.sync.state,
            "calibration_entity": self.cal_entity,
        }

    def stop(self) -> None:
        self.sync.cancel_all()
