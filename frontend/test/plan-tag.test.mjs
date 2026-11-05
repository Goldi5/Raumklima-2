// Übersicht: statt „Ziel 22,2° · Wunsch 19,0°" soll der Grund dranstehen (Schimmel, Zeitplan, …).
// Sonst muss man raten, warum das Ziel über dem Wunsch liegt.
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

const { planTag } = await import("../src/shared.js");

test("Schimmelschutz bekommt einen Namen", () => {
  assert.equal(planTag({ plan_reason: "mold" }), "Schimmel");
  assert.equal(planTag({ plan_reason: "schedule" }), "Zeitplan");
  assert.equal(planTag({ plan_reason: "boost" }), "Boost");
  assert.equal(planTag({ plan_reason: "away_long" }), "Abgesenkt");
});

test("Wunsch und Ruhezustand bleiben ohne Etikett", () => {
  assert.equal(planTag({ plan_reason: "normal" }), "");
  assert.equal(planTag({ plan_reason: "manual" }), "");
  assert.equal(planTag({}), "");
});

test("Übersicht nennt den Grund vor dem Wert", () => {
  const src = readFileSync(new URL("../src/cards/overview.js", import.meta.url), "utf8");
  assert.match(src, /planTag/);
  assert.match(src, /\{tag\} \{v\}° · Wunsch \{w\}°/);
});
