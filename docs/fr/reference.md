# Référence

## Réglages généraux (s’appliquent à toutes les pièces d’un logement)

| Réglage | Défaut | Signification |
|---|---|---|
| Habitants | – | personnes ; la détection d’absence ne fonctionne qu’avec des habitants **et** une zone |
| Zone du logement | – | p. ex. `zone.my_flat` – pas forcément « Home » |
| Abaisser après | 30 min | délai avant que « brève absence » s’applique |
| « Absent plus longtemps » à partir de | 24 h | puis abaissement « long » |
| Préchauffer à partir de | 10 km | s’approcher à moins de cette distance → préchauffage (0 = désactivé) |
| Coûts de chauffage par an | – | facultatif, € d’après votre facture – uniquement pour l’estimation en euros dans le rapport PDF (`annual_cost`) |
| Rapports PDF | semaine, mois, saison de chauffage | créés automatiquement (`report_pdf`) |
| PDF par e-mail | désactivé | interrupteur ; `raumklima` = envoi intégré (login `mail_server`, `mail_port`, `mail_security`, `mail_user`, `mail_password`, `mail_from`, `mail_to`) ou un service `notify` (`report_email`) |
| Comptage des détecteurs de présence | mmWave uniquement | mmWave uniquement / mmWave + PIR / aucun – si un détecteur voit quelqu’un, le logement est considéré comme occupé (`home_sensors`) |
| Calendrier | – | `calendar.*` ; un événement en cours contenant « vacation » etc. agit comme des vacances, « home office » etc. comme des invités |
| … comme des vacances / … quelqu’un reste à la maison | voir [Fonctionnement](fonctionnement.md#5-absence) | mots, séparés par des virgules |
| Type de bâtiment | ancien, rénové | facteur de température pour la protection contre les moisissures (0,60 / 0,70 / 0,80) |
| Mode | Automatique | Automatique / Toujours chauffer / Chauffage en pause |
| Saison de chauffage | 10-01 à 04-30 | format MM-JJ |
| Limite de chauffage | 15 °C | moyenne extérieure journalière (24 h mesurées + 24 h de prévision) |
| Coup de froid en dessous de | 12 °C | 3 jours en dessous → chauffage aussi hors saison |
| Minimum de sécurité | 16 °C | en dessous, une pièce chauffe toujours |
| Nuit de gel : abaissement réduit | activé | prévision ≤ −5 °C dans les 12 h → abaissement deux fois moins profond |
| Exercice des vannes en été | activé | ouvrir les vannes 3 min le mercredi à 11:00 |
| Destinataires | – | types de messages par service `notify` |
| Heures calmes | 22:00–07:00 (week-end jusqu’à 09:00) | seuls les messages urgents sont sonores, aucune annonce |
| Travail posté | désactivé | apprend le coucher/lever par jour de la semaine et détecte aussi le sommeil de jour (coucher jusqu’à 09:00, lever jusqu’à 17:00) |
| L’heure de repos abaisse | désactivé | les chambres et les pièces peu utilisées sont abaissées pendant l’heure de repos, même si quelqu’un est là |
| Aération nocturne | 20:00–03:00 | fenêtre ouverte dans une chambre pendant cette plage = dormir fenêtre ouverte |
| … avertissement discret en dessous de | 12 °C | une fois par nuit |
| Rappeler toutes les | 5 min | répéter tant que le problème persiste |
| Source météo | – | `weather.*` (avec prévision) ou une sonde de température extérieure |
| Emplacement du logement | – (Home Assistant) | coordonnées pour la position du soleil – nécessaire quand le logement est ailleurs que Home Assistant (sous *Logement → Avancé*) |
| Apprendre les horaires | activé | heures de sommeil d’après l’aération nocturne et les lumières |
| Jours fériés | – | Land allemand ; la nuit précédant un jour férié compte comme week-end |
| Signaux de sommeil | – | lumières/interrupteurs pour le coucher et le lever |
| Erreurs dans les notifications HA | activé | notification supplémentaire dans Home Assistant |

## Réglages par pièce

| Réglage | Défaut | Signification |
|---|---|---|
| Autres thermostats | – | autres thermostats `climate` dans la même pièce (`extra_trvs`) ; suivent le thermostat principal, décalage/compensation de consigne propres |
| Contacts de fenêtre | – | nombre quelconque ; pause dès qu’un seul est ouvert |
| Type de pièce | salon | définit les valeurs par défaut de température souhaitée, température minimale, humidité, abaissement |
| Température souhaitée | selon le type de pièce | salon/chambre d’enfant 20 · cuisine 19 · salle de bain 22 · chambre/rarement utilisée 17 °C |
| Abaissement « brève absence » | 18 °C (chambre, rarement utilisée : 16) | |
| Abaissement « absent plus longtemps » | 16 °C | |
| Côté ensoleillé | désactivé | 1 °C de moins quand du soleil est prévu |
| Le soleil vient de | – (prévision seule) | façade N/NE/E/SE/S/SO/O/NO sous *Pièce → Avancé* ; avec l’azimut, seul le soleil qui entre vraiment compte – vue dégagée supposée |
| Détecteurs de présence | – | entités `binary_sensor` (`presence_sensors`) |
| Type de détecteurs | automatique | automatique / mmWave / PIR (`presence_kind`) |
| Abaisser une pièce vide | automatique | automatique (salon, cuisine, rarement utilisée – uniquement avec mmWave) / oui / non (`room_eco`) |
| … quand vide depuis | 30 min | `room_eco_after` |
| … de | 1,5 °C | `room_eco_drop` ; jamais en dessous de « brève absence » et de la protection contre les moisissures |
| Signal lumineux : lumières | – | entités `light` qui clignotent lors des avis (`signal_lights`) |
| Signal lumineux : clignoter pour | veuillez aérer, veuillez fermer | `light_signals` : `open`, `close`, `done`, `problem` |
| Sonde CO₂ | – | facultatif ; à partir de 1000 ppm « veuillez aérer la pièce » |
| Limite d’humidité | 70 % (salle de bain 75 %) | à partir de là « veuillez aérer la pièce » |
| Température minimale pendant l’aération | 18 °C (chambre, rarement utilisée : 16) | en dessous : « la pièce se refroidit » |
| Refroidissement max. pendant l’aération | 3 °C | |
| Logique de fenêtre | activé | pause tant qu’une fenêtre est ouverte |
| Délai ouverture / fermeture | 10 s / 10 s | |
| Dormir fenêtre ouverte | Automatique | aération nocturne : Automatique (chambres) / Oui / Non |
| Détecter une fenêtre ouverte par la chute de température | Automatique | uniquement sans contact joignable / Oui / Non |
| Calibration | Décalage | Décalage / Compensation de consigne / Aucune |
| Allumer avec | Automatique | préréglage pour le chauffage ; évite « on » (TRV602Z : vanne ouverte) |
| Éteindre via | Automatique | préréglage « off », HVAC « off » ou température minimale |
| Suivre les changements au niveau du TRV | activé | désactivé = les changements sur l’appareil sont annulés |
| Décalage à partir d’un changement de | 0,3 °C | |
| Intervalle de calibration minimal | 5 min | |
| Sonde considérée comme défaillante après | 60 min | |
| Vérifier la commande après | 20 s | |
| Tentatives avant notification | 5 | |

## Entités par pièce

| Entité | Contenu |
|---|---|
| `climate.<room>` | thermostat ; les attributs incluent `effective_target`, `plan_reason`, `presence`, `heating_mode`, `status`, `off_source`, `offset`, `valve_position`, `co2`, valeurs d’aération |
| `sensor.<room>_status` | chauffage · atteint · fenêtre ouverte · éteint · éteint (au thermostat) · sonde/TRV manquant · chauffage en pause · abaissé · aération nocturne |
| `sensor.<room>_sync` | ok · en attente · échec |
| `sensor.<room>_calibration_offset` | décalage actuel |
| `sensor.<room>_airing` | ok · veuillez ouvrir · aération · terminé · veuillez fermer · trop froid |
| `sensor.<room>_dew_point`, `…_absolute_humidity`, `…_recommended_airing_time` | valeurs |
| `binary_sensor.<room>_window`, `…_problem`, `…_mold_risk` | |
| `switch.<room>_window_logic`, `…_airing_notifications` | |
| `number.<room>_humidity_limit_please_air`, `…_minimum_temperature_while_airing`, `…_max_temperature_drop_while_airing` | |
| `button.<room>_wärmer_boost` | lance le boost (« plus chaud un moment »), un second appui l’arrête |
| `button.<room>_calibrate_now` | |

> **Pourquoi une pièce est-elle éteinte ?** L’attribut `off_source` de `climate.<room>` le dit : `user` =
> éteint dans Home Assistant, `trv` = éteint au thermostat (planning propre, boost, molette – avec *Avancé →
> Suivre les changements au thermostat*). Seules les pièces allumées sont abaissées ; les éteintes restent éteintes.

> **Heures de chauffe fixes :** L’option `schedules` d’une pièce est une liste de
> `{days, start, end, temperature}` (jours : 0 = lundi … 6 = dimanche, vide = tous les jours ; heures « HH:MM »,
> aussi après minuit). `boost_temperature` (surplus en K) et `boost_minutes` définissent le boost. Le planning ne
> règle que la consigne – fenêtre, gel, moisissures, pause de chauffage et absence restent prioritaires.
> Dans une pièce dont la vitesse de chauffe est apprise, le chauffage démarre à temps pour qu’elle soit chaude au début de la plage.

## Entités du hub « Allgemein »

| Entité | Contenu |
|---|---|
| `sensor.raumklima_allgemein_presence` | home · guests · preheat · away_short · away_long ; attribut `persons` (home ?, distance, approaching) |
| `sensor.raumklima_allgemein_heating_mode` | heating · pause · cold_snap · heat_today · always · manual_pause ; attributs avec les moyennes journalières |
| `sensor.raumklima_allgemein_outdoor_daily_mean` | moyenne de 24 h de mesures et de 24 h de prévision |
| `sensor.raumklima_allgemein_health` | nombre de problèmes ouverts |
| `switch.raumklima_allgemein_vacation`, `switch.raumklima_allgemein_guests` | |
| `select.raumklima_allgemein_heating_season_mode` | auto · always · pause |
| `button.raumklima_allgemein_heat_today` | chauffer pendant 24 h |

(Les identifiants d’entité exacts dépendent de la langue utilisée lors de la configuration.)

## Déclencheurs d’appareil

Dans l’éditeur d’automatisations : **Ajouter un déclencheur → Appareil → (pièce)**. Disponibles :

| Déclencheur | Quand |
|---|---|
| L’assistant d’aération demande d’aérer la pièce | humidité ou CO₂ trop élevée |
| Durée d’aération atteinte – veuillez fermer | durée d’aération recommandée dépassée |
| La pièce se refroidit pendant l’aération | en dessous de la température minimale ou trop refroidie |
| Air renouvelé | humidité/CO₂ de nouveau corrects |
| Fenêtre ouverte / fermée | immédiatement (sans délai), aussi les fenêtres estimées sans contact |
| Chauffage en pause (fenêtre) / repris | après le délai, uniquement avec la logique de fenêtre |
| Le contrôle de santé a trouvé un problème | nouveau problème dans la pièce |

## Événement pour vos propres automatisations

`raumklima_event` avec `type`, `state`, `room`, `entry_id` et d’autres données :

| `type` | `state` | autres données |
|---|---|---|
| `ventilation` | `ok`, `please_open`, `airing`, `done`, `please_close`, `too_cold` | `reason` (`humidity`/`co2` pour `please_open`) |
| `window` | `open`, `closed` | `virtual` (estimée), `night` (aération nocturne) |
| `heating` | `paused`, `resumed` | |
| `health` | `problem` | `code`, `title`, `severity` |

```yaml
triggers:
  - trigger: event
    event_type: raumklima_event
    event_data:
      type: ventilation
      state: please_close
actions:
  - action: light.turn_on
    target: { entity_id: light.hallway }
    data: { color_name: blue, flash: short }
```

Exemple – basculer autre chose pendant les vacances :

```yaml
triggers:
  - trigger: state
    entity_id: sensor.raumklima_allgemein_presence
    to: away_long
```

## API WebSocket

Utilisée par les cartes ; pratique pour vos propres outils. Toutes les commandes acceptent un `home` facultatif (entry_id du hub).

| Commande | Objet |
|---|---|
| `raumklima/config` | réglages, pièces, logements, choix |
| `raumklima/hub/update`, `raumklima/room/update` | modifier les réglages (admin) |
| `raumklima/hub/action` | `heat_today`, `cancel_heat_today`, `vacation`, `guests` (admin) |
| `raumklima/report` | rapport de chauffage (semaine, mois, valeurs journalières, contrôle de santé) |
| `raumklima/report/export` | valeurs journalières par pièce au format CSV (`days` facultatif) |
| `raumklima/log`, `raumklima/log/subscribe` | journal des décisions, en direct |
| `raumklima/notify/test` | envoyer un message de test (admin) |
| `raumklima/room/light_test` | faire clignoter les signaux lumineux de la pièce (`entry_id`, `signal` facultatif ; admin) |
| `raumklima/home/create` | créer un autre logement (admin) |
