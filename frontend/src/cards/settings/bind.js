// Einstellungen-Karte – Ereignisse: ein zentraler Verteiler und alle Handler der Einstellungsseite.
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

import { BindGeneralMethods } from "./bind_general.js";
import { BindScheduleMethods } from "./bind_schedule.js";
import { BindHubMethods } from "./bind_hub.js";
import { BindNotifyMethods } from "./bind_notify.js";

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
    const apply = (scope, changes) => {
      if (scope === "hub") this._setHub(changes);
      else this._setRoom(scope.slice(5), changes);
    };
    // Zeitplan bearbeiten: jede Änderung geht gesammelt (700 ms Pause) an den Raum
    const sp = (v) => String(v).split("|");
    const roomList = (entry, key, fallback) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const s = (room && room.attrs.settings) || {};
      return [...((room && this._roomOpt(room, key)) ?? s[key] ?? fallback)];
    };
    const mailSettings = () => {
      const f = { ...(this._mailForm || {}) };
      const out = {};
      for (const k of ["mail_server", "mail_port", "mail_security", "mail_auth", "mail_user", "mail_password", "mail_from", "mail_to"]) {
        if (f[k] === undefined) continue;
        out[k] = k === "mail_auth" ? f[k] !== false : k === "mail_port" ? (f[k] === "" ? null : parseInt(f[k], 10)) : String(f[k]).trim();
      }
      return out;
    };
    const roomLights = (entry) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const local = room ? this._roomOpt(room, "presence_lights") : null;
      return [...(local || [])];
    };
    const roomPres = (entry) => {
      const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === entry);
      const local = room && this._roomOpt(room, "presence_sensors");
      return [...(local ?? Object.keys(((room && room.attrs.settings) || {}).presence_sensors || {}))];
    };
    const k = { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres };
    // Reihenfolge wie bisher: Handler laufen in der Reihenfolge, in der sie eingetragen wurden
    BindGeneralMethods._bindGeneral.call(this, k);
    BindScheduleMethods._bindSchedule.call(this, k);
    BindHubMethods._bindHub.call(this, k);
    BindNotifyMethods._bindNotify.call(this, k);
  },
};
