// npm test: Beta-Übersicht nach Stockwerken (#80).
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.HTMLElement = class {};
globalThis.customElements = { get: () => undefined, define: () => {} };
const { rkFloorGroups } = await import("../src/shared.js");

const hass = {
  entities: {
    "climate.bad_eg": { device_id: "d1" },
    "climate.bad_og": { area_id: "bad_og" },
    "climate.kueche": { area_id: "kueche" },
    "climate.keller": {},
  },
  devices: { d1: { area_id: "bad_eg" } },
  areas: { bad_eg: { floor_id: "eg" }, bad_og: { floor_id: "og" }, kueche: { floor_id: "eg" } },
  floors: { og: { floor_id: "og", name: "Obergeschoss", level: 1 }, eg: { floor_id: "eg", name: "Erdgeschoss", level: 0 } },
};

test("gruppiert nach Stockwerk, Ebene aufsteigend, ohne Stockwerk zuletzt", () => {
  const rooms = [{ id: "climate.keller" }, { id: "climate.bad_og" }, { id: "climate.kueche" }, { id: "climate.bad_eg" }];
  const groups = rkFloorGroups(hass, rooms);
  assert.deepEqual(groups.map((g) => g.name), ["Erdgeschoss", "Obergeschoss", "Weitere Räume"]);
  // Reihenfolge innerhalb bleibt wie übergeben (gepflegte Reihenfolge)
  assert.deepEqual(groups[0].rooms.map((r) => r.id), ["climate.kueche", "climate.bad_eg"]);
});

test("ohne jedes Stockwerk bleibt alles wie bisher", () => {
  assert.deepEqual(rkFloorGroups({ entities: {}, areas: {}, floors: {} }, [{ id: "climate.a" }]), []);
});

test("Übersichtskarte nutzt entity_id", () => {
  const groups = rkFloorGroups(hass, [{ entity_id: "climate.bad_og" }]);
  assert.equal(groups[0].name, "Obergeschoss");
});
