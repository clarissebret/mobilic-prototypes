# Consignes pour travailler dans ce dépôt

## Avant toute modification

- Lire la spec du flux concerné dans `prototypes/<interface>/specs/`. La spec fait foi : si une demande la contredit, mettre la spec à jour dans la même pull request.
- Ce dépôt est public. Lire `CONFIDENTIALITE.md`. Uniquement des données fictives, aucun lien Figma, aucune adresse e-mail ou donnée réelle.

## Organisation

- Un dossier par interface dans `prototypes/` (`controleur`, plus tard `gestionnaire`, `salarie`). Plusieurs flux par interface, une spec par flux dans `specs/`.
- Un nouveau flux s'ajoute au panneau « Flux à tester » de `shell.html` et dans la table du `README.md`.
- Une nouvelle interface s'ajoute dans `scripts/build-index.mjs` et dans le script `build` de `package.json`.

## Conventions UI

- DSFR 1.15.4 d'abord : composants et classes DSFR. Le CSS propre à Mobilic (`app.css`) n'utilise que les tokens DSFR (`var(--…)`), jamais de couleur en dur.
- Icônes : classes `fr-icon-*` (Remix Icon).
- Espacements : 24 px entre champs, 32 px entre sections, 40 px en bas de page.
- Écran du téléphone : 360 px de large, rendu dans un iframe. Les règles responsives du DSFR sont donc celles du mobile.
- Modales DSFR ouvertes avec la classe `fr-modal--opened`, sans le JS du DSFR.
- Toute action ajoutée doit avoir un comportement défini pour le bouton Retour Android.

## Vérifier avant de pousser

```sh
npm ci
npm run check   # garde-fou de confidentialité
npm run build   # dist/<interface>/index.html
```

Tester le parcours modifié dans `dist/`, sur les secteurs TRM et TRS.

## Git

- Une branche par modification, puis une pull request. La propriétaire du dépôt relit et fusionne. `main` est publié automatiquement sur GitHub Pages.
- Commits avec une identité générique, jamais d'adresse e-mail personnelle.
