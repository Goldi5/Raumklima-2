// npm test: Reihenfolge der Räume im Dashboard.
// Standard ist Stockwerk → Bereich → Name; über `sort:` umstellbar (floor | area | name).
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.HTMLElement = class {};
globalThis.customElements = { get: () => undefined, define: () => {} };
const { roomSort } = await import("../src/cards/strategy.js");

const room = (name, floorName, level, areaName) => ({
  name,
  floor: floorName === null ? null : { name: floorName, level },
  area: areaName === null ? null : { name: areaName },
});

test("Standard: Stockwerk, dann Bereich, dann Name", () => {
  const rooms = [
    room("Wohnzimmer", "Erdgeschoss", 0, "Wohnen"),
    room("Küche", "Erdgeschoss", 0, "Kochen"),
    room("Bad", "Obergeschoss", 1, "Bad"),
    room("Büro", null, null, null),
  ];
  // Räume ohne Stockwerk kommen ans Ende
  assert.deepEqual([...rooms].sort(roomSort({})).map((r) => r.name), ["Küche", "Wohnzimmer", "Bad", "Büro"]);
});

test("sort: name ignoriert Stockwerk und Bereich", () => {
  const rooms = [room("Bad", "Obergeschoss", 1, "Bad"), room("Küche", "Erdgeschoss", 0, "Kochen")];
  assert.deepEqual([...rooms].sort(roomSort({ sort: "name" })).map((r) => r.name), ["Bad", "Küche"]);
});

test("sort: area ordnet nach Bereich", () => {
  const rooms = [room("Küche", "Erdgeschoss", 0, "Kochen"), room("Bad", "Obergeschoss", 1, "Bad")];
  assert.deepEqual([...rooms].sort(roomSort({ sort: "area" })).map((r) => r.name), ["Bad", "Küche"]);
});
