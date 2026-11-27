// Kleine Grundbausteine ohne Abhängigkeiten (HTML maskieren, Regex maskieren, Farbton).
export const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// #98: Rohwert des Raumfühlers und Wert mit Korrektur – null, wenn der Fühler gerade nichts liefert.
export function rkSensorReading(state, offset) {
  const raw = parseFloat(state);
  if (!Number.isFinite(raw)) return null;
  const off = Number(offset) || 0;
  return { raw, corrected: Math.round((raw + off) * 10) / 10 };
}
export function toneVar(tone) { return `var(--rk-${tone || "off"})`; }
