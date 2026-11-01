// Rendert alle Karten mit echten Daten (fixture.json) im Browser und gibt das
// HTML je Karte aus. Nutzung (braucht Playwright + Chromium):
//   node test/render.mjs <karte.js> [sprache] > out.json
// Dient zum Vergleich vor/nach Umbauten und zum Finden von JS-Fehlern.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const here = dirname(fileURLToPath(import.meta.url));
const cardFile = resolve(process.argv[2] || resolve(here, "../../custom_components/raumklima/www/raumklima-card.js"));
const lang = process.argv[3] || "de";
const fixture = JSON.parse(readFileSync(resolve(here, "fixture.json"), "utf8"));

const CARDS = [
  ["raumklima-card", { entity: "climate.bad" }],
  ["raumklima-overview-card", {}],
  ["raumklima-history-card", {}],
  ["raumklima-settings-card", {}],
  ["raumklima-report-card", {}],
  ["raumklima-log-card", {}],
];

const browser = await chromium.launch();
const page = await browser.newPage({ locale: lang === "de" ? "de-DE" : "en-US", timezoneId: "Europe/Berlin" });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.clock.install({ time: new Date("2026-11-01T12:00:00Z") });
await page.setContent("<html><body></body></html>");
await page.evaluate(({ fixture, lang }) => {
  window.__hass = {
    states: fixture.states,
    entities: fixture.entities,
    language: lang,
    locale: { language: lang, number_format: "language" },
    user: { is_admin: true, name: "Test" },
    themes: { darkMode: false },
    callWS: async (msg) => (msg.type in fixture.ws ? structuredClone(fixture.ws[msg.type]) : {}),
    callService: async () => ({}),
    connection: { subscribeMessage: async () => () => {} },
    formatEntityState: (s) => s.state,
  };
}, { fixture, lang });
await page.addScriptTag({ content: readFileSync(cardFile, "utf8") });

const out = {};
for (const [tag, config] of CARDS) {
  const html = await page.evaluate(async ({ tag, config }) => {
    const el = document.createElement(tag);
    el.setConfig({ type: `custom:${tag}`, ...config });
    document.body.appendChild(el);
    el.hass = window.__hass;
    await new Promise((r) => setTimeout(r, 50));
    el.hass = { ...window.__hass };
    await new Promise((r) => setTimeout(r, 50));
    const root = el.shadowRoot || el;
    return root.innerHTML.replace(/<style>[\s\S]*?<\/style>/g, "<style/>");
  }, { tag, config });
  await page.clock.runFor(200);
  out[tag] = html;
}
const strategy = await page.evaluate(async () => {
  const S = customElements.get("ll-strategy-dashboard-raumklima");
  return S && S.generate ? await S.generate({}, window.__hass) : null;
});
out.strategy = strategy;
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
