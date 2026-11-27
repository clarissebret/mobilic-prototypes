# Onglets de l'entreprise

Navigation entre les rubriques de la page Entreprise de l'espace gestionnaire (Salariés, Véhicules, Adresses…). Chaque onglet est un lien vers une rubrique, sans panneau DSFR.

Code : `.onglets-entreprise` dans `prototypes/gestionnaire/app.css`.

## Anatomie

Liste de liens en `fr-text--sm`, padding 12 px × 16 px, 24 px entre les onglets, trait bas `--border-default-grey` sur toute la largeur. Défile horizontalement quand la largeur manque.

## États

| État | Rendu |
|---|---|
| Inactif | Texte `--text-default-grey` ; fond `--background-default-grey-hover` au survol |
| Actif | Texte `--text-active-blue-france`, graisse 500 (valeur de la maquette), soulignement de 2 px `--border-active-blue-france` |

## Accessibilité

`<nav>` avec `aria-label` ; l'onglet actif porte `aria-current="page"`.
