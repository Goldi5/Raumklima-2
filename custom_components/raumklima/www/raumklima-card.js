/*
 * Raumklima-Karte – wird von der Integration automatisch geladen.
 *   type: custom:raumklima-card          (ein Raum)
 *   type: custom:raumklima-overview-card (alle Räume + Außenklima)
 */
const RK_VERSION = "0.2.4";

const STATUS = {
  heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
  idle: { label: "Temperatur erreicht", icon: "mdi:check-circle", tone: "ok" },
  window_open: { label: "Pausiert – Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
  off: { label: "Aus", icon: "mdi:power", tone: "off" },
  sensor_unavailable: { label: "Fühler ausgefallen", icon: "mdi:thermometer-alert", tone: "warn" },
  trv_unavailable: { label: "Thermostat nicht erreichbar", icon: "mdi:lan-disconnect", tone: "warn" },
};

const VENT = {
  ok: null,
  please_open: { label: "Bitte lüften", icon: "mdi:air-filter", tone: "air" },
  airing: { label: "Lüftet", icon: "mdi:weather-windy", tone: "air" },
  done: { label: "Luft ausgetauscht – du kannst schließen", icon: "mdi:check-decagram", tone: "ok" },
  please_close: { label: "Lüftzeit erreicht – bitte schließen", icon: "mdi:window-closed-variant", tone: "warn" },
  too_cold: { label: "Raum kühlt aus – jetzt schließen", icon: "mdi:snowflake-alert", tone: "cold" },
};

const fmt = (v, d = 1) =>
  v === null || v === undefined || isNaN(v) ? "–" : Number(v).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

const humTone = (h) => (h === null || h === undefined ? "off" : h < 40 ? "warn" : h <= 60 ? "ok" : h < 70 ? "warn" : "cold");

const STYLES = `
  :host { --rk-heat:#ff7a45; --rk-ok:#2ec4a6; --rk-air:#4f9dff; --rk-warn:#ffb020; --rk-cold:#ff4d6d; --rk-off:#8a94a6; }
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
  .dial { position:relative; display:grid; place-items:center; margin:8px auto 4px; width:min(240px,100%); aspect-ratio:1/0.82; }
  .dial svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .track { stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
  .fill { stroke: var(--tone); transition: stroke-dasharray .6s ease, stroke .6s; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tone) 55%, transparent)); }
  .knob { fill: var(--ha-card-background, var(--card-background-color)); stroke: var(--tone); stroke-width:3; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
  .fill.muted { stroke: var(--rk-off); filter:none; opacity:.5; }
  .scale { font-size:10px; fill: var(--secondary-text-color); }
  .tlabel { font-size:11px; font-weight:600; fill: var(--tone); }
  .center { text-align:center; z-index:1; margin-top:-6px; }
  .now { font-size:3.2rem; font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
  .now small { font-size:1.2rem; vertical-align: super; margin-left:2px; color:var(--secondary-text-color); }
  .target { margin-top:6px; font-size:.9rem; color:var(--secondary-text-color); font-variant-numeric: tabular-nums; }
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

function toneVar(t) { return `var(--rk-${t || "off"})`; }

class RaumklimaCard extends HTMLElement {
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "climate", integration: "raumklima" } } },
        { name: "name", selector: { text: {} } },
      ],
      computeLabel: (s) => ({ entity: "Raum (Raumklima-Thermostat)", name: "Anzeigename (optional)" }[s.name]),
    };
  }

  static getStubConfig(hass) {
    const e = Object.values(hass.entities || {}).find((x) => x.platform === "raumklima" && x.entity_id.startsWith("climate."));
    return { entity: e ? e.entity_id : "" };
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Bitte ein Raumklima-Thermostat (entity) angeben");
    this._config = config;
    this._pending = null;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this._timer = setInterval(() => this._tick(), 1000); }
  disconnectedCallback() { clearInterval(this._timer); }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 6, min_columns: 4, rows: "auto" }; }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _siblings() {
    const reg = this._hass.entities || {};
    const me = reg[this._config.entity];
    const out = {};
    if (!me || !me.device_id) return out;
    for (const e of Object.values(reg)) {
      if (e.device_id === me.device_id && e.platform === "raumklima" && e.translation_key) out[e.translation_key] = e.entity_id;
    }
    return out;
  }

  _call(domain, service, data) { return this._hass.callService(domain, service, data); }

  _step(delta) {
    const st = this._hass.states[this._config.entity];
    if (!st) return;
    const a = st.attributes;
    const base = this._pending ?? a.temperature ?? 20;
    const next = Math.min(a.max_temp ?? 30, Math.max(a.min_temp ?? 5, Math.round((base + delta) * 2) / 2));
    this._pending = next;
    this._render();
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => {
      this._call("climate", "set_temperature", { entity_id: this._config.entity, temperature: next });
      setTimeout(() => { this._pending = null; }, 1500);
    }, 700);
  }

  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  _tick() {
    const el = this.shadowRoot && this.shadowRoot.querySelector("[data-count]");
    if (!el || !this._openSince) return;
    const total = this._recMin * 60;
    const passed = (Date.now() - this._openSince) / 1000;
    const left = Math.max(0, total - passed);
    el.textContent = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, "0")}`;
    const bar = this.shadowRoot.querySelector("[data-bar]");
    if (bar) bar.style.width = `${Math.min(100, (passed / total) * 100)}%`;
  }

  _arc(cur, target, off) {
    // Skala 14–26 °C, bei Bedarf erweitert, damit Ist und Ziel sichtbar sind
    const vals = [cur, target].filter((v) => v !== null && v !== undefined);
    const min = Math.min(14, ...vals.map((v) => Math.floor(v - 1)));
    const max = Math.max(26, ...vals.map((v) => Math.ceil(v + 1)));
    const R = 100, cx = 120, cy = 112, start = 135, sweep = 270;
    const pos = (v) => start + (Math.min(max, Math.max(min, v)) - min) / (max - min) * sweep;
    const pt = (deg, r = R) => { const a = (deg * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    const path = (a, b) => { const [x1, y1] = pt(a), [x2, y2] = pt(b); return `M ${x1} ${y1} A ${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${x2} ${y2}`; };
    const c = cur === null || cur === undefined ? start : pos(cur);
    let knob = "";
    if (!off && target !== null && target !== undefined) {
      const t = pos(target);
      const [kx, ky] = pt(t);
      knob = `<circle class="knob" cx="${kx}" cy="${ky}" r="11"/><circle cx="${kx}" cy="${ky}" r="4.5" fill="var(--tone)"/>`;
    }
    const [ax, ay] = pt(start, R + 18), [bx, by] = pt(start + sweep, R + 18);
    return `<svg viewBox="0 0 240 200" aria-hidden="true">
      <path class="track" d="${path(start, start + sweep)}" stroke-width="14" fill="none" stroke-linecap="round"/>
      ${cur === null || cur === undefined ? "" : `<path class="fill ${off ? "muted" : ""}" d="${path(start, Math.max(start + 0.5, c))}" stroke-width="14" fill="none" stroke-linecap="round"/>`}
      ${knob}
      <text x="${ax}" y="${ay}" text-anchor="middle" class="scale">${min}°</text>
      <text x="${bx}" y="${by}" text-anchor="middle" class="scale">${max}°</text>
    </svg>`;
  }

  _render() {
    if (!this._hass || !this._config) return;
    const st = this._hass.states[this._config.entity];
    if (!st) {
      this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><div class="err">Entität ${this._config.entity} nicht gefunden</div></ha-card>`;
      return;
    }
    const a = st.attributes;
    const sib = this._siblings();
    const status = STATUS[a.status] || STATUS.idle;
    const vent = VENT[a.ventilation] || null;
    const target = this._pending ?? a.temperature;
    const isOff = st.state === "off";
    const name = this._config.name || a.friendly_name || "Raum";
    const winOpen = a.window_open;
    this._openSince = a.window_open_since ? Date.parse(a.window_open_since) : null;
    this._recMin = a.recommended_minutes || 5;

    let banner = "";
    if (vent && a.ventilation !== "ok") {
      const showBar = winOpen && this._openSince && ["airing", "please_close", "done"].includes(a.ventilation);
      const extra = a.ventilation === "please_open"
        ? `<span>${fmt(a.current_humidity, 0)} % · ca. ${this._recMin} min</span>`
        : showBar ? `<span class="count" data-count>–</span>` : "";
      banner = `<div class="banner" style="--vt:${toneVar(vent.tone)}">
          <ha-icon icon="${vent.icon}"></ha-icon><span class="grow">${vent.label}${showBar ? ` · ${this._recMin} min` : ""}</span>${extra}
        </div>${showBar ? `<div class="bar" style="--vt:${toneVar(vent.tone)}"><i data-bar style="width:0%"></i></div>` : ""}`;
    }

    const stat = (icon, label, value, tone, entity) =>
      `<div class="stat" ${entity ? `data-more="${entity}" style="cursor:pointer"` : ""}><div class="l"><ha-icon icon="${icon}"></ha-icon>${label}</div>
        <div class="v ${tone ? "tone" : ""}" style="${tone ? `--st:${toneVar(tone)}` : ""}">${value}</div></div>`;

    const stats = [
      a.humidity_sensor ? stat("mdi:water-percent", "Feuchte", `${fmt(a.current_humidity, 0)} %`, humTone(a.current_humidity), sib.ventilation) : "",
      a.dew_point !== undefined && a.dew_point !== null ? stat("mdi:water-thermometer", "Taupunkt", `${fmt(a.dew_point)}°`, null, sib.dew_point) : "",
      stat("mdi:valve", "Ventil", a.valve_position === null || a.valve_position === undefined ? "–" : `${fmt(a.valve_position, 0)} %`, a.valve_position > 0 ? "heat" : null),
      a.outdoor_temperature !== undefined && a.outdoor_temperature !== null
        ? stat("mdi:weather-partly-cloudy", "Außen", `${fmt(a.outdoor_temperature)}°<small>${fmt(a.outdoor_humidity, 0)} %</small>`, null) : "",
      stat("mdi:radiator", "Heizkörper", `${fmt(a.trv_temperature)}°`, null),
      a.offset !== undefined && a.offset !== null ? stat("mdi:tune-variant", "Offset", `${a.offset > 0 ? "+" : ""}${fmt(a.offset)}°`, null, sib.offset) : "",
    ].join("");

    const syncCls = a.sync === "ok" ? "" : a.sync;
    const syncLabel = { ok: "synchron", pending: "sendet …", failed: "keine Antwort" }[a.sync] || a.sync;
    const notif = sib.notifications ? this._hass.states[sib.notifications] : null;
    const wlogic = sib.window_logic ? this._hass.states[sib.window_logic] : null;

    this.shadowRoot.innerHTML = `<style>${STYLES}</style>
      <ha-card style="--tone:${toneVar(status.tone)}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}">${name}</div>
          ${a.window_open !== undefined ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}</span>
        </div>
        <div class="dial">
          ${this._arc(a.current_temperature, target, isOff)}
          <div class="center">
            <div class="now">${fmt(a.current_temperature)}<small>°C</small></div>
            <div class="target">${isOff ? "Heizung aus" : `Ziel <b>${fmt(target)} °C</b>`}</div>
          </div>
        </div>
        <div class="ctrl">
          <button class="round" data-step="-0.5" ${isOff ? "disabled" : ""} aria-label="kälter"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button class="round" data-power aria-label="an/aus" style="${isOff ? "" : "color:var(--tone)"}"><ha-icon icon="mdi:power"></ha-icon></button>
          <button class="round" data-step="0.5" ${isOff ? "disabled" : ""} aria-label="wärmer"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        ${banner}
        <div class="stats">${stats}</div>
        <div class="actions">
          ${wlogic ? `<button class="pill ${wlogic.state === "on" ? "on" : ""}" data-toggle="${sib.window_logic}"><ha-icon icon="mdi:window-shutter-auto"></ha-icon>Fensterlogik</button>` : ""}
          ${notif ? `<button class="pill ${notif.state === "on" ? "on" : ""}" data-toggle="${sib.notifications}"><ha-icon icon="${notif.state === "on" ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}"></ha-icon>Hinweise</button>` : ""}
          <span class="sync ${syncCls}"><ha-icon icon="${a.sync === "ok" ? "mdi:check-circle-outline" : "mdi:sync"}"></ha-icon>${syncLabel}</span>
        </div>
      </ha-card>`;

    this.shadowRoot.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => this._step(parseFloat(b.dataset.step))));
    const p = this.shadowRoot.querySelector("[data-power]");
    if (p) p.addEventListener("click", () => this._call("climate", isOff ? "turn_on" : "turn_off", { entity_id: this._config.entity }));
    this.shadowRoot.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => this._call("switch", "toggle", { entity_id: b.dataset.toggle })));
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this._moreInfo(b.dataset.more)));
    this._tick();
  }
}

class RaumklimaOverviewCard extends HTMLElement {
  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "weather", selector: { entity: { domain: "weather" } } },
      ],
      computeLabel: (s) => ({ title: "Titel", weather: "Wetter (optional)" }[s.name]),
    };
  }
  static getStubConfig() { return { title: "Heizung" }; }
  setConfig(config) { this._config = config || {}; if (!this.shadowRoot) this.attachShadow({ mode: "open" }); }
  getCardSize() { return 4; }
  getGridOptions() { return { columns: 12, rows: "auto" }; }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass) return;
    const rooms = Object.values(this._hass.entities || {})
      .filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate."))
      .map((e) => this._hass.states[e.entity_id])
      .filter(Boolean)
      .sort((a, b) => (a.attributes.friendly_name || "").localeCompare(b.attributes.friendly_name || ""));
    const heating = rooms.filter((r) => r.attributes.status === "heating").length;
    const windows = rooms.filter((r) => r.attributes.window_open).length;
    const warn = rooms.filter((r) => ["please_open", "please_close", "too_cold"].includes(r.attributes.ventilation) || r.attributes.sync === "failed" || ["sensor_unavailable", "trv_unavailable"].includes(r.attributes.status)).length;
    const w = this._config.weather ? this._hass.states[this._config.weather] : null;
    const outT = w ? w.attributes.temperature : rooms.map((r) => r.attributes.outdoor_temperature).find((v) => v !== undefined && v !== null);
    const outH = w ? w.attributes.humidity : rooms.map((r) => r.attributes.outdoor_humidity).find((v) => v !== undefined && v !== null);
    const allSync = rooms.every((r) => r.attributes.sync === "ok");

    const row = (r) => {
      const a = r.attributes;
      const s = STATUS[a.status] || STATUS.idle;
      const v = VENT[a.ventilation];
      const off = r.state === "off";
      const tone = v && a.ventilation !== "ok" ? v.tone : s.tone;
      const label = v && a.ventilation !== "ok" ? v.label : s.label;
      const prefix = this._config.strip_prefix ?? "";
      const name = (a.friendly_name || "").replace(new RegExp("^" + prefix + "\\s*"), "");
      return `<div class="room" data-more="${r.entity_id}" style="--tone:${toneVar(tone)}">
        <div class="rtop"><div class="dot"><ha-icon icon="${v && a.ventilation !== "ok" ? v.icon : s.icon}"></ha-icon></div>
          ${a.window_open ? `<ha-icon class="win" icon="mdi:window-open-variant"></ha-icon>` : ""}</div>
        <div class="rn">${name}</div>
        <div class="rs">${label}</div>
        <div class="rbottom">
          <div class="rt">${fmt(a.current_temperature)}°</div>
          <div class="rmeta">${off ? "aus" : `Ziel ${fmt(a.temperature)}°`}${a.humidity_sensor ? `<b style="--st:${toneVar(humTone(a.current_humidity))}">${fmt(a.current_humidity, 0)} %</b>` : ""}</div>
        </div>
      </div>`;
    };

    this.shadowRoot.innerHTML = `<style>${STYLES}
      .head { display:flex; align-items:flex-end; gap:16px; flex-wrap:wrap; }
      .title { font-size:1.5rem; font-weight:650; letter-spacing:-.02em; color:var(--primary-text-color); }
      .sub { color:var(--secondary-text-color); font-size:.9rem; margin-top:2px; }
      .out { text-align:right; color:var(--primary-text-color); }
      .out b { font-size:1.6rem; font-weight:300; letter-spacing:-.03em; }
      .out span { display:block; font-size:.78rem; color:var(--secondary-text-color); }
      .kpis { display:flex; gap:8px; margin:16px 0 8px; flex-wrap:wrap; }
      .rooms { display:grid; gap:10px; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
      .room { display:flex; flex-direction:column; gap:2px; padding:14px; border-radius:20px; cursor:pointer; min-height:130px;
        background: color-mix(in srgb, var(--tone) 7%, color-mix(in srgb, var(--primary-text-color) 3%, transparent));
        border: 1px solid color-mix(in srgb, var(--tone) 18%, transparent); transition: transform .15s, background .2s; }
      .room:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--tone) 12%, transparent); }
      .rtop { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
      .dot { width:36px; height:36px; border-radius:12px; display:grid; place-items:center; color:var(--tone); background: color-mix(in srgb, var(--tone) 16%, transparent); }
      .dot ha-icon { --mdc-icon-size:20px; }
      .win { color: var(--rk-air); --mdc-icon-size:20px; }
      .rn { font-weight:650; color:var(--primary-text-color); }
      .rs { font-size:.78rem; color: var(--tone); font-weight:600; }
      .rbottom { margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; gap:8px; }
      .rt { font-size:1.7rem; font-weight:300; letter-spacing:-.03em; font-variant-numeric: tabular-nums; color:var(--primary-text-color); line-height:1; }
      .rmeta { text-align:right; font-size:.78rem; color:var(--secondary-text-color); display:flex; flex-direction:column; gap:2px; }
      .rmeta b { color: var(--st); font-weight:650; }
    </style>
    <ha-card style="--tone:${toneVar(warn ? "warn" : heating ? "heat" : "ok")}">
      <div class="head">
        <div style="flex:1;min-width:0"><div class="title">${this._config.title || "Heizung"}</div>
          <div class="sub">${rooms.length} Räume · ${heating} heizen · ${windows} Fenster offen</div></div>
        ${outT !== undefined && outT !== null ? `<div class="out"><b>${fmt(outT)}°</b><span>außen · ${fmt(outH, 0)} %</span></div>` : ""}
      </div>
      <div class="kpis">
        <span class="chip" style="--tone:${toneVar(heating ? "heat" : "off")}"><ha-icon icon="mdi:fire"></ha-icon>${heating} heizen</span>
        <span class="chip" style="--tone:${toneVar(windows ? "air" : "off")}"><ha-icon icon="mdi:window-open-variant"></ha-icon>${windows} offen</span>
        <span class="chip" style="--tone:${toneVar(warn ? "warn" : "ok")}"><ha-icon icon="${warn ? "mdi:alert-circle-outline" : "mdi:check-circle-outline"}"></ha-icon>${warn ? `${warn} Hinweis${warn > 1 ? "e" : ""}` : "alles gut"}</span>
        <span class="chip" style="--tone:${toneVar(allSync ? "ok" : "warn")}"><ha-icon icon="mdi:sync"></ha-icon>${allSync ? "synchron" : "sendet …"}</span>
      </div>
      <div class="rooms">${rooms.map(row).join("")}</div>
    </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) =>
      b.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
  }
}



