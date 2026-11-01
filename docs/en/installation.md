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
2. **Sensors & windows** – Raumklima suggests temperature, humidity and CO₂ sensors and window contacts from the same area. Check them, done.
3. **The room** – room type (sets sensible defaults), optionally the desired temperature and setback values. Technical settings (calibration, preset, delays) are detected automatically and live under **Advanced**.
4. **First room only: for the whole home** – who lives here, the home zone, who receives notifications, weather source, building type.

The room then appears as a device, and there is a second entry **Allgemein** (general) for everything that concerns the whole home.

> **Tip:** Turn off the thermostat's own window detection (`window_detection`) beforehand and disable old automations for the same TRV.

## More rooms

As above, without step 4 – recipients, presence and heating season apply to all rooms automatically.

## Dashboard

- **Ready-made:** Add dashboard → **Raumklima** (strategy). Builds the tabs *Rooms*, *History*, *Report*, *Log* and *Settings* automatically and adapts when rooms are added.
- **Your own dashboards:** use the cards individually – see [Usage](usage.md).

## Matter & Thread thermostats

Raumklima controls every thermostat that appears as a `climate` entity in Home Assistant – including Matter devices (e.g. Eve Thermo, Bosch, Aqara). So far only the Tuya TRV602Z has been tested by the author; feedback on Matter devices is welcome as an issue.

What matters:

- **Turning off:** Matter thermostats usually have no presets but do have the “off” mode. Leave *Turn off via* on **Automatic** – Raumklima then uses “HVAC off”.
- **Calibration:** If Home Assistant offers a number entity for the temperature offset of the device, choose **Offset**. Otherwise use **Setpoint compensation** – that works with every thermostat.
- **Thread sleeps:** battery-powered Thread devices only check in every few seconds. If “thermostat not responding” appears often, raise *Verify command after* under *Technical* to 30–40 s.
- **Disable the thermostat's own window detection**, otherwise both work against each other.

## Updating

HACS shows new versions. After downloading, restart Home Assistant. Changes to the cards alone are visible after reloading the page.

## Migrating from 0.2.x

On the first start of 0.3 or later, **Allgemein** is created automatically and the recipients, quiet hours and weather source are taken over from your rooms. Afterwards just choose **residents and zone** (settings page → General) to activate absence detection.
