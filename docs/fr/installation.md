# Installation et configuration

## Prérequis

- Home Assistant **2026.5** ou plus récent (pour la stratégie du tableau de bord ; l’intégration elle-même fonctionne depuis 2025.10)
- [HACS](https://hacs.xyz)
- Par pièce : un thermostat de radiateur comme entité `climate` et une sonde de température. Une sonde d’humidité et des contacts de fenêtre sont facultatifs mais recommandés ; une sonde de CO₂ est également facultative.
- Pour la détection d’absence : des personnes avec la localisation de leur téléphone (application Home Assistant Companion) et une zone pour le domicile.

## Installation via HACS

1. HACS → ⋮ → **Dépôts personnalisés** → `https://github.com/Goldi5/Raumklima-2`, catégorie **Intégration**.
2. Rechercher **Raumklima** et le télécharger.
3. Redémarrer Home Assistant.

Les cartes du tableau de bord se chargent automatiquement – aucune ressource supplémentaire n’est nécessaire.

## Première pièce

**Paramètres → Appareils et services → Ajouter une intégration → Raumklima**

1. Choisir le **thermostat**.
2. **Sondes et fenêtres** – Raumklima propose les sondes de température, d’humidité et de CO₂ ainsi que les contacts de fenêtre de la même zone. Cochez-les, c’est fait. Plusieurs radiateurs dans la pièce ? Choisissez les autres thermostats sous **Autres thermostats de cette pièce** – ils reçoivent les mêmes commandes, chacun avec son propre contrôle et sa propre correction. Autant de contacts de fenêtre que nécessaire fonctionnent (pause dès que l’un est ouvert).
3. **La pièce** – type de pièce (définit des valeurs par défaut judicieuses), en option la température souhaitée et les valeurs d’abaissement. Les réglages techniques (calibration, préréglage, délais) sont détectés automatiquement et se trouvent sous **Avancé**.
4. **Première pièce uniquement : pour tout le domicile** – qui habite ici, la zone du domicile, qui reçoit les notifications, la source météo, le type de bâtiment.

La pièce apparaît alors comme un appareil, et une seconde entrée **Allgemein** (général) regroupe tout ce qui concerne l’ensemble du domicile.

> **Astuce :** désactivez au préalable la détection de fenêtre propre du thermostat (`window_detection`) et désactivez les anciennes automatisations liées au même TRV.

## Autres pièces

Comme ci-dessus, sans l’étape 4 – les destinataires, la présence et la saison de chauffage s’appliquent automatiquement à toutes les pièces.

## Tableau de bord

- **Prêt à l’emploi en quatre étapes :**
  1. *Réglages → Tableaux de bord → **Ajouter un tableau de bord*** – titre p. ex. « Chauffage ». Le nom est
     libre ; il n’a pas besoin d’être « Raumklima » (et ce nom est peut-être déjà pris).
  2. Le nouveau tableau de bord affiche d’abord **le tableau de bord standard** de Home Assistant – c’est
     normal, la stratégie vient à l’étape suivante.
  3. En haut à droite **Modifier** (crayon) → **menu à trois points → Modifier la configuration brute** →
     remplacer tout le contenu par :

     ```yaml
     strategy:
       type: custom:raumklima
     ```

  4. **Enregistrer** – terminé : les onglets *Pièces*, *Historique*, *Messages* et *Réglages* sont construits
     automatiquement et s’enrichissent quand des pièces sont ajoutées.

  La carte est enregistrée automatiquement comme ressource ; une ancienne ressource est basculée sur la
  nouvelle version.
- **Second logement :** *Créer un logement* crée aussi son tableau de bord (chemin `heizung-<nom>`,
  stratégie Raumklima, filtré sur ce logement). Le sélecteur en haut y mène directement.
- **Planning par pièce :** dans l’onglet *Réglages* → pièce → **Planning** (jusqu’à six plages horaires avec
  jours de la semaine, de/à et température cible).
- **Ordre des pièces :** **étage → zone → nom** ; les pièces sans étage viennent en dernier. Pour changer :
  `sort: area` (par zone) ou `sort: name` (par nom) dans la configuration du tableau de bord
  (`strategy: {type: custom:raumklima, sort: area}`) – la valeur par défaut est `floor`.
- **Vos propres tableaux de bord :** utilisez les cartes individuellement – voir [Utilisation](utilisation.md).

## Quels thermostats fonctionnent ?

Raumklima pilote **tout thermostat de radiateur qui apparaît comme entité `climate` dans Home Assistant** et dont la température peut être réglée – que ce soit via Zigbee, Z-Wave, Wi-Fi, Bluetooth, Matter/Thread ou un cloud.

| | Utilisé pour | Si absent |
|---|---|---|
| **Température réglable** (obligatoire) | régulation | ne fonctionne pas |
| **Relevé de température propre** | compensation : de combien il fait plus chaud directement au radiateur | Raumklima régule selon la sonde de la pièce, sans compensation |
| **Réglage du décalage** (nombre de type « calibration de température ») | correction à l’intérieur du thermostat | **compensation de consigne** automatique – Raumklima règle le thermostat plus haut ou plus bas en conséquence ; fonctionne avec tous les appareils |
| **Position de la vanne** | rapport, avis « le radiateur ne suit pas » | seules ces analyses manquent |
| **Extinction** (préréglage « off », mode « off ») | pause avec fenêtre ouverte, pause de chauffage | Raumklima règle la température la plus basse |

**Avant de commencer, désactivez sur le thermostat :** ses propres **plannings**, sa propre **détection de fenêtre** et les modes **boost**/automatiques – sinon le thermostat et Raumklima travaillent l’un contre l’autre. Désactivez les anciennes automatisations liées aux mêmes thermostats.

### Remarques par type d’appareil

- **Zigbee (par ex. Tuya, Aqara, Danfoss, Bosch, Moes) :** généralement avec réglage du décalage et température propre – idéal. Les appareils Tuya via Zigbee2MQTT ne rapportent souvent le décalage qu’après qu’il a été réglé une première fois ; Raumklima le fait automatiquement.
- **Shelly (Shelly TRV, Shelly BLU TRV via passerelle BLU) :** apparaissent comme entités `climate` via l’intégration Shelly officielle. Le fait que le décalage et la position de la vanne soient transmis à Home Assistant dépend du modèle et du firmware – sans décalage, la compensation de consigne est utilisée.
- **Matter et Thread (par ex. Eve Thermo, Bosch, Aqara) :** généralement pas de préréglages mais un mode « off » – laissez *Extinction via* sur **Automatique**. Souvent sans décalage → **compensation de consigne**. Les appareils Thread sur pile ne se signalent que toutes les quelques secondes : si « thermostat ne répond pas » apparaît souvent, augmentez *Vérifier la commande après* sous *Technique* à 30–40 s.
- **Appareils cloud (par ex. Tado, Netatmo) :** fonctionnent, mais réagissent avec un délai. Raumklima vérifie chaque commande et la répète – augmentez *Vérifier la commande après* si les avis sont fréquents. Pas d’internet, pas de régulation.
- **Homematic, Z-Wave & co. :** comme ci-dessus – tant qu’il s’agit d’une entité `climate`. Avec la radio à cycle de service (Homematic), évitez les changements trop fréquents ; le frein contre trop de commandes apporte une protection supplémentaire.

### Thermostats testés

| Thermostat | Connexion | Statut |
|---|---|---|
| Tuya TRV602Z | Zigbee2MQTT | ✅ testé (décalage, position de la vanne, préréglages) |
| Shelly TRV / BLU TRV | Shelly | ❔ pas encore testé – retours bienvenus |
| Eve Thermo, Aqara, Bosch (Matter) | Matter/Thread | ❔ pas encore testé |

Votre thermostat fonctionne (ou non) ? Merci de le signaler comme [issue](https://github.com/Goldi5/Raumklima-2/issues) – avec le modèle, la connexion et ce qui fonctionne. C’est ainsi que cette liste s’agrandit.

## Mise à jour

HACS affiche les nouvelles versions. Après le téléchargement, redémarrez Home Assistant. Les modifications des cartes seules sont visibles après un rechargement de la page.

## Migration depuis 0.2.x

Au premier démarrage de la version 0.3 ou ultérieure, **Allgemein** est créé automatiquement et les destinataires, les heures calmes et la source météo sont repris depuis vos pièces. Ensuite, choisissez simplement **habitants et zone** (page des réglages → Général) pour activer la détection d’absence.
