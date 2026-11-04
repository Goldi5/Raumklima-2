"""Empfänger-Liste für die Auswahl: Dienste *und* notify-Entitäten.

Die offizielle Alexa-Devices-Integration (und einige andere) stellt keine
`notify.<dienst>`-Dienste bereit, sondern `notify.<name>`-**Entitäten**
(z. B. `notify.wohnzimmer_sonos_one_durchsagen`). Angesprochen werden die über
`notify.send_message` – deshalb müssen beide Formen in der Auswahl stehen.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

SKIP = ("send_message", "persistent_notification", "notify")


def notify_choices(hass: HomeAssistant) -> list[str]:
    """Alle ansprechbaren Empfänger als 'notify.…' (Dienste zuerst, dann Entitäten)."""
    services = hass.services.async_services().get("notify", {})
    choices = {f"notify.{name}" for name in services if name not in SKIP}
    for state in hass.states.async_all("notify"):
        if state.state == "unavailable":  # „unknown" ist bei notify-Entitäten normal
            continue
        choices.add(state.entity_id)
    return sorted(choices)


def is_entity_target(hass: HomeAssistant, target: str) -> bool:
    """True, wenn der Empfänger eine notify-Entität ist (→ notify.send_message)."""
    return target.startswith("notify.") and hass.states.get(target) is not None
