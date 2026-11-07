// Gemeinsame Konstanten, Formatierung und Stile aller Raumklima-Karten
import { getLang, loc, rkTime, setLang, t, timeOpts, time12, tmap } from "./i18n.js";
import { RK_VERSION } from "./version.js";

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
  /* Kopfzeile: Name (kürzt bei Bedarf), Fenstersymbol und Boost bleiben an ihrem Platz.
     Der Status steht darunter in einer eigenen Zeile – so verschiebt sich nichts mehr. */
  .top { display:flex; align-items:center; gap:10px; flex-wrap:nowrap; min-width:0; }
  .chips { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:7px; min-width:0; }
  .chips:empty { display:none; }
  /* Lange Statustexte dürfen im Chip umbrechen – lieber zwei Zeilen im Chip als abgeschnitten */
  .chips .chip { white-space:normal; align-items:center; line-height:1.25; }
  .name { font-size:1.15rem; font-weight:600; letter-spacing:-.01em; cursor:pointer; flex:1 1 auto; min-width:0;
    color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .top > .wins, .top > .boostbtn { flex:none; }
  .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:.82rem; font-weight:600;
    color:var(--tone); background: color-mix(in srgb, var(--tone) 14%, transparent); white-space:nowrap;
    flex:0 1 auto; min-width:0; max-width:100%; overflow:hidden; text-overflow:ellipsis; }
  .chip ha-icon { flex:none; }
  /* Zusatzinfo (Gerätesollwert/Abgleich) bekommt eine eigene Zeile – sonst schiebt sie den Chip aus der Karte */
  .trvnote { display:flex; align-items:center; gap:6px; margin-top:6px; min-width:0;
    font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .trvnote ha-icon { --mdc-icon-size:15px; flex:none; }
  .trvnote span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .chip ha-icon { --mdc-icon-size:16px; }
  .wins { display:flex; gap:4px; color:var(--secondary-text-color); }
  .wins ha-icon { --mdc-icon-size:20px; }
  .wins .open { color: var(--rk-air); }
  .since { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:.85rem; font-weight:600; color:var(--rk-air); font-variant-numeric:tabular-nums; }
  .since ha-icon { --mdc-icon-size:16px; }
  .since.occ { color:var(--secondary-text-color); margin-top:2px; font-weight:500; }
  .since.occ.in { color:var(--rk-ok); }
  /* Raumfarbe: schmaler Rand oben und Hauch im Hintergrund, Status bleibt am Ring */
  .rcard { border-top: 4px solid var(--accent, transparent); }
  .rcard { background-image: linear-gradient(color-mix(in srgb, var(--accent, transparent) 7%, transparent), transparent 120px); }
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
export const RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Keine" });
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
  /* Dialog für Sichern/Diagnose/Fehler: echte Knöpfe statt Popup und Blob-Download
     direkt nach einem await – nur so akzeptieren iPad-Safari und die HA-App das. */
  .sheetwrap { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, .55); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center; padding: 14px; }
  .sheet { display: flex; flex-direction: column; gap: 10px; width: min(680px, 100%); max-height: 86vh;
    padding: 16px; border-radius: 18px; background: var(--card-background-color, #fff);
    box-shadow: 0 24px 70px rgba(0, 0, 0, .45); }
  .stitle { font-weight: 700; font-size: 1.05rem; }
  .sintro { font-size: .85rem; line-height: 1.35; color: var(--secondary-text-color); }
  .stext { flex: 1 1 auto; min-height: 160px; width: 100%; resize: vertical; padding: 10px; border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    background: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .78rem; line-height: 1.4; }
  .sbtns { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }

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
  /* Gleiche Breite und Innenabstände wie die Übersicht – Karten sollen bündig stehen. */
  ha-card.settings { container-type: inline-size; padding: 20px 22px; }
  @media (max-width: 600px) { ha-card.settings { padding: 16px 14px; } }
  ha-card.settings .htitle { font-size:1.45rem; }
  ha-card.settings .htitle ha-icon { --mdc-icon-size:28px; }
  .tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; margin:14px -4px 4px; padding:2px 4px 6px; }
  .tabs::-webkit-scrollbar { display:none; }
  .tabs.homes { margin-bottom:0; } .tabs.homes .tab { font-size:1.02rem; }
  .tab { all:unset; cursor:pointer; white-space:nowrap; padding:10px 18px; border-radius:999px; font-size:.98rem; font-weight:600; color:var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); display:inline-flex; align-items:center; gap:6px; }
  .tab ha-icon { --mdc-icon-size:16px; }
  /* Kein Farbtausch: Hintergrund- und Textfarbe kommen aus derselben Quelle, sonst wird bei
     Themes mit transparentem Kartenhintergrund (Frosted Glass) die Schrift unsichtbar. */
  .tab.on { background: color-mix(in srgb, var(--primary-text-color) 16%, transparent); color: var(--primary-text-color); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 30%, transparent); }
  .tab .dot { width:7px; height:7px; border-radius:50%; background: var(--c, var(--rk-ok)); }
  /* Brotkrumen, Suche und Gruppenleiste (Einstellungen) */
  .crumb { margin:10px 4px 0; font-size:.82rem; color:var(--secondary-text-color); display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .crumb b { color:var(--primary-text-color); font-weight:600; }
  .lrow { padding:12px 2px; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); display:flex; flex-direction:column; gap:8px; }
  .lrow:first-child { border-top:0; padding-top:4px; }
  .ltop { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .lbot { display:flex; align-items:center; gap:10px; }
  .llab { font-size:.8rem; color:var(--secondary-text-color); min-width:46px; }
  .dots { display:flex; gap:8px; flex-wrap:wrap; }
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
  /* Ein Dokument: alle Gruppen untereinander als Abschnitte, keine Einzelkarten. */
  .groups { display:block; margin-top:10px; }
  /* Farbe als Abgrenzung: Trennlinie und Titel tragen den Ton der Gruppe. */
  .grp { min-width:0; padding:16px 2px 6px; border-top:1px solid color-mix(in srgb, var(--g, var(--primary-text-color)) 30%, transparent); }
  .grp > .gh b { color: color-mix(in srgb, var(--g, var(--primary-text-color)) 55%, var(--primary-text-color)); }
  .grp:first-child { border-top:0; padding-top:6px; }
  .grp.span { column-span:none; }
  @container (min-width: 1100px) { .grp.cols .rws { columns:2; column-gap:64px; } .grp.cols .row { break-inside:avoid; } }
  .gh { display:flex; align-items:center; gap:10px; margin:0 0 8px; flex-wrap:wrap; }
  .gh .ic { width:34px; height:34px; border-radius:10px; display:grid; place-items:center; background: color-mix(in srgb, var(--g) 16%, transparent); color: var(--g); flex:none; }
  .gh .ic ha-icon { --mdc-icon-size:19px; }
  .gh b { font-size:1.02rem; font-weight:600; letter-spacing:.01em; color:var(--primary-text-color); flex:1; }

  /* Tabellenzeile: Beschriftung links, Wert und Bedienung rechts auf einer Kante. */
  .row { display:grid; grid-template-columns:minmax(0,1fr) minmax(190px, max-content); align-items:center;
         column-gap:28px; row-gap:4px; min-height:52px; padding:11px 6px; margin:0 -6px; border-radius:10px;
         border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .rws > .row:first-child, .row:first-of-type { border-top:0; }
  .row:hover { background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .row > :not(.l) { justify-self:end; }
  .row .v { font-variant-numeric:tabular-nums; text-align:right; }
  .row > .stepper { width:190px; }
  .row .l { font-size:.98rem; color:var(--primary-text-color); min-width:0; }
  .row .l small { display:block; margin-top:2px; font-size:.8rem; line-height:1.3; color:var(--secondary-text-color); }
  .row .lbl { display:inline-flex; align-items:center; gap:6px; }
  .row .stepper:not(.ro) span { cursor:pointer; border-radius:8px; padding:2px 6px; margin:0 2px; }
  .row .stepper:not(.ro) span:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .stepper input.numedit { width:70px; text-align:center; font:inherit; padding:3px 4px; border-radius:8px;
    border:1px solid color-mix(in srgb, var(--rk-heat) 55%, transparent); background:var(--card-background-color); color:var(--primary-text-color); }
  /* Dezente Zebra-Streifen, damit das Auge in langen Gruppen die Zeile hält. */
  .rws > .row:nth-of-type(even) { background: color-mix(in srgb, var(--primary-text-color) 2.5%, transparent); }
  @container (min-width: 1100px) {
    .grp.pair .rws { display:grid; grid-template-columns:1fr 1fr; column-gap:56px; }
    .grp.pair .rws > .row { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
    .grp.pair .rws > .row:nth-of-type(-n+2) { border-top:0; }
  }
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
  /* Unterreiter im Lernbereich */
  .ltabs { display:flex; gap:8px; flex-wrap:wrap; margin:2px 0 12px; }
  .ltab { border:0; cursor:pointer; font:inherit; font-size:.85rem; padding:8px 14px; border-radius:12px;
          color:var(--secondary-text-color); background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .ltab.on { color:#fff; background:color-mix(in srgb, var(--g, var(--rk-eco)) 88%, #000); }
  .dbar { display:flex; align-items:center; gap:12px; padding:8px 2px; flex-wrap:wrap;
          border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .dbar .dlab { min-width:74px; font-size:.78rem; color:var(--secondary-text-color); }
  .dkpis { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin:10px 0 6px; }
  .dkpi { padding:10px 12px; border-radius:12px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .dkpi b { display:block; font-size:1.35rem; font-weight:600; font-variant-numeric:tabular-nums; }
  .dkpi span { font-size:.78rem; color:var(--secondary-text-color); }
  .decs { margin-top:4px; }
  .dec { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .dec:first-of-type { border-top:0; }
  .dec summary { display:grid; grid-template-columns:104px minmax(0,1fr); column-gap:18px; padding:10px 2px; cursor:pointer; list-style:none; }
  .dec summary::-webkit-details-marker { display:none; }
  .dec .dl b { font-size:.92rem; font-weight:600; display:block; }
  .dec .dl small { display:block; margin-top:2px; font-size:.8rem; color:var(--secondary-text-color); }
  .dec .dfull { padding:2px 2px 12px 122px; }
  .dec .dfull p { margin:0 0 4px; font-size:.82rem; }
  .dec .dfull .ddata { color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  /* „Warum?" – Zeit links, Entscheidung und Begründung rechts. */
  .why { margin-top:4px; }
  .whyhead { border-top:1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .whyrow { display:grid; grid-template-columns:104px minmax(0,1fr); column-gap:18px;
            padding:9px 2px; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .whyrow:first-of-type { border-top:0; }
  .whyrow .wtime { font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .whyrow .wl b { font-size:.9rem; font-weight:600; }
  /* Zeitwähler (iOS-artig): zwei Räder, die einrasten */
  .timebtn { min-height:36px; padding:7px 14px; border-radius:12px; font:inherit; font-size:.88rem;
             font-variant-numeric:tabular-nums; cursor:pointer; color:inherit;
             background:color-mix(in srgb, var(--primary-text-color) 6%, transparent);
             border:1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent); }
  .tpick { position:fixed; left:50%; bottom:24px; transform:translateX(-50%); z-index:60;
           width:min(300px, 92vw); padding:14px 16px 16px; border-radius:20px;
           background:var(--card-background-color, #fff); color:var(--primary-text-color);
           box-shadow:0 18px 50px rgba(0,0,0,.28); }
  .tpickhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .tpickbody { display:flex; align-items:center; justify-content:center; gap:6px; }
  .twheel { height:120px; overflow-y:auto; scroll-snap-type:y mandatory; padding:40px 0; width:74px;
            text-align:center; scrollbar-width:none; }
  .twheel::-webkit-scrollbar { display:none; }
  .twheel button { display:block; width:100%; height:40px; scroll-snap-align:center; border:0; background:none;
                   font:inherit; font-size:1.25rem; color:var(--secondary-text-color); cursor:pointer;
                   font-variant-numeric:tabular-nums; }
  .twheel button.on { color:var(--primary-text-color); font-weight:600; font-size:1.45rem; }
  .twheel.small { width:64px; }
  .tcolon { font-size:1.3rem; color:var(--secondary-text-color); }
  .tpickunit { font-size:.8rem; color:var(--secondary-text-color); }
  .tpickfoot { display:flex; gap:8px; margin-top:10px; }
  .tpickfoot .inp { flex:1; }

  /* Anwesenheitsprofil: 96 Viertelstunden als Balken */
  .pbars { display:flex; align-items:flex-end; gap:1px; height:46px; width:min(420px, 44vw); }
  .pbars i { flex:1; min-width:1px; border-radius:1px 1px 0 0; background:var(--g, var(--rk-eco)); display:block; }

  /* Raumkacheln (Alle Räume auf einen Blick) */
  .roomgrid { display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px; }
  .rtile { display:flex; flex-direction:column; gap:2px; text-align:left; cursor:pointer;
           padding:14px 16px 12px; border-radius:16px; font:inherit; color:inherit;
           border:1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
           box-shadow: inset 3px 0 0 var(--c, var(--rk-off)); }
  .rtile:hover { border-color: color-mix(in srgb, var(--c, var(--primary-text-color)) 45%, transparent); }
  .rtile .rtop { display:flex; align-items:baseline; justify-content:space-between; gap:8px; }
  .rtile .rname { font-weight:600; font-size:.95rem; }
  .rtile .rtyp { font-size:.75rem; color:var(--secondary-text-color); white-space:nowrap; }
  .rtile .rbig { font-size:1.9rem; font-weight:600; line-height:1.1; font-variant-numeric:tabular-nums; }
  .rtile .rbig i { font-size:1.1rem; font-style:normal; color:var(--secondary-text-color); }
  .rtile .rsub { font-size:.8rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .rtile .rflags { display:flex; gap:8px; margin-top:4px; color:var(--secondary-text-color); }
  .rtile .rflags ha-icon { --mdc-icon-size:17px; }
  .whyrow .wl small { display:block; margin-top:2px; font-size:.8rem; color:var(--secondary-text-color); line-height:1.35; }
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
  .btn.primary { background: var(--rk-air); color: #fff; }
  .btn.primary ha-icon { color: inherit; }
  .hint { font-size:.9rem; color:var(--secondary-text-color); margin-top:12px; line-height:1.45; }
  .toast { position:sticky; bottom:8px; margin-top:12px; padding:10px 14px; border-radius:14px; font-size:.9rem; font-weight:600; background: var(--rk-eco); color: #fff; width:max-content; max-width:100%; }
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
  return look === "modern" || look === "glass" ? look : "classic";
}

/** Stil-Block zu einem Look – leer für „classic". */
export function rkLookStyles(look) {
  return look === "modern" ? MODERN_STYLES : look === "glass" ? GLASS_STYLES : "";
}

export const MODERN_STYLES = `
  .modern { border-radius: 26px; }
  /* Panel hinter dem Raster – gibt der Fläche Halt, ohne das Markup zu ändern */
  .modern .rooms { gap: 12px; padding: 10px; border-radius: 24px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .modern .room { container-type: inline-size; min-height: 140px; padding: 15px 16px; border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--tone) 30%, transparent);
    background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 32%, transparent), transparent 68%),
      color-mix(in srgb, var(--primary-text-color) 4%, var(--ha-card-background, var(--card-background-color))); }
  .modern .room:hover { transform: translateY(-3px);
    box-shadow: 0 12px 26px -14px color-mix(in srgb, var(--tone) 70%, transparent);
    background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 42%, transparent), transparent 72%),
      color-mix(in srgb, var(--primary-text-color) 5%, var(--ha-card-background, var(--card-background-color))); }
  .modern .dot { border-radius: 14px; background: color-mix(in srgb, var(--tone) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 22%, transparent); }
  .modern .rn { font-size: 1.03rem; letter-spacing: -.015em; }
  .modern .rt { font-size: clamp(1.9rem, 22cqw, 3rem); letter-spacing: -.05em; }
  .modern .rmeta { font-size: .76rem; }
  /* Raumkarte: gleiche Sprache, ohne die Aufteilung anzufassen */
  .modern .name { font-size: 1.22rem; letter-spacing: -.02em; }
  .modern .stat { border-radius: 16px; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .modern .stat .v { font-weight: 300; letter-spacing: -.03em; }
  /* Auf dunklem Grund verschluckt die Fläche die Tönung – dort kräftiger mischen */
  @media (prefers-color-scheme: dark) {
    .modern .room,
    .modern .room:hover { background:
      radial-gradient(120% 110% at 18% 0%, color-mix(in srgb, var(--tone) 46%, transparent), transparent 70%),
      color-mix(in srgb, var(--primary-text-color) 6%, var(--ha-card-background, var(--card-background-color))); }
  }
`;

// ---------------------------------------------------------------- Look „glass"
// Glas-Optik (iOS): halbtransparente Flächen, Weichzeichner dahinter, feine helle Kanten.
// Braucht etwas Hintergrund zum Durchscheinen – im Theme `lovelace-background` setzen,
// sonst wirkt es nur flau. Markup bleibt identisch, es ist wieder nur CSS.
export const GLASS_STYLES = `
  .glass { border-radius: 28px; border: 1px solid color-mix(in srgb, #fff 26%, transparent);
    background: color-mix(in srgb, var(--ha-card-background, #fff) 42%, transparent);
    -webkit-backdrop-filter: blur(20px) saturate(1.4); backdrop-filter: blur(20px) saturate(1.4);
    box-shadow: 0 18px 40px -28px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.28); }
  .glass .rooms { gap: 12px; padding: 10px; border-radius: 24px;
    background: color-mix(in srgb, #fff 10%, transparent); border: 1px solid color-mix(in srgb, #fff 18%, transparent); }
  .glass .room { container-type: inline-size; min-height: 140px; padding: 15px 16px; border-radius: 22px;
    border: 1px solid color-mix(in srgb, #fff 30%, transparent);
    background: linear-gradient(155deg, color-mix(in srgb, var(--tone) 34%, transparent), color-mix(in srgb, #fff 10%, transparent) 62%);
    -webkit-backdrop-filter: blur(16px) saturate(1.5); backdrop-filter: blur(16px) saturate(1.5);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.35); }
  .glass .room:hover { transform: translateY(-3px);
    box-shadow: 0 20px 38px -26px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.4); }
  .glass .dot { border-radius: 14px; background: color-mix(in srgb, #fff 22%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #fff 30%, transparent); }
  .glass .rn { font-size: 1.03rem; letter-spacing: -.015em; }
  .glass .rt { font-size: clamp(1.9rem, 22cqw, 3rem); letter-spacing: -.05em; }
  .glass .chip, .glass .hm { background: color-mix(in srgb, #fff 18%, transparent); }
  .glass .name { font-size: 1.22rem; letter-spacing: -.02em; }
  .glass .stat { border-radius: 18px; background: color-mix(in srgb, #fff 12%, transparent);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.22); }
  .glass .stat .v { font-weight: 300; letter-spacing: -.03em; }
  @media (prefers-color-scheme: dark) {
    .glass { background: color-mix(in srgb, #14181f 55%, transparent); border-color: color-mix(in srgb, #fff 16%, transparent); }
    .glass .room { background: linear-gradient(155deg, color-mix(in srgb, var(--tone) 40%, transparent), color-mix(in srgb, #fff 6%, transparent) 62%);
      border-color: color-mix(in srgb, #fff 20%, transparent); }
    .glass .rooms { background: color-mix(in srgb, #fff 6%, transparent); }
  }
`;
