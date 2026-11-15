import { DASH_STYLES, STYLES, esc, fmt, rkHomeId, rkPaint, setLang, t, toneVar } from "../shared.js";

const SOURCES = {
  auto: "automatisch",
  electric: "Strom",
  gas: "Gas",
  heatpump: "Wärmepumpe",
  district: "Fernwärme",
  oil: "Heizöl",
};

export class RaumklimaEnergyCard extends HTMLElement {
  set _html(html) { rkPaint(this, html); }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "days", selector: { number: { min: 1, max: 365, step: 1 } } },
        { name: "home", selector: { text: {} } },
      ],
    };
  }
  static getStubConfig() { return { days: 30 }; }

  setConfig(config) {
    this._config = { days: 30, ...config };
    this._days = Number(this._config.days) || 30;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }

  connectedCallback() {
    this.style.display = "block";
    this._poll = setInterval(() => this._load(), 10 * 60 * 1000);
  }
  disconnectedCallback() { clearInterval(this._poll); }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    setLang(hass);
    if (first) this._load();
    else if (this._data) this._render();
  }

  _home() {
    const id = this._config.home || rkHomeId(this._hass, this._config);
    return id ? { home: id } : {};
  }

  async _load() {
    if (!this._hass) return;
    try {
      this._data = await this._hass.callWS({ type: "raumklima/energy", days: this._days, ...this._home() });
      this._err = null;
    } catch (e) {
      this._err = e && e.message ? e.message : String(e);
    }
    this._render();
  }

  _source(e) { return t(SOURCES[e.source] || e.source || "automatisch"); }

  _tile(label, icon, value, unit, detail, tone = "warn") {
    return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
  }

  _row(label, icon, value) {
    return `<div class="drow"><div class="l"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div><div class="v">${value}</div></div>`;
  }

  _empty(icon, text) {
    return `<div class="dempty"><ha-icon icon="${icon}"></ha-icon><div>${t(text)}</div></div>`;
  }

  _body(d) {
    const e = d.energy || {};
    if (!e.enabled) {
      return this._empty("mdi:lightning-bolt-off", "Energie-Erfassung ist aus. In den Einstellungen unter „Heizung & Energie“ aktivieren.");
    }
    if (!e.meter && !e.tank && !e.oil_market) {
      return this._empty("mdi:counter", "Noch kein Zähler, Tank oder Marktpreis gewählt. In den Einstellungen unter „Heizung & Energie“ eine Quelle auswählen.");
    }
    const money = d.money || {};
    const kwh = e.kwh == null ? money.kwh : e.kwh;
    const cost = money.period_cost;
    const annual = money.annual;
    const basis = money.basis === "bill" ? "Abrechnung" : money.basis === "tank" ? "Tank" : money.basis === "meter" ? "Zähler" : "";
    const meterInfo = e.liter != null
      ? `${fmt(e.liter, 1)} L → ${fmt(e.kwh, 1)} kWh`
      : e.m3 != null ? `${fmt(e.m3, 1)} m³ → ${fmt(e.kwh, 1)} kWh` : e.meter_unit || "";
    const tank = e.tank || null;
    const tankValue = tank
      ? (tank.current_percent != null ? fmt(tank.current_percent, 0) : tank.current_l != null ? fmt(tank.current_l, 0) : "–")
      : "–";
    const tankUnit = tank && tank.current_percent != null ? " %" : " L";
    const tankDetail = tank
      ? [
          tank.current_l != null ? `${fmt(tank.current_l, 0)} L` : "",
          tank.days_left != null ? t("reicht noch ~{d} Tage", { d: tank.days_left }) : tank.order ? t("jetzt bestellen") : t("lernt noch"),
        ].filter(Boolean).join(" · ")
      : "";
    const market = e.oil_market || null;
    const marketDetail = market && market.avg_30d != null
      ? t("30-Tage-Ø {v} €/L", { v: fmt(market.avg_30d, 2) })
      : "";
    const pvDetail = e.pv_entity
      ? `${t("{n} % Eigenverbrauch", { n: fmt(e.pv_self_use, 0) })}`
        + (e.surplus_kwh != null ? ` · ${t("{n} kWh Überschuss", { n: fmt(e.surplus_kwh, 1) })}` : "")
      : "";
    const rows = [
      this._row("Quelle", "mdi:transmission-tower", esc(this._source(e))),
      e.meter ? this._row("Zähler", "mdi:counter", `<span data-more="${esc(e.meter)}" style="cursor:pointer">${esc(e.meter)}</span>`) : "",
      e.source === "oil" ? this._row("Ölpreis", "mdi:oil", `${fmt(e.oil_price, 2)} €/L`) : "",
      e.tank ? this._row("Tank", "mdi:oil-level", `${tankValue}${tankUnit}${tank.threshold_l != null ? ` · ${t("Schwelle {v} L", { v: fmt(tank.threshold_l, 0) })}` : ""}`) : "",
      e.tank ? this._row("Tankverbrauch", "mdi:chart-timeline-variant", tank.consumed_l != null ? `${fmt(tank.consumed_l, 1)} L` : "–") : "",
      e.tank ? this._row("Reicht noch", "mdi:calendar-clock", tank.days_left != null ? t("{n} Tage", { n: tank.days_left }) : t("lernt noch")) : "",
      e.tank ? this._row("Ölbestellung", "mdi:truck-delivery-outline", tank.order ? t("jetzt bestellen") : t("noch Zeit")) : "",
      e.winter_liters ? this._row("Letzter Winter", "mdi:snowflake", `${fmt(e.winter_liters, 0)} L${e.winter_days ? ` · ${t("{n} Tage", { n: e.winter_days })}` : ""}`) : "",
      e.winter_avg_l_day != null ? this._row("Ø Verbrauch", "mdi:chart-timeline-variant", `${fmt(e.winter_avg_l_day, 1)} L/Tag`) : "",
      market ? this._row("Marktpreis", "mdi:chart-line", market.value != null ? `${fmt(market.value, 2)} €/L` : "–") : "",
      market && market.vs_your_price != null ? this._row("Markt vs. deinem Preis", "mdi:scale-balance", `${market.vs_your_price > 0 ? "+" : ""}${fmt(market.vs_your_price, 2)} €/L`) : "",
      e.oil_price_history && e.oil_price_history.length ? this._row("Preisverlauf", "mdi:tag-history", (() => {
        const last = e.oil_price_history[e.oil_price_history.length - 1] || {};
        return `${esc(last.date || "–")} · ${fmt(last.price, 2)} €/L${e.oil_price_avg != null ? ` · Ø ${fmt(e.oil_price_avg, 2)}` : ""}`;
      })()) : "",
      this._row("Tarif", "mdi:tag-outline", e.tariff ? `<span data-more="${esc(e.tariff)}" style="cursor:pointer">${esc(e.tariff)}</span>${e.tariff_dynamic ? ` · ${t("dynamisch")}` : ""}` : t("fester Preis")),
      e.surplus_kwh != null ? this._row("PV-Überschuss", "mdi:solar-power-variant", `${fmt(e.surplus_kwh, 1)} kWh`) : "",
      this._row("Arbeitspreis", "mdi:currency-eur", `${fmt(e.price, 2)} €/kWh`),
      this._row("Grundpreis", "mdi:calendar-month-outline", `${fmt(e.base, 2)} €/${t("Monat")}`),
      e.heat_kwh != null ? this._row("Wärmemenge", "mdi:radiator", `${fmt(e.heat_kwh, 1)} kWh`) : "",
      e.efficiency > 0 ? this._row("Jahresarbeitszahl", "mdi:gauge", fmt(e.efficiency, 1)) : "",
      e.pv_entity ? this._row("PV-Ertrag", "mdi:solar-power", `${fmt(e.pv_kwh, 1)} kWh`) : "",
      this._row("Zeitraum", "mdi:calendar-range", `${d.start} – ${d.end}`),
    ].join("");
    return `<div class="dtiles">
        ${this._tile("Verbrauch", "mdi:lightning-bolt", kwh == null ? "–" : fmt(kwh, 1), " kWh", meterInfo)}
        ${this._tile("Kosten", "mdi:currency-eur", cost == null ? "–" : fmt(cost, 2), " €", basis ? t("Basis: {b}", { b: t(basis) }) : t("noch keine Schätzung"), "heat")}
        ${this._tile("Jahr", "mdi:chart-timeline-variant", annual == null ? "–" : fmt(annual, 0), " €", t("Schätzung"), "ok")}
        ${e.tank ? this._tile("Tank", "mdi:oil-level", tankValue, tankUnit, tankDetail, tank.order ? "warn" : "ok") : ""}
        ${market ? this._tile("Markt", "mdi:chart-line", market.value != null ? fmt(market.value, 2) : "–", " €/L", marketDetail, market.delta_avg != null && market.delta_avg <= 0 ? "ok" : "warn") : ""}
        ${this._tile("PV", "mdi:solar-power", e.pv_kwh == null ? "–" : fmt(e.pv_kwh, 1), " kWh", pvDetail, "ok")}
      </div><div class="drows">${rows}</div>`;
  }

  _render() {
    if (!this._hass) return;
    const d = this._data;
    let body;
    if (this._err) body = this._empty("mdi:alert-circle-outline", "Energie nicht verfügbar: {e}".replace("{e}", esc(this._err)));
    else if (!d) body = `<div class="dempty"><ha-icon icon="mdi:loading"></ha-icon><div>${t("Lade Energie …")}</div></div>`;
    else body = this._body(d);
    const title = this._config.title || t("Energie");
    const sub = d ? `${t("Letzte {n} Tage", { n: d.days })} · ${d.start} – ${d.end}` : t("Zähler, Tarif und Kosten");
    this._html = `<style>${STYLES}${DASH_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("warn")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><div>${esc(title)}<div class="dsub">${esc(sub)}</div></div></div></div>
          <div class="dseg">${[1, 7, 30, 90, 180, 365].map((n) => `<button class="${n === this._days ? "on" : ""}" data-days="${n}">${n === 1 ? t("Heute") : t("{n} Tage", { n })}</button>`).join("")}</div>
        </div>
        ${body}
      </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-days]").forEach((b) => b.addEventListener("click", () => {
      this._days = Number(b.dataset.days);
      this._load();
    }));
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
  }
}
