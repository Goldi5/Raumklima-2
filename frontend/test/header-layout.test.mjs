// Kopfzeile der Raumkarte: Name kürzt, Fenstersymbol und Boost bleiben stehen.
// Ohne diese Regeln schob ein langer Raumname den Status und den Boost-Knopf aus der Zeile
// (Bild aus einer Wohnung: „Sportzimmer“ mit zweizeiligem Status).
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
const { STYLES, setLang } = await import("../src/shared.js");

const fixture = JSON.parse(readFileSync(new URL("./fixture.json", import.meta.url), "utf8"));

function render(attributes = {}) {
  const hass = {
    language: "de",
    locale: { language: "de", number_format: "language" },
    user: { is_admin: true },
    states: { ...fixture.states },
    entities: fixture.entities,
    devices: {}, areas: {}, floors: {},
    callWS: async () => ({}),
    callService: async () => {},
  };
  const base = hass.states["climate.bad"];
  hass.states["climate.bad"] = {
    ...base,
    attributes: { ...base.attributes, friendly_name: "Wohnzimmer mit Essbereich und Kamin", ...attributes },
  };
  setLang(hass);
  const card = new RaumklimaCard();
  card.setConfig({ entity: "climate.bad" });
  card._hass = hass;
  card._render();
  return card.shadowRoot.innerHTML;
}

test("Kopfzeile bricht nicht um, der Name kürzt", () => {
  const top = STYLES.slice(STYLES.indexOf(".top {"), STYLES.indexOf(".top {") + 200);
  assert.match(top, /flex-wrap:\s*nowrap/, "Kopfzeile darf nicht umbrechen");
  const name = STYLES.slice(STYLES.indexOf(".name {"), STYLES.indexOf(".name {") + 320);
  assert.match(name, /min-width:\s*0/, "Name muss schrumpfen dürfen");
  assert.match(name, /text-overflow:\s*ellipsis/, "gekürzter Name braucht …");
  assert.match(name, /white-space:\s*nowrap/, "Name darf nicht zweizeilig werden");
});

test("Status steht unter der Kopfzeile, nicht darin", () => {
  const html = render({ battery: { name: "Bad Fühler", level: 9, low: true } });
  const start = html.indexOf('<div class="top">');
  assert.ok(start > 0, "Kopfzeile fehlt");
  const top = html.slice(start, html.indexOf('<div class="chips"'));
  assert.ok(!top.includes('class="chip"'), "Status-Chip gehört nicht in die Kopfzeile");
  assert.ok(top.includes('class="name"') && top.includes('class="wins"'), "Name und Fenstersymbol gehören hinein");

  const chips = html.slice(html.indexOf('<div class="chips"'));
  assert.ok(chips.includes('class="chip"'), "Status fehlt unter der Kopfzeile");
  assert.ok(chips.indexOf("Batterie") < chips.indexOf('<div class="dial"'), "Batteriehinweis gehört zu den Chips");
});

test("Boost bleibt in der Kopfzeile", () => {
  // Der Boost-Knopf hängt als Geschwister-Entität am selben Gerät (translation_key „boost“)
  const deviceId = fixture.entities["climate.bad"].device_id;
  fixture.entities["button.bad_warmer_boost"] = {
    entity_id: "button.bad_warmer_boost",
    platform: "raumklima",
    translation_key: "boost",
    device_id: deviceId,
  };
  const html = render();
  const top = html.slice(html.indexOf('<div class="top">'), html.indexOf('<div class="chips"'));
  assert.ok(top.includes("boostbtn"), "Boost-Knopf muss bei Name und Fenstersymbol bleiben");
});
