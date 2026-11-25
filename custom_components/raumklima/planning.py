"""Planung ohne Home-Assistant-Abhängigkeit (separat testbar).

- Ortung: Entfernung, Sprungfilter (WireGuard/VPN-Ausreißer), Annäherung
- Anwesenheits-Stufen: da / kurz weg / länger weg / vorheizen / Gäste
- Schimmelschutz: minimale Raumtemperatur nach DIN 4108-2 (fRsi, 80 % an der Wand)
- Heizsaison: Heizgrenze mit Tagesmittel + Vorhersage, Hysterese, Kälteeinbruch

Fassade: Der Inhalt liegt in den Teilmodulen ``plan_const``, ``plan_mold``, ``plan_presence``, ``plan_season``, ``plan_schedule``, ``plan_detect``, ``plan_weather``;
alle Namen bleiben hier importierbar.
"""

from __future__ import annotations

from .plan_const import (  # noqa: F401
    AWAY_STAGES,
    BUILDING_FRSI,
    SEASON_ALWAYS,
    SEASON_COLD_SNAP,
    SEASON_HEAT_TODAY,
    SEASON_HEATING,
    SEASON_MANUAL_PAUSE,
    SEASON_PAUSE,
    SEASON_STATES,
    SETBACK_BY_ROOM,
    STAGE_AWAY_LONG,
    STAGE_AWAY_SHORT,
    STAGE_GUESTS,
    STAGE_HOME,
    STAGE_PREHEAT,
    STAGES,
    SURFACE_RH_LIMIT,
    setback_defaults,
)
from .plan_detect import (  # noqa: F401
    CAL_AWAY,
    CAL_AWAY_WORDS,
    CAL_HOME,
    CAL_HOME_WORDS,
    VIRT_AUTO,
    VIRT_DROP,
    VIRT_MAX_OPEN,
    VIRT_MIN_OPEN,
    VIRT_MODES,
    VIRT_OFF,
    VIRT_ON,
    VIRT_OUTDOOR_GAP,
    VIRT_RECOVER,
    VIRT_SPAN,
    _word_in,
    _words,
    calendar_mode,
    detect_temp_drop,
    virtual_window_close_reason,
)
from .plan_mold import (  # noqa: F401
    MOLD_LOWER_HYSTERESIS,
    MOLD_MIN_SPAN,
    MOLD_SAMPLE_EVERY,
    MOLD_WINDOW,
    MoldGuard,
    floor_from_vapour,
    mold_safe_min_temp,
    round_up_half,
    saturation_pressure,
    temp_for_pressure,
)
from .plan_presence import (  # noqa: F401
    ETA_MAX_KM,
    ETA_MAX_SPEED,
    ETA_MIN_SPEED,
    Fix,
    PresenceInput,
    TrackerFilter,
    approaching,
    eta_minutes,
    haversine_km,
    presence_stage,
    setback_target,
)
from .plan_schedule import (  # noqa: F401
    NIGHT_ALARM_TEMP,
    NIGHT_AUTO,
    NIGHT_END,
    NIGHT_MODES,
    NIGHT_MORNING_REPEAT,
    NIGHT_OFF,
    NIGHT_ON,
    NIGHT_ROOM_TYPES,
    NIGHT_START,
    SCHOOL_MORNING_END,
    _hhmm,
    _minutes,
    _next_morning,
    in_quiet,
    in_time_window,
    morning_after,
    mute_until,
    next_schedule_window,
    night_airing_applies,
    quiet_end_on,
    schedule_target,
    schedule_window,
    schedule_window_end,
    shift_school_schedules,
)
from .plan_season import (  # noqa: F401
    SeasonConfig,
    SeasonState,
    combined_mean,
    in_season,
    parse_md,
    season_allows_heating,
    season_decision,
    season_step,
)
from .plan_weather import (  # noqa: F401
    FACADE_SPREAD,
    FACADES,
    FROST_NIGHT_AHEAD,
    FROST_NIGHT_TEMP,
    SOLAR_HOURS,
    SOLAR_MIN_SUNNY,
    SOLAR_REDUCTION,
    SUN_MIN_ELEVATION,
    SUNNY_CLOUDS,
    SUNNY_CONDITIONS,
    ForecastHour,
    _is_sunny,
    facade_angle,
    first_storm,
    frost_night_min,
    frost_night_setback,
    location_known,
    sun_expected,
    sun_on_facade,
    sun_position,
)
