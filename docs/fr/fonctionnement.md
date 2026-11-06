# Fonctionnement

## 1. Régulation par la sonde de la pièce

Un thermostat sur le radiateur mesure juste à côté des ailettes chaudes – il maintient en général la pièce trop froide. Raumklima utilise une **sonde externe** dans la pièce comme référence :

- **Décalage (offset) (recommandé) :** le TRV reçoit en continu une valeur de correction (`local_temperature_calibration`) pour que sa propre mesure corresponde à la température de la pièce. Le décalage est recalculé à partir de la valeur brute, envoyé uniquement à partir d'un changement de 0,3 °C et au maximum toutes les 5 minutes ; les valeurs aberrantes de la sonde sont écartées.
- **Compensation de consigne :** pour les TRV sans décalage – la consigne du TRV est décalée de la différence.
- **Mode secours :** si la sonde ne transmet plus pendant plus de 60 minutes, le TRV continue de réguler avec sa propre sonde et l'état le signale.

## 2. Logique de fenêtre

- Fenêtre **ouverte ≥ 10 s** → le chauffage se met en pause (TRV éteint), la température souhaitée est conservée.
- Fenêtre **fermée ≥ 10 s** → l'état précédent revient.
- Les coupures de connexion (`unavailable`) ne comptent ni comme « ouverte » ni comme « fermée ».

**Fenêtre sans contact :** si une pièce n'a pas de contact de fenêtre (ou que celui-ci est injoignable), l'intégration détecte une fenêtre ouverte à partir d'une chute de température : si celle-ci baisse de 1 °C en 6 minutes et qu'il fait au moins 5 °C de moins dehors, le chauffage se met en pause. Il reprend dès que la température remonte de 0,3 °C (au plus tôt après 10 minutes, au plus tard après 30). Par pièce : Automatique / Oui / Non.

## 3. Fiabilité sur les liaisons radio et VPN instables

Chaque commande envoyée au TRV est **vérifiée** après 20 s. Si elle n'est pas arrivée, elle est répétée – avec des intervalles croissants, puis toutes les 5 minutes. Quand le TRV revient, les commandes en attente sont envoyées immédiatement. Raumklima réconcilie en outre l'état souhaité et l'état réel toutes les 10 minutes. Si rien ne fonctionne, vous recevez une notification.

