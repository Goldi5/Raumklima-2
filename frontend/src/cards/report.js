import { HISTORY_STYLES, ISSUE_STYLES, REPORT_STYLES, ROOM_COLORS, SETTINGS_STYLES, STYLES, esc, fmt, loc, rkIssueList, rkRooms, setLang, t, toneVar } from "../shared.js";


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
    setLang(hass);
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
      this._pdfs = (await this._hass.callWS({ type: "raumklima/report/pdf/list", ...(this._config.home ? { home: this._config.home } : {}) })).reports;
    } catch (e) {
      this._err = e.message || String(e);
    }
    this._render();
  }

  _tile(label, icon, tone, value, unit, detail, detailCls = "") {
    return `<div class="tile" style="--c:${toneVar(tone)}"><div class="k"><ha-icon icon="${icon}"></ha-icon>${t(label)}</div>
      <div class="n">${value}${unit ? `<small>${unit}</small>` : ""}</div>${detail ? `<div class="d ${detailCls}">${detail}</div>` : ""}</div>`;
  }

  _render() {
    if (!this._hass) return;
    const d = this._data;
    const P = this._period;
    let body;
    if (this._err) body = `<div class="err">${t("Bericht nicht verfügbar: {e}", { e: esc(this._err) })}</div>`;
    else if (!d) body = `<div class="empty">${t("Lade Bericht …")}</div>`;
    else body = this._body(d, P);
    const since = d && d.since ? new Date(d.since + "T00:00:00").toLocaleDateString(loc(), { day: "numeric", month: "long" }) : null;
    this.shadowRoot.innerHTML = `<style>${STYLES}${HISTORY_STYLES}${SETTINGS_STYLES}${ISSUE_STYLES}${REPORT_STYLES}</style>
      <ha-card class="report" style="--tone:${toneVar("off")}">
        <div class="hhead"><div class="htitle"><ha-icon icon="mdi:chart-box-outline"></ha-icon><div>${esc(this._config.title || t("Heizbericht"))}${since ? `<div class="rsub">${t("Daten seit {d}", { d: since })}</div>` : ""}</div></div>
          <div class="segs"><button class="${P === "week" ? "on" : ""}" data-p="week">${t("Diese Woche")}</button><button class="${P === "month" ? "on" : ""}" data-p="month">${t("Dieser Monat")}</button></div>
          <button class="btn" data-csv title="${t("Tageswerte je Raum als Tabelle (CSV)")}"><ha-icon icon="mdi:file-delimited-outline"></ha-icon>CSV</button></div>
        ${body}
        ${this._pdfSection()}
      </ha-card>`;
    this.shadowRoot.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { this._period = b.dataset.p; this._render(); }));
    this.shadowRoot.querySelectorAll("[data-csv]").forEach((b) => b.addEventListener("click", () => this._csv()));
    this.shadowRoot.querySelectorAll("[data-mkpdf]").forEach((b) => b.addEventListener("click", () => this._makePdf(b.dataset.mkpdf)));
    this.shadowRoot.querySelectorAll("[data-pdf]").forEach((b) => b.addEventListener("click", () => this._download(b.dataset.pdf, b.dataset.file)));
  }

  _pdfSection() {
    const kinds = { week: t("Woche"), month: t("Monat"), season: t("Heizsaison") };
    const list = (this._pdfs || []).slice(0, 8);
    const day = (s) => new Date(s + "T00:00:00").toLocaleDateString(loc(), { day: "2-digit", month: "2-digit", year: "numeric" });
    const rows = list.map((r) => `<div class="pdfrow"><ha-icon icon="mdi:file-pdf-box"></ha-icon>
        <div class="pdfi"><b>${kinds[r.kind] || r.kind}${r.current ? ` <span class="no">${t("bis heute")}</span>` : ""}</b><small>${day(r.start)} – ${day(r.end)} · ${Math.max(1, Math.round(r.size / 1024))} KB</small></div>
        <button class="btn" data-pdf="${esc(r.url)}" data-file="${esc(r.file)}"><ha-icon icon="mdi:download"></ha-icon>${t("Herunterladen")}</button></div>`).join("");
    return `<div class="rsec"><h3><ha-icon icon="mdi:file-pdf-box"></ha-icon>${t("PDF-Berichte")}</h3>
      <div class="pdfmk">${Object.entries(kinds).map(([k, l]) => `<button class="btn" data-mkpdf="${k}" ${this._busy ? "disabled" : ""}><ha-icon icon="${this._busy === k ? "mdi:loading" : "mdi:plus"}"></ha-icon>${l}</button>`).join("")}</div>
      ${rows ? `<div class="pdflist">${rows}</div>` : `<div class="hint">${t("Noch keine PDF-Berichte. Sie entstehen automatisch: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach dem Saisonende – oder jetzt mit den Knöpfen oben (bis heute).")}</div>`}
      ${this._pdfMsg ? `<div class="hint">${esc(this._pdfMsg)}</div>` : ""}</div>`;
  }

  async _makePdf(kind) {
    this._busy = kind; this._pdfMsg = null; this._render();
    try {
      const r = await this._hass.callWS({ type: "raumklima/report/pdf/create", kind, ...(this._config.home ? { home: this._config.home } : {}) });
      this._busy = null;
      await this._load();
      await this._download(r.url, r.file);
    } catch (e) {
      this._busy = null;
      this._pdfMsg = t("PDF konnte nicht erstellt werden: {e}", { e: e.message || e });
      this._render();
    }
  }

  async _download(url, file) {
    try {
      // wie Home Assistant selbst (z. B. Backups): kurz gültiger, signierter Link
      const s = await this._hass.callWS({ type: "auth/sign_path", path: url, expires: 120 });
      const a = document.createElement("a");
      a.href = s.path; a.download = file || ""; a.target = "_blank"; a.style.display = "none";
      document.body.appendChild(a); a.dispatchEvent(new MouseEvent("click")); a.remove();
    } catch (e) {
      this._pdfMsg = t("Download fehlgeschlagen: {e}", { e: e.message || e });
      this._render();
    }
  }

  async _csv() {
    try {
      const r = await this._hass.callWS({ type: "raumklima/report/export", ...(this._config.home ? { home: this._config.home } : {}) });
      // BOM, damit Excel Umlaute richtig erkennt
      const url = URL.createObjectURL(new Blob(["\ufeff" + r.csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = r.filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert(t("Export fehlgeschlagen: {e}", { e: e.message || e }));
    }
  }

  _body(d, P) {
    const cur = d[P], prev = d[P === "week" ? "prev_week" : "prev_month"], change = d[P === "week" ? "week_change" : "month_change"];
    const T = cur.total;
    const vs = P === "week" ? t("Vorwoche") : t("Vormonat");
    if (!T.hours) {
      return `<div class="empty">${t("Der Bericht sammelt ab jetzt jede Minute, was die Heizung tut. Nach ein paar Stunden stehen hier die ersten Werte, aussagekräftig wird es nach einer Woche.")}</div>`
        + `<div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>${t("Gesundheit")}</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>`;
    }
    const diff = (a, b, unit, dec = 0) => {
      if (!prev.total.hours || a == null || b == null) return "";
      const x = a - b;
      return t("{d} ggü. {vs}", { d: `${x > 0 ? "+" : x < 0 ? "−" : "±"}${fmt(Math.abs(x), dec)}${unit}`, vs });
    };
    const tiles = [
      this._tile("Heizstunden", "mdi:fire", "heat", fmt(T.heating_h, 0), " h", t("Ventil voll offen ≈ {v} h", { v: fmt(T.valve_h, 1) })),
      this._tile("Wetterbereinigt", "mdi:scale-balance", change == null ? "off" : change <= 0 ? "ok" : "cold",
        change == null ? "–" : `${change > 0 ? "+" : change < 0 ? "−" : "±"}${Math.abs(change)}`, change == null ? "" : " %",
        change == null ? (cur.hdd < 5 ? t("zu mild für einen Vergleich") : t("noch keine {vs}", { vs })) : t("je Heizgradtag ggü. {vs}", { vs }), change == null ? "" : change <= 0 ? "good" : "bad"),
      this._tile("Abgesenkt", "mdi:home-export-outline", "eco", fmt(T.setback_h, 0), " h", T.setback_h ? t("im Schnitt −{v} °C", { v: fmt(T.setback_avg_k, 1) }) : t("alle waren da")),
      this._tile("Gespart", "mdi:piggy-bank-outline", "ok", T.saving_pct ? "≈ " + fmt(T.saving_pct, 1) : "0", " %", t("durch Absenkung (6 % je Grad)")),
      this._tile("Wohlfühlzeit", "mdi:emoticon-happy-outline", "ok", T.on_target_pct == null ? "–" : T.on_target_pct, T.on_target_pct == null ? "" : " %", t("Raum ±1 °C am Ziel")),
      this._tile("Draußen", "mdi:thermometer", "air", cur.outdoor_avg == null ? "–" : fmt(cur.outdoor_avg, 1), cur.outdoor_avg == null ? "" : " °C", t("{n} Heizgradtage", { n: fmt(cur.hdd, 0) }) + (diff(cur.hdd, prev.hdd, "", 0) ? " · " + diff(cur.hdd, prev.hdd, "", 0) : "")),
    ].join("");

    // Tage
    const n = P === "week" ? 14 : 31;
    const days = d.daily.slice(-n);
    const names = Object.keys(cur.rooms).sort((a, b) => a.localeCompare(b));
    const color = (nm, i) => this._roomColor(nm) || ROOM_COLORS[i % ROOM_COLORS.length];
    const maxV = Math.max(1, ...days.map((x) => Object.values(x.rooms).reduce((s, r) => s + r.valve_h, 0)));
    const maxH = Math.max(1, ...days.map((x) => x.hdd || 0));
    const today = d.daily[d.daily.length - 1].date;
    const wd = t("So,Mo,Di,Mi,Do,Fr,Sa").split(",");
    const bars = days.map((x) => {
      const tot = Object.values(x.rooms).reduce((s, r) => s + r.valve_h, 0);
      const segs = names.map((nm, i) => { const v = (x.rooms[nm] || {}).valve_h || 0; return v ? `<i style="--c:${color(nm, i)};height:${(100 * v / tot).toFixed(1)}%"></i>` : ""; }).join("");
      const tip = `${x.date}: ${t("Ventil ≈ {v} h", { v: fmt(tot, 1) })}${x.outdoor != null ? ` · ${t("außen {v} °C", { v: fmt(x.outdoor, 1) })}` : ""}${x.hdd ? ` · ${fmt(x.hdd, 0)} ${t("HGT")}` : ""}`;
      return `<div class="day ${x.date === today ? "today" : ""}" title="${esc(tip)}"><div class="stk" style="height:${(100 * tot / maxV).toFixed(1)}%">${segs}</div>${x.hdd ? `<span class="hdd" style="bottom:${(100 * x.hdd / maxH).toFixed(1)}%"></span>` : ""}</div>`;
    }).join("");
    const labs = days.map((x, i) => { const dt = new Date(x.date + "T12:00:00"); const show = n <= 14 || i % 3 === 0 || x.date === today; return `<span>${show ? (n <= 14 ? wd[dt.getDay()] : dt.getDate() + ".") : ""}</span>`; }).join("");
    const legend = names.map((nm, i) => `<span><i style="--c:${color(nm, i)}"></i>${esc(nm)}</span>`).join("") + `<span><i class="dot" style="--c:var(--rk-air)"></i>${t("Heizgradtage (Kälte draußen)")}</span>`;

    // Räume
    const maxRoom = Math.max(1, ...names.map((nm) => cur.rooms[nm].valve_h));
    const rrows = names.map((nm, i) => {
      const r = cur.rooms[nm];
      const facts = [
        `<span>${t("<b>{v} h</b> geheizt", { v: fmt(r.heating_h, 0) })}</span>`,
        r.setback_h ? `<span>${t("<b>{v} h</b> abgesenkt", { v: fmt(r.setback_h, 0) })}</span>` : "",
        r.temp_avg != null ? `<span>Ø <b>${fmt(r.temp_avg, 1)} °C</b></span>` : "",
        r.humidity_avg != null ? `<span>${t("Ø <b>{v} %</b> Feuchte", { v: r.humidity_avg })}</span>` : "",
        r.humid_h >= 1 ? `<span class="w">${t("{v} h zu feucht", { v: fmt(r.humid_h, 0) })}</span>` : "",
        r.mold_h >= 1 ? `<span class="w">${t("{v} h Schimmelrisiko", { v: fmt(r.mold_h, 0) })}</span>` : "",
        r.window_pause_h >= 0.5 ? `<span>${t("{v} h Fenster offen", { v: fmt(r.window_pause_h, 1) })}</span>` : "",
        r.night_h >= 0.5 ? `<span>${t("{v} h Nachtlüften", { v: fmt(r.night_h, 0) })}</span>` : "",
        r.arrivals_warm_pct != null ? `<span>${t("<b>{v} %</b> warm bei Ankunft", { v: r.arrivals_warm_pct })}</span>` : "",
      ].join("");
      return `<div class="rrow" style="--c:${color(nm, i)}"><div class="nm"><i></i><span>${esc(nm)}</span></div>
        <div><div class="rbar" title="${t("Ventil voll offen ≈ {v} h", { v: fmt(r.valve_h, 1) })}"><i style="width:${(100 * r.valve_h / maxRoom).toFixed(1)}%;background:var(--c)"></i></div><div class="facts">${facts}</div></div></div>`;
    }).join("");

    const arrivals = T.arrivals ? t("Bei {p} % der Ankünfte war es schon warm", { p: T.arrivals_warm_pct ?? "–" }) + (cur.preheats ? " · " + t("{n}× vorgeheizt", { n: cur.preheats }) : "") : "";
    return `<div class="tiles">${tiles}</div>
      ${d.issues && d.issues.length ? `<div class="rsec"><h3><ha-icon icon="mdi:heart-pulse"></ha-icon>${t("Gesundheit")}</h3>${rkIssueList(d.issues, true, this._config.strip_prefix)}</div>` : ""}
      <div class="rsec"><h3><ha-icon icon="mdi:calendar-month-outline"></ha-icon>${t("Heizbedarf pro Tag")}</h3>
        <div class="days">${bars}</div><div class="daylab">${labs}</div><div class="lg">${legend}</div>
        <div class="hint">${t("Balken = wie lange die Ventile umgerechnet voll offen waren (Maß für die Wärmemenge). Punkte = Heizgradtage: je kälter es draußen war, desto höher. Hohe Balken an milden Tagen sind ein Hinweis auf offene Fenster oder zu hohe Wunschtemperaturen.")}</div></div>
      <div class="rsec"><h3><ha-icon icon="mdi:door"></ha-icon>${t("Räume")}</h3><div class="rrows">${rrows}</div>
        ${arrivals ? `<div class="hint">${arrivals}.</div>` : ""}</div>
      <div class="hint">${t("Die Ersparnis ist eine Abschätzung nach der Faustregel der Verbraucherzentrale (≈ 6 % weniger Heizenergie je Grad Absenkung). „Wetterbereinigt“ vergleicht den Heizbedarf je Heizgradtag – ein kalter Monat macht ihn also nicht schlechter.")}</div>`;
  }
}
