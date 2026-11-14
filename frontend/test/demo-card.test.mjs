import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { scrollY: 0, addEventListener() {}, scrollTo() {} };
globalThis.document = { createElement: () => ({ style: {}, appendChild() {}, click() {}, remove() {} }), body: { appendChild() {} } };
globalThis.customElements = { define() {}, get() { return null; } };
globalThis.HTMLElement = class {
  constructor() { this.style = {}; }
  attachShadow() { this.shadowRoot = { innerHTML: "", querySelectorAll: () => [], querySelector: () => null }; return this.shadowRoot; }
  getRootNode() { return null; }
  dispatchEvent() {}
};
globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options?.detail; } };

const { RaumklimaDemoCard } = await import("../src/cards/demo.js");
const { RaumklimaDashboardStrategy } = await import("../src/cards/strategy.js");
const { setLang } = await import("../src/shared.js");

const hass = { language: "de", locale: { language: "de" }, states: {}, entities: {}, devices: {}, areas: {}, floors: {}, callWS: async () => ({}) };

test("Demo-Karte zeigt simulierte Räume", () => {
  setLang(hass);
  const card = new RaumklimaDemoCard();
  card.setConfig({});
  card._hass = hass;
  card._render();
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Bad/);
  assert.match(html, /Wohnzimmer/);
  assert.match(html, /Büro/);
  assert.match(html, /Simulierte Räume ohne Hardware/);
  assert.match(html, /data-demo-step/);
  assert.match(html, /data-demo-window/);
});

test("Demo-Modus der Strategie nutzt die Demo-Karte", async () => {
  const dash = await RaumklimaDashboardStrategy.generate({ demo: true }, hass);
  assert.equal(dash.views[0].path, "demo");
  assert.equal(dash.views[0].sections[0].cards[0].type, "custom:raumklima-demo-card");
});
