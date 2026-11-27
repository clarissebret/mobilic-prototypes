# Specs : interface gestionnaire

Ce document décrit le comportement attendu de l'interface gestionnaire. Il fait foi pour l'implémentation.

Le gestionnaire d'une entreprise de transport routier léger ou de déménagement gère dans Mobilic le temps de travail des salariés de son entreprise. Il utilise l'interface sur ordinateur, au bureau, le plus souvent, mais elle reste utilisable sur mobile.

<details>
<summary><h2 id="parcours--inscription">Parcours : inscription</h2></summary>

Le gestionnaire crée son compte et inscrit son entreprise sur Mobilic.

### 1. Choix du métier

Le gestionnaire arrive sur Mobilic et indique pourquoi il crée un compte.

**MET-01** L'écran s'intitule « Créer un compte en tant que » et propose deux choix :
- « Travailleur mobile » : « Je suis travailleur mobile et je renseigne mon temps de travail » ;
- « Gestionnaire » : « Je gère le temps de travail des salariés de mon entreprise ».

**MET-02** « Gestionnaire » mène à la création de compte (1b).

**MET-03** « Travailleur mobile » mène au parcours d'inscription du salarié, qui ne fait pas partie de ce parcours.

**MET-04** Pour ceux qui ont déjà un compte, le texte « Déjà un compte ? » et le lien « Se connecter » figurent sous les tuiles. Le lien ouvre « Se connecter en tant que » (CNX-06).

### 1b. Création de compte

Avant de l'envoyer sur Cerbère, Mobilic explique au gestionnaire ce qui va se passer.

**CPT-01** La page s'appelle « S'inscrire comme gestionnaire ». L'encadré gris indique qu'on est à l'étape 1 sur 3, « Création de compte », et que la suivante est « Inscription de l'entreprise ».

**CPT-02** Le texte prévient le gestionnaire qu'il va changer de site, puis revenir : « Pour créer votre compte, vous allez être redirigé vers Cerbère, le service de connexion sécurisée des ministères chargés des transports. Vous reviendrez ensuite sur Mobilic pour inscrire votre entreprise. »

**CPT-03** Le bouton « Continuer » l'envoie créer son compte professionnel sur Cerbère (CER-11).

