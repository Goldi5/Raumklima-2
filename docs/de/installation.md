# Installation & Einrichtung

## Voraussetzungen

- Home Assistant **2026.5** oder neuer (für die Dashboard-Strategie; die Integration selbst läuft ab 2025.10)
- [HACS](https://hacs.xyz)
- Pro Raum: ein Heizkörperthermostat als `climate`-Entität und ein Temperaturfühler. Luftfeuchte-Sensor und Fensterkontakte sind optional, aber empfohlen; ein CO₂-Sensor ebenfalls optional.
- Für Abwesenheit: Personen mit Handy-Ortung (Home-Assistant-App) und eine Zone für die Wohnung.

## Installation über HACS

1. HACS → ⋮ → **Benutzerdefinierte Repositories** → `https://github.com/Goldi5/Raumklima-2`, Kategorie **Integration**.
2. **Raumklima** suchen und herunterladen.
3. Home Assistant neu starten.

Die Dashboard-Karten werden automatisch mitgeladen – keine extra Ressource nötig.

## Ersten Raum anlegen

**Einstellungen → Geräte & Dienste → Integration hinzufügen → Raumklima**

1. **Thermostat** wählen.
2. **Fühler & Fenster** – Raumklima schlägt Temperatur-, Feuchte- und CO₂-Fühler sowie Fensterkontakte aus demselben Bereich vor. Kurz prüfen, fertig. Mehrere Heizkörper im Raum? Die übrigen Thermostate unter **Weitere Thermostate im Raum** wählen – sie bekommen dieselben Befehle, jedes mit eigener Prüfung und eigenem Korrekturwert. Fensterkontakte gehen beliebig viele (Pause, sobald eins offen ist).
3. **Der Raum** – Raumtyp (setzt passende Standards), optional Wunschtemperatur und Absenkwerte. Technik (Kalibrierung, Preset, Verzögerungen) wird erkannt und liegt aufklappbar unter **Erweitert**.
4. **Nur beim ersten Raum: Für die ganze Wohnung** – wer wohnt hier, Zone der Wohnung, wer bekommt Benachrichtigungen, Wetterquelle, Bauart.

Danach erscheint der Raum als Gerät, und es gibt einen zweiten Eintrag **Allgemein** für alles, was die ganze Wohnung betrifft.

> **Tipp:** Vorher die eingebaute Fenstererkennung des TRV (`window_detection`) ausschalten und alte Automationen für dasselbe TRV deaktivieren.

## Weitere Räume

Wie oben, nur ohne Schritt 4 – Empfänger, Anwesenheit und Heizsaison gelten automatisch für alle Räume.

## Dashboard

- **Fertig:** Dashboard hinzufügen → **Raumklima** (Strategie). Baut die Reiter *Räume*, *Verlauf* und *Einstellungen* automatisch auf und passt sich an, wenn Räume dazukommen.
- **Eigene Dashboards:** die Karten einzeln einsetzen – siehe [Bedienung](bedienung.md).

## Matter & Thread-Thermostate

Raumklima steuert jedes Thermostat, das in Home Assistant als `climate`-Entität erscheint – also auch Matter-Geräte (z. B. Eve Thermo, Bosch, Aqara). Selbst getestet ist bisher nur das Tuya TRV602Z; Rückmeldungen zu Matter-Geräten gerne als Issue.

Worauf es ankommt:

- **Ausschalten:** Matter-Thermostate haben meist keine Presets, aber den Modus „aus“. *Ausschalten über* auf **Automatisch** lassen – Raumklima nimmt dann „HVAC aus“.
- **Kalibrierung:** Bietet Home Assistant für das Gerät eine Zahl-Entität für den Temperatur-Offset an, **Offset** wählen. Sonst **Sollwert-Ausgleich** – das funktioniert mit jedem Thermostat.
- **Thread schläft:** Batteriebetriebene Thread-Geräte melden sich nur alle paar Sekunden. Kommt oft „Thermostat reagiert nicht“, unter *Technik* *Befehl prüfen nach* auf 30–40 s erhöhen.
- **Eigene Fenstererkennung** des Thermostats ausschalten, sonst arbeiten beide gegeneinander.

## Aktualisieren

HACS zeigt neue Versionen an. Nach dem Herunterladen Home Assistant neu starten. Reine Karten-Änderungen sind nach einem Neuladen der Seite sichtbar.

## Umstieg von 0.2.x

Beim ersten Start von 0.3 wird **Allgemein** automatisch angelegt und die Empfänger, Ruhezeiten und die Wetterquelle aus deinen Räumen übernommen. Danach nur noch **Bewohner und Zone** auswählen (Einstellungsseite → Allgemein), damit die Abwesenheit aktiv wird.
