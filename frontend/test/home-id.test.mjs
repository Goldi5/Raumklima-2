import { test } from "node:test";
import assert from "node:assert/strict";

import { rkHomeId } from "../src/shared.js";

const hass = (panelUrl) => ({
  panelUrl,
  states: {
    "switch.a": { attributes: { home_id: "A", home_name: "Allgemein", home_dashboard: "" } },
    "switch.r": { attributes: { home_id: "R", home_name: "Remscheid", home_dashboard: "heizung-remscheid" } },
  },
  entities: {
    "switch.a": { platform: "raumklima", translation_key: "presence", entity_id: "switch.a", device_id: "d1" },
    "switch.r": { platform: "raumklima", translation_key: "presence", entity_id: "switch.r", device_id: "d2" },
  },
});

test("ohne home zeigt die Karte alle Räume", () => {
  assert.equal(rkHomeId(hass("/heizung-berlin"), {}), null);
});

test("Wohnungsname in beliebiger Schreibweise", () => {
  assert.equal(rkHomeId(hass("/heizung-berlin"), { home: "remscheid" }), "R");
  assert.equal(rkHomeId(hass("/"), { home: "Remscheid" }), "R");
});

test("Dashboard-Pfad erkennt die Wohnung", () => {
  assert.equal(rkHomeId(hass("/heizung-remscheid"), {}), "R");
  assert.equal(rkHomeId(hass("/heizung-remscheid/raeume"), {}), "R");
});
