import { HISTORY_STYLES, ISSUE_STYLES, REPORT_STYLES, ROOM_COLORS, SETTINGS_STYLES, STYLES, esc, fmt, rkIssueList, rkRooms, toneVar } from "../shared.js";


export class RaumklimaReportCard extends HTMLElement {
  static getConfigForm() {
    return { schema: [{ name: "title", selector: { text: {} } }, { name: "strip_prefix", selector: { text: {} } }] };
  }
  static getStubConfig() { return {}; }
  setConfig(config) {
    this._config = { ...config };
    this._period = this._period || "week";
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return 10; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  connectedCallback() {
    this.style.display = "block";
    this._poll = setInterval(() => this._load(), 10 * 60 * 1000);
  }
  disconnectedCallback() { clearInterval(this._poll); }
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) { this._colors(); this._load(); this._render(); }
  }
  _colors() {
    const rooms = rkRooms(this._hass, this._config.strip_prefix || "", this._config.home);
    this._roomColor = (name) => {
      const r = rooms.find((x) => x.name === name) || rooms.find((x) => x.name.endsWith(" " + name) || name.endsWith(" " + x.name));
      return r ? r.color : null;
    };
  }
  async _load() {
    if (!this._hass) return;
    try {
      this._data = await this._hass.callWS({ type: "raumklima/report", ...(this._config.home ? { home: this._config.home } : {}) });
      this._err = null;
    } catch (e) {
      this._err = e.message || String(e);
    }
    this._render();
  }

  _tile(label, icon, tone, value, unit, detail, detailCls = "") {
    return `<div class="tile" style="--c:${toneVar(tone)}"><div class="k"><ha-icon icon="${icon}"></ha-icon>${label}</div>
      <div class="n">${value}${unit ? `<small>${unit}</small>` : ""}</div>${detail ? `<div class="d ${detailCls}">${detail}</div>` : ""}</div>`;
  }

  _render() {
    if (!this._hass) return;
    const d = this._data;
    const P = this._period;
    let body;
    if (this._err) body = `<div class="err">Bericht nicht verfügbar: ${esc(this._err)}</div>`;
    else if (!d) body = `<div class="empty">Lade Bericht …</div>`;
    else body = this._body(d, P);
    const since = d && d.since ? new Date(d.since + "T00:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "long" }) : null;
    this.shadowRoot.innerHTML = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}${REPORT_STYLES}</style>
      <ha-card class="report" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:chart-box-outline"></ha-icon><div>${esc(this._config.title || "Heizbericht")}${since ? `<div class="rsub">Daten seit ${since}</div>` : ""}</div></div>
          <div class="segs"><button class="${P === "week" ? "on" : ""}" data-p="week">Diese Woche</button><button class="${P === "month" ? "on" : ""}" data-p="month">Dieser Monat</button></div></div>
        ${body}
      </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { this._period = b.dataset.p; this._render(); }));
  }

  _body(d, P) {
    const cur = d[P], prev = d[P === "week" ? "prev_week" : "prev_month"], change = d[P === "week" ? "week_change" : "month_change"];
    const t = cur.total;
    const vs = P === "week" ? "Vorwoche" : "Vormonat";
    if (!t.hours) {
      return `<div class="empty">Der Bericht sammelt ab jetzt jede Minute, was die Heizung tut. Nach ein paar Stunden stehen hier die ersten Werte, aussagekräftig wird es nach einer Woche.</div>`
        + `<div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>Gesundheit</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>`;
    }
    const diff = (a, b, unit, dec = 0) => {
      if (!prev.total.hours || a == null || b == null) return "";
      const x = a - b;
      return `${x > 0 ? "+" : x < 0 ? "−" : "±"}${fmt(Math.abs(x), dec)}${unit} ggü. ${vs}`;
    };
    const tiles = [
      this._tile("Heizstunden", "mdi:fire", "heat", fmt(t.heating_h, 0), " h", `Ventil voll offen ≈ ${fmt(t.valve_h, 1)} h`),
      this._tile("Wetterbereinigt", "mdi:scale-balance", change == null ? "off" : change <= 0 ? "ok" : "cold",
        change == null ? "–" : `${change > 0 ? "+" : change < 0 ? "−" : "±"}${Math.abs(change)}`, change == null ? "" : " %",
        change == null ? (cur.hdd < 5 ? "zu mild für einen Vergleich" : `noch keine ${vs}`) : `je Heizgradtag ggü. ${vs}`, change == null ? "" : change <= 0 ? "good" : "bad"),
      this._tile("Abgesenkt", "mdi:home-export-outline", "eco", fmt(t.setback_h, 0), " h", t.setback_h ? `im Schnitt −${fmt(t.setback_avg_k, 1)} °C` : "alle waren da"),
      this._tile("Gespart", "mdi:piggy-bank-outline", "ok", t.saving_pct ? "≈ " + fmt(t.saving_pct, 1) : "0", " %", "durch Absenkung (6 % je Grad)"),
      this._tile("Wohlfühlzeit", "mdi:emoticon-happy-outline", "ok", t.on_target_pct == null ? "–" : t.on_target_pct, t.on_target_pct == null ? "" : " %", "Raum ±1 °C am Ziel"),
      this._tile("Draußen", "mdi:thermometer", "air", cur.outdoor_avg == null ? "–" : fmt(cur.outdoor_avg, 1), cur.outdoor_avg == null ? "" : " °C", `${fmt(cur.hdd, 0)} Heizgradtage${diff(cur.hdd, prev.hdd, "", 0) ? " · " + diff(cur.hdd, prev.hdd, "", 0) : ""}`),
    ].join("");

    // Tage
    const n = P === "week" ? 14 : 31;
    const days = d.daily.slice(-n);
    const names = Object.keys(cur.rooms).sort((a, b) => a.localeCompare(b));
    const color = (nm, i) => this._roomColor(nm) || ROOM_COLORS[i % ROOM_COLORS.length];
    const maxV = Math.max(1, ...days.map((x) => Object.values(x.rooms).reduce((s, r) => s + r.valve_h, 0)));
    const maxH = Math.max(1, ...days.map((x) => x.hdd || 0));
    const today = d.daily[d.daily.length - 1].date;
    const wd = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const bars = days.map((x) => {
      const tot = Object.values(x.rooms).reduce((s, r) => s + r.valve_h, 0);
      const segs = names.map((nm, i) => { const v = (x.rooms[nm] || {}).valve_h || 0; return v ? `<i style="--c:${color(nm, i)};height:${(100 * v / tot).toFixed(1)}%"></i>` : ""; }).join("");
      const tip = `${x.date}: Ventil ≈ ${fmt(tot, 1)} h${x.outdoor != null ? ` · außen ${fmt(x.outdoor, 1)} °C` : ""}${x.hdd ? ` · ${fmt(x.hdd, 0)} HGT` : ""}`;
      return `<div class="day ${x.date === today ? "today" : ""}" title="${esc(tip)}"><div class="stk" style="height:${(100 * tot / maxV).toFixed(1)}%">${segs}</div>${x.hdd ? `<span class="hdd" style="bottom:${(100 * x.hdd / maxH).toFixed(1)}%"></span>` : ""}</div>`;
    }).join("");
    const labs = days.map((x, i) => { const dt = new Date(x.date + "T12:00:00"); const show = n <= 14 || i % 3 === 0 || x.date === today; return `<span>${show ? (n <= 14 ? wd[dt.getDay()] : dt.getDate() + ".") : ""}</span>`; }).join("");
    const legend = names.map((nm, i) => `<span><i style="--c:${color(nm, i)}"></i>${esc(nm)}</span>`).join("") + `<span><i class="dot" style="--c:var(--rk-air)"></i>Heizgradtage (Kälte draußen)</span>`;

    // Räume
    const maxRoom = Math.max(1, ...names.map((nm) => cur.rooms[nm].valve_h));
    const rrows = names.map((nm, i) => {
      const r = cur.rooms[nm];
      const facts = [
        `<span><b>${fmt(r.heating_h, 0)} h</b> geheizt</span>`,
        r.setback_h ? `<span><b>${fmt(r.setback_h, 0)} h</b> abgesenkt</span>` : "",
        r.temp_avg != null ? `<span>Ø <b>${fmt(r.temp_avg, 1)} °C</b></span>` : "",
        r.humidity_avg != null ? `<span>Ø <b>${r.humidity_avg} %</b> Feuchte</span>` : "",
        r.humid_h >= 1 ? `<span class="w">${fmt(r.humid_h, 0)} h zu feucht</span>` : "",
        r.mold_h >= 1 ? `<span class="w">${fmt(r.mold_h, 0)} h Schimmelrisiko</span>` : "",
        r.window_pause_h >= 0.5 ? `<span>${fmt(r.window_pause_h, 1)} h Fenster offen</span>` : "",
        r.night_h >= 0.5 ? `<span>${fmt(r.night_h, 0)} h Nachtlüften</span>` : "",
        r.arrivals_warm_pct != null ? `<span><b>${r.arrivals_warm_pct} %</b> warm bei Ankunft</span>` : "",
      ].join("");
      return `<div class="rrow" style="--c:${color(nm, i)}"><div class="nm"><i></i><span>${esc(nm)}</span></div>
        <div><div class="rbar" title="Ventil voll offen ≈ ${fmt(r.valve_h, 1)} h"><i style="width:${(100 * r.valve_h / maxRoom).toFixed(1)}%;background:var(--c)"></i></div><div class="facts">${facts}</div></div></div>`;
    }).join("");

    const arrivals = t.arrivals ? `Bei ${t.arrivals_warm_pct ?? "–"} % der Ankünfte war es schon warm${cur.preheats ? ` · ${cur.preheats}× vorgeheizt` : ""}` : "";
    return `<div class="tiles">${tiles}</div>
      ${d.issues && d.issues.length ? `<div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>Gesundheit</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>` : ""}
      <div class="rsec"><h3><ha-icon icon="mdi:calendar-month-outline"></ha-icon>Heizbedarf pro Tag</h3>
        <div class="days">${bars}</div><div class="daylab">${labs}</div><div class="lg">${legend}</div>
        <div class="hint">Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge). Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.</div></div>
      <div class="rsec"><h3><ha-icon icon="mdi:door"></ha-icon>Räume</h3><div class="rrows">${rrows}</div>
        ${arrivals ? `<div class="hint">${arrivals}.</div>` : ""}</div>
      <div class="hint">Die Ersparnis ist eine Abschätzung nach der Faustregel der Verbraucherzentrale (≈ 6 % weniger Heizenergie je Grad Absenkung). „Wetterbereinigt“ vergleicht den Heizbedarf je Heizgradtag – ein kalter Monat macht ihn also nicht schlechter.</div>`;
  }
}
