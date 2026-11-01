# Reference

## General settings (apply to all rooms of a home)

| Setting | Default | Meaning |
|---|---|---|
| Residents | – | persons; absence detection only works with residents **and** zone |
| Home zone | – | e.g. `zone.my_flat` – not necessarily “Home” |
| Set back after | 30 min | delay before “briefly away” applies |
| “Away longer” from | 24 h | then setback “long” |
| Preheat from | 10 km | approaching closer than this → preheat (0 = off) |
| Calendar | – | `calendar.*`; a running event containing “vacation” etc. acts like vacation, “home office” etc. like guests |
| … like vacation / … someone stays home | see [How it works](how-it-works.md#5-absence) | words, comma-separated |
| Building type | old, renovated | temperature factor for mould protection (0.60 / 0.70 / 0.80) |
| Mode | Automatic | Automatic / Always heat / Heating paused |
| Heating season | 10-01 to 04-30 | format MM-DD |
| Heating limit | 15 °C | daily outdoor mean (24 h measured + 24 h forecast) |
| Cold snap below | 12 °C | 3 days below → heating outside the season too |
| Safety minimum | 16 °C | below this a room always heats |
| Frost night: smaller setback | on | forecast ≤ −5 °C within 12 h → setback only half as deep |
| Summer valve exercise | on | open valves for 3 min on Wednesdays at 11:00 |
| Recipients | – | message types per `notify` service |
| Quiet hours | 22:00–07:00 (weekend until 09:00) | only urgent messages are loud, no announcements |
| Night airing | 20:00–03:00 | window opened in a bedroom during this time = sleeping with the window open |
| … quiet warning below | 12 °C | once per night |
| Remind every | 5 min | repeat as long as the problem persists |
| Weather source | – | `weather.*` (with forecast) or an outdoor temperature sensor |
| Learn times | on | sleep times from night airing and lights |
| Public holidays | – | German state; the night before a holiday counts as weekend |
| Sleep signals | – | lights/switches for bedtime and getting up |
| Errors in HA notifications | on | additional notification in Home Assistant |

## Settings per room

| Setting | Default | Meaning |
|---|---|---|
| Room type | living room | sets defaults for desired temperature, minimum temperature, humidity, setback |
| Desired temperature | by room type | living/children's room 20 · kitchen 19 · bathroom 22 · bedroom/rarely used 17 °C |
| Setback “briefly away” | 18 °C (bedroom, rarely used: 16) | |
| Setback “away longer” | 16 °C | |
| Sunny side | off | 1 °C less when sun is forecast |
| Light signal: lights | – | `light` entities that blink on notices (`signal_lights`) |
| Light signal: blink on | please air, please close | `light_signals`: `open`, `close`, `done`, `problem` |
| CO₂ sensor | – | optional; from 1000 ppm “please air the room” |
| Humidity limit | 70 % (bathroom 75 %) | from here “please air the room” |
| Minimum temperature while airing | 18 °C (bedroom, rarely used: 16) | below: “room cooling down” |
| Max. cooling while airing | 3 °C | |
| Window logic | on | pause while a window is open |
| Delay open / closed | 10 s / 10 s | |
| Sleeping with the window open | Automatic | night airing: Automatic (bedrooms) / Yes / No |
| Detect open window from temperature drop | Automatic | only without a reachable contact / Yes / No |
| Calibration | Offset | Offset / Setpoint compensation / None |
| Turn on with | Automatic | preset for heating; avoids “on” (TRV602Z: valve open) |
| Turn off via | Automatic | preset “off”, HVAC “off” or minimum temperature |
| Follow changes at the TRV | on | off = changes at the device are reverted |
| Offset from a change of | 0.3 °C | |
| Minimum calibration interval | 5 min | |
| Sensor considered failed after | 60 min | |
| Verify command after | 20 s | |
| Retries before notification | 5 | |

## Entities per room

| Entity | Content |
|---|---|
| `climate.<room>` | thermostat; attributes include `effective_target`, `plan_reason`, `presence`, `heating_mode`, `status`, `offset`, `valve_position`, `co2`, airing values |
| `sensor.<room>_status` | heating · reached · window open · off · sensor/TRV missing · heating paused · set back · night airing |
| `sensor.<room>_sync` | ok · pending · failed |
| `sensor.<room>_calibration_offset` | current offset |
| `sensor.<room>_airing` | ok · please open · airing · done · please close · too cold |
| `sensor.<room>_dew_point`, `…_absolute_humidity`, `…_recommended_airing_time` | values |
| `binary_sensor.<room>_window`, `…_problem`, `…_mold_risk` | |
| `switch.<room>_window_logic`, `…_airing_notifications` | |
| `number.<room>_humidity_limit_please_air`, `…_minimum_temperature_while_airing`, `…_max_temperature_drop_while_airing` | |
| `button.<room>_calibrate_now` | |

## Entities of the hub “Allgemein”

| Entity | Content |
|---|---|
| `sensor.raumklima_allgemein_presence` | home · guests · preheat · away_short · away_long; attribute `persons` (home?, distance, approaching) |
| `sensor.raumklima_allgemein_heating_mode` | heating · pause · cold_snap · heat_today · always · manual_pause; attributes with daily means |
| `sensor.raumklima_allgemein_outdoor_daily_mean` | mean of 24 h measurements and 24 h forecast |
| `sensor.raumklima_allgemein_health` | number of open problems |
| `switch.raumklima_allgemein_vacation`, `switch.raumklima_allgemein_guests` | |
| `select.raumklima_allgemein_heating_season_mode` | auto · always · pause |
| `button.raumklima_allgemein_heat_today` | heat for 24 h |

(The exact entity IDs depend on the language used during setup.)

## Device triggers

In the automation editor: **Add trigger → Device → (room)**. Available:

| Trigger | When |
|---|---|
| Airing assistant asks to air the room | humidity or CO₂ too high |
| Airing time reached – please close | recommended airing time over |
| Room cooling down while airing | below the minimum temperature or cooled down too much |
| Air exchanged | humidity/CO₂ fine again |
| Window opened / closed | immediately (without delay), also estimated windows without a contact |
| Heating paused (window) / resumed | after the delay, only with window logic |
| Health check found a problem | new problem in the room |

## Event for your own automations

`raumklima_event` with `type`, `state`, `room`, `entry_id` and further data:

| `type` | `state` | further data |
|---|---|---|
| `ventilation` | `ok`, `please_open`, `airing`, `done`, `please_close`, `too_cold` | `reason` (`humidity`/`co2` for `please_open`) |
| `window` | `open`, `closed` | `virtual` (estimated), `night` (night airing) |
| `heating` | `paused`, `resumed` | |
| `health` | `problem` | `code`, `title`, `severity` |

```yaml
triggers:
  - trigger: event
    event_type: raumklima_event
    event_data:
      type: ventilation
      state: please_close
actions:
  - action: light.turn_on
    target: { entity_id: light.hallway }
    data: { color_name: blue, flash: short }
```

Example – switch something else during vacation:

```yaml
triggers:
  - trigger: state
    entity_id: sensor.raumklima_allgemein_presence
    to: away_long
```

## WebSocket API

Used by the cards; handy for your own tools. All commands accept an optional `home` (entry_id of the hub).

| Command | Purpose |
|---|---|
| `raumklima/config` | settings, rooms, homes, choices |
| `raumklima/hub/update`, `raumklima/room/update` | change settings (admin) |
| `raumklima/hub/action` | `heat_today`, `cancel_heat_today`, `vacation`, `guests` (admin) |
| `raumklima/report` | heating report (week, month, daily values, health) |
| `raumklima/report/export` | daily values per room as CSV (`days` optional) |
| `raumklima/log`, `raumklima/log/subscribe` | decision log, live |
| `raumklima/notify/test` | send a test message (admin) |
| `raumklima/room/light_test` | let the room's signal lights blink (`entry_id`, optional `signal`; admin) |
| `raumklima/home/create` | create another home (admin) |
