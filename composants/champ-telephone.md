# Champ téléphone

Champ de saisie d'un numéro de téléphone précédé de l'indicatif du pays.

Code : `telField()` dans `prototypes/gestionnaire/app.js`, styles `.tel` dans `prototypes/gestionnaire/app.css`.

## Anatomie

- Libellé DSFR et texte d'aide « Format attendu : 01 99 00 12 34 ».
- Ligne : liste déroulante DSFR de l'indicatif (drapeau et indicatif, ex. « 🇫🇷 +33 », France par défaut, largeur du contenu), puis champ de saisie DSFR `type="tel"` qui prend le reste de la largeur.

## États

Ceux des composants DSFR liste déroulante et champ de saisie.

## Espacements

8 px entre l'indicatif et le numéro ; 8 px entre le libellé et la ligne.

## Accessibilité

La liste de l'indicatif a son propre nom accessible (« Indicatif du pays ») ; le libellé visible est relié au champ du numéro.
