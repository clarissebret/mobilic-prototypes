# Specs : interface contrôleur

Ce document décrit le comportement attendu de l'interface contrôleur. Il fait foi pour l'implémentation.

Chaque règle a un identifiant stable (ex. `REL-03`) : il ne change pas quand on ajoute ou supprime d'autres règles, et un identifiant supprimé n'est jamais réutilisé.

## Utilisateurs et contexte

### Qui contrôle

L'interface est utilisée par l'ensemble des corps habilités à contrôler le temps de travail dans le transport routier léger et le déménagement :

- agents de contrôle des transports ;
- inspecteurs du travail ;
- forces de l'ordre ;
- agents de l'URSSAF.

### Où

- **En bord de route** : contrôle d'un salarié en activité, sur mobile, souvent debout et en extérieur. L'agent doit pouvoir créer le contrôle et relever les infractions rapidement.
- **En entreprise** : contrôle dans les locaux de l'entreprise.

### Ce qui est contrôlé

Un contrôle se caractérise par deux dimensions indépendantes.

**Le type de contrôle**, selon ce que le salarié présente pour justifier de son temps de travail :

| Type de contrôle | Le salarié présente |
|---|---|
| Contrôle Mobilic | Son temps de travail saisi dans Mobilic |
| Contrôle papier | Un livret individuel de contrôle (LIC) papier, ou une feuille de route en transport sanitaire |
| Contrôle sans LIC | Aucun document |

**L'activité** de l'entreprise contrôlée :

| Activité | Code |
|---|---|
| Transport de marchandises | TRM |
| Déménagement | À préciser |
| Transport de voyageurs | TRV |
| Transport sanitaire | TRS |

Les infractions proposées et certaines informations demandées dépendent de ces deux dimensions. Les règles ci-dessous sont communes, sauf mention « selon le type de contrôle » ou « selon l'activité ». Dans ces tableaux, une case vide signifie que la règle n'est pas encore spécifiée pour ce cas.

## Parcours

Le parcours est le même pour tous les types de contrôle :

1. création du contrôle ;
2. relevé des infractions ;
3. bulletin de contrôle.

## 1. Création du contrôle

- **CRE-01** L'agent crée le contrôle depuis l'accueil en choisissant le type de contrôle.
- **CRE-02** L'agent renseigne le salarié, l'entreprise, le véhicule et l'activité. Les informations obligatoires sont signalées comme telles.
- **CRE-03** L'entreprise est identifiée par son SIREN : l'agent saisit le numéro et lance la recherche, le nom et l'adresse de l'entreprise sont alors complétés. Une erreur est signalée sous le champ avant la création du contrôle :

  | Cas | Message |
  |---|---|
  | Champ vide | Saisissez le numéro SIREN de l'entreprise. |
  | Le numéro ne fait pas 9 chiffres | Saisissez un numéro SIREN de 9 chiffres, par exemple 123 456 789. |
  | Aucune entreprise ne correspond | Aucune entreprise ne correspond à ce numéro SIREN. Vérifiez le numéro saisi. |
  | La recherche n'a pas pu aboutir (réseau, service indisponible) | La recherche n'a pas abouti. Vérifiez votre connexion et réessayez. |
- **CRE-04** Le contrôle n'est créé que lorsque toutes les informations obligatoires sont valides.

### Selon le type de contrôle

| Règle | Mobilic | Papier | Sans LIC |
|---|---|---|---|
| **CRE-05** L'agent indique si la page du jour du LIC est remplie | | Oui | |

## 2. Relevé des infractions

- **REL-01** Pour chaque infraction, l'agent indique quand elle a été constatée : par jour, ou par semaine selon l'infraction.
- **REL-02** Une infraction n'est retenue que si au moins un jour ou une semaine est sélectionné.
- **REL-03** Le nombre d'infractions retenues est visible depuis la page du contrôle.
- **REL-04** Les infractions relevées sont les mêmes partout où elles apparaissent : page du contrôle, bulletin de contrôle et export PDF. Une modification à un endroit est reflétée partout.
- **REL-05** Les modifications ne sont prises en compte que lorsque l'agent les enregistre. S'il quitte le relevé avec des modifications non enregistrées, il lui est demandé de confirmer l'abandon.
- **REL-06** Les infractions proposées dépendent du type de contrôle et de l'activité (voir [Infractions](#infractions)).
- **REL-07** Pour chaque infraction, la règle affichée est celle qui s'applique à l'activité contrôlée.

