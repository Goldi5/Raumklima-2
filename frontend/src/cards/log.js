import { HISTORY_STYLES, REPORT_STYLES, SETTINGS_STYLES, STYLES, esc, rkRooms, toneVar } from "../shared.js";

const RK_LOG_CATS = {
  presence: ["Anwesenheit", "mdi:home-account", "eco"],
  season: ["Heizsaison", "mdi:radiator", "heat"],
  target: ["Ziel & Heizung", "mdi:thermometer-auto", "ok"],
  window: ["Fenster", "mdi:window-open-variant", "air"],
  notify: ["Nachrichten", "mdi:bell-ring-outline", "warn"],
  manual: ["Von Hand", "mdi:hand-back-right-outline", "eco"],
  health: ["Gesundheit", "mdi:heart-pulse", "cold"],
  device: ["Thermostat-Befehle", "mdi:access-point", "off"],
  settings: ["Einstellungen", "mdi:cog-outline", "off"],
};
const LOG_STYLES = `
  ha-card.log { container-type: inline-size; padding: 24px 26px; }
  @media (max-width: 600px) { ha-card.log { padding: 18px 14px; } }
  .live { display:inline-flex; align-items:center; gap:6px; font-size:.82rem; font-weight:600; color:var(--secondary-text-color); }
  .live i { width:8px; height:8px; border-radius:50%; background: var(--rk-ok); box-shadow: 0 0 0 0 color-mix(in srgb, var(--rk-ok) 60%, transparent); animation: rkpulse 2s infinite; }
  .live.off i { background: var(--rk-off); animation:none; }
  @keyframes rkpulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--rk-ok) 55%, transparent); } 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
  .filters { display:grid; gap:10px; margin:16px 0 6px; }
  .filters .chips { justify-content:flex-start; }
  .chip2 ha-icon { --mdc-icon-size:15px; color: var(--c); }
  .srch { font: inherit; font-size:.95rem; padding:10px 14px; border-radius:14px; border:1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    background: var(--ha-card-background, var(--card-background-color)); color: var(--primary-text-color); width:100%; box-sizing:border-box; }
  .lday { margin-top:18px; }
  .ldayh { position:sticky; top:0; z-index:1; font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--secondary-text-color);
    padding:6px 0; background: var(--ha-card-background, var(--card-background-color)); }
  .ev { display:grid; grid-template-columns: 46px 34px 1fr; gap:10px; align-items:start; padding:10px 0; border-top:1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .ev:first-of-type { border-top:0; }
  .ev .tm { font-size:.86rem; font-weight:600; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; padding-top:6px; }
  .ev .ic { width:34px; height:34px; border-radius:11px; display:grid; place-items:center; background: color-mix(in srgb, var(--c) 15%, transparent); color: var(--c); }
  .ev .ic ha-icon { --mdc-icon-size:18px; }
  .ev .bd { min-width:0; }
  .ev .ms { font-size:.98rem; font-weight:600; color:var(--primary-text-color); line-height:1.35; }
  .ev .rm { display:inline-block; font-size:.75rem; font-weight:700; padding:2px 8px; border-radius:999px; margin-right:6px; vertical-align:1px;
    background: color-mix(in srgb, var(--rc, var(--rk-off)) 16%, transparent); color: color-mix(in srgb, var(--rc, var(--rk-off)) 70%, var(--primary-text-color)); }
  .ev .wy { font-size:.86rem; color:var(--secondary-text-color); margin-top:3px; line-height:1.4; overflow-wrap:anywhere; }
  .ev .wy b { font-weight:600; color: color-mix(in srgb, var(--primary-text-color) 75%, var(--secondary-text-color)); }
  .ev.warn .ms { color: color-mix(in srgb, var(--rk-warn) 60%, var(--primary-text-color)); }
  .ev.new { animation: rkflash 1.6s ease-out; }
  @keyframes rkflash { from { background: color-mix(in srgb, var(--rk-ok) 14%, transparent); } to { background: transparent; } }
  .more { display:flex; justify-content:center; margin-top:16px; }
  .rep { display:inline-block; font-size:.75rem; font-weight:700; padding:2px 8px; border-radius:999px; margin-left:6px; vertical-align:1px;
    background: color-mix(in srgb, var(--rk-warn) 18%, transparent); color: color-mix(in srgb, var(--rk-warn) 70%, var(--primary-text-color)); }
`;

