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


def make(clock: FakeClock, device: FakeDevice, events: list[str], available: bool = True) -> SyncManager:
    loop = asyncio.get_running_loop()
    return SyncManager(
        schedule=clock.schedule,
        run_task=loop.create_task,
        is_target_available=lambda: available,
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



def test_geduld_richtet_sich_nach_dem_geraet() -> None:
    """Langsame Geräte (FRITZ!DECT: alle 15 min) dürfen nicht als stumm gelten (Issue #16)."""
    from custom_components.raumklima.sync import SLOW_RETRY_CAP, SyncManager

    def make(interval):
        return SyncManager(
            schedule=lambda delay, action: (lambda: None),
            run_task=lambda coro: None,
            is_target_available=lambda: True,
            verify_delay=20,
            device_interval=lambda: interval,
        )

    assert make(None)._base_delay() == 20
    assert make(30)._base_delay() == 20  # normales Gerät: wie eingestellt
    assert make(900)._base_delay() == 1350  # 1,5 × Meldeabstand
    assert make(5000)._base_delay() == SLOW_RETRY_CAP


async def test_nicht_erreichbar_verbraucht_kein_versuchsbudget() -> None:
    """Issue #37: Ein Gerät, das beim Start schweigt, ist kein Fehlversuch.

    Vorher zählte jeder Durchlauf als Versuch, auch wenn nichts gesendet wurde – nach fünf
    Runden kam „nach 5 Versuchen nicht bestätigt" samt dringender Meldung, obwohl kein einziger
    Befehl das Gerät erreicht hatte.
    """
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events, available=False)
    await sync.request("mode", "Minimaltemperatur 5,0 °C", dev.sender(5.0), lambda: dev.value == 5.0)

    await clock.advance(20 + 40 + 60)
    job = sync.jobs["mode"]
    assert job.attempts == 0, "nichts gesendet → kein Versuch"
    assert job.sent == 0
    assert job.waits >= 2
    assert dev.sent == []
    assert events == [], "kein Fehler, solange das Gerät nur schweigt"

    # Kommt das Gerät zurück, wird normal gesendet und bestätigt.
    sync._available = lambda: True
    dev.connected = True
    await clock.advance(300)
    await clock.advance(60)
    assert job.attempts >= 1
    assert sync.state == "ok"


async def test_dauerhaft_stumm_fuehrt_doch_zum_fehler() -> None:
    """Ganz ohne Meldung darf der Auftrag nicht ewig offen bleiben."""
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events, available=False)
    await sync.request("mode", "Minimaltemperatur 5,0 °C", dev.sender(5.0), lambda: dev.value == 5.0)
    await clock.advance(600 * 40)
    assert events == ["failed"]
    assert sync.jobs["mode"].sent == 0


async def test_gleicher_auftrag_setzt_versuche_nicht_zurueck() -> None:
    """Flur mit Livisi: Der Regeltakt forderte alle paar Minuten denselben Sollwert an.

    Jede Anforderung begann wieder bei Versuch 1 – der Auftrag galt nie als gescheitert,
    der Status blieb „pending“ und das Gerät bekam 95-mal denselben Befehl.
    """
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False  # Gerät übernimmt den Wert nicht
    for _ in range(10):  # Regeltakt alle 5 min
        await sync.request("sp", "Sollwert 20,0 °C", dev.sender(20.0), lambda: dev.value == 20.0)
        await clock.advance(300)
    assert events == ["failed"]
    assert sync.state == "failed"
    # 3 schnelle Versuche, danach nur noch im langsamen Takt (300 s) – nicht je Regeltakt neu
    assert len(dev.sent) <= 3 + 10
    assert sync.jobs["sp"].attempts > 3

    dev.connected = True
    await clock.advance(300)
    await clock.advance(300)
    assert sync.state == "ok"
    assert events == ["failed", "recovered"]


async def test_gleicher_auftrag_bestaetigt_sofort_wenn_schon_richtig() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False
    await sync.request("sp", "Sollwert 20,0 °C", dev.sender(20.0), lambda: dev.value == 20.0)
    dev.value = 20.0  # von Hand eingestellt
    await sync.request("sp", "Sollwert 20,0 °C", dev.sender(20.0), lambda: dev.value == 20.0)
    assert sync.state == "ok"
    assert dev.sent == [20.0]


async def test_anderer_wert_ersetzt_weiterhin() -> None:
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events)
    dev.connected = False
    await sync.request("sp", "Sollwert 20,0 °C", dev.sender(20.0), lambda: dev.value == 20.0)
    await clock.advance(60)
    before = len(dev.sent)
    await sync.request("sp", "Sollwert 18,0 °C", dev.sender(18.0), lambda: dev.value == 18.0)
    assert sync.jobs["sp"].attempts == 1
    dev.connected = True
    await clock.advance(20 + 40)  # Prüfung → erneut senden → Prüfung
    assert sync.state == "ok"
    assert dev.value == 18.0
    assert 20.0 not in dev.sent[before:], "der alte Wert wird nicht mehr wiederholt"


async def test_stumm_gescheitert_fragt_weiter_nach() -> None:
    """Nach „dauerhaft stumm“ läuft die Kette im langsamen Takt weiter."""
    clock, dev, events = FakeClock(), FakeDevice(), []
    sync = make(clock, dev, events, available=False)
    await sync.request("mode", "Minimaltemperatur 5,0 °C", dev.sender(5.0), lambda: dev.value == 5.0)
    await clock.advance(600 * 40)
    assert events == ["failed"]
    sync._available = lambda: True
    dev.connected = True
    await clock.advance(600)
    await clock.advance(600)
    assert sync.state == "ok"
