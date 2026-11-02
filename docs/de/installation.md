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

## Welche Thermostate funktionieren?

Raumklima steuert **jedes Heizkörperthermostat, das in Home Assistant als `climate`-Entität erscheint** und dessen Temperatur sich einstellen lässt – egal ob über Zigbee, Z-Wave, WLAN, Bluetooth, Matter/Thread oder eine Cloud.

| | Wofür | Wenn es fehlt |
|---|---|---|
| **Temperatur einstellbar** (Pflicht) | Steuerung | geht nicht |
| **Eigene Temperaturmessung** | Ausgleich: wie viel wärmer es direkt am Heizkörper ist | Raumklima regelt ohne Ausgleich nach dem Raumfühler |
| **Offset-Einstellung** (Zahl wie „Temperatur-Kalibrierung“) | Korrektur direkt im Thermostat | automatisch **Sollwert-Ausgleich** – Raumklima stellt das Thermostat entsprechend höher/tiefer; geht mit jedem Gerät |
| **Ventilstellung** | Bericht, Hinweis „Heizkörper kommt kaum hinterher“ | nur diese Auswertungen fehlen |
| **Ausschalten** (Preset „aus“, Modus „aus“) | Pause bei offenem Fenster, Heizpause | Raumklima stellt die niedrigste Temperatur ein |

**Vor dem Start am Thermostat ausschalten:** eigene **Zeitpläne**, eigene **Fenstererkennung** und **Boost**/Automatik-Modi – sonst arbeiten Thermostat und Raumklima gegeneinander. Alte Automationen für dieselben Thermostate deaktivieren.

### Hinweise je Gerätetyp

- **Zigbee (z. B. Tuya, Aqara, Danfoss, Bosch, Moes):** meist mit Offset-Einstellung und eigener Temperatur – ideal. Tuya-Geräte über Zigbee2MQTT melden den Offset oft erst nach dem ersten Setzen; das erledigt Raumklima automatisch.
- **Shelly (Shelly TRV, Shelly BLU TRV über BLU-Gateway):** erscheinen über die offizielle Shelly-Integration als `climate`-Entität. Ob Offset und Ventilstellung an Home Assistant weitergegeben werden, hängt von Modell und Firmware ab – ohne Offset greift der Sollwert-Ausgleich.
- **Matter & Thread (z. B. Eve Thermo, Bosch, Aqara):** meist keine Presets, aber Modus „aus“ – *Ausschalten über* auf **Automatisch** lassen. Oft ohne Offset → **Sollwert-Ausgleich**. Batteriebetriebene Thread-Geräte melden sich nur alle paar Sekunden: Kommt oft „Thermostat reagiert nicht“, unter *Technik* *Befehl prüfen nach* auf 30–40 s erhöhen.
- **Cloud-Geräte (z. B. Tado, Netatmo):** funktionieren, reagieren aber verzögert. Raumklima prüft jeden Befehl und wiederholt ihn – bei häufigen Meldungen *Befehl prüfen nach* erhöhen. Ohne Internet keine Steuerung.
- **Homematic, Z-Wave & Co.:** wie oben – Hauptsache `climate`-Entität. Bei Funk mit Duty-Cycle (Homematic) lieber nicht zu oft verstellen; die Bremse gegen zu viele Befehle schützt zusätzlich.

### Geprüfte Thermostate

| Thermostat | Anbindung | Status |
|---|---|---|
| Tuya TRV602Z | Zigbee2MQTT | ✅ getestet (Offset, Ventilstellung, Presets) |
| Shelly TRV / BLU TRV | Shelly | ❔ noch nicht getestet – Erfahrungsbericht willkommen |
| Eve Thermo, Aqara, Bosch (Matter) | Matter/Thread | ❔ noch nicht getestet |

Dein Thermostat läuft (oder nicht)? Bitte als [Issue](https://github.com/Goldi5/Raumklima-2/issues) melden – mit Modell, Anbindung und was funktioniert. So wächst diese Liste.

## Aktualisieren

HACS zeigt neue Versionen an. Nach dem Herunterladen Home Assistant neu starten. Reine Karten-Änderungen sind nach einem Neuladen der Seite sichtbar.

## Umstieg von 0.2.x

Beim ersten Start von 0.3 wird **Allgemein** automatisch angelegt und die Empfänger, Ruhezeiten und die Wetterquelle aus deinen Räumen übernommen. Danach nur noch **Bewohner und Zone** auswählen (Einstellungsseite → Allgemein), damit die Abwesenheit aktiv wird.
