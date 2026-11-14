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
