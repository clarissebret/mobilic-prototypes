# Consignes pour travailler dans ce dépôt

## Avant toute modification

- Lire les specs de l'interface concernée dans `prototypes/<interface>/SPECS.md`. La spec fait foi sur le produit : si une demande la contredit, mettre la spec à jour dans la même pull request.
- Lire la doc des composants Mobilic utilisés dans `composants/`. Un changement de composant met sa doc à jour dans la même pull request.

## Écrire une spec

- Une spec décrit le comportement attendu du produit, sous forme de règles numérotées, du point de vue de l'utilisateur. Elle sert de source de vérité et aide les devs à implémenter.
- Un seul fichier par interface. Structure : objectif, utilisateurs et contexte, types de flux, règles communes (groupées par étape du parcours), puis une section par flux avec ses règles propres et ses données de référence (ex. liste des NATINF), enfin les composants utilisés (liens).
- Une règle commune à plusieurs flux n'est écrite qu'une fois, dans les règles communes. Numérotation continue dans tout le fichier.
- Ne pas y mettre : le comportement ou le style d'un composant (il va dans `composants/`), des détails d'implémentation, des valeurs de mise en page, des questions ouvertes ou des notes internes.
- Rester au bon niveau : « une infraction n'est retenue que si au moins un jour est sélectionné », pas « le contour passe en bleu ».
- Ce dépôt est public. Lire `CONFIDENTIALITE.md`. Uniquement des données fictives, aucun lien Figma, aucune adresse e-mail ou donnée réelle.

## Organisation

- Un dossier par interface dans `prototypes/` (`controleur`, plus tard `gestionnaire`, `salarie`). Plusieurs flux par interface, un seul `SPECS.md` par interface.
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
