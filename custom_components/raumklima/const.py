"""Konstanten für die Raumklima-Integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "raumklima"
PLATFORMS: Final = ["climate", "sensor", "binary_sensor", "switch", "button", "number"]
HUB_PLATFORMS: Final = ["sensor", "switch", "select", "button"]

# Eintragsarten: ein Raum oder die Zentrale „Allgemein“ (einmal)
CONF_ENTRY_TYPE: Final = "entry_type"
ENTRY_HUB: Final = "hub"
HUB_UNIQUE_ID: Final = "raumklima_hub"

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

# --- Lüften & Benachrichtigung (v0.2) ---
CONF_ROOM_TYPE: Final = "room_type"
CONF_WEATHER: Final = "weather_entity"
CONF_NOTIFY_TARGETS: Final = "notify_targets"
CONF_TTS_TARGETS: Final = "tts_targets"
CONF_QUIET_START: Final = "quiet_start"
CONF_QUIET_END: Final = "quiet_end"
CONF_REPEAT_MINUTES: Final = "repeat_minutes"
CONF_COMFORT_TEMP: Final = "comfort_temperature"
NOTIFY_ACTION_EVENT: Final = "mobile_app_notification_action"
EVENT_RAUMKLIMA: Final = "raumklima_event"
ROOM_TYPE_OPTIONS: Final = ["living", "kitchen", "bedroom", "bathroom", "children", "rarely_used"]

# --- Zentrale „Allgemein“ (v0.3) ---
CONF_RECIPIENTS: Final = "recipients"  # {"notify.x": [Nachrichtenarten]}
CONF_TTS: Final = "tts"  # {"notify.alexa_x": [Nachrichtenarten]}
CONF_RESIDENTS: Final = "residents"  # person.*
CONF_ZONE: Final = "zone"  # zone.* der Wohnung
CONF_AWAY_DELAY: Final = "away_delay"  # min
CONF_LONG_AWAY_HOURS: Final = "long_away_hours"  # h
CONF_PREHEAT_KM: Final = "preheat_km"
CONF_BUILDING: Final = "building_type"  # unrenovated / renovated / new
CONF_SEASON_MODE: Final = "season_mode"  # auto / always / pause
CONF_SEASON_START: Final = "season_start"  # "10-01"
CONF_SEASON_END: Final = "season_end"  # "04-30"
CONF_HEATING_LIMIT: Final = "heating_limit"  # °C Tagesmittel
CONF_COLD_SNAP_TEMP: Final = "cold_snap_temp"
CONF_FROST_FLOOR: Final = "frost_floor"
CONF_VALVE_CARE: Final = "valve_care"
# pro Raum
CONF_SETBACK_SHORT: Final = "setback_short"
CONF_SETBACK_LONG: Final = "setback_long"
CONF_NIGHT_AIRING: Final = "night_airing"
CONF_NIGHT_START: Final = "night_start"
CONF_NIGHT_END: Final = "night_end"
CONF_NIGHT_ALARM: Final = "night_alarm_temp"

BUILDING_TYPES: Final = ["unrenovated", "renovated", "new"]
SEASON_MODES: Final = ["auto", "always", "pause"]

# Nachrichtenarten
KIND_VENT_OPEN: Final = "vent_open"
KIND_VENT_CLOSE: Final = "vent_close"
KIND_TOO_COLD: Final = "too_cold"
KIND_VENT_DONE: Final = "vent_done"
KIND_WINDOW_AWAY: Final = "window_away"
KIND_PRESENCE: Final = "presence"
KIND_SEASON: Final = "season"
KIND_TRV_FAILURE: Final = "trv_failure"
KIND_HEALTH: Final = "health"
KIND_REPORT: Final = "report"
KINDS: Final = [
    KIND_VENT_OPEN,
    KIND_VENT_CLOSE,
    KIND_TOO_COLD,
    KIND_VENT_DONE,
    KIND_WINDOW_AWAY,
    KIND_PRESENCE,
    KIND_SEASON,
    KIND_TRV_FAILURE,
    KIND_HEALTH,
    KIND_REPORT,
]
DEFAULT_PUSH_KINDS: Final = [k for k in KINDS if k != KIND_PRESENCE]
DEFAULT_TTS_KINDS: Final = [KIND_TOO_COLD]
# Diese kommen auch in der Ruhezeit (Push laut)
URGENT_KINDS: Final = (KIND_TOO_COLD, KIND_WINDOW_AWAY, KIND_TRV_FAILURE)

HUB_DEFAULTS: Final = {
    CONF_RECIPIENTS: {},
    CONF_TTS: {},
    "quiet_start": "22:00:00",
    "quiet_end": "07:00:00",
    "quiet_end_weekend": "09:00:00",
    "repeat_minutes": 5,
    "weather_entity": None,
    "notify_on_failure": True,
    CONF_RESIDENTS: [],
    CONF_ZONE: None,
    CONF_AWAY_DELAY: 30,
    CONF_LONG_AWAY_HOURS: 24,
    CONF_PREHEAT_KM: 10,
    CONF_BUILDING: "renovated",
    CONF_SEASON_MODE: "auto",
    CONF_SEASON_START: "10-01",
    CONF_SEASON_END: "04-30",
    CONF_HEATING_LIMIT: 15.0,
    CONF_COLD_SNAP_TEMP: 12.0,
    CONF_FROST_FLOOR: 16.0,
    CONF_VALVE_CARE: True,
    CONF_NIGHT_START: "20:00:00",
    CONF_NIGHT_END: "03:00:00",
    CONF_NIGHT_ALARM: 12.0,
    "kinds_version": 2,
}

# Karte (Frontend)
CARD_URL: Final = "/raumklima_static/raumklima-card.js"

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
    "on_preset": "auto_detect",
    CONF_WINDOW_OPEN_DELAY: 10,
    CONF_WINDOW_CLOSE_DELAY: 10,
    CONF_OFFSET_THRESHOLD: 0.3,
    CONF_OFFSET_MIN_INTERVAL: 5,
    CONF_SENSOR_STALE_MINUTES: 60,
    CONF_SYNC_VERIFY_DELAY: 20,
    CONF_SYNC_MAX_RETRIES: 5,
    CONF_FOLLOW_TRV: True,
    CONF_NOTIFY: True,
    "room_type": "living",
    "quiet_start": "22:00",
    "quiet_end": "07:00",
    "repeat_minutes": 5,
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
PRESET_GRACE_SECONDS: Final = 60  # s – Sollwert-Änderungen nach Preset-Wechsel ignorieren

# Bevorzugte "an"-Presets (Reihenfolge). "on" fehlt bewusst: bei Tuya-TRVs
# wie dem TRV602Z bedeutet es "Ventil dauerhaft offen", nicht "regeln".
ON_PRESET_CANDIDATES: Final = ["manual", "heat", "eco", "comfort", "none"]
ON_PRESET_AVOID: Final = ["on", "off", "antifrost", "auto", "boost", "holiday", "away"]
CONF_ON_PRESET: Final = "on_preset"
ON_PRESET_AUTO: Final = "auto_detect"

# Zustände
INVALID_STATES: Final = ("unavailable", "unknown", None)

STATUS_HEATING: Final = "heating"
STATUS_IDLE: Final = "idle"
STATUS_WINDOW: Final = "window_open"
STATUS_OFF: Final = "off"
STATUS_SENSOR: Final = "sensor_unavailable"
STATUS_TRV: Final = "trv_unavailable"
STATUS_SEASON: Final = "season_off"
STATUS_SETBACK: Final = "setback"
STATUS_NIGHT: Final = "night_airing"
STATUSES: Final = [
    STATUS_HEATING,
    STATUS_IDLE,
    STATUS_WINDOW,
    STATUS_OFF,
    STATUS_SENSOR,
    STATUS_TRV,
    STATUS_SEASON,
    STATUS_SETBACK,
    STATUS_NIGHT,
]

SYNC_OK: Final = "ok"
SYNC_PENDING: Final = "pending"
SYNC_FAILED: Final = "failed"
SYNC_STATES: Final = [SYNC_OK, SYNC_PENDING, SYNC_FAILED]
