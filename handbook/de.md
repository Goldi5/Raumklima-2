---
title: Raumklima
subtitle: Handbuch – Heizung, die mitdenkt
lang: de
toc: Inhalt
cover_image: ../docs/images/raeume.png
footer: Raumklima für Home Assistant · github.com/Goldi5/Raumklima-2
---

# Willkommen

**Raumklima** macht aus jedem Heizkörperthermostat ein Raumthermostat, das mitdenkt. Es regelt nach einem echten Fühler im Raum, macht beim Lüften Pause, senkt ab, wenn niemand zu Hause ist, und heizt im Sommer gar nicht erst.

Dieses Handbuch erklärt Schritt für Schritt, wie du Raumklima einrichtest und im Alltag nutzt. Technisches Vorwissen brauchst du nicht – nur ein laufendes Home Assistant.

:::tip
**Kurz gesagt:** Einmal einrichten, dann läuft alles von selbst. Du musst nur noch eingreifen, wenn du etwas anders haben möchtest.
:::

## Was Raumklima für dich tut

| | |
|---|---|
| 🌡️ **Richtig messen** | Regelt nach einem Fühler mitten im Raum statt nach dem Thermostat direkt am heißen Heizkörper. |
| 🪟 **Fenster auf = Pause** | Ist ein Fenster offen, hört die Heizung auf. Danach geht es mit der alten Einstellung weiter. |
| 💨 **Lüften mit Plan** | Sagt Bescheid, wenn die Luft feucht oder verbraucht ist, wie lange gelüftet werden soll und wann es reicht. |
| 🏠 **Niemand da = sparen** | Senkt ab, wenn alle weg sind, und heizt vor, bevor jemand nach Hause kommt. |
| 🧱 **Schimmelschutz** | Senkt nie so weit ab, dass die Wände feucht werden. |
| 🍂 **Nur heizen, wenn es kalt ist** | Erkennt anhand der Wettervorhersage, ob überhaupt geheizt werden muss. |
| 📱 **Gute Nachrichten** | Schickt Hinweise aufs Handy – nachts leise. Auf Wunsch mit Lüft-Countdown auf dem Sperrbildschirm. |
| 💡 **Lichtsignal** | Lampen im Raum blinken blau, wenn gelüftet werden soll, und orange, wenn das Fenster zu soll. |
| 📈 **Bericht** | Zeigt, wie viel geheizt und gespart wurde. |

## Was du brauchst

- **Home Assistant** (Version 2026.5 oder neuer) mit **HACS**
- pro Raum ein **Heizkörperthermostat**, das in Home Assistant erscheint
- pro Raum einen **Temperaturfühler** (am besten mit Luftfeuchte)
- optional: **Fensterkontakte**, ein **CO₂-Sensor**
- für die Anwesenheit: die **Home-Assistant-App** auf euren Handys

# Einrichten

## Schritt 1: Installieren

1. Öffne in Home Assistant **HACS**.
2. Tippe oben rechts auf **⋮ → Benutzerdefinierte Repositories**.
3. Trage `https://github.com/Goldi5/Raumklima-2` ein, Kategorie **Integration**, und bestätige.
4. Suche in HACS nach **Raumklima** und tippe auf **Herunterladen**.
5. **Starte Home Assistant neu** (*Einstellungen → System → Neu starten*).

:::tip
Schalte vorher die eingebaute Fenstererkennung deines Thermostats aus (falls es eine hat) und deaktiviere alte Automationen für dieselben Thermostate. Sonst arbeiten beide gegeneinander.
:::

## Schritt 2: Den ersten Raum anlegen

Gehe zu **Einstellungen → Geräte & Dienste → Integration hinzufügen** und wähle **Raumklima**.

1. **Thermostat wählen** – das Thermostat am Heizkörper.
2. **Fühler & Fenster** – Raumklima schlägt Fühler und Fensterkontakte aus demselben Raum vor. Kurz prüfen, weiter.
3. **Der Raum** – wähle den **Raumtyp** (Wohnzimmer, Schlafzimmer, Bad …). Damit sind alle Werte schon sinnvoll eingestellt. Die Technik unter *Erweitert* kannst du in Ruhe lassen.
4. **Für die ganze Wohnung** (nur beim ersten Raum) – wer wohnt hier, welche Zone ist die Wohnung, wer bekommt Nachrichten, woher kommt das Wetter.

