# Benachrichtigungen

## Wer bekommt was

Unter **Einstellungen → Allgemein → Wer bekommt was** wählst du für jeden Empfänger einzeln, welche Nachrichten er bekommt:

| Nachricht | Wann | Standard |
|---|---|---|
| 💧 Bitte lüften | Feuchte 15 min über der Grenze, Lüften trocknet | Push |
| 🪟 Fenster schließen | empfohlene Lüftdauer erreicht | Push |
| 🥶 Raum kühlt aus | unter Mindesttemperatur oder zu stark abgekühlt | Push + Sprache |
| ✅ Luft ausgetauscht | Feuchte wieder unter der Grenze | Push, leise |
| 🚪 Fenster offen, niemand da | Fenster > 2 min offen, alle Bewohner weg | Push |
| 🏠 Abwesenheit & Vorheizen | alle weg, länger weg, „Antje kommt – heize vor“, Willkommen | aus |
| 🍂 Heizsaison Start/Ende | Heizsaison beginnt, Heizpause, Kälteeinbruch | Push |
| ⚠️ Thermostat reagiert nicht | Befehl nach allen Wiederholungen nicht bestätigt | Push + HA-Glocke |
| 🩺 Gesundheit der Heizung | Batterie schwach, Raum wird trotz offenem Ventil nicht warm, Fühler hängt, Funk wackelt, Fensterkontakt still – höchstens einmal pro Tag je Problem | Push, leise |
| 📊 Wochenbericht | sonntags 18 Uhr: Heizstunden, wetterbereinigter Vergleich, Absenkung, zu feuchte Räume | Push, leise |

**Empfänger** sind `notify`-Dienste, z. B. `notify.mobile_app_iphone` oder ein eigener Dienst wie `notify.christian`. Mit **Test** schickst du eine Probenachricht.

## Push-Knöpfe (iPhone/Android)

Lüftungs-Nachrichten haben drei Knöpfe:
- **Erledigt** – 15 Minuten Ruhe
- **In 15 min erinnern**
- **Heute nicht mehr** – bis Mitternacht still

Eine Nachricht wird automatisch entfernt, sobald sie sich erledigt hat, z. B. wenn das Fenster zu ist.

## Ruhezeit

Standard 22:00–07:00 Uhr. In der Ruhezeit kommen Push-Nachrichten **still** an. Laut melden sich nur dringende Nachrichten: *Raum kühlt aus*, *Fenster offen, niemand da* und *Thermostat reagiert nicht*. Sprachansagen gibt es in der Ruhezeit nie.

## Sprachansagen

Als Empfänger lässt sich auch ein Lautsprecher eintragen, z. B. Alexa über `notify.alexa_media_…`. Standardmäßig sagt er nur *Raum kühlt aus* an und, bei *Fenster schließen*, ab der dritten Erinnerung.

## Pro Raum stummschalten

In jedem Raum gibt es den Schalter **Hinweise für diesen Raum**, z. B. für ein Gästezimmer, das nur bei Besuch genutzt wird.

## Wiederholen

Solange ein Problem besteht, wird alle 5 Minuten erinnert (einstellbar). *Bitte lüften* kommt höchstens alle 30 Minuten.
