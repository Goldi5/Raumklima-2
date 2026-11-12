// Quelltext der Einstellungen-Karte als ein Text: settings.js plus alle Teildateien unter settings/.
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../src/cards/", import.meta.url);
export const settingsSource = () =>
  [readFileSync(new URL("settings.js", dir), "utf8"),
    ...readdirSync(new URL("settings/", dir)).filter((f) => f.endsWith(".js")).sort().map((f) => readFileSync(new URL(`settings/${f}`, dir), "utf8"))].join("\n");
