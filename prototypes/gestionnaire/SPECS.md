# Specs : interface gestionnaire

Ce document décrit le comportement attendu de l'interface gestionnaire. Il fait foi pour l'implémentation.

Chaque règle a un identifiant stable (ex. `ETA-03`) : il ne change pas quand on ajoute ou supprime d'autres règles, et un identifiant supprimé n'est jamais réutilisé.

## Utilisateurs et contexte

### Qui

Le gestionnaire d'une entreprise de transport routier léger ou de déménagement : il gère le temps de travail des salariés de son entreprise dans Mobilic.

### Où

Sur ordinateur, au bureau, le plus souvent. L'interface reste utilisable sur mobile.

## Parcours : inscription

1. choix du métier (Mobilic) ;
2. création du compte professionnel (Cerbère, service d'authentification du ministère) :
   - a. e-mail et SIREN,
   - b. informations du compte ;
3. établissements de l'entreprise (Mobilic) ;
4. finalisation de l'inscription (Mobilic).

Les étapes 2a et 2b sont des pages de Cerbère : Mobilic ne les maîtrise pas. Le prototype les simule pour rendre le parcours compréhensible ; leurs règles ci-dessous décrivent ce que le gestionnaire y rencontre, pas une demande d'évolution.

## 1. Choix du métier

- **MET-01** Titre : « Quel est votre métier ? ». Deux choix : « Travailleur mobile » et « Gestionnaire ».
- **MET-02** « Gestionnaire » envoie le gestionnaire vers la création du compte professionnel sur Cerbère.
- **MET-03** « Travailleur mobile » ouvre le parcours d'inscription du salarié (hors de ce parcours).

## 2a. Cerbère : e-mail et SIREN

- **CER-01** Titre : « Création d'un compte professionnel ». Champs obligatoires : « E-mail » et « SIREN ».
- **CER-02** À la validation, une erreur est signalée sous le champ concerné :

  | Cas | Message |
  |---|---|
  | E-mail mal formé | Saisissez une adresse e-mail valide, au format nom@domaine.fr |
  | SIREN qui ne fait pas 9 chiffres (espaces ignorés) | Saisissez un numéro SIREN de 9 chiffres, par exemple 123 456 789. |

- **CER-03** « Annuler » ramène au choix du métier.

## 2b. Cerbère : informations du compte

- **CER-04** Le SIREN et l'e-mail saisis à l'étape précédente sont affichés, non modifiables.
- **CER-05** Champs : civilité (Monsieur, Madame, Autre), prénom, nom, adresse, code postal, ville, pays, téléphone, téléphone portable, mot de passe, confirmation du mot de passe. Obligatoires : civilité, prénom, nom, mot de passe et confirmation.
- **CER-06** Le mot de passe doit contenir 12 caractères minimum, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial. Chaque condition s'affiche sous le champ et passe au vert dès qu'elle est remplie.
- **CER-07** Si la confirmation ne correspond pas au mot de passe : « Les deux mots de passe ne sont pas identiques. »
- **CER-08** « Valider » est actif quand les champs obligatoires sont remplis et que le mot de passe respecte CER-06 et CER-07. Il crée le compte et renvoie vers Mobilic. « Annuler » ramène à l'étape 2a.

## 3. Établissements

- **ETA-01** Titre : « Création de votre compte Mobilic », indicateur d'étapes « Vos établissements », étape 1 sur 2, étape suivante « Finalisation de l'inscription ».
- **ETA-02** Le nom de l'entreprise et son SIREN sont rappelés en haut de l'écran.
- **ETA-03** Les établissements (SIRET) rattachés au SIREN sont listés, chacun avec son adresse, son SIRET et son code NAF.
- **ETA-04** Plusieurs établissements : texte « Sélectionnez le ou les établissements que vous gérez, puis complétez leurs informations : ». Le gestionnaire coche un ou plusieurs établissements ; les champs d'un établissement s'affichent sous lui quand il est coché.
- **ETA-05** Un seul établissement : texte « Complétez les informations de votre établissement : ». L'établissement est déjà sélectionné, sans case à cocher, ses champs affichés.
- **ETA-06** Champs de chaque établissement sélectionné :

  | Champ | Obligatoire | Aide |
  |---|---|---|
  | Nom usuel | Oui | Nom sous lequel vos salariés connaissent l'établissement |
  | Téléphone de l'établissement | Non | |
  | Nombre de salariés concernés par Mobilic | Oui, 1 au moins | Conducteurs, déménageurs, ambulanciers… |
  | Type de transport routier | Oui | Marchandises (TRM), Voyageurs (TRV), Sanitaire (TRS), Déménagement |
  | Activité principale | Oui | |

- **ETA-07** « Continuer » est actif quand au moins un établissement est sélectionné et que les champs obligatoires de chaque établissement sélectionné sont remplis.

## 4. Finalisation de l'inscription

- **FIN-01** Indicateur d'étapes « Finalisation de l'inscription », étape 2 sur 2. Titre : « Votre compte est créé ». Texte : « Un e-mail de vérification a été envoyé à [e-mail]. Cliquez sur le lien qu'il contient pour activer votre compte. »
- **FIN-02** Question facultative « Comment avez-vous connu Mobilic ? », plusieurs réponses possibles : Courriel de l'équipe Mobilic ; Appel de l'équipe Mobilic ; Sur les réseaux sociaux ; Lors d'un webinaire organisé par l'équipe Mobilic ; Lors d'un contrôle ; Un courrier ou courriel de la DREAL ; Recherche internet ; Bouche à oreille ; Autre.
- **FIN-03** Case facultative : « Je souhaite recevoir la lettre d'information de Mobilic pour être informé des nouveautés ».
- **FIN-04** « Accéder à mon espace » ouvre l'espace gestionnaire.
- **FIN-05** Encart « Offrez-vous une formation gratuite de 45 minutes » : prochain webinaire « Mobilic : formation gestionnaires » (date et heure) et bouton « Je m'inscris ». Après inscription, le bouton devient « Inscription confirmée », inactif.

## Navigation

- **NAV-01** Retour (bouton Android ou Échap) : de 2a vers le choix du métier, de 2b vers 2a, de la finalisation vers les établissements. Sans effet sur le choix du métier.

## Composants utilisés

- DSFR : en-tête, tuile, champ de saisie, liste déroulante, bouton radio, case à cocher, indicateur d'étapes, groupe de boutons.
- Mobilic : [Carte d'établissement](../../composants/carte-etablissement.md).
