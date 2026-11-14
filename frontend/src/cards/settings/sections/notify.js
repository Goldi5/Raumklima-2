import { esc, rkPretty, t, RK_KINDS } from "../../../shared.js";

export const NotifySectionMethods = {
  _groupRecipients(ctx) {
    const { ch } = ctx;
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
    return this._grp("notify", "Wer bekommt was", "mdi:account-voice", "air", `${cards}${addRow}`, "span");
  },

  _groupNotify(ctx) {
    const { H } = ctx;
    const notiRows = [
      this._row(
        "Lüfthinweise von",
        `<span class="v">${this._timeField("vent_from", this._hubOpt("vent_from") || "08:00:00")} – ${this._timeField("vent_to", this._hubOpt("vent_to") || "21:00:00")}</span>`,
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
      this._row("SMTP-Bericht", this._select("hub", "smtp_notify", (this._cfg.choices.notify || []), this._hubOpt("smtp_notify") || "", "– HA-SMTP wählen –"), t("versendet den PDF-Bericht über Home Assistants SMTP-Integration statt über den eigenen Mail-Client")),
      ].join(""), "hub", ["storm_gust_kmh", "storm_rain_mm", "repeat_minutes", "notify_on_failure", "smtp_notify"]),
    ].join("");
    return this._grp("notify", "Benachrichtigungen allgemein", "mdi:bell-cog-outline", "warn", notiRows);
  },
};
