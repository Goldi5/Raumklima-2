# Appareils & thermostats

Ce que Raumklima sait faire avec quel appareil – et où sont les limites. Tout ici provient de
retours d’utilisateurs et de nos propres mesures ; la liste s’allonge à chaque rapport.

> **Principe :** Raumklima ne remplace pas les fonctions de l’appareil, il les dirige. Donc :
> **un seul cerveau par pièce** – soit Raumklima régule, soit une automatisation de l’appareil le fait.
> Les programmes horaires et le boost dans l’appareil ou dans l’appli du fabricant doivent être
> désactivés, sinon deux régulateurs se disputent la même vanne.

## Vue d’ensemble

| Appareil | Intégration | Fonctionne bien | Limites |
|---|---|---|---|
| Thermostat de radiateur Tuya | Zigbee2MQTT | consigne, presets, position de vanne, pile | `preset: on` signifie *ouvert en permanence* – utilisé en interne comme `comfort` + `comfort_temperature` |
| Moes BRT-100-TRV | Zigbee2MQTT | consigne, préréglages, position de vanne, température mesurée | Signale la position de vanne via son propre `sensor.…_position` – Raumklima l’utilise comme source. Préréglages `none/programming/manual/temporary_manual/holiday` ; plage 0–35 °C, limitée à 6–30 °C |
| Aqara E1 | Zigbee2MQTT | consigne, fenêtre, pile | ne signale aucun état de chauffe ; l’état est déduit de la demande |
| Homematic IP / CCU | intégration Homematic | consigne, position de vanne, bidirectionnel | retour souvent après 10 à 20 minutes (radio, économie de pile) |
| Livisi / RWE SmartHome | intégration Livisi | consigne, fenêtre | **pas d’offset sur l’appareil** – Raumklima apprend une compensation lissée |
| Sonoff TRVZB | ZHA | consigne, offset via `number.<name>_lokaler_temperatur_offset` | se met en veille régulièrement ; pas de position de vanne, pas de presets |
| Netatmo | intégration Netatmo | consigne, sonde de pièce | lent ; position de vanne souvent absente |
| FRITZ!DECT (Comet, 440) | AVM FRITZ!SmartHome | consigne, sonde de pièce | position de vanne souvent vide ; programmes de l’appareil à désactiver |
| Bosch Smart Home (SHc) | Bosch Smart Home | consigne, position de vanne (`sensor.…_ventilstoessel`), arrêt via mode | **pas de presets** (`preset_mode` toujours vide) ; **température minimale 18 °C** – l’extinction via la température minimale est impossible, Raumklima utilise donc le mode « off » ; le programme de pièce dans l’app Bosch doit être désactivé |

## Ce dont chaque appareil a besoin

- **Un thermostat `climate`** dans la pièce. Sans lui, utilisez une **pièce de surveillance** (mesurer,
  rappeler, rapporter – sans toucher aux consignes).
- **Une sonde de pièce est recommandée, pas obligatoire.** Sans elle, Raumklima régule avec la sonde du
  thermostat – il n’y a alors pas de compensation d’offset, mesure et chauffe étant au même endroit.
- **Contact(s) de fenêtre** en `binary_sensor` (les capteurs d’ouverture et `cover` fonctionnent aussi).
  Plusieurs fenêtres par pièce sont possibles ; ouverte reste ouverte.
- **La position de vanne est optionnelle.** Si l’appareil ne la fournit pas, la tuile affiche « – ».
  C’est voulu : mieux vaut rien qu’une valeur devinée.

## Particularités à connaître

### Tuya (Zigbee2MQTT)
Les presets existent, mais **`preset: on` signifie « vanne ouverte en permanence »** – un réglage de
secours, pas un niveau de chauffe. Raumklima utilise donc `comfort` et écrit la consigne dans
`comfort_temperature`. Le programme hebdomadaire interne de l’appareil doit être supprimé, sinon il
écrase les consignes.

### Aqara E1 (Zigbee2MQTT)
L’appareil ne fournit ni `hvac_action`, ni `running_state`, ni position de vanne. Raumklima déduit
« chauffe/atteint » de l’écart entre température de la pièce et consigne – sinon l’état resterait
bloqué sur « erreur ».

### Homematic IP / CCU
Fonctionne dans les deux sens (Raumklima → appareil, molette → Raumklima), mais la CCU signale les
changements avec retard. Pour une détection de vanne plus rapide, activez par pièce
*Thermostat & sonde → **Interrogation rapide*** : interrogation active toutes les deux minutes – au
prix de la pile.

### Livisi / RWE SmartHome
L’offset ne peut pas être réglé sur l’appareil. Raumklima apprend donc l’écart entre sonde de pièce et
sonde de l’appareil (lissé, limité à ±4 K) et renvoie la consigne ajustée toutes les dix minutes. Le
journal affiche « Abgleich −2,3° » et l’attribut `offset_auto`.

### Sonoff TRVZB (ZHA)
L’offset passe par `number.<name>_lokaler_temperatur_offset`. L’appareil **se met en veille**, les
ordres ne sont souvent confirmés qu’après plusieurs tentatives. Ces valeurs ont fait leurs preuves :

- **Vérifier l’ordre après :** 45 s (au lieu de 20 s)
- **Intervalle minimal d’offset :** 15 min
- **Seuil :** 0,5 °C

Pas de position de vanne ni de presets – seulement chauffe et arrêt. Si vous utilisiez *Versatile
Thermostat* en mode vanne : **vérifiez les angles d’ouverture et de fermeture** (souvent 0/100) et
mettez les deux à 100, sinon la vanne reste fermée.

### Netatmo
Retour très lent. Désactivez les programmes dans l’appli Netatmo, sinon ils régulent contre Raumklima.
La position de vanne manque sur de nombreux modèles.

### FRITZ!DECT (Comet, DECT 440)
Désactivez programmes et boost dans la FRITZ!Box. La position de vanne est souvent vide, le niveau de
pile reste remonté.

### Bosch Smart Home (SHc)
Les thermostats de la centrale Bosch n’ont **aucun preset** – `preset_mode` est toujours vide et Raumklima
n’écrit que la consigne. La **température minimale est de 18 °C** : une pièce ne peut donc pas être
éteinte via la température minimale, *Extinction via* reste sur **Automatique**, ce qui détecte le mode
« off ». La position de vanne vient d’un capteur séparé (`sensor.…_ventilstoessel`). Les programmes et
scènes de l’app Bosch doivent être désactivés, sinon ils écrasent la consigne.

## Quand quelque chose affiche « – »

| Affichage | Signification |
|---|---|
| Vanne « – » | l’appareil ou l’intégration ne fournit pas la position de vanne |
| Pile vide/« – » | l’appareil ne remonte pas le niveau de pile (p. ex. certains appareils ZHA) |
| État « sonde absente » | sonde de pièce injoignable – Raumklima conserve la dernière valeur pendant une heure |
| Preset absent | l’appareil n’a pas de presets ; Raumklima utilise chauffe/arrêt |

## Partager votre expérience

Comportement différent, ou appareil absent de cette liste ? Ouvrez un ticket avec le **fichier de
diagnostic** (Réglages → *Diagnostic*) – il contient l’intégration, les entités et les dernières
décisions, sans identifiants.
