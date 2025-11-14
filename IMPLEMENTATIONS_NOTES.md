# Implementations notes

Vous retrouverez ici les commentaires sur l'implémentation de l'application Tamagocho. (#PourMarius)

## Choix d'implémentations

J'ai décidé, par contrainte de temps, d'implémenter l'ensemble des fonctionnalités obligatoire + la connexion GOOGLE :

- Connexion via github et GOOGLE (prod et locale)
- Ajout des accéssoires
- Ajout des backgrounds
- Création du système de quêtes
- Visibilité des créatures publiques et privées

### Création du système de quêtes

Le système de quête fonctionne en associant 3 quêtes aléatoires aux utilisateurs en utilisant le système CRON de vercel. Les quêtes sont définies dans un fichier de config. Ce fichier pourrait dans le futur, servir de fichier de template de quêtes pour éviter la répétabilité des quêtes. Les quêtes terminées rapportent des KOINS aux utilisateurs.

### Connexion via GITHUB

Les utilisateurs peuvent se connecter via github à l'application.
La page d'**_inscription_** ne propose pas de création de compte github puisque la création est automatique lors de la connexion.

## Les difficultés rencontrées

- Adapter la génération des accéssoires de manière à correspondre à celle des créatures
- Utiliser l'IA générative afin d'appliquer le plan d'optimisation sur l'application. (fait en partie à la main)
- L'utilisation de serveur actions (transformées en edges functions par vercel) en production et leur connexion/utilisation de la base de données mongoDB Atlas.
  - génération d'erreurs -> Timeout buffer (edge functions cold start)
- "Hydration mismatch" du à aux zones géographiques des serveurs et clients.

## Les optimisations réalisés

- Cron Vercel pour la mise à jour des quêtes
- Ajout de useMemo et useCallback sur les composants et fonctions appellés régulièrement. (appels setInterval)

## Les améliorations possibles

L'application pourrait avoir besoin d'une amélioration de l'expériance utilisateur et particulièrement sur le placement des différents éléments sur l'interface.

De plus , la sur-utilisation des setInterval afin de récupérer des données ou d'en envoyer limite l'application. Nous devrions les remplacer par des fonctions CRON (payantes avec vercel) ou des fonctions watch() de MongoDB.

Nous pouvons aussi imaginer un cycle de vie plus poussé pour les monstres. Avec des actions à réaliser avant un certain temps pour eviter certaines conséquences. Cela permettrait de se rapprocher de la nature des tamagotchi originels.

Enfin, il est possible de mettre en place un systeme saisonnier pour des accéssoires ou des couleurs de créatures uniques.

## Utilisation de l'IA pendant ce projet

Pendant ce projet, j'ai pris la décision de réaliser les partie métier (backend) à la main. Cela comprend la création de server actions, des models mongoDB et la création de certains types associés.
Cette partie étant plus associée à la conception et la reflexion de l'application, il me semblait plus pertinent quelle ne soit pas réalisée par une IA.

Je trouve notamment que l'intelligence artificielle générative à du mal à utiliser à son plein potentiel les Types typescript. Elle n'utilise pas les types Omit, Pick ou Partial... De manière générale elle semble être très verbeuse et à du mal à créer des fonctions atomiques.

Pour approfondir l'utilisation de l'IA, je lui ai laissé (avec des conseils) réaliser la fonctionnalité de quêtes journalières. La fonctionnalité à été réalisé avec succès, non sans refactoring et correction de bugs.

De manière générale je pense que ce projet fut une bonne introduction à l'utilisation de l'intelligence artificielle générative dans un projet dev.
Cependant, sauf MVP et POC, je ne pense pas utliser l'ia de cette manière dans des projets en entreprise.
L'IA permet de gagner du temps dans des phases d'exploration ou de Time To Market très courtes, elle est cepandant à proscrire **AUJOURD'HUI** si l'on souhaite construire des projets maintenables, robustes et durables.
