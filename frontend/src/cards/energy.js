import { DASH_STYLES, STYLES, esc, fmt, loc, rkHomeId, rkPaint, setLang, t, toneVar } from "../shared.js";

const SOURCES = {
  auto: "automatisch",
  electric: "Strom",
  gas: "Gas",
  heatpump: "Wärmepumpe",
  district: "Fernwärme",
  oil: "Heizöl",
};


// Kurze Erklärungen hinter den „?“ – was man sieht und was ein guter Wert ist
const HELP_E = {
  cost: "Was die Heizung im gewählten Zeitraum gekostet hat: jede Stunde Verbrauch × Preis dieser Stunde, Strom aus PV und Akku abgezogen, dazu der Anteil der Grundgebühr. Die Jahreszahl rechnet über die Außentemperatur hoch – oder nimmt die letzten 12 Monate des Zählers.",
  use: "Wie viel Energie die Heizung verbraucht hat – bei der Wärmepumpe der Strom. Warmwasser steht getrennt dabei, wenn es einen eigenen Zähler gibt oder aus dem Gesamtzähler aufgeteilt wird.",
  heat: "Wie viel Wärme im Haus angekommen ist – so wie die Wärmepumpe sie selbst zählt. Daraus und aus dem Strom ergibt sich die Arbeitszahl.",
  cop: "Arbeitszahl: wie viel Wärme aus 1 kWh Strom wird. 4 heißt: 1 kWh Strom → 4 kWh Wärme. Stehen zwei Werte da, zählen zwei Zähler den Strom verschieden – die Wärmepumpe rechnet selbst, ein Energiemanager misst an der Leitung. Die Wahrheit liegt meist dazwischen. Gut sind im Winter 3–4,5, beim Warmwasser 2,5–3,5.",
  paid: "Was du im Schnitt je kWh Netzstrom bezahlt hast – gewichtet nach dem Verbrauch jeder Stunde. Liegt der Wert unter dem Börsen-Mittel, lief die Heizung eher in günstigen Stunden.",
  price: "Aktueller Arbeitspreis je kWh, brutto – derselbe Wert, mit dem Dashboard, Bericht und Vergleich rechnen.",
  tank: "Füllstand des Öltanks und wie lange er bei deinem Verbrauch noch reicht.",
  market: "Heizöl-Marktpreis der gewählten Entität im Vergleich zum 30-Tage-Mittel – grün heißt: gerade günstiger als im Schnitt.",
  self: "Strom, den PV-Anlage und Akku in dieser Zeit für die Heizung geliefert haben – kostet nichts und ist bei den Kosten schon abgezogen. Hat der Akku nachts aus dem Netz geladen, zählt dieser Teil zum Ladepreis.",
  money: "Wie sich die Kosten aufteilen: Heizung, Warmwasser und der Anteil der Grundgebühr. Rechts steht, was der Strom aus PV und Akku zum Börsen-Mittel gekostet hätte.",
  daily: "Jeder Balken ist ein Tag (ab 60 Tagen ein Monat): unten Heizung, oben Warmwasser. Die rote Linie ist die Außentemperatur – kalte Tage brauchen mehr. Antippen zeigt die Werte des Tages.",
  pricechart: "Strompreis der nächsten Stunden. Grün ist das günstigste Viertel, orange das teuerste. Die günstigsten drei Stunden am Stück stehen darunter – nur zur Info, Raumklima steuert die Heizung nicht.",
  week: "Jedes Kästchen ist eine Stunde der Woche, je kräftiger, desto mehr Verbrauch (Mittel über den Zeitraum). Die untere Zeile zeigt, wann Strom meist günstig (grün) oder teuer (orange) ist. Liegen kräftige Kästchen über Orange, lohnt sich ein Blick in die Einstellungen der Wärmepumpe.",
  curve: "Jeder Punkt ist ein Tag: Verbrauch gegen Außentemperatur. Die Linie zeigt, wie viel mehr jedes Grad Kälte kostet und ab welcher Außentemperatur dein Haus nicht mehr heizen müsste. Wird sie über die Jahre flacher, wurde gedämmt oder besser eingestellt.",
  heatprice: "Was 1 kWh Wärme im Haus kostet – deine Heizung im Vergleich mit anderen Wegen. Bei der Wärmepumpe: Strompreis geteilt durch die Arbeitszahl. Vergleichspreise änderst du in den Einstellungen unter Energie.",
  pv: "Wohin der Solarstrom ging: in die Heizung, ins übrige Haus oder ins Netz. Mit Akku-Sensoren trennt Raumklima, welcher Akku-Strom vorher aus dem Netz geladen wurde – der ist nicht kostenlos.",
  rooms: "Die Heizkosten verteilt auf die Räume – nach Ventilöffnung × Stunden (oder Heizstunden, wenn kein Ventil meldet). Fällt ein Raum stark heraus, steht ein Hinweis darunter.",
  house: "Was der Strom im ganzen Haus gekostet hat – so wie es der Versorger abrechnet: jede Stunde Netzbezug × Preis dieser Stunde plus die volle Grundgebühr. Akku-Ladung aus dem Netz ist im Netzbezug enthalten. Die Einspeisevergütung wird abgezogen, wenn sie in den Einstellungen eingetragen ist.",
  sources: "Woher der Preis kommt: die Hauptquelle und Reserven, die einspringen, wenn sie nichts liefert. „Mit Vorschau“ heißt: die Quelle kennt auch die Preise der nächsten Stunden.",
};

// Schlüssel der Erklärungen (nicht übersetzen)
const HK = Object.fromEntries(Object.keys(HELP_E).map((k) => [k, k]));