### Selon le type de contrôle

| Règle | Mobilic | Papier | Sans LIC |
|---|---|---|---|
| **REL-08** L'agent relève les infractions à partir du document présenté | | Oui | |

## 3. Bulletin de contrôle

- **BDC-01** L'agent complète le bulletin de contrôle en 3 étapes ; il peut revenir à l'étape précédente sans perdre ce qu'il a saisi.
- **BDC-02** Le bulletin reprend les infractions retenues.
- **BDC-03** Une fois le bulletin complété, l'agent peut l'envoyer, indiquer qu'il n'a pas pu être remis, ou l'exporter en PDF.

### Selon l'activité

| Règle | TRM | Déménagement | TRV | TRS |
|---|---|---|---|---|
| **BDC-04** Provenance, destination, type de transport, nature de la marchandise, licence, copie conforme et poids sont demandés et affichés | Oui | | | Non |
| **BDC-05** Le pays d'immatriculation est demandé | Oui | | | Oui |

## Accueil

- **ACC-01** L'accueil présente les derniers contrôles de l'agent, regroupés par jour, du plus récent au plus ancien. Chaque jour est intitulé « Aujourd’hui » ou par sa date complète (ex. « Samedi 14 novembre 2026 »).
- **ACC-02** Pour chaque contrôle sont affichés : le salarié, le véhicule, l'heure, le lieu de contrôle, le type de contrôle, le statut du bulletin de contrôle, l'entreprise, le nombre de jours contrôlés et le nombre d'infractions retenues.
- **ACC-03** Le statut du bulletin de contrôle est l'un des suivants :

  | Statut | Situation |
  |---|---|
  | Remis | Le bulletin a été envoyé ou remis au salarié |
  | En attente d'envoi | Le bulletin a été créé mais pas encore envoyé ni remis |
  | Non créé | Aucun bulletin n'a été créé pour ce contrôle |

- **ACC-04** En sélectionnant un contrôle dans « Derniers contrôles », l'agent le rouvre et retrouve la page du contrôle telle qu'il l'a laissée.

## Navigation

- **NAV-01** Le bouton Retour du téléphone ramène à l'étape précédente sans perte de données silencieuse : il ferme d'abord une fenêtre ouverte, et demande confirmation avant d'abandonner une saisie en cours.

## Textes propres à une activité

| Activité | Texte |
|---|---|
| TRS | Le relevé des infractions porte sur la feuille de route : « Sélectionnez les infractions que vous souhaitez verbaliser à partir de la feuille de route présentée : » |
| Autres activités | Le relevé des infractions porte sur le LIC : « Sélectionnez les infractions que vous souhaitez verbaliser à partir du livret individuel de contrôle présenté : » |

## Infractions

Infractions proposées par type de contrôle. Les différences par activité seront ajoutées dans ce tableau.

| NATINF | Infraction | Constatée par | Papier |
|---|---|---|---|
| 23103 | Tenue non conforme du livret individuel de contrôle | jour | Oui |
| 11292 | Dépassement(s) de la durée maximale du travail quotidien | jour | Oui |
| 11298 | Dépassement(s) de la durée maximale du travail hebdomadaire sur une semaine civile isolée | semaine | Oui |
| 13152 | Non-respect(s) du repos hebdomadaire | semaine | Oui |
| 20525 | Non-respect(s) du repos quotidien | jour | Oui |
| 32083 | Dépassement(s) de la durée maximale de travail de nuit | jour | Oui |
| 35187 | Non-respect(s) du temps de pause et/ou dépassement(s) de la durée maximale du travail ininterrompu | jour | Oui |

## Composants utilisés

- [Accordéon d'infraction](../../composants/accordeon-infraction.md)
- [Barre d'actions fixe](../../composants/barre-actions-fixe.md)
- [Onglets du contrôle](../../composants/onglets-controle.md)
- [Tuile de choix](../../composants/tuile-choix.md)
