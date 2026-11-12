// Einstellungen-Karte – Zeitplan und Lüftfenster eines Raums, Uhrzeit-Auswahl.
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const ScheduleMethods = {
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
  },

  _schedList(id, stored) {
    this._sched = this._sched || {};
    if (!(id in this._sched)) {
      this._sched[id] = (stored || []).map((w) => ({
        days: [...(w.days || [])],
        start: w.start || "19:00",
        end: w.end || "21:00",
        temperature: Number(w.temperature ?? 22),
        sources: [...(w.sources || [])],
      }));
    }
    return this._sched[id];
  },

  _schedLen(id) {
    return (this._sched[id] || []).length;
  }
  /** Minuten seit Mitternacht. */,

  _schedStart(w) {
    const [h, m] = String((w && w.start) || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  },

  _schedEnd(w) {
    const [h, m] = String((w && w.end) || "00:00").split(":").map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  },

  _pushSched(id) {
    const list = (this._sched[id] || []).map((w) => ({
      days: [...(w.days || [])].sort((a, b) => a - b),
      start: w.start,
      end: w.end,
      temperature: w.temperature,
      sources: [...(w.sources || [])].sort(),
    }));
    this._setRoom(id, { schedules: list }, 700);
  },

  _schedWin(id, w, i, ro) {
    const days = w.days || [];
    const on = (d) => !days.length || days.includes(d);
    const btn = [0, 1, 2, 3, 4, 5, 6]
      .map((d) => `<button class="d ${on(d) ? "on" : ""}" data-schedday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`)
      .join("");
    return `<div class="sched">
      <div class="days">${btn}</div>
      ${this._tmBtn("sched:" + id + "|" + i + "|start", w.start, ro, t("von"))}
      ${this._tmBtn("sched:" + id + "|" + i + "|end", w.end, ro, t("bis"))}
      <span class="v temp">${fmt(w.temperature)} °C</span>
      ${ro ? "" : `<div class="stepper"><button data-schedtemp="${id}|${i}" data-d="-1" aria-label="${t("weniger")}">−</button><button data-schedtemp="${id}|${i}" data-d="1" aria-label="${t("mehr")}">+</button></div>
      <div class="stepper mv"><button data-schedmove="${id}|${i}|-1" title="${t("nach oben")}" aria-label="${t("nach oben")}" ${i === 0 ? "disabled" : ""}>▲</button><button data-schedmove="${id}|${i}|1" title="${t("nach unten")}" aria-label="${t("nach unten")}" ${i === this._schedLen(id) - 1 ? "disabled" : ""}>▼</button></div>
      <button class="del" data-scheddel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
  },

  _schedSourcesRow(id, w, i, ro) {
    const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
    const sources = (room && room.attrs.heat_sources) || [];
    if (!sources.length) return "";
    const chosen = w.sources || [];
    const all = chosen.length === 0;
    const chips = sources.map((src) => {
      const on = all || chosen.includes(src.id);
      const off = src.untouched ? " off" : "";
      const dis = ro || src.untouched ? " disabled" : "";
      return `<button class="chip2 ${on ? "" : "off"}${off}" data-schedsrc="${id}|${i}|${esc(src.id)}" title="${esc(src.entity)}"${dis}><i></i>${esc(src.name)}</button>`;
    }).join("");
    return this._row("Quellen", `<div class="chips">${chips}</div>`, all ? t("alle Quellen – antippen schließt eine aus") : t("nur die gewählten Quellen"));
  },

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
    const rows = [];
    const boostRows = [
      this._row(
        "Wärmer für kurze Zeit (Boost)",
        editable ? this._num(scope, "boost_temperature", boostTemp) : this._v(`${fmt(boostTemp, 1)} K`),
        t("so viel wärmer als die Wunschtemperatur – der Knopf „Wärmer“ am Raum startet ihn")
      ),
      this._row(
        "Dauer des Boosts",
        editable ? this._num(scope, "boost_minutes", boostMin) : this._v(`${boostMin} min`),
        t("danach gilt wieder Zeitplan bzw. Automatik")
      ),
    ];
    const moreRows = [
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
        "Zeitplan überschreiben",
        editable ? this._num(scope, "override_minutes", this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120) : this._v(`${this._roomOpt(r, "override_minutes") ?? s.override_minutes ?? 120} min`),
        t("so lange gilt deine Handverstellung (HA oder Alexa), danach wieder der Zeitplan – 0 schaltet es aus")
      ),
      this._row(
        "Boost für",
        editable ? this._select(scope, "boost_sources", [
          { id: "selected", name: t("im Zeitplan gewählt") },
          { id: "all", name: t("alle Quellen") },
          { id: "first", name: t("nur die priorisierte") },
        ], this._roomOpt(r, "boost_sources") ?? "selected") : this._v(
          ({ selected: t("im Zeitplan gewählt"), all: t("alle Quellen"), first: t("nur die priorisierte") })[this._roomOpt(r, "boost_sources") ?? "selected"]
        ),
        t("welche Quellen der Boost ansteuert – die anderen bleiben in diesem Moment aus")
      ),
    ];
    if (!list.length) {
      rows.push(this._row("Zeitfenster", this._v("keine – die Automatik regelt wie gewohnt", true), t("z. B. abends 19–21 Uhr wärmer")));
    } else {
      list.forEach((w, i) => {
        rows.push(this._row(t("Zeitfenster {n}", { n: i + 1 }), this._schedWin(id, w, i, ro), esc(schedDaysLabel(w.days))));
        rows.push(this._schedSourcesRow(id, w, i, ro));
      });
    }
    if (!ro && list.length && !shared) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div class="addrow"><button class="add" data-schedsort="${id}"><ha-icon icon="mdi:sort-clock-ascending-outline"></ha-icon>${t("nach Uhrzeit sortieren")}</button><span class="hint">${t("Reihenfolge zählt nur, wenn sich Fenster überschneiden – dann gewinnt das untere")}</span></div></div>`);
    }
    if (!ro && !shared) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-schedadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
    }
    rows.push(...boostRows);
    rows.push(this._more("sched-more", "Weitere Einstellungen", moreRows.join(""), r, ["schedule_from", "schedule_fallback", "override_minutes", "boost_sources"]));
    return this._grp("heating", "Zeitplan", "mdi:calendar-clock", "eco", rows.join(""), "span");
  },

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
  },

  _pushAir(id) {
    const list = (this._air[id] || []).map((w) => ({ days: [...(w.days || [])].sort((a, b) => a - b), start: w.start, end: w.end }));
    this._setRoom(id, { airing_windows: list }, 700);
  },

  _airWin(id, w, i, ro) {
    const days = w.days || [];
    const on = (d) => !days.length || days.includes(d);
    const btn = [0, 1, 2, 3, 4, 5, 6]
      .map((d) => `<button class="d ${on(d) ? "on" : ""}" data-airday="${id}|${i}|${d}" title="${esc(schedDayName(d))}">${esc(schedDayName(d))}</button>`)
      .join("");
    return `<div class="sched">
      <div class="days">${btn}</div>
      ${this._tmBtn("air:" + id + "|" + i + "|start", w.start, ro, t("von"))}
      ${this._tmBtn("air:" + id + "|" + i + "|end", w.end, ro, t("bis"))}
      ${ro ? "" : `<button class="del" data-airdel="${id}|${i}" title="${t("entfernen")}" aria-label="${t("entfernen")}"><ha-icon icon="mdi:close"></ha-icon></button>`}
    </div>`;
  },

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
    const rows = [];
    const learnRows = [
      this._row(
        "Gewohntes Lüften erkennen",
        editable ? this._optToggle(scope, "learn_airing", !!learn) : this._v(learn ? t("an") : t("aus")),
        learned ? t("erkannt: {n}× im gleichen Zeitraster (4 Wochen)", { n: learned }) : t("lernt, wann du regelmäßig länger lüftest – dort dann keine Erinnerungen")
      ),
    ];
    const moreRows = [
      this._row(
        "Mindestdauer Lüften",
        editable
          ? this._num(scope, "airing_min_minutes", airMin)
          : this._v(airMin ? `${airMin} min` : t("automatisch")),
        airMin
          ? t("so lange bleibt „Lüften läuft“ mindestens stehen, auch wenn die Feuchte schon passt")
          : t("automatisch: 60 % der empfohlenen Dauer, mindestens 4 Minuten (gerade {v} min)", { v: recMin })
      ),
      this._row(
        "Dauerlüftung ab",
        editable ? this._num(scope, "long_airing_minutes", longMin) : this._v(`${longMin} min`),
        t("danach keine Erinnerungen mehr, bis das Fenster zu ist – 0 schaltet es aus")
      ),
      this._row(
        "Leise Erinnerung danach",
        editable ? this._num(scope, "long_airing_remind", lateMin) : this._v(`${lateMin} min`),
        t("eine einzige, stille Meldung bei sehr langem Lüften – 0 = aus")
      ),
      ...(presEff.length ? [this._row(
        "Nur wenn jemand im Raum war",
        editable ? this._optToggle(scope, "airing_occupied_only", this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true) : this._v((this._roomOpt(r, "airing_occupied_only") ?? s.airing_occupied_only ?? true) ? t("an") : t("aus")),
        t("kein „bitte lüften“ in leeren Räumen – nur mit Präsenzmelder möglich")
      )] : []),
    ];
    if (!list.length) {
      rows.push(this._row("Lüftfenster", this._v("keine – es wird normal erinnert", true), t("z. B. Training morgens: in dieser Zeit keine Hinweise")));
    } else {
      list.forEach((w, i) => rows.push(this._row(t("Lüftfenster {n}", { n: i + 1 }), this._airWin(id, w, i, ro), esc(schedDaysLabel(w.days)))));
    }
    if (!ro && list.length < 6) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div><button class="add" data-airadd="${id}"><ha-icon icon="mdi:plus"></ha-icon>${t("Zeitfenster hinzufügen")}</button></div></div>`);
    }
    rows.push(...learnRows);
    rows.push(this._more("airing-more", "Weitere Einstellungen", moreRows.join(""), r, ["airing_min_minutes", "long_airing_minutes", "long_airing_remind", "airing_occupied_only"]));
    return this._grp("air", "Lüften ohne Erinnerung", "mdi:weather-windy-variant", "air", rows.join(""), "span");
  },

  // Uhrzeit eines Zeitfensters: Knopf öffnet den Zeitwähler (Viertelstunden, freie Eingabe möglich)
  _tmBtn(key, val, ro, label) {
    const v = String(val || "").slice(0, 5);
    return `<button class="tm timebtn" data-timeopen="${esc(key)}" data-val="${esc(v)}" ${ro ? "disabled" : ""} aria-label="${esc(label)}" title="${esc(label)}">${esc(v || "–:–")}</button>`;
  },

  // Gewählte Uhrzeit in ein Zeitplan- oder Lüftfenster übernehmen ("sched:<raum>|<i>|start").
  _setWinTime(key, v) {
    const [kind, rest] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
    const [id, i, which] = rest.split("|");
    if (which !== "start" && which !== "end") return false;
    const list = kind === "sched" ? this._schedList(id, this._schedSeed(id) || []) : kind === "air" ? this._airList(id, []) : null;
    const w = list && list[parseInt(i, 10)];
    if (!w) return false;
    w[which] = v;
    if (kind === "sched") this._pushSched(id); else this._pushAir(id);
    this._render();
    return true;
  },

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
  },

  _openTime(key, val) {
    const pop = this.shadowRoot.querySelector("[data-tpick]");
    if (!pop) return;
    pop.hidden = false;
    const [hRaw, mRaw] = String(val || "07:00").split(":");
    const h = Math.max(0, Math.min(23, parseInt(hRaw, 10) || 0));
    const m = Math.max(0, Math.min(3, Math.round((parseInt(mRaw, 10) || 0) / 15)));
    // Genaue Minuten (z. B. 06:50) im Feld zeigen – die Räder stehen auf der nächsten Viertelstunde
    const exact = /^\d{1,2}:\d{2}$/.test(String(val || "")) ? `${String(h).padStart(2, "0")}:${String(Math.max(0, Math.min(59, parseInt(mRaw, 10) || 0))).padStart(2, "0")}` : null;
    this._tp = { key, h, m, open: true, text: exact || undefined };
    pop.querySelector("[data-twh]").scrollTop = h * 40;
    pop.querySelector("[data-twmn]").scrollTop = m * 40;
    pop.querySelector("[data-tin]").value = exact || `${String(h).padStart(2, "0")}:${String(m * 15).padStart(2, "0")}`;
    this._timeMark(pop);
  },

  _timeMark(pop) {
    pop.querySelectorAll("[data-th]").forEach((b) => b.classList.toggle("on", Number(b.dataset.th) === this._tp.h));
    pop.querySelectorAll("[data-tm]").forEach((b) => b.classList.toggle("on", Number(b.dataset.tm) === this._tp.m));
  },

  // Nach einem Neuzeichnen (z. B. Speichern im Hintergrund) den offenen Zeitwähler wieder zeigen
  _reopenTime() {
    const tp = this._tp;
    if (!tp || !tp.open) return;
    const pop = this.shadowRoot.querySelector("[data-tpick]");
    if (!pop) return;
    pop.hidden = false;
    pop.querySelector("[data-twh]").scrollTop = tp.h * 40;
    pop.querySelector("[data-twmn]").scrollTop = tp.m * 40;
    pop.querySelector("[data-tin]").value = tp.text || `${String(tp.h).padStart(2, "0")}:${String(tp.m * 15).padStart(2, "0")}`;
    this._timeMark(pop);
  },

  _timeSync(pop) {
    if (!this._tp) return;
    const h = Math.round(pop.querySelector("[data-twh]").scrollTop / 40);
    const m = Math.round(pop.querySelector("[data-twmn]").scrollTop / 40);
    const nh = Math.max(0, Math.min(23, h)), nm = Math.max(0, Math.min(3, m));
    if (this._tp.text && nh === this._tp.h && nm === this._tp.m) return; // Räder nur nachgerückt – genaue Eingabe behalten
    this._tp.text = undefined;
    this._tp.h = nh;
    this._tp.m = nm;
    this._timeMark(pop);
    pop.querySelector("[data-tin]").value = `${String(this._tp.h).padStart(2, "0")}:${String(this._tp.m * 15).padStart(2, "0")}`;
  },
};
