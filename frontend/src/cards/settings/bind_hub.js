// Einstellungen-Karte – Ereignisse: Auswahlen, Layout, Zeiten, Zentrale, Dashboards, Einrichtung.
// Teil von _bind() (siehe bind.js); Methoden der Klasse RaumklimaSettingsCard.
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const BindHubMethods = {
  _bindHub(k) {
    const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
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
        const r = await this._hass.callWS({ type: "raumklima/room/create", name, trv, temperature_sensor: temp, ...this._homeMsg() });
        this._tab = "general"; this._section = "rooms"; this._roomTab = "overview";
        // angelegt: Entwurf leeren, sonst stellt das Neuzeichnen ihn wieder her
        for (const id of ["newRoomName", "newRoomTrv"]) { const f = this.shadowRoot.getElementById(id); if (f) f.value = ""; }
        this._flash(t("Raum „{n}“ angelegt", { n: name }));
        await this._load();
        if (r && r.entry_id) this._gotoRoomByEntry(r.entry_id);
      } catch (e) { this._flash(t("Fehler: {e}", { e: e.message || e })); }
    });
    on("click", "[data-deleteroom]", (el) => () => this._deleteRoom(el.dataset.deleteroom));
    on("change", '[data-onb="trv"]', () => () => { this._onboardCollect(); this._render(); });
    on("change", '[data-onb="heat_type"]', () => () => { this._onboardCollect(); if (this._onboard && this._onboard.data.heat_type === "monitor") this._onboard.data.extra_trvs = []; this._render(); });
    on("click", "[data-onboard]", () => () => this._onboardStart());
    on("click", "[data-onbnext]", () => () => this._onboardNext(1));
    on("click", "[data-onbback]", () => () => this._onboardNext(-1));
    on("click", "[data-onbclose]", () => () => this._onboardClose());
    on("click", "[data-onbfinish]", () => () => this._onboardFinish());
    on("click", "[data-onbaddbtn]", (el) => () => {
      const sel = this.shadowRoot.querySelector(`[data-onbadd="${el.dataset.onbaddbtn}"]`);
      if (sel && sel.value) this._onboardAdd(el.dataset.onbaddbtn, sel.value);
    });
    on("click", "[data-onbrm]", (el) => () => {
      const [key, value] = el.dataset.onbrm.split("|");
      this._onboardRemove(key, value);
    });
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
  },
};
