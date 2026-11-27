# Specs : interface gestionnaire

Ce document décrit le comportement attendu de l'interface gestionnaire. Il fait foi pour l'implémentation.

Chaque règle a un identifiant stable (ex. `ETA-03`) : il ne change pas quand on ajoute ou supprime d'autres règles, et un identifiant supprimé n'est jamais réutilisé.

## Utilisateurs et contexte

### Qui

Le gestionnaire d'une entreprise de transport routier léger ou de déménagement : il gère le temps de travail des salariés de son entreprise dans Mobilic.

### Où

Sur ordinateur, au bureau, le plus souvent. L'interface reste utilisable sur mobile.

## Parcours : inscription

1. choix du métier : « Créer un compte en tant que » (Mobilic) ;
1b. création de compte : présentation de Cerbère (Mobilic) ;
2. création du compte professionnel (Cerbère, service d'authentification du ministère) :
   - a. e-mail et SIREN,
   - b. informations du compte,
   - c. ou, s'il a déjà un compte Cerbère, connexion à ce compte ;
3. détails de l'entreprise (Mobilic) ;
4. finalisation de l'inscription (Mobilic) ;
5. confirmation de l'inscription et webinaire (Mobilic).

Les étapes 2a, 2b et 2c sont des pages de Cerbère : Mobilic ne les maîtrise pas. Le prototype les reproduit à l'identique (mêmes champs, mêmes libellés) pour rendre le parcours compréhensible ; leurs règles ci-dessous décrivent ce que le gestionnaire y rencontre, pas une demande d'évolution. Les écrans Mobilic 1b, 3 et 4 portent le titre de page « S'inscrire comme gestionnaire » et un indicateur en 3 étapes : 1. Création de compte, 2. Inscription de l'entreprise, 3. Finaliser votre inscription. Cerbère se place dans l'étape 1.

## 1. Choix du métier

- **MET-01** Titre : « Créer un compte en tant que ». Deux choix : « Travailleur mobile » (« Je suis travailleur mobile et je renseigne mon temps de travail ») et « Gestionnaire » (« Je gère le temps de travail des salariés de mon entreprise »).
- **MET-02** « Gestionnaire » ouvre l'étape « Création de compte » (1b).
- **MET-04** Sous les tuiles : « Déjà un compte ? » et le lien « Se connecter », qui ouvre « Se connecter en tant que » (CNX-06).
- **MET-03** « Travailleur mobile » ouvre le parcours d'inscription du salarié (hors de ce parcours).

## 1b. Création de compte

- **CPT-01** Titre de page : « S'inscrire comme gestionnaire ». Encadré gris avec l'indicateur d'étapes « Création de compte », étape 1 sur 3, étape suivante « Inscription de l'entreprise ».
- **CPT-02** Texte : « Pour créer votre compte, vous allez être redirigé vers Cerbère, le service de connexion sécurisée des ministères chargés des transports. Vous reviendrez ensuite sur Mobilic pour inscrire votre entreprise. »
- **CPT-03** Le bouton « Continuer » envoie le gestionnaire vers la création du compte professionnel sur Cerbère (2a).
- **CPT-04** Sous le bouton, le lien « Qu'est-ce que Cerbère ? » ouvre l'aide de Cerbère (https://identite.din.developpement-durable.gouv.fr/aide/) dans une nouvelle fenêtre.
- **CPT-05** En bas de l'encadré, sous un trait de séparation et centré, le lien « J'ai déjà un compte » ouvre « Se connecter en tant que » (voir « Connexion »).

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
- **CER-06** Le téléphone, le téléphone portable et codePays sont facultatifs : le gestionnaire peut quitter Cerbère sans numéro de téléphone (voir SRC-06).
- **CER-07** Sous les mots de passe : « Votre mot de passe doit respecter les critères suivants : » puis « Être constitué de 12 caractères minimum », « au moins 1 caractère(s) majuscule(s) », « au moins 1 caractère(s) minuscule(s) », « au moins 1 chiffre(s) », « au moins 1 caractère(s) spécial(aux) ». Chaque critère passe au vert dès qu'il est rempli.
- **CER-08** Si la confirmation ne correspond pas au mot de passe : « Les deux mots de passe ne sont pas identiques. »
- **CER-09** « Valider » est actif quand les champs obligatoires sont remplis et que le mot de passe respecte CER-07 et CER-08. Il crée le compte et renvoie vers Mobilic. « Annuler » ramène à l'étape 2a.

## 2c. Cerbère : connexion à un compte existant

- **CER-10** Titre : « Connexion à votre compte professionnel ». Champs obligatoires : « E-mail » et « Mot de passe ». « Valider » est actif quand les deux sont remplis ; il connecte le gestionnaire et le renvoie vers l'étape 2 (« Inscription de l'entreprise »). « Annuler » ramène à la page de connexion de Mobilic.

## 3. Inscription de l'entreprise

- **ETA-10** Titre de page : « S'inscrire comme gestionnaire ». Encadré gris avec l'indicateur d'étapes « Inscription de l'entreprise », étape 2 sur 3, étape suivante « Finaliser votre inscription ».
- **ETA-11** Sous le titre de page, une alerte de succès sans texte complémentaire : « Votre compte Mobilic a bien été créé ». Elle ne s'affiche qu'à la sortie de la création du compte sur Cerbère (2b), pas après une connexion à un compte existant (2c) ni à la reprise de l'inscription (ETA-16).
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
  | Activité principale | Oui, pour Marchandises (TRM) seulement | Courte distance, Longue distance, Messagerie, Fonds et valeurs. Grisée tant que le type n'est pas Marchandises (TRM) ; vidée si le type change |

- **ETA-07** Sous le type de transport et l'activité : « Ce type d'activité sera appliqué par défaut à tous les salariés de l'établissement. Vous pourrez le modifier ensuite pour chaque salarié. »
- **ETA-08** « Continuer » est actif quand au moins un établissement non encore inscrit est sélectionné et que les champs obligatoires de chaque établissement sélectionné (hors établissements déjà inscrits) sont remplis.
- **ETA-12** Entreprise (SIREN) déjà inscrite sur Mobilic par un autre gestionnaire : l'étape n'affiche que l'alerte d'information « Votre entreprise est déjà inscrite sur Mobilic », « Rapprochez-vous d'un gestionnaire de votre entreprise pour qu'il vous donne accès à son espace. » Ni liste d'établissements, ni « Continuer ».
- **ETA-13** Établissement (SIRET) déjà inscrit sur Mobilic : il est listé et sélectionnable comme les autres. Une fois sélectionné, sa carte affiche, à la place des champs, l'alerte d'information « Cet établissement est déjà inscrit sur Mobilic », « Rapprochez-vous d'un gestionnaire de votre entreprise pour qu'il vous donne accès à son espace. » Il ne compte pas pour activer « Continuer ».
- **ETA-14** Nombre de salariés concernés par Mobilic : 1 au moins, sans maximum. Une valeur inférieure à 1 affiche sous le champ : « Indiquez au moins 1 salarié. »
- **ETA-15** Retour (bouton Android, Échap) est sans effet sur cette étape : le compte Cerbère est déjà créé.
- **ETA-16** Reprise : un gestionnaire qui a créé son compte Cerbère sans inscrire son entreprise arrive directement sur cette étape à sa prochaine connexion à Mobilic.

## 4. Finalisation de l'inscription

- **SRC-05** Titre de page : « S'inscrire comme gestionnaire ». Encadré gris avec l'indicateur d'étapes « Finaliser votre inscription », étape 3 sur 3.
- **SRC-06** Le champ obligatoire « Votre numéro de téléphone » (indicatif pays, puis numéro) s'affiche en premier, sans titre ni texte d'introduction. Il est prérempli avec le numéro donné sur Cerbère : le téléphone portable s'il a été renseigné, sinon le téléphone ; l'indicatif est repris de codePays quand il correspond à un pays de la liste. Sans numéro sur Cerbère, il est vide. « Terminer » est inactif tant qu'il est vide.
- **SRC-01** Question facultative « Comment avez-vous connu Mobilic ? », une seule réponse (boutons radio), sur deux colonnes sur grand écran : Courriel de l'équipe Mobilic ; Appel de l'équipe Mobilic ; Sur les réseaux sociaux ; Lors d'un webinaire organisé par l'équipe Mobilic ; Une plateforme de mise en relation entre entreprises et particuliers ; Lors d'un contrôle ; Un courriel/courrier de la DREAL ; Recherche internet ; Bouche à oreille ; Autre.
- **SRC-02** Case facultative : « Je souhaite m'abonner à la lettre d'information de Mobilic pour rester informé par mail des nouveautés du produit ».
- **SRC-03** « Terminer » mène à la confirmation, que le gestionnaire ait répondu ou non à la question et à la lettre d'information.
- **SRC-07** Reprise : un gestionnaire dont l'entreprise est inscrite mais qui n'a pas cliqué sur « Terminer » revient sur cette étape à sa prochaine connexion à Mobilic. Retour y est alors sans effet.

## 5. Confirmation et webinaire

- **FIN-01** Titre : « Votre inscription est terminée ». Texte : « Un e-mail de vérification de votre compte vous a été envoyé à l'adresse [e-mail]. Cliquez sur le lien qu'il contient pour activer votre compte. »
- **FIN-02** « Aller dans mon espace » ouvre l'espace gestionnaire.
- **FIN-03** Encart « Offrez-vous une formation gratuite de 45 minutes ! » : « Apprenez à maîtriser Mobilic grâce à un accompagnement personnalisé et gagnez du temps : formation à la mise en place, démonstration et réponse à toutes vos questions ! », puis la prochaine session : date, heure, « Mobilic - Formation gestionnaires » et « S'inscrire ». Après inscription, il devient « Inscription confirmée », inactif.
- **FIN-04** Si aucun webinaire n'est programmé, l'encart n'est pas affiché.

## Parcours : salariés de l'entreprise

Page « Entreprise » de l'espace gestionnaire (connecté), onglet « Salariés ». Le gestionnaire y suit les salariés rattachés à son entreprise et les invitations envoyées. Les autres onglets et les fenêtres ouvertes depuis cet onglet (inviter, modifier la fin de rattachement, prolonger le rattachement) sont hors de ce parcours.

### 6. Onglet Salariés

- **SAL-01** En haut de l'onglet : titre « Salariés » avec le nombre de salariés, boutons « Inviter une liste de salariés » et « Inviter un nouveau salarié ». Dessous : le filtre « Tous les groupes » et l'indicateur « Inscrits sur Mobilic : [x] sur [y] », avec une barre de progression.
- **SAL-02** Le filtre par groupe d'affectation restreint les tableaux « Salariés temporaires » et « Salariés longue durée » au groupe choisi.
- **SAL-03** Trois sections repliables, dans cet ordre : « Invitations en attente », « Salariés temporaires », « Salariés longue durée ».
- **SAL-04** « Salariés longue durée » est toujours affichée et ouverte à l'arrivée sur l'onglet.
- **SAL-05** « Invitations en attente » n'est affichée que s'il reste au moins une invitation en attente. Son titre porte le nombre d'invitations ; elle est repliée à l'arrivée sur l'onglet.
- **SAL-06** « Salariés temporaires » n'est affichée que si l'entreprise a au moins un salarié temporaire. Il y en a généralement peu.

#### Invitations en attente

- **SAL-07** Colonnes : « Identifiant ou email », « Accès gestionnaire », « Fin rattachement », « Invité le », « Relancé le », puis les actions « Relancer » et « Annuler » de chaque invitation.
- **SAL-08** À droite du titre de la section : « Relancer les invitations ».
- **SAL-09** « Annuler » retire l'invitation de la liste. Quand la dernière est annulée, la section disparaît (SAL-05).

#### Salariés temporaires

- **SAL-10** Un salarié temporaire a une date de fin de rattachement dès son ajout. Colonnes : « Salarié » (triable), « Email », « Début rattachement », « Fin rattachement » avec le lien « Modifier », « Groupe d'affectation » et « Type d'activité » (modifiables par liste déroulante).
- **SAL-11** À l'approche de la fin de rattachement, une alerte s'affiche en tête de la section, une par salarié concerné : « [Prénom Nom] sera détaché dans [n] jours, le [date]. » et le lien « Prolonger le rattachement ». Le gestionnaire peut la fermer.

#### Salariés longue durée

- **SAL-12** Colonnes : « Salarié » (triable), « Email », « Début rattachement », « Accès gestionnaire », « Groupe d'affectation » et « Type d'activité » (modifiables par liste déroulante).

#### Salariés détachés et inactifs (deux tableaux de salariés)

- **SAL-13** Un salarié détaché reste dans son tableau, grisé, avec le badge « Détaché » ; ses valeurs ne sont plus modifiables.
- **SAL-14** Un salarié qui n'a pas enregistré de temps de travail depuis 6 mois porte le badge « Inactif ».
- **SAL-15** Quand des salariés sont inactifs, une alerte s'affiche au-dessus des sections : « [Prénom Nom] et [n] autres salariés n'ont pas enregistré de temps de travail depuis 6 mois. Pensez à détacher ces salariés s'ils ne font plus partie de votre entreprise, en sélectionnant l'option “mettre fin au rattachement”, ou en cliquant ici ». Le gestionnaire peut la fermer.

## Navigation

- **NAV-01** Retour (bouton Android ou Échap) : de 1b vers le choix du métier, de 2a vers 1b, de 2c vers la page de connexion, de 2b vers 2a, de la finalisation vers l'inscription de l'entreprise (sauf en reprise, SRC-07), sans effet sur l'inscription de l'entreprise (ETA-15), de la confirmation vers la finalisation. Sans effet sur le choix du métier.
- **NAV-02** Retour est sans effet sur l'onglet Salariés, sauf pour refermer le menu de l'en-tête.

## Connexion

- **CNX-06** « J'ai déjà un compte » (CPT-05) et « Se connecter » dans l'en-tête ouvrent d'abord la page « Se connecter en tant que », avec deux tuiles : « Entreprise ou salarié » (« Je suis travailleur mobile ou gestionnaire d'une entreprise de transport ») et « Contrôleur » (« Je suis agent public de l'État et je me connecte à mon espace dédié »). Dessous : « Pas encore de compte ? » et le lien « Je m'inscris », qui mène au choix du métier.
- **CNX-07** « Entreprise ou salarié » ouvre la page « Se connecter » (CNX-01). « Contrôleur » ouvre la connexion contrôleur (hors de ce parcours). Retour ramène à l'écran d'où la page a été ouverte.
- **CNX-01** Page « Se connecter » de Mobilic, ouverte depuis la tuile « Entreprise ou salarié » (CNX-07). Deux sections dans un encadré gris, séparées par « ou ».
- **CNX-02** Première section, sans titre : texte « Cerbère est le service de connexion sécurisée des ministères chargés des transports. », bouton « Continuer avec Cerbère » qui mène à la connexion Cerbère (2c), puis le lien « Qu'est-ce que Cerbère ? » (aide de Cerbère, nouvelle fenêtre).
- **CNX-03** Deuxième section, sans titre : champs obligatoires « Adresse e-mail » (aide « Format attendu : nom@domaine.fr ») et « Mot de passe », lien « Mot de passe oublié ? », bouton « Se connecter » actif quand les deux champs sont remplis.
- **CNX-04** Sous un trait de séparation, le lien « Je n'ai pas de compte » mène à l'inscription (choix du métier).
- **CNX-05** Retour (bouton Android, Échap) ramène à « Se connecter en tant que ».

## En-tête (non connecté)

- **ENT-01** Les écrans Mobilic du parcours (hors pages Cerbère) ont l'en-tête Mobilic non connecté : liens « Nous contacter », « Créer un compte » et « Se connecter », puis la navigation principale « Accueil », « Documentation », « Partenaires et logiciels », « Certificat » et « Centre d'aide ».
- **ENT-02** « Centre d'aide » s'ouvre dans une nouvelle fenêtre. « Se connecter » ouvre « Se connecter en tant que » (CNX-06). « Créer un compte » ramène au choix du métier et efface les saisies.
- **ENT-03** Sous 992 px, liens et navigation sont regroupés dans le menu (bouton « Menu ») ; « Fermer », Échap ou Retour le referment.

## Composants utilisés

- DSFR : en-tête (liens et navigation principale), menu latéral, bandeau d'information importante, badge, tableau, tuile, champ de saisie, liste déroulante, bouton radio, case à cocher, alerte, lien, indicateur d'étapes, groupe de boutons.
- Mobilic : [Carte d'établissement](../../composants/carte-etablissement.md), [Champ téléphone](../../composants/champ-telephone.md), [Encadré d'étape](../../composants/encadre-etape.md), [Encart webinaire](../../composants/encart-webinaire.md), [Tableau Mobilic](../../composants/tableau.md), [Section repliable](../../composants/section-repliable.md), [Onglets de l'entreprise](../../composants/onglets-entreprise.md), [Barre de progression](../../composants/barre-progression.md).
