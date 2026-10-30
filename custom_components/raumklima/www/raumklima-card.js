/*
 * Raumklima-Karte – wird von der Integration automatisch geladen.
 *   type: custom:raumklima-card          (ein Raum)
 *   type: custom:raumklima-overview-card (alle Räume + Außenklima)
 */
const RK_VERSION = "0.2.0";

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
  .knob { fill: var(--ha-card-background, var(--card-background-color)); stroke: var(--primary-text-color); stroke-width:3; transition: cx .6s, cy .6s; }
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

  _arc(cur, target, min, max) {
    const R = 100, cx = 120, cy = 112, start = 135, sweep = 270;
    const pos = (v) => start + (Math.min(max, Math.max(min, v)) - min) / (max - min) * sweep;
    const pt = (deg) => { const r = (deg * Math.PI) / 180; return [cx + R * Math.cos(r), cy + R * Math.sin(r)]; };
    const path = (a, b) => { const [x1, y1] = pt(a), [x2, y2] = pt(b); return `M ${x1} ${y1} A ${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${x2} ${y2}`; };
    const t = pos(target ?? min), c = pos(cur ?? min);
    const [kx, ky] = pt(t);
    const [nx, ny] = pt(c);
    return `<svg viewBox="0 0 240 200" aria-hidden="true">
      <path class="track" d="${path(start, start + sweep)}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path class="fill" d="${path(start, Math.max(start + 0.01, t))}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <circle cx="${nx}" cy="${ny}" r="4" fill="var(--primary-text-color)" opacity=".55"/>
      <circle class="knob" cx="${kx}" cy="${ky}" r="10"/>
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
          ${this._arc(a.current_temperature, isOff ? null : target, a.min_temp ?? 5, Math.min(a.max_temp ?? 30, 28))}
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
      return `<div class="room" data-more="${r.entity_id}" style="--tone:${toneVar(tone)}">
        <div class="dot"><ha-icon icon="${v && a.ventilation !== "ok" ? v.icon : s.icon}"></ha-icon></div>
        <div class="rn">${(a.friendly_name || "").replace(/^Finja Berlin\s*/, "")}<span>${v && a.ventilation !== "ok" ? v.label : s.label}</span></div>
        <div class="rt">${fmt(a.current_temperature)}°<span>${off ? "aus" : `→ ${fmt(a.temperature)}°`}</span></div>
        <div class="rh" style="--st:${toneVar(humTone(a.current_humidity))}">${a.humidity_sensor ? `${fmt(a.current_humidity, 0)} %` : ""}</div>
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
      .rooms { display:grid; gap:6px; }
      .room { display:grid; grid-template-columns: 40px 1fr auto 56px; align-items:center; gap:12px; padding:10px 12px; border-radius:18px; cursor:pointer;
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); transition: background .2s; }
      .room:hover { background: color-mix(in srgb, var(--tone) 10%, transparent); }
      .dot { width:40px; height:40px; border-radius:14px; display:grid; place-items:center; color:var(--tone); background: color-mix(in srgb, var(--tone) 15%, transparent); }
      .dot ha-icon { --mdc-icon-size:20px; }
      .rn { font-weight:600; color:var(--primary-text-color); }
      .rn span, .rt span { display:block; font-weight:400; font-size:.78rem; color:var(--secondary-text-color); }
      .rt { text-align:right; font-weight:600; font-size:1.1rem; font-variant-numeric: tabular-nums; color:var(--primary-text-color); }
      .rh { text-align:right; font-weight:600; color: var(--st); font-variant-numeric: tabular-nums; }
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

if (!customElements.get("raumklima-card")) customElements.define("raumklima-card", RaumklimaCard);
if (!customElements.get("raumklima-overview-card")) customElements.define("raumklima-overview-card", RaumklimaOverviewCard);
window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === "raumklima-card")) {
  window.customCards.push(
    { type: "raumklima-card", name: "Raumklima – Raum", description: "Thermostat, Lüften und Klima eines Raums", preview: true },
    { type: "raumklima-overview-card", name: "Raumklima – Übersicht", description: "Alle Räume und Außenklima auf einen Blick", preview: true },
  );
}
console.info(`%c RAUMKLIMA-CARD %c ${RK_VERSION} `, "background:#ff7a45;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#2ec4a6;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px");
