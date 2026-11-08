# Geräte & Thermostate

Was Raumklima mit welchem Gerät kann – und wo die Grenzen liegen. Alles hier ist aus
Rückmeldungen von Nutzern und eigenen Messungen; die Liste wächst mit jedem Erfahrungsbericht.

> **Grundsatz:** Raumklima ersetzt keine Gerätefunktion, sondern führt sie. Deshalb gilt:
> **ein Gehirn pro Raum** – entweder Raumklima regelt, oder eine Geräte-Automation. Zeitpläne und
> Boost-Funktionen im Gerät bzw. in der Hersteller-App müssen aus sein, sonst kämpfen zwei Regler
> um dasselbe Ventil.

## Auf einen Blick

| Gerät | Anbindung | Läuft gut | Grenzen |
|---|---|---|---|
| Tuya-Heizkörperthermostat | Zigbee2MQTT | Sollwert, Presets, Ventilstellung, Batterie | `preset: on` heißt *dauerhaft offen* – wird intern als `comfort` + `comfort_temperature` gesetzt |
| Moes BRT-100-TRV | Zigbee2MQTT | Sollwert, Presets, Ventilstellung, Ist-Temperatur | Meldet die Ventilstellung als eigenes `sensor.…_position` – Raumklima nimmt sie als Ventilquelle. Presets `none/programming/manual/temporary_manual/holiday`; Bereich 0–35 °C, wird auf 6–30 °C begrenzt |
| Aqara E1 | Zigbee2MQTT | Sollwert, Fenster, Batterie | meldet keinen Heiz-Zustand; Status wird aus Soll/Ist abgeleitet |
| Homematic IP / CCU | Homematic-Integration | Sollwert, Ventilstellung, zwei Wege | Rückmeldung oft erst nach 10–20 Minuten (Funk, Batteriesparmodus) |
| Livisi / RWE SmartHome | Livisi-Integration | Sollwert, Fenster | **kein Offset am Gerät** – Raumklima lernt einen geglätteten Sollwert-Ausgleich |
| Sonoff TRVZB | ZHA | Sollwert, Offset über `number.<name>_lokaler_temperatur_offset` | schläft zwischendurch; keine Ventilstellung, keine Presets |
| Netatmo | Netatmo-Integration | Sollwert, Raumfühler | träge; Ventilstellung fehlt häufig |
| FRITZ!DECT (Comet, 301, 302, 440) | AVM FRITZ!SmartHome | Sollwert, Raumfühler | Ventilstellung häufig leer; Geräte-Zeitpläne müssen aus sein; funkt nur alle ~15 Minuten (Antwortzeit steht auf *automatisch*) |
| Bosch Smart Home (SHc) | Bosch Smart Home | Sollwert, Ventilstellung (`sensor.…_ventilstoessel`), Aus über Modus | **keine Presets** (`preset_mode` immer leer); **Mindesttemperatur 18 °C** – Ausschalten über die Minimaltemperatur ist unmöglich, Raumklima nimmt dafür den Modus „aus“; Raumprogramm in der Bosch-App muss aus sein |

## Was jedes Gerät braucht

- **Ein `climate`-Thermostat** im Raum. Ohne Thermostat geht ein **Überwachungsraum** (messen, anmahnen,
  berichten – ohne Sollwerte anzufassen).
- **Raumfühler empfohlen, aber nicht Pflicht.** Ohne eigenen Fühler regelt Raumklima nach dem Fühler im
  Thermostat – dann entfällt der Offset-Ausgleich, weil Mess- und Regelort identisch sind.
- **Fensterkontakt(e)** als `binary_sensor` (auch `cover`/Öffnungssensoren). Mehrere Fenster pro Raum
  sind erlaubt; offen ist offen.
- **Ventilstellung ist optional.** Liefert das Gerät sie nicht, zeigt die Kachel „–". Das ist Absicht:
  lieber nichts anzeigen als einen geratenen Wert.

## Eigenheiten, die man kennen sollte

### Tuya (Zigbee2MQTT)
Presets sind vorhanden, aber **`preset: on` bedeutet „Ventil dauerhaft offen"** – eine Notlösung, keine
Heizstufe. Raumklima setzt deshalb `comfort` und schreibt den Sollwert in `comfort_temperature`. Der
interne Wochenplan im Gerät muss gelöscht sein, sonst überschreibt er die Vorgaben.

