# Referenz

## Einstellungen Allgemein (gelten für alle Räume)

| Einstellung | Standard | Bedeutung |
|---|---|---|
| Bewohner | – | Personen; Abwesenheit ist erst mit Bewohnern **und** Zone aktiv |
| Zone der Wohnung | – | z. B. `zone.gunterstr_berlin` – nicht unbedingt „Home“ |
| Absenken nach | 30 min | Wartezeit, bevor „kurz weg“ gilt |
| „Länger weg“ ab | 24 h | danach Absenkung „länger“ |
| Vorheizen ab | 10 km | Annäherung näher als das → vorheizen (0 = aus) |
| Bauart | Altbau saniert | Temperaturfaktor für den Schimmelschutz (0,60 / 0,70 / 0,80) |
| Betriebsart | Automatisch | Automatisch / Immer heizen / Heizpause |
| Heizsaison | 10-01 bis 04-30 | Format MM-TT |
| Heizgrenze | 15 °C | Tagesmittel außen (24 h gemessen + 24 h Vorhersage) |
| Kälteeinbruch unter | 12 °C | 3 Tage darunter → heizen auch außerhalb der Saison |
| Sicherung | 16 °C | darunter heizt ein Raum immer |
| Sommerpflege | an | mittwochs 11 Uhr Ventile 3 min öffnen |
| Empfänger | – | je `notify`-Dienst die Nachrichtenarten |
| Ruhezeit | 22:00–07:00 | nur Dringendes laut, keine Ansagen |
| Erinnern alle | 5 min | Wiederholung, solange das Problem besteht |
| Wetterquelle | – | `weather.*` (mit Vorhersage) oder Außentemperatur-Sensor |
| Fehler in HA-Glocke | an | zusätzliche Meldung in Home Assistant |

## Einstellungen je Raum

| Einstellung | Standard | Bedeutung |
|---|---|---|
| Raumtyp | Wohnraum | setzt Standards für Wunsch, Mindesttemperatur, Feuchte, Absenkung |
| Wunschtemperatur | nach Raumtyp | Wohnraum/Kinderzimmer 20 · Küche 19 · Bad 22 · Schlafzimmer/selten genutzt 17 °C |
| Absenkung „kurz weg“ | 18 °C (Schlafzimmer, selten genutzt: 16) | |
| Absenkung „länger weg“ | 16 °C | |
| Feuchtegrenze | 70 % (Bad 75 %) | ab hier „Bitte lüften“ |
| Mindesttemperatur beim Lüften | 18 °C (Schlafzimmer, selten genutzt: 16) | darunter „Raum kühlt aus“ |
| Max. Abkühlung beim Lüften | 3 °C | |
| Fensterlogik | an | Pause bei offenem Fenster |
| Verzögerung auf / zu | 10 s / 10 s | |
| Kalibrierart | Offset | Offset / Sollwert-Ausgleich / keine |
| Einschalten mit | Automatisch | Preset zum Heizen; meidet „on“ (TRV602Z: Ventil offen) |
| Ausschalten über | Automatisch | Preset „off“, HVAC „off“ oder Minimaltemperatur |
| Drehen am TRV übernehmen | an | aus = Änderungen am Gerät werden zurückgesetzt |
| Offset ab Änderung von | 0,3 °C | |
| Mindestabstand Kalibrierung | 5 min | |
| Fühler gilt als ausgefallen nach | 60 min | |
| Befehl prüfen nach | 20 s | |
| Wiederholungen bis Meldung | 5 | |

## Entitäten je Raum

| Entität | Inhalt |
|---|---|
| `climate.<raum>` | Thermostat; Attribute u. a. `effective_target`, `plan_reason`, `presence`, `heating_mode`, `status`, `offset`, `valve_position`, Lüftungswerte |
| `sensor.<raum>_status` | heizt · erreicht · Fenster offen · aus · Fühler/TRV fehlt · Heizpause · abgesenkt |
| `sensor.<raum>_synchronisierung` | ok · ausstehend · fehlgeschlagen |
| `sensor.<raum>_kalibrier_offset` | aktueller Offset |
| `sensor.<raum>_luftung` | ok · bitte lüften · lüftet · ausgetauscht · bitte schließen · kühlt aus |
| `sensor.<raum>_taupunkt`, `…_absolute_feuchte`, `…_empfohlene_luftdauer` | Werte |
| `binary_sensor.<raum>_fenster`, `…_problem`, `…_schimmelrisiko` | |
| `switch.<raum>_fensterlogik`, `…_luftungs_benachrichtigungen` | |
| `number.<raum>_feuchtegrenze…`, `…_mindesttemperatur…`, `…_max_abkuhlung…` | |
| `button.<raum>_jetzt_kalibrieren` | |

## Entitäten der Zentrale „Allgemein“

| Entität | Inhalt |
|---|---|
| `sensor.raumklima_allgemein_anwesenheit` | home · guests · preheat · away_short · away_long; Attribute `persons` (da?, Entfernung, nähert sich) |
| `sensor.raumklima_allgemein_heizbetrieb` | heating · pause · cold_snap · heat_today · always · manual_pause; Attribute mit Tagesmitteln |
| `sensor.raumklima_allgemein_aussen_tagesmittel` | Mittel aus 24 h Messung und 24 h Vorhersage |
| `switch.raumklima_allgemein_urlaub`, `switch.raumklima_allgemein_gaste_da` | |
| `select.raumklima_allgemein_betriebsart_heizsaison` | auto · always · pause |
| `button.raumklima_allgemein_heute_heizen` | 24 h heizen |

(Die genauen Entitäts-IDs hängen von der Sprache bei der Einrichtung ab.)

## Ereignis für eigene Automationen

`raumklima_event` mit `type` (z. B. `ventilation`), `room`, `entry_id` und weiteren Daten:

```yaml
triggers:
  - trigger: event
    event_type: raumklima_event
    event_data:
      type: ventilation
      state: please_close
actions:
  - action: light.turn_on
    target: { entity_id: light.flur }
    data: { color_name: blue, flash: short }
```

Beispiel – im Urlaub zusätzlich etwas schalten:

```yaml
triggers:
  - trigger: state
    entity_id: sensor.raumklima_allgemein_anwesenheit
    to: away_long
```
