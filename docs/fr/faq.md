# Foire aux questions (FAQ)

## Installation

### Quels thermostats fonctionnent ?
Tout thermostat de radiateur qui apparaît dans Home Assistant comme appareil « climate » et dont la température peut être réglée – Zigbee, Z-Wave, Wi-Fi, Shelly, Matter ou cloud (Tado, Netatmo). S'il dispose d'un réglage de décalage (offset), Raumklima corrige par ce biais ; sinon, il augmente ou diminue la consigne en conséquence. Important : désactivez le planning et la détection de fenêtre propres au thermostat. Testé jusqu'ici avec le Tuya TRV602Z via Zigbee2MQTT – détails et remarques par type d'appareil sous [Quels thermostats fonctionnent ?](installation.md#quels-thermostats-fonctionnent).

### Ai-je vraiment besoin d'une sonde de température supplémentaire ?
Oui, une par pièce. Le thermostat lui-même mesure juste à côté du radiateur brûlant et se trompe souvent. Une simple sonde Zigbee (par ex. d'IKEA ou Aqara) placée quelque part au milieu de la pièce suffit.

### Ma pièce compte plusieurs radiateurs et fenêtres – est-ce que ça marche ?
Oui. Lors de l'installation (ou plus tard sous *Modifier les appareils et les réglages techniques* → icône engrenage de la pièce), choisissez le premier thermostat comme thermostat principal et les autres sous **Autres thermostats de cette pièce**. Tous reçoivent les mêmes commandes, chacune avec sa propre vérification et correction. Un nombre quelconque de contacts de fenêtre fonctionne – le chauffage se met en pause dès que l'un d'eux est ouvert.

### Les contacts de fenêtre sont-ils obligatoires ?
Non. Sans contact, Raumklima détecte une fenêtre ouverte grâce à une chute soudaine de température. Un contact est toutefois plus rapide et plus fiable.

### Qu'est-ce que « Allgemein » et pourquoi figure-t-il dans la liste ?
« Allgemein » (général) est le point central de toute la maison : qui y vit, qui reçoit les messages, la saison de chauffage. Il est créé automatiquement avec la première pièce. Chaque pièce est une entrée à part entière.

### Dois-je écrire du YAML ?
Non. Tout se fait dans la boîte de dialogue de configuration de Home Assistant et dans la page de réglages du tableau de bord.

### Je travaille en horaires décalés – est-ce possible ?
Oui. L’abaissement et le préchauffage suivent votre présence réelle (téléphone), pas l’horloge – que vous rentriez à 6 h ou à 1 h du matin. En plus, *Réglages → Général → Heures de sommeil* propose l’option **Travail posté** : le coucher et le lever sont alors appris par jour de la semaine et le sommeil de jour est détecté aussi (coucher jusqu’à 09:00, lever jusqu’à 17:00). Avec **L’heure de repos abaisse**, les chambres et les pièces peu utilisées sont abaissées pendant l’heure de repos – le chauffage reste donc arrêté pendant votre sommeil après une nuit de travail. Une plage horaire en cours et le bouton du thermostat restent prioritaires.

### Puis-je définir des heures de chauffe fixes ?
Oui – sous *Réglages → pièce → Planning*. Vous y créez des plages horaires avec jours de la semaine, de/à et
température cible, p. ex. « tous les jours 19–21 h 22 °C ». Le planning ne règle que la consigne : fenêtre, gel,
moisissures, pause de chauffage et absence restent prioritaires. Pour « un peu plus chaud un moment », il y a le
bouton **Plus chaud** (boost) sur la carte de pièce. Une fois la vitesse de chauffe apprise, la pièce démarre à temps pour être chaude au début de la plage.

## Le chauffage ne fait pas ce que je veux

### La pièce ne chauffe pas alors qu'il fait froid.
Regardez la carte de la pièce – elle indique la raison :
- **Chauffage en pause :** la moyenne journalière extérieure est douce. Appuyez sur **Chauffer aujourd'hui** (24 heures) ou réglez le mode sur **Chauffer toujours**.
- **Abaissé – personne à la maison :** Raumklima pense que personne n'est là. Vérifiez sous *Réglages → Général* que les bonnes personnes et la bonne zone sont sélectionnées. Monter le thermostat lève l'abaissement pendant 3 heures.
- **En pause – fenêtre ouverte :** un contact de fenêtre signale « ouvert ».

### Il chauffe alors que personne n'est à la maison.
Abaisser ne signifie pas éteindre : pour les courtes absences, Raumklima maintient environ 18 °C, pour les plus longues 16 °C. Si l'air est humide, il reste un peu plus chaud pour éviter les moisissures. Les nuits très froides, l'abaissement est volontairement plus faible.

### Pourquoi n'obtient-on pas exactement la température réglée ?
De petits écarts (± 0,5 °C) sont normaux. Si la pièce reste nettement plus froide en permanence, le contrôle de santé signale « la pièce ne chauffe pas » ou « le radiateur ne suit pas » – purgez le radiateur ou demandez à votre installateur de chauffage à propos de l'équilibrage hydraulique.

### Je tourne le thermostat et il revient en arrière.
Sous *Modifier les appareils et les réglages techniques → pièce → Avancé*, il y a « Suivre les modifications sur le thermostat ». S'il est désactivé, Raumklima rétablit toujours son propre réglage.

### La vanne est toujours grande ouverte (TRV602Z).
Sur le TRV602Z, le préréglage « on » signifie *vanne ouverte en permanence*. Sous *Avancé → Activer avec*, il devrait être indiqué « Automatique ».

### Comment savoir pourquoi quelque chose s'est produit ?
L'onglet **Journal** liste chaque décision avec l'heure et la raison.

## Présence

### Comment Raumklima sait-il si quelqu'un est à la maison ?
Grâce à l'application Home Assistant sur le téléphone. Une personne est considérée comme présente dès que l'un de ses téléphones se trouve dans la zone « maison ».

### Mon téléphone indique parfois des lieux erronés (par ex. à cause d'un VPN).
Raumklima ignore les sauts impossibles et les positions imprécises. Une nouvelle position n'est acceptée qu'après être restée stable pendant 30 minutes.

### Les détecteurs de présence valent-ils la peine ?
Oui : si un **capteur mmWave** détecte quelqu'un, il n'y a pas d'abaissement – même lorsque tous les téléphones sont absents. Et certaines pièces (par ex. le salon) peuvent se refroidir un peu lorsque personne ne s'y trouve. Les **détecteurs de mouvement PIR** fonctionnent aussi mais sont considérés comme moins fiables : ils ne voient pas une personne assise immobile, et les animaux les déclenchent. C'est pourquoi Raumklima attend plus longtemps avec les PIR et, par défaut, ne les laisse pas décider que « quelqu'un est à la maison ».

### Nous avons des visiteurs sans téléphone dans Home Assistant.
Activez **Invités**. Il n'y a alors pas d'abaissement même si tous les habitants sont absents. Sinon, un événement de calendrier avec « télétravail » ou « zu Hause » dans le titre.

### Comment régler les vacances ?
Activez l'interrupteur **Vacances** – ou créez un événement de calendrier avec « vacances » dans le titre. Les vacances se terminent automatiquement dès que quelqu'un rentre à la maison.

### Pourquoi toutes les pièces ne sont-elles pas abaissées quand personne n’est là ?
Seules les pièces **allumées** sont abaissées. Une pièce éteinte est sur « arrêt » et ne chauffe pas de toute façon – il n’y a rien à abaisser. Si la carte affiche « Arrêt – éteint au thermostat », le thermostat s’est éteint lui-même (planning propre, boost ou molette) et Raumklima l’a suivi, car *Avancé → Suivre les changements au thermostat* est activé. Désactivez alors les plannings et le boost du thermostat – ou cette option.

## Notifications

### Je ne reçois aucun message.
Ajoutez un destinataire sous *Réglages → Général → Qui reçoit quoi* et testez-le avec **Tester**. Sans l'application Home Assistant, il n'y a pas de notifications push.

### Je reçois trop de messages.
Vous pouvez désélectionner certains types de messages par destinataire. Pour une seule pièce, il y a l'interrupteur **Notifications pour cette pièce**. Dans la notification elle-même : **Pas aujourd'hui**.

### Pourquoi les messages ne font-ils pas de bruit la nuit ?
Pendant les heures calmes (par défaut 22:00–07:00, plus longues le week-end), les messages arrivent en silence. Seuls les urgents sont sonores : pièce qui se refroidit, fenêtre ouverte alors que personne n'est à la maison, thermostat qui ne répond pas.

### Puis-je utiliser une lumière au lieu d'un message ?
Oui. Ajoutez des lumières sous *Réglages → pièce → Signal lumineux* – elles clignotent en bleu pour « veuillez aérer la pièce » et en orange pour « veuillez fermer », puis reviennent à leur état précédent.

### Puis-je voir le compte à rebours d'aération sur l'écran verrouillé ?
Oui, avec l'application Home Assistant : appuyez sur **📱 Compte à rebours d'aération** pour le téléphone sous *Qui reçoit quoi*. Sur iPhone, il apparaît comme Live Activity (iOS 17.2 ou ultérieur), sur Android comme Live Update.

### Que signifie « le thermostat ne répond pas » ?
Une commande n'a pas atteint le thermostat même après plusieurs tentatives – généralement un problème radio ou une pile vide. Raumklima réessaie toutes les 5 minutes.

> Les messages de l'intégration suivent la langue du système Home Assistant (allemand, français, sinon anglais).

## Économies et rapport

### Combien est-ce que j'économise ?
En règle générale, chaque degré en moins permet d'économiser environ 6 % d'énergie de chauffage. Le **rapport de chauffage** estime les économies liées à l'abaissement pour votre logement.

### Que signifie « ajusté à la météo » ?
Un mois froid nécessite plus de chauffage. « Ajusté à la météo » en tient compte afin de pouvoir comparer équitablement les semaines et les mois.

### Puis-je consulter les valeurs dans Excel ?
Oui : appuyez sur **CSV** en haut à droite du rapport de chauffage.

### Existe-t-il un rapport PDF – aussi par e-mail ?
Oui. La semaine, le mois et la saison de chauffage sont générés automatiquement en PDF ; ils sont listés en bas du rapport de chauffage pour **téléchargement**. Une notification push apporte un lien, un e-mail apporte le PDF en pièce jointe : sous *Général → Notifications – général → PDF par e-mail*, appuyez sur **Configurer l'e-mail**, choisissez votre fournisseur, saisissez utilisateur, mot de passe et destinataires puis appuyez sur **Enregistrer et envoyer un e-mail de test** – aucun YAML nécessaire.

## Divers

### Les cartes ont l'air anciennes après une mise à jour.
Rechargez la page. Dans l'application : *Réglages → Application compagnon → Réinitialiser le cache du frontend*.

### Je ne peux rien modifier sur la page de réglages.
Seuls les administrateurs peuvent modifier les réglages. Les autres voient « Lecture seule ».

### Comment signaler un bug ?
Ouvrez une [issue](https://github.com/Goldi5/Raumklima-2/issues) sur GitHub et joignez le fichier de diagnostics : *Réglages → Appareils et services → Raumklima → pièce → ⋮ → Télécharger les diagnostics*.

### Puis-je trier les pièces dans le tableau de bord ?
L’ordre est **étage → zone → nom**, vous le pilotez donc avec les étages et les zones de Home Assistant (*Paramètres → Zones et étages*) ; les pièces sans étage viennent en dernier. Pour changer : `sort: area` (par zone) ou `sort: name` (par nom) dans la configuration du tableau de bord (`strategy: {type: custom:raumklima, sort: area}`).

### Mon thermostat Tuya (TRV602Z) ignore la consigne

Sur ces appareils, **le préréglage est le mode de fonctionnement** – `system_mode` n'est pas inscriptible :

| Préréglage | Ce que fait l'appareil |
|---|---|
| `comfort` | **régule sur `comfort_temperature`** – c'est le bon mode |
| `eco` | régule sur `eco_temperature` (température d'économie de l'appareil) |
| `auto` | programme hebdomadaire interne |
| `on` | **vanne ouverte en permanence** – chauffe indépendamment de la consigne |
| `off` / `antifrost` | arrêt / hors gel |

**Important :** sur ces appareils, `on` ne signifie pas « manuel » mais **vanne ouverte** – la pièce
chauffe au-delà de la consigne. Depuis la version 0.39.2, Raumklima écrit donc la consigne dans
`comfort_temperature` et sélectionne `comfort`. La pièce affiche alors `target_via: comfort_temperature`.

Si un appareil est sur `on`, la liste de santé signale « Thermostat maintient la vanne ouverte ».
Choisissez **`comfort`** sur l'appareil (ou dans Tuya/Z2M).

## Signaler un problème

### Quelque chose ne fonctionne pas – que joindre ?
Dans la carte, sous *Réglages*, il y a un bouton **Diagnostic** (ou : *Réglages → Appareils → Raumklima → Télécharger le diagnostic*). Le fichier contient tout le nécessaire : versions, vos réglages, les valeurs en direct de chaque pièce, les états bruts de toutes les entités concernées avec leurs attributs, les dernières décisions avec leur motif et les dernières lignes de journal de l'intégration. Les mots de passe, l'accès mail et les coordonnées sont masqués – vous pouvez le joindre tel quel à un ticket.
