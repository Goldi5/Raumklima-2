// Einstellungen-Karte – Lernen & Warum: Schlafenszeiten, Erste Schritte, Entscheidungen.
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const LearnMethods = {
  // Gelernte Schlafzeiten (Wohnungsebene) – gehört zum Lernen, nicht zu den Einstellrädern.
  // ---------------------------------------------------------------- Lernen (Unterreiter)
  _learnTabs(active, keys) {
    const names = { why: "Warum (nicht)?", overview: "Übersicht", sleep: "Schlafen & Anwesenheit", decisions: "Entscheidungen", how: "So rechnet es" };
    return `<div class="ltabs">${keys.map((k) => `<button class="ltab ${k === active ? "on" : ""}" data-ltab="${k}">${t(names[k])}</button>`).join("")}</div>`;
  },

  // Wohnungsebene: Schlafzeiten, Anwesenheitsprofil, Entscheidungen, Erklärung
  _learnHub(st) {
    const tab = this._ltabHub || "sleep";
    const body = tab === "sleep" ? this._sleepRows(st)
      : tab === "decisions" ? this._decisions(null)
      : this._howRows("home");
    return this._grp("learn", t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["sleep", "decisions", "how"]) + body);
  },

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
  },

  // Einrichtungs-Checkliste: was fehlt noch, und wo stellt man es ein
  _checkRows(st, ch) {
    const rooms = this._rooms || [];
    const opts = (r) => r.attrs.settings || {};
    const any = (fn) => rooms.some(fn);
    const first = (fn) => rooms.find(fn);
    const tabTarget = (tab, fn = () => true) => {
      const r = first(fn);
      return r ? `roomtab:${r.id}:${tab}` : "section:rooms";
    };
    const people = (this._hubOpt("residents") || []).length;
    const rec = Object.keys(this._hubOpt("recipients") || {}).length;
    const items = [
      [t("Bewohner hinterlegt"), people > 0, t("Einstellungen → Anwesenheit & Absenkung"), "group:presence:presence"],
      [t("Empfänger für Meldungen"), rec > 0, t("Einstellungen → Wer bekommt was"), "group:notify:notify"],
      [t("Wetterquelle gewählt"), !!this._hubOpt("weather_entity"), t("Einstellungen → Wohnung"), "group:home:home"],
      [t("Raum mit Thermostat"), any((r) => opts(r).trv), t("Raum → Geräte"), tabTarget("devices", (r) => opts(r).trv)],
      [t("Fensterkontakt eingetragen"), any((r) => (opts(r).windows || []).length), t("Raum → Fenster & Lüften"), tabTarget("windows", (r) => (opts(r).windows || []).length)],
      [t("Zeitplan angelegt"), any((r) => (opts(r).schedules || []).length), t("Raum → Zeitplan"), tabTarget("schedule", (r) => (opts(r).schedules || []).length)],
    ];
    const optional = [
      [t("Präsenzmelder eingetragen"), any((r) => (opts(r).presence_sensors || []).length), t("Raum → Anwesenheit im Raum"), tabTarget("presence", (r) => (opts(r).presence_sensors || []).length)],
      [t("Sturmschwelle geprüft"), this._hubOpt("storm_warning") != null, t("Einstellungen → Sturm- und Regenwarnung"), "group:notify:notify"],
    ];
    const done = items.filter((i) => i[1]).length;
    const chip = (on, optionalItem) =>
      `<span class="chip2 ${on ? "" : "off"}" style="--c:var(--rk-${on ? "ok" : optionalItem ? "air" : "warn"})"><i></i>${on ? t("erledigt") : optionalItem ? t("optional") : t("offen")}</span>`;
    const open = (target) => `<button class="mini" data-goto="${target}" title="${t("dorthin springen")}">${t("öffnen")}</button>`;
    const next = items.find((i) => !i[1]) || optional.find((i) => !i[1]);
    const rows = [
      this._row(
        t("{a} von {b} erledigt", { a: done, b: items.length }),
        `<span class="chip2" style="--c:var(--rk-${done === items.length ? "ok" : "warn"})"><i></i>${done === items.length ? t("bereit") : t("noch offen")}</span>${next ? open(next[3]) : ""}`,
        t("die wichtigsten Schritte, damit Raumklima sinnvoll regeln kann")
      ),
      ...items.map(([label, on, where, target]) => this._row(label, `${chip(on, false)}${on ? "" : open(target)}`, where)),
      ...optional.map(([label, on, where, target]) => this._row(label, `${chip(on, true)}${on ? "" : open(target)}`, `${where} · ${t("bringt mehr Genauigkeit, ist aber nicht nötig")}`)),
    ];
    return rows.join("");
  },

  // Raum-Ebene: Aufheizrate & Co., Entscheidungen, Erklärung
  _learnRoom(r) {
    const a = r.attrs, s = a.settings || {}, h = s.heatup || {}, id = s.entry_id;
    if (!id || a.monitor) return "";
    const tab = this._ltabRoom || "why";
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
    const body = tab === "why" ? this._whyRows(id) : tab === "overview" ? overview : tab === "decisions" ? this._decisions(id) : this._howRows("room");
    return this._grp("learn", t("Lernen & Warum"), "mdi:chart-line", "eco", this._learnTabs(tab, ["why", "overview", "decisions", "how"]) + body);
  },

  // „Warum heizt der Raum (nicht)?“ – fragt die Integration (raumklima/room/why), nichts wird verändert
  _whyRows(id) {
    this._why = this._why || {};
    const res = this._why[id];
    if (!res || res.loading) {
      if (!res) {
        this._why[id] = { loading: true };
        Promise.resolve().then(() => this._whyFetch(id));
      }
      return `<div class="hint">${t("prüft …")}</div>`;
    }
    if (res.error) return `<div class="hint warn">${esc(res.error)}</div>`;
    if (!res.verdict) return `<div class="hint warn">${t("Keine Antwort – bitte Raumklima aktualisieren und neu starten.")}</div>`;
    const icon = (ok) => `<ha-icon icon="${ok ? "mdi:check-circle" : "mdi:alert-circle"}" style="color:var(${ok ? "--rk-ok" : "--rk-warn"})"></ha-icon>`;
    const state = { wins: [t("bestimmt das Ziel"), "heat"], later: [t("würde greifen – nachrangig"), "eco"], no: [t("greift nicht"), "off"], info: [t("Hinweis"), "warn"] };
    const checks = res.checks.map((c) => this._row(`${icon(c.ok)} ${esc(c.label)}`, this._v(c.text, !c.ok))).join("");
    const rules = res.rules.map((r) => {
      const [label, tone] = state[r.state] || ["", "off"];
      const val = r.target != null && r.state !== "no" ? ` · ${r.on ? `${fmt(r.target)} °C` : t("aus")}` : r.text ? ` · ${esc(r.text)}` : "";
      return `<div class="whyrule ${r.state}"><span class="chip2" style="--c:var(--rk-${tone})"><i></i>${label}</span> <b>${esc(r.label)}</b>${val}</div>`;
    }).join("");
    return `<div class="status"><span class="chip" style="--tone:var(${res.heating ? "--rk-heat" : "--rk-off"})"><ha-icon icon="${res.heating ? "mdi:fire" : "mdi:fire-off"}"></ha-icon>${esc(res.verdict)}</span>
      <button class="btn" data-whyrefresh="${id}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:refresh"></ha-icon>${t("Neu prüfen")}</button>
      <button class="btn" data-goto="roomtab:${id}:control" style="--c:var(--rk-heat)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Regelung")}</button>
      <button class="btn" data-goto="roomtab:${id}:schedule" style="--c:var(--rk-eco)"><ha-icon icon="mdi:calendar-clock"></ha-icon>${t("Zeitplan")}</button>
      <button class="btn" data-goto="roomtab:${id}:windows" style="--c:var(--rk-air)"><ha-icon icon="mdi:window-open-variant"></ha-icon>${t("Fenster & Lüften")}</button></div>
      ${res.mold_raised ? `<div class="hint warn">${t("Der Schimmelschutz hebt das Ziel gerade an (Feuchte).")}</div>` : ""}
      <div class="sub">${t("Voraussetzungen")}</div>${checks}
      ${res.valve != null ? this._row(t("Ventil"), this._v(`${fmt(res.valve, 0)} %`)) : ""}
      <div class="sub">${t("Regeln – die erste, die greift, bestimmt das Ziel")}</div><div class="whyrules">${rules}</div>`;
  },

  async _whyFetch(id) {
    try {
      this._why[id] = await this._hass.callWS({ type: "raumklima/room/why", entry_id: id });
    } catch (e) {
      this._why[id] = { error: t("Fehler: {e}", { e: e.message || e }) };
    }
    this._sig = null;
    this._render();
  },

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
  },

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
  },

  _decRoomChips() {
    const cur = this._decRoom || "all";
    const list = [["all", t("Alle Räume")], ...this._rooms.map((r) => [r.id, r.name])];
    return list.map(([id, name]) => `<button class="chip2 ${id === cur ? "" : "off"}" data-droom="${esc(id)}">${esc(name)}</button>`).join("");
  },

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
  },

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
  },

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
  },
};
