"""Ventilstellung zu einem Thermostat finden – Stichwörter als Tabelle, Suchschritte der Reihe nach.

Nicht jedes Gerät nennt sie „position": Danfoss Ally liefert ``…_valve_opening``, Homematic
``…_valve_position``, Bosch ``…_valve_tappet`` (Issue #15). Deshalb wird über den Prozentwert
und die Bezeichnung gesucht, nicht über einen festen Namen.

Die Suchschritte (``STEPS``) laufen in dieser Reihenfolge; der erste Treffer gilt. Ist die
Zuordnung mehrdeutig, wird bewusst nichts gewählt – lieber keine Anzeige als die
Ventilstellung eines fremden Raums.
"""

from __future__ import annotations

from collections.abc import Iterable

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

# Stichwörter in entity_id, Name oder Übersetzungsschlüssel eines %-Sensors
STRONG_KEYWORDS: dict[str, str] = {
    "valve": "allgemein (Zigbee2MQTT, ZHA, Homematic …_valve_position)",
    "ventil": "deutsche Namen",
    "öffnung": "deutsche Namen",
    "oeffnung": "deutsche Namen ohne Umlaut",
    "opening": "Danfoss Ally (…_valve_opening)",
    "tappet": "Bosch (…_valve_tappet)",
}
# „position" allein ist zu unscharf: Rollladenaktoren heißen genauso (Issue #11) – zählt nur an
# einem Gerät, das auch ein Thermostat ist.
WEAK_KEYWORDS: dict[str, str] = {
    "position": "nur an einem Gerät mit Thermostat",
}
# Endungen, die im Namensstamm eines Thermostats nichts bedeuten
STEM_SUFFIXES = ("_thermostat", "_trv", "_valve", "_climate", "_heizkorper", "_heizkoerper")

STEPS = (
    "same_device",  # Sensor am selben Gerät wie das Thermostat
    "name_stem",  # gleicher Namensstamm der entity_id, nur bei bekanntem gleichem Bereich
    "extra_trvs",  # Sensor an einem weiteren Thermostat des Raums
    "same_area",  # irgendein Ventilsensor im Bereich des Thermostats
    "device_name",  # Gerät mit verwandtem Namen (Danfoss Ally: Sensor auf eigenem Gerät)
    "only_one",  # der einzige passende Ventilsensor (unbekannter Bereich zählt als „vielleicht“)
)


def entity_stem(entity_id: str) -> str:
    """Namensstamm einer Entität: ``climate.danfoss_ally_buro_mike`` → ``danfoss_ally_buro_mike``."""
    obj = str(entity_id or "").split(".", 1)[-1]
    for suffix in STEM_SUFFIXES:
        if obj.endswith(suffix):
            obj = obj[: -len(suffix)]
    return obj


def common_prefix(a: str, b: str) -> int:
    n = 0
    for x, y in zip(a, b, strict=False):
        if x != y:
            break
        n += 1
    return n


def name_related(candidate: str, target: str) -> bool:
    """Gehören zwei Gerätenamen zusammen? („Danfoss Ally Büro" vs. „Danfoss Ally Büro Valve")"""
    a = (candidate or "").strip().lower()
    b = (target or "").strip().lower()
    if not a or not b:
        return False
    return a == b or a.startswith(b) or b.startswith(a)