Les coupures courtes (moins d'une minute) ne comptent pas comme un échec. Si tous les thermostats décrochent en même temps, cela est traité comme un problème de connexion (Zigbee2MQTT/MQTT/VPN) et consigné au maximum une fois par demi-heure.

**Spécificités du TRV602Z :** le préréglage « on » signifie *vanne ouverte en permanence* sur cet appareil. Raumklima utilise automatiquement un préréglage qui régule vers la consigne (« manual »/« eco ») et ignore la valeur eco mémorisée que le TRV charge lors du changement de préréglage. eco, comfort, manual et heat sont traités comme équivalents – le TRV Tuya bascule entre eux de lui-même. Si un thermostat ne cesse de sauter vers un autre préréglage, celui-ci est adopté (ou la restauration est suspendue pendant 30 minutes), et au-delà de 40 commandes en 10 minutes, l'intégration se met en pause pendant 15 minutes.

## 4. Assistant d'aération

- **Veuillez aérer la pièce :** humidité au-dessus de la limite de la pièce pendant 15 minutes (70 % par défaut, salle de bain 75 %) – mais seulement si **l'aération assèche vraiment** (humidité absolue extérieure inférieure à celle de l'intérieur).
- **Particules fines (en option) :** avec une sonde PM2,5, « veuillez aérer » démarre à **35 µg/m³** – mais seulement si la valeur reste au-dessus pendant **15 minutes**. Une bougie, un grille-pain ou l'aspirateur ne déclenchent rien.
- **CO₂ (en option) :** avec une sonde CO₂, « veuillez aérer la pièce » se déclenche aussi à partir de **1000 ppm** – indépendamment de la météo, car l'air vicié s'améliore toujours en aérant (Agence fédérale de l'environnement allemande : en dessous de 1000 ppm, sans danger).
- **Durée d'aération** selon la température extérieure (co2online/UBA) : en dessous de 0 °C 4 min, 0–5 °C 5 min, 5–10 °C 10 min, 10–15 °C 15 min, 15–20 °C 20 min, au-dessus 30 min.
- **Fermez la fenêtre** une fois le temps écoulé ; **air renouvelé** quand l'humidité repasse sous la limite (et le CO₂ sous 800 ppm) – mais au plus tôt après 60 % de la durée d'aération, et jamais moins de 4 minutes. Une sonde près de la fenêtre sent l'air frais avant la pièce ; deux minutes ne font qu'entrouvrir. La durée minimale se règle par pièce (*Réglages → Pièce → Aération → durée minimale*) – automatique par défaut.
- **La pièce se refroidit :** en dessous de la température minimale (pièces à vivre 18 °C, chambre/rarement utilisée 16 °C) ou plus de 3 °C de moins qu'à l'ouverture de la fenêtre.
- **Risque de moisissures :** durablement au-dessus de 70 % ou froid et humide.

## 5. Absence

Pour toute la maison, vous définissez **qui habite ici** (personnes) et **quelle zone correspond à la maison**. Une personne est considérée comme présente dès que **l'un de ses téléphones** se trouve dans la zone.

| Étape | Quand | Consigne |
|---|---|---|
| Quelqu'un à la maison | au moins une personne dans la zone | température souhaitée |
| Brève absence | tout le monde absent, après un délai de 30 min | abaissement « court » (pièces à vivre 18 °C, chambre 16 °C) |
| Absence prolongée | à partir de 24 h ou via l'interrupteur **vacances** | abaissement « long » (16 °C) |
| Préchauffage | quelqu'un approche, à moins de 10 km | température souhaitée |
| Invités | interrupteur **invités** | température souhaitée |

**Localisation robuste :**
- Les **sauts impossibles** (plus de 300 km/h, par ex. un VPN qui ramène la position à la maison) sont ignorés. Si la nouvelle position persiste plus de 30 minutes, elle est acceptée (un vrai déplacement).
- Les **positions imprécises** (plus de 200 m) ne comptent pas.
- Les traceurs de routeur ou Bluetooth sans coordonnées sont ignorés.

**Autres règles :**
- Monter la température au thermostat ou dans l'application pendant un abaissement suspend l'abaissement dans cette pièce pendant **3 heures**.
- Les **vacances** se terminent automatiquement dès que quelqu'un arrive.
- Si personne n'est à la maison, il n'y a **aucun rappel d'aération** – à la place, le message « fenêtre ouverte, personne à la maison ».

**Calendrier (en option) :** sous *Général → Présence et abaissement → Calendrier*, choisissez un `calendar.*`. Tant qu'un événement est en cours et que son titre contient l'un des mots :

| L'événement contient (par défaut) | Effet |
|---|---|
| Urlaub, Reise, Dienstreise, verreist, vacation, trip | comme l'interrupteur **vacances** : abaissement « absent longtemps » dès que personne n'est à la maison |
| Homeoffice, Home-Office, zu Hause, home office, wfh | comme **invités** : pas d'abaissement |

Les mots peuvent être modifiés (séparés par des virgules, insensibles à la casse). Si quelqu'un rentre pendant un événement « vacances », c'est la localisation qui l'emporte.

**Nuit de gel :** si la prévision annonce −5 °C ou moins dans les 12 prochaines heures, l'abaissement d'absence est seulement **deux fois moins profond** (par ex. 19 au lieu de 16 °C avec 22 °C souhaités). Sinon, les murs et les meubles se refroidissent beaucoup et le réchauffement prend longtemps. Peut être désactivé sous *Général → Saison de chauffage → Nuit de gel : abaissement réduit*.

Les valeurs suivent les recommandations des associations de consommateurs allemandes : environ 18 °C pour les absences courtes, pas en dessous de 16 °C pour les plus longues, ne jamais couper complètement le chauffage. Chaque degré en moins économise environ 6 % d'énergie de chauffage.

**Temps de chauffe et préchauffage selon l'heure d'arrivée :** chaque pièce apprend à quelle vitesse elle se réchauffe – en °C par heure, selon la température extérieure (à partir des 30 derniers cycles de chauffe, valide à partir de 3). Quand quelqu'un approche, l'intégration estime l'heure d'arrivée à partir de la vitesse des dernières minutes. Si la personne doit arriver plus tôt que le temps nécessaire à la maison pour chauffer (plus 10 minutes), le préchauffage démarre – même au-delà de la limite en km, jusqu'à 150 km. Tant que rien n'a été appris, seule la limite en km s'applique.

## 6. Protection contre les moisissures

Pendant les **absences prolongées**, Raumklima calcule jusqu'où la température peut baisser sans que l'endroit le plus froid du mur (angle extérieur) ne devienne trop humide – selon le critère **DIN 4108-2** : au maximum 80 % d'humidité relative à la surface.

```
Température de paroi  θsi = θout + fRsi · (θin − θout)
La pression de vapeur de l'air ambiant reste la même pendant l'abaissement
→ θin le plus bas auquel le mur présente ≤ 80 % d'humidité
```

- **fRsi** (facteur de température) selon le type de bâtiment : ancien non rénové 0,60 · ancien rénové 0,70 · neuf/isolé 0,80.
- Si l'air est **sec**, l'abaissement peut être important. Exemple : 18 °C / 45 % avec 0 °C dehors – sans danger jusqu'à environ 13 °C.
- Si l'air est **humide** (par ex. la salle de bain après une douche), la pièce reste plus chaude jusqu'à ce que l'humidité ait baissé. L'air chaud retient plus d'eau, donc l'humidité au niveau du mur baisse.
- **Trois niveaux** par pièce (*Réglages → Pièce → Température → Protection anti-moisissure*) : **Strict selon DIN** (par défaut) remonte la consigne pour que le point de mur le plus froid reste sous 80 % – même au-dessus de la consigne ; **Jusqu'à la consigne** remonte au maximum jusqu'à la température souhaitée ; **Désactivé** supprime le plancher, la pièce suit alors exactement la valeur réglée.
- Ce plancher s'applique **partout**, y compris aux plannings et aux heures calmes : si une plage horaire ou l'abaissement nocturne passait en dessous, RaumKlima remonte la consigne et note « protection contre les moisissures » comme motif. Seules les actions volontaires (boost, entretien de vanne) et la pause de chauffage sont exclues.
- Le calcul utilise la **moyenne des dernières 24 heures** (vapeur d'eau de l'air), pas la valeur instantanée : cuisiner, une douche ou une nuit dans la chambre ne relèvent pas le plancher de plusieurs degrés d'un coup. Le plancher avance par **pas de 0,5 °C**, monte tout de suite et ne baisse que lorsque le calcul est nettement (0,7 °C) plus bas – le thermostat n'est pas réglé toutes les quelques minutes. Avec moins d'1 h de données (pièce nouvellement configurée), la valeur actuelle compte aussi.
- Pour les **absences courtes**, la protection contre les moisissures ne s'applique volontairement pas : quelques heures à une température plus basse ne posent aucun problème d'humidité. Cela ne devient critique que lorsque le mur reste humide pendant des jours.

## 7. Saison de chauffage et limite de chauffage

Le chauffage ne fonctionne que lorsqu'il fait vraiment froid dehors – ce qui compte, c'est la **limite de chauffage** : la température extérieure moyenne journalière au-dessus de laquelle un bâtiment n'a pas besoin de chauffage (co2online : ancien non rénové 15–17 °C, rénové 14–16 °C, neuf 12–15 °C).

- **Moyenne journalière** = moyenne des **24 dernières heures** (mesurée) et des **24 prochaines heures** (prévision). Le chauffage réagit donc avant qu'il ne fasse froid.
- **Saison de chauffage** (par défaut du 1er octobre au 30 avril) :
  - Extinction seulement après **2 jours doux** au-dessus de la limite de chauffage + 1 °C.
  - Activation dès que la moyenne passe sous la limite de chauffage.
- **Hors saison**, le chauffage reste éteint. Exception **coup de froid** : si la moyenne journalière reste sous 12 °C pendant 3 jours, le chauffage fonctionne quand même (comme dans le droit locatif allemand).
- **Minimum de sécurité :** si une pièce descend sous 16 °C, elle chauffe toujours.
- **Modes :** Automatique, Toujours chauffer, Chauffage en pause. **Chauffer aujourd'hui** lève une pause pendant 24 h.
- **Exercice des vannes en été :** pendant la pause de chauffage, Raumklima ouvre les vannes pendant 3 minutes le mercredi à 11:00 pour qu'elles ne se grippent pas.

**Côté ensoleillé :** les pièces avec de grandes fenêtres orientées au sud ou à l'ouest peuvent être marquées comme *côté ensoleillé* (Réglages → pièce → Température). Si la prévision horaire annonce principalement du soleil pour les 3 prochaines heures (condition « sunny » ou au maximum 30 % de couverture nuageuse) et que la pièce est presque chaude, elle chauffe **1 °C de moins** – le soleil fait le reste. Cela reste jusqu'à ce que la prévision n'annonce plus de soleil (pas d'aller-retour). Nécessite une source `weather.*` avec prévision horaire.

