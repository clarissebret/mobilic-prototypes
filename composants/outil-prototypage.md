# Outil de prototypage

Barre de contrôle et inspecteur qui entourent chaque prototype. L'outil sert à tester et à développer : il ne fait pas partie du service et ne doit jamais être pris pour une de ses fonctionnalités (mention « Outil de prototypage », aucun élément de marque de l'État).

Code : `outil/outil.css` et `outil/outil.js`, injectés par `scripts/build.py` dans le cadre commun `shared/shell-mobile.html`. L'outil lit le DOM de l'iframe du prototype (même origine) et lui envoie les commandes existantes (`postMessage`) : il ne modifie pas le code des prototypes.

## Anatomie

- **Scène** : le cadre du prototype, centré, réduit à l'affichage s'il ne tient pas dans la fenêtre. Seul son contenu défile.
- **Barre de contrôle** : fixe sous le cadre et centrée sur lui, ni flottante ni déplaçable. Dans l'ordre : mention « Outil de prototypage », sélecteur de parcours, format d'écran (Mobile / Desktop, puis le téléphone en Mobile, puis le taux de réduction s'il y en a un), « Remplir le formulaire », « Inspecter ».
- **Inspecteur** : panneau pleine hauteur à droite du cadre, 400 px. Le cadre se décale vers la gauche et ne passe jamais dessous. En-tête (nom et type de l'élément, « Fermer »), onglets Propriétés, Code, Tokens, Assets.
- **Calque d'inspection** : contour et étiquette (nom et dimensions) au-dessus du cadre.

## Barre de contrôle

| Contrôle | Composant DSFR | Comportement |
|---|---|---|
| Parcours | Bouton tertiaire sans bordure SM, icône à droite | Affiche « Interface · Parcours » (« Choisir un parcours » au chargement). Ouvre une liste avec recherche, groupée par interface, parcours en cours coché. Choisir un parcours affiche son premier écran ; choisir le parcours en cours le recommence et efface les saisies. Un parcours d'une autre interface ouvre sa page. Aucun résultat : « Aucun parcours ne correspond à votre recherche ». |
| Format d'écran | Contrôle segmenté SM + liste déroulante | Mobile : téléphone Android, 360 × 640, 360 × 740 (par défaut) ou 412 × 915. Desktop : cadre de 1440 px sans contour de téléphone. Le format est mémorisé dans le navigateur. Changer de format ne recharge pas le prototype : l'écran et les saisies sont conservés. |
| Remplir le formulaire | Bouton tertiaire sans bordure SM, icône seule | Désactivé (`aria-disabled`) sans formulaire à l'écran, info-bulle « Aucun formulaire sur cet écran ». Remplit uniquement les champs vides visibles de l'écran (ou de la modale ouverte), sans envoyer. |
| Inspecter | Bouton tertiaire sans bordure SM, icône seule, `aria-pressed` | Pressé : fond `--background-action-high-blue-france`, icône `--text-inverted-blue-france`. |

Raccourcis (hors saisie dans un champ), affichés dans les info-bulles : P (parcours), R (remplir), I (inspecter). Échap ferme successivement la liste des parcours, la sélection (et l'inspecteur), puis le mode inspection.

## Remplissage

Données fictives, dans l'ordre des champs (un champ qui en fait apparaître un autre, comme département puis commune, est rempli ensuite) :

1. valeur déclarée pour l'identifiant du champ (ou le `name` d'un groupe de boutons radio) dans `prototypes/<interface>/remplissage.json`, clé `valeurs` ; la clé `apres` donne un bouton à cliquer après la saisie (ex. recherche SIREN) ;
2. sinon une valeur selon le type : adresse `contact@entreprise.fr`, date du jour dans les bornes `min` / `max` (les dates suivantes de l'écran sont décalées d'un jour, pour qu'une date de fin suive une date de début), première option d'une liste, premier bouton radio, case cochée seulement si elle est obligatoire, `AB-123-CD` pour une immatriculation, « Texte fictif » pour un texte libre. Les champs de recherche et de téléphone ne sont remplis que si une valeur est déclarée.

## Inspecteur

- **Propriétés** : groupes Structure (largeur et hauteur : fixe, « Adaptée au contenu » ou « Remplit le parent », avec la mesure ; position par rapport au parent direct ; mise en page ; espacement ; padding ; marge), Apparence (fond, rayon, opacité), Bordure, Effets (ombres dans l'ordre d'application), Texte. Un groupe sans valeur n'est pas affiché. Quand une valeur vient d'un token, le token s'affiche en premier, la valeur ensuite ; quand elle vient d'une classe utilitaire DSFR (`fr-p-2w`, `fr-text--sm`), la classe s'affiche en premier. Survoler le padding, la marge ou l'espacement met la zone en évidence dans le prototype. Clic sur une valeur : copie, « Copié ».
- **Sélection multiple** : Maj + clic (ou Maj + Entrée). Une valeur identique s'affiche, sinon « Mixte ».
- **Code** : React (JSX avec les classes DSFR en `className`, composant react-dsfr équivalent en commentaire, gestionnaires en ligne signalés « Non supporté en React : … ») ou CSS (règles propres à Mobilic qui s'appliquent à l'élément, tokens conservés, valeurs par défaut omises). Choix du langage mémorisé.
- **Tokens** : pour chaque couleur ou ombre, token, valeur en thème clair et en thème sombre, chaîne d'alias du DSFR jusqu'à la valeur finale. Sans token : « Valeur fixe, aucune variable liée ». Token absent du DSFR et de la page : « Variable introuvable, valeur d'origine affichée ».
- **Assets** : icônes `fr-icon-*`, images et SVG contenus dans la sélection. Formats PNG et JPG (échelles 1x à 4x) ou SVG (sans échelle), aperçu, nom de fichier tiré du nom de l’élément (`fr-icon-search-line.png`, suffixe `@2x` à l’échelle 2x), numéro ajouté aux doublons, archive ZIP pour plusieurs assets. Élément vide ou masqué : « Rien à exporter : cet élément est vide ou masqué ».

## Tokens

| Élément | Valeur |
|---|---|
| Fond de la barre et de l'inspecteur | `--background-default-grey` |
| Bordures et séparations | 1 px `--border-default-grey` (ombre intérieure) |
| Liste des parcours, volet inférieur | `--background-overlap-grey`, ombre `--overlap-shadow` |
| Contour d'inspection | trait plein `--border-plain-blue-france`, 1 px au survol, 2 px à la sélection (distinct du focus DSFR) |
| Étiquette d'inspection | `--background-action-high-blue-france`, texte `--text-inverted-blue-france` |
| Zone d'espacement | `--background-contrast-yellow-tournesol`, pointillés `--border-plain-yellow-tournesol` |
| Token, valeur copiable | `--text-action-high-blue-france` ; valeurs et code en police à chasse fixe |
| Padding de la barre | 4 px × 8 px, 8 px entre contrôles |
| Padding des options de liste, du code | 8 px ; 12 px |

## Petits écrans

Sous 576 px : contrôles de la barre de 44 × 44 px au moins (boutons à icône seule : padding de 14 px autour de l'icône de 16 px), inspecteur en volet inférieur à mi-hauteur, agrandissable en plein écran.

## Accessibilité

- Barre en `role="toolbar"` : Tab pour y entrer et en sortir, flèches gauche et droite (Début, Fin) entre les contrôles.
- Boutons à icône seule : libellé dans le bouton, info-bulle DSFR avec le raccourci, liée par `aria-describedby`.
- Liste des parcours : champ de recherche en `combobox`, options en `listbox`, flèches haut et bas, Entrée pour choisir.
- Mode inspection au clavier : activé au clavier, le focus passe dans le prototype ; flèche haut (parent), bas (premier enfant), gauche et droite (voisins), Entrée pour sélectionner. Chaque élément atteint est annoncé.
- Onglets de l'inspecteur : `tablist`, flèches entre les onglets.
- Les changements (parcours, remplissage, copie, inspection) sont annoncés par une zone `role="status"`.
