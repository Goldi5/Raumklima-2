// Kleine Grundbausteine ohne Abhängigkeiten (HTML maskieren, Regex maskieren, Farbton).
export const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function toneVar(tone) { return `var(--rk-${tone || "off"})`; }
