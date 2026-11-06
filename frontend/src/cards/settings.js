import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../shared.js";

// Gruppen (Phase 1): bestehende Gruppen-Überschriften werden auf die neue Leiste abgebildet.
// So bleibt der Inhalt unverändert, während die Navigation klar wird.
const RK_GROUP_OF = {
  "Wohnung": "home",
  "Alle Räume auf einen Blick": "home",
  "Heizsaison & Heizgrenze": "heating",
  "Gesundheit der Heizung": "heating",
  "Anwesenheit & Absenkung": "presence",
  "Schlafenszeiten": "presence",
  "Gebäude & Schimmelschutz": "presence",
  "Wer bekommt was": "notify",
  "Benachrichtigungen allgemein": "notify",
  "Temperatur": "room",
  "Überwachung": "room",
  "Zeitplan": "heating",
  "Thermostat & Fühler": "heating",
  "Gesundheit": "heating",
  "Lüften & Feuchte": "air",
  "Fenster": "air",
  "Lichtsignal": "air",
  "Präsenzmelder": "presence",
  "Benachrichtigungen": "notify",
  "Darstellung": "layout",
  "Lernen & Warum": "learn",
};
const RK_GROUP_META = {
  home: { label: "Wohnung", icon: "mdi:home-outline" },
  room: { label: "Raum", icon: "mdi:door-open" },
  heating: { label: "Heizung", icon: "mdi:radiator" },
  air: { label: "Lüften", icon: "mdi:weather-windy" },
  presence: { label: "Anwesenheit", icon: "mdi:account-multiple-outline" },
  notify: { label: "Benachrichtigungen", icon: "mdi:bell-outline" },
  learn: { label: "Lernen", icon: "mdi:chart-line" },
  layout: { label: "Darstellung", icon: "mdi:view-dashboard-outline" },
  advanced: { label: "Erweitert", icon: "mdi:cog-outline" },
};
const RK_LAYOUT_COLORS = ["#1eb6a6", "#34a86e", "#e8982e", "#e2643c", "#7c6adc", "#3c8cdc", "#c94f8a", "#7a8288"];
const RK_GROUP_ORDER = ["home", "room", "heating", "air", "presence", "notify", "learn", "layout", "advanced"];
import { HELP } from "../help.js";
import { getLang } from "../i18n.js";

// Fassaden für den Sonnenabzug (Azimut) – Reihenfolge wie im Backend
const RK_FACADES = () => [
  { id: "", name: t("egal – nur Vorhersage") },
  { id: "N", name: t("Nord") },
  { id: "NO", name: t("Nordost") },
  { id: "O", name: t("Ost") },
  { id: "SO", name: t("Südost") },
  { id: "S", name: t("Süd") },
  { id: "SW", name: t("Südwest") },
  { id: "W", name: t("West") },
  { id: "NW", name: t("Nordwest") },
];
const rkFacadeName = (v) => (v ? (RK_FACADES().find((f) => f.id === v) || {}).name || v : t("nur Vorhersage"));


