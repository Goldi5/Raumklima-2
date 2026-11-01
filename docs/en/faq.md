# Frequently asked questions (FAQ)

## Setup

### Which thermostats work?
Every radiator thermostat that shows up in Home Assistant as a “climate” device – whether via Zigbee, Z-Wave, Wi-Fi or Matter. Tested with the Tuya TRV602Z via Zigbee2MQTT.

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

> Messages from the integration are currently in German.

## Savings and report

### How much do I save?
As a rule of thumb, each degree less saves about 6 % heating energy. The **heating report** estimates the savings from setback for your home.

### What does “weather-adjusted” mean?
A cold month needs more heating. “Weather-adjusted” takes that into account so you can compare weeks and months fairly.

### Can I look at the values in Excel?
Yes: tap **CSV** at the top right of the heating report.

### Is there a PDF report – also by email?
Yes. Week, month and heating season are created automatically as PDFs; they are listed at the bottom of the heating report to **download**. A push brings a link, an email brings the PDF as an attachment: under *General → Notifications – general → PDF by email* tap **Set up email**, pick your provider, enter user, password and recipients and tap **Save & send test email** – no YAML needed.

## Other

### The cards look old after an update.
Reload the page. In the app: *Settings → Companion app → Reset frontend cache*.

### I can't change anything on the settings page.
Only administrators can change settings. Others see “View only”.

### How do I report a bug?
Open an [issue](https://github.com/Goldi5/Raumklima-2/issues) on GitHub and attach the diagnostics file: *Settings → Devices & services → Raumklima → room → ⋮ → Download diagnostics*.