const ENERGY_STYLES = `
  .equal { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .eq { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; font-size:.76rem; font-weight:600; }
  .eq ha-icon { --mdc-icon-size:14px; }
  .eq.ok { background:color-mix(in srgb, var(--rk-ok) 14%, transparent); color:color-mix(in srgb, var(--rk-ok) 70%, var(--primary-text-color)); }
  .eq.warn { background:color-mix(in srgb, var(--rk-warn) 14%, transparent); color:color-mix(in srgb, var(--rk-warn) 70%, var(--primary-text-color)); }
  .egrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr)); gap:10px; margin-top:12px; }
  .ebox { border-radius:16px; padding:12px 14px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); min-width:0; }
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
  .etiles { grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); }
  .dtile .k .grow, .eh .grow { flex:1; min-width:0; }
  .eq-q { flex:none; width:18px; height:18px; border-radius:50%; border:1.5px solid color-mix(in srgb, var(--secondary-text-color) 70%, transparent); background:none; color:var(--secondary-text-color); font:700 11px/1 inherit; cursor:pointer; padding:0; display:inline-flex; align-items:center; justify-content:center; }
  .eq-q.on, .eq-q:hover { background:var(--tone); border-color:var(--tone); color:#fff; }
  .ehelp { margin:6px 0 8px; padding:8px 10px; border-radius:10px; font-size:.8rem; line-height:1.4; text-transform:none; letter-spacing:0; background:color-mix(in srgb, var(--tone) 12%, transparent); color:var(--primary-text-color); }
  .ebox.wide { grid-column:1 / -1; }
  .ech { display:grid; grid-template-columns:52px 1fr; grid-template-rows:var(--h) 20px; column-gap:6px; }
  .ech.two { grid-template-columns:52px 1fr 40px; }
  .ech .ecv { position:relative; }
  .ech svg { width:100%; height:100%; display:block; overflow:visible; }
  .ey { position:relative; font-size:.7rem; color:var(--secondary-text-color); font-variant-numeric:tabular-nums; }
  .ey span { position:absolute; transform:translateY(-50%); white-space:nowrap; }
  .ey.l span { right:0; } .ey.r span { left:0; color:var(--rk-cold); }
  .ex { grid-column:2; position:relative; font-size:.7rem; color:var(--secondary-text-color); }
  .ex span { position:absolute; top:4px; transform:translateX(-50%); white-space:nowrap; }
  .egl { stroke:color-mix(in srgb, var(--primary-text-color) 12%, transparent); stroke-width:1; vector-effect:non-scaling-stroke; }
  .bheat { fill:var(--rk-heat); } .bww { fill:var(--rk-air); }
  .ebar { cursor:pointer; } .ebar .ehit { fill:transparent; } .ebar:hover .ehit, .ebar.sel .ehit { fill:color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
  .ltemp { fill:none; stroke:var(--rk-cold); stroke-width:2; vector-effect:non-scaling-stroke; }
  .pcheap { fill:var(--rk-ok); background:var(--rk-ok); } .pmid { fill:color-mix(in srgb, var(--primary-text-color) 30%, transparent); background:color-mix(in srgb, var(--primary-text-color) 30%, transparent); } .pdear { fill:var(--rk-warn); background:var(--rk-warn); }
  .enow { stroke:var(--primary-text-color); stroke-width:2; vector-effect:non-scaling-stroke; }
  .eleg i.enowi { width:2px !important; background:var(--primary-text-color); }
  .lfit { stroke:var(--rk-warn); stroke-width:2; stroke-dasharray:6 5; vector-effect:non-scaling-stroke; }
  .eleg i.lfiti { height:2px !important; background:var(--rk-warn); }
  .pdot { stroke:var(--rk-heat); stroke-opacity:.85; stroke-width:10; stroke-linecap:round; vector-effect:non-scaling-stroke; }
  .eleg i.bheat { background:var(--rk-heat); } .eleg i.bww { background:var(--rk-air); } .eleg i.s-base { background:var(--rk-off); }
  .eleg .mute { margin-left:auto; opacity:.8; } .eleg .grow-r { margin-left:auto; }
  .esel { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:8px; padding:8px 10px; border-radius:10px; font-size:.82rem; background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .c-heat { color:var(--rk-heat); } .c-ww { color:var(--rk-air); } .c-ok { color:var(--rk-ok); }
  .ekvs { display:grid; gap:6px; margin-top:10px; }
  .ekv { display:flex; justify-content:space-between; gap:10px; padding:7px 10px; border-radius:10px; font-size:.82rem; background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .ekv span { color:var(--secondary-text-color); } .ekv b { text-align:right; font-variant-numeric:tabular-nums; }
  .emoney { display:flex; height:28px; border-radius:8px; overflow:hidden; margin:4px 0 8px; gap:2px; }
  .emoney div { display:flex; align-items:center; justify-content:center; min-width:0; overflow:hidden; white-space:nowrap; font-size:.76rem; font-weight:650; color:#111; padding:0 6px; }
  .s-heat { background:var(--rk-heat); } .s-ww { background:var(--rk-air); } .s-base { background:var(--rk-off); }
  .s-house2 { background:#c9a227; } .eleg i.s-house2 { background:#c9a227; }
  .s-pv { background:var(--rk-ok); } .s-house { background:color-mix(in srgb, var(--rk-ok) 55%, #fff); } .s-feed { background:#38506a; color:#dde !important; }
  .ewk { display:grid; gap:2px; overflow-x:auto; }
  .ewk-h, .ewk-r { display:grid; grid-template-columns:26px repeat(24, minmax(9px,1fr)); gap:2px; align-items:center; }
  .ewk-h span { font-size:.62rem; color:var(--secondary-text-color); }
  .ewk-r span { font-size:.7rem; color:var(--secondary-text-color); }
  .ewk-r i { height:14px; border-radius:3px; background:color-mix(in srgb, var(--rk-heat) calc(var(--a) * 100%), transparent); }
  .ewk-r i.nod { background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); }
  .ewk-p { margin-top:4px; } .ewk-r.ewk-p i { height:8px; }
  .ewk-r.ewk-p i.pcheap { background:var(--rk-ok); } .ewk-r.ewk-p i.pdear { background:var(--rk-warn); } .ewk-r.ewk-p i.pmid { background:color-mix(in srgb, var(--primary-text-color) 30%, transparent); }
  .eleg i.ewk-lo { background:color-mix(in srgb, var(--rk-heat) 12%, transparent); }
  .ehps { display:grid; gap:8px; }
  .ehp { display:grid; grid-template-columns:minmax(120px,1.2fr) 1fr auto; gap:10px; align-items:center; font-size:.82rem; }
  .ehp .trk { height:16px; border-radius:6px; background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); overflow:hidden; }
  .ehp .trk i { display:block; height:100%; border-radius:6px; background:var(--rk-off); }
  .ehp .trk i.hp-own { background:var(--rk-ok); } .ehp .trk i.hp-own_grid { background:var(--rk-heat); }
  .ehp b { font-variant-numeric:tabular-nums; }
  .eroom { grid-template-columns:minmax(70px,120px) 1fr 48px 64px !important; } .eroom small, .eroom b { text-align:right; }
  .eroom small { color:var(--secondary-text-color); font-size:.74rem; white-space:nowrap; }
  .ewarn { display:flex; gap:6px; align-items:flex-start; margin-top:8px; font-size:.8rem; color:var(--rk-warn); }
  .ewarn ha-icon { --mdc-icon-size:16px; flex:none; }
  .esrcs { display:grid; grid-template-columns:minmax(0,1fr); gap:6px; }
  .esrc { display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:10px; background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); font-size:.82rem; }
  .esrc ha-icon { --mdc-icon-size:16px; color:var(--secondary-text-color); flex:none; } .esrc.on ha-icon { color:var(--rk-ok); }
  .esrc .grow { flex:1; min-width:0; } .esrc .nm { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .esrc small { color:var(--secondary-text-color); font-size:.72rem; } .esrc b { white-space:nowrap; font-variant-numeric:tabular-nums; }
  @media (max-width: 600px) { .ech { grid-template-columns:40px 1fr; } .ech.two { grid-template-columns:40px 1fr 32px; } .ehp { grid-template-columns:1fr auto; } .ehp .trk { grid-column:1 / -1; grid-row:2; } }
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
    // Daten kommen alle 10 min neu – bei jedem HA-Zustandswechsel neu zu zeichnen ist unnötig
    // und klappte „Details und Sensoren“ sofort wieder zu. Nur bei Sprachwechsel neu zeichnen.
    else if (this._data && hass.language !== this._lang) this._render();
    this._lang = hass.language;
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

  // Kleines „?“: öffnet unter der Überschrift eine kurze Erklärung (Zustand bleibt beim Neuzeichnen)
  _q(key) {
    if (!HELP_E[key]) return "";
    const open = this._help && this._help.has(key);
    return `<button class="eq-q${open ? " on" : ""}" data-help="${key}" aria-label="${t("Erklärung")}" title="${t("Erklärung")}">?</button>`;
  }

  _helpText(key) {
    return this._help && this._help.has(key) && HELP_E[key] ? `<div class="ehelp">${t(HELP_E[key])}</div>` : "";
  }

  _tile(label, icon, value, unit, detail, tone = "warn", help = "") {
    return `<div class="dtile"><div class="k"><ha-icon icon="${icon}"></ha-icon><span class="grow">${t(label)}</span>${this._q(help)}</div>
      <div class="n" style="color:${toneVar(tone)}">${value}${unit ? `<small>${unit}</small>` : ""}</div>
      ${detail ? `<div class="d">${detail}</div>` : ""}</div>`;
  }

  _row(label, icon, value) {
    return `<div class="drow"><div class="l"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div><div class="v">${value}</div></div>`;
  }

  _kv(label, value) {
    return `<div class="ekv"><span>${label}</span><b>${value}</b></div>`;
  }

  _empty(icon, text) {
    return `<div class="dempty"><ha-icon icon="${icon}"></ha-icon><div>${t(text)}</div></div>`;
  }

  _box(title, icon, body, help = "", wide = false) {
    return `<section class="ebox${wide ? " wide" : ""}"><div class="eh"><ha-icon icon="${icon}"></ha-icon><b class="grow">${t(title)}</b>${this._q(help)}</div>${this._helpText(help)}${body}</section>`;
  }

  // Achse mit runden Schritten: 0, 10, 20, 30 …
  _ticks(max, n = 4) {
    const raw = Math.max(max, 0.001) / n;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((v) => v >= raw) || 10 * mag;
    const top = step * Math.ceil(max / step || 1);
    const out = [];
    for (let v = 0; v <= top + step / 2; v += step) out.push(Number(v.toFixed(6)));
    return { top, ticks: out };
  }

  // Diagramm-Rahmen: Achse links (und optional rechts), Beschriftung unten – Text bleibt scharf,
  // die Balken skalieren mit der Breite der Karte.
  _frame(svg, left, right, bottom, height = 170) {
    const lab = (list, cls) => `<div class="ey ${cls}">${list.map((l) => `<span style="top:${l.y.toFixed(1)}%">${l.t}</span>`).join("")}</div>`;
    return `<div class="ech${right ? " two" : ""}" style="--h:${height}px">${lab(left, "l")}<div class="ecv"><svg viewBox="0 0 1000 ${height}" preserveAspectRatio="none">${svg}</svg></div>${right ? lab(right, "r") : ""}
      <div class="ex">${bottom.map((b) => `<span style="left:${b.x.toFixed(1)}%">${b.t}</span>`).join("")}</div></div>`;
  }

  // Tagesbalken (bis 62 Tage) bzw. Monatsbalken: Heizung + Warmwasser gestapelt, Außentemperatur als Linie
  _dailyChart(daily) {
    let rows = (daily || []).map((d) => ({ ...d, label: d.date }));
    if (rows.length < 2 || !rows.some((d) => d.kwh + d.ww > 0)) return "";
    const monthly = rows.length > 62;
    if (monthly) {
      const m = new Map();
      rows.forEach((d) => {
        const k = d.date.slice(0, 7);
        const x = m.get(k) || { date: k, label: k, kwh: 0, ww: 0, cost: 0, ts: [], n: 0 };
        x.kwh += d.kwh; x.ww += d.ww; x.cost += d.cost; x.n += 1;
        if (d.outdoor != null) x.ts.push(d.outdoor);
        m.set(k, x);
      });
      rows = [...m.values()].map((x) => ({ ...x, outdoor: x.ts.length ? x.ts.reduce((a, b) => a + b, 0) / x.ts.length : null }));
    }
    const H = 170, W = 1000, top = 8;
    const { top: max, ticks } = this._ticks(Math.max(...rows.map((d) => d.kwh + d.ww)));
    const bw = W / rows.length;
    const y = (v) => H - (v / max) * (H - top);
    const temps = rows.map((d) => d.outdoor).filter((v) => v != null);
    const tlo = temps.length ? Math.floor(Math.min(...temps, 0) / 5) * 5 : 0;
    const thi = temps.length ? Math.ceil(Math.max(...temps, 10) / 5) * 5 : 10;
    const ty = (v) => H - ((v - tlo) / Math.max(thi - tlo, 1)) * (H - top);
    const sel = this._sel != null && this._sel < rows.length ? this._sel : null;
    let svg = ticks.map((v) => `<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="egl"/>`).join("");
    svg += rows.map((d, i) => {
      const x = i * bw + bw * 0.14, w = bw * 0.72;
      const hk = H - y(d.kwh), hw = H - y(d.ww);
      return `<g data-day="${i}" class="ebar${sel === i ? " sel" : ""}"><rect x="${(i * bw).toFixed(1)}" y="0" width="${bw.toFixed(1)}" height="${H}" class="ehit"/>`
        + `<rect x="${x.toFixed(1)}" y="${(y(d.kwh) - hw).toFixed(1)}" width="${w.toFixed(1)}" height="${hw.toFixed(1)}" class="bww"/>`
        + `<rect x="${x.toFixed(1)}" y="${y(d.kwh).toFixed(1)}" width="${w.toFixed(1)}" height="${hk.toFixed(1)}" class="bheat"/></g>`;
    }).join("");
    if (temps.length >= 2) {
      const pts = rows.map((d, i) => (d.outdoor == null ? null : `${((i + 0.5) * bw).toFixed(1)},${ty(d.outdoor).toFixed(1)}`)).filter(Boolean);
      svg += `<polyline points="${pts.join(" ")}" class="ltemp"/>`;
    }
    const left = ticks.map((v) => ({ y: (y(v) / H) * 100, t: `${fmt(v, 0)} kWh` }));
    const right = temps.length >= 2 ? [tlo, (tlo + thi) / 2, thi].map((v) => ({ y: (ty(v) / H) * 100, t: `${fmt(v, 0)} °C` })) : null;
    const every = monthly ? 1 : rows.length > 31 ? 14 : 7;
    const bottom = rows.map((d, i) => ({ i, d })).filter(({ i }) => (rows.length - 1 - i) % every === 0)
      .map(({ i, d }) => ({ x: ((i + 0.5) / rows.length) * 100, t: monthly ? this._month(d.date) : this._dayLabel(d.date) }));
    const hasWw = rows.some((d) => d.ww > 0);
    const legend = `<div class="eleg"><span><i class="bheat"></i>${t("Heizung")} kWh</span>${hasWw ? `<span><i class="bww"></i>${t("Warmwasser")} kWh</span>` : ""}${temps.length >= 2 ? `<span><i class="ltemp"></i>${t("Außen °C (rechte Achse)")}</span>` : ""}<span class="mute">${t("Balken antippen zeigt den Tag")}</span></div>`;
    const pick = sel != null ? rows[sel] : null;
    const info = pick ? `<div class="esel"><b>${monthly ? this._month(pick.date) : this._dayLabel(pick.date, true)}</b>
      <span class="c-heat">${t("Heizung")} ${fmt(pick.kwh, 1)} kWh</span>${pick.ww > 0 ? `<span class="c-ww">${t("Warmwasser")} ${fmt(pick.ww, 1)} kWh</span>` : ""}
      <span>${t("Kosten")} ${fmt(pick.cost, 2)} €</span>${pick.outdoor != null ? `<span>${t("außen")} ${fmt(pick.outdoor, 1)} °C</span>` : ""}</div>` : "";
    return this._frame(svg, left, right, bottom) + legend + info;
  }

  _dayLabel(iso, long = false) {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString(loc(), long ? { weekday: "short", day: "numeric", month: "numeric" } : { day: "numeric", month: "numeric" });
  }

  _month(key) {
    return new Date(`${key}-15T12:00:00`).toLocaleDateString(loc(), { month: "short", year: "2-digit" });
  }

  // Preiskurve mit Achse in ct, „jetzt“-Strich, Farben nach Vierteln
  _priceChart(points) {
    if (!points || points.length < 4) return "";
    const vals = points.map((p) => p.p * 100);
    const sorted = [...vals].sort((a, b) => a - b);
    const lo = sorted[Math.floor(sorted.length * 0.25)], hi = sorted[Math.floor(sorted.length * 0.75)];
    const min = Math.floor(Math.min(...vals) / 5) * 5, max = Math.ceil(Math.max(...vals) / 5) * 5;
    const H = 150, W = 1000, bw = W / points.length;
    const y = (v) => H - ((v - min) / Math.max(max - min, 1)) * (H - 6);
    const now = Date.now();
    let nowIdx = points.findIndex((p, i) => {
      const a = new Date(p.t).getTime(), b = i + 1 < points.length ? new Date(points[i + 1].t).getTime() : a + 3600e3;
      return a <= now && now < b;
    });
    let svg = [];
    for (let v = min; v <= max; v += 5) svg.push(`<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="egl"/>`);
    svg = svg.join("") + points.map((p, i) => {
      const v = p.p * 100;
      const cls = v <= lo ? "pcheap" : v >= hi ? "pdear" : "pmid";
      return `<rect x="${(i * bw).toFixed(2)}" y="${y(v).toFixed(1)}" width="${Math.max(bw - 0.6, 0.8).toFixed(2)}" height="${(H - y(v)).toFixed(1)}" class="${cls}"/>`;
    }).join("");
    if (nowIdx >= 0) svg += `<line x1="${(nowIdx * bw).toFixed(1)}" x2="${(nowIdx * bw).toFixed(1)}" y1="0" y2="${H}" class="enow"/>`;
    const left = [];
    for (let v = min; v <= max; v += 5) left.push({ y: (y(v) / H) * 100, t: `${fmt(v, 0)} ct` });
    const bottom = [];
    const step = Math.max(1, Math.ceil(points.length / 4));
    for (let i = step; i < points.length; i += step) {
      const d = new Date(points[i].t);
      bottom.push({ x: ((i + 0.5) / points.length) * 100, t: d.toLocaleString(loc(), { weekday: "short", hour: "2-digit", minute: "2-digit" }) });
    }
    // günstigste drei Stunden am Stück, die noch kommen
    const per = points.length > 1 ? Math.max(1, Math.round(3600e3 / (new Date(points[1].t) - new Date(points[0].t)))) : 1;
    const win = 3 * per;
    let best = null;
    for (let i = Math.max(0, nowIdx); i + win <= points.length; i++) {
      const avg = points.slice(i, i + win).reduce((a, b) => a + b.p, 0) / win;
      if (!best || avg < best.avg) best = { i, avg };
    }
    const hm = (d) => d.toLocaleString(loc(), { weekday: "short", hour: "2-digit", minute: "2-digit" });
    const cur = nowIdx >= 0 ? points[nowIdx] : null;
    const rows = [
      cur ? this._kv(t("Jetzt"), `${fmt(cur.p * 100, 1)} ct/kWh`) : "",
      this._kv(t("Spanne"), `${fmt(sorted[0], 1)} – ${fmt(sorted[sorted.length - 1], 1)} ct/kWh`),
      best ? this._kv(t("Günstigste 3 Stunden"), `${esc(hm(new Date(points[best.i].t)))} · Ø ${fmt(best.avg * 100, 1)} ct/kWh`) : "",
    ].join("");
    const legend = `<div class="eleg"><span><i class="pcheap"></i>${t("günstigstes Viertel")}</span><span><i class="pmid"></i>${t("normal")}</span><span><i class="pdear"></i>${t("teuerstes Viertel")}</span><span><i class="enowi"></i>${t("jetzt")}</span></div>`;
    return this._frame(svg, left, null, bottom, H) + legend + `<div class="ekvs">${rows}</div>`;
  }

  // Wochentag × Stunde: wann läuft die Heizung – darunter der Ø-Preis je Stunde
  _weekGrid(week, cheapShare) {
    if (!week || !week.kwh) return "";
    const all = week.kwh.flat().filter((v) => v != null);
    if (!all.length) return "";
    const max = Math.max(...all, 0.01);
    const days = [0, 1, 2, 3, 4, 5, 6].map((i) => new Date(2026, 10, 2 + i).toLocaleDateString(loc(), { weekday: "short" }));
    const pr = (week.price || []).filter((v) => v != null);
    const ps = [...pr].sort((a, b) => a - b);
    const plo = ps[Math.floor(ps.length * 0.25)], phi = ps[Math.floor(ps.length * 0.75)];
    const head = `<div class="ewk-h"><span></span>${Array.from({ length: 24 }, (_, h) => `<span>${h % 6 === 0 ? h : ""}</span>`).join("")}</div>`;
    const body = week.kwh.map((row, d) => `<div class="ewk-r"><span>${esc(days[d])}</span>${row.map((v, h) => v == null
      ? `<i class="nod"></i>`
      : `<i style="--a:${(0.1 + 0.9 * (v / max)).toFixed(2)}" title="${esc(days[d])} ${h}:00 · Ø ${fmt(v, 2)} kWh"></i>`).join("")}</div>`).join("");
    const price = pr.length ? `<div class="ewk-r ewk-p"><span>ct</span>${(week.price || []).map((p, h) => p == null ? `<i class="nod"></i>`
      : `<i class="${p <= plo ? "pcheap" : p >= phi ? "pdear" : "pmid"}" title="${h}:00 · Ø ${fmt(p * 100, 1)} ct/kWh"></i>`).join("")}</div>` : "";
    const legend = `<div class="eleg"><span><i class="ewk-lo"></i>${t("wenig")}</span><span><i class="bheat"></i>${t("viel Strom")}</span>${price ? `<span>${t("untere Zeile: Ø Preis je Stunde")}</span>` : ""}</div>`;
    const note = cheapShare != null ? `<div class="enote">${t("{p} % des bezahlten Stroms fiel in die günstigsten Stunden – gleichmäßig verteilt wären es 25 %.", { p: cheapShare })}</div>` : "";
    return `<div class="ewk">${head}${body}${price}</div>${legend}${note}`;
  }

  // Heizkennlinie: Tage als Punkte, Gerade, Steigung und Heizgrenze
  _curve(c, price) {
    if (!c || !c.points) return "";
    const ts = c.points.map((p) => p.t), ks = c.points.map((p) => p.kwh);
    const tlo = Math.floor(Math.min(...ts) - 1), thi = Math.max(Math.ceil(Math.max(...ts) + 1), Math.min(Math.ceil(c.limit), tlo + 25));
    const { top: kmax, ticks } = this._ticks(Math.max(...ks, c.intercept + c.per_kelvin * -tlo));
    const H = 170, W = 1000;
    const x = (v) => ((v - tlo) / Math.max(thi - tlo, 1)) * W;
    const y = (v) => H - (Math.max(0, v) / kmax) * (H - 8);
    let svg = ticks.map((v) => `<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="egl"/>`).join("");
    const f = (tt) => c.intercept - c.per_kelvin * tt;
    svg += `<line x1="${x(tlo)}" y1="${y(f(tlo)).toFixed(1)}" x2="${x(thi)}" y2="${y(f(thi)).toFixed(1)}" class="lfit"/>`;
    svg += c.points.map((p) => `<line x1="${x(p.t).toFixed(1)}" y1="${y(p.kwh).toFixed(1)}" x2="${x(p.t).toFixed(1)}" y2="${y(p.kwh).toFixed(1)}" class="pdot"><title>${fmt(p.t, 1)} °C · ${fmt(p.kwh, 1)} kWh</title></line>`).join("");
    const left = ticks.map((v) => ({ y: (y(v) / H) * 100, t: `${fmt(v, 0)} kWh` }));
    const bottom = [];
    const st = thi - tlo > 12 ? 4 : 2;
    for (let v = Math.ceil(tlo / st) * st; v <= thi; v += st) bottom.push({ x: (x(v) / W) * 100, t: `${fmt(v, 0)} °C` });
    const rows = [
      this._kv(t("Je 1 °C kälter"), `≈ +${fmt(c.per_kelvin, 1)} kWh ${t("pro Tag")}${price ? ` (≈ ${fmt(c.per_kelvin * price, 2)} €)` : ""}`),
      c.limit > 0 && c.limit < 25 ? this._kv(t("Heizgrenze"), t("≈ {v} °C Tagesmittel", { v: fmt(c.limit, 1) })) : "",
      this._kv(t("Grundlage"), t("{n} Tage{r}", { n: c.n, r: c.r2 != null ? ` · ${t("Passgenauigkeit {p} %", { p: fmt(c.r2 * 100, 0) })}` : "" })),
    ].join("");
    return this._frame(svg, left, null, bottom, H) + `<div class="eleg"><span><i class="bheat"></i>${t("ein Tag")}</span><span><i class="lfiti"></i>${t("Kennlinie")}</span></div><div class="ekvs">${rows}</div>`;
  }

  _heatPrices(e) {
    const list = e.heat_prices || [];
    if (!list.length) return "";
    const names = {
      own: e.source === "heatpump" ? (e.self_kwh ? t("deine Wärmepumpe (mit PV/Akku)") : t("deine Wärmepumpe")) : t("deine Heizung"),
      own_grid: t("deine Wärmepumpe, nur Netzstrom"),
      heatpump: t("Wärmepumpe ({p} ct Strom, JAZ 3,5)", { p: fmt((e.compare_power || 0) * 100, 0) }),
      gas: t("Gas ({p} ct/kWh, 90 %)", { p: fmt((e.compare_gas || 0) * 100, 0) }),
      oil: t("Heizöl ({p} €/L, 90 %)", { p: fmt(e.compare_oil || 0, 2) }),
    };
    const max = Math.max(...list.map((x) => x.ct), 1);
    const bars = list.map((x) => `<div class="ehp"><span>${esc(names[x.id] || x.id)}</span><div class="trk"><i class="hp-${x.id}" style="width:${Math.max(4, (100 * x.ct) / max).toFixed(0)}%"></i></div><b>${fmt(x.ct, 1)} ct</b></div>`).join("");
    const extra = [
      e.tariff_saving != null ? this._kv(t("Dynamischer Tarif gegenüber Börsen-Mittel"), e.tariff_saving >= 0 ? `<span class="c-ok">− ${fmt(e.tariff_saving, 2)} € ${t("gespart")}</span>` : `+ ${fmt(-e.tariff_saving, 2)} € ${t("teurer")}`) : "",
      e.shift_eur != null && e.shift_eur > 0 ? this._kv(t("Nur günstigste Stunden genutzt (Obergrenze)"), t("weitere ≈ {v} €", { v: fmt(e.shift_eur, 0) })) : "",
    ].join("");
    return `<div class="ehps">${bars}</div><div class="enote">${t("je kWh Wärme im Haus – Vergleichspreise in den Einstellungen änderbar")}</div>${extra ? `<div class="ekvs">${extra}</div>` : ""}`;
  }

  _pvBox(e) {
    const pv = e.pv_kwh, feed = e.feed_kwh, b = e.batt || null;
    if (pv == null && !b && !e.self_kwh) return "";
    const parts = [];
    const heat = e.self_kwh || 0;
    if (pv != null && pv > 0) {
      const fed = feed != null ? Math.min(feed, pv) : null;
      const house = fed != null ? Math.max(0, pv - fed - heat) : null;
      const seg = (v, cls, label) => v > 0 ? `<div class="${cls}" style="flex:${v.toFixed(1)}" title="${label}">${label}</div>` : "";
      parts.push(`<div class="emoney">${seg(Math.min(heat, pv), "s-pv", `${fmt(heat, 0)} kWh`)}${house != null ? seg(house, "s-house", `${fmt(house, 0)} kWh`) : ""}${fed != null ? seg(fed, "s-feed", `${fmt(fed, 0)} kWh`) : ""}</div>
        <div class="eleg"><span><i class="s-pv"></i>${t("Heizung")}</span>${house != null ? `<span><i class="s-house"></i>${t("Haus")}</span>` : ""}${fed != null ? `<span><i class="s-feed"></i>${t("eingespeist")}</span>` : ""}</div>`);
    }
    const rows = [
      pv != null ? this._kv(t("PV erzeugt"), `${fmt(pv, 0)} kWh`) : "",
      feed != null ? this._kv(t("Eingespeist"), `${fmt(feed, 0)} kWh`) : "",
      e.self_kwh ? this._kv(t("Heizung aus PV/Akku (kostenlos)"), `${fmt(e.self_kwh, 0)} kWh`) : "",
      e.batt_kwh ? this._kv(t("Heizung aus dem Akku, vorher aus dem Netz geladen"), `${fmt(e.batt_kwh, 0)} kWh`) : "",
      b ? this._kv(t("Akku geladen · davon aus dem Netz"), `${fmt(b.charge, 0)} kWh · ${fmt(b.grid_charge, 0)} kWh${b.grid_charge > 0 && b.grid_charge_cost ? ` (Ø ${fmt((b.grid_charge_cost / b.grid_charge) * 100, 1)} ct)` : ""}`) : "",
    ].join("");
    return parts.join("") + `<div class="ekvs">${rows}</div>`;
  }

  _houseBox(h, e) {
    if (!h || h.grid_kwh == null) return "";
    const seg = (v, cls, label) => v > 0 ? `<div class="${cls}" style="flex:${v.toFixed(2)}" title="${label}">${label}</div>` : "";
    const heat = h.heat_cost != null ? h.heat_cost : 0;
    const bar = `<div class="emoney">${seg(heat, "s-heat", `${t("Heizung")} ${fmt(heat, 2)} €`)}${seg(h.rest_cost != null ? h.rest_cost : h.grid_cost, "s-house2", `${t("übriges Haus")} ${fmt(h.rest_cost != null ? h.rest_cost : h.grid_cost, 2)} €`)}${seg(h.base, "s-base", `${t("Grundgebühr")} ${fmt(h.base, 2)} €`)}</div>
      <div class="eleg"><span><i class="bheat"></i>${t("Heizung inkl. Warmwasser")}</span><span><i class="s-house2"></i>${t("übriges Haus")}</span><span><i class="s-base"></i>${t("Grundgebühr")}</span></div>`;
    const rows = [
      this._kv(t("Netzbezug"), `${fmt(h.grid_kwh, 0)} kWh · ${fmt(h.grid_cost, 2)} €`),
      this._kv(t("Grundgebühr"), `${fmt(h.base, 2)} €`),
      this._kv(`<b>${t("Rechnung Versorger")}</b>`, `${fmt(h.bill, 2)} €`),
      h.feed_eur != null ? this._kv(t("Einspeisevergütung ({k} kWh × {p} ct)", { k: fmt(h.feed_kwh, 0), p: fmt((e.feed_price || 0) * 100, 2) }), `<span class="c-ok">− ${fmt(h.feed_eur, 2)} €</span>`) : "",
      h.feed_eur != null ? this._kv(`<b>${t("Unterm Strich")}</b>`, `${fmt(h.net, 2)} € · ${t("{v} € pro Tag", { v: fmt(h.per_day, 2) })}`) : this._kv(t("Pro Tag"), `${fmt(h.per_day, 2)} €`),
      h.price_avg != null ? this._kv(t("Ø Netzstrom"), `${fmt(h.price_avg * 100, 1)} ct/kWh`) : "",
      h.self_share != null ? this._kv(t("Selbst versorgt (PV & Akku)"), `${fmt(h.self_share, 0)} % ${t("von")} ${fmt(h.house_kwh, 0)} kWh`) : "",
    ].join("");
    return bar + `<div class="ekvs">${rows}</div>`;
  }

  _roomsBox(rooms) {
    if (!rooms.length) return "";
    const top = rooms[0].share || 1;
    const fair = 100 / rooms.length;
    const unit = { valve: t("Ventilstunden"), deficit: t("Gradstunden"), hours: t("Heizstunden") };
    const short = { valve: "h", deficit: "K·h", hours: "h" };
    const odd = rooms.length >= 3 ? rooms.filter((r) => r.share >= Math.max(2 * fair, 30)) : [];
    return `<div class="erooms">${rooms.slice(0, 10).map((r) => `<div class="eroom"><span>${esc(r.name)}</span><div class="trk"><i style="width:${Math.max(4, (100 * r.share) / top).toFixed(0)}%"></i></div><small title="${esc(unit[r.metric] || "")}">${r.value != null ? `${fmt(r.value, 0)} ${short[r.metric] || ""}` : ""}</small><b>${fmt(r.cost, 2)} €</b></div>`).join("")}</div>
      ${odd.map((r) => `<div class="ewarn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("{r}: {p} % – deutlich mehr als die anderen Räume. Ventil, Fühler oder Wunschtemperatur prüfen.", { r: esc(r.name), p: fmt(r.share, 0) })}</div>`).join("")}
      <div class="enote">${t("verteilt nach {m} – ohne Warmwasser und Grundgebühr", { m: unit[(rooms[0] || {}).metric] || unit.valve })}</div>`;
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
      e.feed_entity ? this._row("Einspeisung", "mdi:transmission-tower-export", ent(e.feed_entity)) : "",
      e.batt_in_entity ? this._row("Akku geladen", "mdi:battery-arrow-up-outline", ent(e.batt_in_entity)) : "",
      e.batt_out_entity ? this._row("Akku entladen", "mdi:battery-arrow-down-outline", ent(e.batt_out_entity)) : "",
      e.heat_elec_entity ? this._row("Strom laut Wärmepumpe", "mdi:heat-pump-outline", `${ent(e.heat_elec_entity)}${e.heat_elec_kwh != null ? ` · ${fmt(e.heat_elec_kwh, 0)} kWh` : ""}`) : "",
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
    const tank = e.tank || null;
    const market = e.oil_market || null;
    const electric = e.source === "heatpump" || e.source === "electric";
    const kwh = (v) => `${fmt(v, v >= 10 ? 0 : 1)} kWh`;

    // --- Kennzahlen
    const annual = money.annual != null
      ? t(money.annual_basis === "12m" ? "Jahr ≈ {v} € (letzte 12 Monate)" : "Jahr ≈ {v} €", { v: fmt(money.annual, 0) })
      : money.period_cost != null ? t("Jahr: noch zu wenig Daten") : "";
    const costDetail = [
      money.per_day != null ? t("{v} € pro Tag", { v: fmt(money.per_day, 2) }) : "",
      annual,
      money.parts && money.parts.base ? t("Grundgebühr {v} € enthalten", { v: fmt(money.parts.base, 2) }) : "",
      money.basis === "tank" ? t("Basis: {b}", { b: t("Tank") }) : money.basis === "bill" ? t("Basis: {b}", { b: t("Abrechnung") }) : "",
    ].filter(Boolean).join(" · ");
    const useLabel = { heatpump: "Strom Wärmepumpe", electric: "Strom Heizung", gas: "Gas", oil: "Heizöl", district: "Fernwärme" }[e.source] || "Verbrauch";
    const useDetail = [
      ww > 0 ? `${t("Heizung")} ${kwh(kwhHeat)} · ${t("Warmwasser")} ${kwh(ww)}` : "",
      e.liter != null ? `${fmt(e.liter, 0)} L` : e.m3 != null ? `${fmt(e.m3, 1)} m³` : "",
      e.house_share != null ? t("{p} % des Hausstroms", { p: fmt(e.house_share, 0) }) : "",
    ].filter(Boolean).join(" · ");
    const tiles = [
      this._tile("Kosten", "mdi:currency-eur", cost == null ? "–" : fmt(cost, 2), "€", costDetail || t("noch keine Schätzung"), "heat", HK.cost),
      this._tile(useLabel, "mdi:lightning-bolt", total == null ? "–" : fmt(total, total >= 100 ? 0 : 1), "kWh", useDetail, "warn", HK.use),
    ];
    if (e.source === "heatpump" && e.heat_kwh != null) {
      const heatAll = e.heat_kwh + (e.ww_heat_kwh || 0);
      tiles.push(this._tile("Wärme erzeugt", "mdi:radiator", fmt(heatAll, 0), "kWh",
        [e.ww_heat_kwh ? `${t("Heizung")} ${kwh(e.heat_kwh)} · ${t("Warmwasser")} ${kwh(e.ww_heat_kwh)}` : "", e.cop_from ? t("Wärme gemessen seit {d}", { d: this._dayLabel(e.cop_from) }) : ""].filter(Boolean).join(" · "), "heat", HK.heat));
    }
    if (e.source === "heatpump") {
      const a = e.cop, b = e.cop_vendor;
      const val = a != null && b != null && Math.abs(a - b) >= 0.15 ? `${fmt(Math.min(a, b), 1)} – ${fmt(Math.max(a, b), 1)}` : a != null ? fmt(a, 1) : b != null ? fmt(b, 1) : e.efficiency > 0 ? fmt(e.efficiency, 1) : "–";
      tiles.push(this._tile("Arbeitszahl", "mdi:gauge", val, "",
        [b != null ? t("laut Wärmepumpe {v}", { v: fmt(b, 1) }) : "", a != null ? t("gemessen {v}", { v: fmt(a, 1) }) : e.efficiency > 0 ? t("geschätzt (Datenblatt)") : t("Wärmezähler fehlt"), e.cop_ww != null ? t("Warmwasser {v}", { v: fmt(e.cop_ww, 1) }) : ""].filter(Boolean).join(" · "), "ok", HK.cop));
    } else if (e.source === "district" && e.heat_kwh != null) {
      tiles.push(this._tile("Wärme", "mdi:radiator", fmt(e.heat_kwh, 0), "kWh", "", "ok", HK.heat));
    }
    if (e.price_paid != null && e.tariff_dynamic) {
      tiles.push(this._tile("Bezahlt Ø", "mdi:tag-outline", fmt(e.price_paid * 100, 1), "ct/kWh", [
        e.price_avg != null ? t("Börse Ø {v} ct/kWh", { v: fmt(e.price_avg * 100, 1) }) : "",
        e.cheap_share != null ? t("{p} % in günstigen Stunden", { p: e.cheap_share }) : "",
      ].filter(Boolean).join(" · "), e.price_avg != null && e.price_paid <= e.price_avg ? "ok" : "warn", HK.paid));
    } else {
      tiles.push(this._tile("Preis", "mdi:tag-outline", fmt((e.price_now ?? e.price) * 100, 1), "ct/kWh", t("je kWh, brutto"), "warn", HK.price));
    }
    if (tank) {
      const tv = tank.current_percent != null ? fmt(tank.current_percent, 0) : tank.current_l != null ? fmt(tank.current_l, 0) : "–";
      tiles.push(this._tile("Tank", "mdi:oil-level", tv, tank.current_percent != null ? "%" : "L",
        [tank.current_l != null ? `${fmt(tank.current_l, 0)} L` : "", tank.days_left != null ? t("reicht noch ~{d} Tage", { d: tank.days_left }) : tank.order ? t("jetzt bestellen") : t("lernt noch")].filter(Boolean).join(" · "), tank.order ? "warn" : "ok", HK.tank));
    }
    if (market) {
      tiles.push(this._tile("Markt", "mdi:chart-line", market.value != null ? fmt(market.value, 2) : "–", "€/L",
        market.avg_30d != null ? t("30-Tage-Ø {v} €/L", { v: fmt(market.avg_30d, 2) }) : "", market.delta_avg != null && market.delta_avg <= 0 ? "ok" : "warn", HK.market));
    }
    if (e.self_kwh) {
      tiles.push(this._tile("Aus PV & Akku", "mdi:solar-power", fmt(e.self_kwh, 0), "kWh",
        [t("kostenlos – schon abgezogen"), e.batt_kwh ? t("{v} kWh aus nachts geladenem Akku bezahlt", { v: fmt(e.batt_kwh, 0) }) : ""].filter(Boolean).join(" · "), "ok", HK.self));
    }

    // --- Wohin geht das Geld?
    const parts = money.parts || null;
    let moneyBar = "";
    if (parts && (parts.heat || parts.ww || parts.base)) {
      const seg = (v, cls, label) => v > 0 ? `<div class="${cls}" style="flex:${v.toFixed(2)}" title="${label}">${label}</div>` : "";
      moneyBar = this._box("Wohin geht das Geld?", "mdi:cash-multiple", `<div class="emoney">${seg(parts.heat || 0, "s-heat", `${t("Heizung")} ${fmt(parts.heat, 2)} €`)}${seg(parts.ww || 0, "s-ww", `${t("Warmwasser")} ${fmt(parts.ww, 2)} €`)}${seg(parts.base || 0, "s-base", `${t("Grundgebühr")} ${fmt(parts.base, 2)} €`)}</div>
        <div class="eleg"><span><i class="bheat"></i>${t("Heizung")}</span>${parts.ww ? `<span><i class="bww"></i>${t("Warmwasser")}</span>` : ""}${parts.base ? `<span><i class="s-base"></i>${t("Grundgebühr (anteilig)")}</span>` : ""}${parts.pv_saved ? `<span class="c-ok grow-r">${t("+ {k} kWh aus PV/Akku ≈ {v} € nicht bezahlt", { k: fmt(e.self_kwh, 0), v: fmt(parts.pv_saved, 0) })}</span>` : ""}</div>`, HK.money, true);
    }

    // --- Boxen
    const boxes = [];
    const chart = this._dailyChart(e.daily);
    if (chart) boxes.push(this._box((e.daily || []).length > 62 ? "Verbrauch pro Monat" : "Verbrauch pro Tag", "mdi:chart-bar", chart, HK.daily, true));
    const strip = electric ? this._priceChart(d.forecast) : "";
    if (strip) boxes.push(this._box("Strompreis heute & morgen", "mdi:chart-timeline-variant", strip, HK.pricechart));
    const wk = this._weekGrid(e.week, e.tariff_dynamic ? e.cheap_share : null);
    if (wk) boxes.push(this._box(e.source === "heatpump" ? "Wann läuft die Wärmepumpe?" : "Wann wird geheizt?", "mdi:clock-outline", wk, HK.week));
    const curve = this._curve(e.curve, e.price_paid || e.price);
    if (curve) boxes.push(this._box("Heizkennlinie deines Hauses", "mdi:thermometer-lines", curve, HK.curve));
    const hp = this._heatPrices(e);
    if (hp) boxes.push(this._box("Was kostet 1 kWh Wärme?", "mdi:cash", hp, HK.heatprice));
    const house = electric ? this._houseBox(e.house, e) : "";
    if (house) boxes.push(this._box("Strom im ganzen Haus", "mdi:home-lightning-bolt-outline", house, HK.house));
    const pv = electric ? this._pvBox(e) : "";
    if (pv) boxes.push(this._box("PV & Akku", "mdi:solar-power-variant", pv, HK.pv));
    const rooms = this._roomsBox(money.rooms || []);
    if (rooms) boxes.push(this._box("Wer verbraucht die Wärme?", "mdi:home-thermometer-outline", rooms, HK.rooms));
    const srcs = e.tariffs || [];
    if (srcs.length > 1) {
      boxes.push(this._box("Preisquellen", "mdi:swap-vertical", `<div class="esrcs">${srcs.map((x) => `<div class="esrc${x.active ? " on" : ""}">
        <ha-icon icon="${x.active ? "mdi:check-circle" : "mdi:circle-outline"}"></ha-icon>
        <div class="grow"><div class="nm" title="${esc(x.entity)}">${esc(x.name)}</div><small>${t(x.primary ? "Hauptquelle" : "Reserve")}${x.forecast ? ` · ${t("mit Vorschau")}` : ""}</small></div>
        <b>${x.value != null ? `${fmt(x.value * 100, 1)} ct/kWh` : t("liefert nichts")}</b></div>`).join("")}</div>`, HK.sources));
    }

    const tileHelp = ["cost", "use", "heat", "cop", "paid", "price", "tank", "market", "self"].map((k) => this._helpText(k)).join("");
    return `<div class="dtiles etiles">${tiles.join("")}</div>${tileHelp}
      ${this._quality(e)}
      <div class="egrid">${moneyBar}${boxes.join("")}</div>
      <details class="eraw"${this._rawOpen ? " open" : ""}><summary>${t("Details und Sensoren")}</summary><div class="drows">${this._rawRows(d, e)}</div></details>`;
  }

  _render() {
    if (!this._hass) return;
    const d = this._data;
    let body;
    if (this._err) body = this._empty("mdi:alert-circle-outline", "Energie nicht verfügbar: {e}".replace("{e}", esc(this._err)));
    else if (!d) body = `<div class="dempty"><ha-icon icon="mdi:loading"></ha-icon><div>${t("Lade Energie …")}</div></div>`;
    else body = this._body(d);
    const title = this._config.title || t("Energie");
    const clipped = d && d.data_from && d.days_asked && d.days < d.days_asked;
    const sub = d ? `${clipped ? t("Daten ab {d}", { d: d.start }) : t("Letzte {n} Tage", { n: d.days })} · ${d.start} – ${d.end}` : t("Zähler, Tarif und Kosten");
    this._html = `<style>${STYLES}${DASH_STYLES}${ENERGY_STYLES}</style>
      <ha-card class="dashcard" style="--tone:${toneVar("warn")}">
        <div class="dhead"><div class="grow"><div class="dtitle"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><div>${esc(title)}<div class="dsub">${esc(sub)}</div></div></div></div>
          <div class="dseg">${[1, 7, 30, 90, 180, 365].map((n) => `<button class="${n === this._days ? "on" : ""}" data-days="${n}">${n === 1 ? t("Heute") : t("{n} Tage", { n })}</button>`).join("")}</div>
        </div>
        ${body}
      </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-days]").forEach((b) => b.addEventListener("click", () => {
      this._days = Number(b.dataset.days);
      this._sel = null;
      this._load();
    }));
    this.shadowRoot.querySelectorAll("[data-help]").forEach((b) => b.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this._help = this._help || new Set();
      const k = b.dataset.help;
      if (this._help.has(k)) this._help.delete(k); else this._help.add(k);
      this._render();
    }));
    this.shadowRoot.querySelectorAll("[data-day]").forEach((g) => g.addEventListener("click", () => {
      const i = Number(g.getAttribute("data-day"));
      this._sel = this._sel === i ? null : i;
      this._render();
    }));
    // Aufgeklappt bleibt aufgeklappt – die Karte zeichnet bei jedem HA-Update neu.
    const raw = this.shadowRoot.querySelector("details.eraw");
    if (raw) raw.addEventListener("toggle", () => { this._rawOpen = raw.open; });
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }))));
  }
}