export class RaumklimaSettingsCard extends HTMLElement {
  static getConfigForm() {
    return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }] };
  }
  static getStubConfig() { return {}; }
  setConfig(config) {
    this._config = { ...config };
    this._tab = this._tab || "general";
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

  async _repairDashboards() {
    const homes = (this._cfg && this._cfg.homes) || [];
    let made = 0;
    for (const h of homes) {
      if (await this._ensureDashboard(h.dashboard, h.name, h.entry_id)) made++;
    }
    if (made) {
      this._flash(t("{n} Dashboard(s) für deine Wohnungen angelegt", { n: made }));
      this._render();
    }
  }

  // ---------------------------------------------------------------- Speichern
  _openBugReport() {
    // Nur Version, Anzahl Räume und Gerätemodelle – keine Namen, keine Entitäten
    const rooms = this._rooms || [];
    const thermostats = rooms.map((r) => {
      const ent = (this._hass.entities || {})[r.id] || {};
      const dev = (this._hass.devices || {})[ent.device_id] || {};
      return [dev.manufacturer, dev.model].filter(Boolean).join(" ") || ent.platform || "";
    });
    const url = rkBugReportUrl({
      version: RK_VERSION,
      haVersion: this._hass.config && this._hass.config.version,
      language: this._hass.language,
      rooms: rooms.length,
      homeCount: ((this._cfg && this._cfg.homes) || []).length,
      thermostats,
    });
    // `window.open` wird in der Home-Assistant-App (Webview) oft verworfen – dann passiert
    // scheinbar nichts. Ein Klick auf einen echten Anker funktioniert dort zuverlässiger.
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Rückmeldung geben: entweder „kopiert" oder der Link als Notnagel
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
        this._flash(t("Fehler melden: Issue-Vorlage geöffnet – Link liegt in der Zwischenablage"));
        return;
      }
    } catch (e) { /* Zwischenablage nicht erlaubt */ }
    this._flash(t("Fehler melden: Link zum Issue – bitte im Browser öffnen: {url}", { url }));
  }

  async _backupExport() {
    try {
      this._flash(t("Sicherung wird erstellt …"));
      const res = await this._hass.callWS({ type: "raumklima/backup/export", ...this._homeMsg() });
      const text = JSON.stringify(res.backup, null, 2);
      const stamp = new Date().toISOString().slice(0, 10);
      const name = `raumklima-einstellungen-${stamp}.json`;
      // 1. Echter Speichern-Dialog (Chrome/Edge am Rechner) – dort sieht man, wo die Datei landet
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: name,
            types: [{ description: "Raumklima-Sicherung", accept: { "application/json": [".json"] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(new Blob([text], { type: "application/json" }));
          await writable.close();
          this._flash(t("Sicherung gespeichert: {name}", { name }));
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return; // selbst abgebrochen
          // sonst weiter mit dem klassischen Download
        }
      }
      // 2. Klassischer Download
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      // 3. Zusätzlich in die Zwischenablage – falls der Browser Downloads blockt (App/Webview)
      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch (e) { copied = false; }
      this._flash(copied
        ? t("Sicherung gespeichert: {name} · liegt zusätzlich in der Zwischenablage", { name })
        : t("Sicherung gespeichert: {name} – falls keine Datei kam, blockt der Browser den Download", { name }));
    } catch (err) {
      this._flash(t("Sicherung fehlgeschlagen: {e}", { e: err.message || err }));
    }
  }

  async _backupImport(file) {
    try {
      this._flash(t("Sicherung wird geprüft …"));
      const text = await file.text();
      const backup = JSON.parse(text);
      if (!confirm(t("Einstellungen aus dieser Datei einspielen? Die aktuellen Einstellungen werden überschrieben."))) return;
      const res = await this._hass.callWS({ type: "raumklima/backup/import", backup, ...this._homeMsg() });
      const missing = (res.skipped || []).length;
      this._flash(missing
        ? t("Eingespielt: {n} Räume · {m} nicht gefunden", { n: (res.rooms || []).length, m: missing })
        : t("Eingespielt: {n} Räume", { n: (res.rooms || []).length }));
      this._cfg = await this._hass.callWS({ type: "raumklima/config", ...this._homeMsg() });
      this._render();
    } catch (err) {
      this._flash(t("Sicherung fehlgeschlagen: {e}", { e: err.message || err }));
    }
  }

  async _downloadDiagnostics() {
    try {
      this._flash(t("Diagnose wird erstellt …"));
      const data = await this._hass.callWS({ type: "raumklima/diagnostics", ...this._homeMsg() });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      const home = String(data.home_name || "wohnung").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const a = document.createElement("a");
      a.href = url;
      a.download = `raumklima-diagnose-${home}-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      this._flash(t("Diagnose heruntergeladen"));
    } catch (e) {
      this._flash(t("Fehler: {e}", { e: e.message || e }));
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
  _grp(title, icon, tone, rows, cls = "", extra = "") {
    const g = RK_GROUP_OF[title] || "advanced";
    // Kurze Zeilen (nur Schalter/Segmente, gerade Anzahl) dürfen sich auf breiten Karten paaren.
    const rowCount = (rows.match(/class="row"/g) || []).length;
    const ctlCount = (rows.match(/class="tgl/g) || []).length + (rows.match(/class="segs"/g) || []).length;
    const pairable = rowCount >= 4 && rowCount % 2 === 0 && ctlCount >= rowCount
      && !/tblwrap|class="people"|roomrow|whyrow|mailprov|stepper|numedit/.test(rows);
    return `<div class="grp ${cls}${pairable ? " pair" : ""}" data-g="${g}" style="--g:${toneVar(tone)}"><div class="gh"><div class="ic"><ha-icon icon="${icon}"></ha-icon></div><b>${t(title)}</b>${extra}</div><div class="rws">${rows}</div></div>`;
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

  // ---------------------------------------------------------------- Allgemein
  _general() {
    if (this._err) return `<div class="hint">${t("Einstellungen konnten nicht geladen werden: {e}", { e: esc(this._err) })}</div>`;
    if (!this._cfg) return `<div class="hint">${t("Lade Einstellungen …")}</div>`;
    if (!this._cfg.hub) return `<div class="hint">${t("„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.")}</div>`;
    const ch = this._cfg.choices || {};
    const st = this._cfg.hub.state || {};
    const hubIds = rkHub(this._hass);
    const pres = PRESENCE[st.stage] || PRESENCE.home;
    const seas = SEASON[st.decision] || SEASON.heating;
    const residents = this._hubOpt("residents") || [];
    const persons = st.persons || {};
    const H = "hub";

    // --- Anwesenheit
    const personChips = (ch.persons || []).map((p) => {
      const on = residents.includes(p.id);
      const info = persons[p.id];
      const where = info ? (info.present ? t("da") : info.distance_km != null ? `${fmt(info.distance_km, info.distance_km < 10 ? 1 : 0)} km` : t("unbekannt")) : "";
      return `<button class="chip2 ${on ? "" : "off"}" data-person="${p.id}" style="--c:${on ? (info && info.present ? "var(--rk-ok)" : "var(--rk-eco)") : "var(--rk-off)"}" ${this._admin ? "" : "disabled"}><i></i>${esc(p.name)}${on && where ? ` · ${where}` : ""}</button>`;
    }).join("");
    const presRows = [
      `<div class="status"><span class="chip" style="--tone:${toneVar(pres.tone)}"><ha-icon icon="${pres.icon}"></ha-icon>${pres.label}${st.stage === "preheat" && st.preheat_by ? ` · ${esc(st.preheat_by)}` : ""}</span>${st.presence_configured || this._hubOpt("presence_off") ? "" : `<span class="chip" style="--tone:var(--rk-warn)"><ha-icon icon="mdi:information-outline"></ha-icon>${t("Bewohner und Zone wählen, dann ist es aktiv")}</span>`}</div>`,
      this._row("Anwesenheit aus", this._optToggle(H, "presence_off", !!this._hubOpt("presence_off")),
        "keine Auswertung: nichts wird nach Anwesenheit abgesenkt, nichts vorgeheizt, keine Weg-Meldungen – gedacht, wenn keine Ortung möglich ist"),
      this._row("Wer wohnt hier?", `<div class="chips">${personChips || this._v("keine Personen in HA", true)}</div>`, "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist."),
      this._row("Wohnung (Zone)", this._select(H, "zone", ch.zones || [], this._hubOpt("zone"), "– wählen –")),
      this._row("Absenken nach", this._optStepper(H, "away_delay", this._hubOpt("away_delay"), " min", 5, 0, 240), "damit kurze Wege nichts auslösen"),
      this._row("„Länger weg“ ab", this._optStepper(H, "long_away_hours", this._hubOpt("long_away_hours"), " h", 1, 2, 168)),
      this._row("Vorheizen ab", this._optStepper(H, "preheat_km", this._hubOpt("preheat_km"), " km", 1, 0, 200), "wenn sich jemand nähert"),
      this._row("Präsenzmelder zählen", this._segs(H, "home_sensors", RK_HOMESENS, this._hubOpt("home_sensors") || "mmwave"),
        (st.sensed && st.sensed.length) ? t("gerade jemand in: {r}", { r: esc(st.sensed.join(", ")) }) : "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie"),
      this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
      this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind"),
      this._row(
        "Gäste gelten für",
        `<div class="chips">${(this._rooms || [])
          .map((r) => {
            // Kennung ist die Raum-Entry-ID (danach fragt die Zentrale), Name der Anzeigename
            const rid = ((r.attrs && r.attrs.settings) || {}).entry_id || r.id;
            const chosen = (this._hubOpt("guests_rooms") || []).includes(rid);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-guestroom="${rid}" title="${esc(r.name)}"><i></i>${esc(r.name)}</button>`;
          })
          .join("")}</div>`,
        (this._hubOpt("guests_rooms") || []).length ? t("nur diese Räume werden nicht abgesenkt") : t("keine Auswahl = alle Räume der Wohnung")
      ),
      this._row("Kalender", this._select(H, "calendar_entity", ch.calendars || [], this._hubOpt("calendar_entity"), "– keiner –"),
        st.calendar && st.calendar.mode ? t("gerade: „{s}“", { s: esc(st.calendar.summary || "") }) : "Termine mit diesen Wörtern steuern die Anwesenheit"),
      this._hubOpt("calendar_entity") ? this._row("… wie Urlaub", `<input class="inp" data-hubtext="calendar_away_words" value="${esc(this._hubOpt("calendar_away_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist") : "",
      this._hubOpt("calendar_entity") ? this._row("… jemand bleibt zu Hause", `<input class="inp" data-hubtext="calendar_home_words" value="${esc(this._hubOpt("calendar_home_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; dann wird nicht abgesenkt") : "",
    ].join("");

    // --- Heizsaison
    const mode = this._hubOpt("season_mode");
    const mdToInput = (v) => (v && /^\d{2}-\d{2}$/.test(v) ? `2000-${v}` : "");
    const seasRows = [
      `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
      this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
      this._row("Heizgrenze", this._optStepper(H, "heating_limit", this._hubOpt("heating_limit"), " °C", 0.5, 5, 25, 1), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
      this._row("Heizsaison", `<span class="v"><input class="inp short" type="date" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" type="date" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Kalender antippen – Tag und Monat zählen, das Jahr ist egal"),
      this._row("Außentemperatur von", this._select(H, "outdoor_temp_entity", ch.outdoor || [], this._hubOpt("outdoor_temp_entity"), "Wetterdienst"), "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst"),
      this._row("Kälteeinbruch unter", this._optStepper(H, "cold_snap_temp", this._hubOpt("cold_snap_temp"), " °C", 0.5, 0, 20, 1), "3 Tage darunter → heizt auch außerhalb der Saison"),
      this._row("Sicherung", this._optStepper(H, "frost_floor", this._hubOpt("frost_floor"), " °C", 0.5, 5, 20, 1), "fällt ein Raum darunter, heizt er immer"),
      this._row("Frostnacht: weniger absenken", this._optToggle(H, "frost_night", !!this._hubOpt("frost_night")), "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm"),
      this._row("Sommerpflege Ventile", this._optToggle(H, "valve_care", !!this._hubOpt("valve_care")), "mittwochs 11 Uhr kurz öffnen"),
      this._row("Heute heizen", st.heat_today_until
        ? `<button class="btn" data-action="cancel_heat_today" style="--c:var(--rk-heat)"><ha-icon icon="mdi:close"></ha-icon>${t("Beenden")}</button>`
        : `<button class="btn" data-action="heat_today" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><ha-icon icon="mdi:fire"></ha-icon>${t("24 h heizen")}</button>`, "für milde, aber kühle Tage"),
    ].join("");

    // --- Schlafenszeiten
    const sl = st.sleep || {};
    const signals = this._hubOpt("sleep_signals") || [];
    const sigNames = Object.fromEntries((ch.signals || []).map((x) => [x.id, x.name]));
    const sigChips = signals.map((id) => `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${esc(sigNames[id] || this._name(id))}${this._admin ? ` <button class="mini x" data-sigrm="${esc(id)}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
    const sigAvail = (ch.signals || []).filter((x) => !signals.includes(x.id));
    // Gelernte Schlafzeiten als Zeilen mit Chips (statt Tabelle) – gleiche Optik wie alles andere.
    const lrn = (k, label) => {
      const v = sl[k] || {};
      const e = v.effective || {};
      const src = e.source || {};
      const learned = (key) => (src[key] === "learned" ? ` · ${t("gelernt")}` : "");
      const chips = [
        v.bed
          ? `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${t("ins Bett ~{v}", { v: v.bed })}${learned("night_start")}</span>`
          : `<span class="chip2" style="--c:var(--rk-off)"><i></i>${t("{n}/4 Nächte", { n: v.nights_bed || 0 })}</span>`,
        v.wake ? `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${t("auf ~{v}", { v: v.wake })}${learned("wake")}</span>` : "",
        e.quiet_start ? `<span class="chip2"><i></i>${t("Ruhezeit")} ${e.quiet_start}–${e.quiet_end}</span>` : "",
      ].filter(Boolean).join("");
      return this._row(t(label), `<div class="chips">${chips}</div>`, "");
    };

    const sleepRows = [
      `<div class="status"><span class="chip" style="--tone:${sl.quiet_now ? "var(--rk-eco)" : "var(--rk-ok)"}"><ha-icon icon="${sl.quiet_now ? "mdi:sleep" : "mdi:white-balance-sunny"}"></ha-icon>${sl.quiet_now ? t("Ruhezeit gerade aktiv") : t("Keine Ruhezeit")}</span>${sl.asleep ? `<span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon>${t("Licht aus – alle schlafen")}</span>` : ""}</div>`,
      this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
      this._row("Schichtdienst", this._optToggle(H, "learn_shift", !!this._hubOpt("learn_shift")), "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht"),
      this._row("Ruhezeit senkt ab", this._optToggle(H, "quiet_setback", !!this._hubOpt("quiet_setback")), "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist"),
      this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), (sl.tonight && sl.tonight.holiday) ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
      this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
      this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
      lrn("weekday", "Werktags"),
      lrn("weekend", "Wochenende"),
      `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`,
    ].join("");

    // --- Wohnung
    const homes = this._cfg.homes || [];
    const homeRows = [
      this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Ferienwohnung")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
      (() => {
        const dh = homes.find((h) => h.entry_id === this._cfg.hub.entry_id) || {};
        const dp = dh.dashboard || "";
        const fehlt = this._admin && rkNeedsDashboard(this._dashKnown(), dp, String((this._hass && this._hass.panelUrl) || "").replace(/^\//, ""));
        return this._row("Dashboard",
          `<input class="inp" data-hubtext="dashboard" value="${esc(this._hubOpt("dashboard") || "")}" placeholder="${esc(dp || "heizung")}" ${this._admin ? "" : "disabled"}>${
            fehlt ? ` <button class="mini" data-mkdash="${esc(dp)}" title="${t("Dashboard mit der Raumklima-Strategie anlegen")}">${t("anlegen")}</button>` : ` <span class="lt">${t("vorhanden")}</span>`
          }`,
          fehlt
            ? t("Für diese Wohnung gibt es noch kein Dashboard „{d}“ – der Knopf legt es mit der Raumklima-Strategie an (gefiltert auf diese Wohnung).", { d: dp })
            : t("Adresse des Dashboards dieser Wohnung (für den Umschalter)"));
      })(),
      (() => {
        const lat = this._hubOpt("latitude"), lon = this._hubOpt("longitude");
        const hl = this._hass.config || {};
        const haLat = hl.latitude != null ? fmt(hl.latitude, 4) : "–";
        const haLon = hl.longitude != null ? fmt(hl.longitude, 4) : "–";
        const zn = this._hubOpt("zone") || "";
        const zst = zn ? this._st(zn) : null;
        const zlat = zst && zst.attributes ? zst.attributes.latitude : null;
        const zlon = zst && zst.attributes ? zst.attributes.longitude : null;
        const own = lat != null || lon != null;
        return `<details class="adv"${own ? " open" : ""}><summary>${t("Erweitert: Standort der Wohnung")}</summary>${this._row("Standort der Wohnung",
          `<span class="v"><input type="number" class="inp short" step="0.0001" min="-90" max="90" data-hubgeo="latitude" value="${lat ?? ""}" placeholder="${t("Breite")}" ${this._admin ? "" : "disabled"}> <input type="number" class="inp short" step="0.0001" min="-180" max="180" data-hubgeo="longitude" value="${lon ?? ""}" placeholder="${t("Länge")}" ${this._admin ? "" : "disabled"}> ${this._admin ? `<button class="mini" data-geohass title="${t("Werte von Home Assistant übernehmen")}">${t("von HA")}</button>${own ? `<button class="mini x" data-geoclear title="${t("leeren – dann gilt Home Assistant")}">✕</button>` : ""}` : ""}</span>`,
          t("Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.", {
            zone: zn || t("keine Zone gesetzt"),
            zl: zlat != null && zlon != null ? `, ${fmt(zlat, 4)} / ${fmt(zlon, 4)}` : "",
            lat: haLat,
            lon: haLon,
          }),
        )}</details>`;
      })(),
      this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Ferienwohnung")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
      `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`,
    ].join("");

    // --- Gebäude
    const frsi = fmt({ unrenovated: 0.6, renovated: 0.7, new: 0.8 }[this._hubOpt("building_type")] || 0.7, 2);
    const buildRows = [
      this._row("Bauart", this._segs(H, "building_type", RK_BUILDING, this._hubOpt("building_type"))),
      this._row("Heizkosten pro Jahr", `<span class="v"><input type="number" class="inp" min="0" max="20000" step="50" data-hubnum="annual_cost" value="${this._hubOpt("annual_cost") ?? ""}" placeholder="${t("z. B. 1400")}" ${this._admin ? "" : "disabled"} style="width:110px"> €</span>`, "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)"),
      `<div class="hint">${t("Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.", { f: frsi })}</div>`,
    ].join("");

    // --- Empfänger
    const push = this._hubOpt("recipients") || {};
    const tts = this._hubOpt("tts") || {};
    const palette = ["#4f9dff", "#ff7a45", "#2ec4a6", "#a78bfa", "#ffb020"];
    const kinds = this._cfg.kinds || Object.keys(RK_KINDS);
    const card = (target, list, channel, i) => {
      const ks = kinds.filter((k) => k !== "live" || (channel === "push" && target.startsWith("notify.mobile_app_")));
      const chips = ks.map((k) => `<button class="chip2 ${list.includes(k) ? "" : "off"}" data-kind="${k}" data-target="${esc(target)}" data-ch="${channel}" title="${RK_KINDS[k][1]}" ${this._admin ? "" : "disabled"}>${RK_KINDS[k][0]} ${RK_KINDS[k][1]}</button>`).join("");
      return `<div class="row"><div class="l">
        <span class="rn" style="--c:${palette[i % palette.length]}"><i></i>${esc(rkPretty(target))}</span>
        <small>${channel === "tts" ? t("Sprachansage · nie in der Ruhezeit") : t("Push aufs Handy")} · ${esc(target)}</small></div>
        <div class="chips">${chips}${this._admin ? `<button class="mini" data-test="${esc(target)}">${t("Test")}</button><button class="mini x" data-remove="${esc(target)}" data-ch="${channel}" title="${t("entfernen")}">✕</button>` : ""}</div></div>`;
    };
    const cards = [...Object.entries(push).map(([tg, l], i) => card(tg, l || [], "push", i)), ...Object.entries(tts).map(([tg, l], i) => card(tg, l || [], "tts", i + 3))].join("")
      || `<div class="hint">${t("Noch kein Empfänger – unten hinzufügen.")}</div>`;
    const avail = (ch.notify || []).filter((tg) => !(tg in push) && !(tg in tts));
    const addRow = this._admin && avail.length ? `<div class="addrow">
        <select class="sel" id="addTarget">${avail.map((tg) => `<option value="${esc(tg)}">${esc(rkPretty(tg))} (${esc(tg)})</option>`).join("")}</select>
        <button class="btn" data-add="push" style="--c:var(--rk-air)"><ha-icon icon="mdi:cellphone-message"></ha-icon>${t("Als Push hinzufügen")}</button>
        <button class="btn" data-add="tts" style="--c:var(--rk-eco)"><ha-icon icon="mdi:speaker-message"></ha-icon>${t("Als Sprachansage")}</button></div>` : "";

    // --- Allgemein Benachrichtigung
    const hm = (v) => String(v || "").slice(0, 5);
    // Eigene HH:MM-Felder – der Browser würde sonst je nach Betriebssystem AM/PM zeichnen (Issue #7)
    const tf = (key, val) => `<button class="timebtn" data-timeopen="${key}" data-val="${hm(val)}" ${this._admin ? "" : "disabled"}>${hm(val) || "–:–"}</button>`;
    const notiRows = [
      this._row("Nur an anwesende Personen", this._optToggle(H, "notify_present_only", this._hubOpt("notify_present_only") ?? true), t("Lüft-Hinweise nur an Handys von Personen, die laut Ortung zu Hause sind – dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle")),
      this._row(
        "Sturm- und Regenwarnung",
        this._optToggle(H, "storm_warning", this._hubOpt("storm_warning") ?? true),
        t("warnt, wenn Sturm oder Starkregen angekündigt ist und ein Fenster offen steht – kommt auch in der Ruhezeit")
      ),
      this._row(
        "… Böen ab",
        this._optStepper(H, "storm_gust_kmh", this._hubOpt("storm_gust_kmh") ?? 70, " km/h", 10, 30, 200, 0),
        t("ab dieser Böenstärke gilt es als Sturm")
      ),
      this._row(
        "… Regen ab",
        this._optStepper(H, "storm_rain_mm", this._hubOpt("storm_rain_mm") ?? 8, " mm/h", 1, 1, 50, 0),
        t("ab dieser Regenmenge gilt es als Starkregen")
      ),
      this._row("Ruhezeit", `<span class="v">${tf("quiet_start", this._hubOpt("quiet_start"))} – ${tf("quiet_end", this._hubOpt("quiet_end"))}</span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
      this._row("Wochenende bis", `<span class="v">${tf("quiet_end_weekend", this._hubOpt("quiet_end_weekend"))}</span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
      this._row("Nachtlüften", `<span class="v">${tf("night_start", this._hubOpt("night_start"))} – ${tf("night_end", this._hubOpt("night_end"))}</span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
      this._row("… leise warnen unter", this._optStepper(H, "night_alarm_temp", this._hubOpt("night_alarm_temp"), " °C", 0.5, 5, 20, 1), "einmal pro Nacht"),
      this._row("Erinnern alle", this._optStepper(H, "repeat_minutes", this._hubOpt("repeat_minutes"), " min", 1, 1, 60), "solange das Problem besteht"),
      this._row("Wetterquelle", this._select(H, "weather_entity", ch.weather || [], this._hubOpt("weather_entity"), "– wählen –"), st.outdoor_temperature != null ? t("Draußen gerade {v} °C", { v: fmt(st.outdoor_temperature) }) : ""),
      this._row("Fehler auch in der HA-Glocke", this._optToggle(H, "notify_on_failure", !!this._hubOpt("notify_on_failure"))),
      this._row("PDF-Berichte", `<div class="chips">${Object.entries({ week: t("Woche"), month: t("Monat"), season: t("Heizsaison") }).map(([k, l]) => { const on = (this._hubOpt("report_pdf") ?? ["week", "month", "season"]).includes(k); return `<button class="chip2 ${on ? "" : "off"}" data-rpdf="${k}" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><i></i>${l}</button>`; }).join("")}</div>`,
        "automatisch erstellen: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach Saisonende – Push mit Link an alle mit „Wochenbericht“"),
      this._row("PDF per E-Mail", `<button class="tgl ${this._hubOpt("report_email") ? "on" : ""}" data-mailtoggle ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
        this._hubOpt("report_email") ? "die PDF kommt als Anhang an die Empfänger unten" : "darunter einmal „E-Mail einrichten“ – danach kommt jeder Bericht auch per Mail"),
      this._mailSetup(ch.mail || []),
      this._hubOpt("report_email") && this._admin ? this._row("Test", `<button class="btn" data-pdftest style="--c:var(--rk-heat)"><ha-icon icon="mdi:email-fast-outline"></ha-icon>${t("Wochenbericht jetzt senden")}</button>`) : "",
    ].join("");

    // --- Tabelle
    const yes = (b) => (b ? `<span class="ok">● ${t("an")}</span>` : `<span class="no">○ ${t("aus")}</span>`);
    const rowsT = this._rooms.map((r) => {
      const s = r.attrs.settings || {};
      const notif = (this._st(r.sib.notifications) || {}).state === "on";
      const wl = (this._st(r.sib.window_logic) || {}).state === "on";
      const flags = [
        wl ? `<ha-icon icon="mdi:window-open-variant" title="${t("Fensterlogik an")}"></ha-icon>` : "",
        notif ? `<ha-icon icon="mdi:bell-outline" title="${t("Hinweise an")}"></ha-icon>` : "",
        r.attrs.humidity_limit != null ? `<ha-icon icon="mdi:water-percent" title="${fmt(r.attrs.humidity_limit, 0)} %"></ha-icon>` : "",
      ].join("");
      return `<button class="rtile" data-tab="${r.id}" style="--c:${r.color}">
        <span class="rtop"><span class="rname">${r.name}</span><span class="rtyp">${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</span></span>
        <span class="rbig">${fmt(r.attrs.comfort_temperature)}<i>°</i></span>
        <span class="rsub">${t("Absenkung")} ${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C</span>
        <span class="rsub">${t("Lüften ab {v} °C", { v: fmt(r.attrs.min_temp) })}</span>
        <span class="rflags">${flags}</span></button>`;
    }).join("");

    const issues = st.issues || [];
    const bad = issues.filter((i) => i.severity !== "info").length;
    const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
    const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
    return `<div class="groups">
      ${this._grp("Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra)}
      ${this._grp("Erste Schritte", "mdi:check-decagram-outline", "ok", this._checkRows(st, ch), "span")}
      ${this._grp("Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows)}
      ${this._grp("Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows)}
      ${this._grp("Wer bekommt was", "mdi:account-voice", "air", `${cards}${addRow}`, "span")}
      ${this._grp("Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows)}
      ${this._grp("Schlafenszeiten", "mdi:sleep", "eco", sleepRows, "span")}
      ${this._grp("Gebäude & Schimmelschutz", "mdi:home-city-outline", "ok", buildRows)}
      ${this._grp("Wohnung", "mdi:home-switch-outline", "air", homeRows)}
      ${this._grp("Alle Räume auf einen Blick", "mdi:table", "off", `<div class="roomgrid">${rowsT}</div><div class="hint">${t("Tippe auf einen Raum, um seine Einstellungen zu ändern.")}</div>`, "span")}
      ${this._learnHub(st)}
      ${this._layoutGroup()}
    </div>`;
  }

  // ---------------------------------------------------------------- Darstellung (A3)
  _loadLayout() {
    const home = this._homeId();
    rkLayout(this._hass, home)
      .then((L) => {
        if (JSON.stringify(L) === JSON.stringify(this._layout || {})) return;
        this._layout = L;
        this._sig = null;
        this._render();
      })
      .catch(() => {});
  }

  _layoutSave() {
    const home = this._homeId();
    const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
    rkLayoutRemember(L, home);
    this._hass
      .callWS({ type: "raumklima/layout/save", home, layout: L })
      .then(() => {
        rkLayoutChanged(home);
        this._flash(t("Gespeichert"));
      })
      .catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
  }

  _layoutList() {
    const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
    return rkLayoutApply(this._rooms || [], L);
  }

  _layoutGroup() {
    if (!this._layout) {
      return this._grp("Darstellung", "mdi:view-dashboard-outline", "air", this._row("Reihenfolge", this._v("lädt …", true)));
    }
    const L = this._layout;
    const list = this._layoutList();
    const rows = list.map((r, i) => {
      const size = (L.size || {})[r.id] || "big";
      const col = (L.color || {})[r.id] || "";
      const arrow = (dir, glyph, on) =>
        `<button class="mini" data-lmove="${r.id}" data-dir="${dir}" ${on ? "" : "disabled"} aria-label="${dir < 0 ? t("nach oben") : t("nach unten")}">${glyph}</button>`;
      const sizes = [["big", t("große Karte")], ["tile", t("Kachel")], ["off", t("aus")]]
        .map(([k, lab]) => `<button class="chip2 ${size === k ? "" : "off"}" data-lsize="${r.id}" data-v="${k}">${lab}</button>`)
        .join("");
      const dots = RK_LAYOUT_COLORS.map(
        (c) => `<button class="dotbtn ${col === c ? "on" : ""}" style="--c:${c}" data-lcolor="${r.id}" data-v="${c}" aria-label="${c}" title="${c}"></button>`,
      ).join("");
      return `<div class="lrow">
        <div class="ltop"><span class="lname">${arrow(-1, "▲", i > 0)}${arrow(1, "▼", i < list.length - 1)}<b>${esc(r.name)}</b></span><div class="chips">${sizes}</div></div>
        <div class="lbot"><span class="llab">${t("Farbe")}</span><div class="dots">${dots}</div></div>
      </div>`;
    }).join("");
    const foot = `<div class="hint">${t("Reihenfolge gilt im generierten Dashboard und in der Übersicht; Größe „Kachel“ blendet die große Raumseite aus, „aus“ versteckt den Raum ganz. Farbe färbt Rand und Akzente der Karte.")}</div>
      <div class="addrow"><button class="btn" data-lsave style="--c:var(--rk-heat)"><ha-icon icon="mdi:content-save-outline"></ha-icon>${t("Speichern")}</button></div>`;
    return this._grp("Darstellung", "mdi:view-dashboard-outline", "air", rows + foot);
  }

  // ---------------------------------------------------------------- Raum
  // ---------------------------------------------------------------- Zeitpläne
  // Raum-Referenz je Eintrag merken, damit Ereignisse aus dem Zeitplan-Editor immer aus der
  // gespeicherten Konfiguration neu aufsetzen können (Issue #8: sonst überschreibt ein Klick
  // die vorhandenen Zeitfenster mit einer leeren Liste).
  _schedSeed(id) {
    const r = (this._roomRefs || {})[id];
    if (!r) return null;
    const s = r.attrs.settings || {};
    return this._roomOpt(r, "schedules") ?? s.schedules ?? [];
  }
  _schedList(id, stored) {
    this._sched = this._sched || {};
    if (!(id in this._sched)) {
      this._sched[id] = (stored || []).map((w) => ({
        days: [...(w.days || [])],
        start: w.start || "19:00",
        end: w.end || "21:00",
        temperature: Number(w.temperature ?? 22),
      }));
    }
    return this._sched[id];
  }
  _schedLen(id) {
    return (this._sched[id] || []).length;
  }
  /** Minuten seit Mitternacht. */
  _schedStart(w) {
    const [h, m] = String((w && w.start) || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  }
  _schedEnd(w) {
    const [h, m] = String((w && w.end) || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  }
  _pushSched(id) {
    const list = (this._sched[id] || []).map((w) => ({
      days: [...(w.days || [])].sort((a, b) => a - b),
      start: w.start,
      end: w.end,
      temperature: w.temperature,
    }));
    this._setRoom(id, { schedules: list }, 700);
  }
  _schedWin(id, w, i, ro) {
    const days = w.days || [];
    const on = (d) => !days.length || days.includes(d);
    const btn = [0, 1, 2, 3, 4, 5, 6]
      .map((d) => `<button class="d ${on(d) ? "on" : ""}" data-schedday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`)
      .join("");
    return `<div class="sched">
      <div class="days">${btn}</div>
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.start}" data-schedtime="${id}|${i}|start" ${ro ? "disabled" : ""} aria-label="${t("von")}">
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.end}" data-schedtime="${id}|${i}|end" ${ro ? "disabled" : ""} aria-label="${t("bis")}">
      <span class="v temp">${fmt(w.temperature)} °C</span>
      ${ro ? "" : `<div class="stepper"><button data-schedtemp="${id}|${i}" data-d="-1" aria-label="${t("weniger")}">−</button><button data-schedtemp="${id}|${i}" data-d="1" aria-label="${t("mehr")}">+</button></div>
      <div class="stepper mv"><button data-schedmove="${id}|${i}|-1" title="${t("nach oben")}" aria-label="${t("nach oben")}" ${i === 0 ? "disabled" : ""}>▲</button><button data-schedmove="${id}|${i}|1" title="${t("nach unten")}" aria-label="${t("nach unten")}" ${i === this._schedLen(id) - 1 ? "disabled" : ""}>▼</button></div>
      <button class="del" data-scheddel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
  }
  _scheduleGroup(r, id, editable) {
    this._roomRefs = this._roomRefs || {};
    this._roomRefs[id] = r;
    const s = r.attrs.settings || {};
    const scope = `room:${id}`;
    const ro = !editable;
    const boostTemp = this._roomOpt(r, "boost_temperature") ?? s.boost_temperature ?? 2;
    const boostMin = this._roomOpt(r, "boost_minutes") ?? s.boost_minutes ?? 30;
    const list = this._schedList(id, this._roomOpt(r, "schedules") ?? s.schedules ?? []);
    // Zeitplan eines anderen Raums übernehmen (einmal pflegen, mehrere Räume nutzen)
    const fromId = this._roomOpt(r, "schedule_from") ?? s.schedule_from ?? "";
    const others = (this._rooms || [])
      .filter((x) => x.id !== r.id)
      .map((x) => ({ id: ((x.attrs.settings || {}).entry_id) || x.id, name: x.name }));
    const shared = !!fromId && others.some((o) => o.id === fromId);
    const shareRow = this._row(
      "Zeitplan von",
      editable
        ? this._select(scope, "schedule_from", [{ id: "", name: t("eigener Zeitplan") }, ...others], fromId)
        : this._v(shared ? others.find((o) => o.id === fromId).name : t("eigener Zeitplan")),
      shared
        ? t("Die Zeitfenster werden im gewählten Raum gepflegt – Änderungen gelten hier automatisch mit")
        : t("Zeitfenster einmal pflegen und für mehrere Räume nutzen")
    );
    const fallback = this._roomOpt(r, "schedule_fallback") ?? s.schedule_fallback ?? "wish";
    const rows = [
      shareRow,
      this._row(
        "Außerhalb der Zeitfenster",
        editable ? this._segs(scope, "schedule_fallback", RK_SCHED_FALLBACK, fallback) : this._v(RK_SCHED_FALLBACK[fallback] || "–"),
        fallback === "wish"
          ? t("wie bisher: ohne laufendes Fenster gilt die Wunschtemperatur")
          : fallback === "short"
            ? t("zwischen den Fenstern wird auf „kurz weg“ abgesenkt")
            : fallback === "long"
              ? t("zwischen den Fenstern wird auf „länger weg“ abgesenkt – für Räume, die nur stundenweise genutzt werden")
              : t("zwischen den Fenstern gilt nur der Frostschutz – der kälteste erlaubte Wert")
      ),
      this._row(
        "Wärmer für kurze Zeit (Boost)",
        editable ? this._optStepper(scope, "boost_temperature", boostTemp, " K", 0.5, 0.5, 5, 1) : this._v(`${fmt(boostTemp, 1)} K`),
        t("so viel wärmer als die Wunschtemperatur – der Knopf „Wärmer“ am Raum startet ihn")
      ),
      this._row(
        "Zeitplan überschreiben",
        editable ? this._optStepper(scope, "override_minutes", this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120, " min", 15, 0, 480) : this._v(`${this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120} min`),
        t("so lange gilt deine Handverstellung (HA oder Alexa), danach wieder der Zeitplan – 0 schaltet es aus")
      ),
      this._row(
        "Dauer des Boosts",
        editable ? this._optStepper(scope, "boost_minutes", boostMin, " min", 5, 5, 240) : this._v(`${boostMin} min`),
        t("danach gilt wieder Zeitplan bzw. Automatik")
      ),
    ];
    if (!list.length) {
      rows.push(this._row("Zeitfenster", this._v("keine – die Automatik regelt wie gewohnt", true), t("z. B. abends 19–21 Uhr wärmer")));
    } else {
      list.forEach((w, i) => rows.push(this._row(t("Zeitfenster {n}", { n: i + 1 }), this._schedWin(id, w, i, ro), esc(schedDaysLabel(w.days)))));
    }
    if (!ro && list.length && !shared) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div class="addrow"><button class="add" data-schedsort="${id}"><ha-icon icon="mdi:sort-clock-ascending-outline"></ha-icon>${t("nach Uhrzeit sortieren")}</button><span class="hint">${t("Reihenfolge zählt nur, wenn sich Fenster überschneiden – dann gewinnt das untere")}</span></div></div>`);
    }
    if (!ro && list.length < 6 && !shared) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-schedadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
    }
    return this._grp("Zeitplan", "mdi:calendar-clock", "eco", rows.join(""), "span");
  }

  // ---------------------------------------------------------------- Lüften ohne Erinnerung
  _airList(id, stored) {
    this._air = this._air || {};
    if (!(id in this._air)) {
      this._air[id] = (stored || []).map((w) => ({
        days: [...(w.days || [])],
        start: w.start || "04:45",
        end: w.end || "06:30",
      }));
    }
    return this._air[id];
  }
  _pushAir(id) {
    const list = (this._air[id] || []).map((w) => ({ days: [...(w.days || [])].sort((a, b) => a - b), start: w.start, end: w.end }));
    this._setRoom(id, { airing_windows: list }, 700);
  }
  _airWin(id, w, i, ro) {
    const days = w.days || [];
    const on = (d) => !days.length || days.includes(d);
    const btn = [0, 1, 2, 3, 4, 5, 6]
      .map((d) => `<button class="d ${on(d) ? "on" : ""}" data-airday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`)
      .join("");
    return `<div class="sched">
      <div class="days">${btn}</div>
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.start}" data-airtime="${id}|${i}|start" ${ro ? "disabled" : ""} aria-label="${t("von")}">
      <input class="tm inp" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" value="${w.end}" data-airtime="${id}|${i}|end" ${ro ? "disabled" : ""} aria-label="${t("bis")}">
      ${ro ? "" : `<button class="del" data-airdel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
  }
  _airingGroup(r, id, editable) {
    const s = r.attrs.settings || {};
    const scope = `room:${id}`;
    const ro = !editable;
    const airMin = this._roomOpt(r, "airing_min_minutes") ?? s.airing_min_minutes ?? 0;
    const recMin = r.attrs.recommended_minutes ?? 10;
    const longMin = this._roomOpt(r, "long_airing_minutes") ?? s.long_airing_minutes ?? 20;
    const lateMin = this._roomOpt(r, "long_airing_remind") ?? s.long_airing_remind ?? 90;
    const learn = this._roomOpt(r, "learn_airing") ?? s.learn_airing ?? true;
    const learned = Number(s.airing_learned || 0);
    const list = this._airList(id, this._roomOpt(r, "airing_windows") ?? s.airing_windows ?? []);
    const presEff = this._roomOpt(r, "presence_sensors") ?? Object.keys(s.presence_sensors || {});
    const rows = [
      this._row(
        "Mindestdauer Lüften",
        editable
          ? this._optStepper(scope, "airing_min_minutes", airMin, " min", 1, 0, 30)
          : this._v(airMin ? `${airMin} min` : t("automatisch")),
        airMin
          ? t("so lange bleibt „Lüften läuft“ mindestens stehen, auch wenn die Feuchte schon passt")
          : t("automatisch: 60 % der empfohlenen Dauer, mindestens 4 Minuten (gerade {v} min)", { v: recMin })
      ),
      this._row(
        "Dauerlüftung ab",
        editable ? this._optStepper(scope, "long_airing_minutes", longMin, " min", 5, 0, 180) : this._v(`${longMin} min`),
        t("danach keine Erinnerungen mehr, bis das Fenster zu ist – 0 schaltet es aus")
      ),
      this._row(
        "Leise Erinnerung danach",
        editable ? this._optStepper(scope, "long_airing_remind", lateMin, " min", 15, 0, 240) : this._v(`${lateMin} min`),
        t("eine einzige, stille Meldung bei sehr langem Lüften – 0 = aus")
      ),
      ...(presEff.length ? [this._row(
        "Nur wenn jemand im Raum war",
        editable ? this._optToggle(scope, "airing_occupied_only", this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true) : this._v((this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true) ? t("an") : t("aus")),
        t("kein „bitte lüften“ in leeren Räumen – nur mit Präsenzmelder möglich")
      )] : []),
      this._row(
        "Gewohntes Lüften erkennen",
        editable ? this._optToggle(scope, "learn_airing", !!learn) : this._v(learn ? t("an") : t("aus")),
        learned ? t("erkannt: {n}× im gleichen Zeitraster (4 Wochen)", { n: learned }) : t("lernt, wann du regelmäßig länger lüftest – dort dann keine Erinnerungen")
      ),
    ];
    if (!list.length) {
      rows.push(this._row("Lüftfenster", this._v("keine – es wird normal erinnert", true), t("z. B. Training morgens: in dieser Zeit keine Hinweise")));
    } else {
      list.forEach((w, i) => rows.push(this._row(t("Lüftfenster {n}", { n: i + 1 }), this._airWin(id, w, i, ro), esc(schedDaysLabel(w.days)))));
    }
    if (!ro && list.length < 6) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-airadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
    }
    return this._grp("Lüften ohne Erinnerung", "mdi:weather-windy-variant", "air", rows.join(""), "span");
  }

  _room(r) {
    const a = r.attrs, s = a.settings || {}, sib = r.sib;
    const cfgRoom = this._cfgRoom(r);
    const id = s.entry_id;
    const scope = `room:${id}`;
    const sync = RK_SYNC[a.sync] || ["–", "off"];
    const contacts = (a.window_entities || []).map((w) => { const st = this._st(w); const open = !!(st && rkWindowOpen(this._hass, w)); return `<span class="chip2" style="--c:${open ? "var(--rk-air)" : "var(--rk-off)"}"><i></i>${esc(this._name(w).replace(/^.*?(fenster|window)/i, (m, x) => x))} · ${open ? t("offen") : t("zu")}</span>`; }).join("") || `<span class="v mute">${t("keine")}</span>`;
    const offTxt = a.offset !== undefined && a.offset !== null ? t("aktuell {v} °C", { v: (a.offset > 0 ? "+" : "") + fmt(a.offset, 1) }) : "";
    const comfort = this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature;
    const roomType = this._roomOpt(r, "room_type") ?? s.room_type;
    const sbShort = this._roomOpt(r, "setback_short") ?? s.setback_short;
    const sbLong = this._roomOpt(r, "setback_long") ?? s.setback_long;
    const wOpen = this._roomOpt(r, "window_open_delay") ?? s.window_open_delay;
    const wClose = this._roomOpt(r, "window_close_delay") ?? s.window_close_delay;
    const nightMode = this._roomOpt(r, "night_airing") ?? s.night_airing ?? "auto";
    const moldMode = this._roomOpt(r, "mold_mode") ?? s.mold_mode ?? "strict";
        const virtMode = this._roomOpt(r, "virtual_window") ?? s.virtual_window ?? "auto";
    const editable = this._admin && cfgRoom;
    const push = Object.keys((this._cfg && this._cfg.hub && this._cfg.hub.options.recipients) || {});
    const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : null;
    const rIssues = ((this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues) || []).filter((i) => i.entry_id === id);
    return `<div class="groups">
      ${rIssues.length ? this._grp("Gesundheit", "mdi:heart-pulse", rIssues.some((i) => i.severity === "alert") ? "cold" : "warn", rkIssueList(rIssues, false), "span") : ""}
      ${a.monitor ? this._grp("Überwachung", "mdi:eye-outline", "eco", [
        this._row("Kein Thermostat", this._v("nur Messen und Hinweise", true), "Temperatur, Feuchte, CO₂ und Lüftungshinweise – ohne Heizungsregelung. Ein Thermostat lässt sich später in der Integration nachtragen."),
      ].join(""), "span") : ""}
      ${a.monitor ? "" : this._grp("Temperatur", "mdi:thermometer", "heat", [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row("Wunschtemperatur", editable ? this._optStepper(scope, "comfort_temperature", comfort, " °C", 0.5, 12, 26, 1) : this._v(`${fmt(comfort)} °C`), "beim Einschalten und als Grundwert"),
        this._row("Raumtyp", editable ? this._select(scope, "room_type", Object.entries(RK_ROOM_TYPES).map(([k, v]) => ({ id: k, name: v })), roomType) : this._v(RK_ROOM_TYPES[roomType] || "–"),
          t("jederzeit änderbar – Standardwerte des neuen Typs werden übernommen, eigene Werte bleiben")),
        this._row(
          "Bauart",
          editable
            ? this._select(scope, "wall", Object.entries(RK_WALL).map(([k, v]) => ({ id: k, name: v })), this._roomOpt(r, "wall") ?? "auto")
            : this._v(RK_WALL[this._roomOpt(r, "wall") ?? "auto"]),
          t("bestimmt, wie kalt die kälteste Wandstelle wird: eine Außenecke braucht mehr Schutz als eine Innenwand"),
        ),
        ((this._cfg && this._cfg.homes) || []).length > 1 ? this._row("Wohnung", editable ? this._select(scope, "home", this._cfg.homes.map((h) => ({ id: h.entry_id, name: h.name })), a.home || "") : this._v(esc(a.home_name || "–")), "Raum gehört zu dieser Wohnung (Bewohner, Zone, Empfänger)") : "",
        this._row("Sonnenseite", editable ? this._optToggle(scope, "solar_gain", !!(this._roomOpt(r, "solar_gain") ?? s.solar_gain)) : this._v(s.solar_gain ? "ja" : "nein"),
          a.plan_reason === "solar" ? "gerade: Sonne erwartet – 1 °C weniger" : t("bei Sonne 1 °C weniger heizen – die Sonne wärmt mit")),
        (() => {
          const fac = this._roomOpt(r, "solar_facade") ?? s.solar_facade ?? "";
          return `<details class="adv"${fac ? " open" : ""}><summary>${t("Erweitert: Sonneneintrag")}</summary>${this._row("Sonne kommt aus",
            editable ? this._select(scope, "solar_facade", RK_FACADES(), fac) : this._v(rkFacadeName(fac)),
            t("Richtung, in die die Fenster dieses Raums zeigen – vereinfacht, freie Sicht vorausgesetzt. Haus, Baum, Balkon oder ein tiefes Gewände davor zählt nicht mit; dann lieber leer lassen (nur Vorhersage). Bei zwei Fensterseiten: die mit der größeren Glasfläche."),
          )}</details>`;
        })(),
        this._row("Absenkung „kurz weg“", editable ? this._optStepper(scope, "setback_short", sbShort, " °C", 0.5, 10, 24, 1) : this._v(`${fmt(sbShort)} °C`), "wenn alle weg sind"),
        this._row("Aufheizen", this._v(s.heatup && s.heatup.minutes_2k != null ? t("~{m} min für +2 °C", { m: s.heatup.minutes_2k }) : t("lernt noch ({n}/3)", { n: (s.heatup && s.heatup.episodes) || 0 }), !(s.heatup && s.heatup.minutes_2k != null)),
          s.heatup && s.heatup.rate ? t("{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird", { r: fmt(s.heatup.rate, 1), n: s.heatup.episodes }) : "danach heizt die Wohnung rechtzeitig vor, bevor jemand ankommt"),
        this._row("Absenkung „länger weg“", editable ? this._optStepper(scope, "setback_long", sbLong, " °C", 0.5, 8, 22, 1) : this._v(`${fmt(sbLong)} °C`), "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer"),
      ].join(""))}
      ${this._scheduleGroup(r, id, editable)}
      ${this._grp("Lüften & Feuchte", "mdi:water-percent", "air", [
        sib.humidity_limit ? this._row("Feuchtegrenze", this._numStepper(sib.humidity_limit, " %", 0), "ab hier: „Bitte lüften“") : this._row("Feuchtefühler", this._v("keiner", true)),
        this._row("Mindesttemperatur beim Lüften", this._numStepper(sib.min_temp, " °C", 1), "darunter: „Raum kühlt aus“"),
        this._row("Max. Abkühlung beim Lüften", this._numStepper(sib.max_drop, " °C", 1)),
        this._row("Jetzt", this._v(a.current_humidity != null ? t("{h} % · Taupunkt {d} °C", { h: fmt(a.current_humidity, 0), d: fmt(a.dew_point) }) : "–")),
        this._row("Empfohlene Lüftdauer", this._v(a.recommended_minutes ? `${a.recommended_minutes} min` : "–"), a.outdoor_temperature != null ? t("bei {v} °C draußen", { v: fmt(a.outdoor_temperature) }) : ""),
      ].join(""))}
      ${this._grp("Fenster", "mdi:window-open-variant", "ok", [
        this._row("Heizung bei offenem Fenster pausieren", this._toggle(sib.window_logic)),
        this._row("Pause nach", editable ? this._optStepper(scope, "window_open_delay", wOpen, " s", 5, 0, 600) : this._v(`${wOpen ?? "–"} s`)),
        this._row("Weiter nach", editable ? this._optStepper(scope, "window_close_delay", wClose, " s", 5, 0, 600) : this._v(`${wClose ?? "–"} s`)),
        this._row(
          "Schimmelschutz",
          editable ? this._segs(scope, "mold_mode", RK_MOLD, moldMode) : this._v(RK_MOLD[moldMode] || "–"),
          moldMode === "strict"
            ? t("hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – begrenzt durch den Zuschlag darunter")
            : moldMode === "wish"
              ? t("hebt nur bis zur Wunschtemperatur an – tiefer wird nicht abgesenkt, aber auch nicht darüber geheizt")
              : t("kein Feuchte-Boden: der Raum fährt genau den eingestellten Wert – bei hoher Feuchte droht Schimmel an kalten Wänden"),
        ),
        moldMode !== "off"
          ? this._row(
              "Höchstens anheben um",
              editable
                ? this._optStepper(
                    scope,
                    "mold_cap",
                    this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 2.5,
                    " K",
                    0,
                    6,
                    0.5,
                    1,
                  )
                : this._v(`${fmt(this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 2.5)} K`),
              t("Heizen löst kein Feuchteproblem: über diesem Zuschlag wird nicht weiter geheizt, sondern zum Lüften geraten (nachts 1,5 K)"),
            )
          : "",
        this._row("Schlafen bei offenem Fenster", editable ? this._segs(scope, "night_airing", RK_NIGHT, nightMode) : this._v(RK_NIGHT[nightMode] || "–"),
          nightMode === "auto" ? (["bedroom", "rarely_used"].includes(roomType) ? "Automatisch: ja, weil Schlafraum" : "Automatisch: nein, kein Schlafraum") : "abends geöffnet = Nachtlüften: keine Lüft-Hinweise, Heizung wartet"),
        this._row("Kontakte", `<div class="chips">${contacts}</div>`),
        this._row("Offenes Fenster an Temperatursturz erkennen", editable ? this._segs(scope, "virtual_window", RK_NIGHT, virtMode) : this._v(RK_NIGHT[virtMode] || "–"),
          (a.window_virtual ? t("gerade: Fenster vermutlich offen · ") : "") + t(virtMode === "auto" ? (s.virtual_active ? "Automatisch: aktiv (kein Kontakt erreichbar)" : "Automatisch: aus, der Kontakt meldet zuverlässig") : "fällt es in 6 min um 1 °C, pausiert die Heizung bis es wieder wärmer wird")),
      ].join(""))}
      ${this._airingGroup(r, id, editable)}
      ${this._presenceGroup(r, id, editable)}
      ${this._learnRoom(r)}
      ${this._lightGroup(r, id, editable)}
      ${this._grp("Benachrichtigungen", "mdi:bell-outline", "warn", [
        this._row("Hinweise für diesen Raum", this._toggle(sib.notifications)),
        this._row("Empfänger", push.length ? `<div class="chips">${push.map((tg) => `<span class="chip2"><i></i>${esc(rkPretty(tg))}</span>`).join("")}</div>` : this._v("niemand", true), "zentral unter Allgemein → Wer bekommt was"),
      ].join(""))}
      ${this._grp("Thermostat & Fühler", "mdi:radiator", "off", [
        this._row("Thermostat", this._v(esc(this._name(s.trv))), (s.extra_trvs || []).length ? "Haupt-Thermostat" : ""),
        (s.extra_trvs || []).length ? this._row("Weitere Thermostate", `<div class="chips">${s.extra_trvs.map((x) => `<span class="chip2" style="--c:${!x.available ? "var(--rk-cold)" : x.sync === "ok" ? "var(--rk-ok)" : "var(--rk-warn)"}" title="${esc(x.entity_id)}"><i></i>${esc(x.name)} · ${x.available ? `${fmt(x.temperature)}° → ${fmt(x.setpoint)}°${x.valve != null ? ` · ${fmt(x.valve, 0)} %` : ""}` : t("nicht erreichbar")}</span>`).join("")}</div>`, "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert") : "",
        this._row(
          "Schnellere Abfrage",
          editable ? this._optToggle(scope, "fast_poll", !!(this._roomOpt(r, "fast_poll") ?? s.fast_poll)) : this._v(this._roomOpt(r, "fast_poll") ?? s.fast_poll ? t("an") : t("aus")),
          t("fragt das Thermostat alle 2 Minuten aktiv ab – für träge Geräte (Homematic & Co.), kostet Funk und Batterie")
        ),
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
        this._row("CO₂-Sensor", this._v(s.co2_sensor ? esc(this._name(s.co2_sensor)) : "keiner", !s.co2_sensor), s.co2_sensor ? "ab 1000 ppm: „Bitte lüften“" : ""),
        this._row("Feinstaubfühler", this._v(s.pm25_sensor ? esc(this._name(s.pm25_sensor)) : "keiner", !s.pm25_sensor), s.pm25_sensor ? "PM2,5 – ab 35 µg/m³: „Bitte lüften“" : ""),
        this._row("Kalibrierung", this._v(RK_CAL[s.calibration_mode] || "–"),
        s.calibration_mode === "target"
          ? t("das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat")
          : offTxt),
        this._row("Einschalten mit", this._v(s.on_preset === "auto_detect" || !s.on_preset ? t("Automatisch") : t("Preset „{p}“", { p: esc(s.on_preset) }))),
        this._row("Ausschalten über", this._v(RK_OFF[s.off_method] || s.off_method || "–")),
        this._row("Drehen am Thermostat übernehmen", this._v(s.follow_trv ? t("ja") : t("nein"))),
        this._row("Übertragung", `<span class="v" style="color:${toneVar(sync[1])}">● ${sync[0]}</span>`, t("prüft nach {s} s · bis zu {n} Wiederholungen", { s: s.sync_verify_delay ?? "–", n: s.sync_max_retries ?? "–" })),
      ].join(""), "span cols")}
    </div>
    <div class="foot">
      ${sib.calibrate ? `<button class="btn" data-press="${sib.calibrate}" style="--c:var(--rk-heat)"><ha-icon icon="mdi:tune-vertical"></ha-icon>${t("Jetzt kalibrieren")}</button>` : ""}
      <button class="btn primary" data-nav="/config/integrations/integration/raumklima"><ha-icon icon="mdi:cog"></ha-icon>${t("Geräte & Technik ändern")}</button>
    </div>
    <div class="hint">${t("Werte mit + / − werden nach kurzer Pause gespeichert; der Raum übernimmt sie sofort. Geräte (Thermostat, Fühler, Kontakte) und Technik änderst du unter „Geräte & Technik ändern“ → Zahnrad beim Raum „{r}“.", { r: esc(r.name) })}</div>`;
  }

  _mailSetup(mailServices = []) {
    const o = (k) => this._mailForm && this._mailForm[k] !== undefined ? this._mailForm[k] : (this._hubOpt(k) ?? "");
    const cur = String(this._hubOpt("report_email") || "");
    const viaService = cur.startsWith("notify.");
    const active = cur === "raumklima";
    const ok = active && !!(this._hubOpt("mail_server") && this._hubOpt("mail_to"));
    const open = this._mailOpen ?? (active && !ok);
    const dis = this._admin ? "" : "disabled";
    const sec = o("mail_security") || "starttls";
    const provs = Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<option value="${k}" ${p[0] === o("mail_server") ? "selected" : ""}>${esc(p[3])}</option>`).join("");
    const field = (key, label, type = "text", ph = "", hint = "") => `<label class="mf"><span>${t(label)}${hint ? `<small>${t(hint)}</small>` : ""}</span>
      <input class="inp" data-mail="${key}" type="${type}" value="${type === "password" ? "" : esc(String(o(key)))}" placeholder="${esc(ph)}" autocomplete="${type === "password" ? "new-password" : "off"}" ${dis}></label>`;
    return `<details class="mailbox" ${open ? "open" : ""} data-mailbox>
      <summary><ha-icon icon="mdi:email-outline"></ha-icon>${t("E-Mail einrichten")} ${viaService ? `<span class="ok">● ${t("über {s}", { s: esc(rkPretty(cur)) })}</span>` : ok ? `<span class="ok">● ${t("eingerichtet")}</span>` : `<span class="no">○ ${t("noch nicht eingerichtet")} – ${t("hier antippen")}</span>`}</summary>
      <div class="mailform">
        <label class="mf"><span>${t("Anbieter")}<small>${t("füllt Server, Port und Verschlüsselung aus")}</small></span>
          <div class="segs mailprov">${Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<button class="${p[0] === o("mail_server") ? "on" : ""}" data-mailprov="${k}" ${dis}>${esc(p[3])}</button>`).join("")}<button data-mailprov="other" ${dis}>${t("Anderer Anbieter")}</button></div></label>
        ${field("mail_user", "Benutzer", "email", "name@gmx.de", "meist deine E-Mail-Adresse")}
        ${field("mail_password", "Passwort", "password", this._hubOpt("mail_password_set") ? t("gespeichert – leer lassen zum Behalten") : "", "bei Gmail, iCloud, Outlook: App-Passwort")}
        ${field("mail_to", "Empfänger", "text", "ich@example.de, partner@example.de", "mehrere mit Komma")}
        <details class="adv"><summary>${t("Server-Einstellungen")}</summary>
          ${field("mail_server", "Server", "text", "smtp.example.de")}
          ${field("mail_port", "Port", "number", "587")}
          <label class="mf"><span>${t("Verschlüsselung")}</span><div class="segs">${["starttls", "ssl", "none"].map((v) => `<button class="${v === sec ? "on" : ""}" data-mailsec="${v}" ${dis}>${{ starttls: "STARTTLS", ssl: "SSL/TLS", none: t("keine") }[v]}</button>`).join("")}</div></label>
          ${field("mail_from", "Absender", "email", "", "leer = Benutzer")}
        </details>
        <div class="mailact"><button class="btn" data-mailcheck ${dis}><ha-icon icon="mdi:shield-check-outline"></ha-icon>${t("Zugang prüfen")}</button><button class="btn primary" data-mailsave ${dis}><ha-icon icon="mdi:email-check-outline"></ha-icon>${t("Speichern & Test-Mail senden")}</button></div>
        ${this._mailSteps ? `<div class="msteps">${this._mailSteps.map((s) => `<div class="mstep ${s.ok ? "ok" : "bad"}"><b>${s.ok ? "✓" : "✕"}</b><span><b>${esc(t({ connect: "Server erreichbar", tls: "Verschlüsselung", login: "Anmeldung", recipients: "Empfänger" }[s.step] || s.step))}</b> – ${esc(s.msg)}</span></div>`).join("")}</div>` : ""}
        ${this._mailMsg ? `<div class="hint ${this._mailMsg[0]}">${esc(this._mailMsg[1])}</div>` : ""}
        ${mailServices.length || viaService ? `<label class="mf"><span>${t("Oder vorhandenen Mail-Dienst nutzen")}<small>${t("statt der Zugangsdaten oben")}</small></span>
          <select class="sel" data-sel="hub" data-key="report_email" ${dis}><option value="${active ? "raumklima" : ""}">${t("– nein, Zugangsdaten oben –")}</option>${[...new Set([...mailServices, ...(viaService ? [cur] : [])])].map((n) => `<option value="${esc(n)}" ${n === cur ? "selected" : ""}>${esc(rkPretty(n))}</option>`).join("")}</select></label>` : ""}
        <div class="hint">${t("Das Passwort wird nur in Home Assistant gespeichert und nie angezeigt. Tipp: Für Gmail unter myaccount.google.com → Sicherheit → App-Passwörter ein eigenes Passwort für Raumklima erstellen.")}</div>
      </div></details>`;
  }

  _presenceGroup(r, id, editable) {
    const a = r.attrs, s = a.settings || {};
    const scope = `room:${id}`;
    const kinds = s.presence_sensors || {};
    const list = this._roomOpt(r, "presence_sensors") ?? Object.keys(kinds);
    const all = (this._cfg && this._cfg.choices && this._cfg.choices.presence) || [];
    const info = Object.fromEntries(all.map((x) => [x.id, x]));
    const kindOf = (e) => kinds[e] || (info[e] && info[e].kind) || "pir";
    const badge = (k) => `<b class="kb">${k === "mmwave" ? "mmWave" : "PIR"}</b>`;
    const chips = list.map((e) => { const on = this._st(e) && this._st(e).state === "on"; return `<span class="chip2" style="--c:${on ? "var(--rk-ok)" : "var(--rk-off)"}"><i></i>${esc((info[e] && info[e].name) || this._name(e))} ${badge(kindOf(e))}${editable ? ` <button class="mini x" data-presrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`; }).join("");
    const avail = all.filter((x) => !list.includes(x.id));
    const eco = this._roomOpt(r, "room_eco") ?? s.room_eco ?? "auto";
    const after = this._roomOpt(r, "room_eco_after") ?? s.room_eco_after ?? 30;
    const drop = this._roomOpt(r, "room_eco_drop") ?? s.room_eco_drop ?? 1.5;
    const pk = this._roomOpt(r, "presence_kind") ?? s.presence_kind ?? "auto";
    const state = a.occupied === true ? t("jemand im Raum") : a.occupied === false ? (a.room_eco ? t("leer – abgesenkt") : t("leer")) : t("unbekannt");
    return this._grp("Präsenzmelder", "mdi:motion-sensor", "ok", [
      list.length ? `<div class="status"><span class="chip" style="--tone:${a.occupied ? "var(--rk-ok)" : "var(--rk-off)"}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon>${state}</span></div>` : "",
      this._row("Melder", `<div class="chips">${chips || this._v("keine", true)}</div>`, "mmWave (Radar) sieht auch Stillsitzende · PIR nur Bewegung"),
      editable && avail.length ? `<div class="addrow"><select class="sel" id="addPres-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)} (${x.kind === "mmwave" ? "mmWave" : "PIR"})</option>`).join("")}</select><button class="btn" data-presadd="${id}" style="--c:var(--rk-ok)"><ha-icon icon="mdi:plus"></ha-icon>${t("Melder hinzufügen")}</button></div>` : "",
      list.length ? this._row("Art", editable ? this._segs(scope, "presence_kind", RK_PKIND, pk) : this._v(RK_PKIND[pk]), "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Leer nach 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung") : "",
      list.length ? this._row("Leeren Raum absenken", editable ? this._segs(scope, "room_eco", RK_NIGHT, eco) : this._v(RK_NIGHT[eco]),
        eco === "auto" ? (s.room_eco_enabled ? "Automatisch: ja (mmWave, passender Raumtyp)" : "Automatisch: nein – nur Wohnraum, Küche, selten genutzt und nur mit mmWave") : "") : "",
      list.length && (eco === "on" || (eco === "auto" && s.room_eco_enabled)) ? this._row("… wenn leer seit", editable ? this._optStepper(scope, "room_eco_after", after, " min", 5, 5, 240) : this._v(`${after} min`)) : "",
      list.length && (eco === "on" || (eco === "auto" && s.room_eco_enabled)) ? this._row("… um", editable ? this._optStepper(scope, "room_eco_drop", drop, " °C", 0.5, 0.5, 4, 1) : this._v(`${fmt(drop)} °C`), "nie unter „kurz weg“ und den Schimmelschutz; kommt jemand rein, sofort zurück") : "",
    ].join(""));
  }

  _lightGroup(r, id, editable) {
    const s = r.attrs.settings || {};
    const lights = this._roomOpt(r, "signal_lights") ?? s.signal_lights ?? [];
    const sigs = this._roomOpt(r, "light_signals") ?? s.light_signals ?? ["open", "close"];
    const all = (this._cfg && this._cfg.choices && this._cfg.choices.lights) || [];
    const names = Object.fromEntries(all.map((x) => [x.id, x.name]));
    const chips = lights.map((e) => `<span class="chip2" style="--c:var(--rk-air)"><i></i>${esc(names[e] || this._name(e))}${editable ? ` <button class="mini x" data-lightrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
    const avail = all.filter((x) => !lights.includes(x.id));
    const sigChips = Object.entries(RK_LIGHT_SIGNALS).map(([k, [c, l]]) => `<button class="chip2 ${sigs.includes(k) ? "" : "off"}" style="--c:${c}" data-lsig="${k}" data-entry="${id}" ${editable ? "" : "disabled"}><i></i>${l}</button>`).join("");
    return this._grp("Lichtsignal", "mdi:lightbulb-on-outline", "air", [
      this._row("Lampen", `<div class="chips">${chips || this._v("keine", true)}</div>`, "blinken 3× in der Farbe des Hinweises, danach wie vorher"),
      editable && avail.length ? `<div class="addrow"><select class="sel" id="addLight-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-lightadd="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Lampe hinzufügen")}</button></div>` : "",
      this._row("Blinken bei", `<div class="chips">${sigChips}</div>`, "Blau = lüften · Orange = schließen · Grün = fertig · Rot = Problem"),
      lights.length && this._admin ? this._row("Ausprobieren", `<button class="btn" data-lighttest="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:play"></ha-icon>${t("Test")}</button>`) : "",
      `<div class="hint">${t("Nicht in der Ruhezeit, nicht beim Schlafen mit offenem Fenster und nicht, wenn niemand zu Hause ist. Lampen ohne Farbe blinken einfach hell.")}</div>`,
    ].join(""));
  }

  // Gelernte Schlafzeiten (Wohnungsebene) – gehört zum Lernen, nicht zu den Einstellrädern.
  // ---------------------------------------------------------------- Lernen (Unterreiter)
  _learnTabs(active, keys) {
    const names = { overview: "Übersicht", sleep: "Schlafen & Anwesenheit", decisions: "Entscheidungen", how: "So rechnet es" };
    return `<div class="ltabs">${keys.map((k) => `<button class="ltab ${k === active ? "on" : ""}" data-ltab="${k}">${t(names[k])}</button>`).join("")}</div>`;
  }

  // Wohnungsebene: Schlafzeiten, Anwesenheitsprofil, Entscheidungen, Erklärung
  _learnHub(st) {
    const tab = this._ltabHub || "sleep";
    const body = tab === "sleep" ? this._sleepRows(st)
      : tab === "decisions" ? this._decisions(null)
      : this._howRows("home");
    return this._grp(t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["sleep", "decisions", "how"]) + body);
  }

  _sleepRows(st) {
    const sl = (st && st.sleep) || {};
    const line = (k, label) => {
      const v = sl[k] || {};
      const e = v.effective || {};
      const parts = [v.bed ? t("ins Bett ~{v}", { v: v.bed }) : "", v.wake ? t("auf ~{v}", { v: v.wake }) : ""].filter(Boolean);
      const sub = parts.length
        ? `${t("{b} von 4 Nächten (Bett) · {w} von 4 (Aufstehen)", { b: v.nights_bed || 0, w: v.nights_wake || 0 })}${e.quiet_start ? ` · ${t("Ruhezeit")} ${e.quiet_start}–${e.quiet_end}` : ""}`
        : t("noch zu wenige Nächte – 4 sind nötig");
      return this._row(t(label), this._v(parts.length ? parts.join(" · ") : t("sammelt noch"), !parts.length), sub);
    };
    const pp = (st && st.presence_profile) || {};
    const days = pp.days || {};
    const hasProfile = (days.weekday || 0) + (days.weekend || 0) > 0;
    const bars = (arr, label) => this._row(t(label), this._presenceBars(arr), this._presenceText(arr));
    const head = `<div class="row whyhead"><div class="l"><span class="lbl">${t("Anwesenheitsprofil")}</span><small>${t("Aus diesem Profil schlägt Raumklima Absenk- und Vorheizzeiten vor.")}</small></div></div>`;
    const tip = (st && st.presence_tip) || {};
    const tipRow = tip.ready
      ? this._row(t("Vorschlag"), this._v([tip.weekday ? t("{a} bis {b}", { a: tip.weekday.from, b: tip.weekday.to }) : "", tip.weekend ? t("Wochenende ab {a}", { a: tip.weekend.from }) : ""].filter(Boolean).join(" · ")),
        t("Vorheizen beginnt 30 Minuten vorher, Absenken endet mit der Ankunft – so bleibt es beim Wunsch, ohne dass die Heizung leer läuft."))
      : this._row(t("Vorschlag"), this._v(t("sammelt noch"), true), t("ab einer erfassten Woche"));
    const profile = head + (hasProfile
      ? [bars(pp.weekday, "Werktags"), bars(pp.weekend, "Wochenende")].join("")
      : this._row(t("Anwesenheit am Tag"), this._v(t("sammelt noch"), true), t("wird ab der ersten Woche sichtbar – nur ja/nein, nie wer")));
    return [line("weekday", "Werktags"), line("weekend", "Wochenende"), profile, tipRow].join("");
  }

  // Einrichtungs-Checkliste: was fehlt noch, und wo stellt man es ein
  _checkRows(st, ch) {
    const rooms = this._rooms || [];
    const opts = (r) => r.attrs.settings || {};
    const any = (fn) => rooms.some(fn);
    const people = (this._hubOpt("residents") || []).length;
    const rec = Object.keys(this._hubOpt("recipients") || {}).length;
    const items = [
      [t("Bewohner hinterlegt"), people > 0, t("Einstellungen → Anwesenheit & Absenkung")],
      [t("Empfänger für Meldungen"), rec > 0, t("Einstellungen → Wer bekommt was")],
      [t("Wetterquelle gewählt"), !!this._hubOpt("weather_entity"), t("Einstellungen → Benachrichtigungen allgemein")],
      [t("Raum mit Thermostat"), any((r) => opts(r).trv), t("Raum → Geräte")],
      [t("Fensterkontakt eingetragen"), any((r) => (opts(r).windows || []).length), t("Raum → Fenster & Lüften")],
      [t("Zeitplan angelegt"), any((r) => (opts(r).schedules || []).length), t("Raum → Zeitplan")],
    ];
    const optional = [
      [t("Präsenzmelder eingetragen"), any((r) => (opts(r).presence_sensors || []).length), t("Raum → Anwesenheit im Raum")],
      [t("Sturmschwelle geprüft"), this._hubOpt("storm_warning") != null, t("Einstellungen → Sturm- und Regenwarnung")],
    ];
    const done = items.filter((i) => i[1]).length;
    const chip = (on, optionalItem) =>
      `<span class="chip2 ${on ? "" : "off"}" style="--c:var(--rk-${on ? "ok" : optionalItem ? "air" : "warn"})"><i></i>${on ? t("erledigt") : optionalItem ? t("optional") : t("offen")}</span>`;
    const rows = [
      this._row(
        t("{a} von {b} erledigt", { a: done, b: items.length }),
        `<span class="chip2" style="--c:var(--rk-${done === items.length ? "ok" : "warn"})"><i></i>${done === items.length ? t("bereit") : t("noch offen")}</span>`,
        t("die wichtigsten Schritte, damit Raumklima sinnvoll regeln kann")
      ),
      ...items.map(([label, on, where]) => this._row(label, chip(on, false), where)),
      ...optional.map(([label, on, where]) => this._row(label, chip(on, true), `${where} · ${t("bringt mehr Genauigkeit, ist aber nicht nötig")}`)),
    ];
    return rows.join("");
  }

  // Raum-Ebene: Aufheizrate & Co., Entscheidungen, Erklärung
  _learnRoom(r) {
    const a = r.attrs, s = a.settings || {}, h = s.heatup || {}, id = s.entry_id;
    if (!id || a.monitor) return "";
    const tab = this._ltabRoom || "overview";
    const eps = Number(h.episodes || 0);
    const sure = eps >= 6 ? [t("belastbar"), "ok"] : eps >= 3 ? [t("brauchbar"), "warn"] : [t("noch unsicher"), "off"];
    const overview = [
      this._row(t("Aufheizrate"), this._v(h.rate != null ? t("{v} °C/h", { v: fmt(h.rate, 1) }) : t("noch nicht gelernt"), h.rate == null),
        t("aus {n} Aufheizvorgängen gemessen", { n: eps })),
      this._row(t("Vorheizen für 2 K"), this._v(h.minutes_2k != null ? t("{n} min", { n: h.minutes_2k }) : "–", h.minutes_2k == null),
        t("so früh beginnt das Vorheizen vor einem Zeitfenster")),
      this._row(t("Wie sicher?"), `<span class="chip2" style="--c:var(--rk-${sure[1]})"><i></i>${sure[0]}</span>`,
        t("mehr Aufheizvorgänge, verlässlichere Vorhersage")),
      this._row(t("Gerade gilt"), `<span class="v">${planText(a, false)}</span>`, t("so entscheidet die Automatik im Moment")),
      this._row(
        t("Übliche Nutzung"),
        this._v(a.usage || t("sammelt noch – nur mit Präsenzmelder"), !a.usage),
        t("Vorschlag aus der Belegung je Wochentag; ein Zeitfenster legst du selbst an")
      ),
    ].join("");
    const body = tab === "overview" ? overview : tab === "decisions" ? this._decisions(id) : this._howRows("room");
    return this._grp(t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["overview", "decisions", "how"]) + body);
  }

  _howRows(scope) {
    const rows = scope === "room"
      ? [
        this._row(t("Aufheizrate"), this._v(t("Median aus echten Vorgängen")), t("Gemessen wird, wie schnell der Raum bei geöffnetem Ventil wärmer wird – nur ab 0,3 K Anstieg, damit Messrauschen nicht zählt.")),
        this._row(t("Vorheizen"), this._v(t("Rate × fehlende Kelvin")), t("Aus der Aufheizrate und der Außentemperatur wird geschätzt, wie viele Minuten vor einem Zeitfenster gestartet werden muss.")),
        this._row(t("Entscheidungen"), this._v(t("feste Reihenfolge")), t("Heizpause → Abwesenheit → Boost → Zeitfenster → Ruhezeit → Vorheizen → leer/Sonne → Wunsch. Das oberste zutreffende gewinnt.")),
        this._row(t("Genauigkeit"), this._v(t("wächst mit Messungen")), t("Unter 3 Vorgängen unsicher, ab 6 belastbar. Mehr Messungen = engere Vorhersage; alte Werte verfallen mit der Zeit.")),
      ]
      : [
        this._row(t("Schlafzeiten"), this._v(t("Median der letzten 6 Wochen")), t("Gezählt wird jede Nacht einmal, aus Nachtlüften und Lichtsignalen. Ruhezeit beginnt 30 Minuten vor der typischen Bettzeit.")),
        this._row(t("Anwesenheit"), this._v(t("15-Minuten-Raster")), t("Alle 15 Minuten ein Häkchen „jemand da oder nicht“, rollierend 4 Wochen. Es wird nie erfasst, wer zu Hause ist.")),
        this._row(t("Vorschlag"), this._v(t("aus dem Profil")), t("Zeitfenster, in denen an mindestens 60 % der Tage jemand da war, gelten als typische Anwesenheit – daraus folgen Vorheiz- und Absenkzeiten.")),
        this._row(t("Grenzen"), this._v(t("ehrlich")), t("Urlaub, Schichtdienst und unregelmäßige Tage verfälschen das Profil. Deshalb schlägt Raumklima nur vor und stellt nichts von selbst um.")),
      ];
    return rows.join("");
  }

  // ---------------------------------------------------------------- Entscheidungen
  _decisions(entryId) {
    const range = this._decRange ?? 0;
    const cat = this._decCat ?? "all";
    const rangeChips = [[0, "Heute"], [7, "7 Tage"], [14, "14 Tage"]]
      .map(([k, l]) => `<button class="chip2 ${k === range ? "" : "off"}" data-drange="${k}">${t(l)}</button>`).join("");
    const catChips = [["all", "Alle"], ["target", "Heizen"], ["window", "Lüften"], ["presence", "Anwesenheit"], ["health", "Gesundheit"]]
      .map(([k, l]) => `<button class="chip2 ${k === cat ? "" : "off"}" data-dcat="${k}">${t(l)}</button>`).join("");
    const roomChips = entryId ? "" : `<div class="dbar"><span class="dlab">${t("Raum")}</span><div class="chips">${this._decRoomChips()}</div></div>`;
    return `<div class="dbar"><span class="dlab">${t("Zeitraum")}</span><div class="chips">${rangeChips}</div></div>
      ${roomChips}
      <div class="dbar"><span class="dlab">${t("Bereich")}</span><div class="chips">${catChips}</div></div>
      <div class="dkpis" data-dkpi></div>
      <div class="decs" data-decs="${esc(entryId || "")}"><div class="hint">${t("Lade …")}</div></div>
      <div class="hint">${t("Antippen einer Zeile zeigt die vollständige Begründung.")}</div>`;
  }

  _decRoomChips() {
    const cur = this._decRoom || "all";
    const list = [["all", t("Alle Räume")], ...this._rooms.map((r) => [r.id, r.name])];
    return list.map(([id, name]) => `<button class="chip2 ${id === cur ? "" : "off"}" data-droom="${esc(id)}">${esc(name)}</button>`).join("");
  }

  _decRow(e) {
    const d = new Date(e.t);
    const sameDay = !isNaN(d.getTime()) && d.toDateString() === new Date().toDateString();
    const when = isNaN(d.getTime()) ? "" : sameDay
      ? d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleString(loc(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    const many = e.n > 1 ? ` ×${e.n}` : "";
    const why = e.why ? `<small>${esc(e.why)}</small>` : "";
    const extra = [e.room ? esc(e.room) : "", e.data ? esc(Object.entries(e.data).map(([k, v]) => `${k}: ${v}`).join(" · ")) : ""].filter(Boolean).join(" · ");
    return `<details class="dec"><summary><span class="wtime">${esc(when)}</span><span class="dl"><b>${esc(e.msg)}${many}</b>${why}</span></summary>
      <div class="dfull">${e.why ? `<p>${esc(e.why)}</p>` : ""}${extra ? `<p class="ddata">${extra}</p>` : ""}</div></details>`;
  }

  _paintDec(box, list) {
    box.innerHTML = list.length
      ? list.map((e) => this._decRow(e)).join("")
      : `<div class="hint">${t("Keine Entscheidungen in diesem Zeitraum.")}</div>`;
    const kpi = this.shadowRoot.querySelector("[data-dkpi]");
    if (!kpi) return;
    const sets = list.filter((e) => e.cat === "target").length;
    const air = list.filter((e) => e.cat === "window").length;
    kpi.innerHTML = [[String(list.length), t("Entscheidungen")], [`${sets}×`, t("Ziel geändert")], [`${air}×`, t("Lüften")]]
      .map(([b, s]) => `<div class="dkpi"><b>${b}</b><span>${s}</span></div>`).join("");
  }

  async _decFetch() {
    const root = this.shadowRoot;
    const box = root && root.querySelector("[data-decs]");
    if (!box) return;
    const entryId = box.dataset.decs || null;
    const range = this._decRange ?? 0;
    const cat = this._decCat ?? "all";
    const key = `${entryId || "all"}|${range}|${cat}|${this._decRoom || ""}`;
    this._dec = this._dec || {};
    if (this._dec[key]) return this._paintDec(box, this._dec[key]);
    if (this._decBusy) return;
    this._decBusy = true;
    try {
      const msg = { type: "raumklima/log", limit: 400 };
      if (entryId) msg.entry_id = entryId;
      if (cat !== "all") msg.categories = [cat];
      const res = await this._hass.callWS(msg);
      const since = range === 0 ? new Date().setHours(0, 0, 0, 0) : Date.now() - range * 86400000;
      let list = (res.entries || []).filter((e) => Date.parse(e.t) >= since);
      if (!entryId && this._decRoom && this._decRoom !== "all") list = list.filter((e) => e.eid === this._decRoom);
      this._dec[key] = list;
      this._paintDec(box, list);
    } catch (e) {
      box.innerHTML = `<div class="hint">${t("Protokoll konnte nicht geladen werden.")}</div>`;
    } finally {
      this._decBusy = false;
    }
  }

  // iOS-artiger Zeitwähler: Stunden- und Viertelstunden-Rad zum Durchscrollen.
  _timePop() {
    const hh = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const mm = ["00", "15", "30", "45"];
    return `<div class="tpick" data-tpick hidden>
      <div class="tpickhead"><b>${t("Uhrzeit")}</b><button class="mini x" data-tclose title="${t("schließen")}">✕</button></div>
      <div class="tpickbody">
        <div class="twheel" data-twh>${hh.map((h, i) => `<button data-th="${i}" class="${i === 0 ? "on" : ""}">${h}</button>`).join("")}</div>
        <span class="tcolon">:</span>
        <div class="twheel small" data-twmn>${mm.map((m, i) => `<button data-tm="${i}" class="${i === 0 ? "on" : ""}">${m}</button>`).join("")}</div>
        <span class="tpickunit">${t("Uhr")}</span>
      </div>
      <div class="tpickfoot">
        <input class="inp" data-tin inputmode="numeric" maxlength="5" placeholder="HH:MM">
        <button class="btn primary" data-tok>${t("Übernehmen")}</button>
      </div>
    </div>`;
  }

  _openTime(key, val) {
    const pop = this.shadowRoot.querySelector("[data-tpick]");
    if (!pop) return;
    pop.hidden = false;
    const [hRaw, mRaw] = String(val || "07:00").split(":");
    const h = Math.max(0, Math.min(23, parseInt(hRaw, 10) || 0));
    const m = Math.max(0, Math.min(3, Math.round((parseInt(mRaw, 10) || 0) / 15)));
    this._tp = { key, h, m };
    pop.querySelector("[data-twh]").scrollTop = h * 40;
    pop.querySelector("[data-twmn]").scrollTop = m * 40;
    pop.querySelector("[data-tin]").value = `${String(h).padStart(2, "0")}:${String(m * 15).padStart(2, "0")}`;
  }

  _timeSync(pop) {
    if (!this._tp) return;
    const h = Math.round(pop.querySelector("[data-twh]").scrollTop / 40);
    const m = Math.round(pop.querySelector("[data-twmn]").scrollTop / 40);
    this._tp.h = Math.max(0, Math.min(23, h));
    this._tp.m = Math.max(0, Math.min(3, m));
    pop.querySelectorAll("[data-th]").forEach((b) => b.classList.toggle("on", Number(b.dataset.th) === this._tp.h));
    pop.querySelectorAll("[data-tm]").forEach((b) => b.classList.toggle("on", Number(b.dataset.tm) === this._tp.m));
    pop.querySelector("[data-tin]").value = `${String(this._tp.h).padStart(2, "0")}:${String(this._tp.m * 15).padStart(2, "0")}`;
  }

  // 24-h-Balken: 96 Viertelstunden, Höhe = Anteil der Tage mit Anwesenheit
  _presenceBars(arr) {
    if (!Array.isArray(arr) || !arr.length) return this._v("–", true);
    const cells = arr.map((v) => `<i style="height:${Math.max(8, Math.round(v * 100))}%;opacity:${(0.18 + v * 0.82).toFixed(2)}"></i>`).join("");
    return `<div class="pbars" title="${t("Anteil der Tage mit jemand zu Hause")}">${cells}</div>`;
  }

  _presenceText(arr) {
    if (!Array.isArray(arr) || !arr.length) return "";
    const on = arr.map((v, i) => (v >= 0.5 ? i : -1)).filter((i) => i >= 0);
    if (!on.length) return t("keine klare Zeit – meist niemand zu Hause");
    const lab = (i) => `${String(Math.floor(i / 4) % 24).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
    const a = lab(on[0]);
    const b = lab((on[on.length - 1] + 1) % 96);
    return t("meist {a}–{b} jemand zu Hause", { a, b });
  }

  // ---------------------------------------------------------------- Lernen & Warum
  // ---------------------------------------------------------------- Rendern
  _render() {
    if (!this._hass || !this._rooms) return;
    if (this._renderSoon()) return;
    const rooms = this._rooms;
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
          ${this._admin ? `<button class="btn" data-restore style="--c:var(--rk-eco)" title="${t("Sicherung einspielen – Räume werden über ihren Namen zugeordnet")}"><ha-icon icon="mdi:content-save-arrow-left-outline"></ha-icon>${t("Wiederherstellen")}</button><input type="file" id="rkrestore" accept="application/json,.json" style="display:none">` : ""}<button class="btn" data-bug style="--c:var(--rk-warn)" title="${t("Öffnet ein neues GitHub-Issue mit Version, Home-Assistant-Version und Thermostat-Modell – ohne Raumnamen oder Entitäten")}"><ha-icon icon="mdi:bug-outline"></ha-icon>${t("Fehler melden")}</button>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
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
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
        ${this._timePop()}
      </ha-card>`);
    this._bind();
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

  _bind() {
    const $ = (sel) => this.shadowRoot.querySelectorAll(sel);
    const ws = (msg) => this._hass.callWS(msg).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    $("[data-tab]").forEach((el) => el.addEventListener("click", () => { this._tab = el.dataset.tab; this._sig = null; this._render(); }));
    $(".railbtn").forEach((el) => el.addEventListener("click", () => { this._group = el.dataset.g; this._filter(); }));
    $("[data-lmove]").forEach((el) => el.addEventListener("click", () => {
      const L = this._layout;
      const list = this._layoutList().map((r) => r.id);
      const i = list.indexOf(el.dataset.lmove);
      const j = i + parseInt(el.dataset.dir, 10);
      if (i < 0 || j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
      this._layout = { ...L, order: list };
      this._layoutSave();
      this._sig = null;
      this._filter();
    }));
    $("[data-lsize]").forEach((el) => el.addEventListener("click", () => {
      const L = this._layout;
      this._layout = { ...L, size: { ...(L.size || {}), [el.dataset.lsize]: el.dataset.v } };
      this._layoutSave();
      this._sig = null;
      this._render();
    }));
    $("[data-lcolor]").forEach((el) => el.addEventListener("click", () => {
      const L = this._layout;
      this._layout = { ...L, color: { ...(L.color || {}), [el.dataset.lcolor]: el.dataset.v } };
      this._layoutSave();
      this._sig = null;
      this._render();
    }));
    $("[data-lsave]").forEach((el) => el.addEventListener("click", () => this._layoutSave()));
    $("[data-resetroom]").forEach((el) => el.addEventListener("click", () => {
      if (!window.confirm(t("Alle Einstellungen dieses Raums auf Standard zurücksetzen? Geräte und Wohnung bleiben erhalten."))) return;
      ws({ type: "raumklima/room/reset", entry_id: el.dataset.resetroom })
        .then(() => this._flash(t("Auf Standard zurückgesetzt")))
        .catch(() => {});
    }));
    const search = this.shadowRoot.querySelector("#rks");
    if (search) search.addEventListener("input", () => { this._search = search.value; this._filter(); });
    $("[data-tgl]").forEach((el) => el.addEventListener("click", () => this._hass.callService("switch", "toggle", { entity_id: el.dataset.tgl })));
    $("[data-press]").forEach((el) => el.addEventListener("click", () => this._hass.callService("button", "press", { entity_id: el.dataset.press })));
    $("[data-num]").forEach((el) => el.addEventListener("click", () => {
      const s = this._st(el.dataset.num);
      if (!s) return;
      const step = parseFloat(s.attributes.step) || 1;
      const min = parseFloat(s.attributes.min), max = parseFloat(s.attributes.max);
      let v = Math.round((parseFloat(s.state) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
      if (!isNaN(min)) v = Math.max(min, v);
      if (!isNaN(max)) v = Math.min(max, v);
      this._hass.callService("number", "set_value", { entity_id: el.dataset.num, value: v });
    }));
    const apply = (scope, changes) => {
      if (scope === "hub") this._setHub(changes);
      else this._setRoom(scope.slice(5), changes);
    };
    $("[data-opt]").forEach((el) => el.addEventListener("click", () => {
      const step = parseFloat(el.dataset.step), min = parseFloat(el.dataset.min), max = parseFloat(el.dataset.max);
      const cur = parseFloat(el.dataset.val);
      let v = Math.round(((isNaN(cur) ? min : cur) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
      v = Math.min(max, Math.max(min, v));
      apply(el.dataset.opt, { [el.dataset.key]: v });
    }));
    $("[data-optbool]").forEach((el) => el.addEventListener("click", () => apply(el.dataset.optbool, { [el.dataset.key]: el.dataset.val !== "1" })));
    // Wert antippen und direkt tippen (statt nur +/- zu drücken)
    $(".stepper span").forEach((span) => span.addEventListener("click", () => {
      const box = span.closest(".stepper");
      const btn = box && box.querySelector("button");
      if (!box || !btn || !this._admin || box.classList.contains("ro") || span.querySelector("input")) return;
      const d = btn.dataset;
      if (d.schedtemp || d.schedmove) return;
      let cur = parseFloat(d.val), step = parseFloat(d.step) || 0.5, min = parseFloat(d.min), max = parseFloat(d.max);
      if (d.num) {
        const st = this._st(d.num);
        if (!st) return;
        const a = st.attributes || {};
        cur = parseFloat(st.state); step = parseFloat(a.step) || 0.5;
        min = parseFloat(a.min); max = parseFloat(a.max);
      }
      const html = span.innerHTML;
      const inp = document.createElement("input");
      inp.type = "number"; inp.inputMode = "decimal"; inp.className = "numedit";
      inp.step = String(step);
      if (!isNaN(min)) inp.min = String(min);
      if (!isNaN(max)) inp.max = String(max);
      inp.value = isNaN(cur) ? "" : String(cur);
      span.innerHTML = ``; span.appendChild(inp);
      inp.focus(); inp.select();
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        let v = parseFloat(String(inp.value).replace(",", "."));
        span.innerHTML = html;
        if (!ok || isNaN(v)) return;
        v = Math.round(v / step) * step;
        if (!isNaN(min)) v = Math.max(min, v);
        if (!isNaN(max)) v = Math.min(max, v);
        v = Math.round(v * 100) / 100;
        if (d.num) this._hass.callService("number", "set_value", { entity_id: d.num, value: v });
        else if (d.opt) apply(d.opt, { [d.key]: v });
      };
      inp.addEventListener("blur", () => finish(true));
      inp.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") { ev.preventDefault(); finish(true); }
        else if (ev.key === "Escape") { ev.preventDefault(); finish(false); }
      });
    }));
    // Zeitplan bearbeiten: jede Änderung geht gesammelt (700 ms Pause) an den Raum
    const sp = (v) => String(v).split("|");
    // Lüftfenster: gleiche Bedienung wie Zeitfenster, nur ohne Temperatur
    $("[data-guestroom]").forEach((el) => el.addEventListener("click", () => {
      const rid = el.dataset.guestroom;
      const cur = [...(this._hubOpt("guests_rooms") || [])];
      const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
      this._local = this._local || {};
      this._local["hub:guests_rooms"] = next;
      this._setHub({ guests_rooms: next }, 300);
      this._flash(t("Gespeichert"));
    }));
    $("[data-airadd]").forEach((el) => el.addEventListener("click", () => {
      const id = el.dataset.airadd;
      const list = this._airList(id, []);
      if (list.length >= 6) return;
      list.push({ days: [], start: "04:45", end: "06:30" });
      this._pushAir(id);
    }));
    $("[data-airdel]").forEach((el) => el.addEventListener("click", () => {
      const [id, i] = String(el.dataset.airdel).split("|");
      this._airList(id, []).splice(parseInt(i, 10), 1);
      this._pushAir(id);
    }));
    $("[data-airday]").forEach((el) => el.addEventListener("click", () => {
      const [id, i, d] = String(el.dataset.airday).split("|");
      const w = this._airList(id, [])[parseInt(i, 10)];
      if (!w) return;
      const day = parseInt(d, 10);
      w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
      this._pushAir(id);
    }));
    $("[data-airtime]").forEach((el) => el.addEventListener("change", () => {
      const [id, i, which] = String(el.dataset.airtime).split("|");
      const w = this._airList(id, [])[parseInt(i, 10)];
      if (!w) return;
      const v = rkTimeValue(el.value);
      if (!v) {
        this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
        el.value = w[which] || "";
        return;
      }
      el.value = v;
      w[which] = v;
      this._pushAir(id);
    }));
    $("[data-schedadd]").forEach((el) => el.addEventListener("click", () => {
      const id = el.dataset.schedadd;
      const list = this._schedList(id, this._schedSeed(id) || []);
      if (list.length >= 6) return;
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
      const base = room ? (this._roomOpt(room, "comfort_temperature") ?? (room.attrs.settings || {}).comfort_temperature ?? 22) : 22;
      list.push({ days: [], start: "19:00", end: "21:00", temperature: Math.round(base * 2) / 2 });
      this._pushSched(id);
    }));
    $("[data-scheddel]").forEach((el) => el.addEventListener("click", () => {
      const [id, i] = sp(el.dataset.scheddel);
      this._schedList(id, this._schedSeed(id) || []).splice(parseInt(i, 10), 1);
      this._pushSched(id);
    }));
    $("[data-schedday]").forEach((el) => el.addEventListener("click", () => {
      const [id, i, d] = sp(el.dataset.schedday);
      const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
      if (!w) return;
      const day = parseInt(d, 10);
      w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
      this._pushSched(id);
    }));
    $("[data-schedtime]").forEach((el) => el.addEventListener("change", () => {
      const [id, i, which] = sp(el.dataset.schedtime);
      const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
      if (!w) return;
      const v = rkTimeValue(el.value);
      if (!v) {
        this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
        el.value = w[which] || "";
        return;
      }
      el.value = v;
      w[which] = v;
      this._pushSched(id);
    }));
    $("[data-schedmove]").forEach((el) => el.addEventListener("click", () => {
      const [id, i, dir] = sp(el.dataset.schedmove);
      const list = this._schedList(id, this._schedSeed(id) || []);
      const a = parseInt(i, 10);
      const b = a + parseInt(dir, 10);
      if (a < 0 || b < 0 || a >= list.length || b >= list.length) return;
      [list[a], list[b]] = [list[b], list[a]];
      this._pushSched(id);
    }));
    $("[data-schedsort]").forEach((el) => el.addEventListener("click", async () => {
      const id = el.dataset.schedsort;
      const list = this._schedList(id, this._schedSeed(id) || []);
      list.sort((x, y) => {
        const a = rkSchedSortKey(x);
        const b = rkSchedSortKey(y);
        return a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]);
      });
      this._flash(t("Zeitfenster nach Uhrzeit sortiert"));
      this._pushSched(id);
    }));
    $("[data-schedtemp]").forEach((el) => el.addEventListener("click", () => {
      const [id, i] = sp(el.dataset.schedtemp);
      const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
      if (!w) return;
      const v = Math.round((w.temperature + 0.5 * parseInt(el.dataset.d, 10)) * 2) / 2;
      w.temperature = Math.min(30, Math.max(5, v));
      this._pushSched(id);
    }));
    $("[data-seg]").forEach((el) => el.addEventListener("click", () => apply(el.dataset.seg, { [el.dataset.key]: el.dataset.val })));
    // nach der Auswahl Fokus lösen, sonst wartet die Karte mit dem Aktualisieren (Schutz beim Tippen)
    $("[data-sel]").forEach((el) => el.addEventListener("change", () => { el.blur(); apply(el.dataset.sel, { [el.dataset.key]: el.value || null }); }));
    $("[data-md]").forEach((el) => el.addEventListener("change", () => {
      const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(el.value.trim());
      if (iso) { this._setHub({ [el.dataset.md]: `${iso[2]}-${iso[3]}` }, 200); return; }
      const m = /^(\d{1,2})[-.](\d{1,2})\.?$/.exec(el.value.trim());
      if (!m) { this._flash("Bitte als MM-TT eingeben, z. B. 10-01"); return; }
      // 01.10. (TT.MM.) oder 10-01 (MM-TT)
      const [mm, dd] = el.value.includes(".") ? [m[2], m[1]] : [m[1], m[2]];
      this._setHub({ [el.dataset.md]: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}` }, 200);
    }));
    $("[data-ltab]").forEach((el) => el.addEventListener("click", () => {
      if (this._tab === "general") this._ltabHub = el.dataset.ltab; else this._ltabRoom = el.dataset.ltab;
      this._dec = {}; this._render();
    }));
    $("[data-drange]").forEach((el) => el.addEventListener("click", () => { this._decRange = Number(el.dataset.drange); this._dec = {}; this._render(); }));
    $("[data-dcat]").forEach((el) => el.addEventListener("click", () => { this._decCat = el.dataset.dcat; this._dec = {}; this._render(); }));
    $("[data-droom]").forEach((el) => el.addEventListener("click", () => { this._decRoom = el.dataset.droom; this._dec = {}; this._render(); }));
    $("[data-timeopen]").forEach((el) => el.addEventListener("click", () => this._openTime(el.dataset.timeopen, el.dataset.val)));
    const tpop = this.shadowRoot.querySelector("[data-tpick]");
    if (tpop) {
      let tid = 0;
      ["[data-twh]", "[data-twmn]"].forEach((sel) => tpop.querySelector(sel).addEventListener("scroll", () => {
        clearTimeout(tid);
        tid = setTimeout(() => this._timeSync(tpop), 90);
      }));
      tpop.querySelector("[data-tclose]").addEventListener("click", () => { tpop.hidden = true; });
      tpop.querySelector("[data-tok]").addEventListener("click", () => {
        const v = rkTimeValue(tpop.querySelector("[data-tin]").value);
        if (!v) { this._flash(t("Bitte Uhrzeit als HH:MM eingeben")); return; }
        const key = this._tp && this._tp.key;
        tpop.hidden = true;
        if (key) this._setHub({ [key]: v + ":00" }, 200);
      });
      tpop.querySelector("[data-tin]").addEventListener("input", (ev) => {
        const v = rkTimeValue(ev.target.value);
        if (!v) return;
        const [h, m] = v.split(":");
        tpop.querySelector("[data-twh]").scrollTop = (parseInt(h, 10) || 0) * 40;
        tpop.querySelector("[data-twmn]").scrollTop = Math.round((parseInt(m, 10) || 0) / 15) * 40;
      });
    }
    $("[data-time]").forEach((el) => el.addEventListener("change", () => {
      const key = el.dataset.time;
      const v = rkTimeValue(el.value);
      if (!v) {
        this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
        el.value = String(this._hubOpt(key) || "").slice(0, 5);
        return;
      }
      el.value = v;
      this._setHub({ [key]: v + ":00" }, 200);
    }));
    $("[data-person]").forEach((el) => el.addEventListener("click", () => {
      const list = [...(this._hubOpt("residents") || [])];
      const i = list.indexOf(el.dataset.person);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.person);
      this._setHub({ residents: list });
    }));
    $("[data-home]").forEach((el) => el.addEventListener("click", () => {
      this._home = el.dataset.home; this._tab = "general"; this._local = {}; this._sig = null; this._load();
    }));
    $("[data-hubnum]").forEach((el) => el.addEventListener("change", () => {
      const v = el.value.trim() === "" ? null : Math.max(0, Math.min(20000, parseFloat(el.value.replace(",", "."))));
      this._setHub({ [el.dataset.hubnum]: Number.isNaN(v) ? null : v }, 200);
    }));
    $("[data-hubtext]").forEach((el) => el.addEventListener("change", () => this._setHub({ [el.dataset.hubtext]: el.value.trim() }, 200)));
    $("[data-geohass]").forEach((el) => el.addEventListener("click", () => {
      const c = this._hass.config || {};
      this._setHub({ latitude: c.latitude, longitude: c.longitude }, 200);
    }));
    $("[data-geoclear]").forEach((el) => el.addEventListener("click", () => this._setHub({ latitude: null, longitude: null }, 200)));
    $("[data-hubgeo]").forEach((el) => el.addEventListener("change", () => {
      const key = el.dataset.hubgeo;
      const limit = key === "latitude" ? 90 : 180;
      const raw = el.value.trim().replace(",", ".");
      const v = raw === "" ? null : Math.max(-limit, Math.min(limit, parseFloat(raw)));
      this._setHub({ [key]: Number.isNaN(v) ? null : v }, 200);
    }));
    $("[data-mkdash]").forEach((el) => el.addEventListener("click", async () => {
      const p = el.dataset.mkdash;
      const made = await this._ensureDashboard(p, this._hubOpt("name") || p, this._cfg.hub.entry_id);
      this._flash(made ? t("Dashboard „{d}“ angelegt", { d: made }) : t("Anlegen nicht möglich – bitte in den Einstellungen unter Dashboards prüfen"));
      if (made) { await this._load(); } else { this._render(); }
    }));
    $("[data-newhome]").forEach((el) => el.addEventListener("click", async () => {
      const inp = this.shadowRoot.getElementById("newHome");
      const name = inp && inp.value.trim();
      if (!name) { this._flash("Bitte einen Namen eingeben"); return; }
      try {
        const r = await this._hass.callWS({ type: "raumklima/home/create", name });
        this._home = r.entry_id; this._tab = "general"; this._local = {};
        const made = await this._ensureDashboard(r.dashboard, name, r.entry_id);
        this._flash(made
          ? t("Wohnung „{n}“ angelegt – Dashboard „{d}“ gleich mit", { n: name, d: made })
          : t("Wohnung „{n}“ angelegt", { n: name }));
        await this._load();
      } catch (e) { this._flash(t("Fehler: {e}", { e: e.message || e })); }
    }));
    const roomList = (entry, key, fallback) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const s = (room && room.attrs.settings) || {};
      return [...((room && this._roomOpt(room, key)) ?? s[key] ?? fallback)];
    };
    const mailbox = this.shadowRoot.querySelector("[data-mailbox]");
    if (mailbox) mailbox.addEventListener("toggle", () => { this._mailOpen = mailbox.open; });
    $("[data-mail]").forEach((el) => el.addEventListener("input", () => { this._mailForm = { ...(this._mailForm || {}), [el.dataset.mail]: el.value }; }));
    $("[data-mailprov]").forEach((el) => el.addEventListener("click", () => {
      const p = RK_MAIL_PROVIDERS[el.dataset.mailprov];
      this.shadowRoot.querySelectorAll("[data-mailprov]").forEach((b) => b.classList.toggle("on", b === el));
      if (!p) return;
      this._mailForm = { ...(this._mailForm || {}), mail_server: p[0], mail_port: String(p[1]), mail_security: p[2] };
      for (const [k, v] of Object.entries({ mail_server: p[0], mail_port: p[1] })) {
        const inp = this.shadowRoot.querySelector(`[data-mail="${k}"]`);
        if (inp) inp.value = v;
      }
      this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b.dataset.mailsec === p[2]));
    }));
    $("[data-mailsec]").forEach((el) => el.addEventListener("click", () => {
      this._mailForm = { ...(this._mailForm || {}), mail_security: el.dataset.mailsec };
      this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b === el));
    }));
    const mailSettings = () => {
      const f = { ...(this._mailForm || {}) };
      const out = {};
      for (const k of ["mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to"]) {
        if (f[k] === undefined) continue;
        out[k] = k === "mail_port" ? (f[k] === "" ? null : parseInt(f[k], 10)) : String(f[k]).trim();
      }
      return out;
    };
    $("[data-mailtoggle]").forEach((el) => el.addEventListener("click", () => {
      if (this._hubOpt("report_email")) { this._setHub({ report_email: null }, 200); return; }
      if (this._hubOpt("mail_server") && this._hubOpt("mail_to")) { this._setHub({ report_email: "raumklima" }, 200); return; }
      this._mailOpen = true; // erst einrichten – Speichern schaltet ein
      this._mailMsg = ["", t("Bitte erst unten die Zugangsdaten eintragen und speichern.")];
      this._sig = null; this._render();
    }));
    $("[data-mailcheck]").forEach((el) => el.addEventListener("click", async () => {
      el.disabled = true;
      this._mailSteps = null; this._mailMsg = ["", t("Prüfe Zugang …")]; this._sig = null; this._render();
      try {
        const r = await this._hass.callWS({ type: "raumklima/mail/test", send: false, settings: mailSettings(), ...this._homeMsg() });
        this._mailSteps = r.steps;
        this._mailMsg = r.ok ? ["okmsg", t("Alles in Ordnung – du kannst speichern und eine Test-Mail senden.")] : ["errmsg", t("Da stimmt noch etwas nicht – siehe oben.")];
      } catch (e) {
        this._mailMsg = ["errmsg", t("Fehler: {e}", { e: e.message || e })];
      }
      this._sig = null; this._render();
    }));
    $("[data-mailsave]").forEach((el) => el.addEventListener("click", async () => {
      this._mailSteps = null;
      const f = { ...(this._mailForm || {}) };
      const changes = { report_email: "raumklima" };
      for (const k of ["mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to"]) {
        if (f[k] === undefined) continue;
        changes[k] = k === "mail_port" ? (f[k] === "" ? null : parseInt(f[k], 10)) : String(f[k]).trim();
      }
      el.disabled = true;
      this._mailMsg = ["", t("Sende Test-Mail …")]; this._sig = null; this._render();
      try {
        await this._hass.callWS({ type: "raumklima/hub/update", changes, ...this._homeMsg() });
        const { report_email: _re, ...settings } = changes;
        const r = await this._hass.callWS({ type: "raumklima/mail/test", settings, ...this._homeMsg() });
        this._mailMsg = ["okmsg", t("Test-Mail an {to} gesendet – bitte Posteingang (und Spam) prüfen.", { to: (r.to || []).join(", ") })];
        this._mailForm = {};
      } catch (e) {
        this._mailMsg = ["errmsg", t("Fehler: {e}", { e: e.message || e })];
      }
      await this._load();
    }));
    $("[data-help]").forEach((el) => el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const k = el.dataset.help;
      if (this._helpOpen.has(k)) this._helpOpen.delete(k); else this._helpOpen.add(k);
      this._sig = null; this._render();
    }));
    $("[data-rpdf]").forEach((el) => el.addEventListener("click", () => {
      const list = [...(this._hubOpt("report_pdf") ?? ["week", "month", "season"])];
      const i = list.indexOf(el.dataset.rpdf);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.rpdf);
      this._setHub({ report_pdf: list });
    }));
    $("[data-pdftest]").forEach((el) => el.addEventListener("click", async () => {
      el.disabled = true;
      const r = await ws({ type: "raumklima/report/pdf/create", kind: "week", send: true, ...this._homeMsg() });
      el.disabled = false;
      if (r) this._flash(t("Bericht gesendet: {f}", { f: r.file }));
    }));
    $("[data-presrm]").forEach((el) => el.addEventListener("click", () => {
      this._setRoom(el.dataset.entry, { presence_sensors: roomPres(el.dataset.entry).filter((x) => x !== el.dataset.presrm) }, 200);
    }));
    $("[data-presadd]").forEach((el) => el.addEventListener("click", () => {
      const sel = this.shadowRoot.getElementById(`addPres-${el.dataset.presadd}`);
      if (sel && sel.value) this._setRoom(el.dataset.presadd, { presence_sensors: [...roomPres(el.dataset.presadd), sel.value] }, 200);
    }));
    const roomPres = (entry) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const local = room && this._roomOpt(room, "presence_sensors");
      return [...(local ?? Object.keys(((room && room.attrs.settings) || {}).presence_sensors || {}))];
    };
    $("[data-lightrm]").forEach((el) => el.addEventListener("click", () => {
      this._setRoom(el.dataset.entry, { signal_lights: roomList(el.dataset.entry, "signal_lights", []).filter((x) => x !== el.dataset.lightrm) }, 200);
    }));
    $("[data-lightadd]").forEach((el) => el.addEventListener("click", () => {
      const sel = this.shadowRoot.getElementById(`addLight-${el.dataset.lightadd}`);
      if (sel && sel.value) this._setRoom(el.dataset.lightadd, { signal_lights: [...roomList(el.dataset.lightadd, "signal_lights", []), sel.value] }, 200);
    }));
    $("[data-lsig]").forEach((el) => el.addEventListener("click", () => {
      const list = roomList(el.dataset.entry, "light_signals", ["open", "close"]);
      const i = list.indexOf(el.dataset.lsig);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.lsig);
      this._setRoom(el.dataset.entry, { light_signals: list }, 600);
    }));
    $("[data-lighttest]").forEach((el) => el.addEventListener("click", async () => {
      const r = await ws({ type: "raumklima/room/light_test", entry_id: el.dataset.lighttest });
      if (r) this._flash("Lampen blinken blau");
    }));
    $("[data-sigrm]").forEach((el) => el.addEventListener("click", () => {
      this._setHub({ sleep_signals: (this._hubOpt("sleep_signals") || []).filter((x) => x !== el.dataset.sigrm) });
    }));
    $("[data-sigadd]").forEach((el) => el.addEventListener("click", () => {
      const sel = this.shadowRoot.getElementById("addSig");
      if (sel && sel.value) this._setHub({ sleep_signals: [...(this._hubOpt("sleep_signals") || []), sel.value] });
    }));
    $("[data-kind]").forEach((el) => el.addEventListener("click", () => {
      const key = el.dataset.ch === "tts" ? "tts" : "recipients";
      const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
      const list = table[el.dataset.target] || [];
      const i = list.indexOf(el.dataset.kind);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.kind);
      table[el.dataset.target] = list;
      this._setHub({ [key]: table });
    }));
    $("[data-remove]").forEach((el) => el.addEventListener("click", () => {
      const key = el.dataset.ch === "tts" ? "tts" : "recipients";
      const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
      delete table[el.dataset.remove];
      this._setHub({ [key]: table }, 100);
    }));
    $("[data-add]").forEach((el) => el.addEventListener("click", () => {
      const sel = this.shadowRoot.getElementById("addTarget");
      if (!sel || !sel.value) return;
      const key = el.dataset.add === "tts" ? "tts" : "recipients";
      const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
      table[sel.value] = el.dataset.add === "tts" ? ["too_cold"] : [...RK_DEFAULT_PUSH];
      this._setHub({ [key]: table }, 100);
    }));
    $("[data-test]").forEach((el) => el.addEventListener("click", async () => {
      const r = await ws({ type: "raumklima/notify/test", target: el.dataset.test, ...this._homeMsg() });
      if (r) this._flash(t("Testnachricht an {n} gesendet", { n: rkPretty(el.dataset.test) }));
    }));
    $("[data-diag]").forEach((el) => el.addEventListener("click", () => this._downloadDiagnostics()));
    $("[data-backup]").forEach((el) => el.addEventListener("click", () => this._backupExport()));
    const restoreInput = this.shadowRoot.getElementById("rkrestore");
    $("[data-restore]").forEach((el) => el.addEventListener("click", () => restoreInput?.click()));
    if (restoreInput) restoreInput.addEventListener("change", async () => {
      const file = restoreInput.files && restoreInput.files[0];
      if (file) await this._backupImport(file);
      restoreInput.value = "";
    });
    $("[data-bug]").forEach((el) => el.addEventListener("click", () => this._openBugReport()));
    $("[data-action]").forEach((el) => el.addEventListener("click", async () => {
      await ws({ type: "raumklima/hub/action", action: el.dataset.action, ...this._homeMsg() });
      this._load();
    }));
    $("[data-nav]").forEach((el) => el.addEventListener("click", () => {
      history.pushState(null, "", el.dataset.nav);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    }));
  }
}