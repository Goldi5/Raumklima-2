# Notifications

## Qui reçoit quoi

Sous **Réglages → Général → Qui reçoit quoi**, vous choisissez pour chaque destinataire les messages qu’il reçoit :

| Message | Quand | Par défaut |
|---|---|---|
| 💧 Veuillez aérer la pièce | humidité au-dessus de la limite pendant 15 min et l’aération assèche – ou CO₂ à partir de 1000 ppm (🫁) | push |
| 🪟 Fermez la fenêtre | durée d’aération recommandée atteinte | push |
| 🥶 La pièce se refroidit | en dessous de la température minimale ou refroidissement trop important | push + voix |
| ✅ Air renouvelé | humidité de nouveau sous la limite (et CO₂ sous 800 ppm) | push, silencieux |
| 🚪 Fenêtre ouverte, personne à la maison | fenêtre ouverte > 2 min, tous les habitants absents | push |
| 🏠 Absence et préchauffage | tout le monde absent, absence prolongée, « quelqu’un arrive – préchauffage », retour | désactivé |
| 🍂 Début/fin de la saison de chauffage | la saison de chauffage commence, pause de chauffage, coup de froid | push |
| ⚠️ Thermostat ne répond pas | commande non confirmée après toutes les tentatives | push + notification HA |
| 🩺 Contrôle de santé du chauffage | pile faible, la pièce ne chauffe pas malgré une vanne ouverte, sonde bloquée, radio instable, contact de fenêtre muet – au plus une fois par jour et par problème | push, silencieux |
| 📊 Rapport hebdomadaire | dimanches 18:00 : heures de chauffage, comparaison ajustée à la météo, abaissement, pièces trop humides – avec un **PDF** (ainsi que le mois le 1er et le bilan de saison), voir [Rapports PDF](utilisation.md#rapports-pdf) | push, silencieux |
| 📱 Compte à rebours d’aération sur l’écran verrouillé | fenêtre ouverte pour aérer – voir [ci-dessous](#compte-a-rebours-daeration-sur-lecran-verrouille) | désactivé, application uniquement |

Les **destinataires** sont des services `notify`, par ex. `notify.mobile_app_iphone` ou votre propre service comme `notify.a`. **Tester** envoie un message d’exemple.

> Les textes des messages suivent la langue du système Home Assistant (*Réglages → Système → Général*) : allemand, français, sinon anglais.

## Apprentissage des heures de sommeil

L’intégration apprend quand vous vous couchez et quand vous vous levez :

- **à partir de l’aération nocturne :** fenêtre de la chambre ouverte le soir = heure du coucher, fermée le matin = lever.
- **à partir de signaux de sommeil** (facultatif, par ex. les lumières du salon) : tout éteint pendant 20 minutes le soir = heure du coucher, une allumée le matin = lever. Avec les signaux, les heures calmes s’appliquent aussi en direct : lumières éteintes → calme, lumières allumées le matin → éveillé.

Chaque nuit compte son événement le plus précoce, les jours de semaine et les week-ends (ven→sam, sam→dim) séparément ; à partir de 4 nuits, la valeur typique des 6 dernières semaines s’applique. Les heures calmes commencent alors 30 minutes avant l’heure du coucher et se terminent 30 minutes après le lever – **mais jamais plus courtes que configuré**. La fenêtre d’aération nocturne est prolongée de la même manière. À configurer et consulter sous *Général → Heures de sommeil*. Choisissez un Land allemand sous *Jours fériés* pour traiter la nuit précédant un jour férié comme un week-end.

## Aération nocturne

Les personnes qui dorment la fenêtre ouverte ne doivent pas être réveillées. Si une fenêtre de chambre s’ouvre entre **20:00 et 03:00** et que quelqu’un est à la maison, la pièce passe en **aération nocturne** :

- Le chauffage reste éteint tant que la fenêtre est ouverte ; les autres pièces chauffent normalement.
- Aucun avis « fermez la fenêtre » ni « la pièce se refroidit ».
- Si la pièce descend sous **12 °C**, un avertissement silencieux est émis une fois par nuit.
- À la fin des heures calmes (07:00), vous recevez « ☀️ Fenêtre toujours ouverte – le chauffage attend », puis au plus toutes les 30 minutes. Dès que la fenêtre est fermée, la pièce chauffe de nouveau.

Par pièce, sous *Réglages → pièce → Fenêtres → Dormir la fenêtre ouverte* : **Automatique** (chambre et « rarement utilisée »), **Oui** ou **Non**. Fenêtre horaire et limite d’avertissement sous *Général → Notifications – général*.

## Alerte tempête et pluie

Raumklima lit les rafales et la pluie de la prévision météo configurée pour le logement. Si une
**tempête** (par défaut dès 70 km/h) ou de **fortes pluies** (dès 8 mm/h) sont annoncées dans les six
prochaines heures et qu’une fenêtre est ouverte, vous recevez une alerte avec l’heure et les pièces
concernées – une fois par événement, même pendant les heures calmes, car elle est urgente. Les seuils et
l’interrupteur se trouvent sous *Réglages → Général → Notifications*.

## Boutons de notification (iPhone/Android)

Les messages d’aération ont trois boutons :
- **Fait** – 15 minutes de silence
- **Me rappeler dans 15 min**
- **Pas aujourd’hui** – silencieux jusqu’à minuit pendant la journée, le soir (« jusqu’à demain matin ») jusqu’à la fin des heures calmes

Un message est retiré automatiquement dès qu’il ne s’applique plus, par ex. lorsque la fenêtre est fermée.

## Compte à rebours d’aération sur l’écran verrouillé

Lorsque vous ouvrez une fenêtre pour aérer, votre téléphone affiche un **compte à rebours** avec la durée d’aération recommandée – sur l’iPhone en **Live Activity** (écran verrouillé et Dynamic Island), sur Android en **Live Update** (écran verrouillé, volet de notifications, barre d’état).

- **Bleu, minuteur en cours :** fenêtre ouverte, par ex. 5 min recommandées.
- **Vert :** air renouvelé – vous pouvez fermer.
- **Orange :** durée d’aération atteinte – veuillez fermer.
- **Rouge :** la pièce se refroidit – veuillez fermer maintenant.

Lorsque la fenêtre est fermée, l’affichage disparaît. Appuyer dessus ouvre le tableau de bord Raumklima.

**Activation :** *Réglages → Général → Qui reçoit quoi* → appuyez sur **📱 Compte à rebours d’aération sur l’écran verrouillé** pour le téléphone. Ce type de message n’est proposé que pour les destinataires `notify.mobile_app_…` (application Home Assistant).

**Prérequis :** application Home Assistant à jour ; iPhone avec iOS 17.2 ou version ultérieure et Home Assistant 2026.7 ou version ultérieure ; le téléphone doit joindre Home Assistant lorsque vous êtes dehors (accès distant). Sur l’iPhone, confirmez l’avis sur l’écran verrouillé la première fois. Si l’affichage reste bloqué : *Réglages iOS → Home Assistant → Live Activities* désactivé puis réactivé.

Le minuteur tourne sur le téléphone lui-même – Raumklima n’envoie une mise à jour que lorsque l’état change, ce qui économise la batterie et le quota de push. Pas pendant l’aération nocturne et pas lorsque la fenêtre a seulement été détectée à partir d’une chute de température.

> Les textes sur l’écran verrouillé suivent eux aussi la langue du système Home Assistant.

## Signal lumineux dans la pièce

Les lumières de la pièce peuvent clignoter au lieu d’un message push (ou en plus de celui-ci) – pratique pour tous ceux qui n’ont pas de téléphone en main. Sous *Réglages → pièce → Signal lumineux* :

1. **Ajouter une lumière** – une ou plusieurs entités `light` (jusqu’à 10).
2. Appuyez sur **Clignoter pour** :

| Couleur | Quand | Par défaut |
|---|---|---|
| 🔵 Bleu | Veuillez aérer la pièce | activé |
| 🟠 Orange | Veuillez fermer / la pièce se refroidit | activé |
| 🟢 Vert | Air renouvelé | désactivé |
| 🔴 Rouge | Problème avec le chauffage (contrôle de santé) | désactivé |

3. **Tester** fait clignoter les lumières en bleu une fois.

Les lumières clignotent trois fois puis reviennent à leur état initial – une lumière éteinte s’éteint de nouveau, une lumière allumée retrouve sa luminosité et sa couleur. Les lumières sans couleur clignotent simplement en vif. **Pas de signal lumineux** pendant les heures calmes, pendant l’aération nocturne ou lorsque personne n’est à la maison. Chaque signal est écrit dans le journal.

## Heures calmes

Par défaut 22:00–07:00. Pendant les heures calmes, les messages push arrivent de manière **silencieuse**. Seuls les messages urgents émettent un son : *la pièce se refroidit*, *fenêtre ouverte, personne à la maison* et *thermostat ne répond pas*. Les annonces vocales n’ont jamais lieu pendant les heures calmes.

Le **week-end** (sam/dim), les heures calmes se terminent plus tard – par défaut 09:00, configurable sous *Général → Notifications – général → Week-end jusqu’à*.

## Annonces vocales

Une enceinte peut aussi être ajoutée comme destinataire, par ex. Alexa via `notify.alexa_media_…`. Par défaut, elle n’annonce que *la pièce se refroidit* et, pour *fermez la fenêtre*, à partir du troisième rappel.

## Mise en sourdine par pièce

Chaque pièce dispose de l’interrupteur **Avis pour cette pièce**, par ex. pour une chambre d’amis qui ne sert qu’aux visites.

## Répétition

Tant qu’un problème persiste, un rappel revient toutes les 5 minutes (configurable). *Veuillez aérer la pièce* revient au plus toutes les 30 minutes. « La pièce se refroidit » est sonore au plus trois fois ; ensuite, il le rappelle silencieusement toutes les 30 minutes tant que la pièce est trop froide.