## 8. Détecteurs de présence

Par pièce, vous pouvez ajouter un ou plusieurs détecteurs de présence ou de mouvement (*Réglages → pièce → Détecteurs de présence*). Raumklima distingue deux types – et leur accorde une confiance différente :

| | mmWave (radar) | PIR (détecteur de mouvement) |
|---|---|---|
| Exemples | Aqara FP2/FP1E, Everything Presence, radar Tuya | Hue Motion, IKEA, Aqara P1 |
| détecte | aussi les personnes assises ou endormies | uniquement le mouvement |
| pièce considérée comme vide | 3 min après la dernière détection | 20 min après le dernier mouvement |
| compte pour « quelqu'un est à la maison » | oui | seulement si activé (animaux !) |
| abaisse automatiquement une pièce vide | oui (pièce à vivre, cuisine, rarement utilisée) | seulement si activé |

Le type est détecté à partir de la classe d'appareil (`occupancy`/`presence` = mmWave, `motion` = PIR) et peut être corrigé par pièce. Un détecteur indisponible est ignoré ; s'ils le sont tous, la pièce n'est jamais abaissée.

**Quelqu'un est à la maison :** si un détecteur voit quelqu'un, le domicile est considéré comme occupé – même quand tous les téléphones sont absents (visiteurs, enfants sans téléphone, téléphone éteint). Sous *Général → Présence → Prise en compte des détecteurs de présence* : **mmWave uniquement** (par défaut), **mmWave + PIR** ou **aucun**. Pendant les **vacances**, les détecteurs ne comptent jamais – le chat devant le radar ne met pas fin à vos vacances.

