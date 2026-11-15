# Flux : contrôle LIC papier / feuille de route

Interface contrôleur (mobile). L'agent de contrôle contrôle un salarié qui présente un livret individuel de contrôle (LIC) papier ou, en TRS, une feuille de route. Il relève les infractions puis édite, envoie ou exporte le bulletin de contrôle (BDC).

Les données du prototype sont fictives.

## Parcours

1. **Accueil contrôleur** → choix « LIC papier / feuille de route présenté ».
2. **Formulaire de création du contrôle** (salarié, entreprise, véhicule, secteur, « Page du jour remplie »).
   - SIREN de test : `110014016`. Erreur si le SIREN ne fait pas 9 chiffres ou vaut `000000000`.
   - « Créer le contrôle » ouvre la page du contrôle.
3. **Page du contrôle**, en 3 onglets.
   - En-tête : libellé « Contrôle LIC papier / feuille de route » sur 2 lignes.
   - Onglet **Infractions** : badge DSFR avec le nombre d'infractions retenues, placé en haut à droite de l'icône. Masqué s'il n'y en a aucune.
4. **Bulletin de contrôle** en 3 étapes, puis envoi, déclaration « non remis » ou export PDF.

## Secteur TRS (transport sanitaire)

- Le contrôle porte sur le LIC ou la feuille de route. La phrase d'introduction du relevé le précise.
- À l'étape 2 du BDC et dans le PDF, masquer : provenance, destination, type de transport, nature de la marchandise, licence, copie conforme, poids.
- Conserver le pays d'immatriculation.
- Règles des NATINF : « description » (texte à fournir).

## Relevé des infractions

Une seule liste d'infractions est partagée entre l'onglet Infractions, l'étape 3 du BDC et le PDF.

### NATINF du flux

| NATINF | Libellé | Seuil | Règle affichée |
|---|---|---|---|
| 23103 | Tenue non conforme du livret individuel de contrôle | Jour | « description » |
| 11292 | Dépassement(s) de la durée maximale du travail quotidien | Jour | TRM / TRV |
| 11298 | Dépassement(s) de la durée maximale du travail hebdomadaire sur une semaine civile isolée | Semaine | TRMC / TRML / TRMM / TRV |
| 13152 | Non-respect(s) du repos hebdomadaire | Semaine | TRM / TRV |
| 20525 | Non-respect(s) du repos quotidien | Jour | « description » |
| 32083 | Dépassement(s) de la durée maximale de travail de nuit | Jour | TRM / TRV |
| 35187 | Non-respect(s) du temps de pause et/ou dépassement(s) de la durée maximale du travail ininterrompu | Jour | « description » |

Quand le texte d'une règle manque, afficher « description ».

### Composant « accordéon d'infraction »

- Tout l'en-tête est cliquable (bouton avec `aria-expanded`), chevron compris.
- Tous les accordéons sont fermés par défaut. Un seul peut être ouvert à la fois.
- Contour gris si l'infraction n'est pas retenue, bleu Marianne si elle est retenue.
- Ouvert : en-tête sur fond gris clair (`--background-default-grey-hover`).
- Animation d'ouverture de 0,3 s, désactivée si l'utilisateur a demandé moins d'animations (`prefers-reduced-motion`).
- Seuil journalier : sélection des jours dans un calendrier. Seuil hebdomadaire : cases à cocher pour les 4 dernières semaines.
- Les jours ou semaines retenus s'affichent en tags, supprimables en modification, avec 8 px d'écart vertical.

### Modification et annulation

- Barre d'actions fixe en bas de l'écran, pleine largeur, séparée par une bordure supérieure (pas d'ombre) : « Annuler » et « Enregistrer ».
- « Annuler » avec des changements non enregistrés : modale « Confirmation d'annulation ». Sans changement : retour direct.
- « Ajouter une autre infraction » : hors scope, affiche un message.

## Bouton Retour (Android)

Dans l'ordre :
1. ferme la modale ouverte ;
2. sur le formulaire, revient à l'accueil ;
3. sur le contrôle, demande la fermeture du contrôle (ou annule la modification en cours du relevé) ;
4. dans le BDC, revient à l'étape précédente ;
5. sur l'écran des infractions, déclenche l'annulation.

## Questions ouvertes

- Présélection du NATINF 23103 quand « Page du jour remplie » = Non : comportement actuel du prototype, à confirmer.
- Textes des règles des NATINF 20525 et 35187.
- Phrase d'introduction du relevé en TRS.
- Textes des modales d'envoi et « non remis ».
