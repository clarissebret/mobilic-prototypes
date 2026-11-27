# Barre de progression

Indique une proportion (ex. salariés inscrits sur Mobilic). Le DSFR n'a pas de composant équivalent.

Code : `.barre-progression` dans `prototypes/gestionnaire/app.css`.

## Anatomie

- Libellé en `fr-text--sm`, valeur en `fr-text--bold` (ex. « Inscrits sur Mobilic : 9 sur 12 »).
- Barre de 8 px de haut, 368 px de large au maximum, 8 px sous le libellé.

## Tokens

| Élément | Token |
|---|---|
| Fond | `--background-disabled-grey` |
| Valeur | `--artwork-major-blue-france` |

## Accessibilité

La barre est décorative (`aria-hidden`) : le libellé donne la valeur.
