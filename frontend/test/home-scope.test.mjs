import { test } from "node:test";
import assert from "node:assert/strict";

import { rkHomeId } from "../src/shared.js";

function fakeHass(homes, panelUrl = "") {
  const entities = {};
  const states = {};
  homes.forEach((h, i) => {
    const id = `switch.raumklima_presence_${i}`;
    entities[id] = { entity_id: id, platform: "raumklima", translation_key: "presence" };
    states[id] = { entity_id: id, attributes: { home_id: h.id, home_name: h.name, home_dashboard: h.dashboard } };
  });
  return { entities, states, panelUrl };
}

test("rkHomeId nimmt die ID aus der Konfiguration", () => {
  const hass = fakeHass([{ id: "A", name: "Nordhaus", dashboard: "heizung-nordhaus" }]);
  assert.equal(rkHomeId(hass, { home: "A" }), "A");
});

test("rkHomeId akzeptiert auch den Wohnungsnamen", () => {
  const hass = fakeHass([{ id: "A", name: "Nordhaus", dashboard: "heizung-nordhaus" }]);
  assert.equal(rkHomeId(hass, { home: "Nordhaus" }), "A");
});

test("rkHomeId leitet die Wohnung aus dem Dashboard-Pfad ab", () => {
  const hass = fakeHass(
    [
      { id: "A", name: "Nordhaus", dashboard: "heizung-nordhaus" },
      { id: "B", name: "Osthaus", dashboard: "heizung-osthaus" },
    ],
    "/heizung-osthaus"
  );
  assert.equal(rkHomeId(hass, {}), "B");
});

test("ohne Treffer bleibt alles sichtbar (Standard-Dashboard)", () => {
  const hass = fakeHass([{ id: "A", name: "Nordhaus", dashboard: "heizung-nordhaus" }], "/lovelace");
  assert.equal(rkHomeId(hass, {}), null);
});
