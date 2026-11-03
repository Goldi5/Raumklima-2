import { rkLayout, rkLayoutApply, rkLayoutColor, rkOnLayoutChanged, PRESENCE, SEASON, STATUS, STYLES, VENT, esc, escRe, fmt, humTone, rkClock, rkDuration, rkHomeId, rkHomes, rkHub, rkOpenSince, setLang, t, toneVar, rkPaint, rkChanged, rkScrolling, rkLater } from "../shared.js";

export class RaumklimaOverviewCard extends HTMLElement {
  // Neu zeichnen ohne Springen der Seite
  set _html(html) { rkPaint(this, html); }
  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "weather", selector: { entity: { domain: "weather" } } },
      ],
      computeLabel: (s) => ({ title: t("Titel"), weather: t("Wetter (optional)") }[s.name]),
    };
  }
  static getStubConfig() { return { title: t("Heizung") }; }
  setConfig(config) { this._config = config || {}; if (!this.shadowRoot) this.attachShadow({ mode: "open" }); }
  getCardSize() { return 4; }
  getGridOptions() { return { columns: 12, rows: "auto" }; }
  set hass(hass) {
    this._hass = hass;
    setLang(hass);
    // Welche Dashboards gibt es wirklich? Die Zentrale weiß es verlässlicher als hass.dashboards.
    if (!this._dashAsked) {
      this._dashAsked = true;
      hass.callWS({ type: "raumklima/dashboards" })
        .then((r) => { this._known = new Set((r && r.dashboards) || []); this._render(); })
        .catch(() => {});
    }
    // Darstellung je Wohnung (Reihenfolge, Ausblenden, Farbe)
    if (!this._layoutAsked) {
      this._layoutAsked = true;
      rkLayout(hass, rkHomeId(hass, this._config))
        .then((L) => { this._layout = L; this._render(); })
        .catch(() => {});
    }
    // nur bei Änderungen an Raumklima-Entitäten (und deren Fenstern) neu zeichnen
    const own = Object.values(hass.entities || {}).filter((e) => e.platform === "raumklima").map((e) => e.entity_id);
    const wins = own.filter((id) => id.startsWith("climate.")).flatMap((id) => (hass.states[id] && hass.states[id].attributes.window_entities) || []);
    if (!rkChanged(this, hass, [...own, ...wins]) && this.shadowRoot && this.shadowRoot.firstChild) return;
    if (rkScrolling()) { rkLater(this, () => this._render()); return; }
    this._render();
  }
  connectedCallback() {
    this._timer = setInterval(() => (rkScrolling() ? null : this._render()), 30000);
    this._layoutUnsub = rkOnLayoutChanged(() => this._reloadLayout());
  }
  disconnectedCallback() {
    clearInterval(this._timer);
    if (this._layoutUnsub) this._layoutUnsub();
  }
  _reloadLayout() {
    this._layoutAsked = true;
    rkLayout(this._hass, rkHomeId(this._hass, this._config))
      .then((L) => { this._layout = L; this._sig = null; this._render(); })
      .catch(() => {});
  }

  // Überwachungsraum: große Ansicht mit allen vorhandenen Daten – ohne Thermostat.
  _monitorPanel(st) {
    const a = st.attributes || {};
    const v = VENT[a.ventilation];
    const prefix = this._config.strip_prefix ?? "";
    const name = (a.friendly_name || "").replace(new RegExp("^" + escRe(prefix) + "\\s*"), "");
    const tone = v && a.ventilation !== "ok" ? v.tone : "eco";
    const stat = (icon, label, value) =>
      `<div class="mstat"><div class="ml"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div><div class="mv">${value}</div></div>`;
    const why = a.ventilation === "please_open"
      ? (a.ventilation_reason === "co2"
        ? t("CO₂ bei {c} ppm – ab 1000 ppm wird es stickig.", { c: fmt(a.co2, 0) })
        : t("Feuchte bei {h} % – lüften senkt die Schimmelgefahr.", { h: fmt(a.current_humidity, 0) }))
      : v && a.ventilation !== "ok" ? t("Die Luft ist gerade nicht in Ordnung.") : t("Luft und Klima sind in Ordnung.");
    return `<div class="mon" style="--tone:${toneVar(tone)}">
      <div class="monhead">
        <button class="monback" data-monback><ha-icon icon="mdi:arrow-left"></ha-icon>${t("Zurück")}</button>
        <div class="montitle"><b>${name}</b><span>${t("Überwachung · kein Thermostat")}</span></div>
        <span class="chip" style="--tone:${toneVar(tone)}"><ha-icon icon="${v ? v.icon : "mdi:eye-outline"}"></ha-icon>${v && a.ventilation !== "ok" ? v.label : t("Überwachung")}</span>
      </div>
      <div class="monbig">
        <div class="t">${fmt(a.current_temperature)}<i>°</i></div>
        <div class="r">
          <b>${why}</b>
          ${a.ventilation === "please_open" && a.recommended_minutes ? `<span>${t("Empfohlen: etwa {m} Minuten lüften.", { m: a.recommended_minutes })}</span>` : ""}
          ${!a.humidity_sensor ? `<span>${t("Kein Feuchtefühler – bewertet nur die Temperatur.")}</span>` : ""}
        </div>
      </div>
      <div class="mstats">
        ${a.humidity_sensor ? stat("mdi:water-percent", "Feuchte", `${fmt(a.current_humidity, 0)} %`) : ""}
        ${a.dew_point != null ? stat("mdi:water-thermometer", "Taupunkt", `${fmt(a.dew_point)}°`) : ""}
        ${a.co2 != null ? stat("mdi:molecule-co2", "CO₂", `${fmt(a.co2, 0)} ppm`) : ""}
        ${a.outdoor_temperature != null ? stat("mdi:weather-partly-cloudy", "Außen", `${fmt(a.outdoor_temperature)}° · ${fmt(a.outdoor_humidity, 0)} %`) : ""}
        ${stat("mdi:window-open-variant", "Fenster", a.window_open ? t("offen") : t("zu"))}
        ${a.occupied !== undefined ? stat("mdi:account", "Anwesend", a.occupied ? t("jemand im Raum") : t("niemand")) : ""}
      </div>
      <div class="monfoot">${t("Dieser Raum hat kein Thermostat: Raumklima misst hier nur und gibt Hinweise. Geheizt wird über die Heizung, die diesen Raum versorgt.")}</div>
    </div>`;
  }

  _render() {
    if (!this._hass) return;
    const homeId = rkHomeId(this._hass, this._config);
    const rooms = Object.values(this._hass.entities || {})
      .filter((e) => e.platform === "raumklima" && e.entity_id.startsWith("climate."))
      .map((e) => this._hass.states[e.entity_id])
      .filter(Boolean)
      .filter((r) => !homeId || !r.attributes.home || r.attributes.home === homeId)
      .sort((a, b) => (a.attributes.friendly_name || "").localeCompare(b.attributes.friendly_name || ""));
    const rows = rkLayoutApply(rooms, this._layout);
    const homes = rkHomes(this._hass);
    const curHome = homeId || (rooms[0] && rooms[0].attributes.home);
    // Nur umschalten, wenn das Ziel-Dashboard wirklich existiert – sonst landet man auf dem Standard
    const curPath = String((this._hass && this._hass.panelUrl) || "").replace(/^\//, "");
    const dashTarget = (h) => {
      const path = String(h.dashboard || "").replace(/^\//, "");
      if (!path) return { ok: false, path };
      const known = (this._hass && this._hass.dashboards) || {};
      const server = this._known instanceof Set ? this._known.has(path) : false;
      return { ok: path === curPath || server || Object.prototype.hasOwnProperty.call(known, path), path };
    };
    const homeBar = homes.length > 1 ? `<div class="homes">${homes.map((h) => {
      const on = h.id === curHome;
      const d = dashTarget(h);
      const title = on || d.ok ? "" : t("Für diese Wohnung ist noch kein eigenes Dashboard eingerichtet – erst anlegen, dann lässt sich umschalten.");
      return `<a class="hm ${on ? "on" : ""}${d.ok || on ? "" : " nodash"}" ${on || !d.ok ? "" : `data-nav="/${esc(d.path)}"`} title="${esc(title)}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</a>`;
    }).join("")}</div>` : "";
    const heating = rows.filter((r) => r.attributes.status === "heating").length;
    const windows = rows.filter((r) => r.attributes.window_open).length;
    // Ausgeschaltete Räume werden bei Abwesenheit nicht abgesenkt – das war bisher nicht erkennbar
    const offRooms = rows.filter((r) => r.state === "off").length;
    const warn = rows.filter((r) => ["please_open", "please_close", "too_cold"].includes(r.attributes.ventilation) || r.attributes.sync === "failed" || ["sensor_unavailable", "trv_unavailable"].includes(r.attributes.status)).length;
    const w = this._config.weather ? this._hass.states[this._config.weather] : null;
    const outT = w ? w.attributes.temperature : rows.map((r) => r.attributes.outdoor_temperature).find((v) => v !== undefined && v !== null);
    const outH = w ? w.attributes.humidity : rows.map((r) => r.attributes.outdoor_humidity).find((v) => v !== undefined && v !== null);
    const allSync = rows.every((r) => r.attributes.sync === "ok");
    const hubIds = rkHub(this._hass, curHome);
    const presSt = hubIds.presence ? this._hass.states[hubIds.presence] : null;
    const seasSt = hubIds.heating_mode ? this._hass.states[hubIds.heating_mode] : null;
    const pres = presSt ? PRESENCE[presSt.state] : null;
    const seas = seasSt ? SEASON[seasSt.state] : null;
    const here = presSt ? Object.values(presSt.attributes.persons || {}).filter((p) => p.present).map((p) => p.name) : [];

    const row = (r) => {
      const a = r.attributes;
      const mon = a.monitor === true;
      const s = mon ? { label: t("Überwachung"), tone: "eco", icon: "mdi:eye-outline" } : (STATUS[a.status] || STATUS.idle);
      const v = VENT[a.ventilation];
      const off = r.state === "off";
      const tone = v && a.ventilation !== "ok" ? v.tone : s.tone;
      const label = v && a.ventilation !== "ok" ? v.label : s.label;
      // Steht das Thermostat anders als Raumklimas Ziel? Das erklärt „Heizt“ bei erreichtem Ziel.
      const trvNote = a.trv_target != null && a.temperature != null && Math.abs(a.trv_target - a.temperature) >= 0.3
        ? ` · ${t("Thermostat {v}°", { v: fmt(a.trv_target) })}`
        : "";
      const prefix = this._config.strip_prefix ?? "";
      const name = (a.friendly_name || "").replace(new RegExp("^" + escRe(prefix) + "\\s*"), "");
      // Angezeigt wird, worauf der Raum gerade regelt (Zeitplan, Boost, Absenkung).
      // Der Wunsch steht daneben, wenn er davon abweicht – sonst wirken HA-Dial und Karte widersprüchlich (Issue #12).
      const applied = a.effective_target != null ? a.effective_target : a.temperature;
      const wish = a.wish != null ? a.wish : a.temperature;
      const wishDiffers = applied != null && wish != null && Math.abs(applied - wish) >= 0.05;
      const targetText = mon
        ? ""
        : off
        ? t("aus")
        : a.plan_reason === "season"
          ? t("Pause")
          : wishDiffers
            ? (applied < wish
              ? t("↓ {v}° · Wunsch {w}°", { v: fmt(applied), w: fmt(wish) })
              : t("Ziel {v}° · Wunsch {w}°", { v: fmt(applied), w: fmt(wish) }))
            : t("Ziel {v}°", { v: fmt(applied) });
      return `<div class="room" ${mon ? `data-mon="${r.entity_id}"` : `data-more="${r.entity_id}"`} style="--tone:${toneVar(tone)}">
        <div class="rtop"><div class="dot"><ha-icon icon="${v && a.ventilation !== "ok" ? v.icon : s.icon}"></ha-icon></div>
          ${a.occupied === true ? `<ha-icon class="occ" icon="mdi:account" title="${t("Jemand im Raum")}"></ha-icon>` : ""}
          ${a.window_open ? `<span class="wopen"><ha-icon class="win" icon="mdi:window-open-variant"></ha-icon>${(() => { const s = rkOpenSince(this._hass, a); return s ? `<span title="${t("offen seit {c}", { c: rkClock(s) })}">${rkDuration(Date.now() - s)}</span>` : ""; })()}</span>` : ""}</div>
        <div class="rn">${name}</div>
        <div class="rs">${label}${trvNote}</div>
        <div class="rbottom">
          <div class="rt">${fmt(a.current_temperature)}°</div>
          <div class="rmeta">${targetText}${a.humidity_sensor ? `<b style="--st:${toneVar(humTone(a.current_humidity))}">${fmt(a.current_humidity, 0)} %</b>` : ""}</div>
        </div>
      </div>`;
    };

    this._html = `<style>${STYLES}
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
      .occ { color: var(--rk-ok); --mdc-icon-size:18px; margin-left:auto; margin-right:6px; }
      .wopen { display:inline-flex; align-items:center; gap:4px; color:var(--rk-air); font-size:.78rem; font-weight:600; font-variant-numeric:tabular-nums; }
      .rn { font-weight:650; color:var(--primary-text-color); }
      .rs { font-size:.78rem; color: var(--tone); font-weight:600; }
      .homes { display:flex; gap:6px; margin:-4px 0 14px; flex-wrap:wrap; }
      .hm { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:999px; font-weight:650; font-size:.95rem;
        color:var(--secondary-text-color); background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
      .hm ha-icon { --mdc-icon-size:17px; }
      .hm.on { background: var(--primary-text-color); color: var(--ha-card-background, var(--card-background-color)); cursor:default; }
      .hm.nodash { opacity:.5; cursor:default; }
      .rbottom { margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; gap:8px; }
      .rt { font-size:1.7rem; font-weight:300; letter-spacing:-.03em; font-variant-numeric: tabular-nums; color:var(--primary-text-color); line-height:1; }
      .rmeta { text-align:right; font-size:.78rem; color:var(--secondary-text-color); display:flex; flex-direction:column; gap:2px; }
      .rmeta b { color: var(--st); font-weight:650; }
    </style>
    <ha-card style="--tone:${toneVar(warn ? "warn" : heating ? "heat" : "ok")}">
      ${homeBar}
      <div class="head">
        <div style="flex:1;min-width:0"><div class="title">${this._config.title || t("Heizung")}</div>
          <div class="sub">${t("{r} Räume · {h} heizen · {w} Fenster offen", { r: rows.length, h: heating, w: windows })}</div></div>
        ${outT !== undefined && outT !== null ? `<div class="out"><b>${fmt(outT)}°</b><span>${t("außen · {h} %", { h: fmt(outH, 0) })}</span></div>` : ""}
      </div>
      <div class="kpis">
        <span class="chip" style="--tone:${toneVar(heating ? "heat" : "off")}"><ha-icon icon="mdi:fire"></ha-icon>${t("{n} heizen", { n: heating })}</span>
        ${pres && presSt && ["away_short", "away_long"].includes(presSt.state) && offRooms ? `<span class="chip" style="--tone:${toneVar("off")}"><ha-icon icon="mdi:power-plug-off"></ha-icon>${offRooms > 1 ? t("{n} Räume aus", { n: offRooms }) : t("1 Raum aus")}</span>` : ""}
        <span class="chip" style="--tone:${toneVar(windows ? "air" : "off")}"><ha-icon icon="mdi:window-open-variant"></ha-icon>${t("{n} offen", { n: windows })}</span>
        <span class="chip" style="--tone:${toneVar(warn ? "warn" : "ok")}"><ha-icon icon="${warn ? "mdi:alert-circle-outline" : "mdi:check-circle-outline"}"></ha-icon>${warn ? (warn > 1 ? t("{n} Hinweise", { n: warn }) : t("1 Hinweis")) : t("alles gut")}</span>
        <span class="chip" style="--tone:${toneVar(allSync ? "ok" : "warn")}"><ha-icon icon="mdi:sync"></ha-icon>${allSync ? t("synchron") : t("sendet …")}</span>
        ${pres && presSt.attributes.configured ? `<span class="chip" data-more="${hubIds.presence}" style="--tone:${toneVar(pres.tone)};cursor:pointer"><ha-icon icon="${pres.icon}"></ha-icon>${presSt.state === "home" && here.length ? here.join(", ") : pres.label}${presSt.state === "preheat" && presSt.attributes.preheat_by ? ` · ${presSt.attributes.preheat_by}` : ""}</span>` : ""}
        ${seas ? `<span class="chip" data-more="${hubIds.heating_mode}" style="--tone:${toneVar(seas.tone)};cursor:pointer"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}${seasSt.attributes.mean_combined != null ? ` · Ø ${fmt(seasSt.attributes.mean_combined)}°` : ""}</span>` : ""}
      </div>
      ${this._mon && this._hass.states[this._mon] ? this._monitorPanel(this._hass.states[this._mon]) : `<div class="rooms">${rows.map(row).join("")}</div>`}
    </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-mon]").forEach((b) => b.addEventListener("click", () => {
      this._mon = b.dataset.mon;
      this._render();
    }));
    const backMon = this.shadowRoot.querySelector("[data-monback]");
    if (backMon) backMon.addEventListener("click", () => { this._mon = null; this._render(); });
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) =>
      b.addEventListener("click", () => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
    this.shadowRoot.querySelectorAll("[data-nav]").forEach((el) => el.addEventListener("click", () => {
      history.pushState(null, "", el.dataset.nav);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    }));
  }
}
