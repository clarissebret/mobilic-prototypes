# Composants Mobilic

Composants propres à Mobilic, qui n'existent pas dans le DSFR ou qui en sont une variante. Pour tout le reste, on utilise le DSFR tel quel.

## Où est branché le DSFR

- **Version** : déclarée dans `package.json` (`@gouvfr/dsfr`, actuellement 1.15.4), installée par `npm ci`.
- **Intégration** : `scripts/build.py` intègre le CSS du DSFR et ses icônes (Remix Icon) dans la page de chaque prototype. Les polices Marianne sont copiées dans `dist/fonts`.
- **Mettre à jour le DSFR** : changer la version dans `package.json`, lancer `npm install`, puis vérifier les prototypes.

## Règles communes

- Un composant Mobilic s'appuie sur des composants DSFR quand c'est possible (bouton, tag, case à cocher, badge).
- Les couleurs ne viennent que des tokens DSFR (`var(--…)`), jamais de valeurs en dur, pour rester compatibles avec le mode sombre.
- Les espacements suivent l'échelle DSFR (multiples de 4 px).

## Catalogue

| Composant | Base DSFR | Utilisé dans |
|---|---|---|
| [Accordéon d'infraction](accordeon-infraction.md) | Accordéon (variante) | Contrôleur : relevé des infractions, bulletin |
| [Barre d'actions fixe](barre-actions-fixe.md) | Groupe de boutons | Contrôleur : relevé des infractions |
| [Onglets du contrôle](onglets-controle.md) | Onglets (variante) + badge | Contrôleur : page du contrôle |
| [Tuile de choix](tuile-choix.md) | Tuile (variante) | Contrôleur : accueil |

## Documenter un composant

Un fichier par composant, avec : rôle, anatomie, variantes, états, tokens, accessibilité. Le code est dans le `app.css` de l'interface qui l'utilise.
