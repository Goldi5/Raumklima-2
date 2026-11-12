// Einstellungen-Karte – Darstellung: Reihenfolge und Farben der Räume.
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const LayoutMethods = {
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
  },

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

  /** Räume in der gepflegten Reihenfolge – „aus" blendet hier bewusst nichts aus. */,

  _orderedRooms() {
    return rkRoomsOrdered(this._rooms || [], this._layout);
  },

  _layoutList() {
    const L = this._layout || { order: [], hidden: [], size: {}, color: {} };
    return rkLayoutApply(this._rooms || [], L);
  },

  _layoutGroup() {
    if (!this._layout) {
      return this._grp("layout", "Darstellung", "mdi:view-dashboard-outline", "air", this._row("Reihenfolge", this._v("lädt …", true)));
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
    const look = this._row(t("Dunkler Look"), this._segs("hub", "look_dark", { auto: t("Automatisch"), on: t("Immer dunkel"), off: t("Immer hell") }, this._hubOpt("look_dark") || "auto"), t("gilt für alle Räume und Karten dieser Wohnung"));
    return this._grp("layout", "Darstellung", "mdi:view-dashboard-outline", "air", look + rows + foot);
  },
};