**Abaisser une pièce vide :** si la pièce est vide depuis une durée réglable (30 min par défaut), elle chauffe d'une valeur réglable de moins (1,5 °C par défaut) – jamais en dessous de « brève absence » ni de la protection contre les moisissures. Quand quelqu'un entre, elle revient directement à la température souhaitée. *Automatique* signifie : uniquement dans la pièce à vivre, la cuisine et les pièces rarement utilisées, et uniquement avec un détecteur mmWave. Les chambres, les chambres d'enfants et les salles de bain restent chaudes sauf si vous l'activez explicitement. Les radiateurs sont lents – les absences courtes économisent peu, d'où le temps d'attente.

**Signal lumineux :** si une pièce est vide selon ses détecteurs, ses lumières ne clignotent pas.

## Priorité

1. Fenêtre ouverte → pause
2. Chauffage en pause → éteint (sauf minimum de sécurité / protection antigel)
3. Tout le monde absent → abaissement, mais jamais en dessous de la protection contre les moisissures (seulement deux fois moins profond les nuits de gel)
4. Pièce vide selon les détecteurs de présence → jusqu'à 1,5 °C de moins
5. Côté ensoleillé et soleil prévu → 1 °C en dessous de la consigne
6. Sinon → température souhaitée

## Source d'humidité, type de paroi et commandes radio

**Type de paroi par pièce.** La température du point de paroi le plus froid dépend de la pièce, pas
seulement du bâtiment : un angle extérieur (fRsi 0,62) refroidit bien plus qu'une cloison intérieure (0,82).
Réglable par pièce sous *Réglages → Température → Type de paroi* ; « comme le logement » reprend le type
de bâtiment. Une salle de bain intérieure n'a alors presque plus besoin de plancher d'humidité, un angle
extérieur dans la chambre beaucoup plus.

**Moyenne sur 24 h au lieu de la valeur instantanée.** Le plancher d'humidité est calculé sur la moyenne
de vapeur d'eau des 24 dernières heures – la moisissure vient d'une humidité durable, pas d'un pic de douche.

**Pourquoi il fait plus chaud que demandé.** Quand la protection relève la consigne, la pièce l'affiche :
« protection moisissure **+2,0 °C** à 22,5 °C · 63 % d'humidité (moyenne 24 h) ».

**Source d'humidité au lieu du chauffage.** Si l'humidité monte pendant des heures alors que le chauffage
tourne, RaumKlima le signale – en distinguant : air extérieur plus sec, aérer aide (« aérer au lieu de
chauffer ») ; air extérieur plus humide (novembre), la source est dans la pièce (linge, douche, plusieurs
personnes).

**Commandes radio dans le rapport.** Chaque consigne envoyée à un thermostat est comptée, répétitions
comprises. Le rapport hebdomadaire liste les pièces suspectes dans le tableau de fiabilité.

**Qui a modifié.** Les changements manuels nomment l'utilisateur Home Assistant dans le journal.

### Protection moisissure – trois freins

Le calcul d'humidité seul peut exiger 24–25 °C par nuit froide. C'est physiquement correct
(parois froides, humidité élevée) mais ce n'est pas une solution : **chauffer n'élimine pas
l'humidité.** Trois freins s'appliquent :

1. **La fenêtre ouverte est prioritaire.** Tant qu'une fenêtre est ouverte, aucun plancher
   d'humidité ne s'applique – et le temps d'aération n'entre pas dans la moyenne sur 24 h.
2. **Budget horaire.** La consigne n'est relevée que si la paroi est restée au-dessus de 80 %
   pendant au moins **2 heures** sur les 24 dernières.
3. **Plafond.** Au maximum **consigne + 2,5 K**, la nuit seulement **+1,5 K**. Quand le plafond
   s'applique, la pièce affiche : « Humidité trop élevée pour ce mur · 63 % (moyenne 24 h),
   4,1 h critiques – aérez ». La hausse est réglable par pièce (0–6 K, 0 = désactivé).

De plus, « la pièce ne chauffe pas » n'est plus signalé lorsque le plafond s'applique.
