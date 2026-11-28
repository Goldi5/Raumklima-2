// Einstellungen-Karte – Ereignisse: Navigation, Räume kopieren/zurücksetzen, Werte und Schalter.
// Teil von _bind() (siehe bind.js); Methoden der Klasse RaumklimaSettingsCard.
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const BindGeneralMethods = {
  _bindGeneral(k) {
    const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
    on("click", "[data-tab]", (el) => () => {
      this._onboardLeave();
      this._tab = el.dataset.tab;
      this._search = "";
      if (this._nav2) { this._section = "rooms"; this._group = null; }
      this._sig = null;
      this._render();
    });
    on("click", "[data-section]", (el) => () => {
      this._onboardLeave();
      this._section = el.dataset.section;
      this._search = "";
      if (this._section === "rooms") this._tab = "general";
      this._group = null;
      try { localStorage.setItem("raumklima-settings-section", this._section); } catch (e) { /* ignorieren */ }
      this._sig = null;
      this._render();
    });
    on("click", "[data-nav2]", () => {
      this._onboardLeave();
      this._nav2 = !this._nav2;
      this._group = null;
      try { localStorage.setItem("raumklima-settings-nav-v2", this._nav2 ? "1" : "0"); } catch (e) { /* ignorieren */ }
      this._sig = null;
      this._render();
    });
    on("click", "[data-roomtab]", (el) => () => {
      this._onboardLeave();
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
    on("click", "[data-lpanel]", (el) => () => {
      this._layout = { ...this._layout, beta_panel: el.dataset.lpanel === "true" };
      this._layoutSave();
      this._sig = null;
      this._render();
    });
    on("click", "[data-lfloors]", (el) => () => {
      this._layout = { ...this._layout, beta_floors: el.dataset.lfloors === "true" };
      this._layoutSave();
      this._sig = null;
      this._render();
    });
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
    on("click", "details.eguide > summary", (el) => () => {
      // Anleitung bleibt offen, auch wenn die Karte neu zeichnet (jede HA-Zustandsänderung)
      const d = el.parentElement;
      this._guideOpen = this._guideOpen || new Set();
      if (d.open) this._guideOpen.delete(d.dataset.guide);
      else this._guideOpen.add(d.dataset.guide);
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
  },
};
