// Einstellungen-Karte – Übersichtstabelle, Sicherung, Export und Diagnose.
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const SheetMethods = {
  async _repairDashboards() {
    const homes = (this._cfg && this._cfg.homes) || [];
    let made = 0;
    for (const h of homes) {
      if (await this._ensureDashboard(h.dashboard, h.name, h.entry_id)) made++;
    }
    if (made) {
      this._flash(t("{n} Dashboard(s) für deine Wohnungen angelegt", { n: made }));
      this._render();
    }
  },

  // ---------------------------------------------------------------- Speichern
  _openBugReport() {
    // Nur Version, Anzahl Räume und Gerätemodelle – keine Namen, keine Entitäten.
    // Kein window.open/link.click(): iPad-Safari und die HA-App verwerfen neue Tabs aus
    // einem Skript heraus. Stattdessen ein Dialog mit echtem <a href> und Kopierknopf.
    const rooms = this._rooms || [];
    const thermostats = rooms.map((r) => {
      const ent = (this._hass.entities || {})[r.id] || {};
      const dev = (this._hass.devices || {})[ent.device_id] || {};
      return [dev.manufacturer, dev.model].filter(Boolean).join(" ") || ent.platform || "";
    });
    const { url, body } = rkBugReportUrl({
      version: RK_VERSION,
      haVersion: this._hass.config && this._hass.config.version,
      language: this._hass.language,
      rooms: rooms.length,
      homeCount: ((this._cfg && this._cfg.homes) || []).length,
      thermostats,
      parts: true,
    });
    this._openSheet({
      title: t("Fehler melden"),
      intro: t("Text prüfen – es stehen keine Raumnamen oder Zugangsdaten darin –, dann GitHub öffnen und den Text einfügen. Auf dem iPhone oder iPad geht auch Teilen oder Kopieren."),
      text: body,
      url,
      share: true,
    });
  },

  // ---------------------------------------------------------------- Dialog
  _openSheet(sheet) {
    this._trace("sheet:open", { title: sheet && sheet.title, download: Boolean(sheet && sheet.download) });
    this._sheet = sheet;
    this._render();
  },

  _closeSheet() {
    this._sheet = null;
    this._sig = null;
    this._render();
  },

  _sheetStatus(text) {
    // Direkt im DOM setzen: ein vollständiges Neuzeichnen würde den Tipp verlieren,
    // und ein Toast läge hinter dem abgedunkelten Hintergrund (Punkt 2 von außen).
    if (!this._sheet) return;
    this._sheet.status = text;
    const el = this.shadowRoot && this.shadowRoot.querySelector("[data-sheet-status]");
    if (el) {
      el.textContent = text;
      el.style.display = text ? "block" : "none";
    }
  },

  _sheetHtml() {
    const s = this._sheet;
    if (!s) return "";
    const buttons = [];
    if (s.url) {
      buttons.push(
        `<a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" style="--c:var(--rk-warn)"><ha-icon icon="mdi:github"></ha-icon>${t("GitHub öffnen")}</a>`,
      );
    }
    if (s.share) {
      buttons.push(
        `<button class="btn" data-sheet-share style="--c:var(--rk-heat)"><ha-icon icon="mdi:share-variant"></ha-icon>${t("Teilen")}</button>`,
      );
    }
    if (s.filename) {
      buttons.push(
        `<button class="btn" data-sheet-save style="--c:var(--rk-eco)"><ha-icon icon="mdi:content-save"></ha-icon>${t("Speichern")}</button>`,
      );
    }
    buttons.push(
      `<button class="btn" data-sheet-copy style="--c:var(--rk-ok)"><ha-icon icon="mdi:content-copy"></ha-icon>${t("Kopieren")}</button>`,
    );
    return `<div class="sheetwrap" data-sheet-close>
      <div class="sheet" role="dialog" aria-modal="true">
        <div class="stitle">${esc(s.title)}</div>
        <div class="sintro">${esc(s.intro || "")}</div>
        ${s.download
          ? `<a class="btn wide" href="${esc(s.download)}" download="${esc(s.filename || "")}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:download"></ha-icon>${t("Datei laden")}</a>`
          : ""}
        <textarea class="stext" readonly rows="8" spellcheck="false">${esc(s.text || "")}</textarea>
        <div class="sstatus" data-sheet-status style="display:${s.status ? "block" : "none"}">${esc(s.status || "")}</div>
        <div class="sbtns">${buttons.join("")}<button class="btn" data-sheet-close style="--c:var(--rk-off)">${t("Schließen")}</button></div>
      </div>
    </div>`;
  },

  async _sheetCopy() {
    const text = (this._sheet && this._sheet.text) || "";
    try {
      await navigator.clipboard.writeText(text);
      this._sheetStatus(t("Kopiert – jetzt im Ziel einfügen"));
      return true;
    } catch (e) {
      // iOS und Webviews verweigern die API oft. Rückfall: Textfeld markieren und
      // den alten Befehl nutzen – das geht auch ohne Berechtigung.
      try {
        const field = this.shadowRoot.querySelector(".stext");
        if (field) {
          field.focus();
          field.select();
          const ok = document.execCommand("copy");
          if (ok) {
            this._sheetStatus(t("Kopiert – jetzt im Ziel einfügen"));
            return true;
          }
        }
      } catch (err) { /* auch das darf scheitern */ }
      this._sheetStatus(t("Kopieren hat der Browser blockiert – Text bitte im Feld markieren und selbst kopieren"));
      return false;
    }
  },

  async _sheetShare() {
    const text = (this._sheet && this._sheet.text) || "";
    const name = (this._sheet && this._sheet.filename) || "raumklima.txt";
    try {
      const file = new File([text], name, { type: name.endsWith(".json") ? "application/json" : "text/plain" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: (this._sheet && this._sheet.title) || "Raumklima" });
        this._sheetStatus(t("Geteilt"));
        return;
      }
      if (navigator.share) {
        await navigator.share({ text });
        this._sheetStatus(t("Geteilt"));
        return;
      }
      await this._sheetCopy();
    } catch (e) {
      if (e && e.name === "AbortError") return; // selbst abgebrochen
      await this._sheetCopy();
    }
  },

  _sheetSave() {
    const s = this._sheet;
    if (!s) return;
    // Läuft in einem echten Klick – nur so akzeptiert iOS den Download.
    const blob = new Blob([s.text || ""], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = s.filename || "raumklima.json";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    this._sheetStatus(t("Gespeichert: {name} – falls keine Datei kam, bitte Datei laden benutzen", { name: s.filename || "" }));
  },

  async _exportLink(kind) {
    try {
      return await this._hass.callWS({ type: "raumklima/export/link", kind, ...this._homeMsg() });
    } catch (e) {
      return {};  // ohne Link bleiben Teilen/Kopieren als Weg
    }
  },

  async _backupExport() {
    try {
      this._flash(t("Sicherung wird erstellt …"));
      this._trace("backup:start");
      const res = await this._hass.callWS({ type: "raumklima/backup/export", ...this._homeMsg() });
      this._trace("backup:data", { ok: Boolean(res && res.backup) });
      const text = JSON.stringify(res.backup, null, 2);
      const stamp = new Date().toISOString().slice(0, 10);
      const name = `raumklima-einstellungen-${stamp}.json`;
      // Echter Datei-Link: iPad-Safari und die HA-App speichern zuverlässig nur, wenn
      // der Nutzer selbst auf einen Link tippt – nicht wenn ein Skript einen Blob öffnet.
      const link = await this._exportLink("backup");
      this._trace("backup:link", { ok: Boolean(link && link.url), name: link && link.name });
      // Kein Download direkt nach dem await: iOS wertet das nicht mehr als Benutzeraktion.
      // Der Dialog hat echte Knöpfe – deren Klick darf wieder speichern/teilen.
      this._openSheet({
        title: t("Sicherung erstellt"),
        intro: t("Enthält alle Räume, Zeitpläne und Einstellungen dieser Wohnung. Auf dem iPhone/iPad über „Teilen“ in Dateien sichern, am Rechner über „Speichern“."),
        text,
        filename: link.name || name,
        download: link.url || "",
        share: true,
      });
    } catch (err) {
      this._trace("backup:error", { e: (err && (err.message || err)) || "?" });
      this._flash(t("Sicherung fehlgeschlagen: {e}", { e: err.message || err }));
    }
  },

  async _backupImport(file) {
    try {
      this._flash(t("Sicherung wird geprüft …"));
      const text = await file.text();
      const backup = JSON.parse(text);
      if (!confirm(t("Einstellungen aus dieser Datei einspielen? Die aktuellen Einstellungen werden überschrieben."))) return;
      const res = await this._hass.callWS({ type: "raumklima/backup/import", backup, ...this._homeMsg() });
      const missing = (res.skipped || []).length;
      this._flash(missing
        ? t("Eingespielt: {n} Räume · {m} nicht gefunden", { n: (res.rooms || []).length, m: missing })
        : t("Eingespielt: {n} Räume", { n: (res.rooms || []).length }));
      this._cfg = await this._hass.callWS({ type: "raumklima/config", ...this._homeMsg() });
      this._render();
    } catch (err) {
      this._flash(t("Sicherung fehlgeschlagen: {e}", { e: err.message || err }));
    }
  },

  async _downloadDiagnostics() {
    try {
      this._flash(t("Diagnose wird erstellt …"));
      this._trace("diag:start");
      const data = await this._hass.callWS({ type: "raumklima/diagnostics", ...this._homeMsg() });
      this._trace("diag:data", { ok: Boolean(data) });
      const text = JSON.stringify(data, null, 2);
      const link = await this._exportLink("diagnostics");
      this._openSheet({
        title: t("Diagnose"),
        intro: t("Zum Melden eines Fehlers: die Datei laden und an das Issue anhängen. Sie enthält Werte, Entitäten und die letzten Protokollzeilen, aber keine Zugangsdaten."),
        text,
        filename: link.name || "raumklima-diagnose.json",
        download: link.url || "",
        share: true,
      });
    } catch (e) {
      this._trace("diag:error", { e: e.message || String(e) });
      this._flash(t("Fehler: {e}", { e: e.message || e }));
    }
  },
};
