# Tableau Mobilic

Variante du tableau DSFR utilisée pour tous les tableaux de Mobilic.

Code : classe `mobilic-table` à ajouter sur `.fr-table`, styles dans `shared/mobilic.css` (communs à toutes les interfaces).

```html
<div class="fr-table fr-table--no-caption mobilic-table">
  <div class="fr-table__wrapper"><div class="fr-table__container"><div class="fr-table__content">
    <table>…</table>
  </div></div></div>
</div>
```

## Différences avec le tableau DSFR

| Élément | DSFR | Mobilic |
|---|---|---|
| Fond de l'en-tête | `--background-alt-grey` | `--background-contrast-grey` (plus foncé) |
| Ligne sous l'en-tête | 1 px `--border-plain-grey` | 2 px `--border-plain-grey` |
| Séparateur entre les lignes | 1 px `--border-contrast-grey` | 1 px `--border-default-grey` (clair) |

Tout le reste est celui du DSFR : typographie, défilement horizontal sur mobile.

## Usage

- Sur mobile, le tableau défile horizontalement dans son conteneur ; la page ne défile pas.
- Les statuts dans une cellule utilisent les badges DSFR petit format sans icône (`fr-badge--sm fr-badge--no-icon`).

## Accessibilité

- Toujours une `<caption>`, masquée visuellement avec `fr-table--no-caption`.
- En-têtes de colonnes en `<th scope="col">`.
