"""Die Karte muss erkennen können, dass der Browser eine alte Datei hält."""

from __future__ import annotations

import json
from pathlib import Path

from custom_components.raumklima.websocket_api import _installed_version

ROOT = Path(__file__).resolve().parents[2]


def test_version_aus_manifest() -> None:
    """Serverversion = manifest.json – nicht die im Browser gebaute."""
    manifest = json.loads((ROOT / "custom_components/raumklima/manifest.json").read_text())
    assert _installed_version() == manifest["version"]