// ---------------------------------------------------------------- Verlaufskarte
const RK_COLORS = ["#ff7a45", "#4f9dff", "#a78bfa", "#2ec4a6", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];
const SEG = {
  heating: { c: "var(--rk-heat)", l: "Heizt" },
  idle: { c: "var(--rk-ok)", l: "Erreicht" },
  window_open: { c: "var(--rk-air)", l: "Fenster offen" },
  off: { c: "color-mix(in srgb, var(--rk-off) 45%, transparent)", l: "Aus" },
  sensor_unavailable: { c: "var(--rk-warn)", l: "Fühler fehlt" },
  trv_unavailable: { c: "var(--rk-cold)", l: "TRV weg" },
};

function rkRooms(hass, prefix) {
  const reg = Object.values(hass.entities || {});
  const rooms = reg
    .filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate."))
    .map((e) => {
      const st = hass.states[e.entity_id];
      const sib = {};
      reg.forEach((x) => { if (x.device_id === e.device_id && x.platform === "raumklima" && x.translation_key) sib[x.translation_key] = x.entity_id; });
      const full = (st && st.attributes.friendly_name) || e.entity_id;
      return { id: e.entity_id, name: prefix ? full.replace(new RegExp("^" + prefix + "\\s*"), "") : full, attrs: st ? st.attributes : {}, sib };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  rooms.forEach((r, i) => { r.color = RK_COLORS[i % RK_COLORS.length]; });
  return rooms;
}

const HISTORY_STYLES = `
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
  .tl .bar > i { position:absolute; top:0; bottom:0; }
  .tl .bar > em { position:absolute; top:-2px; bottom:-2px; border-radius:4px; outline: 2px solid var(--rk-air); outline-offset:-2px; background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 22%, transparent) 0 4px, transparent 4px 8px); }
  .tlx { display:flex; justify-content:space-between; margin:6px 0 0 124px; font-size:10.5px; color: var(--secondary-text-color); }
  .tleg { display:flex; flex-wrap:wrap; gap:14px; margin-top:14px; font-size:.78rem; color: var(--secondary-text-color); }
  .tleg span { display:inline-flex; align-items:center; gap:6px; }
  .tleg i { width:14px; height:10px; border-radius:3px; background: var(--c); }
`;

class RaumklimaHistoryCard extends HTMLElement {
  static getConfigForm() {
    return {
      schema: [
        { name: "mode", selector: { select: { options: [
          { value: "temperature", label: "Raumtemperatur" },
          { value: "humidity", label: "Luftfeuchte" },
          { value: "timeline", label: "Heizung & Fenster (Zeitleiste)" },
        ] } } },
        { name: "title", selector: { text: {} } },
        { name: "hours", selector: { number: { min: 1, max: 168, step: 1 } } },
        { name: "strip_prefix", selector: { text: {} } },
      ],
    };
  }
  static getStubConfig() { return { mode: "temperature", hours: 24 }; }
  setConfig(config) {
    this._config = { mode: "temperature", hours: 24, ...config };
    this._hours = this._config.hours;
    this._hidden = new Set();
    this._data = null;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return this._config.mode === "timeline" ? 4 : 6; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  connectedCallback() {
    this.style.display = "block";
    this._ro = new ResizeObserver(() => { const w = this.clientWidth; if (w && w !== this._lastW) { this._lastW = w; this._lastDraw = 0; this._draw(); } });
    this._ro.observe(this);
    this._poll = setInterval(() => this._load(), 5 * 60 * 1000);
  }
  disconnectedCallback() { this._ro && this._ro.disconnect(); clearInterval(this._poll); }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first || !this._rooms) this._rooms = rkRooms(hass, this._config.strip_prefix || "");
    if (first) this._load(); else this._draw(true);
  }

  _entities() {
    const m = this._config.mode;
    if (m === "temperature") return this._rooms.map((r) => r.attrs.temperature_sensor).filter(Boolean);
    if (m === "humidity") return this._rooms.map((r) => r.attrs.humidity_entity).filter(Boolean);
    return this._rooms.flatMap((r) => [r.sib.status, ...(r.attrs.window_entities || [])]).filter(Boolean);
  }

  async _load() {
    if (!this._hass || !this._rooms) return;
    const ids = this._entities();
    if (!ids.length) { this._data = {}; this._draw(); return; }
    const end = new Date();
    const start = new Date(end.getTime() - this._hours * 3600 * 1000);
    try {
      const res = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      this._data = res || {};
      this._range = [start.getTime(), end.getTime()];
    } catch (e) {
      this._data = {};
      this._error = String(e && e.message ? e.message : e);
    }
    this._draw();
  }

  _series(entityId) {
    const raw = (this._data && this._data[entityId]) || [];
    const pts = [];
    for (const p of raw) {
      const t = (p.lu ?? p.lc ?? 0) * 1000;
      const v = parseFloat(p.s);
      if (!isNaN(v)) pts.push([Math.max(t, this._range[0]), v]);
    }
    const now = this._hass.states[entityId];
    if (now && !isNaN(parseFloat(now.state))) pts.push([Date.now(), parseFloat(now.state)]);
    // auf 5-min-Raster mitteln, damit die Linie ruhig wird
    const step = this._hours > 48 ? 30 * 60e3 : this._hours > 12 ? 10 * 60e3 : 5 * 60e3;
    const out = [];
    let bucket = null, sum = 0, n = 0;
    for (const [t, v] of pts) {
      const b = Math.floor(t / step) * step;
      if (bucket !== null && b !== bucket) { out.push([bucket + step / 2, sum / n]); sum = 0; n = 0; }
      bucket = b; sum += v; n++;
    }
    if (n) out.push([bucket + step / 2, sum / n]);
    return out;
  }

  _smooth(pts) {
    if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const k = 0.18;
      d += ` C${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${p2[0] - (p3[0] - p1[0]) * k},${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  _fmtTime(t) {
    const d = new Date(t);
    return this._hours > 48
      ? d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric" })
      : d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }

  _shell(body) {
    const m = this._config.mode;
    const meta = { temperature: ["Raumtemperatur", "mdi:thermometer", "heat"], humidity: ["Luftfeuchte", "mdi:water-percent", "air"], timeline: ["Heizung & Fenster", "mdi:radiator", "ok"] }[m];
    const title = this._config.title || meta[0];
    const ranges = [[6, "6 h"], [24, "24 h"], [168, "7 T"]];
    return `<style>${STYLES}${HISTORY_STYLES}</style>
      <ha-card style="--tone:${toneVar(meta[2])}">
        <div class="hhead">
          <div class="htitle"><ha-icon icon="${meta[1]}"></ha-icon>${title}</div>
          <div class="seg">${ranges.map(([h, l]) => `<button data-h="${h}" class="${this._hours === h ? "on" : ""}">${l}</button>`).join("")}</div>
        </div>
        ${body}
      </ha-card>`;
  }

  _bind() {
    this.shadowRoot.querySelectorAll("[data-h]").forEach((b) => b.addEventListener("click", () => { this._hours = parseInt(b.dataset.h, 10); this._data = null; this._draw(); this._load(); }));
    this.shadowRoot.querySelectorAll("[data-room]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.room;
      this._hidden.has(id) ? this._hidden.delete(id) : this._hidden.add(id);
      this._draw();
    }));
  }

  _draw(liveOnly) {
    if (!this._hass || !this._rooms) return;
    if (liveOnly && this._lastDraw && Date.now() - this._lastDraw < 30000) return; // Live-Updates drosseln
    this._lastDraw = Date.now();
    if (this._config.mode === "timeline") return this._drawTimeline();
    return this._drawLines();
  }

  _drawLines() {
    const m = this._config.mode;
    const key = m === "temperature" ? "temperature_sensor" : "humidity_entity";
    const unit = m === "temperature" ? "°" : " %";
    const rooms = this._rooms.filter((r) => r.attrs[key]);
    const legend = rooms.map((r) => {
      const st = this._hass.states[r.attrs[key]];
      const v = st ? parseFloat(st.state) : NaN;
      return `<button class="lchip ${this._hidden.has(r.id) ? "off" : ""}" data-room="${r.id}" style="--c:${r.color}"><i></i>${r.name}<b>${isNaN(v) ? "–" : fmt(v, m === "temperature" ? 1 : 0) + unit}</b></button>`;
    }).join("");
    if (!this._data) {
      this.shadowRoot.innerHTML = this._shell(`<div class="legend">${legend}</div><div class="chart"><div class="empty">Lade Verlauf …</div></div>`);
      return this._bind();
    }
    const cw = this.shadowRoot.querySelector(".chart");
    const W = Math.max(280, (cw && cw.clientWidth) || this.clientWidth - 48), H = 240, padL = 34, padR = 8, padT = 10, padB = 24;
    const series = rooms.filter((r) => !this._hidden.has(r.id)).map((r) => ({ r, pts: this._series(r.attrs[key]) })).filter((s) => s.pts.length);
    const all = series.flatMap((s) => s.pts.map((p) => p[1]));
    const band = m === "temperature" ? [19, 22] : [40, 60];
    let lo = Math.min(...all, band[0]), hi = Math.max(...all, band[1]);
    if (!isFinite(lo)) { lo = band[0]; hi = band[1]; }
    const stepY = m === "temperature" ? (hi - lo > 8 ? 2 : 1) : 10;
    lo = Math.floor((lo - 0.5) / stepY) * stepY; hi = Math.ceil((hi + 0.5) / stepY) * stepY;
    const [t0, t1] = this._range;
    const x = (t) => padL + ((t - t0) / (t1 - t0)) * (W - padL - padR);
    const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
    let grid = "";
    for (let v = lo; v <= hi + 1e-9; v += stepY) grid += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/><text class="ylab" x="${padL - 6}" y="${y(v) + 3.5}" text-anchor="end">${fmt(v, 0)}${unit.trim() === "%" ? "" : "°"}</text>`;
    const ticks = this._hours > 48 ? 7 : W < 520 ? 3 : this._hours > 12 ? 4 : 6;
    let xl = "";
    for (let i = 0; i <= ticks; i++) { const t = t0 + ((t1 - t0) * i) / ticks; xl += `<text class="xlab" x="${x(t)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === ticks ? "end" : "middle"}">${i === ticks ? "jetzt" : this._fmtTime(t)}</text>`; }
    const defs = series.map((s, i) => `<linearGradient id="g${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${s.r.color}" stop-opacity=".22"/><stop offset="100%" stop-color="${s.r.color}" stop-opacity="0"/></linearGradient>`).join("");
    const paths = series.map((s, i) => {
      const pts = s.pts.map(([t, v]) => [x(t), y(v)]);
      const d = this._smooth(pts);
      const area = series.length <= 2 ? `<path d="${d} L${pts[pts.length - 1][0]},${H - padB} L${pts[0][0]},${H - padB} Z" fill="url(#g${i})"/>` : "";
      return `${area}<path class="line" d="${d}" stroke="${s.r.color}"/><circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="3.5" fill="${s.r.color}"/>`;
    }).join("");
    const bandSvg = `<rect class="band" x="${padL}" width="${W - padL - padR}" y="${y(band[1])}" height="${y(band[0]) - y(band[1])}" rx="6"/><text class="bandlab" x="${W - padR - 6}" y="${y(band[1]) + 13}" text-anchor="end">Wohlfühlbereich</text>`;
    const body = series.length
      ? `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${bandSvg}<g class="grid">${grid}</g>${xl}${paths}<line class="hover-line" x1="0" x2="0" y1="${padT}" y2="${H - padB}" style="display:none"/></svg><div class="tip" style="display:none"></div>`
      : `<div class="empty">${this._error ? "Verlauf nicht verfügbar: " + this._error : "Keine Daten im Zeitraum"}</div>`;
    this.shadowRoot.innerHTML = this._shell(`<div class="legend">${legend}</div><div class="chart" style="--h:${H}px">${body}</div>`);
    this._bind();
    const chart = this.shadowRoot.querySelector(".chart");
    const svg = chart.querySelector("svg");
    if (!svg) return;
    const hl = svg.querySelector(".hover-line"), tip = chart.querySelector(".tip");
    const near = (pts, t) => { let best = null; for (const p of pts) if (!best || Math.abs(p[0] - t) < Math.abs(best[0] - t)) best = p; return best; };
    chart.addEventListener("mousemove", (ev) => {
      const rect = svg.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * W;
      if (px < padL || px > W - padR) { hl.style.display = "none"; tip.style.display = "none"; return; }
      const t = t0 + ((px - padL) / (W - padL - padR)) * (t1 - t0);
      hl.setAttribute("x1", px); hl.setAttribute("x2", px); hl.style.display = "";
      const rows = series.map((s) => { const p = near(s.pts, t); return `<div class="r" style="--c:${s.r.color}"><span><i></i>${s.r.name}</span><b>${fmt(p[1], m === "temperature" ? 1 : 0)}${unit}</b></div>`; }).join("");
      tip.innerHTML = `<div class="t">${new Date(t).toLocaleString("de-DE", { weekday: "short", hour: "2-digit", minute: "2-digit" })}</div>${rows}`;
      tip.style.display = "";
      const left = ev.clientX - chart.getBoundingClientRect().left;
      tip.style.left = `${left > chart.clientWidth / 2 ? left - tip.offsetWidth - 14 : left + 14}px`;
    });
    chart.addEventListener("mouseleave", () => { hl.style.display = "none"; tip.style.display = "none"; });
  }

  _drawTimeline() {
    if (!this._data) {
      this.shadowRoot.innerHTML = this._shell(`<div class="empty">Lade Verlauf …</div>`);
      return this._bind();
    }
    const [t0, t1] = this._range;
    const pct = (t) => ((Math.max(t0, Math.min(t1, t)) - t0) / (t1 - t0)) * 100;
    const spans = (id, map) => {
      const raw = (this._data[id] || []).map((p) => [(p.lu ?? p.lc ?? 0) * 1000, p.s]);
      const now = this._hass.states[id];
      if (now) raw.push([Date.now(), now.state]);
      const out = [];
      for (let i = 0; i < raw.length; i++) {
        const [t, s] = raw[i];
        const end = i + 1 < raw.length ? raw[i + 1][0] : t1;
        if (end > t0) out.push([Math.max(t, t0), end, s]);
      }
      return out.map(([a, b, s]) => map(a, b, s)).join("");
    };
    const rows = this._rooms.map((r) => {
      const status = r.sib.status ? spans(r.sib.status, (a, b, s) => {
        const seg = SEG[s];
        return seg ? `<i style="left:${pct(a)}%;width:${Math.max(0.3, pct(b) - pct(a))}%;background:${seg.c}" title="${seg.l}"></i>` : "";
      }) : "";
      const wins = (r.attrs.window_entities || []).map((w) => spans(w, (a, b, s) => (s === "on" ? `<em style="left:${pct(a)}%;width:${Math.max(0.4, pct(b) - pct(a))}%" title="Fenster offen"></em>` : ""))).join("");
      return `<div class="n">${r.name}</div><div class="bar">${status}${wins}</div>`;
    }).join("");
    const ticks = this._hours > 48 ? 7 : 6;
    const xl = Array.from({ length: ticks + 1 }, (_, i) => `<span>${i === ticks ? "jetzt" : this._fmtTime(t0 + ((t1 - t0) * i) / ticks)}</span>`).join("");
    const leg = ["heating", "idle", "window_open", "off"].map((k) => `<span><i style="--c:${SEG[k].c}"></i>${SEG[k].l}</span>`).join("")
      + `<span><i style="--c:transparent;outline:2px solid var(--rk-air);background:repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 30%, transparent) 0 3px, transparent 3px 6px)"></i>Fensterkontakt offen</span>`;
    this.shadowRoot.innerHTML = this._shell(`<div class="tl">${rows}</div><div class="tlx">${xl}</div><div class="tleg">${leg}</div>`);
    this._bind();
  }
}

// ---------------------------------------------------------------- Dashboard-Strategie
const ROOM_COLORS = ["#ff7a45", "#4f9dff", "#2ec4a6", "#a78bfa", "#ffb020", "#f472b6", "#22d3ee", "#84cc16"];

class RaumklimaDashboardStrategy extends HTMLElement {
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
      .sort((a, b) => a.name.localeCompare(b.name));
    rooms.forEach((r, i) => { r.color = ROOM_COLORS[i % ROOM_COLORS.length]; });
    const weather = config.weather || (Object.keys(hass.states).find((id) => id.startsWith("weather.")) ?? undefined);

    const roomsView = {
      title: "Räume", path: "raeume", icon: "mdi:home-thermometer", type: "sections", max_columns: 3,
      sections: [
        { type: "grid", column_span: 3, cards: [{ type: "custom:raumklima-overview-card", title: config.title || "Heizung", weather: config.weather, strip_prefix: prefix, grid_options: { columns: "full" } }] },
        ...rooms.map((r) => ({ type: "grid", cards: [{ type: "custom:raumklima-card", entity: r.id, name: r.name, grid_options: { columns: "full" } }] })),
      ],
    };

    const hist = (mode) => ({ type: "custom:raumklima-history-card", mode, hours: 24, strip_prefix: prefix, grid_options: { columns: "full" } });
    const historyView = {
      title: "Verlauf", path: "verlauf", icon: "mdi:chart-line", type: "sections", max_columns: 2,
      sections: [
        { type: "grid", column_span: 2, cards: [hist("temperature")] },
        { type: "grid", cards: [hist("humidity")] },
        { type: "grid", cards: [
          hist("timeline"),
          ...(weather ? [{ type: "weather-forecast", entity: weather, forecast_type: "hourly", show_current: true, show_forecast: true, grid_options: { columns: "full" } }] : []),
        ] },
      ],
    };

    const num = (id, name) => (id ? { type: "tile", entity: id, name, hide_state: true, features_position: "inline", features: [{ type: "numeric-input", style: "buttons" }], grid_options: { columns: 12 } } : null);
    const sw = (id, name) => (id ? { type: "tile", entity: id, name, grid_options: { columns: 6 } } : null);
    const settingsView = {
      title: "Einstellungen", path: "einstellungen", icon: "mdi:tune-variant", type: "sections", max_columns: 3,
      sections: rooms.map((r) => ({
        type: "grid",
        cards: [
          { type: "heading", heading: r.name, icon: "mdi:door", badges: r.sib.problem ? [{ type: "entity", entity: r.sib.problem, show_state: false }] : [] },
          num(r.sib.humidity_limit, "Feuchtegrenze"),
          num(r.sib.min_temp, "Mindesttemperatur"),
          num(r.sib.max_drop, "Max. Abkühlung"),
          sw(r.sib.notifications, "Hinweise"),
          sw(r.sib.window_logic, "Fensterlogik"),
          r.sib.calibrate ? { type: "tile", entity: r.sib.calibrate, name: "Jetzt kalibrieren", grid_options: { columns: 12 } } : null,
        ].filter(Boolean),
      })),
    };

    return { title: config.title || "Heizung", views: [roomsView, historyView, settingsView] };
  }
}

