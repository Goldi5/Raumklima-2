// Jede Erklärung hinter dem „?“ gehört zu einer echten Einstellung und hat Deutsch + Englisch.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HELP } from "../src/help.js";

const src = readFileSync(new URL("../src/cards/settings.js", import.meta.url), "utf8");
const labels = new Set([...src.matchAll(/_row\("([^"]+)"/g)].map((m) => m[1]));

test("Erklärungen passen zu Einstellungen", () => {
  const orphan = Object.keys(HELP).filter((k) => !labels.has(k));
  assert.deepEqual(orphan, [], "Erklärung ohne Einstellung");
});

test("Erklärungen zweisprachig und nicht leer", () => {
  for (const [k, v] of Object.entries(HELP)) {
    assert.equal(v.length, 2, k);
    assert.ok(v[0].length > 20 && v[1].length > 20, k);
  }
});

test("fast alle Einstellungen haben eine Erklärung", () => {
  const missing = [...labels].filter((l) => !HELP[l]);
  assert.ok(missing.length <= 3, `ohne Erklärung: ${missing.join(", ")}`);
});
