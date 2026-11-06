// Wächter: jede benutzte RK_*-Konstante muss in der Datei auch importiert sein.
// Genau das fehlte in settings.js – „RK_VERSION is not defined" hat dort den
// Fehlerbericht und die Debug-Spur stillgelegt, ohne dass ein Test anschlug.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = new URL("../src/", import.meta.url).pathname;

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : p.endsWith(".js") ? [p] : [];
  });
}

test("jede RK_*-Konstante ist importiert", () => {
  const missing = [];
  for (const file of files(ROOT)) {
    const src = readFileSync(file, "utf8");
    const body = src
      .split("\n")
      .filter((line) => !/^\s*(import|export)\s/.test(line) && !line.trim().startsWith("//"))
      .join("\n");
    const used = new Set(body.match(/\bRK_[A-Z0-9_]+\b/g) || []);
    if (!used.size) continue;
    const imported = new Set((src.match(/^\s*import\s*\{[^}]*\}/gms) || []).join(" ").match(/\bRK_[A-Z0-9_]+\b/g) || []);
    for (const name of used) {
      if (!imported.has(name) && !new RegExp(`(const|let|function)\\s+${name}\\b`).test(src)) {
        missing.push(`${file.replace(ROOT, "")}: ${name}`);
      }
    }
  }
  assert.deepEqual(missing, [], `nicht importiert:\n${missing.join("\n")}`);
});
