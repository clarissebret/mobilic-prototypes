# Encart webinaire

Invitation à la prochaine formation en ligne, en fin d'inscription du gestionnaire.

Code : `.webinaire` dans `prototypes/gestionnaire/app.css`.

## Anatomie

Titre `fr-h5`, texte, puis une ligne : la date (jour abrégé, numéro en `fr-h4`, mois et année, texte `--text-title-blue-france`), l'heure en gras suivie du titre de la session en `fr-text--sm`, et le bouton tertiaire sans bordure SM « S'inscrire ». La ligne passe à la ligne si la place manque.

## États

| État | Rendu |
|---|---|
| Repos | Bouton « S'inscrire » |
| Inscrit | Bouton inactif « Inscription confirmée » |

## Tokens et espacements

| Élément | Valeur |
|---|---|
| Fond de l'encart | `--background-alt-grey` |
| Fond de la date | `--background-contrast-grey`, padding 8 px |
| Padding de l'encart | 32 × 24 px sous 768 px ; 40 × 48 px au-delà |

8 px entre le titre et le texte, 24 px entre le texte et la ligne, 16 px entre les éléments de la ligne.
