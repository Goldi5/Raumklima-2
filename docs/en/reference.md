# Reference

See the German [Referenz](../de/referenz.md) for the full tables of all settings and entities; the names in the English UI correspond 1:1.

**General:** residents, home zone, lower after (30 min), away longer after (24 h), preheat within (10 km), building type (renovated), mode (auto), season (10-01 – 04-30), heating limit (15 °C), cold snap below (12 °C), safety (16 °C), summer valve exercise (on), recipients with message types, quiet hours (22:00–07:00), repeat (5 min), weather source, HA bell on failure.

**Per room:** room type, preferred temperature, setback short/long, humidity limit, airing minimum and max drop, window logic and delays, calibration, on-preset, off method, adopt TRV changes, offset threshold/interval, sensor timeout, verify delay, retries.

**General entities:** presence sensor (`home`, `guests`, `preheat`, `away_short`, `away_long`, attribute `persons`), heating mode sensor (`heating`, `pause`, `cold_snap`, `heat_today`, `always`, `manual_pause`), outdoor daily mean, switches vacation/guests, select season mode, button heat today.

**Event:** `raumklima_event` with `type`, `room`, `entry_id`, e.g. `type: ventilation, state: please_close`.
