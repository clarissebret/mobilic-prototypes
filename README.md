# Prototypes Mobilic

Prototypes interactifs de [Mobilic](https://mobilic.beta.gouv.fr), construits sur le [Système de design de l'État (DSFR)](https://www.systeme-de-design.gouv.fr), pour tester des parcours avec l'équipe avant développement.

**Toutes les données affichées sont fictives.** Lire [CONFIDENTIALITE.md](CONFIDENTIALITE.md) avant toute contribution.

## Prototypes

| Prototype | Dossier | Contenu |
|---|---|---|
| Contrôle LIC papier / feuille de route | `prototypes/controle-lic-papier` | Interface contrôleur mobile : création du contrôle, relevé des infractions, édition, envoi et export du bulletin de contrôle. Inclut le secteur TRS. |

Les prototypes publiés sont listés sur la page d'accueil GitHub Pages du dépôt.

## Utilisation du prototype

- Le panneau de gauche liste les flux à tester, propose « Remplir le formulaire » sur les écrans qui en ont un, et « Réinitialiser ».
- La barre Android du bas est active : le bouton Retour revient à l'écran précédent ou ferme la modale ouverte.
- SIREN de test : `110014016`.

## Structure

```
prototypes/<nom>/      sources d'un prototype
  app.html             écrans de l'application (rendus dans le cadre du téléphone, 360 px)
  app.css              styles propres à Mobilic, uniquement à partir des tokens DSFR
  app.js               logique des écrans
  infractions.js       relevé des infractions et composant « Accordéon d'infraction »
  shell.html           cadre du prototype : panneau de commandes, téléphone Android, aperçu PDF
assets/                logo Mobilic
scripts/build.py       assemble un prototype en un fichier HTML autonome dans dist/<nom>/
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
