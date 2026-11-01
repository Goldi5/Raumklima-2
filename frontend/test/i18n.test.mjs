// npm test: jede übersetzbare Zeichenkette hat einen englischen Text,
// und kein lokaler Bezeichner „t“ verdeckt die Übersetzungsfunktion.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EN } from "../src/i18n/en.js";

const here = dirname(fileURLToPath(import.meta.url));

test("alle Texte übersetzt", () => {
  const keys = JSON.parse(execFileSync(process.execPath, [join(here, "extract.mjs")], { encoding: "utf8" }));
  const missing = keys.filter((k) => !(k in EN));
  assert.deepEqual(missing, [], "fehlende englische Texte in src/i18n/en.js");
});

test("Platzhalter stimmen überein", () => {
  for (const [de, en] of Object.entries(EN)) {
    const ph = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
    assert.equal(ph(en), ph(de), `Platzhalter in „${de}“`);
  }
});

test("kein lokales t verdeckt die Übersetzung", () => {
  const src = resolve(here, "../src");
  const files = [];
  const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith(".js") && files.push(p); });
  walk(src);
  const bad = /(?:\b(?:const|let|var)\s+t\b|\(\s*t\s*[,)]|,\s*t\s*\)|\[\s*t\s*,|\bfunction\s+\w*\s*\([^)]*\bt\b)/;
  for (const f of files) {
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      assert.ok(!bad.test(line.replace(/t\(/g, "T(")), `${f}:${i + 1}: lokales „t“ – bitte umbenennen`);
    });
  }
});
