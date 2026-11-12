// Einstellungen-Karte – Reiter eines Raums (Temperatur, Fenster, Lüften, Geräte, Heizquellen, Präsenz, Licht).
// Methoden der Klasse RaumklimaSettingsCard (angehängt in ../settings.js).
import { HISTORY_STYLES, ISSUE_STYLES, PRESENCE, RK_BUILDING, RK_VERSION, RK_CAL, RK_DEFAULT_PUSH, RK_HOMESENS, RK_KINDS, RK_LIGHT_SIGNALS, RK_MAIL_PROVIDERS, RK_MODES, RK_MOLD, RK_NIGHT, RK_PREHEAT, RK_QUIET, RK_SCHED_FALLBACK, RK_OFF, RK_PKIND, RK_WALL, RK_ROOM_TYPES, RK_SYNC, SEASON, SETTINGS_STYLES, STYLES, esc, fmt, loc, planText, rkBusy, rkHomeId, rkHub, rkIssueList, rkLater, rkLayout, rkLayoutApply, rkLayoutChanged, rkLayoutRemember, rkBugReportUrl, rkManualUrl, rkNeedsDashboard, rkPaint, rkPretty, rkRooms, rkRoomsOrdered, rkSchedSortKey, rkScrolling, rkTimeValue, rkWindowOpen, schedDayName, schedDaysLabel, setLang, t, toneVar } from "../../shared.js";
import { HELP } from "../../help.js";
import { RK_NUM } from "../../fields.js";
import { getLang } from "../../i18n.js";
import { RK_GROUP_META, RK_IMPLICIT, RK_LAYOUT_COLORS, RK_GROUP_ORDER, RK_FACADES, rkFacadeName } from "./const.js";

