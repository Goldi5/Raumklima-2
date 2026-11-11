"""Empfänger-Filter: Hinweise nur an Personen, die auch zu Hause sind.

Hintergrund: „Bitte lüften" ging bisher an alle Empfänger – auch an Handys, die
80 km entfernt waren. Kritische Meldungen (Fenster offen bei Abwesenheit, Frost,
Thermostat-Ausfall) bleiben davon unberührt.
"""

from __future__ import annotations

from typing import Any

_UMLAUTE = {"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"}


def slug(text: str) -> str:
    """Name oder Dienst-Kürzel vergleichbar machen ('Person A' → 'person_a')."""
    out = []
    for ch in str(text).lower():
        if ch in _UMLAUTE:
            out.append(_UMLAUTE[ch])
        elif ch.isalnum():
            out.append(ch)
        else:
            out.append("_")
    return "_".join(part for part in "".join(out).split("_") if part)


def person_for(target: str, persons: dict[str, dict[str, Any]]) -> str | None:
    """notify-Dienst einer Person zuordnen (notify.a → person.a)."""
    name = target.split(".", 1)[-1].removeprefix("mobile_app_")
    key_slug = slug(name)
    for entity_id, info in persons.items():
        if slug(entity_id.split(".", 1)[-1]) == key_slug:
            return entity_id
        if info.get("name") and slug(info["name"]) == key_slug:
            return entity_id
    return None


def keep_present(
    targets: list[str],
    persons: dict[str, dict[str, Any]],
    enabled: bool,
) -> list[str]:
    """Empfänger behalten, die zu Hause sind.

    Nicht zuordenbare Empfänger (Gruppen, E-Mail, Fremddienste) bleiben erhalten –
    lieber eine Meldung zu viel als eine verschluckte. Ohne Personendaten oder bei
    ausgeschalteter Option bleibt alles unverändert.
    """
    if not enabled or not persons:
        return list(targets)
    kept: list[str] = []
    for target in targets:
        who = person_for(target, persons)
        if who is None or (persons[who] or {}).get("present"):
            kept.append(target)
    return kept
