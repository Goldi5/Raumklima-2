// Zahl-Einstellungen (fields.js): in sich stimmig und innerhalb der Grenzen des Backends.
// Anlass: beim Schimmelschutz-Deckel waren Schritt, Minimum und Maximum vertauscht –
// jeder Tipp setzte den Wert auf 0,5 K.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { RK_NUM } from "../src/fields.js";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const ws = read("../../custom_components/raumklima/websocket_api.py");
const konst = read("../../custom_components/raumklima/const.py");
const settings = read("../src/cards/settings.js");

const names = Object.fromEntries([...konst.matchAll(/^(CONF_\w+): Final = "(\w+)"/gm)].map((m) => [m[1], m[2]]));
const numbers = Object.fromEntries([...konst.matchAll(/^(\w+): Final = ([\d.]+)\s*(?:#.*)?$/gm)].map((m) => [m[1], parseFloat(m[2])]));
const backend = {};
for (const m of ws.matchAll(/vol\.Optional\((CONF_\w+|"\w+")\): vol\.All\([^\n]*?vol\.Range\(([^)]*)\)/g)) {
  const key = names[m[1]] || m[1].replaceAll('"', "");
  const [lo, hi] = m[2].split(",").map((x) => x.trim()).map((x) => (x in numbers ? numbers[x] : parseFloat(x)));
  backend[key] = [lo, hi];
}

test("jedes Feld: Schritt > 0, Minimum < Maximum, Nachkommastellen passen zum Schritt", () => {
  for (const [key, f] of Object.entries(RK_NUM)) {
    assert.ok(f.step > 0, `${key}: Schritt ${f.step}`);
    assert.ok(f.min < f.max, `${key}: ${f.min} … ${f.max}`);
    assert.ok(f.step <= f.max - f.min, `${key}: Schritt größer als der Bereich`);
    if (!Number.isInteger(f.step)) assert.ok(f.dec >= 1, `${key}: Schritt ${f.step}, aber keine Nachkommastelle – der Wert würde gerundet angezeigt`);
    assert.equal(typeof f.unit, "string");
  }
});

test("Grenzen der Karte liegen innerhalb der Grenzen des Backends", () => {
  let checked = 0;
  for (const [key, f] of Object.entries(RK_NUM)) {
    const b = backend[key];
    if (!b) continue; // z. B. Wunschtemperatur: eigener Weg über die Climate-Entität
    assert.ok(Number.isFinite(b[0]) && Number.isFinite(b[1]), `${key}: Backend-Grenzen nicht lesbar`);
    assert.ok(f.min >= b[0] && f.max <= b[1], `${key}: Karte ${f.min}…${f.max}, Backend ${b[0]}…${b[1]}`);
    checked += 1;
  }
  assert.ok(checked >= 25, `nur ${checked} Felder gegen das Backend geprüft`);
});

test("die Karte nennt Grenzen nicht mehr von Hand", () => {
  const direct = [...settings.matchAll(/this\._optStepper\(/g)].length;
  assert.equal(direct, 1, "this._optStepper(…) nur noch in _num() – sonst this._num(scope, key, value) benutzen");
  for (const m of settings.matchAll(/this\._num\([^,]+,\s*"(\w+)"/g)) assert.ok(RK_NUM[m[1]], `fields.js: „${m[1]}" fehlt`);
});
