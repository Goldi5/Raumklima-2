// npm test: Auswahllisten sortiert und mit Suchfeld (#84).
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.HTMLElement = class {};
globalThis.customElements = { get: () => undefined, define: () => {} };
const { rkEnhanceSelects } = await import("../src/shared.js");

const opt = (v, n) => `<option value="${v}">${n}</option>`;
const names = ["Wohnzimmer", "Anwesenheitssimulation", "Lampen WZ", "Ärgerlampe", "battery_sim: A", "Zeta", "OG Lampe Diele", "TV Licht", "Lichter"];

test("lange Liste wird sortiert und bekommt ein Suchfeld", () => {
  const html = `<div><select class="sel" id="addPLight-x">${opt("", "–")}${names.map((n, i) => opt("e" + i, n)).join("")}</select></div>`;
  const out = rkEnhanceSelects(html);
  assert.match(out, /data-selsearch/);
  const order = [...out.matchAll(/<option value="([^"]*)">([^<]*)</g)].map((m) => m[2]);
  assert.equal(order[0], "–");
  assert.deepEqual(order.slice(1), [...names].sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" })));
});

test("kurze Listen und schon umschlossene bleiben unverändert", () => {
  const short = `<select class="sel" id="a">${opt("1", "B")}${opt("2", "A")}</select>`;
  assert.equal(rkEnhanceSelects(short), short);
  const wrapped = `<div class="selwrap" data-selwrap><input data-selsearch>${`<select class="sel" data-sel="x">${names.map((n, i) => opt("e" + i, n)).join("")}</select>`}</div>`;
  assert.equal((rkEnhanceSelects(wrapped).match(/data-selsearch/g) || []).length, 1);
});

test("data-nosort behält die Reihenfolge", () => {
  const html = `<select class="sel" data-nosort>${names.map((n, i) => opt("e" + i, n)).join("")}</select>`;
  const order = [...rkEnhanceSelects(html).matchAll(/<option value="[^"]*">([^<]*)</g)].map((m) => m[1]);
  assert.deepEqual(order, names);
});
