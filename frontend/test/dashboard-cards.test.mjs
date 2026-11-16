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
  assert.match(html, /Jahr ≈ 1\.280 €/);
  assert.match(html, /40 % Eigenverbrauch/);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Energiekarte: Wärmepumpe mit Akku, Achsen, Einheiten und Erklärungen", () => {
  const daily = Array.from({ length: 30 }, (_, i) => ({ date: `2026-11-${String(i + 1).padStart(2, "0")}`, kwh: 15 + (i % 5), ww: 3, cost: 4.5, outdoor: 3 + (i % 6) }));
  const data = {
    start: "2026-11-01", end: "2026-11-30", days: 30,
    energy: {
      enabled: true, meter: "sensor.wp", source: "heatpump", price: 0.37, tariff: "sensor.p", tariff_dynamic: true,
      kwh: 438, ww_kwh: 91, heat_kwh: 2250, ww_heat_kwh: 254, cop: 5.1, cop_vendor: 4.3, cop_ww: 2.8,
      price_paid: 0.374, price_avg: 0.394, cheap_share: 36, self_kwh: 241, batt_kwh: 30,
      pv_kwh: 558, feed_kwh: 257, batt: { charge: 120, discharge: 110, grid_charge: 40, grid_charge_cost: 10 },
      daily, curve: { per_kelvin: 2.9, intercept: 39, limit: 13.6, r2: 0.6, n: 14, points: [{ t: 4, kwh: 28 }, { t: 7, kwh: 19 }] },
      week: { kwh: Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0.8)), price: Array.from({ length: 24 }, (_, h) => 0.3 + h / 200) },
      heat_prices: [{ id: "own", ct: 4.3 }, { id: "own_grid", ct: 8.7 }, { id: "gas", ct: 12.2 }], compare_gas: 0.11, compare_oil: 1.1,
      tariff_saving: 5.8, shift_eur: 12,
      tariffs: [{ entity: "sensor.p", name: "Heartbeat Electricity Price", value: 0.447, primary: true, active: true, forecast: 120 }, { entity: "sensor.e", name: "EPEX Spot · SMARD.de", value: 0.458, primary: false, active: false }],
    },
    money: { period_cost: 122.58, per_day: 4.09, annual: 1090, annual_basis: "12m", basis: "meter", parts: { heat: 89.25, ww: 18.55, base: 14.78, pv_saved: 90 },
      rooms: [{ name: "Flur", share: 35, cost: 35.7, value: 120, metric: "valve" }, { name: "Bad", share: 8, cost: 7.7, value: 30, metric: "valve" }, { name: "Büro", share: 10, cost: 9, value: 35, metric: "valve" }, { name: "Küche", share: 12, cost: 11, value: 40, metric: "valve" }, { name: "Gast", share: 14, cost: 13, value: 45, metric: "valve" }, { name: "Kind", share: 21, cost: 20, value: 60, metric: "valve" }] },
  };
  let html = energyCard(data);
  assert.match(html, /Heizung 438 kWh · Warmwasser 91 kWh/);
  assert.match(html, /4,3 – 5,1/);
  assert.match(html, /10 kWh/); // Achse
  assert.match(html, /°C<\/span>/);
  assert.match(html, /Wohin geht das Geld/);
  assert.match(html, /Wann läuft die Wärmepumpe/);
  assert.match(html, /Heizkennlinie/);
  assert.match(html, /13,6 °C Tagesmittel/);
  assert.match(html, /Was kostet 1 kWh Wärme/);
  assert.match(html, /aus dem Netz geladen/);
  assert.match(html, /Flur: 35 %/);
  assert.match(html, /Jahr ≈ 1\.090 € \(letzte 12 Monate\)/);
  assert.doesNotMatch(html, /class="ehelp"/);
  // „?“ öffnet die Erklärung
  setLang(hass);
  const card = new RaumklimaEnergyCard();
  card.setConfig({ days: 30 });
  card._hass = hass; card._data = data; card._help = new Set(["cop"]); card._sel = 3;
  card._render();
  html = card.shadowRoot.innerHTML;
  assert.match(html, /class="ehelp">Arbeitszahl: wie viel Wärme/);
  assert.match(html, /class="esel"/);
});

