# Usage

## Rooms tab
![Rooms](../images/raeume.png)

The overview shows all rooms with current and target temperature, humidity and status, plus chips for heating rooms, open windows, hints, sync status, **who is home** and **heating season/pause**.
Each room card has a dial (arc = current, knob = target), −/+ and power buttons, an airing countdown and tiles for humidity, dew point, valve, outdoor climate, radiator temperature and offset. The line under the temperature tells what applies right now: *Target 20 °C*, *Lowered 18 °C*, *Heating pause*, *Frost protection*.

## History tab
![History](../images/verlauf.png)

Weather on top; temperature and humidity curves per room with comfort band, toggle chips, 6 h / 24 h / 7 d and hover values; a timeline per room (heating, reached, lowered, window open, off, pause) with short flips merged.

## Report tab
![Report](../images/bericht.png)

Every minute the integration records what each room does (compact daily totals, 400 days, outside the recorder). The report shows **this week** or **this month**: heating hours and equivalent full-open valve hours, a **weather-adjusted** comparison (valve hours per heating degree day vs. the previous period; none below 5 degree days), hours set back and the **estimated saving** (≈ 6 % per degree), **comfort time** (room within ±1 °C of target), daily stacked bars per room with degree-day dots, per-room details (avg temperature/humidity, humid or mold-risk hours, warm on arrival) and open health issues.

**Health check** every 10 minutes: battery < 20 % (urgent < 10 %), room not warming (valve ≥ 60 % for 2 h, < 0.3 °C rise, still below target), sensor stuck (12 h unchanged while the TRV moved ≥ 1.5 °C), radio (unconfirmed commands or ≥ 3 dropouts in 24 h), window contact silent for 2 h (info if open > 24 h). Issues show in the report, the settings page, the room tab, the *Health* sensor and the room's problem sensor; subscribers of "🩺 Heating health" get at most one push per problem per day.

## Log tab
![Log](../images/protokoll.png)

A live decision log: presence changes with distances, ignored location jumps (VPN), season decisions with the outdoor means, each room's target with its reason, windows/night airing, every notification with recipients and loudness, push buttons pressed, thermostat commands and confirmations, health, manual and settings changes. Filter by room, category or text; 14 days kept in the integration's own storage; last 300 entries in the diagnostics download.

## Settings tab
![Settings](../images/einstellungen.png)

![General](../images/einstellungen-allgemein.png)

Everything visible and editable: **General** (presence & setback, heating season, who gets what with test button, quiet hours, weather, building type, room table) and **per room** (preferred temperature, room type, setbacks, humidity limit, airing limits, window logic and delays, hints on/off, calibrate). Changes are saved after a short pause; only administrators can edit.

## Multiple homes
Settings → General → Home → *Create home* adds another hub with its own residents, zone, recipients, season, sleep times, report and log. Assign rooms under *Home* in the room tab. A switcher appears in the overview and settings; each home has its own dashboard (path configurable). All cards and the strategy accept `home: <hub entry_id>`.

## Cards
```yaml
type: custom:raumklima-overview-card
---
type: custom:raumklima-card
entity: climate.living_room
---
type: custom:raumklima-report-card
---
type: custom:raumklima-log-card
---
type: custom:raumklima-history-card
mode: temperature   # temperature | humidity | timeline
---
type: custom:raumklima-settings-card   # best in a panel view
```
