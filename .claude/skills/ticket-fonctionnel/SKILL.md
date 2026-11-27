---
name: ticket-fonctionnel
description: Rédige le ticket Trello d'une fonctionnalité à partir des specs modifiées sur la branche en cours (Problème, Solution, Design, Dev). À utiliser quand on demande un ticket, un résumé pour Trello, ou de « résumer la branche pour les devs ».
---

# Ticket Trello depuis les specs

Le ticket est une introduction au prototype, pas une copie de la spec. Il dit quel problème on règle, résume le parcours, donne le lien du prototype et liste ce que les devs ne doivent pas rater. Le détail (libellés, textes exacts, identifiants de règles) reste dans `SPECS.md`, et le ticket y renvoie.

## 1. Rassembler la matière

1. Trouver ce qui a changé sur la branche par rapport à `main` :
   ```sh
   git diff main...HEAD -- 'prototypes/*/SPECS.md'
   git diff -- 'prototypes/*/SPECS.md'   # modifications pas encore commitées
   git log --oneline main..HEAD
   ```
   Si rien n'a changé dans les specs, le dire et demander quelle partie de quelle spec résumer.
2. Lire en entier les sections touchées dans le `SPECS.md` actuel, pas seulement le diff : un ticket se comprend avec le parcours complet.
3. Déterminer l'existant : ce que faisait le produit avant, d'après la version de `main` (`git show main:prototypes/<interface>/SPECS.md`). C'est ce qui permet d'écrire le problème et de décrire les changements.
4. Si la branche couvre deux changements indépendants, proposer deux tickets.

## 2. Ce que la spec ne dit pas : demander

- **Le problème.** La spec décrit le comportement, rarement la raison. Si le pourquoi ne se déduit pas clairement de la spec ou de la conversation, poser la question avant d'écrire, sans l'inventer.
- **L'avant.** Si `main` ne décrit pas l'ancien comportement (fonctionnalité qui existait hors du prototype), demander en une phrase comment ça se passait.
- Une question à la fois.

## 3. Format

Écrire en Markdown, en français, **rendu directement dans la réponse, jamais dans un bloc de code** : copié depuis un bloc de code, le texte arrive dans Trello en code ou avec les astérisques visibles ; copié depuis le rendu, le gras et les listes suivent. Le modèle ci-dessous est en bloc de code seulement pour qu'on voie sa structure.

```markdown
**<Titre : verbe + résultat pour l'utilisateur>**

## 🤔 Problème
<1 à 3 phrases : ce qui ne va pas aujourd'hui, du point de vue de l'utilisateur.>

## 💡 Solution
<Une phrase qui résume, puis le parcours en étapes numérotées. Sous-puces pour les variantes d'une étape (« s'il a déjà un compte… », « s'il n'y a qu'un établissement… »).>

## 🎨 Design
Prototype : [<libellé du parcours>](<lien direct vers le parcours>)<, puis un lien par variante utile.>
Spec détaillée : [<nom de la section>](<lien GitHub vers la section de SPECS.md>)<, un lien par section concernée.>

## 🤖 Dev
- **<Cas particulier en gras>** : <règle métier, de gestion ou technique à ne pas rater>
  - <sous-cas, un par puce>

## 💬 Questions ouvertes
<Seulement s'il y en a.>
- **<Sujet en gras>** : <question à trancher avant ou pendant le développement>
```

## 4. Règles d'écriture

- **Sections** : titres de niveau 2 (`##`), sans gras, chacun précédé de son emoji : 🤔 Problème, 💡 Solution, 🎨 Design, 🤖 Dev, 💬 Questions ouvertes. Dans Trello, ils restent des titres de niveau 2.
- **Titre** : le résultat pour l'utilisateur (« Faire passer l'inscription des gestionnaires par Cerbère »), jamais un identifiant ou un nom de fichier.
- **Langage de l'utilisateur**, pas celui de la spec : « il coche les établissements qu'il inscrit », pas « case à cocher ETA-04 ».
- **Pas d'identifiants de règles** (`ETA-11`…) et **pas de textes exacts** de l'interface, sauf un libellé indispensable pour se repérer (« Terminer »). Le ticket peut dire « un message confirme la création du compte » ; la spec donne le texte.
- **Solution** : le parcours résumé, une étape par grande étape de la spec. Pas de liste de champs, seulement ce que l'utilisateur fait et décide.
- **Dev** : ce qui piège l'implémentation, sans redire le parcours :
  - les branchements (où l'utilisateur arrive selon son cas) ;
  - les reprises, retours bloqués, abandons ;
  - les cas « déjà existant » (compte, entreprise, établissement…) ;
  - ce qui varie selon l'activité ou le type de contrôle ;
  - les données échangées avec un service tiers, et ce qui ne doit pas être développé (pages d'un tiers simulées dans le prototype) ;
  - les champs conditionnels, préremplis ou vidés.
  Chaque puce commence par le sujet en gras. Un sous-cas par sous-puce, au format « situation → résultat » quand il y a plusieurs issues.
- **Pas d'évidence** : n'écrire que les vraies règles et exceptions.
  - Pas de négation redondante : quand le périmètre est donné (« dans les tableaux des salariés temporaires et longue durée »), ne pas ajouter ce qui n'est pas concerné (« pas dans le tableau des invitations »).
  - Pas d'absence de règle : ne pas écrire qu'un élément est « toujours disponible », « quel que soit… », ou qu'il n'y a pas de condition. Sans règle écrite, le comportement par défaut va de soi.
  - Ne pas non plus garder la trace d'une règle abandonnée en cours de conception : le ticket décrit ce qu'on construit, pas l'historique des décisions.
- **Longueur** : Problème et Solution lisibles en une minute. La section Dev peut être plus longue : c'est une liste de vérification.
- Ponctuation française : espace insécable avant `:`, `;`, `?`, `!` et à l'intérieur des guillemets, comme dans le reste du dépôt.

## 5. Liens

Toujours de vrais liens cliquables, jamais un chemin de fichier seul.

- **Prototype** : un lien direct vers chaque parcours concerné. Adresse GitHub Pages (`gh api repos/{owner}/{repo}/pages -q .html_url`), puis `<interface>/#parcours=<commande>`, la commande étant celle du parcours dans `prototypes/<interface>/prototype.json`. Le texte du lien est le libellé du parcours dans ce même fichier. Exemple : `https://<compte>.github.io/mobilic-prototypes/gestionnaire/#parcours=flow-salaries`.
- **Spec** : un lien vers chaque section concernée de `SPECS.md` sur GitHub : `<adresse du dépôt>/blob/main/prototypes/<interface>/SPECS.md#<ancre>` (adresse du dépôt : `gh repo view --json url -q .url`). Ancre GitHub d'un titre : en minuscules, espaces remplacées par des tirets, ponctuation retirée sauf `-` et `_`, accents gardés (« 6. Onglet Salariés » → `#6-onglet-salariés`).
- Les deux liens pointent vers `main`. Si la branche n'est pas encore fusionnée, le dire sous le ticket : les liens fonctionneront après la fusion.

## 6. Rendu

- Afficher le ticket dans la réponse en Markdown rendu, sans bloc de code, entre deux traits horizontaux (`---`) pour qu'on voie où commencer et finir la sélection.
- En dessous, hors du ticket : ce qui reste à vérifier (problème formulé sans confirmation, lien pas encore en ligne, avant supposé).
- Ne rien créer dans Trello et ne rien écrire dans le dépôt, sauf si on le demande.
