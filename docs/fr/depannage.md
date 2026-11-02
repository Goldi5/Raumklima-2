# Dépannage

**La pièce ne chauffe pas alors qu’il fait froid.**
Regardez la sonde de statut. *Chauffage en pause* : il fait doux dehors – forcez avec **Chauffer aujourd’hui** ou le mode **Toujours chauffer**. *Abaissé* : personne n’est compté comme présent – vérifiez les habitants et la zone, ou montez la température (suspend l’abaissement pendant 3 h). *Fenêtre ouverte* : vérifiez le contact. L’onglet **Journal** indique la raison de chaque décision.

**La vanne reste ouverte en permanence (TRV602Z).**
Sur le TRV602Z, le préréglage « on » signifie *vanne ouverte*. Raumklima utilise automatiquement un préréglage qui régule selon la consigne. Sous *Modifier les appareils et réglages techniques* → pièce → *Avancé* → *Allumer avec*, il doit être indiqué « Automatique » ou « eco ».

**Le thermostat et l’intégration se modifient mutuellement en boucle.**
Certains thermostats changent de préréglage tout seuls (par ex. eco ↔ confort chez Tuya). Raumklima considère ces préréglages comme équivalents, adopte un préréglage vers lequel le thermostat revient sans cesse, et se met en pause pendant 15 minutes après plus de 40 commandes en 10 minutes (signalé dans le contrôle de santé). Vérifiez les plannings ou les modes automatiques du thermostat et les autres automatisations.

**La détection d’absence se trompe, par ex. à cause d’un VPN.**
Raumklima ignore les sauts impossibles et les localisations imprécises, et compte une personne comme présente tant que **l’un** de ses téléphones est dans la zone. Vérifiez ce qui arrive dans l’attribut `persons` de *Présence*. Pour les visiteurs, il y a l’interrupteur **Invités**, ou bien utilisez un événement de calendrier tel que « télétravail ».

**« Le thermostat ne répond pas ».**
Le TRV n’a pas confirmé une commande (radio, VPN, pile vide). Raumklima réessaie toutes les 5 minutes. Vérifiez la connexion Zigbee et la pile. Avec les appareils Thread, augmenter *Vérifier la commande après* à 30–40 s aide.

**« Le radiateur ne suit pas » dans le contrôle de santé.**
La vanne est presque entièrement ouverte depuis longtemps et la pièce atteint rarement sa consigne. Causes fréquentes : un équilibrage hydraulique manquant, une température de départ de chaudière trop basse, ou un radiateur trop petit pour la pièce. Purger le radiateur ne fait pas de mal non plus.

**Pas de CSV / rapport vide.**
Le rapport commence à collecter les données dès l’installation de l’intégration ; des valeurs significatives apparaissent après quelques jours.

**Les cartes semblent anciennes.**
Rechargez la page. Dans l’application : Réglages → Application Companion → *Réinitialiser le cache de l’interface*.

**Les cartes sont en allemand.**
Les cartes suivent la langue de votre profil Home Assistant (allemand, français, sinon anglais). Les entrées du journal et les messages push suivent la langue du système sous *Réglages → Système → Général* ; les entrées plus anciennes du journal conservent la langue dans laquelle elles ont été écrites.

**La page de réglages n’est pas modifiable.**
Seuls les administrateurs peuvent modifier les réglages. Les autres utilisateurs voient « Lecture seule ».

**Diagnostics pour un rapport de bug.**
Réglages → Appareils et services → Raumklima → pièce ou Allgemein → ⋮ → *Télécharger les diagnostics*. Ouvrez ensuite une issue sur GitHub.
