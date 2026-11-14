import { DASH_STYLES, STYLES, esc, fmt, rkHomeId, rkLayout, rkPaint, rkRooms, rkRoomsOrdered, setLang, t, toneVar } from "../shared.js";

export class RaumklimaLearningCard extends HTMLElement {
  set _html(html) { rkPaint(this, html); }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "home", selector: { text: {} } },
        { name: "strip_prefix", selector: { text: {} } },
      ],
    };
  }
  static getStubConfig() { return {}; }

  setConfig(config) {
    this._config = { ...config };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return 8; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }

  connectedCallback() {
    this.style.display = "block";
    this._poll = setInterval(() => this._loadHub(), 15 * 60 * 1000);
  }
  disconnectedCallback() { clearInterval(this._poll); }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    setLang(hass);
    this._rooms = rkRooms(hass, this._config.strip_prefix || "", rkHomeId(hass, this._config));
    if (!this._layout) {
      rkLayout(hass, rkHomeId(hass, this._config)).then((L) => {
        this._layout = L || {};
        this._rooms = rkRoomsOrdered(this._rooms || [], this._layout);
        this._render();
      }).catch(() => {});
    }
    if (first) this._loadHub();
    else this._render();
  }

  _home() {
    const id = this._config.home || rkHomeId(this._hass, this._config);
    return id ? { home: id } : {};
  }

  async _loadHub() {
    if (!this._hass) return;
    try {
      const cfg = await this._hass.callWS({ type: "raumklima/config", ...this._home() });
      this._hub = cfg && cfg.hub ? cfg.hub.state : null;
      this._err = null;
    } catch (e) {
      this._err = e && e.message ? e.message : String(e);
    }
    this._render();
  }

  _tile(label, icon, value, unit, detail, tone = "ok") {
    return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
  }

  _tag(icon, text) {
    return `<span class="tag"><ha-icon icon="${icon}"></ha-icon>${esc(text)}</span>`;
  }

  _tip() {
    const tip = (this._hub && this._hub.presence_tip) || {};
    if (!tip.ready) return "";
    const part = (key, label) => tip[key] ? `${t(label)} ${tip[key].from}–${tip[key].to}` : "";
    return [part("weekday", "Wochentags"), part("weekend", "Wochenende")].filter(Boolean).join(" · ");
  }

  _sleep() {
    const s = (this._hub && this._hub.sleep) || {};
    const bed = s.weekday && s.weekday.bed;
    const wake = s.weekday && s.weekday.wake;
    return bed && wake ? `${bed}–${wake}` : "–";
  }

  _roomRow(room) {
    const s = (room.attrs && room.attrs.settings) || {};
    const h = s.heatup || {};
    const th = s.thermal || {};
    const usage = s.usage || {};
    const airing = s.airing || {};
    const top = ((s.airing_top || {}).learned || [])[0];
    const episodes = Number(h.episodes) || 0;
    const rate = h.rate;
    const minutes = h.minutes_2k;
    const pct = rate != null ? Math.min(100, Math.round((episodes / 5) * 100)) : 0;
    const heat = episodes && rate != null
      ? `${fmt(rate, 1)} K/h · ${t("+2 K in {n} min", { n: minutes == null ? "–" : fmt(minutes, 0) })} · ${t("{n} Aufheizvorgänge", { n: episodes })}`
        + (th.cool_rate != null ? ` · ${fmt(th.cool_rate, 1)} K/h ${t("Abkühlung")}` : "")
        + (th.solar_gain != null && th.solar_gain > 0 ? ` · ${t("Sonne")} +${fmt(th.solar_gain, 1)} K/h` : "")
      : t("Noch zu wenig Daten");
    const use = usage.text ? `${t("Nutzung")}: ${usage.text}` : (usage.days_seen ? t("{n} Tage mit Belegung", { n: usage.days_seen }) : t("Kein Präsenzprofil"));
    const air = airing.episodes
      ? `${t("Lüften")}: ${t("{n} Vorgänge", { n: airing.episodes })}${top ? ` · ${t("typisch")} ${top.time} (${top.count}×)` : ""}`
      : t("Noch kein Lüftmuster");
    return `<div class="dlrow">
      <div class="ltop"><span class="name" data-more="${esc(room.id)}" style="cursor:pointer">${esc(room.name)}</span><span class="pct">${rate != null ? `${pct} %` : ""}</span></div>
      <div class="dbar"><i style="width:${pct}%"></i></div>
      <div class="meta">${esc(heat)}</div>
      <div class="tags">${this._tag("mdi:account-clock-outline", use)}${this._tag("mdi:weather-windy", air)}</div>
    </div>`;
  }

  _render() {
    if (!this._hass) return;
    const rooms = this._rooms || [];
    const withHeat = rooms.filter((r) => {
      const h = (((r.attrs || {}).settings || {}).heatup) || {};
      return h.rate != null && Number(h.episodes) > 0;
    }).length;
    const airings = rooms.reduce((n, r) => n + Number(((((r.attrs || {}).settings || {}).airing || {}).episodes) || 0), 0);
    const withModel = rooms.filter((r) => {
      const th = (((r.attrs || {}).settings || {}).thermal) || {};
      return th.ready && th.cool_rate != null;
    }).length;
    const profile = (this._hub && this._hub.presence_profile) || {};
    const days = Number((profile.days || {}).weekday || 0) + Number((profile.days || {}).weekend || 0);
    const tip = this._tip();
    const title = this._config.title || t("Lernen");
    const sub = tip ? `${t("Vorschlag")}: ${tip}` : t("Was Raumklima aus deinen Daten gelernt hat");
    const body = rooms.length
      ? `<div class="dlrow">${rooms.map((r) => this._roomRow(r)).join("")}</div>`
      : `<div class="dempty"><ha-icon icon="mdi:school-outline"></ha-icon><div>${t("Noch keine Räume eingerichtet.")}</div></div>`;
    this._html = `<style>${STYLES}${DASH_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("eco")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:brain"></ha-icon><div>${esc(title)}<div class="dsub">${esc(sub)}</div></div></div></div></div>
        <div class="dtiles">
          ${this._tile("Aufheizraten", "mdi:fire", `${withHeat}/${rooms.length}`, "", t("Räume mit Daten"), "heat")}
          ${this._tile("Wärmemodell", "mdi:chart-bell-curve", `${withModel}/${rooms.length}`, "", t("Räume mit Wärmeverlust"), "eco")}
          ${this._tile("Anwesenheit", "mdi:account-clock-outline", days, t(" Tage"), profile.complete ? t("Profil vollständig") : t("Profil wächst"), "ok")}
          ${this._tile("Lüften", "mdi:weather-windy", airings, "", t("gelernte Vorgänge"), "air")}
          ${this._tile("Schlaf", "mdi:power-sleep", this._sleep(), "", t("typische Nacht"), "eco")}
        </div>
        ${body}
        <div class="dnote">${t("Lernen ist lesend: Raumklima zeigt hier nur, was es aus den letzten Wochen gelernt hat.")}</div>
      </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
  }
}
