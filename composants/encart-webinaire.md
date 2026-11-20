# Encart webinaire

Invitation à la prochaine formation en ligne, en fin d'inscription du gestionnaire.

Code : `.webinaire` dans `prototypes/gestionnaire/app.css`.

## Anatomie

- Introduction : pictogramme DSFR « self-training » (64 px, masqué sous 576 px), titre `fr-h5` et texte.
- Session : bloc blanc avec la date (jour abrégé, numéro en `fr-h4`, mois et année, contour `--border-default-grey`, texte `--text-title-blue-france`), le titre de la session en gras et ses informations en `fr-text--sm` `--text-mention-grey`, puis un bouton secondaire SM « S'inscrire » (pleine largeur sous 576 px).

## États

| État | Rendu |
|---|---|
| Repos | Bouton « S'inscrire » |
| Inscrit | Bouton inactif « Inscription confirmée » |

## Tokens et espacements

| Élément | Valeur |
|---|---|
| Fond de l'encart | `--background-alt-blue-france` |
| Fond de la session | `--background-default-grey` |
| Padding de l'encart | 32 × 24 px sous 768 px ; 40 × 48 px au-delà |
| Padding de la session | 16 px |

24 px entre l'introduction et la session, et entre le pictogramme et le texte ; 8 px entre le titre et le texte ; 16 px entre les éléments de la session.
