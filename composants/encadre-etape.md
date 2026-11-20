# Encadré d'étape

Fond gris qui regroupe le contenu d'une étape de formulaire en plusieurs étapes (indicateur d'étapes, champs, bouton), sous le titre de la page.

Code : `.encadre` dans `prototypes/gestionnaire/app.css`.

## Anatomie

Sous le titre de page (64 px au-dessus du titre, 40 px dessous), indicateur d’étapes DSFR en tête (32 px dessous), puis le contenu, puis le groupe de boutons en taille LG (`fr-btn--lg`), aligné à droite à partir de 768 px (32 px au-dessus). Les cartes posées dedans (ex. [Carte d'établissement](carte-etablissement.md)) ont un fond `--background-default-grey`.

## Tokens et espacements

| Élément | Valeur |
|---|---|
| Fond | `--background-alt-grey` |
| Padding | 32 px × 16 px sous 768 px ; 40 px × 48 px au-delà |

Dans l'encadré, 32 px entre les champs et entre les groupes de champs, pour aérer le formulaire.

La marge basse du DSFR sous le dernier groupe de boutons est neutralisée, pour garder 40 px de padding en bas.