Für jeden weiteren Raum wiederholst du das – nur Schritt 4 entfällt.

## Schritt 3: Das Dashboard

Raumklima bringt ein fertiges Dashboard mit. So holst du es dir:

1. Öffne **Einstellungen → Dashboards**.
2. Tippe unten rechts auf **+ Dashboard hinzufügen**.
3. Wähle in der Liste **Raumklima** und tippe auf **Weiter**.
4. Gib ihm einen Namen (z. B. „Heizung“) und ein Symbol, dann **Erstellen**.

Das neue Dashboard erscheint links in der **Seitenleiste**. Es baut sich von selbst auf, mit den Reitern *Räume*, *Verlauf*, *Bericht*, *Protokoll* und *Einstellungen* – und wächst mit, wenn du Räume hinzufügst.

:::tip
**Raumklima steht nicht in der Liste?** Lade die Seite neu (am Computer **Strg + F5**, in der App: *Einstellungen → Companion App → Frontend-Cache zurücksetzen*). Die Karten werden beim Start von Home Assistant geladen.
:::

### Karten im eigenen Dashboard

Du möchtest die Raumklima-Karten lieber in dein bestehendes Dashboard einbauen? Das geht so:

1. Öffne dein Dashboard und tippe oben rechts auf den **Stift** (Bearbeiten).
2. Tippe auf **+ Karte hinzufügen**.
3. Gib im Suchfeld **Raumklima** ein.
4. Wähle eine Karte aus und tippe auf **Speichern**.

| Karte | Zeigt |
|---|---|
| **Raumklima – Übersicht** | alle Räume, Außentemperatur, wer zu Hause ist |
| **Raumklima – Raum** | einen Raum mit Temperatur, Bedienung und Lüften (Raum im Editor auswählen) |
| **Raumklima – Verlauf** | Temperatur, Luftfeuchte oder Zeitleiste aller Räume |
| **Raumklima – Heizbericht** | Woche und Monat, Ersparnis, Gesundheit |
| **Raumklima – Protokoll** | was wann warum passiert ist |
| **Raumklima – Einstellungen** | alle Einstellungen – am besten als eigene Seite in voller Breite |

## Die ersten 10 Minuten

Nimm dir nach der Einrichtung kurz Zeit für diese Punkte. Alles findest du im Dashboard im Reiter **Einstellungen → Allgemein**.

:::check
- **Bewohner antippen** – wer wohnt hier?
- **Zone wählen** – welche Zone ist eure Wohnung?
- **Empfänger hinzufügen** – wer bekommt Nachrichten? Mit **Test** prüfen.
- **Wetterquelle wählen** – z. B. `weather.forecast_home`.
- **Wunschtemperaturen prüfen** – pro Raum im jeweiligen Reiter.
:::

# Im Alltag

## Die Raumkarte lesen

![Raumkarten](../docs/images/raeume.png)

- Der **Bogen** zeigt, wie warm es gerade ist, der **Punkt** das Ziel.
- Mit **− / +** stellst du die Wunschtemperatur in halben Grad ein, mit **⏻** schaltest du den Raum aus und an.
- Ist ein Fenster offen, steht unter dem Namen **„Fenster offen seit 14:32 · 12 min“**. In der Übersicht oben siehst du die Dauer neben dem Fenster-Symbol jedes Raums.
- Oben rechts steht, was der Raum gerade macht:

| Anzeige | Bedeutung |
|---|---|
| **Heizt** | Der Raum ist kälter als gewünscht und wird geheizt. |
| **Temperatur erreicht** | Alles gut, es ist warm genug. |
| **Pausiert – Fenster offen** | Ein Fenster ist offen, die Heizung wartet. |
| **Nachtlüften – Fenster offen** | Jemand schläft bei offenem Fenster. |
| **Abgesenkt – niemand da** | Alle sind weg, es wird gespart. |
| **Heizpause** | Draußen ist es mild genug. |
| **Aus** | Du hast den Raum ausgeschaltet. |
| **Fühler ausgefallen** | Der Fühler meldet sich nicht – das Thermostat regelt allein weiter. |
| **Thermostat nicht erreichbar** | Funk- oder Batterieproblem. |

