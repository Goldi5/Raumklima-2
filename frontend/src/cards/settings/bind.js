// Einstellungen-Karte – Ereignisse: ein zentraler Verteiler und alle Handler der Einstellungsseite.
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const BindMethods = {
  // Ein Listener je Ereignistyp an der Schatten-Wurzel. Er läuft vom Ziel nach außen (wie das
  // normale Aufsteigen eines Ereignisses) und ruft jeden passenden Handler; stopPropagation() im
  // Handler beendet den Lauf wie gewohnt. Neu gezeichnete Teile brauchen so kein neues Anbinden.
  _delegate() {
    if (this._delegating) return;
    this._delegating = true;
    for (const type of ["click", "change", "input", "keydown"]) {
      this.shadowRoot.addEventListener(type, (ev) => {
        for (let node = ev.target; node && node !== this.shadowRoot; node = node.parentNode) {
          if (node.nodeType !== 1) continue;
          for (const h of this._handlers || []) {
            if (h.type === type && node.matches(h.sel)) h.make(node)(ev);
          }
          if (ev.cancelBubble) break;
        }
      });
    }
  },

  // Auswahl neben einem Hinzufügen-Knopf: relativ suchen (nicht über eine ID) und den
  // Fokus lösen, damit _renderSoon das Neuzeichnen nicht bis zum Verlassen des Feldes zurückhält.
  _addSelect(el) {
    const sel = (el.closest(".addrow") || el.parentElement || el).querySelector("select");
    if (sel) sel.blur();
    return sel;
  },

  _bind() {
    // Alle Klicks/Änderungen laufen über einen Verteiler an der Wurzel (siehe _delegate):
    // on(typ, selektor, (el) => handler) – handler bekommt das Ereignis wie bei addEventListener.
    this._handlers = [];
    const on = (type, sel, make) => this._handlers.push({ type, sel, make });
    this._delegate();
    const $ = (sel) => this.shadowRoot.querySelectorAll(sel);
    const ws = (msg) => this._hass.callWS(msg).catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    on("click", "[data-tab]", (el) => () => {
      this._tab = el.dataset.tab;
      this._search = "";
      if (this._nav2) { this._section = "rooms"; this._group = null; }
      this._sig = null;
      this._render();
    });
    on("click", "[data-section]", (el) => () => {
      this._section = el.dataset.section;
      this._search = "";
      if (this._section === "rooms") this._tab = "general";
      this._group = null;
      try { localStorage.setItem("raumklima-settings-section", this._section); } catch (e) { /* ignorieren */ }
      this._sig = null;
      this._render();
    });
    on("click", "[data-nav2]", () => {
      this._nav2 = !this._nav2;
      this._group = null;
      try { localStorage.setItem("raumklima-settings-nav-v2", this._nav2 ? "1" : "0"); } catch (e) { /* ignorieren */ }
      this._sig = null;
      this._render();
    });
    on("click", "[data-roomtab]", (el) => () => {
      this._roomTab = el.dataset.roomtab;
      this._sig = null;
      this._render();
    });
    on("click", "[data-goto]", (el) => () => this._goto(el.dataset.goto));
    on("click", "[data-goto-room]", (el) => () => this._gotoRoomByEntry(el.dataset.gotoRoom));
    on("keydown", "[data-goto-room]", (el) => (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      ev.preventDefault();
      this._gotoRoomByEntry(el.dataset.gotoRoom);
    });
    on("click", "[data-applyall]", (el) => () => {
      this._applyToAllRooms(el.dataset.applyall);
    });
    on("click", "[data-roomboost]", (el) => () => {
      const mode = el.dataset.roomboost === "off" ? "off" : "minutes";
      const minutes = Number(el.dataset.min || 0);
      const payload = { type: "raumklima/boost", entry_id: el.dataset.entry, mode };
      if (mode === "minutes" && minutes > 0) payload.minutes = minutes;
      this._hass.callWS(payload)
        .then(() => { this._flash(t("Schnell-Override gesetzt")); this._render(); })
        .catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    });
    on("click", "[data-copyroom]", (el) => () => {
      this._copyRoom = el.dataset.copyroom;
      this._sig = null;
      this._render();
    });
    on("click", "[data-copyroom-close]", () => () => {
      this._copyRoom = null;
      this._sig = null;
      this._render();
    });
    on("click", "[data-copyroom-go]", (el) => () => {
      this._copyRoomGo(el.dataset.copyroomGo);
    });
    on("click", "[data-template-save]", (el) => () => {
      this._saveRoomTemplate(el.dataset.templateSave);
    });
    on("click", "[data-template-apply]", (el) => () => {
      this._applyRoomTemplate(el.dataset.templateApply);
    });
    on("click", "[data-template-delete]", (el) => () => {
      this._deleteRoomTemplate(el.dataset.templateDelete);
    });
    on("click", ".railbtn", (el) => () => {
      if (el.dataset.section) return;
      this._group = el.dataset.g;
      this._filter();
    });
    on("click", "[data-lmove]", (el) => () => {
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
    });
    on("click", "[data-lsize]", (el) => () => {
      const L = this._layout;
      this._layout = { ...L, size: { ...(L.size || {}), [el.dataset.lsize]: el.dataset.v } };
      this._layoutSave();
      this._sig = null;
      this._render();
    });
    on("click", "[data-lcolor]", (el) => () => {
      const L = this._layout;
      this._layout = { ...L, color: { ...(L.color || {}), [el.dataset.lcolor]: el.dataset.v } };
      this._layoutSave();
      this._sig = null;
      this._render();
    });
    on("click", "[data-lsave]", (el) => () => this._layoutSave());
    on("click", "[data-resetroom]", (el) => () => {
      if (!window.confirm(t("Alle Einstellungen dieses Raums auf Standard zurücksetzen? Geräte und Wohnung bleiben erhalten."))) return;
      ws({ type: "raumklima/room/reset", entry_id: el.dataset.resetroom })
        .then(() => this._flash(t("Auf Standard zurückgesetzt")))
        .catch(() => {});
    });
    on("click", "details.more > summary", (el) => () => {
      const d = el.parentElement;
      this._moreOpen.set(d.dataset.more, !d.open); // der Klick schaltet gleich um
      d.dataset.open = d.open ? "0" : "1";
    });
    on("click", "details.sched-collapse > summary", (el) => () => {
      const d = el.parentElement;
      this._schedOpen = this._schedOpen || new Map();
      this._schedOpen.set(d.dataset.schedcollapse, !d.open); // der Klick schaltet gleich um
    });
    on("click", "[data-pro]", (el) => () => {
      this._pro = !this._pro;
      this._moreOpen.clear();
      try { localStorage.setItem("raumklima-settings-pro", this._pro ? "1" : "0"); } catch (e) { /* privat */ }
      this._render();
    });
    const search = this.shadowRoot.querySelector("#rks");
    if (search) search.addEventListener("input", () => {
      this._search = search.value;
      const body = this.shadowRoot.getElementById("rkbody");
      if (body) { body.innerHTML = this._bodyHtml(); this._filter(); }
      else this._filter();
    });
    on("click", "[data-tgl]", (el) => () => this._hass.callService("switch", "toggle", { entity_id: el.dataset.tgl }));
    on("click", "[data-press]", (el) => () => this._hass.callService("button", "press", { entity_id: el.dataset.press }));
    on("click", "[data-num]", (el) => () => {
      const s = this._st(el.dataset.num);
      if (!s) return;
      const step = parseFloat(s.attributes.step) || 1;
      const min = parseFloat(s.attributes.min), max = parseFloat(s.attributes.max);
      let v = Math.round((parseFloat(s.state) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
      if (!isNaN(min)) v = Math.max(min, v);
      if (!isNaN(max)) v = Math.min(max, v);
      this._hass.callService("number", "set_value", { entity_id: el.dataset.num, value: v });
    });
    const apply = (scope, changes) => {
      if (scope === "hub") this._setHub(changes);
      else this._setRoom(scope.slice(5), changes);
    };
    on("click", "[data-opt]", (el) => () => {
      const step = parseFloat(el.dataset.step), min = parseFloat(el.dataset.min), max = parseFloat(el.dataset.max);
      const cur = parseFloat(el.dataset.val);
      let v = Math.round(((isNaN(cur) ? min : cur) + step * parseInt(el.dataset.d, 10)) * 100) / 100;
      v = Math.min(max, Math.max(min, v));
      apply(el.dataset.opt, { [el.dataset.key]: v });
    });
    on("click", "[data-setopt]", (el) => () => apply(el.dataset.setopt, { [el.dataset.key]: parseFloat(el.dataset.v) }));
    on("click", "[data-optbool]", (el) => () => apply(el.dataset.optbool, { [el.dataset.key]: el.dataset.val !== "1" }));
    // Wert antippen und direkt tippen (statt nur +/- zu drücken)
    on("click", ".stepper span", (span) => () => {
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
    });
    // Zeitplan bearbeiten: jede Änderung geht gesammelt (700 ms Pause) an den Raum
    const sp = (v) => String(v).split("|");
    // Lüftfenster: gleiche Bedienung wie Zeitfenster, nur ohne Temperatur
    on("click", "[data-roomperson]", (el) => () => {
      const entry = el.dataset.entry;
      const cur = roomList(entry, "room_persons", []);
      const next = cur.includes(el.dataset.roomperson) ? cur.filter((x) => x !== el.dataset.roomperson) : [...cur, el.dataset.roomperson];
      this._setRoom(entry, { room_persons: next }, 300);
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
      list.push({ days: [], start: "19:00", end: "21:00", temperature: Math.round(base * 2) / 2, sources: [] });
      this._pushSched(id);
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
    on("change", "[data-sel]", (el) => () => { el.blur(); apply(el.dataset.sel, { [el.dataset.key]: el.value || null }); });
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
    on("click", "[data-ltab]", (el) => () => {
      if (this._tab === "general") this._ltabHub = el.dataset.ltab; else this._ltabRoom = el.dataset.ltab;
      this._dec = {}; this._render();
    });
    on("click", "[data-whyrefresh]", (el) => () => { this._why = this._why || {}; delete this._why[el.dataset.whyrefresh]; this._render(); });
    on("click", "[data-drange]", (el) => () => { this._decRange = Number(el.dataset.drange); this._dec = {}; this._render(); });
    on("click", "[data-dcat]", (el) => () => { this._decCat = el.dataset.dcat; this._dec = {}; this._render(); });
    on("click", "[data-droom]", (el) => () => { this._decRoom = el.dataset.droom; this._dec = {}; this._render(); });
    on("click", "[data-timeopen]", (el) => () => this._openTime(el.dataset.timeopen, el.dataset.val));
    const tpop = this.shadowRoot.querySelector("[data-tpick]");
    if (tpop) {
      let tid = 0;
      ["[data-twh]", "[data-twmn]"].forEach((sel) => tpop.querySelector(sel).addEventListener("scroll", () => {
        clearTimeout(tid);
        tid = setTimeout(() => this._timeSync(tpop), 90);
      }));
      // Antippen einer Zahl im Rad: dorthin drehen (sonst ginge nur Wischen)
      tpop.querySelectorAll("[data-th], [data-tm]").forEach((b) => b.addEventListener("click", () => {
        const wheel = b.parentElement;
        const i = Number(b.dataset.th ?? b.dataset.tm);
        if (wheel.scrollTo) wheel.scrollTo({ top: i * 40, behavior: "smooth" }); else wheel.scrollTop = i * 40;
      }));
      tpop.querySelector("[data-tclose]").addEventListener("click", () => { tpop.hidden = true; if (this._tp) this._tp.open = false; });
      tpop.querySelector("[data-tok]").addEventListener("click", () => {
        const v = rkTimeValue(tpop.querySelector("[data-tin]").value);
        if (!v) { this._flash(t("Bitte Uhrzeit als HH:MM eingeben")); return; }
        const key = this._tp && this._tp.key;
        tpop.hidden = true;
        if (this._tp) this._tp.open = false;
        if (!key) return;
        if (/^(sched|air):/.test(key)) this._setWinTime(key, v);
        else this._setHub({ [key]: v + ":00" }, 200);
      });
      tpop.querySelector("[data-tin]").addEventListener("input", (ev) => {
        if (this._tp) this._tp.text = ev.target.value;
        const v = rkTimeValue(ev.target.value);
        if (!v) return;
        const [h, m] = v.split(":");
        const hh = Math.max(0, Math.min(23, parseInt(h, 10) || 0));
        const mm = Math.max(0, Math.min(3, Math.round((parseInt(m, 10) || 0) / 15)));
        // Räder nachführen, ohne dass sie die genaue Eingabe (z. B. 22:50) wieder auf 22:45 runden
        if (this._tp) { this._tp.h = hh; this._tp.m = mm; this._tp.text = ev.target.value; }
        tpop.querySelector("[data-twh]").scrollTop = hh * 40;
        tpop.querySelector("[data-twmn]").scrollTop = mm * 40;
      });
    }
    on("change", "[data-time]", (el) => () => {
      const key = el.dataset.time;
      const v = rkTimeValue(el.value);
      if (!v) {
        this._flash(t("Bitte Uhrzeit als HH:MM eingeben"));
        el.value = String(this._hubOpt(key) || "").slice(0, 5);
        return;
      }
      el.value = v;
      this._setHub({ [key]: v + ":00" }, 200);
    });
    on("click", "[data-person]", (el) => () => {
      const list = [...(this._hubOpt("residents") || [])];
      const i = list.indexOf(el.dataset.person);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.person);
      this._setHub({ residents: list });
    });
    on("click", "[data-home]", (el) => () => {
      this._home = el.dataset.home; this._tab = "general"; this._local = {}; this._sig = null; this._load();
    });
    on("change", "[data-hubnum]", (el) => () => {
      const v = el.value.trim() === "" ? null : Math.max(0, Math.min(20000, parseFloat(el.value.replace(",", "."))));
      this._setHub({ [el.dataset.hubnum]: Number.isNaN(v) ? null : v }, 200);
    });
    on("change", "[data-hubtext]", (el) => () => this._setHub({ [el.dataset.hubtext]: el.value.trim() }, 200));
    on("click", "[data-geohass]", (el) => () => {
      const c = this._hass.config || {};
      this._setHub({ latitude: c.latitude, longitude: c.longitude }, 200);
    });
    on("click", "[data-geoclear]", (el) => () => this._setHub({ latitude: null, longitude: null }, 200));
    on("change", "[data-hubgeo]", (el) => () => {
      const key = el.dataset.hubgeo;
      const limit = key === "latitude" ? 90 : 180;
      const raw = el.value.trim().replace(",", ".");
      const v = raw === "" ? null : Math.max(-limit, Math.min(limit, parseFloat(raw)));
      this._setHub({ [key]: Number.isNaN(v) ? null : v }, 200);
    });
    on("click", "[data-mkdash]", (el) => async () => {
      const p = el.dataset.mkdash;
      const made = await this._ensureDashboard(p, this._hubOpt("name") || p, this._cfg.hub.entry_id);
      this._flash(made ? t("Dashboard „{d}“ angelegt", { d: made }) : t("Anlegen nicht möglich – bitte in den Einstellungen unter Dashboards prüfen"));
      if (made) { await this._load(); } else { this._render(); }
    });
    on("click", "[data-addroom]", () => async () => {
      const name = (this.shadowRoot.getElementById("newRoomName") || {}).value?.trim() || "";
      const trv = (this.shadowRoot.getElementById("newRoomTrv") || {}).value || "";
      const temp = (this.shadowRoot.getElementById("newRoomTemp") || {}).value || "";
      if (!name || !temp) { this._flash(t("Name und Temperaturfühler wählen")); return; }
      try {
        const r = await this._hass.callWS({ type: "raumklima/room/create", name, trv, temperature_sensor: temp });
        this._tab = "general"; this._section = "rooms"; this._roomTab = "overview";
        this._flash(t("Raum „{n}“ angelegt", { n: name }));
        await this._load();
        if (r && r.entry_id) this._gotoRoomByEntry(r.entry_id);
      } catch (e) { this._flash(t("Fehler: {e}", { e: e.message || e })); }
    });
    on("click", "[data-deleteroom]", (el) => () => this._deleteRoom(el.dataset.deleteroom));
    on("click", "[data-onboard]", () => () => this._onboardStart());
    on("click", "[data-onbnext]", () => () => this._onboardNext(1));
    on("click", "[data-onbback]", () => () => this._onboardNext(-1));
    on("click", "[data-onbclose]", () => () => this._onboardClose());
    on("click", "[data-onbfinish]", () => () => this._onboardFinish());
    on("click", '[data-onbtype="toggle"]', (el) => () => {
      el.classList.toggle("on");
      el.dataset.val = el.classList.contains("on") ? "1" : "0";
      this._onboardCollect();
      this._render();
    });
    on("click", "[data-newhome]", (el) => async () => {
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
    });
    const roomList = (entry, key, fallback) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const s = (room && room.attrs.settings) || {};
      return [...((room && this._roomOpt(room, key)) ?? s[key] ?? fallback)];
    };
    const mailbox = this.shadowRoot.querySelector("[data-mailbox]");
    if (mailbox) mailbox.addEventListener("toggle", () => { this._mailOpen = mailbox.open; });
    on("input", "[data-mail]", (el) => () => { this._mailForm = { ...(this._mailForm || {}), [el.dataset.mail]: el.value }; });
    on("click", "[data-mailprov]", (el) => () => {
      const p = RK_MAIL_PROVIDERS[el.dataset.mailprov];
      this.shadowRoot.querySelectorAll("[data-mailprov]").forEach((b) => b.classList.toggle("on", b === el));
      if (!p) return;
      this._mailForm = { ...(this._mailForm || {}), mail_server: p[0], mail_port: String(p[1]), mail_security: p[2] };
      for (const [k, v] of Object.entries({ mail_server: p[0], mail_port: p[1] })) {
        const inp = this.shadowRoot.querySelector(`[data-mail="${k}"]`);
        if (inp) inp.value = v;
      }
      this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b.dataset.mailsec === p[2]));
    });
    on("click", "[data-mailsec]", (el) => () => {
      this._mailForm = { ...(this._mailForm || {}), mail_security: el.dataset.mailsec };
      this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b === el));
    });
    const mailSettings = () => {
      const f = { ...(this._mailForm || {}) };
      const out = {};
      for (const k of ["mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to"]) {
        if (f[k] === undefined) continue;
        out[k] = k === "mail_port" ? (f[k] === "" ? null : parseInt(f[k], 10)) : String(f[k]).trim();
      }
      return out;
    };
    on("click", "[data-mailtoggle]", (el) => () => {
      if (this._hubOpt("report_email")) { this._setHub({ report_email: null }, 200); return; }
      if (this._hubOpt("mail_server") && this._hubOpt("mail_to")) { this._setHub({ report_email: "raumklima" }, 200); return; }
      this._mailOpen = true; // erst einrichten – Speichern schaltet ein
      this._mailMsg = ["", t("Bitte erst unten die Zugangsdaten eintragen und speichern.")];
      this._sig = null; this._render();
    });
    on("click", "[data-mailcheck]", (el) => async () => {
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
    });
    on("click", "[data-mailsave]", (el) => async () => {
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
    });
    on("click", "[data-help]", (el) => (ev) => {
      ev.stopPropagation();
      const k = el.dataset.help;
      if (this._helpOpen.has(k)) this._helpOpen.delete(k); else this._helpOpen.add(k);
      this._sig = null; this._render();
    });
    on("click", "[data-rpdf]", (el) => () => {
      const list = [...(this._hubOpt("report_pdf") ?? ["week", "month", "season"])];
      const i = list.indexOf(el.dataset.rpdf);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.rpdf);
      this._setHub({ report_pdf: list });
    });
    on("click", "[data-pdftest]", (el) => async () => {
      el.disabled = true;
      const r = await ws({ type: "raumklima/report/pdf/create", kind: "week", send: true, ...this._homeMsg() });
      el.disabled = false;
      if (r) this._flash(t("Bericht gesendet: {f}", { f: r.file }));
    });
    on("click", "[data-presrm]", (el) => () => {
      this._setRoom(el.dataset.entry, { presence_sensors: roomPres(el.dataset.entry).filter((x) => x !== el.dataset.presrm) }, 200);
    });
    on("click", "[data-presadd]", (el) => () => {
      const sel = this._addSelect(el);
      if (sel && sel.value) this._setRoom(el.dataset.presadd, { presence_sensors: [...roomPres(el.dataset.presadd), sel.value] }, 200);
    });
    const roomLights = (entry) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const local = room ? this._roomOpt(room, "presence_lights") : null;
      return [...(local || [])];
    };
    on("click", "[data-plightadd]", (el) => () => {
      const sel = this._addSelect(el);
      if (sel && sel.value) this._setRoom(el.dataset.plightadd, { presence_lights: [...roomLights(el.dataset.plightadd), sel.value] }, 200);
    });
    on("click", "[data-plightrm]", (el) => () => {
      this._setRoom(el.dataset.entry, { presence_lights: roomLights(el.dataset.entry).filter((e) => e !== el.dataset.plightrm) }, 200);
    });
    const roomPres = (entry) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const local = room && this._roomOpt(room, "presence_sensors");
      return [...(local ?? Object.keys(((room && room.attrs.settings) || {}).presence_sensors || {}))];
    };
    on("click", "[data-lightrm]", (el) => () => {
      this._setRoom(el.dataset.entry, { signal_lights: roomList(el.dataset.entry, "signal_lights", []).filter((x) => x !== el.dataset.lightrm) }, 200);
    });
    on("click", "[data-lightadd]", (el) => () => {
      const sel = this._addSelect(el);
      if (sel && sel.value) this._setRoom(el.dataset.lightadd, { signal_lights: [...roomList(el.dataset.lightadd, "signal_lights", []), sel.value] }, 200);
    });
    on("click", "[data-lsig]", (el) => () => {
      const list = roomList(el.dataset.entry, "light_signals", ["open", "close"]);
      const i = list.indexOf(el.dataset.lsig);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.lsig);
      this._setRoom(el.dataset.entry, { light_signals: list }, 600);
    });
    on("click", "[data-lighttest]", (el) => async () => {
      const r = await ws({ type: "raumklima/room/light_test", entry_id: el.dataset.lighttest });
      if (r) this._flash("Lampen blinken blau");
    });
    on("click", "[data-sigrm]", (el) => () => {
      this._setHub({ sleep_signals: (this._hubOpt("sleep_signals") || []).filter((x) => x !== el.dataset.sigrm) });
    });
    on("click", "[data-sigadd]", (el) => () => {
      const sel = this._addSelect(el);
      if (sel && sel.value) this._setHub({ sleep_signals: [...(this._hubOpt("sleep_signals") || []), sel.value] });
    });
    on("click", "[data-kind]", (el) => () => {
      const key = el.dataset.ch === "tts" ? "tts" : "recipients";
      const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
      const list = table[el.dataset.target] || [];
      const i = list.indexOf(el.dataset.kind);
      if (i >= 0) list.splice(i, 1); else list.push(el.dataset.kind);
      table[el.dataset.target] = list;
      this._setHub({ [key]: table });
    });
    on("click", "[data-remove]", (el) => () => {
      const key = el.dataset.ch === "tts" ? "tts" : "recipients";
      const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
      delete table[el.dataset.remove];
      this._setHub({ [key]: table }, 100);
    });
    on("click", "[data-add]", (el) => () => {
      const sel = this.shadowRoot.getElementById("addTarget");
      if (!sel || !sel.value) return;
      const key = el.dataset.add === "tts" ? "tts" : "recipients";
      const table = JSON.parse(JSON.stringify(this._hubOpt(key) || {}));
      table[sel.value] = el.dataset.add === "tts" ? ["too_cold"] : [...RK_DEFAULT_PUSH];
      this._setHub({ [key]: table }, 100);
    });
    on("click", "[data-test]", (el) => async () => {
      const r = await ws({ type: "raumklima/notify/test", target: el.dataset.test, ...this._homeMsg() });
      if (r) this._flash(t("Testnachricht an {n} gesendet", { n: rkPretty(el.dataset.test) }));
    });
    on("click", "[data-selftest]", () => () => {
      this._hass.callWS({ type: "raumklima/self_test", ...this._homeMsg() })
        .then((res) => {
          const text = ((res && res.checks) || []).map((c) => `${c.ok ? "✓" : "✕"} ${t(c.label)}: ${c.text}`).join("\n");
          this._openSheet({ title: t("Selbsttest"), intro: t("Die Prüfung ist nur lesend. Bei Fehlern steht der betroffene Raum oder die Entität dabei."), text: text || t("Keine Prüfungen") });
        })
        .catch((e) => this._flash(t("Fehler: {e}", { e: e.message || e })));
    });
    on("click", "[data-diag]", (el) => () => { this._trace("click", { what: "diagnose" }); this._downloadDiagnostics(); });
    on("click", "[data-backup]", (el) => () => { this._trace("click", { what: "sichern" }); this._backupExport(); });
    const restoreInput = this.shadowRoot.getElementById("rkrestore");
    on("click", "[data-restore]", (el) => () => restoreInput?.click());
    if (restoreInput) restoreInput.addEventListener("change", async () => {
      const file = restoreInput.files && restoreInput.files[0];
      if (file) await this._backupImport(file);
      restoreInput.value = "";
    });
    on("click", "[data-bug]", (el) => () => { this._trace("click", { what: "bug" }); this._openBugReport(); });
    $("[data-sheet-close]").forEach((el) =>
      el.addEventListener("click", (ev) => {
        if (ev.target !== el || el.classList.contains("sheet")) return; // Klick im Dialog nicht schließen
        this._closeSheet();
      }),
    );
    on("click", "[data-sheet-copy]", (el) => () => { this._trace("sheet:copy"); this._sheetCopy(); });
    on("click", "[data-sheet-share]", (el) => () => { this._trace("sheet:share", { share: Boolean(navigator.share) }); this._sheetShare(); });
    on("click", "[data-sheet-save]", (el) => () => { this._trace("sheet:save"); this._sheetSave(); });
    on("click", "[data-action]", (el) => async () => {
      await ws({ type: "raumklima/hub/action", action: el.dataset.action, ...this._homeMsg() });
      this._load();
    });
    on("click", "[data-nav]", (el) => () => {
      history.pushState(null, "", el.dataset.nav);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    });
  },
};
