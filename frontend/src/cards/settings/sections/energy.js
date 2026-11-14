import { t } from "../../../shared.js";

export const EnergySectionMethods = {
  _groupEnergy() {
    const H = this._hubOpt.bind(this);
    const source = H("energy_source") || "auto";
    const choices = (this._cfg && this._cfg.choices) || {};
    const meters = choices.energy || [];
    const heat = choices.heat || [];
    const advanced = [
      this._row("Grundpreis", this._num("hub", "energy_base", H("energy_base") ?? 0), t("monatliche Grundgebühr in €")),
      this._row("Arbeitspreis", this._num("hub", "energy_price", H("energy_price") ?? 0.3), t("Preis pro kWh in € – gilt, wenn kein Tarif-Sensor gewählt ist")),
      (source === "gas" || source === "auto") ? this._row("Gas-Umrechnung", this._num("hub", "energy_factor", H("energy_factor") ?? 10), t("kWh je m³ – Brennwert × Zustandszahl; 10 ist ein typischer Näherungswert")) : "",
      source === "heatpump" ? this._row("Wärmemenge", this._select("hub", "energy_heat_entity", heat, H("energy_heat_entity"), "– wählen –"), t("optionaler Wärmezähler der Wärmepumpe – sonst zählt nur der Strom")) : "",
      source === "heatpump" ? this._row("Jahresarbeitszahl", this._num("hub", "energy_efficiency", H("energy_efficiency") ?? 0), t("optional: Wärme je kWh Strom (JAZ); 0 = unbekannt")) : "",
      H("pv_entity") ? this._row("PV-Eigenverbrauch", this._num("hub", "pv_self_use", H("pv_self_use") ?? 0), t("Anteil des PV-Ertrags, der den Verbrauch deckt – nur bei Gesamtverbrauchszähler")) : "",
      this._row("Dynamischer Tarif", `<button class="tgl ${H("energy_tariff_dynamic") ? "on" : ""}" data-optbool="hub" data-key="energy_tariff_dynamic" data-val="${H("energy_tariff_dynamic") ? 1 : 0}" ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
        t("der Tarif-Sensor liefert einen wechselnden Preis – die Karte zeigt ihn; die Kostenschätzung nutzt den aktuellen Wert")),
      this._row("Preisgrenze", this._num("hub", "energy_cheap_price", H("energy_cheap_price") ?? 0.2), t("bis zu diesem Preis gilt Strom als günstig")),
      this._row("Bei günstigem Strom vorheizen", `<button class="tgl ${H("energy_preheat_cheap") ? "on" : ""}" data-optbool="hub" data-key="energy_preheat_cheap" data-val="${H("energy_preheat_cheap") ? 1 : 0}" ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
        t("startet bis zu 60 min vor einem Zeitfenster, wenn der aktuelle Preis unter der Grenze liegt")),
      this._row("COP", this._num("hub", "ac_cop", H("ac_cop") ?? 3), t("Jahresarbeitszahl der Klimaanlage als Wärmepumpe – 3 ist ein typischer Richtwert")),
      this._row("Gaspreis", this._num("hub", "gas_price", H("gas_price") ?? 0.10), t("€/kWh – nur für den Vergleich „Klimaanlage oder Gas“")),
    ].join("");
    return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", [
      this._row("Energie-Erfassung", `<button class="tgl ${H("energy_enabled") ? "on" : ""}" data-optbool="hub" data-key="energy_enabled" data-val="${H("energy_enabled") ? 1 : 0}" ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
        t("Energiezähler und Tarife auswerten – Voraussetzung für die Euro-Schätzung im Bericht")),
      this._row("Energiequelle", this._select("hub", "energy_source", [
        { id: "auto", name: t("automatisch") },
        { id: "gas", name: t("Gas") },
        { id: "heatpump", name: t("Wärmepumpe") },
        { id: "district", name: t("Fernwärme") },
        { id: "electric", name: t("Strom") },
      ], source),
        t("bestimmt, wie der Zähler umgerechnet und welcher Tarif erwartet wird")),
      this._row("Zähler", this._select("hub", "energy_meter", meters, H("energy_meter"), "– wählen –"),
        t("Strom-, Gas- oder Wärmezähler – wird beim PDF-Bericht ausgewertet")),
      this._row("Tarif", this._select("hub", "energy_tariff", choices.tariff || [], H("energy_tariff"), "– wählen –"),
        t("Arbeitspreis-Sensor in €/kWh, ct/kWh oder €/m³ – optional, sonst gilt der feste Preis")),
      this._row("PV-Ertrag", this._select("hub", "pv_entity", choices.pv || [], H("pv_entity"), "– wählen –"),
        t("PV-Erzeugung in kWh – optional, nur für den Eigenverbrauch bei Strom und Wärmepumpe")),
      this._more("energy-more", "Weitere Einstellungen", advanced, "hub", ["energy_base", "energy_price", "energy_factor", "energy_efficiency", "pv_self_use", "energy_tariff_dynamic", "energy_cheap_price", "energy_preheat_cheap", "ac_cop", "gas_price"]),
    ].join(""));
  },

  _groupWeather() {
    return this._grp("weather", "Wetter", "mdi:weather-partly-cloudy", "air",
      `<div class="hint">${t("Kommt in einer späteren Beta: eigene Wetterquelle und Vorhersage je Wohnung.")}</div>`);
  },

  _groupReports(ctx) {
    const { ch, H } = ctx;
    // --- Gebäude
    const reportRows = [
      this._row("PDF-Berichte", `<div class="chips">${Object.entries({ week: t("Woche"), month: t("Monat"), season: t("Heizsaison") }).map(([k, l]) => { const on = (this._hubOpt("report_pdf") ?? ["week", "month", "season"]).includes(k); return `<button class="chip2 ${on ? "" : "off"}" data-rpdf="${k}" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><i></i>${l}</button>`; }).join("")}</div>`,
        "automatisch erstellen: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach Saisonende – Push mit Link an alle mit „Wochenbericht“"),
      this._row("PDF per E-Mail", `<button class="tgl ${this._hubOpt("report_email") ? "on" : ""}" data-mailtoggle ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
        this._hubOpt("report_email") ? "die PDF kommt als Anhang an die Empfänger unten" : "darunter einmal „E-Mail einrichten“ – danach kommt jeder Bericht auch per Mail"),
      this._mailSetup(ch.mail || []),
      this._hubOpt("report_email") && this._admin ? this._row("Test", `<button class="btn" data-pdftest style="--c:var(--rk-heat)"><ha-icon icon="mdi:email-fast-outline"></ha-icon>${t("Wochenbericht jetzt senden")}</button>`) : "",
      this._more("rep-more", "Weitere Einstellungen", [
      this._row(
        "Wärmemenge im Bericht",
        this._select(H, "report_metric", [
          { id: "auto", name: t("automatisch") },
          { id: "valve", name: t("Ventilstellung") },
          { id: "deficit", name: t("Gradstunden") },
          { id: "hours", name: t("Heizstunden") },
        ], this._hubOpt("report_metric") || "auto"),
        "automatisch = Ventilstellung, wenn jedes Thermostat sie meldet – sonst Gradstunden unter Ziel (gemessen, nicht geschätzt)"
      ),
      this._row("Heizkosten pro Jahr", `<span class="v"><input type="number" class="inp" min="0" max="20000" step="50" data-hubnum="annual_cost" value="${this._hubOpt("annual_cost") ?? ""}" placeholder="${t("z. B. 1400")}" ${this._admin ? "" : "disabled"} style="width:110px"> €</span>`, "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)"),
      ].join(""), "hub", ["report_metric", "annual_cost"]),
    ].join("");
    return this._grp("reports", "Berichte", "mdi:file-chart-outline", "heat", reportRows);
  },
};