## Lüften

Wird die Luft zu feucht (oder mit CO₂-Sensor: verbraucht), bekommst du **„Bitte lüften“**. Öffnest du das Fenster, läuft in der Karte ein **Countdown** mit der empfohlenen Lüftdauer – im Winter nur wenige Minuten.

- **„Luft ausgetauscht“** – du kannst schließen.
- **„Lüftzeit erreicht“** – bitte schließen.
- **„Raum kühlt aus“** – jetzt aber wirklich schließen.

Die Nachrichten haben Knöpfe: **Erledigt**, **In 15 min erinnern** und **Heute nicht mehr**.

:::tip
Lüften lohnt sich nur, wenn die Luft draußen trockener ist. Raumklima rechnet das aus und bittet dich bei feuchtem Wetter gar nicht erst ums Lüften.
:::

## Lüft-Countdown auf dem Sperrbildschirm

Mit der Home-Assistant-App siehst du den Countdown auch auf dem **Sperrbildschirm** – auf dem iPhone als Live-Aktivität (auch in der Dynamic Island), auf Android in der Benachrichtigungsleiste. Du musst das Handy nicht entsperren.

So schaltest du ihn ein:

1. Dashboard → **Einstellungen → Allgemein → Wer bekommt was**.
2. Bei deinem Handy **📱 Lüft-Countdown auf dem Sperrbildschirm** antippen.
3. Beim nächsten Lüften auf dem iPhone den Hinweis zum Sperrbildschirm bestätigen.

| Farbe | Bedeutung |
|---|---|
| 🔵 Blau, Uhr läuft | Fenster offen, so lange noch lüften |
| 🟢 Grün | Luft ausgetauscht – du kannst schließen |
| 🟠 Orange | Lüftzeit erreicht – bitte schließen |
| 🔴 Rot | Raum kühlt aus – jetzt schließen |

Ist das Fenster zu, verschwindet die Anzeige von selbst.

:::tip
**Voraussetzung:** iPhone ab iOS 17.2 und Home Assistant ab Version 2026.7. Das Handy muss Home Assistant auch unterwegs erreichen. Bleibt die Anzeige hängen: in den iPhone-Einstellungen unter *Home Assistant → Live-Aktivitäten* aus- und wieder einschalten.
:::

## Lichtsignal: Lampen zeigen es an

Nicht jeder hat das Handy in der Hand. Darum können Lampen im Raum Bescheid geben: Sie **blinken dreimal** in einer Farbe und gehen danach wieder so, wie sie vorher waren.

So richtest du es ein:

1. Dashboard → **Einstellungen** → Reiter des Raums (z. B. *Bad*).
2. Bereich **Lichtsignal** → Lampe im Auswahlfeld wählen → **Lampe hinzufügen**. Das geht auch mit mehreren Lampen.
3. Bei **Blinken bei** antippen, wann es blinken soll.
4. Mit **Test** ausprobieren – die Lampen blinken blau.

| Farbe | Wann | von Anfang an |
|---|---|---|
| 🔵 Blau | Bitte lüften | an |
| 🟠 Orange | Bitte schließen / Raum kühlt aus | an |
| 🟢 Grün | Luft ausgetauscht | aus |
| 🔴 Rot | Problem mit der Heizung | aus |

:::tip
Nachts in der Ruhezeit, beim Schlafen mit offenem Fenster und wenn niemand zu Hause ist, blinkt nichts. Lampen ohne Farbe blinken einfach hell.
:::

## Präsenzmelder: Wer ist im Raum?

Mit Präsenzmeldern weiß Raumklima nicht nur, ob jemand zu Hause ist, sondern auch, **in welchem Raum**. Es gibt zwei Arten:

