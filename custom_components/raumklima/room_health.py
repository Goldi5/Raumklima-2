"""Gesundheitscheck, Bericht-Stichproben und Diagnose eines Raums."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import ATTR_TEMPERATURE
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import (
    STATUS_HEATING,
)
from .decision_log import (
    CAT_DEVICE,
    CAT_TARGET,
    fmt_temp,
)
from .health import (
    HistoryPoint,
    Issue,
    check_battery,
    check_hydraulic,
    check_not_warming,
    check_radio,
    check_sensor_frozen,
    check_sensor_missing,
    check_window,
)
from .logic import (
    to_float,
)
from .stats import RoomSample

_LOGGER = logging.getLogger(__name__)


class HealthMixin:
    """Gesundheits- und Diagnose-Teil des Raum-Controllers."""

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

    def heatup_needed(self) -> int | None:
        """Minuten bis zur Wunschtemperatur, wenn jetzt normal geheizt würde."""
        hub = self.hub
        cur = self.current_temperature
        if hub is None or cur is None or not self.hvac_on or not hub.heating_allowed:
            return None
        return self.heatup.minutes_needed(self.target_temp - cur, hub.outdoor_temp())

    def record_history(self, now: datetime) -> None:
        on, target, _reason = self.plan()
        hub = self.hub
        regulating = on and self.hvac_on and not self.paused and self.trv_available() and self.sensor_ok
        ep = self.heatup.update(now, self.current_temperature, target, regulating, hub.outdoor_temp() if hub else None)
        if ep is not None:
            self.log(
                CAT_TARGET,
                f"Aufgeheizt: +{fmt_temp(ep.rise)} in {ep.minutes:.0f} min",
                f"{ep.rate:.1f} °C pro Stunde".replace(".", ",")
                + (f" bei {fmt_temp(ep.outdoor)} draußen" if ep.outdoor is not None else "")
                + f" – gelernt aus {len(self.heatup.episodes)} Aufheizvorgängen",
            )
            self._save()
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
            check_hydraulic(list(self.health_hist), now) if self.valve_sensor else None,
            check_sensor_frozen(
                (now - self._ext_changed_at).total_seconds() / 3600 if self._ext_changed_at else None,
                (self.trv_temperature - self._trv_at_ext_change)
                if self.trv_temperature is not None and self._trv_at_ext_change is not None
                else None,
            ),
            Issue("throttled", "warn", "Thermostat und Integration verstellen sich", "Zu viele Befehle in kurzer Zeit – die Integration pausiert kurz. Zeitplan/Automatik am Thermostat oder andere Automationen prüfen.")
            if self.throttled_until and now < self.throttled_until else None,
            check_sensor_missing(
                None if self.sensor_ok else (now - (self._ext_time or self._started_at)).total_seconds() / 3600
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

    def _trv_down_confirmed(self) -> None:
        self._trv_down_cancel = None
        if self._trv_down_since is None or self.trv_available():
            return
        self._unavail_events.append(self._trv_down_since)
        self.log(
            CAT_DEVICE,
            "Thermostat nicht erreichbar",
            "seit über einer Minute keine Verbindung – letzter Stand bleibt, Befehle werden nachgeholt",
            level="warn",
        )

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
