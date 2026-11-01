"""PDF-Heizberichte: erstellen, Liste, Versand (Push mit Link, E-Mail mit Anhang), Download."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_mock_service
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator, WebSocketGenerator

from custom_components.raumklima.stats import RoomSample, add_home_sample, add_room_sample

from .conftest import FakeTrv
from .test_features import _setup

PHONE = "notify.mobile_app_antje"


def _seed(hub_entry, days: int = 40) -> None:
    """Messwerte für die letzten Tage in die Statistik schreiben."""
    insights = hub_entry.runtime_data.insights
    room_id = next(iter(hub_entry.runtime_data.rooms))
    today = dt_util.now().date()
    for i in range(days):
        key = (today - timedelta(days=i)).isoformat()
        day = insights.data["rooms"].setdefault(room_id, {}).setdefault(key, {})
        home = insights.data["home"].setdefault(key, {})
        for h in range(48):
            add_room_sample(day, RoomSample(h % 3 == 0, 50.0, "normal", 21.0, 21.0, True, False, 20.6, 72.0, 70.0, False, False), 1800)
            add_home_sample(home, False, 4.0, 1800)


async def _ready(hass: HomeAssistant, tmp_path: Path, hub_opts: dict | None = None, lang: str = "de"):
    hass.config.language = lang
    hass.config.media_dirs = {"local": str(tmp_path)}
    hub, room = await _setup(hass, hub_opts)
    _seed(hub)
    return hub, room


async def test_create_and_list(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_ws_client: WebSocketGenerator) -> None:
    hub, _room = await _ready(hass, tmp_path)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "raumklima/report/pdf/create", "kind": "month"})
    msg = await client.receive_json()
    assert msg["success"], msg
    entry = msg["result"]
    assert entry["file"].startswith("Raumklima-Monat-")
    path = tmp_path / "raumklima" / entry["file"]
    assert path.read_bytes()[:4] == b"%PDF"
    assert entry["url"] == f"/api/raumklima/report/{entry['file']}"

    await client.send_json_auto_id({"type": "raumklima/report/pdf/list"})
    msg = await client.receive_json()
    assert [r["file"] for r in msg["result"]["reports"]] == [entry["file"]]


async def test_language_follows_home_assistant(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    hub, _room = await _ready(hass, tmp_path, lang="fr")
    entry = await hub.runtime_data.pdf.async_create("week", current=True)
    assert "-Week-" in entry["file"] and entry["lang"] == "en"
    hass.config.language = "de"
    entry = await hub.runtime_data.pdf.async_create("season", current=True)
    assert "-Heizsaison-" in entry["file"] and entry["lang"] == "de"


async def test_send_push_link_and_email(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    hass.config.language = "de"
    push = async_mock_service(hass, "notify", "mobile_app_antje")
    mail = async_mock_service(hass, "notify", "mail")
    hub, _room = await _ready(hass, tmp_path, {"recipients": {PHONE: ["report"]}, "report_email": "notify.mail"})
    pdf = hub.runtime_data.pdf
    entry = await pdf.async_create("month", current=True)
    await pdf.async_send(entry)
    await hass.async_block_till_done()
    assert push[0].data["title"].startswith("📊 Heizbericht")
    url = push[0].data["data"].get("url")
    if url:  # signierter Link (Anmeldedienst vorhanden)
        assert url.startswith(f"/api/raumklima/report/{entry['file']}?authSig=")
        assert push[0].data["data"]["actions"][0]["uri"] == url
    assert mail[0].data["data"]["images"] == [str(tmp_path / "raumklima" / entry["file"])]


async def test_weekly_sends_pdf_instead_of_text_only(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    push = async_mock_service(hass, "notify", "mobile_app_antje")
    hub, _room = await _ready(hass, tmp_path, {"recipients": {PHONE: ["report"]}})
    await hub.runtime_data.insights._weekly(dt_util.now().date(), "10 Heizstunden")
    await hass.async_block_till_done()
    assert push[0].data["message"] == "10 Heizstunden"
    assert list((tmp_path / "raumklima").glob("*.pdf"))


async def test_weekly_without_pdf_keeps_text(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    push = async_mock_service(hass, "notify", "mobile_app_antje")
    hub, _room = await _ready(hass, tmp_path, {"recipients": {PHONE: ["report"]}, "report_pdf": ["month"]})
    await hub.runtime_data.insights._weekly(dt_util.now().date(), "10 Heizstunden")
    await hass.async_block_till_done()
    assert push[0].data["title"] == "📊 Heizung diese Woche"
    assert not list((tmp_path / "raumklima").glob("*.pdf"))


async def test_monthly_on_first_and_season_after_end(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path) -> None:
    hub, _room = await _ready(hass, tmp_path)
    pdf = hub.runtime_data.pdf
    tz = dt_util.get_default_time_zone()
    await pdf.async_scheduled(datetime(2026, 11, 1, 9, 5, tzinfo=tz))
    await pdf.async_scheduled(datetime(2026, 5, 1, 9, 5, tzinfo=tz))  # Tag nach Saisonende 30.04.
    await pdf.async_scheduled(datetime(2026, 11, 2, 9, 5, tzinfo=tz))  # nichts
    kinds = sorted(r["kind"] for r in pdf.listing())
    assert kinds == ["month", "month", "season"]
    files = {r["file"] for r in pdf.listing()}
    assert "Raumklima-Monat-2026-10.pdf" in files and "Raumklima-Heizsaison-2025-26.pdf" in files


async def test_download_view(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_client: ClientSessionGenerator) -> None:
    hub, _room = await _ready(hass, tmp_path)
    entry = await hub.runtime_data.pdf.async_create("week", current=True)
    client = await hass_client()
    resp = await client.get(f"/api/raumklima/report/{entry['file']}")
    assert resp.status == 200
    assert resp.headers["Content-Type"] == "application/pdf"
    assert (await resp.read())[:4] == b"%PDF"
    assert (await client.get("/api/raumklima/report/..%2Fsecrets.yaml")).status in (400, 404)
    assert (await client.get("/api/raumklima/report/fehlt.pdf")).status == 404


async def test_download_needs_login(hass: HomeAssistant, trv: FakeTrv, sensors, tmp_path, hass_client_no_auth: ClientSessionGenerator) -> None:
    hub, _room = await _ready(hass, tmp_path)
    entry = await hub.runtime_data.pdf.async_create("week", current=True)
    client = await hass_client_no_auth()
    assert (await client.get(f"/api/raumklima/report/{entry['file']}")).status == 404
    assert (await client.get(f"/api/raumklima/report/{entry['file']}?token=falsch")).status == 404
    signed = hub.runtime_data.pdf.signed_url(entry["file"])
    assert signed
    assert (await client.get(signed)).status == 200
    # Companion App hängt external_auth=1 an – muss trotzdem gehen
    assert (await client.get(signed + "&external_auth=1")).status == 200


def test_period_rules() -> None:
    from custom_components.raumklima.report_data import period

    sun = date(2026, 11, 1)  # Sonntag
    assert period("week", sun) == (date(2026, 10, 26), sun)
    assert period("week", date(2026, 11, 3)) == (date(2026, 10, 26), sun)
    assert period("week", date(2026, 11, 3), current=True) == (date(2026, 11, 2), date(2026, 11, 3))
    assert period("month", sun) == (date(2026, 10, 1), date(2026, 10, 31))
    assert period("season", date(2026, 5, 1)) == (date(2025, 10, 1), date(2026, 4, 30))
    assert period("season", date(2026, 11, 1), current=True) == (date(2026, 10, 1), sun)
