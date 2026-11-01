---
title: Raumklima
subtitle: Manual – heating that thinks ahead
lang: en
toc: Contents
cover_image: ../docs/images/raeume.png
footer: Raumklima for Home Assistant · github.com/Goldi5/Raumklima-2
---

# Welcome

**Raumklima** turns every radiator thermostat into a room thermostat that thinks ahead. It controls by a real sensor in the room, pauses while you air the room, lowers the temperature when nobody is home, and doesn't heat at all in summer.

This manual explains step by step how to set up Raumklima and use it day to day. You don't need any technical background – just a running Home Assistant.

:::tip
**In short:** set it up once, then everything runs by itself. You only step in when you want something different.
:::

> The screenshots show the German interface. In English, the cards follow your Home Assistant language; messages from the integration are currently German.

## What Raumklima does for you

| | |
|---|---|
| 🌡️ **Measures correctly** | Controls by a sensor in the middle of the room instead of the thermostat right next to the hot radiator. |
| 🪟 **Window open = pause** | When a window is open, heating stops. Afterwards it continues with the previous setting. |
| 💨 **Airing with a plan** | Tells you when the air is humid or stale, how long to air the room and when it's enough. |
| 🏠 **Nobody home = savings** | Lowers the temperature when everyone is away and preheats before someone comes home. |
| 🧱 **Mould protection** | Never lowers the temperature so much that walls get damp. |
| 🍂 **Heats only when it's cold** | Uses the weather forecast to decide whether heating is needed at all. |
| 📱 **Helpful messages** | Sends notices to your phone – quietly at night. If you like, with an airing countdown on the lock screen. |
| 💡 **Light signal** | Lights in the room blink blue when it's time to air the room and orange when the window should be closed. |
| 📈 **Report** | Shows how much was heated and saved. |

## What you need

- **Home Assistant** (version 2026.5 or newer) with **HACS**
- per room a **radiator thermostat** that shows up in Home Assistant
- per room a **temperature sensor** (ideally with humidity)
- optional: **window contacts**, a **CO₂ sensor**
- for presence detection: the **Home Assistant app** on your phones

# Setup

## Step 1: Install

1. Open **HACS** in Home Assistant.
2. Tap **⋮ → Custom repositories** at the top right.
3. Enter `https://github.com/Goldi5/Raumklima-2`, category **Integration**, and confirm.
4. Search HACS for **Raumklima** and tap **Download**.
5. **Restart Home Assistant** (*Settings → System → Restart*).

:::tip
First turn off your thermostat's built-in window detection (if it has one) and disable old automations for the same thermostats. Otherwise they work against each other.
:::

## Step 2: Create the first room

Go to **Settings → Devices & services → Add integration** and choose **Raumklima**.

1. **Choose the thermostat** – the one on the radiator.
2. **Sensors & windows** – Raumklima suggests sensors and window contacts from the same room. Check them, continue.
3. **The room** – choose the **room type** (living room, bedroom, bathroom …). This sets all values sensibly. You can leave the technical settings under *Advanced* alone.
4. **For the whole home** (first room only) – who lives here, which zone is your home, who gets messages, where the weather comes from.

Repeat this for every further room – only step 4 is skipped.

## Step 3: The dashboard

Raumklima comes with a ready-made dashboard. Here's how to get it:

1. Open **Settings → Dashboards**.
2. Tap **+ Add dashboard** at the bottom right.
3. Choose **Raumklima** in the list and tap **Next**.
4. Give it a name (e.g. “Heating”) and an icon, then **Create**.

The new dashboard appears in the **sidebar** on the left. It builds itself, with the tabs *Rooms*, *History*, *Report*, *Log* and *Settings* – and grows as you add rooms.

:::tip
**Raumklima isn't in the list?** Reload the page (on a computer **Ctrl + F5**, in the app: *Settings → Companion app → Reset frontend cache*). The cards are loaded when Home Assistant starts.
:::

### Cards in your own dashboard

Prefer to add the Raumklima cards to your existing dashboard? Here's how:

1. Open your dashboard and tap the **pencil** (edit) at the top right.
2. Tap **+ Add card**.
3. Type **Raumklima** in the search field.
4. Choose a card and tap **Save**.

| Card | Shows |
|---|---|
| **Raumklima – Overview** | all rooms, outdoor temperature, who is home |
| **Raumklima – Room** | one room with temperature, controls and airing (choose the room in the editor) |
| **Raumklima – History** | temperature, humidity or timeline of all rooms |
| **Raumklima – Heating report** | week and month, savings, health |
| **Raumklima – Log** | what happened when and why |
| **Raumklima – Settings** | all settings – best as a page of its own in full width |

## The first 10 minutes