| Was | **mmWave** (Radar) | **PIR** (Bewegungsmelder) |
|---|---|---|
| sieht | auch Stillsitzende und Schlafende | nur Bewegung |
| Raum gilt als leer | nach 3 Minuten | erst nach 20 Minuten |
| zählt für „jemand zu Hause“ | ja | nein (Haustiere!) – einstellbar |

**mmWave ist deutlich zuverlässiger.** PIR geht auch, Raumklima ist damit aber vorsichtiger.

So richtest du es ein:

1. Dashboard → **Einstellungen** → Reiter des Raums.
2. Bereich **Präsenzmelder** → Melder im Auswahlfeld wählen (dahinter steht mmWave oder PIR) → **Melder hinzufügen**.
3. **Leeren Raum absenken:** *Automatisch* lässt Wohnraum, Küche und selten genutzte Räume nach 30 Minuten ohne jemanden 1,5 °C kühler werden – nur mit mmWave. Mit **Ja** gilt es auch für andere Räume oder für PIR.

Die Raumkarte zeigt dann **„Jemand im Raum“** oder **„Raum leer seit 25 min“**. Kommt jemand herein, wird sofort wieder auf die Wunschtemperatur geheizt.

:::tip
Ein Melder im Wohnzimmer verhindert auch, dass Raumklima fälschlich „alle weg“ denkt – etwa wenn ein Handy aus ist oder Besuch allein da ist. Im Urlaub zählen die Melder nicht, die Katze beendet also nicht den Urlaub.
:::

## Wenn alle weg sind

Raumklima merkt über eure Handys, wenn niemand mehr zu Hause ist:

| Situation | Was passiert |
|---|---|
| Alle seit 30 Minuten weg | Absenken auf etwa 18 °C |
| Länger als 24 Stunden weg | Absenken auf etwa 16 °C |
| Jemand ist auf dem Heimweg | Rechtzeitig vorheizen |
| Jemand kommt nach Hause | Wieder Wunschtemperatur |

Kommst du früher heim und es ist dir zu kühl: einfach hochdrehen – die Absenkung pausiert dann für 3 Stunden.

## Urlaub und Besuch

- **Urlaub:** Schalter *Urlaub* in den Einstellungen – oder ein Kalendertermin mit „Urlaub“ im Titel. Endet automatisch, wenn ihr zurückkommt.
- **Besuch:** Schalter *Gäste da* – dann wird nicht abgesenkt, auch wenn alle Bewohner unterwegs sind.

## Heizpause im Frühling und Herbst

Ist es draußen im Tagesmittel mild (Standard: über 15 °C), macht die Heizung Pause. Ist dir trotzdem kalt: **Heute heizen** – das gilt für 24 Stunden.

## Bericht und Protokoll

![Heizbericht](../docs/images/bericht.png)

Im Reiter **Bericht** siehst du für diese Woche oder diesen Monat: wie lange geheizt wurde, wie viel die Absenkung gespart hat und ob es gemütlich war. Sonntags kommt eine kurze Zusammenfassung aufs Handy.

### Der Bericht als PDF

Jede Woche, jeden Monat und am Ende der Heizsaison entsteht ein **PDF-Bericht** (4 Seiten). Darin stehen unter anderem:

- eine **Note von A bis F** für dein Raumklima – mit Verlauf,
- der Vergleich zum Vorzeitraum und zum **Vorjahr**,
- jeder Raum mit kleiner **Verlaufskurve**, eine **Rangliste** und **Werktag gegen Wochenende**,
- **Feuchte-Ampel**, CO₂ und eine **Lüft-Bilanz**,
- ein **Wärmebild**, wann geheizt wird,
- **Batteriestände**, Ausfälle und **Spartipps** mit Zahlen.

Trägst du unter *Einstellungen → Allgemein → Gebäude & Schimmelschutz* deine **Heizkosten pro Jahr** ein, rechnet der Bericht die Ersparnis grob in **Euro** um.

