// Baut die Karten (src/) zu einer Datei, die Home Assistant direkt lädt.
//   npm run build   → custom_components/raumklima/www/raumklima-card.js
//   npm run watch   → bei jeder Änderung neu bauen
//   npm run check   → nur prüfen (Syntax, Version), nichts schreiben
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const manifest = JSON.parse(readFileSync(resolve(root, "custom_components/raumklima/manifest.json"), "utf8"));
const outfile = resolve(root, "custom_components/raumklima/www/raumklima-card.js");
const versionFile = resolve(here, "src/version.js");

const mode = process.argv.includes("--watch") ? "watch" : process.argv.includes("--check") ? "check" : "build";

// Version aus der manifest.json übernehmen
const versionSrc = `// Wird von build.mjs aus der manifest.json gesetzt – nicht von Hand ändern\nexport const RK_VERSION = "${manifest.version}";\n`;
if (readFileSync(versionFile, "utf8") !== versionSrc) {
  if (mode === "check") {
    console.error(`src/version.js passt nicht zur manifest.json (${manifest.version}) – npm run build ausführen`);
    process.exit(1);
  }
  writeFileSync(versionFile, versionSrc);
}

const options = {
  entryPoints: [resolve(here, "src/index.js")],
  bundle: true,
  format: "iife",
  target: ["es2022"],
  legalComments: "none",
  charset: "utf8",
  banner: {
    js: `/* Raumklima ${manifest.version} – gebaut aus frontend/src (npm run build). Nicht von Hand bearbeiten. */`,
  },
  logLevel: "info",
};

if (mode === "watch") {
  const ctx = await esbuild.context({ ...options, outfile });
  await ctx.watch();
} else if (mode === "check") {
  await esbuild.build({ ...options, write: false, logLevel: "warning" });
  console.log("Karte ok");
} else {
  await esbuild.build({ ...options, outfile });
}
