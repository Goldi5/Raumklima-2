"""Nutzung eines Raums lernen: zu welchen Zeiten ist er belegt?

Nur Datumswerte – kein Personenbezug: je Wochentag und Viertelstunde wird gemerkt, an welchen
Tagen der Raum belegt war (höchstens die letzten vier Wochen). Ein Raster gilt als **typisch**,
wenn es an mindestens 3 der letzten 4 gleichen Wochentage belegt war. Daraus entstehen
- ein **Vorschlag** („Mo–Fr 08:00–11:30") in den Einstellungen und der Diagnose,
- das **Vorwärmen**: mit „Bei Anwesenheit" wird der Raum vor einem typischen Block auf die
  Anwesenheits-Temperatur gebracht (``next_block``).

Ältere Versionen haben nur gezählt und nie vergessen – eine Gewohnheit von vor Monaten galt
für immer als typisch. Beim Laden werden alte Zähler in Datumswerte der letzten Wochen
übersetzt; sie laufen damit nach spätestens vier Wochen aus.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta

SLOTS = 96  # Viertelstunden pro Tag
KEEP_DAYS = 28  # vier Wochen Erinnerung
TYPICAL = 3  # an so vielen der letzten 4 gleichen Wochentage belegt → typisch
MIN_BLOCK = 45  # min: kürzere typische Blöcke werden nicht vorgewärmt/vorgeschlagen
NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]


def _key(weekday: int, slot: int) -> str:
    return f"{weekday}:{slot}"


def _clock(slot: int) -> str:
    minutes = slot * 15
    return f"{minutes // 60 % 24:02d}:{minutes % 60:02d}"


class UsageProfile:
    """Belegung je Wochentag und Viertelstunde (Datum der belegten Tage)."""

    def __init__(self) -> None:
        self.days: dict[str, list[str]] = {}  # "wd:slot" → ISO-Daten, an denen belegt
        self._last: str | None = None  # zuletzt gezähltes Raster

    # ---------------------------------------------------------------- Speichern
    def load(self, data: object, today: date | None = None) -> None:
        today = today or date.today()
        out: dict[str, list[str]] = {}
        if isinstance(data, dict) and isinstance(data.get("days"), dict):
            for key, values in data["days"].items():
                if self._valid(key) and isinstance(values, list):
                    out[key] = sorted({str(v) for v in values})[-4:]
        else:
            # altes Format: nur Zähler – auf die letzten gleichen Wochentage verteilen
            raw = data.get("counts") if isinstance(data, dict) else data
            for key, value in (raw or {}).items() if isinstance(raw, dict) else []:
                if not self._valid(key):
                    continue
                weekday = int(str(key).split(":")[0])
                last = today - timedelta(days=(today.weekday() - weekday) % 7 or 7)
                n = max(0, min(4, int(value or 0)))
                out[key] = sorted((last - timedelta(weeks=w)).isoformat() for w in range(n))
        self.days = {k: v for k, v in out.items() if v}
        self._prune(today)

    @staticmethod
    def _valid(key: object) -> bool:
        try:
            weekday, slot = (int(part) for part in str(key).split(":"))
        except (TypeError, ValueError):
            return False
        return 0 <= weekday <= 6 and 0 <= slot < SLOTS

    def export(self) -> dict[str, object]:
        return {"days": {k: list(v) for k, v in self.days.items()}}

    def _prune(self, today: date) -> None:
        cutoff = (today - timedelta(days=KEEP_DAYS)).isoformat()
        for key in list(self.days):
            kept = [d for d in self.days[key] if d > cutoff]
            if kept:
                self.days[key] = kept
            else:
                del self.days[key]

    # ---------------------------------------------------------------- Lernen
    def mark(self, local: datetime, occupied: bool) -> bool:
        """Ein Messpunkt; True, wenn dabei ein neues Raster gezählt wurde."""
        slot = min(SLOTS - 1, max(0, (local.hour * 60 + local.minute) // 15))
        stamp = f"{local.date().isoformat()}:{slot}"
        if self._last == stamp:
            return False
        if self._last is None or self._last.split(":")[0] != local.date().isoformat():
            self._prune(local.date())  # einmal am Tag alte Daten vergessen
        self._last = stamp
        if not occupied:
            return False
        key = _key(local.weekday(), slot)
        day = local.date().isoformat()
        if day not in self.days.get(key, []):
            self.days[key] = sorted([*self.days.get(key, []), day])[-4:]
        return True

    @property
    def counts(self) -> dict[str, int]:
        """An wie vielen Tagen (der letzten vier Wochen) belegt – je Raster."""
        return {k: len(v) for k, v in self.days.items()}

    # ---------------------------------------------------------------- Auswertung
    def typical_slots(self, threshold: int = TYPICAL) -> dict[int, list[int]]:
        out: dict[int, list[int]] = {}
        for key, count in self.counts.items():
            if count < threshold:
                continue
            weekday, slot = (int(part) for part in key.split(":"))
            out.setdefault(weekday, []).append(slot)
        return {weekday: sorted(slots) for weekday, slots in sorted(out.items())}

    def blocks(self, threshold: int = TYPICAL, min_minutes: int = MIN_BLOCK) -> dict[int, list[tuple[int, int]]]:
        """Zusammenhängende typische Blöcke je Wochentag: (erstes Raster, Raster nach dem Ende)."""
        out: dict[int, list[tuple[int, int]]] = {}
        for weekday, slots in self.typical_slots(threshold).items():
            runs: list[list[int]] = []
            for slot in slots:
                if runs and slot == runs[-1][-1] + 1:
                    runs[-1].append(slot)
                else:
                    runs.append([slot])
            out[weekday] = [(r[0], r[-1] + 1) for r in runs if len(r) * 15 >= min_minutes]
        return out

    def next_block(self, local: datetime, horizon: timedelta = timedelta(hours=24)) -> tuple[datetime, datetime] | None:
        """Laufender oder nächster typischer Block (Beginn, Ende) in lokaler Zeit."""
        blocks = self.blocks()
        if not blocks:
            return None
        midnight = local.replace(hour=0, minute=0, second=0, microsecond=0)
        for offset in range(2):
            day = midnight + timedelta(days=offset)
            for first, after in blocks.get(day.weekday(), []):
                start = day + timedelta(minutes=first * 15)
                end = day + timedelta(minutes=after * 15)
                if end > local and start - local <= horizon:
                    return start, end
        return None

    def suggested_windows(self, threshold: int = TYPICAL, min_minutes: int = MIN_BLOCK) -> list[dict[str, object]]:
        """Zusammenhängende Blöcke als Vorschlag für Zeitfenster."""
        windows: list[dict[str, object]] = []
        for weekday, runs in self.blocks(threshold, min_minutes).items():
            for first, after in runs:
                windows.append(
                    {"weekday": weekday, "start": _clock(first), "end": _clock(after), "minutes": (after - first) * 15}
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
