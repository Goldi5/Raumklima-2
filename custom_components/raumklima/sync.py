"""Senden -> Prüfen -> Wiederholen.

Jeder Befehl ans TRV hat einen Schlüssel (z. B. "mode", "setpoint",
"offset"). Ein neuer Befehl mit gleichem Schlüssel ersetzt den alten, es
wird also immer nur der neueste Soll-Zustand verfolgt. Ohne HA-Abhängigkeit,
damit testbar; Zeitsteuerung wird von außen hereingereicht.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
import logging
from typing import Any

from .logic import retry_delay

_LOGGER = logging.getLogger(__name__)

Scheduler = Callable[[float, Callable[[], Any]], Callable[[], None]]


@dataclass
class SyncJob:
    """Ein ausstehender Befehl."""

    key: str
    description: str
    send: Callable[[], Awaitable[None]]
    check: Callable[[], bool]
    why: str | None = None
    attempts: int = 0
    cancel: Callable[[], None] | None = field(default=None, repr=False)


class SyncManager:
    """Verwaltet ausstehende Befehle und deren Bestätigung."""

    def __init__(
        self,
        *,
        schedule: Scheduler,
        run_task: Callable[[Awaitable[Any]], Any],
        is_target_available: Callable[[], bool],
        verify_delay: float = 20,
        max_retries: int = 5,
        slow_interval: float = 300,
        on_change: Callable[[], None] | None = None,
        on_failed: Callable[[SyncJob], None] | None = None,
        on_recovered: Callable[[], None] | None = None,
        on_event: Callable[[str, SyncJob], None] | None = None,
    ) -> None:
        self._schedule = schedule
        self._run_task = run_task
        self._available = is_target_available
        self.verify_delay = verify_delay
        self.max_retries = max_retries
        self.slow_interval = slow_interval
        self._on_change = on_change or (lambda: None)
        self._on_failed = on_failed or (lambda job: None)
        self._on_recovered = on_recovered or (lambda: None)
        self._on_event = on_event or (lambda event, job: None)
        self.jobs: dict[str, SyncJob] = {}
        self.failed_notified = False

    # ------------------------------------------------------------ Status
    @property
    def state(self) -> str:
        """ok / pending / failed."""
        if not self.jobs:
            return "ok"
        if any(job.attempts > self.max_retries for job in self.jobs.values()):
            return "failed"
        return "pending"

    @property
    def max_attempt(self) -> int:
        """Höchste Versuchsnummer aller offenen Befehle."""
        return max((job.attempts for job in self.jobs.values()), default=0)

    def is_pending(self, key: str) -> bool:
        """Läuft für diesen Schlüssel noch ein Befehl?"""
        return key in self.jobs

    # ------------------------------------------------------------ Aktionen
    async def request(
        self,
        key: str,
        description: str,
        send: Callable[[], Awaitable[None]],
        check: Callable[[], bool],
        why: str | None = None,
    ) -> None:
        """Neuen Soll-Zustand anfordern (ersetzt älteren mit gleichem key)."""
        self._drop(key)
        if check():
            # Steht schon so – nichts zu tun
            self._changed()
            return
        job = SyncJob(key=key, description=description, send=send, check=check, why=why)
        self.jobs[key] = job
        self._event("send", job)
        await self._attempt(job)

    def cancel(self, key: str) -> None:
        """Einen Befehl verwerfen (z. B. Sollwert, wenn TRV aus sein soll)."""
        if key in self.jobs:
            self._drop(key)
            if not self.jobs and self.failed_notified:
                self.failed_notified = False
                self._on_recovered()
            self._changed()

    def cancel_all(self) -> None:
        """Alle Jobs abbrechen (beim Entladen)."""
        for key in list(self.jobs):
            self._drop(key)

    async def retry_all_now(self) -> None:
        """Nach Wiederverbindung: alles Ausstehende sofort erneut senden."""
        for job in list(self.jobs.values()):
            if job.check():
                self._done(job)
                continue
            if job.cancel:
                job.cancel()
                job.cancel = None
            await self._attempt(job)

    def check_all(self) -> None:
        """Bestätigungen sofort prüfen (z. B. bei TRV-Zustandsänderung)."""
        for job in list(self.jobs.values()):
            if job.check():
                self._done(job)

    # ------------------------------------------------------------ intern
    async def _attempt(self, job: SyncJob) -> None:
        job.attempts += 1
        if self._available():
            try:
                await job.send()
                _LOGGER.debug("Sende %s (Versuch %s)", job.description, job.attempts)
            except Exception as err:  # noqa: BLE001 – Gerät/Netz kann alles werfen
                _LOGGER.warning(
                    "Senden von %s fehlgeschlagen (Versuch %s): %s",
                    job.description,
                    job.attempts,
                    err,
                )
        else:
            _LOGGER.debug("%s: Gerät nicht erreichbar, warte", job.description)
        delay = retry_delay(
            job.attempts, self.verify_delay, self.max_retries, self.slow_interval
        )
        job.cancel = self._schedule(delay, lambda: self._verify(job))
        self._changed()

    def _verify(self, job: SyncJob) -> None:
        job.cancel = None
        if self.jobs.get(job.key) is not job:
            return  # inzwischen ersetzt
        if job.check():
            self._done(job)
            return
        if job.attempts == self.max_retries:
            _LOGGER.warning(
                "%s nach %s Versuchen nicht bestätigt", job.description, job.attempts
            )
            self._event("failed", job)
            if not self.failed_notified:
                self.failed_notified = True
                self._on_failed(job)
        self._run_task(self._attempt(job))

    def _done(self, job: SyncJob) -> None:
        self._drop(job.key)
        _LOGGER.debug("%s bestätigt", job.description)
        if job.attempts > 1:
            self._event("confirmed", job)
        if not self.jobs and self.failed_notified:
            self.failed_notified = False
            self._on_recovered()
        self._changed()

    def _drop(self, key: str) -> None:
        job = self.jobs.pop(key, None)
        if job and job.cancel:
            job.cancel()
            job.cancel = None

    def _changed(self) -> None:
        self._on_change()

    def _event(self, event: str, job: SyncJob) -> None:
        try:
            self._on_event(event, job)
        except Exception:
            _LOGGER.exception("Protokoll für %s fehlgeschlagen", job.description)
