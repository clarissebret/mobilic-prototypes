# Section repliable

Regroupe un tableau (ou tout contenu) sous un titre qui l'ouvre et le referme. Plusieurs sections s'empilent sans espace entre elles.

Code : `.section-repliable` dans `prototypes/gestionnaire/app.css`.

## Anatomie

- En-tête (56 px de haut au minimum) : bouton titre (titre `h3` en `fr-text--lg`, chevron `fr-icon-arrow-down-s-line` de 16 px à gauche, badge DSFR `fr-badge--sm` optionnel pour un nombre), puis une action optionnelle à droite (bouton DSFR tertiaire sans bordure, petit format).
- Corps : bandeaux éventuels puis contenu, 16 px entre eux ; 8 px au-dessus, 12 px en dessous.

## États

| État | Rendu |
|---|---|
| Repliée | Titre `--text-title-grey`, chevron tourné vers la droite, trait `--border-default-grey` sous l'en-tête |
| Ouverte | Titre `--text-action-high-blue-france`, chevron vers le bas, pas de trait |

Le chevron est toujours `--background-action-high-blue-france`. Graisse du titre : 500 (valeur de la maquette, sans classe DSFR équivalente). Le chevron tourne en 200 ms, sans animation si l'utilisateur réduit les animations. Sous 360 px, l'action passe sous le titre.

## Accessibilité

Bouton dans le `h3`, avec `aria-expanded` et `aria-controls` vers le corps (`hidden` quand la section est repliée). Le nombre du badge fait partie du nom accessible.
