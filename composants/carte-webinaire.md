# Carte webinaire

Invite le gestionnaire à s'inscrire à un webinaire, en bas du menu latéral de l'espace gestionnaire. Inspirée de la carte DSFR (lien étendu à toute la carte), en plus compacte.

Code : `.carte-webinaire` dans `prototypes/gestionnaire/app.css`. Pictogramme : « community » du DSFR, dans sa version de 120 px (`prototypes/gestionnaire/picto-community.svg`, plus récente que celle du paquet npm 1.15.4).

## Anatomie

- Zone image de 120 px de haut, fond `--background-alt-blue-france`, pictogramme centré de 120 px (marges comprises).
- Zone texte, padding 16 px : lien DSFR petit format avec flèche à droite (`fr-link fr-link--sm fr-link--icon-right fr-icon-arrow-right-line`), sans soulignement.
- Bordure 1 px `--border-default-grey`, fond `--background-default-grey`.

## États

| État | Rendu |
|---|---|
| Repos | Fond `--background-default-grey` |
| Survol | Fond `--background-default-grey-hover` |

## Usage

- Affichée en bas du menu latéral à partir de 768 px, 24 px au-dessus du bas de la fenêtre. Masquée en dessous (le menu latéral y est replié).

## Accessibilité

Toute la carte est cliquable (`fr-enlarge-link`) ; le lien porte le nom accessible. Le pictogramme est décoratif (`alt=""`).
