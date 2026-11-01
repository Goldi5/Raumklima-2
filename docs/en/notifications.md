# Notifications

## Who gets what

Under **Settings → General → Who gets what** you choose for each recipient which messages they receive:

| Message | When | Default |
|---|---|---|
| 💧 Please air the room | humidity above the limit for 15 min and airing dries – or CO₂ from 1000 ppm (🫁) | push |
| 🪟 Close the window | recommended airing time reached | push |
| 🥶 Room cooling down | below the minimum temperature or cooled down too much | push + voice |
| ✅ Air exchanged | humidity below the limit again (and CO₂ below 800 ppm) | push, quiet |
| 🚪 Window open, nobody home | window open > 2 min, all residents away | push |
| 🏠 Away & preheating | everyone away, away longer, “Antje is coming – preheating”, welcome | off |
| 🍂 Heating season start/end | heating season starts, heating pause, cold snap | push |
| ⚠️ Thermostat not responding | command not confirmed after all retries | push + HA notification |
| 🩺 Heating health | battery low, room doesn't warm up despite an open valve, sensor stuck, radio flaky, window contact silent – at most once a day per problem | push, quiet |
| 📊 Weekly report | Sundays 18:00: heating hours, weather-adjusted comparison, setback, rooms that were too humid | push, quiet |

**Recipients** are `notify` services, e.g. `notify.mobile_app_iphone` or your own service such as `notify.christian`. **Test** sends a sample message.

> The message texts are currently in German.

## Learning sleep times

The integration learns when you go to bed and get up:

- **from night airing:** bedroom window opened in the evening = bedtime, closed in the morning = up.
- **from sleep signals** (optional, e.g. the living room lights): all off for 20 minutes in the evening = bedtime, one on in the morning = up. With signals, quiet hours also apply live: lights off → quiet, lights on in the morning → awake.

Each night counts its earliest event, weekdays and weekends (Fri→Sat, Sat→Sun) separately; from 4 nights the typical value of the last 6 weeks applies. Quiet hours then start 30 minutes before bedtime and end 30 minutes after getting up – **but never shorter than configured**. The night airing window is extended the same way. Configure and view under *General → Sleep times*. Choose a German state under *Public holidays* to treat the night before a holiday like a weekend.

## Night airing

People who sleep with the window open shouldn't be woken up. If a bedroom window opens between **20:00 and 03:00** and someone is home, the room switches to **night airing**:

- Heating stays off as long as the window is open; the other rooms heat normally.
- No “close the window” or “room cooling down” notices.
- If the room drops below **12 °C**, a quiet warning comes once per night.
- At the end of quiet hours (07:00) you get “☀️ Window still open – heating is waiting”, then at most every 30 minutes. As soon as the window is closed, the room heats again.

Per room under *Settings → room → Windows → Sleeping with the window open*: **Automatic** (bedroom and “rarely used”), **Yes** or **No**. Time window and warning limit under *General → Notifications – general*.

## Push buttons (iPhone/Android)

Airing messages have three buttons:
- **Done** – 15 minutes of quiet
- **Remind me in 15 min**
- **Not today** – silent until midnight during the day, in the evening (“until tomorrow morning”) until the end of quiet hours

A message is removed automatically once it no longer applies, e.g. when the window is closed.

## Quiet hours

Default 22:00–07:00. During quiet hours push messages arrive **silently**. Only urgent messages make a sound: *room cooling down*, *window open, nobody home* and *thermostat not responding*. Voice announcements never happen during quiet hours.

On **weekends** (Sat/Sun) quiet hours end later – default 09:00, configurable under *General → Notifications – general → Weekend until*.

## Voice announcements

A speaker can also be added as a recipient, e.g. Alexa via `notify.alexa_media_…`. By default it only announces *room cooling down* and, for *close the window*, from the third reminder.

## Mute per room

Each room has the switch **Notices for this room**, e.g. for a guest room that is only used for visits.

## Repeating

As long as a problem persists, a reminder comes every 5 minutes (configurable). *Please air the room* comes at most every 30 minutes. “Room cooling down” is loud at most three times; after that it reminds quietly every 30 minutes as long as the room is too cold.
