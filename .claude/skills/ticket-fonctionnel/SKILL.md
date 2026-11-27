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

Écrire en Markdown (Trello l'affiche), en français, dans un bloc de code pour qu'on puisse le copier tel quel.

```markdown
**<Titre : verbe + résultat pour l'utilisateur>**

**Problème**
<1 à 3 phrases : ce qui ne va pas aujourd'hui, du point de vue de l'utilisateur.>

**Solution**
<Une phrase qui résume, puis le parcours en étapes numérotées. Sous-puces pour les variantes d'une étape (« s'il a déjà un compte… », « s'il n'y a qu'un établissement… »).>

**Design**
Prototype : [<nom du parcours>](<lien>)<, et les variantes à choisir dans le sélecteur de parcours s'il y en a.>
Spec détaillée : `prototypes/<interface>/SPECS.md`, section(s) <nom des sections>.

**Dev**
- **<Cas particulier en gras>** : <règle métier, de gestion ou technique à ne pas rater>
  - <sous-cas, un par puce>
```

## 4. Règles d'écriture

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
- **Longueur** : Problème et Solution lisibles en une minute. La section Dev peut être plus longue : c'est une liste de vérification.
- Ponctuation française : espace insécable avant `:`, `;`, `?`, `!` et à l'intérieur des guillemets, comme dans le reste du dépôt.

## 5. Lien du prototype

Le prototype est publié sur GitHub Pages depuis `main` : l'adresse est celle de `gh api repos/{owner}/{repo}/pages -q .html_url`, suivie de `<interface>/`. Un parcours qui n'est que sur la branche n'est pas encore en ligne : le signaler sous le ticket. Le sélecteur de parcours affiche les libellés de `prototypes/<interface>/prototype.json` ; citer ceux qui concernent le ticket.

## 6. Rendu

- Afficher le ticket dans la réponse, dans un bloc de code Markdown.
- En dessous, hors du ticket : ce qui reste à vérifier (problème formulé sans confirmation, lien pas encore en ligne, avant supposé).
- Ne rien créer dans Trello et ne rien écrire dans le dépôt, sauf si on le demande.
