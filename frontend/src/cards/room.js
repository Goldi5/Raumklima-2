import { rkLookStyles, STATUS, STYLES, VENT, rkLook, esc, fmt, humTone, loc, planText, rkClock, rkDuration, rkOpenSince, setLang, t, toneVar, rkPaint, rkChanged, rkScrolling, rkLater } from "../shared.js";

export class RaumklimaCard extends HTMLElement {
  // Neu zeichnen ohne Springen der Seite
  set _html(html) { rkPaint(this, html); }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "climate", integration: "raumklima" } } },
        { name: "name", selector: { text: {} } },
      ],
      computeLabel: (s) => ({ entity: t("Raum (Raumklima-Thermostat)"), name: t("Anzeigename (optional)") }[s.name]),
    };
  }

  static getStubConfig(hass) {
    const e = Object.values(hass.entities || {}).find((x) => x.platform === "raumklima" && x.entity_id.startsWith("climate."));
    return { entity: e ? e.entity_id : "" };
  }

  setConfig(config) {
    if (!config.entity) throw new Error(t("Bitte ein Raumklima-Thermostat (entity) angeben"));
    this._config = config;
    this._pending = null;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this._timer = setInterval(() => this._tick(), 1000); }
  disconnectedCallback() { clearInterval(this._timer); }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 6, min_columns: 4, rows: "auto" }; }

  set hass(hass) {
    this._hass = hass;
    setLang(hass);
    // nur neu zeichnen, wenn sich an diesem Raum etwas geändert hat – nicht bei jeder Lampe im Haus
    const st = hass.states[this._config.entity];
    const ids = [this._config.entity, ...Object.values(this._siblings()), ...((st && st.attributes.window_entities) || [])];
    if (!rkChanged(this, hass, ids) && this.shadowRoot && this.shadowRoot.firstChild) return;
    if (rkScrolling()) { rkLater(this, () => this._render()); return; }
    this._render();
  }

  _siblings() {
    const reg = this._hass.entities || {};
    const me = reg[this._config.entity];
    const out = {};
    if (!me || !me.device_id) return out;
    for (const e of Object.values(reg)) {
      if (e.device_id === me.device_id && e.platform === "raumklima" && e.translation_key) out[e.translation_key] = e.entity_id;
    }
    return out;
  }

  _call(domain, service, data) { return this._hass.callService(domain, service, data); }

  _step(delta) {
    const st = this._hass.states[this._config.entity];
    if (!st) return;
    const a = st.attributes;
    const mon = a.monitor === true;
    const base = this._pending ?? a.wish ?? a.temperature ?? 20;
    const next = Math.min(a.max_temp ?? 30, Math.max(a.min_temp ?? 5, Math.round((base + delta) * 2) / 2));
    this._pending = next;
    this._render();
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => {
      this._call("climate", "set_temperature", { entity_id: this._config.entity, temperature: next });
      setTimeout(() => { this._pending = null; }, 1500);
    }, 700);
  }

  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  _tick() {
    const bl = this.shadowRoot && this.shadowRoot.querySelector("[data-boostleft]");
    if (bl && this._boostUntil) {
      const m = Math.max(0, Math.round((this._boostUntil - Date.now()) / 60000));
      bl.textContent = t("noch {m} min", { m });
    }
    const since = this.shadowRoot && this.shadowRoot.querySelector("[data-since]");
    if (since && this._winSince) since.textContent = t("Fenster offen seit {c} · {d}", { c: rkClock(this._winSince), d: rkDuration(Date.now() - this._winSince) });
    const empty = this.shadowRoot && this.shadowRoot.querySelector("[data-empty]");
    if (empty && this._emptySince) empty.textContent = t(this._roomEco ? "Raum leer seit {d} – abgesenkt" : "Raum leer seit {d}", { d: rkDuration(Date.now() - this._emptySince) });
    const el = this.shadowRoot && this.shadowRoot.querySelector("[data-count]");
    if (!el || !this._openSince) return;
    const total = this._recMin * 60;
    const passed = (Date.now() - this._openSince) / 1000;
    const left = Math.max(0, total - passed);
    el.textContent = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, "0")}`;
    const bar = this.shadowRoot.querySelector("[data-bar]");
    if (bar) bar.style.width = `${Math.min(100, (passed / total) * 100)}%`;
  }

  _arc(cur, target, off) {
    // Skala 14–26 °C, bei Bedarf erweitert, damit Ist und Ziel sichtbar sind
    const vals = [cur, target].filter((v) => v !== null && v !== undefined);
    const min = Math.min(14, ...vals.map((v) => Math.floor(v - 1)));
    const max = Math.max(26, ...vals.map((v) => Math.ceil(v + 1)));
    const R = 100, cx = 120, cy = 112, start = 135, sweep = 270;
    const pos = (v) => start + (Math.min(max, Math.max(min, v)) - min) / (max - min) * sweep;
    const pt = (deg, r = R) => { const a = (deg * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    const path = (a, b) => { const [x1, y1] = pt(a), [x2, y2] = pt(b); return `M ${x1} ${y1} A ${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${x2} ${y2}`; };
    const c = cur === null || cur === undefined ? start : pos(cur);
    let knob = "";
    if (!off && target !== null && target !== undefined) {
      const tp = pos(target);
      const [kx, ky] = pt(tp);
      knob = `<circle class="knob" cx="${kx}" cy="${ky}" r="11"/><circle cx="${kx}" cy="${ky}" r="4.5" fill="var(--tone)"/>`;
    }
    const [ax, ay] = pt(start, R + 18), [bx, by] = pt(start + sweep, R + 18);
    return `<svg viewBox="0 0 240 200" aria-hidden="true">
      <path class="track" d="${path(start, start + sweep)}" stroke-width="14" fill="none" stroke-linecap="round"/>
      ${cur === null || cur === undefined ? "" : `<path class="fill ${off ? "muted" : ""}" d="${path(start, Math.max(start + 0.5, c))}" stroke-width="14" fill="none" stroke-linecap="round"/>`}
      ${knob}
      <text x="${ax}" y="${ay}" text-anchor="middle" class="scale">${min}°</text>
      <text x="${bx}" y="${by}" text-anchor="middle" class="scale">${max}°</text>
    </svg>`;
  }

  _render() {
    try {
      this._renderInner();
    } catch (e) {
      // Lieber eine sichtbare Fehlerkarte als eine Karte, die einfach verschwindet.
      console.error("raumklima-card:", e);
      this._html = `<style>${STYLES}</style><ha-card class="rcard"><div class="err">${esc(t("Karte konnte nicht gezeichnet werden"))}: ${esc(String(e && e.message || e))}</div></ha-card>`;
    }
  }

  _renderInner() {
    if (!this._hass || !this._config) return;
    const st = this._hass.states[this._config.entity];
    if (!st) {
      this._html = `<style>${STYLES}</style><ha-card class="rcard"><div class="err">${t("Entität {e} nicht gefunden", { e: this._config.entity })}</div></ha-card>`;
      return;
    }
    const a = st.attributes;
    const sib = this._siblings();
    const mon = a.monitor === true;
    const status = mon ? { label: t("Überwachung"), icon: "mdi:eye-outline", tone: "eco" } : (STATUS[a.status] || STATUS.idle);
    let vent = VENT[a.ventilation] || null;
    // Bei Dauerlüftung / gewohntem Lüften nicht „bitte schließen" anzeigen – es wird nicht gemahnt.
    if (vent && a.ventilation === "please_close" && a.airing_phase) {
      const phases = {
        long: { label: t("Dauerlüftung – ich erinnere nicht"), icon: "mdi:weather-windy", tone: "air" },
        learned: { label: t("Gewohntes Lüften – keine Erinnerung"), icon: "mdi:history", tone: "air" },
        planned: { label: t("Geplantes Lüften – keine Erinnerung"), icon: "mdi:calendar-clock", tone: "air" },
      };
      vent = phases[a.airing_phase] || vent;
    }
    const target = this._pending ?? a.temperature;
    const isOff = st.state === "off";
    const name = this._config.name || a.friendly_name || t("Raum");
    const accent = this._config.accent || null;
    const winOpen = a.window_open;
    this._openSince = a.window_open_since ? Date.parse(a.window_open_since) : null;
    this._boostUntil = a.boost_until ? Date.parse(a.boost_until) : null;
    this._winSince = rkOpenSince(this._hass, a);
    this._emptySince = a.occupied === false && a.empty_since ? Date.parse(a.empty_since) : null;
    this._roomEco = !!a.room_eco;
    this._recMin = a.recommended_minutes || 5;

    let banner = "";
    if (vent && a.ventilation !== "ok" && !a.night_airing) {
      const showBar = winOpen && this._openSince && ["airing", "please_close", "done"].includes(a.ventilation);
      const extra = a.ventilation === "please_open"
        ? `<span>${a.ventilation_reason === "co2" ? t("{c} ppm · ca. {m} min", { c: fmt(a.co2, 0), m: this._recMin }) : t("{h} % · ca. {m} min", { h: fmt(a.current_humidity, 0), m: this._recMin })}</span>`
        : showBar ? `<span class="count" data-count>–</span>` : "";
      banner = `<div class="banner" style="--vt:${toneVar(vent.tone)}">
          <ha-icon icon="${vent.icon}"></ha-icon><span class="grow">${vent.label}${showBar ? ` · ${this._recMin} min` : ""}</span>${extra}
        </div>${showBar ? `<div class="bar" style="--vt:${toneVar(vent.tone)}"><i data-bar style="width:0%"></i></div>` : ""}`;
    }

    const stat = (icon, label, value, tone, entity) =>
      `<div class="stat" ${entity ? `data-more="${entity}" style="cursor:pointer"` : ""}><div class="l"><ha-icon icon="${icon}"></ha-icon>${label}</div>
        <div class="v ${tone ? "tone" : ""}" style="${tone ? `--st:${toneVar(tone)}` : ""}">${value}</div></div>`;

    // Messwert-Kacheln öffnen den Verlauf der jeweiligen Sensor-Entität
    const cfgS = a.settings || {};
    // Ventilfarbe nach dem tatsächlichen Heizzustand, nicht nach dem Prozentwert: viele Geräte
    // (Bosch SHc, Livisi, Homematic) lassen das Ventil im Leerlauf 2–6 % offen – das ist
    // Ventilschutz und kein Heizen. Ohne hvac_action bleibt es beim alten Verhalten.
    const valveTone = a.hvac_action
      ? (a.hvac_action === "heating" ? "heat" : null)
      : (a.valve_position > 0 ? "heat" : null);
    const stats = [
      a.humidity_sensor ? stat("mdi:water-percent", t("Feuchte"), `${fmt(a.current_humidity, 0)} %`, humTone(a.current_humidity), cfgS.humidity_sensor || a.humidity_entity) : "",
      a.co2 != null ? stat("mdi:molecule-co2", "CO₂", `${fmt(a.co2, 0)}<small>ppm</small>`, a.co2 >= 1400 ? "cold" : a.co2 >= 1000 ? "warn" : "ok", cfgS.co2_sensor) : "",
      a.pm25 != null ? stat("mdi:molecule", t("Feinstaub"), `${fmt(a.pm25, 0)}<small>µg/m³</small>`, a.pm25 >= 50 ? "cold" : a.pm25 >= 35 ? "warn" : "ok", cfgS.pm25_sensor) : "",
      a.dew_point !== undefined && a.dew_point !== null ? stat("mdi:water-thermometer", t("Taupunkt"), `${fmt(a.dew_point)}°`, null, sib.dew_point) : "",
      a.valve_sensor === undefined || a.valve_sensor
        ? stat("mdi:valve", (a.valve_sources || 0) > 1 ? t("Ventil Ø") : t("Ventil"), a.valve_position === null || a.valve_position === undefined ? "–" : `${fmt(a.valve_position, 0)} %`, valveTone, a.valve_sensor)
        : "",
      a.outdoor_temperature !== undefined && a.outdoor_temperature !== null
        ? stat("mdi:weather-partly-cloudy", t("Außen"), `${fmt(a.outdoor_temperature)}°<small>${fmt(a.outdoor_humidity, 0)} %</small>`, null, cfgS.weather_entity) : "",
      mon ? "" : stat("mdi:radiator", t("Heizkörper"), `${fmt(a.trv_temperature)}°`, null, cfgS.trv),
      // „Offset" gibt es nur, wenn das Gerät eine Offset-Entität hat. Sonst regelt
      // Raumklima über den Sollwert – dann zeigen wir die Abweichung Fühler↔Thermostat.
      (() => {
        if (a.offset !== undefined && a.offset !== null) {
          return stat("mdi:tune-variant", t("Offset"), `${a.offset > 0 ? "+" : ""}${fmt(a.offset)}°`, null, sib.offset);
        }
        // Gelernte Abweichung (wird dauerhaft auf den Sollwert gerechnet) hat Vorrang.
        if (a.calibration_mode === "target" && a.offset_auto != null && Math.abs(a.offset_auto) >= 0.1) {
          return stat("mdi:tune-variant", t("Abgleich"), `${a.offset_auto > 0 ? "+" : ""}${fmt(a.offset_auto)}°`, Math.abs(a.offset_auto) >= 1 ? "warn" : null, null);
        }
        if (a.calibration_mode === "target" && a.current_temperature != null && a.trv_temperature != null) {
          const d = a.current_temperature - a.trv_temperature;
          return stat("mdi:tune-variant", t("Abgleich"), `${d > 0 ? "+" : ""}${fmt(d)}°`, Math.abs(d) >= 1 ? "warn" : null, null);
        }
        return "";
      })(),
    ].join("");

    const syncCls = a.sync === "ok" ? "" : a.sync;
    const syncLabel = { ok: t("synchron"), pending: t("sendet …"), failed: t("keine Antwort") }[a.sync] || a.sync;
    const notif = sib.notifications ? this._hass.states[sib.notifications] : null;
    const wlogic = sib.window_logic ? this._hass.states[sib.window_logic] : null;

    // Status-Hinweis: Gerätesollwert weicht ab – mit dem angewendeten Abgleich.
    const calOff = a.offset != null ? a.offset : a.offset_auto;
    const trvNote = !mon && a.trv_target != null && a.temperature != null && Math.abs(a.trv_target - a.temperature) >= 0.3
      ? (calOff != null && Math.abs(calOff) >= 0.1
        ? t("Thermostat {v}° (Abgleich {o}°)", { v: fmt(a.trv_target), o: (calOff > 0 ? "+" : "") + fmt(calOff) })
        : t("Thermostat {v}°", { v: fmt(a.trv_target) }))
      : "";
    this._html = `<style>${STYLES}${rkLookStyles(rkLook(this._config))}</style>
      <ha-card class="rcard ${rkLook(this._config) === "classic" ? "" : rkLook(this._config)}" style="--tone:${toneVar(status.tone)}; --accent:${accent || "transparent"}">
        <div class="top">
          <div class="name" data-more="${this._config.entity}" title="${esc(name)}">${name}</div>
          ${a.window_open !== undefined ? `<div class="wins"><ha-icon class="${winOpen ? "open" : ""}" icon="${winOpen ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon></div>` : ""}
          ${!mon && sib.boost ? `<button class="boostbtn ${a.boost_until ? "on" : ""}" data-boost="${sib.boost}" title="${t("Wärmer für kurze Zeit")}" aria-label="${t("Wärmer für kurze Zeit")}"><ha-icon icon="mdi:fire-plus"></ha-icon>${a.boost_until ? `<span data-boostleft></span>` : t("Boost")}</button>` : ""}
        </div>
        <div class="chips">
          <span class="chip"><ha-icon icon="${status.icon}"></ha-icon>${status.label}</span>
          ${a.battery && a.battery.low ? `<span class="chip" style="--tone:var(--rk-warn)" title="${esc(a.battery.name)}"><ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>${t("Batterie {p} %", { p: a.battery.level })}</span>` : ""}
          ${a.notify_paused_until ? `<span class="chip" style="--tone:var(--rk-warn)" title="${t("Hinweise für diesen Raum pausiert")}"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${t("Pause bis {time}", { time: new Date(a.notify_paused_until).toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }) })}</span>` : ""}
        </div>
        ${trvNote ? `<div class="trvnote" title="${esc(trvNote)}"><ha-icon icon="mdi:thermometer-lines"></ha-icon><span>${trvNote}</span></div>` : ""}
        ${a.occupied === true || a.occupied === false ? `<div class="since occ ${a.occupied ? "in" : ""}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon><span ${a.occupied ? "" : "data-empty"}>${a.occupied ? t("Jemand im Raum") : ""}</span></div>` : ""}
        ${winOpen && this._winSince ? `<div class="since"><ha-icon icon="mdi:window-open-variant"></ha-icon><span data-since></span></div>` : ""}
        <div class="dial">
          ${mon ? "" : this._arc(a.current_temperature, target, isOff)}
          <div class="center">
            <div class="now">${fmt(a.current_temperature)}<small>°C</small></div>
            <div class="target">${mon
              ? [a.humidity_sensor ? `${fmt(a.current_humidity, 0)} %` : "", a.co2_sensor ? `${fmt(a.current_co2, 0)} ppm` : ""]
                  .filter(Boolean).join(" · ") || t("nur Messen")
              : this._pending != null ? t("Ziel <b>{v} °C</b>", { v: fmt(target) }) : planText(a, isOff, true)}</div>
          </div>
        </div>
        ${mon ? "" : `<div class="ctrl">
          <button class="round" data-step="-0.5" ${isOff ? "disabled" : ""} aria-label="${t("kälter")}"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button class="round" data-power aria-label="${t("an/aus")}" style="${isOff ? "" : "color:var(--tone)"}"><ha-icon icon="mdi:power"></ha-icon></button>
          <button class="round" data-step="0.5" ${isOff ? "disabled" : ""} aria-label="${t("wärmer")}"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>`}
        ${banner}
        <div class="stats">${stats}</div>
        <div class="actions">
          ${wlogic ? `<button class="pill ${wlogic.state === "on" ? "on" : ""}" data-toggle="${sib.window_logic}"><ha-icon icon="mdi:window-shutter-auto"></ha-icon>${t("Fensterlogik")}</button>` : ""}
          ${notif ? `<button class="pill ${notif.state === "on" ? "on" : ""}" data-toggle="${sib.notifications}"><ha-icon icon="${notif.state === "on" ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}"></ha-icon>${t("Hinweise")}</button>` : ""}
          ${mon ? "" : `<span class="sync ${syncCls}"><ha-icon icon="${a.sync === "ok" ? "mdi:check-circle-outline" : "mdi:sync"}"></ha-icon>${syncLabel}</span>`}
        </div>
      </ha-card>`;

    this.shadowRoot.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => this._step(parseFloat(b.dataset.step))));
    const p = this.shadowRoot.querySelector("[data-power]");
    if (p) p.addEventListener("click", () => this._call("climate", isOff ? "turn_on" : "turn_off", { entity_id: this._config.entity }));
    this.shadowRoot.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => this._call("switch", "toggle", { entity_id: b.dataset.toggle })));
    this.shadowRoot.querySelectorAll("[data-boost]").forEach((b) => b.addEventListener("click", () => this._call("button", "press", { entity_id: b.dataset.boost })));
    this.shadowRoot.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", () => this._moreInfo(b.dataset.more)));
    this._tick();
  }
}
