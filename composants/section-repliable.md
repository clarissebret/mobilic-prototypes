# Section repliable

Regroupe un tableau (ou tout contenu) sous un titre qui l'ouvre et le referme, dans l'esprit de l'accordéon DSFR. Plusieurs sections s'empilent sans espace entre elles.

Code : `.section-repliable` dans `prototypes/gestionnaire/app.css`.

## Anatomie

- En-tête : bouton titre sur toute la largeur restante (titre `h3` en `fr-text--md`, 56 px de haut au minimum, padding 12 px × 16 px, chevron `fr-icon-arrow-down-s-line` de 16 px à gauche, badge DSFR `fr-badge--sm` optionnel pour un nombre), puis une action optionnelle à droite (bouton DSFR tertiaire sans bordure, petit format).
- Corps : `__corps` (grille animée, colonne bornée à `minmax(0, 1fr)` pour qu'un tableau trop large défile dans son conteneur sans élargir la section) > `__clip` (masque) > `__contenu` (bandeaux éventuels dans `__bandeaux`, collés sous l'en-tête, puis contenu : 16 px sous l'en-tête quand il n'y a pas de bandeau, entre chaque élément et en bas ; les marges DSFR du tableau sont neutralisées ; un conteneur vide est retiré).

## États

| État | Rendu |
|---|---|
| Repliée | Titre `--text-title-grey`, chevron tourné vers la droite, trait `--border-default-grey` sous l'en-tête |
| Ouverte (`section-repliable--ouverte`) | Titre `--text-action-high-blue-france`, chevron vers le bas, pas de trait |
| Survol du titre | Fond `--background-default-grey-hover` sur toute la ligne, comme l'accordéon DSFR (pointeur fin uniquement) |
| Appui | Fond `--background-default-grey-active` |

Le chevron est toujours `--background-action-high-blue-france`. Graisse du titre : 500 (valeur de la maquette, sans classe DSFR équivalente). Sous 360 px, l'action passe sous le titre.

## Animation

- Ouverture et fermeture : la grille du corps passe de `0fr` à `1fr` en 250 ms, `cubic-bezier(.23, 1, .32, 1)` (même mécanique que la carte d'établissement) ; le contenu apparaît en fondu (200 ms) en glissant de 8 px. Le chevron tourne en 200 ms.
- Fermée, le contenu est `inert`. Ouverte, le masque est levé après l'animation pour ne pas couper le contour de focus DSFR.
- Animations réduites : pas de glissement ni de dépliage, fondu seul.

## Accessibilité

Bouton dans le `h3`, avec `aria-expanded` et `aria-controls` vers le corps. Le nombre du badge fait partie du nom accessible.
