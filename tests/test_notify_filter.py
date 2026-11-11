"""Tests: Hinweise nur an Empfänger, die zu Hause sind."""

from rk.notify_filter import keep_present, person_for, slug

PERSONS = {
    "person.a": {"name": "Person A", "present": False},
    "person.alex": {"name": "Alex", "present": True},
}


def test_slug_normalisiert_namen() -> None:
    assert slug("Person A") == "person_a"
    assert slug("notify.a") == "notify_a"
    assert slug("iphone_von_person_a_17") == "iphone_von_person_a_17"


def test_person_zuordnung() -> None:
    assert person_for("notify.a", PERSONS) == "person.a"
    assert person_for("notify.mobile_app_a", PERSONS) == "person.a"
    assert person_for("notify.alexa_media_wohnzimmer", PERSONS) is None


def test_abwesende_person_wird_uebersprungen() -> None:
    kept = keep_present(["notify.a", "notify.b"], PERSONS, True)
    assert kept == ["notify.b"]


def test_unbekannte_empfaenger_bleiben() -> None:
    """Gruppen, E-Mail oder Fremddienste sollen nicht stillschweigend verschwinden."""
    kept = keep_present(["notify.familie", "notify.a"], PERSONS, True)
    assert kept == ["notify.familie"]


def test_ausgeschaltet_bleibt_alles() -> None:
    assert keep_present(["notify.a", "notify.b"], PERSONS, False) == [
        "notify.a",
        "notify.b",
    ]


def test_ohne_personendaten_keine_filterung() -> None:
    assert keep_present(["notify.a"], {}, True) == ["notify.a"]
