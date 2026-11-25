// Einstellungen-Karte – Ereignisse: Zeitpläne, Personen, Arbeitsplätze, Lüftfenster, Heizquellen.
// Teil von _bind() (siehe bind.js); Methoden der Klasse RaumklimaSettingsCard.
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const BindScheduleMethods = {
  _bindSchedule(k) {
    const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
    // Lüftfenster: gleiche Bedienung wie Zeitfenster, nur ohne Temperatur
    on("click", "[data-roomperson]", (el) => () => {
      const entry = el.dataset.entry;
      const cur = roomList(entry, "room_persons", []);
      const next = cur.includes(el.dataset.roomperson) ? cur.filter((x) => x !== el.dataset.roomperson) : [...cur, el.dataset.roomperson];
      this._setRoom(entry, { room_persons: next }, 300);
    });
    on("change", "[data-roompersonadd]", (el) => () => {
      const entry = el.dataset.roompersonadd;
      const value = el.value;
      if (!value) return;
      const cur = roomList(entry, "room_persons", []);
      if (!cur.includes(value)) this._setRoom(entry, { room_persons: [...cur, value] }, 300);
      el.blur();
    });
    on("click", "[data-guestroom]", (el) => () => {
      const rid = el.dataset.guestroom;
      const cur = [...(this._hubOpt("guests_rooms") || [])];
      const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
      this._local = this._local || {};
      this._local["hub:guests_rooms"] = next;
      this._setHub({ guests_rooms: next }, 300);
      this._flash(t("Gespeichert"));
    });
    on("click", "[data-haenergy]", () => () => {
      const items = ((this._haSug && this._haSug.items) || []).filter((x) => x.empty);
      const changes = {};
      for (const x of items) {
        const cur = this._hubOpt(x.key);
        if (cur === undefined || cur === null || cur === "" || cur === 0) changes[x.key] = x.value;
      }
      if (!Object.keys(changes).length) return;
      this._haSug = undefined; // nach dem Speichern neu fragen
      this._setHub(changes, 100);
      this._flash(t("Übernommen"));
    });
    on("click", "[data-tarfb]", (el) => () => {
      const id = el.dataset.tarfb;
      const cur = [...(this._hubOpt("energy_tariff_fallbacks") || [])];
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      this._local = this._local || {};
      this._local["hub:energy_tariff_fallbacks"] = next;
      this._setHub({ energy_tariff_fallbacks: next }, 300);
      this._flash(t("Gespeichert"));
    });
    on("click", "[data-workzone]", (el) => () => {
      const zid = el.dataset.workzone;
      const cur = [...(this._hubOpt("work_zones") || [])];
      const next = cur.includes(zid) ? cur.filter((x) => x !== zid) : [...cur, zid];
      this._local = this._local || {};
      this._local["hub:work_zones"] = next;
      this._setHub({ work_zones: next }, 300);
      this._flash(t("Gespeichert"));
    });
    on("click", "[data-horoom]", (el) => () => {
      const rid = el.dataset.horoom;
      const cur = [...(this._hubOpt("home_office_rooms") || [])];
      const next = cur.includes(rid) ? cur.filter((x) => x !== rid) : [...cur, rid];
      this._local = this._local || {};
      this._local["hub:home_office_rooms"] = next;
      this._setHub({ home_office_rooms: next }, 300);
      this._flash(t("Gespeichert"));
    });
    on("click", "[data-airadd]", (el) => () => {
      const id = el.dataset.airadd;
      const list = this._airList(id, []);
      if (list.length >= 6) return;
      list.push({ days: [], start: "04:45", end: "06:30" });
      this._pushAir(id);
    });
    on("click", "[data-airdel]", (el) => () => {
      const [id, i] = String(el.dataset.airdel).split("|");
      this._airList(id, []).splice(parseInt(i, 10), 1);
      this._pushAir(id);
    });
    on("click", "[data-airday]", (el) => () => {
      const [id, i, d] = String(el.dataset.airday).split("|");
      const w = this._airList(id, [])[parseInt(i, 10)];
      if (!w) return;
      const day = parseInt(d, 10);
      w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
      this._pushAir(id);
    });
    on("click", "[data-schedadd]", (el) => () => {
      const id = el.dataset.schedadd;
      const list = this._schedList(id, this._schedSeed(id) || []);
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
      const base = room ? (this._roomOpt(room, "comfort_temperature") ?? (room.attrs.settings || {}).comfort_temperature ?? 22) : 22;
      const first = list.length === 0;
      list.push({ days: [], start: "19:00", end: "21:00", temperature: Math.round(base * 2) / 2, sources: [] });
      this._pushSched(id);
      // Erstes Fenster: außerhalb absenken, sonst heizt der Raum dazwischen einfach weiter
      // auf die Wunschtemperatur (Issue #52). Eine bewusste Wahl bleibt unangetastet.
      const st = (room && room.attrs.settings) || {};
      if (first && room && !(st.changed || []).includes("schedule_fallback") && this._roomOpt(room, "schedule_fallback") === undefined) {
        this._setRoom(id, { schedule_fallback: "short" }, 700);
      }
    });
    on("click", "[data-schedsrc]", (el) => () => {
      const [id, i, sid] = sp(el.dataset.schedsrc);
      const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
      if (!w) return;
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
      const sources = ((room && room.attrs.heat_sources) || []).filter((x) => !x.untouched);
      const ids = sources.map((x) => x.id);
      const chosen = w.sources && w.sources.length ? [...w.sources] : [...ids];
      w.sources = chosen.includes(sid) ? chosen.filter((x) => x !== sid) : [...chosen, sid];
      if (w.sources.length === ids.length) w.sources = [];
      this._pushSched(id);
    });
    on("click", "[data-scheddel]", (el) => () => {
      const [id, i] = sp(el.dataset.scheddel);
      this._schedList(id, this._schedSeed(id) || []).splice(parseInt(i, 10), 1);
      this._pushSched(id);
    });
    on("click", "[data-schedday]", (el) => () => {
      const [id, i, d] = sp(el.dataset.schedday);
      const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
      if (!w) return;
      const day = parseInt(d, 10);
      w.days = w.days.includes(day) ? w.days.filter((x) => x !== day) : [...w.days, day].sort((a, b) => a - b);
      this._pushSched(id);
    });
    on("click", "[data-schedmove]", (el) => () => {
      const [id, i, dir] = sp(el.dataset.schedmove);
      const list = this._schedList(id, this._schedSeed(id) || []);
      const a = parseInt(i, 10);
      const b = a + parseInt(dir, 10);
      if (a < 0 || b < 0 || a >= list.length || b >= list.length) return;
      [list[a], list[b]] = [list[b], list[a]];
      this._pushSched(id);
    });
    on("click", "[data-schedsort]", (el) => async () => {
      const id = el.dataset.schedsort;
      const list = this._schedList(id, this._schedSeed(id) || []);
      list.sort((x, y) => {
        const a = rkSchedSortKey(x);
        const b = rkSchedSortKey(y);
        return a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]);
      });
      this._flash(t("Zeitfenster nach Uhrzeit sortiert"));
      this._pushSched(id);
    });
    on("click", "[data-schedtemp]", (el) => () => {
      const [id, i] = sp(el.dataset.schedtemp);
      const w = this._schedList(id, this._schedSeed(id) || [])[parseInt(i, 10)];
      if (!w) return;
      const v = Math.round((w.temperature + 0.5 * parseInt(el.dataset.d, 10)) * 2) / 2;
      w.temperature = Math.min(30, Math.max(5, v));
      this._pushSched(id);
    });
    on("change", "[data-srcfield]", (el) => () => {
      const [id, idx, field] = el.dataset.srcfield.split("|");
      const list = this._srcList(id);
      const item = list[parseInt(idx, 10)];
      if (!item) return;
      item[field] = el.value;
      this._setRoom(id, { heat_sources: list }, 700);
    });
    on("click", "[data-srcstep]", (el) => () => {
      const [id, idx, delta] = el.dataset.srcstep.split("|");
      const list = this._srcList(id);
      const item = list[parseInt(idx, 10)];
      if (!item) return;
      item.offset = Math.max(-5, Math.min(5, Math.round(((Number(item.offset) || 0) + Number(delta)) * 2) / 2));
      this._setRoom(id, { heat_sources: list }, 700);
    });
    on("click", "[data-srcuntouched]", (el) => () => {
      const [id, idx] = el.dataset.srcuntouched.split("|");
      const list = this._srcList(id);
      const item = list[parseInt(idx, 10)];
      if (!item) return;
      item.untouched = !item.untouched;
      this._setRoom(id, { heat_sources: list }, 700);
    });
    on("click", "[data-srcdel]", (el) => () => {
      const [id, idx] = el.dataset.srcdel.split("|");
      const list = this._srcList(id);
      list.splice(parseInt(idx, 10), 1);
      this._setRoom(id, { heat_sources: list }, 700);
    });
    on("click", "[data-srcadd]", (el) => () => {
      const id = el.dataset.srcadd;
      const sel = this._addSelect(el);
      const entity = sel ? sel.value : "";
      if (!entity) { this._flash(t("Bitte zuerst eine Quelle auswählen")); return; }
      const st = this._st(entity);
      const modes = (st && st.attributes && st.attributes.hvac_modes) || [];
      const type = modes.includes("cool") || modes.includes("fan_only") ? "ac" : "trv";
      const choice = (((this._cfg && this._cfg.choices && this._cfg.choices.climate) || []).find((x) => x.id === entity) || {});
      const list = this._srcList(id);
      list.push({ id: `src${Date.now()}`, entity, name: choice.name || this._name(entity), type, offset: 0, trigger: "", untouched: false });
      this._setRoom(id, { heat_sources: list }, 700);
    });
    on("click", "[data-seg]", (el) => () => apply(el.dataset.seg, { [el.dataset.key]: el.dataset.val }));
    // nach der Auswahl Fokus lösen, sonst wartet die Karte mit dem Aktualisieren (Schutz beim Tippen)
    on("input", "[data-selsearch]", (el) => () => {
      const wrap = el.closest("[data-selwrap]");
      const sel = wrap && wrap.querySelector("select");
      if (!sel) return;
      if (!sel._rkOptions) {
        sel._rkOptions = [...sel.options].map((o) => ({ value: o.value, text: o.textContent }));
      }
      const q = el.value.trim().toLowerCase();
      const current = sel.value;
      sel.innerHTML = sel._rkOptions
        .filter((o) => !q || o.text.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
        .map((o) => `<option value="${esc(o.value)}">${esc(o.text)}</option>`)
        .join("");
      if ([...sel.options].some((o) => o.value === current)) sel.value = current;
    });
    on("change", "[data-sel]", (el) => () => { el.blur(); apply(el.dataset.sel, { [el.dataset.key]: el.value || null }); });
    on("change", "[data-planmap]", (el) => () => {
      // Zeitplan je Plan (Issue #52): leer = wie sonst, sonst own/always/never/schedule.*
      el.blur();
      let map = {};
      try { map = JSON.parse(el.dataset.cur || "{}"); } catch (e) { map = {}; }
      if (el.value) map[el.dataset.planmap] = el.value; else delete map[el.dataset.planmap];
      apply(el.dataset.scope, { schedule_by_plan: map });
    });
    on("change", ".addrow select", (el) => () => el.blur());
    on("change", "[data-md]", (el) => () => {
      const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(el.value.trim());
      if (iso) { this._setHub({ [el.dataset.md]: `${iso[2]}-${iso[3]}` }, 200); return; }
      const m = /^(\d{1,2})[-.](\d{1,2})\.?$/.exec(el.value.trim());
      if (!m) { this._flash("Bitte als MM-TT eingeben, z. B. 10-01"); return; }
      // 01.10. (TT.MM.) oder 10-01 (MM-TT)
      const [mm, dd] = el.value.includes(".") ? [m[2], m[1]] : [m[1], m[2]];
      this._setHub({ [el.dataset.md]: `${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}` }, 200);
    });
  },
};
