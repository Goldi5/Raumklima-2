# Troubleshooting

**The room doesn't heat although it is cold.**
Look at the status sensor. *Heating paused*: it is mild outside – override with **Heat today** or mode **Always heat**. *Set back*: nobody counts as home – check residents and zone, or turn the temperature up (suspends the setback for 3 h). *Window open*: check the contact. The **Log** tab shows the reason for every decision.

**The valve stays open permanently (TRV602Z).**
On the TRV602Z, preset “on” means *valve open*. Raumklima automatically uses a preset that regulates to the setpoint. Under *Change devices & technical settings* → room → *Advanced* → *Turn on with* it should say “Automatic” or “eco”.

**Thermostat and integration keep changing each other.**
Some thermostats switch presets on their own (e.g. eco ↔ comfort on Tuya). Raumklima treats these presets as equivalent, adopts a preset the thermostat keeps returning to, and pauses for 15 minutes after more than 40 commands in 10 minutes (notice in the health check). Check schedules or automatic modes on the thermostat and other automations.

**Absence detection gets me wrong, e.g. because of a VPN.**
Raumklima ignores impossible jumps and inaccurate fixes and counts a person as home as long as **one** of their phones is in the zone. Check what arrives in the `persons` attribute of *Presence*. For visitors there is the **Guests** switch, or use a calendar event such as “home office”.

**“Thermostat not responding”.**
The TRV didn't confirm a command (radio, VPN, empty battery). Raumklima keeps trying every 5 minutes. Check the Zigbee connection and battery. With Thread devices, increasing *Verify command after* to 30–40 s helps.

**“Radiator can't keep up” in the health check.**
The valve has been almost fully open for a long time and the room rarely reaches its target. Common causes: missing hydraulic balancing, a boiler flow temperature that is too low, or a radiator that is too small for the room. Bleeding the radiator doesn't hurt either.

**No CSV / report is empty.**
The report starts collecting when the integration is installed; meaningful values appear after a few days.

**The cards look old.**
Reload the page. In the app: Settings → Companion app → *Reset frontend cache*.

**The cards are in German.**
The cards follow your Home Assistant profile language; every language except German shows English. Log entries and push messages from the integration are currently German.

**The settings page can't be edited.**
Only administrators can change settings. Other users see “View only”.

**Diagnostics for a bug report.**
Settings → Devices & services → Raumklima → room or Allgemein → ⋮ → *Download diagnostics*. Then open an issue on GitHub.
