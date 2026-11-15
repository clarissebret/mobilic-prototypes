# Specs : interface contrôleur

Interface mobile des agents de contrôle. Ce document décrit le comportement attendu du produit et fait foi pour l'implémentation.

## Objectif

Permettre à l'agent de contrôle de contrôler le temps de travail d'un salarié du transport léger ou du déménagement, de relever les infractions et de produire le bulletin de contrôle.

## Utilisateurs et contexte

- **Agent de contrôle**, sur le bord de la route, sur mobile.
- Le salarié contrôlé peut tenir son temps de travail dans Mobilic, sur un livret individuel de contrôle (LIC) papier ou, pour le transport sanitaire (TRS), sur une feuille de route. Il peut aussi ne présenter aucun document.

## Types de contrôle

| Type | Situation | Règles propres |
|---|---|---|
| Contrôle Mobilic | Le salarié utilise Mobilic | À spécifier |
| Contrôle papier | Le salarié présente un LIC papier ou une feuille de route | [Contrôle papier](#contrôle-papier) |
| Contrôle sans LIC | Le salarié ne présente aucun document | À spécifier |

Les trois types partagent le même parcours : création du contrôle, relevé des infractions, bulletin de contrôle. Les règles communes s'appliquent à tous ; chaque type ajoute ses règles propres.

## Règles communes

### Création du contrôle

1. L'agent crée le contrôle depuis l'accueil en choisissant le type de contrôle.
2. L'agent renseigne le salarié, l'entreprise, le véhicule et le secteur d'activité. Les informations obligatoires sont signalées comme telles.
3. L'entreprise est identifiée par son SIREN. Un SIREN invalide est signalé à l'agent avant la création du contrôle.
4. Le contrôle n'est créé que lorsque toutes les informations obligatoires sont valides.

### Relevé des infractions

5. La liste des infractions proposées dépend du type de contrôle et du secteur d'activité.
6. Pour chaque infraction, l'agent indique quand elle a été constatée : par jour, ou par semaine selon l'infraction.
7. Une infraction n'est retenue que si au moins un jour ou une semaine est sélectionné.
8. Le nombre d'infractions retenues est visible depuis la page du contrôle.
9. Les infractions relevées sont les mêmes partout où elles apparaissent : page du contrôle, bulletin de contrôle et export PDF. Une modification à un endroit est reflétée partout.
10. Les modifications ne sont prises en compte que lorsque l'agent les enregistre. S'il quitte le relevé avec des modifications non enregistrées, il lui est demandé de confirmer l'abandon.

### Bulletin de contrôle

11. L'agent complète le bulletin de contrôle en 3 étapes ; il peut revenir à l'étape précédente sans perdre ce qu'il a saisi.
12. Le bulletin reprend les infractions retenues.
13. Une fois le bulletin complété, l'agent peut l'envoyer, indiquer qu'il n'a pas pu être remis, ou l'exporter en PDF.

### Secteur transport sanitaire (TRS)

14. Les informations sans objet pour le transport sanitaire ne sont ni demandées ni affichées : provenance, destination, type de transport, nature de la marchandise, licence, copie conforme et poids. Le pays d'immatriculation reste demandé.
15. Les règles affichées pour chaque infraction sont celles applicables au TRS.

### Navigation

16. Le bouton Retour du téléphone ramène à l'étape précédente sans perte de données silencieuse : il ferme d'abord une fenêtre ouverte, et demande confirmation avant d'abandonner une saisie en cours.

## Contrôle papier

S'applique quand le salarié présente un LIC papier ou une feuille de route.

17. À la création, l'agent indique si la page du jour du LIC est remplie.
18. L'agent relève les infractions à partir du document présenté.
19. En TRS, le contrôle peut porter sur le LIC ou sur la feuille de route ; les textes du parcours mentionnent les deux.

### Infractions proposées

| NATINF | Infraction | Constatée par |
|---|---|---|
| 23103 | Tenue non conforme du livret individuel de contrôle | jour |
| 11292 | Dépassement(s) de la durée maximale du travail quotidien | jour |
| 11298 | Dépassement(s) de la durée maximale du travail hebdomadaire sur une semaine civile isolée | semaine |
| 13152 | Non-respect(s) du repos hebdomadaire | semaine |
| 20525 | Non-respect(s) du repos quotidien | jour |
| 32083 | Dépassement(s) de la durée maximale de travail de nuit | jour |
| 35187 | Non-respect(s) du temps de pause et/ou dépassement(s) de la durée maximale du travail ininterrompu | jour |

## Composants utilisés

- [Accordéon d'infraction](../../composants/accordeon-infraction.md)
- [Barre d'actions fixe](../../composants/barre-actions-fixe.md)
- [Onglets du contrôle](../../composants/onglets-controle.md)
- [Tuile de choix](../../composants/tuile-choix.md)
