# How it works

## Control by the room sensor
A TRV measures right next to the hot radiator. Raumklima uses an **external room sensor**:
- **Offset (recommended):** continuously writes a correction (`local_temperature_calibration`) so the TRV "sees" the room temperature – only on changes ≥ 0.3 °C, at most every 5 min, outliers rejected.
- **Setpoint compensation** for TRVs without offset.
- **Fallback:** if the sensor is silent for 60 min, the TRV regulates on its own sensor and the status warns.

## Window logic
Open ≥ 10 s → pause (TRV off, target kept); closed ≥ 10 s → resume. `unavailable` is ignored.

**Window without contact:** rooms without a (reachable) contact detect an open window from a temperature drop (1 °C in 6 min, outdoors ≥ 5 °C colder) and pause heating until it warms up again (10–30 min).

## Reliability
Every command is verified after 20 s and retried with growing intervals, then every 5 min; pending commands are resent when the TRV reappears; full reconciliation every 10 min; notification if nothing works.
**TRV602Z:** preset "on" means *valve fully open* – Raumklima uses "eco" and catches the stored eco value loaded on preset changes.

## Airing assistant
"Please air" after 15 min above the room's humidity limit (70 %, bathroom 75 %) – only if airing actually dries (absolute humidity outside lower). Airing time by outdoor temperature (co2online/UBA: <0 °C 4 min … >20 °C 30 min). "Close window", "Air exchanged", "Room cooling down" (below minimum or > 3 °C colder than when opened).

## Absence
Residents (people) + home zone; a person counts as home as soon as **any of their phones** is in the zone.

| Stage | When | Target |
|---|---|---|
| Someone home | at least one person in the zone | preferred |
| Briefly away | all away for 30 min | setback "short" (living 18 °C, bedroom 16 °C) |
| Away longer | after 24 h or **vacation** | setback "long" (16 °C) |
| Preheating | someone approaching within 10 km | preferred |
| Guests | **guests** switch | preferred |

Impossible jumps (> 300 km/h, e.g. VPN placing the phone at another home) and inaccurate fixes (> 200 m) are ignored; a jump that persists for 30 min is accepted (real travel). Turning up during setback suspends it for 3 h in that room. Vacation ends on arrival. No airing reminders while nobody is home – instead "window open, nobody home".

**Heat-up time & ETA preheating:** each room learns its heat-up rate (°C/h vs. outdoor temperature, last 30 episodes). From the approach speed the arrival time is estimated; if someone arrives sooner than the flat needs to warm up (+10 min), preheating starts — up to 150 km away.

## Mold guard
For **longer absence** Raumklima computes the lowest room temperature that keeps the coldest wall spot below **80 % relative humidity** (DIN 4108-2):
`θsi = θout + fRsi·(θin − θout)`, vapour pressure constant while cooling. fRsi by building: 0.60 / 0.70 / 0.80. Dry air → deeper setback; humid air (e.g. after a shower) → room stays warmer until it has dried. Not applied to short absences: a few hours cause no moisture problem.

## Heating season
Heating runs when it's actually cold – by the **heating limit** (daily mean outdoor temperature; co2online: old unrenovated 15–17 °C, renovated 14–16 °C, new 12–15 °C). Daily mean = last 24 h measured + next 24 h forecast. Within the season (default Oct 1 – Apr 30) heating stops only after 2 mild days above limit + 1 °C and restarts when the mean drops below the limit. Outside the season it stays off except for a **cold snap** (3 days below 12 °C). Safety: rooms below 16 °C always heat. Modes: auto / always / pause; **heat today** overrides a pause for 24 h. Summer valve exercise: Wednesdays 11:00, valves open for 3 min.

## Priority
Window open → pause · heating pause → off (except safety) · everyone away → setback, never below mold guard · otherwise preferred temperature.
