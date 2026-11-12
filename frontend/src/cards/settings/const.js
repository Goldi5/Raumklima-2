// Einstellungen-Karte – gemeinsame Konstanten.
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";

// Gruppen der Leiste. Jede Gruppe nennt ihren Platz beim Aufruf von _grp() selbst –
// ein umbenannter Titel kann sie nicht mehr nach „Erweitert" verschieben.
export const RK_GROUP_META = {
  home: { label: "Wohnung", icon: "mdi:home-outline" },
  room: { label: "Raum", icon: "mdi:door-open" },
  heating: { label: "Heizung", icon: "mdi:radiator" },
  air: { label: "Lüften", icon: "mdi:weather-windy" },
  presence: { label: "Anwesenheit", icon: "mdi:account-multiple-outline" },
  night: { label: "Nacht", icon: "mdi:weather-night" },
  notify: { label: "Benachrichtigungen", icon: "mdi:bell-outline" },
  reports: { label: "Berichte", icon: "mdi:file-chart-outline" },
  learn: { label: "Lernen", icon: "mdi:chart-line" },
  layout: { label: "Darstellung", icon: "mdi:view-dashboard-outline" },
  advanced: { label: "Erweitert", icon: "mdi:cog-outline" },
};
// Standardwerte, die das Backend nicht als Option führt (leer = dieser Wert)
export const RK_IMPLICIT = {
  preheat_mode: "auto", quiet_mode: "auto", mold_cap: 2.5, wall: "auto", night_airing: "auto", virtual_window: "auto",
  co2_limit: 1000, trv_interval: 0, fast_poll: false, schedule_fallback: "wish", override_minutes: 120, boost_sources: "selected",
  airing_min_minutes: 0, long_airing_minutes: 20, long_airing_remind: 90, airing_occupied_only: true,
  home_office_from: "08:00", home_office_to: "17:00", home_office_check: true, home_sensors: "mmwave", work_zone_minutes: 5,
  vacation_km: 0, vacation_hours: 12, night_level: "long", report_metric: "auto", storm_gust_kmh: 70, storm_rain_mm: 8,
  presence_delay_min: 5, presence_release_min: 5, presence_pir: false, presence_kind: "auto", room_eco: "auto",
  solar_gain: false, presence_off: false, learn_shift: false, frost_night: false,
};
export const RK_LAYOUT_COLORS = ["#1eb6a6", "#34a86e", "#e8982e", "#e2643c", "#7c6adc", "#3c8cdc", "#c94f8a", "#7a8288"];
export const RK_GROUP_ORDER = ["home", "room", "heating", "air", "presence", "night", "notify", "reports", "learn", "layout", "advanced"];

// Fassaden für den Sonnenabzug (Azimut) – Reihenfolge wie im Backend
export const RK_FACADES = () => [
  { id: "", name: t("egal – nur Vorhersage") },
  { id: "N", name: t("Nord") },
  { id: "NO", name: t("Nordost") },
  { id: "O", name: t("Ost") },
  { id: "SO", name: t("Südost") },
  { id: "S", name: t("Süd") },
  { id: "SW", name: t("Südwest") },
  { id: "W", name: t("West") },
  { id: "NW", name: t("Nordwest") },
];
export const rkFacadeName = (v) => (v ? (RK_FACADES().find((f) => f.id === v) || {}).name || v : t("nur Vorhersage"));
