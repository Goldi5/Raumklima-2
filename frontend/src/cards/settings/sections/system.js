import { rkIssueList, t, toneVar } from "../../../shared.js";

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
    return this._grp("advanced", "Erweitert", "mdi:cog-outline", "off",
      `<div class="hint">${t("Kommt in einer späteren Beta: technische Einstellungen und Diagnosewerkzeuge.")}</div>`);
  },
};
