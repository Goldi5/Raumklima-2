import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_CAL, RK_DEFAULT_PUSH, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_HOMESENS, RK_NIGHT, RK_OFF, RK_PKIND, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, planText, rkHub, rkIssueList, rkManualUrl, rkPretty, rkBusy, rkPaint, rkRooms, setLang, t, toneVar } from "../shared.js";
import { HELP } from "../help.js";
import { getLang } from "../i18n.js";


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
    if (first) this._load();
    const hubIds = rkHub(hass, this._homeId());
    const sig = JSON.stringify([
      this._rooms.map((r) => [r.attrs, Object.values(r.sib).map((id) => hass.states[id] && hass.states[id].state)]),
      Object.values(hubIds).map((id) => hass.states[id] && [hass.states[id].state, hass.states[id].attributes]),
      this._tab, this._cfgVer, this._toast,
    ]);
    if (sig === this._sig) return;
    this._sig = sig;
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
    return this._home || this._config.home || (this._cfg && this._cfg.hub && this._cfg.hub.entry_id) || null;
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
  }

  // ---------------------------------------------------------------- Speichern
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
    for (const k of Object.keys(changes)) delete this._local[`room:${entryId}:${k}`];
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
    const box = open ? `<div class="helpbox">${esc(help[getLang() === "de" ? 0 : 1])}</div>` : "";
    return `<div class="row"><div class="l"><span class="lbl">${t(label)}${q}</span>${sub ? `<small>${t(sub)}</small>` : ""}</div>${value}</div>${box}`;
  }
  _v(text, mute) { return `<span class="v ${mute ? "mute" : ""}">${t(String(text))}</span>`; }
  _grp(title, icon, tone, rows, cls = "", extra = "") {
    return `<div class="grp ${cls}" style="--g:${toneVar(tone)}"><div class="gh"><div class="ic"><ha-icon icon="${icon}"></ha-icon></div><b>${t(title)}</b>${extra}</div><div class="rws">${rows}</div></div>`;
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
      `<div class="status"><span class="chip" style="--tone:${toneVar(pres.tone)}"><ha-icon icon="${pres.icon}"></ha-icon>${pres.label}${st.stage === "preheat" && st.preheat_by ? ` · ${esc(st.preheat_by)}` : ""}</span>${st.presence_configured ? "" : `<span class="chip" style="--tone:var(--rk-warn)"><ha-icon icon="mdi:information-outline"></ha-icon>${t("Bewohner und Zone wählen, dann ist es aktiv")}</span>`}</div>`,
      this._row("Wer wohnt hier?", `<div class="chips">${personChips || this._v("keine Personen in HA", true)}</div>`, "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist."),
      this._row("Wohnung (Zone)", this._select(H, "zone", ch.zones || [], this._hubOpt("zone"), "– wählen –")),
      this._row("Absenken nach", this._optStepper(H, "away_delay", this._hubOpt("away_delay"), " min", 5, 0, 240), "damit kurze Wege nichts auslösen"),
      this._row("„Länger weg“ ab", this._optStepper(H, "long_away_hours", this._hubOpt("long_away_hours"), " h", 1, 2, 168)),
      this._row("Vorheizen ab", this._optStepper(H, "preheat_km", this._hubOpt("preheat_km"), " km", 1, 0, 200), "wenn sich jemand nähert"),
      this._row("Präsenzmelder zählen", this._segs(H, "home_sensors", RK_HOMESENS, this._hubOpt("home_sensors") || "mmwave"),
        (st.sensed && st.sensed.length) ? t("gerade jemand in: {r}", { r: esc(st.sensed.join(", ")) }) : "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie"),
      this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
      this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind"),
      this._row("Kalender", this._select(H, "calendar_entity", ch.calendars || [], this._hubOpt("calendar_entity"), "– keiner –"),
        st.calendar && st.calendar.mode ? t("gerade: „{s}“", { s: esc(st.calendar.summary || "") }) : "Termine mit diesen Wörtern steuern die Anwesenheit"),
      this._hubOpt("calendar_entity") ? this._row("… wie Urlaub", `<input class="inp" data-hubtext="calendar_away_words" value="${esc(this._hubOpt("calendar_away_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist") : "",
      this._hubOpt("calendar_entity") ? this._row("… jemand bleibt zu Hause", `<input class="inp" data-hubtext="calendar_home_words" value="${esc(this._hubOpt("calendar_home_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; dann wird nicht abgesenkt") : "",
    ].join("");

    // --- Heizsaison
    const mode = this._hubOpt("season_mode");
    const mdToInput = (v) => esc(v || "");
    const seasRows = [
      `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
      this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
      this._row("Heizgrenze", this._optStepper(H, "heating_limit", this._hubOpt("heating_limit"), " °C", 0.5, 5, 25, 1), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
      this._row("Heizsaison", `<span class="v"><input class="inp short" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Format MM-TT, außerhalb nur bei Kälteeinbruch"),
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
    const lrn = (k) => {
      const v = sl[k] || {}; const e = v.effective || {}; const s = e.source || {};
      const mark = (key) => (s[key] === "learned" ? ` <span class="lt">${t("gelernt")}</span>` : "");
      return `<tr><td>${k === "weekday" ? t("Werktags") : t("Wochenende")}</td>
        <td>${v.bed ? "~" + v.bed : `<span class="no">${t("{n}/4 Nächte", { n: v.nights_bed || 0 })}</span>`}</td>
        <td>${v.wake ? "~" + v.wake : `<span class="no">${t("{n}/4 Nächte", { n: v.nights_wake || 0 })}</span>`}</td>
        <td>${e.quiet_start || "–"}${mark("quiet_start")} – ${e.quiet_end || "–"}${mark("quiet_end")}</td>
        <td>${e.night_start || "–"}${mark("night_start")} – ${e.night_end || "–"}${mark("night_end")}</td></tr>`;
    };
    const sleepRows = [
      `<div class="status"><span class="chip" style="--tone:${sl.quiet_now ? "var(--rk-eco)" : "var(--rk-ok)"}"><ha-icon icon="${sl.quiet_now ? "mdi:sleep" : "mdi:white-balance-sunny"}"></ha-icon>${sl.quiet_now ? t("Ruhezeit gerade aktiv") : t("Keine Ruhezeit")}</span>${sl.asleep ? `<span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon>${t("Licht aus – alle schlafen")}</span>` : ""}</div>`,
      this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
      this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), (sl.tonight && sl.tonight.holiday) ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
      this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
      this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
      `<div class="tblwrap"><table class="tbl sm"><thead><tr><th></th><th>${t("Ins Bett")}</th><th>${t("Aufstehen")}</th><th>${t("Ruhezeit wirksam")}</th><th>${t("Nachtlüften")}</th></tr></thead><tbody>${lrn("weekday")}${lrn("weekend")}</tbody></table></div>`,
      `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis), getrennt nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`,
    ].join("");

    // --- Wohnung
    const homes = this._cfg.homes || [];
    const homeRows = [
      this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Berlin")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
      this._row("Dashboard", `<input class="inp" data-hubtext="dashboard" value="${esc(this._hubOpt("dashboard") || "")}" placeholder="${esc((homes.find((h) => h.entry_id === this._cfg.hub.entry_id) || {}).dashboard || "heizung")}" ${this._admin ? "" : "disabled"}>`, "Adresse des Dashboards dieser Wohnung (für den Umschalter)"),
      this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Remscheid")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
      `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Remscheid) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`,
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
      return `<div class="person"><div class="av" style="--c:${palette[i % palette.length]}">${channel === "tts" ? `<ha-icon icon="mdi:speaker"></ha-icon>` : esc(rkPretty(target)[0] || "?")}</div>
        <div class="pb"><div class="ph"><b>${esc(rkPretty(target))}</b>${this._admin ? `<button class="mini" data-test="${esc(target)}">${t("Test")}</button><button class="mini x" data-remove="${esc(target)}" data-ch="${channel}" title="${t("entfernen")}">✕</button>` : ""}</div>
        <small>${channel === "tts" ? t("Sprachansage · nie in der Ruhezeit") : t("Push aufs Handy")} · ${esc(target)}</small>
        <div class="chips">${chips}</div></div></div>`;
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
    const notiRows = [
      this._row("Ruhezeit", `<span class="v"><input type="time" class="inp" data-time="quiet_start" value="${hm(this._hubOpt("quiet_start"))}" ${this._admin ? "" : "disabled"}> – <input type="time" class="inp" data-time="quiet_end" value="${hm(this._hubOpt("quiet_end"))}" ${this._admin ? "" : "disabled"}></span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
      this._row("Wochenende bis", `<span class="v"><input type="time" class="inp" data-time="quiet_end_weekend" value="${hm(this._hubOpt("quiet_end_weekend"))}" ${this._admin ? "" : "disabled"}></span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
      this._row("Nachtlüften", `<span class="v"><input type="time" class="inp" data-time="night_start" value="${hm(this._hubOpt("night_start"))}" ${this._admin ? "" : "disabled"}> – <input type="time" class="inp" data-time="night_end" value="${hm(this._hubOpt("night_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
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
      return `<tr data-tab="${r.id}"><td><span class="rn" style="--c:${r.color}"><i></i>${r.name}</span></td>
        <td>${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</td>
        <td>${fmt(r.attrs.comfort_temperature)} °C</td>
        <td>${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C</td>
        <td>${fmt(r.attrs.min_temp)} °C</td>
        <td>${r.attrs.humidity_limit != null ? fmt(r.attrs.humidity_limit, 0) + " %" : "–"}</td>
        <td>${yes(wl)}</td><td>${yes(notif)}</td></tr>`;
    }).join("");

    const issues = st.issues || [];
    const bad = issues.filter((i) => i.severity !== "info").length;
    const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
    const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
    return `<div class="groups">
      ${this._grp("Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra)}
      ${this._grp("Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows)}
      ${this._grp("Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows)}
      ${this._grp("Wer bekommt was", "mdi:account-voice", "air", `<div class="people">${cards}</div>${addRow}`, "span")}
      ${this._grp("Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows)}
      ${this._grp("Schlafenszeiten", "mdi:sleep", "eco", sleepRows, "span")}
      ${this._grp("Gebäude & Schimmelschutz", "mdi:home-city-outline", "ok", buildRows)}
      ${this._grp("Wohnung", "mdi:home-switch-outline", "air", homeRows)}
      ${this._grp("Alle Räume auf einen Blick", "mdi:table", "off", `<div class="tblwrap"><table class="tbl"><thead><tr><th>${t("Raum")}</th><th>${t("Typ")}</th><th>${t("Wunsch")}</th><th>${t("Absenkung kurz / länger")}</th><th>${t("Minimum Lüften")}</th><th>${t("Feuchte")}</th><th>${t("Fensterlogik")}</th><th>${t("Hinweise")}</th></tr></thead><tbody>${rowsT}</tbody></table></div><div class="hint">${t("Tippe auf einen Raum, um seine Einstellungen zu ändern.")}</div>`, "span")}
    </div>`;
  }

  // ---------------------------------------------------------------- Raum
  _room(r) {
    const a = r.attrs, s = a.settings || {}, sib = r.sib;
    const cfgRoom = this._cfgRoom(r);
    const id = s.entry_id;
    const scope = `room:${id}`;
    const sync = RK_SYNC[a.sync] || ["–", "off"];
    const contacts = (a.window_entities || []).map((w) => { const st = this._st(w); const open = st && st.state === "on"; return `<span class="chip2" style="--c:${open ? "var(--rk-air)" : "var(--rk-off)"}"><i></i>${esc(this._name(w).replace(/^.*?(fenster|window)/i, (m, x) => x))} · ${open ? t("offen") : t("zu")}</span>`; }).join("") || `<span class="v mute">${t("keine")}</span>`;
    const offTxt = a.offset !== undefined && a.offset !== null ? t("aktuell {v} °C", { v: (a.offset > 0 ? "+" : "") + fmt(a.offset, 1) }) : "";
    const comfort = this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature;
    const roomType = this._roomOpt(r, "room_type") ?? s.room_type;
    const sbShort = this._roomOpt(r, "setback_short") ?? s.setback_short;
    const sbLong = this._roomOpt(r, "setback_long") ?? s.setback_long;
    const wOpen = this._roomOpt(r, "window_open_delay") ?? s.window_open_delay;
    const wClose = this._roomOpt(r, "window_close_delay") ?? s.window_close_delay;
    const nightMode = this._roomOpt(r, "night_airing") ?? s.night_airing ?? "auto";
    const virtMode = this._roomOpt(r, "virtual_window") ?? s.virtual_window ?? "auto";
    const editable = this._admin && cfgRoom;
    const push = Object.keys((this._cfg && this._cfg.hub && this._cfg.hub.options.recipients) || {});
    const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : null;
    const rIssues = ((this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues) || []).filter((i) => i.entry_id === id);
    return `<div class="groups">
      ${rIssues.length ? this._grp("Gesundheit", "mdi:heart-pulse", rIssues.some((i) => i.severity === "alert") ? "cold" : "warn", rkIssueList(rIssues, false), "span") : ""}
      ${this._grp("Temperatur", "mdi:thermometer", "heat", [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row("Wunschtemperatur", editable ? this._optStepper(scope, "comfort_temperature", comfort, " °C", 0.5, 12, 26, 1) : this._v(`${fmt(comfort)} °C`), "beim Einschalten und als Grundwert"),
        this._row("Raumtyp", editable ? this._select(scope, "room_type", Object.entries(RK_ROOM_TYPES).map(([k, v]) => ({ id: k, name: v })), roomType) : this._v(RK_ROOM_TYPES[roomType] || "–")),
        ((this._cfg && this._cfg.homes) || []).length > 1 ? this._row("Wohnung", editable ? this._select(scope, "home", this._cfg.homes.map((h) => ({ id: h.entry_id, name: h.name })), a.home || "") : this._v(esc(a.home_name || "–")), "Raum gehört zu dieser Wohnung (Bewohner, Zone, Empfänger)") : "",
        this._row("Sonnenseite", editable ? this._optToggle(scope, "solar_gain", !!(this._roomOpt(r, "solar_gain") ?? s.solar_gain)) : this._v(s.solar_gain ? "ja" : "nein"),
          a.plan_reason === "solar" ? "gerade: Sonne erwartet – 1 °C weniger" : "bei Sonne laut Vorhersage 1 °C weniger heizen – die Sonne wärmt mit"),
        this._row("Absenkung „kurz weg“", editable ? this._optStepper(scope, "setback_short", sbShort, " °C", 0.5, 10, 24, 1) : this._v(`${fmt(sbShort)} °C`), "wenn alle weg sind"),
        this._row("Aufheizen", this._v(s.heatup && s.heatup.minutes_2k != null ? t("~{m} min für +2 °C", { m: s.heatup.minutes_2k }) : t("lernt noch ({n}/3)", { n: (s.heatup && s.heatup.episodes) || 0 }), !(s.heatup && s.heatup.minutes_2k != null)),
          s.heatup && s.heatup.rate ? t("{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird", { r: fmt(s.heatup.rate, 1), n: s.heatup.episodes }) : "danach heizt die Wohnung rechtzeitig vor, bevor jemand ankommt"),
        this._row("Absenkung „länger weg“", editable ? this._optStepper(scope, "setback_long", sbLong, " °C", 0.5, 8, 22, 1) : this._v(`${fmt(sbLong)} °C`), "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer"),
      ].join(""))}
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
        this._row("Schlafen bei offenem Fenster", editable ? this._segs(scope, "night_airing", RK_NIGHT, nightMode) : this._v(RK_NIGHT[nightMode] || "–"),
          nightMode === "auto" ? (["bedroom", "rarely_used"].includes(roomType) ? "Automatisch: ja, weil Schlafraum" : "Automatisch: nein, kein Schlafraum") : "abends geöffnet = Nachtlüften: keine Lüft-Hinweise, Heizung wartet"),
        this._row("Kontakte", `<div class="chips">${contacts}</div>`),
        this._row("Offenes Fenster an Temperatursturz erkennen", editable ? this._segs(scope, "virtual_window", RK_NIGHT, virtMode) : this._v(RK_NIGHT[virtMode] || "–"),
          (a.window_virtual ? t("gerade: Fenster vermutlich offen · ") : "") + t(virtMode === "auto" ? (s.virtual_active ? "Automatisch: aktiv (kein Kontakt erreichbar)" : "Automatisch: aus, der Kontakt meldet zuverlässig") : "fällt es in 6 min um 1 °C, pausiert die Heizung bis es wieder wärmer wird")),
      ].join(""))}
      ${this._presenceGroup(r, id, editable)}
      ${this._lightGroup(r, id, editable)}
      ${this._grp("Benachrichtigungen", "mdi:bell-outline", "warn", [
        this._row("Hinweise für diesen Raum", this._toggle(sib.notifications)),
        this._row("Empfänger", push.length ? `<div class="chips">${push.map((tg) => `<span class="chip2"><i></i>${esc(rkPretty(tg))}</span>`).join("")}</div>` : this._v("niemand", true), "zentral unter Allgemein → Wer bekommt was"),
      ].join(""))}
      ${this._grp("Thermostat & Fühler", "mdi:radiator", "off", [
        this._row("Thermostat", this._v(esc(this._name(s.trv)))),
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
        this._row("CO₂-Sensor", this._v(s.co2_sensor ? esc(this._name(s.co2_sensor)) : "keiner", !s.co2_sensor), s.co2_sensor ? "ab 1000 ppm: „Bitte lüften“" : ""),
        this._row("Kalibrierung", this._v(RK_CAL[s.calibration_mode] || "–"), offTxt),
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
          <select class="sel" data-mailprov ${dis}><option value="">${t("– wählen –")}</option>${provs}<option value="other">${t("Anderer Anbieter")}</option></select></label>
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
    const homeBar = homes.length > 1 && !this._config.home ? `<div class="tabs homes">${homes.map((h) => `<button class="tab ${h.entry_id === this._homeId() ? "on" : ""}" data-home="${h.entry_id}"><ha-icon icon="mdi:home-outline"></ha-icon>${esc(h.name)}</button>`).join("")}</div>` : "";
    rkPaint(this, `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}</style>
      <ha-card class="settings" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:tune-variant"></ha-icon>${esc(this._config.title || t("Einstellungen"))}</div><a class="btn" href="${rkManualUrl()}" target="_blank" rel="noopener" style="--c:var(--rk-heat)" title="${t("Anleitung, Funktionen und häufige Fragen")}"><ha-icon icon="mdi:book-open-variant"></ha-icon>${t("Handbuch (PDF)")}</a>${this._admin ? "" : `<span class="chip" style="--tone:var(--rk-warn)">${t("Nur Ansicht – Ändern erfordert Admin")}</span>`}</div>
        ${homeBar}
        <div class="tabs">${tabs}</div>
        ${body}
        ${this._toast ? `<div class="toast">${esc(this._toast)}</div>` : ""}
      </ha-card>`);
    this._bind();
  }

  _bind() {
    const $ = (sel) => this.shadowRoot.querySelectorAll(sel);
    const ws = (msg) => this._hass.callWS(msg).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    $("[data-tab]").forEach((el) => el.addEventListener("click", () => { this._tab = el.dataset.tab; this._sig = null; this._render(); }));
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
    $("[data-seg]").forEach((el) => el.addEventListener("click", () => apply(el.dataset.seg, { [el.dataset.key]: el.dataset.val })));
    // nach der Auswahl Fokus lösen, sonst wartet die Karte mit dem Aktualisieren (Schutz beim Tippen)
    $("[data-sel]").forEach((el) => el.addEventListener("change", () => { el.blur(); apply(el.dataset.sel, { [el.dataset.key]: el.value || null }); }));
    $("[data-md]").forEach((el) => el.addEventListener("change", () => {
      const m = /^(\d{1,2})[-.](\d{1,2})\.?$/.exec(el.value.trim());
      if (!m) { this._flash("Bitte als MM-TT eingeben, z. B. 10-01"); return; }
      // 01.10. (TT.MM.) oder 10-01 (MM-TT)
      const [mm, dd] = el.value.includes(".") ? [m[2], m[1]] : [m[1], m[2]];
      this._setHub({ [el.dataset.md]: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}` }, 200);
    }));
    $("[data-time]").forEach((el) => el.addEventListener("change", () => el.value && this._setHub({ [el.dataset.time]: el.value + ":00" }, 200)));
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
    $("[data-newhome]").forEach((el) => el.addEventListener("click", async () => {
      const inp = this.shadowRoot.getElementById("newHome");
      const name = inp && inp.value.trim();
      if (!name) { this._flash("Bitte einen Namen eingeben"); return; }
      try {
        const r = await this._hass.callWS({ type: "raumklima/home/create", name });
        this._flash(t("Wohnung „{n}“ angelegt", { n: name }));
        this._home = r.entry_id; this._tab = "general"; this._local = {};
        setTimeout(() => this._load(), 1500);
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
    $("[data-mailprov]").forEach((el) => el.addEventListener("change", () => {
      const p = RK_MAIL_PROVIDERS[el.value];
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
