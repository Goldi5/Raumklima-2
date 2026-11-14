import { esc, fmt, t, toneVar, RK_HOMESENS } from "../../../shared.js";

export const PresenceSectionMethods = {
  _groupPresence(ctx) {
    const { ch, st, H, hubIds, pres, residents, persons } = ctx;
    // --- Anwesenheit
    const personChips = (ch.persons || []).map((p) => {
      const on = residents.includes(p.id);
      const info = persons[p.id];
      const where = info ? (info.present ? t("da") : info.distance_km != null ? `${fmt(info.distance_km, info.distance_km < 10 ? 1 : 0)} km` : t("unbekannt")) : "";
      return `<button class="chip2 ${on ? "" : "off"}" data-person="${p.id}" style="--c:${on ? (info && info.present ? "var(--rk-ok)" : "var(--rk-eco)") : "var(--rk-off)"}" ${this._admin ? "" : "disabled"}><i></i>${esc(p.name)}${on && where ? ` · ${where}` : ""}</button>`;
    }).join("");
    const presRows = [
      `<div class="status"><span class="chip" style="--tone:${toneVar(pres.tone)}"><ha-icon icon="${pres.icon}"></ha-icon>${pres.label}${st.stage === "preheat" && st.preheat_by ? ` · ${esc(st.preheat_by)}` : ""}</span>${st.presence_configured || this._hubOpt("presence_off") ? "" : `<span class="chip" style="--tone:var(--rk-warn)"><ha-icon icon="mdi:information-outline"></ha-icon>${t("Bewohner und Zone wählen, dann ist es aktiv")}</span>`}</div>`,
      this._row("Wer wohnt hier?", `<div class="chips">${personChips || this._v("keine Personen in HA", true)}</div>`, "Tippen zum Aus-/Abwählen. Zählt, sobald eins ihrer Handys in der Zone ist."),
      this._row("Wohnung (Zone)", this._select(H, "zone", ch.zones || [], this._hubOpt("zone"), "– wählen –")),
      this._row("Absenken nach", this._num(H, "away_delay", this._hubOpt("away_delay")), "damit kurze Wege nichts auslösen"),
      this._row("Urlaub", this._toggle(hubIds.vacation), "endet automatisch bei Ankunft"),
      this._row("Gäste da", this._toggle(hubIds.guests), "nicht absenken, auch wenn alle Bewohner weg sind"),
      this._row("Homeoffice", this._toggle(hubIds.home_office), "im Fenster gilt der Wunsch, der Zeitplan pausiert"),
      this._more("pres-ho", "Homeoffice & Kalender", [
      (() => {
        const items = Array.from({ length: 96 }, (_x, q) => {
          const h = Math.floor(q / 4), m = (q % 4) * 15;
          const id = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          return { id, name: id };
        });
        const from = this._hubOpt("home_office_from") || "08:00";
        const to = this._hubOpt("home_office_to") || "17:00";
        return this._row("Homeoffice-Fenster", `<span class="inline">${this._select(H, "home_office_from", items, from)} – ${this._select(H, "home_office_to", items, to)}</span>`,
          "in dieser Zeit heizen die gewählten Räume auf Wunsch; danach läuft der Zeitplan weiter");
      })(),
      this._row("Homeoffice gilt für", `<div class="chips">${this._orderedRooms()
          .map((r) => {
            const rid = ((r.attrs && r.attrs.settings) || {}).entry_id || r.id;
            const chosen = (this._hubOpt("home_office_rooms") || []).includes(rid);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-horoom="${rid}" title="${esc(r.name)}"><i></i>${esc(r.name)}</button>`;
          })
          .join("")}</div>`,
        (this._hubOpt("home_office_rooms") || []).length ? t("nur diese Räume werden auf Wunsch geheizt") : t("keine Auswahl = alle Räume mit Thermostat")
      ),
      this._row("Homeoffice nur wenn jemand da", this._optToggle(H, "home_office_check", this._hubOpt("home_office_check") !== false),
        "gilt für Kalendertermine; der Schalter heizt auch ohne Ortung"),
      this._row("Homeoffice über Entität", this._select(H, "home_office_entity", ch.signals || [], this._hubOpt("home_office_entity"), "– keiner –"),
        "HA-Schalter, der Homeoffice mit schaltet – gilt wie der Schalter, ohne Anwesenheitsprüfung"),
      this._row("Kalender", this._select(H, "calendar_entity", ch.calendars || [], this._hubOpt("calendar_entity"), "– keiner –"),
        st.calendar && st.calendar.mode ? t("gerade: „{s}“", { s: esc(st.calendar.summary || "") }) : "Termine mit diesen Wörtern steuern die Anwesenheit"),
      this._hubOpt("calendar_entity") ? this._row("… wie Urlaub", `<input class="inp" data-hubtext="calendar_away_words" value="${esc(this._hubOpt("calendar_away_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt; absenken wie „länger weg“, sobald niemand da ist") : "",
      this._hubOpt("calendar_entity") ? this._row("… Homeoffice / zu Hause", `<input class="inp" data-hubtext="calendar_home_words" value="${esc(this._hubOpt("calendar_home_words") || "")}" ${this._admin ? "" : "disabled"}>`, "Komma-getrennt, freie Wahl; ein Termin mit diesem Wort schaltet Homeoffice und senkt nicht ab") : "",
      ].join(""), "hub", ["home_office_from", "home_office_to", "home_office_rooms", "home_office_check", "home_office_entity", "calendar_entity"]),
      ...(() => {
        const cal = st.calendar;
        if (!cal) return [];
        const cur = (cal.events || [])[0];
        const up = cal.upcoming || [];
        const when = (e) => e && e.all_day
          ? esc(String(e.start || "").slice(0, 10))
          : esc(String(e && e.start || "").slice(11, 16));
        const label = (e) => e && e.mode === "home" ? t("Homeoffice") : e && e.mode === "away" ? t("Urlaub") : t("kein Einfluss");
        return [
          this._row(t("Kalender – jetzt"), this._v(cur ? `${esc(cur.summary)} · ${when(cur)} · ${label(cur)}` : t("kein Termin"), !cur), ""),
          ...up.slice(0, 5).map((e) => this._row(t("Kalender – als Nächstes"), this._v(`${esc(e.summary)} · ${when(e)} · ${label(e)}`, true), "")),
        ];
      })(),
      this._more("pres-more", "Weitere Einstellungen", [
      this._row("Anwesenheit aus", this._optToggle(H, "presence_off", !!this._hubOpt("presence_off")),
        "keine Auswertung: nichts wird nach Anwesenheit abgesenkt, nichts vorgeheizt, keine Weg-Meldungen – gedacht, wenn keine Ortung möglich ist"),
      this._row(
        "Gäste gelten für",
        `<div class="chips">${this._orderedRooms()
          .map((r) => {
            // Kennung ist die Raum-Entry-ID (danach fragt die Zentrale), Name der Anzeigename
            const rid = ((r.attrs && r.attrs.settings) || {}).entry_id || r.id;
            const chosen = (this._hubOpt("guests_rooms") || []).includes(rid);
            return `<button class="chip2 ${chosen ? "" : "off"}" data-guestroom="${rid}" title="${esc(r.name)}"><i></i>${esc(r.name)}</button>`;
          })
          .join("")}</div>`,
        (this._hubOpt("guests_rooms") || []).length ? t("nur diese Räume werden nicht abgesenkt") : t("keine Auswahl = alle Räume der Wohnung")
      ),
      this._row("„Länger weg“ ab", this._num(H, "long_away_hours", this._hubOpt("long_away_hours"))),
      this._row("Vorheizen ab", this._num(H, "preheat_km", this._hubOpt("preheat_km")), "wenn sich jemand nähert"),
      this._row("Urlaub automatisch ab", this._num(H, "vacation_km", this._hubOpt("vacation_km") ?? 0), "sind alle Bewohner weiter weg, gilt nach der Wartezeit Urlaub – 0 = aus"),
      this._row("… nach", this._num(H, "vacation_hours", this._hubOpt("vacation_hours") ?? 12), "erst so lange weit weg zählt als Urlaub (Tagesausflug löst nicht aus)"),
      this._row("Arbeitsplätze", `<div class="chips">${(ch.zones || []).map((z) => {
        const chosen = (this._hubOpt("work_zones") || []).includes(z.id);
        return `<button class="chip2 ${chosen ? "" : "off"}" data-workzone="${z.id}" title="${esc(z.name)}"><i></i>${esc(z.name)}</button>`;
      }).join("")}</div>`, "Zonen, in denen gearbeitet wird – wer dort ist, kommt so schnell nicht zurück"),
      this._row("… gilt nach", this._num(H, "work_zone_minutes", this._hubOpt("work_zone_minutes") ?? 5), "so lange dort, dann gilt die Wohnung sofort als leer (kein Vorheizen, keine Wartezeit)"),
      this._row("Präsenzmelder zählen", this._segs(H, "home_sensors", RK_HOMESENS, this._hubOpt("home_sensors") || "mmwave"),
        (st.sensed && st.sensed.length) ? t("gerade jemand in: {r}", { r: esc(st.sensed.join(", ")) }) : "sieht ein Melder jemanden, wird nicht abgesenkt – PIR löst auch bei Haustieren aus, darum standardmäßig nur mmWave; im Urlaub zählen Melder nie"),
      ].join(""), "hub", ["presence_off", "guests_rooms", "long_away_hours", "preheat_km", "vacation_km", "vacation_hours", "work_zones", "work_zone_minutes", "home_sensors"]),
    ].join("");
    return this._grp("presence", "Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows);
  },

  _groupNight(ctx) {
    const { ch, st, H } = ctx;
    // --- Schlafenszeiten
    const sl = st.sleep || {};
    const signals = this._hubOpt("sleep_signals") || [];
    const sigNames = Object.fromEntries((ch.signals || []).map((x) => [x.id, x.name]));
    const sigChips = signals.map((id) => `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${esc(sigNames[id] || this._name(id))}${this._admin ? ` <button class="mini x" data-sigrm="${esc(id)}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
    const sigAvail = (ch.signals || []).filter((x) => !signals.includes(x.id));
    // Gelernte Schlafzeiten als Zeilen mit Chips (statt Tabelle) – gleiche Optik wie alles andere.
    const lrn = (k, label) => {
      const v = sl[k] || {};
      const e = v.effective || {};
      const src = e.source || {};
      const learned = (key) => (src[key] === "learned" ? ` · ${t("gelernt")}` : "");
      const chips = [
        v.bed
          ? `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${t("ins Bett ~{v}", { v: v.bed })}${learned("night_start")}</span>`
          : `<span class="chip2" style="--c:var(--rk-off)"><i></i>${t("{n}/4 Nächte", { n: v.nights_bed || 0 })}</span>`,
        v.wake ? `<span class="chip2" style="--c:var(--rk-eco)"><i></i>${t("auf ~{v}", { v: v.wake })}${learned("wake")}</span>` : "",
        e.quiet_start ? `<span class="chip2"><i></i>${t("Ruhezeit")} ${e.quiet_start}–${e.quiet_end}</span>` : "",
      ].filter(Boolean).join("");
      return this._row(t(label), `<div class="chips">${chips}</div>`, "");
    };

    const sleepRows = [
      `<div class="status"><span class="chip" style="--tone:${sl.quiet_now ? "var(--rk-eco)" : "var(--rk-ok)"}"><ha-icon icon="${sl.quiet_now ? "mdi:sleep" : "mdi:white-balance-sunny"}"></ha-icon>${sl.quiet_now ? t("Ruhezeit gerade aktiv") : t("Keine Ruhezeit")}</span>${sl.asleep ? `<span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon>${t("Licht aus – alle schlafen")}</span>` : ""}</div>`,
      this._row("Ruhezeit", `<span class="v">${this._timeField("quiet_start", this._hubOpt("quiet_start"))} – ${this._timeField("quiet_end", this._hubOpt("quiet_end"))}</span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
      this._row("Wochenende bis", `<span class="v">${this._timeField("quiet_end_weekend", this._hubOpt("quiet_end_weekend"))}</span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
      this._row("Ruhezeit senkt ab", this._optToggle(H, "quiet_setback", !!this._hubOpt("quiet_setback")), "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist"),
      lrn("weekday", "Werktags"),
      lrn("weekend", "Wochenende"),
      this._more("night-more", "Weitere Einstellungen", [
      this._row("Absenkwert nachts", this._select(H, "night_level", [{ id: "short", name: t("Kurz weg") }, { id: "long", name: t("Länger weg") }, { id: "frost", name: t("Frostschutz") }], this._hubOpt("night_level") || "long"), "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsenkung“ ein- oder ausgeschlossen"),
      this._row("Nachtruhe über Entität", this._select(H, "night_entity", ch.signals || [], this._hubOpt("night_entity"), "– keiner –"),
        "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt"),
      this._row("Nachtlüften", `<span class="v">${this._timeField("night_start", this._hubOpt("night_start"))} – ${this._timeField("night_end", this._hubOpt("night_end"))}</span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
      this._row("… leise warnen unter", this._num(H, "night_alarm_temp", this._hubOpt("night_alarm_temp")), "einmal pro Nacht"),
      this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
      this._row("Schichtdienst", this._optToggle(H, "learn_shift", !!this._hubOpt("learn_shift")), "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht"),
      this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), (sl.tonight && sl.tonight.holiday) ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
      this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
      this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
      `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`,
      ].join(""), "hub", ["night_level", "night_entity", "night_start", "night_end", "night_alarm_temp", "learn_times", "learn_shift", "holiday_state", "sleep_signals"]),
    ].join("");
    return this._grp("night", "Nacht & Ruhezeit", "mdi:sleep", "eco", sleepRows, "span");
  },
};
