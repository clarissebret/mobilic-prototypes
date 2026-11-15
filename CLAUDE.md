# Consignes pour travailler dans ce dépôt

## Avant toute modification

- Lire les specs de l'interface concernée dans `prototypes/<interface>/SPECS.md`. La spec fait foi sur le produit : si une demande la contredit, mettre la spec à jour dans la même pull request.
- Lire la doc des composants Mobilic utilisés dans `composants/`. Un changement de composant met sa doc à jour dans la même pull request.
- Ce dépôt est public. Lire `CONFIDENTIALITE.md`. Uniquement des données fictives, aucun lien Figma, aucune adresse e-mail ou donnée réelle.

## Écrire une spec

- Une spec décrit le comportement attendu du produit, du point de vue de l'utilisateur. Elle sert de source de vérité et aide les devs à implémenter.
- Un seul fichier `SPECS.md` par interface. Structure : utilisateurs et contexte (qui, où, ce qui est contrôlé), parcours, une section par étape du parcours, navigation, textes propres à une activité, données de référence (ex. infractions), composants utilisés.
- Deux dimensions font varier les règles : le **type de contrôle** (Mobilic, papier, sans LIC) et l'**activité** (marchandises, déménagement, voyageurs, sanitaire). Une règle commune est écrite une seule fois ; une règle qui varie va dans un tableau « Selon le type de contrôle » ou « Selon l'activité » de son étape.
- Chaque règle a un identifiant stable : préfixe de l'étape + numéro (`CRE-`, `REL-`, `BDC-`, `NAV-`). On ajoute à la suite, on ne renumérote jamais, un identifiant supprimé n'est pas réutilisé. L'historique des changements est celui de Git.
- Être précis sur ce qui compte pour l'implémentation : règles métier, conditions, messages d'erreur et de confirmation (texte exact), cas limites.
- Ne pas y mettre : le comportement ou le style d'un composant (il va dans `composants/`), des détails d'implémentation, des valeurs de mise en page, des questions ouvertes ou des notes internes.
- Ne jamais inventer une règle métier, un texte ou une valeur par activité. Quand un cas n'est pas couvert pendant le prototypage (erreur, cas limite, état vide, différence par activité ou type de contrôle, texte manquant), poser la question à la propriétaire du dépôt, une question à la fois, avant de l'écrire dans la spec.

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
