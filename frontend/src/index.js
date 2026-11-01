/*
 * Raumklima-Karten – werden von der Integration automatisch geladen.
 *   type: custom:raumklima-card          (ein Raum)
 *   type: custom:raumklima-overview-card (alle Räume + Außenklima)
 * Quelltext: frontend/src – gebaut mit `npm run build`.
 */
import { RK_VERSION } from "./shared.js";
import { RaumklimaCard } from "./cards/room.js";
import { RaumklimaOverviewCard } from "./cards/overview.js";
import { RaumklimaHistoryCard } from "./cards/history.js";
import { RaumklimaSettingsCard } from "./cards/settings.js";
import { RaumklimaReportCard } from "./cards/report.js";
import { RaumklimaLogCard } from "./cards/log.js";
import { RaumklimaDashboardStrategy } from "./cards/strategy.js";

if (!customElements.get("raumklima-card")) customElements.define("raumklima-card", RaumklimaCard);
if (!customElements.get("raumklima-overview-card")) customElements.define("raumklima-overview-card", RaumklimaOverviewCard);
window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === "raumklima-card")) {
  window.customCards.push(
    { type: "raumklima-card", name: "Raumklima – Raum", description: "Thermostat, Lüften und Klima eines Raums", preview: true },
    { type: "raumklima-overview-card", name: "Raumklima – Übersicht", description: "Alle Räume und Außenklima auf einen Blick", preview: true },
    { type: "raumklima-settings-card", name: "Raumklima – Einstellungen", description: "Was eingestellt ist, wer welche Hinweise bekommt – mit Reglern", preview: false },
    { type: "raumklima-history-card", name: "Raumklima – Verlauf", description: "Temperatur, Luftfeuchte oder Zeitleiste aller Räume", preview: false },
    { type: "raumklima-log-card", name: "Raumklima – Protokoll", description: "Was wann warum entschieden wurde – live, mit Filtern", preview: false },
    { type: "raumklima-report-card", name: "Raumklima – Heizbericht", description: "Woche und Monat: Heizstunden, Ersparnis, wetterbereinigter Vergleich, Gesundheit", preview: false },
  );
}
if (!customElements.get("raumklima-settings-card")) customElements.define("raumklima-settings-card", RaumklimaSettingsCard);
if (!customElements.get("raumklima-history-card")) customElements.define("raumklima-history-card", RaumklimaHistoryCard);
if (!customElements.get("raumklima-log-card")) customElements.define("raumklima-log-card", RaumklimaLogCard);
if (!customElements.get("raumklima-report-card")) customElements.define("raumklima-report-card", RaumklimaReportCard);
if (!customElements.get("ll-strategy-dashboard-raumklima")) customElements.define("ll-strategy-dashboard-raumklima", RaumklimaDashboardStrategy);
window.customStrategies = window.customStrategies || [];
if (!window.customStrategies.find((x) => x.type === "raumklima")) {
  window.customStrategies.push({
    type: "raumklima",
    strategyType: "dashboard",
    name: "Raumklima",
    description: "Heizung, Lüften und Klima aller Raumklima-Räume – baut sich automatisch auf",
    documentationURL: "https://github.com/Goldi5/Raumklima-2",
  });
}
console.info(`%c RAUMKLIMA-CARD %c ${RK_VERSION} `, "background:#ff7a45;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#2ec4a6;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px");
