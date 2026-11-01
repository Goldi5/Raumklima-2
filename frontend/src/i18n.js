// Übersetzung der Karten. Deutsch ist die Ausgangssprache und zugleich der Schlüssel:
//   t("Heizt") → "Heating" (en), sonst unverändert.
//   t("{n} Räume", { n: 3 }) → "3 rooms"
// Sprache folgt Home Assistant (Profil → Sprache); alles außer Deutsch zeigt Englisch.
// Texte aus der Integration selbst (Protokoll, Hinweise) bleiben deutsch.
import { EN } from "./i18n/en.js";

let lang = "de";
let locale = "de-DE";

export function setLang(hass) {
  const l = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || "de");
  lang = l.toLowerCase().startsWith("de") ? "de" : "en";
  locale = lang === "de" ? "de-DE" : l;
}

export const getLang = () => lang;
export const loc = () => locale;

export function t(de, vars) {
  let s = lang === "de" ? de : (EN[de] ?? de);
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return s;
}

// Objekt, dessen Texte beim Lesen übersetzt werden (für Tabellen wie STATUS)
export function tmap(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const v = target[key];
      if (typeof v === "string") return t(v);
      if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? t(x) : x));
      if (v && typeof v === "object") return tmap(v);
      return v;
    },
  });
}
