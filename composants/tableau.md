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

## Ligne désactivée

Classe `mobilic-row--disabled` sur le `<tr>` (ex. salarié détaché) : textes en `--text-disabled-grey`, listes déroulantes désactivées (`disabled`), actions de la ligne masquées. Un badge DSFR dans la première cellule dit pourquoi (ex. « Détaché »).

## Usage

- Sur mobile, le tableau défile horizontalement dans son conteneur ; la page ne défile pas.
- Les statuts dans une cellule utilisent les badges DSFR petit format sans icône (`fr-badge--sm fr-badge--no-icon`).

## Accessibilité

- Toujours une `<caption>`, masquée visuellement avec `fr-table--no-caption`.
- En-têtes de colonnes en `<th scope="col">`.
