# Panneau latéral

Sur grand écran, affiche un contenu détaillé (création du contrôle, page du contrôle, création du bulletin, relevé des infractions) par-dessus la page principale, sans la quitter.

Code : classes `.screen--panel`, `.panel-backdrop`, `body.has-panel` dans `prototypes/controleur/app.css` ; ouverture dans `go()` (`app.js`).

## Comportement

| Largeur d'écran | Rendu |
|---|---|
| Moins de 768 px (48em) | Page pleine largeur, pas de panneau |
| 768 px et plus | Panneau fixé à droite, largeur `min(100 %, 800 px)`, défilement interne ; la page principale reste visible derrière un fond assombri |

- Fermeture : lien « Fermer » du contenu, touche Échap ou clic sur le fond assombri. Les mêmes confirmations que sur mobile s'appliquent (ex. bulletin non créé).
- Les modales DSFR s'ouvrent au-dessus du panneau.
- La [barre d'actions fixe](barre-actions-fixe.md) et les messages temporaires prennent la largeur du panneau.

## Animation

| Élément | Animation |
|---|---|
| Panneau | Glisse depuis la droite (`translateX(100%)` → 0), 400 ms, courbe tiroir `cubic-bezier(0.32, 0.72, 0, 1)` |
| Fond assombri | Apparition en fondu, mêmes durée et courbe |

- L'animation ne joue qu'à l'ouverture du panneau, pas en passant d'un écran à l'autre à l'intérieur.
- Si l'utilisateur a demandé moins d'animations (`prefers-reduced-motion`), le panneau apparaît en fondu, 200 ms.

## Tokens

| Élément | Valeur |
|---|---|
| Fond du panneau | `--background-default-grey` |
| Ombre | `--lifted-shadow` |
| Fond assombri | `hsla(0, 0%, 9%, .64)`, la valeur du fond des modales DSFR |
