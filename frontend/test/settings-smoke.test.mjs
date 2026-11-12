import { readFileSync } from "node:fs";
// Rauchtest für die Einstellungen-Karte: Sie muss ohne Browser HTML liefern.
// Der DOM-Ersatz gibt bei querySelectorAll eine Liste zurück (wie im Browser) –
// so fliegt auf, wenn ein einzelnes Element über $() geholt wird: `$("#x").addEventListener`
// wirft dann, und die Karte bricht im Browser mit „Konfigurationsfehler" ab.
import { test } from "node:test";
import assert from "node:assert/strict";

const fakeEl = () => ({
  style: {},
  dataset: {},
  files: [],
  value: "",
  classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener() {},
  removeEventListener() {},
  appendChild() {},
  remove() {},
  click() {},
  setAttribute() {},
  getAttribute: () => null,
  focus() {},
});

globalThis.window = {
  scrollY: 0,
  addEventListener() {},
  scrollTo() {},
  location: { pathname: "/", origin: "http://localhost" },
  history: { pushState() {} },
  matchMedia: () => ({ matches: false, addEventListener() {} }),
};
globalThis.document = {
  createElement: () => fakeEl(),
  body: fakeEl(),
  documentElement: { style: {} },
  addEventListener() {},
};
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.history = window.history;
globalThis.customElements = { define() {}, get() { return null; } };
globalThis.HTMLElement = class {
  constructor() { this.style = {}; }
  attachShadow() {
    this.shadowRoot = {
      innerHTML: "",
      // Wichtig: Listen, keine Einzelelemente
      querySelectorAll: () => [],
      querySelector: () => null,
      getElementById: () => null,
      addEventListener() {},
    };
    return this.shadowRoot;
  }
  getRootNode() { return document; }
  dispatchEvent() {}
  addEventListener() {}
};
globalThis.CustomEvent = class {
  constructor(type, options) { this.type = type; this.detail = options?.detail; }
};

const { RaumklimaSettingsCard } = await import("../src/cards/settings.js");
const { setLang, rkRooms } = await import("../src/shared.js");

const config = {
  hub: { entry_id: "hub1", options: {}, state: { stage: "home", persons: [], issues: [], sleep: {} } },
  rooms: [
    {
      entry_id: "room1",
      title: "Testraum",
      options: { name: "Testraum", trv: "climate.test", windows: [], schedules: [], presence_sensors: [] },
      setback_short: 18,
      setback_long: 16,
      comfort_temperature: 20,
    },
  ],
  homes: [{ entry_id: "hub1", name: "Test", default: true, dashboard: "raumklima", rooms: ["room1"] }],
  dashboards: [],
  kinds: [],
  choices: { notify: [], persons: [], zones: [], weather: [], calendars: [], signals: [], lights: [], mail: [], presence: [], states: [] },
  admin: true,
};

const hass = {
  language: "de",
  locale: { language: "de", number_format: "language" },
  user: { is_admin: true },
  states: {
    "climate.test": {
      entity_id: "climate.test",
      state: "heat",
      attributes: {
        current_temperature: 20.5,
        temperature: 21,
        settings: { name: "Testraum", trv: "climate.test", windows: [], schedules: [] },
        plan: {},
      },
      last_changed: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    },
  },
  entities: {},
  devices: {},
  areas: {},
  floors: {},
  callWS: async (msg) => (msg.type === "raumklima/config" ? config : {}),
  callService: async () => {},
  formatEntityState: () => "x",
};

test("Einstellungen-Karte rendert", () => {
  setLang(hass);
  const card = new RaumklimaSettingsCard();
  card.setConfig({ type: "custom:raumklima-settings-card" });
  card._hass = hass;
  card._cfg = config;
  card._rooms = rkRooms(hass, "", null);
  card._render();
  const html = card.shadowRoot.innerHTML;
  assert.ok(html.length > 2000, "HTML zu kurz");
  assert.match(html, /Allgemein|Erste Schritte/);
});

const fixture = JSON.parse(readFileSync(new URL("./fixture.json", import.meta.url), "utf8"));

function renderRoom(change = () => {}, general = false) {
  const fhass = { ...hass, states: fixture.states, entities: fixture.entities, config: {} };
  setLang(fhass);
  const card = new RaumklimaSettingsCard();
  card.setConfig({ type: "custom:raumklima-settings-card" });
  card._hass = fhass;
  card._cfg = structuredClone(fixture.ws["raumklima/config"]);
  card._cfg.hub.defaults = { cold_snap_temp: card._cfg.hub.options.cold_snap_temp, frost_floor: card._cfg.hub.options.frost_floor };
  const ro = card._cfg.rooms[0].options;
  card._cfg.room_defaults = { window_open_delay: ro.window_open_delay, window_close_delay: ro.window_close_delay };
  card._rooms = rkRooms(fhass, "", null);
  card._tab = general ? "general" : card._rooms[0].id;
  change(card);
  card._render();
  return card.shadowRoot.innerHTML;
}

