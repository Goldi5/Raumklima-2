# Installation & Einrichtung

## Voraussetzungen

- Home Assistant **2026.5** oder neuer (für die Dashboard-Strategie; die Integration selbst läuft ab 2025.10)
- [HACS](https://hacs.xyz)
- Pro Raum: ein Heizkörperthermostat als `climate`-Entität und ein Temperaturfühler. Luftfeuchte-Sensor und Fensterkontakte sind optional, aber empfohlen.
- Für Abwesenheit: Personen mit Handy-Ortung (Home-Assistant-App) und eine Zone für die Wohnung.

## Installation über HACS

1. HACS → ⋮ → **Benutzerdefinierte Repositories** → `https://github.com/Goldi5/Raumklima-2`, Kategorie **Integration**.
2. **Raumklima** suchen und herunterladen.
3. Home Assistant neu starten.

Die Dashboard-Karten werden automatisch mitgeladen – keine extra Ressource nötig.

## Ersten Raum anlegen

**Einstellungen → Geräte & Dienste → Integration hinzufügen → Raumklima**

1. **Thermostat** wählen.
2. **Fühler & Fenster** – Raumklima schlägt Temperatur-, Feuchtefühler und Fensterkontakte aus demselben Bereich vor. Kurz prüfen, fertig.
3. **Der Raum** – Raumtyp (setzt passende Standards), optional Wunschtemperatur und Absenkwerte. Technik (Kalibrierung, Preset, Verzögerungen) wird erkannt und liegt aufklappbar unter **Erweitert**.
4. **Nur beim ersten Raum: Für die ganze Wohnung** – wer wohnt hier, Zone der Wohnung, wer bekommt Benachrichtigungen, Wetterquelle, Bauart.

Danach erscheint der Raum als Gerät, und es gibt einen zweiten Eintrag **Allgemein** für alles, was die ganze Wohnung betrifft.

> **Tipp:** Vorher die eingebaute Fenstererkennung des TRV (`window_detection`) ausschalten und alte Automationen für dasselbe TRV deaktivieren.

## Weitere Räume

Wie oben, nur ohne Schritt 4 – Empfänger, Anwesenheit und Heizsaison gelten automatisch für alle Räume.

## Dashboard

- **Fertig:** Dashboard hinzufügen → **Raumklima** (Strategie). Baut die Reiter *Räume*, *Verlauf* und *Einstellungen* automatisch auf und passt sich an, wenn Räume dazukommen.
- **Eigene Dashboards:** die Karten einzeln einsetzen – siehe [Bedienung](bedienung.md).

## Aktualisieren

HACS zeigt neue Versionen an. Nach dem Herunterladen Home Assistant neu starten. Reine Karten-Änderungen sind nach einem Neuladen der Seite sichtbar.

## Umstieg von 0.2.x

Beim ersten Start von 0.3 wird **Allgemein** automatisch angelegt und die Empfänger, Ruhezeiten und die Wetterquelle aus deinen Räumen übernommen. Danach nur noch **Bewohner und Zone** auswählen (Einstellungsseite → Allgemein), damit die Abwesenheit aktiv wird.
