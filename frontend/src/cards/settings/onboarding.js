// Einrichtungsassistent: führt Schritt für Schritt durch die wichtigsten Facetten.
import { RK_ROOM_TYPES, esc, fmt, t } from "../../shared.js";

const STEPS = [
  {
    id: "start", title: "Willkommen", fields: [],
    intro: "Der Assistent fragt die wichtigsten Punkte ab. Du kannst jederzeit abbrechen und später in den Einstellungen weitermachen.",
  },
  {
    id: "home", title: "Wohnung", fields: [
      { key: "home_name", label: "Name der Wohnung", type: "text", placeholder: "z. B. Remscheid", required: true },
      { key: "zone", label: "Zone", type: "select", choices: "zones", allowEmpty: true },
      { key: "weather_entity", label: "Wetterquelle", type: "select", choices: "weather", allowEmpty: true },
    ],
  },
  {
    id: "heat", title: "Heizung", fields: [
      { key: "room_name", label: "Name des Raums", type: "text", placeholder: "z. B. Bad", required: true },
      { key: "heat_type", label: "Art der Heizung", type: "select", options: [["trv","Thermostat"],["floor","Fußbodenheizung"],["monitor","Nur messen"]], required: true },
      { key: "room_type", label: "Raumtyp", type: "select", options: Object.entries(RK_ROOM_TYPES), required: true },
    ],
  },
  {
    id: "trv", title: "Thermostat & Fühler", show: (d) => d.heat_type !== "monitor", fields: [
      { key: "trv", label: "Thermostat", type: "select", choices: "climate", required: true },
      { key: "temperature_sensor", label: "Temperaturfühler", type: "select", choices: "outdoor", required: true },
      { key: "humidity_sensor", label: "Feuchtefühler (optional)", type: "select", choices: "humidity", allowEmpty: true },
      { key: "window_sensors", label: "Fensterkontakte (optional)", type: "multi", choices: "windows" },
    ],
  },
  {
    id: "pv", title: "Photovoltaik", fields: [
      { key: "pv_yes", label: "PV-Anlage vorhanden?", type: "toggle" },
      { key: "pv_entity", label: "PV-Ertrag", type: "select", choices: "pv", show: (d) => d.pv_yes, allowEmpty: true },
      { key: "pv_self_use", label: "Eigenverbrauch", type: "number", unit: " %", show: (d) => d.pv_yes, min: 0, max: 100, step: 5 },
    ],
  },
  {
    id: "energy", title: "Energie & Tarif", fields: [
      { key: "energy_source", label: "Quelle", type: "select", options: [["auto","Automatisch"],["electric","Strom"],["gas","Gas"],["heatpump","Wärmepumpe"],["district","Fernwärme"]] },
      { key: "energy_meter", label: "Zähler", type: "select", choices: "energy", allowEmpty: true },
      { key: "energy_tariff", label: "Tarif", type: "select", choices: "tariff", allowEmpty: true },
      { key: "energy_price", label: "Arbeitspreis", type: "number", unit: " €/kWh", min: 0, max: 2, step: 0.01 },
      { key: "energy_base", label: "Grundpreis", type: "number", unit: " €", min: 0, max: 1000, step: 1 },
    ],
  },
  {
    id: "presence", title: "Anwesenheit", fields: [
      { key: "presence_sensors", label: "Präsenzmelder", type: "multi", choices: "presence" },
      { key: "presence_kind", label: "Auswertung", type: "select", options: [["auto","Automatisch"],["mmwave","mmWave"],["pir","PIR"]] },
    ],
  },
  {
    id: "comfort", title: "Komfort & Absenkung", fields: [
      { key: "comfort_temperature", label: "Wunschtemperatur", type: "number", unit: " °C", min: 12, max: 26, step: 0.5 },
      { key: "setback_short", label: "Absenkung kurz weg", type: "number", unit: " °C", min: 10, max: 24, step: 0.5 },
      { key: "setback_long", label: "Absenkung länger weg", type: "number", unit: " °C", min: 8, max: 22, step: 0.5 },
    ],
  },
  {
    id: "air", title: "Lüften", fields: [
      { key: "co2_limit", label: "CO₂-Grenze", type: "select", options: [["800","800 ppm"],["1000","1000 ppm"],["1200","1200 ppm"],["1500","1500 ppm"]] },
    ],
  },
  {
    id: "shade", title: "Verschattung", fields: [
      { key: "shading_covers", label: "Rollläden/Jalousien", type: "multi", choices: "covers" },
      { key: "shading_mode", label: "Modus", type: "select", options: [["off","Aus"],["advise","Nur empfehlen"],["auto","Automatisch"]] },
    ],
  },
  {
    id: "floor", title: "Fußbodenheizung", show: (d) => d.heat_type === "floor", fields: [
      { key: "floor_supply", label: "Vorlauffühler", type: "select", choices: "outdoor", allowEmpty: true },
      { key: "floor_return", label: "Rücklauffühler", type: "select", choices: "outdoor", allowEmpty: true },
    ],
  },
  {
    id: "summary", title: "Fertig", fields: [],
    intro: "Der Assistent legt die Wohnung an, übernimmt die Energie-/Tarifdaten und erstellt den Raum. Du kannst danach alles in den Einstellungen feinjustieren.",
  },
];

