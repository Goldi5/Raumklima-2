# So funktioniert's

## 1. Regeln nach dem Raumfühler

Ein Thermostat am Heizkörper misst direkt neben der warmen Rippe – es hält den Raum meist zu kalt. Raumklima nimmt einen **externen Fühler** im Raum als Maßstab:

- **Offset (empfohlen):** Das TRV bekommt laufend einen Korrekturwert (`local_temperature_calibration`), sodass seine eigene Messung der Raumtemperatur entspricht. Der Offset wird aus dem Rohwert zurückgerechnet, erst ab 0,3 °C Änderung und höchstens alle 5 Minuten gesendet; Ausreißer des Fühlers werden verworfen.
- **Sollwert-Ausgleich:** für TRVs ohne Offset – der Sollwert am TRV wird um die Differenz verschoben.
- **Notbetrieb:** Meldet der Fühler länger als 60 Minuten nichts, regelt das TRV mit eigenem Sensor weiter und der Status warnt.

## 2. Fensterlogik

- Fenster **≥ 10 s offen** → Heizung pausiert (TRV aus), Zieltemperatur bleibt gespeichert.
- Fenster **≥ 10 s zu** → alter Zustand kommt zurück.
- Verbindungsabbrüche (`unavailable`) zählen nicht als „offen“ oder „zu“.

**Fenster ohne Kontakt:** Hat ein Raum keinen Fensterkontakt (oder ist er nicht erreichbar), erkennt die Integration ein offenes Fenster am Temperatursturz: fällt es in 6 Minuten um 1 °C und ist es draußen mindestens 5 °C kälter, pausiert die Heizung. Sie läuft weiter, sobald es wieder 0,3 °C wärmer wird (frühestens nach 10, spätestens nach 30 Minuten). Pro Raum einstellbar: Automatisch / Ja / Nein.

## 3. Absicherung bei Funk- und VPN-Aussetzern

Jeder Befehl ans TRV wird nach 20 s **geprüft**. Kam er nicht an, wird er wiederholt – mit wachsendem Abstand, danach alle 5 Minuten weiter. Meldet sich das TRV zurück, wird Ausstehendes sofort nachgeschickt. Zusätzlich gleicht Raumklima alle 10 Minuten Soll und Ist ab. Klappt es gar nicht, kommt eine Meldung.

**TRV602Z-Besonderheit:** Das Preset „on“ bedeutet dort *Ventil dauerhaft offen*. Raumklima nutzt automatisch „eco“ (regelt auf den gesendeten Sollwert) und fängt den gespeicherten Eco-Wert ab, den das TRV beim Preset-Wechsel lädt.

## 4. Lüftungsassistent

- **Bitte lüften:** Luftfeuchte 15 Minuten über der Grenze des Raums (Standard 70 %, Bad 75 %) – aber nur, wenn **Lüften auch trocknet** (absolute Feuchte draußen niedriger als drinnen).
- **Lüftdauer** nach Außentemperatur (co2online/UBA): unter 0 °C 4 min, 0–5 °C 5 min, 5–10 °C 10 min, 10–15 °C 15 min, 15–20 °C 20 min, darüber 30 min.
- **Fenster schließen**, wenn die Zeit um ist; **Luft ausgetauscht**, wenn die Feuchte wieder unter der Grenze ist.
- **Raum kühlt aus:** unter Mindesttemperatur (Wohnräume 18 °C, Schlafzimmer/selten genutzt 16 °C) oder mehr als 3 °C kälter als beim Öffnen.
- **Schimmelrisiko:** dauerhaft über 70 % oder kalt und feucht.

## 5. Abwesenheit

Für die ganze Wohnung legst du fest, **wer hier wohnt** (Personen) und **welche Zone die Wohnung ist**. Eine Person gilt als da, sobald **irgendeins ihrer Handys** in der Zone ist.

| Stufe | Wann | Ziel |
|---|---|---|
| Jemand da | mindestens eine Person in der Zone | Wunschtemperatur |
| Kurz weg | alle weg, nach 30 min Wartezeit | Absenkung „kurz“ (Wohnräume 18 °C, Schlafzimmer 16 °C) |
| Länger weg | ab 24 h oder Schalter **Urlaub** | Absenkung „länger“ (16 °C) |
| Vorheizen | jemand nähert sich, näher als 10 km | Wunschtemperatur |
| Gäste da | Schalter **Gäste** | Wunschtemperatur |

