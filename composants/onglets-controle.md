# Onglets du contrôle

Navigation entre les sections de la page du contrôle, avec une icône au-dessus du libellé et un compteur optionnel.

Code : `.ctrl-tabs` dans `prototypes/controleur/app.css`.

## Anatomie

Barre d'onglets pleine largeur ; chaque onglet : icône (20 px), libellé (`fr-text--sm`), badge DSFR optionnel.

## États

| État | Rendu |
|---|---|
| Inactif | Texte `--text-default-grey` |
| Actif | Texte `--text-active-blue-france`, graisse 500 (valeur de la maquette, sans classe DSFR équivalente), soulignement `--border-active-blue-france` |

## Badge

- Badge DSFR petit format, variante erreur sans icône (`fr-badge--sm fr-badge--error fr-badge--no-icon`), placé en haut à droite de l'icône.
- Affiche un nombre (ex. infractions retenues). Masqué quand le nombre est 0.

## Tokens

| Élément | Token |
|---|---|
| Séparation basse | `--border-default-grey` |
| Onglet actif | `--text-active-blue-france`, `--border-active-blue-france` |

Espacements (valeurs de la maquette) : 6 px entre l'icône et le libellé, padding de 12 px en haut et 10 px en bas.

## Accessibilité

Rôles `tablist` / `tab` avec `aria-selected`. Le nombre du badge est inclus dans le nom accessible de l'onglet.
