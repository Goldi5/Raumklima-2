"""Einstellungen des Raums: Übersicht für die Karte und sofort übernehmbare Änderungen.

Teil von ``RaumklimaController`` (als Mixin, damit controller.py überschaubar bleibt)."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import (
    callback,
)

from .const import (
    CONF_AIRING_MIN_MINUTES,
    CONF_BOOST_MINUTES,
    CONF_BOOST_SOURCES,
    CONF_BOOST_TEMP,
    CONF_CALIBRATION_ENTITY,
    CONF_CALIBRATION_MODE,
    CONF_COMFORT_TEMP,
    CONF_FOLLOW_TRV,
    CONF_FLOOR_RETURN,
    CONF_FLOOR_SUPPLY,
    CONF_HOME,
    CONF_HUMIDITY_SENSOR,
    CONF_LIGHTS,
    CONF_LOOK_DARK,
    CONF_AC_MIN_OFF,
    CONF_AC_MIN_ON,
    CONF_AC_HEAT,
    CONF_COOL_SETPOINT,
    CONF_COOLING,
    CONF_MOLD_MODE,
    CONF_NAME,
    CONF_NOTIFY,
    CONF_PM25_SENSOR,
    CONF_OFF_METHOD,
    CONF_ON_PRESET,
    CONF_PRESENCE,
    CONF_PRESENCE_DELAY,
    CONF_PRESENCE_KIND,
    CONF_PRESENCE_LEARN,
    CONF_PRESENCE_LIGHTS,
    CONF_PRESENCE_PIR,
    CONF_PRESENCE_RELEASE,
    CONF_PRESENCE_TARGET,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_TYPE,
    CONF_SCHEDULE_FALLBACK,
    CONF_SCHEDULE_FROM,
    CONF_SCHEDULES,
    CONF_SENSOR_STALE_MINUTES,
    CONF_CO2_SENSOR,
    CONF_SHADING_COVERS,
    CONF_SHADING_MANUAL_MINUTES,
    CONF_SHADING_MIN_TEMP,
    CONF_SHADING_MODE,
    CONF_SHADING_NIGHT,
    CONF_SHADING_OUTDOOR_MIN,
    CONF_SHADING_POSITION,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    CONF_SYNC_MAX_RETRIES,
    CONF_SYNC_VERIFY_DELAY,
    CONF_TEMP_SENSOR,
    CONF_TRV,
    CONF_WEATHER,
    CONF_WINDOWS,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    DEFAULTS,
)
from .decision_log import (
    CAT_SETTINGS,
    fmt_temp,
)
from .hub import _change_text
from .msg import tr
from .room_const import (
    IMPLICIT_DEFAULTS,
    LIVE_OPTIONS,
)

_LOGGER = logging.getLogger(f"{__package__}.controller")  # gleicher Logger-Name wie bisher

# Werte, die nicht in der Raum-Konfiguration stehen, sondern am Gerät/Fühler hängen.
DEVICE_SOURCE_KEYS = {
    CONF_TRV,
    "valve_reported",
    "valve_own",
    "extra_trvs",
    "ac_sources",
    "battery_forecast",
    "rf_per_day",
    "heatup",
    CONF_TEMP_SENSOR,
    CONF_HUMIDITY_SENSOR,
    CONF_CO2_SENSOR,
    CONF_PM25_SENSOR,
    CONF_WINDOWS,
    CONF_SHADING_COVERS,
    CONF_FLOOR_SUPPLY,
    CONF_FLOOR_RETURN,
    "presence_sensors",
    "virtual_active",
}

_MISSING = object()

# Struktur und Gerätezugehörigkeit sind keine Einstellungen mit Herkunft.
STRUCTURE_KEYS = {
    CONF_NAME,
    CONF_HOME,
    CONF_ROOM_TYPE,
    CONF_CALIBRATION_MODE,
    CONF_CALIBRATION_ENTITY,
} | DEVICE_SOURCE_KEYS


class SettingsMixin:
    """Einstellungen des Raums: Übersicht für die Karte und sofort übernehmbare Änderungen."""

    def thermal_summary(self) -> dict[str, Any]:
        """Gelerntes Wärmemodell für die Lernkarte und die Diagnose."""
        return self.heatup.summary(self.hub.outdoor_temp() if self.hub else None)

    @staticmethod
    def _setting_sources(own: dict[str, Any]) -> dict[str, str]:
        """Herkunft eines effektiven Werts: Standard, Wohnung, Raum oder Gerät.

        Phase 4 schickt die Herkunft mit, damit die Karte nicht raten muss. Es gibt
        noch keine Wohnung-Defaults für Raumwerte; ``home`` bleibt für spätere
        Ausbaustufen reserviert und wird erst gesetzt, wenn ein solcher Wert existiert.
        """
        sources: dict[str, str] = {}
        for key in set(DEFAULTS) | set(own):
            if key in DEVICE_SOURCE_KEYS:
                sources[key] = "device"
                continue
            value = own.get(key, _MISSING)
            if value is _MISSING or value in (None, "", [], {}):
                sources[key] = "default"
                continue
            default = DEFAULTS.get(key, IMPLICIT_DEFAULTS.get(key, _MISSING))
            sources[key] = "room" if default is _MISSING or value != default else "default"
        return sources

    @callback
    def settings_summary(self) -> dict[str, Any]:
        """Was eingestellt ist – für die Einstellungs-Karte."""
        cfg = self.config
        vent = self.vent
        hub = self.hub
        entry = self.hass.config_entries.async_get_entry(self.entry.entry_id) or self.entry
        own = {**(entry.data or {}), **(entry.options or {})}
        # Struktur (Raumtyp, erkannte Abgleichart) ist keine Einstellung – nicht mitzählen.
        changed = sorted(
            k
            for k, v in own.items()
            if k not in STRUCTURE_KEYS
            and v not in (None, "", [], {})
            and (DEFAULTS.get(k, IMPLICIT_DEFAULTS.get(k, _MISSING)) is _MISSING
                 or v != DEFAULTS.get(k, IMPLICIT_DEFAULTS.get(k)))
        )
        return {
            "entry_id": self.entry.entry_id,
            "mold_mode": self.config.get(CONF_MOLD_MODE),
            "cooling": bool(self.config.get(CONF_COOLING)),
            "cool_setpoint": self.config.get(CONF_COOL_SETPOINT),
            "ac_heat": bool(self.config.get(CONF_AC_HEAT)),
            "ac_heat_active": self.ac_heat_active,
            "ac_heat_cheaper": hub.ac_heat_cheaper() if hub is not None else False,
            "ac_min_on": self.config.get(CONF_AC_MIN_ON),
            "ac_min_off": self.config.get(CONF_AC_MIN_OFF),
            "airing_min_minutes": self.config.get(CONF_AIRING_MIN_MINUTES),
            "schedule_fallback": self.config.get(CONF_SCHEDULE_FALLBACK),
            "changed": changed,
            "sources": self._setting_sources(own),
            "trv": self.trv,
            "valve_reported": self.valve_position is not None,
            "valve_own": self.valve_own,
            "room_type": vent.room_type if vent else cfg.get(CONF_ROOM_TYPE),
            "weather_entity": vent.weather if vent else cfg.get(CONF_WEATHER),
            "notify_targets": vent.notify_targets if vent else [],
            "tts_targets": vent.tts_targets if vent else [],
            "quiet_start": vent.quiet_start if vent else None,
            "quiet_end": vent.quiet_end if vent else None,
            "repeat_minutes": vent.repeat_minutes if vent else None,
            "max_drop": vent.max_drop if vent else None,
            "hub": bool(hub),
            "look_dark": hub.opt(CONF_LOOK_DARK) if hub is not None else "auto",
            "comfort_temperature": cfg.get(CONF_COMFORT_TEMP),
            "setback_short": self.setback_short,
            "setback_long": self.setback_long,
            "night_airing": self.night_mode,
            "virtual_window": self.virtual_mode,
            "solar_gain": bool(self.config.get(CONF_SOLAR)),
            "solar_facade": self.config.get(CONF_SOLAR_FACADE) or "",
            "shading": self.shading_summary(),
            "floor": self.floor_summary(),
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
            "ac_sources": [x.summary() for x in self.ac_sources],
            "heat_sources": [
                {k: src.get(k) for k in ("id", "entity", "name", "type", "offset", "trigger", "untouched")}
                for src in self.all_sources
            ],
            "boost_sources": self.config.get(CONF_BOOST_SOURCES) or "selected",
            "signal_lights": self.lights.lights,
            "light_signals": self.lights.signals,
            "virtual_active": self.virtual_enabled(),
            "battery_forecast": self.battery_forecast(),
            "rf_per_day": None if self.rf_per_day is None else round(self.rf_per_day),
            "heatup": {
                "episodes": len(self.heatup.episodes),
                "rate": self.heatup.rate(self.hub.outdoor_temp() if self.hub else None),
                "minutes_2k": self.heatup.minutes_needed(2.0, self.hub.outdoor_temp() if self.hub else None),
            },
            "thermal": self.thermal_summary(),
            "usage": self.usage_summary,
            "airing": self.airing.summary(),
            "airing_top": self.airing.typical(),
            "current_temperature": self.current_temperature,
            "target_temperature": self.effective_target,
            "outdoor_temperature": hub.outdoor_temp() if hub is not None else None,
            "valve_position": self.valve_position,
            "valve": self.valve_summary(),
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
                    tr("neuer Sollwert {t} aus den Einstellungen", t=fmt_temp(new_wish)),
                )
        if changed.keys() & {
            CONF_PRESENCE, CONF_PRESENCE_KIND, CONF_ROOM_ECO, CONF_ROOM_ECO_AFTER, CONF_ROOM_ECO_DROP,
            CONF_PRESENCE_LIGHTS, CONF_PRESENCE_LEARN,
            CONF_PRESENCE_TARGET, CONF_PRESENCE_DELAY, CONF_PRESENCE_RELEASE, CONF_PRESENCE_PIR,
        }:
            self.track_presence()
            self.update_presence()
        if self.virtual_open_at is not None and not self.virtual_enabled():
            self._close_virtual("off")
        if changed.keys() & {
            CONF_SHADING_MODE, CONF_SHADING_POSITION, CONF_SHADING_MIN_TEMP,
            CONF_SHADING_OUTDOOR_MIN, CONF_SHADING_NIGHT, CONF_SHADING_MANUAL_MINUTES,
        }:
            self.hass.async_create_task(self.async_evaluate_shading())
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
