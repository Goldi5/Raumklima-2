# Voice control

Raumklima can be asked by voice. Whether that works depends on **one** thing: which assistant hears the question.

| Route | Can answer Raumklima questions? |
|---|---|
| **Assist with an AI agent** (ChatGPT, Google, Anthropic, Ollama) | **Yes** – with current value, target, humidity, reason and airing advice |
| **Assist without AI** (default agent) | Only “How warm is it in …?” – no reason, no airing advice |
| **Alexa, Siri, Google Home speakers** | **No** – those assistants run at Amazon, Apple and Google and cannot reach Raumklima |

That difference matters: an Echo is not an Assist device. Asking the speaker means asking Amazon – not Home Assistant.

## 1. Create a pipeline with an AI agent

Without a pipeline, nothing hears Raumklima. The pipeline connects microphone, speech-to-text, a **conversation agent** and the reply.

1. *Settings → Voice assistants → **Add assistant***
2. **Name:** e.g. “Raumklima”
3. **Language:** your language
4. **Speech-to-text:** Home Assistant Cloud, or local (Whisper)
5. **Text-to-speech:** Home Assistant Cloud, or local (Piper)
6. **Conversation agent:** the AI integration, e.g. **ChatGPT**, **Google Generative AI**, **Anthropic** or **Ollama**
7. Save it and mark it as **preferred** – then all Assist satellites and the app use it.

:::tip
The agent must support **tool calls**. All four do. A plain text model cannot fetch the room data.
:::

**Important:** the agent needs a valid account with credit. When credit runs out, the pipeline answers with the provider's error (OpenAI: “Insufficient funds”) – nothing to do with Raumklima.

## 2. Enable Raumklima in the AI integration

Every AI integration passes the model only the tools selected under **Control Home Assistant**. Raumklima appears there as its own entry and must be ticked once.

1. *Settings → Devices & services →* open the AI integration (e.g. **OpenAI Conversation**)
2. **Reconfigure** (ChatGPT) or set the integration up again once (Google has no options dialog)
3. Under **Control Home Assistant**, select **Raumklima** in addition to **Assist**
4. Save – the tools are available immediately, no restart needed

The assistant then knows three tools:

| Tool | Purpose |
|---|---|
| `raumklima_rooms` | Which rooms exist, with current value and target |
| `raumklima_room_status` | Current, target, humidity, CO₂, window, reason, airing need |
| `raumklima_set_room_temperature` | Set the desired temperature |

## 3. What you can ask

- “How warm is it in the bathroom?” → *“It's 21.3 °C, target 19.0 °C.”*
- “Do I need to air the living room?” → *“Yes, about 10 minutes – humidity is 71 %.”* or *“No, 45 % humidity and 600 ppm CO₂.”*
- “Why is the bedroom set back?” → *“Quiet time, target 16.0 °C.”*
- “Set the sports room to 19 degrees” → sets the desired temperature (monitoring-only rooms excluded)

Ask through an **Assist satellite** (e.g. Home Assistant Voice, ESPHome satellite) or the microphone in the Home Assistant app.

## 4. Without an AI agent

Home Assistant's default agent works with fixed sentences. “How warm is it in the bathroom?” works there as soon as the room has an **area** – Raumklima creates it during setup. It does not understand questions about the reason, airing need or humidity.

## 5. Alexa, Siri and Google Home speakers

Those assistants answer inside their own cloud. They never see the Raumklima tools, and Raumklima cannot hook into them.

- **Alexa:** through Nabu Casa Cloud and the Alexa skill you can switch radiators on/off and set targets – nothing more, and it needs an active cloud subscription.
- **Siri/HomeKit:** targets only, via the HomeKit bridge.
- **For the questions** you need an Assist satellite or the app. An Echo cannot take that route.

## 6. When the answer is wrong

| Symptom | Cause |
|---|---|
| “Insufficient funds”, “quota exceeded” | Credit or key of the AI provider – not Raumklima |
| Answer without numbers, generic talk | “Raumklima” is not enabled in the AI integration (step 2) |
| “More than one device found” | The default agent finds several climate devices in the area – use an AI agent or give areas unique names |
| Wrong room with two flats | Identical room names are ambiguous: rename areas (“Bad flat A”, “Bad flat B”) or use the room name Raumklima shows |

Which tools the model actually called is listed under *Settings → Voice assistants →* the last run (trace).
