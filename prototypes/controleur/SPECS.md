# Specs : interface contrôleur

Ce document décrit le comportement attendu de l'interface contrôleur. Il fait foi pour l'implémentation.

L'interface sert à tous les corps habilités à contrôler le temps de travail dans le transport routier léger et le déménagement : agents de contrôle des transports, inspecteurs du travail, forces de l'ordre et agents de l'URSSAF. Ils contrôlent soit en bord de route, un salarié en activité, sur mobile, souvent debout et en extérieur, où ils doivent pouvoir créer le contrôle et relever les infractions rapidement ; soit en entreprise, dans ses locaux.

<details>
<summary><h2 id="ce-qui-est-contrôlé">Ce qui est contrôlé</h2></summary>

Un contrôle varie selon deux dimensions indépendantes.

**Le type de contrôle** dépend de ce que le salarié présente pour justifier de son temps de travail :

| Type de contrôle | Le salarié présente |
|---|---|
| Contrôle Mobilic | Son temps de travail saisi dans Mobilic |
| Contrôle papier | Un livret individuel de contrôle (LIC) papier, ou une feuille de route en transport sanitaire |
| Contrôle sans LIC | Aucun document |

**L'activité** est celle de l'entreprise contrôlée :

| Activité | Code |
|---|---|
| Transport de marchandises | TRM |
| Déménagement | À préciser |
| Transport de voyageurs | TRV |
| Transport sanitaire | TRS |

Ces deux dimensions changent les infractions proposées et certaines informations demandées. Les règles ci-dessous valent pour tous les contrôles, sauf celles rangées dans un tableau « Selon le type de contrôle » ou « Selon l'activité ». Dans ces tableaux, une case vide veut dire que la règle n'est pas encore spécifiée pour ce cas.

</details>

<details>
<summary><h2 id="parcours--contrôle">Parcours : contrôle</h2></summary>

L'agent contrôle le temps de travail d'un salarié et établit le bulletin de contrôle.

### 1. Création du contrôle

L'agent ouvre un contrôle et décrit qui et quoi il contrôle.

**CRE-01** Il crée le contrôle depuis l'accueil, en choisissant d'abord le type de contrôle.

**CRE-02** Il renseigne ensuite le salarié, l'entreprise, le véhicule et l'activité. Les informations obligatoires sont signalées comme telles.

**CRE-03** L'entreprise est identifiée par son SIREN : l'agent saisit le numéro et lance la recherche, et Mobilic complète alors le nom et l'adresse de l'entreprise. Si quelque chose ne va pas, une erreur s'affiche sous le champ avant la création du contrôle :

| Cas | Message |
|---|---|
| Champ vide | Saisissez le numéro SIREN de l'entreprise. |
| Le numéro ne fait pas 9 chiffres | Saisissez un numéro SIREN de 9 chiffres, par exemple 123 456 789. |
| Aucune entreprise ne correspond | Aucune entreprise ne correspond à ce numéro SIREN. Vérifiez le numéro saisi. |
| La recherche n'a pas pu aboutir (réseau, service indisponible) | La recherche n'a pas abouti. Vérifiez votre connexion et réessayez. |

**CRE-04** Le contrôle n'est créé que lorsque toutes les informations obligatoires sont valides.

#### Selon le type de contrôle

| Règle | Mobilic | Papier | Sans LIC |
|---|---|---|---|
| **CRE-05** L'agent indique si la page du jour du LIC est remplie | | Oui | |

### 2. Relevé des infractions

L'agent coche les infractions qu'il a constatées et précise quand elles ont eu lieu.

**REL-06** Les infractions proposées dépendent du type de contrôle et de l'activité (voir [Infractions](#infractions)).

**REL-07** Pour chaque infraction, la règle affichée est celle qui s'applique à l'activité contrôlée.

**REL-01** Pour chaque infraction, l'agent indique quand il l'a constatée : par jour, ou par semaine selon l'infraction.

**REL-02** Une infraction n'est retenue que si au moins un jour ou une semaine est sélectionné.

**REL-05** Rien n'est pris en compte tant que l'agent n'a pas enregistré. S'il quitte le relevé avec des modifications non enregistrées, Mobilic lui demande de confirmer qu'il les abandonne.

**REL-03** Le nombre d'infractions retenues est visible depuis la page du contrôle.

**REL-04** Les infractions relevées sont les mêmes partout où elles apparaissent : page du contrôle, bulletin de contrôle et export PDF. Une modification faite à un endroit se retrouve partout.

#### Selon le type de contrôle

| Règle | Mobilic | Papier | Sans LIC |
|---|---|---|---|
| **REL-08** L'agent relève les infractions à partir du document présenté | | Oui | |
| **REL-09** Depuis la page du contrôle, l'agent peut prendre en photo le document présenté, pour relever les infractions plus tard ; il retrouve les photos dans son historique de contrôle | Non | Oui | Non |

### 3. Bulletin de contrôle

L'agent établit le bulletin qui récapitule le contrôle, puis le transmet.

