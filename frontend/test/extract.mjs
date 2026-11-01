// Sammelt alle deutschen Texte, die übersetzt werden (t("…") und Hilfsfunktionen).
// node test/extract.mjs → JSON-Liste
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const src = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) { if (f !== "i18n") walk(p); } else if (f.endsWith(".js")) files.push(p); });
walk(src);

const STR = String.raw`"((?:[^"\\]|\\.)*)"`;
const keys = new Set();
const SKIP = new Set(["air", "cold", "eco", "heat", "off", "ok", "warn", "g", "live", "push", "tts"]);
const add = (s) => { if (/[A-Za-zÄÖÜäöüß]/.test(s) && !/^(mdi:|var\(|#|color-mix)/.test(s) && !SKIP.has(s)) keys.add(JSON.parse(`"${s}"`)); };
for (const f of files) {
  const code = readFileSync(f, "utf8");
  // t("…")
  for (const m of code.matchAll(new RegExp(String.raw`(?<![\w$.])t\(\s*` + STR, "g"))) add(m[1]);
  // Hilfsfunktionen, die selbst übersetzen: erster Text
  for (const m of code.matchAll(new RegExp(String.raw`this\._(?:row|grp|v|flash|tile)\(\s*` + STR, "g"))) add(m[1]);
  // _row(…, "Untertitel") am Ende, _select(…, "– leer –")
  for (const m of code.matchAll(new RegExp(String.raw`,\s*` + STR + String.raw`\)(?=,|\n|\s*\]|\s*\))`, "g"))) add(m[1]);
  // Tabellen mit tmap({...}): alle Texte darin
  for (const m of code.matchAll(/tmap\(\{([\s\S]*?)\n?\}\)/g)) for (const s of m[1].matchAll(new RegExp(STR, "g"))) add(s[1]);
}
console.log(JSON.stringify([...keys].sort(), null, 1));