After setup, take a moment for these points. You'll find everything in the dashboard under **Settings → General**.

:::check
- **Tap the residents** – who lives here?
- **Choose the zone** – which zone is your home?
- **Add recipients** – who gets messages? Check with **Test**.
- **Choose a weather source** – e.g. `weather.forecast_home`.
- **Check the desired temperatures** – per room in its tab.
:::

# Day to day

## Reading the room card

![Room cards](../docs/images/raeume.png)

- The **arc** shows how warm it is right now, the **dot** the target.
- **− / +** sets the desired temperature in half degrees, **⏻** turns the room off and on.
- When a window is open, **“Window open since 14:32 · 12 min”** appears below the name. In the overview at the top you see the duration next to each room's window icon.
- The top right shows what the room is doing:

| Shown | Meaning |
|---|---|
| **Heating** | The room is colder than desired and is being heated. |
| **Temperature reached** | All good, it's warm enough. |
| **Paused – window open** | A window is open, heating waits. |
| **Night airing – window open** | Someone is sleeping with the window open. |
| **Set back – nobody home** | Everyone is away, saving energy. |
| **Heating paused** | It's mild enough outside. |
| **Off** | You turned the room off. |
| **Sensor failed** | The sensor isn't reporting – the thermostat keeps regulating on its own. |
| **Thermostat unreachable** | Radio or battery problem. |

## Airing

When the air gets too humid (or, with a CO₂ sensor, stale), you get **“please air the room”**. When you open the window, the card shows a **countdown** with the recommended airing time – only a few minutes in winter.

- **“Air exchanged”** – you can close.
- **“Airing time reached”** – please close.
- **“Room cooling down”** – now really close.

The messages have buttons: **Done**, **Remind me in 15 min** and **Not today**.

:::tip
Airing only helps when the air outside is drier. Raumklima calculates this and doesn't ask you to air the room in humid weather.
:::

## Airing countdown on the lock screen

With the Home Assistant app you also see the countdown on the **lock screen** – on the iPhone as a Live Activity (also in the Dynamic Island), on Android in the notification shade. No need to unlock your phone.

How to turn it on:

1. Dashboard → **Settings → General → Who gets what**.
2. Tap **📱 Airing countdown on the lock screen** for your phone.
3. The next time you air a room, confirm the lock screen notice on the iPhone.

| Colour | Meaning |
|---|---|
| 🔵 Blue, clock running | window open, keep airing this long |
| 🟢 Green | air exchanged – you can close |
| 🟠 Orange | airing time reached – please close |
| 🔴 Red | room cooling down – close now |

When the window is closed, the display disappears by itself.

:::tip
**Requirements:** iPhone with iOS 17.2 or later and Home Assistant 2026.7 or later. The phone must reach Home Assistant when you're out. If the display gets stuck: in the iPhone settings under *Home Assistant → Live Activities*, turn it off and on again.
:::

## Light signal: lights show it

Not everyone has their phone in hand. That's why lights in the room can let you know: they **blink three times** in a colour and then return to how they were.

How to set it up:

1. Dashboard → **Settings** → the room's tab (e.g. *Bathroom*).
2. Section **Light signal** → choose a light in the list → **Add light**. Several lights work too.
3. Under **Blink on**, tap when it should blink.
4. Try it with **Test** – the lights blink blue.

| Colour | When | from the start |
|---|---|---|
| 🔵 Blue | Please air the room | on |
| 🟠 Orange | Please close / room cooling down | on |
| 🟢 Green | Air exchanged | off |
| 🔴 Red | Problem with the heating | off |

:::tip
Nothing blinks during quiet hours at night, while sleeping with the window open, or when nobody is home. Lights without colour simply blink bright.
:::

## Presence sensors: who is in the room?

With presence sensors, Raumklima knows not only whether someone is home, but also **in which room**. There are two kinds:

| What | **mmWave** (radar) | **PIR** (motion sensor) |
|---|---|---|
| sees | also people sitting still or sleeping | only movement |
| room counts as empty | after 3 minutes | only after 20 minutes |
| counts for “someone is home” | yes | no (pets!) – adjustable |

**mmWave is much more reliable.** PIR works too, but Raumklima is more cautious with it.

How to set it up:

1. Dashboard → **Settings** → the room's tab.
2. Section **Presence sensors** → choose a sensor in the list (mmWave or PIR is shown next to it) → **Add sensor**.
3. **Lower empty room:** *Automatic* makes the living room, kitchen and rarely used rooms 1.5 °C cooler after 30 minutes without anyone – only with mmWave. With **Yes** it also applies to other rooms or to PIR.

The room card then shows **“Someone in the room”** or **“Room empty for 25 min”**. When someone comes in, it heats back to the desired temperature right away.

