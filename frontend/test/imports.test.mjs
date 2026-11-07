// Wächter: jede benutzte Konstante/Funktion aus shared.js muss importiert sein.
// Anlass 1: „RK_VERSION is not defined" (settings.js) – Fehlerbericht und Debug-Spur stumm.
// Anlass 2: `rkLayout`/`rkRoomsOrdered` in report.js benutzt, aber nicht importiert – der
// hass-Setter warf, und die Berichtskarte blieb komplett leer, ohne jede Meldung.
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

test("benutzte shared-Helfer sind importiert (RK_* und rk*)", () => {
  const missing = [];
  for (const file of files(ROOT)) {
    const src = readFileSync(file, "utf8");
    const body = src
      .split("\n")
      .filter((line) => !/^\s*(import|export)\s/.test(line) && !line.trim().startsWith("//"))
      .join("\n");
    const used = new Set(body.match(/\b(RK_[A-Z0-9_]+|rk[A-Z][A-Za-z0-9]*)\b/g) || []);
    if (!used.size) continue;
    const imported = new Set((src.match(/^\s*import\s*\{[^}]*\}/gms) || []).join(" ").match(/\b(RK_[A-Z0-9_]+|rk[A-Z][A-Za-z0-9]*)\b/g) || []);
    for (const name of used) {
      if (!imported.has(name) && !new RegExp(`(const|let|function|class)\\s+${name}\\b`).test(src)) {
        missing.push(`${file.replace(ROOT, "")}: ${name}`);
      }
    }
  }
  assert.deepEqual(missing, [], `nicht importiert:\n${missing.join("\n")}`);
});
