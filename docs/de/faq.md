# Häufige Fragen (FAQ)

## Einrichtung

### Welche Thermostate funktionieren?
Jedes Heizkörperthermostat, das in Home Assistant als „Klima“-Gerät (`climate`) erscheint – egal ob über Zigbee, Z-Wave, WLAN oder Matter. Getestet ist das Tuya TRV602Z mit Zigbee2MQTT.

### Brauche ich unbedingt einen extra Temperaturfühler?
Ja, pro Raum einen. Das Thermostat selbst misst direkt am warmen Heizkörper und liegt deshalb oft daneben. Ein einfacher Zigbee-Fühler (z. B. von IKEA oder Aqara) irgendwo mitten im Raum reicht.

### Sind Fensterkontakte Pflicht?
Nein. Ohne Kontakt erkennt Raumklima ein offenes Fenster am plötzlichen Temperatursturz. Mit Kontakt geht es aber schneller und zuverlässiger.

### Was ist „Allgemein“ und warum gibt es das zweimal in der Liste?
„Allgemein“ ist die Zentrale für die ganze Wohnung: wer dort wohnt, wer Nachrichten bekommt, Heizsaison. Sie wird beim ersten Raum automatisch angelegt. Jeder Raum ist ein eigener Eintrag.

### Muss ich etwas in YAML schreiben?
Nein. Alles geht über die Einrichtung in Home Assistant und die Einstellungsseite im Dashboard.

## Die Heizung macht nicht, was ich will

### Der Raum heizt nicht, obwohl es kalt ist.
Schau auf die Raumkarte, dort steht der Grund:
- **Heizpause:** Draußen ist es im Tagesmittel mild. Drücke **Heute heizen** (24 Stunden) oder stelle die Betriebsart auf **Immer heizen**.
- **Abgesenkt – niemand da:** Raumklima glaubt, dass niemand zu Hause ist. Prüfe unter *Einstellungen → Allgemein*, ob die richtigen Personen und die richtige Zone gewählt sind. Hochdrehen am Thermostat hebt die Absenkung für 3 Stunden auf.
- **Pausiert – Fenster offen:** Ein Fensterkontakt meldet „offen“.

### Es heizt, obwohl niemand da ist.
Absenken bedeutet nicht ausschalten: Bei kurzer Abwesenheit hält Raumklima etwa 18 °C, bei längerer 16 °C. Ist die Luft feucht, bleibt es zum Schutz vor Schimmel etwas wärmer. In sehr kalten Nächten wird bewusst weniger abgesenkt.

### Warum wird es nicht genau so warm, wie ich eingestellt habe?
Kleine Abweichungen (± 0,5 °C) sind normal. Bleibt der Raum dauerhaft deutlich kälter, meldet der Gesundheitscheck „Raum wird nicht warm“ oder „Heizkörper kommt kaum hinterher“ – dann Heizkörper entlüften oder den Installateur nach dem hydraulischen Abgleich fragen.

### Ich drehe am Thermostat, und es springt zurück.
Unter *Geräte & Technik ändern → Raum → Erweitert* gibt es „Drehen am Thermostat übernehmen“. Ist es aus, stellt Raumklima immer seine eigene Einstellung wieder her.

### Das Ventil steht immer ganz offen (TRV602Z).
Beim TRV602Z heißt das Preset „on“ *Ventil dauerhaft offen*. Unter *Erweitert → Einschalten mit* sollte „Automatisch“ stehen.

### Woher weiß ich, warum etwas passiert ist?
Im Reiter **Protokoll** steht jede Entscheidung mit Uhrzeit und Begründung.

## Anwesenheit

### Wie erkennt Raumklima, ob jemand zu Hause ist?
Über die Home-Assistant-App auf dem Handy. Eine Person gilt als da, sobald eins ihrer Handys in der Wohnungs-Zone ist.

### Mein Handy zeigt manchmal falsche Orte (z. B. durch ein VPN).
Unmögliche Sprünge und ungenaue Ortungen ignoriert Raumklima. Erst wenn ein neuer Ort 30 Minuten stabil bleibt, wird er übernommen.

