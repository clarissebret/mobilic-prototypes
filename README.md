# Prototypes Mobilic

Prototypes interactifs de [Mobilic](https://mobilic.beta.gouv.fr), construits sur le [Système de design de l'État (DSFR)](https://www.systeme-de-design.gouv.fr), pour tester des parcours avec l'équipe avant développement.

**Toutes les données affichées sont fictives.** Lire [CONFIDENTIALITE.md](CONFIDENTIALITE.md) avant toute contribution.

## Prototypes

Un prototype par interface de Mobilic : contrôleur, gestionnaire, salarié. Chaque interface contient plusieurs flux, listés dans le panneau « Parcours », et un seul fichier `SPECS.md` qui réunit les specs de tous ses flux.

| Interface | Dossier | Flux | Spec |
|---|---|---|---|
| Contrôleur (mobile) | `prototypes/controleur` | Contrôle LIC papier / feuille de route | [SPECS.md](prototypes/controleur/SPECS.md) |
| Gestionnaire (web) | `prototypes/gestionnaire` | Inscription ; reprise à l'étape 2 ; reprise à l'étape 3 ; aucun webinaire programmé ; entreprise : salariés ; salariés sans invitation ni temporaire | [SPECS.md](prototypes/gestionnaire/SPECS.md) |

Les prototypes publiés sont listés sur la page d'accueil GitHub Pages du dépôt.

## Utilisation du prototype

- La barre sous le cadre permet de choisir un parcours, de passer du format Mobile (360 px) au format Desktop (1440 px) (M), de remplir le formulaire affiché (F), de recommencer le prototype (R), d'ouvrir l'inspecteur (I) et de masquer les outils (@). Choisir le parcours en cours le recommence.
- Le format et sa taille s'affichent au-dessus du cadre. Le cadre prend toute la hauteur disponible ; la poignée du bord droit règle sa largeur à la main. Le cadre est réduit si la fenêtre est trop étroite.
- L'inspecteur, à droite, donne les propriétés, le code (React ou CSS), les tokens DSFR et les images et icônes à exporter de l'élément cliqué. Alt mesure les distances entre l'élément sélectionné et l'élément survolé. Voir [composants/outil-prototypage.md](composants/outil-prototypage.md).
- SIREN de test : `110014016`. Dans l'inscription gestionnaire, il a deux établissements, dont celui de Lyon déjà inscrit ; `220000002` est une entreprise déjà inscrite ; tout autre SIREN de 9 chiffres (ex. `123456789`) a un seul établissement.

## Structure

Voir aussi [DESIGN.md](DESIGN.md) pour les conventions de travail.

```
prototypes/<interface>/  sources d'un prototype (une interface, plusieurs flux)
  SPECS.md             specs de l'interface (règles communes + règles propres à chaque flux)
  app.html             écrans de l'application (rendus dans le cadre du téléphone, 360 px)
  app.css              styles propres à Mobilic, uniquement à partir des tokens DSFR
  app.js               logique des écrans
  infractions.js       (contrôleur) relevé des infractions et composant « Accordéon d'infraction »
  *.html               fragments inclus dans app.html par {{FILE:nom.html}} (ex. en-têtes)
  prototype.json       titre, nom court, description, parcours de la barre de contrôle,
                       scripts à assembler et appel de démarrage (scripts, init)
  remplissage.json     données fictives de « Remplir le formulaire », par identifiant de champ
composants/            documentation des composants Mobilic hors DSFR
shared/mobilic.css     styles Mobilic communs à toutes les interfaces
shared/shell-mobile.html  cadre commun des prototypes : téléphone ou cadre desktop, aperçu PDF
outil/                 outil de prototypage : barre de contrôle et inspecteur
.claude/skills/        skills Claude Code du dépôt (dont ceux d'Emil Kowalski, licence MIT)
assets/                logo Mobilic
scripts/build.py       assemble un prototype en un fichier HTML autonome dans dist/<interface>/
scripts/build-index.mjs  page d'accueil listant les prototypes
scripts/check-confidentiality.mjs  garde-fou avant publication
```

Le build intègre le CSS du DSFR et les icônes (Remix Icon, base des icônes DSFR) directement dans le fichier. Les polices Marianne sont servies depuis `dist/fonts`, sans CDN tiers.

## Développer en local

Prérequis : Node.js 20 et Python 3.

```sh
npm ci              # installe le DSFR et Remix Icon
npm run check       # vérifie l'absence de données confidentielles
npm run build       # génère dist/
npx serve dist      # ouvre http://localhost:3000
```

## Publication

Chaque push sur `main` lance la vérification de confidentialité, le build, puis publie `dist/` sur GitHub Pages. Une pull request lance la vérification et le build, sans publier.

## Licence

[MIT](LICENSE).
