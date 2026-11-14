import { fmt, planText, rkWindowOpen, t } from "../../../shared.js";

// Phase 3: Die Raum-Übersicht bündelt Status und Schnellzugriffe, statt alle
// Einstellgruppen untereinander zu zeigen. Die Gruppen selbst bleiben unverändert.
export const RoomOverviewMethods = {
  _roomOverviewGroup(r) {
    const a = r.attrs || {};
    const s = a.settings || {};
    if (a.monitor) return "";

    const id = s.entry_id;
    const target = a.effective_target != null ? a.effective_target : a.temperature;
    const ranges = (this._roomOpt(r, "schedules") ?? s.schedules ?? []).length;
    const sources = (this._roomOpt(r, "heat_sources") ?? s.heat_sources ?? []).length;
    const windows = a.window_entities || [];
    const open = windows.filter((w) => rkWindowOpen(this._hass, w)).length;
    const changed = (s.changed || []).length;
    const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : "";
    const go = (tab, label, icon) =>
      `<button class="btn small" data-roomtab="${tab}" style="--c:var(--rk-eco)"><ha-icon icon="${icon}"></ha-icon>${t(label)}</button>`;

    const quick = [
      [120, "2 Stunden", "2h"],
      [240, "4 Stunden", "4h"],
      [480, "8 Stunden", "8h"],
      [240, "Party", "party"],
      [0, "Pause", "off"],
    ];
    const balance = [
      s.valve_position != null ? `${t("Ventil")} ${fmt(s.valve_position, 0)} %` : "",
      s.heatup && s.heatup.rate != null ? `${t("Aufheizrate")} ${fmt(s.heatup.rate, 1)} K/h` : "",
      s.heatup && s.heatup.minutes_2k != null ? `${t("Aufheizen +2 K")} ${s.heatup.minutes_2k} min` : "",
      s.outdoor_temperature != null ? `${t("Draußen")} ${fmt(s.outdoor_temperature)} °C` : "",
    ].filter(Boolean).join(" · ") || t("lernt noch");
    const rows = [
      plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
      this._row(
        t("Jetzt"),
        this._v([
          a.current_temperature != null ? `${fmt(a.current_temperature)} °C` : "",
          a.current_humidity != null ? t("{h} % Feuchte", { h: fmt(a.current_humidity, 0) }) : "",
        ].filter(Boolean).join(" · ") || "–"),
        t("gemessen im Raum"),
        this._srcBadge(r, "temperature_sensor")
      ),
      this._row(
        t("Ziel"),
        this._v(target != null ? `${fmt(target)} °C` : "–"),
        t("was die Automatik gerade anstrebt"),
        this._srcBadge(r, "comfort_temperature")
      ),
      this._row(t("Wärmebilanz"), this._v(balance), t("schnelle Einordnung – keine neue Regel")),
      this._row(t("Zeitfenster"), this._v(ranges ? t("{n} angelegt", { n: ranges }) : t("keine"), !ranges), "", this._srcBadge(r, "schedules")),
      this._row(t("Heizquellen"), this._v(sources ? t("{n} Quellen", { n: sources }) : t("keine"), !sources), "", this._srcBadge(r, "heat_sources")),
      windows.length ? this._row(t("Fenster"), this._v(open ? t("{n} offen", { n: open }) : t("alle zu"), !open), "", this._srcBadge(r, "windows")) : "",
      changed ? this._row(t("Abweichungen"), this._v(t("{n} Einstellungen vom Standard abweichend", { n: changed })), t("unter „Regelung“ und den anderen Unterseiten änderbar")) : "",
      this._row(
        t("Schnell-Override"),
        `<div class="chips">${quick.map(([min, label, key]) => `<button class="chip2 ${a.boost_open && key === "party" ? "on" : ""}" data-roomboost="${key}" data-entry="${id}" data-min="${min}" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><i></i>${t(label)}</button>`).join("")}</div>`,
        a.boost_open ? t("läuft ohne Zeitlimit") : a.boost_until ? t("aktiv bis {t}", { t: new Date(a.boost_until).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }) : t("wärmt kurzzeitig über den Zeitplan hinaus")
      ),
      this._row(t("Präsenzstatus"), this._v(a.occupied === true ? t("belegt") : a.occupied === false ? (a.room_eco ? t("leer – abgesenkt") : t("leer")) : t("unbekannt"),
        a.occupied !== true), t("aus Meldern und Lampen; Anwesenheits-Temperatur gilt, solange jemand im Raum ist")),
      this._row(
        t("Schnellzugriff"),
        `<div class="chips">${[
          go("control", "Regelung", "mdi:thermometer"),
          go("schedule", "Zeitplan", "mdi:calendar-clock"),
          go("windows", "Fenster & Lüften", "mdi:window-open-variant"),
          go("sources", "Heizquellen", "mdi:radiator"),
        ].join("")}</div>`
      ),
    ];
    return this._grp("room", "Übersicht", "mdi:view-dashboard-outline", "air", rows.filter(Boolean).join(""), "span");
  },
};
