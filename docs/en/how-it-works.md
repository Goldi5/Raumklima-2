# How it works

## 1. Control by the room sensor

A thermostat on the radiator measures right next to the hot fins – it usually keeps the room too cold. Raumklima uses an **external sensor** in the room as the reference:

- **Offset (recommended):** the TRV continuously gets a correction value (`local_temperature_calibration`) so that its own reading matches the room temperature. The offset is calculated back from the raw value, sent only from a 0.3 °C change and at most every 5 minutes; sensor outliers are discarded.
- **Setpoint compensation:** for TRVs without an offset – the setpoint on the TRV is shifted by the difference.
- **Emergency mode:** if the sensor doesn't report for more than 60 minutes, the TRV keeps regulating with its own sensor and the status warns.

## 2. Window logic

- Window **open ≥ 10 s** → heating pauses (TRV off), the target temperature is kept.
- Window **closed ≥ 10 s** → the previous state returns.
- Connection drops (`unavailable`) count as neither “open” nor “closed”.

**Window without a contact:** if a room has no window contact (or it is unreachable), the integration detects an open window from a temperature drop: if it falls by 1 °C within 6 minutes and it is at least 5 °C colder outside, heating pauses. It resumes as soon as it gets 0.3 °C warmer again (after 10 minutes at the earliest, 30 at the latest). Per room: Automatic / Yes / No.

## 3. Reliability over flaky radio and VPN links

Every command to the TRV is **verified** after 20 s. If it didn't arrive, it is repeated – with growing intervals, then every 5 minutes. When the TRV comes back, pending commands are sent immediately. Additionally Raumklima reconciles target and actual state every 10 minutes. If nothing works, you get a notification.

Short dropouts (under 1 minute) don't count as a failure. If all thermostats drop out at the same time, it is treated as a connection problem (Zigbee2MQTT/MQTT/VPN) and logged at most once per half hour.

**TRV602Z specifics:** the preset “on” means *valve permanently open* on this device. Raumklima automatically uses a preset that regulates to the setpoint (“manual”/“eco”) and ignores the stored eco value the TRV loads when switching presets. eco, comfort, manual and heat are treated as equivalent – the Tuya TRV switches between them on its own. If a thermostat keeps jumping to another preset, it is adopted (or restoring is paused for 30 minutes), and with more than 40 commands in 10 minutes the integration pauses for 15 minutes.

## 4. Airing assistant

- **Please air the room:** humidity above the room's limit for 15 minutes (default 70 %, bathroom 75 %) – but only if **airing actually dries** (absolute humidity outside lower than inside).
- **CO₂ (optional):** with a CO₂ sensor, “please air the room” also comes from **1000 ppm** – regardless of the weather, because stale air always gets better by airing (German Environment Agency: below 1000 ppm harmless).
- **Airing time** by outdoor temperature (co2online/UBA): below 0 °C 4 min, 0–5 °C 5 min, 5–10 °C 10 min, 10–15 °C 15 min, 15–20 °C 20 min, above 30 min.
- **Close the window** when the time is up; **air exchanged** when the humidity is below the limit again (and CO₂ below 800 ppm).
- **Room cooling down:** below the minimum temperature (living rooms 18 °C, bedroom/rarely used 16 °C) or more than 3 °C colder than when the window was opened.
- **Mould risk:** permanently above 70 % or cold and humid.

## 5. Absence

For the whole home you define **who lives here** (persons) and **which zone is the home**. A person counts as home as soon as **any of their phones** is in the zone.

| Stage | When | Target |
|---|---|---|
| Someone home | at least one person in the zone | desired temperature |
| Briefly away | everyone away, after a 30 min delay | setback “short” (living rooms 18 °C, bedroom 16 °C) |
| Away longer | from 24 h or the **vacation** switch | setback “long” (16 °C) |
| Preheating | someone approaches, closer than 10 km | desired temperature |
| Guests | **guests** switch | desired temperature |

**Robust location:**
- **Impossible jumps** (more than 300 km/h, e.g. a VPN that moves the location home) are ignored. If the new location persists for more than 30 minutes, it is accepted (a real trip).
- **Inaccurate fixes** (over 200 m) don't count.
- Router or Bluetooth trackers without coordinates are skipped.

