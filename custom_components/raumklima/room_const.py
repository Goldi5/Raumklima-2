"""Gründe, Rangfolge und feste Werte des Raum-Reglers (gemeinsam für controller.py und seine Mixins)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from .const import (
    CONF_AIRING_MIN_MINUTES,
    CONF_AIRING_OCCUPIED_ONLY,
    CONF_AIRING_WINDOWS,
    CONF_BOOST_MINUTES,
    CONF_BOOST_TEMP,
    CONF_CO2_LIMIT,
    CONF_COMFORT_TEMP,
    CONF_FAST_POLL,
    CONF_HOME,
    CONF_LEARN_AIRING,
    CONF_LIGHT_SIGNALS,
    CONF_LIGHTS,
    CONF_LONG_AIRING,
    CONF_LONG_AIRING_REMIND,
    CONF_MOLD_CAP,
    CONF_MOLD_MODE,
    CONF_NIGHT_AIRING,
    CONF_NOTIFY_CAP,
    CONF_OVERRIDE_MINUTES,
    CONF_PREHEAT_LEAD,
    CONF_PREHEAT_MODE,
    CONF_PREHEAT_NOT_BEFORE,
    CONF_PRESENCE,
    CONF_PRESENCE_DELAY,
    CONF_PRESENCE_KIND,
    CONF_PRESENCE_LEARN,
    CONF_PRESENCE_LIGHTS,
    CONF_PRESENCE_PIR,
    CONF_PRESENCE_RELEASE,
    CONF_PRESENCE_TARGET,
    CONF_QUIET_MODE,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_PERSONS,
    CONF_SCHEDULE_FALLBACK,
    CONF_SCHEDULES,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    CONF_TRV_INTERVAL,
    CONF_VIRTUAL_WINDOW,
    CONF_WALL,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
)
from .msg import N_

STORAGE_VERSION = 1
VALVE_CARE = timedelta(minutes=3)

TRV_OUTAGE_SECONDS = 60  # kürzere Aussetzer gelten nicht als Ausfall
REASON_NORMAL = "normal"
REASON_MONITOR = "monitor"
REASON_MANUAL = "manual"
# Feuchtequelle: ab diesem Zuwachs (hPa) in 6 h gilt die Feuchte als „entsteht im Raum"
MESSAGE_MOISTURE_DRY = (
    N_("💧 {room}: Feuchte steigt – lüften statt heizen"),
    N_(
        "In {hours} h von {from} auf {to} %. Draußen ist die Luft trockener: einmal kräftig "
        "stoßlüften bringt mehr als höher heizen."
    ),
)
MESSAGE_MOISTURE_DAMP = (
    N_("🧺 {room}: Feuchtequelle im Raum"),
    N_(
        "In {hours} h von {from} auf {to} %. Lüften hilft gerade nicht – die Außenluft ist "
        "feuchter. Wäsche, Duschen oder viele Personen im Raum?"
    ),
)
# Ab wie vielen Stunden kritischer Wandfeuchte (in 24 h) der Schutz anhebt
MOLD_MIN_HOURS = 2.0
# Deckel über dem Wunsch: tagsüber 2,5 K, nachts 1,5 K (dann lüftet niemand)
MOLD_CAP_DEFAULT = 2.5
MOLD_CAP_NIGHT = 1.5
MOISTURE_RISE = 1.2
MOISTURE_COOLDOWN = timedelta(hours=12)
REASON_SEASON = "season"
REASON_FROST = "frost"
REASON_VALVE_CARE = "valve_care"
REASON_SOLAR = "solar"
REASON_EMPTY = "room_empty"
REASON_SCHEDULE = "schedule"
REASON_BOOST = "boost"
REASON_SCHEDULE_PREHEAT = "schedule_preheat"
REASON_PRESENCE_PREHEAT = "presence_preheat"
REASON_SLEEP = "sleep"
REASON_MOLD = "mold"
REASON_SCHEDULE_FALLBACK = "schedule_fallback"
REASON_HOME_OFFICE = "home_office"
REASON_PRESENCE = "presence"
REASON_DEVICE_AUTO = "device_auto"
# Schimmelschutz-Stufen (Raum-Einstellung)
MOLD_STRICT = "strict"
MOLD_WISH = "wish"
MOLD_OFF = "off"
# Zeitplan: Wert außerhalb der Fenster
SCHEDULE_FALLBACK_WISH = "wish"
SCHEDULE_FALLBACK_SHORT = "short"
SCHEDULE_FALLBACK_LONG = "long"
SCHEDULE_FALLBACK_FROST = "frost"
# Bei diesen Gründen greift der Schimmelschutz nicht ein (bewusste Aktion oder Heizung ohnehin aus)
PlanResult = tuple[bool, float, str] | None

# Rangfolge der Regelkette: die erste Regel mit Ergebnis gewinnt (siehe ``_plan_rules``).
# Danach gilt der Wunsch; der Schimmelschutz hebt jedes Ergebnis als Boden an (``_mold_floor``).
PLAN_RULES: tuple[str, ...] = (
    "_rule_monitor",
    "_rule_device_auto",
    "_rule_valve_care",
    "_rule_no_hub",
    "_rule_season",
    "_rule_boost",
    "_rule_presence",
    "_rule_home_office",
    "_rule_away",
    "_rule_expire_manual",
    "_rule_schedule",
    "_rule_night",
    "_rule_preheat",
    "_rule_presence_preheat",
    "_rule_schedule_fallback",
    "_rule_empty_room",
    "_rule_solar",
)


# Lesbare Namen der Regeln für „Warum heizt der Raum (nicht)?“ (Reihenfolge = PLAN_RULES)
RULE_LABELS: dict[str, str] = {
    "_rule_monitor": "Nur Messen (kein Thermostat)",
    "_rule_device_auto": "Gerät im Auto-Modus",
    "_rule_valve_care": "Ventilpflege",
    "_rule_no_hub": "Ohne Wohnung",
    "_rule_season": "Heizsaison / Frostschutz",
    "_rule_boost": "Boost",
    "_rule_presence": "Jemand im Raum (Präsenzmelder)",
    "_rule_home_office": "Homeoffice",
    "_rule_away": "Niemand zu Hause (Absenkung)",
    "_rule_expire_manual": "Von Hand gestellt",
    "_rule_schedule": "Zeitplan",
    "_rule_night": "Ruhezeit (Schlafraum)",
    "_rule_preheat": "Vorheizen für den Zeitplan",
    "_rule_presence_preheat": "Vorwärmen nach gelernten Zeiten",
    "_rule_schedule_fallback": "Außerhalb der Zeitfenster",
    "_rule_empty_room": "Leerer Raum",
    "_rule_solar": "Sonne erwartet",
}


@dataclass
class _PlanContext:
    """Was alle Regeln eines Durchlaufs gemeinsam sehen."""

    now: datetime  # UTC
    local_now: datetime
    hub: Any
    manual_until: datetime | None = None

    @property
    def manual_active(self) -> bool:
        """Läuft gerade eine Handverstellung?"""
        return bool(self.manual_until and self.now < self.manual_until)


MOLD_EXEMPT = frozenset(
    {REASON_VALVE_CARE, REASON_FROST, REASON_SEASON, REASON_BOOST, REASON_MONITOR, REASON_MOLD}
)
# Diese Einstellungen wirken sofort, ohne den Raum neu zu laden
LIVE_OPTIONS = frozenset(
    {
        CONF_PRESENCE_LEARN,
        CONF_PRESENCE_LIGHTS,
        CONF_PRESENCE_TARGET,
        CONF_PRESENCE_DELAY,
        CONF_PRESENCE_RELEASE,
        CONF_PRESENCE_PIR,
        CONF_COMFORT_TEMP,
        CONF_SETBACK_SHORT,
        CONF_SETBACK_LONG,
        CONF_WINDOW_OPEN_DELAY,
        CONF_WINDOW_CLOSE_DELAY,
        CONF_NIGHT_AIRING,
        CONF_VIRTUAL_WINDOW,
        CONF_HOME,
        CONF_SOLAR,
        CONF_SOLAR_FACADE,
        CONF_LIGHTS,
        CONF_LIGHT_SIGNALS,
        CONF_PRESENCE,
        CONF_PRESENCE_KIND,
        CONF_ROOM_ECO,
        CONF_ROOM_ECO_AFTER,
        CONF_ROOM_ECO_DROP,
        CONF_SCHEDULES,
        CONF_BOOST_TEMP,
        CONF_BOOST_MINUTES,
        CONF_OVERRIDE_MINUTES,
        CONF_AIRING_OCCUPIED_ONLY,
        CONF_FAST_POLL,
        CONF_LONG_AIRING,
        CONF_LONG_AIRING_REMIND,
        CONF_AIRING_WINDOWS,
        CONF_LEARN_AIRING,
        CONF_AIRING_MIN_MINUTES,
        CONF_TRV_INTERVAL,
        CONF_CO2_LIMIT,
        CONF_NOTIFY_CAP,
        CONF_MOLD_CAP,
        CONF_MOLD_MODE,
        CONF_PREHEAT_LEAD,
        CONF_PREHEAT_MODE,
        CONF_PREHEAT_NOT_BEFORE,
        CONF_QUIET_MODE,
        CONF_ROOM_PERSONS,
        CONF_WALL,
        CONF_SCHEDULE_FALLBACK,
    }
)
