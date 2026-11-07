# Devices & thermostats

What Raumklima can do with which device – and where the limits are. Everything here comes from user
feedback and our own measurements; the list grows with every report.

> **Rule of thumb:** Raumklima does not replace device features, it conducts them. So:
> **one brain per room** – either Raumklima controls, or a device automation does. Schedules and boost
> functions inside the device or the vendor app must be off, otherwise two controllers fight over the
> same valve.

## At a glance

| Device | Integration | Works well | Limits |
|---|---|---|---|
| Tuya radiator thermostat | Zigbee2MQTT | setpoint, presets, valve position, battery | `preset: on` means *permanently open* – used internally as `comfort` + `comfort_temperature` |
| Moes BRT-100-TRV | Zigbee2MQTT | setpoint, presets, valve position, measured temperature | Reports the valve position as its own `sensor.…_position` – Raumklima uses it as valve source. Presets `none/programming/manual/temporary_manual/holiday`; range 0–35 °C, clamped to 6–30 °C |
| Aqara E1 | Zigbee2MQTT | setpoint, window, battery | reports no heating state; status is derived from demand |
| Homematic IP / CCU | Homematic integration | setpoint, valve position, two-way | feedback often only after 10–20 minutes (radio, battery saving) |
| Livisi / RWE SmartHome | Livisi integration | setpoint, window | **no offset on the device** – Raumklima learns a smoothed setpoint compensation |
| Sonoff TRVZB | ZHA | setpoint, offset via `number.<name>_lokaler_temperatur_offset` | falls asleep regularly; no valve position, no presets |
| Netatmo | Netatmo integration | setpoint, room sensor | sluggish; valve position often missing |
| FRITZ!DECT (Comet, 440) | AVM FRITZ!SmartHome | setpoint, room sensor | valve position often empty; device schedules must be off |

## What every device needs

- **A `climate` thermostat** in the room. Without one, use a **monitoring room** (measure, remind,
  report – without touching setpoints).
- **A room sensor is recommended, not required.** Without one, Raumklima controls by the thermostat's
  own sensor – then there is no offset compensation, because measuring and heating happen in the same
  place.
- **Window contact(s)** as `binary_sensor` (opening sensors and `cover` work too). Several windows per
  room are fine; open is open.
- **Valve position is optional.** If the device does not provide it, the tile shows “–”. That is
  intentional: better nothing than a guessed value.

## Things worth knowing

### Tuya (Zigbee2MQTT)
Presets exist, but **`preset: on` means “valve permanently open”** – an emergency setting, not a
heating level. Raumklima therefore uses `comfort` and writes the setpoint to `comfort_temperature`.
The internal weekly schedule in the device must be deleted, otherwise it overrides the targets.

### Aqara E1 (Zigbee2MQTT)
The device provides neither `hvac_action` nor `running_state` nor a valve position. Raumklima derives
“heating/reached” from the difference between room temperature and target – otherwise the status would
stay at “error” forever.

### Homematic IP / CCU
Works both ways (Raumklima → device, turning the dial → Raumklima), but the CCU reports changes
slowly. If you need faster valve detection, enable *Thermostat & sensor → **Faster polling*** per room:
it actively polls every two minutes – at the cost of battery life.

### Livisi / RWE SmartHome
The offset cannot be set on the device. Raumklima instead learns the difference between room sensor and
device sensor (smoothed, limited to ±4 K) and pushes the adjusted setpoint every ten minutes. The log
shows “Abgleich −2.3°” and the attribute `offset_auto`.

### Sonoff TRVZB (ZHA)
The offset is exposed as `number.<name>_lokaler_temperatur_offset`. The device **falls asleep**, so
commands are often confirmed only after several attempts. These values have proven useful:

- **Verify command after:** 45 s (instead of 20 s)
- **Minimum offset interval:** 15 min
- **Threshold:** 0.5 °C

There is no valve position and no presets – only heat and off. If you previously used *Versatile
Thermostat* in valve mode: **check the opening and closing angles** (often 0/100) and set both to 100,
otherwise the valve stays closed.

### Netatmo
Very slow feedback. Turn off schedules in the Netatmo app, otherwise they control against Raumklima.
Valve position is missing on many models.

### FRITZ!DECT (Comet, DECT 440)
Disable schedules and boost in the FRITZ!Box. Valve position is often empty, battery level is still
reported.

## When something shows “–”

| Display | Meaning |
|---|---|
| Valve “–” | device or integration provides no valve position |
| Battery empty/“–” | device reports no battery level (e.g. some ZHA devices) |
| Status “sensor missing” | room sensor unreachable – Raumklima keeps the last value for one hour |
| Preset not shown | device has no presets; Raumklima uses heat/off only |

## Contribute your experience

Different behaviour, or a device missing here? Please open an issue with the **diagnostics file**
(Settings → *Diagnostics*) – it contains integration, entities and the latest decisions, without
credentials.
