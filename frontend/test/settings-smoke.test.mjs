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