- **Herunterladen:** ganz unten im Reiter **Bericht** unter *PDF-Berichte* – auf **Herunterladen** tippen. Mit den Knöpfen *Woche*, *Monat* und *Heizsaison* bekommst du sofort einen Bericht bis heute.
- **Aufs Handy:** Die Push-Nachricht hat einen Knopf **PDF öffnen**.
- **Per E-Mail:** *Einstellungen → Allgemein → Benachrichtigungen allgemein → PDF per E-Mail an* → **„Raumklima (direkt hier einrichten)“**. Im Bereich **E-Mail einrichten** deinen Anbieter wählen (z. B. GMX oder Gmail), Benutzer, Passwort und Empfänger eintragen und **Speichern & Test-Mail senden** tippen. Bei Gmail, iCloud und Outlook brauchst du ein App-Passwort.

:::tip
Der Bericht kommt in der Sprache von Home Assistant: auf Deutsch, bei jeder anderen Sprache auf Englisch.
:::

Im Reiter **Protokoll** steht jede Entscheidung mit Begründung – praktisch, wenn du dich fragst: „Warum ist es jetzt so kalt?“

# Einstellungen

Alle Einstellungen findest du im Dashboard im Reiter **Einstellungen**. Änderungen werden nach einer kurzen Pause gespeichert und gelten sofort. Unsicher, was eine Einstellung bewirkt? Tippe auf das **„?“** dahinter – dann klappt eine Erklärung auf.

:::tip
Unsicher? Lass die Standardwerte stehen. Sie folgen den Empfehlungen von Verbraucherzentrale und Umweltbundesamt.
:::

![Einstellungen](../docs/images/einstellungen.png)

| Bereich | Was du dort einstellst |
|---|---|
| **Allgemein → Anwesenheit** | Bewohner, Zone, wann abgesenkt wird, Urlaub, Gäste, Kalender |
| **Allgemein → Heizsaison** | wann geheizt wird, Heute heizen |
| **Allgemein → Wer bekommt was** | Empfänger und welche Nachrichten sie bekommen |
| **Allgemein → Benachrichtigungen** | Ruhezeit, Erinnerungen, Wetterquelle, PDF-Berichte, E-Mail |
| **Allgemein → Schlafenszeiten** | Raumklima lernt, wann ihr schlaft |
| **Raum → Temperatur** | Wunschtemperatur, Absenkung, Sonnenseite |
| **Raum → Lüften & Feuchte** | ab welcher Feuchte gelüftet werden soll |
| **Raum → Fenster** | Pause bei offenem Fenster, Schlafen bei offenem Fenster |
| **Raum → Präsenzmelder** | Melder, leeren Raum absenken |
| **Raum → Lichtsignal** | Lampen, die bei Hinweisen blinken |


# Häufige Fragen

<!-- include: ../docs/de/faq.md -->

# Kleines Lexikon

| Begriff | Erklärung |
|---|---|
| **Thermostat (TRV)** | Der Regler direkt am Heizkörper. |
| **Fühler** | Ein kleines Gerät, das Temperatur (und oft Luftfeuchte) im Raum misst. |
| **Offset** | Ein Korrekturwert, damit das Thermostat dieselbe Temperatur „sieht“ wie der Fühler. |
| **Zone** | Ein Bereich auf der Karte in Home Assistant, z. B. eure Wohnung. |
| **Absenken** | Die Temperatur etwas herunterregeln, um Energie zu sparen. |
| **Heizgrenze** | Ab dieser Außentemperatur (Tagesmittel) braucht das Haus keine Heizung. |
| **Taupunkt** | Ab dieser Temperatur wird Luftfeuchte zu Wasser – z. B. an kalten Wänden. |
| **Heizgradtage** | Ein Maß dafür, wie kalt es draußen war. |
| **Ruhezeit** | Zeit, in der Nachrichten leise ankommen. |
| **HACS** | Der „App-Store“ für Erweiterungen in Home Assistant. |

# Hilfe bekommen

- **Ausführliche Anleitung:** github.com/Goldi5/Raumklima-2 → Dokumentation
- **Fehler melden oder Wunsch äußern:** github.com/Goldi5/Raumklima-2/issues
- **Diagnose-Datei für einen Fehlerbericht:** *Einstellungen → Geräte & Dienste → Raumklima → Raum → ⋮ → Diagnose herunterladen*
