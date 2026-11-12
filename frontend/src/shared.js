// Gemeinsame Konstanten und Formatierung aller Raumklima-Karten (CSS: styles.js)
import { getLang, loc, rkTime, setLang, t, timeOpts, time12, tmap } from "./i18n.js";
import { RK_VERSION } from "./version.js";
import { MODERN_STYLES, GLASS_STYLES } from "./styles.js";
export * from "./styles.js";

export { RK_VERSION, loc, rkTime, setLang, t, time12, timeOpts, tmap };

// Text für einen regulären Ausdruck entschärfen (Raumnamen wie „Bad (OG)“)
// Handbuch als PDF (am neuesten GitHub-Release angehängt), in der Sprache der Karte
export const rkManualUrl = () =>
  `https://github.com/Goldi5/Raumklima-2/releases/latest/download/${getLang() === "de" ? "Raumklima-Handbuch.pdf" : "Raumklima-Manual.pdf"}`;

/**
 * Issue-URL für „Fehler melden" – mit Version, HA-Version und Gerätemodellen.
 * Bewusst ohne Raumnamen, Entitäts-IDs oder Zugangsdaten (Datenschutz).
 */
export function rkBugReportUrl({ version, haVersion, language, rooms, homeCount, thermostats, parts = false }) {
  const models = [...new Set(thermostats.filter(Boolean))].sort();
  const body = [
    "### Was passiert",
    "<!-- kurz beschreiben, was du beobachtest -->",
    "",
    "### Was du erwartet hast",
    "",
    "### Umgebung (automatisch ausgefüllt)",
    `- Raumklima: ${version || "?"}`,
    `- Home Assistant: ${haVersion || "?"}`,
    `- Sprache: ${language || "?"}`,
    `- Räume: ${rooms} in ${homeCount} Wohnung(en)`,
    `- Thermostate: ${models.length ? models.join(", ") : "unbekannt"}`,
    "",
    "### Diagnose-Datei",
    "Bitte *Einstellungen → Allgemein → Diagnose* anklicken und die JSON-Datei hier anhängen.",
    "Darin stehen Werte, Entitäten und die letzten Protokollzeilen – ohne Zugangsdaten.",
    "",
  ].join("\n");
  const query = [
    `title=${encodeURIComponent("[Fehler] ")}`,
    `body=${encodeURIComponent(body)}`,
    "labels=bug",
  ].join("&");
  const url = `https://github.com/Goldi5/Raumklima-2/issues/new?${query}`;
  // `parts: true` gibt Text und URL getrennt zurück – die Karte zeigt beides in einem Dialog,
  // weil window.open/link.click() auf iPad und in der HA-App verworfen wird.
  return parts ? { url, body } : url;
}

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

