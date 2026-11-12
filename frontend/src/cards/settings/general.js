// Einstellungen-Karte – Reiter „Allgemein“ (Wohnung, Anwesenheit, Heizsaison, Nacht, Benachrichtigungen, Berichte).
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const GeneralMethods = {
  // ---------------------------------------------------------------- Allgemein
  _general() {
    if (this._err) return `<div class="hint">${t("Einstellungen konnten nicht geladen werden: {e}", { e: esc(this._err) })}</div>`;
    if (!this._cfg) return `<div class="hint">${t("Lade Einstellungen …")}</div>`;
    if (!this._cfg.hub) return `<div class="hint">${t("„Raumklima Allgemein“ wird gerade eingerichtet – bitte die Seite gleich neu laden.")}</div>`;
    const ch = this._cfg.choices || {};
    const st = this._cfg.hub.state || {};
    const hubIds = rkHub(this._hass);
    const pres = PRESENCE[st.stage] || PRESENCE.home;
    const seas = SEASON[st.decision] || SEASON.heating;
    const residents = this._hubOpt("residents") || [];
    const persons = st.persons || {};
    const H = "hub";

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
        const items = Array.from({ length: 24 }, (_x, h) => ({ id: `${String(h).padStart(2, "0")}:00`, name: `${String(h).padStart(2, "0")}:00` }));
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

    // --- Heizsaison
    const mode = this._hubOpt("season_mode");
    const mdToInput = (v) => (v && /^\d{2}-\d{2}$/.test(v) ? `2000-${v}` : "");
    const seasRows = [
      `<div class="status"><span class="chip" style="--tone:${toneVar(seas.tone)}"><ha-icon icon="${seas.icon}"></ha-icon>${seas.label}</span>
        <span class="chip" style="--tone:var(--rk-off)"><ha-icon icon="mdi:thermometer"></ha-icon>${t("Ø 24 h {p} · Vorhersage {f}", { p: st.mean_past == null ? t("sammelt noch") : fmt(st.mean_past) + "°", f: st.mean_forecast == null ? "–" : fmt(st.mean_forecast) + "°" })}</span></div>`,
      this._row("Betriebsart", this._segs(H, "season_mode", RK_MODES, mode)),
      this._row("Heizgrenze", this._num(H, "heating_limit", this._hubOpt("heating_limit")), "Tagesmittel außen, darüber Heizpause (nach 2 milden Tagen)"),
      this._row("Heute heizen", st.heat_today_until
        ? `<button class="btn" data-action="cancel_heat_today" style="--c:var(--rk-heat)"><ha-icon icon="mdi:close"></ha-icon>${t("Beenden")}</button>`
        : `<button class="btn" data-action="heat_today" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><ha-icon icon="mdi:fire"></ha-icon>${t("24 h heizen")}</button>`, "für milde, aber kühle Tage"),
      this._more("seas-more", "Weitere Einstellungen", [
      this._row("Heizsaison", `<span class="v"><input class="inp short" type="date" data-md="season_start" value="${mdToInput(this._hubOpt("season_start"))}" ${this._admin ? "" : "disabled"}> ${t("bis")} <input class="inp short" type="date" data-md="season_end" value="${mdToInput(this._hubOpt("season_end"))}" ${this._admin ? "" : "disabled"}></span>`, "Kalender antippen – Tag und Monat zählen, das Jahr ist egal"),
      this._row("Außentemperatur von", this._select(H, "outdoor_temp_entity", ch.outdoor || [], this._hubOpt("outdoor_temp_entity"), "Wetterdienst"), "eigene Wetterstation statt Wetterdienst – die Vorhersage kommt weiterhin vom Wetterdienst"),
      this._row("Kälteeinbruch unter", this._num(H, "cold_snap_temp", this._hubOpt("cold_snap_temp")), "3 Tage darunter → heizt auch außerhalb der Saison"),
      this._row("Sicherung", this._num(H, "frost_floor", this._hubOpt("frost_floor")), "fällt ein Raum darunter, heizt er immer"),
      this._row("Frostnacht: weniger absenken", this._optToggle(H, "frost_night", !!this._hubOpt("frost_night")), "unter −5 °C laut Vorhersage nur halb so tief – der Raum ist schneller wieder warm"),
      this._row("Sommerpflege Ventile", this._optToggle(H, "valve_care", !!this._hubOpt("valve_care")), "mittwochs 11 Uhr kurz öffnen"),
      ].join(""), "hub", ["season_start", "season_end", "outdoor_temp_entity", "cold_snap_temp", "frost_floor", "frost_night", "valve_care"]),
    ].join("");

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

    const hm = (v) => String(v || "").slice(0, 5);
    // Eigene HH:MM-Felder – der Browser würde sonst je nach Betriebssystem AM/PM zeichnen (Issue #7)
    const tf = (key, val) => `<button class="timebtn" data-timeopen="${key}" data-val="${hm(val)}" ${this._admin ? "" : "disabled"}>${hm(val) || "–:–"}</button>`;
    const sleepRows = [
      `<div class="status"><span class="chip" style="--tone:${sl.quiet_now ? "var(--rk-eco)" : "var(--rk-ok)"}"><ha-icon icon="${sl.quiet_now ? "mdi:sleep" : "mdi:white-balance-sunny"}"></ha-icon>${sl.quiet_now ? t("Ruhezeit gerade aktiv") : t("Keine Ruhezeit")}</span>${sl.asleep ? `<span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon>${t("Licht aus – alle schlafen")}</span>` : ""}</div>`,
      this._row("Ruhezeit", `<span class="v">${tf("quiet_start", this._hubOpt("quiet_start"))} – ${tf("quiet_end", this._hubOpt("quiet_end"))}</span>`, "nur Dringendes (kühlt aus, Fenster offen bei Abwesenheit, Thermostat-Fehler) kommt laut"),
      this._row("Wochenende bis", `<span class="v">${tf("quiet_end_weekend", this._hubOpt("quiet_end_weekend"))}</span>`, "Sa und So endet die Ruhezeit später – zum Ausschlafen"),
      this._row("Ruhezeit senkt ab", this._optToggle(H, "quiet_setback", !!this._hubOpt("quiet_setback")), "während der Ruhezeit werden Schlafzimmer und selten genutzte Räume abgesenkt – auch wenn jemand zu Hause ist"),
      lrn("weekday", "Werktags"),
      lrn("weekend", "Wochenende"),
      this._more("night-more", "Weitere Einstellungen", [
      this._row("Absenkwert nachts", this._select(H, "night_level", [{ id: "short", name: t("Kurz weg") }, { id: "long", name: t("Länger weg") }, { id: "frost", name: t("Frostschutz") }], this._hubOpt("night_level") || "long"), "gilt bei der Ruhezeit und wenn der Schalter „Nachtruhe“ an ist – je Raum unter „Nachtabsenkung“ ein- oder ausgeschlossen"),
      this._row("Nachtruhe über Entität", this._select(H, "night_entity", ch.signals || [], this._hubOpt("night_entity"), "– keiner –"),
        "HA-Schalter, der die Nachtruhe mit schaltet – der eigene Schalter bleibt"),
      this._row("Nachtlüften", `<span class="v">${tf("night_start", this._hubOpt("night_start"))} – ${tf("night_end", this._hubOpt("night_end"))}</span>`, "Fenster in Schlafräumen, das in dieser Zeit aufgeht, gilt als Schlafen bei offenem Fenster – keine Lüft-Hinweise, morgens ein Gruß"),
      this._row("… leise warnen unter", this._num(H, "night_alarm_temp", this._hubOpt("night_alarm_temp")), "einmal pro Nacht"),
      this._row("Zeiten lernen", this._optToggle(H, "learn_times", !!this._hubOpt("learn_times")), "aus Nachtlüften und Licht – verlängert Ruhezeit und Nachtlüften nur, verkürzt nie"),
      this._row("Schichtdienst", this._optToggle(H, "learn_shift", !!this._hubOpt("learn_shift")), "auch Tagschlaf lernen: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht"),
      this._row("Feiertage", this._select(H, "holiday_state", ch.states || [], this._hubOpt("holiday_state") || "", "– keine –"), (sl.tonight && sl.tonight.holiday) ? t("morgen: {h} – Ruhezeit wie am Wochenende", { h: esc(sl.tonight.holiday) }) : "Nacht vor einem Feiertag gilt wie Wochenende"),
      this._row("Schlaf-Signale", `<div class="chips">${sigChips || this._v("keine", true)}</div>`, "Lichter: abends alle 20 min aus = ins Bett, morgens eins an = aufgestanden"),
      this._admin && sigAvail.length ? `<div class="addrow"><select class="sel" id="addSig">${sigAvail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-sigadd style="--c:var(--rk-eco)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Signal hinzufügen")}</button></div>` : "",
      `<div class="hint">${t("Jede Nacht zählt einmal (frühestes Ereignis). Gelernt wird zuerst je Wochentag (Schichtdienst), sonst nach Werktag und Wochenende (Fr→Sa, Sa→So); gelernt wird der typische Wert (Median) der letzten 6 Wochen, sobald 4 Nächte da sind. Die Ruhezeit beginnt 30 min vor der typischen Bettzeit und endet 30 min nach dem Aufstehen – aber nie kürzer als eingestellt.")}</div>`,
      ].join(""), "hub", ["night_level", "night_entity", "night_start", "night_end", "night_alarm_temp", "learn_times", "learn_shift", "holiday_state", "sleep_signals"]),
    ].join("");

    // --- Wohnung
    const frsi = fmt({ unrenovated: 0.6, renovated: 0.7, new: 0.8 }[this._hubOpt("building_type")] || 0.7, 2);
    const homes = this._cfg.homes || [];
    const homeRows = [
      this._row("Name der Wohnung", `<input class="inp" data-hubtext="name" value="${esc(this._hubOpt("name") || "")}" placeholder="${t("z. B. Ferienwohnung")}" ${this._admin ? "" : "disabled"}>`, "erscheint im Umschalter oben im Dashboard"),
      this._row("Bauart", this._segs(H, "building_type", RK_BUILDING, this._hubOpt("building_type"))),
      `<div class="hint">${t("Der Schimmelschutz rechnet bei längerer Abwesenheit mit der kältesten Wandstelle (Temperaturfaktor {f} nach DIN 4108-2). Ist die Raumluft feucht, wird weniger abgesenkt – warme Luft nimmt mehr Feuchte auf und die Wand bleibt unter 80 % Feuchte.", { f: frsi })}</div>`,
      this._row("Wetterquelle", this._select(H, "weather_entity", ch.weather || [], this._hubOpt("weather_entity"), "– wählen –"), st.outdoor_temperature != null ? t("Draußen gerade {v} °C", { v: fmt(st.outdoor_temperature) }) : ""),
      this._more("home-more", "Dashboard, Standort, weitere Wohnung", [
      (() => {
        const dh = homes.find((h) => h.entry_id === this._cfg.hub.entry_id) || {};
        const dp = dh.dashboard || "";
        const fehlt = this._admin && rkNeedsDashboard(this._dashKnown(), dp, String((this._hass && this._hass.panelUrl) || "").replace(/^\//, ""));
        return this._row("Dashboard",
          `<input class="inp" data-hubtext="dashboard" value="${esc(this._hubOpt("dashboard") || "")}" placeholder="${esc(dp || "heizung")}" ${this._admin ? "" : "disabled"}>${
            fehlt ? ` <button class="mini" data-mkdash="${esc(dp)}" title="${t("Dashboard mit der Raumklima-Strategie anlegen")}">${t("anlegen")}</button>` : ` <span class="lt">${t("vorhanden")}</span>`
          }`,
          fehlt
            ? t("Für diese Wohnung gibt es noch kein Dashboard „{d}“ – der Knopf legt es mit der Raumklima-Strategie an (gefiltert auf diese Wohnung).", { d: dp })
            : t("Adresse des Dashboards dieser Wohnung (für den Umschalter)"));
      })(),
      (() => {
        const lat = this._hubOpt("latitude"), lon = this._hubOpt("longitude");
        const hl = this._hass.config || {};
        const haLat = hl.latitude != null ? fmt(hl.latitude, 4) : "–";
        const haLon = hl.longitude != null ? fmt(hl.longitude, 4) : "–";
        const zn = this._hubOpt("zone") || "";
        const zst = zn ? this._st(zn) : null;
        const zlat = zst && zst.attributes ? zst.attributes.latitude : null;
        const zlon = zst && zst.attributes ? zst.attributes.longitude : null;
        const own = lat != null || lon != null;
        return this._row("Standort der Wohnung",
          `<span class="v"><input type="number" class="inp short" step="0.0001" min="-90" max="90" data-hubgeo="latitude" value="${lat ?? ""}" placeholder="${t("Breite")}" ${this._admin ? "" : "disabled"}> <input type="number" class="inp short" step="0.0001" min="-180" max="180" data-hubgeo="longitude" value="${lon ?? ""}" placeholder="${t("Länge")}" ${this._admin ? "" : "disabled"}> ${this._admin ? `<button class="mini" data-geohass title="${t("Werte von Home Assistant übernehmen")}">${t("von HA")}</button>${own ? `<button class="mini x" data-geoclear title="${t("leeren – dann gilt Home Assistant")}">✕</button>` : ""}` : ""}</span>`,
          t("Leer lassen = es gilt der Standort aus der Zone dieser Wohnung ({zone}{zl}). Ist keine Zone gesetzt, gilt der Standort von Home Assistant ({lat} / {lon}). Nur eintragen, wenn die Wohnung woanders liegt – daraus rechnet Raumklima den Sonnenstand; „von HA“ übernimmt die HA-Werte zum Anpassen.", {
            zone: zn || t("keine Zone gesetzt"),
            zl: zlat != null && zlon != null ? `, ${fmt(zlat, 4)} / ${fmt(zlon, 4)}` : "",
            lat: haLat,
            lon: haLon,
          }),
        );
      })(),
      this._admin ? `<div class="addrow"><input class="inp" id="newHome" placeholder="${t("Neue Wohnung, z. B. Ferienwohnung")}"><button class="btn" data-newhome style="--c:var(--rk-ok)"><ha-icon icon="mdi:home-plus-outline"></ha-icon>${t("Wohnung anlegen")}</button></div>` : "",
      `<div class="hint">${homes.length > 1 ? t("{n} Wohnungen: {list}. Jede hat eigene Bewohner, Zone, Empfänger, Heizsaison und Protokoll; Räume ordnest du im Raum unter „Wohnung“ zu.", { n: homes.length, list: homes.map((h) => esc(h.name) + " (" + t("{n} Räume", { n: h.rooms.length }) + ")").join(", ") }) : t("Für eine zweite Wohnung (z. B. Ferienwohnung) mit eigenen Bewohnern, Zone und Empfängern hier anlegen. Bestehende Räume bleiben in dieser Wohnung.")}</div>`,
      ].join(""), "hub", ["dashboard", "latitude", "longitude"]),
    ].join("");

    // --- Gebäude
    const reportRows = [
      this._row("PDF-Berichte", `<div class="chips">${Object.entries({ week: t("Woche"), month: t("Monat"), season: t("Heizsaison") }).map(([k, l]) => { const on = (this._hubOpt("report_pdf") ?? ["week", "month", "season"]).includes(k); return `<button class="chip2 ${on ? "" : "off"}" data-rpdf="${k}" style="--c:var(--rk-heat)" ${this._admin ? "" : "disabled"}><i></i>${l}</button>`; }).join("")}</div>`,
        "automatisch erstellen: Woche sonntags 18 Uhr, Monat am 1., Heizsaison nach Saisonende – Push mit Link an alle mit „Wochenbericht“"),
      this._row("PDF per E-Mail", `<button class="tgl ${this._hubOpt("report_email") ? "on" : ""}" data-mailtoggle ${this._admin ? "" : "disabled"} aria-label="${t("umschalten")}"></button>`,
        this._hubOpt("report_email") ? "die PDF kommt als Anhang an die Empfänger unten" : "darunter einmal „E-Mail einrichten“ – danach kommt jeder Bericht auch per Mail"),
      this._mailSetup(ch.mail || []),
      this._hubOpt("report_email") && this._admin ? this._row("Test", `<button class="btn" data-pdftest style="--c:var(--rk-heat)"><ha-icon icon="mdi:email-fast-outline"></ha-icon>${t("Wochenbericht jetzt senden")}</button>`) : "",
      this._more("rep-more", "Weitere Einstellungen", [
      this._row(
        "Wärmemenge im Bericht",
        this._select(H, "report_metric", [
          { id: "auto", name: t("automatisch") },
          { id: "valve", name: t("Ventilstellung") },
          { id: "deficit", name: t("Gradstunden") },
          { id: "hours", name: t("Heizstunden") },
        ], this._hubOpt("report_metric") || "auto"),
        "automatisch = Ventilstellung, wenn jedes Thermostat sie meldet – sonst Gradstunden unter Ziel (gemessen, nicht geschätzt)"
      ),
      this._row("Heizkosten pro Jahr", `<span class="v"><input type="number" class="inp" min="0" max="20000" step="50" data-hubnum="annual_cost" value="${this._hubOpt("annual_cost") ?? ""}" placeholder="${t("z. B. 1400")}" ${this._admin ? "" : "disabled"} style="width:110px"> €</span>`, "optional, laut Abrechnung – nur für die Euro-Schätzung im PDF-Bericht (Ersparnis, „1 °C weniger = … €“)"),
      ].join(""), "hub", ["report_metric", "annual_cost"]),
    ].join("");

    // --- Empfänger
    const push = this._hubOpt("recipients") || {};
    const tts = this._hubOpt("tts") || {};
    const palette = ["#4f9dff", "#ff7a45", "#2ec4a6", "#a78bfa", "#ffb020"];
    const kinds = this._cfg.kinds || Object.keys(RK_KINDS);
    const card = (target, list, channel, i) => {
      const ks = kinds.filter((k) => k !== "live" || (channel === "push" && target.startsWith("notify.mobile_app_")));
      const chips = ks.map((k) => `<button class="chip2 ${list.includes(k) ? "" : "off"}" data-kind="${k}" data-target="${esc(target)}" data-ch="${channel}" title="${RK_KINDS[k][1]}" ${this._admin ? "" : "disabled"}>${RK_KINDS[k][0]} ${RK_KINDS[k][1]}</button>`).join("");
      return `<div class="row"><div class="l">
        <span class="rn" style="--c:${palette[i % palette.length]}"><i></i>${esc(rkPretty(target))}</span>
        <small>${channel === "tts" ? t("Sprachansage · nie in der Ruhezeit") : t("Push aufs Handy")} · ${esc(target)}</small></div>
        <div class="chips">${chips}${this._admin ? `<button class="mini" data-test="${esc(target)}">${t("Test")}</button><button class="mini x" data-remove="${esc(target)}" data-ch="${channel}" title="${t("entfernen")}">✕</button>` : ""}</div></div>`;
    };
    const cards = [...Object.entries(push).map(([tg, l], i) => card(tg, l || [], "push", i)), ...Object.entries(tts).map(([tg, l], i) => card(tg, l || [], "tts", i + 3))].join("")
      || `<div class="hint">${t("Noch kein Empfänger – unten hinzufügen.")}</div>`;
    const avail = (ch.notify || []).filter((tg) => !(tg in push) && !(tg in tts));
    const addRow = this._admin && avail.length ? `<div class="addrow">
        <select class="sel" id="addTarget">${avail.map((tg) => `<option value="${esc(tg)}">${esc(rkPretty(tg))} (${esc(tg)})</option>`).join("")}</select>
        <button class="btn" data-add="push" style="--c:var(--rk-air)"><ha-icon icon="mdi:cellphone-message"></ha-icon>${t("Als Push hinzufügen")}</button>
        <button class="btn" data-add="tts" style="--c:var(--rk-eco)"><ha-icon icon="mdi:speaker-message"></ha-icon>${t("Als Sprachansage")}</button></div>` : "";

    // --- Allgemein Benachrichtigung
    const notiRows = [
      this._row(
        "Lüfthinweise von",
        `<span class="v">${tf("vent_from", this._hubOpt("vent_from") || "08:00:00")} – ${tf("vent_to", this._hubOpt("vent_to") || "21:00:00")}</span>`,
        t("Bitte lüften, Fenster schließen und Luft ausgetauscht nur in dieser Zeit – nachts bleibt es still, Raum kühlt aus, Frost und Gerätefehler melden sich weiter")
      ),
      this._row("Nur an anwesende Personen", this._optToggle(H, "notify_present_only", this._hubOpt("notify_present_only") ?? true), t("Lüft-Hinweise nur an Handys von Personen, die laut Ortung zu Hause sind – dringende Meldungen (Fenster offen bei Abwesenheit, Frost, Ausfall) gehen weiter an alle")),
      this._row(
        "Sturm- und Regenwarnung",
        this._optToggle(H, "storm_warning", this._hubOpt("storm_warning") ?? true),
        t("warnt, wenn Sturm oder Starkregen angekündigt ist und ein Fenster offen steht – kommt auch in der Ruhezeit")
      ),
      this._more("noti-more", "Weitere Einstellungen", [
      this._row(
        "… Böen ab",
        this._num(H, "storm_gust_kmh", this._hubOpt("storm_gust_kmh") ?? 70),
        t("ab dieser Böenstärke gilt es als Sturm")
      ),
      this._row(
        "… Regen ab",
        this._num(H, "storm_rain_mm", this._hubOpt("storm_rain_mm") ?? 8),
        t("ab dieser Regenmenge gilt es als Starkregen")
      ),
      this._row("Erinnern alle", this._num(H, "repeat_minutes", this._hubOpt("repeat_minutes")), "solange das Problem besteht"),
      this._row("Fehler auch in der HA-Glocke", this._optToggle(H, "notify_on_failure", !!this._hubOpt("notify_on_failure"))),
      ].join(""), "hub", ["storm_gust_kmh", "storm_rain_mm", "repeat_minutes", "notify_on_failure"]),
    ].join("");

    // --- Tabelle
    const yes = (b) => (b ? `<span class="ok">● ${t("an")}</span>` : `<span class="no">○ ${t("aus")}</span>`);
    const rowsT = this._orderedRooms().map((r) => {
      const s = r.attrs.settings || {};
      const notif = (this._st(r.sib.notifications) || {}).state === "on";
      const wl = (this._st(r.sib.window_logic) || {}).state === "on";
      const flags = [
        wl ? `<ha-icon icon="mdi:window-open-variant" title="${t("Fensterlogik an")}"></ha-icon>` : "",
        notif ? `<ha-icon icon="mdi:bell-outline" title="${t("Hinweise an")}"></ha-icon>` : "",
        r.attrs.humidity_limit != null ? `<ha-icon icon="mdi:water-percent" title="${fmt(r.attrs.humidity_limit, 0)} %"></ha-icon>` : "",
      ].join("");
      return `<button class="rtile" data-tab="${r.id}" style="--c:${r.color}">
        <span class="rtop"><span class="rname">${r.name}</span><span class="rtyp">${RK_ROOM_TYPES[s.room_type] || s.room_type || "–"}</span></span>
        <span class="rbig">${fmt(r.attrs.comfort_temperature)}<i>°</i></span>
        <span class="rsub">${t("Absenkung")} ${fmt(s.setback_short)} / ${fmt(s.setback_long)} °C</span>
        <span class="rsub">${t("Lüften ab {v} °C", { v: fmt(r.attrs.min_temp) })}</span>
        <span class="rflags">${flags}</span></button>`;
    }).join("");

    const issues = st.issues || [];
    const bad = issues.filter((i) => i.severity !== "info").length;
    const healthTone = issues.some((i) => i.severity === "alert") ? "cold" : bad ? "warn" : "ok";
    const healthExtra = `<span class="chip" style="--tone:${toneVar(healthTone)}">${bad ? t("{n} offen", { n: bad }) : "ok"}</span>`;
    return `<div class="groups">
      ${this._grp("home", "Erste Schritte", "mdi:check-decagram-outline", "ok", this._checkRows(st, ch), "span")}
      ${this._grp("heating", "Gesundheit der Heizung", "mdi:heart-pulse", healthTone, rkIssueList(issues, true, this._config.strip_prefix) + `<div class="hint">${t("Prüft alle 10 Minuten: Batterien, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funkaussetzer, Fensterkontakt still. Meldungen gehen an alle mit „🩺 Gesundheit“.")}</div>`, "span", healthExtra)}
      ${this._grp("presence", "Anwesenheit & Absenkung", "mdi:home-account", "eco", presRows)}
      ${this._grp("heating", "Heizsaison & Heizgrenze", "mdi:radiator", "heat", seasRows)}
      ${this._grp("notify", "Wer bekommt was", "mdi:account-voice", "air", `${cards}${addRow}`, "span")}
      ${this._grp("notify", "Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows)}
      ${this._grp("night", "Nacht & Ruhezeit", "mdi:sleep", "eco", sleepRows, "span")}
      ${this._grp("reports", "Berichte", "mdi:file-chart-outline", "heat", reportRows)}
      ${this._grp("home", "Wohnung", "mdi:home-switch-outline", "air", homeRows)}
      ${this._grp("home", "Alle Räume auf einen Blick", "mdi:table", "off", `<div class="roomgrid">${rowsT}</div><div class="hint">${t("Tippe auf einen Raum, um seine Einstellungen zu ändern.")}</div>`, "span")}
      ${this._learnHub(st)}
      ${this._layoutGroup()}
    </div>`;
  },

  _mailSetup(mailServices = []) {
    const o = (k) => this._mailForm && this._mailForm[k] !== undefined ? this._mailForm[k] : (this._hubOpt(k) ?? "");
    const cur = String(this._hubOpt("report_email") || "");
    const viaService = cur.startsWith("notify.");
    const active = cur === "raumklima";
    const ok = active && !!(this._hubOpt("mail_server") && this._hubOpt("mail_to"));
    const open = this._mailOpen ?? (active && !ok);
    const dis = this._admin ? "" : "disabled";
    const sec = o("mail_security") || "starttls";
    const provs = Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<option value="${k}" ${p[0] === o("mail_server") ? "selected" : ""}>${esc(p[3])}</option>`).join("");
    const field = (key, label, type = "text", ph = "", hint = "") => `<label class="mf"><span>${t(label)}${hint ? `<small>${t(hint)}</small>` : ""}</span>
      <input class="inp" data-mail="${key}" type="${type}" value="${type === "password" ? "" : esc(String(o(key)))}" placeholder="${esc(ph)}" autocomplete="${type === "password" ? "new-password" : "off"}" ${dis}></label>`;
    return `<details class="mailbox" ${open ? "open" : ""} data-mailbox>
      <summary><ha-icon icon="mdi:email-outline"></ha-icon>${t("E-Mail einrichten")} ${viaService ? `<span class="ok">● ${t("über {s}", { s: esc(rkPretty(cur)) })}</span>` : ok ? `<span class="ok">● ${t("eingerichtet")}</span>` : `<span class="no">○ ${t("noch nicht eingerichtet")} – ${t("hier antippen")}</span>`}</summary>
      <div class="mailform">
        <label class="mf"><span>${t("Anbieter")}<small>${t("füllt Server, Port und Verschlüsselung aus")}</small></span>
          <div class="segs mailprov">${Object.entries(RK_MAIL_PROVIDERS).map(([k, p]) => `<button class="${p[0] === o("mail_server") ? "on" : ""}" data-mailprov="${k}" ${dis}>${esc(p[3])}</button>`).join("")}<button data-mailprov="other" ${dis}>${t("Anderer Anbieter")}</button></div></label>
        ${field("mail_user", "Benutzer", "email", "name@gmx.de", "meist deine E-Mail-Adresse")}
        ${field("mail_password", "Passwort", "password", this._hubOpt("mail_password_set") ? t("gespeichert – leer lassen zum Behalten") : "", "bei Gmail, iCloud, Outlook: App-Passwort")}
        ${field("mail_to", "Empfänger", "text", "ich@example.de, partner@example.de", "mehrere mit Komma")}
        <details class="adv"><summary>${t("Server-Einstellungen")}</summary>
          ${field("mail_server", "Server", "text", "smtp.example.de")}
          ${field("mail_port", "Port", "number", "587")}
          <label class="mf"><span>${t("Verschlüsselung")}</span><div class="segs">${["starttls", "ssl", "none"].map((v) => `<button class="${v === sec ? "on" : ""}" data-mailsec="${v}" ${dis}>${{ starttls: "STARTTLS", ssl: "SSL/TLS", none: t("keine") }[v]}</button>`).join("")}</div></label>
          ${field("mail_from", "Absender", "email", "", "leer = Benutzer")}
        </details>
        <div class="mailact"><button class="btn" data-mailcheck ${dis}><ha-icon icon="mdi:shield-check-outline"></ha-icon>${t("Zugang prüfen")}</button><button class="btn primary" data-mailsave ${dis}><ha-icon icon="mdi:email-check-outline"></ha-icon>${t("Speichern & Test-Mail senden")}</button></div>
        ${this._mailSteps ? `<div class="msteps">${this._mailSteps.map((s) => `<div class="mstep ${s.ok ? "ok" : "bad"}"><b>${s.ok ? "✓" : "✕"}</b><span><b>${esc(t({ connect: "Server erreichbar", tls: "Verschlüsselung", login: "Anmeldung", recipients: "Empfänger" }[s.step] || s.step))}</b> – ${esc(s.msg)}</span></div>`).join("")}</div>` : ""}
        ${this._mailMsg ? `<div class="hint ${this._mailMsg[0]}">${esc(this._mailMsg[1])}</div>` : ""}
        ${mailServices.length || viaService ? `<label class="mf"><span>${t("Oder vorhandenen Mail-Dienst nutzen")}<small>${t("statt der Zugangsdaten oben")}</small></span>
          <select class="sel" data-sel="hub" data-key="report_email" ${dis}><option value="${active ? "raumklima" : ""}">${t("– nein, Zugangsdaten oben –")}</option>${[...new Set([...mailServices, ...(viaService ? [cur] : [])])].map((n) => `<option value="${esc(n)}" ${n === cur ? "selected" : ""}>${esc(rkPretty(n))}</option>`).join("")}</select></label>` : ""}
        <div class="hint">${t("Das Passwort wird nur in Home Assistant gespeichert und nie angezeigt. Tipp: Für Gmail unter myaccount.google.com → Sicherheit → App-Passwörter ein eigenes Passwort für Raumklima erstellen.")}</div>
      </div></details>`;
  },
};
