import { STATUS, STYLES, VENT, fmt, humTone, planText, rkClock, rkDuration, rkOpenSince, setLang, t, toneVar, rkPaint, rkChanged, rkScrolling, rkLater } from "../shared.js";

export class RaumklimaCard extends HTMLElement {
  // Neu zeichnen ohne Springen der Seite
  set _html(html) { rkPaint(this, html); }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "climate", integration: "raumklima" } } },
        { name: "name", selector: { text: {} } },
      ],
      computeLabel: (s) => ({ entity: t("Raum (Raumklima-Thermostat)"), name: t("Anzeigename (optional)") }[s.name]),
    };
  }

  static getStubConfig(hass) {
    const e = Object.values(hass.entities || {}).find((x) => x.platform === "raumklima" && x.entity_id.startsWith("climate."));
    return { entity: e ? e.entity_id : "" };
  }

  setConfig(config) {
    if (!config.entity) throw new Error(t("Bitte ein Raumklima-Thermostat (entity) angeben"));
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
    setLang(hass);
    // nur neu zeichnen, wenn sich an diesem Raum etwas geändert hat – nicht bei jeder Lampe im Haus
    const st = hass.states[this._config.entity];
    const ids = [this._config.entity, ...Object.values(this._siblings()), ...((st && st.attributes.window_entities) || [])];
    if (!rkChanged(this, hass, ids) && this.shadowRoot && this.shadowRoot.firstChild) return;
    if (rkScrolling()) { rkLater(this, () => this._render()); return; }
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
    const since = this.shadowRoot && this.shadowRoot.querySelector("[data-since]");
    if (since && this._winSince) since.textContent = t("Fenster offen seit {c} · {d}", { c: rkClock(this._winSince), d: rkDuration(Date.now() - this._winSince) });
    const empty = this.shadowRoot && this.shadowRoot.querySelector("[data-empty]");
    if (empty && this._emptySince) empty.textContent = t(this._roomEco ? "Raum leer seit {d} – abgesenkt" : "Raum leer seit {d}", { d: rkDuration(Date.now() - this._emptySince) });
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
      const tp = pos(target);
      const [kx, ky] = pt(tp);
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
      this._html = `<style>${STYLES}</style><ha-card><div class="err">${t("Entität {e} nicht gefunden", { e: this._config.entity })}</div></ha-card>`;
      return;
    }
    const a = st.attributes;
    const sib = this._siblings();
    const status = STATUS[a.status] || STATUS.idle;
    const vent = VENT[a.ventilation] || null;
    const target = this._pending ?? a.temperature;
    const isOff = st.state === "off";
    const name = this._config.name || a.friendly_name || t("Raum");
    const winOpen = a.window_open;
    this._openSince = a.window_open_since ? Date.parse(a.window_open_since) : null;
    this._winSince = rkOpenSince(this._hass, a);
    this._emptySince = a.occupied === false && a.empty_since ? Date.parse(a.empty_since) : null;
    this._roomEco = !!a.room_eco;
    this._recMin = a.recommended_minutes || 5;

    let banner = "";
    if (vent && a.ventilation !== "ok") {
      const showBar = winOpen && this._openSince && ["airing", "please_close", "done"].includes(a.ventilation);
      const extra = a.ventilation === "please_open"
        ? `<span>${a.ventilation_reason === "co2" ? t("{c} ppm · ca. {m} min", { c: fmt(a.co2, 0), m: this._recMin }) : t("{h} % · ca. {m} min", { h: fmt(a.current_humidity, 0), m: this._recMin })}</span>`
        : showBar ? `<span class="count" data-count>–</span>` : "";
      banner = `<div class="banner" style="--vt:${toneVar(vent.tone)}">
          <ha-icon icon="${vent.icon}"></ha-icon><span class="grow">${vent.label}${showBar ? ` · ${this._recMin} min` : ""}</span>${extra}
        </div>${showBar ? `<div class="bar" style="--vt:${toneVar(vent.tone)}"><i data-bar style="width:0%"></i></div>` : ""}`;
    }

    const stat = (icon, label, value, tone, entity) =>
      `<div class="stat" ${entity ? `data-more="${entity}" style="cursor:pointer"` : ""}><div class="l"><ha-icon icon="${icon}"></ha-icon>${label}</div>
        <div class="v ${tone ? "tone" : ""}" style="${tone ? `--st:${toneVar(tone)}` : ""}">${value}</div></div>`;

    const stats = [
      a.humidity_sensor ? stat("mdi:water-percent", t("Feuchte"), `${fmt(a.current_humidity, 0)} %`, humTone(a.current_humidity), sib.ventilation) : "",
      a.co2 != null ? stat("mdi:molecule-co2", "CO₂", `${fmt(a.co2, 0)}<small>ppm</small>`, a.co2 >= 1400 ? "cold" : a.co2 >= 1000 ? "warn" : "ok") : "",
      a.dew_point !== undefined && a.dew_point !== null ? stat("mdi:water-thermometer", t("Taupunkt"), `${fmt(a.dew_point)}°`, null, sib.dew_point) : "",
      stat("mdi:valve", t("Ventil"), a.valve_position === null || a.valve_position === undefined ? "–" : `${fmt(a.valve_position, 0)} %`, a.valve_position > 0 ? "heat" : null),
      a.outdoor_temperature !== undefined && a.outdoor_temperature !== null
        ? stat("mdi:weather-partly-cloudy", t("Außen"), `${fmt(a.outdoor_temperature)}°<small>${fmt(a.outdoor_humidity, 0)} %</small>`, null) : "",
      stat("mdi:radiator", t("Heizkörper"), `${fmt(a.trv_temperature)}°`, null),
      a.offset !== undefined && a.offset !== null ? stat("mdi:tune-variant", t("Offset"), `${a.offset > 0 ? "+" : ""}${fmt(a.offset)}°`, null, sib.offset) : "",
    ].join("");

    const syncCls = a.sync === "ok" ? "" : a.sync;
    const syncLabel = { ok: t("synchron"), pending: t("sendet …"), failed: t("keine Antwort") }[a.sync] || a.sync;
    const notif = sib.notifications ? this._hass.states[sib.notifications] : null;
    const wlogic = sib.window_logic ? this._hass.states[sib.window_logic] : null;

    this._html = `<style>${STYLES}</style>
      <ha-card style="--tone:${toneVar(status.tone)}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}">${name}</div>
          ${a.window_open !== undefined ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}</span>
        </div>
        ${a.occupied === true || a.occupied === false ? `<div class="since occ ${a.occupied ? "in" : ""}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon><span ${a.occupied ? "" : "data-empty"}>${a.occupied ? t("Jemand im Raum") : ""}</span></div>` : ""}
        ${winOpen && this._winSince ? `<div class="since"><ha-icon icon="mdi:window-open-variant"></ha-icon><span data-since></span></div>` : ""}
        <div class="dial">
          ${this._arc(a.current_temperature, target, isOff)}
          <div class="center">
            <div class="now">${fmt(a.current_temperature)}<small>°C</small></div>
            <div class="target">${this._pending != null ? t("Ziel <b>{v} °C</b>", { v: fmt(target) }) : planText(a, isOff)}</div>
          </div>
        </div>
        <div class="ctrl">
          <button class="round" data-step="-0.5" ${isOff ? "disabled" : ""} aria-label="${t("kälter")}"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button class="round" data-power aria-label="${t("an/aus")}" style="${isOff ? "" : "color:var(--tone)"}"><ha-icon icon="mdi:power"></ha-icon></button>
          <button class="round" data-step="0.5" ${isOff ? "disabled" : ""} aria-label="${t("wärmer")}"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        ${banner}
        <div class="stats">${stats}</div>
        <div class="actions">
          ${wlogic ? `<button class="pill ${wlogic.state === "on" ? "on" : ""}" data-toggle="${sib.window_logic}"><ha-icon icon="mdi:window-shutter-auto"></ha-icon>${t("Fensterlogik")}</button>` : ""}
          ${notif ? `<button class="pill ${notif.state === "on" ? "on" : ""}" data-toggle="${sib.notifications}"><ha-icon icon="${notif.state === "on" ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}"></ha-icon>${t("Hinweise")}</button>` : ""}
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
