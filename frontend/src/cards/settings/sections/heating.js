import { fmt, t, toneVar, RK_MODES } from "../../../shared.js";

export const HeatingSectionMethods = {
  _groupHeating(ctx) {
    const { ch, st, H, seas } = ctx;
    // --- Heizsaison
    const mode = this._hubOpt("season_mode");
    const mdToInput = (v) => (v && /^\d{2}-\d{2}$/.test(v) ? `2000-${v}` : "");
    const seasRows = [
      `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
      this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
      this._row("Heizgrenze", this._num(H, "heating_limit", this._hubOpt("heating_limit")), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
      this._row("Heute heizen", st.heat_today_until
        ? `<button class="btn" data-action="cancel_heat_today" style="--c:var(--rk-heat)"><ha-icon icon="mdi:close"></ha-icon>${t("Beenden")}</button>`
        : `<button class="btn" data-action="heat_today" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><ha-icon icon="mdi:fire"></ha-icon>${t("24 h heizen")}</button>`, "für milde, aber kühle Tage"),
      this._more("seas-more", "Weitere Einstellungen", [
      this._row("Heizsaison", `<span class="v"><input class="inp short" type="date" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" type="date" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Kalender antippen – Tag und Monat zählen, das Jahr ist egal"),
      this._row("Außentemperatur von", this._select(H, "outdoor_temp_entity", ch.outdoor || [], this._hubOpt("outdoor_temp_entity"), "Wetterdienst"), "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst"),
      this._row("Kälteeinbruch unter", this._num(H, "cold_snap_temp", this._hubOpt("cold_snap_temp")), "3 Tage darunter → heizt auch außerhalb der Saison"),
      this._row("Sicherung", this._num(H, "frost_floor", this._hubOpt("frost_floor")), "fällt ein Raum darunter, heizt er immer"),
      this._row("Frostnacht: weniger absenken", this._optToggle(H, "frost_night", !!this._hubOpt("frost_night")), "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm"),
      this._row("Sommerpflege Ventile", this._optToggle(H, "valve_care", !!this._hubOpt("valve_care")), "mittwochs 11 Uhr kurz öffnen"),
      ].join(""), "hub", ["season_start", "season_end", "outdoor_temp_entity", "cold_snap_temp", "frost_floor", "frost_night", "valve_care"]),
    ].join("");
    return this._grp("heating", "Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows);
  },
};
