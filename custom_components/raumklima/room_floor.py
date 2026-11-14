"""Fußbodenheizung: eigene Regelcharakteristik, Vor-/Rücklauf und Trägheit.

Teil von ``RaumklimaController``. Die Fußbodenheizung ist träge: ein enger
Sollwertsprung am Thermostat führt zu Überschwingen. Deshalb wird der Sollwert
auf ein eigenes Band begrenzt und nur im eingestellten Takt nachgezogen. Die
Vor-/Rücklauffühler sind optional und dienen vor allem der Anzeige und der
Durchfluss-Prüfung.
"""

from __future__ import annotations

from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    CONF_FLOOR_BAND,
    CONF_FLOOR_CYCLE_MIN,
    CONF_FLOOR_FLOW_MIN,
    CONF_FLOOR_HEATING,
    CONF_FLOOR_LEAD_MIN,
    CONF_FLOOR_MAX_TEMP,
    CONF_FLOOR_MIN_TEMP,
    CONF_FLOOR_RETURN,
    CONF_FLOOR_SUPPLY,
)
from .logic import clamp, round_device, to_float

STATE_OFF = "off"
STATE_NO_SENSORS = "no_sensors"
STATE_OK = "ok"
STATE_LOW_FLOW = "low_flow"


class FloorMixin:
    """Regelcharakteristik und Zustand einer Fußbodenheizung."""

    @property
    def floor_mode(self) -> bool:
        return bool(self.config.get(CONF_FLOOR_HEATING)) and not self.monitor

    @property
    def floor_supply_entity(self) -> str:
        return str(self.config.get(CONF_FLOOR_SUPPLY) or "")

    @property
    def floor_return_entity(self) -> str:
        return str(self.config.get(CONF_FLOOR_RETURN) or "")

    @property
    def floor_min_temp(self) -> float:
        value = to_float(self.config.get(CONF_FLOOR_MIN_TEMP))
        return 18.0 if value is None else value

    @property
    def floor_max_temp(self) -> float:
        value = to_float(self.config.get(CONF_FLOOR_MAX_TEMP))
        return 27.0 if value is None else value

    def _floor_sensor_temp(self, entity_id: str) -> float | None:
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        return None if state is None else to_float(state.state)

    def floor_target(self, target: float) -> float:
        """Ziel auf das zulässige Fenster der Fußbodenheizung begrenzen."""
        low = min(self.floor_min_temp, self.floor_max_temp)
        high = max(self.floor_min_temp, self.floor_max_temp)
        return clamp(float(target), low, high)

    def floor_setpoint(self, target: float) -> float:
        """Sollwert mit Trägheit: nur im Takt nachziehen, innerhalb des Bandes halten."""
        value = self.floor_target(target)
        now = dt_util.utcnow()
        last = getattr(self, "_floor_last_setpoint", None)
        changed = getattr(self, "_floor_last_change", None)
        cycle = max(0, int(to_float(self.config.get(CONF_FLOOR_CYCLE_MIN)) or 0))
        if last is not None and changed is not None and cycle and (now - changed).total_seconds() < cycle * 60:
            return last
        band = max(0.0, to_float(self.config.get(CONF_FLOOR_BAND)) or 0.0)
        current = self.current_temperature
        if last is not None and current is not None and abs(current - value) <= band:
            return last
        rounded = round_device(value, 0.5)
        if last is None or abs(rounded - last) >= 0.01:
            self._floor_last_setpoint = rounded
            self._floor_last_change = now
        return rounded

    def floor_summary(self) -> dict[str, Any]:
        """Zustand für Einstellungen, Karte und Diagnose."""
        enabled = self.floor_mode
        supply = self._floor_sensor_temp(self.floor_supply_entity)
        ret = self._floor_sensor_temp(self.floor_return_entity)
        delta = None if supply is None or ret is None else round(supply - ret, 1)
        on, target, _reason = self.peek_plan()
        heating = bool(enabled and on and self.hvac_on and not self.paused)
        flow_ok = None
        if delta is not None and heating:
            flow_ok = delta >= (to_float(self.config.get(CONF_FLOOR_FLOW_MIN)) or 0.0)
        if not enabled:
            state = STATE_OFF
        elif delta is None:
            state = STATE_NO_SENSORS
        elif flow_ok is False:
            state = STATE_LOW_FLOW
        else:
            state = STATE_OK
        return {
            "enabled": enabled,
            "supply": supply,
            "return": ret,
            "delta": delta,
            "flow_ok": flow_ok,
            "state": state,
            "target": round(target, 1),
            "setpoint": (getattr(self, "_floor_last_setpoint", None) if getattr(self, "_floor_last_setpoint", None) is not None else self.floor_target(target)) if enabled else None,
            "min_temp": self.floor_min_temp,
            "max_temp": self.floor_max_temp,
            "band": to_float(self.config.get(CONF_FLOOR_BAND)),
            "cycle_min": self.config.get(CONF_FLOOR_CYCLE_MIN),
            "lead_min": self.config.get(CONF_FLOOR_LEAD_MIN),
            "flow_min": to_float(self.config.get(CONF_FLOOR_FLOW_MIN)),
        }
