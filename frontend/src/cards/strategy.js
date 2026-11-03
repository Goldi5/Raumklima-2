import { ROOM_COLORS, escRe, rkHomeId, rkHomes, rkLayout, rkLayoutApply, rkLayoutColor, rkLayoutSize, setLang, t } from "../shared.js";


// Reihenfolge der Räume: Stockwerk → Bereich → Name.
// Über `sort:` im Dashboard umstellbar: "floor" (Standard), "area", "name".
export function roomSort(config = {}) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  const mode = config.sort || "floor";
  const byName = (a, b) => collator.compare(a.name, b.name);
  const areaName = (r) => (r.area ? r.area.name : "");
  const floorName = (r) => (r.floor ? r.floor.name : "");
  // Räume ohne Stockwerk kommen ans Ende
  const level = (r) => (r.floor ? (r.floor.level ?? 0) : Number.MAX_SAFE_INTEGER);
  return (a, b) => {
    if (mode === "name") return byName(a, b);
    if (mode === "area") {
      return areaName(a) === areaName(b) ? byName(a, b) : collator.compare(areaName(a), areaName(b));
    }
    if (level(a) !== level(b)) return level(a) - level(b);
    if (floorName(a) !== floorName(b)) return collator.compare(floorName(a), floorName(b));
    return areaName(a) === areaName(b) ? byName(a, b) : collator.compare(areaName(a), areaName(b));
  };
}


export class RaumklimaDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    setLang(hass);
    const prefix = config.strip_prefix ?? "";
    // `home` ist die ID der Wohnung – der Name wird auch akzeptiert (beides steht in den Einstellungen)
    const homeId = rkHomeId(hass, config) || "";
    const reg = Object.values(hass.entities || {});
    const rooms = reg
      .filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate."))
      .map((e) => {
        const st = hass.states[e.entity_id];
        const sib = {};
        reg.forEach((x) => { if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id; });
        const full = (st && st.attributes.friendly_name) || e.entity_id;
        const name = prefix ? full.replace(new RegExp("^" + escRe(prefix) + "\\s*"), "") : full;
        const ent = (hass.entities || {})[e.entity_id] || {};
        const dev = ent.device_id ? (hass.devices || {})[ent.device_id] || {} : {};
        const area = (hass.areas || {})[ent.area_id || dev.area_id] || null;
        const floor = area && area.floor_id ? (hass.floors || {})[area.floor_id] || null : null;
        return { id: e.entity_id, name, attrs: st ? st.attributes : {}, sib, area, floor };
      })
      .filter((r) => !homeId || !r.attrs.home || r.attrs.home === homeId)
      .sort(roomSort(config));
    const H = homeId ? { home: homeId } : {};
    // Darstellung je Wohnung: Ausblenden, Reihenfolge und Farbe aus dem Layout-Speicher
    const layout = await rkLayout(hass, homeId).catch(() => null);
    const shown = rkLayoutApply(rooms, layout);
    shown.forEach((r, i) => { r.color = rkLayoutColor(layout, r.id) || ROOM_COLORS[i % ROOM_COLORS.length]; });
    const weather = config.weather || (Object.keys(hass.states).find((id) => id.startsWith("weather.")) ?? undefined);

    const roomsView = {
      title: t("Räume"), path: "raeume", icon: "mdi:home-thermometer", type: "sections", max_columns: 3,
      sections: [
        { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-overview-card", ...H, title: config.title || t("Heizung"), weather: config.weather, strip_prefix: prefix, grid_options: { columns: "full" } }] },
        // Überwachungsräume haben keine Heizung – die große Raumkarte wäre leer,
        // sie erscheinen nur als Kachel in der Übersicht.
        // Auch Überwachungsräume (ohne Thermostat) bekommen eine große Karte – die Karte
        // blendet Bedienung und Sollwert selbst aus und zeigt nur Messwerte und Hinweise.
        ...shown.filter((r) => rkLayoutSize(layout, r.id) !== "tile").map((r) => ({ type: "grid", cards: [{ type: "custom:raumklima-card", entity: r.id, name: r.name, accent: r.color, grid_options: { columns: "full" } }] })),
      ],
    };

    const hist = (mode) => ({ type: "custom:raumklima-history-card", ...H, mode, hours: 24, strip_prefix: prefix, grid_options: { columns: "full" } });
    const historyView = {
      title: t("Verlauf"), path: "verlauf", icon: "mdi:chart-line", type: "sections", max_columns: 2,
      sections: [
        ...(weather ? [{ type: "grid", column_span: 2, cards: [{ type: "weather-forecast", entity: weather, forecast_type: "hourly", show_current: true, show_forecast: true, grid_options: { columns: "full" } }] }] : []),
        { type: "grid", column_span: 2, cards: [hist("temperature")] },
        { type: "grid", column_span: 2, cards: [hist("humidity")] },
        { type: "grid", column_span: 2, cards: [hist("timeline")] },
      ],
    };

    const settingsView = {
      title: t("Einstellungen"), path: "einstellungen", icon: "mdi:tune-variant", type: "panel",
      cards: [{ type: "custom:raumklima-settings-card", ...H, strip_prefix: prefix }],
    };

    const reportView = {
      title: t("Bericht"), path: "bericht", icon: "mdi:chart-box-outline", type: "sections", max_columns: 2,
      sections: [{ type: "grid", column_span: 2, cards: [{ type: "custom:raumklima-report-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }],
    };

    const logView = {
      title: t("Protokoll"), path: "protokoll", icon: "mdi:text-box-search-outline", type: "sections", max_columns: 2,
      sections: [{ type: "grid", column_span: 2, cards: [{ type: "custom:raumklima-log-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }],
    };

    return { title: config.title || t("Heizung"), views: [roomsView, historyView, reportView, logView, settingsView] };
  }
}
