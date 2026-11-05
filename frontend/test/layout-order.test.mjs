// Reihenfolge aus dem Layout gilt auch, wenn sie (noch) Raumnamen enthält.
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
globalThis.document = { createElement: () => ({ style: {} }), addEventListener() {} };
globalThis.localStorage = { getItem: () => null, setItem() {} };

const { rkLayoutApply } = await import("../src/shared.js");

const rooms = [
  { entity_id: "climate.bad", attributes: { friendly_name: "Badezimmer" } },
  { entity_id: "climate.buero", attributes: { friendly_name: "Büro Sonja" } },
  { entity_id: "climate.flur", attributes: { friendly_name: "Flur" } },
  { entity_id: "climate.schlaf", attributes: { friendly_name: "Schlafzimmer" } },
];

test("Reihenfolge nach Entitäts-IDs", () => {
  const out = rkLayoutApply(rooms, { order: ["climate.schlaf", "climate.flur"] }).map((r) => r.entity_id);
  assert.deepEqual(out.slice(0, 2), ["climate.schlaf", "climate.flur"]);
});

test("Reihenfolge nach Raumnamen funktioniert ebenfalls", () => {
  const out = rkLayoutApply(rooms, { order: ["Schlafzimmer", "Flur"] }).map((r) => r.entity_id);
  assert.deepEqual(out.slice(0, 2), ["climate.schlaf", "climate.flur"]);
});

test("Ausgeblendete Räume bleiben draußen", () => {
  const out = rkLayoutApply(rooms, { hidden: ["climate.flur"], order: [] }).map((r) => r.entity_id);
  assert.ok(!out.includes("climate.flur"));
});