**BDC-01** Il complète le bulletin de contrôle en 3 étapes. Il peut revenir à l'étape précédente sans perdre ce qu'il a saisi.

**BDC-02** Le bulletin reprend les infractions retenues.

**BDC-03** Une fois le bulletin complété, l'agent peut l'envoyer, indiquer qu'il n'a pas pu être remis, ou l'exporter en PDF.

#### Selon l'activité

| Règle | TRM | Déménagement | TRV | TRS |
|---|---|---|---|---|
| **BDC-04** Provenance, destination, type de transport, nature de la marchandise, licence, copie conforme et poids sont demandés et affichés | Oui | | | Non |
| **BDC-05** Le pays d'immatriculation est demandé | Oui | | | Oui |

</details>

<details>
<summary><h2 id="éléments-communs">Éléments communs</h2></summary>

Ce qui apparaît dans tout le contrôle ou autour de lui. Les parcours y renvoient.

### Accueil

L'accueil permet à l'agent de retrouver ses contrôles récents et d'en créer un nouveau.

**ACC-01** Les derniers contrôles de l'agent sont regroupés par jour, du plus récent au plus ancien. Chaque jour est intitulé « Aujourd’hui » ou par sa date complète (ex. « Samedi 14 novembre 2026 »).

**ACC-02** Chaque contrôle affiche : le salarié, le véhicule, l'heure, le lieu de contrôle, le type de contrôle, le statut du bulletin de contrôle, l'entreprise, le nombre de jours contrôlés et le nombre d'infractions retenues.

**ACC-03** Le statut du bulletin de contrôle est l'un des suivants :

| Statut | Situation |
|---|---|
| Remis | Le bulletin a été envoyé ou remis au salarié |
| En attente d'envoi | Le bulletin a été créé mais pas encore envoyé ni remis |
| Non créé | Aucun bulletin n'a été créé pour ce contrôle |

**ACC-04** En choisissant un contrôle dans « Derniers contrôles », l'agent le rouvre et retrouve la page du contrôle telle qu'il l'a laissée.

### Navigation

**NAV-01** Le bouton Retour du téléphone ramène à l'étape précédente, sans jamais perdre de données sans prévenir : il ferme d'abord une fenêtre ouverte, et demande confirmation avant d'abandonner une saisie en cours.

**NAV-02** Sur grand écran, la création du contrôle et le contrôle lui-même (page du contrôle, création du bulletin, relevé des infractions) s'ouvrent dans un panneau latéral par-dessus l'accueil, qui reste visible en arrière-plan. Sur mobile, ces écrans occupent tout l'écran.

</details>

<details>
<summary><h2 id="textes-propres-à-une-activité">Textes propres à une activité</h2></summary>

En contrôle papier, le document présenté n'est pas le même selon l'activité : une feuille de route en transport sanitaire, un LIC sinon. Les textes qui le nomment changent en conséquence :

| Où | TRS (feuille de route) | Autres activités (LIC) |
|---|---|---|
| Relevé des infractions | « Sélectionnez les infractions que vous souhaitez verbaliser à partir de la feuille de route présentée : » | « Sélectionnez les infractions que vous souhaitez verbaliser à partir du livret individuel de contrôle présenté : » |
| Photos, titre (REL-09) | « Photos de la feuille de route » | « Photos du LIC » |
| Photos, texte (REL-09) | « Ajoutez des photos de la feuille de route et retrouvez-les dans votre historique de contrôle afin de relever des infractions. » | « Ajoutez des photos du livret individuel de contrôle et retrouvez-les dans votre historique de contrôle afin de relever des infractions. » |

</details>

<details>
<summary><h2 id="infractions">Infractions</h2></summary>

Infractions proposées par type de contrôle. Les différences par activité seront ajoutées dans ce tableau.

| NATINF | Infraction | Constatée par | Papier |
|---|---|---|---|
| 23103 | Tenue non conforme du livret individuel de contrôle | jour | Oui |
| 11292 | Dépassement(s) de la durée maximale du travail quotidien | jour | Oui |
| 11298 | Dépassement(s) de la durée maximale du travail hebdomadaire sur une semaine civile isolée | semaine | Oui |
| 13152 | Non-respect(s) du repos hebdomadaire | semaine | Oui |
| 20525 | Non-respect(s) du repos quotidien | jour | Oui |
| 32083 | Dépassement(s) de la durée maximale de travail de nuit | jour | Oui |
| 35187 | Non-respect(s) du temps de pause et/ou dépassement(s) de la durée maximale du travail ininterrompu | jour | Oui |

</details>

<details>
<summary><h2 id="composants-utilisés">Composants utilisés</h2></summary>

- [Accordéon d'infraction](../../composants/accordeon-infraction.md)
- [Barre d'actions fixe](../../composants/barre-actions-fixe.md)
- [Onglets du contrôle](../../composants/onglets-controle.md)
- [Tuile de choix](../../composants/tuile-choix.md)

</details>
