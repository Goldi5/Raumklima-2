// Issue #30: Die gepflegte Reihenfolge muss auch in den Einstellungen gelten –
// ein auf „aus" gestellter Raum darf dort aber nicht verschwinden.
import assert from "node:assert/strict";
import test from "node:test";
import { rkLayoutApply, rkRoomsOrdered } from "../src/shared.js";

const rooms = [
  { id: "climate.bad", name: "Bad" },
  { id: "climate.buero", name: "Büro" },
  { id: "climate.wohnzimmer", name: "Wohnzimmer" },
];
const layout = {
  order: ["climate.wohnzimmer", "climate.bad", "climate.buero"],
  hidden: ["climate.buero"],
  size: {},
  color: {},
};

test("Einstellungen: Reihenfolge gilt, ausgeblendeter Raum bleibt sichtbar", () => {
  assert.deepEqual(rkRoomsOrdered(rooms, layout).map((r) => r.name), ["Wohnzimmer", "Bad", "Büro"]);
});

test("Reihenfolge akzeptiert auch alte Layouts mit Raumnamen", () => {
  const alt = { ...layout, order: ["Wohnzimmer", "Bad"] };
  assert.deepEqual(rkRoomsOrdered(rooms, alt).map((r) => r.name), ["Wohnzimmer", "Bad", "Büro"]);
});

test("Dashboard blendet weiterhin aus", () => {
  assert.deepEqual(rkLayoutApply(rooms, layout).map((r) => r.name), ["Wohnzimmer", "Bad"]);
});

test("ohne Layout bleibt die übergebene Reihenfolge", () => {
  assert.deepEqual(rkRoomsOrdered(rooms, null).map((r) => r.name), ["Bad", "Büro", "Wohnzimmer"]);
});
