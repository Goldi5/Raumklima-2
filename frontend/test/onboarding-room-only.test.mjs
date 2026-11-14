// Regression: Beim Anlegen eines weiteren Raums fragt der Assistent nur
// Raumthemen ab – keine Wohnungs-, PV- oder Energie-/Tarifdaten.
import { test } from "node:test";
import assert from "node:assert/strict";

import { OnboardingMethods } from "../src/cards/settings/onboarding.js";

const ctx = (calls) => ({
  ...OnboardingMethods,
  _rooms: [{ entry_id: "room1" }],
  _cfg: { choices: {} },
  _render() {},
  _flash() {},
  async _load() {},
  _hass: {
    callWS: async (msg) => {
      calls.push(msg);
      return msg.type === "raumklima/room/create" ? { entry_id: "new-room" } : { ok: true };
    },
  },
});

test("Raum-Modus überspringt Wohnung, PV und Energie", () => {
  const c = ctx([]);
  c._onboard = { step: 0, roomOnly: true, data: { heat_type: "trv" } };
  const ids = c._onboardVisible().map((s) => s.id);
  assert.deepEqual(ids, ["heat", "trv", "presence", "comfort", "air", "shade", "summary"]);
  for (const skipped of ["start", "home", "pv", "energy"]) assert.ok(!ids.includes(skipped), skipped);
});

test("Raum-Modus speichert Raumantworten und ändert die Wohnung nicht", async () => {
  const calls = [];
  const c = ctx(calls);
  c._onboard = {
    step: 0,
    roomOnly: true,
    data: {
      room_name: "Testraum", heat_type: "trv", room_type: "living",
      trv: "climate.test", temperature_sensor: "sensor.test",
      comfort_temperature: 21.5, setback_short: 19, setback_long: 17,
      co2_limit: 800, presence_kind: "mmwave", shading_mode: "auto",
      pv_yes: true, pv_entity: "sensor.pv", energy_source: "electric",
      energy_meter: "sensor.meter", energy_price: 0.4,
    },
  };
  await c._onboardFinish();
  const types = calls.map((x) => x.type);
  assert.deepEqual(types, ["raumklima/room/create", "raumklima/room/update"]);
  assert.equal(calls[0].comfort_temperature, 21.5);
  assert.equal(calls[0].setback_short, 19);
  assert.equal(calls[0].setback_long, 17);
  assert.equal(calls[1].changes.co2_limit, 800);
  assert.equal(calls[1].changes.presence_kind, "mmwave");
  assert.equal(calls[1].changes.shading_mode, "auto");
  assert.ok(!types.includes("raumklima/hub/update"));
});
