// Kleine Grundbausteine ohne Abhängigkeiten (HTML maskieren, Regex maskieren, Farbton).
export const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// #103: Sind Bewohner gewählt, zählen nur sie – technische Benutzer (admin, Integrationen) bleiben aus
// den Listen. Ohne Auswahl bleibt alles sichtbar, damit niemandem etwas verschwindet. Bereits
// gewählte Einträge (keep) bleiben immer sichtbar.
export function rkRelevantPersons(all, residents, keep = []) {
  const list = Array.isArray(all) ? all : [];
  const res = Array.isArray(residents) ? residents : [];
  if (!res.length) return list;
  return list.filter((p) => res.includes(p.id) || keep.includes(p.id));
}
// #98: Rohwert des Raumfühlers und Wert mit Korrektur – null, wenn der Fühler gerade nichts liefert.
export function rkSensorReading(state, offset) {
  const raw = parseFloat(state);
  if (!Number.isFinite(raw)) return null;
  const off = Number(offset) || 0;
  return { raw, corrected: Math.round((raw + off) * 10) / 10 };
}
export function toneVar(tone) { return `var(--rk-${tone || "off"})`; }
