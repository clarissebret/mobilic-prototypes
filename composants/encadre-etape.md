# Encadré d'étape

Fond gris qui regroupe le contenu d'une étape de formulaire en plusieurs étapes (indicateur d'étapes, champs, bouton), sous le titre de la page.

Code : `.encadre` dans `prototypes/gestionnaire/app.css`.

## Anatomie

Indicateur d'étapes DSFR en tête (32 px dessous), puis le contenu, puis le groupe de boutons aligné à droite à partir de 768 px (32 px au-dessus). Les cartes posées dedans (ex. [Carte d'établissement](carte-etablissement.md)) ont un fond `--background-default-grey`.

## Tokens et espacements

| Élément | Valeur |
|---|---|
| Fond | `--background-alt-grey` |
| Padding | 32 px × 16 px sous 768 px ; 40 px × 48 px au-delà |

La marge basse du DSFR sous le dernier groupe de boutons est neutralisée, pour garder 40 px de padding en bas.
