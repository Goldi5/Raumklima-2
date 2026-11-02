# Installation & setup

## Requirements

- Home Assistant **2026.5** or newer (for the dashboard strategy; the integration itself runs from 2025.10)
- [HACS](https://hacs.xyz)
- Per room: a radiator thermostat as a `climate` entity and a temperature sensor. A humidity sensor and window contacts are optional but recommended; a CO₂ sensor is optional too.
- For absence detection: persons with phone location (Home Assistant Companion app) and a zone for the home.

## Installation via HACS

1. HACS → ⋮ → **Custom repositories** → `https://github.com/Goldi5/Raumklima-2`, category **Integration**.
2. Search for **Raumklima** and download it.
3. Restart Home Assistant.

The dashboard cards are loaded automatically – no extra resource needed.

## First room

**Settings → Devices & services → Add integration → Raumklima**

1. Choose the **thermostat**.
2. **Sensors & windows** – Raumklima suggests temperature, humidity and CO₂ sensors and window contacts from the same area. Check them, done. Several radiators in the room? Choose the other thermostats under **Further thermostats in this room** – they get the same commands, each with its own check and correction. Any number of window contacts works (pause as soon as one is open).
3. **The room** – room type (sets sensible defaults), optionally the desired temperature and setback values. Technical settings (calibration, preset, delays) are detected automatically and live under **Advanced**.
4. **First room only: for the whole home** – who lives here, the home zone, who receives notifications, weather source, building type.

The room then appears as a device, and there is a second entry **Allgemein** (general) for everything that concerns the whole home.

> **Tip:** Turn off the thermostat's own window detection (`window_detection`) beforehand and disable old automations for the same TRV.

## More rooms

As above, without step 4 – recipients, presence and heating season apply to all rooms automatically.

## Dashboard

- **Ready-made:** Add dashboard → **Raumklima** (strategy). Builds the tabs *Rooms*, *History*, *Report*, *Log* and *Settings* automatically and adapts when rooms are added.
- **Your own dashboards:** use the cards individually – see [Usage](usage.md).

## Which thermostats work?

Raumklima controls **every radiator thermostat that appears as a `climate` entity in Home Assistant** and whose temperature can be set – whether via Zigbee, Z-Wave, Wi-Fi, Bluetooth, Matter/Thread or a cloud.

| | Used for | If missing |
|---|---|---|
| **Settable temperature** (required) | control | doesn't work |
| **Own temperature reading** | compensation: how much warmer it is right at the radiator | Raumklima controls by the room sensor without compensation |
| **Offset setting** (number like “temperature calibration”) | correction inside the thermostat | automatic **setpoint compensation** – Raumklima sets the thermostat higher/lower accordingly; works with every device |
| **Valve position** | report, “radiator can't keep up” notice | only these analyses are missing |
| **Turning off** (preset “off”, mode “off”) | pause with open window, heating pause | Raumklima sets the lowest temperature |

**Before you start, turn off on the thermostat:** its own **schedules**, its own **window detection** and **boost**/automatic modes – otherwise thermostat and Raumklima work against each other. Disable old automations for the same thermostats.

### Notes per device type

- **Zigbee (e.g. Tuya, Aqara, Danfoss, Bosch, Moes):** usually with offset setting and own temperature – ideal. Tuya devices via Zigbee2MQTT often report the offset only after it was set once; Raumklima does that automatically.
- **Shelly (Shelly TRV, Shelly BLU TRV via BLU gateway):** appear as `climate` entities via the official Shelly integration. Whether offset and valve position are passed to Home Assistant depends on model and firmware – without offset, setpoint compensation is used.
- **Matter & Thread (e.g. Eve Thermo, Bosch, Aqara):** usually no presets but an “off” mode – leave *Turn off via* on **Automatic**. Often without offset → **setpoint compensation**. Battery-powered Thread devices only check in every few seconds: if “thermostat not responding” appears often, raise *Verify command after* under *Technical* to 30–40 s.
- **Cloud devices (e.g. Tado, Netatmo):** work, but react with a delay. Raumklima checks every command and repeats it – raise *Verify command after* if notices are frequent. No internet, no control.
- **Homematic, Z-Wave & co.:** as above – as long as it's a `climate` entity. With duty-cycle radio (Homematic), avoid too frequent changes; the brake against too many commands adds protection.

### Tested thermostats

| Thermostat | Connection | Status |
|---|---|---|
| Tuya TRV602Z | Zigbee2MQTT | ✅ tested (offset, valve position, presets) |
| Shelly TRV / BLU TRV | Shelly | ❔ not tested yet – reports welcome |
| Eve Thermo, Aqara, Bosch (Matter) | Matter/Thread | ❔ not tested yet |

Your thermostat works (or doesn't)? Please report it as an [issue](https://github.com/Goldi5/Raumklima-2/issues) – with model, connection and what works. That's how this list grows.

## Updating

HACS shows new versions. After downloading, restart Home Assistant. Changes to the cards alone are visible after reloading the page.

## Migrating from 0.2.x

On the first start of 0.3 or later, **Allgemein** is created automatically and the recipients, quiet hours and weather source are taken over from your rooms. Afterwards just choose **residents and zone** (settings page → General) to activate absence detection.
