Tree.js Sphere Catcher

But du jeu

Tree.js Sphere Catcher est un jeu d'arcade en 3D où le joueur doit attraper des sphères tombant du ciel à l'aide d'un panier contrôlé par le clavier ou la souris. Le but est de marquer le plus de points possible tout en progressant à travers des niveaux de difficulté croissante. Le jeu met à l'épreuve les réflexes, la précision et la capacité d'adaptation du joueur.

Concept et expérience utilisateur

L'objectif principal est de créer une expérience simple mais engageante, accessible à tous les âges. Le jeu est conçu pour être rapide à prendre en main, avec une courbe de difficulté progressive qui maintient l'intérêt du joueur.

Simplicité : Les contrôles sont intuitifs et les règles du jeu sont faciles à comprendre.
Progression : La difficulté augmente avec le score, ajoutant plus de sphères à attraper et rendant le jeu plus exigeant.
Compétition : Les scores sont enregistrés et affichés dans un classement, encourageant les joueurs à se surpasser.
Choix de game design
Mécaniques de jeu :

Le joueur commence avec 3 vies.

À chaque sphère manquée, une vie est perdue.
Le jeu se termine lorsque toutes les vies sont perdues.
Le score augmente à chaque sphère attrapée, et des niveaux sont atteints à des seuils de score spécifiques.

Progression de la difficulté :

Le nombre de sphères générées augmente avec le score.
Les sphères tombent plus rapidement à mesure que le joueur progresse.
Les niveaux sont utilisés pour indiquer la progression et motiver le joueur.
Interface utilisateur :

Les informations essentielles (score, vies restantes, niveau, nombre de sphères) sont affichées en haut de l'écran dans une boîte semi-transparente pour ne pas gêner la visibilité du jeu.
Les boutons "Start Game" et "Rejouer" sont clairement visibles et accessibles.
Esthétique :

Le jeu utilise un style minimaliste en 3D avec des sphères colorées et un arrière-plan neutre pour garder le focus sur l'action.
Les couleurs et les animations sont conçues pour être dynamiques et engageantes.
Technologies utilisées
Three.js :

Utilisé pour le rendu 3D et la gestion des sphères.
Permet de créer une expérience visuelle immersive et fluide.
React :

Fournit une structure modulaire pour gérer les états du jeu (score, vies, niveau, etc.).
Facilite l'intégration des composants d'interface utilisateur.
API Backend :

Les scores des joueurs sont enregistrés via une API REST.
Les joueurs peuvent consulter un classement global pour comparer leurs performances.
Tailwind CSS :

Utilisé pour styliser l'interface utilisateur avec des classes utilitaires.
Permet une personnalisation rapide et cohérente des éléments visuels.
Objectifs du projet
Engagement :

Créer un jeu addictif qui incite les joueurs à rejouer pour améliorer leur score.
Accessibilité :

Offrir une expérience fluide sur différents appareils (ordinateurs, tablettes, etc.).
Les contrôles sont simples et adaptés à tous les types de joueurs.
Compétition sociale :

Encourager les joueurs à se connecter et à enregistrer leurs scores pour apparaître dans le classement.
Améliorations futures

Ajout de power-ups :

Des bonus pourraient être ajoutés pour augmenter le score, ralentir les sphères, ou regagner des vies.
Modes de jeu :

Mode "Survie" : Les sphères tombent de plus en plus vite sans limite de niveau.
Mode "Challenge" : Objectifs spécifiques à atteindre dans un temps limité.
Personnalisation :

Permettre aux joueurs de personnaliser leur panier ou les couleurs des sphères.
Multijoueur :

Ajouter un mode compétitif où deux joueurs s'affrontent pour attraper le plus de sphères.
Conclusion
Tree.js Sphere Catcher est un jeu conçu pour offrir une expérience amusante et compétitive, tout en étant accessible et engageant. Grâce à sa simplicité et à sa progression dynamique, il vise à captiver les joueurs et à les encourager à se dépasser. Ce projet est également une opportunité d'explorer les technologies modernes comme Three.js et React, tout en mettant en œuvre des concepts de game design efficaces.