export class RaumklimaLogCard extends HTMLElement {
  static getConfigForm() {
    return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }, { name: "entity", selector: { entity: { domain: "climate", integration: "raumklima" } } }] };
  }
  static getStubConfig() { return {}; }
  setConfig(config) {
    this._config = { ...config };
    this._entries = this._entries || [];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("raumklima-log-filter") || "{}"); } catch (e) { saved = {}; }
    this._room = this._room ?? saved.room ?? "";
    this._cats = this._cats || new Set(saved.cats || Object.keys(RK_LOG_CATS).filter((c) => c !== "device"));
    this._q = this._q || "";
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return 12; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  connectedCallback() {
    this.style.display = "block";
    if (this._hass) { this._load(); if (!this._unsub) this._subscribe(); }
    clearInterval(this._poll);
    this._poll = setInterval(() => this._poll5(), 5000); // Sicherheitsnetz zusätzlich zur Live-Übertragung
    this._onVis = () => { if (document.visibilityState === "visible") this._poll5(); };
    document.addEventListener("visibilitychange", this._onVis);
  }
  disconnectedCallback() {
    clearInterval(this._poll);
    document.removeEventListener("visibilitychange", this._onVis);
    if (this._unsub) { this._unsub.then((u) => u && u()).catch(() => {}); this._unsub = null; }
  }
  _add(list) {
    const known = new Set(this._entries.map((e) => e.id + "|" + e.t));
    const fresh = list.filter((e) => !known.has(e.id + "|" + e.t));
    if (!fresh.length) return false;
    this._entries = [...fresh, ...this._entries].sort((a, b) => (a.t < b.t ? 1 : a.t > b.t ? -1 : 0));
    const vis = fresh.filter((e) => this._visible([e]).length);
    this._fresh = new Set(fresh.map((e) => e.id));
    this._hiddenNew = (this._hiddenNew || 0) + (fresh.length - vis.length);
    return true;
  }
  async _poll5() {
    if (!this._hass || document.visibilityState === "hidden" || this._polling) return;
    this._polling = true;
    try {
      const newest = this._entries.length ? Math.max(...this._entries.map((e) => e.id || 0)) : null;
      const msg = { type: "raumklima/log", limit: 100, ...(newest ? { after: newest } : {}), ...(this._config.home ? { home: this._config.home } : {}) };
      const res = await this._hass.callWS(msg);
      const changed = this._add(res.entries);
      this._stamp = new Date();
      if (changed) this._render();
      else { const st = this.shadowRoot.querySelector(".live .ts"); if (st) st.textContent = " · " + this._stamp.toLocaleTimeString("de-DE"); }
    } catch (e) { /* nächster Versuch in 5 s */ }
    this._polling = false;
  }
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) {
      this._rooms = rkRooms(hass, this._config.strip_prefix || "", this._config.home);
      if (this._config.entity) {
        const r = this._rooms.find((x) => x.id === this._config.entity);
        if (r) this._room = (r.attrs.settings || {}).entry_id || "";
      }
      this._load();
      this._subscribe();
      this._render();
    }
  }
  _save() { try { localStorage.setItem("raumklima-log-filter", JSON.stringify({ room: this._room, cats: [...this._cats] })); } catch (e) { /* privat */ } }
  async _load(older) {
    try {
      const msg = { type: "raumklima/log", limit: 300, ...(this._config.home ? { home: this._config.home } : {}) };
      // Filter schon im Server anwenden – sonst lädt „Ältere laden“ nur ausgeblendete Einträge
      if (this._cats.size < Object.keys(RK_LOG_CATS).length) msg.categories = [...this._cats];
      if (this._room) msg.entry_id = this._room;
      if (older && this._entries.length) msg.before = Math.min(...this._entries.map((e) => e.id || Infinity));
      const res = await this._hass.callWS(msg);
      this._entries = older ? [...this._entries, ...res.entries] : res.entries;
      this._end = res.entries.length < 300;
      this._err = null;
      this._stamp = new Date();
      if (!older) this._hiddenNew = 0;
    } catch (e) { this._err = e.message || String(e); }
    this._render();
  }
  _subscribe() {
    if (!this._hass || !this._hass.connection || this._unsub) return;
    this._unsub = this._hass.connection.subscribeMessage((entry) => {
      this._add([entry]);
      this._stamp = new Date();
      this._liveOff = false;
      this._render();
    }, { type: "raumklima/log/subscribe", ...(this._config.home ? { home: this._config.home } : {}) }).catch(() => { this._unsub = null; this._liveOff = true; this._render(); return null; });
  }
  _roomOf(e) {
    if (!e.eid) return null;
    return this._rooms.find((r) => (r.attrs.settings || {}).entry_id === e.eid) || null;
  }
  _visible(src) {
    const q = this._q.trim().toLowerCase();
    return (src || this._entries).filter((e) => {
      if (!this._cats.has(e.cat) && RK_LOG_CATS[e.cat]) return false;
      if (this._room && e.eid && e.eid !== this._room) return false;
      if (this._room && !e.eid && !["presence", "season"].includes(e.cat)) return false;
      if (q && !`${e.msg} ${e.why || ""} ${e.room || ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }
  _strip(s) {
    const p = this._config.strip_prefix;
    return p ? String(s).replace(new RegExp("^" + p + "\\s*"), "").replace(new RegExp("(\\s)" + p + "\\s+", "g"), "$1") : s;
  }
  _render() {
    if (!this._hass) return;
    const list = this._visible();
    const dayKey = (d) => d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
    const today = dayKey(new Date()), yest = dayKey(new Date(Date.now() - 864e5));
    let html = "", cur = null;
    for (const e of list) {
      const d = new Date(e.t);
      const k = dayKey(d);
      if (k !== cur) { if (cur !== null) html += `</div>`; cur = k; html += `<div class="lday"><div class="ldayh">${k === today ? "Heute" : k === yest ? "Gestern" : k}</div>`; }
      const meta = RK_LOG_CATS[e.cat] || [e.cat, "mdi:information-outline", "off"];
      const room = this._roomOf(e);
      const roomName = room ? room.name : e.room ? this._strip(e.room) : null;
      html += `<div class="ev ${e.lvl === "warn" ? "warn" : ""} ${this._fresh && this._fresh.has && this._fresh.has(e.id) ? "new" : ""}" style="--c:${toneVar(meta[2])}">
        <div class="tm">${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</div>
        <div class="ic" title="${meta[0]}"><ha-icon icon="${meta[1]}"></ha-icon></div>
        <div class="bd"><div class="ms">${roomName ? `<span class="rm" style="--rc:${room ? room.color : "var(--rk-off)"}">${esc(roomName)}</span>` : ""}${esc(this._strip(e.msg))}${e.n > 1 ? ` <span class="rep" title="zuletzt ${new Date(e.t_last || e.t).toLocaleTimeString("de-DE")}">×${e.n} · bis ${new Date(e.t_last || e.t).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>` : ""}</div>
        ${e.why ? `<div class="wy"><b>${e.cat === "notify" && e.msg.indexOf("Knopf") !== 0 ? "Inhalt" : e.cat === "device" || e.cat === "settings" ? "Details" : "Warum"}:</b> ${esc(this._strip(e.why))}</div>` : ""}</div></div>`;
    }
    if (cur !== null) html += `</div>`;
    this._fresh = null; // Aufblitzen nur beim ersten Anzeigen
    const roomChips = [`<button class="chip2 ${this._room ? "off" : ""}" data-room="" style="--c:var(--rk-off)"><i></i>Alle Räume</button>`]
      .concat(this._rooms.map((r) => { const id = (r.attrs.settings || {}).entry_id; return `<button class="chip2 ${this._room === id ? "" : "off"}" data-room="${id}" style="--c:${r.color}"><i></i>${esc(r.name)}</button>`; })).join("");
    const catChips = Object.entries(RK_LOG_CATS).map(([k, m]) => `<button class="chip2 ${this._cats.has(k) ? "" : "off"}" data-cat="${k}" style="--c:${toneVar(m[2])}"><ha-icon icon="${m[1]}"></ha-icon>${m[0]}</button>`).join("");
    const empty = this._err ? `<div class="err">Protokoll nicht verfügbar: ${esc(this._err)}</div>`
      : !this._entries.length ? `<div class="empty">Noch keine Einträge. Ab jetzt steht hier jede Entscheidung mit Begründung.</div>`
      : !list.length ? `<div class="empty">Keine Einträge für diese Auswahl.</div>` : "";
    const focus = this.shadowRoot.activeElement && this.shadowRoot.activeElement.classList.contains("srch");
    this.shadowRoot.innerHTML = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${REPORT_STYLES}${LOG_STYLES}</style>
      <ha-card class="log" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:text-box-search-outline"></ha-icon><div>${esc(this._config.title || "Protokoll")}<div class="rsub">Was wann warum entschieden wurde · 14 Tage</div></div></div>
          <span class="live ${this._liveOff ? "off" : ""}" title="neue Einträge kommen sofort, zusätzlich wird alle 5 s nachgesehen"><i></i>${this._liveOff ? "alle 5 s" : "live"}<span class="ts">${this._stamp ? ` · ${this._stamp.toLocaleTimeString("de-DE")}` : ""}</span></span></div>
        ${this._hiddenNew ? `<div class="hint" style="margin-top:8px">+${this._hiddenNew} neue Einträge sind durch die Filter ausgeblendet (z. B. Thermostat-Befehle). <button class="mini" data-showall>Alle zeigen</button></div>` : ""}
        <div class="filters">
          <div class="chips">${roomChips}</div>
          <div class="chips">${catChips}</div>
          <input class="srch" placeholder="Suchen … (z. B. Antje, Offset, Heizpause)" value="${esc(this._q)}">
        </div>
        ${empty}${html}
        ${this._entries.length && !this._end ? `<div class="more"><button class="btn" data-more><ha-icon icon="mdi:history"></ha-icon>Ältere laden</button></div>` : ""}
      </ha-card>`;
    const $ = (s) => this.shadowRoot.querySelectorAll(s);
    $("[data-room]").forEach((b) => b.addEventListener("click", () => { this._room = b.dataset.room; this._save(); this._render(); this._load(); }));
    $("[data-cat]").forEach((b) => b.addEventListener("click", () => { const c = b.dataset.cat; this._cats.has(c) ? this._cats.delete(c) : this._cats.add(c); this._save(); this._render(); this._load(); }));
    $("[data-more]").forEach((b) => b.addEventListener("click", () => this._load(true)));
    $("[data-showall]").forEach((b) => b.addEventListener("click", () => { this._cats = new Set(Object.keys(RK_LOG_CATS)); this._room = ""; this._hiddenNew = 0; this._save(); this._load(); }));
    const s = this.shadowRoot.querySelector(".srch");
    s.addEventListener("input", () => { this._q = s.value; clearTimeout(this._qt); this._qt = setTimeout(() => this._render(), 250); });
    if (focus) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
  }
}
