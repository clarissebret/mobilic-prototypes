# Tuile de choix

Bouton pleine largeur pour choisir un type de contrôle depuis l'accueil.

Code : `.choice` dans `prototypes/controleur/app.css`.

## Anatomie

Icône à gauche, libellé, chevron à droite. Toute la tuile est cliquable.

## États

| État | Rendu |
|---|---|
| Repos | Contour `--border-default-grey` |
| Survol | Fond `--background-default-grey-hover` |

## Tokens

| Élément | Token |
|---|---|
| Icône | `--text-title-blue-france` |
| Chevron | `--text-action-high-blue-france` |

Espacements : padding 16 px, 12 px entre l'icône et le libellé, 12 px entre deux tuiles.

## Accessibilité

`<button>` natif ; icône et chevron décoratifs (`aria-hidden`).
