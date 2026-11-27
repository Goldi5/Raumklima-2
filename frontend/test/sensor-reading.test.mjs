// #98: Neben „Korrektur Raumfühler“ steht, was der Fühler gerade misst und was Raumklima daraus macht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { rkSensorReading } from "../src/util.js";

test("Rohwert und korrigierter Wert", () => {
  assert.deepEqual(rkSensorReading("21.5", 0.7), { raw: 21.5, corrected: 22.2 });
  assert.deepEqual(rkSensorReading("22.04", -0.3), { raw: 22.04, corrected: 21.7 });
  assert.deepEqual(rkSensorReading("19", undefined), { raw: 19, corrected: 19 });
});

test("ohne Messwert kein Hinweis", () => {
  for (const s of ["unavailable", "unknown", undefined, ""]) assert.equal(rkSensorReading(s, 0.5), null);
});
