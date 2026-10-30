# Bedienung

## Reiter „Räume“

![Räume](../images/raeume.png)

**Übersicht oben:** alle Räume als Kacheln mit Ist-Temperatur, Ziel, Luftfeuchte und Status. Die Chips zeigen, wie viele Räume heizen, offene Fenster, Hinweise, den Übertragungsstatus – und neu, wer zu Hause ist und ob gerade Heizsaison oder Heizpause ist.

**Raumkarte:**
- Der **Bogen** zeigt die Ist-Temperatur, der **Knopf** das Ziel. Mit **−/+** in 0,5-°C-Schritten, mit **⏻** an/aus.
- Unter der Temperatur steht, was gerade gilt: *Ziel 20 °C*, *Abgesenkt 18 °C · Wunsch 20°*, *Heizpause* oder *Frostschutz*.
- Beim Lüften läuft ein **Countdown** mit der empfohlenen Lüftdauer.
- Die Kacheln unten zeigen Feuchte, Taupunkt, Ventilstellung, Außenklima, Heizkörper-Temperatur und Offset.

## Reiter „Verlauf“

![Verlauf](../images/verlauf.png)

- **Wetter** oben über die ganze Breite.
- **Raumtemperatur** und **Luftfeuchte** als Kurven je Raum, Wohlfühlbereich als Band (19–22 °C bzw. 40–60 %). Räume per Chip ein-/ausblenden, Zeitraum 6 h / 24 h / 7 Tage, Werte beim Überfahren.
- **Heizung & Fenster:** Zeitleiste je Raum – heizt, erreicht, abgesenkt, Fenster offen, aus, Heizpause. Kurze Wechsel beim Regeln werden zusammengefasst.

## Reiter „Einstellungen“

![Einstellungen](../images/einstellungen.png)

Hier ist **alles zu sehen und direkt änderbar**:

**Allgemein**
- *Anwesenheit & Absenkung:* Bewohner antippen, Zone wählen, Wartezeit, „länger weg“, Vorheizen, Urlaub, Gäste. Man sieht, wer gerade da ist und wie weit die anderen entfernt sind.
- *Heizsaison & Heizgrenze:* Betriebsart, Heizgrenze, Saisonzeitraum, Kälteeinbruch, Sicherung, Sommerpflege, **Heute heizen**. Darüber das aktuelle Außen-Mittel und die Vorhersage.
- *Wer bekommt was:* je Empfänger die Nachrichtenarten antippen, **Test** senden, Empfänger hinzufügen oder entfernen (Push oder Sprachansage).
- *Benachrichtigungen allgemein:* Ruhezeit, Erinnerungsabstand, Wetterquelle, Fehler in der HA-Glocke.
- *Gebäude & Schimmelschutz:* Bauart.
- *Alle Räume auf einen Blick:* Tabelle; antippen öffnet den Raum.

![Allgemein komplett](../images/einstellungen-allgemein.png)

**Je Raum:** Wunschtemperatur, Raumtyp, Absenkwerte, Feuchtegrenze, Mindesttemperatur und Abkühlung beim Lüften, Fensterlogik und Verzögerungen, Hinweise an/aus, Kalibrieren. Geräte und Technik über *Geräte & Technik ändern*.

![Raum](../images/einstellungen-raum.png)

Auf dem Handy stehen Beschriftung und Regler untereinander:

<img src="../images/einstellungen-handy.png" width="320">

Änderungen werden nach einer kurzen Pause gespeichert. Ändern dürfen nur Administratoren; andere Benutzer sehen die Seite nur an.

## Karten für eigene Dashboards

```yaml
type: custom:raumklima-overview-card   # alle Räume + Außenklima
title: Heizung
strip_prefix: Finja Berlin             # optional: Präfix aus den Namen entfernen
---
type: custom:raumklima-card            # ein Raum
entity: climate.finja_berlin_wohnzimmer
---
type: custom:raumklima-history-card    # Verlauf
mode: temperature                      # temperature | humidity | timeline
hours: 24
---
type: custom:raumklima-settings-card   # Einstellungen (am besten als Panel-Ansicht)
```
