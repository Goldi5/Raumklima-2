import { DASH_STYLES, STYLES, esc, fmt, rkHomeId, rkPaint, setLang, t, toneVar } from "../shared.js";

const SOURCES = {
  auto: "automatisch",
  electric: "Strom",
  gas: "Gas",
  heatpump: "Wärmepumpe",
  district: "Fernwärme",
  oil: "Heizöl",
};

const ENERGY_STYLES = `
  .equal { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .eq { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; font-size:.76rem; font-weight:600; }
  .eq ha-icon { --mdc-icon-size:14px; }
  .eq.ok { background:color-mix(in srgb, var(--rk-ok) 14%, transparent); color:color-mix(in srgb, var(--rk-ok) 70%, var(--primary-text-color)); }
  .eq.warn { background:color-mix(in srgb, var(--rk-warn) 14%, transparent); color:color-mix(in srgb, var(--rk-warn) 70%, var(--primary-text-color)); }
  .egrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:10px; margin-top:12px; }
  .ebox { border-radius:16px; padding:12px 14px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); min-width:0; }
  .ebox:first-child { grid-column:1 / -1; }
  .ebox .eh { display:flex; align-items:center; gap:7px; font-size:.9rem; margin-bottom:8px; }
  .ebox .eh ha-icon { --mdc-icon-size:18px; color:var(--tone); }
  .echart { width:100%; height:150px; display:block; }
  .echart .bheat, .eleg i.bheat { fill:var(--rk-heat); background:var(--rk-heat); }
  .echart .bww, .eleg i.bww { fill:var(--rk-air); background:var(--rk-air); }
  .echart .ltemp { fill:none; stroke:var(--rk-cold); stroke-width:2; vector-effect:non-scaling-stroke; }
  .eleg i.ltemp { height:2px !important; background:var(--rk-cold); }
  .eleg { display:flex; gap:14px; flex-wrap:wrap; font-size:.76rem; color:var(--secondary-text-color); margin-top:4px; }
  .eleg span { display:inline-flex; align-items:center; gap:5px; }
  .eleg i { display:inline-block; width:10px; height:10px; border-radius:2px; }
  .eaxis { display:flex; justify-content:space-between; font-size:.72rem; color:var(--secondary-text-color); margin-top:2px; }
  .estrip { display:flex; align-items:flex-end; gap:1px; height:90px; }
  .estrip i { flex:1; border-radius:2px 2px 0 0; background:color-mix(in srgb, var(--primary-text-color) 18%, transparent); }
  .estrip i.cheap { background:var(--rk-ok); }
  .estrip i.dear { background:var(--rk-warn); }
  .estrip i.now { outline:2px solid var(--primary-text-color); outline-offset:1px; }
  .erooms { display:grid; gap:7px; }
  .eroom { display:grid; grid-template-columns:minmax(70px,120px) 1fr auto; gap:10px; align-items:center; font-size:.84rem; }
  .eroom span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .eroom .trk { height:8px; border-radius:4px; background:color-mix(in srgb, var(--primary-text-color) 8%, transparent); overflow:hidden; }
  .eroom .trk i { display:block; height:100%; background:var(--rk-heat); border-radius:4px; }
  .enote { font-size:.74rem; color:var(--secondary-text-color); margin-top:8px; }
  .eraw { margin-top:12px; }
  .eraw summary { cursor:pointer; font-size:.86rem; font-weight:600; color:var(--secondary-text-color); padding:6px 2px; }
`;

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

  _box(title, icon, body, extra = "") {
    return `<section class="ebox"><div class="eh"><ha-icon icon="${icon}"></ha-icon><b>${t(title)}</b>${extra}</div>${body}</section>`;
  }

  // Tagesbalken: Heizung + Warmwasser gestapelt, Außentemperatur als Linie
  _dailyChart(daily) {
    const days = (daily || []).slice(-60);
    if (days.length < 2 || !days.some((d) => d.kwh + d.ww > 0)) return "";
    const W = 600, Hh = 150, pad = 4;
    const max = Math.max(...days.map((d) => d.kwh + d.ww), 0.1);
    const bw = (W - pad * 2) / days.length;
    const bars = days.map((d, i) => {
      const x = pad + i * bw + bw * 0.12;
      const w = bw * 0.76;
      const hk = (d.kwh / max) * (Hh - 10);
      const hw = (d.ww / max) * (Hh - 10);
      return `<rect x="${x.toFixed(1)}" y="${(Hh - hk - hw).toFixed(1)}" width="${w.toFixed(1)}" height="${hw.toFixed(1)}" rx="2" class="bww"><title>${esc(d.date)} · ${t("Warmwasser")} ${fmt(d.ww, 1)} kWh</title></rect>`
        + `<rect x="${x.toFixed(1)}" y="${(Hh - hk).toFixed(1)}" width="${w.toFixed(1)}" height="${hk.toFixed(1)}" rx="2" class="bheat"><title>${esc(d.date)} · ${t("Heizung")} ${fmt(d.kwh, 1)} kWh · ${fmt(d.cost, 2)} €</title></rect>`;
    }).join("");
    const temps = days.map((d) => d.outdoor).filter((v) => v != null);
    let line = "";
    if (temps.length >= 2) {
      const lo = Math.min(...temps) - 1, hi = Math.max(...temps) + 1;
      const pts = days.map((d, i) => d.outdoor == null ? null : `${(pad + (i + 0.5) * bw).toFixed(1)},${(Hh - 6 - ((d.outdoor - lo) / (hi - lo)) * (Hh - 16)).toFixed(1)}`).filter(Boolean);
      line = `<polyline points="${pts.join(" ")}" class="ltemp"/>`;
    }
    const hasWw = days.some((d) => d.ww > 0);
    const legend = `<div class="eleg"><span><i class="bheat"></i>${t("Heizung")}</span>${hasWw ? `<span><i class="bww"></i>${t("Warmwasser")}</span>` : ""}${line ? `<span><i class="ltemp"></i>${t("Außen °C")}</span>` : ""}</div>`;
    return `<svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" class="echart" role="img" aria-label="${t("Verbrauch pro Tag")}">${bars}${line}</svg>
      <div class="eaxis"><span>${esc(days[0].date.slice(5))}</span><span>${esc(days[days.length - 1].date.slice(5))}</span></div>${legend}`;
  }

  // Preiskurve: günstigstes Viertel grün, teuerstes Viertel orange, jetzt markiert
  _priceStrip(points) {
    if (!points || points.length < 4) return "";
    const vals = points.map((p) => p.p);
    const sorted = [...vals].sort((a, b) => a - b);
    const lo = sorted[Math.floor(sorted.length * 0.25)], hi = sorted[Math.floor(sorted.length * 0.75)];
    const max = Math.max(...vals), min = Math.min(...vals);
    const now = Date.now();
    let cur = null;
    const bars = points.map((p) => {
      const tms = new Date(p.t).getTime();
      const isNow = cur == null && tms <= now && now < tms + 3600 * 1000 && (cur = p);
      const h = 18 + ((p.p - min) / Math.max(max - min, 0.001)) * 82;
      const cls = p.p <= lo ? "cheap" : p.p >= hi ? "dear" : "mid";
      return `<i class="${cls}${isNow ? " now" : ""}" style="height:${h.toFixed(0)}%" title="${esc(new Date(p.t).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" }))} · ${fmt(p.p * 100, 1)} ct"></i>`;
    }).join("");
    const cheapest = points.reduce((a, b) => (b.p < a.p && new Date(b.t).getTime() > now ? b : a), points[points.length - 1]);
    const first = new Date(points[0].t), last = new Date(points[points.length - 1].t);
    const hm = (d) => d.toLocaleTimeString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    return `<div class="estrip">${bars}</div><div class="eaxis"><span>${esc(hm(first))}</span><span>${esc(hm(last))}</span></div>
      <div class="drows">
        ${cur ? this._row("Jetzt", "mdi:clock-outline", `${fmt(cur.p * 100, 1)} ct/kWh`) : ""}
        ${this._row("Spanne", "mdi:arrow-expand-vertical", `${fmt(min * 100, 1)} – ${fmt(max * 100, 1)} ct`)}
        ${cheapest ? this._row("Am günstigsten", "mdi:leaf", `${esc(hm(new Date(cheapest.t)))} · ${fmt(cheapest.p * 100, 1)} ct`) : ""}
      </div>`;
  }

  _rawRows(d, e) {
    const tank = e.tank || null;
    const market = e.oil_market || null;
    const tankValue = tank ? (tank.current_percent != null ? fmt(tank.current_percent, 0) : tank.current_l != null ? fmt(tank.current_l, 0) : "–") : "–";
    const tankUnit = tank && tank.current_percent != null ? " %" : " L";
    const ent = (id) => `<span data-more="${esc(id)}" style="cursor:pointer">${esc(id)}</span>`;
    return [
      this._row("Quelle", "mdi:transmission-tower", esc(this._source(e))),
      e.meter ? this._row("Zähler", "mdi:counter", ent(e.meter)) : "",
      e.heat_entity ? this._row("Wärmezähler", "mdi:radiator", ent(e.heat_entity)) : "",
      e.ww_meter ? this._row("Warmwasser-Zähler", "mdi:water-boiler", ent(e.ww_meter)) : "",
      e.house_entity ? this._row("Hausverbrauch", "mdi:home-lightning-bolt-outline", ent(e.house_entity)) : "",
      e.grid_entity ? this._row("Netzbezug", "mdi:transmission-tower-import", ent(e.grid_entity)) : "",
      e.source === "oil" ? this._row("Ölpreis", "mdi:oil", `${fmt(e.oil_price, 2)} €/L`) : "",
      tank ? this._row("Tankverbrauch", "mdi:chart-timeline-variant", tank.consumed_l != null ? `${fmt(tank.consumed_l, 1)} L` : "–") : "",
      tank ? this._row("Reicht noch", "mdi:calendar-clock", tank.days_left != null ? t("{n} Tage", { n: tank.days_left }) : t("lernt noch")) : "",
      tank ? this._row("Ölbestellung", "mdi:truck-delivery-outline", tank.order ? t("jetzt bestellen") : t("noch Zeit")) : "",
      tank ? this._row("Tank", "mdi:oil-level", `${tankValue}${tankUnit}${tank.threshold_l != null ? ` · ${t("Schwelle {v} L", { v: fmt(tank.threshold_l, 0) })}` : ""}`) : "",
      e.winter_liters ? this._row("Letzter Winter", "mdi:snowflake", `${fmt(e.winter_liters, 0)} L${e.winter_days ? ` · ${t("{n} Tage", { n: e.winter_days })}` : ""}`) : "",
      e.winter_avg_l_day != null ? this._row("Ø Verbrauch", "mdi:chart-timeline-variant", `${fmt(e.winter_avg_l_day, 1)} L/Tag`) : "",
      market ? this._row("Marktpreis", "mdi:chart-line", market.value != null ? `${fmt(market.value, 2)} €/L` : "–") : "",
      market && market.vs_your_price != null ? this._row("Markt vs. deinem Preis", "mdi:scale-balance", `${market.vs_your_price > 0 ? "+" : ""}${fmt(market.vs_your_price, 2)} €/L`) : "",
      e.oil_price_history && e.oil_price_history.length ? this._row("Preisverlauf", "mdi:tag-history", (() => {
        const last = e.oil_price_history[e.oil_price_history.length - 1] || {};
        return `${esc(last.date || "–")} · ${fmt(last.price, 2)} €/L${e.oil_price_avg != null ? ` · Ø ${fmt(e.oil_price_avg, 2)}` : ""}`;
      })()) : "",
      this._row("Tarif", "mdi:tag-outline", e.tariff ? `${ent(e.tariff)}${e.tariff_dynamic ? ` · ${t("dynamisch")}` : ""}` : t("fester Preis")),
      this._row("Arbeitspreis", "mdi:currency-eur", `${fmt(e.price, 3)} €/kWh`),
      this._row("Grundpreis", "mdi:calendar-month-outline", `${fmt(e.base, 2)} €/${t("Monat")}`),
      e.heat_kwh != null ? this._row("Wärmemenge", "mdi:radiator", `${fmt(e.heat_kwh, 1)} kWh`) : "",
      e.ww_heat_kwh != null ? this._row("Warmwasser-Wärme", "mdi:water-boiler", `${fmt(e.ww_heat_kwh, 1)} kWh`) : "",
      e.efficiency > 0 ? this._row("Jahresarbeitszahl", "mdi:gauge", fmt(e.efficiency, 1)) : "",
      e.pv_entity ? this._row("PV-Ertrag", "mdi:solar-power", `${fmt(e.pv_kwh, 1)} kWh${e.pv_self_use ? ` · ${t("{n} % Eigenverbrauch", { n: fmt(e.pv_self_use, 0) })}` : ""}`) : "",
      e.surplus_kwh != null ? this._row("PV-Überschuss", "mdi:solar-power-variant", `${fmt(e.surplus_kwh, 1)} kWh`) : "",
      this._row("Zeitraum", "mdi:calendar-range", `${d.start} – ${d.end}`),
    ].join("");
  }

  _quality(e) {
    const chips = [];
    const ok = (txt) => chips.push(`<span class="eq ok"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${txt}</span>`);
    const warn = (txt) => chips.push(`<span class="eq warn"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${txt}</span>`);
    if (e.meter) (e.kwh != null ? ok : warn)(t(e.kwh != null ? "Zähler liefert" : "Zähler ohne Statistik"));
    if (e.source === "heatpump") (e.heat_entity ? (e.cop != null ? ok : warn) : warn)(t(e.heat_entity ? (e.cop != null ? "Arbeitszahl gemessen" : "Wärmezähler ohne Werte") : "Arbeitszahl geschätzt – Wärmezähler fehlt"));
    if (e.tariff) {
      const active = (e.tariffs || []).find((x) => x.active);
      (active ? ok : warn)(active ? t("Preis aus {s}", { s: esc(active.name) }) : t("keine Preisquelle liefert – fester Preis"));
      if (e.tariff_dynamic) (active && active.forecast ? ok : warn)(t(active && active.forecast ? "Preisvorschau da" : "keine Preisvorschau"));
    }
    if (e.source_set === false) warn(t("Energiequelle bitte in den Einstellungen wählen"));
    return chips.length ? `<div class="equal">${chips.join("")}</div>` : "";
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
    const kwhHeat = e.kwh == null ? money.kwh : e.kwh;
    const ww = e.ww_kwh || 0;
    const total = kwhHeat == null ? null : kwhHeat + ww;
    const cost = money.period_cost;
    const basis = money.basis === "bill" ? "Abrechnung" : money.basis === "tank" ? "Tank" : money.basis === "meter" ? "Zähler" : "";
    const tank = e.tank || null;
    const market = e.oil_market || null;

    // --- Kennzahlen
    const costDetail = [
      money.per_day != null ? t("{v} € pro Tag", { v: fmt(money.per_day, 2) }) : "",
      money.annual != null ? t("Jahr ≈ {v} €", { v: fmt(money.annual, 0) }) : money.period_cost != null ? t("Jahresprognose ab Heizsaison") : "",
      basis ? t("Basis: {b}", { b: t(basis) }) : t("noch keine Schätzung"),
    ].filter(Boolean).join(" · ");
    const useDetail = [
      ww > 0 ? t("Heizung {h} · Warmwasser {w} kWh", { h: fmt(kwhHeat, 0), w: fmt(ww, 0) }) : "",
      e.liter != null ? `${fmt(e.liter, 1)} L` : e.m3 != null ? `${fmt(e.m3, 1)} m³` : "",
      e.house_share != null ? t("{p} % des Hausstroms", { p: fmt(e.house_share, 0) }) : "",
    ].filter(Boolean).join(" · ");
    const tiles = [
      this._tile("Kosten", "mdi:currency-eur", cost == null ? "–" : fmt(cost, 2), " €", costDetail, "heat"),
      this._tile("Verbrauch", "mdi:lightning-bolt", total == null ? "–" : fmt(total, 1), " kWh", useDetail),
    ];
    if (e.source === "heatpump") {
      tiles.push(this._tile("Arbeitszahl", "mdi:gauge", e.cop != null ? fmt(e.cop, 1) : e.efficiency > 0 ? fmt(e.efficiency, 1) : "–", "",
        [e.cop != null ? t("Heizung, gemessen") : e.efficiency > 0 ? t("geschätzt (Datenblatt)") : t("Wärmezähler fehlt"), e.cop_ww != null ? t("Warmwasser {v}", { v: fmt(e.cop_ww, 1) }) : ""].filter(Boolean).join(" · "), "ok"));
    } else if (e.source === "district" && e.heat_kwh != null) {
      tiles.push(this._tile("Wärme", "mdi:radiator", fmt(e.heat_kwh, 0), " kWh", "", "ok"));
    }
    if (e.price_paid != null && e.tariff_dynamic) {
      tiles.push(this._tile("Bezahlt Ø", "mdi:tag-outline", fmt(e.price_paid * 100, 1), " ct", [
        e.price_avg != null ? t("Mittel {v} ct", { v: fmt(e.price_avg * 100, 1) }) : "",
        e.cheap_share != null ? t("{p} % in günstigen Stunden", { p: e.cheap_share }) : "",
      ].filter(Boolean).join(" · "), e.price_avg != null && e.price_paid <= e.price_avg ? "ok" : "warn"));
    } else {
      tiles.push(this._tile("Preis", "mdi:tag-outline", fmt((e.price_now ?? e.price) * 100, 1), " ct/kWh",
        e.source === "heatpump" && e.cop ? t("Wärme {v} ct/kWh", { v: fmt(((e.price_now ?? e.price) / e.cop) * 100, 1) }) : t("je kWh, brutto")));
    }
    if (tank) {
      const tv = tank.current_percent != null ? fmt(tank.current_percent, 0) : tank.current_l != null ? fmt(tank.current_l, 0) : "–";
      tiles.push(this._tile("Tank", "mdi:oil-level", tv, tank.current_percent != null ? " %" : " L",
        [tank.current_l != null ? `${fmt(tank.current_l, 0)} L` : "", tank.days_left != null ? t("reicht noch ~{d} Tage", { d: tank.days_left }) : tank.order ? t("jetzt bestellen") : t("lernt noch")].filter(Boolean).join(" · "), tank.order ? "warn" : "ok"));
    }
    if (market) {
      tiles.push(this._tile("Markt", "mdi:chart-line", market.value != null ? fmt(market.value, 2) : "–", " €/L",
        market.avg_30d != null ? t("30-Tage-Ø {v} €/L", { v: fmt(market.avg_30d, 2) }) : "", market.delta_avg != null && market.delta_avg <= 0 ? "ok" : "warn"));
    }
    if (e.self_kwh) {
      tiles.push(this._tile("Aus PV & Batterie", "mdi:solar-power", fmt(e.self_kwh, 1), " kWh", t("kostet nichts – schon abgezogen"), "ok"));
    } else if (e.pv_entity && e.pv_kwh != null) {
      tiles.push(this._tile("PV", "mdi:solar-power", fmt(e.pv_kwh, 1), " kWh", t("{n} % Eigenverbrauch", { n: fmt(e.pv_self_use, 0) }), "ok"));
    }

    // --- Boxen
    const boxes = [];
    const chart = this._dailyChart(e.daily);
    if (chart) boxes.push(this._box("Verbrauch pro Tag", "mdi:chart-bar", chart));
    const strip = this._priceStrip(d.forecast);
    if (strip) boxes.push(this._box("Strompreis", "mdi:chart-timeline-variant", strip));
    const rooms = money.rooms || [];
    if (rooms.length) {
      const top = rooms[0].share || 1;
      boxes.push(this._box("Wer verbraucht die Wärme?", "mdi:home-thermometer-outline", `<div class="erooms">${rooms.slice(0, 8).map((r) =>
        `<div class="eroom"><span>${esc(r.name)}</span><div class="trk"><i style="width:${Math.max(4, (100 * r.share) / top).toFixed(0)}%"></i></div><b>${fmt(r.cost, 2)} €</b></div>`).join("")}</div>
        <div class="enote">${t("nach Ventilöffnung × Stunden – ohne Warmwasser und Grundgebühr")}</div>`));
    }
    const srcs = e.tariffs || [];
    if (srcs.length > 1) {
      boxes.push(this._box("Preisquellen", "mdi:swap-vertical", `<div class="drows">${srcs.map((x) =>
        this._row(x.primary ? "Hauptquelle" : "Reserve", x.active ? "mdi:check-circle" : "mdi:circle-outline",
          `${esc(x.name)} · ${x.value != null ? `${fmt(x.value * 100, 1)} ct` : t("liefert nichts")}`)).join("")}</div>`));
    }

    return `<div class="dtiles">${tiles.join("")}</div>
      ${this._quality(e)}
      ${boxes.length ? `<div class="egrid">${boxes.join("")}</div>` : ""}
      <details class="eraw"><summary>${t("Details und Sensoren")}</summary><div class="drows">${this._rawRows(d, e)}</div></details>`;
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
    this._html = `<style>${STYLES}${DASH_STYLES}${ENERGY_STYLES}</style>
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
