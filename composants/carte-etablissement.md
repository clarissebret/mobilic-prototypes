# Carte d'établissement

Carte qui présente un établissement (SIRET) de l'entreprise pendant l'inscription du gestionnaire. Une fois l'établissement sélectionné, elle s'ouvre sur ses champs à renseigner.

Code : `.etab` dans `prototypes/gestionnaire/app.css`, rendu par `renderEtabs()` dans `prototypes/gestionnaire/app.js`.

## Anatomie

- En-tête : case à cocher DSFR (`fr-checkbox-group`) dont le libellé contient l'adresse (en gras), le nom (`fr-text--sm`), puis le SIRET et le code NAF (`fr-text--xs`), en `--text-mention-grey`, 4 px entre chaque ligne.
- Champs : groupe de champs DSFR, affiché seulement quand la carte est sélectionnée. Type de transport et activité principale côte à côte à partir de 576 px (36em), empilés en dessous, suivis d'un message d'information DSFR (`fr-message--info`). Le téléphone utilise le [Champ téléphone](champ-telephone.md).

## Variantes

| Variante | Rendu |
|---|---|
| Plusieurs établissements | Case à cocher dans l'en-tête, carte fermée par défaut |
| Établissement unique | Pas de case à cocher : carte sélectionnée, champs affichés |

## États

| État | Rendu |
|---|---|
| Non sélectionnée | Contour 1 px `--border-default-grey`, sans fond (celui de l'encadré) ; champs repliés et inactifs (`inert`) |
| Sélectionnée | Contour 2 px `--border-active-blue-france` (bordure + ombre intérieure), champs affichés |

## Animation

À la sélection, les champs se déplient : hauteur par la grille (`grid-template-rows` 0fr → 1fr, 250 ms, `cubic-bezier(.23, 1, .32, 1)`), fondu (200 ms) et glissement de 8 px vers le bas (250 ms), même courbe. Le contour change en 200 ms (`ease`). Désélection : chemin inverse. Une fois dépliée, le masque est levé pour ne pas couper le contour de focus. Si l'utilisateur réduit les animations : fondu seul, sans dépliage ni glissement.

## Tokens et espacements

Padding 24 px ; 16 px entre deux cartes ; 24 px entre l'en-tête et les champs, et entre les champs.

## Accessibilité

La sélection passe par une case à cocher native : tout l'en-tête est cliquable par son libellé.