### Bringen Präsenzmelder etwas?
Ja: Sieht ein **mmWave-Melder** jemanden, wird nicht abgesenkt – auch wenn alle Handys weg sind. Und einzelne Räume (z. B. Wohnzimmer) können etwas kühler werden, solange niemand drin ist. **PIR-Bewegungsmelder** gehen auch, gelten aber als unsicher: Sie sehen niemanden, der still sitzt, und Haustiere lösen sie aus. Darum wartet Raumklima bei PIR länger und lässt sie standardmäßig nicht über „jemand zu Hause“ entscheiden.

### Wir haben Besuch, der kein Handy in Home Assistant hat.
Schalte **Gäste da** ein. Dann wird nicht abgesenkt, auch wenn alle Bewohner weg sind. Alternativ ein Kalendertermin mit „zu Hause“ oder „Homeoffice“ im Titel.

### Wie stelle ich Urlaub ein?
Schalter **Urlaub** an – oder einen Kalendertermin mit „Urlaub“ im Titel anlegen. Der Urlaub endet automatisch, sobald jemand nach Hause kommt.

## Benachrichtigungen

### Ich bekomme keine Nachrichten.
Unter *Einstellungen → Allgemein → Wer bekommt was* einen Empfänger hinzufügen und mit **Test** prüfen. Ohne Home-Assistant-App gibt es keine Push-Nachrichten.

### Ich bekomme zu viele Nachrichten.
Bei jedem Empfänger lassen sich einzelne Nachrichtenarten abwählen. Für einen einzelnen Raum gibt es den Schalter **Hinweise für diesen Raum**. In der Push selbst: **Heute nicht mehr**.

### Warum kommt nachts keine Nachricht mit Ton?
In der Ruhezeit (Standard 22–7 Uhr, am Wochenende länger) kommen Nachrichten still an. Nur Dringendes ist laut: Raum kühlt aus, Fenster offen während niemand da ist, Thermostat reagiert nicht.

### Kann ich eine Lampe statt einer Nachricht nutzen?
Ja. Unter *Einstellungen → Raum → Lichtsignal* Lampen hinzufügen – sie blinken blau bei „Bitte lüften“ und orange bei „Bitte schließen“ und gehen danach wieder auf ihren alten Zustand zurück.

### Kann ich den Lüft-Countdown auf dem Sperrbildschirm sehen?
Ja, mit der Home-Assistant-App: beim Handy unter *Wer bekommt was* **📱 Lüft-Countdown** antippen. Auf dem iPhone erscheint er als Live-Aktivität (ab iOS 17.2), auf Android als Live Update.

### Was bedeutet „Thermostat reagiert nicht“?
Ein Befehl kam auch nach mehreren Versuchen nicht beim Thermostat an. Meist Funkproblem oder leere Batterie. Raumklima versucht es alle 5 Minuten weiter.

## Sparen und Bericht

### Wie viel spare ich?
Als Faustregel spart jedes Grad weniger rund 6 % Heizenergie. Der **Heizbericht** schätzt die Ersparnis durch Absenkung für deine Wohnung.

### Was heißt „wetterbereinigt“?
Ein kalter Monat braucht mehr Heizung. „Wetterbereinigt“ rechnet das heraus, damit du Wochen und Monate fair vergleichen kannst.

### Kann ich die Werte in Excel ansehen?
Ja: Im Heizbericht oben rechts auf **CSV** tippen.

### Gibt es den Bericht als PDF – auch per E-Mail?
Ja. Woche, Monat und Heizsaison entstehen automatisch als PDF; unten im Heizbericht stehen sie zum **Herunterladen**. Per Push kommt ein Link, per E-Mail die PDF als Anhang: unter *Allgemein → Benachrichtigungen allgemein → PDF per E-Mail an* auf **E-Mail einrichten** tippen, Anbieter auswählen, Benutzer, Passwort und Empfänger eintragen und **Speichern & Test-Mail senden** – kein YAML nötig.

## Sonstiges

### Die Karten sehen nach einem Update alt aus.
Seite neu laden. In der App: *Einstellungen → Companion App → Frontend-Cache zurücksetzen*.

### Ich kann auf der Einstellungsseite nichts ändern.
Nur Administratoren dürfen Einstellungen ändern. Andere sehen „Nur Ansicht“.

### Wie melde ich einen Fehler?
Auf GitHub ein [Issue](https://github.com/Goldi5/Raumklima-2/issues) eröffnen und die Diagnose-Datei anhängen: *Einstellungen → Geräte & Dienste → Raumklima → Raum → ⋮ → Diagnose herunterladen*.
