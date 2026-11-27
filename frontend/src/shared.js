// Gemeinsame Konstanten und Formatierung aller Raumklima-Karten (CSS: styles.js)
import { getLang, loc, rkTime, setLang, t, timeOpts, time12, tmap } from "./i18n.js";
import { RK_VERSION } from "./version.js";
import { MODERN_STYLES, GLASS_STYLES } from "./styles.js";
export * from "./styles.js";

export { RK_VERSION, loc, rkTime, setLang, t, time12, timeOpts, tmap };
export { esc, escRe, toneVar } from "./util.js";
import { esc, escRe, toneVar } from "./util.js";
export { RK_COLORS, rkLayout, rkLayoutRemember, rkLayoutChanged, rkOnLayoutChanged, rkEnhanceSelects, rkOccupancy, rkFloorOf, rkFloorGroups, rkRoomsOrdered, rkLayoutApply, rkLayoutSize, rkLayoutColor, rkRooms } from "./rooms.js";
export { RK_ROOM_TYPES, RK_CAL, RK_OFF, RK_SYNC, RK_BUILDING, RK_NIGHT, RK_WALL, RK_MOLD, RK_QUIET, RK_PREHEAT, RK_SCHED_FALLBACK, RK_MAIL_PROVIDERS, RK_PKIND, RK_HOMESENS, RK_MODES, RK_KINDS, RK_LIGHT_SIGNALS, RK_DEFAULT_PUSH, RK_SEV, rkIssueList, rkPretty } from "./labels.js";

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


