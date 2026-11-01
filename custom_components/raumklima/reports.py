"""PDF-Heizberichte: erstellen, ablegen, verschicken und zum Herunterladen anbieten.

Ablage: Medienordner von Home Assistant (``media/raumklima/``) – in *Medien* sichtbar und für den
Mail-Anhang freigegeben. Herunterladen über ``/api/raumklima/report/<datei>.pdf``: nur angemeldet
oder mit signiertem Link (Karte: kurz gültig, Push: 30 Tage).
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from http import HTTPStatus
import logging
from pathlib import Path
import re
from typing import TYPE_CHECKING, Any

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import CONF_SEASON_END, CONF_SEASON_START, KIND_REPORT
from .report_data import MONTH, SEASON, WEEK, build, period, report_lang
from .shared import all_hubs
from .stats import week_message

if TYPE_CHECKING:
    from .hub import RaumklimaHub

_LOGGER = logging.getLogger(__name__)

URL = "/api/raumklima/report"
FILE_RE = re.compile(r"^[A-Za-z0-9_.-]+\.pdf$")
KEEP = {WEEK: 26, MONTH: 24, SEASON: 20}  # so viele Dateien je Art aufheben
CONF_REPORT_PDF = "report_pdf"  # welche Berichte automatisch: week / month / season
CONF_REPORT_EMAIL = "report_email"  # notify-Dienst (SMTP) für den Versand
DEFAULT_REPORT_PDF = [WEEK, MONTH, SEASON]

NAMES = {
    "de": {WEEK: "Woche", MONTH: "Monat", SEASON: "Heizsaison"},
    "en": {WEEK: "Week", MONTH: "Month", SEASON: "Season"},
}
PUSH = {
    "de": {
        WEEK: "📊 Heizbericht Woche {w}",
        MONTH: "📊 Heizbericht {m}",
        SEASON: "📊 Heizsaison {s} – Bilanz",
        "open": "PDF öffnen",
        "mail": "Heizbericht als PDF im Anhang.",
    },
    "en": {
        WEEK: "📊 Heating report week {w}",
        MONTH: "📊 Heating report {m}",
        SEASON: "📊 Heating season {s} – summary",
        "open": "Open PDF",
        "mail": "Heating report attached as PDF.",
    },
}


def report_dir(hass: HomeAssistant) -> Path:
    base = hass.config.media_dirs.get("local") or hass.config.path("media")
    return Path(base) / "raumklima"


def file_name(kind: str, start: date, end: date, lang: str, current: bool, home: str | None) -> str:
    """z. B. Raumklima-Woche-2026-W44.pdf, Raumklima-Monat-2026-10.pdf, Raumklima-Heizsaison-2025-26.pdf"""
    if kind == WEEK:
        year, week, _ = start.isocalendar()
        part = f"{year}-W{week:02d}"
    elif kind == MONTH:
        part = f"{start.year}-{start.month:02d}"
    else:
        part = f"{start.year}-{str(end.year)[-2:]}"
    if current:
        part += f"-{'Stand' if lang == 'de' else 'until'}-{end.isoformat()}"
    prefix = "Raumklima" + (f"-{re.sub(r'[^A-Za-z0-9]+', '-', home).strip('-')}" if home else "")
    return f"{prefix}-{NAMES[lang][kind]}-{part}.pdf"


def _write(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_bytes(content)
    tmp.replace(path)


def _render(data: dict[str, Any], home: str, created: datetime) -> bytes:
    from .report_pdf import render  # fpdf2 erst laden, wenn gebraucht

    return render(data, home, created)


class PdfReports:
    """PDF-Berichte einer Wohnung."""

    def __init__(self, hass: HomeAssistant, hub: RaumklimaHub) -> None:
        self.hass = hass
        self.hub = hub

    @property
    def index(self) -> list[dict[str, Any]]:
        return self.hub.insights.data.setdefault("pdf", [])

    @property
    def lang(self) -> str:
        return report_lang(self.hass.config.language)

    def enabled(self, kind: str) -> bool:
        value = self.hub.opt(CONF_REPORT_PDF)
        return kind in (DEFAULT_REPORT_PDF if value is None else value)

    def _home_label(self) -> str | None:
        return self.hub.name if len(all_hubs(self.hass)) > 1 else None

    def listing(self) -> list[dict[str, Any]]:
        """Vorhandene Berichte, neueste zuerst (fehlende Dateien fallen raus)."""
        folder = report_dir(self.hass)
        return [r for r in sorted(self.index, key=lambda r: r["created"], reverse=True) if (folder / r["file"]).exists()]

    async def async_create(self, kind: str, current: bool = False, today: date | None = None) -> dict[str, Any]:
        """Bericht erstellen und ablegen."""
        today = today or dt_util.now().date()
        hub = self.hub
        season = (str(hub.opt(CONF_SEASON_START) or "10-01"), str(hub.opt(CONF_SEASON_END) or "04-30"))
        start, end = period(kind, today, *season, current=current)
        lang = self.lang
        data = build(
            hub.insights.rooms_by_name(),
            hub.insights.data["home"],
            kind,
            start,
            end,
            hub.insights.all_issues(),
            lang,
            season,
        )
        name = file_name(kind, start, end, lang, current, self._home_label())
        created = dt_util.now()
        content = await self.hass.async_add_executor_job(_render, data, hub.name if self._home_label() else "", created)
        path = report_dir(self.hass) / name
        await self.hass.async_add_executor_job(_write, path, content)
        entry = {
            "file": name,
            "kind": kind,
            "start": start.isoformat(),
            "end": end.isoformat(),
            "created": created.isoformat(),
            "lang": lang,
            "size": len(content),
            "current": current,
        }
        self.index[:] = [r for r in self.index if r["file"] != name] + [entry]
        await self._prune(kind)
        hub.insights.save()
        hub.log.add("notify", f"PDF-Bericht erstellt: {name}", f"{start.isoformat()} – {end.isoformat()}")
        entry["_data"] = data
        return entry

    async def _prune(self, kind: str) -> None:
        mine = sorted((r for r in self.index if r["kind"] == kind), key=lambda r: r["created"])
        old = mine[: max(0, len(mine) - KEEP[kind])]
        folder = report_dir(self.hass)
        for r in old:
            self.index.remove(r)
            await self.hass.async_add_executor_job(lambda p=folder / r["file"]: p.unlink(missing_ok=True))

    def signed_url(self, file: str, days: int = 30) -> str | None:
        try:
            from homeassistant.components.http.auth import async_sign_path

            return async_sign_path(self.hass, f"{URL}/{file}", timedelta(days=days), use_content_user=True)
        except Exception as err:  # noqa: BLE001 – ohne Anmeldung kein Link, Push geht trotzdem
            _LOGGER.debug("Link für %s nicht signierbar: %s", file, err)
            return None

    async def async_send(self, entry: dict[str, Any], message: str | None = None) -> None:
        """Push mit Link an alle mit „Wochenbericht“ und – falls eingestellt – E-Mail mit Anhang."""
        lang = entry["lang"]
        tx = PUSH[lang]
        start, end = date.fromisoformat(entry["start"]), date.fromisoformat(entry["end"])
        from .report_pdf import MONTHS  # nur Konstanten

        title = tx[entry["kind"]].format(
            w=start.isocalendar()[1], m=f"{MONTHS[lang][start.month - 1]} {start.year}", s=f"{start.year}/{str(end.year)[-2:]}"
        )
        data = entry.get("_data") or {}
        if message is None:
            message = summary_line(data, lang) if data else tx["mail"]
        url = self.signed_url(entry["file"])
        push_data: dict[str, Any] = {"tag": f"raumklima_report_{entry['kind']}", "group": "raumklima"}
        if url:
            push_data |= {"url": url, "clickAction": url, "actions": [{"action": "URI", "title": tx["open"], "uri": url}]}
        await self.hub.async_notify(KIND_REPORT, title, message, push_data, speak=False)
        email = self.hub.opt(CONF_REPORT_EMAIL)
        if email:
            domain, _, service = str(email).partition(".")
            path = str(report_dir(self.hass) / entry["file"])
            try:
                await self.hass.services.async_call(
                    domain, service, {"title": title.replace("📊 ", ""), "message": f"{message}\n\n{tx['mail']}", "data": {"images": [path]}}
                )
                self.hub.log.add("notify", f"PDF-Bericht per E-Mail: {entry['file']}", email)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("E-Mail mit Heizbericht an %s fehlgeschlagen: %s", email, err)

    # ------------------------------------------------------------ Zeitplan
    async def async_scheduled(self, now: datetime) -> None:
        """Täglich 09:05: Monatsbericht am 1., Saisonbericht am Tag nach Saisonende."""
        local = dt_util.as_local(now).date()
        if local.day == 1 and self.enabled(MONTH):
            await self._create_and_send(MONTH, local)
        season_end = str(self.hub.opt(CONF_SEASON_END) or "04-30")
        month, day = (int(x) for x in season_end.split("-"))
        if self.enabled(SEASON) and local - timedelta(days=1) == date(local.year, month, min(day, 28) if month == 2 else day):
            await self._create_and_send(SEASON, local)

    async def async_weekly(self, today: date, short: str) -> bool:
        """Sonntag 18 Uhr: Wochenbericht als PDF mit der bisherigen Kurzfassung. False = nicht erstellt."""
        if not self.enabled(WEEK):
            return False
        try:
            entry = await self.async_create(WEEK, today=today)
        except Exception:
            _LOGGER.exception("Wochenbericht als PDF fehlgeschlagen")
            return False
        await self.async_send(entry, short)
        return True

    async def _create_and_send(self, kind: str, today: date) -> None:
        try:
            entry = await self.async_create(kind, today=today)
        except Exception:
            _LOGGER.exception("PDF-Bericht %s fehlgeschlagen", kind)
            return
        if entry["_data"]["current"]["total"]["hours"] >= 24:
            await self.async_send(entry)


def summary_line(data: dict[str, Any], lang: str) -> str:
    """Kurzfassung für Push/Mail."""
    cur = data["current"]
    if lang == "de":
        return week_message(cur, data.get("change"))
    t = cur["total"]
    parts = [f"{t['heating_h']:.0f} heating hours"]
    if data.get("change") is not None:
        c = data["change"]
        parts[0] += f" ({'+' if c > 0 else '-' if c < 0 else '±'}{abs(c):.0f} % vs previous, weather-adjusted)"
    if t["setback_h"]:
        parts.append(f"≈ {t['saving_pct']:.0f} % saved by setback")
    if t["on_target_pct"] is not None:
        parts.append(f"{t['on_target_pct']} % at target")
    return " · ".join(parts)


class ReportView(HomeAssistantView):
    """PDF ausliefern (angemeldet oder signierter Link)."""

    url = URL + "/{file}"
    name = "api:raumklima:report"
    requires_auth = True

    async def get(self, request: web.Request, file: str) -> web.StreamResponse:
        hass: HomeAssistant = request.app["hass"]
        if not FILE_RE.match(file):
            return web.Response(status=HTTPStatus.BAD_REQUEST)
        path = report_dir(hass) / file
        if not await hass.async_add_executor_job(path.is_file):
            return web.Response(status=HTTPStatus.NOT_FOUND)
        return web.FileResponse(
            path,
            headers={"Content-Type": "application/pdf", "Content-Disposition": f'inline; filename="{file}"', "Cache-Control": "no-store"},
        )

