import { ROOM_COLORS } from "../shared.js";


export class RaumklimaDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    const prefix = config.strip_prefix ?? "";
    const reg = Object.values(hass.entities || {});
    const rooms = reg
      .filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate."))
      .map((e) => {
        const st = hass.states[e.entity_id];
        const sib = {};
        reg.forEach((x) => { if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id; });
        const full = (st && st.attributes.friendly_name) || e.entity_id;
        const name = prefix ? full.replace(new RegExp("^" + prefix + "\\s*"), "") : full;
        return { id: e.entity_id, name, attrs: st ? st.attributes : {}, sib };
      })
      .filter((r) => !config.home || !r.attrs.home || r.attrs.home === config.home)
      .sort((a, b) => a.name.localeCompare(b.name));
    const H = config.home ? { home: config.home } : {};
    rooms.forEach((r, i) => { r.color = ROOM_COLORS[i % ROOM_COLORS.length]; });
    const weather = config.weather || (Object.keys(hass.states).find((id) => id.startsWith("weather.")) ?? undefined);

    const roomsView = {
      title: "Räume", path: "raeume", icon: "mdi:home-thermometer", type: "sections", max_columns: 3,
      sections: [
        { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-overview-card", ...H, title: config.title || "Heizung", weather: config.weather, strip_prefix: prefix, grid_options: { columns: "full" } }] },
        ...rooms.map((r) => ({ type: "grid", cards: [{ type: "custom:raumklima-card", entity: r.id, name: r.name, grid_options: { columns: "full" } }] })),
      ],
    };

    const hist = (mode) => ({ type: "custom:raumklima-history-card", ...H, mode, hours: 24, strip_prefix: prefix, grid_options: { columns: "full" } });
    const historyView = {
      title: "Verlauf", path: "verlauf", icon: "mdi:chart-line", type: "sections", max_columns: 2,
      sections: [
        ...(weather ? [{ type: "grid", column_span: 2, cards: [{ type: "weather-forecast", entity: weather, forecast_type: "hourly", show_current: true, show_forecast: true, grid_options: { columns: "full" } }] }] : []),
        { type: "grid", column_span: 2, cards: [hist("temperature")] },
        { type: "grid", column_span: 2, cards: [hist("humidity")] },
        { type: "grid", column_span: 2, cards: [hist("timeline")] },
      ],
    };

    const settingsView = {
      title: "Einstellungen", path: "einstellungen", icon: "mdi:tune-variant", type: "panel",
      cards: [{ type: "custom:raumklima-settings-card", ...H, strip_prefix: prefix }],
    };

    const reportView = {
      title: "Bericht", path: "bericht", icon: "mdi:chart-box-outline", type: "sections", max_columns: 2,
      sections: [{ type: "grid", column_span: 2, cards: [{ type: "custom:raumklima-report-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }],
    };

    const logView = {
      title: "Protokoll", path: "protokoll", icon: "mdi:text-box-search-outline", type: "sections", max_columns: 2,
      sections: [{ type: "grid", column_span: 2, cards: [{ type: "custom:raumklima-log-card", ...H, strip_prefix: prefix, grid_options: { columns: "full" } }] }],
    };

    return { title: config.title || "Heizung", views: [roomsView, historyView, reportView, logView, settingsView] };
  }
}
