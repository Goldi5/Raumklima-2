// Look „modern" ist reine Optik: ein Schalter in der Kartenkonfiguration, kein zweites Markup.
// Der Test hält beides fest – dass der Schalter schaltet und dass die Karten den CSS-Block
// wirklich einhängen (sonst sieht man bei `look: modern` einfach nichts anderes).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { GLASS_STYLES, MODERN_STYLES, rkLook, rkLookStyles } from "../src/shared.js";

test('rkLook kennt genau drei Looks', () => {
  assert.equal(rkLook({ look: "modern" }), "modern");
  assert.equal(rkLook({ look: "glass" }), "glass");
  assert.equal(rkLook({}), "classic");
  assert.equal(rkLook(null), "classic");
  assert.equal(rkLook({ look: "irgendwas" }), "classic");
  assert.equal(rkLookStyles("classic"), "");
  assert.equal(rkLookStyles("modern"), MODERN_STYLES);
  assert.equal(rkLookStyles("glass"), GLASS_STYLES);
});

test('MODERN_STYLES ändert keine Struktur, nur Fläche und Schrift', () => {
  // Kein display/grid — sonst wäre es ein Layoutwechsel statt eines Looks.
  assert.ok(!/display\s*:\s*grid/.test(MODERN_STYLES));
  assert.ok(MODERN_STYLES.includes("radial-gradient"));
  assert.ok(MODERN_STYLES.includes("prefers-color-scheme"));
});

test('GLASS_STYLES ist Glas, kein Vollton', () => {
  assert.ok(GLASS_STYLES.includes("backdrop-filter"));
  assert.ok(/\b(border-radius|box-shadow)\s*:/.test(GLASS_STYLES));
  assert.ok(!/display\s*:\s*grid/.test(GLASS_STYLES));
});

for (const file of ["overview.js", "room.js"]) {
  test(`${file} hängt den Look ein`, () => {
    const src = readFileSync(new URL(`../src/cards/${file}`, import.meta.url), "utf8");
    assert.ok(src.includes("rkLookStyles"), "rkLookStyles fehlt im Import");
    assert.ok(/rkLookStyles\(rkLook\(this\._config\)\)/.test(src), "Stil wird nicht an den Look gebunden");
    assert.ok(/= ?"classic" \? "" : rkLook/.test(src), "Klasse folgt nicht dem Look");
  });
}
