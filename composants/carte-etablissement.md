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
| Non sélectionnée | Contour 1 px `--border-default-grey` |
| Sélectionnée | Contour 2 px `--border-active-blue-france` (bordure + ombre intérieure), champs affichés |

## Tokens et espacements

Padding 16 px ; 16 px entre deux cartes ; 24 px entre l'en-tête et les champs, et entre les champs.

## Accessibilité

La sélection passe par une case à cocher native : tout l'en-tête est cliquable par son libellé.
