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

## Skills

- Des skills Claude Code sont fournis dans `.claude/skills/` (voir son `README.md`). Ils aident (tests de données extrêmes, rendu mobile, animations), mais les règles de ce fichier, le DSFR, les specs et les fiches `composants/` priment toujours.
- Quand des corrections de design reviennent, utiliser `learn-taste` pour les inscrire comme règles ici ou dans `composants/`.

## Organisation

- Un dossier par interface dans `prototypes/` (`controleur`, plus tard `gestionnaire`, `salarie`). Plusieurs flux par interface, un seul `SPECS.md` par interface.
- Le cadre des prototypes (téléphone ou cadre desktop au centre, aperçu PDF) est commun : `shared/shell-mobile.html`. L'outil de prototypage qui l'entoure (barre de contrôle : parcours, format, remplissage, inspection ; inspecteur à droite) est dans `outil/`, documenté dans `composants/outil-prototypage.md`. Ne pas les dupliquer dans un prototype, et ne pas modifier un prototype pour les besoins de l'outil.
- Chaque prototype a un `prototype.json` : titre, nom court (affiché dans le sélecteur de parcours), description, parcours listés dans la barre. Un nouveau parcours s'ajoute là, et dans la table du `README.md`.
- Les valeurs fictives de « Remplir le formulaire » se déclarent par identifiant de champ dans `prototypes/<interface>/remplissage.json` ; sans valeur déclarée, l'outil en choisit une selon le type du champ.
- Une nouvelle interface s'ajoute dans `scripts/build-index.mjs` et dans le script `build` de `package.json`.

## Conventions UI

- DSFR 1.15.4 d'abord : composants et classes DSFR. Le CSS propre à Mobilic n'utilise que les tokens DSFR (`var(--…)`), jamais de couleur en dur. Styles communs à toutes les interfaces (ex. tableau Mobilic) : `shared/mobilic.css` ; styles propres à une interface : son `app.css`.
- Tableaux : toujours la variante `mobilic-table` (voir `composants/tableau.md`).
- Typographie : uniquement les classes DSFR (`fr-h1` à `fr-h6`, `fr-text--lead|lg|sm|xs`, `fr-text--bold`). Pas de `font-size`, `letter-spacing` ni `text-transform` personnalisés, pas de capitales.
- Espacements : les marges entre éléments passent par les classes utilitaires DSFR (`fr-m*-*` : `1v` = 4 px, `1w` = 8 px), y compris dans le HTML généré en JS. Le CSS personnalisé sert à la mise en page (flex, grid, position) et au padding interne d'un composant Mobilic, toujours sur la grille de 4 px et documenté dans sa fiche `composants/`. Seule exception : neutraliser une marge interne du DSFR qui casse un espacement.
- Avant de créer un style, vérifier qu'un composant ou une classe DSFR ne le fait pas déjà (systeme-de-design.gouv.fr).
- Icônes : classes `fr-icon-*` (Remix Icon).
- Rythme vertical : 24 px entre champs, 32 px entre sections, 40 px en bas de page.
- Écran rendu dans un iframe, aux formats Mobile 360 × 640, 360 × 740 (par défaut) et 412 × 915, ou Desktop 1440 × 800, ou à une taille libre réglée avec les poignées. Les règles responsives du DSFR sont celles de la largeur choisie. Vérifier chaque écran modifié sur les 3 formats mobiles.
- Modales DSFR ouvertes avec la classe `fr-modal--opened`, sans le JS du DSFR. Ne pas utiliser les options DSFR qui dépendent de son JS (ex. `fr-btns-group--equisized`) : sur mobile, les boutons empilés doivent prendre toute la largeur.
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
