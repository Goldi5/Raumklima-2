// Der „Fehler melden"-Link enthält nur Technik – keine Raumnamen, keine Entitäten.

import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { addEventListener() {}, scrollTo() {} };
const { rkBugReportUrl } = await import("../src/shared.js");

const url = rkBugReportUrl({
  version: "0.52.0",
  haVersion: "2026.10.4",
  language: "de",
  rooms: 6,
  homeCount: 2,
  thermostats: ["Tuya TRV602Z", "Sonoff TRVZB", "Tuya TRV602Z", ""],
});

function decoded(href) {
  return decodeURIComponent(href);
}

test("Link zeigt auf das Repository und enthält die Umgebung", () => {
  assert.match(url, /^https:\/\/github\.com\/Goldi5\/Raumklima-2\/issues\/new\?/);
  const text = decoded(url);
  assert.match(text, /Raumklima: 0\.52\.0/);
  assert.match(text, /Home Assistant: 2026\.10\.4/);
  assert.match(text, /Räume: 6 in 2 Wohnung/);
  assert.match(text, /Tuya TRV602Z/);
  assert.match(text, /Sonoff TRVZB/);
});

test("Gerätemodelle werden entdoppelt", () => {
  const text = decoded(url);
  assert.equal(text.split("Tuya TRV602Z").length - 1, 1);
});

test("keine persönlichen Daten im Link", () => {
  const text = decoded(url);
  assert.doesNotMatch(text, /climate\./);
  assert.doesNotMatch(text, /sensor\./);
  assert.doesNotMatch(text, /Wohnzimmer|Bad|Schlafzimmer/);
  assert.doesNotMatch(text, /@/);
});

test("fehlende Werte werden nicht als undefined geschrieben", () => {
  const text = decoded(rkBugReportUrl({ rooms: 0, homeCount: 0, thermostats: [] }));
  assert.doesNotMatch(text, /undefined/);
  assert.match(text, /Thermostate: unbekannt/);
});