export const RoomMethods = {
  _room(r) {
    const a = r.attrs, s = a.settings || {}, sib = r.sib;
    // Überwachungsraum: kein Thermostat, also nichts anzeigen, was einen Sollwert regelt.
    const mon = a.monitor === true;
    const cfgRoom = this._cfgRoom(r);
    const id = s.entry_id;
    const scope = `room:${id}`;
    const sync = RK_SYNC[a.sync] || ["–", "off"];
    const contacts = (a.window_entities || []).map((w) => { const st = this._st(w); const open = !!(st && rkWindowOpen(this._hass, w)); return `<span class="chip2" style="--c:${open ? "var(--rk-air)" : "var(--rk-off)"}"><i></i>${esc(this._name(w).replace(/^.*?(fenster|window)/i, (m, x) => x))} · ${open ? t("offen") : t("zu")}</span>`; }).join("") || `<span class="v mute">${t("keine")}</span>`;
    const offTxt = a.offset !== undefined && a.offset !== null ? t("aktuell {v} °C", { v: (a.offset > 0 ? "+" : "") + fmt(a.offset, 1) }) : "";
    const comfort = this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature;
    const roomType = this._roomOpt(r, "room_type") ?? s.room_type;
    const sbShort = this._roomOpt(r, "setback_short") ?? s.setback_short;
    const sbLong = this._roomOpt(r, "setback_long") ?? s.setback_long;
    const wOpen = this._roomOpt(r, "window_open_delay") ?? s.window_open_delay;
    const wClose = this._roomOpt(r, "window_close_delay") ?? s.window_close_delay;
    const nightMode = this._roomOpt(r, "night_airing") ?? s.night_airing ?? "auto";
    const moldMode = this._roomOpt(r, "mold_mode") ?? s.mold_mode ?? "strict";
        const virtMode = this._roomOpt(r, "virtual_window") ?? s.virtual_window ?? "auto";
    const editable = this._admin && cfgRoom;
    const push = Object.keys((this._cfg && this._cfg.hub && this._cfg.hub.options.recipients) || {});
    const plan = a.plan_reason && a.plan_reason !== "normal" ? planText(a, false) : null;
    const rIssues = ((this._cfg && this._cfg.hub && this._cfg.hub.state && this._cfg.hub.state.issues) || []).filter((i) => i.entry_id === id);
    return `<div class="groups">
      ${rIssues.length ? this._grp("heating", "Gesundheit", "mdi:heart-pulse", rIssues.some((i) => i.severity === "alert") ? "cold" : "warn", rkIssueList(rIssues, false), "span") : ""}
      ${a.monitor ? this._grp("room", "Überwachung", "mdi:eye-outline", "eco", [
        this._row("Kein Thermostat", this._v("nur Messen und Hinweise", true), "Temperatur, Feuchte, CO₂ und Lüftungshinweise – ohne Heizungsregelung. Ein Thermostat lässt sich später in der Integration nachtragen."),
      ].join(""), "span") : ""}
      ${a.monitor ? "" : this._grp("room", "Temperatur", "mdi:thermometer", "heat", [
        plan ? `<div class="status"><span class="chip" style="--tone:var(--rk-eco)"><ha-icon icon="mdi:information-outline"></ha-icon>${plan}</span></div>` : "",
        this._row("Wunschtemperatur", editable ? this._num(scope, "comfort_temperature", comfort) : this._v(`${fmt(comfort)} °C`), "beim Einschalten und als Grundwert"),
        this._row("Raumtyp", editable ? this._select(scope, "room_type", Object.entries(RK_ROOM_TYPES).map(([k, v]) => ({ id: k, name: v })), roomType) : this._v(RK_ROOM_TYPES[roomType] || "–"),
          t("jederzeit änderbar – Standardwerte des neuen Typs werden übernommen, eigene Werte bleiben")),
        ((this._cfg && this._cfg.homes) || []).length > 1 ? this._row("Wohnung", editable ? this._select(scope, "home", this._cfg.homes.map((h) => ({ id: h.entry_id, name: h.name })), a.home || "") : this._v(esc(a.home_name || "–")), "Raum gehört zu dieser Wohnung (Bewohner, Zone, Empfänger)") : "",
        this._row("Absenkung „kurz weg“", editable ? this._num(scope, "setback_short", sbShort) : this._v(`${fmt(sbShort)} °C`), "wenn alle weg sind"),
        this._row("Absenkung „länger weg“", editable ? this._num(scope, "setback_long", sbLong) : this._v(`${fmt(sbLong)} °C`), "ab 24 h oder Urlaub – Schimmelschutz hält feuchte Räume wärmer"),
        this._row("Aufheizen", this._v(s.heatup && s.heatup.minutes_2k != null ? t("~{m} min für +2 °C", { m: s.heatup.minutes_2k }) : t("lernt noch ({n}/3)", { n: (s.heatup && s.heatup.episodes) || 0 }), !(s.heatup && s.heatup.minutes_2k != null)),
          s.heatup && s.heatup.rate ? t("{r} °C/h bei aktuellem Wetter · aus {n} Aufheizvorgängen · steuert, wann vorgeheizt wird", { r: fmt(s.heatup.rate, 1), n: s.heatup.episodes }) : "danach heizt die Wohnung rechtzeitig vor, bevor jemand ankommt"),
        this._more("temp-more", "Weitere Einstellungen", [
        (() => {
          const pm = this._roomOpt(r, "preheat_mode") ?? "auto";
          const rows = [this._row("Vorheizen", editable ? this._segs(scope, "preheat_mode", RK_PREHEAT, pm) : this._v(RK_PREHEAT[pm] || "–"),
            pm === "off" ? t("heizt erst zum Beginn des Zeitfensters – der Raum ist dann noch kalt") : pm === "auto" ? t("startet so früh, wie die gelernte Aufheizzeit es verlangt") : pm === "clock" ? t("startet nicht vor der eingestellten Uhrzeit – zum Beginn evtl. noch nicht ganz warm") : t("startet höchstens so viele Minuten vor dem Zeitfenster"))];
          if (pm === "clock") {
            const cur = this._roomOpt(r, "preheat_not_before") ?? "05:00";
            const items = Array.from({ length: 24 }, (_x, h) => ({ id: `${String(h).padStart(2, "0")}:00`, name: t("ab {h}:00", { h }) }));
            rows.push(this._row("… nicht vor", editable ? this._select(scope, "preheat_not_before", items, cur) : this._v(cur)));
          }
          if (pm === "lead") {
            const lead = this._roomOpt(r, "preheat_lead_min") ?? 90;
            rows.push(this._row("… höchstens", editable ? this._num(scope, "preheat_lead_min", lead) : this._v(`${lead} min`), t("so viele Minuten vor dem Zeitfenster")));
          }
          return rows.join("");
        })(),
        (() => {
          const qm = this._roomOpt(r, "quiet_mode") ?? "auto";
          return this._row("Nachtabsenkung", editable ? this._segs(scope, "quiet_mode", RK_QUIET, qm) : this._v(RK_QUIET[qm] || "–"),
            qm === "off" ? t("wird nachts nicht abgesenkt") : qm === "on" ? t("wird abgesenkt, sobald Ruhezeit ist oder der Schalter „Nachtruhe“ an ist") : t("wie bisher: nur Schlafzimmer und selten genutzte Räume"));
        })(),
        this._row("Sonnenseite", editable ? this._optToggle(scope, "solar_gain", !!(this._roomOpt(r, "solar_gain") ?? s.solar_gain)) : this._v(s.solar_gain ? "ja" : "nein"),
          a.plan_reason === "solar" ? "gerade: Sonne erwartet – 1 °C weniger" : t("bei Sonne 1 °C weniger heizen – die Sonne wärmt mit")),
        (() => {
          const fac = this._roomOpt(r, "solar_facade") ?? s.solar_facade ?? "";
          return this._row("Sonne kommt aus",
            editable ? this._select(scope, "solar_facade", RK_FACADES(), fac) : this._v(rkFacadeName(fac)),
            t("Richtung, in die die Fenster dieses Raums zeigen – vereinfacht, freie Sicht vorausgesetzt. Haus, Baum, Balkon oder ein tiefes Gewände davor zählt nicht mit; dann lieber leer lassen (nur Vorhersage). Bei zwei Fensterseiten: die mit der größeren Glasfläche."),
          );
        })(),
        (() => {
          const persons = ((this._cfg && this._cfg.choices && this._cfg.choices.persons) || []);
          if (!persons.length) return "";
          const cur = this._roomOpt(r, "room_persons") ?? s.room_persons ?? [];
          return this._row("Gilt für Personen",
            `<div class="chips">${persons.map((p) => `<button class="chip2 ${cur.includes(p.id) ? "" : "off"}" data-roomperson="${p.id}" data-entry="${id}" ${editable ? "" : "disabled"}><i></i>${esc(p.name)}</button>`).join("")}</div>`,
            cur.length ? t("nur wenn eine dieser Personen zu Hause ist – sonst wird der Raum abgesenkt") : t("keine Auswahl = der Raum gilt allen Bewohnern"));
        })(),
        ].join(""), r, ["preheat_mode", "quiet_mode", "solar_gain", "solar_facade", "room_persons"]),
      ].join(""))}
      ${mon ? "" : this._scheduleGroup(r, id, editable)}
      ${this._grp("air", "Lüften & Feuchte", "mdi:water-percent", "air", [
        sib.humidity_limit ? this._row("Feuchtegrenze", this._numStepper(sib.humidity_limit, " %", 0), "ab hier: „Bitte lüften“") : this._row("Feuchtefühler", this._v("keiner", true)),
        this._row("Mindesttemperatur beim Lüften", this._numStepper(sib.min_temp, " °C", 1), "darunter: „Raum kühlt aus“"),
        this._row("Jetzt", this._v(a.current_humidity != null ? t("{h} % · Taupunkt {d} °C", { h: fmt(a.current_humidity, 0), d: fmt(a.dew_point) }) : "–")),
        this._row("Empfohlene Lüftdauer", this._v(a.recommended_minutes ? `${a.recommended_minutes} min` : "–"), a.outdoor_temperature != null ? t("bei {v} °C draußen", { v: fmt(a.outdoor_temperature) }) : ""),
        this._more("air-more", "Weitere Einstellungen", [
        this._row("Max. Abkühlung beim Lüften", this._numStepper(sib.max_drop, " °C", 1)),
        s.co2_sensor ? this._row(
          "CO₂-Grenze",
          editable
            ? this._select(
                scope,
                "co2_limit",
                [800, 1000, 1200, 1500].map((v) => ({ id: String(v), name: `${v} ppm` })),
                String(this._roomOpt(r, "co2_limit") ?? 1000)
              )
            : this._v(`${this._roomOpt(r, "co2_limit") ?? 1000} ppm`),
          t("1000 ppm ist der klassische Richtwert – in einem Wohnzimmer mit mehreren Personen liegt man abends dauerhaft darüber, 1200 ppm sind dort realistischer")
        ) : "",
        ].join(""), r, ["co2_limit"]),
      ].join(""))}
      ${mon ? "" : this._grp("air", "Schimmelschutz", "mdi:shield-home-outline", "ok", [
        this._row(
          "Schimmelschutz",
          editable ? this._segs(scope, "mold_mode", RK_MOLD, moldMode) : this._v(RK_MOLD[moldMode] || "–"),
          moldMode === "strict"
            ? t("hebt den Sollwert so weit an, dass die kälteste Wandstelle unter 80 % Feuchte bleibt (DIN 4108-2) – begrenzt durch den Zuschlag darunter")
            : moldMode === "wish"
              ? t("hebt nur bis zur Wunschtemperatur an – tiefer wird nicht abgesenkt, aber auch nicht darüber geheizt")
              : t("kein Feuchte-Boden: der Raum fährt genau den eingestellten Wert – bei hoher Feuchte droht Schimmel an kalten Wänden"),
        ),
        this._more("mold-more", "Weitere Einstellungen", [
        moldMode !== "off"
          ? this._row(
              "Höchstens anheben um",
              editable
                ? this._num(scope, "mold_cap", this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 2.5)
                : this._v(`${fmt(this._roomOpt(r, "mold_cap") ?? s.mold_cap ?? 2.5)} K`),
              t("Heizen löst kein Feuchteproblem: über diesem Zuschlag wird nicht weiter geheizt, sondern zum Lüften geraten (nachts 1,5 K)"),
            )
          : "",
        this._row(
          "Bauart",
          editable
            ? this._select(scope, "wall", Object.entries(RK_WALL).map(([k, v]) => ({ id: k, name: v })), this._roomOpt(r, "wall") ?? "auto")
            : this._v(RK_WALL[this._roomOpt(r, "wall") ?? "auto"]),
          t("bestimmt, wie kalt die kälteste Wandstelle wird: eine Außenecke braucht mehr Schutz als eine Innenwand"),
        ),
        ].join(""), r, ["mold_cap", "wall"]),
      ].join(""))}
      ${a.monitor ? "" : this._sourceGroup(r, id, editable)}
      ${this._grp("air", "Fenster", "mdi:window-open-variant", "ok", [
        mon ? "" : this._row("Heizung bei offenem Fenster pausieren", this._toggle(sib.window_logic)),
        this._row("Kontakte", `<div class="chips">${contacts}</div>`),
        this._more("win-more", "Weitere Einstellungen", [
        mon ? "" : this._row("Pause nach", editable ? this._num(scope, "window_open_delay", wOpen) : this._v(`${wOpen ?? "–"} s`)),
        mon ? "" : this._row("Weiter nach", editable ? this._num(scope, "window_close_delay", wClose) : this._v(`${wClose ?? "–"} s`)),
        this._row("Schlafen bei offenem Fenster", editable ? this._segs(scope, "night_airing", RK_NIGHT, nightMode) : this._v(RK_NIGHT[nightMode] || "–"),
          nightMode === "auto" ? (["bedroom", "rarely_used"].includes(roomType) ? "Automatisch: ja, weil Schlafraum" : "Automatisch: nein, kein Schlafraum") : "abends geöffnet = Nachtlüften: keine Lüft-Hinweise, Heizung wartet"),
        mon ? "" : this._row("Offenes Fenster an Temperatursturz erkennen", editable ? this._segs(scope, "virtual_window", RK_NIGHT, virtMode) : this._v(RK_NIGHT[virtMode] || "–"),
          (a.window_virtual ? t("gerade: Fenster vermutlich offen · ") : "") + t(virtMode === "auto" ? (s.virtual_active ? "Automatisch: aktiv (kein Kontakt erreichbar)" : "Automatisch: aus, der Kontakt meldet zuverlässig") : "fällt es in 6 min um 1 °C, pausiert die Heizung bis es wieder wärmer wird")),
        ].join(""), r, ["window_open_delay", "window_close_delay", "night_airing", "virtual_window"]),
      ].join(""))}
      ${this._airingGroup(r, id, editable)}
      ${this._presenceGroup(r, id, editable)}
      ${this._learnRoom(r)}
      ${this._lightGroup(r, id, editable)}
      ${this._grp("notify", "Benachrichtigungen", "mdi:bell-outline", "warn", [
        this._row("Hinweise für diesen Raum", this._toggle(sib.notifications)),
        this._row(
          "Höchstens je Tag",
          editable
            ? this._select(
                scope,
                "notify_cap",
                [0, 2, 3, 5, 10].map((v) => ({ id: String(v), name: v === 0 ? t("unbegrenzt") : t("{n} je Tag", { n: v }) })),
                String(this._roomOpt(r, "notify_cap") ?? 3)
              )
            : this._v(this._roomOpt(r, "notify_cap") === 0 ? t("unbegrenzt") : t("{n} je Tag", { n: this._roomOpt(r, "notify_cap") ?? 3 })),
          t("gilt für wiederkehrende Hinweise (Bitte lüften, Fenster bleibt offen) – Fenster schließen und Luft ausgetauscht bleiben frei")
        ),
        this._row("Empfänger", push.length ? `<div class="chips">${push.map((tg) => `<span class="chip2"><i></i>${esc(rkPretty(tg))}</span>`).join("")}</div>` : this._v("niemand", true), "zentral unter Allgemein → Wer bekommt was"),
      ].join(""))}
      ${this._grp("heating", mon ? "Fühler & Sensoren" : "Thermostat & Fühler", mon ? "mdi:thermometer-lines" : "mdi:radiator", "off", [
        mon ? "" : this._row("Thermostat", this._v(esc(this._name(s.trv))), [((s.extra_trvs || []).length ? "Haupt-Thermostat" : ""), s.valve_reported === false ? t("meldet keine Ventilöffnung") : ""].filter(Boolean).join(" · ")),
        !mon && (s.extra_trvs || []).length ? this._row("Weitere Thermostate", `<div class="chips">${s.extra_trvs.map((x) => `<span class="chip2" style="--c:${!x.available ? "var(--rk-cold)" : x.sync === "ok" ? "var(--rk-ok)" : "var(--rk-warn)"}" title="${esc(x.entity_id)}${x.setpoint_expected != null ? ` · ${t("erwartet {v}°", { v: fmt(x.setpoint_expected) })}` : ""}"><i></i>${esc(x.name)} · ${x.available ? `${fmt(x.temperature)}° → ${fmt(x.setpoint)}°${x.valve != null ? ` · ${fmt(x.valve, 0)} %` : ""}` : t("nicht erreichbar")}</span>`).join("")}</div>`, "bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert") : "",
        this._row("Temperaturfühler", this._v(esc(this._name(a.temperature_sensor)))),
        this._row("Feuchtefühler", this._v(a.humidity_entity ? esc(this._name(a.humidity_entity)) : "keiner", !a.humidity_entity)),
        this._row("CO₂-Sensor", this._v(s.co2_sensor ? esc(this._name(s.co2_sensor)) : "keiner", !s.co2_sensor), s.co2_sensor ? t("Grenze unter Lüften & Feuchte") : ""),
        this._row("Feinstaubfühler", this._v(s.pm25_sensor ? esc(this._name(s.pm25_sensor)) : "keiner", !s.pm25_sensor), s.pm25_sensor ? "PM2,5 – ab 35 µg/m³: „Bitte lüften“" : ""),
        mon ? "" : this._row("Übertragung", `<span class="v" style="color:${toneVar(sync[1])}">● ${sync[0]}</span>`, t("prüft nach {s} s · bis zu {n} Wiederholungen", { s: s.sync_verify_delay ?? "–", n: s.sync_max_retries ?? "–" })),
        this._more("dev-more", "Technik", [
        mon ? "" : this._row(
          "Schnellere Abfrage",
          editable ? this._optToggle(scope, "fast_poll", !!(this._roomOpt(r, "fast_poll") ?? s.fast_poll)) : this._v(this._roomOpt(r, "fast_poll") ?? s.fast_poll ? t("an") : t("aus")),
          t("fragt das Thermostat alle 2 Minuten aktiv ab – für träge Geräte (Homematic & Co.), kostet Funk und Batterie")
        ),
        mon ? "" : this._row(
          "Antwortzeit des Geräts",
          editable
            ? this._select(
                scope,
                "trv_interval",
                [
                  { id: "0", name: t("automatisch lernen") },
                  { id: "1", name: t("1 Minute") },
                  { id: "5", name: t("5 Minuten") },
                  { id: "15", name: t("15 Minuten") },
                  { id: "30", name: t("30 Minuten") },
                ],
                String(this._roomOpt(r, "trv_interval") ?? s.trv_interval ?? 0)
              )
            : this._v(this._roomOpt(r, "trv_interval") || t("automatisch")),
          t("wie lange das Gerät schweigen darf, ohne als ausgefallen zu gelten – automatisch lernt es aus den Funkpausen (FRITZ!DECT braucht ~15 Minuten)")
        ),
        mon ? "" : this._row("Kalibrierung", editable
          ? this._segs(scope, "calibration_mode", s.calibration_entity
              ? RK_CAL
              : { target: RK_CAL.target, none: RK_CAL.none }, s.calibration_mode || "target")
          : this._v(RK_CAL[s.calibration_mode] || "–"),
        s.calibration_mode === "target"
          ? t("auch „Abgleich“ genannt: das Gerät kennt keinen Offset – Raumklima verschiebt stattdessen den Sollwert um die Abweichung zwischen Fühler und Thermostat")
          : offTxt),
        mon ? "" : this._row("Einschalten mit", this._v(s.on_preset === "auto_detect" || !s.on_preset ? t("Automatisch") : t("Preset „{p}“", { p: esc(s.on_preset) }))),
        mon ? "" : this._row("Ausschalten über", this._v(RK_OFF[s.off_method] || s.off_method || "–")),
        mon ? "" : this._row("Drehen am Thermostat übernehmen", this._v(s.follow_trv ? t("ja") : t("nein"))),
        ].join(""), r, ["fast_poll", "trv_interval"]),
      ].join(""), "span cols")}
    </div>
    <div class="foot">
      ${sib.calibrate ? `<button class="btn" data-press="${sib.calibrate}" style="--c:var(--rk-heat)"><ha-icon icon="mdi:tune-vertical"></ha-icon>${t("Jetzt kalibrieren")}</button>` : ""}
      <button class="btn primary" data-nav="/config/integrations/integration/raumklima"><ha-icon icon="mdi:cog"></ha-icon>${t("Geräte & Technik ändern")}</button>
    </div>
    <div class="hint">${t("Werte mit + / − werden nach kurzer Pause gespeichert; der Raum übernimmt sie sofort. Geräte (Thermostat, Fühler, Kontakte) und Technik änderst du unter „Geräte & Technik ändern“ → Zahnrad beim Raum „{r}“.", { r: esc(r.name) })}</div>`;
  },

  _srcList(id) {
    const room = (this._rooms || []).find((x) => (x.attrs.settings || {}).entry_id === id);
    const cur = (room && (this._roomOpt(room, "heat_sources") ?? (room.attrs.settings || {}).heat_sources)) || [];
    return cur.map((x) => ({ ...x }));
  },

  _sourceGroup(r, id, editable) {
    const s = r.attrs.settings || {};
    const scope = `room:${id}`;
    const sources = (r.attrs.heat_sources || []).filter((x) => x.id !== "main");
    const all = (this._cfg && this._cfg.choices && this._cfg.choices.climate) || [];
    const sigs = (this._cfg && this._cfg.choices && this._cfg.choices.signals) || [];
    const list = ((this._roomOpt(r, "heat_sources") ?? s.heat_sources ?? [])).map((x) => ({ ...x }));
    const used = new Set(sources.map((x) => x.entity));
    const avail = all.filter((x) => !used.has(x.id));
    const rows = [
      this._row("Haupt-Thermostat", this._v(esc(this._name(s.trv || "")), true), t("führt den Raum; die anderen Quellen folgen der Auswahl")),
    ];
    list.forEach((src, idx) => {
      const trigOpts = [{ id: "", name: t("– keiner –") }, ...sigs];
      const off = src.untouched ? "" : " off";
      rows.push(this._row(
        esc(src.name || src.entity),
        `<div class="chips">
          <select class="sel" data-srcfield="${id}|${idx}|type">
            <option value="trv"${src.type !== "ac" ? " selected" : ""}>${t("Thermostat")}</option>
            <option value="ac"${src.type === "ac" ? " selected" : ""}>${t("Klimaanlage")}</option>
          </select>
          <select class="sel" data-srcfield="${id}|${idx}|trigger">
            ${trigOpts.map((o) => `<option value="${esc(o.id)}"${(src.trigger || "") === o.id ? " selected" : ""}>${esc(o.name)}</option>`).join("")}
          </select>
          <button class="chip2${off}" data-srcuntouched="${id}|${idx}"><i></i>${t("unangetastet")}</button>
          <button class="mini x" data-srcdel="${id}|${idx}" title="${t("entfernen")}">✕</button>
        </div>`,
        `${esc(src.entity)} · ${t("Offset")} ${src.offset > 0 ? "+" : ""}${fmt(src.offset, 1)} K`
      ));
      rows.push(this._row("… Offset", editable
        ? `<div class="stepper"><button data-srcstep="${id}|${idx}|-0.5" aria-label="${t("weniger")}">−</button><span class="v">${src.offset > 0 ? "+" : ""}${fmt(src.offset, 1)} K</span><button data-srcstep="${id}|${idx}|0.5" aria-label="${t("mehr")}">+</button></div>`
        : this._v(`${src.offset > 0 ? "+" : ""}${fmt(src.offset, 1)} K`),
        t("fest für diese Quelle – z. B. +0,5 K, damit sie früher anläuft")));
    });
    if (!list.length) rows.push(this._row("Weitere Quellen", this._v(t("keine"), true), t("Thermostate oder Klimaanlagen, die mit dem Raum laufen")));
    if (editable && avail.length) {
      rows.push(`<div class="row"><div class="l"><span class="lbl"></span></div><div class="addrow"><select class="sel" id="addSrc-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-srcadd="${id}" style="--c:var(--rk-eco)"><ha-icon icon="mdi:plus"></ha-icon>${t("Quelle hinzufügen")}</button></div></div>`);
    }
    return this._grp("heating", "Heizquellen", "mdi:radiator", "heat", rows.join(""), "span");
  },

  _presenceGroup(r, id, editable) {
    const a = r.attrs, s = a.settings || {};
    const scope = `room:${id}`;
    const kinds = s.presence_sensors || {};
    const list = this._roomOpt(r, "presence_sensors") ?? Object.keys(kinds);
    const all = (this._cfg && this._cfg.choices && this._cfg.choices.presence) || [];
    const info = Object.fromEntries(all.map((x) => [x.id, x]));
    const pk = this._roomOpt(r, "presence_kind") ?? s.presence_kind ?? "auto";
    const kindOf = (e) => (pk === "mmwave" || pk === "pir" ? pk : kinds[e] || (info[e] && info[e].kind) || "pir");
    const badge = (k) => `<b class="kb">${k === "mmwave" ? "mmWave" : "PIR"}</b>`;
    const chips = list.map((e) => { const on = this._st(e) && this._st(e).state === "on"; return `<span class="chip2" style="--c:${on ? "var(--rk-ok)" : "var(--rk-off)"}"><i></i>${esc((info[e] && info[e].name) || this._name(e))} ${badge(kindOf(e))}${editable ? ` <button class="mini x" data-presrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`; }).join("");
    const avail = all.filter((x) => !list.includes(x.id));
    const addRow = editable && avail.length ? `<div class="addrow"><select class="sel" id="addPres-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)} (${x.kind === "mmwave" ? "mmWave" : "PIR"})</option>`).join("")}</select><button class="btn" data-presadd="${id}" style="--c:var(--rk-ok)"><ha-icon icon="mdi:plus"></ha-icon>${t("Melder hinzufügen")}</button></div>` : "";
    if (!list.length) {
      return this._grp("presence", "Präsenzmelder", "mdi:motion-sensor", "ok", [
        this._row("Melder", this._v("keine", true), "Melder hinzufügen – dann kann der Raum bei Anwesenheit wärmer werden"),
        addRow,
      ].join(""));
    }
    const eco = this._roomOpt(r, "room_eco") ?? s.room_eco ?? "auto";
    const after = this._roomOpt(r, "room_eco_after") ?? s.room_eco_after ?? 30;
    const drop = this._roomOpt(r, "room_eco_drop") ?? s.room_eco_drop ?? 1.5;
    const pt = Number(this._roomOpt(r, "presence_target") || 0);
    const pd = Number(this._roomOpt(r, "presence_delay_min") ?? 5);
    const pr = Number(this._roomOpt(r, "presence_release_min") ?? 5);
    const pir = !!this._roomOpt(r, "presence_pir");
    const wish = Number(this._roomOpt(r, "comfort_temperature") ?? a.comfort_temperature ?? 20);
    const counting = list.filter((e) => kindOf(e) === "mmwave" || pir);
    const hasPir = list.some((e) => kindOf(e) === "pir");

    // Zustand: belegt / leer – und was die Anwesenheits-Temperatur gerade macht
    const since = a.presence_since ? Math.max(0, Math.floor((Date.now() - Date.parse(a.presence_since)) / 60000)) : null;
    let state = a.occupied === true ? t("jemand im Raum") : a.occupied === false ? (a.room_eco ? t("leer – abgesenkt") : t("leer")) : t("unbekannt");
    let tone = a.occupied ? "var(--rk-ok)" : "var(--rk-off)";
    if (pt && a.presence_heat) {
      state = t("heizt auf {t} – jemand im Raum", { t: `${fmt(pt)} °C` });
      tone = "var(--rk-heat)";
    } else if (pt && since != null) {
      state = t("jemand da seit {m} min – ab {d} min {t}", { m: since, d: pd, t: `${fmt(pt)} °C` });
    }
    const warn = [];
    if (pt && !counting.length) warn.push(t("Nur Bewegungsmelder (PIR) gewählt – für die Anwesenheits-Temperatur unten „auch Bewegungsmelder“ einschalten oder einen mmWave-Melder hinzufügen."));
    if (pt && pt <= wish) warn.push(t("„Bei Anwesenheit“ liegt nicht über der Wunschtemperatur ({w}) – dann ändert sich nichts. Die Wunschtemperatur ist der Wert, wenn niemand im Raum ist.", { w: `${fmt(wish)} °C` }));

    const ptCtl = !editable
      ? this._v(pt ? `${fmt(pt)} °C` : t("aus"), !pt)
      : pt
        ? `<span class="inline">${this._num(scope, "presence_target", pt)} <button class="mini x" data-setopt="${scope}" data-key="presence_target" data-v="0" title="${t("ausschalten")}">${t("aus")}</button></span>`
        : `<button class="btn" data-setopt="${scope}" data-key="presence_target" data-v="${Math.min(30, wish + 2)}" style="--c:var(--rk-heat)"><ha-icon icon="mdi:account-arrow-up-outline"></ha-icon>${t("Einschalten ({t})", { t: `${fmt(Math.min(30, wish + 2))} °C` })}</button>`;
    const rows = [
      `<div class="status"><span class="chip" style="--tone:${tone}"><ha-icon icon="${a.occupied ? "mdi:account" : "mdi:account-off-outline"}"></ha-icon>${state}</span></div>`,
      ...warn.map((w) => `<div class="hint warn">${w}</div>`),
      this._row("Melder", `<div class="chips">${chips}</div>`, "mmWave (Radar) sieht auch Stillsitzende · PIR nur Bewegung"),
      addRow,
      this._row("Bei Anwesenheit", ptCtl,
        pt ? t("so warm, solange jemand im Raum ist – danach wieder die Temperatur von vorher") : t("aus – der Raum heizt nach Wunsch und Zeitplan")),
      pt ? this._row("… wenn belegt seit", editable ? this._num(scope, "presence_delay_min", pd) : this._v(`${pd} min`), t("so lange muss jemand im Raum sein – kurz Durchgehen zählt nicht (0 = sofort)")) : "",
      pt ? this._row("… zurück nach", editable ? this._num(scope, "presence_release_min", pr) : this._v(`${pr} min`), t("so lange ohne Belegung, dann gilt wieder die Temperatur von vorher – kurz rausgehen unterbricht nicht")) : "",
    ];
    const more = [
      this._row("Art", editable ? this._segs(scope, "presence_kind", RK_PKIND, pk) : this._v(RK_PKIND[pk]), "Automatisch: Bewegung = PIR, Anwesenheit/Belegung = mmWave. Für „Raum leer“: 3 min (mmWave) bzw. 20 min (PIR) ohne Meldung"),
      pt && hasPir ? this._row("… auch Bewegungsmelder", editable ? this._optToggle(scope, "presence_pir", pir) : this._v(pir ? t("ja") : t("nein")), t("PIR sieht auch Haustiere und nach ein paar Minuten Stillsitzen niemanden mehr – dann „zurück nach“ eher 20 min")) : "",
      this._row("Leeren Raum absenken", editable ? this._segs(scope, "room_eco", RK_NIGHT, eco) : this._v(RK_NIGHT[eco]),
        eco === "auto" ? (pt ? t("Automatisch: nein – „Bei Anwesenheit“ ist eingestellt, die Wunschtemperatur ist schon der Wert für den leeren Raum") : s.room_eco_enabled ? "Automatisch: ja (mmWave, passender Raumtyp)" : "Automatisch: nein – nur Wohnraum, Küche, selten genutzt und nur mit mmWave") : ""),
      eco === "on" || (eco === "auto" && s.room_eco_enabled) ? this._row("… wenn leer seit", editable ? this._num(scope, "room_eco_after", after) : this._v(`${after} min`)) : "",
      eco === "on" || (eco === "auto" && s.room_eco_enabled) ? this._row("… um", editable ? this._num(scope, "room_eco_drop", drop) : this._v(`${fmt(drop)} °C`), "nie unter „kurz weg“ und den Schimmelschutz; kommt jemand rein, sofort zurück") : "",
    ];
    rows.push(this._more("pres-more", "Weitere Einstellungen", more.join(""), r, ["presence_kind", "presence_pir", "room_eco", "room_eco_after", "room_eco_drop"]));
    return this._grp("presence", "Präsenzmelder", "mdi:motion-sensor", "ok", rows.join(""));
  },

  _lightGroup(r, id, editable) {
    const s = r.attrs.settings || {};
    const lights = this._roomOpt(r, "signal_lights") ?? s.signal_lights ?? [];
    const sigs = this._roomOpt(r, "light_signals") ?? s.light_signals ?? ["open", "close"];
    const all = (this._cfg && this._cfg.choices && this._cfg.choices.lights) || [];
    const names = Object.fromEntries(all.map((x) => [x.id, x.name]));
    const chips = lights.map((e) => `<span class="chip2" style="--c:var(--rk-air)"><i></i>${esc(names[e] || this._name(e))}${editable ? ` <button class="mini x" data-lightrm="${esc(e)}" data-entry="${id}" title="${t("entfernen")}">✕</button>` : ""}</span>`).join("");
    const avail = all.filter((x) => !lights.includes(x.id));
    const sigChips = Object.entries(RK_LIGHT_SIGNALS).map(([k, [c, l]]) => `<button class="chip2 ${sigs.includes(k) ? "" : "off"}" style="--c:${c}" data-lsig="${k}" data-entry="${id}" ${editable ? "" : "disabled"}><i></i>${l}</button>`).join("");
    return this._grp("notify", "Lichtsignal", "mdi:lightbulb-on-outline", "air", [
      this._row("Lampen", `<div class="chips">${chips || this._v("keine", true)}</div>`, "blinken 3× in der Farbe des Hinweises, danach wie vorher"),
      editable && avail.length ? `<div class="addrow"><select class="sel" id="addLight-${id}">${avail.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select><button class="btn" data-lightadd="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:lightbulb-plus-outline"></ha-icon>${t("Lampe hinzufügen")}</button></div>` : "",
      this._row("Blinken bei", `<div class="chips">${sigChips}</div>`, "Blau = lüften · Orange = schließen · Grün = fertig · Rot = Problem"),
      lights.length && this._admin ? this._row("Ausprobieren", `<button class="btn" data-lighttest="${id}" style="--c:var(--rk-air)"><ha-icon icon="mdi:play"></ha-icon>${t("Test")}</button>`) : "",
      `<div class="hint">${t("Nicht in der Ruhezeit, nicht beim Schlafen mit offenem Fenster und nicht, wenn niemand zu Hause ist. Lampen ohne Farbe blinken einfach hell.")}</div>`,
    ].join(""));
  },

  // 24-h-Balken: 96 Viertelstunden, Höhe = Anteil der Tage mit Anwesenheit
  _presenceBars(arr) {
    if (!Array.isArray(arr) || !arr.length) return this._v("–", true);
    const cells = arr.map((v) => `<i style="height:${Math.max(8, Math.round(v * 100))}%;opacity:${(0.18 + v * 0.82).toFixed(2)}"></i>`).join("");
    return `<div class="pbars" title="${t("Anteil der Tage mit jemand zu Hause")}">${cells}</div>`;
  },

  _presenceText(arr) {
    if (!Array.isArray(arr) || !arr.length) return "";
    const on = arr.map((v, i) => (v >= 0.5 ? i : -1)).filter((i) => i >= 0);
    if (!on.length) return t("keine klare Zeit – meist niemand zu Hause");
    const lab = (i) => `${String(Math.floor(i / 4) % 24).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
    const a = lab(on[0]);
    const b = lab((on[on.length - 1] + 1) % 96);
    return t("meist {a}–{b} jemand zu Hause", { a, b });
  },
};
