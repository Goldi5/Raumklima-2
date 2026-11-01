"""E-Mail direkt aus Raumklima (ohne YAML): PDF-Bericht als Anhang per SMTP.

Home Assistants eigener SMTP-Dienst lässt sich nur per configuration.yaml einrichten – für
Einsteiger zu umständlich. Darum kann Raumklima selbst senden; die Zugangsdaten stehen in den
Optionen der Zentrale (wie bei anderen Integrationen) und werden nie an die Karte geschickt.
"""

from __future__ import annotations

from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from pathlib import Path
import smtplib
import ssl
from typing import Any

MAIL_KEYS = ("mail_server", "mail_port", "mail_security", "mail_user", "mail_password", "mail_from", "mail_to")
SECURITY = ["starttls", "ssl", "none"]
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
        raise MailError("E-Mail ist nicht vollständig eingerichtet (Server, Absender, Empfänger).")
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
            "Anmeldung abgelehnt – Benutzer/Passwort prüfen. Bei Gmail, iCloud, Outlook u. a. ein App-Passwort verwenden."
        ) from err
    except smtplib.SMTPRecipientsRefused as err:
        raise MailError("Der Mail-Server lehnt die Empfänger-Adresse ab – Schreibweise prüfen.") from err
    except (smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected, ssl.SSLError, ConnectionError, TimeoutError) as err:
        raise MailError(f"Mail-Server {server}:{port} nicht erreichbar ({err.__class__.__name__}) – Server, Port und Verschlüsselung prüfen.") from err
    except smtplib.SMTPException as err:
        raise MailError(f"Mail-Server meldet einen Fehler: {err}") from err
    except OSError as err:
        raise MailError(f"Mail-Server {server}:{port} nicht erreichbar ({err}) – Server, Port und Internetverbindung prüfen.") from err
