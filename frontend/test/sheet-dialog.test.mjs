// iPad/iPhone: „Sichern", „Diagnose" und „Fehler melden" dürfen keinen Download und kein
// window.open direkt aus dem Skript versuchen – beides wird dort verworfen. Der Dialog mit
// echten Knöpfen ist der Weg, der auf allen Geräten funktioniert.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/cards/settings.js", import.meta.url), "utf8");
const shared = readFileSync(new URL("../src/shared.js", import.meta.url), "utf8");

test("Fehler melden öffnet keinen Tab mehr aus dem Skript", () => {
  const start = src.indexOf("_openBugReport()");
  const end = src.indexOf("\n  _openSheet(sheet)");
  const block = src
    .slice(start, end)
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  assert.doesNotMatch(block, /window\.open/);
  assert.doesNotMatch(block, /link\.click\(\)/);
  assert.match(block, /this\._openSheet\(/);
});

test("Dialog hat GitHub-Link, Textfeld und echte Knöpfe", () => {
  const block = src.slice(src.indexOf("_sheetHtml()"), src.indexOf("async _sheetCopy()"));
  assert.match(block, /<textarea/);
  assert.match(block, /<a class="btn" href=/); // echter Anker statt click()
  assert.match(block, /data-sheet-save/);
  assert.match(block, /data-sheet-copy/);
  assert.match(block, /data-sheet-close/);
});

test("Sichern und Diagnose liefern erst Daten, dann den Dialog", () => {
  const backup = src.slice(src.indexOf("async _backupExport()"), src.indexOf("async _backupImport(file)"));
  assert.match(backup, /callWS\(\{ type: "raumklima\/backup\/export"/);
  assert.match(backup, /this\._openSheet\(/);
  assert.doesNotMatch(backup, /a\.download/, "kein Blob-Download direkt nach dem await");

  const diag = src.slice(src.indexOf("async _downloadDiagnostics()"), src.indexOf("_hubOpt(key)"));
  assert.match(diag, /callWS\(\{ type: "raumklima\/diagnostics"/);
  assert.match(diag, /this\._openSheet\(/);
  assert.doesNotMatch(diag, /a\.download/);
});

test("Speichern passiert im echten Klick und teilt auf iOS", () => {
  const block = src.slice(src.indexOf("_sheetSave()"), src.indexOf("async _backupExport()"));
  assert.match(block, /a\.click\(\)/);
  assert.match(src, /navigator\.canShare/);
  assert.match(src, /navigator\.share\(/);
});

test("Kopieren meldet ehrlich, wenn der Browser blockt", () => {
  const block = src.slice(src.indexOf("async _sheetCopy()"), src.indexOf("async _sheetShare()"));
  assert.match(block, /await navigator\.clipboard\.writeText/);
  assert.match(block, /blockiert/);
  assert.match(block, /return false;/); // Fehlerpfad gibt ehrlich false zurück
});

test("Dialog wird gerendert und gebunden", () => {
  assert.match(src, /\$\{this\._sheetHtml\(\)\}/);
  assert.match(src, /\[data-sheet-copy\]/);
  assert.match(shared, /\.sheetwrap/);
});
