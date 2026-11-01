# Raumklima – Documentation

**Current version: 0.8.5** – see [CHANGELOG](../../CHANGELOG.md)

**Raumklima** turns every radiator thermostat (TRV) into a smart room thermostat: it controls by a real room sensor, pauses when a window opens, coaches you while airing, lowers the temperature when nobody is home – and doesn't heat at all in summer.

![Rooms](../images/raeume.png)

| Page | Topic |
|---|---|
| [Installation & setup](installation.md) | HACS, first room, general settings |
| [Usage](usage.md) | Dashboard, cards, settings page |
| [How it works](how-it-works.md) | Control, offset, windows, reliability, airing, absence, mold guard, heating season |
| [Notifications](notifications.md) | Who gets what, quiet hours, actions, voice |
| [Reference](reference.md) | All settings, entities, events |
| [Troubleshooting](troubleshooting.md) | FAQ |

## At a glance

- **Control by the room sensor** instead of the sensor at the radiator – automatic offset or setpoint compensation.
- **Window logic:** pause after 10 s open, resume after 10 s closed, settings kept.
- **Reliable over flaky radio/VPN links:** every command is verified and retried.
- **Airing assistant:** humidity limit per room, airing time by outdoor temperature, checks whether airing actually dries, warns when the room cools down.
- **Absence:** residents + home zone, setback "briefly away" / "away longer", mold guard per DIN 4108-2, preheating when someone approaches.
- **Heating season:** heating limit by daily mean incl. weather forecast, cold-snap rule, "heat today", summer valve exercise.
- **Notifications:** choose per recipient which messages they get; actionable push, optional voice.
- **Night airing:** sleeping with the window open – no airing prompts, one quiet cold warning, good-morning reminder.
- **Learning:** heat-up time per room (preheat by estimated arrival), bed and wake times from windows and lights (quiet hours adapt; weekends and public holidays per German state).
- **Window without contact:** detects an open window from a sudden temperature drop.
- **Health check, report and live decision log** – what was decided when and why.
- **Multiple homes** (e.g. Berlin and Remscheid) with a switcher in the dashboard.
- **Modern dashboard** with room cards, history, report, log and a fully editable settings page.

Tested with Tuya **TRV602Z** (Zigbee2MQTT) and IKEA sensors; works with any `climate` thermostat. The user interface is German/English.
