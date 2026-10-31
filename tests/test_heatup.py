from datetime import datetime, timedelta

from rk.heatup import HeatupTracker

T0 = datetime(2026, 11, 2, 6, 0)


def _run(tr, start, target, rate_kh, outdoor):
    t, temp = T0, start
    ep = None
    for m in range(0, 400):
        ep = tr.update(t + timedelta(minutes=m), temp, target, True, outdoor) or ep
        temp = min(target, start + rate_kh * m / 60)
        if ep:
            return ep
    return ep


def test_episode_and_rate():
    tr = HeatupTracker()
    ep = _run(tr, 18.0, 20.5, 2.0, 5.0)
    assert ep and 1.8 <= ep.rate <= 2.2 and ep.outdoor == 5.0
    assert tr.rate(5.0) is None  # erst ab 3 Episoden
    _run(tr, 18.0, 20.5, 2.0, 5.0)
    _run(tr, 18.0, 20.5, 2.0, 5.0)
    assert 1.8 <= tr.rate(5.0) <= 2.2
    assert 70 <= tr.minutes_needed(2.5, 5.0) <= 85


def test_regression_by_outdoor():
    tr = HeatupTracker()
    for out, r in [(0, 1.0), (2, 1.3), (5, 1.8), (8, 2.2), (10, 2.6), (12, 3.0)]:
        _run(tr, 18.0, 20.5, r, out)
    assert tr.rate(0.0) < tr.rate(10.0)


def test_interruptions():
    tr = HeatupTracker()
    assert tr.update(T0, 18.0, 20.5, True, 5) is None and tr.active
    tr.update(T0 + timedelta(minutes=5), 18.3, 20.5, False, 5)  # Fenster → abgebrochen
    assert not tr.active
    tr.update(T0, 20.0, 20.5, True, 5)  # nur 0,5 K unter Ziel → keine Episode
    assert not tr.active
