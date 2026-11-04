"""Nutzung eines Raums lernen: zu welchen Zeiten ist er belegt?

Nur Zählwerte – kein Personenbezug: je Wochentag und Viertelstunde wird gezählt, an wie
vielen Tagen der Raum belegt war. Daraus entsteht ein **Vorschlag** („Mo–Fr 08:00–11:30"),
der in den Einstellungen und der Diagnose erscheint. Es wird nichts automatisch geheizt.
"""

from __future__ import annotations

from datetime import datetime

SLOTS = 96  # Viertelstunden pro Tag
KEEP_DAYS = 28  # vier Wochen Erinnerung
TYPICAL = 3  # ab so vielen Tagen gilt ein Raster als typisch
NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]


def _key(weekday: int, slot: int) -> str:
    return f"{weekday}:{slot}"


def _clock(slot: int) -> str:
    minutes = slot * 15
    return f"{minutes // 60 % 24:02d}:{minutes % 60:02d}"


class UsageProfile:
    """Belegung je Wochentag und Viertelstunde."""

    def __init__(self) -> None:
        self.counts: dict[str, int] = {}  # "wd:slot" → Anzahl Tage
        self._last: str | None = None  # zuletzt gezähltes Raster

    # ---------------------------------------------------------------- Speichern
    def load(self, data: object) -> None:
        raw = data.get("counts") if isinstance(data, dict) else data
        if not isinstance(raw, dict):
            return
        out: dict[str, int] = {}
        for key, value in raw.items():
            try:
                weekday, slot = (int(part) for part in str(key).split(":"))
            except (TypeError, ValueError):
                continue
            if 0 <= weekday <= 6 and 0 <= slot < SLOTS:
                out[_key(weekday, slot)] = max(0, min(KEEP_DAYS, int(value)))
        self.counts = out

    def export(self) -> dict[str, object]:
        return {"counts": dict(self.counts)}

    # ---------------------------------------------------------------- Lernen
    def mark(self, local: datetime, occupied: bool) -> bool:
        """Ein Messpunkt; True, wenn dabei ein neues Raster gezählt wurde."""
        slot = min(SLOTS - 1, max(0, (local.hour * 60 + local.minute) // 15))
        stamp = f"{local.date().isoformat()}:{slot}"
        if self._last == stamp:
            return False
        self._last = stamp
        if not occupied:
            return False
        key = _key(local.weekday(), slot)
        self.counts[key] = min(KEEP_DAYS, self.counts.get(key, 0) + 1)
        return True

    # ---------------------------------------------------------------- Auswertung
    def typical_slots(self, threshold: int = TYPICAL) -> dict[int, list[int]]:
        out: dict[int, list[int]] = {}
        for key, count in self.counts.items():
            if count < threshold:
                continue
            try:
                weekday, slot = (int(part) for part in key.split(":"))
            except (TypeError, ValueError):
                continue
            out.setdefault(weekday, []).append(slot)
        return {weekday: sorted(slots) for weekday, slots in sorted(out.items())}

    def suggested_windows(self, threshold: int = TYPICAL, min_minutes: int = 45) -> list[dict[str, object]]:
        """Zusammenhängende Blöcke als Vorschlag für Zeitfenster."""
        windows: list[dict[str, object]] = []
        for weekday, slots in self.typical_slots(threshold).items():
            blocks: list[list[int]] = []
            for slot in slots:
                if blocks and slot == blocks[-1][-1] + 1:
                    blocks[-1].append(slot)
                else:
                    blocks.append([slot])
            for block in blocks:
                minutes = len(block) * 15
                if minutes < min_minutes:
                    continue
                windows.append(
                    {
                        "weekday": weekday,
                        "start": _clock(block[0]),
                        "end": _clock(block[-1] + 1),
                        "minutes": minutes,
                    }
                )
        return windows

    def summary(self) -> dict[str, object]:
        """Kurzfassung für Einstellungen, Diagnose und Attribut."""
        windows = self.suggested_windows()
        return {
            "days_seen": len({key.split(":")[0] for key in self.counts}),
            "windows": windows[:12],
            "text": describe(windows),
        }


def describe(windows: list[dict[str, object]]) -> str:
    """Fenster zu einem lesbaren Satz bündeln („Mo–Fr 08:00–11:30")."""
    if not windows:
        return ""
    by_span: dict[str, list[int]] = {}
    for window in windows:
        span = f"{window['start']}–{window['end']}"
        by_span.setdefault(span, []).append(int(window["weekday"]))
    return ", ".join(f"{days_label(sorted(days))} {span}" for span, days in by_span.items())


def days_label(weekdays: list[int]) -> str:
    """„Mo–Fr" statt „Mo, Di, Mi, Do, Fr"."""
    if not weekdays:
        return ""
    runs: list[list[int]] = [[weekdays[0]]]
    for day in weekdays[1:]:
        if day == runs[-1][-1] + 1:
            runs[-1].append(day)
        else:
            runs.append([day])
    parts = []
    for run in runs:
        parts.append(NAMES[run[0]] if len(run) == 1 else f"{NAMES[run[0]]}–{NAMES[run[-1]]}")
    return ", ".join(parts)
