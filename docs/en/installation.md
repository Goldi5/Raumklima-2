# Installation & setup

## Requirements
- Home Assistant **2026.5+** (dashboard strategy; the integration itself runs from 2025.10)
- [HACS](https://hacs.xyz)
- Per room: a radiator thermostat (`climate`) and a temperature sensor; humidity sensor and window contacts optional but recommended
- For absence: people with phone location (Home Assistant app) and a zone for the home

## Install via HACS
1. HACS → ⋮ → **Custom repositories** → `https://github.com/Goldi5/Raumklima-2`, category **Integration**
2. Download **Raumklima**, restart Home Assistant

The dashboard cards are loaded automatically.

## Add the first room
**Settings → Devices & services → Add integration → Raumklima**
1. Choose the **thermostat**.
2. **Sensors & windows** – suggested from the thermostat's area. Check and continue.
3. **The room** – room type (sets defaults), optional preferred temperature and setback values. Technical options are detected automatically and live under **Advanced**.
4. **First room only: the whole home** – residents, home zone, notification recipients, weather source, building type.

A second entry **Allgemein** (general) holds everything that applies to the whole home.

> Disable the TRV's own window detection and old automations for the same TRV first.

## More rooms
Same as above without step 4.

## Dashboard
Add dashboard → **Raumklima** (strategy) for tabs *Rooms*, *History*, *Settings* – or use the cards individually ([Usage](usage.md)).

## Upgrading from 0.2.x
On first start of 0.3 the general entry is created automatically and recipients, quiet hours and weather source are taken over from your rooms. Then select **residents and zone** in the settings page to enable absence handling.
