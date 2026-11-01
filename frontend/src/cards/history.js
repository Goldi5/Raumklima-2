import { HISTORY_STYLES, SEG, STYLES, fmt, loc, rkRooms, setLang, t, toneVar, rkPaint } from "../shared.js";


export class RaumklimaHistoryCard extends HTMLElement {
  // Neu zeichnen ohne Springen der Seite
  set _html(html) { rkPaint(this, html); }
  static getConfigForm() {
    return {
      schema: [
        { name: "mode", selector: { select: { options: [
          { value: "temperature", label: t("Raumtemperatur") },
          { value: "humidity", label: t("Luftfeuchte") },
          { value: "timeline", label: t("Heizung & Fenster (Zeitleiste)") },
        ] } } },
        { name: "title", selector: { text: {} } },
        { name: "hours", selector: { number: { min: 1, max: 168, step: 1 } } },
        { name: "strip_prefix", selector: { text: {} } },
        { name: "min_segment_seconds", selector: { number: { min: 0, max: 3600, step: 15, unit_of_measurement: "s" } } },
      ],
    };
  }
  static getStubConfig() { return { mode: "temperature", hours: 24 }; }
  setConfig(config) {
    this._config = { mode: "temperature", hours: 24, ...config };
    this._hours = this._config.hours;
    this._hidden = new Set();
    this._data = null;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  getCardSize() { return this._config.mode === "timeline" ? 4 : 6; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  connectedCallback() {
    this.style.display = "block";
    this._ro = new ResizeObserver(() => { const w = this.clientWidth; if (w && w !== this._lastW) { this._lastW = w; this._lastDraw = 0; this._draw(); } });
    this._ro.observe(this);
    this._poll = setInterval(() => this._load(), 5 * 60 * 1000);
  }
  disconnectedCallback() { this._ro && this._ro.disconnect(); clearInterval(this._poll); }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    setLang(hass);
    if (first || !this._rooms) this._rooms = rkRooms(hass, this._config.strip_prefix || "", this._config.home);
    if (first) this._load(); else this._draw(true);
  }

  _entities() {
    const m = this._config.mode;
    if (m === "temperature") return this._rooms.map((r) => r.attrs.temperature_sensor).filter(Boolean);
    if (m === "humidity") return this._rooms.map((r) => r.attrs.humidity_entity).filter(Boolean);
    return this._rooms.flatMap((r) => [r.sib.status, ...(r.attrs.window_entities || [])]).filter(Boolean);
  }

  async _load() {
    if (!this._hass || !this._rooms) return;
    const ids = this._entities();
    if (!ids.length) { this._data = {}; this._draw(); return; }
    const end = new Date();
    const start = new Date(end.getTime() - this._hours * 3600 * 1000);
    try {
      const res = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      this._data = res || {};
      this._range = [start.getTime(), end.getTime()];
    } catch (e) {
      this._data = {};
      this._error = String(e && e.message ? e.message : e);
    }
    this._draw();
  }

  _series(entityId) {
    const raw = (this._data && this._data[entityId]) || [];
    const pts = [];
    for (const p of raw) {
      const ts = (p.lu ?? p.lc ?? 0) * 1000;
      const v = parseFloat(p.s);
      if (!isNaN(v)) pts.push([Math.max(ts, this._range[0]), v]);
    }
    const now = this._hass.states[entityId];
    if (now && !isNaN(parseFloat(now.state))) pts.push([Date.now(), parseFloat(now.state)]);
    // auf 5-min-Raster mitteln, damit die Linie ruhig wird
    const step = this._hours > 48 ? 30 * 60e3 : this._hours > 12 ? 10 * 60e3 : 5 * 60e3;
    const out = [];
    let bucket = null, sum = 0, n = 0;
    for (const [ts, v] of pts) {
      const b = Math.floor(ts / step) * step;
      if (bucket !== null && b !== bucket) { out.push([bucket + step / 2, sum / n]); sum = 0; n = 0; }
      bucket = b; sum += v; n++;
    }
    if (n) out.push([bucket + step / 2, sum / n]);
    return out;
  }

  _smooth(pts) {
    if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const k = 0.18;
      d += ` C${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${p2[0] - (p3[0] - p1[0]) * k},${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  _fmtTime(ts) {
    const d = new Date(ts);
    return this._hours > 48
      ? d.toLocaleDateString(loc(), { weekday: "short", day: "numeric" })
      : d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" });
  }

  _shell(body) {
    const m = this._config.mode;
    const meta = { temperature: [t("Raumtemperatur"), "mdi:thermometer", "heat"], humidity: [t("Luftfeuchte"), "mdi:water-percent", "air"], timeline: [t("Heizung & Fenster"), "mdi:radiator", "ok"] }[m];
    const title = this._config.title || meta[0];
    const ranges = [[6, "6 h"], [24, "24 h"], [168, t("7 T")]];
    return `<style>${STYLES}${HISTORY_STYLES}</style>
      <ha-card style="--tone:${toneVar(meta[2])}">
        <div class="hhead">
          <div class="htitle"><ha-icon icon="${meta[1]}"></ha-icon>${title}</div>
          <div class="seg">${ranges.map(([h, l]) => `<button data-h="${h}" class="${this._hours === h ? "on" : ""}">${l}</button>`).join("")}</div>
        </div>
        ${body}
      </ha-card>`;
  }

  _bind() {
    this.shadowRoot.querySelectorAll("[data-h]").forEach((b) => b.addEventListener("click", () => { this._hours = parseInt(b.dataset.h, 10); this._data = null; this._draw(); this._load(); }));
    this.shadowRoot.querySelectorAll("[data-room]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.room;
      this._hidden.has(id) ? this._hidden.delete(id) : this._hidden.add(id);
      this._draw();
    }));
  }

  _draw(liveOnly) {
    if (!this._hass || !this._rooms) return;
    if (liveOnly && this._lastDraw && Date.now() - this._lastDraw < 30000) return; // Live-Updates drosseln
    this._lastDraw = Date.now();
    if (this._config.mode === "timeline") return this._drawTimeline();
    return this._drawLines();
  }

  _drawLines() {
    const m = this._config.mode;
    const key = m === "temperature" ? "temperature_sensor" : "humidity_entity";
    const unit = m === "temperature" ? "°" : " %";
    const rooms = this._rooms.filter((r) => r.attrs[key]);
    const legend = rooms.map((r) => {
      const st = this._hass.states[r.attrs[key]];
      const v = st ? parseFloat(st.state) : NaN;
      return `<button class="lchip ${this._hidden.has(r.id) ? "off" : ""}" data-room="${r.id}" style="--c:${r.color}"><i></i>${r.name}<b>${isNaN(v) ? "–" : fmt(v, m === "temperature" ? 1 : 0) + unit}</b></button>`;
    }).join("");
    if (!this._data) {
      this._html = this._shell(`<div class="legend">${legend}</div><div class="chart"><div class="empty">${t("Lade Verlauf …")}</div></div>`);
      return this._bind();
    }
    const cw = this.shadowRoot.querySelector(".chart");
    const W = Math.max(280, (cw && cw.clientWidth) || this.clientWidth - 48), H = 240, padL = 34, padR = 8, padT = 10, padB = 24;
    const series = rooms.filter((r) => !this._hidden.has(r.id)).map((r) => ({ r, pts: this._series(r.attrs[key]) })).filter((s) => s.pts.length);
    const all = series.flatMap((s) => s.pts.map((p) => p[1]));
    const band = m === "temperature" ? [19, 22] : [40, 60];
    let lo = Math.min(...all, band[0]), hi = Math.max(...all, band[1]);
    if (!isFinite(lo)) { lo = band[0]; hi = band[1]; }
    const stepY = m === "temperature" ? (hi - lo > 8 ? 2 : 1) : 10;
    lo = Math.floor((lo - 0.5) / stepY) * stepY; hi = Math.ceil((hi + 0.5) / stepY) * stepY;
    const [t0, t1] = this._range;
    const x = (ts) => padL + ((ts - t0) / (t1 - t0)) * (W - padL - padR);
    const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
    let grid = "";
    for (let v = lo; v <= hi + 1e-9; v += stepY) grid += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/><text class="ylab" x="${padL - 6}" y="${y(v) + 3.5}" text-anchor="end">${fmt(v, 0)}${unit.trim() === "%" ? "" : "°"}</text>`;
    const ticks = this._hours > 48 ? 7 : W < 520 ? 3 : this._hours > 12 ? 4 : 6;
    let xl = "";
    for (let i = 0; i <= ticks; i++) { const ts = t0 + ((t1 - t0) * i) / ticks; xl += `<text class="xlab" x="${x(ts)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === ticks ? "end" : "middle"}">${i === ticks ? t("jetzt") : this._fmtTime(ts)}</text>`; }
    const defs = series.map((s, i) => `<linearGradient id="g${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${s.r.color}" stop-opacity=".22"/><stop offset="100%" stop-color="${s.r.color}" stop-opacity="0"/></linearGradient>`).join("");
    const paths = series.map((s, i) => {
      const pts = s.pts.map(([ts, v]) => [x(ts), y(v)]);
      const d = this._smooth(pts);
      const area = series.length <= 2 ? `<path d="${d} L${pts[pts.length - 1][0]},${H - padB} L${pts[0][0]},${H - padB} Z" fill="url(#g${i})"/>` : "";
      return `${area}<path class="line" d="${d}" stroke="${s.r.color}"/><circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="3.5" fill="${s.r.color}"/>`;
    }).join("");
    const bandSvg = `<rect class="band" x="${padL}" width="${W - padL - padR}" y="${y(band[1])}" height="${y(band[0]) - y(band[1])}" rx="6"/><text class="bandlab" x="${W - padR - 6}" y="${y(band[1]) + 13}" text-anchor="end">${t("Wohlfühlbereich")}</text>`;
    const body = series.length
      ? `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${bandSvg}<g class="grid">${grid}</g>${xl}${paths}<line class="hover-line" x1="0" x2="0" y1="${padT}" y2="${H - padB}" style="display:none"/></svg><div class="tip" style="display:none"></div>`
      : `<div class="empty">${this._error ? t("Verlauf nicht verfügbar: {e}", { e: this._error }) : t("Keine Daten im Zeitraum")}</div>`;
    this._html = this._shell(`<div class="legend">${legend}</div><div class="chart" style="--h:${H}px">${body}</div>`);
    this._bind();
    const chart = this.shadowRoot.querySelector(".chart");
    const svg = chart.querySelector("svg");
    if (!svg) return;
    const hl = svg.querySelector(".hover-line"), tip = chart.querySelector(".tip");
    const near = (pts, ts) => { let best = null; for (const p of pts) if (!best || Math.abs(p[0] - ts) < Math.abs(best[0] - ts)) best = p; return best; };
    chart.addEventListener("mousemove", (ev) => {
      const rect = svg.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * W;
      if (px < padL || px > W - padR) { hl.style.display = "none"; tip.style.display = "none"; return; }
      const ts = t0 + ((px - padL) / (W - padL - padR)) * (t1 - t0);
      hl.setAttribute("x1", px); hl.setAttribute("x2", px); hl.style.display = "";
      const rows = series.map((s) => { const p = near(s.pts, ts); return `<div class="r" style="--c:${s.r.color}"><span><i></i>${s.r.name}</span><b>${fmt(p[1], m === "temperature" ? 1 : 0)}${unit}</b></div>`; }).join("");
      tip.innerHTML = `<div class="t">${new Date(ts).toLocaleString(loc(), { weekday: "short", hour: "2-digit", minute: "2-digit" })}</div>${rows}`;
      tip.style.display = "";
      const left = ev.clientX - chart.getBoundingClientRect().left;
      tip.style.left = `${left > chart.clientWidth / 2 ? left - tip.offsetWidth - 14 : left + 14}px`;
    });
    chart.addEventListener("mouseleave", () => { hl.style.display = "none"; tip.style.display = "none"; });
  }

  _drawTimeline() {
    if (!this._data) {
      this._html = this._shell(`<div class="empty">${t("Lade Verlauf …")}</div>`);
      return this._bind();
    }
    const [t0, t1] = this._range;
    const pct = (ts) => ((Math.max(t0, Math.min(t1, ts)) - t0) / (t1 - t0)) * 100;
    // Ruhige Zeitleiste: pro Abschnitt den überwiegenden Zustand zeigen.
    // Abschnitt = mind. 2 min (einstellbar), bei langen Zeiträumen automatisch größer.
    const bucket = Math.max((this._config.min_segment_seconds ?? 120) * 1000, (t1 - t0) / 200);
    const spans = (id, map, merge) => {
      const raw = (this._data[id] || []).map((p) => [(p.lu ?? p.lc ?? 0) * 1000, p.s]);
      const now = this._hass.states[id];
      if (now) raw.push([Date.now(), now.state]);
      let out = [];
      for (let i = 0; i < raw.length; i++) {
        const [ts, s] = raw[i];
        const end = i + 1 < raw.length ? raw[i + 1][0] : t1;
        if (end > t0) out.push([Math.max(ts, t0), end, s]);
      }
      if (merge && out.length) {
        const m = [];
        const start = out[0][0];
        let k = 0;
        for (let bs = start; bs < t1; bs += bucket) {
          const be = Math.min(bs + bucket, t1);
          const tally = {};
          while (k < out.length && out[k][1] <= bs) k++;
          for (let j = k; j < out.length && out[j][0] < be; j++) {
            const ov = Math.min(be, out[j][1]) - Math.max(bs, out[j][0]);
            if (ov > 0) tally[out[j][2]] = (tally[out[j][2]] || 0) + ov;
          }
          const st = Object.keys(tally).sort((x, y) => tally[y] - tally[x])[0];
          if (!st) continue;
          const last = m[m.length - 1];
          if (last && last[2] === st && last[1] >= bs - 1) last[1] = be;
          else m.push([bs, be, st]);
        }
        out = m;
      }
      return out.map(([a, b, s]) => map(a, b, s)).join("");
    };
    const rows = this._rooms.map((r) => {
      const status = r.sib.status ? spans(r.sib.status, (a, b, s) => {
        const seg = SEG[s];
        return seg ? `<i style="left:${pct(a)}%;width:${Math.max(0.3, pct(b) - pct(a))}%;background:${seg.c}" title="${seg.l}"></i>` : "";
      }, true) : "";
      const wins = (r.attrs.window_entities || []).map((w) => spans(w, (a, b, s) => (s === "on" ? `<em style="left:${pct(a)}%;width:${Math.max(0.4, pct(b) - pct(a))}%" title="${t("Fenster offen")}"></em>` : ""))).join("");
      return `<div class="n">${r.name}</div><div class="bar">${status}${wins}</div>`;
    }).join("");
    const ticks = this._hours > 48 ? 7 : 6;
    const xl = Array.from({ length: ticks + 1 }, (_, i) => `<span>${i === ticks ? t("jetzt") : this._fmtTime(t0 + ((t1 - t0) * i) / ticks)}</span>`).join("");
    const leg = ["heating", "idle", "setback", "window_open", "night_airing", "off", "season_off"].map((k) => `<span><i style="--c:${SEG[k].c}"></i>${SEG[k].l}</span>`).join("")
      + `<span><i style="--c:transparent;outline:2px solid var(--rk-air);background:repeating-linear-gradient(45deg, color-mix(in srgb, var(--rk-air) 30%, transparent) 0 3px, transparent 3px 6px)"></i>${t("Fensterkontakt offen")}</span>`;
    this._html = this._shell(`<div class="tl">${rows}</div><div class="tlx">${xl}</div><div class="tleg">${leg}</div>`);
    this._bind();
  }
}
