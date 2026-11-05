"""Versionsangaben in README, Changelog und Karte müssen zur manifest.json passen."""

import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / "custom_components/raumklima/manifest.json").read_text())["version"]


def test_readme_version():
    assert f"Aktuelle Version: {VERSION}" in (ROOT / "README.md").read_text(), "README.md: Version anpassen"
    assert f"Current version: {VERSION}" in (ROOT / "docs/en/README.md").read_text(), "docs/en/README.md: Version anpassen"
    # Die deutschen und französischen Doku-Startseiten hatten die Zeile gar nicht – die
    # Version auf „Seite 1" lief dort jahrelang still auseinander.
    assert f"Aktuelle Version: {VERSION}" in (ROOT / "docs/de/README.md").read_text(), (
        "docs/de/README.md: Version anpassen"
    )
    assert f"Version actuelle : {VERSION}" in (ROOT / "docs/fr/README.md").read_text(), (
        "docs/fr/README.md: Version anpassen"
    )


def test_changelog_top_entry():
    """Erster Versions-Eintrag passt zur Manifest-Version.

    Ein „## Unreleased"-Block darf davor stehen: Änderungen werden gesammelt und erst
    beim Release zu einer Version zusammengefasst.
    """
    entries = [m.group(1) for m in re.finditer(r"^## (\S+)", (ROOT / "CHANGELOG.md").read_text(), re.M)]
    versions = [e for e in entries if e != "Unreleased"]
    assert versions and versions[0] == VERSION, "CHANGELOG.md: neuer Eintrag fehlt"


def test_card_version():
    """Quelltext und gebaute Karte (npm run build) passen zur Version."""
    assert f'export const RK_VERSION = "{VERSION}"' in (ROOT / "frontend/src/version.js").read_text(), "npm run build ausführen"
    built = (ROOT / "custom_components/raumklima/www/raumklima-card.js").read_text()
    assert f"/* Raumklima {VERSION} " in built, "Karte neu bauen: cd frontend && npm run build"
