# Raumklima – documentation (français)

🇩🇪 [Deutsche Dokumentation](../de/README.md) · 🇬🇧 [English documentation](../en/README.md)

**Version actuelle : 1.1.0b6** – modifications dans le [CHANGELOG](../../CHANGELOG.md) · prévu : [ROADMAP](../../ROADMAP.md)

**Raumklima** transforme chaque thermostat de radiateur (TRV) de Home Assistant en thermostat d’ambiance intelligent : il régule selon une vraie sonde dans la pièce, se met en pause quand une fenêtre est ouverte, vous guide pour aérer, abaisse la température quand personne n’est là – avec protection contre les moisissures – et ne chauffe que quand il fait vraiment froid dehors.

> Raumklima est en **version de test (early release)**. La traduction française est nouvelle – les corrections sont les bienvenues via une [issue](https://github.com/Goldi5/Raumklima-2/issues).

## Pages

| Page | Sujet |
|---|---|
| [Installation et configuration](installation.md) | HACS, première pièce, réglages généraux, Matter/Thread |
| [Utilisation](utilisation.md) | Tableau de bord, cartes, rapport, journal, page de réglages |
| [Fonctionnement](fonctionnement.md) | Régulation, décalage, fenêtres, fiabilité, aération, absence, protection anti-moisissure, saison de chauffage |
| [Notifications](notifications.md) | Qui reçoit quoi, heures calmes, heures de sommeil, actions, voix |
| [Commande vocale](commande-vocale.md) | Interroger Assist, connecter un agent IA, limites d'Alexa et cie |
| [Référence](reference.md) | Tous les réglages, entités, déclencheurs d’appareil, événements |
| [Appareils & thermostats](appareils.md) | Ce que chaque appareil sait faire, particularités et limites |
| [FAQ](faq.md) | Questions fréquentes pour débuter |
| [Dépannage](depannage.md) | Problèmes et solutions |
| [Développement](developpement.md) | Tests, construction de la carte, structure du code |

## En bref

- **Régulation selon la sonde de la pièce** au lieu de la sonde du radiateur – décalage (offset) automatique ou compensation de consigne.
- **Fenêtre ouverte = pause**, puis reprise avec le réglage précédent ; fenêtre ouverte détectée aussi **sans contact** grâce à la chute de température. Plusieurs radiateurs et autant de contacts de fenêtre que nécessaire par pièce.
- **Particules fines (PM2,5) :** capteur optionnel par pièce – dès 35 µg/m³ Raumklima conseille d’aérer, sous 15 µg/m³ l’air est considéré comme renouvelé.
- **Pièce de surveillance :** une pièce sans thermostat – mesurer, rappeler, rapporter, avec sa propre grande carte ; les consignes ne sont jamais touchées.
- **Apprentissage & pourquoi :** vitesse de montée apprise avec fiabilité, heures de sommeil, profil de présence et un onglet décisions avec justification; page de contrôle « Pourquoi la pièce chauffe-t-elle (ou pas) ? ».
- **Assistant d’aération** : humidité et CO₂, durée d’aération selon la température extérieure, « l’aération assèche-t-elle vraiment ? », alerte « la pièce se refroidit », **aération nocturne** ; compte à rebours sur l’écran verrouillé et **signal lumineux**.
- **Absence** : habitants + zone, abaissement « absence courte » / « absence prolongée », préchauffage selon la distance et l’heure d’arrivée, calendrier (vacances, télétravail), **détecteurs de présence** (mmWave et PIR).
- **Saison de chauffage** selon la moyenne journalière et la prévision météo, côté ensoleillé, nuits de gel.
- **Notifications** par destinataire, heures calmes, heures de sommeil apprises, annonces vocales.
- **Rapports PDF** (semaine, mois, saison) avec note A–F, comparaison avec l’année précédente, conseils d’économie – en téléchargement, en push ou **par e-mail**.
- **Contrôle de santé** : piles, radio, sonde bloquée, « la pièce ne chauffe pas », équilibrage hydraulique; prévision des piles et alerte en cas de trop nombreuses commandes radio.
- **Tableau de bord 2.0** avec « Aujourd’hui » (aperçu, énergie et apprentissage), cartes de pièces, historique, chronologie, rapport, journal des décisions et page de réglages entièrement modifiable – en allemand, anglais ou français selon la langue de Home Assistant. La carte énergie affiche compteur, tarif, autoconsommation PV et coûts sur 7/30/90 jours ; la carte apprentissage affiche vitesse de montée, utilisation, profil d’aération, présence et heures de sommeil. L’ombrage commande les volets sélectionnés au soleil et la nuit – automatique, conseil seulement ou arrêt. Le plancher chauffant reçoit sa propre régulation lente avec départ/retour et alerte de débit. La climatisation peut chauffer lorsque le COP et le prix du gaz sont plus avantageux. Le rapport PDF peut être envoyé avec pièce jointe via l’intégration SMTP de Home Assistant. Le modèle d’apprentissage 2.0 apprend la vitesse de montée, la perte de chaleur et l’apport solaire, et s’arrête plus tôt avant la consigne. La régulation de vanne sans à-coups pilote directement un actionneur `number`. Les climatiseurs refroidissent avec une consigne séparée et une protection anti-cycle. La demande de chaleur agrège toutes les pièces et propose une température de départ. Les tarifs dynamiques et le surplus PV sont affichés. L’historique compare la température réelle et prédite. Le mode démo montre des pièces simulées sans matériel. L’assistant de configuration guide à travers toutes les facettes.

## Installation

1. **HACS** → ⋮ → **Dépôts personnalisés** → `https://github.com/Goldi5/Raumklima-2`, catégorie **Intégration**.
2. Chercher **Raumklima** dans HACS → **Télécharger**, puis redémarrer Home Assistant.
3. **Paramètres → Appareils et services → Ajouter une intégration → Raumklima** : choisir le thermostat, la sonde de la pièce, les fenêtres et le type de pièce.
4. **Paramètres → Tableaux de bord → + Ajouter un tableau de bord → Raumklima** – le tableau de bord se construit tout seul.

**Avant de commencer**, désactivez sur le thermostat ses propres plannings, sa détection de fenêtre et ses modes « boost » – sinon le thermostat et Raumklima travaillent l’un contre l’autre.

## Quels thermostats ?

Tout thermostat de radiateur qui apparaît comme entité `climate` dans Home Assistant et dont on peut régler la température – Zigbee, Z-Wave, Wi-Fi, Shelly, Matter/Thread ou cloud (Tado, Netatmo). Sans réglage de décalage, Raumklima utilise automatiquement la compensation de consigne. Testé jusqu’ici : Tuya TRV602Z (Zigbee2MQTT). Détails : [Quels thermostats fonctionnent ?](installation.md#quels-thermostats-fonctionnent-)

## Langue

| Partie | Français |
|---|---|
| Assistants de configuration | ✅ |
| Tableau de bord et cartes, explications « ? » | ✅ |
| Rapports PDF | ✅ |
| Notifications push, journal et messages d’erreur | ✅ (selon la langue du système Home Assistant) |
| Documentation détaillée et manuel PDF | ✅ en français, allemand et anglais |

## Aide

- Installation et première pièce : [installation](installation.md) · Questions fréquentes : [FAQ](faq.md) · Problèmes : [dépannage](depannage.md)
- Documentation en d’autres langues : [allemand](../de/README.md) · [anglais](../en/README.md)
- Signaler un bug ou une idée : [issues GitHub](https://github.com/Goldi5/Raumklima-2/issues)