const EMPTY = {
  home_name: "", room_name: "", heat_type: "trv", room_type: "living", energy_source: "auto",
  presence_kind: "auto", co2_limit: 1000,
  shading_mode: "off", pv_yes: false, pv_self_use: 0,
  energy_price: 0.3, energy_base: 0, floor_supply: "", floor_return: "",
};

export const OnboardingMethods = {
  _onboardStart() {
    const roomOnly = (this._rooms || []).length > 0;
    this._onboard = { step: 0, roomOnly, data: { ...EMPTY } };
    this._onboardOpen = true;
    this._render();
  },

  _onboardClose() {
    this._onboardOpen = false;
    this._onboard = null;
    this._render();
  },

  _onboardVisible() {
    const d = (this._onboard && this._onboard.data) || {};
    return STEPS.filter((s) => {
      if (this._onboard && this._onboard.roomOnly && (s.id === "start" || s.id === "home")) return false;
      return !s.show || s.show(d);
    });
  },

  _onboardCollect() {
    const root = this.shadowRoot;
    if (!root || !this._onboard) return;
    root.querySelectorAll("[data-onb]").forEach((el) => {
      const key = el.dataset.onb;
      if (el.type === "checkbox") this._onboard.data[key] = !!el.checked;
      else if (el.dataset.onbtype === "toggle") this._onboard.data[key] = el.classList.contains("on");
      else if (el.multiple) this._onboard.data[key] = Array.from(el.selectedOptions || []).map((o) => o.value).filter(Boolean);
      else if (el.dataset.onbtype === "number") this._onboard.data[key] = el.value === "" ? null : Number(el.value);
      else this._onboard.data[key] = el.value;
    });
  },

  _onboardNext(delta) {
    this._onboardCollect();
    const steps = this._onboardVisible();
    const step = steps[this._onboard.step];
    if (step && step.fields) {
      for (const f of step.fields) {
        if (!f.required) continue;
        const v = this._onboard.data[f.key];
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) {
          this._flash(t("Bitte {f} ausfüllen", { f: t(f.label) }));
          return;
        }
      }
    }
    const next = Math.max(0, Math.min(steps.length - 1, this._onboard.step + delta));
    this._onboard.step = next;
    this._render();
  },

  _onboardField(f, value) {
    const v = value ?? this._onboard.data[f.key];
    const id = `onb-${f.key}`;
    if (f.type === "select") {
      const choices = f.choices ? ((this._cfg && this._cfg.choices && this._cfg.choices[f.choices]) || []) : (f.options || []).map(([id, name]) => ({ id, name }));
      const opts = (f.allowEmpty ? [["", t("– keins –")]] : []).concat(choices.map((x) => [x.id, x.name]));
      return `<select class="sel" id="${id}" data-onb="${f.key}" data-onbtype="select">${opts.map(([oid, name]) => `<option value="${esc(oid)}"${String(v ?? "") === String(oid) ? " selected" : ""}>${esc(name)}</option>`).join("")}</select>`;
    }
    if (f.type === "multi") {
      const choices = f.choices ? ((this._cfg && this._cfg.choices && this._cfg.choices[f.choices]) || []) : [];
      const cur = Array.isArray(v) ? v : [];
      return `<select class="sel" id="${id}" data-onb="${f.key}" multiple>${choices.map((x) => `<option value="${esc(x.id)}"${cur.includes(x.id) ? " selected" : ""}>${esc(x.name)}</option>`).join("")}</select>`;
    }
    if (f.type === "toggle") {
      const on = !!v;
      return `<button class="tgl ${on ? "on" : ""}" data-onb="${f.key}" data-onbtype="toggle" data-val="${on ? 1 : 0}" aria-label="${t("umschalten")}"></button>`;
    }
    if (f.type === "number") {
      return `<input class="inp" type="number" id="${id}" data-onb="${f.key}" data-onbtype="number" value="${v ?? ""}" min="${f.min ?? ""}" max="${f.max ?? ""}" step="${f.step ?? 1}">`;
    }
    return `<input class="inp" id="${id}" data-onb="${f.key}" data-onbtype="text" value="${esc(v ?? "")}" placeholder="${esc(f.placeholder || "")}">`;
  },

  _onboardHtml() {
    if (!this._onboardOpen || !this._onboard) return "";
    const steps = this._onboardVisible();
    const step = steps[this._onboard.step] || steps[0];
    const fields = (step.fields || []).filter((f) => !f.show || f.show(this._onboard.data));
    const body = fields.map((f) => `<label class="mf"><span>${t(f.label)}</span>${this._onboardField(f)}</label>`).join("");
    const last = this._onboard.step >= steps.length - 1;
    return `<div class="sheetwrap">
      <div class="sheet" role="dialog" aria-modal="true">
        <div class="stitle"><ha-icon icon="mdi:rocket-launch-outline"></ha-icon>${t("Einrichtungsassistent")} · ${t(step.title)}</div>
        <div class="sintro">${t(this._onboard.roomOnly ? "Neuer Raum – die Wohnung bleibt unverändert." : (step.intro || "Schritt {n} von {m}"), { n: this._onboard.step + 1, m: steps.length })}</div>
        ${body || `<div class="hint">${t("Keine weiteren Fragen – bereit zum Abschließen.")}</div>`}
        <div class="sbtns">
          ${this._onboard.step > 0 ? `<button class="btn" data-onbback style="--c:var(--rk-off)"><ha-icon icon="mdi:arrow-left"></ha-icon>${t("Zurück")}</button>` : ""}
          ${last ? `<button class="btn primary" data-onbfinish><ha-icon icon="mdi:check"></ha-icon>${t("Abschließen")}</button>` : `<button class="btn primary" data-onbnext><ha-icon icon="mdi:arrow-right"></ha-icon>${t("Weiter")}</button>`}
          <button class="btn" data-onbclose style="--c:var(--rk-off)">${t("Abbrechen")}</button>
        </div>
      </div>
    </div>`;
  },

  async _onboardFinish() {
    this._onboardCollect();
    const d = this._onboard.data;
    const hubChanges = {};
    if (!this._onboard.roomOnly && d.home_name) hubChanges.name = d.home_name;
    if (d.zone !== undefined) hubChanges.zone = d.zone || null;
    if (d.weather_entity !== undefined) hubChanges.weather_entity = d.weather_entity || null;
    if (d.energy_source) hubChanges.energy_source = d.energy_source;
    if (d.energy_meter !== undefined) hubChanges.energy_meter = d.energy_meter || null;
    if (d.energy_tariff !== undefined) hubChanges.energy_tariff = d.energy_tariff || null;
    if (d.energy_price !== undefined) hubChanges.energy_price = Number(d.energy_price ?? 0.3);
    if (d.energy_base !== undefined) hubChanges.energy_base = Number(d.energy_base ?? 0);
    if (d.energy_meter) hubChanges.energy_enabled = true;
    if (d.pv_yes && d.pv_entity) {
      hubChanges.pv_entity = d.pv_entity;
      hubChanges.pv_self_use = Number(d.pv_self_use ?? 0);
    }
    try {
      if (Object.keys(hubChanges).length) {
        await this._hass.callWS({ type: "raumklima/hub/update", changes: hubChanges });
      }
      const create = d.heat_type !== "monitor" ? (d.trv && d.temperature_sensor) : d.temperature_sensor;
      if (create) {
        const roomChanges = {
          name: d.room_name || d.home_name || t("Neuer Raum"),
          trv: d.heat_type === "monitor" ? "" : (d.trv || ""),
          temperature_sensor: d.temperature_sensor,
          room_type: d.room_type || "living",
        };
        if (d.humidity_sensor) roomChanges.humidity_sensor = d.humidity_sensor;
        if ((d.window_sensors || []).length) roomChanges.window_sensors = d.window_sensors;
        if ((d.presence_sensors || []).length) roomChanges.presence_sensors = d.presence_sensors;
        if ((d.shading_covers || []).length) roomChanges.shading_covers = d.shading_covers;
        if (d.heat_type === "floor") {
          if (d.floor_supply) roomChanges.floor_supply = d.floor_supply;
          if (d.floor_return) roomChanges.floor_return = d.floor_return;
        }
        await this._hass.callWS({ type: "raumklima/room/create", ...roomChanges });
      }
      this._onboardOpen = false;
      this._onboard = null;
      this._flash(t("Einrichtung abgeschlossen"));
      await this._load();
      this._section = "rooms";
      this._tab = "general";
      this._render();
    } catch (e) {
      this._flash(t("Fehler: {e}", { e: e.message || e }));
    }
  },
};
