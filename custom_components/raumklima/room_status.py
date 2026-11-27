"""Status eines Raums: Heizt/Leerlauf/Grund für die Karte (Teil von RaumklimaController)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import HVACAction
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import (
    OFF_SOURCE_TRV,
    OVERHEAT_TRIM_AT,
    STATUS_EXT_HEAT,
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
    STATUS_WAIT,
    STATUS_WINDOW,
    VALVE_HEATING_MIN,
    WAIT_GAP,
)
from .logic import (
    heating_demand,
    to_float,
)
from .planning import (
    AWAY_STAGES,
)
from .room_const import (
    REASON_EXT_HEAT,
    REASON_SEASON,
)

# ------------------------------------------------------------------ Wärmeerzeuger
#: Teile von Entity-IDs, an denen eine Pause des Wärmeerzeugers erkannt wird (binary_sensor, „an“)
SUPPLY_PATTERNS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("dhw", ("warmwasserbetrieb", "dhw_active", "hot_water_active", "dhw_charging")),
    ("defrost", ("abtau", "defrost")),
    ("lock", ("sperrzeit", "evu_lock", "utility_lock")),
)
_SUPPLY_CACHE: dict[str, Any] = {"at": None, "ids": None}


def supply_pause(hass: HomeAssistant) -> dict[str, Any] | None:
    """Liefert der Wärmeerzeuger gerade keine Wärme? Erkennt Wärmepumpen-Status-Sensoren am Namen."""
    now = dt_util.utcnow()
    if _SUPPLY_CACHE["ids"] is None or _SUPPLY_CACHE["at"] is None or (now - _SUPPLY_CACHE["at"]).total_seconds() > 600:
        found: list[tuple[str, str]] = []
        for state in hass.states.async_all("binary_sensor"):
            entity_id = state.entity_id
            for kind, parts in SUPPLY_PATTERNS:
                if any(part in entity_id for part in parts):
                    found.append((kind, entity_id))
                    break
        _SUPPLY_CACHE.update(at=now, ids=found)
    for kind, entity_id in _SUPPLY_CACHE["ids"] or []:
        state = hass.states.get(entity_id)
        if state is not None and state.state == "on":
            return {"kind": kind, "entity": entity_id}
    return None


class StatusMixin:
    """Status eines Raums: Heizt/Leerlauf/Grund für die Karte (Teil von RaumklimaController)."""

    @property
    def hvac_action(self) -> HVACAction:
        """Heizt der Raum? Mit mehreren Thermostaten reicht es, wenn eines heizt (Facebook/Robert)."""
        action = self._main_hvac_action()
        if action == HVACAction.IDLE and any(x.available() and x.heating for x in self.extra_trvs):
            return HVACAction.HEATING
        return action

    def _main_hvac_action(self) -> HVACAction:
        # Die gemeldete Ventilstellung ist das direkteste Signal. Manche Geräte (z. B. Bosch über
        # die SHC-Zentrale) melden „heizt“, solange der Modus Heizen ist – auch bei geschlossenem
        # Ventil (Issue #34). Steht das Ventil nachweislich zu, heizt der Raum nicht – das gilt
        # auch, wenn das Thermostat sein eigenes Programm fährt („Auto“).
        valve = self.valve_position
        if valve is None:
            valve = self._trv_attr("valve_position")
        try:
            closed = valve is not None and float(valve) < VALVE_HEATING_MIN
        except (TypeError, ValueError):
            closed = False
        if self.hvac_auto:
            action = self._trv_attr("hvac_action")
            if closed:
                return HVACAction.IDLE
            return action if action in (HVACAction.HEATING, HVACAction.IDLE) else HVACAction.IDLE
        if not self.hvac_on or self.paused or not self.peek_plan()[0]:
            return HVACAction.OFF
        action = self._trv_attr("hvac_action")
        if closed:
            return HVACAction.IDLE
        if action == HVACAction.HEATING or self._trv_attr("running_state") == "heat":
            return HVACAction.HEATING
        # Manche Geräte (z. B. Homematic IP) lassen hvac_action auf "idle", obwohl das Ventil regelt.
        # Dann entscheidet die Ventilstellung – zusammen mit Soll/Ist, damit "offen, aber Ziel erreicht"
        # nicht als Heizen gilt.
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
        on, _target, reason = self.peek_plan()
        if not on and reason == REASON_SEASON:
            return STATUS_SEASON
        if not on and reason == REASON_EXT_HEAT:
            return STATUS_EXT_HEAT
        if not self.sensor_ok:
            return STATUS_SENSOR
        if reason in AWAY_STAGES:
            return STATUS_SETBACK
        heating = self.hvac_action == HVACAction.HEATING
        under = getattr(self, "_mold_under", None)
        if not heating and under and under.get("reason") in AWAY_STAGES:
            # Schimmelschutz hebt die Absenkung an, der Raum heizt aber nicht: die Absenkung
            # ist weiterhin der eigentliche Zustand (Schild-Symbol zeigt den Boden).
            return STATUS_SETBACK
        if heating:
            return STATUS_HEATING
        cur = self.current_temperature
        if on and cur is not None and _target is not None and float(_target) - cur >= WAIT_GAP:
            # Deutlich unter dem Ziel, das Thermostat meldet aber „heizt nicht“ (tado-Cloud,
            # Heizung noch in der Nachtabsenkung) – nicht als „Temperatur erreicht“ zeigen.
            return STATUS_WAIT
        return STATUS_IDLE

    @property
    def heating_warm(self) -> bool:
        """Gerät heizt, der Raum liegt aber schon deutlich über dem Ziel (tado, Fühler am Heizkörper)."""
        if self.status != STATUS_HEATING:
            return False
        cur, target = self.current_temperature, self.effective_target
        return cur is not None and target is not None and cur >= float(target) + OVERHEAT_TRIM_AT

    @property
    def wait_reason(self) -> dict[str, Any] | None:
        """Warum wartet der Raum auf Wärme? Nur gesetzt, wenn der Status „wartet“ ist.

        Reihenfolge: erst die Heizung selbst (Wärmepumpe lädt Warmwasser, taut ab,
        Sperrzeit), dann das Thermostat (misst am Heizkörper schon genug, Ventil zu).
        """
        if self.status != STATUS_WAIT:
            return None
        pause = supply_pause(self.hass)
        if pause:
            return pause
        trv_cur, trv_target = to_float(self._trv_attr("current_temperature")), to_float(self._trv_attr("temperature"))
        if trv_cur is not None and trv_target is not None and trv_cur >= trv_target - 0.1:
            return {"kind": "trv_satisfied", "value": round(trv_cur, 1)}
        valve = self.valve_position
        if valve is None:
            valve = to_float(self._trv_attr("valve_position"))
        if valve is not None and valve < VALVE_HEATING_MIN:
            return {"kind": "valve_closed"}
        return None
