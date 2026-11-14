import { DASH_STYLES, STYLES, esc, fmt, rkPaint, setLang, t, toneVar } from "../shared.js";

const STATUS = {
  heating: { label: "Heizt", icon: "mdi:fire", tone: "heat" },
  idle: { label: "Bereit", icon: "mdi:check-circle-outline", tone: "ok" },
  setback: { label: "Absenkt", icon: "mdi:weather-night", tone: "eco" },
  window: { label: "Fenster offen", icon: "mdi:window-open-variant", tone: "air" },
};

const SAMPLE = [
  { id: "bad", name: "Bad", temp: 21.5, target: 22.0, humidity: 62, status: "heating", window: false },
  { id: "wohnen", name: "Wohnzimmer", temp: 20.8, target: 21.0, humidity: 48, status: "idle", window: false },
  { id: "buero", name: "Büro", temp: 19.2, target: 20.0, humidity: 40, status: "setback", window: true },
];

export class RaumklimaDemoCard extends HTMLElement {
  set _html(html) { rkPaint(this, html); }
  static getConfigForm() {
    return { schema: [{ name: "title", selector: { text: {} } }] };
  }
  static getStubConfig() { return {}; }
  setConfig(config) { this._config = { ...config }; if (!this.shadowRoot) this.attachShadow({ mode: "open" }); }
  getCardSize() { return 8; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  connectedCallback() { this.style.display = "block"; }
  set hass(hass) { this._hass = hass; setLang(hass); this._render(); }

  constructor() {
    super();
    this._rooms = SAMPLE.map((r) => ({ ...r }));
  }

  _step(id, delta) {
    const room = this._rooms.find((r) => r.id === id);
    if (!room) return;
    room.target = Math.max(5, Math.min(30, Math.round((room.target + delta) * 2) / 2));
    this._render();
  }

  _window(id) {
    const room = this._rooms.find((r) => r.id === id);
    if (!room) return;
    room.window = !room.window;
    room.status = room.window ? "window" : "idle";
    this._render();
  }

  _tile(label, icon, value, unit, detail, tone = "ok") {
    return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
  }

  _render() {
    if (!this._hass) return;
    const rooms = this._rooms.map((r) => {
      const st = STATUS[r.status] || STATUS.idle;
      const label = r.id === "bad" ? t("Bad") : r.id === "wohnen" ? t("Wohnzimmer") : t("Büro");
      return `<div class="dlrow">
        <div class="ltop"><span class="name">${esc(label)}</span><span class="pct" style="color:${toneVar(st.tone)}">${t(st.label)}</span></div>
        <div class="dbar"><i style="width:${Math.min(100, Math.max(0, (r.temp - 14) / 14 * 100))}%"></i></div>
        <div class="meta">${t("Innen {v} °C", { v: fmt(r.temp, 1) })} · ${t("Soll {v} °C", { v: fmt(r.target, 1) })} · ${t("{v} % Feuchte", { v: fmt(r.humidity, 0) })}</div>
        <div class="tags">
          <button class="chip2" data-demo-step="${r.id}|-0.5">− 0,5</button>
          <button class="chip2" data-demo-step="${r.id}|0.5">+ 0,5</button>
          <button class="chip2${r.window ? "" : " off"}" data-demo-window="${r.id}"><i></i>${r.window ? t("Fenster zu") : t("Fenster auf")}</button>
        </div>
      </div>`;
    }).join("");
    this._html = `<style>${STYLES}${DASH_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("eco")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:flask-outline"></ha-icon><div>${esc(this._config.title || t("Demo"))}<div class="dsub">${t("Simulierte Räume ohne Hardware")}</div></div></div></div></div>
        <div class="dtiles">
          ${this._tile("Räume", "mdi:home-group", "3", "", t("Demo-Daten"), "eco")}
          ${this._tile("Energie", "mdi:lightning-bolt", "128", " kWh", "42,50 € · 30 % PV", "warn")}
          ${this._tile("Lernen", "mdi:brain", "+2 K", "", t("in 45 min"), "ok")}
        </div>
        <div class="dlrow">${rooms}</div>
        <div class="dnote">${t("Alles hier ist simuliert – ohne Home-Assistant-Entitäten und ohne persönliche Daten.")}</div>
      </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-demo-step]").forEach((b) => b.addEventListener("click", () => {
      const [id, delta] = b.dataset.demoStep.split("|");
      this._step(id, Number(delta));
    }));
    this.shadowRoot.querySelectorAll("[data-demo-window]").forEach((b) => b.addEventListener("click", () => this._window(b.dataset.demoWindow)));
  }
}
