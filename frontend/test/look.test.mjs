// Optik: „modern" ist der Standard, „classic" bleibt als Ausweg, „glass" zum Ausprobieren.
// Dazu die Dunkel-Auswahl: Karte > Wohnung > Theme des Nutzers.
// Der Test hält fest, dass die Karten beides wirklich einhängen – sonst sieht man bei
// `look: glass` oder im Dunkelmodus einfach nichts anderes.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { GLASS_STYLES, MODERN_STYLES, rkDark, rkLook, rkLookStyles } from "../src/shared.js";

test('rkLook: modern ist der Standard', () => {
  assert.equal(rkLook({}), "modern");
  assert.equal(rkLook(null), "modern");
  assert.equal(rkLook({ look: "irgendwas" }), "modern");
  assert.equal(rkLook({ look: "modern" }), "modern");
  assert.equal(rkLook({ look: "classic" }), "classic");
  assert.equal(rkLook({ look: "glass" }), "glass");
  assert.equal(rkLookStyles("classic"), "");
  assert.equal(rkLookStyles("modern"), MODERN_STYLES);
  assert.equal(rkLookStyles("glass"), GLASS_STYLES);
});

test('rkDark: Karte schlägt Wohnung schlägt Theme', () => {
  const darkHass = { themes: { darkMode: true } };
  const lightHass = { themes: { darkMode: false } };
  assert.equal(rkDark(lightHass, {}, {}), false);
  assert.equal(rkDark(darkHass, {}, {}), true);
  assert.equal(rkDark(lightHass, {}, { look_dark: "on" }), true);
  assert.equal(rkDark(darkHass, {}, { look_dark: "off" }), false);
  // Kartenangabe gewinnt gegen die Wohnung
  assert.equal(rkDark(lightHass, { dark: "on" }, { look_dark: "off" }), true);
  assert.equal(rkDark(darkHass, { dark: "off" }, { look_dark: "on" }), false);
  // ohne Theme-Objekt (alte Karten) nicht werfen
  assert.equal(rkDark(undefined, {}, {}), false);
});

test('MODERN_STYLES ändert keine Struktur, nur Fläche und Schrift', () => {
  assert.ok(!/display\s*:\s*grid/.test(MODERN_STYLES));
  assert.ok(MODERN_STYLES.includes("radial-gradient"));
});

test('GLASS_STYLES ist Glas, kein Vollton', () => {
  assert.ok(GLASS_STYLES.includes("backdrop-filter"));
  assert.ok(!/display\s*:\s*grid/.test(GLASS_STYLES));
});

for (const file of ["overview.js", "room.js"]) {
  test(`${file} hängt Look und Dunkel-Zustand ein`, () => {
    const src = readFileSync(new URL(`../src/cards/${file}`, import.meta.url), "utf8");
    assert.ok(src.includes("rkLookStyles"), "rkLookStyles fehlt im Import");
    assert.ok(src.includes("rkDark"), "rkDark fehlt im Import");
    assert.ok(/const look = rkLook\(this\._config\)/.test(src), "Look wird nicht ermittelt");
    assert.ok(/rkLookStyles\(look\)/.test(src), "Stil wird nicht an den Look gebunden");
    assert.ok(/dark \? " dark" : ""/.test(src), "Dunkel-Klasse fehlt");
  });
}
