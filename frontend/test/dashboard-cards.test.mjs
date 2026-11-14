import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { scrollY: 0, addEventListener() {}, scrollTo() {} };
globalThis.document = { createElement: () => ({ style: {}, appendChild() {}, click() {}, remove() {} }), body: { appendChild() {} } };
globalThis.customElements = { define() {}, get() { return null; } };
globalThis.HTMLElement = class {
  constructor() { this.style = {}; }
  attachShadow() {
    this.shadowRoot = { innerHTML: "", querySelectorAll: () => [], querySelector: () => null };
    return this.shadowRoot;
  }
  getRootNode() { return null; }
  dispatchEvent() {}
};
globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options?.detail; } };

const { RaumklimaEnergyCard } = await import("../src/cards/energy.js");
const { RaumklimaLearningCard } = await import("../src/cards/learning.js");
const { RaumklimaDashboardStrategy } = await import("../src/cards/strategy.js");
const { setLang } = await import("../src/shared.js");

const hass = {
  language: "de",
  locale: { language: "de", number_format: "language" },
  states: {},
  entities: {},
  devices: {},
  areas: {},
  floors: {},
  callWS: async () => ({}),
};

function energyCard(data) {
  setLang(hass);
  const card = new RaumklimaEnergyCard();
  card.setConfig({ days: 7 });
  card._hass = hass;
  card._days = 7;
  card._data = data;
  card._render();
  return card.shadowRoot.innerHTML;
}

test("Energiekarte zeigt Zähler, Tarif und Kosten", () => {
  const html = energyCard({
    start: "2026-11-08", end: "2026-11-14", days: 7,
    energy: { enabled: true, meter: "sensor.strom", meter_unit: "kWh", source: "electric", price: 0.32, base: 12, tariff: "sensor.tarif", kwh: 84.5, pv_entity: "sensor.pv", pv_kwh: 31, pv_self_use: 40 },
    money: { kwh: 84.5, period_cost: 27.04, annual: 1280, basis: "meter" },
  });
  assert.match(html, /84,5/);
  assert.match(html, /27,04/);
  assert.match(html, /sensor\.strom/);
  assert.match(html, /Basis: Zähler/);
  assert.match(html, /40 % Eigenverbrauch/);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Energiekarte erklärt fehlende Zähler", () => {
  const html = energyCard({ start: "2026-11-08", end: "2026-11-14", days: 7, energy: { enabled: true }, money: null });
  assert.match(html, /Noch kein Zähler gewählt/);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Lernkarte zeigt Aufheizrate, Nutzung und Lüften", () => {
  setLang(hass);
  const card = new RaumklimaLearningCard();
  card.setConfig({});
  card._hass = hass;
  card._rooms = [{
    id: "climate.bad", name: "Bad",
    attrs: { settings: {
      heatup: { episodes: 4, rate: 0.55, minutes_2k: 210 },
      usage: { text: "Mo–Fr 08:00–11:30", days_seen: 12 },
      airing: { episodes: 3 },
      airing_top: { learned: [{ time: "07:00", count: 2 }] },
    } },
  }];
  card._hub = {
    presence_profile: { days: { weekday: 9, weekend: 4 }, complete: true },
    presence_tip: { ready: true, weekday: { from: "08:00", to: "17:00" } },
    sleep: { weekday: { bed: "23:00", wake: "06:30" } },
  };
  card._render();
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Bad/);
  assert.match(html, /K\/h/);
  assert.match(html, /Mo–Fr 08:00–11:30/);
  assert.match(html, /3 Vorgänge/);
  assert.match(html, /23:00–06:30/);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Dashboard beginnt mit Räume; Energie & Lernen ist der zweite Reiter", async () => {
  const dashHass = {
    language: "de",
    locale: { language: "de", number_format: "language" },
    entities: { "climate.bad": { platform: "raumklima", entity_id: "climate.bad", device_id: "d1" } },
    states: { "climate.bad": { attributes: { friendly_name: "Bad" } } },
    devices: {}, areas: {}, floors: {},
    callWS: async () => ({}),
  };
  const dash = await RaumklimaDashboardStrategy.generate({}, dashHass);
  assert.equal(dash.views[0].path, "raeume");
  assert.ok(!dash.views.some((v) => v.path === "heute"));
  const insights = dash.views[1];
  assert.equal(insights.path, "energie-lernen");
  const insightCards = insights.sections.flatMap((s) => s.cards).map((c) => c.type);
  assert.ok(insightCards.includes("custom:raumklima-energy-card"));
  assert.ok(insightCards.includes("custom:raumklima-learning-card"));
});
