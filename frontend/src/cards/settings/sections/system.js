import { esc, RK_VERSION, rkIssueList, t, toneVar } from "../../../shared.js";

export const SystemSectionMethods = {
  _groupHealth(ctx) {
    const { st } = ctx;
    const issues = st.issues || [];
    const bad = issues.filter((i) => i.severity !== "info").length;
    const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
    const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
    return this._grp("health", "Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra);
  },

  _groupLayout() {
    return this._layoutGroup();
  },

  _groupAdvanced() {
    const c = this._cfg || {};
    const h = this._hass || {};
    const cfg = h.config || {};
    const rows = [
      this._row("Integration", this._v(esc(c.version || "–"), false), ""),
      this._row("Home Assistant", this._v(esc(cfg.version || "–"), false), ""),
      this._row("Python", this._v(esc(c.python || cfg.python_version || "–"), false), ""),
      this._row("Zeitzone", this._v(esc(cfg.time_zone || "–"), false), ""),
      this._row("Entitäten", this._v(String(Object.keys(h.states || {}).length), false), t("alle Entitäten in Home Assistant")),
      this._row("Räume", this._v(String((this._rooms || []).length), false), t("Raumklima-Räume")),
      this._row("Offene Hinweise", this._v(String(((c.hub && c.hub.state && c.hub.state.issues) || []).length), false), t("Gesundheit der Heizung")),
      this._row("Karte", this._v(RK_VERSION, false), t("Version der Karte im Browser")),
      this._row("Datenquelle", this._v("WebSocket", false), t("Live-Verbindung zur Integration")),
      this._row("Werkzeuge", `<div class="chips"><button class="btn" data-selftest style="--c:var(--rk-ok)"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon>${t("Selbsttest")}</button><button class="btn" data-diag style="--c:var(--rk-eco)"><ha-icon icon="mdi:file-download-outline"></ha-icon>${t("Diagnose")}</button><button class="btn" data-bug style="--c:var(--rk-warn)"><ha-icon icon="mdi:bug-outline"></ha-icon>${t("Fehler melden")}</button></div>`, t("Selbsttest, Diagnose-Datei oder Fehlerbericht öffnen")),
    ];
    return this._grp("advanced", "System & Diagnose", "mdi:cog-outline", "off", rows.join(""), "span");
  },
};
