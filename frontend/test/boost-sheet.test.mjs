// Boost-Menü der großen Raumkarte (#88): öffnet direkt unter dem Kopf, klare Beschriftung,
// Standarddauer nicht doppelt.
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

const { RaumklimaCard } = await import("../src/cards/room.js");
const { setLang } = await import("../src/shared.js");
const fixture = JSON.parse(readFileSync(new URL("./fixture.json", import.meta.url), "utf8"));

function render(attributes = {}) {
  const hass = {
    language: "de", locale: { language: "de", number_format: "language" }, user: { is_admin: true },
    states: { ...fixture.states }, entities: fixture.entities, devices: {}, areas: {}, floors: {},
    callWS: async () => ({}), callService: async () => {},
  };
  const base = hass.states["climate.bad"];
  hass.states["climate.bad"] = { ...base, attributes: { ...base.attributes, ...attributes } };
  setLang(hass);
  const card = new RaumklimaCard();
  card.setConfig({ entity: "climate.bad" });
  card._hass = hass;
  card._boostOpen = true;
  card._render();
  return card.shadowRoot.innerHTML;
}

const sheetOf = (html) => html.slice(html.indexOf('<div class="bsheet">'), html.indexOf('<div class="chips">'));

test("Menü steht direkt unter dem Kopf, vor Status und Regler", () => {
  const html = render({ settings: { ...(fixture.states["climate.bad"].attributes.settings || {}), boost_minutes: 30 } });
  const sheet = html.indexOf('<div class="bsheet">');
  assert.ok(sheet > 0, "Boost-Menü fehlt");
  assert.ok(sheet < html.indexOf('<div class="chips">'), "Boost-Menü muss vor den Status-Chips stehen");
  assert.ok(sheet < html.indexOf('class="stats"'), "Boost-Menü darf nicht am Kartenende hängen");
});

test("Nicht gestartet: klare Ansage, Standard markiert und nicht doppelt", () => {
  const html = sheetOf(render({ boost_until: null, boost_open: false }));
  assert.match(html, /Noch nicht gestartet – Dauer wählen/);
  assert.doesNotMatch(html, /Dauer des Boosts:/, "alter Knopf sah aus wie eine Statusanzeige");
  const std = html.match(/\(Standard\)/g) || [];
  assert.equal(std.length, 1, "Standard genau einmal");
});

test("Läuft: Ansage zeigt die Restzeit", () => {
  const until = new Date(Date.now() + 25 * 60000).toISOString();
  const html = sheetOf(render({ boost_until: until }));
  assert.match(html, /Boost läuft noch 2[45] min/);
  assert.match(html, /Beenden/);
});
