# Frequently asked questions (FAQ)

## Setup

### Which thermostats work?
Every radiator thermostat that shows up in Home Assistant as a “climate” device and whose temperature can be set – whether Zigbee, Z-Wave, Wi-Fi, Shelly, Matter or cloud (Tado, Netatmo). If it has an offset setting, Raumklima corrects through it; otherwise it sets the setpoint higher or lower accordingly. Important: turn off the thermostat's own schedule and window detection. So far tested with the Tuya TRV602Z via Zigbee2MQTT – details and notes per device type under [Which thermostats work?](installation.md#which-thermostats-work).

### Do I really need an extra temperature sensor?
Yes, one per room. The thermostat itself measures right next to the hot radiator and is often off. A simple Zigbee sensor (e.g. from IKEA or Aqara) somewhere in the middle of the room is enough.

### My room has several radiators and windows – does that work?
Yes. During setup (or later under *Change devices & technical settings* → gear icon of the room) pick the first thermostat as main thermostat and the others under **Further thermostats in this room**. All get the same commands, each with its own check and correction. Any number of window contacts works – heating pauses as soon as one is open.

### Are window contacts required?
No. Without a contact, Raumklima detects an open window from a sudden temperature drop. A contact is faster and more reliable, though.

### What is “Allgemein” and why is it in the list?
“Allgemein” (general) is the hub for the whole home: who lives there, who gets messages, heating season. It is created automatically with the first room. Each room is an entry of its own.

### Do I have to write YAML?
No. Everything is done in the Home Assistant setup dialog and the settings page in the dashboard.

### I work shifts – does that work?
Yes. Setback and preheating follow your actual presence (phone), not the clock – whether you get home at 6 am or 1 am. On top of that, *Settings → General → Night & quiet time* has the **shift work** option: bedtime and getting-up times are then learned per weekday and daytime sleep is detected too (bedtime up to 09:00, getting up up to 17:00). With **quiet time sets back**, bedrooms and rarely used rooms are set back during quiet time – so the heating stays off while you sleep after a night shift. A running time window and the dial on the thermostat still take precedence.

### Can I set fixed heating times?
Yes – under *Settings → room → Schedule*. There you create time windows with weekdays, from/to and a target temperature, e.g. “daily 7–9 pm 22 °C”. The schedule only sets the target temperature: windows, frost, mould, heating break and absence stay in charge. For “a bit warmer for a while” there is the **Warmer** (boost) button on the room card. Once the room has learned its heat-up rate, it starts heating in time so it is warm when the window begins.

## The heating doesn't do what I want

### The room doesn't heat although it is cold.
Look at the room card – it shows the reason:
- **Heating paused:** the daily mean outside is mild. Press **Heat today** (24 hours) or set the mode to **Always heat**.
- **Set back – nobody home:** Raumklima thinks nobody is home. Check under *Settings → General* that the right persons and zone are selected. Turning the thermostat up lifts the setback for 3 hours.
- **Paused – window open:** a window contact reports “open”.

### It heats although nobody is home.
Setting back doesn't mean turning off: for short absences Raumklima keeps about 18 °C, for longer ones 16 °C. If the air is humid, it stays a bit warmer to prevent mould. On very cold nights the setback is deliberately smaller.

### Why doesn't it get exactly as warm as I set?
Small deviations (± 0.5 °C) are normal. If the room stays clearly colder all the time, the health check reports “room doesn't warm up” or “radiator can't keep up” – bleed the radiator or ask your heating installer about hydraulic balancing.

### I turn the thermostat and it jumps back.
Under *Change devices & technical settings → room → Advanced* there is “Follow changes at the thermostat”. If it is off, Raumklima always restores its own setting.

### The valve is always fully open (TRV602Z).
On the TRV602Z the preset “on” means *valve permanently open*. Under *Advanced → Turn on with* it should say “Automatic”.

### How do I find out why something happened?
The **Log** tab lists every decision with time and reason.

## Presence

### How does Raumklima know whether someone is home?
Through the Home Assistant app on the phone. A person counts as home as soon as one of their phones is inside the home zone.

### My phone sometimes shows wrong places (e.g. because of a VPN).
Raumklima ignores impossible jumps and inaccurate fixes. A new location is only accepted after it has stayed stable for 30 minutes.

### Are presence sensors worth it?
Yes: if an **mmWave sensor** sees someone, there is no setback – even when all phones are away. And single rooms (e.g. the living room) can get a little cooler while nobody is in them. **PIR motion sensors** work too but count as less reliable: they don't see someone sitting still, and pets trigger them. That's why Raumklima waits longer with PIR and by default doesn't let them decide “someone is home”.

