"""Sicherheits-Härtung nach externer Prüfung: kein Klartext-Login, Link-Schlüssel laufen ab."""

from __future__ import annotations

from datetime import timedelta
from pathlib import Path
from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.raumklima import mailer

from .conftest import FakeTrv
from .test_reports import _ready

MAIL_NONE = {
    "mail_server": "smtp.example.de",
    "mail_port": 25,
    "mail_security": "none",
    "mail_user": "ich@example.de",
    "mail_password": "geheim",
    "mail_from": "ich@example.de",
    "mail_to": "ich@example.de",
}


def test_klartext_login_wird_erkannt() -> None:
    assert mailer.insecure_login(MAIL_NONE) is True
    # ohne Benutzer (Relay im eigenen Netz) bleibt erlaubt
    assert mailer.insecure_login({**MAIL_NONE, "mail_user": ""}) is False
    assert mailer.insecure_login({**MAIL_NONE, "mail_security": "starttls"}) is False
    assert mailer.insecure_login({**MAIL_NONE, "mail_security": "ssl"}) is False


def test_send_verweigert_klartext_ohne_verbindung(monkeypatch: pytest.MonkeyPatch) -> None:
    """Ohne TLS wird nicht einmal verbunden – Passwort und Bericht bleiben im Haus."""
    aufgerufen = []
    monkeypatch.setattr(mailer.smtplib, "SMTP", lambda *a, **k: aufgerufen.append(a))
    monkeypatch.setattr(mailer.smtplib, "SMTP_SSL", lambda *a, **k: aufgerufen.append(a))
    with pytest.raises(mailer.MailError) as fehler:
        mailer.send(MAIL_NONE, "Betreff", "Text")
    assert "Verschlüsselung" in str(fehler.value)
    assert aufgerufen == []


def test_pruefung_meldet_gesperrte_anmeldung(monkeypatch: pytest.MonkeyPatch) -> None:
    """Der Prüfdialog zeigt „ohne Verschlüsselung“ als Fehler, bevor angemeldet wird."""
    fake = MagicMock()
    monkeypatch.setattr(mailer.smtplib, "SMTP", fake)
    steps = mailer.verify(MAIL_NONE)
    tls = next((s for s in steps if s["step"] == "tls"), None)
    assert tls is not None and tls["ok"] is False
    assert "gesperrt" in tls["msg"]
    assert not any(s["step"] == "login" for s in steps)


async def test_berichts_links_laufen_ab(
    hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path: Path, hass_client_no_auth: ClientSessionGenerator
) -> None:
    hub, _room = await _ready(hass, tmp_path)
    entry = await hub.runtime_data.pdf.async_create("week", current=True)
    client = await hass_client_no_auth()
    url = hub.runtime_data.pdf.signed_url(entry["file"])
    assert url and (await client.get(url)).status == 200

    # Schlüssel 40 Tage alt → Link gilt nicht mehr
    entry["token_at"] = (dt_util.now() - timedelta(days=40)).isoformat()
    assert (await client.get(url)).status == 404

    # Neuer Link erneuert den Schlüssel …
    neu = hub.runtime_data.pdf.signed_url(entry["file"])
    assert neu and neu != url
    assert (await client.get(neu)).status == 200
    # … der alte bleibt tot
    assert (await client.get(url)).status == 404
