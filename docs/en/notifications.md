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

Recipients are `notify` services (mobile app, Alexa Media, …). **Test** sends a sample message.
Push actions: *Done*, *Remind in 15 min*, *Not today*. Messages clear themselves when resolved.
**Quiet hours** (22:00–07:00): silent push; only urgent messages are loud; never voice.
Each room has a **hints on/off** switch. Reminders repeat every 5 min while the problem persists; "please air" at most every 30 min.
