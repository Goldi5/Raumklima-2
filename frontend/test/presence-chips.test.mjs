// Anwesenheits-Chips: Farbe je Person, nicht nach dem Status der Wohnung.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

globalThis.window = { scrollY: 0, addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
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

const { RaumklimaOverviewCard } = await import("../src/cards/overview.js");
const { setLang } = await import("../src/shared.js");
const fixture = JSON.parse(readFileSync(new URL("./fixture.json", import.meta.url), "utf8"));

function render(persons) {
  const hass = {
    language: "de",
    locale: { language: "de", number_format: "language" },
    user: { is_admin: true },
    states: { ...fixture.states },
    entities: fixture.entities,
    devices: {},
    areas: {},
    floors: {},
    callWS: async () => ({}), callService: async () => {},
  };
  const base = hass.states["sensor.raumklima_allgemein_presence"];
  hass.states["sensor.raumklima_allgemein_presence"] = {
    ...base,
    state: "home",
    attributes: { ...base.attributes, configured: true, persons },
  };
  setLang(hass);
  const card = new RaumklimaOverviewCard();
  card.setConfig({ title: "Heizung" });
  card._hass = hass;
  card._render();
  return card.shadowRoot.innerHTML;
}

test("Personen-Chips färben sich nach Person, nicht nach Wohnungsstatus", () => {
  const html = render({
    "person.anna": { name: "Anna", present: true, place: "home" },
    "person.ben": { name: "Ben", present: false, place: "away", approaching: false },
    "person.cara": { name: "Cara", present: false, place: "away", approaching: true, eta_min: 12 },
    "person.dan": { name: "Dan", present: false, place: "unknown" },
  });
  const chip = (name) => html.split('<span class="chip"').find((s) => s.includes(name)) || "";
  assert.match(chip("Anna · Zuhause"), /--rk-ok/);
  assert.match(chip("Ben · unterwegs"), /--rk-cold/);
  assert.match(chip("Cara · unterwegs"), /--rk-warn/);
  assert.match(chip("Dan · unbekannt"), /--rk-off/);
  assert.doesNotMatch(chip("Ben · unterwegs"), /--rk-ok/);
});
