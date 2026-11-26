// #92: Neuzeichnen darf halb ausgefüllte Felder und laufende Klicks nicht zerstören.
import { test } from "node:test";
import assert from "node:assert/strict";

const listeners = {};
globalThis.window = { scrollY: 0, scrollTo() {}, addEventListener(type, fn) { (listeners[type] ||= []).push(fn); } };
globalThis.document = { createElement: () => ({ style: {} }) };
const { rkPaint, rkTrackPointer, rkPointerHeld } = await import("../src/shared.js");

// Mini-Wurzel: kennt nur Elemente mit data-draft, Wert aus value="…"
function fakeRoot() {
  const root = {
    els: [],
    set innerHTML(html) {
      this.els = [...html.matchAll(/<(input|select)[^>]*data-draft="([^"]+)"[^>]*?(?:value="([^"]*)")?[^>]*>/g)]
        .map((m) => ({ tagName: m[1].toUpperCase(), dataset: { draft: m[2] }, value: m[3] || "" }));
    },
    querySelectorAll(sel) { return sel === "[data-draft]" ? this.els : []; },
  };
  return root;
}

test("Entwurf im Namensfeld übersteht das Neuzeichnen", () => {
  const host = { shadowRoot: fakeRoot(), style: {}, offsetHeight: 0, parentElement: null, getRootNode: () => null };
  const html = '<input id="newRoomName" data-draft="newRoomName"><select id="newRoomTrv" data-draft="newRoomTrv"></select>';
  rkPaint(host, html);
  host.shadowRoot.els[0].value = "Flur oben";
  host.shadowRoot.els[1].value = "climate.flur";
  rkPaint(host, html);
  assert.equal(host.shadowRoot.els[0].value, "Flur oben");
  assert.equal(host.shadowRoot.els[1].value, "climate.flur");
});

test("Solange gedrückt ist, wird erst nach dem Loslassen gezeichnet", async () => {
  const handlers = {};
  const host = { shadowRoot: { addEventListener(type, fn) { handlers[type] = fn; } } };
  rkTrackPointer(host);
  assert.equal(rkPointerHeld(host, () => {}), false, "ohne Druck sofort zeichnen");
  handlers.pointerdown();
  let drawn = 0;
  assert.equal(rkPointerHeld(host, () => { drawn += 1; }), true);
  listeners.pointerup.forEach((fn) => fn());
  assert.equal(drawn, 0, "nicht im selben Moment – der Klick soll erst ankommen");
  await new Promise((r) => setTimeout(r, 90));
  assert.equal(drawn, 1);
});
