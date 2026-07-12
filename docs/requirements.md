TEST TECHNIQUE CONSULTANT SENIOR REACT/REACT
NATIVE DEVELOPER
Objectif du document
Ce document sert de support pour un test technique de 3 jours destiné à évaluer un profil
de développeur React Native Senior. Le test simule les contraintes réelles d'
une application
critique : instabilité des données, problématiques lourdes de performance et de threading,
impératif de rigueur architecturale (TypeScript strict) et gestion fine du cycle de vie sur
mobile. API de référence : PokéAPI ( https://pokeapi.co/docs/v2 )
1. Synthèse du Projet : Le "Pokédex Temps Réel sous Stress"
Le candidat doit réaliser une application mobile de type Pokédex avancé composée de 2
écrans principaux.
L'accent n'est pas mis sur le design visuel ("pixel perfect"), mais sur la robustesse du code,
l'optimisation des performances de rendu et la résilience face aux pannes de réseau.
Écran 1 (La Grille de Combat)
Une liste infinie (Infinite Scroll) affichant les Pokémon. Pour simuler une application riches en
données ou de tracking sous stress, les statistiques de chaque Pokémon visible à l'écran
doivent être mises à jour dynamiquement à intervalle très agressif.
Écran 2 (Détails Métier)
Un écran affichant les détails complets (types, évolutions, mouvements) enrichi
d'
un mécanisme de mise en cache pour le mode hors-ligne.
Technologie à utiliser
-
-
-
-
-
-
-
Typescript
@tanstack/react-query
Zustand
react-native-mmkv
@react-navigation
Zod
Nativewind
Le livrable attendu est une application fonctionnelle qui est “ready for deployment”
. Le
code de l’application doit être disponible via un lien public github et une documentation
complète sur son fonctionnement.
Points d’attention sur le livrable final
Architecture, Typage Strict & Robustesse Runtime
●
●
●
Pas de mot-clé any.
Validation stricte au runtime de la structure de l'API avec Zod à l'entrée de
l'application, et gestion des états d'interfaces via des U ni ons D i scri mi nant es .
Avoir des test unitaires et de couverture pour chaque class
Performance & Listes Massives sous Stress
●
On simule un flux temps réel hyper agressif qui modifie les statistiques (ex: les
points de vie ou attaques) des Pokémon visibles à l'écran toutes les 500ms. Le
candidat doit maintenir les threads UI/JS stables à 60 FPS lors d'
un défilement
rapide en exploitant des optimisations avancées.
Expérience Mobile native, Persistance & Tests
●
Intégration d'
une stratégie de mise en cache locale performante (ex: via MMKV ou
SQLite) pour un fonctionnement 100% autonome en mode déconnecté (Offline).
Gestion fine de l'état global de l'OS (AppState) pour couper les timers et flux
asynchrones.
Créativité et capacité d'innovation
-
Au delà de tous les points mentionnés il est recommandé de laisser libre cours à la
capacité d'innovation et créativité. Implémenter ou améliorer le système selon
l'étendu de votre expérience et laissez libre cours à vos idées.
Deadline : Lundi 13 Juillet 2026 à 18h