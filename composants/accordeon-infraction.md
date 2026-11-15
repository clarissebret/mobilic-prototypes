# Accordéon d'infraction

Affiche une infraction (NATINF) et permet de sélectionner les jours ou semaines où elle a été constatée.

Code : classes `.inf*` et `.cal*` dans `prototypes/controleur/app.css`, rendu dans `prototypes/controleur/infractions.js`.

## Anatomie

1. **En-tête** (bouton) : code NATINF, libellé de l'infraction, chevron. Bouton de suppression optionnel.
2. **Corps** (dépliable) : règle applicable, puis sélecteur de période et tags des périodes retenues.

## Variantes

| Variante | Usage | Contenu du corps |
|---|---|---|
| Journalière | Infraction constatée par jour | Calendrier mensuel + tags des jours |
| Hebdomadaire | Infraction constatée par semaine | Cases à cocher des 4 dernières semaines |
| Édition | Saisie | Sélecteurs actifs, tags supprimables |
| Lecture | Synthèse, bulletin | Tags non supprimables, sans sélecteur |

## États

| État | Rendu |
|---|---|
| Non retenue | Contour gris |
| Retenue (au moins une période) | Contour bleu Marianne |
| Ouvert | En-tête sur fond gris clair, chevron retourné |
| Survol / appui | Fond gris clair / gris appuyé |

Comportement : fermé par défaut, un seul ouvert à la fois dans une liste, ouverture animée en 0,3 s (désactivée si `prefers-reduced-motion`).

## Tokens

| Élément | Token |
|---|---|
| Contour | `--border-default-grey`, retenu : `--border-plain-blue-france` |
| Fond en-tête survol / ouvert | `--background-default-grey-hover` (survol : comme le DSFR sur fond blanc ; ouvert : choix de la maquette, le DSFR utilise `--background-open-blue-france`) |
| Fond appuyé | `--background-default-grey-active` |
| Code NATINF | `--text-title-blue-france`, 14 px gras |
| Règle | `--text-mention-grey`, 14 px |
| Chevron, suppression | `--text-action-high-blue-france` |
| Jour sélectionné | `--background-action-high-blue-france`, texte `--text-inverted-blue-france` |
| Jour courant | contour `--border-action-high-blue-france` |
| Jour hors mois | `--background-contrast-grey` |

Espacements : padding de l'en-tête 12 × 16 px, corps 12 / 16 / 16 px, 12 px entre deux accordéons, 8 px entre les tags, 4 px entre les jours du calendrier.

## Accessibilité

- En-tête : `<button>` avec `aria-expanded`, inclus dans un titre.
- Jours du calendrier : boutons avec `aria-pressed` et un `aria-label` complet (« lundi 3 novembre 2026 »). Jours futurs désactivés.
- Tags supprimables : `aria-label="Retirer …"`.
