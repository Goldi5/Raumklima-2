// Wächter: jeder Name, den shared.js exportiert, muss in der Kartendatei importiert sein,
// wenn er dort benutzt wird. Anlass: „RK_VERSION is not defined" (settings.js), dann
// `rkLayout`/`rkRoomsOrdered` (Bericht blieb leer), zuletzt `loc` (Raumkarte). Alle drei
// waren benutzt, aber nicht importiert – `npm run check` prüft nur Syntax, der Fehler
// kommt erst im Browser und macht die Karte still leer.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const SRC = new URL("../src/", import.meta.url).pathname;

/** Alle Namen, die shared.js exportiert (Konstanten und Funktionen). */
function exported() {
  const src = readFileSync(join(SRC, "shared.js"), "utf8");
  const names = new Set();
  for (const m of src.matchAll(/^\s*export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) {
    names.add(m[1]);
  }
  for (const m of src.matchAll(/^\s*export\s*\{([^}]*)\}/gm)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) names.add(name);
    }
  }
  return names;
}

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : p.endsWith(".js") ? [p] : [];
  });
}

test("alle benutzten Exporte aus shared.js sind importiert", () => {
  const known = exported();
  assert.ok(known.size > 30, `Exporte aus shared.js nicht erkannt (${known.size})`);
  const missing = [];

  // Nur Kartencode prüfen: i18n/, help.js und shared.js sind Nachschlagetabellen bzw. die Quelle
  // selbst – dort steht `t` auch als Fließtext in Übersetzungen und wäre ein Fehlalarm.
  for (const file of files(join(SRC, "cards")).concat([join(SRC, "index.js")])) {
    const rel = file.replace(SRC, "");
    const src = readFileSync(file, "utf8");

    // Rumpf ohne Importzeilen und ohne Kommentarzeilen
    const body = src
      .split("\n")
      .filter((line) => !/^\s*(import|export)\s/.test(line) && !line.trim().startsWith("//"))
      .join("\n");

    const imported = new Set();
    for (const m of src.matchAll(/^\s*import\s*\{([^}]*)\}\s*from/gms)) {
      for (const part of m[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) imported.add(name);
      }
    }
    for (const m of src.matchAll(/^\s*import\s+(?:\*\s+as\s+)?([A-Za-z_$][\w$]*)\s+from/gm)) {
      imported.add(m[1]);
    }

    for (const name of known) {
      if (imported.has(name)) continue;
      if (!new RegExp(`(?<![.\\w$])${name}(?![\\w$])`).test(body)) continue;
      // lokal definiert? (Variable, Funktion, Klasse oder Destrukturierung)
      const local = new RegExp(
        `(?:const|let|var|function|class)\\s+${name}\\b` +
          `|\\{[^}]*\\b${name}\\b[^}]*\\}\\s*=` +
          `|\\(\\s*[^)]*\\b${name}\\b[^)]*\\)\\s*=>`,
      ).test(src);
      if (!local) missing.push(`${rel}: ${name}`);
    }
  }

  assert.deepEqual(missing, [], `benutzt, aber nicht importiert:\n${missing.join("\n")}`);
});
