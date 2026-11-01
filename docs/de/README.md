# Raumklima – Dokumentation

**Raumklima** macht aus jedem Heizkörperthermostat (TRV) ein intelligentes Raumthermostat: geregelt wird nach einem echten Raumfühler, bei offenem Fenster pausiert, beim Lüften beraten, bei Abwesenheit abgesenkt – und im Sommer gar nicht erst geheizt.

![Räume](../images/raeume.png)

## Inhalt

| Seite | Worum es geht |
|---|---|
| [Installation & Einrichtung](installation.md) | HACS, erster Raum, Allgemein |
| [Bedienung](bedienung.md) | Dashboard, Karten, Einstellungsseite |
| [So funktioniert's](funktionsweise.md) | Regelung, Offset, Fenster, Absicherung, Lüften, Abwesenheit, Schimmelschutz, Heizsaison |
| [Benachrichtigungen](benachrichtigungen.md) | Wer bekommt was, Ruhezeit, Aktionen, Sprachansagen |
| [Referenz](referenz.md) | Alle Einstellungen, Entitäten, Ereignisse für eigene Automationen |
| [Fehlerbehebung](fehlerbehebung.md) | Häufige Fragen und Lösungen |
| [Entwickeln](entwickeln.md) | Tests, Karte bauen, Aufbau des Codes |

## Auf einen Blick

- **Regeln nach dem Raumfühler** statt nach dem Sensor direkt am Heizkörper – automatischer Offset oder Sollwert-Ausgleich.
- **Fensterlogik:** nach 10 s offen Pause, nach 10 s zu weiter – die Einstellung bleibt erhalten.
- **Absicherung gegen Funk- und VPN-Aussetzer:** jeder Befehl wird geprüft und wiederholt.
- **Lüftungsassistent:** Feuchtegrenze je Raum, optional CO₂-Sensor, Lüftdauer nach Außentemperatur, Prüfung ob Lüften überhaupt trocknet, Warnung beim Auskühlen.
- **Abwesenheit:** Bewohner + Wohnung, Absenkung „kurz weg“ / „länger weg“, Schimmelschutz nach DIN 4108-2, Vorheizen bei Annäherung, Kalendertermine („Urlaub“, „Homeoffice“), in Frostnächten weniger absenken.
- **Heizsaison:** Heizgrenze nach Tagesmittel und Wettervorhersage, Kälteeinbruch-Regel, „Heute heizen“, Sommerpflege der Ventile; Sonnenseite-Räume heizen bei Sonne 1 °C weniger.
- **Benachrichtigungen:** pro Empfänger wählbar, welche Nachrichten er bekommt; Push mit Knöpfen, optional Sprachansagen.
- **Modernes Dashboard** mit Raumkarten, Verlauf, Zeitleiste, Heizbericht (auch als CSV) und einer komplett bearbeitbaren Einstellungsseite – auf Deutsch oder Englisch, je nach Sprache in Home Assistant.
- **Eigene Automationen:** Geräte-Auslöser wie „Bitte lüften“, „Fenster geöffnet“ oder „Heizung pausiert“.

Getestet mit Tuya **TRV602Z** (Zigbee2MQTT) und IKEA-Fühlern, funktioniert mit jedem `climate`-Thermostat in Home Assistant – Hinweise zu Matter/Thread unter [Installation](installation.md#matter--thread-thermostate).