**CPT-04** Sous le bouton, le lien « Qu'est-ce que Cerbère ? » ouvre l'aide de Cerbère (https://identite.din.developpement-durable.gouv.fr/aide/) dans une nouvelle fenêtre.

**CPT-05** En bas de l'encadré, sous un trait de séparation et centré, le lien « J'ai déjà un compte » ouvre « Se connecter en tant que » (voir « Connexion »).

### 2. Passage par Cerbère

Cerbère est le service de connexion sécurisée des ministères chargés des transports. C'est un service tiers : Mobilic ne maîtrise ni ses pages, ni ses champs, ni ses messages, qui ne sont donc pas décrits ici. Cette section décrit seulement la jonction entre les deux : quand Mobilic envoie le gestionnaire sur Cerbère, ce que Cerbère transmet à Mobilic, et où le gestionnaire arrive à son retour.

#### Aller sur Cerbère

**CER-11** Mobilic envoie le gestionnaire sur Cerbère à deux endroits :

| Depuis | Action | Sur Cerbère |
|---|---|---|
| Création de compte (1b) | « Continuer » (CPT-03) | Création d'un compte professionnel |
| Page « Se connecter » | « Continuer avec Cerbère » (CNX-02) | Connexion à un compte professionnel existant |

#### Revenir de Cerbère

**CER-12** Le gestionnaire revient sur Mobilic à un endroit qui dépend de ce qu'il a fait sur Cerbère :

| Sur Cerbère, il a… | Il arrive sur |
|---|---|
| créé son compte | L'inscription de l'entreprise, avec l'alerte « Votre compte Mobilic a bien été créé » (ETA-11) |
| connecté un compte existant, sans avoir inscrit son entreprise | L'inscription de l'entreprise, sans alerte (ETA-16) |
| connecté un compte existant, entreprise inscrite mais sans avoir cliqué sur « Terminer » | La finalisation (SRC-07) |
| connecté un compte existant, inscription terminée | Son espace gestionnaire |
| annulé la création du compte | La création de compte (1b) |
| annulé la connexion | La page « Se connecter » |

#### Ce que Cerbère transmet à Mobilic

**CER-13** Mobilic reprend du compte Cerbère :

| Donnée | Utilisée pour |
|---|---|
| SIREN | Lister les établissements de l'entreprise (ETA-03) |
| E-mail | Envoyer l'e-mail de vérification (FIN-01) |
| Téléphone portable, téléphone et codePays | Préremplir le numéro de téléphone (SRC-06) |

Le téléphone est facultatif sur Cerbère : Mobilic peut ne recevoir aucun numéro. C'est pourquoi il le demande à la finalisation (SRC-06).

### 3. Inscription de l'entreprise

À cette étape, le gestionnaire a son compte. Il indique maintenant quels établissements de son entreprise il inscrit sur Mobilic, et décrit leur activité.

**ETA-10** La page s'appelle « S'inscrire comme gestionnaire ». L'encadré gris indique qu'on est à l'étape 2 sur 3, « Inscription de l'entreprise », et que la suivante est « Finaliser votre inscription ».

**ETA-11** Quand le gestionnaire arrive tout juste de la création de son compte sur Cerbère (CER-12), une alerte de succès le lui confirme sous le titre : « Votre compte Mobilic a bien été créé ». Elle n'a pas de texte complémentaire. Elle ne s'affiche pas s'il s'est connecté avec un compte qu'il avait déjà, ni s'il revient plus tard finir son inscription (ETA-16) : dans ces deux cas, son compte n'a pas été créé à l'instant.

#### Les établissements

**ETA-03** Mobilic affiche les établissements (SIRET) rattachés au SIREN saisi. Chacun présente son adresse, son nom (« Nom : »), son SIRET (« SIRET : ») et son code NAF (« CODE NAF : »).

**ETA-04** Si l'entreprise a plusieurs établissements, le texte « Veuillez sélectionner un ou plusieurs établissements : » invite à choisir. Le gestionnaire coche ceux qu'il inscrit ; les champs d'un établissement apparaissent sous lui dès qu'il est coché.

**ETA-05** S'il n'y en a qu'un, le texte devient « Votre établissement : ». Il n'y a rien à choisir : l'établissement est déjà sélectionné, sans case à cocher, et ses champs sont affichés.

#### Les informations à remplir

**ETA-06** Pour chaque établissement sélectionné, le gestionnaire remplit :

| Champ | Obligatoire | Précisions |
|---|---|---|
| Nom usuel | Oui | Déjà rempli avec le nom de l'établissement quand Mobilic le connaît |
| Numéro de téléphone de l'entreprise | Non | Indicatif pays, puis numéro. Aide : « Format attendu : 01 99 00 12 34 » |
| Nombre de salariés concernés par Mobilic | Oui | Aide : « Exemple : chauffeurs, accompagnateurs, agents… » |
| Type de transport routier | Oui | Marchandises (TRM), Voyageurs (TRV), Sanitaire (TRS), Déménagement |
| Activité principale | Seulement pour Marchandises (TRM) | Courte distance, Longue distance, Messagerie, Fonds et valeurs |

L'activité principale ne concerne que le transport de marchandises : elle reste grisée tant que le type n'est pas Marchandises (TRM), et elle se vide si le gestionnaire change de type ensuite.

**ETA-14** Le nombre de salariés doit être d'au moins 1, sans maximum. En dessous, le message « Indiquez au moins 1 salarié. » s'affiche sous le champ.

**ETA-07** Sous le type de transport et l'activité, un texte précise la portée de ce choix : « Ce type d'activité sera appliqué par défaut à tous les salariés de l'établissement. Vous pourrez le modifier ensuite pour chaque salarié. »

#### Continuer

**ETA-08** Le bouton « Continuer » devient actif dès qu'au moins un établissement pas encore inscrit est sélectionné et que les champs obligatoires de chaque établissement sélectionné sont remplis. Les établissements déjà inscrits ne comptent pas (voir ETA-13).

#### Cas particuliers

**ETA-12** Si l'entreprise entière (SIREN) a déjà été inscrite par un autre gestionnaire, il n'y a rien à faire ici. L'étape affiche seulement une alerte d'information : « Votre entreprise est déjà inscrite sur Mobilic », « Rapprochez-vous d'un gestionnaire de votre entreprise pour qu'il vous donne accès à son espace. » Il n'y a ni liste d'établissements, ni bouton « Continuer ».

**ETA-13** Si seul un établissement (SIRET) est déjà inscrit, il reste listé et le gestionnaire peut le cocher comme les autres. Mais une fois coché, sa carte affiche une alerte d'information à la place des champs : « Cet établissement est déjà inscrit sur Mobilic », « Rapprochez-vous d'un gestionnaire de votre entreprise pour qu'il vous donne accès à son espace. » Il ne suffit pas à activer « Continuer ».

**ETA-15** Le bouton Retour (Android ou Échap) ne fait rien sur cette étape : le compte Cerbère existe déjà, revenir en arrière n'aurait pas de sens.

**ETA-16** Si le gestionnaire a créé son compte sans aller au bout de l'inscription de son entreprise, il arrive directement sur cette étape à sa prochaine connexion à Mobilic.

### 4. Finalisation de l'inscription

Il reste au gestionnaire à donner un numéro de téléphone et, s'il le souhaite, quelques informations sur lui.

**SRC-05** La page s'appelle « S'inscrire comme gestionnaire ». L'encadré gris indique qu'on est à l'étape 3 sur 3, « Finaliser votre inscription ».

**SRC-06** Le premier champ est « Votre numéro de téléphone » (indicatif pays, puis numéro). Il est obligatoire et s'affiche sans titre ni texte d'introduction. Mobilic le remplit avec le numéro donné sur Cerbère : le téléphone portable s'il a été renseigné, sinon le téléphone. L'indicatif est repris de codePays quand il correspond à un pays de la liste. Si le gestionnaire n'a donné aucun numéro sur Cerbère, le champ est vide. Tant qu'il est vide, « Terminer » reste inactif.

**SRC-01** La question « Comment avez-vous connu Mobilic ? » est facultative. Le gestionnaire choisit une seule réponse (boutons radio), présentées sur deux colonnes sur grand écran : Courriel de l'équipe Mobilic ; Appel de l'équipe Mobilic ; Sur les réseaux sociaux ; Lors d'un webinaire organisé par l'équipe Mobilic ; Une plateforme de mise en relation entre entreprises et particuliers ; Lors d'un contrôle ; Un courriel/courrier de la DREAL ; Recherche internet ; Bouche à oreille ; Autre.

**SRC-02** Une case facultative lui propose : « Je souhaite m'abonner à la lettre d'information de Mobilic pour rester informé par mail des nouveautés du produit ».

**SRC-03** « Terminer » mène à la confirmation, qu'il ait répondu ou non à la question et à la lettre d'information.

**SRC-07** Si l'entreprise est inscrite mais que le gestionnaire n'a pas cliqué sur « Terminer », il revient sur cette étape à sa prochaine connexion à Mobilic. Dans ce cas, le bouton Retour ne fait rien.

### 5. Confirmation et webinaire

L'inscription est terminée. Mobilic dit au gestionnaire ce qui lui reste à faire et lui propose une formation.

**FIN-01** Le titre annonce « Votre inscription est terminée ». Le texte lui demande d'activer son compte : « Un e-mail de vérification de votre compte vous a été envoyé à l'adresse [e-mail]. Cliquez sur le lien qu'il contient pour activer votre compte. »

**FIN-02** Le bouton « Aller dans mon espace » ouvre l'espace gestionnaire.

**FIN-03** Un encart propose la prochaine formation : « Offrez-vous une formation gratuite de 45 minutes ! », « Apprenez à maîtriser Mobilic grâce à un accompagnement personnalisé et gagnez du temps : formation à la mise en place, démonstration et réponse à toutes vos questions ! ». Suivent la date, l'heure, « Mobilic - Formation gestionnaires » et le bouton « S'inscrire ». Une fois le gestionnaire inscrit, le bouton devient « Inscription confirmée » et n'est plus cliquable.

**FIN-04** S'il n'y a aucun webinaire programmé, l'encart n'apparaît pas.

### Navigation

**NAV-01** Le bouton Retour (Android ou Échap) ramène à l'écran précédent :

| Depuis | Retour mène à |
|---|---|
| 1. Choix du métier | Sans effet |
| 1b. Création de compte | 1. Choix du métier |
| 3. Inscription de l'entreprise | Sans effet (ETA-15) |
| 4. Finalisation de l'inscription | 3. Inscription de l'entreprise, sauf en reprise où il est sans effet (SRC-07) |
| 5. Confirmation et webinaire | 4. Finalisation de l'inscription |

</details>

<details>
<summary><h2 id="parcours--connexion">Parcours : connexion</h2></summary>

Le gestionnaire qui a déjà un compte se connecte à Mobilic.

### 1. Se connecter en tant que

**CNX-06** « J'ai déjà un compte » (CPT-05) et « Se connecter » dans l'en-tête ouvrent d'abord la page « Se connecter en tant que ». Elle propose deux tuiles :
- « Entreprise ou salarié » : « Je suis travailleur mobile ou gestionnaire d'une entreprise de transport » ;
- « Contrôleur » : « Je suis agent public de l'État et je me connecte à mon espace dédié ».

Dessous, le texte « Pas encore de compte ? » et le lien « Je m'inscris » mènent au choix du métier.

**CNX-07** « Entreprise ou salarié » ouvre la page « Se connecter » (CNX-01). « Contrôleur » ouvre la connexion contrôleur, qui ne fait pas partie de ce parcours. Le bouton Retour ramène à l'écran d'où la page a été ouverte.

### 2. Se connecter

**CNX-01** La page « Se connecter » de Mobilic s'ouvre depuis la tuile « Entreprise ou salarié » (CNX-07). Elle offre deux façons de se connecter, dans un encadré gris, séparées par « ou ».

**CNX-02** La première, sans titre, passe par Cerbère : le texte « Cerbère est le service de connexion sécurisée des ministères chargés des transports. », le bouton « Continuer avec Cerbère » qui mène à la connexion sur Cerbère (CER-11), puis le lien « Qu'est-ce que Cerbère ? » qui ouvre l'aide de Cerbère dans une nouvelle fenêtre.

**CNX-03** La seconde, sans titre non plus, se fait avec un e-mail et un mot de passe : les champs obligatoires « Adresse e-mail » (aide « Format attendu : nom@domaine.fr ») et « Mot de passe », le lien « Mot de passe oublié ? », et le bouton « Se connecter », actif quand les deux champs sont remplis.

**CNX-04** Sous un trait de séparation, le lien « Je n'ai pas de compte » mène à l'inscription (choix du métier).

**CNX-05** Le bouton Retour (Android ou Échap) ramène à « Se connecter en tant que ».

</details>

<details>
<summary><h2 id="éléments-communs">Éléments communs</h2></summary>

Ce qui apparaît dans plusieurs parcours. Les parcours y renvoient.

### En-tête (non connecté)

**ENT-01** Tous les écrans Mobilic de l'inscription (pas les pages Cerbère) ont l'en-tête Mobilic non connecté : les liens « Nous contacter », « Créer un compte » et « Se connecter », puis la navigation principale « Accueil », « Documentation », « Partenaires et logiciels », « Certificat » et « Centre d'aide ».

**ENT-02** « Centre d'aide » s'ouvre dans une nouvelle fenêtre. « Se connecter » ouvre « Se connecter en tant que » (CNX-06). « Créer un compte » ramène au choix du métier et efface tout ce qui a été saisi.

**ENT-03** Sous 992 px, les liens et la navigation sont regroupés dans un menu (bouton « Menu ») ; « Fermer », Échap ou Retour le referment.

</details>

<details>
<summary><h2 id="composants-utilisés">Composants utilisés</h2></summary>

- DSFR : en-tête (liens et navigation principale), tuile, champ de saisie, liste déroulante, bouton radio, case à cocher, alerte, lien, indicateur d'étapes, groupe de boutons.
- Mobilic : [Carte d'établissement](../../composants/carte-etablissement.md), [Champ téléphone](../../composants/champ-telephone.md), [Encadré d'étape](../../composants/encadre-etape.md), [Encart webinaire](../../composants/encart-webinaire.md).

</details>
