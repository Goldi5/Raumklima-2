"""E-Mail direkt aus Raumklima: PDF-Bericht als Anhang per SMTP.

Home Assistants SMTP-Integration kann inzwischen per Oberfläche eingerichtet werden und seit
2026.11 auch Anhänge verschicken – sie muss aber zusätzlich eingerichtet werden und ist nicht
in jeder Installation vorhanden. Raumklima sendet daher selbst, damit ein Bericht ohne zweite
Integration ankommt. Die Zugangsdaten stehen in den Optionen der Zentrale, werden nie an die
Karte geschickt und nie ohne TLS verwendet (siehe ``insecure_login``).
"""

from __future__ import annotations

from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from pathlib import Path
import smtplib
import ssl
from typing import Any

from .msg import tr

MAIL_KEYS = ("mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to")
SECURITY = ["starttls", "ssl", "none"]


def insecure_login(opts: dict[str, Any]) -> bool:
    """Anmeldung ohne TLS? Dann niemals Benutzer/Passwort senden.

    Ein Klartext-Login schickt Passwort und den kompletten Bericht (Anwesenheit,
    Heizverhalten) unverschlüsselt über die Leitung. Nur zustandslose Relays im
    eigenen Netz (ohne Anmeldung) bleiben erlaubt.
    """
    security = opts.get("mail_security") or "starttls"
    return bool(opts.get("mail_user")) and security == "none"
BUILTIN = "raumklima"  # Wert für report_email: eingebauter Versand

# Häufige Anbieter: Server, Port, Verschlüsselung
PROVIDERS: dict[str, tuple[str, int, str]] = {
    "gmail": ("smtp.gmail.com", 587, "starttls"),
    "gmx": ("mail.gmx.net", 587, "starttls"),
    "webde": ("smtp.web.de", 587, "starttls"),
    "outlook": ("smtp-mail.outlook.com", 587, "starttls"),
    "tonline": ("securesmtp.t-online.de", 465, "ssl"),
    "icloud": ("smtp.mail.me.com", 587, "starttls"),
    "posteo": ("posteo.de", 587, "starttls"),
    "ionos": ("smtp.ionos.de", 587, "starttls"),
    "einsundeins": ("smtp.1und1.de", 587, "starttls"),
}


class MailError(Exception):
    """Verständliche Fehlermeldung für die Karte."""


def recipients(value: Any) -> list[str]:
    if isinstance(value, list):
        items = value
    else:
        items = str(value or "").replace(";", ",").split(",")
    return [x.strip() for x in items if x and "@" in x]


def configured(opts: dict[str, Any]) -> bool:
    return bool(opts.get("mail_server") and recipients(opts.get("mail_to")) and (opts.get("mail_from") or opts.get("mail_user")))


def build_message(opts: dict[str, Any], subject: str, body: str, attachments: list[str] | None = None) -> EmailMessage:
    sender = str(opts.get("mail_from") or opts.get("mail_user") or "")
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr(("Raumklima", sender))
    msg["To"] = ", ".join(recipients(opts.get("mail_to")))
    msg["Message-ID"] = make_msgid(domain=sender.split("@")[-1] if "@" in sender else None)
    msg.set_content(body)
    for path in attachments or []:
        p = Path(path)
        msg.add_attachment(p.read_bytes(), maintype="application", subtype="pdf", filename=p.name)
    return msg


def send(opts: dict[str, Any], subject: str, body: str, attachments: list[str] | None = None, timeout: float = 20.0) -> None:
    """Blockierend senden (im Executor aufrufen). Wirft MailError mit verständlichem Text."""
    if not configured(opts):
        raise MailError(tr("E-Mail ist nicht vollständig eingerichtet (Server, Absender, Empfänger)."))
    if insecure_login(opts):
        raise MailError(
            tr(
                "Anmeldung ohne Verschlüsselung ist gesperrt – das Passwort ginge im Klartext über die Leitung. "
                "Bitte „STARTTLS“ (Port 587) oder „SSL/TLS“ (Port 465) wählen."
            )
        )
    server = str(opts["mail_server"]).strip()
    security = opts.get("mail_security") or "starttls"
    port = int(opts.get("mail_port") or (465 if security == "ssl" else 587))
    msg = build_message(opts, subject, body, attachments)
    context = ssl.create_default_context()
    try:
        if security == "ssl":
            smtp: smtplib.SMTP = smtplib.SMTP_SSL(server, port, timeout=timeout, context=context)
        else:
            smtp = smtplib.SMTP(server, port, timeout=timeout)
        with smtp:
            if security == "starttls":
                smtp.starttls(context=context)
            if opts.get("mail_user"):
                smtp.login(str(opts["mail_user"]), str(opts.get("mail_password") or ""))
            smtp.send_message(msg)
    except smtplib.SMTPAuthenticationError as err:
        raise MailError(
            tr("Anmeldung abgelehnt – Benutzer/Passwort prüfen. Bei Gmail, iCloud, Outlook u. a. ein App-Passwort verwenden.")
        ) from err
    except smtplib.SMTPRecipientsRefused as err:
        raise MailError(tr("Der Mail-Server lehnt die Empfänger-Adresse ab – Schreibweise prüfen.")) from err
    except (smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected, ssl.SSLError, ConnectionError, TimeoutError) as err:
        raise MailError(tr("Mail-Server {server} nicht erreichbar ({err}) – Server, Port und Verschlüsselung prüfen.", server=f"{server}:{port}", err=err.__class__.__name__)) from err
    except smtplib.SMTPException as err:
        raise MailError(tr("Mail-Server meldet einen Fehler: {err}", err=err)) from err
    except OSError as err:
        raise MailError(tr("Mail-Server {server} nicht erreichbar ({err}) – Server, Port und Internetverbindung prüfen.", server=f"{server}:{port}", err=err)) from err