test("Raum-Einstellungen: jeder Stepper hat Schritt > 0 und Minimum < Maximum", () => {
  const html = renderRoom();
  const steppers = [...html.matchAll(/data-key="([a-z_0-9]+)" data-step="([^"]*)" data-min="([^"]*)" data-max="([^"]*)"/g)];
  assert.ok(steppers.length > 6, "zu wenige Stepper gefunden");
  for (const [, key, step, min, max] of steppers) {
    assert.ok(parseFloat(step) > 0, `${key}: Schritt ${step}`);
    assert.ok(parseFloat(min) < parseFloat(max), `${key}: ${min} … ${max}`);
  }
  const cap = steppers.find((s) => s[1] === "mold_cap");
  assert.deepEqual(cap.slice(2), ["0.5", "0", "6"]);
});

test("Raum-Einstellungen: keine Zeile steckt im Kleingedruckten einer anderen", () => {
  const html = renderRoom();
  assert.doesNotMatch(html, /<small>(?:(?!<\/small>)[\s\S])*class="row"/);
  assert.match(html, /Nachtabsenkung/);
  assert.doesNotMatch(html, /Nachtabsendung/);
});

test("Boost-Zeilen stehen zusammen", () => {
  const html = renderRoom();
  const pos = ["Wärmer für kurze Zeit (Boost)", "Dauer des Boosts", "Zeitplan überschreiben", "Boost für"].map((x) => html.indexOf(x));
  assert.ok(pos.every((p) => p > 0), "Zeile fehlt");
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
});

const folds = (html) => [...html.matchAll(/<details class="adv more" data-more="([^"]+)" data-open="(\d)"( open)?>/g)].map((m) => ({ id: m[1], open: m[2] === "1" && !!m[3] }));

test("Aufklapper: zu im Standard, auf bei Abweichung, alle auf in der Profi-Ansicht", () => {
  const plain = folds(renderRoom());
  assert.ok(plain.length >= 6, `nur ${plain.length} Aufklapper im Raum`);
  assert.ok(plain.every((f) => !f.open), "im Standard muss alles zu sein: " + JSON.stringify(plain.filter((f) => f.open)));

  const changed = folds(renderRoom((card) => { card._cfg.rooms[0].options.mold_cap = 4; }));
  assert.ok(changed.find((f) => f.id.startsWith("mold-more")).open, "abweichender Deckel muss sichtbar sein");
  assert.ok(!changed.find((f) => f.id.startsWith("win-more")).open);

  const pro = folds(renderRoom((card) => { card._pro = true; }));
  assert.ok(pro.every((f) => f.open), "Profi-Ansicht klappt alles auf");

  const user = folds(renderRoom((card) => { card._pro = false; card._moreOpen = new Map([[`win-more:${card._tab}`, true]]); }));
  assert.ok(user.find((f) => f.id.startsWith("win-more")).open, "vom Nutzer geöffnet bleibt offen");
});

test("Aufklapper Allgemein: Abweichung vom Standard öffnet nur die betroffene Gruppe", () => {
  const plain = folds(renderRoom(() => {}, true));
  assert.ok(plain.length >= 6, `nur ${plain.length} Aufklapper in Allgemein`);
  const open = folds(renderRoom((card) => { card._cfg.hub.options.frost_floor = 9; }, true)).filter((f) => f.open).map((f) => f.id);
  assert.ok(open.includes("seas-more:hub"), JSON.stringify(open));
});

test("Jede Einstellung bleibt vorhanden (nichts ging beim Umsortieren verloren)", () => {
  const room = renderRoom((card) => { card._pro = true; });
  for (const label of ["Wunschtemperatur", "Vorheizen", "Nachtabsenkung", "Sonnenseite", "Sonne kommt aus", "Schimmelschutz", "Höchstens anheben um", "Bauart",
    "Pause nach", "Weiter nach", "Schlafen bei offenem Fenster", "Kontakte", "Max. Abkühlung beim Lüften", "Mindestdauer Lüften", "Dauerlüftung ab",
    "Gewohntes Lüften erkennen", "Zeitplan von", "Außerhalb der Zeitfenster", "Boost für", "Schnellere Abfrage", "Antwortzeit des Geräts", "Kalibrierung", "Übertragung", "Höchstens je Tag"]) {
    assert.ok(room.includes(`>${label}`), `Raum: „${label}" fehlt`);
  }
  const general = renderRoom((card) => { card._pro = true; }, true);
  for (const label of ["Wer wohnt hier?", "Anwesenheit aus", "Arbeitsplätze", "Urlaub automatisch ab", "Präsenzmelder zählen", "Homeoffice-Fenster", "Kalender", "Nachtruhe über Entität",
    "Betriebsart", "Heizgrenze", "Heizsaison", "Kälteeinbruch unter", "Sicherung", "Sommerpflege Ventile", "Ruhezeit", "Wochenende bis", "Nachtlüften", "Zeiten lernen", "Schichtdienst",
    "Feiertage", "Schlaf-Signale", "Absenkwert nachts", "Name der Wohnung", "Bauart", "Wetterquelle", "Dashboard", "Standort der Wohnung", "PDF-Berichte", "PDF per E-Mail",
    "Wärmemenge im Bericht", "Heizkosten pro Jahr", "Lüfthinweise von", "Sturm- und Regenwarnung", "… Böen ab", "Erinnern alle", "Fehler auch in der HA-Glocke"]) {
    assert.ok(general.includes(`>${label}`), `Allgemein: „${label}" fehlt`);
  }
});
