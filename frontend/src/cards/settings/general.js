// Einstellungen-Karte – Reiter „Allgemein“ (Wohnung, Anwesenheit, Heizsaison, Nacht, Benachrichtigungen, Berichte).
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName, SETTINGS_SECTIONS, ROOM_SEARCH } from "./const.js";

export const GeneralMethods = {
  // Raumkacheln – gemeinsam für „Alle Räume“ und die Räume-Liste (Phase 1).
  _roomTiles(q = "") {
    const issues = ((this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues) || []);
    const needle = String(q || "").toLowerCase().trim();
    return this._orderedRooms().filter((r) => !needle
      || String(r.name || "").toLowerCase().includes(needle)
      || String((r.attrs.settings || {}).name || "").toLowerCase().includes(needle)
    ).map((r) => {
      const s = r.attrs.settings || {};
      const notif = (this._st(r.sib.notifications) || {}).state === "on";
      const wl = (this._st(r.sib.window_logic) || {}).state === "on";
      const roomIssues = issues.filter((i) => i.entry_id === s.entry_id && i.severity !== "info");
      const changed = (s.changed || []).length;
      const plan = r.attrs.plan_reason && r.attrs.plan_reason !== "normal" ? planText(r.attrs, false, true) : "";
      const flags = [
        roomIssues.length ? `<ha-icon icon="mdi:alert-circle" style="color:var(--rk-warn)" title="${t("{n} Warnungen", { n: roomIssues.length })}"></ha-icon>` : "",
        wl ? `<ha-icon icon="mdi:window-open-variant" title="${t("Fensterlogik an")}"></ha-icon>` : "",
        notif ? `<ha-icon icon="mdi:bell-outline" title="${t("Hinweise an")}"></ha-icon>` : "",
        r.attrs.humidity_limit != null ? `<ha-icon icon="mdi:water-percent" title="${fmt(r.attrs.humidity_limit, 0)} %"></ha-icon>` : "",
        changed ? `<span class="rchg" title="${t("{n} Einstellungen vom Standard abweichend", { n: changed })}">${changed}</span>` : "",
      ].join("");
      return `<button class="rtile" data-tab="${r.id}" style="--c:${r.color}">
        <span class="rtop"><span class="rname">${r.name}</span><span class="rtyp">${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</span></span>
        <span class="rbig">${fmt(r.attrs.comfort_temperature)}<i>°</i></span>
        ${plan ? `<span class="rsub">${plan}</span>` : ""}
        <span class="rsub">${t("Absenkung")} ${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C</span>
        <span class="rsub">${t("Lüften ab {v} °C", { v: fmt(r.attrs.min_temp) })}</span>
        <span class="rflags">${flags}</span></button>`;
    }).join("");
  },

  // ---------------------------------------------------------------- Allgemein
  _generalCtx() {
    const ch = this._cfg.choices || {};
    const st = this._cfg.hub.state || {};
    return {
      ch,
      st,
      H: "hub",
      hubIds: rkHub(this._hass),
      pres: PRESENCE[st.stage] || PRESENCE.home,
      seas: SEASON[st.decision] || SEASON.heating,
      residents: this._hubOpt("residents") || [],
      persons: st.persons || {},
    };
  },

  _timeField(key, val) {
    const hm = String(val || "").slice(0, 5);
    return `<button class="timebtn" data-timeopen="${key}" data-val="${hm}" ${this._admin ? "" : "disabled"}>${hm || "–:–"}</button>`;
  },

  _sectionBody(id, ctx) {
    switch (id) {
      case "rooms": return this._roomList();
      case "presence": return `${this._groupPresence(ctx)}${this._groupNight(ctx)}`;
      case "energy": return `${this._groupEnergy()}${this._groupWeather()}${this._groupHeating(ctx)}${this._groupReports(ctx)}`;
      case "notify": return `${this._groupRecipients(ctx)}${this._groupNotify(ctx)}`;
      case "system": return `${this._groupHealth(ctx)}${this._groupLayout()}${this._groupAdvanced()}`;
      default: return `${this._groupHomeWelcome(ctx)}${this._groupHomeApartment(ctx)}${this._groupLearn(ctx)}`;
    }
  },

  _general() {
    if (this._err) return `<div class="hint">${t("Einstellungen konnten nicht geladen werden: {e}", { e: esc(this._err) })}</div>`;
    if (!this._cfg) return `<div class="hint">${t("Lade Einstellungen …")}</div>`;
    if (!this._cfg.hub) return `<div class="hint">${t("„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.")}</div>`;
    const ctx = this._generalCtx();
    if (this._nav2) {
      const sec = SETTINGS_SECTIONS.find((x) => x.id === this._section) || SETTINGS_SECTIONS[0];
      return `<div class="groups">${this._sectionBody(sec.id, ctx)}</div>`;
    }
    // Klassische Ansicht: gewohnte Reihenfolge, aber ohne die redundante Raumtabelle.
    return `<div class="groups">${[
      this._groupHomeWelcome(ctx),
      this._groupHealth(ctx),
      this._groupPresence(ctx),
      this._groupHeating(ctx),
      this._groupRecipients(ctx),
      this._groupNotify(ctx),
      this._groupNight(ctx),
      this._groupReports(ctx),
      this._groupHomeApartment(ctx),
      this._groupLearn(ctx),
      this._groupLayout(),
    ].join("")}</div>`;
  },

  _roomSearchBlock(q) {
    const needle = String(q || "").toLowerCase().trim();
    if (!needle) return "";
    const hit = ROOM_SEARCH.find((x) => x.terms.some((term) => needle.includes(term) || term.includes(needle)));
    if (!hit) return "";
    const rooms = this._orderedRooms().filter((r) => !r.attrs.monitor || hit.tab !== "sources");
    if (!rooms.length) return "";
    return `<div class="grp roomhits" data-g="search-rooms"><div class="gh"><div class="ic"><ha-icon icon="mdi:door-open"></ha-icon></div><b>${t("Räume")}</b><span class="chip" style="--tone:var(--rk-air)">${t(hit.label)}</span></div><div class="rws"><div class="roomgrid">${rooms.map((r) => `<button class="rtile" data-goto="roomtab:${r.id}:${hit.tab}" style="--c:${r.color}"><span class="rtop"><span class="rname">${esc(r.name)}</span><span class="rtyp">${t(hit.label)}</span></span><span class="rsub">${t("öffnen")}</span></button>`).join("")}</div></div></div>`;
  },

  // Phase 5: globale Suche. Alle Bereichsgruppen werden einmal gezeichnet; _filter()
  // blendet die Treffer ein. Der aktuelle Raum bleibt dabei sichtbar, damit auch
  // Raumeinstellungen gefunden werden.
  _searchBody(q) {
    const ctx = this._generalCtx();
    const groups = SETTINGS_SECTIONS.filter((x) => x.id !== "rooms")
      .map((x) => this._sectionBody(x.id, ctx)).join("");
    const room = (this._rooms || []).find((r) => r.id === this._tab);
    const roomGroups = room ? this._room(room) : "";
    const nameHits = this._roomTiles(q);
    const roomBlock = nameHits
      ? `<div class="grp roomhits" data-g="search-rooms"><div class="gh"><div class="ic"><ha-icon icon="mdi:door-open"></ha-icon></div><b>${t("Räume")}</b></div><div class="rws"><div class="roomgrid">${nameHits}</div></div></div>`
      : this._roomSearchBlock(q);
    return `<div class="groups searching">${roomGroups}${groups}${roomBlock}</div>`;
  },

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
  },
};
