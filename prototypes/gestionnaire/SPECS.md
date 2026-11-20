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
1b. création de compte : présentation de Cerbère (Mobilic) ;
2. création du compte professionnel (Cerbère, service d'authentification du ministère) :
   - a. e-mail et SIREN,
   - b. informations du compte ;
3. détails de l'entreprise (Mobilic) ;
4. finalisation de l'inscription (Mobilic) ;
5. confirmation de l'inscription et webinaire (Mobilic).

Les étapes 2a et 2b sont des pages de Cerbère : Mobilic ne les maîtrise pas. Le prototype les reproduit à l'identique (mêmes champs, mêmes libellés) pour rendre le parcours compréhensible ; leurs règles ci-dessous décrivent ce que le gestionnaire y rencontre, pas une demande d'évolution. Les écrans Mobilic 1b, 3 et 4 portent le titre de page « S'inscrire comme gestionnaire » et un indicateur en 3 étapes : 1. Création de compte, 2. Inscription de l'entreprise, 3. Finaliser votre inscription. Cerbère se place dans l'étape 1.

## 1. Choix du métier

- **MET-01** Titre : « Quel est votre métier ? ». Deux choix : « Travailleur mobile » et « Gestionnaire ».
- **MET-02** « Gestionnaire » ouvre l'étape « Création de compte » (1b).
- **MET-03** « Travailleur mobile » ouvre le parcours d'inscription du salarié (hors de ce parcours).

## 1b. Création de compte

- **CPT-01** Titre de page : « S'inscrire comme gestionnaire ». Encadré gris avec l'indicateur d'étapes « Création de compte », étape 1 sur 3, étape suivante « Inscription de l'entreprise ».
- **CPT-02** Texte : « Pour créer votre compte, vous allez être redirigé vers Cerbère, le service de connexion sécurisée des ministères chargés des transports. Vous reviendrez ensuite sur Mobilic pour inscrire votre entreprise. »
- **CPT-03** Le bouton « Continuer » envoie le gestionnaire vers la création du compte professionnel sur Cerbère (2a).
- **CPT-04** Sous le bouton, le lien « Qu'est-ce que Cerbère ? » ouvre l'aide de Cerbère (https://identite.din.developpement-durable.gouv.fr/aide/) dans une nouvelle fenêtre.

## 2a. Cerbère : e-mail et SIREN

- **CER-01** Titre : « Création d'un compte professionnel ». Champs obligatoires : « E-mail » et « SIREN ». Boutons « Valider » et « Annuler ».
- **CER-02** À la validation, une erreur est signalée sous le champ concerné :

  | Cas | Message |
  |---|---|
  | E-mail mal formé | Saisissez une adresse e-mail valide, au format nom@domaine.fr |
  | SIREN qui ne fait pas 9 chiffres (espaces ignorés) | Saisissez un numéro SIREN de 9 chiffres, par exemple 123 456 789. |

- **CER-03** « Annuler » ramène à l'étape « Création de compte » (1b).

## 2b. Cerbère : informations du compte

- **CER-04** Le SIREN saisi à l'étape précédente est affiché, non modifiable. L'e-mail est prérempli.
- **CER-05** Champs, dans cet ordre : Civilité (Monsieur, Madame, Autre), Prénom, Nom, E-mail, Adresse, Code postal, Ville, Pays, codePays, Téléphone, Téléphone portable, Mot de passe, Confirmation du mot de passe. Obligatoires : civilité, prénom, nom, e-mail, mot de passe et confirmation.
- **CER-06** Le téléphone, le téléphone portable et codePays sont facultatifs : le gestionnaire peut quitter Cerbère sans numéro de téléphone (voir SRC-04).
- **CER-07** Sous les mots de passe : « Votre mot de passe doit respecter les critères suivants : » puis « Être constitué de 12 caractères minimum », « au moins 1 caractère(s) majuscule(s) », « au moins 1 caractère(s) minuscule(s) », « au moins 1 chiffre(s) », « au moins 1 caractère(s) spécial(aux) ». Chaque critère passe au vert dès qu'il est rempli.
- **CER-08** Si la confirmation ne correspond pas au mot de passe : « Les deux mots de passe ne sont pas identiques. »
- **CER-09** « Valider » est actif quand les champs obligatoires sont remplis et que le mot de passe respecte CER-07 et CER-08. Il crée le compte et renvoie vers Mobilic. « Annuler » ramène à l'étape 2a.

## 3. Inscription de l'entreprise

- **ETA-10** Titre de page : « S'inscrire comme gestionnaire ». Encadré gris avec l'indicateur d'étapes « Inscription de l'entreprise », étape 2 sur 3, étape suivante « Finaliser votre inscription ».
- **ETA-11** Sous le titre de page, une alerte de succès sans texte complémentaire : « Votre compte Mobilic a bien été créé ».
- **ETA-03** Les établissements (SIRET) rattachés au SIREN sont listés, chacun avec son adresse, son nom (« Nom : »), son SIRET (« SIRET : ») et son code NAF (« CODE NAF : »).
- **ETA-04** Plusieurs établissements : texte « Veuillez sélectionner un ou plusieurs établissements : ». Le gestionnaire coche un ou plusieurs établissements ; les champs d'un établissement s'affichent sous lui quand il est coché.
- **ETA-05** Un seul établissement : texte « Votre établissement : ». L'établissement est déjà sélectionné, sans case à cocher, ses champs affichés.
- **ETA-06** Champs de chaque établissement sélectionné :

  | Champ | Obligatoire | Aide |
  |---|---|---|
  | Nom usuel | Oui | Prérempli avec le nom de l'établissement s'il est connu |
  | Numéro de téléphone de l'entreprise | Non | Indicatif pays, puis numéro. « Format attendu : 01 99 00 12 34 » |
  | Nombre de salariés concernés par Mobilic | Oui, 1 au moins | « Exemple : chauffeurs, accompagnateurs, agents… » |
  | Type de transport routier | Oui | Marchandises (TRM), Voyageurs (TRV), Sanitaire (TRS), Déménagement |
  | Activité principale | Oui | |

- **ETA-07** Sous le type de transport et l'activité : « Ce type d'activité sera appliqué par défaut à tous les salariés de l'établissement. Vous pourrez le modifier ensuite pour chaque salarié. »
- **ETA-08** « Continuer » est actif quand au moins un établissement est sélectionné, que les champs obligatoires de chaque établissement sélectionné sont remplis.

## 4. Finalisation de l'inscription

- **SRC-05** Titre de page : « S'inscrire comme gestionnaire ». Encadré gris avec l'indicateur d'étapes « Finaliser votre inscription », étape 3 sur 3.
- **SRC-04** Si le gestionnaire n'a donné ni téléphone ni téléphone portable sur Cerbère, le champ obligatoire « Votre numéro de téléphone » (indicatif pays, puis numéro) s'affiche en premier, sans titre ni texte d'introduction. Sinon, il n'est pas affiché. « Terminer » est inactif tant qu'il est vide.
- **SRC-01** Question facultative « Comment avez-vous connu Mobilic ? », une seule réponse (boutons radio), sur deux colonnes sur grand écran : Courriel de l'équipe Mobilic ; Appel de l'équipe Mobilic ; Sur les réseaux sociaux ; Lors d'un webinaire organisé par l'équipe Mobilic ; Une plateforme de mise en relation entre entreprises et particuliers ; Lors d'un contrôle ; Un courriel/courrier de la DREAL ; Recherche internet ; Bouche à oreille ; Autre.
- **SRC-02** Case facultative : « Je souhaite m'abonner à la lettre d'information de Mobilic pour rester informé par mail des nouveautés du produit ».
- **SRC-03** « Terminer » mène à la confirmation, que le gestionnaire ait répondu ou non à la question et à la lettre d'information.

## 5. Confirmation et webinaire

- **FIN-01** Titre : « Votre inscription est terminée ». Texte : « Un e-mail de vérification de votre compte vous a été envoyé à l'adresse [e-mail]. Cliquez sur le lien qu'il contient pour activer votre compte. »
- **FIN-02** « Aller dans mon espace » ouvre l'espace gestionnaire.
- **FIN-03** Encart « Offrez-vous une formation gratuite de 45 minutes ! » : « Apprenez à maîtriser Mobilic grâce à un accompagnement personnalisé et gagnez du temps : formation à la mise en place, démonstration et réponse à toutes vos questions ! », puis la prochaine session : date, heure, « Mobilic : Formation gestionnaires » et « S'inscrire ». Après inscription, il devient « Inscription confirmée », inactif.

## Navigation

- **NAV-01** Retour (bouton Android ou Échap) : de 1b vers le choix du métier, de 2a vers 1b, de 2b vers 2a, de la finalisation vers les détails de l'entreprise, de la confirmation vers la finalisation. Sans effet sur le choix du métier.

## Composants utilisés

- DSFR : en-tête, tuile, champ de saisie, liste déroulante, bouton radio, case à cocher, alerte, lien, indicateur d'étapes, groupe de boutons.
- Mobilic : [Carte d'établissement](../../composants/carte-etablissement.md), [Champ téléphone](../../composants/champ-telephone.md), [Encadré d'étape](../../composants/encadre-etape.md), [Encart webinaire](../../composants/encart-webinaire.md).
