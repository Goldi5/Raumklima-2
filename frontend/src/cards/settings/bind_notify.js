// Einstellungen-Karte – Ereignisse: Mail, Melder, Lampen, Hinweisarten, Sicherung, Teilen.
// Teil von _bind() (siehe bind.js); Methoden der Klasse RaumklimaSettingsCard.
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const BindNotifyMethods = {
  _bindNotify(k) {
    const { on, $, ws, apply, sp, roomList, mailSettings, roomLights, roomPres } = k;
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
    on("click", "[data-mailauth]", (el) => () => {
      // Anmeldung an/aus (#76): ohne Anmeldung werden Benutzer/Passwort ausgeblendet und beim Speichern gelöscht
      this._mailForm = { ...(this._mailForm || {}), mail_auth: el.dataset.mailauth === "true" };
      this._sig = null; this._render();
    });
    on("click", "[data-mailsec]", (el) => () => {
      this._mailForm = { ...(this._mailForm || {}), mail_security: el.dataset.mailsec };
      this.shadowRoot.querySelectorAll("[data-mailsec]").forEach((b) => b.classList.toggle("on", b === el));
    });
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
      for (const k of ["mail_server", "mail_port", "mail_security", "mail_auth", "mail_user", "mail_password", "mail_from", "mail_to"]) {
        if (f[k] === undefined) continue;
        changes[k] = k === "mail_auth" ? f[k] !== false : k === "mail_port" ? (f[k] === "" ? null : parseInt(f[k], 10)) : String(f[k]).trim();
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
    on("click", "[data-plightadd]", (el) => () => {
      const sel = this._addSelect(el);
      if (sel && sel.value) this._setRoom(el.dataset.plightadd, { presence_lights: [...roomLights(el.dataset.plightadd), sel.value] }, 200);
    });
    on("click", "[data-plightrm]", (el) => () => {
      this._setRoom(el.dataset.entry, { presence_lights: roomLights(el.dataset.entry).filter((e) => e !== el.dataset.plightrm) }, 200);
    });
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
    on("click", "[data-recipient-home]", (el) => async () => {
      if (!this._admin) return;
      const homeId = el.dataset.homeId;
      const home = (this._cfg.homes || []).find((h) => h.entry_id === homeId);
      if (!home) return;
      const target = el.dataset.recipientHome;
      const table = JSON.parse(JSON.stringify(home.recipients || {}));
      if (Object.prototype.hasOwnProperty.call(table, target)) {
        delete table[target];
      } else {
        const known = (this._cfg.homes || [])
          .map((h) => (h.recipients || {})[target])
          .find((list) => Array.isArray(list) && list.length);
        table[target] = known ? [...known] : [...RK_DEFAULT_PUSH];
      }
      await this._setHubAt(homeId, { recipients: table });
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