def verify(opts: dict[str, Any], timeout: float = 15.0) -> list[dict[str, Any]]:
    """Zugang Schritt für Schritt prüfen, ohne eine Mail zu senden (im Executor aufrufen).

    Ergebnis: [{"step": "connect"|"tls"|"login"|"recipients", "ok": bool, "msg": str}, …] –
    bricht beim ersten Fehler ab.
    """
    steps: list[dict[str, Any]] = []

    def add(step: str, ok: bool, msg: str) -> bool:
        steps.append({"step": step, "ok": ok, "msg": msg})
        return ok

    server = str(opts.get("mail_server") or "").strip()
    if not server:
        add("connect", False, tr("Kein Mail-Server eingetragen – Anbieter wählen oder Server eingeben."))
        return steps
    security = opts.get("mail_security") or "starttls"
    port = int(opts.get("mail_port") or (465 if security == "ssl" else 587))
    context = ssl.create_default_context()
    try:
        if security == "ssl":
            smtp: smtplib.SMTP = smtplib.SMTP_SSL(server, port, timeout=timeout, context=context)
        else:
            smtp = smtplib.SMTP(server, port, timeout=timeout)
    except ssl.SSLError as err:
        add("connect", False, tr("{server} antwortet, aber die verschlüsselte Verbindung klappt nicht ({err}) – Verschlüsselung/Port prüfen (587 = STARTTLS, 465 = SSL/TLS).", server=f"{server}:{port}", err=err.reason or err))
        return steps
    except (OSError, smtplib.SMTPException) as err:
        add("connect", False, tr("{server} nicht erreichbar ({err}) – Server, Port und Internetverbindung prüfen.", server=f"{server}:{port}", err=err))
        return steps
    with smtp:
        add("connect", True, tr("{server} erreichbar", server=f"{server}:{port}"))
        try:
            if security == "starttls":
                smtp.starttls(context=context)
                add("tls", True, tr("Verbindung verschlüsselt (STARTTLS)"))
            elif security == "ssl":
                add("tls", True, tr("Verbindung verschlüsselt (SSL/TLS)"))
            elif insecure_login(opts):
                add(
                    "tls",
                    False,
                    tr(
                        "ohne Verschlüsselung – Anmeldung gesperrt, weil das Passwort sonst im Klartext übertragen würde. "
                        "Bitte „STARTTLS“ oder „SSL/TLS“ wählen."
                    ),
                )
                return steps
            else:
                add("tls", True, tr("ohne Verschlüsselung und ohne Anmeldung – nur im eigenen Netz empfehlenswert"))
        except (smtplib.SMTPException, ssl.SSLError, OSError) as err:
            add("tls", False, tr("Verschlüsselung fehlgeschlagen ({err}) – „SSL/TLS“ mit Port 465 oder „STARTTLS“ mit Port 587 versuchen.", err=err))
            return steps
        user = str(opts.get("mail_user") or "")
        if user:
            try:
                smtp.login(user, str(opts.get("mail_password") or ""))
                add("login", True, tr("Anmeldung als {user} erfolgreich", user=user))
            except smtplib.SMTPAuthenticationError:
                add("login", False, tr("Anmeldung abgelehnt – Benutzer/Passwort prüfen. Bei Gmail, iCloud, Outlook u. a. ein App-Passwort verwenden."))
                return steps
            except (smtplib.SMTPException, OSError) as err:
                add("login", False, tr("Anmeldung nicht möglich ({err}).", err=err))
                return steps
        else:
            add("login", True, tr("ohne Anmeldung (kein Benutzer eingetragen)"))
        to = recipients(opts.get("mail_to"))
        add("recipients", bool(to), ", ".join(to) if to else tr("Noch kein Empfänger eingetragen."))
    return steps
