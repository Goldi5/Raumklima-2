"""Mail-Versand direkt aus Raumklima (SMTP simuliert)."""

from __future__ import annotations

import smtplib
from unittest.mock import AsyncMock, MagicMock, patch

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
    with patch("custom_components.raumklima.ws_hub.mail_send") as send:
        await client.send_json_auto_id({"type": "raumklima/mail/test", "settings": {"mail_to": "test@example.de", "mail_password": ""}})
        msg = await client.receive_json()
    assert msg["result"] == {"ok": True, "to": ["test@example.de"]}
    assert send.call_args.args[0]["mail_password"] == "geheim"
    with patch("custom_components.raumklima.ws_hub.mail_send", side_effect=mailer.MailError("Anmeldung abgelehnt")):
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


def test_verify_steps_ok_and_failures() -> None:
    smtp = MagicMock()
    with patch.object(smtplib, "SMTP", return_value=smtp):
        steps = mailer.verify(MAIL)
    assert [s["step"] for s in steps] == ["connect", "tls", "login", "recipients"]
    assert all(s["ok"] for s in steps)
    smtp.send_message.assert_not_called()  # prüfen schickt keine Mail

    smtp.login.side_effect = smtplib.SMTPAuthenticationError(535, b"no")
    with patch.object(smtplib, "SMTP", return_value=smtp):
        steps = mailer.verify(MAIL)
    assert steps[-1]["step"] == "login" and not steps[-1]["ok"] and "App-Passwort" in steps[-1]["msg"]

    with patch.object(smtplib, "SMTP", side_effect=OSError("timed out")):
        steps = mailer.verify(MAIL)
    assert steps == [{"step": "connect", "ok": False, "msg": steps[0]["msg"]}] and "nicht erreichbar" in steps[0]["msg"]
    assert mailer.verify({})[0]["ok"] is False


def test_einsundeins_in_providers() -> None:
    assert mailer.PROVIDERS["einsundeins"] == ("smtp.1und1.de", 587, "starttls")


async def test_ws_check_only(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_ws_client: WebSocketGenerator) -> None:
    await _ready(hass, tmp_path, MAIL)
    client = await hass_ws_client(hass)
    steps = [{"step": "connect", "ok": True, "msg": "ok"}, {"step": "login", "ok": False, "msg": "abgelehnt"}]
    with patch("custom_components.raumklima.ws_hub.mail_verify", return_value=steps) as verify, \
         patch("custom_components.raumklima.ws_hub.mail_send") as send:
        await client.send_json_auto_id({"type": "raumklima/mail/test", "send": False, "settings": {"mail_user": "x@y.de"}})
        msg = await client.receive_json()
    assert msg["result"] == {"ok": False, "steps": steps}
    assert verify.call_args.args[0]["mail_user"] == "x@y.de" and verify.call_args.args[0]["mail_password"] == "geheim"
    send.assert_not_called()


async def test_send_via_ha_uses_smtp_service(tmp_path) -> None:
    pdf = tmp_path / "Raumklima-Woche.pdf"
    pdf.write_bytes(b"%PDF-1.4 test")
    hass = MagicMock()
    hass.services.async_call = AsyncMock()
    await mailer.send_via_ha(hass, "notify.smtp_test", "Betreff", "Text", [str(pdf)])
    hass.services.async_call.assert_awaited_once()
    args = hass.services.async_call.await_args.args
    kwargs = hass.services.async_call.await_args.kwargs
    assert args[:2] == ("smtp", "send_message")
    assert kwargs["target"] == {"entity_id": "notify.smtp_test"}
    assert "target" not in args[2]
    assert args[2]["attachments"][0]["filename"] == pdf.name
    assert "raumklima" in args[2]["attachments"][0]["media_source"]["media_content_id"]


async def test_report_sent_by_ha_smtp(hass: HomeAssistant, trv, sensors, tmp_path) -> None:
    hub, _room = await _ready(hass, tmp_path, {"smtp_notify": "notify.smtp_test"})
    pdf = hub.runtime_data.pdf
    entry = await pdf.async_create("month", current=True)
    with patch("custom_components.raumklima.reports.send_via_ha", new=AsyncMock()) as send:
        await pdf.async_send(entry)
    assert send.await_args.args[1] == "notify.smtp_test"
    assert send.await_args.args[4] == [str(tmp_path / "raumklima" / entry["file"])]


