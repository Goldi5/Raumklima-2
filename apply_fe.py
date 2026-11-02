import pathlib

R = pathlib.Path(".")


def rep(f, old, new, label, count=1):
    p = R / f
    s = p.read_text(encoding="utf-8")
    assert s.count(old) == count, f"{label}: {s.count(old)}"
    p.write_text(s.replace(old, new), encoding="utf-8")
    print(f"{label} ok")


# --- Übersichtskarte: echte Dashboards von der Zentrale holen -------------------
rep(
    "frontend/src/cards/overview.js",
    '''  set hass(hass) {
    this._hass = hass;
    setLang(hass);''',
    '''  set hass(hass) {
    this._hass = hass;
    setLang(hass);
    // Welche Dashboards gibt es wirklich? Die Zentrale weiß es verlässlicher als hass.dashboards.
    if (!this._dashAsked) {
      this._dashAsked = true;
      hass.callWS({ type: "raumklima/dashboards" })
        .then((r) => { this._known = new Set((r && r.dashboards) || []); this._render(); })
        .catch(() => {});
    }''',
    "overview fetch",
)

rep(
    "frontend/src/cards/overview.js",
    '''      const known = (this._hass && this._hass.dashboards) || {};
      return { ok: path === curPath || Object.prototype.hasOwnProperty.call(known, path), path };''',
    '''      const known = (this._hass && this._hass.dashboards) || {};
      const server = this._known instanceof Set ? this._known.has(path) : false;
      return { ok: path === curPath || server || Object.prototype.hasOwnProperty.call(known, path), path };''',
    "overview target",
)

# --- Einstellungen: Liste aus der config-Antwort nutzen ------------------------
rep(
    "frontend/src/cards/settings.js",
    '''  // Legt für eine neue Wohnung gleich ein Dashboard mit der Raumklima-Strategie an (Option A).''',
    '''  // Bekannte Dashboards: die Zentrale ist maßgeblich, hass.dashboards nur Ersatz.
  _dashKnown() {
    const list = (this._cfg && this._cfg.dashboards) || [];
    if (list.length) return Object.fromEntries(list.map((p) => [p, 1]));
    return this._hass.dashboards || {};
  }

  // Legt für eine neue Wohnung gleich ein Dashboard mit der Raumklima-Strategie an (Option A).''',
    "settings helper",
)

p = R / "frontend/src/cards/settings.js"
s = p.read_text(encoding="utf-8")
before = s.count("rkNeedsDashboard(this._hass.dashboards || {}")
assert before == 2, f"settings calls: {before}"
s = s.replace("rkNeedsDashboard(this._hass.dashboards || {}", "rkNeedsDashboard(this._dashKnown()")
s = s.replace(
    '''      if (this._hass.dashboards) {
        this._hass.dashboards[p] = this._hass.dashboards[p] || { title: name, mode: "storage", show_in_sidebar: true };
      }''',
    '''      if (this._hass.dashboards) {
        this._hass.dashboards[p] = this._hass.dashboards[p] || { title: name, mode: "storage", show_in_sidebar: true };
      }
      if (this._cfg && Array.isArray(this._cfg.dashboards) && !this._cfg.dashboards.includes(p)) this._cfg.dashboards.push(p);''',
    1,
)
p.write_text(s, encoding="utf-8")
print("settings calls ok")