### Aqara E1 (Zigbee2MQTT)
Das Gerät liefert weder `hvac_action` noch `running_state` noch eine Ventilstellung. Raumklima leitet
„heizt/erreicht" deshalb aus dem Unterschied zwischen Raumtemperatur und Ziel ab – sonst stünde der
Status dauerhaft auf „Fehler".

### Homematic IP / CCU
Funktioniert in beide Richtungen (Raumklima → Gerät, Drehen am Gerät → Raumklima), aber die CCU
meldet Änderungen träge. Wer die Ventilerkennung schneller braucht, schaltet pro Raum
*Thermostat & Fühler → **Schnellere Abfrage*** ein: dann wird alle zwei Minuten aktiv abgefragt –
auf Kosten der Batterie.

### Antwortzeit statt fester Minute

Wie lange ein Gerät schweigen darf, bevor Raumklima „Thermostat nicht erreichbar" meldet, steht pro
Raum unter *Thermostat & Fühler → **Antwortzeit des Geräts***. Auf *automatisch* lernt Raumklima die
übliche Funkpause aus den letzten Ausfällen (80 %-Perzentil, ab drei Beobachtungen) und warnt erst,
wenn das Gerät deutlich länger wegbleibt; vorher gilt der übliche Takt der Gerätefamilie
(FRITZ!DECT ~15, tado 5, Netatmo 1, Homematic 10, Zigbee/MQTT 5 Minuten). Fest einstellen lässt sich
1, 5, 15 oder 30 Minuten – sinnvoll bei Geräten hinter einem Repeater.

### Livisi / RWE SmartHome
Der Offset lässt sich am Gerät nicht setzen. Raumklima lernt stattdessen den Unterschied zwischen
Raumfühler und Gerätesensor (geglättet, begrenzt auf ±4 K) und schiebt den angepassten Sollwert alle
zehn Minuten nach. Im Protokoll steht dann „Abgleich −2,3°" und das Attribut `offset_auto`.

### Sonoff TRVZB (ZHA)
Der Offset geht über `number.<name>_lokaler_temperatur_offset`. Das Gerät **schläft** zwischendurch,
Befehle werden oft erst nach mehreren Versuchen bestätigt. Bewährt haben sich:

- **Befehl prüfen nach:** 45 s (statt 20 s)
- **Offset-Mindestabstand:** 15 min
- **Schwelle:** 0,5 °C

Ventilstellung und Presets gibt es nicht – nur Heizen und Aus. Wer vorher *Versatile Thermostat* im
Ventil-Modus genutzt hat: **Öffnungs- und Schließwinkel am Gerät prüfen** (oft 0/100) und beide auf
100 setzen, sonst bleibt das Ventil zu.

### Netatmo
Sehr träge Rückmeldung. Zeitpläne in der Netatmo-App ausschalten, sonst regelt sie gegen Raumklima.
Die Ventilstellung fehlt bei vielen Modellen.

### FRITZ!DECT (Comet, DECT 440)
Zeitpläne und Boost in der FRITZ!Box abschalten. Die Ventilstellung ist häufig leer, die Batterie
wird trotzdem gemeldet.

### Bosch Smart Home (SHc)
Die Thermostate der Bosch-Zentrale kennen **keine Presets** – `preset_mode` ist immer leer, Raumklima
schreibt ausschließlich den Sollwert. Die **Mindesttemperatur liegt bei 18 °C**, deshalb lässt sich ein
Raum nicht über die Minimaltemperatur abschalten: *Ausschalten über* steht auf **Automatisch**, das
erkennt den Modus „aus“. Die Ventilstellung kommt als eigener Sensor (`sensor.…_ventilstoessel`).
Zeitprogramme und Szenen in der Bosch-App müssen aus sein, sonst überschreiben sie den Sollwert.

## Wenn etwas „–" zeigt

| Anzeige | Bedeutung |
|---|---|
| Ventil „–" | Gerät oder Anbindung liefert keine Ventilposition |
| Batterie leer/„–" | Gerät meldet keinen Batteriestand (z. B. bei manchen ZHA-Geräten) |
| Status „Fühler fehlt" | Der Raumfühler ist nicht erreichbar – Raumklima hält den letzten Wert eine Stunde |
| Preset nicht sichtbar | Gerät kennt keine Presets; Raumklima nutzt dann nur Heizen/Aus |

## Eigene Erfahrung beitragen

Abweichendes Verhalten oder ein Gerät, das hier fehlt? Bitte als Issue mit **Diagnose-Datei**
melden (Einstellungen → *Diagnose*) – darin stehen Anbindung, Entitäten und die letzten
Entscheidungen, ohne Zugangsdaten.
