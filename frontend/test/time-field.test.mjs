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

import { readFileSync } from "node:fs";
import { settingsSource } from "./settings-source.mjs";

test("Zeitfenster öffnen den Viertelstunden-Wähler statt eines Textfelds", () => {
  const src = settingsSource();
  assert.ok(src.includes('this._tmBtn("sched:'), "Zeitplan nutzt den Zeitwähler nicht");
  assert.ok(src.includes('this._tmBtn("air:'), "Lüftfenster nutzen den Zeitwähler nicht");
  assert.ok(!/data-(sched|air)time=/.test(src), "altes Textfeld noch da");
  assert.ok(src.includes("_setWinTime(key, v)"), "Übernehmen schreibt nicht ins Zeitfenster");
});

test("Zeitwähler-Räder erreichen 23 Uhr und :45 (border-box)", () => {
  // Ohne border-box zählte das Polster zur Höhe: die Räder ließen sich nur bis 21 Uhr bzw. :15 drehen.
  const css = readFileSync(new URL("../src/styles.js", import.meta.url), "utf8");
  assert.match(css, /\.twheel \{ box-sizing:border-box;/);
});