class ValveFinder:
    """Sucht den Ventilsensor für ein Thermostat (siehe ``STEPS``)."""

    def __init__(self, hass: HomeAssistant, trv: str, extra_trvs: Iterable[str] = ()) -> None:
        self.hass = hass
        self.trv = trv
        self.extra_trvs = list(extra_trvs)
        self.registry = er.async_get(hass)
        self.devices = dr.async_get(hass)
        self.trv_entry = self.registry.async_get(trv)
        self.trv_area = self.area_of(self.trv_entry) if self.trv_entry else None
        self._heating_devices = {
            e.device_id for e in self.registry.entities.values() if e.domain == "climate" and e.device_id
        }

    def find(self) -> str | None:
        if self.trv_entry is None:
            return None
        for step in STEPS:
            hit = getattr(self, f"_step_{step}")()
            if hit:
                return hit
        return None

    def find_actuator(self) -> str | None:
        """Stellglied (number) für die direkte Ventilöffnung finden."""
        if self.trv_entry is None:
            return None
        for step in STEPS:
            hit = getattr(self, f"_step_{step}_actuator")()
            if hit:
                return hit
        return None

    # ------------------------------------------------------------ Bausteine
    def usable(self, entry: er.RegistryEntry) -> bool:
        """Ein %-Sensor, dessen Bezeichnung nach Ventil klingt."""
        if entry.domain != "sensor" or entry.disabled_by:
            return False
        state = self.hass.states.get(entry.entity_id)
        unit = str((state.attributes.get("unit_of_measurement") if state else "") or "")
        if "%" not in unit:
            return False  # Batterie, RSSI, Ventilhub-Historie usw. aussortieren
        hay = f"{entry.entity_id} {entry.original_name or ''} {entry.translation_key or ''}".lower()
        if any(k in hay for k in STRONG_KEYWORDS):
            return True
        return any(k in hay for k in WEAK_KEYWORDS) and entry.device_id in self._heating_devices

    def usable_actuator(self, entry: er.RegistryEntry) -> bool:
        """Ein `number` mit Ventilstellung, das zum Thermostat gehört."""
        if entry.domain != "number" or entry.disabled_by:
            return False
        hay = f"{entry.entity_id} {entry.original_name or ''} {entry.translation_key or ''}".lower()
        if any(k in hay for k in STRONG_KEYWORDS):
            return True
        return "position" in hay and entry.device_id in self._heating_devices

    def pick(self, entries: Iterable[er.RegistryEntry]) -> str | None:
        for entry in entries:
            if self.usable(entry):
                return entry.entity_id
        return None

    def pick_actuator(self, entries: Iterable[er.RegistryEntry]) -> str | None:
        for entry in entries:
            if self.usable_actuator(entry):
                return entry.entity_id
        return None

    def area_of(self, entry: er.RegistryEntry) -> str | None:
        """Bereich steht meist am Gerät, nicht an der Entität."""
        if entry.area_id:
            return entry.area_id
        dev = self.devices.async_get(entry.device_id) if entry.device_id else None
        return dev.area_id if dev else None

    def same_area(self, entry: er.RegistryEntry) -> bool:
        """Gehört der Sensor zum selben Raum? Unbekannter Bereich zählt als „vielleicht“."""
        area = self.area_of(entry)
        return not self.trv_area or area in (None, self.trv_area)

    def same_known_area(self, entry: er.RegistryEntry) -> bool:
        """Streng: nur ein **bekannter**, gleicher Bereich zählt.

        Nötig für die Namens-Heuristik: ein Sensor ohne Bereich aus einer anderen Wohnung
        („Haus A Küche“) passte sonst auf den Raum „Haus A“ in einer anderen Wohnung – dessen
        Bericht zeigte dann fremde Ventilwerte.
        """
        return bool(self.trv_area) and self.area_of(entry) == self.trv_area

    def name_of(self, entry: er.RegistryEntry) -> str:
        dev = self.devices.async_get(entry.device_id) if entry.device_id else None
        return ((dev.name_by_user or dev.name) if dev else "") or ""

    # ------------------------------------------------------------ Suchschritte
    def _step_same_device(self) -> str | None:
        if not self.trv_entry.device_id:
            return None
        return self.pick(er.async_entries_for_device(self.registry, self.trv_entry.device_id))

    def _step_name_stem(self) -> str | None:
        """Gleicher Namensstamm: climate.danfoss_ally_buro_mike ↔ sensor.danfoss_ally_buro_mike_valve_opening."""
        stem = entity_stem(self.trv)
        if len(stem) < 4:
            return None
        related = [
            e
            for e in self.registry.entities.values()
            if (other := entity_stem(e.entity_id))
            and other != stem
            and (other.startswith(stem) or stem.startswith(other))
            # Namensgleichheit allein reicht nicht: nur bei bekanntem, gleichem Bereich
            and self.same_known_area(e)
        ]
        # der längste gemeinsame Namensanfang gewinnt (bei mehreren Kandidaten)
        related.sort(key=lambda e: -common_prefix(entity_stem(e.entity_id), stem))
        return self.pick(related)

    def _step_extra_trvs(self) -> str | None:
        """Heizkörper-Thermostate im Raum: dort sitzt das Ventil."""
        for entity_id in self.extra_trvs:
            entry = self.registry.async_get(entity_id or "")
            if entry is not None and entry.device_id:
                hit = self.pick(er.async_entries_for_device(self.registry, entry.device_id))
                if hit:
                    return hit
        return None

    def _step_same_area(self) -> str | None:
        if not self.trv_area:
            return None
        return self.pick([e for e in self.registry.entities.values() if self.area_of(e) == self.trv_area])

    def _step_device_name(self) -> str | None:
        trv_name = self.name_of(self.trv_entry)
        if not trv_name:
            return None
        return self.pick(
            e
            for e in self.registry.entities.values()
            if e.device_id and name_related(self.name_of(e), trv_name) and self.same_known_area(e)
        )

    def _step_only_one(self) -> str | None:
        loose = [e.entity_id for e in self.registry.entities.values() if self.usable(e) and self.same_area(e)]
        return loose[0] if len(loose) == 1 else None

    # ------------------------------------------------------------ Stellglied
    def _step_same_device_actuator(self) -> str | None:
        if not self.trv_entry.device_id:
            return None
        return self.pick_actuator(er.async_entries_for_device(self.registry, self.trv_entry.device_id))

    def _step_name_stem_actuator(self) -> str | None:
        stem = entity_stem(self.trv)
        if len(stem) < 4:
            return None
        related = [
            e
            for e in self.registry.entities.values()
            if (other := entity_stem(e.entity_id))
            and other != stem
            and (other.startswith(stem) or stem.startswith(other))
            and self.same_known_area(e)
        ]
        related.sort(key=lambda e: -common_prefix(entity_stem(e.entity_id), stem))
        return self.pick_actuator(related)

    def _step_extra_trvs_actuator(self) -> str | None:
        for entity_id in self.extra_trvs:
            entry = self.registry.async_get(entity_id or "")
            if entry is not None and entry.device_id:
                hit = self.pick_actuator(er.async_entries_for_device(self.registry, entry.device_id))
                if hit:
                    return hit
        return None

    def _step_same_area_actuator(self) -> str | None:
        if not self.trv_area:
            return None
        return self.pick_actuator([e for e in self.registry.entities.values() if self.area_of(e) == self.trv_area])

    def _step_device_name_actuator(self) -> str | None:
        trv_name = self.name_of(self.trv_entry)
        if not trv_name:
            return None
        return self.pick_actuator(
            e
            for e in self.registry.entities.values()
            if e.device_id and name_related(self.name_of(e), trv_name) and self.same_known_area(e)
        )

    def _step_only_one_actuator(self) -> str | None:
        loose = [e.entity_id for e in self.registry.entities.values() if self.usable_actuator(e) and self.same_area(e)]
        return loose[0] if len(loose) == 1 else None
