// Auswahl- und Beschriftungstabellen der Einstellungen, Hinweisliste, Empfängernamen.
import { t, tmap } from "./i18n.js";
import { esc, toneVar } from "./util.js";

export const RK_ROOM_TYPES = tmap({ living: "Wohnraum", kitchen: "Küche", bedroom: "Schlafzimmer", bathroom: "Bad", children: "Kinderzimmer", office: "Arbeitszimmer", guest: "Gästezimmer", hallway: "Flur", gym: "Sportzimmer", rarely_used: "Selten genutzt" });
export const RK_CAL = tmap({ offset: "Offset am Thermostat", target: "Sollwert-Ausgleich", none: "Ohne Abgleich", hysteresis: "Hysterese (auf/zu)" });
export const RK_OFF = tmap({ auto: "Automatisch", preset: "Preset „aus“", hvac: "Modus „aus“", min_temp: "Minimaltemperatur", setpoint: "Fester Sollwert" });
export const RK_SYNC = tmap({ ok: ["Synchron", "ok"], pending: ["Wird übertragen", "warn"], failed: ["Fehlgeschlagen", "cold"] });
export const RK_BUILDING = tmap({ unrenovated: "Altbau unsaniert", renovated: "Altbau saniert", new: "Neubau / gedämmt" });
export const RK_NIGHT = tmap({ auto: "Automatisch", on: "Ja", off: "Nein" });
// Schimmelschutz-Stufen je Raum
export const RK_WALL = tmap({
  auto: "wie die Wohnung",
  corner: "Außenecke",
  wall: "Außenwand",
  interior: "innenliegend",
});
export const RK_MOLD = tmap({ strict: "Streng nach DIN", wish: "Nur bis Wunsch", off: "Aus" });
export const RK_QUIET = tmap({ auto: "Automatisch", on: "Immer", off: "Nie" });
export const RK_PREHEAT = tmap({ auto: "Automatisch", clock: "Frühestens ab", lead: "Frühestens vorher", off: "Erst zum Zeitplan" });
// Zeitplan: was außerhalb der Fenster gilt
export const RK_SCHED_FALLBACK = tmap({ wish: "Wunschtemperatur", short: "Kurz weg", long: "Länger weg", frost: "Sicherung" });
// Anbieter für den Mail-Versand: Server, Port, Verschlüsselung, Name
export const RK_MAIL_PROVIDERS = {
  gmail: ["smtp.gmail.com", 587, "starttls", "Gmail"],
  gmx: ["mail.gmx.net", 587, "starttls", "GMX"],
  webde: ["smtp.web.de", 587, "starttls", "WEB.DE"],
  outlook: ["smtp-mail.outlook.com", 587, "starttls", "Outlook / Hotmail"],
  tonline: ["securesmtp.t-online.de", 465, "ssl", "T-Online"],
  icloud: ["smtp.mail.me.com", 587, "starttls", "iCloud"],
  posteo: ["posteo.de", 587, "starttls", "Posteo"],
  einsundeins: ["smtp.1und1.de", 587, "starttls", "1&1"],
  ionos: ["smtp.ionos.de", 587, "starttls", "IONOS"],
};
export const RK_PKIND = tmap({ auto: "Automatisch", mmwave: "mmWave", pir: "PIR" });
export const RK_HOMESENS = tmap({ mmwave: "nur mmWave", all: "mmWave + PIR", off: "keine" });
export const RK_MODES = tmap({ auto: "Automatisch", always: "Immer heizen", pause: "Heizpause" });
export const RK_KINDS = tmap({
  vent_open: ["💧", "Bitte lüften"],
  vent_close: ["🪟", "Fenster schließen"],
  too_cold: ["🥶", "Raum kühlt aus"],
  vent_done: ["✅", "Luft ausgetauscht"],
  window_away: ["🚪", "Fenster offen, niemand da"],
  presence: ["🏠", "Abwesenheit & Vorheizen"],
  season: ["🍂", "Heizsaison Start/Ende"],
  trv_failure: ["⚠️", "Thermostat reagiert nicht"],
  health: ["🩺", "Gesundheit der Heizung"],
  report: ["📊", "Wochenbericht"],
  storm: ["🌪", "Sturm & Starkregen"],
  moisture: ["🧺", "Feuchtequelle im Raum"],
  live: ["📱", "Lüft-Countdown auf dem Sperrbildschirm"],
});
export const RK_LIGHT_SIGNALS = tmap({
  open: ["#005aff", "Bitte lüften"],
  close: ["#ff6e00", "Bitte schließen"],
  done: ["#00c83c", "Luft ausgetauscht"],
  problem: ["#ff0000", "Problem mit der Heizung"],
});
export const RK_DEFAULT_PUSH = ["vent_open", "vent_close", "too_cold", "vent_done", "window_away", "season", "trv_failure", "health", "report", "moisture"];
export const RK_SEV = tmap({ alert: ["cold", "mdi:alert-octagon-outline", "Dringend"], warn: ["warn", "mdi:alert-outline", "Warnung"], info: ["air", "mdi:information-outline", "Hinweis"] });
export function rkIssueList(issues, withRoom, prefix) {
  if (!issues || !issues.length) return `<div class="hok"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t("Alles in Ordnung – Thermostate, Fühler, Batterien und Funk unauffällig.")}</div>`;
  const order = { alert: 0, warn: 1, info: 2 };
  return `<div class="issues">${[...issues].sort((a, b) => order[a.severity] - order[b.severity]).map((i) => {
    const sv = RK_SEV[i.severity] || RK_SEV.info;
    const jump = i.entry_id ? ` data-goto-room="${esc(i.entry_id)}" role="button" tabindex="0" title="${t("zum Raum springen")}"` : "";
    return `<div class="issue"${jump} style="--c:${toneVar(sv[0])}"><ha-icon icon="${sv[1]}"></ha-icon><div><b>${withRoom && i.room ? esc(prefix ? (i.room.startsWith(prefix) ? i.room.slice(prefix.length).trimStart() : i.room) : i.room) + ": " : ""}${esc(i.title)}</b><small>${esc(i.message)}</small></div><span class="tag">${sv[2]}</span></div>`;
  }).join("")}</div>`;
}

export function rkPretty(target) {
  const s = String(target || "").replace(/^(notify|tts|media_player)\./, "").replace(/^mobile_app_/, "");
  return s.split("_").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || target;
}
