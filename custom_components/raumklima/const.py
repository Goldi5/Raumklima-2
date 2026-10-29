"""Konstanten für die Raumklima-Integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "raumklima"
PLATFORMS: Final = ["climate", "sensor", "binary_sensor", "switch", "button"]

# --- Geräte (config entry data) ---
CONF_NAME: Final = "name"
CONF_TRV: Final = "trv"
CONF_TEMP_SENSOR: Final = "temperature_sensor"
CONF_HUMIDITY_SENSOR: Final = "humidity_sensor"
CONF_WINDOWS: Final = "window_sensors"
CONF_CALIBRATION_MODE: Final = "calibration_mode"
CONF_CALIBRATION_ENTITY: Final = "calibration_entity"
CONF_OFF_METHOD: Final = "off_method"

# --- Einstellungen (options) ---
CONF_WINDOW_OPEN_DELAY: Final = "window_open_delay"
CONF_WINDOW_CLOSE_DELAY: Final = "window_close_delay"
CONF_OFFSET_THRESHOLD: Final = "offset_threshold"
CONF_OFFSET_MIN_INTERVAL: Final = "offset_min_interval"
CONF_SENSOR_STALE_MINUTES: Final = "sensor_stale_minutes"
CONF_SYNC_VERIFY_DELAY: Final = "sync_verify_delay"
CONF_SYNC_MAX_RETRIES: Final = "sync_max_retries"
CONF_FOLLOW_TRV: Final = "follow_trv_changes"
CONF_NOTIFY: Final = "notify_on_failure"

# Kalibrierarten
CAL_OFFSET: Final = "offset"
CAL_TARGET: Final = "target"
CAL_NONE: Final = "none"
CALIBRATION_MODES: Final = [CAL_OFFSET, CAL_TARGET, CAL_NONE]

# Wie das TRV ausgeschaltet wird
OFF_AUTO: Final = "auto"
OFF_PRESET: Final = "preset"
OFF_HVAC: Final = "hvac"
OFF_MIN_TEMP: Final = "min_temp"
OFF_METHODS: Final = [OFF_AUTO, OFF_PRESET, OFF_HVAC, OFF_MIN_TEMP]

DEFAULTS: Final = {
    CONF_CALIBRATION_MODE: CAL_OFFSET,
    CONF_OFF_METHOD: OFF_AUTO,
    CONF_WINDOW_OPEN_DELAY: 10,
    CONF_WINDOW_CLOSE_DELAY: 10,
    CONF_OFFSET_THRESHOLD: 0.3,
    CONF_OFFSET_MIN_INTERVAL: 5,
    CONF_SENSOR_STALE_MINUTES: 60,
    CONF_SYNC_VERIFY_DELAY: 20,
    CONF_SYNC_MAX_RETRIES: 5,
    CONF_FOLLOW_TRV: True,
    CONF_NOTIFY: True,
}

# Feste Grenzen
OFFSET_MIN: Final = -10.0
OFFSET_MAX: Final = 10.0
OFFSET_STEP: Final = 0.1
OFFSET_MATCH_TOLERANCE: Final = 0.15
SETPOINT_MATCH_TOLERANCE: Final = 0.25
MAX_SENSOR_JUMP: Final = 3.0  # °C – größere Sprünge gelten als Ausreißer
SENSOR_JUMP_WINDOW: Final = 300  # s
RECONCILE_INTERVAL: Final = 600  # s – regelmäßiger Abgleich
CALIBRATION_INTERVAL: Final = 600  # s
SLOW_RETRY_INTERVAL: Final = 300  # s – nach max. Versuchen weiter alle 5 min

# Vorgaben für "an"-Presets, falls kein früheres Preset bekannt ist
ON_PRESET_CANDIDATES: Final = ["manual", "on", "heat", "comfort", "none"]

# Zustände
INVALID_STATES: Final = ("unavailable", "unknown", None)

STATUS_HEATING: Final = "heating"
STATUS_IDLE: Final = "idle"
STATUS_WINDOW: Final = "window_open"
STATUS_OFF: Final = "off"
STATUS_SENSOR: Final = "sensor_unavailable"
STATUS_TRV: Final = "trv_unavailable"
STATUSES: Final = [
    STATUS_HEATING,
    STATUS_IDLE,
    STATUS_WINDOW,
    STATUS_OFF,
    STATUS_SENSOR,
    STATUS_TRV,
]

SYNC_OK: Final = "ok"
SYNC_PENDING: Final = "pending"
SYNC_FAILED: Final = "failed"
SYNC_STATES: Final = [SYNC_OK, SYNC_PENDING, SYNC_FAILED]
