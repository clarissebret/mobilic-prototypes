# Consignes pour travailler dans ce dépôt

## Avant toute modification

- Lire les specs de l'interface concernée dans `prototypes/<interface>/SPECS.md`. La spec fait foi sur le produit : si une demande la contredit, mettre la spec à jour dans la même pull request.
- Lire la doc des composants Mobilic utilisés dans `composants/`. Un changement de composant met sa doc à jour dans la même pull request.
- Ce dépôt est public. Lire `CONFIDENTIALITE.md`. Uniquement des données fictives, aucun lien Figma, aucune adresse e-mail ou donnée réelle.

## Écrire une spec

- Une spec décrit le comportement attendu du produit, du point de vue de l'utilisateur. Elle sert de source de vérité et aide les devs à implémenter.
- Un seul fichier `SPECS.md` par interface. Un parcours de la spec est ce que l'utilisateur cherche à faire (s'inscrire, contrôler) : un type de contrôle n'est pas un parcours, ses différences vont dans les tableaux « Selon le type de contrôle ». Les scénarios de démo de `prototype.json` peuvent, eux, être découpés par type ou par cas. Structure, dans cet ordre :
  1. sous la phrase d'introduction et sans titre, un paragraphe de contexte (qui utilise l'interface, où). Pas de rappel sur les identifiants dans la spec : la règle est ici ;
  2. ce qui varie d'un cas à l'autre, s'il y a lieu (ex. ce qui est contrôlé) ;
  3. un titre `##` par parcours, c'est-à-dire par objectif de l'utilisateur (« Parcours : inscription », « Parcours : connexion », « Parcours : contrôle »). Chaque parcours commence par son but en une phrase, puis passe directement à ses étapes en `###` (pas de résumé des étapes, des entrées ou des sorties : ils se lisent dans les règles) et, si elle ne concerne que lui, sa navigation ;
  4. « Éléments communs » : ce qui apparaît dans plusieurs parcours (accueil, en-tête, navigation générale, barre ou panneau latéral, règle générale du bouton Retour). Chaque élément est décrit une seule fois et les parcours y renvoient par identifiant ;
  5. textes propres à une activité, données de référence (ex. infractions), composants utilisés.
