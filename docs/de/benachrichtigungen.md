# Benachrichtigungen

## Wer bekommt was

Unter **Einstellungen → Allgemein → Wer bekommt was** wählst du für jeden Empfänger einzeln, welche Nachrichten er bekommt:

| Nachricht | Wann | Standard |
|---|---|---|
| 💧 Bitte lüften | Feuchte 15 min über der Grenze, Lüften trocknet – oder CO₂ ab 1000 ppm (🫁) | Push |
| 🪟 Fenster schließen | empfohlene Lüftdauer erreicht | Push |
| 🥶 Raum kühlt aus | unter Mindesttemperatur oder zu stark abgekühlt | Push + Sprache |
| ✅ Luft ausgetauscht | Feuchte wieder unter der Grenze (und CO₂ unter 800 ppm) | Push, leise |
| 🚪 Fenster offen, niemand da | Fenster > 2 min offen, alle Bewohner weg | Push |
| 🏠 Abwesenheit & Vorheizen | alle weg, länger weg, „Antje kommt – heize vor“, Willkommen | aus |
| 🍂 Heizsaison Start/Ende | Heizsaison beginnt, Heizpause, Kälteeinbruch | Push |
| ⚠️ Thermostat reagiert nicht | Befehl nach allen Wiederholungen nicht bestätigt | Push + HA-Glocke |
| 🩺 Gesundheit der Heizung | Batterie schwach, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funk wackelt, Fensterkontakt still – höchstens einmal pro Tag je Problem | Push, leise |
| 📊 Wochenbericht | sonntags 18 Uhr: Heizstunden, wetterbereinigter Vergleich, Absenkung, zu feuchte Räume | Push, leise |
| 📱 Lüft-Countdown auf dem Sperrbildschirm | Fenster zum Lüften offen – siehe [unten](#lüft-countdown-auf-dem-sperrbildschirm) | aus, nur Handy-App |

**Empfänger** sind `notify`-Dienste, z. B. `notify.mobile_app_iphone` oder ein eigener Dienst wie `notify.christian`. Mit **Test** schickst du eine Probenachricht.

## Schlafenszeiten lernen

Die Integration lernt, wann ihr schlafen geht und aufsteht:

- **aus dem Nachtlüften:** Fenster im Schlafraum abends auf = ins Bett, morgens zu = aufgestanden.
- **aus Schlaf-Signalen** (optional, z. B. Licht im Wohnzimmer): abends 20 Minuten lang alle aus = ins Bett, morgens eins an = aufgestanden. Mit Signalen gilt die Ruhezeit zusätzlich live: Licht aus → Ruhe, Licht morgens an → wach.

Pro Nacht zählt das früheste Ereignis, Werktag und Wochenende (Fr→Sa, Sa→So) getrennt; ab 4 Nächten gilt der typische Wert der letzten 6 Wochen. Die Ruhezeit beginnt dann 30 Minuten vor der Bettzeit und endet 30 Minuten nach dem Aufstehen – **aber nie kürzer als eingestellt**. Das Nachtlüften-Fenster wird ebenso erweitert. Einstellen und ansehen unter *Allgemein → Schlafenszeiten*.

## Nachtlüften

Wer bei offenem Fenster schläft, soll nicht geweckt werden. Geht in einem Schlafraum zwischen **20 und 3 Uhr** ein Fenster auf und jemand ist zu Hause, schaltet der Raum auf **Nachtlüften**:

- Die Heizung bleibt aus, solange das Fenster offen ist; die anderen Räume heizen normal.
- Keine Hinweise „Fenster schließen“ oder „Raum kühlt aus“.
- Fällt der Raum unter **12 °C**, kommt einmal pro Nacht eine leise Warnung.
- Zum Ende der Ruhezeit (7 Uhr) kommt „☀️ Fenster noch offen – Heizung wartet“, danach höchstens alle 30 Minuten. Sobald das Fenster zu ist, heizt der Raum wieder.

Pro Raum unter *Einstellungen → Raum → Fenster → Schlafen bei offenem Fenster*: **Automatisch** (Schlafzimmer und „selten genutzt“), **Ja** oder **Nein**. Zeitfenster und Warngrenze unter *Allgemein → Benachrichtigungen allgemein*.

## Push-Knöpfe (iPhone/Android)

Lüftungs-Nachrichten haben drei Knöpfe:
- **Erledigt** – 15 Minuten Ruhe
- **In 15 min erinnern**
- **Heute nicht mehr** – tagsüber bis Mitternacht still, abends („Bis morgen früh“) bis zum Ende der Ruhezeit

Eine Nachricht wird automatisch entfernt, sobald sie sich erledigt hat, z. B. wenn das Fenster zu ist.

## Lüft-Countdown auf dem Sperrbildschirm

Öffnest du ein Fenster zum Lüften, zeigt das Handy einen **Countdown** mit der empfohlenen Lüftdauer – auf dem iPhone als **Live-Aktivität** (Sperrbildschirm und Dynamic Island), auf Android als **Live Update** (Sperrbildschirm, Benachrichtigungsleiste, Statusleiste).

- **Blau, Timer läuft:** Fenster offen, empfohlen z. B. 5 min.
- **Grün:** Luft ausgetauscht – du kannst schließen.
- **Orange:** Lüftzeit erreicht – bitte schließen.
- **Rot:** Raum kühlt aus – bitte jetzt schließen.

Ist das Fenster zu, verschwindet die Anzeige. Tippen öffnet das Raumklima-Dashboard.

**Einschalten:** *Einstellungen → Allgemein → Wer bekommt was* → beim Handy **📱 Lüft-Countdown auf dem Sperrbildschirm** antippen. Die Nachrichtenart gibt es nur bei Empfängern `notify.mobile_app_…` (Home-Assistant-App).

**Voraussetzungen:** aktuelle Home-Assistant-App; iPhone ab iOS 17.2 und Home Assistant ab 2026.7; das Handy muss Home Assistant auch unterwegs erreichen (Fernzugriff). Auf dem iPhone beim ersten Mal den Hinweis zur Anzeige auf dem Sperrbildschirm bestätigen. Bleibt die Anzeige hängen: *iOS-Einstellungen → Home Assistant → Live-Aktivitäten* aus- und wieder einschalten.

Der Timer läuft auf dem Handy selbst – Raumklima schickt nur bei einem neuen Zustand ein Update, das schont Akku und Push-Kontingent. Nicht beim Schlafen mit offenem Fenster und nicht, wenn das Fenster nur am Temperatursturz erkannt wurde.

## Lichtsignal im Raum

Lampen im Raum können blinken, statt (oder zusätzlich zu) einer Push-Nachricht – praktisch für alle ohne Handy in der Hand. Unter *Einstellungen → Raum → Lichtsignal*:

1. **Lampe hinzufügen** – eine oder mehrere `light`-Entitäten (bis zu 10).
2. **Blinken bei** antippen:

| Farbe | Wann | Standard |
|---|---|---|
| 🔵 Blau | Bitte lüften | an |
| 🟠 Orange | Bitte schließen / Raum kühlt aus | an |
| 🟢 Grün | Luft ausgetauscht | aus |
| 🔴 Rot | Problem mit der Heizung (Gesundheitscheck) | aus |

3. Mit **Test** blinken die Lampen einmal blau.

Die Lampen blinken dreimal und bekommen danach ihren vorherigen Zustand zurück – eine ausgeschaltete Lampe geht wieder aus, eine eingeschaltete bekommt Helligkeit und Farbe zurück. Lampen ohne Farbe blinken einfach hell. **Kein Lichtsignal** in der Ruhezeit, beim Schlafen mit offenem Fenster und wenn niemand zu Hause ist. Jedes Signal steht im Protokoll.

## Ruhezeit

Am **Wochenende** (Sa/So) endet die Ruhezeit später – Standard 9:00, einstellbar unter *Allgemein → Benachrichtigungen allgemein → Wochenende bis*.

Standard 22:00–07:00 Uhr. In der Ruhezeit kommen Push-Nachrichten **still** an. Laut melden sich nur dringende Nachrichten: *Raum kühlt aus*, *Fenster offen, niemand da* und *Thermostat reagiert nicht*. Sprachansagen gibt es in der Ruhezeit nie.

## Sprachansagen

Als Empfänger lässt sich auch ein Lautsprecher eintragen, z. B. Alexa über `notify.alexa_media_…`. Standardmäßig sagt er nur *Raum kühlt aus* an und, bei *Fenster schließen*, ab der dritten Erinnerung.

## Pro Raum stummschalten

In jedem Raum gibt es den Schalter **Hinweise für diesen Raum**, z. B. für ein Gästezimmer, das nur bei Besuch genutzt wird.

## Wiederholen

„Raum kühlt aus“ kommt höchstens dreimal laut; danach erinnert es alle 30 Minuten leise, solange der Raum zu kalt ist.

Solange ein Problem besteht, wird alle 5 Minuten erinnert (einstellbar). *Bitte lüften* kommt höchstens alle 30 Minuten.