async def test_send_via_ha_smtp_aufruf_wie_home_assistant_ihn_erwartet(hass: HomeAssistant) -> None:
    """smtp.send_message: Ziel als target, Anhang mit media_source als Map (HA-Doku).

    Vorher stand ``target`` in den Daten und ``media_source`` war ein Text – HA lehnte den
    Aufruf ab, Test-Mail und Bericht über HA-SMTP kamen nie an.
    """
    from homeassistant.core import ServiceCall, SupportsResponse

    seen: list[ServiceCall] = []

    async def _handler(call: ServiceCall) -> None:
        seen.append(call)

    hass.services.async_register("smtp", "send_message", _handler, supports_response=SupportsResponse.NONE)
    await mailer.send_via_ha(hass, "notify.mail", "Betreff", "Text", ["/media/raumklima/Raumklima-Monat-2026-10.pdf"])
    assert seen, "Dienst nicht aufgerufen"
    data = dict(seen[0].data)
    assert "target" not in data
    assert data["entity_id"] in ("notify.mail", ["notify.mail"])
    att = data["attachments"][0]
    assert att["media_source"] == {
        "media_content_id": "media-source://media_source/local/raumklima/Raumklima-Monat-2026-10.pdf",
        "media_content_type": "application/pdf",
    }
    assert att["filename"] == "Raumklima-Monat-2026-10.pdf"


def test_ohne_anmeldung_trotz_gespeichertem_benutzer() -> None:
    """#76: „Anmeldung am Server: ohne“ meldet sich nie an – auch wenn noch ein Benutzer gespeichert ist."""
    opts = {**MAIL, "mail_auth": False, "mail_from": "raumklima@example.de", "mail_security": "none", "mail_port": 25}
    assert mailer.login_user(opts) == ""
    assert mailer.insecure_login(opts) is False
    assert mailer.configured(opts)
    smtp = MagicMock()
    with patch.object(smtplib, "SMTP", return_value=smtp):
        mailer.send(opts, "Betreff", "Text")
    smtp.login.assert_not_called()
    smtp.send_message.assert_called_once()
    # ohne Anmeldung und ohne Absender gilt der Versand als nicht eingerichtet
    assert not mailer.configured({**opts, "mail_from": ""})


async def test_ohne_anmeldung_loescht_zugangsdaten(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_ws_client: WebSocketGenerator) -> None:
    hub, _room = await _ready(hass, tmp_path, MAIL)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/hub/update", "changes": {"mail_auth": False, "mail_from": "raumklima@example.de"}})
    assert (await client.receive_json())["success"]
    assert hub.options["mail_user"] == "" and hub.options["mail_password"] == ""
    assert hub.options["mail_auth"] is False


async def test_smtp_auswahl_zeigt_smtp_entitaeten(hass: HomeAssistant) -> None:
    """#82: die neue SMTP-Integration liefert notify-Entitäten – die Auswahl zeigt sie mit Namen."""
    from homeassistant.helpers import entity_registry as er

    from custom_components.raumklima.ws_common import _smtp_entities

    reg = er.async_get(hass)
    smtp = reg.async_get_or_create("notify", "smtp", "mail_versand_it", suggested_object_id="mail_versand")
    hass.states.async_set(smtp.entity_id, "unknown", {"friendly_name": "Mail-Versand"})
    hass.states.async_set("notify.handy", "unknown", {"friendly_name": "Handy"})
    assert _smtp_entities(hass) == [{"id": smtp.entity_id, "name": "Mail-Versand"}]


async def test_smtp_auswahl_ohne_smtp_zeigt_alle(hass: HomeAssistant) -> None:
    from custom_components.raumklima.ws_common import _smtp_entities

    hass.states.async_set("notify.handy", "unknown", {"friendly_name": "Handy"})
    assert _smtp_entities(hass) == [{"id": "notify.handy", "name": "Handy"}]
