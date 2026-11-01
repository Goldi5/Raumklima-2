"""Versionsangaben in README, Changelog und Karte müssen zur manifest.json passen."""

import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / "custom_components/raumklima/manifest.json").read_text())["version"]


def test_readme_version():
    assert f"Aktuelle Version: {VERSION}" in (ROOT / "README.md").read_text(), "README.md: Version anpassen"
    assert f"Current version: {VERSION}" in (ROOT / "docs/en/README.md").read_text(), "docs/en/README.md: Version anpassen"


def test_changelog_top_entry():
    first = re.search(r"^## (\S+)", (ROOT / "CHANGELOG.md").read_text(), re.M)
    assert first and first.group(1) == VERSION, "CHANGELOG.md: neuer Eintrag fehlt"


def test_card_version():
    """Quelltext und gebaute Karte (npm run build) passen zur Version."""
    assert f'export const RK_VERSION = "{VERSION}"' in (ROOT / "frontend/src/version.js").read_text(), "npm run build ausführen"
    built = (ROOT / "custom_components/raumklima/www/raumklima-card.js").read_text()
    assert f"/* Raumklima {VERSION} " in built, "Karte neu bauen: cd frontend && npm run build"
