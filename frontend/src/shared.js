// Gemeinsame Konstanten, Formatierung und Stile aller Raumklima-Karten
import { getLang, loc, rkTime, setLang, t, timeOpts, time12, tmap } from "./i18n.js";
import { RK_VERSION } from "./version.js";

export { RK_VERSION, loc, rkTime, setLang, t, time12, timeOpts, tmap };

// Text für einen regulären Ausdruck entschärfen (Raumnamen wie „Bad (OG)“)
// Handbuch als PDF (am neuesten GitHub-Release angehängt), in der Sprache der Karte
export const rkManualUrl = () =>
  `https://github.com/Goldi5/Raumklima-2/releases/latest/download/${getLang() === "de" ? "Raumklima-Handbuch.pdf" : "Raumklima-Manual.pdf"}`;

export const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const STATUS = tmap({
  heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
  idle: { label: "Temperatur erreicht", icon: "mdi:check-circle", tone: "ok" },
  window_open: { label: "Pausiert – Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
  off: { label: "Aus", icon: "mdi:power", tone: "off" },
  off_trv: { label: "Aus – am Thermostat abgeschaltet", icon: "mdi:power-plug-off", tone: "off" },
  sensor_unavailable: { label: "Fühler ausgefallen", icon: "mdi:thermometer-alert", tone: "warn" },
  trv_unavailable: { label: "Thermostat nicht erreichbar", icon: "mdi:lan-disconnect", tone: "warn" },
  season_off: { label: "Heizpause", icon: "mdi:weather-sunny", tone: "off" },
  setback: { label: "Abgesenkt – niemand da", icon: "mdi:home-export-outline", tone: "eco" },
  night_airing: { label: "Nachtlüften – Fenster offen", icon: "mdi:weather-night", tone: "air" },
});

export const PRESENCE = tmap({
  home: { label: "Jemand da", icon: "mdi:home-account", tone: "ok" },
  guests: { label: "Gäste da", icon: "mdi:account-group", tone: "ok" },
  preheat: { label: "Vorheizen", icon: "mdi:car-arrow-right", tone: "heat" },
  away_short: { label: "Alle weg", icon: "mdi:home-export-outline", tone: "eco" },
  away_long: { label: "Länger weg", icon: "mdi:bag-suitcase", tone: "eco" },
});
export const SEASON = tmap({
  heating: { label: "Heizsaison", icon: "mdi:radiator", tone: "heat" },
  pause: { label: "Heizpause", icon: "mdi:weather-sunny", tone: "off" },
  cold_snap: { label: "Kälteeinbruch", icon: "mdi:snowflake-thermometer", tone: "cold" },
  heat_today: { label: "Heute heizen", icon: "mdi:fire-circle", tone: "heat" },
  always: { label: "Immer heizen", icon: "mdi:radiator", tone: "heat" },
  manual_pause: { label: "Heizpause (Hand)", icon: "mdi:radiator-off", tone: "off" },
});

// Entitäten der Zentrale „Allgemein“ finden (über translation_key)
// Braucht diese Wohnung noch ein eigenes Dashboard? (Pfad gesetzt, aber noch nicht vorhanden)
export function rkNeedsDashboard(dashboards, path, current = "") {
  const p = String(path || "").replace(/^\//, "");
  if (!p) return false;
  if (p === String(current || "").replace(/^\//, "")) return false;
  return !Object.prototype.hasOwnProperty.call(dashboards || {}, p);
}
export function rkHomes(hass) {
  return Object.values(hass.entities || {})
    .filter((e) => e.platform === "raumklima" && e.translation_key === "presence" && hass.states[e.entity_id])
    .map((e) => { const a = hass.states[e.entity_id].attributes; return { id: a.home_id, name: a.home_name || t("Allgemein"), dashboard: a.home_dashboard, presence: e.entity_id }; })
    .filter((h) => h.id);
}
// Sortierschlüssel für Zeitfenster: Fenster über Mitternacht (22:00–06:30) beginnen den Tag
// und stehen deshalb vorn; bei gleicher Startzeit zuerst das breitere, dann nach Tagen.
export function rkSchedSortKey(w) {
  const mins = (v) => {
    const [h, m] = String(v || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  };
  const start = mins(w && w.start);
  const end = mins(w && w.end);
  const days = (w && w.days) || [];
  return [start >= end ? start - 1440 : start, -days.length, String(days.join(""))];
}

// Eigene Zeitfelder: <input type="time"> zeichnet der Browser in der Sprache des
// Betriebssystems (12 h mit AM/PM) – unabhängig von der Zeiteinstellung in Home Assistant.
// Deshalb HH:MM als Textfeld, hier wird die Eingabe geprüft und vereinheitlicht.
export function rkTimeValue(text) {
  const s = String(text || "").trim();
  const parts = s.split(/[:. ]+/).filter(Boolean);
  const digits = s.replace(/\D/g, "");
  let h;
  let min;
  if (parts.length >= 2) {
    h = parseInt(parts[0], 10);
    min = parseInt(parts[1], 10);
  } else if (digits.length <= 2) {
    h = parseInt(digits, 10);
    min = 0;
  } else {
    h = parseInt(digits.slice(0, digits.length - 2), 10);
    min = parseInt(digits.slice(-2), 10);
  }
  if (!Number.isFinite(h) || !Number.isFinite(min) || h < 0 || h > 23 || min < 0 || min > 59) return "";
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

// Welche Wohnung gehört zu dieser Karte? Aus der Konfiguration (ID oder Name),
// sonst aus dem Dashboard, auf dem die Karte liegt (Pfad → Dashboard der Wohnung).
// Vergleichsform für Wohnungsnamen: Kleinschreibung, Umlaute aufgelöst, ohne Sonderzeichen.
const RK_UMLAUT = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
function rkSlug(v) {
  return String(v || "")
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => RK_UMLAUT[c])
    .replace(/[^a-z0-9]/g, "");
}

export function rkHomeId(hass, config = {}) {
  const hs = rkHomes(hass);
  const want = String((config && config.home) || "").trim();
  if (want) {
    const hit =
      hs.find((h) => h.id === want) ||
      hs.find((h) => h.name === want) ||
      hs.find((h) => rkSlug(h.name) === rkSlug(want));
    return hit ? hit.id : want;
  }
  const path = String((hass && hass.panelUrl) || "").replace(/^\//, "");
  if (path) {
    const byPath = hs.find((h) => String(h.dashboard || "").replace(/^\//, "") === path);
    if (byPath) return byPath.id;
    // Auch ohne hinterlegtes Dashboard: Pfad heizung-<name> passt zur Wohnung.
    const seg = path.split("/")[0];
    const hit = hs.find((h) => rkSlug(h.name) && seg.endsWith(rkSlug(h.name)));
    if (hit) return hit.id;
  }
  return null;
}

export function rkHub(hass, home) {
  const out = {};
  const reg = Object.values(hass.entities || {});
  const all = reg.filter((e) => e.platform === "raumklima" && e.translation_key === "presence");
  const pres = (home && all.find((e) => (hass.states[e.entity_id] || { attributes: {} }).attributes.home_id === home)) || all[0];
  if (!pres) return out;
  for (const e of reg) if (e.device_id === pres.device_id && e.translation_key) out[e.translation_key] = e.entity_id;
  return out;
}

// Zieltext je nach Plan (Abwesenheit, Heizpause, …)
// `compact` = kurze Fassung für den Ring in der Raumkarte (iPad/Handy): ohne Einheit und
// ohne den doppelten Ist-Wert, damit der Text im Kreis bleibt.
export function planText(a, off, compact = false) {
  if (off) return t("Heizung aus");
  const r = a.plan_reason;
  if (r === "season") return t("Heizpause");
  if (r === "valve_care") return t("Ventilpflege läuft");
  const tgt = a.effective_target != null ? a.effective_target : a.temperature;
  const wish = a.wish != null ? a.wish : a.temperature;
  if (compact) {
    if (r === "frost") return t("Frostschutz {v}°", { v: fmt(tgt) });
    if (r === "away_short" || r === "away_long") return t("Abgesenkt · Wunsch {w}°", { w: fmt(wish) });
    if (r === "manual") return t("Von Hand · {v}°", { v: fmt(a.temperature) });
    if (r === "room_empty") return t("Leer · {v}°", { v: fmt(tgt) });
    if (r === "schedule") return t("Zeitplan · {v}°", { v: fmt(tgt) });
    if (r === "boost") return t("Boost · {v}°", { v: fmt(tgt) });
    if (r === "schedule_preheat") return t("Vorheizen · {v}°", { v: fmt(tgt) });
    if (r === "sleep") return t("Ruhezeit · {v}°", { v: fmt(tgt) });
    if (r === "solar") return t("Sonne · {v}°", { v: fmt(tgt) });
    return t("Ziel {v}°", { v: fmt(a.temperature) });
  }
  if (r === "frost") return t("Frostschutz <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if ((r === "away_short" || r === "away_long") && a.effective_target != null)
    return t("Abgesenkt <b>{v} °C</b> · Wunsch {w}°", { v: fmt(a.effective_target), w: fmt(wish) });
  if (r === "manual") return t("Ziel <b>{v} °C</b> · von Hand", { v: fmt(a.temperature) });
  if (r === "room_empty" && a.effective_target != null) return t("Raum leer · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "schedule" && a.effective_target != null) return t("Zeitplan · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "boost" && a.effective_target != null) return t("Boost · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "schedule_preheat" && a.effective_target != null) return t("Vorheizen für Zeitplan · <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "sleep" && a.effective_target != null) return t("Ruhezeit · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "solar" && a.effective_target != null) return t("Sonne heizt mit · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  return t("Ziel <b>{v} °C</b>", { v: fmt(a.temperature) });
}

export const VENT = tmap({
  ok: null,
  please_open: { label: "Bitte lüften", icon: "mdi:air-filter", tone: "air" },
  airing: { label: "Lüftet", icon: "mdi:weather-windy", tone: "air" },
  done: { label: "Luft ausgetauscht – du kannst schließen", icon: "mdi:check-decagram", tone: "ok" },
  please_close: { label: "Lüftzeit erreicht – bitte schließen", icon: "mdi:window-closed-variant", tone: "warn" },
  too_cold: { label: "Raum kühlt aus – jetzt schließen", icon: "mdi:snowflake-alert", tone: "cold" },
});

// Ist ein Fenster offen? Kontakt (binary_sensor) oder Dachluke (cover).
export function rkWindowOpen(hass, id) {
  const st = hass.states[id];
  if (!st) return false;
  if (String(id).startsWith("cover.")) {
    if (["open", "opening"].includes(st.state)) return true;
    const pos = st.attributes && st.attributes.current_position;
    return pos != null && Number(pos) > 0;
  }
  return st.state === "on";
}

// Seit wann ist ein Fenster offen? Frühester Wechsel der offenen Kontakte, sonst Raumklimas eigener Zeitpunkt.
export function rkOpenSince(hass, a) {
  if (!a || !a.window_open) return null;
  const times = (a.window_entities || [])
    .map((e) => hass.states[e])
    .filter((s) => s && (s.state === "on" || (s.entity_id || "").startsWith("cover.") && ["open", "opening"].includes(s.state)) && s.last_changed)
    .map((s) => Date.parse(s.last_changed));
  // Eigener Zeitpunkt zählt mit: nach einem Neustart setzt Home Assistant last_changed neu,
  // der Raum weiß aber noch, seit wann das Fenster offen ist (Issue #9).
  if (a.window_open_since) times.push(Date.parse(a.window_open_since));
  return times.length ? Math.min(...times.filter((x) => !isNaN(x))) : null;
}
// Dauer kurz: „45 s“, „12 min“, „1 h 05 min“, „2 Tg. 3 h“
export function rkDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return t("{n} s", { n: s });
  const m = Math.floor(s / 60);
  if (m < 60) return t("{n} min", { n: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("{h} h {m} min", { h, m: String(m % 60).padStart(2, "0") });
  return t("{d} Tg. {h} h", { d: Math.floor(h / 24), h: h % 24 });
}
export function rkClock(ms) {
  const d = new Date(ms);
  const time = rkTime(d, { hour: "2-digit", minute: "2-digit" });
  return Date.now() - ms > 20 * 3600 * 1000 ? `${d.toLocaleDateString(loc(), { weekday: "short" })} ${time}` : time;
}
// Karte neu zeichnen, ohne dass die Seite nach oben springt: Höhe halten, Scrollposition merken.
export function rkPaint(host, html) {
  const root = host.shadowRoot;
  const h = host.offsetHeight;
  const y = window.scrollY;
  const scrollers = [];
  for (let el = host.parentElement || (host.getRootNode() && host.getRootNode().host); el; el = el.parentElement || (el.getRootNode() && el.getRootNode().host)) {
    if (el.scrollTop) scrollers.push([el, el.scrollTop]);
  }
  if (h) host.style.minHeight = `${h}px`;
  root.innerHTML = html;
  if (window.scrollY !== y) window.scrollTo(0, y);
  for (const [el, top] of scrollers) if (el.scrollTop !== top) el.scrollTop = top;
  clearTimeout(host._rkHold);
  host._rkHold = setTimeout(() => { host.style.minHeight = ""; }, 600);
}
// Scrollt jemand gerade? Dann nicht neu zeichnen – sonst kämpft das Neuzeichnen gegen das Scrollen.
let rkLastScroll = 0;
if (typeof window !== "undefined") {
  const mark = () => { rkLastScroll = Date.now(); };
  for (const ev of ["scroll", "wheel", "touchmove"]) window.addEventListener(ev, mark, { capture: true, passive: true });
}
export const rkScrolling = () => Date.now() - rkLastScroll < 600;
export function rkLater(host, fn) {
  clearTimeout(host._rkLater);
  host._rkLater = setTimeout(() => (rkScrolling() ? rkLater(host, fn) : fn()), 700);
}
// Hat sich an den Entitäten dieser Karte etwas geändert? (Home Assistant ersetzt Zustandsobjekte bei Änderung)
export function rkChanged(host, hass, ids) {
  const refs = ids.map((id) => hass.states[id]);
  const prev = host._rkRefs;
  host._rkRefs = refs;
  return !prev || prev.length !== refs.length || refs.some((r, i) => r !== prev[i]);
}
// Tippt oder wählt jemand gerade etwas in der Karte? Dann nicht neu zeichnen.
export function rkBusy(host) {
  const a = host.shadowRoot && host.shadowRoot.activeElement;
  return !!a && ["INPUT", "SELECT", "TEXTAREA"].includes(a.tagName);
}
export const fmt = (v, d = 1) =>
  v === null || v === undefined || isNaN(v) ? "–" : Number(v).toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d });

export const humTone = (h) => (h === null || h === undefined ? "off" : h < 40 ? "warn" : h <= 60 ? "ok" : h < 70 ? "warn" : "cold");

export const STYLES = `
  .boostbtn { all:unset; cursor:pointer; display:inline-flex; gap:5px; align-items:center; padding:5px 12px; border-radius:999px; font-weight:600; font-size:.84rem;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color: var(--secondary-text-color); }
  .boostbtn ha-icon { --mdc-icon-size:16px; }
  .boostbtn.on { background: var(--rk-heat); color:#fff; }
  :host { --rk-heat:#ff7a45; --rk-ok:#2ec4a6; --rk-air:#4f9dff; --rk-warn:#ffb020; --rk-cold:#ff4d6d; --rk-off:#8a94a6; --rk-eco:#8b7cf6; }
  ha-card { display:block; position:relative; box-sizing:border-box; overflow:hidden; border-radius:28px; padding:20px; isolation:isolate;
    background: var(--ha-card-background, var(--card-background-color)); transition: box-shadow .3s; }
  ha-card::before { content:""; position:absolute; inset:-40% -20% auto auto; width:320px; height:320px; z-index:-1;
    background: radial-gradient(circle, var(--tone) 0%, transparent 65%); opacity:.18; transition: background .6s; }
  .top { display:flex; align-items:center; gap:12px; }
  .name { font-size:1.15rem; font-weight:600; letter-spacing:-.01em; cursor:pointer; flex:1; color:var(--primary-text-color); }
  .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    color:var(--tone); background: color-mix(in srgb, var(--tone) 14%, transparent); white-space:nowrap; }
  .chip ha-icon { --mdc-icon-size:16px; }
  .wins { display:flex; gap:4px; color:var(--secondary-text-color); }
  .wins ha-icon { --mdc-icon-size:20px; }
  .wins .open { color: var(--rk-air); }
  .since { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:.85rem; font-weight:600; color:var(--rk-air); font-variant-numeric:tabular-nums; }
  .since ha-icon { --mdc-icon-size:16px; }
  .since.occ { color:var(--secondary-text-color); margin-top:2px; font-weight:500; }
  .since.occ.in { color:var(--rk-ok); }
  .dial { position:relative; display:grid; place-items:center; margin:8px auto 4px; width:min(240px,100%); aspect-ratio:1/0.82; container-type: inline-size; }
  .dial svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .track { stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
  .fill { stroke: var(--tone); transition: stroke-dasharray .6s ease, stroke .6s; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tone) 55%, transparent)); }
  .knob { fill: var(--ha-card-background, var(--card-background-color)); stroke: var(--tone); stroke-width:3; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
  .fill.muted { stroke: var(--rk-off); filter:none; opacity:.5; }
  .scale { font-size:10px; fill: var(--secondary-text-color); }
  .tlabel { font-size:11px; font-weight:600; fill: var(--tone); }
  /* Text bleibt IM Ring: Breite begrenzen und umbrechen, sonst schneidet er den Bogen (iPad/Handy). */
  .center { text-align:center; z-index:1; margin-top:-6px; max-width:58%; min-width:0; }
  .now { font-size:2.9rem; font-size:clamp(2.1rem, 17cqw, 3.1rem); font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .now small { font-size:.42em; vertical-align: super; margin-left:2px; color:var(--secondary-text-color); }
  .target { margin-top:6px; font-size:.82rem; line-height:1.25; color:var(--secondary-text-color); font-variant-numeric: tabular-nums; text-wrap: balance; overflow-wrap:anywhere; }
  .target b { color:var(--primary-text-color); font-weight:600; }
  .ctrl { display:flex; justify-content:center; align-items:center; gap:18px; margin-top:4px; }
  button.round { all:unset; cursor:pointer; width:48px; height:48px; border-radius:50%; display:grid; place-items:center;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); color:var(--primary-text-color); transition: transform .15s, background .2s; }
  button.round:hover { background: color-mix(in srgb, var(--tone) 22%, transparent); }
  button.round:active { transform: scale(.92); }
  button.round[disabled] { opacity:.35; pointer-events:none; }
  .banner { margin-top:16px; border-radius:18px; padding:12px 14px; display:flex; align-items:center; gap:10px;
    color: var(--vt); background: color-mix(in srgb, var(--vt) 13%, transparent); font-weight:600; font-size:.9rem; }
  .banner .grow { flex:1; }
  .bar { height:6px; border-radius:6px; background: color-mix(in srgb, var(--vt) 18%, transparent); overflow:hidden; margin-top:8px; }
  .bar > i { display:block; height:100%; background: var(--vt); border-radius:6px; transition: width 1s linear; }
  .count { font-variant-numeric: tabular-nums; }
  .stats { display:grid; grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); gap:8px; margin-top:16px; }
  .stat { border-radius:16px; padding:10px 12px; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .stat .l { font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--secondary-text-color); display:flex; align-items:center; gap:4px; }
  .stat .l ha-icon { --mdc-icon-size:14px; }
  .stat .v { font-size:1.05rem; font-weight:600; margin-top:2px; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .stat .v.tone { color: var(--st); }
  .stat .v small { font-size:.75rem; font-weight:500; color:var(--secondary-text-color); margin-left:4px; }
  .actions { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
  .pill { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color:var(--secondary-text-color); transition: background .2s, color .2s; }
  .pill.on { background: color-mix(in srgb, var(--tone) 16%, transparent); color: var(--tone); }
  .pill ha-icon { --mdc-icon-size:16px; }
  .sync { margin-left:auto; display:inline-flex; align-items:center; gap:4px; font-size:.75rem; color:var(--secondary-text-color); }
  .sync ha-icon { --mdc-icon-size:14px; }
  .sync.pending { color: var(--rk-warn); } .sync.failed { color: var(--rk-cold); }
  .err { padding:16px; color: var(--rk-cold); }
`;

export function toneVar(tone) { return `var(--rk-${tone || "off"})`; }

// ---------------------------------------------------------------- Zeitpläne
const DAY_LOCALE = { de: "de-DE", en: "en-GB", fr: "fr-FR" };
// 2.11.2026 ist ein Montag – daraus die Wochentagsnamen in der Systemsprache
export function schedDayName(index) {
  const d = new Date(2026, 10, 2 + Number(index));
  return new Intl.DateTimeFormat(DAY_LOCALE[getLang()] || "en-GB", { weekday: "short" }).format(d);
}
export function schedDaysLabel(days) {
  const list = (days || []).slice().sort((a, b) => a - b);
  if (!list.length || list.length === 7) return t("täglich");
  return list.map(schedDayName).join(" ");
}
export function schedSummary(w) {
  return `${schedDaysLabel(w.days)} · ${w.start || "–"}–${w.end || "–"} · ${fmt(w.temperature)} °C`;
}

export const RK_COLORS = ["#ff7a45", "#4f9dff", "#a78bfa", "#2ec4a6", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];
export const SEG = tmap({
  season_off: { c: "color-mix(in srgb, var(--rk-off) 25%, transparent)", l: "Heizpause" },
  setback: { c: "var(--rk-eco)", l: "Abgesenkt" },
  heating: { c: "var(--rk-heat)", l: "Heizt" },
  idle: { c: "var(--rk-ok)", l: "Erreicht" },
  window_open: { c: "var(--rk-air)", l: "Fenster offen" },
  night_airing: { c: "color-mix(in srgb, var(--rk-air) 55%, #1e2a5a)", l: "Nachtlüften" },
  off: { c: "color-mix(in srgb, var(--rk-off) 45%, transparent)", l: "Aus" },
  sensor_unavailable: { c: "var(--rk-warn)", l: "Fühler fehlt" },
  trv_unavailable: { c: "var(--rk-cold)", l: "TRV weg" },
});

// ---------------------------------------------------------------- Darstellung je Wohnung (A3)
const RK_LAYOUT_EMPTY = { order: [], hidden: [], size: {}, color: {} };
const RK_LAYOUT_CACHE = new Map();

export function rkLayout(hass, home) {
  const key = String(home || "");
  if (!RK_LAYOUT_CACHE.has(key)) {
    RK_LAYOUT_CACHE.set(
      key,
      hass.callWS({ type: "raumklima/layout/get", home: home || null })
        .then((r) => ({ ...RK_LAYOUT_EMPTY, ...((r && r.layout) || {}) }))
        .catch(() => ({ ...RK_LAYOUT_EMPTY })),
    );
  }
  return RK_LAYOUT_CACHE.get(key);
}

export function rkLayoutRemember(layout, home) {
  if (layout) RK_LAYOUT_CACHE.set(String(home || ""), Promise.resolve({ ...RK_LAYOUT_EMPTY, ...layout }));
}

/** Ausblenden und Reihenfolge anwenden. Räume ohne Eintrag behalten ihre alte Reihenfolge. */
export function rkLayoutApply(rooms, layout) {
  const L = layout || RK_LAYOUT_EMPTY;
  const hidden = new Set(L.hidden || []);
  const order = L.order || [];
  const pos = (r) => { const i = order.indexOf(r.id); return i < 0 ? order.length : i; };
  return rooms.filter((r) => !hidden.has(r.id)).sort((a, b) => pos(a) - pos(b));
}

export function rkLayoutSize(layout, id) {
  return ((layout || RK_LAYOUT_EMPTY).size || {})[id] || null;
}

export function rkLayoutColor(layout, id) {
  return ((layout || RK_LAYOUT_EMPTY).color || {})[id] || null;
}

export function rkRooms(hass, prefix, home) {
  const reg = Object.values(hass.entities || {});
  const rooms = reg
    .filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate."))
    .map((e) => {
      const st = hass.states[e.entity_id];
      const sib = {};
      reg.forEach((x) => { if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id; });
      const full = (st && st.attributes.friendly_name) || e.entity_id;
      return { id: e.entity_id, name: prefix ? full.replace(new RegExp("^" + escRe(prefix) + "\\s*"), "") : full, attrs: st ? st.attributes : {}, sib };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const mine = home ? rooms.filter((r) => !r.attrs.home || r.attrs.home === home) : rooms;
  mine.forEach((r, i) => { r.color = RK_COLORS[i % RK_COLORS.length]; });
  return mine;
}

export const RK_ROOM_TYPES = tmap({ living: "Wohnraum", kitchen: "Küche", bedroom: "Schlafzimmer", bathroom: "Bad", children: "Kinderzimmer", rarely_used: "Selten genutzt" });
export const RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Keine" });
export const RK_OFF = tmap({ auto: "Automatisch", preset: "Preset „aus“", hvac: "Modus „aus“", min_temp: "Minimaltemperatur" });
export const RK_SYNC = tmap({ ok: ["Synchron", "ok"], pending: ["Wird übertragen", "warn"], failed: ["Fehlgeschlagen", "cold"] });
export const RK_BUILDING = tmap({ unrenovated: "Altbau unsaniert", renovated: "Altbau saniert", new: "Neubau / gedämmt" });
export const RK_NIGHT = tmap({ auto: "Automatisch", on: "Ja", off: "Nein" });
// Anbieter für den Mail-Versand: Server, Port, Verschlüsselung, Name
export const RK_MAIL_PROVIDERS = {
  gmail: ["smtp.gmail.com", 587, "starttls", "Gmail"],
  gmx: ["mail.gmx.net", 587, "starttls", "GMX"],
  webde: ["smtp.web.de", 587, "starttls", "WEB.DE"],
  outlook: ["smtp-mail.outlook.com", 587, "starttls", "Outlook / Hotmail"],
  tonline: ["securesmtp.t-online.de", 465, "ssl", "T-Online"],
  icloud: ["smtp.mail.me.com", 587, "starttls", "iCloud"],
  posteo: ["posteo.de", 587, "starttls", "Posteo"],
  einsundeins: ["smtp.1und1.de", 587, "starttls", "1&1"],
  ionos: ["smtp.ionos.de", 587, "starttls", "IONOS"],
};
export const RK_PKIND = tmap({ auto: "Automatisch", mmwave: "mmWave", pir: "PIR" });
export const RK_HOMESENS = tmap({ mmwave: "nur mmWave", all: "mmWave + PIR", off: "keine" });
export const RK_MODES = tmap({ auto: "Automatisch", always: "Immer heizen", pause: "Heizpause" });
export const RK_KINDS = tmap({
  vent_open: ["💧", "Bitte lüften"],
  vent_close: ["🪟", "Fenster schließen"],
  too_cold: ["🥶", "Raum kühlt aus"],
  vent_done: ["✅", "Luft ausgetauscht"],
  window_away: ["🚪", "Fenster offen, niemand da"],
  presence: ["🏠", "Abwesenheit & Vorheizen"],
  season: ["🍂", "Heizsaison Start/Ende"],
  trv_failure: ["⚠️", "Thermostat reagiert nicht"],
  health: ["🩺", "Gesundheit der Heizung"],
  report: ["📊", "Wochenbericht"],
  live: ["📱", "Lüft-Countdown auf dem Sperrbildschirm"],
});
export const RK_LIGHT_SIGNALS = tmap({
  open: ["#005aff", "Bitte lüften"],
  close: ["#ff6e00", "Bitte schließen"],
  done: ["#00c83c", "Luft ausgetauscht"],
  problem: ["#ff0000", "Problem mit der Heizung"],
});
export const RK_DEFAULT_PUSH = ["vent_open", "vent_close", "too_cold", "vent_done", "window_away", "season", "trv_failure", "health", "report"];
export const RK_SEV = tmap({ alert: ["cold", "mdi:alert-octagon-outline", "Dringend"], warn: ["warn", "mdi:alert-outline", "Prüfen"], info: ["air", "mdi:information-outline", "Hinweis"] });
export function rkIssueList(issues, withRoom, prefix) {
  if (!issues || !issues.length) return `<div class="hok"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t("Alles in Ordnung – Thermostate, Fühler, Batterien und Funk unauffällig.")}</div>`;
  const order = { alert: 0, warn: 1, info: 2 };
  return `<div class="issues">${[...issues].sort((a, b) => order[a.severity] - order[b.severity]).map((i) => {
    const sv = RK_SEV[i.severity] || RK_SEV.info;
    return `<div class="issue" style="--c:${toneVar(sv[0])}"><ha-icon icon="${sv[1]}"></ha-icon><div><b>${withRoom && i.room ? esc(prefix ? (i.room.startsWith(prefix) ? i.room.slice(prefix.length).trimStart() : i.room) : i.room) + ": " : ""}${esc(i.title)}</b><small>${esc(i.message)}</small></div><span class="tag">${sv[2]}</span></div>`;
  }).join("")}</div>`;
}
export const ISSUE_STYLES = `
  .issues { display:grid; gap:10px; }
  .issue { display:grid; grid-template-columns: 26px 1fr auto; gap:12px; align-items:center; padding:12px 14px; border-radius:16px;
    background: color-mix(in srgb, var(--c) 9%, var(--ha-card-background, var(--card-background-color))); border:1px solid color-mix(in srgb, var(--c) 22%, transparent); }
  .issue > ha-icon { color: var(--c); --mdc-icon-size:24px; }
  .issue b { display:block; font-size:1rem; color:var(--primary-text-color); }
  .issue small { display:block; font-size:.88rem; color:var(--secondary-text-color); margin-top:2px; line-height:1.35; }
  .issue .tag { font-size:.78rem; font-weight:700; padding:3px 9px; border-radius:999px; background: color-mix(in srgb, var(--c) 18%, transparent); color: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); }
  .hok { display:flex; align-items:center; gap:10px; font-size:.98rem; color:var(--primary-text-color); }
  .hok ha-icon { color: var(--rk-ok); }
`;

export function rkPretty(target) {
  const s = String(target || "").replace(/^(notify|tts|media_player)\./, "").replace(/^mobile_app_/, "");
  return s.split("_").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || target;
}
export const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const HISTORY_STYLES = `
  .hhead { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .htitle { font-size:1.15rem; font-weight:650; letter-spacing:-.01em; flex:1; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; }
  .htitle ha-icon { color: var(--tone); --mdc-icon-size:22px; }
  .seg { display:inline-flex; padding:3px; border-radius:999px; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .seg button { all:unset; cursor:pointer; padding:6px 12px; border-radius:999px; font-size:.8rem; font-weight:600; color:var(--secondary-text-color); }
  .seg button.on { background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.12); }
  .legend { display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 6px; }
  .lchip { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:6px 12px 6px 8px; border-radius:999px; font-size:.82rem; font-weight:600;
    background: color-mix(in srgb, var(--c) 12%, transparent); color: var(--primary-text-color); transition: opacity .2s, background .2s; }
  .lchip i { width:10px; height:10px; border-radius:50%; background: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent); }
  .lchip b { font-variant-numeric: tabular-nums; color: var(--c); }
  .lchip.off { opacity:.4; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .chart { position:relative; height: var(--h, 240px); margin-top:6px; }
  .chart svg { width:100%; height:100%; overflow:visible; display:block; }
  .grid line { stroke: color-mix(in srgb, var(--primary-text-color) 8%, transparent); stroke-dasharray: 3 5; }
  .ylab, .xlab { font-size:10.5px; fill: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  .band { fill: color-mix(in srgb, var(--rk-ok) 10%, transparent); }
  .bandlab { font-size:10px; fill: color-mix(in srgb, var(--rk-ok) 80%, var(--secondary-text-color)); font-weight:600; }
  .line { fill:none; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; transition: opacity .2s; }
  .hover-line { stroke: color-mix(in srgb, var(--primary-text-color) 35%, transparent); stroke-width:1; }
  .tip { position:absolute; top:6px; pointer-events:none; padding:10px 12px; border-radius:14px; font-size:.8rem; min-width:150px;
    background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color)) 92%, transparent); backdrop-filter: blur(8px);
    box-shadow: 0 8px 28px rgba(0,0,0,.18); border:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); color:var(--primary-text-color); }
  .tip .t { font-weight:650; margin-bottom:6px; color: var(--secondary-text-color); }
  .tip .r { display:flex; align-items:center; gap:8px; justify-content:space-between; }
  .tip .r span { display:flex; align-items:center; gap:6px; }
  .tip .r i { width:8px; height:8px; border-radius:50%; background: var(--c); }
  .tip .r b { font-variant-numeric: tabular-nums; }
  .empty { padding:40px 0; text-align:center; color: var(--secondary-text-color); }
  .tl { display:grid; grid-template-columns: 110px 1fr; gap:10px 14px; align-items:center; margin-top:14px; }
  .tl .n { font-weight:600; font-size:.88rem; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tl .bar { position:relative; height:22px; border-radius:8px; overflow:hidden; background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .tl .bar > i { position:absolute; top:0; bottom:0; border-radius:0; }
  .tl .bar > em { position:absolute; top:-2px; bottom:-2px; border-radius:4px; outline: 2px solid var(--rk-air); outline-offset:-2px; background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 22%, transparent) 0 4px, transparent 4px 8px); }
  .tlx { display:flex; justify-content:space-between; margin:6px 0 0 124px; font-size:10.5px; color: var(--secondary-text-color); }
  .tleg { display:flex; flex-wrap:wrap; gap:14px; margin-top:14px; font-size:.78rem; color: var(--secondary-text-color); }
  .tleg span { display:inline-flex; align-items:center; gap:6px; }
  .tleg i { width:14px; height:10px; border-radius:3px; background: var(--c); }
`;

export const SETTINGS_STYLES = `
  details.adv { margin: 12px 0 2px; border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  details.adv > summary { cursor: pointer; padding: 12px 2px 4px; font-size: .88rem; font-weight: 600; color: var(--secondary-text-color);
    list-style: none; display: flex; align-items: center; gap: 8px; }
  details.adv > summary::-webkit-details-marker { display: none; }
  details.adv > summary::before { content: "▸"; font-size: .8rem; }
  details.adv[open] > summary::before { content: "▾"; }
  .sched { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .sched .days { display:flex; gap:4px; }
  .sched .d { all:unset; cursor:pointer; width:32px; height:27px; line-height:27px; border-radius:8px; text-align:center; font-size:.78rem; font-weight:600;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--secondary-text-color); }
  .sched .d.on { background: var(--rk-heat); color:#fff; }
  .sched input.tm { font:inherit; padding:5px 8px; border-radius:8px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: transparent; color: var(--primary-text-color); }
  /* HH:MM-Felder: der Browser würde <input type="time"> je nach Betriebssystem mit AM/PM zeichnen */
  .inp.hm, .sched input.tm { width: 76px; text-align: center; font-variant-numeric: tabular-nums; }
  .sched .temp { min-width:58px; text-align:right; font-variant-numeric: tabular-nums; }
  .sched .del { all:unset; cursor:pointer; padding:3px 7px; border-radius:8px; color: var(--rk-cold); }
  .sched .add { all:unset; cursor:pointer; display:inline-flex; gap:6px; align-items:center; margin-top:8px; padding:7px 14px; border-radius:10px;
    font-weight:600; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); color: var(--primary-text-color); }
  ha-card.settings { container-type: inline-size; padding: 26px 28px; max-width: 1500px; margin: 12px auto; }
  @media (max-width: 600px) { ha-card.settings { padding: 18px 16px; margin: 0; } }
  ha-card.settings .htitle { font-size:1.45rem; }
  ha-card.settings .htitle ha-icon { --mdc-icon-size:28px; }
  .tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:14px -4px 4px; padding:2px 4px 6px; }
  .tabs::-webkit-scrollbar { display:none; }
  .tabs.homes { margin-bottom:0; } .tabs.homes .tab { font-size:1.02rem; }
  .tab { all:unset; cursor:pointer; white-space:nowrap; padding:10px 18px; border-radius:999px; font-size:.98rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .tab ha-icon { --mdc-icon-size:16px; }
  .tab.on { background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); }
  .tab .dot { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-ok)); }
  /* Brotkrumen, Suche und Gruppenleiste (Einstellungen) */
  .crumb { margin:10px 4px 0; font-size:.82rem; color:var(--secondary-text-color); display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .crumb b { color:var(--primary-text-color); font-weight:600; }
  .dotbtn { all:unset; cursor:pointer; width:22px; height:22px; border-radius:50%; background:var(--c); border:2px solid transparent; }
  .dotbtn.on { border-color: var(--primary-text-color); }
  .lname { display:inline-flex; align-items:center; gap:4px; }
  .lname .mini { all:unset; cursor:pointer; padding:0 4px; color:var(--secondary-text-color); font-size:.8rem; }
  .lname .mini[disabled] { opacity:.25; cursor:default; }
  .resetbar { display:flex; gap:10px; align-items:center; justify-content:space-between; flex-wrap:wrap; margin:8px 4px 0; font-size:.82rem; color:var(--secondary-text-color); }
  .resetbar .btn { padding:6px 12px; font-size:.82rem; }
  .searchrow { display:flex; gap:8px; align-items:center; margin:10px 4px 0; }
  .searchrow input { flex:1; min-width:0; padding:10px 14px; border-radius:12px; border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); color:var(--primary-text-color); font-size:.95rem; }
  .searchrow input:focus { outline:2px solid color-mix(in srgb, var(--rk-heat) 40%, transparent); }
  .rail { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:10px -4px 2px; padding:2px 4px 6px; }
  .rail::-webkit-scrollbar { display:none; }
  .railbtn { all:unset; cursor:pointer; white-space:nowrap; padding:8px 14px; border-radius:10px; font-size:.9rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .railbtn ha-icon { --mdc-icon-size:16px; }
  .railbtn.on { background: color-mix(in srgb, var(--rk-heat) 16%, transparent); color:var(--primary-text-color); }
  .railbtn.empty { display:none; }
  .nosearch { padding:24px 8px; text-align:center; color:var(--secondary-text-color); font-size:.95rem; }
  .groups { display:grid; grid-template-columns: 1fr; gap:18px; margin-top:14px; }
  @container (min-width: 720px) { .groups { grid-template-columns: 1fr 1fr; } }
  @container (min-width: 1000px) { .grp.cols .rws { columns: 2; column-gap: 56px; } .grp.cols .row { break-inside: avoid; } }
  .grp { border-radius:24px; padding:20px 22px; background: color-mix(in srgb, var(--g, var(--rk-off)) 7%, transparent); border:1px solid color-mix(in srgb, var(--g, var(--rk-off)) 14%, transparent); min-width:0; }
  .grp.span { grid-column: 1 / -1; }
  .gh { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
  .gh .ic { width:40px; height:40px; border-radius:12px; display:grid; place-items:center; background: color-mix(in srgb, var(--g) 18%, transparent); color: var(--g); flex:none; }
  .gh .ic ha-icon { --mdc-icon-size:22px; }
  .gh b { font-size:1.15rem; color:var(--primary-text-color); flex:1; }
  .row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent); min-height:30px; }
  .rws > .row:first-child { border-top:0; }
  .row .l { font-size:1rem; color:var(--primary-text-color); min-width:0; }
  .row .lbl { display:inline-flex; align-items:center; gap:6px; }
  .qm { all:unset; cursor:pointer; flex:none; width:18px; height:18px; border-radius:50%; display:inline-grid; place-items:center; font-size:.72rem; font-weight:700;
    color: var(--secondary-text-color); border:1.5px solid color-mix(in srgb, var(--secondary-text-color) 55%, transparent); }
  .qm:hover, .qm.on { color:#fff; background: var(--g, var(--rk-air)); border-color: var(--g, var(--rk-air)); }
  .qm:focus-visible { outline:2px solid var(--g, var(--rk-air)); outline-offset:2px; }
  .mailbox { margin:4px 0 10px; border-radius:14px; background: color-mix(in srgb, var(--g, var(--rk-air)) 7%, transparent); padding:4px 12px; }
  .mailbox > summary, .adv > summary { cursor:pointer; padding:10px 0; font-weight:600; display:flex; align-items:center; gap:8px; color: var(--primary-text-color); }
  .mailbox > summary .ok { color: var(--rk-ok); font-weight:500; font-size:.85rem; } .mailbox > summary .no { color: var(--secondary-text-color); font-weight:500; font-size:.85rem; }
  .adv > summary { font-weight:500; font-size:.9rem; color: var(--secondary-text-color); }
  .mailform { display:flex; flex-direction:column; gap:10px; padding-bottom:12px; }
  .mf { display:flex; flex-direction:column; align-items:stretch; gap:4px; }
  .mf > span { color: var(--primary-text-color); } .mf small { display:block; color: var(--secondary-text-color); font-size:.8rem; }
  .mf .inp, .mf .sel { width:100%; box-sizing:border-box; text-align:left; }
  .mf .segs { align-self:flex-start; }
  .mailact { display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
  .msteps { display:flex; flex-direction:column; gap:6px; }
  .mstep { display:flex; gap:10px; align-items:flex-start; padding:8px 10px; border-radius:10px; font-size:.88rem; line-height:1.35; color: var(--primary-text-color); }
  .mstep > b { flex:none; width:20px; height:20px; border-radius:50%; display:grid; place-items:center; color:#fff; font-size:.75rem; }
  .mstep.ok { background: color-mix(in srgb, var(--rk-ok) 10%, transparent); } .mstep.ok > b { background: var(--rk-ok); }
  .mstep.bad { background: color-mix(in srgb, var(--rk-cold, #e5484d) 10%, transparent); } .mstep.bad > b { background: var(--rk-cold, #e5484d); }
  .hint.okmsg { color: var(--rk-ok); font-weight:600; } .hint.errmsg { color: var(--rk-cold, #e5484d); font-weight:600; }
  .helpbox { margin:-4px 0 10px; padding:10px 12px; border-radius:12px; font-size:.88rem; line-height:1.45; color: var(--primary-text-color);
    background: color-mix(in srgb, var(--g, var(--rk-air)) 10%, var(--card-background-color, #fff)); border-left:3px solid var(--g, var(--rk-air)); }
  .row .l small { display:block; color:var(--secondary-text-color); font-size:.84rem; margin-top:1px; }
  .row .v { font-size:1rem; font-weight:600; color:var(--primary-text-color); text-align:right; font-variant-numeric:tabular-nums; }
  .row .v.mute { color:var(--secondary-text-color); font-weight:500; }
  .stepper.mv button { font-size:.7rem; padding:2px 5px; }
  .stepper.mv button[disabled] { opacity:.3; cursor:default; }
  .stepper { display:inline-flex; align-items:center; gap:4px; background: var(--ha-card-background, var(--card-background-color)); border-radius:999px; padding:3px; box-shadow: 0 1px 3px rgba(0,0,0,.08); flex:none; }
  .stepper button { all:unset; cursor:pointer; width:34px; height:34px; border-radius:50%; display:grid; place-items:center; font-size:1.2rem; font-weight:700; color:var(--g); background: color-mix(in srgb, var(--g) 12%, transparent); }
  .stepper button:active { transform: scale(.92); }
  .stepper span { min-width:70px; text-align:center; font-weight:650; font-variant-numeric:tabular-nums; font-size:1.05rem; color:var(--primary-text-color); }
  .stepper.ro button { display:none; }
  .tgl { all:unset; cursor:pointer; width:52px; height:30px; border-radius:999px; position:relative; background: color-mix(in srgb, var(--primary-text-color) 18%, transparent); transition: background .2s; flex:none; }
  .tgl::after { content:""; position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.25); transition: transform .2s; }
  .tgl.on { background: var(--g, var(--rk-ok)); }
  .tgl.on::after { transform: translateX(22px); }
  .tgl[disabled] { opacity:.5; cursor:default; }
  .segs { display:inline-flex; flex-wrap:wrap; gap:4px; padding:3px; border-radius:16px; background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .segs button { all:unset; cursor:pointer; padding:8px 12px; border-radius:13px; font-size:.88rem; font-weight:600; color:var(--secondary-text-color); }
  .segs button.on { background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.12); }
  .chips { display:flex; flex-wrap:wrap; gap:6px; justify-content:flex-end; }
  .chip2 { all:unset; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.9rem; font-weight:600; background: color-mix(in srgb, var(--c, var(--rk-air)) 14%, transparent); color: var(--primary-text-color); }
  button.chip2 { cursor:pointer; }
  .chip2 .kb { font-size:.68rem; font-weight:700; padding:1px 6px; border-radius:6px; background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); color: var(--secondary-text-color); }
  .chip2 i { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-air)); }
  .chip2.off { opacity:.45; }
  .chip2.strike { opacity:.45; text-decoration: line-through; }
  .sel, .inp { font: inherit; font-size:.95rem; font-weight:600; padding:8px 12px; border-radius:12px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); max-width: 260px; }
  .inp.short { width: 86px; text-align:center; }
  .people { display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr)); gap:14px; }
  @container (max-width: 560px) {
    .row { flex-wrap: wrap; row-gap: 8px; }
    .row .l { flex: 1 1 100%; }
    .row > :last-child { margin-left: auto; }
    .row .chips { justify-content: flex-start; margin-left: 0; }
    .segs { width: 100%; }
    .segs button { flex: 1; text-align: center; }
    .person { padding: 12px; }
  }
  .person { display:flex; gap:14px; align-items:flex-start; padding:16px; border-radius:18px; background: var(--ha-card-background, var(--card-background-color)); box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .av { width:48px; height:48px; border-radius:14px; flex:none; display:grid; place-items:center; font-weight:700; font-size:1.2rem; color:#fff; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 60%, #000)); }
  .av ha-icon { --mdc-icon-size:22px; }
  .person .pb { flex:1; min-width:0; }
  .person .ph { display:flex; align-items:center; gap:8px; }
  .person .ph b { flex:1; font-size:1.08rem; color:var(--primary-text-color); }
  .person small { display:block; font-size:.86rem; color:var(--secondary-text-color); margin:1px 0 9px; }
  .person .chips { justify-content:flex-start; }
  .mini { all:unset; cursor:pointer; padding:5px 10px; border-radius:10px; font-size:.8rem; font-weight:650; color: var(--secondary-text-color); background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .mini.x { padding:5px 9px; }
  .addrow { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:14px; }
  .msgs { display:grid; gap:10px; }
  .msg { display:grid; grid-template-columns: 40px 1fr auto; gap:14px; align-items:center; padding:14px 16px; border-radius:16px; background: var(--ha-card-background, var(--card-background-color)); box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .msg .e { font-size:1.5rem; text-align:center; }
  .msg b { font-size:1.02rem; color:var(--primary-text-color); display:block; }
  .msg small { font-size:.88rem; color:var(--secondary-text-color); }
  .msg .tag { font-size:.8rem; font-weight:700; padding:3px 8px; border-radius:999px; background: color-mix(in srgb, var(--c) 16%, transparent); color: color-mix(in srgb, var(--c) 75%, var(--primary-text-color)); white-space:nowrap; }
  .status { display:flex; flex-wrap:wrap; gap:8px; margin: 2px 0 8px; }
  .tbl { width:100%; border-collapse:separate; border-spacing:0 8px; font-size:1rem; }
  .tblwrap { overflow-x:auto; margin: 0 -4px; padding: 0 4px; }
  .tbl th { text-align:left; font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; color:var(--secondary-text-color); padding:0 10px 2px; white-space:nowrap; }
  .tbl td { padding:14px 12px; background: var(--ha-card-background, var(--card-background-color)); white-space:nowrap; font-variant-numeric:tabular-nums; color:var(--primary-text-color); }
  .tbl tr td:first-child { border-radius:14px 0 0 14px; font-weight:650; }
  .tbl tr td:last-child { border-radius:0 14px 14px 0; }
  .tbl tbody tr { cursor:pointer; }
  .tbl .rn { display:flex; align-items:center; gap:8px; }
  .tbl .rn i { width:9px; height:9px; border-radius:50%; background: var(--c); }
  .ok { color: var(--rk-ok); } .no { color: var(--secondary-text-color); }
  .tbl.sm td { padding:10px 12px; } .tbl.sm tbody tr { cursor:default; }
  .lt { font-size:.72rem; font-weight:700; padding:1px 6px; border-radius:999px; background: color-mix(in srgb, var(--rk-eco) 18%, transparent); color: color-mix(in srgb, var(--rk-eco) 75%, var(--primary-text-color)); vertical-align:1px; }
  .foot { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
  .btn { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:16px; font-weight:600; font-size:1rem;
    background: color-mix(in srgb, var(--c, var(--primary-text-color)) 9%, transparent); color: var(--primary-text-color); }
  .btn ha-icon { --mdc-icon-size:18px; color: var(--c, var(--primary-text-color)); }
  .btn.primary { background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); }
  .btn.primary ha-icon { color: inherit; }
  .hint { font-size:.9rem; color:var(--secondary-text-color); margin-top:12px; line-height:1.45; }
  .toast { position:sticky; bottom:8px; margin-top:12px; padding:10px 14px; border-radius:14px; font-size:.9rem; font-weight:600; background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); width:max-content; max-width:100%; }
`;

export const REPORT_STYLES = `
  .pdfmk { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
  .pdflist { display:flex; flex-direction:column; gap:6px; }
  .pdfrow { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:12px; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .pdfrow > ha-icon { color: var(--rk-cold, #e5484d); --mdc-icon-size:26px; }
  .pdfi { flex:1; display:flex; flex-direction:column; min-width:0; }
  .pdfi b { font-weight:600; color: var(--primary-text-color); }
  .pdfi small { color: var(--secondary-text-color); font-size:.8rem; }
  .pdfi .no { font-weight:500; color: var(--secondary-text-color); font-size:.8rem; }
  ha-card.report { container-type: inline-size; padding: 24px 26px; }
  @media (max-width: 600px) { ha-card.report { padding: 18px 16px; } }
  .rsub { font-size:.9rem; color:var(--secondary-text-color); margin-top:2px; }
  .tiles { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; margin-top:18px; }
  @container (min-width: 640px) { .tiles { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @container (min-width: 980px) { .tiles { grid-template-columns: repeat(6, minmax(0,1fr)); } }
  .tile { border-radius:20px; padding:16px; background: color-mix(in srgb, var(--c) 9%, transparent); border:1px solid color-mix(in srgb, var(--c) 16%, transparent); min-width:0; }
  .tile .k { font-size:.82rem; font-weight:600; color:var(--secondary-text-color); display:flex; align-items:center; gap:6px; }
  .tile .k ha-icon { --mdc-icon-size:16px; color: var(--c); }
  .tile .n { font-size:1.9rem; font-weight:700; letter-spacing:-.02em; color:var(--primary-text-color); margin-top:6px; font-variant-numeric:tabular-nums; line-height:1.1; }
  .tile .n small { font-size:.95rem; font-weight:600; color:var(--secondary-text-color); margin-left:2px; }
  .tile .d { font-size:.82rem; color:var(--secondary-text-color); margin-top:4px; }
  .tile .d.good { color: var(--rk-ok); font-weight:650; } .tile .d.bad { color: var(--rk-cold); font-weight:650; }
  .rsec { margin-top:26px; }
  .rsec h3 { margin:0 0 12px; font-size:1.05rem; font-weight:650; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; }
  .rsec h3 ha-icon { --mdc-icon-size:20px; color:var(--secondary-text-color); }
  .days { display:flex; align-items:flex-end; gap:3px; height:150px; padding-top:8px; }
  .day { flex:1; min-width:0; display:flex; flex-direction:column; justify-content:flex-end; height:100%; position:relative; }
  .day .stk { display:flex; flex-direction:column-reverse; border-radius:5px 5px 2px 2px; overflow:hidden; min-height:2px; background: color-mix(in srgb, var(--rk-off) 15%, transparent); }
  .day .stk i { display:block; background: var(--c); }
  .day.today .stk { outline:2px solid var(--primary-text-color); outline-offset:1px; }
  .day .hdd { position:absolute; left:50%; width:6px; height:6px; margin-left:-3px; border-radius:50%; background: var(--rk-air); box-shadow:0 0 0 2px var(--ha-card-background, var(--card-background-color)); }
  .daylab { display:flex; gap:3px; margin-top:6px; }
  .daylab span { flex:1; min-width:0; text-align:center; font-size:.7rem; color:var(--secondary-text-color); overflow:hidden; }
  .lg { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:10px; font-size:.84rem; color:var(--secondary-text-color); }
  .lg span { display:inline-flex; align-items:center; gap:6px; }
  .lg i { width:10px; height:10px; border-radius:3px; background: var(--c); }
  .lg i.dot { border-radius:50%; }
  .rrows { display:grid; gap:10px; }
  .rrow { display:grid; grid-template-columns: minmax(90px, 160px) 1fr; gap:14px; align-items:center; padding:12px 14px; border-radius:16px; background: color-mix(in srgb, var(--primary-text-color) 3.5%, transparent); }
  .rrow .nm { font-weight:650; color:var(--primary-text-color); display:flex; align-items:center; gap:8px; min-width:0; }
  .rrow .nm i { width:10px; height:10px; border-radius:50%; background: var(--c); flex:none; }
  .rrow .nm span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .rbar { height:12px; border-radius:999px; background: color-mix(in srgb, var(--rk-off) 14%, transparent); overflow:hidden; display:flex; }
  .rbar i { display:block; height:100%; }
  .facts { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:8px; font-size:.84rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .facts b { color:var(--primary-text-color); font-weight:650; }
  .facts .w { color: var(--rk-warn); font-weight:650; }
  @container (max-width: 520px) { .rrow { grid-template-columns: 1fr; gap:8px; } }
  .empty { padding:24px 0 8px; color:var(--secondary-text-color); line-height:1.5; }
`;

export const ROOM_COLORS = ["#ff7a45", "#4f9dff", "#2ec4a6", "#a78bfa", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];
