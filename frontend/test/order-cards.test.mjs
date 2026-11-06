// Issue #32: Auch Verlauf, Protokoll und Bericht müssen die gepflegte Raum-Reihenfolge nutzen.
// Die Übersicht sortiert seit langem richtig – die drei anderen Karten holten die Räume roh
// (alphabetisch) und luden das Layout nie.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dir = new URL("../src/cards/", import.meta.url);
const read = (name) => readFileSync(new URL(name, dir), "utf8");

for (const [file, was] of [
  ['history.js', 'Legende „Raumtemperatur“'],
  ['log.js', 'Raum-Chips'],
  ['report.js', 'Raumliste'],
]) {
  test(`${file}: nutzt die gepflegte Reihenfolge (${was})`, () => {
    const src = read(file);
    assert.match(src, /rkRoomsOrdered/, "muss rkRoomsOrdered benutzen");
    assert.match(src, /rkLayout\(/, "muss das Layout laden");
  });
}