- Mise en forme : chaque section de premier niveau est repliable, sans trait de séparation : `<details>`, puis `<summary><h2 id="…">Titre</h2></summary>`, une ligne vide, le contenu en Markdown, une ligne vide et `</details>`. L'`id` permet les liens internes (ex. `#infractions`). Dans un tableau qui cite des étapes, les nommer avec leur numéro (« 3. Inscription de l'entreprise »).
- Écrire pour qu'on comprenne à la première lecture : des phrases complètes plutôt qu'un style télégraphique, une phrase d'introduction par étape qui dit ce que fait l'utilisateur, les règles dans l'ordre où il découvre l'écran (pas forcément dans l'ordre des numéros), des sous-titres quand une étape est longue, et la raison d'une règle quand elle pourrait surprendre. Un tableau quand plusieurs cas se comparent (retours, erreurs, variantes). Pas de format Given/When/Then.
- Un service tiers (ex. Cerbère) n'est pas décrit : ni ses pages, ni ses champs, ni ses messages. La spec décrit seulement la jonction avec Mobilic : d'où on y part, ce qu'il transmet à Mobilic et où l'utilisateur revient selon ce qu'il y a fait.
- Deux dimensions font varier les règles : le **type de contrôle** (Mobilic, papier, sans LIC) et l'**activité** (marchandises, déménagement, voyageurs, sanitaire). Une règle commune est écrite une seule fois ; une règle qui varie va dans un tableau « Selon le type de contrôle » ou « Selon l'activité » de son étape.
- Chaque règle a un identifiant stable : préfixe de l'étape + numéro (`CRE-`, `REL-`, `BDC-`, `NAV-`). On ajoute à la suite, on ne renumérote jamais, un identifiant supprimé n'est pas réutilisé. L'historique des changements est celui de Git.
- Être précis sur ce qui compte pour l'implémentation : règles métier, conditions, messages d'erreur et de confirmation (texte exact), cas limites.
- Ne pas y mettre : le comportement ou le style d'un composant (il va dans `composants/`), des détails d'implémentation, des valeurs de mise en page, des questions ouvertes ou des notes internes.
- Ne jamais inventer une règle métier, un texte ou une valeur par activité. Quand un cas n'est pas couvert pendant le prototypage (erreur, cas limite, état vide, différence par activité ou type de contrôle, texte manquant), poser la question à la propriétaire du dépôt, une question à la fois, avant de l'écrire dans la spec.

## Skills

- Des skills Claude Code sont fournis dans `.claude/skills/` (voir son `README.md`). Ils aident (tests de données extrêmes, rendu mobile, animations), mais les règles de ce fichier, le DSFR, les specs et les fiches `composants/` priment toujours.
- Quand des corrections de design reviennent, utiliser `learn-taste` pour les inscrire comme règles ici ou dans `composants/`.

## Organisation

- Un dossier par interface dans `prototypes/` (`controleur`, plus tard `gestionnaire`, `salarie`). Plusieurs flux par interface, un seul `SPECS.md` par interface.
- Le cadre des prototypes (téléphone ou cadre desktop au centre, aperçu PDF) est commun : `shared/shell-mobile.html`. L'outil de prototypage qui l'entoure (barre de contrôle : parcours, format, remplissage, recommencer, inspecteur ; inspecteur à droite) est dans `outil/`, documenté dans `composants/outil-prototypage.md`. Ne pas les dupliquer dans un prototype, et ne pas modifier un prototype pour les besoins de l'outil.
- Chaque prototype a un `prototype.json` : titre, nom court (affiché dans le sélecteur de parcours), description, parcours listés dans la barre. Un nouveau parcours s'ajoute là, et dans la table du `README.md`.
- Les valeurs fictives de « Remplir le formulaire » se déclarent par identifiant de champ dans `prototypes/<interface>/remplissage.json` ; sans valeur déclarée, l'outil en choisit une selon le type du champ.
- Une nouvelle interface s'ajoute dans `scripts/build-index.mjs` et dans le script `build` de `package.json`.

## Conventions UI

- DSFR 1.15.4 d'abord : composants et classes DSFR. Le CSS propre à Mobilic n'utilise que les tokens DSFR (`var(--…)`), jamais de couleur en dur. Styles communs à toutes les interfaces (ex. tableau Mobilic) : `shared/mobilic.css` ; styles propres à une interface : son `app.css`.
- Tableaux : toujours la variante `mobilic-table` (voir `composants/tableau.md`).
- Typographie : uniquement les classes DSFR (`fr-h1` à `fr-h6`, `fr-text--lead|lg|sm|xs`, `fr-text--bold`). Pas de `font-size`, `letter-spacing` ni `text-transform` personnalisés, pas de capitales.
- Espacements : dans une mise en page flex ou grid, l'espace entre enfants passe par `gap` sur le parent (multiple de 4 px), pas par des marges sur les enfants. Ailleurs, les marges entre éléments passent par les classes utilitaires DSFR (`fr-m*-*` : `1v` = 4 px, `1w` = 8 px), y compris dans le HTML généré en JS. Le CSS personnalisé sert à la mise en page (flex, grid, gap, position) et au padding interne d'un composant Mobilic, toujours sur la grille de 4 px et documenté dans sa fiche `composants/`. Seule exception : neutraliser une marge interne du DSFR qui casse un espacement.
- Avant de créer un style, vérifier qu'un composant ou une classe DSFR ne le fait pas déjà (systeme-de-design.gouv.fr).
- Ponctuation française : espace insécable avant `!`, `?`, `:` et `;`, et à l'intérieur des guillemets, après `«` et avant `»` (`&nbsp;` dans le HTML, `\u00a0` dans le JS, le caractère lui-même dans le Markdown), pour qu'ils ne passent jamais seuls à la ligne. Cela vaut aussi pour les specs et la documentation.
- Icônes : classes `fr-icon-*` (Remix Icon).
- Rythme vertical : 24 px entre champs, 32 px entre sections, 40 px en bas de page.
- Écran rendu dans un iframe, au format Mobile (360 px de large, par défaut) ou Desktop (1440 px), ou à une largeur libre réglée avec la poignée ; la hauteur est celle de la fenêtre. Les règles responsives du DSFR sont celles de la largeur choisie. Vérifier chaque écran modifié en Mobile, avec une fenêtre basse et une fenêtre haute.
- Interface contrôleur : l'accueil occupe toute la page ; à partir de 768 px (48em), la création du contrôle et le contrôle (page du contrôle, création du bulletin, relevé) s'ouvrent dans le panneau latéral par-dessus l'accueil (voir `composants/panneau-lateral.md`). En dessous, ces écrans sont des pages pleine largeur. Échap ou clic sur le fond ferme le panneau (`back()`).
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
- Nom de branche : `type/description-courte`, en minuscules, mots séparés par des tirets, sans accents. Types : `feat/` (nouvelle fonction ou écran, ou changement visible du produit), `fix/` (correction), `docs/` (specs, README, DESIGN.md), `refactor/` (réorganisation du code sans changement visible), `chore/` (outillage, configuration, dépendances). Exemple : `feat/parcours-inscription-gestionnaire`.
