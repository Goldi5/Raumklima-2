# Commande vocale

RaumKlima peut être interrogé à la voix. Tout dépend d'**un** point : quel assistant entend la question.

| Voie | Peut répondre aux questions RaumKlima ? |
|---|---|
| **Assist avec un agent IA** (ChatGPT, Google, Anthropic, Ollama) | **Oui** – valeur actuelle, consigne, humidité, motif et conseil d'aération |
| **Assist sans IA** (agent standard) | Seulement « Quelle température dans … ? » – sans motif ni conseil d'aération |
| **Alexa, Siri, enceintes Google Home** | **Non** – ces assistants fonctionnent chez Amazon, Apple et Google et n'atteignent pas RaumKlima |

Cette différence compte : un Echo n'est pas un appareil Assist. Interroger l'enceinte, c'est interroger Amazon – pas Home Assistant.

## 1. Créer un pipeline avec un agent IA

Sans pipeline, personne n'entend RaumKlima. Le pipeline relie micro, reconnaissance vocale, un **agent de conversation** et la réponse.

1. *Réglages → Assistants vocaux → **Ajouter un assistant***
2. **Nom :** par ex. « Raumklima »
3. **Langue :** la vôtre
4. **Reconnaissance vocale :** Home Assistant Cloud, ou local (Whisper)
5. **Synthèse vocale :** Home Assistant Cloud, ou local (Piper)
6. **Agent de conversation :** l'intégration IA, par ex. **ChatGPT**, **Google Generative AI**, **Anthropic** ou **Ollama**
7. Enregistrer et marquer comme **préféré** – les satellites Assist et l'application l'utilisent alors.

:::tip
L'agent doit gérer les **appels d'outils**. Les quatre cités le font. Un simple modèle de texte ne peut pas récupérer les données des pièces.
:::

**Important :** l'agent a besoin d'un compte valide avec du crédit. Sans crédit, le pipeline répond avec l'erreur du fournisseur (OpenAI : « Insufficient funds ») – sans rapport avec RaumKlima.

## 2. Activer RaumKlima dans l'intégration IA

Chaque intégration IA ne transmet au modèle que les outils sélectionnés sous **Contrôle de Home Assistant**. RaumKlima y figure comme entrée propre et doit être coché une fois.

1. *Réglages → Appareils et services →* ouvrir l'intégration IA (par ex. **OpenAI Conversation**)
2. **Reconfigurer** (ChatGPT) ou refaire une fois l'installation de l'intégration (Google n'a pas de boîte d'options)
3. Sous **Contrôle de Home Assistant**, sélectionner **Raumklima** en plus de **Assist**
4. Enregistrer – les outils sont disponibles immédiatement, sans redémarrage

L'assistant connaît alors trois outils :

| Outil | Usage |
|---|---|
| `raumklima_rooms` | Quelles pièces existent, avec valeur actuelle et consigne |
| `raumklima_room_status` | Actuel, consigne, humidité, CO₂, fenêtre, motif, besoin d'aérer |
| `raumklima_set_room_temperature` | Régler la température souhaitée |

## 3. Ce que vous pouvez demander

- « Quelle température dans la salle de bain ? » → *« 21,3 °C, consigne 19,0 °C. »*
- « Dois-je aérer le salon ? » → *« Oui, environ 10 minutes – humidité 71 %. »* ou *« Non, 45 % et 600 ppm de CO₂. »*
- « Pourquoi la chambre est-elle abaissée ? » → *« Heures calmes, consigne 16,0 °C. »*
- « Mets la pièce de sport à 19 degrés » → règle la température souhaitée (pièces en surveillance exclues)

On interroge via un **satellite Assist** (par ex. Home Assistant Voice, satellite ESPHome) ou le micro de l'application Home Assistant.

## 4. Sans agent IA

L'agent standard de Home Assistant utilise des phrases fixes. « Quelle température dans la salle de bain ? » y fonctionne dès que la pièce a une **zone** – RaumKlima la crée lors de l'installation. Il ne comprend pas les questions sur le motif, le besoin d'aérer ou l'humidité.

## 5. Alexa, Siri et enceintes Google Home

Ces assistants répondent dans leur propre cloud. Ils ne voient jamais les outils RaumKlima, et RaumKlima ne peut pas s'y brancher.

- **Alexa :** via Nabu Casa Cloud et la skill Alexa, on peut allumer/éteindre les radiateurs et fixer des consignes – rien de plus, et il faut un abonnement cloud actif.
- **Siri/HomeKit :** uniquement les consignes, via le pont HomeKit.
- **Pour les questions**, il faut un satellite Assist ou l'application. Un Echo ne peut pas prendre ce chemin.

## 6. Quand la réponse est fausse

| Symptôme | Cause |
|---|---|
| « Insufficient funds », « quota exceeded » | Crédit ou clé du fournisseur IA – pas RaumKlima |
| Réponse sans chiffres, discours général | « Raumklima » n'est pas activé dans l'intégration IA (étape 2) |
| « Plusieurs appareils trouvés » | L'agent standard trouve plusieurs thermostats dans la zone – utiliser un agent IA ou nommer les zones de façon unique |
| Mauvaise pièce avec deux logements | Des noms identiques sont ambigus : renommer les zones (« Bad logement A », « Bad logement B ») ou utiliser le nom affiché par RaumKlima |

Les outils réellement appelés par le modèle figurent dans *Réglages → Assistants vocaux →* la dernière exécution (trace).