// Kurzname der Regel, die das Ziel gerade setzt (leer = Wunschtemperatur gilt)
export function planTag(a) {
  const r = a && a.plan_reason;
  if (!r || r === "normal" || r === "manual" || r === "monitor") return "";
  const map = {
    mold: "Schimmel",
    schedule: "Zeitplan",
    schedule_preheat: "Vorheizen",
    presence_preheat: "Vorwärmen",
    home_office: "Homeoffice",
    presence: "Anwesend",
    device_auto: "Automatik",
    boost: "Boost",
    sleep: "Ruhezeit",
    away_short: "Abgesenkt",
    away_long: "Abgesenkt",
    room_empty: "Leer",
    solar: "Sonne",
    frost: "Frost",
    valve_care: "Ventilpflege",
    season: "Heizpause",
  };
  return map[r] ? t(map[r]) : "";
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
    if (r === "presence_preheat") return t("Vorwärmen · {v}°", { v: fmt(tgt) });
    if (r === "home_office") return t("Homeoffice · {v}°", { v: fmt(tgt) });
    if (r === "presence") return t("Anwesend · {v}°", { v: fmt(tgt) });
    if (r === "device_auto") return t("Automatik am Gerät");
    if (r === "sleep") return t("Ruhezeit · {v}°", { v: fmt(tgt) });
    if (r === "mold") {
      // Wie viel der Schutz drauflegt – die Zahl erklärt, warum es wärmer ist als gewünscht.
      const plus = a.mold_min != null && wish != null ? a.mold_min - wish : null;
      if (plus != null && plus >= 0.2) return t("Schimmel +{d}°", { d: fmt(plus) });
      return t("Schimmel · {v}°", { v: fmt(tgt) });
    }
    if (r === "solar") return t("Sonne · {v}°", { v: fmt(tgt) });
    return t("Ziel {v}°", { v: fmt(a.temperature) });
  }
  if (r === "frost") return t("Frostschutz <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "mold") {
    const plus = a.mold_min != null && wish != null ? a.mold_min - wish : null;
    const rh = a.mold_rh != null ? fmt(a.mold_rh, 0) : null;
    if (a.mold_capped) {
      return t("Feuchte zu hoch für die Wand · {rh} % im Tagesmittel, {h} h kritisch – bitte lüften", {
        rh: rh || "–",
        h: a.mold_risk_hours != null ? fmt(a.mold_risk_hours, 1) : "–",
      });
    }
    if (plus != null && plus >= 0.2 && rh) {
      return t("Schimmelschutz <b>+{d} °C</b> auf {v} °C · {rh} % Feuchte im Tagesmittel", {
        d: fmt(plus),
        v: fmt(a.mold_min),
        rh: rh,
      });
    }
    return t("Schimmelschutz <b>{v} °C</b>", { v: fmt(a.effective_target) });
  }
  if ((r === "away_short" || r === "away_long") && a.effective_target != null)
    return t("Abgesenkt <b>{v} °C</b> · Wunsch {w}°", { v: fmt(a.effective_target), w: fmt(wish) });
  if (r === "manual") return t("Ziel <b>{v} °C</b> · von Hand", { v: fmt(a.temperature) });
  if (r === "room_empty" && a.effective_target != null) return t("Raum leer · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "schedule" && a.effective_target != null) return t("Zeitplan · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "boost" && a.effective_target != null) return t("Boost · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "presence_preheat" && a.effective_target != null) return t("Vorwärmen – der Raum ist um diese Zeit meist belegt · <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "schedule_preheat" && a.effective_target != null) return t("Vorheizen für Zeitplan · <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "sleep" && a.effective_target != null) return t("Ruhezeit · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
  if (r === "mold" && a.effective_target != null) return t("Schimmelschutz · Ziel <b>{v} °C</b>", { v: fmt(a.effective_target) });
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

/** Alle Karten dieser Seite über eine Layout-Änderung informieren. */
export function rkLayoutChanged(home) {
  try {
    window.dispatchEvent(new CustomEvent("raumklima-layout", { detail: { home: String(home || "") } }));
  } catch (e) {
    /* egal */
  }
}

export function rkOnLayoutChanged(handler) {
  const fn = (e) => handler((e && e.detail && e.detail.home) || "");
  window.addEventListener("raumklima-layout", fn);
  return () => window.removeEventListener("raumklima-layout", fn);
}

/** Ausblenden und Reihenfolge anwenden. Räume ohne Eintrag behalten ihre alte Reihenfolge. */
/** Position eines Raums in der gepflegten Reihenfolge (unbekannt = ans Ende). */
function rkOrderPos(order, r) {
  const key = (r && (r.id || r.entity_id)) || "";
  let i = order.indexOf(key);
  if (i < 0) {
    const name = (r && (r.name || (r.attributes && r.attributes.friendly_name))) || "";
    if (name) i = order.indexOf(name);
  }
  return i < 0 ? order.length : i;
}

/**
 * Nur die Reihenfolge anwenden – ohne Räume auszublenden.
 * Für die Einstellungen: dort muss auch ein auf „aus" gestellter Raum anklickbar bleiben,
 * sonst käme man nie wieder an seine Einstellungen (Issue #30).
 */
export function rkRoomsOrdered(rooms, layout) {
  const order = ((layout || RK_LAYOUT_EMPTY).order || []);
  return [...(rooms || [])].sort((a, b) => rkOrderPos(order, a) - rkOrderPos(order, b));
}

export function rkLayoutApply(rooms, layout) {
  const L = layout || RK_LAYOUT_EMPTY;
  const hidden = new Set(L.hidden || []);
  const order = L.order || [];
  // Räume kommen je nach Karte als Objekt mit `id` (rkRooms) oder als HA-Zustand mit
  // `entity_id` (Übersichtskarte) – beide Formen müssen die Reihenfolge verstehen.
  const keyOf = (r) => (r && (r.id || r.entity_id)) || "";
  // Ältere Layouts haben Raumnamen statt Entitäts-IDs gespeichert – beides akzeptiert
  // rkOrderPos, damit eine gepflegte Reihenfolge nicht stillschweigend verloren geht.
  return rooms.filter((r) => !hidden.has(keyOf(r))).sort((a, b) => rkOrderPos(order, a) - rkOrderPos(order, b));
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

export const RK_ROOM_TYPES = tmap({ living: "Wohnraum", kitchen: "Küche", bedroom: "Schlafzimmer", bathroom: "Bad", children: "Kinderzimmer", office: "Arbeitszimmer", guest: "Gästezimmer", hallway: "Flur", gym: "Sportzimmer", rarely_used: "Selten genutzt" });
export const RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Ohne Abgleich" });
export const RK_OFF = tmap({ auto: "Automatisch", preset: "Preset „aus“", hvac: "Modus „aus“", min_temp: "Minimaltemperatur" });
export const RK_SYNC = tmap({ ok: ["Synchron", "ok"], pending: ["Wird übertragen", "warn"], failed: ["Fehlgeschlagen", "cold"] });
export const RK_BUILDING = tmap({ unrenovated: "Altbau unsaniert", renovated: "Altbau saniert", new: "Neubau / gedämmt" });
export const RK_NIGHT = tmap({ auto: "Automatisch", on: "Ja", off: "Nein" });
// Schimmelschutz-Stufen je Raum
export const RK_WALL = tmap({
  auto: "wie die Wohnung",
  corner: "Außenecke",
  wall: "Außenwand",
  interior: "innenliegend",
});
export const RK_MOLD = tmap({ strict: "Streng nach DIN", wish: "Nur bis Wunsch", off: "Aus" });
export const RK_QUIET = tmap({ auto: "Automatisch", on: "Immer", off: "Nie" });
export const RK_PREHEAT = tmap({ auto: "Automatisch", clock: "Frühestens ab", lead: "Frühestens vorher", off: "Erst zum Zeitplan" });
// Zeitplan: was außerhalb der Fenster gilt
export const RK_SCHED_FALLBACK = tmap({ wish: "Wunschtemperatur", short: "Kurz weg", long: "Länger weg", frost: "Sicherung" });
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
  storm: ["🌪", "Sturm & Starkregen"],
  moisture: ["🧺", "Feuchtequelle im Raum"],
  live: ["📱", "Lüft-Countdown auf dem Sperrbildschirm"],
});
export const RK_LIGHT_SIGNALS = tmap({
  open: ["#005aff", "Bitte lüften"],
  close: ["#ff6e00", "Bitte schließen"],
  done: ["#00c83c", "Luft ausgetauscht"],
  problem: ["#ff0000", "Problem mit der Heizung"],
});
export const RK_DEFAULT_PUSH = ["vent_open", "vent_close", "too_cold", "vent_done", "window_away", "season", "trv_failure", "health", "report", "moisture"];
export const RK_SEV = tmap({ alert: ["cold", "mdi:alert-octagon-outline", "Dringend"], warn: ["warn", "mdi:alert-outline", "Warnung"], info: ["air", "mdi:information-outline", "Hinweis"] });
export function rkIssueList(issues, withRoom, prefix) {
  if (!issues || !issues.length) return `<div class="hok"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t("Alles in Ordnung – Thermostate, Fühler, Batterien und Funk unauffällig.")}</div>`;
  const order = { alert: 0, warn: 1, info: 2 };
  return `<div class="issues">${[...issues].sort((a, b) => order[a.severity] - order[b.severity]).map((i) => {
    const sv = RK_SEV[i.severity] || RK_SEV.info;
    return `<div class="issue" style="--c:${toneVar(sv[0])}"><ha-icon icon="${sv[1]}"></ha-icon><div><b>${withRoom && i.room ? esc(prefix ? (i.room.startsWith(prefix) ? i.room.slice(prefix.length).trimStart() : i.room) : i.room) + ": " : ""}${esc(i.title)}</b><small>${esc(i.message)}</small></div><span class="tag">${sv[2]}</span></div>`;
  }).join("")}</div>`;
}

