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

## Variante cliquable

Quand une ligne ouvre un élément (ex. rouvrir un contrôle), ajouter `mobilic-table--clickable` :

- toute la ligne est cliquable, avec un fond `--background-default-grey-hover` au survol et `--background-default-grey-active` à l'appui ;
- la première cellule contient un lien (classe `row-link`, même apparence que le texte) qui permet d'ouvrir la ligne au clavier.

## Liste déroulante dans une cellule

Quand une valeur se modifie directement dans le tableau (ex. groupe d'affectation d'un salarié), la cellule contient une liste déroulante DSFR (`fr-select fr-text--sm fr-mb-0`, avec un `aria-label`), adaptée pour se fondre dans la ligne :

- pas de soulignement (`box-shadow` du DSFR retiré), coins arrondis de 4 px ;
- pas de marge haute (elle sert au libellé, absent ici) ;
- fond `--background-contrast-grey` du DSFR, inchangé ; état désactivé du DSFR, sans soulignement.

## Case à cocher dans une cellule

Quand une valeur oui/non se modifie dans le tableau (ex. activité mixte d'un salarié), la cellule contient une case DSFR petit format (`fr-checkbox-group fr-checkbox-group--sm`), avec un libellé réservé aux lecteurs d'écran (`fr-sr-only`, ex. « Activité mixte de Karim Benali »). Le libellé garde la hauteur d'une ligne (24 px) pour que la case soit centrée verticalement. L'explication de la colonne va dans une infobulle DSFR sur son en-tête (`fr-btn--tooltip`).

## Ligne désactivée

Classe `mobilic-row--disabled` sur le `<tr>` (ex. salarié détaché) : libellé de la première cellule en `--text-disabled-grey`, sans gras ; les autres textes restent lisibles ; listes déroulantes désactivées (`disabled`). Un badge DSFR dans la première cellule dit pourquoi (ex. « Détaché »). L'action de la ligne reste disponible quand elle a un sens (ex. « Rattacher »).

## En-têtes sur deux lignes

Un libellé de colonne long (ex. « Début rattachement ») passe sur deux lignes : `fr-cell--multiline` sur le `<th>` et le libellé dans un `<span>` de 7 rem au plus.

## Usage

- Sur mobile, le tableau défile horizontalement dans son conteneur ; la page ne défile pas.
- Les statuts dans une cellule utilisent les badges DSFR petit format sans icône (`fr-badge--sm fr-badge--no-icon`).

## Accessibilité

- Toujours une `<caption>`, masquée visuellement avec `fr-table--no-caption`.
- En-têtes de colonnes en `<th scope="col">`.
