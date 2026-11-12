"""Gemeinsames der Karten-Schnittstelle: Prüfregeln für Änderungen, Hilfsfunktionen."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
import homeassistant.helpers.config_validation as cv
import voluptuous as vol

from .const import (
    BOOST_SOURCE_MODES,
    BUILDING_TYPES,
    CALIBRATION_MODES,
    CO2_LIMIT_OPTIONS,
    CONF_AIRING_MIN_MINUTES,
    CONF_AIRING_OCCUPIED_ONLY,
    CONF_AIRING_WINDOWS,
    CONF_AWAY_DELAY,
    CONF_BOOST_MINUTES,
    CONF_BOOST_SOURCES,
    CONF_BOOST_TEMP,
    CONF_BUILDING,
    CONF_CALENDAR,
    CONF_CALENDAR_AWAY,
    CONF_CALENDAR_HOME,
    CONF_CALIBRATION_MODE,
    CONF_CO2_LIMIT,
    CONF_COLD_SNAP_TEMP,
    CONF_COMFORT_TEMP,
    CONF_FAST_POLL,
    CONF_FROST_FLOOR,
    CONF_FROST_NIGHT,
    CONF_GUESTS_ROOMS,
    CONF_HEAT_SOURCES,
    CONF_HEATING_LIMIT,
    CONF_HOME,
    CONF_HOME_OFFICE_CHECK,
    CONF_HOME_OFFICE_ENTITY,
    CONF_HOME_OFFICE_FROM,
    CONF_HOME_OFFICE_ROOMS,
    CONF_HOME_OFFICE_TO,
    CONF_HOME_SENSORS,
    CONF_LATITUDE,
    CONF_LEARN_AIRING,
    CONF_LEARN_SHIFT,
    CONF_LIGHT_SIGNALS,
    CONF_LIGHTS,
    CONF_LONG_AIRING,
    CONF_LONG_AIRING_REMIND,
    CONF_LONG_AWAY_HOURS,
    CONF_LONGITUDE,
    CONF_MOLD_CAP,
    CONF_MOLD_MODE,
    CONF_NIGHT_AIRING,
    CONF_NIGHT_ALARM,
    CONF_NIGHT_END,
    CONF_NIGHT_ENTITY,
    CONF_NIGHT_LEVEL,
    CONF_NIGHT_START,
    CONF_NOTIFY_CAP,
    CONF_NOTIFY_PRESENT_ONLY,
    CONF_ON_PRESET,
    CONF_OVERRIDE_MINUTES,
    CONF_PREHEAT_KM,
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
    CONF_QUIET_SETBACK,
    CONF_RECIPIENTS,
    CONF_REPORT_METRIC,
    CONF_RESIDENTS,
    CONF_ROOM_ECO,
    CONF_ROOM_ECO_AFTER,
    CONF_ROOM_ECO_DROP,
    CONF_ROOM_PERSONS,
    CONF_ROOM_TYPE,
    CONF_SCHEDULE_FALLBACK,
    CONF_SCHEDULES,
    CONF_SEASON_END,
    CONF_SEASON_MODE,
    CONF_SEASON_START,
    CONF_SETBACK_LONG,
    CONF_SETBACK_SHORT,
    CONF_SOLAR,
    CONF_SOLAR_FACADE,
    CONF_STORM_GUST,
    CONF_STORM_RAIN,
    CONF_STORM_WARNING,
    CONF_TRV_INTERVAL,
    CONF_TTS,
    CONF_VACATION_HOURS,
    CONF_VACATION_KM,
    CONF_VALVE_CARE,
    CONF_VENT_FROM,
    CONF_VENT_TO,
    CONF_VIRTUAL_WINDOW,
    CONF_WALL,
    CONF_WINDOW_CLOSE_DELAY,
    CONF_WINDOW_OPEN_DELAY,
    CONF_WORK_ZONE_MINUTES,
    CONF_WORK_ZONES,
    CONF_ZONE,
    HOME_SENSOR_MODES,
    KINDS,
    LIGHT_SIGNALS,
    MOLD_MODES,
    NIGHT_LEVELS,
    NOTIFY_CAP_OPTIONS,
    PREHEAT_MODES,
    PRESENCE_KINDS,
    QUIET_MODES,
    REPORT_METRICS,
    ROOM_ECO_MODES,
    ROOM_TYPE_OPTIONS,
    SCHEDULE_FALLBACKS,
    SCHEDULE_MAX,
    SCHEDULE_TEMP_MAX,
    SCHEDULE_TEMP_MIN,
    SEASON_MODES,
    SOLAR_FACADE_OPTIONS,
    VERSION,
    WALL_OPTIONS,
)
from .holidays_de import STATES
from .hub import RaumklimaHub
from .mailer import (
    BUILTIN as MAIL_BUILTIN,
    SECURITY as MAIL_SECURITY,
)
from .msg import tr
from .notify_targets import notify_choices
from .occupancy import sensor_kind
from .planning import NIGHT_MODES, VIRT_MODES
from .report_data import REPORT_KINDS
from .reports import CONF_REPORT_EMAIL, CONF_REPORT_PDF, URL as REPORT_URL
from .shared import get_hub

_KINDS = [vol.In(KINDS)]
from .fields import NUM


def num_schema(key: str) -> vol.All | vol.Any:
    """Prüfregel einer Zahl-Einstellung aus fields.py (Typ und Grenzen an einer Stelle)."""
    field = NUM[key]
    rule = vol.All(vol.Coerce(int if field.kind == "int" else float), vol.Range(field.lo, field.hi))
    return vol.Any(None, rule) if field.nullable else rule



_TARGETS = vol.Schema({str: _KINDS})


def _hub_or_error(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> RaumklimaHub | None:
    """Zentrale der gewünschten Wohnung – oder Fehler an die Karte senden."""
    hub = get_hub(hass, msg.get("home"))
    if hub is None:
        connection.send_error(msg["id"], "no_hub", tr("Raumklima Allgemein ist nicht eingerichtet"))
    return hub


def _md(value: Any) -> str:
    """'MM-TT' prüfen (Saisonbeginn/-ende)."""
    text = str(value)
    month, _, day = text.partition("-")
    if not (month.isdigit() and day.isdigit() and 1 <= int(month) <= 12 and 1 <= int(day) <= 31):
        raise vol.Invalid(tr("Format MM-TT erwartet"))
    return f"{int(month):02d}-{int(day):02d}"


def _time(value: Any) -> str:
    """'HH:MM' oder 'HH:MM:SS' prüfen."""
    parts = str(value).split(":")
    if len(parts) not in (2, 3) or not all(p.isdigit() for p in parts):
        raise vol.Invalid(tr("Format HH:MM erwartet"))
    h, m = int(parts[0]), int(parts[1])
    if not (0 <= h < 24 and 0 <= m < 60):
        raise vol.Invalid(tr("Ungültige Uhrzeit"))
    return f"{h:02d}:{m:02d}:00"


HUB_CHANGES = vol.Schema(
    {
        vol.Optional(CONF_RECIPIENTS): _TARGETS,
        vol.Optional(CONF_TTS): _TARGETS,
        vol.Optional(CONF_NOTIFY_PRESENT_ONLY): bool,
        vol.Optional(CONF_STORM_WARNING): bool,
        vol.Optional(CONF_STORM_GUST): num_schema("storm_gust_kmh"),
        vol.Optional(CONF_STORM_RAIN): num_schema("storm_rain_mm"),
        vol.Optional("quiet_start"): _time,
        vol.Optional("quiet_end"): _time,
        vol.Optional("quiet_end_weekend"): _time,
        vol.Optional(CONF_VENT_FROM): _time,
        vol.Optional(CONF_VENT_TO): _time,
        vol.Optional("learn_times"): bool,
        vol.Optional(CONF_LEARN_SHIFT): bool,
        vol.Optional(CONF_QUIET_SETBACK): bool,
        vol.Optional(CONF_NIGHT_LEVEL): vol.In(NIGHT_LEVELS),
        vol.Optional(CONF_VACATION_KM): num_schema("vacation_km"),
        vol.Optional(CONF_VACATION_HOURS): num_schema("vacation_hours"),
        vol.Optional("name"): str,
        vol.Optional("dashboard"): str,
        vol.Optional(CONF_REPORT_METRIC): vol.In(REPORT_METRICS),
        vol.Optional("holiday_state"): vol.Any(None, vol.In(["", *STATES])),
        vol.Optional("sleep_signals"): [str],
        vol.Optional("repeat_minutes"): vol.All(vol.Coerce(float), vol.Range(1, 120)),
        vol.Optional(CONF_GUESTS_ROOMS): vol.All([str], vol.Length(max=30)),
        vol.Optional(CONF_HOME_OFFICE_FROM): vol.Match(r"^\d{1,2}:\d{2}$"),
        vol.Optional(CONF_HOME_OFFICE_TO): vol.Match(r"^\d{1,2}:\d{2}$"),
        vol.Optional(CONF_HOME_OFFICE_ROOMS): vol.All([str], vol.Length(max=30)),
        vol.Optional(CONF_HOME_OFFICE_CHECK): bool,
        vol.Optional(CONF_NIGHT_ENTITY): vol.Any(None, cv.entity_id),
        vol.Optional(CONF_HOME_OFFICE_ENTITY): vol.Any(None, cv.entity_id),
        vol.Optional("weather_entity"): vol.Any(None, str),
        vol.Optional("outdoor_temp_entity"): vol.Any(None, str),
        vol.Optional("notify_on_failure"): bool,
        vol.Optional(CONF_RESIDENTS): [str],
        vol.Optional(CONF_ZONE): vol.Any(None, str),
        vol.Optional(CONF_AWAY_DELAY): num_schema("away_delay"),
        vol.Optional(CONF_WORK_ZONES): vol.All([cv.entity_id], vol.Length(max=10)),
        vol.Optional(CONF_WORK_ZONE_MINUTES): num_schema("work_zone_minutes"),
        vol.Optional(CONF_LONG_AWAY_HOURS): num_schema("long_away_hours"),
        vol.Optional(CONF_PREHEAT_KM): num_schema("preheat_km"),
        vol.Optional(CONF_LATITUDE): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(-90, 90))),
        vol.Optional(CONF_LONGITUDE): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(-180, 180))),
        vol.Optional(CONF_BUILDING): vol.In(BUILDING_TYPES),
        vol.Optional(CONF_SEASON_MODE): vol.In(SEASON_MODES),
        vol.Optional(CONF_SEASON_START): _md,
        vol.Optional(CONF_SEASON_END): _md,
        vol.Optional(CONF_HEATING_LIMIT): num_schema("heating_limit"),
        vol.Optional(CONF_COLD_SNAP_TEMP): num_schema("cold_snap_temp"),
        vol.Optional(CONF_FROST_FLOOR): num_schema("frost_floor"),
        vol.Optional(CONF_VALVE_CARE): bool,
        vol.Optional(CONF_NIGHT_START): _time,
        vol.Optional(CONF_NIGHT_END): _time,
        vol.Optional(CONF_NIGHT_ALARM): num_schema("night_alarm_temp"),
        vol.Optional(CONF_CALENDAR): vol.Any(None, str),
        vol.Optional(CONF_CALENDAR_AWAY): vol.All(str, vol.Length(max=300)),
        vol.Optional(CONF_CALENDAR_HOME): vol.All(str, vol.Length(max=300)),
        vol.Optional(CONF_FROST_NIGHT): bool,
        vol.Optional(CONF_HOME_SENSORS): vol.In(HOME_SENSOR_MODES),
        vol.Optional(CONF_REPORT_PDF): [vol.In(REPORT_KINDS)],
        vol.Optional(CONF_REPORT_EMAIL): vol.Any(None, MAIL_BUILTIN, vol.Match(r"^notify\.\w+$")),
        vol.Optional("mail_server"): vol.All(str, vol.Length(max=200)),
        vol.Optional("mail_port"): vol.Any(None, vol.All(vol.Coerce(int), vol.Range(1, 65535))),
        vol.Optional("mail_security"): vol.In(MAIL_SECURITY),
        vol.Optional("mail_user"): vol.All(str, vol.Length(max=200)),
        vol.Optional("mail_password"): vol.All(str, vol.Length(max=300)),
        vol.Optional("mail_from"): vol.All(str, vol.Length(max=200)),
        vol.Optional("mail_to"): vol.All(str, vol.Length(max=500)),
        vol.Optional("annual_cost"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(0, 20000))),
    }
)


ROOM_CHANGES = vol.Schema(
    {
        vol.Optional(CONF_COMFORT_TEMP): num_schema("comfort_temperature"),
        vol.Optional(CONF_ROOM_TYPE): vol.In(ROOM_TYPE_OPTIONS),
        vol.Optional(CONF_CALIBRATION_MODE): vol.In(CALIBRATION_MODES),
        vol.Optional(CONF_TRV_INTERVAL): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(0, 60))),
        vol.Optional(CONF_CO2_LIMIT): vol.All(vol.Coerce(int), vol.In(CO2_LIMIT_OPTIONS)),
        vol.Optional(CONF_NOTIFY_CAP): vol.All(vol.Coerce(int), vol.In(NOTIFY_CAP_OPTIONS)),
        vol.Optional(CONF_WALL): vol.In(WALL_OPTIONS),
        vol.Optional(CONF_SETBACK_SHORT): num_schema("setback_short"),
        vol.Optional(CONF_SETBACK_LONG): num_schema("setback_long"),
        vol.Optional(CONF_WINDOW_OPEN_DELAY): num_schema("window_open_delay"),
        vol.Optional(CONF_WINDOW_CLOSE_DELAY): num_schema("window_close_delay"),
        vol.Optional(CONF_NIGHT_AIRING): vol.In(NIGHT_MODES),
        vol.Optional(CONF_AIRING_MIN_MINUTES): num_schema("airing_min_minutes"),
        vol.Optional(CONF_MOLD_MODE): vol.In(MOLD_MODES),
        vol.Optional(CONF_QUIET_MODE): vol.In(QUIET_MODES),
        vol.Optional(CONF_ROOM_PERSONS): vol.All([str], vol.Length(max=20)),
        vol.Optional(CONF_PREHEAT_MODE): vol.In(PREHEAT_MODES),
        vol.Optional(CONF_PREHEAT_LEAD): num_schema("preheat_lead_min"),
        vol.Optional(CONF_PRESENCE_TARGET): num_schema("presence_target"),
        vol.Optional(CONF_PRESENCE_DELAY): num_schema("presence_delay_min"),
        vol.Optional(CONF_PRESENCE_RELEASE): num_schema("presence_release_min"),
        vol.Optional(CONF_PRESENCE_PIR): bool,
        vol.Optional(CONF_PRESENCE_LEARN): bool,
        vol.Optional(CONF_PRESENCE_LIGHTS): vol.All(cv.ensure_list, [cv.entity_id], vol.Length(max=12)),
        vol.Optional(CONF_HEAT_SOURCES): vol.All(
            [
                vol.Schema(
                    {
                        vol.Required("entity"): vol.Match(r"^climate\."),
                        vol.Optional("id"): str,
                        vol.Optional("name"): str,
                        vol.Optional("type"): vol.In(("trv", "ac")),
                        vol.Optional("offset"): vol.All(vol.Coerce(float), vol.Range(-5, 5)),
                        vol.Optional("trigger"): str,
                        vol.Optional("untouched"): bool,
                    }
                )
            ],
            vol.Length(max=10),
        ),
        vol.Optional(CONF_BOOST_SOURCES): vol.In(BOOST_SOURCE_MODES),
        vol.Optional(CONF_PREHEAT_NOT_BEFORE): vol.Match(r"^\d{1,2}:\d{2}$"),
        vol.Optional(CONF_MOLD_CAP): num_schema("mold_cap"),
        vol.Optional(CONF_SCHEDULE_FALLBACK): vol.In(SCHEDULE_FALLBACKS),
        vol.Optional(CONF_VIRTUAL_WINDOW): vol.In(VIRT_MODES),
        vol.Optional(CONF_HOME): vol.Any(None, str),
        vol.Optional(CONF_SOLAR): bool,
        vol.Optional(CONF_SOLAR_FACADE): vol.In(SOLAR_FACADE_OPTIONS),
        vol.Optional(CONF_LIGHTS): vol.All([vol.Match(r"^light\.")], vol.Length(max=10)),
        vol.Optional(CONF_LIGHT_SIGNALS): [vol.In(LIGHT_SIGNALS)],
        vol.Optional(CONF_PRESENCE): vol.All([vol.Match(r"^binary_sensor\.")], vol.Length(max=6)),
        vol.Optional(CONF_PRESENCE_KIND): vol.In(PRESENCE_KINDS),
        vol.Optional(CONF_ROOM_ECO): vol.In(ROOM_ECO_MODES),
        vol.Optional(CONF_ROOM_ECO_AFTER): num_schema("room_eco_after"),
        vol.Optional(CONF_ROOM_ECO_DROP): num_schema("room_eco_drop"),
        # Zeitpläne: {days: [0..6], start: "HH:MM", end: "HH:MM", temperature: °C}
        vol.Optional(CONF_SCHEDULES): vol.Any(
            None,
            vol.All(
                [
                    {
                        vol.Required("start"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Required("end"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Required("temperature"): vol.All(
                            vol.Coerce(float), vol.Range(SCHEDULE_TEMP_MIN, SCHEDULE_TEMP_MAX)
                        ),
                        vol.Optional("days", default=[]): [
                            vol.All(vol.Coerce(int), vol.Range(0, 6))
                        ],
                        vol.Optional("sources", default=[]): [str],
                    }
                ],
                vol.Length(max=SCHEDULE_MAX),
            ),
        ),
        vol.Optional(CONF_ON_PRESET): vol.Any(None, str),
        vol.Optional(CONF_BOOST_TEMP): num_schema("boost_temperature"),
        vol.Optional(CONF_BOOST_MINUTES): num_schema("boost_minutes"),
        # Lüften ohne Erinnerung: Dauerlüftung, Zeitfenster, gewohntes Lüften
        vol.Optional(CONF_LONG_AIRING): num_schema("long_airing_minutes"),
        vol.Optional(CONF_LONG_AIRING_REMIND): num_schema("long_airing_remind"),
        vol.Optional(CONF_LEARN_AIRING): vol.Boolean(),
        vol.Optional(CONF_FAST_POLL): vol.Boolean(),
        vol.Optional(CONF_AIRING_OCCUPIED_ONLY): vol.Boolean(),
        vol.Optional(CONF_OVERRIDE_MINUTES): num_schema("override_minutes"),
        vol.Optional(CONF_AIRING_WINDOWS): vol.Any(
            None,
            vol.All(
                [
                    {
                        vol.Required("start"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Required("end"): vol.Match(r"^\d{1,2}:\d{2}$"),
                        vol.Optional("days", default=[]): [vol.All(vol.Coerce(int), vol.Range(0, 6))],
                    }
                ],
                vol.Length(max=6),
            ),
        ),
    }
)


MAIL_PLATFORMS = ("smtp", "google_mail", "mailgun", "sendgrid")


def _mail_services(hass: HomeAssistant) -> list[str]:
    """Nur echte Mail-Dienste (SMTP & Co.) – nicht Alexa, Handys oder Fernseher."""
    try:
        from homeassistant.components.notify.legacy import NOTIFY_SERVICES
    except ImportError:  # ältere/neuere HA-Version
        return []
    services = hass.data.get(NOTIFY_SERVICES, {})
    out = []
    for platform in MAIL_PLATFORMS:
        for svc in services.get(platform, []):
            name = getattr(svc, "_service_name", None)
            if name:
                out.append(f"notify.{name}")
    return sorted(set(out))


def _known_dashboards(hass: HomeAssistant) -> list[str]:
    """Alle Dashboards, die Home Assistant kennt (auch ohne Seitenleiste).

    Die Karte kann sich nicht auf ``hass.dashboards`` verlassen – je nach Stand und
    Benutzer ist die Liste im Browser leer, dann wäre der Wohnungs-Umschalter dauerhaft
    ausgegraut. Hier fragen wir die Wahrheit der Zentrale ab.
    """
    data = hass.data.get("lovelace")
    known = getattr(data, "dashboards", None) if data is not None else None
    return sorted(str(p) for p in (known or {}) if p)


def _choices(hass: HomeAssistant) -> dict[str, Any]:
    notify = notify_choices(hass)
    def ents(domain: str) -> list[dict[str, str]]:
        return sorted(
            ({"id": s.entity_id, "name": s.name} for s in hass.states.async_all(domain)),
            key=lambda x: x["name"].lower(),
        )
    return {
        "notify": notify,
        "persons": ents("person"),
        "zones": ents("zone"),
        "weather": ents("weather"),
        "climate": ents("climate"),
        "calendars": ents("calendar"),
        "signals": ents("light") + ents("switch") + ents("input_boolean"),
        "lights": ents("light"),
        "mail": _mail_services(hass),
        "presence": sorted(
            (
                {"id": s.entity_id, "name": s.name, "kind": sensor_kind(s.attributes.get("device_class"))}
                for s in hass.states.async_all("binary_sensor")
                if s.attributes.get("device_class") in ("motion", "occupancy", "presence")
            ),
            key=lambda x: x["name"].lower(),
        ),
        "outdoor": sorted(
            (
                {"id": s.entity_id, "name": s.name}
                for s in hass.states.async_all("sensor")
                if s.attributes.get("device_class") == "temperature"
            ),
            key=lambda x: x["name"].lower(),
        ),
        "states": [{"id": k, "name": v} for k, v in STATES.items()],
    }


def _installed_version() -> str:
    """Version der laufenden Installation (kommt aus ``const``, ohne Datei-I/O)."""
    return VERSION


def _pdf_entry(entry: dict, hub: RaumklimaHub | None = None) -> dict:
    url = (hub.pdf.signed_url(entry["file"]) if hub else None) or f"{REPORT_URL}/{entry['file']}"
    return {k: v for k, v in entry.items() if not k.startswith("_") and k != "token"} | {"url": url}
