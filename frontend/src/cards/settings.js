import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../shared.js";
import { HELP } from "../help.js";
import { RK_NUM } from "../fields.js";
import { getLang } from "../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./settings/const.js";
import { SheetMethods } from "./settings/sheet.js";
import { GeneralMethods } from "./settings/general.js";
import { LayoutMethods } from "./settings/layout.js";
import { ScheduleMethods } from "./settings/schedule.js";
import { RoomMethods } from "./settings/room.js";
import { LearnMethods } from "./settings/learn.js";
import { BindMethods } from "./settings/bind.js";

export class RaumklimaSettingsCard extends HTMLElement {
  static getConfigForm() {
    return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }] };
  }
  static getStubConfig() { return {}; }
  setConfig(config) {
    this._config = { ...config };
    this._tab = this._tab || "general";
    if (this._sheet === undefined) this._sheet = null;  // Dialog für Sichern/Diagnose/Fehler
    this._local = this._local || {}; // optimistische Werte bis zur Bestätigung
    this._timers = this._timers || {};
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return 14; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  connectedCallback() {
    this.style.display = "block";
    this._poll = setInterval(() => this._load(), 60000);
  }
  disconnectedCallback() { clearInterval(this._poll); }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    setLang(hass);
    this._rooms = rkRooms(hass, this._config.strip_prefix || "", this._homeId());
    if (first) {
      this._trace("card", { layout: "settings" });
      this._load();
      this._loadLayout();
    }
    const hubIds = rkHub(hass, this._homeId());
    const sig = JSON.stringify([
      this._rooms.map((r) => [r.attrs, Object.values(r.sib).map((id) => hass.states[id] && hass.states[id].state)]),
      Object.values(hubIds).map((id) => hass.states[id] && [hass.states[id].state, hass.states[id].attributes]),
      this._tab, this._cfgVer, this._toast,
    ]);
    if (sig === this._sig) return;
    this._sig = sig;
    // Punkt 3 von außen: Ein Neuzeichnen während des Tippens verschluckt den Tipp.
    // Solange der Dialog offen ist, bleibt das DOM stehen; Statuszeile wird direkt gesetzt.
    if (this._sheet) return;
    if (rkScrolling()) { rkLater(this, () => this._render()); return; }
    this._render();
  }
  _renderSoon() {
    // Während jemand tippt oder ein Auswahlfeld offen hat: warten, danach nachholen
    if (rkBusy(this)) {
      if (!this._waiting) {
        this._waiting = true;
        this.shadowRoot.addEventListener("focusout", () => { this._waiting = false; setTimeout(() => this._render(), 50); }, { once: true });
      }
      return true;
    }
    return false;
  }

  _homeId() {
    return this._home || rkHomeId(this._hass, this._config)
      || (this._cfg && this._cfg.hub && this._cfg.hub.entry_id) || null;
  }
  _homeMsg() { const h = this._home || this._config.home; return h ? { home: h } : {}; }
  async _load() {
    if (!this._hass) return;
    try {
      this._cfg = await this._hass.callWS({ type: "raumklima/config", ...this._homeMsg() });
      this._rooms = rkRooms(this._hass, this._config.strip_prefix || "", this._homeId());
      this._err = null;
    } catch (e) {
      this._err = String(e && e.message ? e.message : e);
    }
    this._cfgVer = (this._cfgVer || 0) + 1;
    this._sig = null;
    this._render();
    // Fehlende Dashboards einmal je Sitzung nachziehen (z. B. Wohnung vor 0.24 angelegt)
    if (this._admin && !this._dashRepaired && this._cfg) {
      this._dashRepaired = true;
      this._repairDashboards();
    }
  }

  _hubOpt(key) {
    if (this._local["hub:" + key] !== undefined) return this._local["hub:" + key];
    return this._cfg && this._cfg.hub ? this._cfg.hub.options[key] : undefined;
  }
  _roomOpt(room, key) {
    const lk = `room:${room.entry_id}:${key}`;
    if (this._local[lk] !== undefined) return this._local[lk];
    const r = this._cfgRoom(room);
    if (!r) return undefined;
    if (key === "setback_short" || key === "setback_long" || key === "comfort_temperature") return r[key];
    return r.options[key];
  }
  _cfgRoom(room) {
    const id = (room.attrs.settings || {}).entry_id;
    return this._cfg ? (this._cfg.rooms || []).find((r) => r.entry_id === id) : null;
  }
  _setHub(changes, delay = 700) {
    for (const [k, v] of Object.entries(changes)) this._local["hub:" + k] = v;
    this._pendingHub = { ...(this._pendingHub || {}), ...changes };
    clearTimeout(this._timers.hub);
    this._timers.hub = setTimeout(() => this._flushHub(), delay);
    this._sig = null; this._render();
  }
  async _flushHub() {
    const changes = this._pendingHub; this._pendingHub = null;
    if (!changes) return;
    try {
      await this._hass.callWS({ type: "raumklima/hub/update", changes, ...this._homeMsg() });
      this._flash("Gespeichert");
    } catch (e) { this._flash(t("Fehler: {e}", { e: e.message || e })); }
    await this._load();
    for (const k of Object.keys(changes)) delete this._local["hub:" + k];
  }
  _setRoom(entryId, changes, delay = 1500) {
    for (const [k, v] of Object.entries(changes)) this._local[`room:${entryId}:${k}`] = v;
    this._pendingRoom = this._pendingRoom || {};
    this._pendingRoom[entryId] = { ...(this._pendingRoom[entryId] || {}), ...changes };
    clearTimeout(this._timers["room:" + entryId]);
    this._timers["room:" + entryId] = setTimeout(() => this._flushRoom(entryId), delay);
    this._sig = null; this._render();
  }
  async _flushRoom(entryId) {
    const changes = (this._pendingRoom || {})[entryId];
    delete this._pendingRoom[entryId];
    if (!changes) return;
    try {
      await this._hass.callWS({ type: "raumklima/room/update", entry_id: entryId, changes });
      this._flash("Gespeichert – Raum übernimmt die Werte");
    } catch (e) { this._flash(t("Fehler: {e}", { e: e.message || e })); }
    await this._load();
    if (this._sched) delete this._sched[entryId];
    for (const k of Object.keys(changes)) delete this._local[`room:${entryId}:${k}`];
  }
  // Bekannte Dashboards: die Zentrale ist maßgeblich, hass.dashboards nur Ersatz.
  _dashKnown() {
    const list = (this._cfg && this._cfg.dashboards) || [];
    if (list.length) return Object.fromEntries(list.map((p) => [p, 1]));
    return this._hass.dashboards || {};
  }

  // Für eine neue Wohnung gleich ein Dashboard mit der Raumklima-Strategie anlegen
  async _ensureDashboard(path, name, entryId) {
    const p = String(path || "").replace(/^\//, "");
    const cur = String((this._hass && this._hass.panelUrl) || "").replace(/^\//, "");
    if (!rkNeedsDashboard(this._dashKnown(), p, cur)) return null;
    try {
      await this._hass.callWS({
        type: "lovelace/dashboards/create",
        url_path: p,
        title: name,
        icon: "mdi:home-thermometer",
        show_in_sidebar: true,
        require_admin: false,
      });
      await this._hass.callWS({
        type: "lovelace/config/save",
        url_path: p,
        config: { strategy: { type: "custom:raumklima", home: entryId } },
      });
      if (this._hass.dashboards) {
        this._hass.dashboards[p] = this._hass.dashboards[p] || { title: name, mode: "storage", show_in_sidebar: true };
      }
      if (this._cfg && Array.isArray(this._cfg.dashboards) && !this._cfg.dashboards.includes(p)) {
        this._cfg.dashboards.push(p);
      }
      return p;
    } catch (e) {
      // Wohnung ist trotzdem angelegt – Dashboard lässt sich jederzeit von Hand erstellen
      return null;
    }
  }
  // Debug-Spur zum Server: auf dem iPad gibt es keine Konsole, deshalb meldet die Karte
  // ihre Schritte selbst. Fehler dürfen die Bedienung nie stören.
  _trace(event, data = {}) {
    try {
      this._hass
        .callWS({
          type: "raumklima/trace",
          event,
          data: { ...data, version: RK_VERSION, ua: String(navigator.userAgent || "").slice(0, 120) },
        })
        .catch(() => {});
    } catch (e) { /* ignorieren */ }
  }

  _flash(text) {
    this._toast = t(text);
    clearTimeout(this._timers.toast);
    this._timers.toast = setTimeout(() => { this._toast = null; this._sig = null; this._render(); }, 2500);
    this._sig = null; this._render();
  }
  get _admin() { return !this._cfg || this._cfg.admin !== false; }

  // ---------------------------------------------------------------- Bausteine
  _st(id) { return id ? this._hass.states[id] : undefined; }
  _name(id) { const s = this._st(id); return (s && s.attributes.friendly_name) || id || "–"; }
  _row(label, value, sub) {
    const help = HELP[label];
    this._helpOpen = this._helpOpen || new Set();
    const open = help && this._helpOpen.has(label);
    const q = help ? `<button class="qm ${open ? "on" : ""}" data-help="${esc(label)}" title="${t("Erklärung")}" aria-label="${t("Erklärung")}" aria-expanded="${open}">?</button>` : "";
    const box = open ? `<div class="helpbox">${esc(help[{ de: 0, en: 1, fr: 2 }[getLang()] ?? 1])}</div>` : "";
    return `<div class="row"><div class="l"><span class="lbl">${t(label)}${q}</span>${sub ? `<small>${t(sub)}</small>` : ""}</div>${value}</div>${box}`;
  }
  _v(text, mute) { return `<span class="v ${mute ? "mute" : ""}">${t(String(text))}</span>`; }
  _grp(g, title, icon, tone, rows, cls = "", extra = "") {
    // Kurze Zeilen (nur Schalter/Segmente, gerade Anzahl) dürfen sich auf breiten Karten paaren.
    const rowCount = (rows.match(/class="row"/g) || []).length;
    const ctlCount = (rows.match(/class="tgl/g) || []).length + (rows.match(/class="segs"/g) || []).length;
    const pairable = rowCount >= 4 && rowCount % 2 === 0 && ctlCount >= rowCount
      && !/tblwrap|class="people"|roomrow|whyrow|mailprov|stepper|numedit|<details/.test(rows);
    return `<div class="grp ${cls}${pairable ? " pair" : ""}" data-g="${g}" style="--g:${toneVar(tone)}"><div class="gh"><div class="ic"><ha-icon icon="${icon}"></ha-icon></div><b>${t(title)}</b>${extra}</div><div class="rws">${rows}</div></div>`;
  }
  // Wert weicht vom Standard ab? (dann klappt der Aufklapper von selbst auf)
  _changed(scope, keys) {
    const hub = scope === "hub";
    const cfg = this._cfg || {};
    const defs = hub ? (cfg.hub && cfg.hub.defaults) : cfg.room_defaults;
    return (keys || []).some((k) => {
      const v = hub ? this._hubOpt(k) : this._roomOpt(scope, k);
      if (v === undefined || v === null || v === "") return false;
      const d = defs && k in defs ? defs[k] : RK_IMPLICIT[k];
      if (d === undefined) {
        if (!defs) return false; // altes Backend ohne Standardwerte: nichts raten
        return Array.isArray(v) ? v.length > 0 : typeof v === "object" ? Object.keys(v).length > 0 : !!v;
      }
      return JSON.stringify(v) !== JSON.stringify(d);
    });
  }
  // Selten gebrauchte Zeilen einklappen. Offen, wenn Profi-Ansicht an ist, der Nutzer es geöffnet hat
  // oder ein Wert darin vom Standard abweicht – nichts Geändertes bleibt versteckt.
  _more(id, title, rows, scope, keys = []) {
    if (!rows || !/class="row"|class="addrow"/.test(rows)) return rows || "";
    const key = `${id}:${scope === "hub" ? "hub" : this._tab}`;
    const n = (rows.match(/class="row"/g) || []).length;
    const changed = this._changed(scope, keys);
    const user = this._moreOpen ? this._moreOpen.get(key) : undefined;
    const open = this._pro || (user !== undefined ? user : changed);
    return `<details class="adv more" data-more="${key}" data-open="${open ? 1 : 0}"${open ? " open" : ""}><summary>${t(title)}<span class="cnt">${n}</span>${changed ? `<span class="chg" title="${t("vom Standard abweichend")}"></span>` : ""}</summary>${rows}</details>`;
  }
  _stepper(attrs, value, unit, dec) {
    const ro = !this._admin;
    return `<div class="stepper ${ro ? "ro" : ""}"><button ${attrs} data-d="-1" aria-label="${t("weniger")}">−</button><span>${value == null || isNaN(value) ? "–" : fmt(value, dec)}${unit}</span><button ${attrs} data-d="1" aria-label="${t("mehr")}">+</button></div>`;
  }
  // Stepper für Zahl-Entitäten (number.*)
  _numStepper(id, unit, dec = 0) {
    const s = this._st(id);
    if (!s) return `<span class="v mute">–</span>`;
    return this._stepper(`data-num="${id}"`, parseFloat(s.state), unit, dec);
  }
  // Stepper für Optionen (Zentrale oder Raum)
  // Zahl-Einstellung: Einheit, Schrittweite und Grenzen stehen einmal in fields.js (RK_NUM)
  _num(scope, key, value) {
    const f = RK_NUM[key];
    if (!f) throw new Error(`RK_NUM: „${key}" fehlt in fields.js`);
    return this._optStepper(scope, key, value, f.unit, f.step, f.min, f.max, f.dec);
  }
  _optStepper(scope, key, value, unit, step, min, max, dec = 0) {
    return this._stepper(`data-opt="${scope}" data-key="${key}" data-step="${step}" data-min="${min}" data-max="${max}" data-val="${value ?? ""}"`, value, unit, dec);
  }
  _toggle(id, on) {
    const s = this._st(id);
    if (!s && on === undefined) return `<span class="v mute">–</span>`;
    const isOn = on !== undefined ? on : s.state === "on";
    return `<button class="tgl ${isOn ? "on" : ""}" ${id ? `data-tgl="${id}"` : ""} ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`;
  }
  _optToggle(scope, key, on) {
    return `<button class="tgl ${on ? "on" : ""}" data-optbool="${scope}" data-key="${key}" data-val="${on ? 1 : 0}" ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`;
  }
  _segs(scope, key, options, current) {
    return `<div class="segs">${Object.entries(options).map(([v, l]) => `<button class="${v === current ? "on" : ""}" data-seg="${scope}" data-key="${key}" data-val="${v}" ${this._admin ? "" : "disabled"}>${l}</button>`).join("")}</div>`;
  }
  _select(scope, key, items, current, empty) {
    return `<select class="sel" data-sel="${scope}" data-key="${key}" ${this._admin ? "" : "disabled"}>${empty !== undefined ? `<option value="">${t(empty)}</option>` : ""}${items.map((it) => `<option value="${esc(it.id)}" ${it.id === current ? "selected" : ""}>${esc(it.name)}</option>`).join("")}</select>`;
  }

  // ---------------------------------------------------------------- Lernen & Warum
  // ---------------------------------------------------------------- Rendern
  _render() {
    if (!this._hass || !this._rooms) return;
    if (this._pro === undefined) {
      try { this._pro = localStorage.getItem("raumklima-settings-pro") === "1"; } catch (e) { this._pro = false; }
    }
    this._moreOpen = this._moreOpen || new Map();
    this._schedOpen = this._schedOpen || new Map();
    if (this._renderSoon()) return;
    const rooms = this._orderedRooms();
    if (this._tab !== "general" && !rooms.find((r) => r.id === this._tab)) this._tab = "general";
    const tabs = `<button class="tab ${this._tab === "general" ? "on" : ""}" data-tab="general"><ha-icon icon="mdi:home-cog-outline"></ha-icon>${t("Allgemein")}</button>` +
      rooms.map((r) => {
        const sick = ((this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues) || []).some((i) => i.entry_id === (r.attrs.settings || {}).entry_id && i.severity !== "info");
        return `<button class="tab ${this._tab === r.id ? "on" : ""}" data-tab="${r.id}" style="--c:${r.color}"><span class="dot"></span>${r.name}${sick ? ` <ha-icon icon="mdi:alert-circle" style="color:var(--rk-warn)"></ha-icon>` : ""}</button>`;
      }).join("");
    const room = rooms.find((r) => r.id === this._tab);
    const body = room ? this._room(room) : this._general();
    const homes = (this._cfg && this._cfg.homes) || [];
    const me = homes.find((h) => h.entry_id === this._homeId());
    this._ctxHome = me ? me.name : (this._config && this._config.home) || t("Wohnung");
    const homeBar = homes.length > 1 && !this._config.home ? `<div class="tabs homes">${homes.map((h) => `<button class="tab ${h.entry_id === this._homeId() ? "on" : ""}" data-home="${h.entry_id}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</button>`).join("")}</div>` : "";
    rkPaint(this, `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}</style>
      <ha-card class="settings" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:tune-variant"></ha-icon>${esc(this._config.title || t("Einstellungen"))}</div><a class="btn" href="${rkManualUrl()}" target="_blank" rel="noopener" style="--c:var(--rk-heat)" title="${t("Anleitung, Funktionen und häufige Fragen")}"><ha-icon icon="mdi:book-open-variant"></ha-icon>${t("Handbuch (PDF)")}</a><button class="btn" data-diag style="--c:var(--rk-eco)" title="${t("Alle Werte, Entitäten und die letzten Log-Zeilen als Datei")}"><ha-icon icon="mdi:file-download-outline"></ha-icon>${t("Diagnose")}</button>
          <button class="btn" data-backup style="--c:var(--rk-eco)" title="${t("Alle Einstellungen als Datei sichern – ohne Passwörter")}"><ha-icon icon="mdi:content-save-outline"></ha-icon>${t("Sichern")}</button>
          ${this._admin ? `<button class="btn" data-restore style="--c:var(--rk-eco)" title="${t("Sicherung einspielen – Räume werden über ihren Namen zugeordnet")}"><ha-icon icon="mdi:content-save-arrow-left-outline"></ha-icon>${t("Wiederherstellen")}</button><input type="file" id="rkrestore" accept="application/json,.json" style="display:none">` : ""}<button class="btn" data-bug style="--c:var(--rk-warn)" title="${t("Öffnet ein neues GitHub-Issue mit Version, Home-Assistant-Version und Thermostat-Modell – ohne Raumnamen oder Entitäten")}"><ha-icon icon="mdi:bug-outline"></ha-icon>${t("Fehler melden")}</button><button class="btn ${this._pro ? "on" : ""}" data-pro aria-pressed="${this._pro ? "true" : "false"}" style="--c:var(--rk-eco)" title="${t("Alle selten gebrauchten Einstellungen dauerhaft aufklappen")}"><ha-icon icon="${this._pro ? "mdi:unfold-less-horizontal" : "mdi:unfold-more-horizontal"}"></ha-icon>${t("Profi-Ansicht")}</button>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
        ${homeBar}
        <div class="tabs">${tabs}</div>
        <div class="crumb" id="rkc"></div>
        ${room ? `<div class="resetbar">${(() => {
          const n = (((room.attrs.settings || {}).changed) || []).length;
          return n
            ? `<span>${t("{n} Einstellungen vom Standard abweichend", { n: n })}</span><button class="btn small" data-resetroom="${room.id}"><ha-icon icon="mdi:backup-restore"></ha-icon>${t("Auf Standard zurücksetzen")}</button>`
            : `<span>${t("Alles auf Standard")}</span>`;
        })()}</div>` : ""}
        <div class="searchrow"><input id="rks" type="search" placeholder="${t("Einstellung suchen …")}" autocomplete="off" value="${esc(this._search || "")}"></div>
        <div class="rail">${RK_GROUP_ORDER.map((g) => `<button class="railbtn" data-g="${g}"><ha-icon icon="${RK_GROUP_META[g].icon}"></ha-icon>${t(RK_GROUP_META[g].label)}</button>`).join("")}</div>
        <div class="nosearch" style="display:none">${t("Kein Treffer – anderen Begriff versuchen")}</div>
        ${body}
        ${this._sheetHtml()}
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
        ${this._timePop()}
      </ha-card>`);
    this._bind();
    this._reopenTime();
    this._filter();
    this._decFetch();
  }

  // Gruppenleiste + Suche: blendet Gruppen im bereits gezeichneten Inhalt aus.
  _filter() {
    const root = this.shadowRoot;
    if (!root) return;
    const q = String(this._search || "").toLowerCase().trim();
    const secs = [...root.querySelectorAll(".grp")];
    const present = new Set();
    let active = null;
    let shown = 0;
    for (const g of RK_GROUP_ORDER) {
      if (secs.some((el) => (el.dataset.g || "advanced") === g)) { active = g; break; }
    }
    if (this._group && secs.some((el) => (el.dataset.g || "advanced") === this._group)) active = this._group;
    secs.forEach((el) => {
      const g = el.dataset.g || "advanced";
      present.add(g);
      const hit = !q || el.textContent.toLowerCase().includes(q);
      const vis = q ? hit : g === active;
      el.style.display = vis ? "" : "none";
      if (vis) shown += 1;
    });
    // Suche klappt Aufklapper mit Treffer auf; ohne Suche gilt wieder der gemerkte Zustand.
    root.querySelectorAll("details.more").forEach((d) => {
      d.open = q ? d.textContent.toLowerCase().includes(q) : d.dataset.open === "1";
    });
    // Ist nur eine Gruppe sichtbar, soll sie die volle Breite nutzen (sonst klafft rechts eine Lücke).
    const visible = secs.filter((el) => el.style.display !== "none");
    secs.forEach((el) => el.classList.toggle("solo", visible.length === 1 && el.style.display !== "none"));
    root.querySelector(".groups")?.classList.toggle("solo", visible.length === 1);
    // Leiste nur für Gruppen zeigen, die es in diesem Bereich wirklich gibt
    // (sonst führt „Lernen" ins Nichts, solange der Reiter noch fehlt).
    root.querySelectorAll(".railbtn").forEach((b) => {
      if (!root.querySelector(`.grp[data-g="${b.dataset.g}"]`)) b.remove();
    });
    root.querySelectorAll(".railbtn").forEach((b) => {
      const g = b.dataset.g;
      b.classList.toggle("empty", !present.has(g));
      b.classList.toggle("on", !q && g === active);
    });
    const nos = root.querySelector(".nosearch");
    if (nos) nos.style.display = q && !shown ? "" : "none";
    const crumb = root.querySelector("#rkc");
    if (crumb) {
      const room = (this._rooms || []).find((r) => r.id === this._tab);
      const parts = [this._ctxHome || t("Wohnung"), room ? room.name : t("Allgemein"), t(RK_GROUP_META[active || "home"].label)];
      crumb.innerHTML = parts.map((x, i) => (i === parts.length - 1 ? `<b>${esc(x)}</b>` : `${esc(x)} <span>›</span>`)).join(" ");
    }
  }

}

// Methoden aus den Teildateien (settings/*.js) an die Klasse hängen
Object.assign(RaumklimaSettingsCard.prototype, SheetMethods, GeneralMethods, LayoutMethods, ScheduleMethods, RoomMethods, LearnMethods, BindMethods);
