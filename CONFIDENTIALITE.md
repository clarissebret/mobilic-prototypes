# Règles de confidentialité

Ce dépôt est public. Tout ce qui y est versé (fichiers, historique des commits, tickets, pull requests) est consultable par tous et le reste, même après suppression.

## Ce qui est autorisé

- Des données **fictives** : noms de salariés et d'entreprises inventés, dates, immatriculations, numéros de contrôleur d'exemple.
- Des informations **publiques** : textes réglementaires, codes NATINF, libellés de l'interface, logos Mobilic et République française.

## Ce qui est interdit

- Toute donnée réelle issue de Mobilic ou de contrôles : identité de salariés, d'agents ou d'entreprises, données d'activité, captures d'écran de la production.
- Les liens vers les fichiers Figma (ils révèlent l'identifiant des fichiers).
- Les adresses e-mail et numéros de téléphone réels, les identifiants, mots de passe, jetons d'accès et clés d'API.
- Le code de production de Mobilic.

## Garde-fou automatique

`npm run check` analyse tous les fichiers suivis par Git et bloque la publication s'il trouve un lien Figma, une adresse e-mail réelle, un numéro de téléphone, un numéro de sécurité sociale ou un jeton d'accès. Cette vérification est lancée automatiquement avant chaque déploiement. Elle ne remplace pas une relecture : elle ne reconnaît pas un nom de personne réel, par exemple.

## En cas de fuite

Supprimer le fichier ne suffit pas : la donnée reste dans l'historique Git. Prévenir immédiatement l'équipe, rendre le dépôt privé le temps de nettoyer l'historique, et révoquer tout secret exposé.
