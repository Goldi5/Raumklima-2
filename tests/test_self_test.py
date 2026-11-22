"""Selbsttest: Wohnung und Räume prüfen, ohne etwas zu ändern."""

from custom_components.raumklima import ws_hub


class _Connection:
    def __init__(self) -> None:
        self.result = None

    def send_result(self, _msg_id, result):
        self.result = result


def test_selbsttest_ohne_raeume(monkeypatch):
    monkeypatch.setattr(ws_hub, "get_hub", lambda _hass, _home: object())
    monkeypatch.setattr(ws_hub, "domain_data", lambda _hass: {"rooms": {}})
    hass = type("Hass", (), {"states": {}})()
    connection = _Connection()

    ws_hub.ws_self_test(hass, connection, {"id": 1})

    assert connection.result is not None
    assert connection.result["ok"] is False
    labels = [check["label"] for check in connection.result["checks"]]
    assert "Wohnung eingerichtet" in labels
    assert "Räume vorhanden" in labels


class _Room:
    def __init__(self, title, config, cal_mode="target", monitor=False):
        self.entry = type("Entry", (), {"title": title})()
        self.config = config
        self.cal_mode = cal_mode
        self.monitor = monitor


class _States:
    def get(self, _eid):
        return type("S", (), {"state": "20"})()


def _run(monkeypatch, rooms):
    monkeypatch.setattr(ws_hub, "get_hub", lambda _hass, _home: object())
    monkeypatch.setattr(ws_hub, "domain_data", lambda _hass: {"rooms": {str(i): r for i, r in enumerate(rooms)}})
    hass = type("Hass", (), {"states": _States()})()
    connection = _Connection()
    ws_hub.ws_self_test(hass, connection, {"id": 1})
    return {c["label"]: c for c in connection.result["checks"]}


def test_raum_ohne_fuehler_ist_kein_fehler(monkeypatch):
    """#68: ohne eigenen Raumfühler zählt der Thermostat-Fühler – grün, mit Hinweis."""
    checks = _run(monkeypatch, [_Room("Büro EG", {"trv": "climate.a", "temperature_sensor": ""})])
    assert checks["Temperaturfühler"]["ok"] is True
    assert "Büro EG" in checks["Temperaturfühler"]["text"]


def test_einstellungs_check_findet_widersprueche(monkeypatch):
    """#75: Raumfühler + „Ohne Abgleich“ und mehrere TRVs ohne Fühler werden benannt."""
    rooms = [
        _Room("Wohnzimmer", {"trv": "climate.a", "temperature_sensor": "sensor.t"}, cal_mode="none"),
        _Room("Gast 2", {"trv": "climate.b", "extra_trvs": ["climate.c"]}),
        _Room("Küche", {"trv": "climate.d", "temperature_sensor": "sensor.k"}),
    ]
    check = _run(monkeypatch, rooms)["Einstellungen stimmig"]
    assert check["ok"] is False
    assert "Wohnzimmer" in check["text"] and "Sollwert-Ausgleich" in check["text"]
    assert "Gast 2" in check["text"]
    assert "Küche" not in check["text"]