export const STATUS = tmap({
  heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
  idle: { label: "Temperatur erreicht", icon: "mdi:check-circle", tone: "ok" },
  waiting: { label: "Heizt noch nicht", icon: "mdi:timer-sand", tone: "heat" },
  window_open: { label: "Pausiert – Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
  off: { label: "Aus", icon: "mdi:power", tone: "off" },
  off_trv: { label: "Aus – am Thermostat abgeschaltet", icon: "mdi:power-plug-off", tone: "off" },
  sensor_unavailable: { label: "Fühler ausgefallen", icon: "mdi:thermometer-alert", tone: "warn" },
  trv_unavailable: { label: "Thermostat nicht erreichbar", icon: "mdi:lan-disconnect", tone: "warn" },
  season_off: { label: "Heizpause", icon: "mdi:weather-sunny", tone: "off" },
  external_heat: { label: "Kamin/Holzofen heizt", icon: "mdi:fireplace", tone: "heat" },
  setback: { label: "Abgesenkt – niemand da", icon: "mdi:home-export-outline", tone: "eco" },
  night_airing: { label: "Nachtlüften – Fenster offen", icon: "mdi:weather-night", tone: "air" },
});

// „Heizt noch nicht“ (Raum zu kalt, Gerät heizt nicht) mit Grund – woran es gerade hängt
export function waitReasonText(r) {
  if (!r || !r.kind) return "";
  if (r.kind === "dhw") return t("Wärmepumpe lädt Warmwasser");
  if (r.kind === "defrost") return t("Wärmepumpe taut ab");
  if (r.kind === "lock") return t("Sperrzeit des Netzbetreibers");
  if (r.kind === "trv_satisfied") return t("Thermostat misst am Heizkörper schon {v} °C", { v: fmt(r.value) });
  if (r.kind === "valve_closed") return t("Ventil ist zu");
  return "";
}

export function statusFor(a) {
  const s = STATUS[a.status] || STATUS.idle;
  // #100/tado: Gerät heizt, Raum ist aber schon deutlich über dem Ziel – nicht als normales „Heizt“.
  if (a.status === "heating" && a.heating_warm) return { label: t("Gerät heizt – Raum schon warm"), icon: "mdi:fire-alert", tone: "warn", reason: a.overheat_trim ? t("Raumklima nimmt den Sollwert am Thermostat zurück") : "" };
  const why = a.status === "waiting" ? waitReasonText(a.wait_reason) : "";
  return why ? { ...s, label: `${s.label} – ${why}`, reason: why } : s;
}

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

// Schimmelschutz hebt eine Absenkung/Zeitplan an: kleines Schild „hält 17,5° (statt 16,5°)“,
// damit sichtbar bleibt, was eigentlich gälte. Leer, wenn der Boden nichts anhebt.
export function moldBadge(a) {
  const u = a && a.mold_under;
  if (!u || a.plan_reason !== "mold" || a.effective_target == null) return "";
  const tip = u.target != null
    ? t("Schimmelschutz hält {v}° (statt {u}°)", { v: fmt(a.effective_target), u: fmt(u.target) })
    : t("Schimmelschutz hält {v}°", { v: fmt(a.effective_target) });
  return `<span class="moldb" title="${esc(tip)}"><ha-icon icon="mdi:shield-half-full"></ha-icon>${esc(fmt(a.effective_target))}°</span>`;
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
    external_heat: "Kamin/Holzofen",
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
  // Aufgeklappte Abschnitte (Anleitungen, Details, Entscheidungen …) bleiben beim Neuzeichnen offen:
  // die Karten zeichnen bei jeder Zustandsänderung in Home Assistant neu.
  // Abschnitte mit eigener Merk-Logik („Weitere Einstellungen“, Zeitfenster, Mailbox) bleiben außen vor.
  const own = (d) => d.hasAttribute("data-more") || d.hasAttribute("data-schedcollapse") || d.hasAttribute("data-mailbox");
  const keyOf = (d) => d.dataset.guide || d.dataset.keep
    || `${d.className}|${((d.querySelector("summary") || {}).textContent || "").trim().slice(0, 80)}`;
  const opened = new Map();
  if (root.querySelectorAll) root.querySelectorAll("details").forEach((d) => { if (!own(d)) opened.set(keyOf(d), d.open); });
  // Halb ausgefüllte Felder (data-draft) überleben das Neuzeichnen (#92)
  const drafts = new Map();
  if (root.querySelectorAll) root.querySelectorAll("[data-draft]").forEach((el) => { if (el.value) drafts.set(el.dataset.draft, el.value); });
  root.innerHTML = html;
  if (drafts.size) {
    root.querySelectorAll("[data-draft]").forEach((el) => {
      const v = drafts.get(el.dataset.draft);
      if (v !== undefined && !el.value) el.value = v;
      else if (v !== undefined && el.tagName === "SELECT") el.value = v;
    });
  }
  if (opened.size) {
    root.querySelectorAll("details").forEach((d) => {
      if (own(d)) return;
      const k = keyOf(d);
      if (opened.has(k) && d.open !== opened.get(k)) d.open = opened.get(k);
    });
  }
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
// Ist gerade eine Maustaste/ein Finger auf der Karte gedrückt? Dann nicht neu zeichnen – sonst landet
// der Klick auf einem Knopf, den es nicht mehr gibt (#92). ``after`` läuft nach dem Loslassen.
export function rkTrackPointer(host) {
  if (host._rkPtrTracked || !host.shadowRoot || !host.shadowRoot.addEventListener) return;
  host._rkPtrTracked = true;
  host.shadowRoot.addEventListener("pointerdown", () => { host._rkPtr = true; }, true);
  const up = () => {
    if (!host._rkPtr) return;
    host._rkPtr = false;
    const after = host._rkAfterPtr;
    host._rkAfterPtr = null;
    if (after) setTimeout(after, 60); // erst den Klick ankommen lassen
  };
  window.addEventListener("pointerup", up, true);
  window.addEventListener("pointercancel", up, true);
}
export function rkPointerHeld(host, after) {
  if (!host._rkPtr) return false;
  host._rkAfterPtr = after;
  return true;
}
export const fmt = (v, d = 1) =>
  v === null || v === undefined || isNaN(v) ? "–" : Number(v).toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d });

export const humTone = (h) => (h === null || h === undefined ? "off" : h < 40 ? "warn" : h <= 60 ? "ok" : h < 70 ? "warn" : "cold");


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

export const SEG = tmap({
  season_off: { c: "color-mix(in srgb, var(--rk-off) 25%, transparent)", l: "Heizpause" },
  external_heat: { c: "color-mix(in srgb, var(--rk-heat) 45%, transparent)", l: "Kamin/Holzofen" },
  setback: { c: "var(--rk-eco)", l: "Abgesenkt" },
  heating: { c: "var(--rk-heat)", l: "Heizt" },
  idle: { c: "var(--rk-ok)", l: "Erreicht" },
  waiting: { c: "color-mix(in srgb, var(--rk-heat) 45%, transparent)", l: "Wartet" },
  window_open: { c: "var(--rk-air)", l: "Fenster offen" },
  night_airing: { c: "color-mix(in srgb, var(--rk-air) 55%, #1e2a5a)", l: "Nachtlüften" },
  off: { c: "color-mix(in srgb, var(--rk-off) 45%, transparent)", l: "Aus" },
  sensor_unavailable: { c: "var(--rk-warn)", l: "Fühler fehlt" },
  trv_unavailable: { c: "var(--rk-cold)", l: "TRV weg" },
});


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

