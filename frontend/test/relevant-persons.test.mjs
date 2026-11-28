// #103: Nur gewählte Bewohner anbieten – admin & technische Benutzer verschwinden aus den Listen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { rkRelevantPersons } from "../src/util.js";

const all = [{ id: "person.admin" }, { id: "person.alex" }, { id: "person.corina" }];

test("ohne Auswahl bleibt alles sichtbar", () => {
  assert.deepEqual(rkRelevantPersons(all, []).map((p) => p.id), ["person.admin", "person.alex", "person.corina"]);
  assert.equal(rkRelevantPersons(all, undefined).length, 3);
});

test("mit Auswahl nur die Bewohner", () => {
  assert.deepEqual(rkRelevantPersons(all, ["person.alex", "person.corina"]).map((p) => p.id), ["person.alex", "person.corina"]);
});

test("schon gewählte Einträge bleiben sichtbar", () => {
  assert.deepEqual(rkRelevantPersons(all, ["person.alex"], ["person.admin"]).map((p) => p.id), ["person.admin", "person.alex"]);
});
