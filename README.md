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

- L'app occupe toute la fenêtre et s'adapte à sa largeur : réduisez la fenêtre ou utilisez le mode responsive du navigateur pour tester le mobile.
- Le bouton ⚙ à gauche, toujours visible, ouvre les commandes du prototype (le panneau reste ouvert pendant les tests ; ⚙, ✕ ou Échap pour le fermer) : parcours à tester (bouton ▷), « Remplir le formulaire » sur les écrans qui en ont un, « Réinitialiser ».
- La touche Échap revient à l'écran précédent ou ferme la modale ouverte.
- SIREN de test : `110014016`.

## Structure

Voir aussi [CLAUDE.md](CLAUDE.md) pour les conventions de travail.

```
prototypes/<interface>/  sources d'un prototype (une interface, plusieurs flux)
  SPECS.md             specs de l'interface (règles communes + règles propres à chaque flux)
  app.html             écrans de l'application (responsive)
  app.css              styles propres à Mobilic, uniquement à partir des tokens DSFR
  app.js               logique des écrans
  infractions.js       relevé des infractions et composant « Accordéon d'infraction »
  prototype.json       titre, description, parcours du panneau
composants/            documentation des composants Mobilic hors DSFR
shared/mobilic.css     styles Mobilic communs à toutes les interfaces
shared/shell.html      cadre commun des prototypes : app pleine fenêtre, commandes du prototype, aperçu PDF
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
