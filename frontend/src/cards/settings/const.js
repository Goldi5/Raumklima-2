// Einstellungen-Karte – gemeinsame Konstanten.
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";

// Gruppen der Leiste. Jede Gruppe nennt ihren Platz beim Aufruf von _grp() selbst –
// ein umbenannter Titel kann sie nicht mehr nach „Erweitert" verschieben.
export const RK_GROUP_META = {
  home: { label: "Wohnung", icon: "mdi:home-outline" },
  room: { label: "Raum", icon: "mdi:door-open" },
  heating: { label: "Heizung", icon: "mdi:radiator" },
  health: { label: "Gesundheit", icon: "mdi:heart-pulse" },
  energy: { label: "Energie & Tarife", icon: "mdi:lightning-bolt" },
  weather: { label: "Wetter", icon: "mdi:weather-partly-cloudy" },
  air: { label: "Lüften", icon: "mdi:weather-windy" },
  shade: { label: "Verschattung", icon: "mdi:blinds" },
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
export const RK_GROUP_ORDER = ["home", "room", "heating", "health", "air", "shade", "presence", "night", "notify", "reports", "learn", "layout", "advanced"];
// Einstellungen 2.0: Hauptbereiche und Raum-Unterseiten.
// Phase 1 nutzt die Bereiche als Navigation; die Zeilen bleiben zunächst in
// ihren heutigen Gruppen und werden erst in Phase 2/3 verschoben.
export const NAV2_DEFAULT = true;
export const SETTINGS_SECTIONS = [
  { id: "home", label: "Wohnungen", icon: "mdi:home-outline", groups: ["home", "learn"] },
  { id: "rooms", label: "Räume", icon: "mdi:door-open", groups: [] },
  { id: "presence", label: "Personen & Anwesenheit", icon: "mdi:account-multiple-outline", groups: ["presence", "night"] },
  { id: "energy", label: "Heizung & Energie", icon: "mdi:radiator", groups: ["energy", "weather", "heating", "reports"] },
  { id: "notify", label: "Benachrichtigungen", icon: "mdi:bell-outline", groups: ["notify"] },
  { id: "system", label: "System & Diagnose", icon: "mdi:cog-outline", groups: ["health", "layout", "advanced"] },
];
export const SETTINGS_ROOM_GROUPS = ["room", "heating", "air", "shade", "presence", "notify", "learn"];

// Raum-Unterseiten (Phase 3). Die Reihenfolge ist die Reihenfolge der Leiste.
export const ROOM_TABS = [
  { id: "overview", label: "Übersicht", icon: "mdi:view-dashboard-outline" },
  { id: "control", label: "Regelung", icon: "mdi:thermometer" },
  { id: "schedule", label: "Zeitplan", icon: "mdi:calendar-clock" },
  { id: "windows", label: "Fenster & Lüften", icon: "mdi:window-open-variant" },
  { id: "presence", label: "Präsenz", icon: "mdi:motion-sensor" },
  { id: "sources", label: "Heizquellen", icon: "mdi:radiator" },
  { id: "devices", label: "Geräte & Sensoren", icon: "mdi:thermometer-lines" },
  { id: "notify", label: "Meldungen", icon: "mdi:bell-outline" },
  { id: "mold", label: "Schimmel", icon: "mdi:shield-home-outline" },
  { id: "learn", label: "Lernen & Verlauf", icon: "mdi:chart-line" },
];
export const ROOM_TAB_DEFAULT = "overview";

// Werte, die sich gefahrlos auf andere Räume übertragen lassen (Phase 4).
// Keine Entitäten, keine Raumzuordnung, keine Zeitpläne: die sind raum- bzw. gerätespezifisch.
export const ROOM_APPLY_KEYS = [
  "comfort_temperature", "setback_short", "setback_long",
  "window_open_delay", "window_close_delay",
  "preheat_mode", "preheat_lead_min", "preheat_not_before", "quiet_mode",
  "night_airing", "virtual_window", "solar_gain",
  "mold_mode", "mold_cap", "wall", "cooling", "cool_setpoint", "ac_min_on", "ac_min_off",
  "shading_mode", "shading_position", "shading_min_temp", "shading_outdoor_min",
  "shading_night", "shading_manual_minutes",
  "floor_heating", "floor_max_temp", "floor_min_temp", "floor_band",
  "floor_cycle_min", "floor_lead_min", "floor_flow_min",
  "co2_limit", "notify_cap",
  "presence_target", "presence_delay_min", "presence_release_min", "presence_pir", "presence_learn",
  "room_eco", "room_eco_after", "room_eco_drop",
  "airing_min_minutes", "long_airing_minutes", "long_airing_remind", "airing_occupied_only",
  "fast_poll", "trv_interval", "valve_control", "schedule_fallback",
  "boost_temperature", "boost_minutes", "override_minutes",
];


// Grobe Raum-Suche (Phase 5): häufige Begriffe → passende Raum-Unterseite.
// Die eigentlichen Werte stehen erst nach dem Öffnen des Raums im DOM; diese
// Stichwortliste macht die Suche trotzdem über alle Räume nutzbar.
export const ROOM_SEARCH = [
  { terms: ["wunschtemperatur", "solltemperatur", "komfort", "temperatur"], tab: "control", label: "Regelung" },
  { terms: ["zeitplan", "zeitfenster", "vorheizen"], tab: "schedule", label: "Zeitplan" },
  { terms: ["fenster", "lüften", "feuchte", "co2"], tab: "windows", label: "Fenster & Lüften" },
  { terms: ["verschattung", "rollladen", "jalousie", "sonnenschutz"], tab: "windows", label: "Verschattung" },
  { terms: ["fußbodenheizung", "fussbodenheizung", "vorlauf", "rücklauf", "spreizung", "fließ"], tab: "control", label: "Fußbodenheizung" },
  { terms: ["präsenz", "anwesenheit", "melder"], tab: "presence", label: "Präsenz" },
  { terms: ["heizquelle", "thermostat", "klimaanlage"], tab: "sources", label: "Heizquellen" },
  { terms: ["ventil", "ventilsteuerung", "stellglied", "trvzb"], tab: "devices", label: "Ventilsteuerung" },
  { terms: ["sensor", "batterie", "funk", "kalibrierung"], tab: "devices", label: "Geräte & Sensoren" },
  { terms: ["meldung", "empfänger", "lichtsignal"], tab: "notify", label: "Meldungen" },
  { terms: ["schimmel", "wand"], tab: "mold", label: "Schimmel" },
  { terms: ["lernen", "aufheizen", "verlauf"], tab: "learn", label: "Lernen & Verlauf" },
];

export const RK_SHADE = () => ({
  off: t("Aus"),
  advise: t("Nur empfehlen"),
  auto: t("Automatisch"),
});

export const RK_VALVE = () => ({
  off: t("Aus"),
  auto: t("Automatisch"),
  on: t("Immer"),
});

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