test("Energiekarte: Gas ohne PV zeigt keine PV- und Arbeitszahl-Blöcke", () => {
  const html = energyCard({
    start: "2026-11-08", end: "2026-11-14", days: 7,
    energy: { enabled: true, meter: "sensor.gas", source: "gas", price: 0.12, kwh: 300, m3: 30, heat_prices: [{ id: "own", ct: 13.3 }, { id: "heatpump", ct: 8.6 }], compare_power: 0.3 },
    money: { period_cost: 40, basis: "meter" },
  });
  assert.doesNotMatch(html, /PV &amp; Akku|PV & Akku/);
  assert.doesNotMatch(html, /Arbeitszahl/);
  assert.match(html, /Wärmepumpe \(30 ct Strom, JAZ 3,5\)/);
});

test("Energiekarte erklärt fehlende Zähler", () => {
  const html = energyCard({ start: "2026-11-08", end: "2026-11-14", days: 7, energy: { enabled: true }, money: null });
  assert.match(html, /Noch kein Zähler, Tank oder Marktpreis/);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Energiekarte zeigt Öltank und Bestellhinweis", () => {
  const html = energyCard({
    start: "2026-11-08", end: "2026-11-14", days: 7,
    energy: {
      enabled: true, source: "oil", oil_price: 1.1, price: 0.11, kwh: 500, liter: 50,
      tank: { current_l: 1200, current_percent: 40, days_left: 21, order: false, consumed_l: 50, threshold_l: 600 },
    },
    money: { period_cost: 55, annual: 2860, basis: "tank", kwh: 500 },
  });
  assert.match(html, /Ölpreis/);
  assert.match(html, /Tank/);
  assert.match(html, /Ölbestellung/);
  assert.match(html, /21 Tage/);
  assert.match(html, /Basis: Tank/);
});

test("Energiekarte zeigt Winterverbrauch und Preisverlauf", () => {
  const html = energyCard({
    start: "2026-11-08", end: "2026-11-14", days: 7,
    energy: {
      enabled: true, source: "oil", meter: "sensor.oil", meter_unit: "L", kwh: 500, liter: 50, price: 0.11,
      winter_liters: 1800, winter_days: 150, winter_avg_l_day: 12,
      oil_price_history: [{ date: "2025-10-01", price: 1.02 }, { date: "2026-01-15", price: 1.10 }],
      oil_price_avg: 1.06,
    },
    money: { period_cost: 55, annual: 2860, basis: "meter", kwh: 500 },
  });
  assert.match(html, /Letzter Winter/);
  assert.match(html, /1.800/);
  assert.match(html, /12,0 L\/Tag/);
  assert.match(html, /Preisverlauf/);
  assert.match(html, /1,10/);
});

test("Energiekarte zeigt Marktpreis und Vergleich", () => {
  const html = energyCard({
    start: "2026-11-08", end: "2026-11-14", days: 7,
    energy: {
      enabled: true, source: "oil", meter: "sensor.oil", meter_unit: "L", kwh: 500, liter: 50, price: 0.11,
      oil_market: { value: 1.05, avg_30d: 1.12, delta_avg: -0.07, vs_your_price: -0.05 },
    },
    money: { period_cost: 55, annual: 2860, basis: "meter", kwh: 500 },
  });
  assert.match(html, /Marktpreis/);
  assert.match(html, /1,05/);
  assert.match(html, /30-Tage-Ø/);
  assert.match(html, /Markt vs. deinem Preis/);
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

test("Dashboard beginnt mit Räume; Energie ist der zweite Reiter, Lernen liegt unter Verlauf", async () => {
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
  assert.ok(!insightCards.includes("custom:raumklima-learning-card"));
  const hist = dash.views.find((v) => v.path === "verlauf");
  assert.ok(hist.sections.flatMap((s) => s.cards).some((c) => c.type === "custom:raumklima-learning-card"));
});
