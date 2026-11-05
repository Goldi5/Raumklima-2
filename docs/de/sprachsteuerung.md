# Sprachsteuerung

Raumklima lässt sich per Sprache abfragen und stellen. Ob das geht, hängt an **einem** Punkt: welcher Assistent die Frage hört.

| Weg | Kann Raumklima-Fragen beantworten? |
|---|---|
| **Assist mit KI-Agent** (ChatGPT, Google, Anthropic, Ollama) | **Ja** – mit Ist, Soll, Feuchte, Begründung und Lüftempfehlung |
| **Assist ohne KI** (Standard-Agent) | Nur „Wie warm ist es im …?" – ohne Begründung, ohne Lüftbedarf |
| **Alexa, Siri, Google-Home-Lautsprecher** | **Nein** – diese Assistenten laufen bei Amazon, Apple und Google und erreichen Raumklima nicht |

Der Unterschied ist wichtig: Ein Echo ist kein Assist-Gerät. Wer den Lautsprecher fragt, fragt Amazon – nicht Home Assistant.

## 1. Eine Pipeline mit KI-Agent anlegen

Ohne Pipeline hört Raumklima niemanden. Die Pipeline verbindet Mikrofon, Spracherkennung, einen **Gesprächsagenten** und die Antwort.

1. *Einstellungen → Sprachassistenten → **Assistent hinzufügen***
2. **Name:** z. B. „Raumklima"
3. **Sprache:** Deutsch
4. **Spracherkennung (STT):** Home Assistant Cloud, oder lokal (Whisper)
5. **Antwort (TTS):** Home Assistant Cloud, oder lokal (Piper)
6. **Gesprächsagent:** die KI-Integration, z. B. **ChatGPT**, **Google Generative AI**, **Anthropic** oder **Ollama**
7. Speichern und die Pipeline als **bevorzugt** markieren – dann nutzen alle Assist-Satelliten und die App sie.

:::tip
Der Agent muss **Werkzeugaufrufe** („tool calls") beherrschen. Das tun die vier genannten. Ein reines Textmodell ohne Werkzeuge kann die Raumdaten nicht abrufen.
:::

**Wichtig:** Der Agent braucht ein gültiges Konto mit Guthaben. Ist das Guthaben aufgebraucht, antwortet die Pipeline mit der Fehlermeldung des Anbieters (bei OpenAI z. B. „Insufficient funds") – unabhängig von Raumklima.

## 2. Raumklima in der KI-Integration freischalten

Jede KI-Integration gibt dem Modell nur die Werkzeuge, die unter **Steuerung von Home Assistant** ausgewählt sind. Raumklima steht dort als eigener Eintrag – er muss einmal angehakt werden.

1. *Einstellungen → Geräte & Dienste →* die KI-Integration öffnen (z. B. **OpenAI Conversation**)
2. **Neu konfigurieren** (bei ChatGPT) bzw. die Integration einmal neu einrichten (bei Google, dort gibt es keinen Optionsdialog)
3. Bei **Steuerung von Home Assistant** zusätzlich zu **Assist** den Eintrag **Raumklima** auswählen
4. Speichern – die Werkzeuge sind sofort verfügbar, kein Neustart nötig

Danach kennt der Assistent drei Werkzeuge:

| Werkzeug | Wofür |
|---|---|
| `raumklima_rooms` | Welche Räume es gibt, mit Ist und Ziel |
| `raumklima_room_status` | Ist, Ziel, Feuchte, CO₂, Fenster, Grund, Lüftbedarf eines Raums |
| `raumklima_set_room_temperature` | Wunschtemperatur setzen |

## 3. Was du fragen kannst

- „Wie warm ist es im Bad?" → *„Im Bad sind es 21,3 °C, Ziel ist 19,0 °C."*
- „Muss ich im Wohnzimmer lüften?" → *„Ja, etwa 10 Minuten – die Feuchte liegt bei 71 %."* oder *„Nein, 45 % Feuchte und 600 ppm CO₂."*
- „Warum ist das Schlafzimmer abgesenkt?" → *„Ruhezeit, Ziel 16,0 °C."*
- „Stell das Sportzimmer auf 19 Grad" → setzt die Wunschtemperatur (Überwachungsräume ausgenommen)

Gefragt wird über einen **Assist-Satelliten** (z. B. Home Assistant Voice, ESPHome-Satellit) oder über das Mikrofon in der Home-Assistant-App.

## 4. Ohne KI-Agent

Der Standard-Agent von Home Assistant arbeitet mit festen Sätzen. „Wie warm ist es im Bad?" funktioniert damit, sobald der Raum einen **Bereich** hat – den legt Raumklima beim Einrichten selbst an. Fragen nach Begründung („warum?"), Lüftbedarf oder Feuchte versteht er nicht.

## 5. Alexa, Siri und Google-Home-Lautsprecher

Diese Assistenten beantworten Fragen in ihrer eigenen Cloud. Sie sehen die Raumklima-Werkzeuge nicht, und Raumklima kann dort nichts einhängen.

- **Alexa:** Über die Nabu-Casa-Cloud und den Alexa-Skill lassen sich Heizkörper ein-/ausschalten und Sollwerte setzen – mehr nicht. Voraussetzung ist ein aktives Cloud-Abo.
- **Siri/HomeKit:** über die HomeKit-Bridge ebenfalls nur Sollwerte.
- **Für die Fragen** braucht es einen Assist-Satelliten oder die App. Ein Echo kann diesen Weg nicht übernehmen.

## 6. Wenn die Antwort nicht stimmt

| Beobachtung | Ursache |
|---|---|
| „Insufficient funds", „quota exceeded" o. ä. | Guthaben oder Schlüssel des KI-Anbieters – nicht Raumklima |
| Antwort ohne Zahlen, allgemeines Gerede | „Raumklima" ist in der KI-Integration nicht freigeschaltet (Schritt 2) |
| „Es wurde mehr als ein Gerät gefunden" | Der Standard-Agent findet mehrere Klimageräte im Bereich – KI-Agent nutzen oder Bereiche eindeutig benennen |
| Falscher Raum bei zwei Wohnungen | Gleichnamige Räume sind mehrdeutig: Bereiche umbenennen („Bad Berlin", „Bad Remscheid") oder den Raumnamen nennen, den Raumklima zeigt |

Welche Werkzeuge das Modell wirklich aufgerufen hat, steht in *Einstellungen → Sprachassistenten →* bei der letzten Ausführung (Trace).
