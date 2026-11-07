// Look „modern" ist reine Optik: ein Schalter in der Kartenkonfiguration, kein zweites Markup.
// Der Test hält beides fest – dass der Schalter schaltet und dass die Karten den CSS-Block
// wirklich einhängen (sonst sieht man bei `look: modern` einfach nichts anderes).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { MODERN_STYLES, rkLook } from "../src/shared.js";

test('rkLook schaltet nur auf «modern»', () => {
  assert.equal(rkLook({ look: "modern" }), true);
  assert.equal(rkLook({}), false);
  assert.equal(rkLook(null), false);
  assert.equal(rkLook({ look: "klassisch" }), false);
});

test('MODERN_STYLES ändert keine Struktur, nur Fläche und Schrift', () => {
  // Kein display/grid — sonst wäre es ein Layoutwechsel statt eines Looks.
  assert.ok(!/display\s*:\s*grid/.test(MODERN_STYLES));
  assert.ok(MODERN_STYLES.includes("radial-gradient"));
  assert.ok(MODERN_STYLES.includes("prefers-color-scheme"));
});

for (const file of ["overview.js", "room.js"]) {
  test(`${file} hängt den Look ein`, () => {
    const src = readFileSync(new URL(`../src/cards/${file}`, import.meta.url), "utf8");
    assert.ok(src.includes("MODERN_STYLES"), "MODERN_STYLES fehlt im Import/Brauch");
    assert.ok(/rkLook\(this\._config\)/.test(src), "rkLook wird nicht ausgewertet");
    assert.ok(/MODERN_STYLES\s*:\s*""/.test(src), "Stil wird nicht bedingt eingehängt");
  });
}
