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
| Masquer la barre (`fr-icon-eye-off-line`) | Bouton tertiaire sans bordure SM, icône seule | Info-bulle « Masquer la barre @ ». Le cadre et l'inspecteur prennent d'un coup la place libérée, puis la barre descend hors de l'écran en s'effaçant par-dessus eux (200 ms, `cubic-bezier(.23, 1, .32, 1)` ; fondu seul si l'utilisateur réduit les animations). @ réserve de nouveau la place, puis la fait remonter de la même façon. |

Dans les info-bulles, le raccourci suit le libellé à 8 px (`fr-ml-1w`), en `--text-disabled-grey` pour bien le distinguer du libellé.

Poignée : glisser le bord droit change la largeur. Le cadre restant centré, la largeur grandit de deux fois le déplacement pour suivre le pointeur. Largeur de 280 à 2560 px, sans dépasser l'espace disponible pendant le glissement ; hauteur de 320 px au moins. Une largeur de 360 ou 1440 px reprend le nom Mobile ou Desktop, sinon « Personnalisé ». Au clavier : flèches gauche et droite (8 px, 40 px avec Maj).

Raccourcis (hors saisie dans un champ), affichés dans les info-bulles : R (recommencer), I (inspecteur), @ (masquer ou afficher la barre). Échap ferme successivement la liste des parcours, la sélection, puis l'inspecteur.

## Remplissage

Données fictives, dans l'ordre des champs (un champ qui en fait apparaître un autre, comme département puis commune, est rempli ensuite) :

1. valeur déclarée pour l'identifiant du champ (ou le `name` d'un groupe de boutons radio) dans `prototypes/<interface>/remplissage.json`, clé `valeurs` ; la clé `apres` donne un bouton à cliquer après la saisie (ex. recherche SIREN) ;
2. sinon une valeur selon le type : adresse `contact@entreprise.fr`, date du jour dans les bornes `min` / `max` (les dates suivantes de l'écran sont décalées d'un jour, pour qu'une date de fin suive une date de début), première option d'une liste, premier bouton radio, case cochée seulement si elle est obligatoire, `AB-123-CD` pour une immatriculation, « Texte fictif » pour un texte libre. Les champs de recherche et de téléphone ne sont remplis que si une valeur est déclarée.

## Inspecteur

- **En-tête de l'élément** (onglet Propriétés) : en titre, le type d'élément ; un composant reconnu porte un badge « Composant DSFR » ou « Composant Mobilic », un élément HTML sans composant prend un nom générique selon sa balise (« Texte » pour `p`, `span`, `label`…, « Titre », « Lien », « Image », « Conteneur » pour `div`…). En dessous, en plus petit, le nom de l'élément (classe, puis `#id`). Sélection multiple : « 3 éléments », « Sélection multiple ».
- **Propriétés** : groupes Structure (largeur et hauteur : fixe, « Adaptée au contenu » ou « Remplit le parent », avec la mesure ; position par rapport au parent direct ; mise en page ; espacement ; padding ; marge), Apparence (fond, rayon, opacité), Bordure, Effets (ombres dans l'ordre d'application), Texte. Un groupe sans valeur n'est pas affiché. Quand une valeur vient d'un token, le token s'affiche en premier, la valeur ensuite ; quand elle vient d'une classe utilitaire DSFR (`fr-p-2w`, `fr-text--sm`), la classe s'affiche en premier. Survoler le padding, la marge ou l'espacement met la zone en évidence dans le prototype. Clic sur une valeur : copie, « Copié ».
- **Sélection multiple** : Maj + clic (ou Maj + Entrée). Une valeur identique s'affiche, sinon « Mixte ».
- **Mesure** : avec un élément sélectionné, maintenir Alt et survoler un autre élément affiche les distances en pixels du prototype. Si l'un contient l'autre : les quatre marges intérieures. Sinon : l'écart horizontal et l'écart vertical entre les deux, avec un repère en pointillés quand ils ne se font pas face.
- **Code** : React (JSX avec les classes DSFR en `className`, composant react-dsfr équivalent en commentaire, gestionnaires en ligne signalés « Non supporté en React : … ») ou CSS (règles propres à Mobilic qui s'appliquent à l'élément, tokens conservés, valeurs par défaut omises). Choix du langage mémorisé.
- **Tokens** : pour chaque couleur ou ombre, token, valeur (le prototype n'utilise que le thème clair), chaîne d'alias du DSFR jusqu'à la valeur finale. Sans token : « Valeur fixe, aucune variable liée ». Token absent du DSFR et de la page : « Variable introuvable, valeur d'origine affichée ».
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
| Onglets de l'inspecteur | onglets DSFR restylés comme la navigation principale DSFR : `fr-text--sm fr-text--regular`, `--text-default-grey`, sans fond ni bordure, padding 8 px × 12 px ; actif `--text-active-blue-france` souligné de 2 px `--border-active-blue-france` ; survol `--background-default-grey-hover` |
| Étiquette d'inspection | `--background-action-high-blue-france`, texte `--text-inverted-blue-france` |
| Zone d'espacement | `--background-contrast-yellow-tournesol`, pointillés `--border-plain-yellow-tournesol` |
| Token, valeur copiable | `--text-action-high-blue-france` ; valeurs et code en police à chasse fixe |
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
