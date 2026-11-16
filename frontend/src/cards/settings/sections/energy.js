import { esc, fmt, t } from "../../../shared.js";

export const EnergySectionMethods = {
  _sensorInfo(entityId) {
    const st = entityId ? this._hass && this._hass.states[entityId] : null;
    if (!st) return "–";
    const v = Number.parseFloat(st.state);
    if (!Number.isFinite(v)) return st.state;
    const unit = st.attributes.unit_of_measurement || "";
    return `${fmt(v, 2)} ${unit}`.trim();
  },

  _groupEnergy() {
    const H = this._hubOpt.bind(this);
    const raw = H("energy_source") || "auto";
    const source = raw === "auto" ? "" : raw;
    const choices = (this._cfg && this._cfg.choices) || {};
    const energy = choices.energy || [];
    const meters = source === "oil"
      ? [...new Map([...energy, ...(choices.oil || [])].map((x) => [x.id, x])).values()]
      : energy;
    const heat = choices.heat || energy;
    const tariffs = choices.tariff || [];
    const electric = source === "heatpump" || source === "electric";
    const now = (id, empty) => (id ? t("aktuell {v}", { v: this._sensorInfo(id) }) : t(empty));
    const step = (n, title, sub) => `<div class="estep"><span class="en">${n}</span><div><b>${t(title)}</b>${sub ? `<small>${t(sub)}</small>` : ""}</div></div>`;
    const guide = (title, lines) => `<details class="eguide" data-guide="${esc(title)}"${this._guideOpen && this._guideOpen.has(title) ? " open" : ""}><summary><ha-icon icon="mdi:book-open-variant"></ha-icon>${t(title)}</summary><ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul></details>`;
    const on = !!H("energy_enabled");
    const head = this._row("Energie-Erfassung", this._optToggle("hub", "energy_enabled", on),
      "Zähler und Preise auswerten – Raumklima rechnet nur aus und steuert die Heizung nicht");
    if (!on) return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", head);

    // --- 1 Wie heizt ihr?
    const s1 = [
      step(1, "Wie heizt ihr?", "bestimmt, welche Zähler und Preise abgefragt werden"),
      this._row("Energiequelle", this._segs("hub", "energy_source", {
        heatpump: t("Wärmepumpe"), gas: t("Gas"), oil: t("Heizöl"), district: t("Fernwärme"), electric: t("Strom direkt"),
      }, source), source ? "" : "bitte wählen – bisher automatisch erkannt"),
      guide("Anleitung: Welche Energiequelle passt?", [
        t("Wärmepumpe: Luft-, Sole- oder Wasser-Wärmepumpe – auch mit Heizstab, der läuft über denselben Stromzähler."),
        t("Strom direkt: Infrarotplatten, Nachtspeicher, Elektroheizkörper – eine kWh Strom ist eine kWh Wärme."),
        t("Gas: Brennwert- oder Heizwerttherme, auch Gasetagenheizung."),
        t("Fernwärme: Übergabestation im Keller, abgerechnet nach Wärmemenge."),
        t("Die Wahl ändert nichts an der Heizung selbst – sie legt nur fest, wie gerechnet wird."),
      ]),
    ];
    if (!source) {
      return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", [head, ...s1].join(""));
    }

    // --- 2 Was wird gemessen?
    const meterHint = {
      heatpump: "Strom der Wärmepumpe fürs Heizen – Gesamtzähler in kWh",
      electric: "Strom der Heizung – Gesamtzähler in kWh",
      gas: "Gaszähler in m³ oder kWh – Gesamtzähler",
      oil: "Liter-Zähler des Brenners – oder leer lassen und den Tank wählen",
      district: "Wärmemengenzähler der Übergabestation in kWh oder MWh",
    }[source];
    const s2 = [
      step(2, "Was wird gemessen?", "immer Gesamtzähler, die nur steigen – keine Tages- oder Wochenwerte"),
      this._row("Zähler", this._select("hub", "energy_meter", meters, H("energy_meter"), "– wählen –"), now(H("energy_meter"), meterHint)),
      source !== "oil" && source !== "district" ? this._row("Zähler misst", this._segs("hub", "energy_meter_scope", { heating: t("nur Heizung"), total: t("Heizung + Warmwasser") }, H("energy_meter_scope") || "heating"),
        (H("energy_meter_scope") || "heating") === "total"
          ? "der Warmwasser-Zähler teilt dann nur auf und wird nicht dazugezählt – ideal für einen fein messenden Gesamtzähler (z. B. Energiemanager)"
          : "Warmwasser kommt über den eigenen Zähler dazu") : "",
      source === "heatpump" ? this._row("Wärmemenge", this._select("hub", "energy_heat_entity", heat, H("energy_heat_entity"), "– keiner –"),
        now(H("energy_heat_entity"), "erzeugte Heizwärme – damit wird die Arbeitszahl gemessen statt geschätzt")) : "",
      source === "heatpump" && H("energy_heat_entity") ? this._row("Strom laut Wärmepumpe", this._select("hub", "energy_heat_elec_entity", meters, H("energy_heat_elec_entity"), "– keiner –"),
        now(H("energy_heat_elec_entity"), "optional: Strom fürs Heizen, wie die Wärmepumpe ihn selbst zählt – zeigt die Arbeitszahl zum Vergleich")) : "",
      source === "heatpump" && !H("energy_heat_entity") ? this._row("Jahresarbeitszahl", this._num("hub", "energy_efficiency", H("energy_efficiency") ?? 0),
        "nur ohne Wärmezähler: Wert aus dem Datenblatt, 0 = unbekannt") : "",
      source === "gas" ? this._row("Gas-Umrechnung", this._num("hub", "energy_factor", H("energy_factor") ?? 10), "kWh je m³ – steht auf der Gasrechnung") : "",
      source !== "oil" ? this._row("Warmwasser-Zähler", this._select("hub", "energy_ww_meter", meters, H("energy_ww_meter"), "– keiner –"),
        now(H("energy_ww_meter"), "nur wenn Warmwasser getrennt gemessen wird – zählt dann mit zu den Kosten")) : "",
      source === "heatpump" ? this._row("Warmwasser-Wärme", this._select("hub", "energy_ww_heat_entity", heat, H("energy_ww_heat_entity"), "– keiner –"),
        now(H("energy_ww_heat_entity"), "erzeugte Warmwasser-Wärme – für die Arbeitszahl beim Warmwasser")) : "",
      ...(source === "oil" ? [
        this._row("Tankfüllstand", this._select("hub", "energy_tank_entity", choices.tank || [], H("energy_tank_entity"), "– keiner –"),
          now(H("energy_tank_entity"), "Füllstand in %, L oder m³ – zeigt Restmenge und Bestellhinweis")),
        H("energy_tank_entity") ? this._row("Tankinhalt", this._num("hub", "energy_tank_capacity", H("energy_tank_capacity") ?? 0), "Nenninhalt in Litern – nötig, wenn der Fühler Prozent meldet") : "",
        H("energy_tank_entity") ? this._row("Öl bestellen ab", this._num("hub", "energy_tank_min", H("energy_tank_min") ?? 20), "Restmenge in Prozent – darunter erscheint der Bestellhinweis") : "",
        this._row("kWh je Liter", this._num("hub", "energy_oil_factor", H("energy_oil_factor") ?? 10), "Energieinhalt – 10 kWh/L ist typisch"),
        this._row("Letzter Winter (Liter)", this._num("hub", "energy_oil_winter_liters", H("energy_oil_winter_liters") ?? 0), "aus der letzten Lieferung oder dem Tankbuch"),
        this._row("Letzter Winter (Tage)", this._num("hub", "energy_oil_winter_days", H("energy_oil_winter_days") ?? 0), "über wie viele Tage diese Liter reichten"),
      ] : []),
      electric ? this._row("Hausverbrauch", this._select("hub", "energy_house_entity", energy, H("energy_house_entity"), "– keiner –"),
        now(H("energy_house_entity"), "optional: Stromverbrauch des ganzen Hauses in kWh")) : "",
      electric ? this._row("Netzbezug", this._select("hub", "energy_grid_entity", energy, H("energy_grid_entity"), "– keiner –"),
        now(H("energy_grid_entity"), "optional: Strom aus dem Netz in kWh – mit Hausverbrauch zählt PV und Batterie Stunde für Stunde")) : "",
      electric ? this._row("Einspeisung", this._select("hub", "energy_feed_entity", energy, H("energy_feed_entity"), "– keiner –"),
        now(H("energy_feed_entity"), "optional: Strom ins Netz in kWh – zeigt, wohin der Solarstrom ging")) : "",
      electric && H("energy_feed_entity") ? this._row("Einspeisevergütung", this._num("hub", "energy_feed_price", H("energy_feed_price") ?? 0),
        "€/kWh – steht im Bescheid des Netzbetreibers; 0 = nicht abziehen") : "",
      electric && H("energy_house_entity") && H("energy_grid_entity") ? this._row("Akku geladen", this._select("hub", "energy_battery_in_entity", energy, H("energy_battery_in_entity"), "– keiner –"),
        now(H("energy_battery_in_entity"), "optional: Gesamtzähler „Batterie geladen“ in kWh")) : "",
      electric && H("energy_house_entity") && H("energy_grid_entity") ? this._row("Akku entladen", this._select("hub", "energy_battery_out_entity", energy, H("energy_battery_out_entity"), "– keiner –"),
        now(H("energy_battery_out_entity"), "optional: Gesamtzähler „Batterie entladen“ – mit beiden zählt nachts aus dem Netz geladener Akku-Strom zum Ladepreis")) : "",
      electric && !(H("energy_house_entity") && H("energy_grid_entity")) ? this._row("PV-Ertrag", this._select("hub", "pv_entity", choices.pv || [], H("pv_entity"), "– keiner –"),
        now(H("pv_entity"), "nur ohne Hausverbrauch und Netzbezug: grobe Schätzung über den Eigenverbrauch")) : "",
      electric && H("pv_entity") && !(H("energy_house_entity") && H("energy_grid_entity")) ? this._row("PV-Eigenverbrauch", this._num("hub", "pv_self_use", H("pv_self_use") ?? 0), "Anteil des PV-Ertrags, der die Heizung deckt") : "",
      guide("Anleitung: Den richtigen Zähler finden", [
        t("Einstellungen → Geräte & Dienste → deine Heizung öffnen (z. B. Stiebel Eltron, Vaillant, Viessmann, Shelly am Heizungszähler)."),
        t("Den Sensor nehmen, der „gesamt“ oder „total“ heißt und in kWh, m³ oder L zählt. Nicht „heute“ oder „letzte 24 h“ – die springen zurück."),
        t("Wärmepumpe: Strom fürs Heizen und – wenn vorhanden – die erzeugte Heizwärme. Meldet sie Warmwasser getrennt, beides auch dort eintragen; Warmwasser zählt zu den Kosten."),
        t("Hausverbrauch und Netzbezug: z. B. vom Smart Meter, Energiemanager oder Wechselrichter. Damit rechnet Raumklima jede Stunde, wie viel Strom aus PV und Batterie kam."),
        t("Akku: die beiden Gesamtzähler „geladen“ und „entladen“ (z. B. „Battery Energy In/Out“). Lädt der Akku nachts aus dem Netz, ist dieser Strom später nicht kostenlos – Raumklima rechnet ihn zum Preis beim Laden."),
        t("Kein Zähler? Dann unter „Berichte“ die Heizkosten pro Jahr laut Abrechnung eintragen."),
      ]),
    ];

    // --- 3 Was kostet die kWh?
    const fb = H("energy_tariff_fallbacks") || [];
    const primary = H("energy_tariff");
    const others = tariffs.filter((x) => x.id !== primary);
    const priceUnit = source === "oil" ? "€/L" : source === "gas" ? "€/kWh oder €/m³" : "€/kWh";
    const s3 = [
      step(3, "Was kostet die kWh?", "ein Preis für alles – Dashboard, Bericht und Vergleich rechnen gleich"),
      source === "oil"
        ? this._row("Ölpreis", this._num("hub", "energy_oil_price", H("energy_oil_price") ?? 1.10), "Preis je Liter der letzten Lieferung – wird mit Datum notiert")
        : this._row("Preisquelle", this._select("hub", "energy_tariff", tariffs, primary, "– fester Preis –"),
          primary ? now(primary, "") : t("Sensor mit dem Arbeitspreis in {u} – oder fester Preis darunter", { u: priceUnit })),
      electric && primary ? this._row("Reserve-Preisquellen", `<div class="chips">${others.map((x) => {
        const chosen = fb.includes(x.id);
        return `<button class="chip2 ${chosen ? "" : "off"}" data-tarfb="${esc(x.id)}" title="${esc(x.id)}" ${this._admin ? "" : "disabled"}><i></i>${esc(x.name)}</button>`;
      }).join("") || `<span class="v mute">${t("keine weiteren Preis-Sensoren")}</span>`}</div>`,
        fb.length ? t("Reihenfolge: {l}", { l: esc(fb.map((id) => (tariffs.find((x) => x.id === id) || { name: id }).name).join(" → ")) }) : "springen ein, wenn die Hauptquelle nichts liefert – z. B. EPEX Spot") : "",
      source !== "oil" && !primary ? this._row("Arbeitspreis", this._num("hub", "energy_price", H("energy_price") ?? 0.3), "fester Preis je kWh, brutto – steht auf der Rechnung") : "",
      source === "oil" ? this._row("Marktpreis-Entität", this._select("hub", "energy_oil_market_entity", choices.oil_market || [], H("energy_oil_market_entity"), "– keiner –"),
        now(H("energy_oil_market_entity"), "optionaler Heizöl-Marktpreis in €/L – für den Vergleich")) : "",
      source === "oil" ? this._row("Preisverlauf", this._v((() => {
        const h = H("energy_oil_price_history") || [];
        const last = h[h.length - 1];
        return last ? `${esc(last.date)} · ${fmt(last.price, 2)} €/L` : t("noch kein Preis geändert");
      })(), !(H("energy_oil_price_history") || []).length), "wird beim Ändern des Ölpreises automatisch notiert") : "",
      this._row("Grundpreis", this._num("hub", "energy_base", H("energy_base") ?? 0), "monatliche Grundgebühr in €, brutto"),
      electric && H("energy_house_entity") ? this._row("Grundgebühr-Anteil", this._segs("hub", "energy_base_share", { full: t("ganz"), usage: t("nach Verbrauch") }, H("energy_base_share") || "full"),
        "ganz = eigener Wärmepumpen-Zähler; nach Verbrauch = gemeinsamer Hauszähler") : "",
      electric && primary ? this._row("Dynamischer Tarif", this._optToggle("hub", "energy_tariff_dynamic", !!H("energy_tariff_dynamic")), "Preis wechselt stündlich – Dashboard zeigt Preiskurve und günstige Stunden") : "",
      this._more("energy-price", "Preis ohne Steuern und Netzentgelt?", [
        primary ? this._row("Preisbasis", this._segs("hub", "energy_price_basis", { gross: t("brutto"), net: t("netto") }, H("energy_price_basis") || "gross"), "netto = der Sensor liefert nur den Börsen- oder Nettopreis") : "",
        primary ? this._row("Zusätzliche Abgaben", this._num("hub", "energy_extra_fee", H("energy_extra_fee") ?? 0), "€/kWh, die im Sensor fehlen: Netzentgelt, Umlagen, Stromsteuer, Aufschlag") : "",
        primary && H("energy_price_basis") === "net" ? this._row("MwSt.", this._num("hub", "energy_vat", H("energy_vat") ?? 19), "kommt auf Preis und Abgaben drauf") : "",
      ].join(""), "hub", ["energy_price_basis", "energy_extra_fee", "energy_vat"]),
      this._row("Preis jetzt", this._v(`${fmt(this._energyPriceNow(), 3)} €/kWh`, false), this._energyPriceSub(source)),
      this._more("energy-compare", "Vergleichspreise", [
        source !== "gas" ? this._row("Gaspreis zum Vergleich", this._num("hub", "energy_compare_gas", H("energy_compare_gas") ?? 0.11), "€/kWh brutto – für „Was kostet 1 kWh Wärme?“") : "",
        source !== "oil" ? this._row("Ölpreis zum Vergleich", this._num("hub", "energy_compare_oil", H("energy_compare_oil") ?? 1.10), "€/L brutto – für „Was kostet 1 kWh Wärme?“") : "",
        source !== "heatpump" ? this._row("Strompreis zum Vergleich", this._num("hub", "energy_compare_power", H("energy_compare_power") ?? 0.30), "€/kWh brutto – was eine Wärmepumpe bei dir kosten würde (Arbeitszahl 3,5)") : "",
      ].join(""), "hub", ["energy_compare_gas", "energy_compare_oil", "energy_compare_power"]),
      guide("Anleitung: Welcher Preis ist der richtige?", [
        t("Am besten der Preis-Sensor deines Anbieters (z. B. 1KOMMA5°, Tibber, Octopus, Rabot): er kennt dein Netzentgelt und die MwSt – nichts weiter eintragen."),
        t("Zweitbeste Quelle: die Integration „EPEX Spot“ aus dem Marketplace. Der Börsenpreis ist überall in Deutschland gleich; regional verschieden ist das Netzentgelt."),
        t("Den Sensor „Total Price“ von EPEX Spot wählen, wenn dort Aufschlag und MwSt eingetragen sind. Sonst „Market Price“ wählen und hier unter „Preis ohne Steuern und Netzentgelt?“ auf netto stellen und die Abgaben eintragen."),
        t("Netzentgelt finden: Netzbetreiber steht auf der Stromrechnung. Auf dessen Website „Preisblatt Netzentgelte Strom“, Zeile Haushalt / ohne Leistungsmessung, Arbeitspreis in ct/kWh."),
        t("Netzentgelte ändern sich jedes Jahr zum 1. Januar – dann den Wert prüfen. Eine amtliche Tabelle zum Abrufen gibt es nicht."),
        t("Mehrere Quellen: die erste ist die Hauptquelle, Reserven springen ein, wenn sie nichts liefert. Fester Arbeitspreis: Preis je kWh von der Rechnung, brutto."),
      ]),
    ];

    // --- 4 Vergleich mit Klimagerät
    const s4 = [
      step(4, "Vergleich mit Klimagerät", "nur wenn ein Klimagerät auch heizen darf"),
      this._row("COP", this._num("hub", "ac_cop", H("ac_cop") ?? 3), "Leistungszahl beim Heizen laut Datenblatt (bei +7 °C)"),
      !electric ? this._row("Strompreis", this._num("hub", "electric_price", H("electric_price") ?? 0), "€/kWh brutto – die Heizung läuft nicht mit Strom, das Klimagerät schon") : "",
    ];
    const rows = [head, ...s1, ...s2, ...s3, this._more("energy-ac", "Vergleich mit Klimagerät", s4.join(""), "hub", ["ac_cop", "electric_price"])].join("");
    return this._grp("energy", "Energie & Tarife", "mdi:lightning-bolt", "warn", rows);
  },

  _energyPriceNow() {
    const e = ((this._cfg && this._cfg.hub && this._cfg.hub.state) || {}).energy || {};
    return e.price ?? 0;
  },

  _energyPriceSub(source) {
    const e = ((this._cfg && this._cfg.hub && this._cfg.hub.state) || {}).energy || {};
    if (e.source_name) return t("aus {s}", { s: esc(e.source_name) });
    return source === "oil" ? "Ölpreis je Liter umgerechnet auf kWh" : "gleicher Wert wie im Dashboard und im Bericht";
  },

  _groupWeather() {
    const H = this._hubOpt.bind(this);
    const choices = (this._cfg && this._cfg.choices) || {};
    const w = H("weather_entity") ? this._hass && this._hass.states[H("weather_entity")] : null;
    const sun = this._hass && this._hass.states["sun.sun"];
    const a = (w && w.attributes) || {};
    const time = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "–";
    const rows = [
      this._row("Wetterquelle", this._select("hub", "weather_entity", choices.weather || [], H("weather_entity"), "– wählen –"),
        t("Quelle für Außentemperatur, Vorhersage, Sonnenseite und Frostnacht")),
      this._row("Außentemperatur von", this._select("hub", "outdoor_temp_entity", choices.outdoor || [], H("outdoor_temp_entity"), "Wetterdienst"),
        t("eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst")),
      this._row("Aktuell", this._v(w ? `${esc(a.weather || w.state)} · ${fmt(a.temperature)} °C` : "–", !w),
        w && a.apparent_temperature != null ? t("gefühlt {v} °C", { v: fmt(a.apparent_temperature) }) : ""),
      this._row("Feuchte", this._v(w && a.humidity != null ? `${fmt(a.humidity, 0)} %` : "–", !w), ""),
      this._row("Wind", this._v(w && a.wind_speed != null ? `${fmt(a.wind_speed, 1)} km/h` : "–", !w), ""),
      this._row("Sonne", this._v(sun ? t(sun.state === "above_horizon" ? "über dem Horizont" : "unter dem Horizont") : "–", !sun), t("für die Verschattung und die Sonnenprognose")),
      // next_rising/next_setting = Sonnenauf-/-untergang (next_dawn/next_dusk wären die Dämmerung)
      this._row("Sonnenaufgang", this._v(time((sun && sun.attributes || {}).next_rising), !sun), t("nächster Sonnenaufgang")),
      this._row("Sonnenuntergang", this._v(time((sun && sun.attributes || {}).next_setting), !sun), t("nächster Sonnenuntergang")),
      this._row("Heizgrenze", this._v(`${fmt(this._hubOpt("heating_limit") ?? 15, 1)} °C`, false), t("darunter gilt die Heizsaison")),
      this._row("Kälteeinbruch", this._v(`${fmt(this._hubOpt("cold_snap_temp") ?? 12, 1)} °C`, false), t("Vorhersage unter diesem Wert")),
      this._row("Sturm", this._v(`${fmt(this._hubOpt("storm_gust_kmh") ?? 70, 0)} km/h`, false), t("Böen ab dieser Stärke")),
    ];
    return this._grp("weather", "Wetter", "mdi:weather-partly-cloudy", "air", rows.join(""), "span");
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
