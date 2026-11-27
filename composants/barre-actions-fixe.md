# Barre d'actions fixe

Garde les actions principales d'un écran de saisie toujours accessibles en bas de l'écran mobile.

Code : `.sticky-actions` et `.has-sticky` dans `prototypes/controleur/app.css`.

## Anatomie

Conteneur pleine largeur fixé en bas de l'écran, contenant 1 ou 2 boutons DSFR de même largeur.

## Variantes

| Variante | Boutons |
|---|---|
| Double | Secondaire « Annuler » + primaire « Enregistrer » |
| Simple | Un seul bouton |

## Tokens

| Élément | Valeur |
|---|---|
| Fond | `--background-default-grey` |
| Séparation | bordure supérieure 1 px `--border-default-grey` (pas d'ombre) |
| Padding | 16 px |
| Écart entre boutons | 16 px |

## Règles d'usage

- Le contenu de la page reçoit `.has-sticky` (marge basse de 104 px) pour que le dernier élément ne soit pas masqué.
- Les messages temporaires (toasts) s'affichent au-dessus de la barre.
- Dans le [panneau latéral](panneau-lateral.md), la barre prend la largeur du panneau.
