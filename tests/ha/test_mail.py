"""Mail-Versand direkt aus Raumklima (SMTP simuliert)."""

from __future__ import annotations

import smtplib
from unittest.mock import MagicMock, patch

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.raumklima import mailer

from .conftest import FakeTrv
from .test_reports import _ready

MAIL = {
    "report_email": "raumklima",
    "mail_server": "smtp.example.de",
    "mail_port": 587,
    "mail_security": "starttls",
    "mail_user": "ich@example.de",
    "mail_password": "geheim",
    "mail_to": "ich@example.de, partner@example.de",
}


def test_message_with_pdf(tmp_path) -> None:
    pdf = tmp_path / "Raumklima-Monat-2026-10.pdf"
    pdf.write_bytes(b"%PDF-1.4 test")
    msg = mailer.build_message(MAIL, "Heizbericht", "Text", [str(pdf)])
    assert msg["To"] == "ich@example.de, partner@example.de"
    att = [p for p in msg.iter_attachments()]
    assert att[0].get_filename() == pdf.name and att[0].get_content_type() == "application/pdf"


def test_send_uses_starttls_and_login() -> None:
    smtp = MagicMock()
    with patch.object(smtplib, "SMTP", return_value=smtp) as cls:
        mailer.send(MAIL, "Betreff", "Text")
    cls.assert_called_once_with("smtp.example.de", 587, timeout=20.0)
    inner = smtp
    inner.starttls.assert_called_once()
    inner.login.assert_called_once_with("ich@example.de", "geheim")
    inner.send_message.assert_called_once()


def test_friendly_errors() -> None:
    smtp = MagicMock()
    smtp.login.side_effect = smtplib.SMTPAuthenticationError(535, b"no")
    with patch.object(smtplib, "SMTP", return_value=smtp), pytest.raises(mailer.MailError, match="App-Passwort"):
        mailer.send(MAIL, "x", "y")
    with patch.object(smtplib, "SMTP", side_effect=OSError("Name or service not known")), pytest.raises(mailer.MailError, match="nicht erreichbar"):
        mailer.send(MAIL, "x", "y")
    with pytest.raises(mailer.MailError, match="nicht vollständig"):
        mailer.send({"mail_server": "x"}, "x", "y")


async def test_report_sent_by_builtin_mail(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    hub, _room = await _ready(hass, tmp_path, MAIL)
    pdf = hub.runtime_data.pdf
    entry = await pdf.async_create("month", current=True)
    with patch("custom_components.raumklima.reports.mail_send") as send:
        await pdf.async_send(entry)
    opts, subject, body, files = send.call_args.args
    assert opts["mail_password"] == "geheim"
    assert subject.startswith("Heizbericht")
    assert files == [str(tmp_path / "raumklima" / entry["file"])]


async def test_password_never_sent_to_card_and_kept(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_ws_client: WebSocketGenerator) -> None:
    hub, _room = await _ready(hass, tmp_path, MAIL)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/config"})
    opts = (await client.receive_json())["result"]["hub"]["options"]
    assert opts["mail_password"] == "" and opts["mail_password_set"] is True
    # leeres Passwort beim Speichern = altes behalten
    await client.send_json_auto_id({"type": "raumklima/hub/update", "changes": {"mail_password": "", "mail_to": "neu@example.de"}})
    assert (await client.receive_json())["success"]
    assert hub.options["mail_password"] == "geheim" and hub.options["mail_to"] == "neu@example.de"


async def test_ws_mail_test(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_ws_client: WebSocketGenerator) -> None:
    await _ready(hass, tmp_path, MAIL)
    client = await hass_ws_client(hass)
    with patch("custom_components.raumklima.websocket_api.mail_send") as send:
        await client.send_json_auto_id({"type": "raumklima/mail/test", "settings": {"mail_to": "test@example.de", "mail_password": ""}})
        msg = await client.receive_json()
    assert msg["result"] == {"ok": True, "to": ["test@example.de"]}
    assert send.call_args.args[0]["mail_password"] == "geheim"
    with patch("custom_components.raumklima.websocket_api.mail_send", side_effect=mailer.MailError("Anmeldung abgelehnt")):
        await client.send_json_auto_id({"type": "raumklima/mail/test"})
        msg = await client.receive_json()
    assert msg["error"]["code"] == "mail_failed" and "Anmeldung" in msg["error"]["message"]


async def test_diagnostics_hide_mail_login(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    from custom_components.raumklima.diagnostics import async_get_config_entry_diagnostics

    hub, _room = await _ready(hass, tmp_path, MAIL)
    text = str(await async_get_config_entry_diagnostics(hass, hub))
    assert "geheim" not in text and "partner@example.de" not in text


async def test_only_real_mail_services_offered(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_ws_client: WebSocketGenerator) -> None:
    from types import SimpleNamespace

    from homeassistant.components.notify.legacy import NOTIFY_SERVICES

    await _ready(hass, tmp_path)
    hass.data[NOTIFY_SERVICES] = {
        "smtp": [SimpleNamespace(_service_name="email")],
        "alexa_media": [SimpleNamespace(_service_name="alexa_media_flur")],
        "mobile_app": [SimpleNamespace(_service_name="mobile_app_iphone")],
    }
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/config"})
    choices = (await client.receive_json())["result"]["choices"]
    assert choices["mail"] == ["notify.email"]
