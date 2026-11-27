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
| [Panneau latéral](panneau-lateral.md) | Modale (variante) | Contrôleur : contrôle ouvert sur grand écran |
| [Carte d'établissement](carte-etablissement.md) | Case à cocher + champs | Gestionnaire : inscription, établissements |
| [Champ téléphone](champ-telephone.md) | Liste déroulante + champ de saisie | Gestionnaire : inscription, détails de l'entreprise |
| [Encadré d'étape](encadre-etape.md) | Indicateur d'étapes + groupe de boutons | Gestionnaire : inscription, étapes Mobilic |
| [Encart webinaire](encart-webinaire.md) | Bouton tertiaire | Gestionnaire : inscription, confirmation |
| [Tableau Mobilic](tableau.md) | Tableau (variante) + liste déroulante | Toutes les interfaces ; contrôleur : derniers contrôles ; gestionnaire : salariés |
| [Section repliable](section-repliable.md) | Bouton + badge | Gestionnaire : onglet Salariés |
| [Barre de progression](barre-progression.md) | — | Gestionnaire : onglet Salariés |
| [Carte webinaire](carte-webinaire.md) | Carte (variante) + lien | Gestionnaire : menu latéral de l'espace |
| [Outil de prototypage](outil-prototypage.md) | Boutons, contrôle segmenté, onglets, info-bulles | Autour de tous les prototypes (hors application) |

## Ajustements des composants DSFR

| Composant DSFR | Ajustement Mobilic |
|---|---|
| En-tête (`fr-header`) | Le bloc des logos ne change pas de fond au survol ni à l'appui |
| Menu latéral (`fr-sidemenu`) | Sous 768 px, hors `fr-container`, ses marges négatives sont neutralisées. Pastille de notification possible sur un lien : badge DSFR `fr-badge--sm fr-badge--error fr-badge--no-icon`, aligné à droite. Dans l'espace gestionnaire : colonne de 270 px, 24 px à gauche, trait de séparation sur toute la hauteur, fixe au défilement comme l'en-tête |
| Bandeau d'information importante (`fr-notice`) | Texte en 14 px sans gras (`fr-text--sm`, et `fr-text--regular` sur le titre), comme dans la maquette : le DSFR le met en 16 px gras à partir de 768 px |
| Navigation principale (`fr-nav`) | Utilisée dans la page pour les rubriques de l'entreprise (Salariés, Véhicules…) : 24 px entre les liens, trait bas `--border-default-grey` sur toute la largeur ; liens en `fr-text--sm fr-text--regular` ; sous 992 px, reste en ligne, défile horizontalement et garde le soulignement du lien actif au lieu de passer en style menu mobile |

## Documenter un composant

Un fichier par composant, avec : rôle, anatomie, variantes, états, tokens, accessibilité. Le code d'un composant commun à toutes les interfaces est dans `shared/mobilic.css` ; celui d'un composant propre à une interface est dans son `app.css`.