### We have visitors without a phone in Home Assistant.
Turn on **Guests**. Then there is no setback even if all residents are away. Alternatively, a calendar event with “home office” or “zu Hause” in the title.

### How do I set vacation?
Turn on the **Vacation** switch – or create a calendar event with “vacation” in the title. Vacation ends automatically as soon as someone comes home.

### Why aren't all rooms set back when nobody is home?
Only rooms that are **switched on** get set back. A switched-off room is on “off” and doesn't heat anyway – there is nothing to set back. If the card says “Off – switched off at the thermostat”, the thermostat switched itself off (its own schedule, boost or dial) and Raumklima followed, because *Advanced → Follow changes at the thermostat* is on. Turn off the thermostat's own schedules and boost – or turn that option off.

## Notifications

### I don't get any messages.
Add a recipient under *Settings → General → Who gets what* and check it with **Test**. Without the Home Assistant app there are no push messages.

### I get too many messages.
You can deselect individual message types per recipient. For a single room there is the switch **Notices for this room**. In the push itself: **Not today**.

### Why don't messages make a sound at night?
During quiet hours (default 22:00–07:00, longer on weekends) messages arrive silently. Only urgent ones are loud: room cooling down, window open while nobody is home, thermostat not responding.

### Can I use a light instead of a message?
Yes. Add lights under *Settings → room → Light signal* – they blink blue for “please air the room” and orange for “please close” and then return to how they were.

### Can I see the airing countdown on the lock screen?
Yes, with the Home Assistant app: tap **📱 Airing countdown** for the phone under *Who gets what*. On the iPhone it appears as a Live Activity (iOS 17.2 or later), on Android as a Live Update.

### What does “thermostat not responding” mean?
A command didn't reach the thermostat even after several attempts – usually a radio problem or an empty battery. Raumklima keeps trying every 5 minutes.

> Messages from the integration follow the Home Assistant system language (German, French, otherwise English).

## Savings and report

### How much do I save?
As a rule of thumb, each degree less saves about 6 % heating energy. The **heating report** estimates the savings from setback for your home.

### What does “weather-adjusted” mean?
A cold month needs more heating. “Weather-adjusted” takes that into account so you can compare weeks and months fairly.

### Can I look at the values in Excel?
Yes: tap **CSV** at the top right of the heating report.

### Is there a PDF report – also by email?
Yes. Week, month and heating season are created automatically as PDFs; they are listed at the bottom of the heating report to **download**. A push brings a link, an email brings the PDF as an attachment: under *General → Reports → PDF by email* tap **Set up email**, pick your provider, enter user, password and recipients and tap **Save & send test email** – no YAML needed.

## Other

### The cards look old after an update.
Reload the page. In the app: *Settings → Companion app → Reset frontend cache*.

### I can't change anything on the settings page.
Only administrators can change settings. Others see “View only”.

### How do I report a bug?
Open an [issue](https://github.com/Goldi5/Raumklima-2/issues) on GitHub and attach the diagnostics file: *Settings → Devices & services → Raumklima → room → ⋮ → Download diagnostics*.

### Can I sort the rooms in the dashboard?
The order is **floor → area → name**, so you control it with floors and areas in Home Assistant (*Settings → Areas & zones*); rooms without a floor come last. To change it, add `sort: area` (by area) or `sort: name` (by name) to the dashboard config (`strategy: {type: custom:raumklima, sort: area}`).

### My Tuya thermostat (TRV602Z) ignores the setpoint

On these devices the **preset is the operating mode** – `system_mode` cannot be written:

| Preset | What the device does |
|---|---|
| `comfort` | **regulates to `comfort_temperature`** – this is the correct mode |
| `eco` | regulates to `eco_temperature` (the device's own saving temperature) |
| `auto` | the device's built-in weekly schedule |
| `on` | **valve permanently open** – heats regardless of the setpoint |
| `off` / `antifrost` | off / frost protection |

**Important:** on these devices `on` does not mean “manual”, it means **valve open** – the room heats
past the setpoint. From version 0.39.2 Raumklima therefore writes the setpoint into
`comfort_temperature` and selects `comfort`. The room then shows `target_via: comfort_temperature`.

If a device sits on `on`, the health list reports “Thermostat keeps the valve permanently open”.
Pick **`comfort`** on the device (or in Tuya/Z2M).

## Reporting a problem

### Something does not work – what should I attach?
In the card under *Settings* there is a **Diagnostics** button (or: *Settings → Devices → Raumklima → Download diagnostics*). The file contains everything needed: versions, your settings, the live values of every room, the raw states of all involved entities including attributes, the latest decisions with reasons and the last log lines of the integration. Passwords, mail credentials and coordinates are redacted – you can attach it to an issue unchanged.
