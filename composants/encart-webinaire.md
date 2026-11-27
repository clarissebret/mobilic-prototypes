# Encart webinaire

Invitation à la prochaine formation en ligne, en fin d'inscription du gestionnaire.

Code : `.webinaire` dans `prototypes/gestionnaire/app.css`.

## Anatomie

Titre `fr-h5`, texte, puis la session dans un cadre (contour 1 px `--border-default-grey`, sans fond) : la date en colonne centrée (jour abrégé, numéro en `fr-h3` `--text-title-blue-france`, mois et année en `fr-text--xs`), l'heure en gras suivie du titre de la session, et le bouton tertiaire sans bordure « S'inscrire » à droite. La ligne passe à la ligne si la place manque.

## États

| État | Rendu |
|---|---|
| Repos | Bouton « S'inscrire » |
| Inscrit | Bouton inactif « Inscription confirmée » |

## Tokens et espacements

| Élément | Valeur |
|---|---|
| Fond de l'encart | `--background-alt-grey` |
| Padding de l'encart | 32 × 24 px sous 768 px ; 40 × 48 px au-delà |
| Padding du cadre de la session | 24 × 32 px |

16 px entre le titre et le texte, 40 px entre le texte et la session ; dans la session, 40 px entre la date, le titre et le bouton (24 px quand ils passent à la ligne), 12 px entre l'heure et le titre.
