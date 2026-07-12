# ZPokedex

ZPokedex est une application Expo SDK 56 de type Pokédex React Native conçue pour le test technique senior React Native décrit dans `docs/requirements.md`.

## Résumé exécutif

L’application affiche une grille infinie de Pokémon, charge les données depuis PokéAPI, valide les réponses avec Zod, simule des statistiques de combat sur les cartes visibles toutes les 500 ms, puis propose une vue de détail avec un mécanisme de cache hors ligne via MMKV.

Le projet est structuré pour être clair, robuste et facile à expliquer : le rendu UI est séparé de la couche API, de la couche cache et du cycle de vie applicatif.

## Statut de livraison

Ce dépôt est préparé comme une livraison d’application Expo prête pour le déploiement.
La base de code est vérifiée via les scripts du projet, et ce README est conçu comme une documentation de prise en main opérationnelle pour lancer, expliquer et livrer l’application.

## Ce qui est implémenté

- grille infinie de Pokémon alimentée par PokéAPI
- validation runtime des réponses API via Zod à la frontière réseau
- TanStack Query pour la pagination et l’état serveur mis en cache
- store Zustand pour les IDs des Pokémon visibles
- simulation de statistiques de combat sur les cartes visibles toutes les 500 ms
- pause de la simulation selon l’état de l’application et la route active
- écran de détail sur `/pokemon/[id]` avec types, statistiques de base, mouvements, description de l’espèce et chaîne d’évolution
- cache des détails via MMKV pour un fallback hors ligne après un chargement réseau réussi
- configuration NativeWind, Expo Router, FlashList, TypeScript strict, Jest Expo et React Native Testing Library

## Architecture de l’application

Le projet est organisé en plusieurs couches claires et cohérentes :

```text
src/app/                    Entrée Expo Router et routes
src/components/pokemon/     Grille, cartes, stats et interface de détail
src/features/pokemon/api/   Client PokéAPI, schémas Zod et normalisateurs
src/features/pokemon/cache/ Cache MMKV des détails
src/features/pokemon/hooks/ Hooks de requêtes et de simulation de stress
src/features/pokemon/state/ Store runtime Zustand
src/lib/                    Query client, cycle de vie, réseau et stockage
```

L’intention architecturale est simple :

- `src/features/pokemon/api/` gère la frontière externe avec l’API et la validation des payloads.
- `src/features/pokemon/hooks/` orchestre les requêtes et le comportement runtime.
- `src/components/pokemon/` rend l’interface utilisateur.
- `src/lib/` regroupe les briques partagées comme le stockage, la configuration React Query et la détection du cycle de vie.

## Flux d’exécution

L’application fonctionne de cette manière :

1. Le layout racine Expo Router démarre le shell de l’application.
2. L’écran d’accueil affiche la grille infinie de Pokémon.
3. React Query charge les pages paginées depuis PokéAPI.
4. Zod valide la réponse réseau avant que l’application ne l’accepte.
5. Les données normalisées sont envoyées vers l’UI de la grille.
6. FlashList suit les cartes visibles et met à jour le store runtime des IDs visibles.
7. Le hook de stress met à jour uniquement les statistiques des Pokémon visibles toutes les 500 ms.
8. Lorsqu’un utilisateur ouvre une fiche détail, le hook détail récupère les données complémentaires puis les stocke localement.
9. Si le réseau échoue ensuite, la vue détail revient sur le cache MMKV et affiche l’état cache.

## Prérequis

- Node.js compatible avec Expo SDK 56
- npm
- Pour tester MMKV sur un appareil ou simulateur natif, utiliser un développement build
- Le mode web utilise l’implémentation web de MMKV

## Installation

Installer les dépendances :

```bash
npm install
```

Lancer l’application web :

```bash
npm run web -- --port 8082
```

Si le port `8082` est déjà utilisé, choisissez un autre port libre.

Lancer l’application Android :

```bash
npx expo run:android
```

Lancer l’application iOS :

```bash
npx expo run:ios
```

## Vérification

Les commandes suivantes sont les validations supportées du projet :

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
```

État vérifié dans l’espace de travail actuel :

- `npm run typecheck` : OK, code de sortie `0`
- `npm run lint` : OK, code de sortie `0`
- `npm test -- --runInBand` : OK, `7/7` suites passées et `38/38` tests passés
- Vérification web : `HTTP/1.1 200 OK` sur `http://localhost:8082`

## En une phrase pour l’explication orale

> « Ce projet est une application Expo React Native qui charge un Pokédex infini, valide les données réseau avec Zod, simule les statistiques des cartes visibles en temps réel et offre un écran de détail avec cache local hors ligne. »

