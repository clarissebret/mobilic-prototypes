/* ---------- 6. Entreprise : onglet Salariés ---------- */
/* Date du jour fictive : Karim Benali (temporaire) est détaché dans 7 jours ; Camille Rousseau l'est depuis le 30/11/2027. */
const SAL_AUJOURDHUI = '23/01/2028';
const SAL_ALERTE_JOURS = 7;
/* Nombre de salariés concernés par Mobilic, renseigné dans les paramètres de l'entreprise (fictif) */
const SAL_NB_PARAMETRES = 14;
/* Salariés inactifs (badge et alerte) : fonction masquée pour l'instant, les cas sont rares */
const SAL_INACTIFS_AFFICHES = false;
const SAL_GROUPES = ['Groupe A', 'Groupe B'];
const SAL_TYPES = ['TRM - Courte distance', 'TRM - Longue distance', 'TRM - Messagerie, Fonds et valeurs'];

const salMail = (prenom, nom) => `${prenom}.${nom}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@dupont-transport.example.fr';
const salPers = (prenom, nom, o) => ({ prenom, nom, email: salMail(prenom, nom), ...o });
/* Données fictives de l'entreprise Dupont Transport SARL */
const salDonnees = () => ({
  invitations: [
    { email: salMail('Julien', 'Moreau'), acces: 'Non', fin: '', invite: '01/01/2028', relance: '10/01/2028' },
    { email: salMail('Claire', 'Lefèvre'), acces: 'Non', fin: '30/06/2028', invite: '15/01/2028', relance: '' },
    { email: salMail('Marc', 'Dubois'), acces: 'Oui', fin: '', invite: '20/01/2028', relance: '' },
  ],
  tmp: [
    salPers('Karim', 'Benali', { debut: '01/09/2027', fin: '30/01/2028', groupe: 'Groupe A', type: SAL_TYPES[1] }),
    salPers('Nicolas', 'Girard', { debut: '01/01/2028', fin: '01/06/2028', groupe: 'Groupe A', type: SAL_TYPES[1] }),
    salPers('Lucie', 'Pleyel', { debut: '01/01/2028', fin: '01/06/2028', groupe: 'Groupe A', type: SAL_TYPES[1] }),
    salPers('Camille', 'Rousseau', { debut: '01/09/2027', fin: '30/11/2027', groupe: 'Groupe B', type: SAL_TYPES[1] }),
  ],
  lgd: [
    salPers('Sophie', 'Allard', { debut: '01/02/2027', acces: 'Non', groupe: 'Groupe A', type: SAL_TYPES[1], inactif: true }),
    salPers('Thomas', 'Aubert', { debut: '01/02/2027', acces: 'Non', groupe: 'Groupe B', type: SAL_TYPES[1] }),
    salPers('Émile', 'Barbier', { debut: '01/02/2027', acces: 'Non', groupe: 'Groupe A', type: SAL_TYPES[1], inactif: true }),
    salPers('Hugo', 'Basset', { debut: '01/02/2027', acces: 'Non', groupe: 'Groupe B', type: SAL_TYPES[1], inactif: true }),
    salPers('Léa', 'Baudin', { debut: '01/02/2027', acces: 'Non', groupe: 'Groupe A', type: SAL_TYPES[1], inactif: true }),
    salPers('Julien', 'Benoît', { debut: '01/02/2027', acces: 'Oui', groupe: 'Groupe A', type: SAL_TYPES[1] }),
    salPers('Jeanne', 'Carpentier', { debut: '01/02/2027', acces: 'Non', groupe: 'Groupe B', type: SAL_TYPES[0], detache: true }),
  ],
});
let sal = {};

/* ---------- Dates ---------- */
const salDate = s => { const [j, m, a] = s.split('/').map(Number); return new Date(a, m - 1, j); };
const salJours = s => Math.round((salDate(s) - salDate(SAL_AUJOURDHUI)) / 86400000);
/* Temporaire détaché : sa date de fin de rattachement est passée. Longue durée : rattachement terminé. */
const salDetache = s => s.detache || (s.fin !== undefined && s.fin !== '' && salJours(s.fin) < 0);
const salNomComplet = s => `${s.prenom} ${s.nom}`;

/* ---------- Rendu ---------- */
const salSelect = (label, liste, valeur, off) =>
  `<select class="fr-select fr-text--sm fr-mb-0" aria-label="${esc(label)}"${off ? ' disabled' : ''}>${liste.map(o => `<option${o === valeur ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
const salBadges = s => salDetache(s) ? '<span class="fr-badge fr-badge--sm fr-badge--no-icon">Détaché</span>'
  : s.inactif && SAL_INACTIFS_AFFICHES ? '<span class="fr-badge fr-badge--sm fr-badge--warning fr-badge--no-icon">Inactif</span>' : '';
const salCelluleNom = s => `<td><div class="sal-nom"><span${salDetache(s) ? '' : ' class="fr-text--bold"'}>${esc(s.nom)} ${esc(s.prenom)}</span>${salBadges(s)}</div></td>`;
const salCelluleEmail = e => `<td class="sal-email" title="${esc(e)}">${esc(e)}</td>`;

/* Bandeau d'information importante du DSFR, variante avertissement, refermable.
   Texte en 14 px sans gras (fr-text--sm fr-text--regular), comme la maquette. */
const salNotice = (titre, desc, lien, onLien, onFermer) => `<div class="fr-notice fr-notice--warning">
  <div class="fr-container"><div class="fr-notice__body">
    <p><span class="fr-notice__title fr-text--sm fr-text--regular">${titre}</span>${desc ? ` <span class="fr-notice__desc fr-text--sm">${desc}</span>` : ''} <a class="fr-notice__link fr-text--sm" href="#" onclick="${onLien};return false">${lien}</a></p>
    <button type="button" class="fr-btn--close fr-btn" title="Masquer le message" onclick="${onFermer}">Masquer le message</button>
  </div></div>
</div>`;

function salTrie(liste, t) {
  const sens = sal.tri[t];
  if (!sens) return liste;
  return [...liste].sort((a, b) => (sens === 'ascending' ? 1 : -1) * `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`, 'fr'));
}
const salFiltre = liste => { const g = $('sal-groupe').value; return g ? liste.filter(s => s.groupe === g) : liste; };

function renderInvitations() {
  const inv = sal.d.invitations;
  /* La section disparaît quand il n'y a plus d'invitation en attente */
  $('sec-inv').hidden = inv.length === 0;
  $('inv-nb').textContent = inv.length;
  /* Une invitation déjà relancée ne peut plus l'être */
  $('inv-relancer').disabled = !inv.some(i => !i.relance);
  $('inv-lignes').innerHTML = inv.map((i, n) => `<tr>
    ${salCelluleEmail(i.email)}
    <td>${esc(i.acces)}</td>
    <td>${esc(i.fin)}</td>
    <td>${esc(i.invite)}</td>
    <td>${esc(i.relance)}</td>
    <td><div class="sal-actions">
      <button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-arrow-go-back-line"${i.relance ? ' disabled' : ''} onclick="relancerInvitation(${n})">Relancer</button>
      <button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-close-line" onclick="annulerInvitation(${n})">Annuler</button>
    </div></td>
  </tr>`).join('');
}

function renderTemporaires() {
  const tmp = sal.d.tmp;
  /* La section disparaît quand l'entreprise n'a pas de salarié temporaire */
  $('sec-tmp').hidden = tmp.length === 0;
  /* Alerte à l'approche du détachement, une par salarié */
  $('tmp-alertes').innerHTML = tmp.filter(s => !salDetache(s) && salJours(s.fin) <= SAL_ALERTE_JOURS && !sal.fermees.has(s.email)).map(s => {
    const j = salJours(s.fin);
    return salNotice(`${esc(salNomComplet(s))} sera détaché dans ${j} jour${j > 1 ? 's' : ''}, le ${s.fin}.`, '', 'Prolonger le rattachement',
      "toast('Prolonger le rattachement : hors scope')", `fermerAlerteDetachement('${s.email}')`);
  }).join('');
  $('tmp-lignes').innerHTML = salFiltre(salTrie(tmp, 'tmp')).map(s => {
    const off = salDetache(s), qui = salNomComplet(s);
    return `<tr${off ? ' class="mobilic-row--disabled"' : ''}>
      ${salCelluleNom(s)}
      ${salCelluleEmail(s.email)}
      <td>${s.debut}</td>
      <td><div class="sal-fin">${s.fin}${off ? '' : `<button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm" onclick="toast('Modifier la fin de rattachement : hors scope')">Modifier</button>`}</div></td>
      <td class="sal-groupe">${salSelect(`Groupe d'affectation de ${qui}`, SAL_GROUPES, s.groupe, off)}</td>
      <td class="sal-type">${salSelect(`Type d'activité de ${qui}`, SAL_TYPES, s.type, off)}</td>
    </tr>`;
  }).join('');
}

function renderLongueDuree() {
  $('lgd-lignes').innerHTML = salFiltre(salTrie(sal.d.lgd, 'lgd')).map(s => {
    const off = salDetache(s), qui = salNomComplet(s);
    return `<tr${off ? ' class="mobilic-row--disabled"' : ''}>
      ${salCelluleNom(s)}
      ${salCelluleEmail(s.email)}
      <td>${s.debut}</td>
      <td class="sal-acces">${salSelect(`Accès gestionnaire de ${qui}`, ['Oui', 'Non'], s.acces, off)}</td>
      <td class="sal-groupe">${salSelect(`Groupe d'affectation de ${qui}`, SAL_GROUPES, s.groupe, off)}</td>
      <td class="sal-type">${salSelect(`Type d'activité de ${qui}`, SAL_TYPES, s.type, off)}</td>
    </tr>`;
  }).join('');
}

/* Salariés inactifs : aucun temps de travail enregistré depuis 6 mois. Alerte en tête de « Salariés longue durée ». */
function renderInactifs() {
  const inactifs = [...sal.d.tmp, ...sal.d.lgd].filter(s => s.inactif && !salDetache(s))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  const zone = $('sal-inactifs');
  zone.hidden = !SAL_INACTIFS_AFFICHES || !inactifs.length || sal.inactifsFerme;
  if (zone.hidden) { zone.innerHTML = ''; return; }
  const n = inactifs.length, premier = esc(salNomComplet(inactifs[0]));
  const titre = n === 1 ? `${premier} n'a pas enregistré de temps de travail depuis 6 mois.`
    : `${premier} et ${n - 1} autre${n > 2 ? 's' : ''} salarié${n > 2 ? 's' : ''} n'ont pas enregistré de temps de travail depuis 6 mois.`;
  const desc = n === 1 ? 'Pensez à détacher ce salarié s’il ne fait plus partie de votre entreprise, en sélectionnant l’option “mettre fin au rattachement”, ou'
    : 'Pensez à détacher ces salariés s’ils ne font plus partie de votre entreprise, en sélectionnant l’option “mettre fin au rattachement”, ou';
  $('sal-inactifs').innerHTML = salNotice(titre, desc, 'en cliquant ici', "toast('Salariés inactifs : hors scope')", 'fermerAlerteInactifs()');
}

function renderSalaries() {
  renderInvitations(); renderTemporaires(); renderLongueDuree(); renderInactifs();
  /* Salariés réellement inscrits (hors invitations et détachés), sur le nombre renseigné dans les paramètres.
     Sous 50 %, la barre passe en couleur d'avertissement. */
  const inscrits = [...sal.d.tmp, ...sal.d.lgd].filter(s => !salDetache(s)).length;
  const part = Math.min(100, Math.round(inscrits / SAL_NB_PARAMETRES * 100));
  $('sal-nb').textContent = inscrits;
  $('sal-inscrits').textContent = `${inscrits} sur ${SAL_NB_PARAMETRES}`;
  $('sal-barre').style.width = part + '%';
  $('sal-barre').classList.toggle('barre-progression__valeur--basse', inscrits / SAL_NB_PARAMETRES < .5);
  ['tmp', 'lgd'].forEach(t => { const b = $(t + '-tri'); if (sal.tri[t]) b.setAttribute('aria-sort', sal.tri[t]); else b.removeAttribute('aria-sort'); });
}

/* ---------- Actions ---------- */
function basculerSection(btn) {
  const ouvrir = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(ouvrir));
  $(btn.getAttribute('aria-controls')).hidden = !ouvrir;
}
function ouvrirSection(id, ouvrir) { const b = document.querySelector(`[aria-controls="${id}-corps"]`); b.setAttribute('aria-expanded', String(!ouvrir)); basculerSection(b); }
/* Menu latéral replié sous 768 px (bouton « Dans cette rubrique ») */
function basculerMenuLateral(btn) {
  const ouvrir = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(ouvrir));
  $(btn.getAttribute('aria-controls')).classList.toggle('fr-collapse--expanded', ouvrir);
}
function trier(t) { sal.tri[t] = sal.tri[t] === 'ascending' ? 'descending' : 'ascending'; renderSalaries(); }
function relancerInvitation(n) { sal.d.invitations[n].relance = SAL_AUJOURDHUI; renderSalaries(); toast('Invitation relancée'); }
function relancerInvitations() { sal.d.invitations.forEach(i => { if (!i.relance) i.relance = SAL_AUJOURDHUI; }); renderSalaries(); toast('Invitations relancées'); }
function annulerInvitation(n) { sal.d.invitations.splice(n, 1); renderSalaries(); toast('Invitation annulée'); }
function fermerAlerteDetachement(email) { sal.fermees.add(email); renderTemporaires(); }
function fermerAlerteInactifs() { sal.inactifsFerme = true; renderInactifs(); }

/* ---------- Parcours ---------- */
function ouvrirSalaries(variante) {
  sal = { d: salDonnees(), tri: { tmp: null, lgd: null }, fermees: new Set(), inactifsFerme: false };
  if (variante === 'sans-invitation') { sal.d.invitations = []; sal.d.tmp = []; }
  $('sal-groupe').value = '';
  /* Ouverture par défaut : invitations repliées, temporaires et longue durée ouverts */
  ouvrirSection('sec-inv', false); ouvrirSection('sec-tmp', true); ouvrirSection('sec-lgd', true);
  renderSalaries(); go('salaries');
  /* Le contenu défile seul sous l'en-tête et le menu fixes : il repart du haut */
  document.querySelector('.espace__page').scrollTop = 0;
}
window.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'cmd') return;
  if (m.name === 'flow-salaries') ouvrirSalaries();
  if (m.name === 'flow-salaries-sans-invitation') ouvrirSalaries('sans-invitation');
});