**Robuste Ortung:**
- **Unmögliche Sprünge** (mehr als 300 km/h, z. B. durch ein VPN, das den Standort nach Hause verlegt) werden ignoriert. Bleibt der neue Ort länger als 30 Minuten bestehen, wird er übernommen (echte Reise).
- **Ungenaue Ortungen** (über 200 m) zählen nicht.
- Router- oder Bluetooth-Tracker ohne Koordinaten werden übergangen.

**Weitere Regeln:**
- Wer am Regler oder in der App **hochdreht**, während abgesenkt ist, setzt die Absenkung in diesem Raum für **3 Stunden** aus.
- **Urlaub** endet automatisch, sobald jemand ankommt.
- Ist niemand da, gibt es **keine Lüft-Erinnerungen** – stattdessen die Meldung „Fenster offen, niemand da“.

Die Werte stammen aus den Empfehlungen der Verbraucherzentrale bzw. des vzbv: bei kurzer Abwesenheit etwa 18 °C, bei längerer nicht unter 16 °C, die Heizung nie ganz ausschalten. Jedes Grad weniger spart rund 6 % Heizenergie.

**Aufheizzeit und Vorheizen nach Ankunftszeit:** Jeder Raum lernt, wie schnell er warm wird – in °C pro Stunde, abhängig von der Außentemperatur (aus den letzten 30 Aufheizvorgängen, ab 3 gilt es). Nähert sich jemand, schätzt die Integration die Ankunftszeit aus der Geschwindigkeit der letzten Minuten. Ist die Person früher da, als die Wohnung zum Aufheizen braucht (plus 10 Minuten), wird vorgeheizt – auch jenseits der km-Grenze, bis 150 km. Solange noch nichts gelernt ist, gilt nur die km-Grenze.

## 6. Schimmelschutz

Bei **längerer Abwesenheit** rechnet Raumklima aus, wie weit die Temperatur sinken darf, ohne dass die kälteste Wandstelle (Außenecke) zu feucht wird – nach dem Kriterium der **DIN 4108-2**: höchstens 80 % relative Feuchte an der Oberfläche.

```
Wandtemperatur  θsi = θaußen + fRsi · (θinnen − θaußen)
Dampfdruck der Raumluft bleibt beim Absenken gleich
→ kleinste θinnen, bei der die Wand ≤ 80 % Feuchte hat
```

- **fRsi** (Temperaturfaktor) nach Bauart: Altbau unsaniert 0,60 · Altbau saniert 0,70 · Neubau 0,80.
- Ist die Luft **trocken**, darf deutlich abgesenkt werden. Beispiel: 18 °C / 45 % bei 0 °C draußen – unbedenklich bis etwa 13 °C.
- Ist die Luft **feucht** (z. B. Bad nach dem Duschen), bleibt der Raum wärmer, bis die Feuchte gesunken ist. Warme Luft nimmt mehr Wasser auf, dadurch sinkt die Feuchte an der Wand.
- Bei **kurzer Abwesenheit** greift der Schimmelschutz bewusst nicht: Einige Stunden niedrigerer Temperatur verursachen kein Feuchteproblem. Kritisch wird es erst, wenn die Wand über Tage feucht bleibt.

## 7. Heizsaison & Heizgrenze

Geheizt wird, wenn es draußen wirklich kalt ist – maßgeblich ist die **Heizgrenze**: das Tagesmittel der Außentemperatur, oberhalb dessen ein Gebäude keine Heizung braucht (co2online: Altbau unsaniert 15–17 °C, saniert 14–16 °C, Neubau 12–15 °C).

- **Tagesmittel** = Mittel aus den **letzten 24 h** (gemessen) und den **nächsten 24 h** (Vorhersage). So reagiert die Heizung, bevor es kalt wird.
- **Heizsaison** (Standard 1. Oktober – 30. April):
  - Aus erst nach **2 milden Tagen** über Heizgrenze + 1 °C.
  - An, sobald das Mittel unter die Heizgrenze fällt.
- **Außerhalb der Saison** bleibt die Heizung aus. Ausnahme **Kälteeinbruch**: Liegt das Tagesmittel 3 Tage unter 12 °C, wird trotzdem geheizt (wie im Mietrecht).
- **Sicherung:** Fällt ein Raum unter 16 °C, heizt er immer.
- **Betriebsarten:** Automatisch, Immer heizen, Heizpause. **Heute heizen** hebt eine Pause für 24 h auf.
- **Sommerpflege:** In der Heizpause öffnet Raumklima mittwochs um 11 Uhr die Ventile für 3 Minuten, damit sie nicht festsitzen.

## Vorrang

1. Fenster offen → Pause
2. Heizpause → aus (außer Sicherung bzw. Frostschutz)
3. Alle weg → Absenkung, aber nie unter den Schimmelschutz
4. Sonst → Wunschtemperatur
