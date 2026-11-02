import { test } from "node:test";
import assert from "node:assert/strict";

import { rkTimeValue } from "../src/shared.js";

test("rkTimeValue nimmt HH:MM", () => {
  assert.equal(rkTimeValue("07:30"), "07:30");
  assert.equal(rkTimeValue("23:59"), "23:59");
});

test("rkTimeValue ergänzt fehlende Stellen", () => {
  assert.equal(rkTimeValue("7:5"), "07:05");
  assert.equal(rkTimeValue("7"), "07:00");
  assert.equal(rkTimeValue("0730"), "07:30");
});

test("rkTimeValue weist Unsinn ab", () => {
  assert.equal(rkTimeValue("24:00"), "");
  assert.equal(rkTimeValue("12:75"), "");
  assert.equal(rkTimeValue("abc"), "");
  assert.equal(rkTimeValue(""), "");
});

test("rkTimeValue akzeptiert Punkt und Leerzeichen als Trenner", () => {
  assert.equal(rkTimeValue("7.05"), "07:05");
  assert.equal(rkTimeValue("7 05"), "07:05");
});