:::tip
A sensor in the living room also stops Raumklima from wrongly thinking “everyone is away” – e.g. when a phone is off or a visitor is home alone. During vacation the sensors don't count, so the cat won't end your vacation.
:::

## When everyone is away

Raumklima notices through your phones when nobody is home anymore:

| Situation | What happens |
|---|---|
| Everyone away for 30 minutes | set back to about 18 °C |
| Away for more than 24 hours | set back to about 16 °C |
| Someone is on the way home | preheat in time |
| Someone comes home | back to the desired temperature |

If you come home early and it's too cool: just turn it up – the setback then pauses for 3 hours.

## Vacation and visitors

- **Vacation:** the *Vacation* switch in the settings – or a calendar event with “vacation” in the title. Ends automatically when you come back.
- **Visitors:** the *Guests* switch – then there is no setback even when all residents are out.

## Heating pause in spring and autumn

When the daily mean outside is mild (default: above 15 °C), the heating pauses. Still cold? **Heat today** – that applies for 24 hours.

## Report and log

![Heating report](../docs/images/bericht.png)

The **Report** tab shows for this week or month how long the heating ran, how much the setback saved and whether it was comfortable. On Sundays a short summary arrives on your phone.

### The report as PDF

Every week, every month and at the end of the heating season a **PDF report** (4 pages) is created. Among other things it contains:

- a **grade from A to F** for your indoor climate – with history,
- the comparison with the previous period and the **year before**,
- every room with a small **trend line**, a **ranking** and **weekdays vs. weekend**,
- a **humidity traffic light**, CO₂ and an **airing summary**,
- a **heat map** of when it heats,
- **battery levels**, failures and **saving tips** with numbers.

If you enter your **heating costs per year** under *Settings → General → Building & mould protection*, the report roughly converts savings into **euros**.

- **Download:** at the very bottom of the **Report** tab under *PDF reports* – tap **Download**. The buttons *Week*, *Month* and *Heating season* give you a report up to today right away.
- **On your phone:** the push message has an **Open PDF** button.
- **By email:** *Settings → General → Notifications – general → Email PDF to* → tap **Set up email** right below, pick your provider (e.g. Gmail), enter user, password and recipients and tap **Save & send test email**. Gmail, iCloud and Outlook need an app password.

:::tip
The report follows the Home Assistant language: German for German, English for every other language.
:::

The **Log** tab lists every decision with its reason – handy when you wonder “why is it so cold right now?”

# Settings

You'll find all settings in the dashboard under the **Settings** tab. Not sure what a setting does? Tap the **“?”** next to it to open an explanation. Changes are saved after a short pause and take effect right away.

:::tip
Not sure? Keep the defaults. They follow the recommendations of German consumer organisations and the German Environment Agency.
:::

![Settings](../docs/images/einstellungen.png)

| Area | What you set there |
|---|---|
| **General → Presence** | residents, zone, when to set back, vacation, guests, calendar |
| **General → Heating season** | when to heat, heat today |
| **General → Who gets what** | recipients and which messages they get |
| **General → Notifications** | quiet hours, reminders, weather source, PDF reports, email |
| **General → Sleep times** | Raumklima learns when you sleep |
| **Room → Temperature** | desired temperature, setback, sunny side |
| **Room → Airing & humidity** | from which humidity to ask for airing |
| **Room → Windows** | pause while a window is open, sleeping with the window open |
| **Room → Presence sensors** | sensors, lower empty room |
| **Room → Light signal** | lights that blink on notices |


# Frequently asked questions

<!-- include: ../docs/en/faq.md -->

# Glossary

| Term | Explanation |
|---|---|
| **Thermostat (TRV)** | The controller directly on the radiator. |
| **Sensor** | A small device that measures temperature (and often humidity) in the room. |
| **Offset** | A correction value so that the thermostat “sees” the same temperature as the sensor. |
| **Zone** | An area on the map in Home Assistant, e.g. your home. |
| **Setback** | Lowering the temperature a little to save energy. |
| **Heating limit** | Above this outdoor temperature (daily mean) the building needs no heating. |
| **Dew point** | At this temperature humidity turns into water – e.g. on cold walls. |
| **Heating degree days** | A measure of how cold it was outside. |
| **Quiet hours** | Time during which messages arrive silently. |
| **HACS** | The “app store” for extensions in Home Assistant. |

# Getting help

- **Detailed documentation:** github.com/Goldi5/Raumklima-2 → documentation
- **Report a bug or request a feature:** github.com/Goldi5/Raumklima-2/issues
- **Diagnostics file for a bug report:** *Settings → Devices & services → Raumklima → room → ⋮ → Download diagnostics*
