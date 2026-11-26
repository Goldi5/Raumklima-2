// #97: Raumauswahl im Verlauf – Tipp zeigt nur diesen Raum, nochmal alle; Zusatz schaltet um.
// #91: Hinweis „Handverstellt“ auf der Raumkarte.
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { scrollY: 0, addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
globalThis.document = { createElement: () => ({ style: {} }) };
globalThis.customElements = { define() {}, get() { return null; } };
globalThis.HTMLElement = class { attachShadow() { this.shadowRoot = { innerHTML: "", querySelectorAll: () => [], querySelector: () => null }; return this.shadowRoot; } };

const { rkSoloToggle } = await import("../src/cards/history.js");
const { rkHandAdjusted } = await import("../src/cards/room.js");
const all = ["a", "b", "c"];

test("Tipp zeigt nur diesen Raum, zweiter Tipp wieder alle", () => {
  let hidden = rkSoloToggle(new Set(), all, "b", false);
  assert.deepEqual([...hidden].sort(), ["a", "c"]);
  hidden = rkSoloToggle(hidden, all, "b", false);
  assert.equal(hidden.size, 0);
});

test("Tipp auf anderen Raum wechselt direkt", () => {
  const hidden = rkSoloToggle(new Set(["a", "c"]), all, "a", false);
  assert.deepEqual([...hidden].sort(), ["b", "c"]);
});

test("Lang drücken / Strg nimmt dazu oder weg", () => {
  let hidden = rkSoloToggle(new Set(["a", "c"]), all, "c", true);
  assert.deepEqual([...hidden], ["a"]);
  hidden = rkSoloToggle(hidden, all, "b", true);
  assert.deepEqual([...hidden].sort(), ["a", "b"]);
});

test("Handverstellt nur ohne Zeitplan, ohne Boost und bei Abweichung", () => {
  assert.equal(rkHandAdjusted({ wish: 19.5, comfort_temperature: 22.5 }, false, false), true);
  assert.equal(rkHandAdjusted({ wish: 22.5, comfort_temperature: 22.5 }, false, false), false);
  assert.equal(rkHandAdjusted({ wish: 19.5, comfort_temperature: 22.5, settings: { schedules: [{}] } }, false, false), false);
  assert.equal(rkHandAdjusted({ wish: 19.5, comfort_temperature: 22.5, boost_until: "x" }, false, false), false);
  assert.equal(rkHandAdjusted({ wish: 19.5, comfort_temperature: 22.5 }, true, false), false);
  assert.equal(rkHandAdjusted({ wish: 19.5, comfort_temperature: 22.5 }, false, true), false);
});
