# Notifications

Choose per recipient which messages they get (Settings → General → Who gets what):

| Message | When | Default |
|---|---|---|
| 💧 Please air | humidity 15 min above limit, airing dries | push |
| 🪟 Close window | recommended airing time reached | push |
| 🥶 Room cooling down | below minimum or cooled too much | push + voice |
| ✅ Air exchanged | humidity back below limit | push (quiet) |
| 🚪 Window open, nobody home | window open > 2 min while all residents away | push |
| 🏠 Absence & preheating | all away, away longer, "X is coming – preheating", welcome | off |
| 🍂 Heating season | season starts, pause, cold snap | push |
| ⚠️ Thermostat not responding | command not confirmed after all retries | push + HA bell |
| 🩺 Heating health | low battery, room not warming despite open valve, sensor stuck, flaky radio, silent window contact – at most once a day per problem | push (quiet) |
| 📊 Weekly report | Sundays 18:00: heating hours, weather-adjusted comparison, setback, humid rooms | push (quiet) |

**Learned sleep times:** from night airing (window opened in the evening / closed in the morning) and optional sleep signals (e.g. living-room light off for 20 min = bed, on in the morning = up) the integration learns typical bed and wake times, weekdays and weekends separately (median of 6 weeks, from 4 nights). They only ever extend quiet hours and the night-airing window. With signals, quiet hours also follow the lights live.

**Night airing:** if a window in a bedroom opens between 20:00 and 03:00 while someone is home, the room switches to *night airing*: heating waits, no "close window"/"cooling down" messages, one quiet warning below 12 °C, and at the end of quiet hours "window still open – heating is waiting" (then at most every 30 min). Per room: auto (bedroom, rarely used) / yes / no; times and limit under General.

Recipients are `notify` services (mobile app, Alexa Media, …). **Test** sends a sample message.
Push actions: *Done*, *Remind in 15 min*, *Not today* (in the evening: until the end of quiet hours). Messages clear themselves when resolved.
**Quiet hours** (22:00–07:00, weekends until 09:00): silent push; only urgent messages are loud; never voice.
Each room has a **hints on/off** switch. Reminders repeat every 5 min while the problem persists; "please air" at most every 30 min.
