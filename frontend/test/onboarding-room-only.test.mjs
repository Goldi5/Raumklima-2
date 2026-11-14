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

test("Assistent bietet keine bereits belegten Thermostate an", () => {
  const c = ctx([]);
  c._rooms = [
    { entry_id: "r1", attrs: { settings: { trv: "climate.bad" } } },
  ];
  c._cfg = { choices: { climate: [
    { id: "climate.bad", name: "Bad" },
    { id: "climate.frei", name: "Frei" },
  ] } };
  c._onboardStart();
  assert.equal(c._onboard.data.trv, "climate.frei");
  c._onboardOpen = true;
  c._onboard.step = 1;
  const html = c._onboardHtml();
  assert.ok(!html.includes('value="climate.bad"'), "belegtes Thermostat im Auswahlfeld");
  assert.ok(html.includes('value="climate.frei"'), "freies Thermostat fehlt");
});

test("Nur messen bietet keine Fühler belegter Messräume an", () => {
  const c = ctx([]);
  c._rooms = [
    { entry_id: "r1", attrs: { settings: { trv: "", temperature_sensor: "sensor.used" } } },
  ];
  c._cfg = { choices: { outdoor: [
    { id: "sensor.used", name: "Belegt" },
    { id: "sensor.free", name: "Frei" },
  ] } };
  c._onboard = { step: 0, roomOnly: true, data: { heat_type: "monitor", temperature_sensor: "sensor.used" } };
  c._onboardOpen = true;
  c._onboard.step = c._onboardVisible().findIndex((s) => s.id === "trv");
  const html = c._onboardHtml();
  assert.ok(!html.includes('value="sensor.used"'), "belegter Fühler im Auswahlfeld");
  assert.ok(html.includes('value="sensor.free"'), "freier Fühler fehlt");
});

test("Nur messen zeigt den Fühler-Schritt ohne Thermostat", () => {
  const c = ctx([]);
  c._rooms = [{ entry_id: "r1", attrs: { settings: { trv: "climate.bad" } } }];
  c._cfg = { choices: {
    climate: [{ id: "climate.bad", name: "Bad" }],
    outdoor: [{ id: "sensor.test", name: "Test" }],
  } };
  c._onboardStart();
  assert.equal(c._onboard.data.heat_type, "monitor");
  const ids = c._onboardVisible().map((s) => s.id);
  assert.ok(ids.includes("trv"));
  c._onboardOpen = true;
  c._onboard.step = ids.indexOf("trv");
  const html = c._onboardHtml();
  assert.ok(!html.includes('data-onb="trv"'), "Thermostat darf bei Nur messen fehlen");
  assert.ok(html.includes('data-onb="temperature_sensor"'), "Temperaturfühler fehlt");
});
