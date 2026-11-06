// Regressionstest: Die Raum-Chips bei „Gäste gelten für" brauchen Name und Raum-Kennung.
// Fehlte beides, blieben die Chips leer (elf graue Punkte ohne Beschriftung).
// Seit Issue #30 kommen sie über _orderedRooms() – dieselbe Quelle, nur sortiert.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/cards/settings.js", import.meta.url), "utf8");

function guestChipBlock() {
  const i = src.indexOf('"Gäste gelten für"');
  assert.ok(i > 0, 'Zeile „Gäste gelten für“ nicht gefunden');
  return src.slice(i, i + 1200);
}

test("Gast-Chips kommen aus den Räumen der Wohnung", () => {
  const block = guestChipBlock();
  // _orderedRooms() liefert dieselben Räume in gepflegter Reihenfolge (Issue #30).
  assert.match(block, /this\._rooms|this\._orderedRooms\(\)/, "muss die Räume der aktuellen Wohnung nutzen");
  assert.doesNotMatch(block, /this\._cfg\.rooms/, "Konfigurationsliste hat weder Name noch Kennung");
});

test("Gast-Chips zeigen den Raumnamen und speichern die Raum-Kennung", () => {
  const block = guestChipBlock();
  assert.match(block, /esc\(r\.name\)/, "Raumname muss im Chip stehen");
  assert.match(block, /settings\)\s*\|\|\s*\{\}\)\.entry_id/, "Kennung muss die Raum-Entry-ID sein");
});
