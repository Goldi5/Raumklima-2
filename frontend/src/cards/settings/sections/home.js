import { esc, fmt, t, rkNeedsDashboard, RK_BUILDING } from "../../../shared.js";

export const HomeSectionMethods = {
  _groupHomeWelcome(ctx) {
    const { ch, st } = ctx;
    return this._grp("home", "Erste Schritte", "mdi:check-decagram-outline", "ok", this._checkRows(st, ch), "span");
  },

  _groupHomeApartment(ctx) {
    const { ch, st, H } = ctx;
    // --- Wohnung
    const frsi = fmt({ unrenovated: 0.6, renovated: 0.7, new: 0.8 }[this._hubOpt("building_type")] || 0.7, 2);
    const homes = this._cfg.homes || [];
    const homeRows = [
      this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Ferienwohnung")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
      this._row("Bauart", this._segs(H, "building_type", RK_BUILDING, this._hubOpt("building_type"))),
      `<div class="hint">${t("Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.", { f: frsi })}</div>`,
      this._row("Wetterquelle", this._select(H, "weather_entity", ch.weather || [], this._hubOpt("weather_entity"), "– wählen –"), st.outdoor_temperature != null ? t("Draußen gerade {v} °C", { v: fmt(st.outdoor_temperature) }) : ""),
      this._more("home-more", "Dashboard, Standort, weitere Wohnung", [
      (() => {
        const dh = homes.find((h) => h.entry_id === this._cfg.hub.entry_id) || {};
        const dp = dh.dashboard || "";
        const fehlt = this._admin && rkNeedsDashboard(this._dashKnown(), dp, String((this._hass && this._hass.panelUrl) || "").replace(/^\//, ""));
        return this._row("Dashboard",
          `<input class="inp" data-hubtext="dashboard" value="${esc(this._hubOpt("dashboard") || "")}" placeholder="${esc(dp || "heizung")}" ${this._admin ? "" : "disabled"}>${
            fehlt ? ` <button class="mini" data-mkdash="${esc(dp)}" title="${t("Dashboard mit der Raumklima-Strategie anlegen")}">${t("anlegen")}</button>` : ` <span class="lt">${t("vorhanden")}</span>`
          }`,
          fehlt
            ? t("Für diese Wohnung gibt es noch kein Dashboard „{d}“ – der Knopf legt es mit der Raumklima-Strategie an (gefiltert auf diese Wohnung).", { d: dp })
            : t("Adresse des Dashboards dieser Wohnung (für den Umschalter)"));
      })(),
      (() => {
        const lat = this._hubOpt("latitude"), lon = this._hubOpt("longitude");
        const hl = this._hass.config || {};
        const haLat = hl.latitude != null ? fmt(hl.latitude, 4) : "–";
        const haLon = hl.longitude != null ? fmt(hl.longitude, 4) : "–";
        const zn = this._hubOpt("zone") || "";
        const zst = zn ? this._st(zn) : null;
        const zlat = zst && zst.attributes ? zst.attributes.latitude : null;
        const zlon = zst && zst.attributes ? zst.attributes.longitude : null;
        const own = lat != null || lon != null;
        return this._row("Standort der Wohnung",
          `<span class="v"><input type="number" class="inp short" step="0.0001" min="-90" max="90" data-hubgeo="latitude" value="${lat ?? ""}" placeholder="${t("Breite")}" ${this._admin ? "" : "disabled"}> <input type="number" class="inp short" step="0.0001" min="-180" max="180" data-hubgeo="longitude" value="${lon ?? ""}" placeholder="${t("Länge")}" ${this._admin ? "" : "disabled"}> ${this._admin ? `<button class="mini" data-geohass title="${t("Werte von Home Assistant übernehmen")}">${t("von HA")}</button>${own ? `<button class="mini x" data-geoclear title="${t("leeren – dann gilt Home Assistant")}">✕</button>` : ""}` : ""}</span>`,
          t("Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.", {
            zone: zn || t("keine Zone gesetzt"),
            zl: zlat != null && zlon != null ? `, ${fmt(zlat, 4)} / ${fmt(zlon, 4)}` : "",
            lat: haLat,
            lon: haLon,
          }),
        );
      })(),
      this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Ferienwohnung")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
      `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`,
      ].join(""), "hub", ["dashboard", "latitude", "longitude"]),
    ].join("");
    return this._grp("home", "Wohnung", "mdi:home-switch-outline", "air", homeRows);
  },

  _groupLearn(ctx) {
    return this._learnHub(ctx.st);
  },
};
