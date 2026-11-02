// Erklärungen hinter dem „?“ in der Einstellungskarte. Schlüssel = deutsche Beschriftung der Zeile.
// [Deutsch, Englisch, Französisch] – kurz, verständlich, ohne Fachchinesisch.
export const HELP = {
  "Wer wohnt hier?": [
    "Die Personen, deren Handys zählen. Ist keine davon in der Wohnungs-Zone, gilt die Wohnung nach der Wartezeit als leer und Raumklima senkt ab. Personen legst du in Home Assistant unter Einstellungen → Personen an und verknüpfst dort das Handy (Home-Assistant-App).",
    "The people whose phones count. If none of them is in the home zone, the home counts as empty after the waiting time and Raumklima lowers the temperature. People are created in Home Assistant under Settings → People, where you also link their phone (Home Assistant app).",
    "Les personnes dont les téléphones comptent. Si aucune n’est dans la zone du logement, celui-ci est considéré comme vide après le délai d’attente et Raumklima abaisse la température. Les personnes se créent dans Home Assistant sous Paramètres → Personnes, où l’on associe aussi le téléphone (application Home Assistant).",
  ],
  "Wohnung (Zone)": [
    "Der Bereich auf der Karte, der als „zu Hause“ gilt. Meist „Home“; bei mehreren Wohnungen je Wohnung eine eigene Zone (Einstellungen → Bereiche & Zonen).",
    "The area on the map that counts as “home”. Usually “Home”; with several homes, one zone per home (Settings → Areas & zones).",
    "La zone sur la carte qui compte comme « à la maison ». Le plus souvent « Home » ; avec plusieurs logements, une zone par logement (Paramètres → Pièces & zones).",
  ],
  "Absenken nach": [
    "So lange muss die Wohnung leer sein, bevor abgesenkt wird – damit kurz Brötchen holen nichts auslöst. 30 Minuten sind ein guter Wert.",
    "How long the home must be empty before lowering – so that popping out for bread doesn't trigger anything. 30 minutes is a good value.",
    "Durée pendant laquelle le logement doit être vide avant d’abaisser – pour qu’aller chercher du pain ne déclenche rien. 30 minutes est une bonne valeur.",
  ],
  "„Länger weg“ ab": [
    "Nach so vielen Stunden ohne jemanden wird von „kurz weg“ auf „länger weg“ umgeschaltet – dann wird tiefer abgesenkt (z. B. über Nacht weg oder auf Reisen).",
    "After this many hours without anyone home, “briefly away” switches to “away longer” and the temperature is lowered further (e.g. away overnight or travelling).",
    "Après autant d’heures sans personne, on passe de « brève absence » à « absent longtemps » – l’abaissement est alors plus fort (p. ex. absent la nuit ou en voyage).",
  ],
  "Vorheizen ab": [
    "Kommt jemand näher als diese Entfernung, wird schon vorgeheizt, damit es bei der Ankunft warm ist. Zusätzlich heizt Raumklima nach der gelernten Aufheizzeit vor. 0 schaltet das Vorheizen nach Entfernung aus.",
    "When someone gets closer than this distance, heating starts early so it is warm on arrival. Raumklima also preheats based on the learned heat-up time. 0 turns distance-based preheating off.",
    "Quand quelqu’un s’approche à moins de cette distance, le préchauffage commence pour qu’il fasse chaud à l’arrivée. Raumklima préchauffe aussi selon le temps de montée en température appris. 0 désactive le préchauffage par la distance.",
  ],
  "Präsenzmelder zählen": [
    "Sieht ein Präsenzmelder in einem Raum jemanden, gilt die Wohnung als bewohnt – auch wenn alle Handys weg sind (Besuch, Kinder ohne Handy). „Nur mmWave“ ist der sichere Standard, weil Bewegungsmelder (PIR) auch auf Haustiere reagieren. Im Urlaub zählen Melder nie.",
    "If a presence sensor sees someone in a room, the home counts as occupied – even when all phones are away (visitors, children without a phone). “mmWave only” is the safe default because motion sensors (PIR) also react to pets. During vacation sensors never count.",
    "Si un détecteur de présence voit quelqu’un dans une pièce, le logement est considéré comme occupé – même si tous les téléphones sont partis (invités, enfants sans téléphone). « mmWave uniquement » est le réglage sûr par défaut, car les détecteurs de mouvement (PIR) réagissent aussi aux animaux. En vacances, les détecteurs ne comptent jamais.",
  ],
  "Urlaub": [
    "Senkt sofort tief ab („länger weg“), egal wo die Handys sind. Endet automatisch, sobald jemand nach Hause kommt.",
    "Lowers the temperature right away (“away longer”), no matter where the phones are. Ends automatically as soon as someone comes home.",
    "Abaisse fortement tout de suite (« absent longtemps »), où que soient les téléphones. Se termine automatiquement dès que quelqu’un rentre.",
  ],
  "Gäste da": [
    "Solange an, wird nicht abgesenkt – auch wenn alle Bewohner weg sind. Praktisch, wenn Besuch ohne Handy in Home Assistant da ist.",
    "While on, nothing is lowered – even if all residents are away. Handy when visitors without a phone in Home Assistant are staying.",
    "Tant qu’il est activé, rien n’est abaissé – même si tous les habitants sont partis. Pratique quand des invités sans téléphone dans Home Assistant sont présents.",
  ],
  "Kalender": [
    "Ein Kalender aus Home Assistant. Läuft gerade ein Termin mit einem der Urlaubs-Wörter im Titel, wirkt er wie der Urlaubsschalter; mit einem der Zuhause-Wörter wie „Gäste da“.",
    "A calendar from Home Assistant. If an event with one of the vacation words in its title is running, it acts like the vacation switch; with one of the at-home words like “guests”.",
    "Un calendrier de Home Assistant. Si un événement contenant l’un des mots « vacances » est en cours, il agit comme l’interrupteur Vacances ; avec l’un des mots « à la maison », comme « Invités présents ».",
  ],
  "… wie Urlaub": [
    "Wörter im Termintitel, die „verreist“ bedeuten, durch Komma getrennt. Groß-/Kleinschreibung egal.",
    "Words in the event title that mean “travelling”, separated by commas. Case doesn't matter.",
    "Mots du titre d’un événement qui signifient « en voyage », séparés par des virgules. Majuscules/minuscules indifférentes.",
  ],
  "… jemand bleibt zu Hause": [
    "Wörter im Termintitel, bei denen nicht abgesenkt werden soll, z. B. Homeoffice – auch wenn das Handy kurz woanders ist.",
    "Words in the event title for which nothing should be lowered, e.g. home office – even if the phone is briefly elsewhere.",
    "Mots du titre d’un événement pour lesquels il ne faut pas abaisser, p. ex. télétravail – même si le téléphone est brièvement ailleurs.",
  ],
  "Betriebsart": [
    "Automatisch: geheizt wird nur, wenn es draußen kalt genug ist (Heizgrenze, Heizsaison, Kälteeinbruch). Immer heizen: ganzjährig. Heizpause: nie – außer ein Raum fällt unter die Sicherung.",
    "Automatic: heating only when it is cold enough outside (heating limit, season, cold snap). Always heat: all year. Heating pause: never – unless a room drops below the safety minimum.",
    "Automatique : chauffe seulement quand il fait assez froid dehors (seuil de chauffage, saison, vague de froid). Toujours chauffer : toute l’année. Chauffage en pause : jamais – sauf si une pièce descend sous le minimum de sécurité.",
  ],
  "Heizgrenze": [
    "Liegt das Tagesmittel draußen (gemessen + Vorhersage) über diesem Wert, braucht das Haus keine Heizung – Raumklima macht Pause. 15 °C passt für die meisten Häuser; gut gedämmt eher 12–14 °C.",
    "If the daily mean outside (measured + forecast) is above this value, the building needs no heating and Raumklima pauses. 15 °C suits most homes; well insulated rather 12–14 °C.",
    "Si la moyenne journalière extérieure (mesurée + prévue) dépasse cette valeur, la maison n’a pas besoin de chauffage – Raumklima fait une pause. 15 °C convient à la plupart des maisons ; bien isolée plutôt 12–14 °C.",
  ],
  "Heizsaison": [
    "Der Zeitraum, in dem normalerweise geheizt wird (Monat-Tag). Außerhalb wird nur bei einem Kälteeinbruch geheizt. Am Tag nach dem Ende kommt auch der Saisonbericht.",
    "The period in which you normally heat (month-day). Outside of it, heating only runs during a cold snap. The day after it ends, the season report is created.",
    "Période où l’on chauffe normalement (mois-jour). En dehors, on ne chauffe qu’en cas de vague de froid. Le lendemain de la fin arrive aussi le rapport de saison.",
  ],
  "Kälteeinbruch unter": [
    "Ist es außerhalb der Heizsaison 3 Tage lang kälter als dieser Wert, wird trotzdem geheizt – z. B. bei einem kalten Mai.",
    "If it is colder than this for 3 days outside the heating season, heating runs anyway – e.g. in a cold May.",
    "S’il fait plus froid que cette valeur pendant 3 jours hors saison, on chauffe quand même – p. ex. lors d’un mois de mai froid.",
  ],
  "Sicherung": [
    "Fällt ein Raum während der Heizpause unter diese Temperatur, heizt er trotzdem – Schutz vor Auskühlen und Schimmel.",
    "If a room drops below this temperature during the heating pause, it heats anyway – protection against cooling down and mould.",
    "Si une pièce descend sous cette température pendant la pause de chauffage, elle chauffe quand même – protection contre le refroidissement et les moisissures.",
  ],
  "Frostnacht: weniger absenken": [
    "Sagt die Vorhersage −5 °C oder kälter, wird bei Abwesenheit nur halb so tief abgesenkt. So kühlen die Wände nicht zu stark aus und der Raum ist schneller wieder warm.",
    "If the forecast says −5 °C or colder, setback during absence is only half as deep. Walls don't cool down too much and the room warms up faster.",
    "Si la prévision annonce −5 °C ou moins, l’abaissement en cas d’absence est réduit de moitié. Les murs refroidissent moins et la pièce se réchauffe plus vite.",
  ],
  "Sommerpflege Ventile": [
    "Im Sommer öffnet Raumklima mittwochs um 11 Uhr die Ventile kurz ganz, damit sie nicht festsitzen.",
    "In summer Raumklima briefly opens the valves fully on Wednesdays at 11:00 so they don't get stuck.",
    "En été, Raumklima ouvre brièvement les vannes en grand le mercredi à 11 h pour qu’elles ne se grippent pas.",
  ],
  "Heute heizen": [
    "Für milde, aber kühle Tage: heizt 24 Stunden lang, auch wenn die Heizgrenze eigentlich eine Pause vorsieht.",
    "For mild but chilly days: heats for 24 hours even though the heating limit would normally pause.",
    "Pour les jours doux mais frais : chauffe pendant 24 heures, même si le seuil de chauffage prévoit une pause.",
  ],
  "Zeiten lernen": [
    "Raumklima merkt sich, wann ihr ins Bett geht und aufsteht (Nachtlüften, Licht aus/an) und passt Ruhezeit und Nachtlüften daran an – verlängert sie nur, verkürzt sie nie.",
    "Raumklima learns when you go to bed and get up (night airing, lights off/on) and adjusts quiet hours and night airing – it only extends them, never shortens.",
    "Raumklima retient quand vous allez au lit et vous levez (aération nocturne, lumières éteintes/allumées) et adapte les heures calmes et l’aération nocturne – il les prolonge seulement, ne les raccourcit jamais.",
  ],
  "Feiertage": [
    "Dein Bundesland: Die Nacht vor einem Feiertag gilt dann wie Wochenende (längere Ruhezeit am Morgen).",
    "Your German state: the night before a public holiday then counts like a weekend (longer quiet hours in the morning).",
    "Votre Land (Allemagne) : la nuit précédant un jour férié compte alors comme un week-end (heures calmes plus longues le matin).",
  ],
  "Schlaf-Signale": [
    "Lampen oder Schalter, an denen Raumklima den Schlaf erkennt: abends alle aus = ins Bett, morgens eins an = aufgestanden.",
    "Lights or switches Raumklima uses to detect sleep: all off in the evening = bedtime, one on in the morning = up.",
    "Lampes ou interrupteurs qui permettent à Raumklima de reconnaître le sommeil : tout éteint le soir = coucher, un allumé le matin = levé.",
  ],
  "Name der Wohnung": [
    "Erscheint im Umschalter oben im Dashboard und in Nachrichten – wichtig, wenn du mehrere Wohnungen hast.",
    "Shown in the switcher at the top of the dashboard and in messages – important if you have several homes.",
    "Apparaît dans le sélecteur en haut du tableau de bord et dans les messages – important si vous avez plusieurs logements.",
  ],
  "Dashboard": [
    "Pfad des Raumklima-Dashboards dieser Wohnung. Antippen einer Live-Aktivität oder eines Berichts öffnet diese Seite.",
    "Path of this home's Raumklima dashboard. Tapping a live activity or a report opens this page.",
    "Chemin du tableau de bord Raumklima de ce logement. Toucher une activité en direct ou un rapport ouvre cette page.",
  ],
  "Bauart": [
    "Wie gut die Außenwände dämmen. Daraus berechnet der Schimmelschutz, wie kalt die kälteste Wandstelle wird – bei einem unsanierten Altbau wird deshalb weniger abgesenkt.",
    "How well the outer walls insulate. Mould protection uses this to calculate how cold the coldest spot on the wall gets – an unrenovated old building is lowered less.",
    "Qualité d’isolation des murs extérieurs. La protection contre les moisissures en déduit la température du point le plus froid du mur – dans un ancien bâtiment non rénové, l’abaissement est donc plus faible.",
  ],
  "Heizkosten pro Jahr": [
    "Optional: deine Heizkosten pro Jahr laut Abrechnung. Nur für den PDF-Bericht – er rechnet die Ersparnis grob in Euro um und zeigt, was 1 °C weniger im Jahr bringt. Leer lassen = keine Euro-Angaben.",
    "Optional: your yearly heating costs from your bill. Only for the PDF report – it roughly converts savings into euros and shows what 1 °C less saves per year. Leave empty = no euro figures.",
    "Facultatif : vos coûts de chauffage annuels d’après la facture. Uniquement pour le rapport PDF – il convertit grossièrement l’économie en euros et montre ce que rapporte 1 °C de moins par an. Laisser vide = pas de montants en euros.",
  ],
  "Ruhezeit": [
    "In dieser Zeit kommen Nachrichten leise an und es gibt keine Sprachansagen. Nur Dringendes ist laut: Raum kühlt aus, Fenster offen während niemand da ist, Thermostat reagiert nicht.",
    "During this time messages arrive silently and there are no voice announcements. Only urgent ones are loud: room cooling down, window open while nobody is home, thermostat not responding.",
    "Pendant cette période, les messages arrivent en silence et il n’y a pas d’annonces vocales. Seules les urgences sont sonores : pièce qui se refroidit, fenêtre ouverte en l’absence de tous, thermostat qui ne répond pas.",
  ],
  "Wochenende bis": [
    "Am Wochenende endet die Ruhezeit erst zu dieser Uhrzeit – zum Ausschlafen.",
    "On weekends quiet hours end only at this time – for sleeping in.",
    "Le week-end, les heures calmes ne se terminent qu’à cette heure – pour faire la grasse matinée.",
  ],
  "Nachtlüften": [
    "Wird ein Schlafzimmerfenster in diesem Zeitfenster geöffnet, gilt es als „Schlafen bei offenem Fenster“: keine Lüft-Hinweise, die Heizung wartet bis zum Schließen, morgens ein Gruß.",
    "If a bedroom window is opened in this time window, it counts as “sleeping with the window open”: no airing notices, heating waits until it is closed, a good-morning message.",
    "Si une fenêtre de chambre est ouverte pendant cette plage, cela compte comme « dormir fenêtre ouverte » : pas de rappels d’aération, le chauffage attend la fermeture, un bonjour le matin.",
  ],
  "… leise warnen unter": [
    "Wird es beim Schlafen mit offenem Fenster kälter als dieser Wert, kommt einmal pro Nacht eine leise Warnung.",
    "If it gets colder than this while sleeping with the window open, a quiet warning is sent once per night.",
    "S’il fait plus froid que cette valeur en dormant fenêtre ouverte, une alerte discrète est envoyée une fois par nuit.",
  ],
  "Erinnern alle": [
    "Besteht ein Problem weiter (z. B. Fenster offen, Raum kühlt aus), erinnert Raumklima in diesem Abstand – höchstens einige Male.",
    "If a problem persists (e.g. window open, room cooling down), Raumklima reminds you at this interval – only a few times.",
    "Si un problème persiste (p. ex. fenêtre ouverte, pièce qui se refroidit), Raumklima rappelle à cet intervalle – quelques fois au maximum.",
  ],
  "Wetterquelle": [
    "Woher die Außentemperatur und die Vorhersage kommen. Am besten ein Wetterdienst mit Vorhersage, z. B. weather.forecast_home – nötig für Heizgrenze, Lüftdauer, Sonnenseite und Frostnacht.",
    "Where the outdoor temperature and forecast come from. Ideally a weather service with a forecast, e.g. weather.forecast_home – needed for heating limit, airing time, sunny side and frost nights.",
    "D’où viennent la température extérieure et la prévision. Idéalement un service météo avec prévision, p. ex. weather.forecast_home – nécessaire pour le seuil de chauffage, la durée d’aération, le côté ensoleillé et les nuits de gel.",
  ],
  "Fehler auch in der HA-Glocke": [
    "Reagiert ein Thermostat nicht, erscheint zusätzlich eine Meldung in der Glocke von Home Assistant.",
    "If a thermostat doesn't respond, an additional notification appears in Home Assistant's bell.",
    "Si un thermostat ne répond pas, une notification apparaît en plus dans la cloche de Home Assistant.",
  ],
  "PDF-Berichte": [
    "Welche Berichte automatisch als PDF entstehen: Woche (sonntags 18 Uhr), Monat (am 1.), Heizsaison (nach dem Saisonende). Sie kommen als Push an alle mit „Wochenbericht“ und stehen im Reiter Bericht zum Herunterladen.",
    "Which reports are created automatically as PDF: week (Sundays 18:00), month (on the 1st), heating season (after it ends). They are pushed to everyone with “weekly report” and listed in the Report tab for download.",
    "Quels rapports sont créés automatiquement en PDF : semaine (dimanche 18 h), mois (le 1er), saison de chauffage (après sa fin). Ils sont envoyés en push à tous ceux qui ont « Rapport hebdomadaire » et sont téléchargeables dans l’onglet Rapport.",
  ],
  "PDF per E-Mail": [
    "Schickt jeden PDF-Bericht zusätzlich als Mail-Anhang. Einmal darunter „E-Mail einrichten“ aufklappen: Anbieter wählen (füllt Server und Port aus), Benutzer, Passwort und Empfänger eintragen, „Zugang prüfen“ und dann „Speichern & Test-Mail senden“ – danach ist der Schalter an. Bei Gmail, iCloud und Outlook braucht es ein App-Passwort.",
    "Also sends every PDF report as an email attachment. Open “Set up email” below once: pick your provider (fills in server and port), enter user, password and recipients, “Check login”, then “Save & send test email” – the switch is then on. Gmail, iCloud and Outlook need an app password.",
    "Envoie en plus chaque rapport PDF en pièce jointe. Ouvrez une fois « Configurer l’e-mail » ci-dessous : choisissez le fournisseur (renseigne serveur et port), saisissez utilisateur, mot de passe et destinataires, « Vérifier l’accès » puis « Enregistrer & envoyer un e-mail de test » – l’interrupteur est alors activé. Gmail, iCloud et Outlook nécessitent un mot de passe d’application.",
  ],
  "Test": [
    "Erstellt jetzt einen Wochenbericht und schickt ihn an alle Empfänger und per E-Mail.",
    "Creates a weekly report now and sends it to all recipients and by email.",
    "Crée maintenant un rapport hebdomadaire et l’envoie à tous les destinataires et par e-mail.",
  ],
  "Wunschtemperatur": [
    "So warm soll der Raum sein, wenn jemand da ist. Gemessen wird mit dem Raumfühler, nicht am Heizkörper. Jedes Grad weniger spart etwa 6 % Heizenergie.",
    "How warm the room should be when someone is home. Measured with the room sensor, not at the radiator. Each degree less saves about 6 % heating energy.",
    "La température voulue dans la pièce quand quelqu’un est là. Mesurée avec la sonde de la pièce, pas au radiateur. Chaque degré de moins économise environ 6 % d’énergie de chauffage.",
  ],
  "Raumtyp": [
    "Setzt passende Standardwerte für Wunschtemperatur, Feuchtegrenze, Mindesttemperatur und Absenkung (Bad wärmer und feuchter, Schlafzimmer kühler). Beim Wechsel startet der Raum kurz neu.",
    "Sets suitable defaults for desired temperature, humidity limit, minimum temperature and setback (bathroom warmer and more humid, bedroom cooler). Changing it restarts the room briefly.",
    "Définit des valeurs par défaut adaptées pour la température souhaitée, le seuil d’humidité, la température minimale et l’abaissement (salle de bain plus chaude et plus humide, chambre plus fraîche). En cas de changement, la pièce redémarre brièvement.",
  ],
  "Wohnung": [
    "Zu welcher Wohnung der Raum gehört – bestimmt Bewohner, Zone, Empfänger und Bericht.",
    "Which home the room belongs to – determines residents, zone, recipients and report.",
    "Le logement auquel appartient la pièce – détermine habitants, zone, destinataires et rapport.",
  ],
  "Sonnenseite": [
    "Für Räume mit großen Süd- oder Westfenstern: Ist Sonne vorhergesagt und der Raum schon fast warm, heizt er 1 °C weniger – die Sonne erledigt den Rest.",
    "For rooms with large south or west windows: if sun is forecast and the room is almost warm, it heats 1 °C less – the sun does the rest.",
    "Pour les pièces avec de grandes fenêtres au sud ou à l’ouest : si le soleil est prévu et que la pièce est presque chaude, elle chauffe 1 °C de moins – le soleil fait le reste.",
  ],
  "Sonne kommt aus": [
    "Die Himmelsrichtung, in die die Fenster dieses Raums zeigen – also die Seite, auf der die meiste Glasfläche sitzt. Mit dieser Angabe zählt nur Sonne, die nach Sonnenstand (Azimut und Höhe) wirklich durchs Fenster kommt: ein Westzimmer reagiert erst nachmittags, ein Ostzimmer nur morgens. Die Etage spielt keine Rolle, der Sonnenstand ist in jeder Höhe gleich – unterschiedlich ist nur, was im Weg steht (Haus, Baum, Balkon, tiefes Gewände), und das ist bewusst nicht modelliert. Dachfenster passen nicht in dieses Schema: dort lieber leer lassen. Ohne Angabe zählt jede sonnige Stunde der Vorhersage.",
    "The compass direction the windows of this room face – the side with the most glass. With this value, only sun that really comes through the window counts, judged by the sun’s azimuth and elevation: a west room reacts in the afternoon, an east room only in the morning. The floor does not matter, the sun’s position is the same at any height – only what is in the way differs (building, tree, balcony, deep reveal), and that is deliberately not modelled. Roof windows do not fit this scheme: better leave it empty there. Without a value, every sunny hour in the forecast counts.",
    "L’orientation vers laquelle donnent les fenêtres de cette pièce – le côté avec le plus de vitrage. Avec cette valeur, seul le soleil qui entre vraiment par la fenêtre compte, d’après l’azimut et la hauteur du soleil : une pièce à l’ouest réagit l’après-midi, une pièce à l’est seulement le matin. L’étage n’a pas d’importance, la position du soleil est identique à toute hauteur – seule diffère la présence d’obstacles (bâtiment, arbre, balcon, ébrasement profond), volontairement non modélisée. Les fenêtres de toit ne correspondent pas à ce schéma : mieux vaut laisser vide. Sans valeur, chaque heure ensoleillée de la prévision compte.",
  ],
  "Schichtdienst": [
    "Lernt Bett- und Aufstehzeiten je Wochentag, nicht nur nach Werktag und Wochenende. Eingeschaltet werden auch Tagschlaf-Zeiten erkannt: ins Bett bis 09:00, aufstehen bis 17:00 – für Nachtschicht und Wechselschicht.",
    "Learns bedtime and getting-up times per weekday, not just weekday versus weekend. When on, daytime sleep is detected too: bedtime up to 09:00, getting up up to 17:00 – for night and rotating shifts.",
    "Apprend le coucher et le lever par jour de la semaine, pas seulement semaine et week-end. Activé, le sommeil de jour est aussi détecté : coucher jusqu’à 09:00, lever jusqu’à 17:00 – pour le travail de nuit et en équipes.",
  ],
  "Ruhezeit senkt ab": [
    "Während der Ruhezeit werden Schlafzimmer und selten genutzte Räume auf die Absenkung gebracht – auch wenn jemand zu Hause ist. So bleibt die Heizung aus, während nach der Nachtschicht geschlafen wird. Ein Zeitfenster und der Regler am Thermostat gehen vor.",
    "During quiet time, bedrooms and rarely used rooms are set back to the setback temperature – even when somebody is at home. So the heating stays off while you sleep after a night shift. A time window and the dial on the thermostat take precedence.",
    "Pendant l’heure de repos, les chambres et les pièces peu utilisées passent à la température d’abaissement – même si quelqu’un est à la maison. Le chauffage reste donc arrêté pendant le sommeil après une nuit de travail. Une plage horaire et le bouton du thermostat restent prioritaires.",
  ],
  "Standort der Wohnung": [
    "Die echten Koordinaten dieser Wohnung. Leer lassen ist der Normalfall: dann gilt der Standort von Home Assistant (steht unter dem Feld). Nur wenn die Wohnung woanders liegt als Home Assistant – zweite Wohnung, Ferienwohnung, mitüberwachtes Haus – hier die echten Koordinaten eintragen, daraus rechnet Raumklima den Sonnenstand. Der Knopf „von HA“ übernimmt die Home-Assistant-Werte sichtbar, damit du sie anpassen kannst; das ✕ leert die Felder wieder.",
    "The real coordinates of this home. Leaving it empty is the normal case: Home Assistant’s location applies (shown below the field). Only when the home sits elsewhere than Home Assistant – second home, holiday flat, a house you also monitor – enter the real coordinates here; Raumklima computes the sun’s position from them. The “from HA” button copies Home Assistant’s values so you can adjust them; ✕ clears the fields again.",
    "Les vraies coordonnées de ce logement. Laisser vide est le cas normal : l’emplacement de Home Assistant s’applique (indiqué sous le champ). Si le logement se trouve ailleurs que Home Assistant – second logement, résidence secondaire, maison également surveillée – indiquez ici les vraies coordonnées ; Raumklima en calcule la position du soleil. Le bouton « de HA » reprend les valeurs de Home Assistant pour les ajuster ; ✕ vide les champs.",
  ],
  "Zeitfenster": [
    "Ein eigenes Zeitfenster für diesen Raum: Wochentage (keine Auswahl = jeden Tag), von/bis und Zieltemperatur, auch über Mitternacht. Es setzt nur den Sollwert – Fenster, Frost, Schimmel und Abwesenheit bleiben vorrangig, und bei gelerntem Raum wird rechtzeitig vorgeheizt.",
    "A time window for this room: weekdays (none selected = every day), from/to and target temperature, also across midnight. It only sets the target – windows, frost, mould and absence stay in charge, and a room with a learned heat-up rate starts preheating in time.",
    "Une plage horaire pour cette pièce : jours de la semaine (aucun = tous les jours), de/à et température cible, aussi après minuit. Elle ne règle que la consigne – fenêtre, gel, moisissures et absence restent prioritaires, et une pièce dont la vitesse de chauffe est apprise préchauffe à temps.",
  ],
  "Absenkung „kurz weg“": [
    "Zieltemperatur, wenn alle kurz weg sind. Nie tiefer, als der Schimmelschutz erlaubt.",
    "Target temperature when everyone is briefly away. Never lower than mould protection allows.",
    "Température cible quand tout le monde est brièvement absent. Jamais plus bas que ce que permet la protection contre les moisissures.",
  ],
  "Absenkung „länger weg“": [
    "Zieltemperatur bei längerer Abwesenheit oder Urlaub. Feuchte Räume bleiben automatisch wärmer (Schimmelschutz).",
    "Target temperature during longer absence or vacation. Humid rooms automatically stay warmer (mould protection).",
    "Température cible en cas d’absence prolongée ou de vacances. Les pièces humides restent automatiquement plus chaudes (protection contre les moisissures).",
  ],
  "Aufheizen": [
    "Wie lange der Raum braucht, um 2 °C wärmer zu werden – Raumklima lernt das aus jedem Aufheizen und heizt danach rechtzeitig vor, bevor jemand ankommt.",
    "How long the room needs to get 2 °C warmer – Raumklima learns this from every heat-up and then preheats in time before someone arrives.",
    "Temps nécessaire à la pièce pour gagner 2 °C – Raumklima l’apprend à chaque montée en température et préchauffe ensuite à temps avant l’arrivée de quelqu’un.",
  ],
  "Feuchtegrenze": [
    "Ab dieser Luftfeuchte (15 Minuten lang) kommt „Bitte lüften“ – aber nur, wenn Lüften auch trocknet, die Luft draußen also trockener ist. Ändern über Geräte & Technik.",
    "From this humidity (for 15 minutes) you get “please air the room” – but only if airing actually dries, i.e. the outside air is drier. Change it under devices & technical settings.",
    "À partir de cette humidité (pendant 15 minutes) arrive « Merci d’aérer » – mais seulement si l’aération assèche vraiment, donc si l’air extérieur est plus sec. Se modifie dans Appareils & réglages techniques.",
  ],
  "Feuchtefühler": [
    "Sensor für die Luftfeuchte im Raum – nötig für Lüft-Hinweise und Schimmelschutz.",
    "Sensor for the room's humidity – needed for airing notices and mould protection.",
    "Capteur d’humidité de la pièce – nécessaire pour les rappels d’aération et la protection contre les moisissures.",
  ],
  "Mindesttemperatur beim Lüften": [
    "Fällt der Raum beim Lüften darunter, kommt „Raum kühlt aus – bitte schließen“.",
    "If the room drops below this while airing, you get “room cooling down – please close”.",
    "Si la pièce descend en dessous pendant l’aération, arrive « La pièce se refroidit – merci de fermer ».",
  ],
  "Max. Abkühlung beim Lüften": [
    "Kühlt der Raum beim Lüften um mehr als diesen Wert ab, kommt ebenfalls „bitte schließen“ – so kühlen die Wände nicht aus.",
    "If the room cools down by more than this while airing, you also get “please close” – so the walls don't cool down.",
    "Si la pièce se refroidit de plus que cette valeur pendant l’aération, arrive aussi « merci de fermer » – pour que les murs ne refroidissent pas.",
  ],
  "Jetzt": [
    "Aktuelle Feuchte und Taupunkt im Raum.",
    "Current humidity and dew point in the room.",
    "Humidité et point de rosée actuels dans la pièce.",
  ],
  "Empfohlene Lüftdauer": [
    "Wie lange stoßlüften reicht – je kälter es draußen ist, desto kürzer (im Winter oft nur 5 Minuten).",
    "How long airing wide open is enough – the colder it is outside, the shorter (often only 5 minutes in winter).",
    "Durée suffisante pour aérer en grand – plus il fait froid dehors, plus elle est courte (souvent 5 minutes en hiver).",
  ],
  "Heizung bei offenem Fenster pausieren": [
    "Ist ein Fenster offen, stoppt die Heizung; danach geht es mit der vorherigen Einstellung weiter. Schalte die eingebaute Fenstererkennung des Thermostats aus, damit sich beides nicht stört.",
    "When a window is open, heating stops; afterwards it continues with the previous setting. Turn off the thermostat's built-in window detection so the two don't interfere.",
    "Si une fenêtre est ouverte, le chauffage s’arrête ; ensuite il reprend avec le réglage précédent. Désactivez la détection de fenêtre intégrée au thermostat pour éviter les conflits.",
  ],
  "Pause nach": [
    "So lange muss das Fenster offen sein, bevor die Heizung pausiert – kurzes Öffnen löst nichts aus.",
    "How long the window must be open before heating pauses – briefly opening it doesn't trigger anything.",
    "Durée pendant laquelle la fenêtre doit être ouverte avant la pause du chauffage – une courte ouverture ne déclenche rien.",
  ],
  "Weiter nach": [
    "So lange muss das Fenster zu sein, bevor wieder geheizt wird.",
    "How long the window must be closed before heating resumes.",
    "Durée pendant laquelle la fenêtre doit être fermée avant que le chauffage reprenne.",
  ],
  "Schlafen bei offenem Fenster": [
    "Wird abends im Schlafzimmer gelüftet, gilt das als Nachtlüften: keine Lüft-Hinweise, die Heizung wartet, morgens ein Gruß. Automatisch = ja für Schlafzimmer und selten genutzte Räume.",
    "If the bedroom window is opened in the evening, it counts as night airing: no airing notices, heating waits, a good-morning message. Automatic = yes for bedrooms and rarely used rooms.",
    "Si l’on aère la chambre le soir, cela compte comme aération nocturne : pas de rappels d’aération, le chauffage attend, un bonjour le matin. Automatique = oui pour les chambres et les pièces peu utilisées.",
  ],
  "Kontakte": [
    "Die Fensterkontakte dieses Raums und ihr Zustand. Ändern über Geräte & Technik.",
    "This room's window contacts and their state. Change them under devices & technical settings.",
    "Les contacts de fenêtre de cette pièce et leur état. Se modifient dans Appareils & réglages techniques.",
  ],
  "Offenes Fenster an Temperatursturz erkennen": [
    "Ohne (funktionierenden) Fensterkontakt: Fällt die Temperatur in 6 Minuten um 1 °C, nimmt Raumklima ein offenes Fenster an und pausiert. Automatisch = nur, wenn kein Kontakt zuverlässig meldet.",
    "Without a (working) window contact: if the temperature drops 1 °C in 6 minutes, Raumklima assumes an open window and pauses. Automatic = only if no contact reports reliably.",
    "Sans contact de fenêtre (fonctionnel) : si la température baisse de 1 °C en 6 minutes, Raumklima suppose une fenêtre ouverte et fait une pause. Automatique = seulement si aucun contact ne signale de façon fiable.",
  ],
  "Melder": [
    "Präsenz- oder Bewegungsmelder in diesem Raum. mmWave (Radar) sieht auch Stillsitzende – sehr zuverlässig. PIR sieht nur Bewegung; Raumklima wartet deshalb länger, bevor der Raum als leer gilt.",
    "Presence or motion sensors in this room. mmWave (radar) also sees people sitting still – very reliable. PIR only sees movement, so Raumklima waits longer before the room counts as empty.",
    "Détecteurs de présence ou de mouvement de cette pièce. Le mmWave (radar) voit aussi les personnes immobiles – très fiable. Le PIR ne voit que le mouvement ; Raumklima attend donc plus longtemps avant de considérer la pièce comme vide.",
  ],
  "Art": [
    "Automatisch: Geräteklasse „Bewegung“ = PIR, „Anwesenheit/Belegung“ = mmWave. Stimmt das bei deinem Melder nicht, hier fest einstellen.",
    "Automatic: device class “motion” = PIR, “presence/occupancy” = mmWave. If that's wrong for your sensor, set it here.",
    "Automatique : classe d’appareil « mouvement » = PIR, « présence/occupation » = mmWave. Si cela ne correspond pas à votre détecteur, réglez-le ici.",
  ],
  "Leeren Raum absenken": [
    "Ist niemand im Raum, wird er etwas kühler – kommt jemand herein, sofort wieder warm. Automatisch = nur Wohnraum, Küche und selten genutzte Räume und nur mit mmWave. Schlafzimmer und Bad bleiben warm, außer du stellst „Ja“ ein.",
    "If nobody is in the room it gets a little cooler – when someone comes in, it warms up right away. Automatic = only living room, kitchen and rarely used rooms and only with mmWave. Bedrooms and bathrooms stay warm unless you set “yes”.",
    "Quand personne n’est dans la pièce, elle devient un peu plus fraîche – quand quelqu’un entre, elle se réchauffe aussitôt. Automatique = seulement séjour, cuisine et pièces peu utilisées, et seulement avec mmWave. Chambres et salle de bain restent chaudes, sauf si vous choisissez « Oui ».",
  ],
  "… wenn leer seit": [
    "So lange muss der Raum leer sein, bevor abgesenkt wird. Heizkörper reagieren träge – zu kurz spart kaum etwas.",
    "How long the room must be empty before lowering. Radiators are slow – too short saves hardly anything.",
    "Durée pendant laquelle la pièce doit être vide avant d’abaisser. Les radiateurs réagissent lentement – trop court n’économise presque rien.",
  ],
  "… um": [
    "So viel kühler wird der leere Raum – nie unter „kurz weg“ und den Schimmelschutz.",
    "How much cooler the empty room gets – never below “briefly away” and mould protection.",
    "De combien la pièce vide est refroidie – jamais sous « brève absence » ni la protection contre les moisissures.",
  ],
  "Lampen": [
    "Lampen, die bei Hinweisen dreimal farbig blinken und danach wieder so sind wie vorher. Nicht in der Ruhezeit, beim Nachtlüften, wenn niemand da ist oder der Raum leer ist.",
    "Lights that blink three times in colour on notices and then return to how they were. Not during quiet hours, night airing, when nobody is home or the room is empty.",
    "Lampes qui clignotent trois fois en couleur lors des remarques puis reviennent à leur état précédent. Pas pendant les heures calmes, l’aération nocturne, quand personne n’est là ou quand la pièce est vide.",
  ],
  "Blinken bei": [
    "Bei welchen Hinweisen geblinkt wird: blau = bitte lüften, orange = bitte schließen/kühlt aus, grün = Luft ausgetauscht, rot = Problem mit der Heizung.",
    "Which notices make the lights blink: blue = please air, orange = please close/cooling down, green = air exchanged, red = heating problem.",
    "Pour quelles remarques les lampes clignotent : bleu = merci d’aérer, orange = merci de fermer/refroidissement, vert = air renouvelé, rouge = problème de chauffage.",
  ],
  "Ausprobieren": [
    "Lässt die Lampen jetzt einmal blau blinken.",
    "Makes the lights blink blue once now.",
    "Fait clignoter les lampes une fois en bleu maintenant.",
  ],
  "Hinweise für diesen Raum": [
    "Aus = dieser Raum schickt keine Lüft-Hinweise und keinen Lüft-Countdown. Geregelt wird trotzdem.",
    "Off = this room sends no airing notices and no airing countdown. It is still controlled.",
    "Désactivé = cette pièce n’envoie ni rappels d’aération ni compte à rebours. Elle reste régulée.",
  ],
  "Empfänger": [
    "Wer Nachrichten bekommt, stellst du zentral unter Allgemein → Wer bekommt was ein.",
    "Who gets messages is set centrally under General → Who gets what.",
    "Qui reçoit les messages se règle de façon centrale sous Général → Qui reçoit quoi.",
  ],
  "Thermostat": [
    "Das Thermostat am Heizkörper. Ändern über Geräte & Technik.",
    "The radiator thermostat. Change it under devices & technical settings.",
    "Le thermostat du radiateur. Se modifie dans Appareils & réglages techniques.",
  ],
  "Weitere Thermostate": [
    "Für Räume mit mehreren Heizkörpern. Diese Thermostate bekommen dieselben Befehle wie das Haupt-Thermostat (an/aus, Preset, Sollwert) – jedes mit eigener Prüfung, eigenem Korrekturwert und eigener Fehlermeldung. Fällt eins aus, heizen die anderen weiter. Hinzufügen oder entfernen über Geräte & Technik → Zahnrad beim Raum.",
    "For rooms with several radiators. These thermostats get the same commands as the main thermostat (on/off, preset, setpoint) – each with its own check, its own correction and its own failure notice. If one fails, the others keep heating. Add or remove them under devices & technical settings → gear icon of the room.",
    "Pour les pièces avec plusieurs radiateurs. Ces thermostats reçoivent les mêmes commandes que le thermostat principal (marche/arrêt, préréglage, consigne) – chacun avec sa propre vérification, sa propre correction et sa propre alerte. Si l’un tombe en panne, les autres continuent de chauffer. Ajouter ou retirer dans Appareils & réglages techniques → roue dentée de la pièce.",
  ],
  "Temperaturfühler": [
    "Der Fühler, nach dem geregelt wird – am besten in Raummitte, nicht am Heizkörper oder in der Sonne.",
    "The sensor used for control – ideally in the middle of the room, not at the radiator or in the sun.",
    "La sonde selon laquelle on régule – idéalement au milieu de la pièce, pas au radiateur ni au soleil.",
  ],
  "CO₂-Sensor": [
    "Optional: ab 1000 ppm kommt „Bitte lüften“, „Luft ausgetauscht“ erst unter 800 ppm.",
    "Optional: from 1000 ppm you get “please air the room”, “air exchanged” only below 800 ppm.",
    "Facultatif : à partir de 1000 ppm arrive « Merci d’aérer », « Air renouvelé » seulement sous 800 ppm.",
  ],
  "Kalibrierung": [
    "Wie das Thermostat dazu gebracht wird, die Raumtemperatur zu „sehen“: Offset (Korrekturwert am Thermostat), Sollwert-Ausgleich (Ziel am Thermostat anpassen) oder keine.",
    "How the thermostat is made to “see” the room temperature: offset (correction value on the thermostat), setpoint compensation (adjust the thermostat target) or none.",
    "Comment le thermostat est amené à « voir » la température de la pièce : décalage (valeur de correction au thermostat), compensation de consigne (adapter la cible au thermostat) ou aucune.",
  ],
  "Einschalten mit": [
    "Mit welcher Betriebsart das Thermostat heizt. Automatisch meidet Modi, bei denen manche Thermostate das Ventil einfach ganz öffnen.",
    "Which mode the thermostat heats with. Automatic avoids modes in which some thermostats simply open the valve fully.",
    "Le mode avec lequel le thermostat chauffe. Automatique évite les modes où certains thermostats ouvrent simplement la vanne en grand.",
  ],
  "Ausschalten über": [
    "Wie „aus“ ans Thermostat geht: Preset „aus“, HVAC „aus“ oder Minimaltemperatur – je nachdem, was dein Gerät zuverlässig kann.",
    "How “off” is sent to the thermostat: preset “off”, HVAC “off” or minimum temperature – whatever your device handles reliably.",
    "Comment « arrêt » est envoyé au thermostat : préréglage « arrêt », mode HVAC « arrêt » ou température minimale – selon ce que votre appareil gère de façon fiable.",
  ],
  "Drehen am Thermostat übernehmen": [
    "Ja: Drehst du am Thermostat, wird das die neue Wunschtemperatur. Nein: Raumklima stellt den Wert zurück.",
    "Yes: turning the thermostat sets the new desired temperature. No: Raumklima resets the value.",
    "Oui : si vous tournez le thermostat, cela devient la nouvelle température souhaitée. Non : Raumklima remet la valeur.",
  ],
  "Übertragung": [
    "Jeder Befehl wird nach kurzer Zeit geprüft und bei Bedarf wiederholt – gegen Funk- und VPN-Aussetzer. „Synchron“ heißt: Thermostat hat bestätigt.",
    "Every command is checked after a short time and repeated if needed – against radio and VPN drops. “In sync” means the thermostat has confirmed.",
    "Chaque commande est vérifiée peu après et répétée si nécessaire – contre les coupures radio et VPN. « Synchronisé » signifie que le thermostat a confirmé.",
  ],
};
