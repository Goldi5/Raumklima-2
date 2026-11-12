// Zahl-Einstellungen (fields.js): in sich stimmig und innerhalb der Grenzen des Backends.
// Anlass: beim Schimmelschutz-Deckel waren Schritt, Minimum und Maximum vertauscht –
// jeder Tipp setzte den Wert auf 0,5 K.
import { settingsSource } from "./settings-source.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { RK_NUM } from "../src/fields.js";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const settings = settingsSource();
// Grenzen gegen das Backend prüft tests/test_fields.py (fields.py ist die gemeinsame Quelle).

test("jedes Feld: Schritt > 0, Minimum < Maximum, Nachkommastellen passen zum Schritt", () => {
  for (const [key, f] of Object.entries(RK_NUM)) {
    assert.ok(f.step > 0, `${key}: Schritt ${f.step}`);
    assert.ok(f.min < f.max, `${key}: ${f.min} … ${f.max}`);
    assert.ok(f.step <= f.max - f.min, `${key}: Schritt größer als der Bereich`);
    if (!Number.isInteger(f.step)) assert.ok(f.dec >= 1, `${key}: Schritt ${f.step}, aber keine Nachkommastelle – der Wert würde gerundet angezeigt`);
    assert.equal(typeof f.unit, "string");
  }
});

test("die Karte nennt Grenzen nicht mehr von Hand", () => {
  const direct = [...settings.matchAll(/this\._optStepper\(/g)].length;
  assert.equal(direct, 1, "this._optStepper(…) nur noch in _num() – sonst this._num(scope, key, value) benutzen");
  for (const m of settings.matchAll(/this\._num\([^,]+,\s*"(\w+)"/g)) assert.ok(RK_NUM[m[1]], `fields.js: „${m[1]}" fehlt`);
});
