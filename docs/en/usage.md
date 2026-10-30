# Usage

## Rooms tab
![Rooms](../images/raeume.png)

The overview shows all rooms with current and target temperature, humidity and status, plus chips for heating rooms, open windows, hints, sync status, **who is home** and **heating season/pause**.
Each room card has a dial (arc = current, knob = target), −/+ and power buttons, an airing countdown and tiles for humidity, dew point, valve, outdoor climate, radiator temperature and offset. The line under the temperature tells what applies right now: *Target 20 °C*, *Lowered 18 °C*, *Heating pause*, *Frost protection*.

## History tab
![History](../images/verlauf.png)

Weather on top; temperature and humidity curves per room with comfort band, toggle chips, 6 h / 24 h / 7 d and hover values; a timeline per room (heating, reached, lowered, window open, off, pause) with short flips merged.

## Settings tab
![Settings](../images/einstellungen.png)

![General](../images/einstellungen-allgemein.png)

Everything visible and editable: **General** (presence & setback, heating season, who gets what with test button, quiet hours, weather, building type, room table) and **per room** (preferred temperature, room type, setbacks, humidity limit, airing limits, window logic and delays, hints on/off, calibrate). Changes are saved after a short pause; only administrators can edit.

## Cards
```yaml
type: custom:raumklima-overview-card
---
type: custom:raumklima-card
entity: climate.living_room
---
type: custom:raumklima-history-card
mode: temperature   # temperature | humidity | timeline
---
type: custom:raumklima-settings-card   # best in a panel view
```