if (!customElements.get("raumklima-card")) customElements.define("raumklima-card", RaumklimaCard);
if (!customElements.get("raumklima-overview-card")) customElements.define("raumklima-overview-card", RaumklimaOverviewCard);
window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === "raumklima-card")) {
  window.customCards.push(
    { type: "raumklima-card", name: "Raumklima – Raum", description: "Thermostat, Lüften und Klima eines Raums", preview: true },
    { type: "raumklima-overview-card", name: "Raumklima – Übersicht", description: "Alle Räume und Außenklima auf einen Blick", preview: true },
    { type: "raumklima-history-card", name: "Raumklima – Verlauf", description: "Temperatur, Luftfeuchte oder Zeitleiste aller Räume", preview: false },
  );
}
if (!customElements.get("raumklima-history-card")) customElements.define("raumklima-history-card", RaumklimaHistoryCard);
if (!customElements.get("ll-strategy-dashboard-raumklima")) customElements.define("ll-strategy-dashboard-raumklima", RaumklimaDashboardStrategy);
window.customStrategies = window.customStrategies || [];
if (!window.customStrategies.find((x) => x.type === "raumklima")) {
  window.customStrategies.push({
    type: "raumklima",
    strategyType: "dashboard",
    name: "Raumklima",
    description: "Heizung, Lüften und Klima aller Raumklima-Räume – baut sich automatisch auf",
    documentationURL: "https://github.com/Goldi5/Raumklima-2",
  });
}
console.info(`%c RAUMKLIMA-CARD %c ${RK_VERSION} `, "background:#ff7a45;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#2ec4a6;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px");
