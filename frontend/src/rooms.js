// Räume, Stockwerke, Belegung und Darstellung je Wohnung (Reihenfolge, Größe, Farbe).
import { loc, t, tmap } from "./i18n.js";
import { esc, escRe } from "./util.js";

export const RK_COLORS = ["#ff7a45", "#4f9dff", "#a78bfa", "#2ec4a6", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];

// ---------------------------------------------------------------- Darstellung je Wohnung (A3)
const RK_LAYOUT_EMPTY = { order: [], hidden: [], size: {}, color: {}, beta_floors: false };
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
/**
 * Auswahllisten einheitlich (#84): jede <select class="sel"> mit mehr als 8 Einträgen wird
 * alphabetisch sortiert (Leer-/Platzhalter-Eintrag bleibt oben) und – wenn sie noch keins hat –
 * mit einem Suchfeld versehen. Arbeitet auf dem HTML-Text, damit rkPaint stabil vergleichen kann.
 * Auswahlen mit ``data-nosort`` behalten ihre Reihenfolge (z. B. Zeiten, Stufen).
 */
export function rkEnhanceSelects(html, { admin = true, min = 8 } = {}) {
  const coll = new Intl.Collator(loc(), { sensitivity: "base", numeric: true });
  const re = /<select class="sel"([^>]*)>([\s\S]*?)<\/select>/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    const [whole, attrs, inner] = m;
    const opts = inner.match(/<option\b[^>]*>[\s\S]*?<\/option>/g) || [];
    let repl = whole;
    if (opts.length > min && !/<optgroup/.test(inner)) {
      const text = (o) => o.replace(/<[^>]+>/g, "").trim();
      const empty = opts.filter((o) => /value=""/.test(o));
      const rest = opts.filter((o) => !/value=""/.test(o));
      const sorted = /data-nosort/.test(attrs) ? rest : [...rest].sort((a, b) => coll.compare(text(a), text(b)));
      repl = `<select class="sel"${attrs}>${[...empty, ...sorted].join("")}</select>`;
      const before = html.slice(Math.max(0, m.index - 400), m.index);
      const wrapped = before.lastIndexOf("data-selsearch") > before.lastIndexOf("</select>");
      if (!wrapped) {
        const dis = /\sdisabled\b/.test(attrs) || !admin ? "disabled" : "";
        repl = `<div class="selwrap" data-selwrap><input class="inp selsearch" type="search" placeholder="${esc(t("Suchen …"))}" aria-label="${esc(t("Suchen …"))}" data-selsearch autocomplete="off" ${dis}>${repl}</div>`;
      }
    }
    out += html.slice(last, m.index) + repl;
    last = m.index + whole.length;
  }
  return out + html.slice(last);
}

/**
 * Belegt-Zustand eines Raums für Kachel und Raumkarte (#85): Melder/Lampen und die Schalter
 * aus „Gilt für Personen“. ``off`` nur, wenn ein Schalter steuert (dann wird wirklich abgesenkt)
 * oder Melder „leer“ melden. Ohne beides: null (kein Symbol).
 */
export function rkOccupancy(a) {
  const sw = (a && a.room_switches) || [];
  const on = sw.filter((x) => x.on).map((x) => x.name);
  if (a && a.occupied === true) return { in: true, why: t("Jemand im Raum") };
  if (on.length) return { in: true, why: t("„{n}“ ist an", { n: on.join("“, „") }) };
  if (sw.length) return { in: false, switch: true, why: t("„{n}“ ist aus – Raum wird abgesenkt", { n: sw.map((x) => x.name).join("“, „") }) };
  if (a && a.occupied === false) return { in: false, switch: false, why: t("Raum leer") };
  return null;
}

/** Stockwerk eines Raums aus HA: Entität → (Gerät →) Bereich → Stockwerk (#80). */
export function rkFloorOf(hass, entityId) {
  const ent = ((hass && hass.entities) || {})[entityId] || {};
  const dev = ent.device_id ? ((hass && hass.devices) || {})[ent.device_id] || {} : {};
  const area = ((hass && hass.areas) || {})[ent.area_id || dev.area_id] || null;
  return area && area.floor_id ? ((hass && hass.floors) || {})[area.floor_id] || null : null;
}

/**
 * Räume nach Stockwerk gruppieren, die Reihenfolge innerhalb bleibt wie übergeben.
 * Stockwerke nach Ebene (level), Räume ohne Stockwerk zuletzt unter „Weitere Räume“.
 * Gibt [] zurück, wenn kein Raum einem Stockwerk zugeordnet ist – dann bleibt alles wie bisher.
 */
export function rkFloorGroups(hass, rooms) {
  const groups = new Map();
  for (const r of rooms || []) {
    const fl = rkFloorOf(hass, r.id || r.entity_id);
    const key = fl ? fl.floor_id || fl.name : "";
    if (!groups.has(key)) groups.set(key, { floor: fl, rooms: [] });
    groups.get(key).rooms.push(r);
  }
  if (![...groups.values()].some((g) => g.floor)) return [];
  const lvl = (g) => (g.floor ? (g.floor.level ?? 0) : Number.MAX_SAFE_INTEGER);
  return [...groups.values()]
    .sort((a, b) => lvl(a) - lvl(b) || String(a.floor ? a.floor.name : "").localeCompare(String(b.floor ? b.floor.name : "")))
    .map((g) => ({ ...g, name: g.floor ? g.floor.name : t("Weitere Räume"), icon: (g.floor && g.floor.icon) || (g.floor ? "mdi:home-floor-" + Math.max(0, Math.min(3, g.floor.level ?? 0)) : "mdi:home-outline") }));
}

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

