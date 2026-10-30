# Raumklima für Home Assistant

**Heizung, die mitdenkt.** Raumklima macht aus jedem Heizkörperthermostat (TRV) ein intelligentes Raumthermostat: Es regelt nach einem echten Raumfühler, pausiert bei offenem Fenster, berät beim Lüften, senkt ab, wenn niemand zu Hause ist – mit Schimmelschutz – und heizt nur, wenn es draußen wirklich kalt ist.

**Aktuelle Version: 0.3.1** – Änderungen siehe [CHANGELOG.md](CHANGELOG.md) · 🇬🇧 [English documentation](docs/en/README.md)

![Räume](docs/images/raeume.png)

## Funktionen

| | |
|---|---|
| 🌡️ **Regeln nach dem Raumfühler** | automatischer Offset oder Sollwert-Ausgleich, Notbetrieb bei Fühlerausfall |
| 🪟 **Fensterlogik** | nach 10 s offen Pause, nach 10 s zu weiter – Einstellung bleibt erhalten |
| 🛡️ **Absicherung** | jeder Befehl wird geprüft und wiederholt – gegen Funk- und VPN-Aussetzer |
| 💨 **Lüftungsassistent** | Feuchtegrenze je Raum, Lüftdauer nach Außentemperatur, „trocknet Lüften überhaupt?“, Warnung beim Auskühlen |
| 🏠 **Abwesenheit** | Bewohner + Wohnungs-Zone, Absenkung „kurz weg“ / „länger weg“, Vorheizen bei Annäherung, Urlaub & Gäste, robuste Ortung (mehrere Handys, VPN-Sprungfilter) |
| 🧱 **Schimmelschutz** | Absenkung nach DIN 4108-2 – die kälteste Wandstelle bleibt unter 80 % Feuchte |
| 🍂 **Heizsaison** | Heizgrenze nach Tagesmittel aus Messung + Wettervorhersage, Kälteeinbruch-Regel, „Heute heizen“, Sommerpflege der Ventile |
| 📱 **Benachrichtigungen** | pro Empfänger wählbar, welche Nachrichten; Push mit Knöpfen, Ruhezeit, optional Sprachansagen |
| 📈 **Heizbericht** | Woche/Monat: Heizstunden, wetterbereinigter Vergleich, Ersparnis durch Absenkung, Wohlfühlzeit; Wochen-Push sonntags |
| 🩺 **Gesundheitscheck** | Batterien, „Raum wird nicht warm“, hängender Fühler, Funkaussetzer, stiller Fensterkontakt |
| 📊 **Dashboard** | Raumkarten, Verlauf mit Zeitleiste, Bericht, komplett bearbeitbare Einstellungsseite – automatisch per Strategie |

<p>
<img src="docs/images/verlauf.png" width="49%"> <img src="docs/images/bericht.png" width="49%">
<img src="docs/images/einstellungen.png" width="49%">
</p>

## Installation

1. HACS → ⋮ → **Benutzerdefinierte Repositories** → `https://github.com/Goldi5/Raumklima-2` (Integration)
2. **Raumklima** herunterladen, Home Assistant neu starten
3. **Einstellungen → Geräte & Dienste → Integration hinzufügen → Raumklima**: Thermostat wählen, Fühler bestätigen, Raumtyp wählen – fertig. Beim ersten Raum zusätzlich Bewohner, Wohnung und Benachrichtigungen.
4. Dashboard hinzufügen → **Raumklima** (Strategie)

Ausführlich: [Installation & Einrichtung](docs/de/installation.md)

## Dokumentation

| | Deutsch | English |
|---|---|---|
| Übersicht | [README](docs/de/README.md) | [README](docs/en/README.md) |
| Installation & Einrichtung | [installation](docs/de/installation.md) | [installation](docs/en/installation.md) |
| Bedienung | [bedienung](docs/de/bedienung.md) | [usage](docs/en/usage.md) |
| So funktioniert's | [funktionsweise](docs/de/funktionsweise.md) | [how it works](docs/en/how-it-works.md) |
| Benachrichtigungen | [benachrichtigungen](docs/de/benachrichtigungen.md) | [notifications](docs/en/notifications.md) |
| Referenz | [referenz](docs/de/referenz.md) | [reference](docs/en/reference.md) |
| Fehlerbehebung | [fehlerbehebung](docs/de/fehlerbehebung.md) | [troubleshooting](docs/en/troubleshooting.md) |

## Kompatibilität

- Home Assistant 2026.5+ (Strategie), Integration ab 2025.10
- Jedes `climate`-Thermostat; getestet mit Tuya **TRV602Z** über Zigbee2MQTT und IKEA-Fühlern
- Benachrichtigungen über jeden `notify`-Dienst (Companion App, Alexa Media, …)

## Lizenz & Mitmachen

Open Source. Fehler und Wünsche gerne als [Issue](https://github.com/Goldi5/Raumklima-2/issues) – mit Diagnose-Datei (Gerät → ⋮ → Diagnose herunterladen).
