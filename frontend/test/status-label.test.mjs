// #100: „Wartet auf Wärme“ heißt jetzt „Heizt noch nicht“; tado: „Gerät heizt – Raum schon warm“.
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { scrollY: 0, addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
globalThis.document = { createElement: () => ({ style: {} }) };
globalThis.customElements = { define() {}, get() { return null; } };
globalThis.HTMLElement = class {};

const { statusFor } = await import("../src/shared.js");

test("Raum zu kalt, Gerät heizt nicht: verständlicher Text mit Grund", () => {
  const s = statusFor({ status: "waiting", wait_reason: { kind: "trv_satisfied", value: 21 } });
  assert.match(s.label, /^Heizt noch nicht – Thermostat misst am Heizkörper schon 21/);
  assert.equal(statusFor({ status: "waiting" }).label, "Heizt noch nicht");
});

test("Gerät heizt bei warmem Raum: Warnung statt normalem Heizt", () => {
  assert.equal(statusFor({ status: "heating" }).label, "Heizt");
  const s = statusFor({ status: "heating", heating_warm: true, overheat_trim: true });
  assert.equal(s.label, "Gerät heizt – Raum schon warm");
  assert.equal(s.tone, "warn");
  assert.ok(s.reason);
  assert.equal(statusFor({ status: "heating", heating_warm: true }).reason, "");
});
