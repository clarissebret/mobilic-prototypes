# Outil de prototypage

Barre de contrôle et inspecteur qui entourent chaque prototype. L'outil sert à tester et à développer : il ne fait pas partie du service et ne doit jamais être pris pour une de ses fonctionnalités (barre nommée « Outil de prototypage » pour les technologies d'assistance, aucun élément de marque de l'État).

Code : `outil/outil.css` et `outil/outil.js`, injectés par `scripts/build.py` dans le cadre commun `shared/shell-mobile.html`. L'outil lit le DOM de l'iframe du prototype (même origine) et lui envoie les commandes existantes (`postMessage`) : il ne modifie pas le code des prototypes.

## Anatomie

- **Libellé du format** : au-dessus du cadre, aligné à gauche : nom du format et dimensions, puis le taux de réduction s'il y en a un (ex. « Mobile 360 × 740 · 85 % », « Personnalisé 505 × 652 »).
- **Cadre** : rectangle blanc aux angles arrondis (12 px), sans contour de téléphone, en Mobile centré sur la fenêtre comme la barre, même inspecteur ouvert (s'il ne reste pas 280 px centrés à côté de l'inspecteur, il se centre dans l'espace libre) ; en Desktop (768 px et plus), l'inspecteur ne le réduit pas davantage : le cadre garde sa réduction et son bord gauche, et seule sa droite est rognée, comme une fenêtre de navigateur rétrécie (la largeur affichée dans le libellé diminue, le prototype se réorganise) ; de la hauteur de la vue (même haut et même bas que l'inspecteur), réduit à l'affichage s'il ne tient pas en largeur. Seul son contenu défile.
- **Poignée** : sur le bord droit, pour la largeur ; masquée quand l'inspecteur est ouvert.
- **Barre de contrôle** : 6 boutons à icône seule, en bas (16 px sous le cadre, 8 px au-dessus du bord de la fenêtre) et centrée sur toute la fenêtre : elle ne bouge pas quand l'inspecteur s'ouvre, seul le cadre se décale. Parcours, Format d'écran, Remplir le formulaire, Recommencer, Inspecteur, Masquer la barre.
- **Inspecteur** : carte de 408 px à droite, alignée sur le haut et le bas du cadre, à 16 px du bord. Le cadre prend sa taille finale dès le début (il ne se réorganise pas pendant l'animation), puis elle entre en glissant depuis la droite (300 ms, `cubic-bezier(.32, .72, 0, 1)`, sans animation si l'utilisateur réduit les animations), et ressort de la même façon. Le cadre ne passe jamais dessous. Barre d'en-tête « Inspecteur » avec « Fermer » ; sans sélection, au centre de la carte, une icône de curseur (`fr-icon-cursor-line`, dans un disque de 48 px `--background-contrast-grey`) au-dessus de la consigne « Cliquez sur un élément du prototype pour l'inspecter. » sur deux lignes ; avec une sélection, onglets Propriétés, Code, Tokens, Assets.
- **Calque d'inspection** : contour et étiquette (nom et dimensions) au-dessus du cadre ; mesures en rouge avec Alt.

## Barre de contrôle

| Contrôle | Composant DSFR | Comportement |
|---|---|---|
| Parcours (`fr-icon-play-line`) | Bouton tertiaire sans bordure SM, icône seule | Info-bulle « Parcours ». Son nom accessible donne « Interface · Parcours » (« Choisir un parcours » au chargement). Ouvre une liste avec recherche, groupée par interface, parcours en cours coché. Choisir un parcours affiche son premier écran ; choisir le parcours en cours le recommence et efface les saisies. Un parcours d'une autre interface ouvre sa page. Aucun résultat : « Aucun parcours ne correspond à votre recherche ». |
| Format d'écran (`fr-icon-smartphone-line` sous 768 px de large, `fr-icon-computer-line` au-delà) | Bouton tertiaire sans bordure SM, icône seule | Info-bulle « Format d'écran ». Bascule entre Mobile (360 px, par défaut) et Desktop (1440 px) ; une largeur personnalisée passe en Desktop sous 768 px, en Mobile au-delà. La largeur est mémorisée dans le navigateur. Changer de format ne recharge pas le prototype : l'écran et les saisies sont conservés. |
| Remplir le formulaire (`fr-icon-magic-line`) | Bouton tertiaire sans bordure SM, icône seule | Info-bulle « Remplir le formulaire », y compris quand il est désactivé (`aria-disabled`, sans formulaire à l'écran). Remplit uniquement les champs vides visibles de l'écran (ou de la modale ouverte), sans envoyer. |
| Recommencer (`fr-icon-restart-line`) | Bouton tertiaire sans bordure SM, icône seule | Info-bulle « Recommencer R ». Recharge le prototype : retour à l'accueil, saisies effacées, sélection effacée. |
| Inspecteur (`fr-icon-cursor-line`) | Bouton tertiaire sans bordure SM, icône seule, `aria-pressed` | Info-bulle « Inspecteur I ». Ouvre l'inspecteur et active le mode inspection ; pressé de nouveau (ou « Fermer »), referme l'inspecteur et quitte le mode. Pressé : fond `--background-action-low-blue-france` (comme Parcours quand sa liste est ouverte). |
| Masquer la barre (`fr-icon-eye-off-line`) | Bouton tertiaire sans bordure SM, icône seule | Info-bulle « Masquer la barre @ ». La barre descend hors de l'écran en s'effaçant et le bas du cadre et de l'inspecteur la suit, à 16 px (200 ms, `cubic-bezier(.23, 1, .32, 1)`). Le prototype prend sa nouvelle hauteur une seule fois, au début ; un masque (`clip-path`) cache ce qui n'est pas encore découvert. @ fait remonter la barre de la même façon, le bas du cadre et de l'inspecteur remonte avec elle, et la place n'est réservée qu'à la fin. Si l'utilisateur réduit les animations : fondu de la barre seul, sans masque. |

Dans les info-bulles, le raccourci suit le libellé à 8 px (`fr-ml-1w`), en `--text-disabled-grey` pour bien le distinguer du libellé.

Poignée : glisser le bord droit change la largeur. Le cadre restant centré, la largeur grandit de deux fois le déplacement pour suivre le pointeur. Largeur de 280 à 2560 px, sans dépasser l'espace disponible pendant le glissement ; hauteur de 320 px au moins. Une largeur de 360 ou 1440 px reprend le nom Mobile ou Desktop, sinon « Personnalisé ». Au clavier : flèches gauche et droite (8 px, 40 px avec Maj).

Raccourcis (hors saisie dans un champ), affichés dans les info-bulles : R (recommencer), I (inspecteur), @ (masquer ou afficher la barre). Échap ferme successivement la liste des parcours, la sélection, puis l'inspecteur.

## Remplissage

Données fictives, dans l'ordre des champs (un champ qui en fait apparaître un autre, comme département puis commune, est rempli ensuite) :

1. valeur déclarée pour l'identifiant du champ (ou le `name` d'un groupe de boutons radio) dans `prototypes/<interface>/remplissage.json`, clé `valeurs` ; la clé `apres` donne un bouton à cliquer après la saisie (ex. recherche SIREN) ;
2. sinon une valeur selon le type : adresse `contact@entreprise.fr`, date du jour dans les bornes `min` / `max` (les dates suivantes de l'écran sont décalées d'un jour, pour qu'une date de fin suive une date de début), première option d'une liste, premier bouton radio, case cochée seulement si elle est obligatoire, `AB-123-CD` pour une immatriculation, « Texte fictif » pour un texte libre. Les champs de recherche et de téléphone ne sont remplis que si une valeur est déclarée.

## Inspecteur

- **En-tête de l'élément** (onglet Propriétés) : en titre, le type d'élément ; un composant reconnu porte un badge « Composant DSFR » ou « Composant Mobilic », un élément HTML sans composant prend un nom générique selon sa balise (« Texte » pour `p`, `span`, `label`…, « Titre », « Lien », « Image », « Conteneur » pour `div`…). En dessous, en plus petit, le nom de l'élément (classe, puis `#id`). Sélection multiple : « 3 éléments », « Sélection multiple ».
- **Propriétés** : sections dans cet ordre (titres en français) ; une section sans valeur n'est pas affichée. À l'intérieur, tout est écrit comme dans le code : noms de propriétés CSS en police à chasse fixe (`width`, `gap`, `font-size`…), valeurs CSS (`0.75rem`, `0 0 0.75rem 0`, `space-between`).
  - **Unités** : le nom DSFR d'abord (token, ou classe utilitaire comme `fr-p-2w`, `fr-mb-3v`), puis la valeur en rem (1rem = 16px), comme le DSFR ; raccourcis CSS sur 4 côtés. Le px ne sert qu'aux traits fins (bordures) et aux mesures du rendu (largeur et hauteur réelles). Un `padding`, une `margin` ou un `gap` hors de l'échelle DSFR (multiples de 1v = 0.25rem, jusqu'à 8rem) porte le badge « Off DSFR scale ».
  - **Mise en page** (si l'élément est en flex ou en grille) : `display`, `flex-direction` ou `grid-template-columns` (avec le nombre de colonnes), `flex-wrap`, `alignment` (schéma 3 × 3 et valeurs `justify-content` / `align-items`, ou `justify-items` en grille), `gap`.
  - **Dimensions** : `width` et `height` (`fill`, `hug` ou `fixed`, puis la mesure en px), `min-width`, `max-width`, `min-height`, `max-height`, et dans un parent flex ou grille : `flex` (si différent de `0 1 auto`), `align-self`, `grid-column`, `grid-row`.
  - **Espacements** : `padding` et `margin`, classes DSFR puis valeur en rem. Une marge qui espace des enfants de flex ou de grille (sur l'axe de la mise en page, hors marges de texte posées par le DSFR) porte le badge « Use gap on parent ».
  - **Responsive** (si l'élément change selon la largeur) : `breakpoint` DSFR actif du cadre (xs < 576px ≤ sm < 768px ≤ md < 992px ≤ lg < 1248px ≤ xl), classes qui varient par palier (ex. `fr-col-12 fr-col-md-8`) avec celle qui s'applique en bleu, `Mobilic @media` : règles propres à Mobilic qui touchent l'élément, actives en bleu.
  - **Position** (seulement en `absolute`, `fixed` ou `sticky`) : `position`, `top`, `right`, `bottom`, `left`, `z-index`.
  - **Style** : `background-color` ; `border`, y compris les bordures que le DSFR dessine avec des ombres sans flou (épaisseur et côté : `2px bottom`) ou des dégradés d'une couleur ; `background-image` ; `border-radius` ; `box-shadow` (ombres avec flou) ; `opacity` ; `filter`. Les dessins internes du DSFR (`--data-uri-svg` : coche des cases, etc.) ne sont pas affichés.
  - **Texte** (dès que l'élément contient du texte, même dans ses enfants) : `font-family`, `font-size` (classe `fr-text--*` ou `fr-h*` qui s'applique, directement ou héritée, `fr-text--md` pour la taille de base, puis la valeur en rem ; hors classe DSFR, la valeur seule), `line-height`, `font-weight`, `color`, `text-align`.
  - Survoler `padding`, `margin` ou `gap` met la zone en évidence dans le prototype. Seuls les tokens et les classes sont copiables (clic : « Copié ») ; les autres valeurs sont du texte simple.
- **Sélection multiple** : Maj + clic (ou Maj + Entrée). Une valeur identique s'affiche, sinon `mixed`.
- **Mesure** : avec un élément sélectionné, maintenir Alt et survoler un autre élément affiche les distances en pixels du prototype. Si l'un contient l'autre : les quatre marges intérieures. Sinon : l'écart horizontal et l'écart vertical entre les deux, avec un repère en pointillés quand ils ne se font pas face.
- **Code** : React (JSX avec les classes DSFR en `className`, composant react-dsfr équivalent en commentaire, gestionnaires en ligne signalés « Non supporté en React : … ») ou CSS (règles propres à Mobilic qui s'appliquent à l'élément, tokens conservés, valeurs par défaut omises). Choix du langage mémorisé.
- **Tokens** : pour chaque couleur ou ombre (groupes nommés par la propriété CSS : `background-color`, `color`, `border-color`, `box-shadow`…), token, valeur (le prototype n'utilise que le thème clair), chaîne d'alias du DSFR jusqu'à la valeur finale. Sans token : « Valeur fixe, aucune variable liée ». Token absent du DSFR et de la page : « Variable introuvable, valeur d'origine affichée ».
- **Assets** : icônes `fr-icon-*`, images et SVG contenus dans la sélection. Formats PNG et JPG (échelles 1x à 4x) ou SVG (sans échelle), aperçu, nom de fichier tiré du nom de l’élément (`fr-icon-search-line.png`, suffixe `@2x` à l’échelle 2x), numéro ajouté aux doublons, archive ZIP pour plusieurs assets. Élément vide ou masqué : « Rien à exporter : cet élément est vide ou masqué ».

## Tokens

| Élément | Valeur |
|---|---|
| Fond de la page | `--background-contrast-grey` |
| Fond du cadre, de la barre et de l'inspecteur | `--background-default-grey` ; angles de 12 px pour le cadre, 4 px pour la barre et l'inspecteur |
| Libellé du format | `fr-text--xs`, `--text-mention-grey` |
| Poignées | `--border-default-grey`, `--border-plain-grey` au survol et pendant le glissement |
| Bordures et séparations | 1 px `--border-default-grey` (ombre intérieure) |
| Liste des parcours, volet inférieur | `--background-overlap-grey`, ombre `--overlap-shadow` |
| Contour d'inspection | trait plein `--border-plain-blue-france`, 1 px au survol, 2 px à la sélection (distinct du focus DSFR) |
| Mesure (Alt) | traits, contour de l'élément survolé et valeurs `--background-flat-red-marianne`, texte `--text-inverted-red-marianne` |
| Raccourci dans une info-bulle | `--text-disabled-grey` |
| Onglets de l'inspecteur | onglets DSFR restylés comme la navigation principale DSFR : `fr-text--sm fr-text--regular`, `--text-default-grey`, sans fond ni bordure, padding 8 px × 12 px ; actif `--text-active-blue-france` souligné de 2 px `--border-active-blue-france` ; survol `--background-default-grey-hover`. Au clic, le soulignement glisse vers le nouvel onglet (200 ms, `cubic-bezier(.77, 0, .175, 1)`) ; le nouveau contenu apparaît en même temps en fondu (opacité, 200 ms, `cubic-bezier(.23, 1, .32, 1)`, gardé si l'utilisateur réduit les animations) ; ni glissement ni fondu aux flèches du clavier, pas de glissement si l'utilisateur réduit les animations |
| Étiquette d'inspection | `--background-action-high-blue-france`, texte `--text-inverted-blue-france` |
| Zone d'espacement | `--background-contrast-yellow-tournesol`, pointillés `--border-plain-yellow-tournesol` |
| Token, valeur copiable | `--text-action-high-blue-france` ; valeurs et code en police à chasse fixe |
| Schéma d'alignement | 3 × 3 cases de 8 px espacées de 4 px, padding 4 px, contour 1 px `--border-default-grey` ; cases `--border-default-grey`, occupées `--background-action-high-blue-france` |
| « Off DSFR scale », « Use gap on parent » | badge DSFR `fr-badge--warning` |
| Padding de la barre | 8 px, 8 px entre boutons |
| Padding de l'en-tête de l'inspecteur | `fr-pl-2w fr-pr-1w fr-py-1w`, séparation 1 px en bas |
| Padding des options de liste, du code | 8 px ; 12 px |

## Petits écrans

Sous 576 px : boutons de la barre de 44 × 44 px (boutons à icône seule : padding de 14 px autour de l'icône de 16 px), pas de poignée, inspecteur en volet inférieur à mi-hauteur qui monte depuis le bas, agrandissable en plein écran.

## Accessibilité

- Barre en `role="toolbar"` : Tab pour y entrer et en sortir, flèches gauche et droite (Début, Fin) entre les contrôles.
- Boutons à icône seule : libellé dans le bouton, info-bulle DSFR avec le raccourci, liée par `aria-describedby`.
- Liste des parcours : champ de recherche en `combobox`, options en `listbox`, flèches haut et bas, Entrée pour choisir.
- Mode inspection au clavier : activé au clavier, le focus passe dans le prototype ; flèche haut (parent), bas (premier enfant), gauche et droite (voisins), Entrée pour sélectionner. Chaque élément atteint est annoncé.
- Onglets de l'inspecteur : `tablist`, flèches entre les onglets.
- Les changements (parcours, remplissage, copie, inspection) sont annoncés par une zone `role="status"`.