export function rkPretty(target) {
  const s = String(target || "").replace(/^(notify|tts|media_player)\./, "").replace(/^mobile_app_/, "");
  return s.split("_").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || target;
}
export const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const ROOM_COLORS = ["#ff7a45", "#4f9dff", "#2ec4a6", "#a78bfa", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];

// Karte gegen Integration prüfen: Hält der Browser noch eine alte JS-Datei, zeigt die
// Übersicht sonst eine falsche Versionsnummer an, ohne dass es jemand merkt.
export function rkVersionMismatch(cfg, own) {
  const server = cfg && cfg.version;
  if (!server || !own) return "";
  return String(server) === String(own) ? "" : String(server);
}

// ---------------------------------------------------------------- Look „modern"
// Nur Optik: Verlauf pro Kachel, Kontur, größere Ziffern, ruhigere Flächen.
// Markup, Logik und Aufteilung bleiben gleich – deshalb ein reiner CSS-Block,
// den die Karten nur einhängen, wenn `look: modern` gesetzt ist.
export function rkLook(config) {
  const look = config && config.look;
  if (look === "classic" || look === "glass") return look;
  // „modern" ist der Standard; `look` bleibt nur als Ausweg (classic/glass) und zum Vergleich.
  return "modern";
}

/**
 * Dunkler Look? Drei Quellen, in dieser Reihenfolge:
 *   1. Karte selbst (`dark: on|off`) – für Einzelfälle und zum Ausprobieren,
 *   2. Wohnungs-Einstellung `look_dark` (auto|on|off) aus den Raum-Attributen,
 *   3. sonst das Theme des Nutzers (`hass.themes.darkMode`), also „Auto".
 */
export function rkDark(hass, config, settings) {
  const own = config && config.dark;
  if (own === true || own === "on") return true;
  if (own === false || own === "off") return false;
  const want = (settings && settings.look_dark) || "auto";
  if (want === "on") return true;
  if (want === "off") return false;
  return !!(hass && hass.themes && hass.themes.darkMode);
}

/** Stil-Block zu einem Look – leer für „classic". */
export function rkLookStyles(look) {
  return look === "modern" ? MODERN_STYLES : look === "glass" ? GLASS_STYLES : "";
}

