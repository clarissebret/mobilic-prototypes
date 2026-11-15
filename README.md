# Prototypes Mobilic

Prototypes interactifs de [Mobilic](https://mobilic.beta.gouv.fr), construits sur le [Système de design de l'État (DSFR)](https://www.systeme-de-design.gouv.fr), pour tester des parcours avec l'équipe avant développement.

**Toutes les données affichées sont fictives.** Lire [CONFIDENTIALITE.md](CONFIDENTIALITE.md) avant toute contribution.

## Prototypes

Un prototype par interface de Mobilic : contrôleur, gestionnaire, salarié. Chaque interface contient plusieurs flux, listés dans le panneau « Parcours », et un seul fichier `SPECS.md` qui réunit les specs de tous ses flux.

| Interface | Dossier | Flux | Spec |
|---|---|---|---|
| Contrôleur (mobile) | `prototypes/controleur` | Contrôle LIC papier / feuille de route | [SPECS.md](prototypes/controleur/SPECS.md) |

Les prototypes publiés sont listés sur la page d'accueil GitHub Pages du dépôt.

## Utilisation du prototype

- Le panneau « Parcours » à gauche liste les parcours à tester (bouton ▷ pour démarrer), propose « Remplir le formulaire » sur les écrans qui en ont un, et « Réinitialiser ».
- En bas du panneau, le menu « Téléphone » permet de choisir la taille d'écran (Galaxy S5, Galaxy S8+, Pixel 7). Le téléphone est réduit si la fenêtre n'est pas assez haute.
- La barre Android du bas est active : le bouton Retour revient à l'écran précédent ou ferme la modale ouverte.
- SIREN de test : `110014016`.

## Structure

Voir aussi [CLAUDE.md](CLAUDE.md) pour les conventions de travail.

```
prototypes/<interface>/  sources d'un prototype (une interface, plusieurs flux)
  SPECS.md             specs de l'interface (règles communes + règles propres à chaque flux)
  app.html             écrans de l'application (rendus dans le cadre du téléphone, 360 px)
  app.css              styles propres à Mobilic, uniquement à partir des tokens DSFR
  app.js               logique des écrans
  infractions.js       relevé des infractions et composant « Accordéon d'infraction »
  prototype.json       titre, description, parcours du panneau, données de test
composants/            documentation des composants Mobilic hors DSFR
shared/shell-mobile.html  cadre commun des prototypes mobiles : panneau Parcours, téléphone, aperçu PDF
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
