# Fehlerbehebung

**Der Raum heizt nicht, obwohl es kalt ist.**
Status-Sensor ansehen. *Heizpause*: draußen ist es mild – mit **Heute heizen** oder Betriebsart **Immer heizen** übersteuern. *Abgesenkt*: niemand gilt als zu Hause – Bewohner und Zone prüfen oder hochdrehen (setzt 3 h aus). *Fenster offen*: Kontakt prüfen.

**Das Ventil steht dauerhaft offen (TRV602Z).**
Preset „on“ heißt beim TRV602Z *Ventil offen*. Raumklima nutzt automatisch „eco“. Unter *Geräte & Technik ändern* → Raum → *Erweitert* → *Einschalten mit* sollte „Automatisch“ oder „eco“ stehen.

**Abwesenheit erkennt mich falsch, z. B. durch ein VPN.**
Raumklima ignoriert unmögliche Sprünge und ungenaue Ortungen und zählt jede Person als da, solange **eins** ihrer Handys in der Zone ist. Prüfe im Attribut `persons` von *Anwesenheit*, was ankommt. Für Besuch gibt es den Schalter **Gäste da**.

**„Thermostat reagiert nicht“.**
Das TRV hat einen Befehl nicht bestätigt (Funk, VPN, leere Batterie). Raumklima versucht es weiter alle 5 Minuten. Zigbee-Verbindung und Batterie prüfen.

**Die Karten sehen alt aus.**
Seite neu laden. In der App: Einstellungen → Companion App → *Frontend-Cache zurücksetzen*.

**Die Einstellungsseite lässt sich nicht bearbeiten.**
Ändern dürfen nur Administratoren. Andere Benutzer sehen „Nur Ansicht“.

**Diagnose für einen Fehlerbericht.**
Einstellungen → Geräte & Dienste → Raumklima → Raum oder Allgemein → ⋮ → *Diagnose herunterladen*. Dann ein Issue auf GitHub eröffnen.
