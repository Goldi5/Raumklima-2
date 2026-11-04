"""Tests: Hinweise nur an Empfänger, die zu Hause sind."""

from rk.notify_filter import keep_present, person_for, slug

PERSONS = {
    "person.christian": {"name": "Christian", "present": False},
    "person.antje": {"name": "Antje", "present": True},
}


def test_slug_normalisiert_namen() -> None:
    assert slug("Christian Müller") == "christian_mueller"
    assert slug("notify.christian") == "notify_christian"
    assert slug("iphone_von_christian_17") == "iphone_von_christian_17"


def test_person_zuordnung() -> None:
    assert person_for("notify.christian", PERSONS) == "person.christian"
    assert person_for("notify.mobile_app_christian", PERSONS) == "person.christian"
    assert person_for("notify.alexa_media_wohnzimmer", PERSONS) is None


def test_abwesende_person_wird_uebersprungen() -> None:
    kept = keep_present(["notify.christian", "notify.antje"], PERSONS, True)
    assert kept == ["notify.antje"]


def test_unbekannte_empfaenger_bleiben() -> None:
    """Gruppen, E-Mail oder Fremddienste sollen nicht stillschweigend verschwinden."""
    kept = keep_present(["notify.familie", "notify.christian"], PERSONS, True)
    assert kept == ["notify.familie"]


def test_ausgeschaltet_bleibt_alles() -> None:
    assert keep_present(["notify.christian", "notify.antje"], PERSONS, False) == [
        "notify.christian",
        "notify.antje",
    ]


def test_ohne_personendaten_keine_filterung() -> None:
    assert keep_present(["notify.christian"], {}, True) == ["notify.christian"]
