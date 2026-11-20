# Skills Claude Code du dépôt

Chargés automatiquement par toute session Claude Code ouverte sur ce dépôt.

## Skills d'Emil Kowalski

Source : dépôt public `emilkowalski/skills` sur GitHub, licence MIT (copie dans `LICENSE-emilkowalski`). Copiés sans modification.

| Skill | Usage dans ce dépôt |
|---|---|
| `break-ui` | Tester un écran avec des données extrêmes (noms longs, champs vides, grands nombres) |
| `mobile-native` | Corrections CSS pour qu'un prototype mobile se comporte comme une app native |
| `emil-design-eng` | Soigner les interactions et les détails d'un composant |
| `review-animations` | Relire les animations existantes (à appeler explicitement) |
| `find-animation-opportunities` | Proposer des animations utiles, sans les implémenter |
| `learn-taste` | Transformer des corrections de design en règles écrites (à appeler explicitement) |
| `apple-design` | Interactions fluides façon Apple : gestes, glisser-déposer, panneaux, ressorts, retours visuels. Ses conseils de typographie (interlettrage, tailles) ne s'appliquent pas : le DSFR fait foi |

## Priorité

Les conventions du dépôt (`CLAUDE.md`, DSFR, specs, fiches `composants/`) priment sur les recommandations de ces skills. Exemple : une animation proposée doit utiliser les durées du DSFR et respecter `prefers-reduced-motion`.

## Mettre à jour

Recopier le dossier du skill depuis le dépôt source, puis relire la différence avant de pousser.
