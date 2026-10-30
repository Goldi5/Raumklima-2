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

## Auf einen Blick

- **Regeln nach dem Raumfühler** statt nach dem Sensor direkt am Heizkörper – automatischer Offset oder Sollwert-Ausgleich.
- **Fensterlogik:** nach 10 s offen Pause, nach 10 s zu weiter – die Einstellung bleibt erhalten.
- **Absicherung gegen Funk- und VPN-Aussetzer:** jeder Befehl wird geprüft und wiederholt.
- **Lüftungsassistent:** Feuchtegrenze je Raum, Lüftdauer nach Außentemperatur, Prüfung ob Lüften überhaupt trocknet, Warnung beim Auskühlen.
- **Abwesenheit:** Bewohner + Wohnung, Absenkung „kurz weg“ / „länger weg“, Schimmelschutz nach DIN 4108-2, Vorheizen bei Annäherung.
- **Heizsaison:** Heizgrenze nach Tagesmittel und Wettervorhersage, Kälteeinbruch-Regel, „Heute heizen“, Sommerpflege der Ventile.
- **Benachrichtigungen:** pro Empfänger wählbar, welche Nachrichten er bekommt; Push mit Knöpfen, optional Sprachansagen.
- **Modernes Dashboard** mit Raumkarten, Verlauf, Zeitleiste und einer komplett bearbeitbaren Einstellungsseite.

Getestet mit Tuya **TRV602Z** (Zigbee2MQTT) und IKEA-Fühlern, funktioniert mit jedem `climate`-Thermostat in Home Assistant.