**Further rules:**
- Turning the temperature **up** at the thermostat or in the app while set back suspends the setback in that room for **3 hours**.
- **Vacation** ends automatically as soon as someone arrives.
- If nobody is home, there are **no airing reminders** – instead the message “window open, nobody home”.

**Calendar (optional):** under *General → Presence & setback → Calendar* choose a `calendar.*`. While an event is running whose title contains one of the words:

| Event contains (default) | Effect |
|---|---|
| Urlaub, Reise, Dienstreise, verreist, vacation, trip | like the **vacation** switch: setback “away longer” as soon as nobody is home |
| Homeoffice, Home-Office, zu Hause, home office, wfh | like **guests**: no setback |

The words can be changed (comma-separated, case-insensitive). If someone comes home during a “vacation” event, location wins.

**Frost night:** if the forecast says −5 °C or colder within the next 12 hours, absence setback is only **half as deep** (e.g. 19 instead of 16 °C with 22 °C desired). Otherwise walls and furniture cool down a lot and heating up takes long. Can be turned off under *General → Heating season → Frost night: smaller setback*.

The values follow the recommendations of German consumer organisations: about 18 °C for short absences, not below 16 °C for longer ones, never turn the heating off completely. Each degree less saves about 6 % heating energy.

**Heat-up time and preheating by arrival time:** each room learns how fast it warms up – in °C per hour, depending on the outdoor temperature (from the last 30 heat-ups, valid from 3). When someone approaches, the integration estimates the arrival time from the speed of the last minutes. If the person will arrive sooner than the home needs to heat up (plus 10 minutes), preheating starts – even beyond the km limit, up to 150 km. Until something has been learned, only the km limit applies.

## 6. Mould protection

During **longer absences** Raumklima calculates how far the temperature may drop without the coldest spot on the wall (outside corner) becoming too humid – using the **DIN 4108-2** criterion: at most 80 % relative humidity at the surface.

```
Wall temperature  θsi = θout + fRsi · (θin − θout)
Vapour pressure of the room air stays the same while setting back
→ lowest θin at which the wall has ≤ 80 % humidity
```

- **fRsi** (temperature factor) by building type: old unrenovated 0.60 · old renovated 0.70 · new/insulated 0.80.
- If the air is **dry**, the setback can be large. Example: 18 °C / 45 % at 0 °C outside – harmless down to about 13 °C.
- If the air is **humid** (e.g. bathroom after a shower), the room stays warmer until the humidity has dropped. Warm air holds more water, so the humidity at the wall drops.
- For **short absences** mould protection deliberately doesn't apply: a few hours at a lower temperature cause no moisture problem. It only becomes critical when the wall stays humid for days.

## 7. Heating season & heating limit

Heating only happens when it is really cold outside – what counts is the **heating limit**: the daily mean outdoor temperature above which a building needs no heating (co2online: old unrenovated 15–17 °C, renovated 14–16 °C, new 12–15 °C).

- **Daily mean** = mean of the **last 24 h** (measured) and the **next 24 h** (forecast). So the heating reacts before it gets cold.
- **Heating season** (default 1 October – 30 April):
  - Off only after **2 mild days** above heating limit + 1 °C.
  - On as soon as the mean falls below the heating limit.
- **Outside the season** the heating stays off. Exception **cold snap**: if the daily mean stays below 12 °C for 3 days, heating happens anyway (as in German tenancy law).
- **Safety minimum:** if a room drops below 16 °C, it always heats.
- **Modes:** Automatic, Always heat, Heating paused. **Heat today** lifts a pause for 24 h.
- **Summer valve exercise:** during the heating pause, Raumklima opens the valves for 3 minutes on Wednesdays at 11:00 so they don't seize.

**Sunny side:** rooms with large south- or west-facing windows can be marked as *sunny side* (Settings → room → Temperature). If the hourly forecast shows mostly sun for the next 3 hours (condition “sunny” or at most 30 % cloud cover) and the room is almost warm, it heats **1 °C less** – the sun does the rest. This stays until the forecast no longer shows sun (no back and forth). Requires a `weather.*` source with an hourly forecast.

## Priority

1. Window open → pause
2. Heating paused → off (except safety minimum / frost protection)
3. Everyone away → setback, but never below mould protection (only half as deep on frost nights)
4. Sunny side and sun expected → 1 °C below desired
5. Otherwise → desired temperature
