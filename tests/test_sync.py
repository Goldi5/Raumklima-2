"""Tests für Senden -> Prüfen -> Wiederholen (simulierte Uhr)."""

import asyncio

from rk.sync import SyncManager


class FakeClock:
    """Ersetzt async_call_later: Zeit wird manuell vorgespult."""

    def __init__(self) -> None:
        self.now = 0.0
        self.timers: list[list] = []  # [zeit, aktion, aktiv]

    def schedule(self, delay, action):
        timer = [self.now + delay, action, True]
        self.timers.append(timer)

        def cancel() -> None:
            timer[2] = False

        return cancel

    async def advance(self, seconds: float) -> None:
        end = self.now + seconds
        while True:
            due = sorted(
                (t for t in self.timers if t[2] and t[0] <= end), key=lambda t: t[0]
            )
            if not due:
                break
            timer = due[0]
            timer[2] = False
            self.now = timer[0]
            timer[1]()
            await asyncio.sleep(0)
            await asyncio.sleep(0)
        self.now = end


class FakeDevice:
    """TRV, das Befehle verliert, solange die Verbindung weg ist."""

    def __init__(self) -> None:
        self.value = 0.0
        self.connected = True
        self.sent: list[float] = []

    def sender(self, value: float):
        async def send() -> None:
            self.sent.append(value)
            if self.connected:
                self.value = value

        return send


def make(clock: FakeClock, device: FakeDevice, events: list[str]) -> SyncManager:
    loop = asyncio.get_running_loop()
    return SyncManager(
        schedule=clock.schedule,
        run_task=loop.create_task,
        is_target_available=lambda: True,
        verify_delay=20,
        max_retries=3,
        slow_interval=300,
        on_failed=lambda job: events.append("failed"),
        on_recovered=lambda: events.append("recovered"),
    )


async def test_confirmed_on_first_try() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    await sync.request("sp", "Sollwert", dev.sender(21.0), lambda: dev.value == 21.0)
    assert sync.state == "pending"
    await clock.advance(20)
    assert sync.state == "ok"
    assert dev.sent == [21.0]


async def test_lost_command_is_repeated_after_vpn_drop() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False  # 10 s Abbruch
    await sync.request("sp", "Sollwert", dev.sender(21.0), lambda: dev.value == 21.0)
    await clock.advance(10)
    dev.connected = True
    await clock.advance(10)  # Prüfung bei 20 s -> fehlt -> erneut senden
    assert dev.sent == [21.0, 21.0]
    await clock.advance(40)  # Prüfung Versuch 2
    assert sync.state == "ok"
    assert events == []


async def test_newer_request_replaces_older() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False
    await sync.request("mode", "aus", dev.sender(1.0), lambda: dev.value == 1.0)
    await sync.request("mode", "an", dev.sender(2.0), lambda: dev.value == 2.0)
    dev.connected = True
    await clock.advance(25)
    await clock.advance(60)
    assert dev.value == 2.0  # veralteter Befehl "aus" wurde nie wiederholt
    assert dev.sent.count(1.0) == 1
    assert sync.state == "ok"


async def test_failure_notifies_then_recovers() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False
    await sync.request("sp", "Sollwert", dev.sender(21.0), lambda: dev.value == 21.0)
    await clock.advance(20 + 40 + 60)  # 3 Versuche
    assert events == ["failed"]
    assert sync.state == "failed"
    dev.connected = True
    await clock.advance(300)  # langsamer Takt
    await clock.advance(300)
    assert sync.state == "ok"
    assert events == ["failed", "recovered"]


async def test_no_send_when_already_correct() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.value = 21.0
    await sync.request("sp", "Sollwert", dev.sender(21.0), lambda: dev.value == 21.0)
    assert dev.sent == []
    assert sync.state == "ok"


async def test_retry_all_now_after_reconnect() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False
    await sync.request("sp", "Sollwert", dev.sender(21.0), lambda: dev.value == 21.0)
    dev.connected = True
    await sync.retry_all_now()  # TRV wieder "available"
    assert dev.value == 21.0
    sync.check_all()
    assert sync.state == "ok"

