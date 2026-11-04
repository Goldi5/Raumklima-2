// Rauchtest: Die Raumkarte muss für jeden Zustand HTML liefern.
// Läuft ohne Browser (kleiner DOM-Ersatz) – findet Tippfehler wie ein nicht
// importiertes `esc`, durch das eine Karte komplett verschwindet.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// --- Minimaler DOM-Ersatz, bevor die Module geladen werden
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

const { RaumklimaCard } = await import("../src/cards/room.js");
const { setLang } = await import("../src/shared.js");

const fixture = JSON.parse(readFileSync(new URL("./fixture.json", import.meta.url), "utf8"));

function render(attributes, overrides = {}) {
  const hass = {
    language: "de",
    locale: { language: "de", number_format: "language" },
    user: { is_admin: true },
    states: { ...fixture.states },
    entities: fixture.entities,
    devices: {},
    areas: {},
    floors: {},
    callWS: async () => ({}),
    callService: async () => {},
  };
  const base = hass.states["climate.bad"];
  hass.states["climate.bad"] = { ...base, ...overrides, attributes: { ...base.attributes, ...attributes } };

  setLang(hass);
  const card = new RaumklimaCard();
  card.setConfig({ entity: "climate.bad" });
  card._hass = hass;
  card._render();
  return card.shadowRoot.innerHTML;
}

test("Raumkarte rendert mit Batterie und Abgleich", () => {
  const html = render({
    battery: { name: "Bad - Temperatur und Luftfeuchte", level: 12, low: true },
    offset_auto: -2.4,
    calibration_mode: "target",
    trv_target: 15.5,
    temperature: 18.0,
  });
  assert.ok(html.length > 2000, "HTML zu kurz");
  assert.match(html, /Batterie/);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Raumkarte rendert als Überwachungsraum", () => {
  const html = render({ monitor: true, temperature: null, wish: null });
  assert.ok(html.length > 1000);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});

test("Raumkarte rendert mit offenem Fenster und Boost", () => {
  const html = render({ window_open: true, window_open_since: new Date().toISOString(), boost_until: null, ventilation: "please_close" });
  assert.ok(html.length > 2000);
  assert.doesNotMatch(html, /konnte nicht gezeichnet/);
});
