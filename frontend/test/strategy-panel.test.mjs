// #101 (Beta): Seiten mit nur einer Karte als Panel – nur wenn eingeschaltet.
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.HTMLElement = class {};
globalThis.customElements = { get: () => undefined, define: () => {} };
const { RaumklimaDashboardStrategy } = await import("../src/cards/strategy.js");
const { rkLayoutRemember } = await import("../src/rooms.js");

const hass = (home) => ({
  language: "de", locale: { language: "de" }, states: {}, entities: {}, devices: {}, areas: {}, floors: {},
  callWS: async (msg) => (msg.type === "raumklima/layout/get" ? { layout: {} } : {}),
  _home: home,
});

test("Standard: Abschnitts-Ansichten wie bisher", async () => {
  rkLayoutRemember({ beta_panel: false }, "h1");
  const d = await RaumklimaDashboardStrategy.generate({ home: "h1" }, hass("h1"));
  const settings = d.views.find((v) => v.path === "einstellungen");
  assert.equal(settings.type, "sections");
  assert.ok(settings.sections);
});

test("Beta eingeschaltet: Einstellungen, Bericht, Protokoll, Energie als Panel", async () => {
  rkLayoutRemember({ beta_panel: true }, "h2");
  const d = await RaumklimaDashboardStrategy.generate({ home: "h2" }, hass("h2"));
  for (const path of ["einstellungen", "bericht", "protokoll", "energie-lernen"]) {
    const v = d.views.find((x) => x.path === path);
    assert.equal(v.type, "panel", path);
    assert.equal(v.cards.length, 1);
    assert.equal(v.sections, undefined);
    assert.equal(v.cards[0].grid_options, undefined);
  }
  assert.equal(d.views.find((v) => v.path === "raeume").type, "sections");
});