## Explication orale en 1 minute

L’application présente une grille infinie de Pokémon alimentée depuis PokéAPI. Elle valide les réponses à la frontière API avec Zod pour garantir une entrée sûre dans l’application, puis elle garde un état léger avec Zustand sur les cartes visibles seulement. La logique de stress met à jour les statistiques de ces cartes visibles toutes les 500 ms, ce qui donne le côté “temps réel” demandé par le test technique. La vue de détail récupère les informations complémentaires, puis les enregistre dans MMKV pour permettre un affichage hors ligne après un premier chargement réussi.

## Explication technique en 3 minutes

Le point clé du projet est la séparation des responsabilités.

- la couche `api` construit les URLs, exécute les appels réseau et valide les réponses à l’aide de Zod ;
- la couche `hooks` orchestre les requêtes React Query et les états de chargement, erreur et cache ;
- la couche `state` garde un petit état runtime uniquement sur les IDs visibles ;
- la couche `components` rend la grille et les cartes avec une approche optimisée pour la liste ;
- la couche `cache` fournit le fallback hors ligne via MMKV.

Cette architecture permet de garder le code lisible, de maîtriser les périmètres de mise à jour et de réduire le coût de rendu sur les listes volumineuses.

## Stratégie offline

Les détails sont mis en cache dans MMKV après une réponse réseau réussie et validée.
Si la requête détail échoue plus tard, le hook détail renvoie le record normalisé issu du cache et l’UI affiche explicitement une source `cache`.

Cela permet à l’application d’avoir un vrai fallback hors ligne pour l’écran détail sans affaiblir la validation réseau.

## Stratégie de performance

La grille suit les Pokémon visibles par le biais des callbacks de visibilité de FlashList et réduit au minimum la surface de mise à jour des états.
Seuls les IDs des cartes réellement visibles sont envoyés dans la boucle de simulation de stress, ce qui évite une mise à jour globale excessive pendant le scrolling.

L’affichage des statistiques est séparé des données d’identité plus lentes pour garder l’UI réactive même sur des listes importantes et très actives.

## Stratégie de test

Le dépôt contient une couverture unitaire ciblée sur :

- les frontières de validation Zod
- la normalisation des réponses API
- le comportement du cache MMKV
- la gestion du cycle de vie et de l’état actif
- la logique de simulation sur les cartes visibles

## Checklist de déploiement

Avant la mise en production finale, il faut vérifier les points suivants :

1. Publier le dépôt sur une URL GitHub publique.
2. Vérifier que les métadonnées Expo dans `app.json` sont correctes pour le package cible et l’identité de release.
3. Tester un build natif sur Android et/ou iOS.
4. Vérifier que MMKV fonctionne correctement sur la cible native réellement utilisée pour le test de release.
5. Valider l’application avec les conditions réseau attendues en production.
6. Tenir le README et les notes d’architecture à jour à chaque évolution du dépôt.

## Points forts

- architecture claire avec séparation nette entre API, hooks, UI et cache
- validation runtime forte via Zod sur la frontière réseau
- stratégie de performance ciblée sur les cartes visibles seulement
- fuite de données hors ligne maîtrisée avec MMKV pour le détail
- couverture de test orientée sur les chemins critiques métier

## Points d’attention

- le comportement natif de splash et l’intégration Expo doivent être validés sur build natif réel avant remise finale
- la dépendance externe PokéAPI doit être considérée comme un point de fragilité réseau en production
- les tests couvrent bien la logique métier, mais la validation finale doit rester appuyée par un test manuel sur cible native

## Verdict final

Le projet est cohérent, bien séparé en couches, testé sur les chemins principaux et prêt à servir de base de travail pour une présentation ou une remise technique.

## Contraintes connues du projet

- Expo Go n’est pas la cible idéale pour valider tout le comportement natif.
- MMKV est mieux vérifié à partir d’un développement build sur un appareil ou simulateur natif.
- PokéAPI est une dépendance externe, donc la disponibilité réseau et la forme des payloads doivent être considérées lors de la release.
- L’application est conçue pour une expérience de liste réactive et doit être testée sur du matériel réel pour obtenir une vraie confiance de release.

## Résumé

ZPokedex est une implémentation propre avec Expo Router, React Query, Zod et MMKV, avec un contrat runtime solide et une stratégie de performance bien pensée.
Le dépôt passe déjà les vérifications clés, et ce README documente maintenant le projet dans un style de documentation de livraison exploitable.
