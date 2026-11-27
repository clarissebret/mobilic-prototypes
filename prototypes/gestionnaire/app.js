const $ = id => document.getElementById(id);
const v = id => $(id).value.trim();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Entreprises fictives :
   - 110014016 : deux établissements, celui de Lyon déjà inscrit sur Mobilic ;
   - 220000002 : entreprise déjà inscrite sur Mobilic ;
   - tout autre SIREN valide : un seul établissement. */
const ENTREPRISES = {
  '110014016': { nom: 'DUPONT TRANSPORT SARL', etabs: [
    { siret: '11001401600015', nom: 'DUPONT TRANSPORT PARIS', adresse: '24 BOULEVARD DE L’EXEMPLE, 75007 PARIS', naf: '49.41A - Transports routiers de fret interurbains' },
    { siret: '11001401600023', nom: '', adresse: '8 RUE DES ENTREPÔTS, 69007 LYON', naf: '49.41B - Transports routiers de fret de proximité', inscrit: true }] },
  '220000002': { nom: 'TRANSPORTS MARTIN SAS', inscrite: true, etabs: [
    { siret: '22000000200014', nom: 'TRANSPORTS MARTIN', adresse: '3 AVENUE DU FICTIF, 33000 BORDEAUX', naf: '49.41B - Transports routiers de fret de proximité' }] },
};
const TRM = 'Marchandises (TRM)';
const entreprise = siren => ENTREPRISES[siren] || { nom: 'ENTREPRISE FICTIVE ' + siren.slice(-3), etabs: [
  { siret: siren + '00012', nom: '', adresse: "12 RUE DE L'EXEMPLE, 35000 RENNES", naf: '49.41B - Transports routiers de fret de proximité' }] };

const TYPES = ['Marchandises (TRM)', 'Voyageurs (TRV)', 'Sanitaire (TRS)', 'Déménagement'];
const ACTIVITES = ['Courte distance', 'Longue distance', 'Messagerie, Fonds et valeurs'];
const SOURCES = ["Courriel de l'équipe Mobilic", "Appel de l'équipe Mobilic", 'Sur les réseaux sociaux', "Lors d'un webinaire organisé par l'équipe Mobilic",
  'Une plateforme de mise en relation entre entreprises et particuliers', "Lors d'un contrôle", 'Un courriel/courrier de la DREAL', 'Recherche internet', 'Bouche à oreille', 'Autre'];
const INDICATIFS = [['🇫🇷', '+33', 'France'], ['🇧🇪', '+32', 'Belgique'], ['🇨🇭', '+41', 'Suisse'], ['🇱🇺', '+352', 'Luxembourg'], ['🇪🇸', '+34', 'Espagne'], ['🇮🇹', '+39', 'Italie'], ['🇩🇪', '+49', 'Allemagne']];

const state = {};

/* ---------- Navigation ---------- */
let current = 'metier';
function go(name) {
  if (name === 'source' && current === 'etab') renderSources();
  if (name === 'fin' && current === 'source') renderFin();
  current = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));
  window.scrollTo(0, 0);
  parent.postMessage({ type: 'screen', name, form: !['metier', 'compte', 'profil', 'fin', 'salaries'].includes(name) }, '*');
}
/* Menu de l'en-tête sous 992 px : modale DSFR ouverte sans le JS du DSFR */
function openMenu(btn) {
  const m = btn.closest('header').querySelector('.fr-header__menu');
  m.classList.add('fr-modal--opened'); m.setAttribute('aria-modal', 'true'); btn.setAttribute('aria-expanded', 'true');
  m.querySelector('.fr-btn--close').focus();
}
function closeMenu() {
  document.querySelectorAll('.fr-header__menu.fr-modal--opened').forEach(m => {
    m.classList.remove('fr-modal--opened'); m.removeAttribute('aria-modal');
    m.closest('header').querySelector('.fr-btn--menu').setAttribute('aria-expanded', 'false');
  });
}
/* Retour Android / Échap. Le compte est créé à la sortie de Cerbère : pas de retour vers Cerbère depuis Mobilic. */
function back() {
  if (document.querySelector('.fr-header__menu.fr-modal--opened')) return closeMenu();
  /* Infobulle ouverte (onglet Salariés) : Échap la referme */
  if (document.querySelector('#screen-salaries .fr-tooltip--shown')) return cacherInfobulles();
  if (current === 'compte') return go('metier');
  if (current === 'cerbere-1') return go('compte');
  if (current === 'cerbere-2') return go('cerbere-1');
  if (current === 'connexion') return go('profil');
  if (current === 'profil') return go(state.avantConnexion && !state.avantConnexion.startsWith('cerbere') ? state.avantConnexion : 'metier');
  if (current === 'cerbere-login') return go('connexion');
  /* Inscription de l'entreprise : le compte Cerbère existe, Retour ne fait rien */
  if (current === 'source' && !state.repriseFinalisation) return go('etab');
  if (current === 'fin') return go('source');
  /* Onglet Salariés : premier écran de l'espace, Retour ne fait rien */
}
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
}
function fieldError(group, show) { $(group).classList.toggle('fr-input-group--error', show); $(group.replace('-group', '-error')).style.display = show ? '' : 'none'; }

/* ---------- 2a. Cerbère : e-mail et SIREN ---------- */
function c1Validate() { ['c1-email-group', 'c1-siren-group'].forEach(g => { if ($(g).classList.contains('fr-input-group--error')) fieldError(g, false); }); }
function c1Submit() {
  const email = v('c1-email'), siren = v('c1-siren').replace(/\s/g, '');
  const eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), sOk = /^\d{9}$/.test(siren);
  fieldError('c1-email-group', !eOk); fieldError('c1-siren-group', !sOk);
  if (!eOk || !sOk) return;
  state.siren = siren;
  $('c2-siren').textContent = siren;
  $('c2-email').value = email;
  go('cerbere-2'); c2Validate();
}

/* ---------- 2b. Cerbère : compte professionnel ---------- */
const REGLES = { longueur: s => s.length >= 12, maj: s => /[A-Z]/.test(s), min: s => /[a-z]/.test(s), chiffre: s => /\d/.test(s), special: s => /[^A-Za-z0-9]/.test(s) };
function c2Validate() {
  const mdp = $('c2-mdp').value, mdp2 = $('c2-mdp2').value;
  let regles = true;
  document.querySelectorAll('[data-regle]').forEach(p => {
    const ok = REGLES[p.dataset.regle](mdp); regles = regles && ok;
    p.classList.toggle('fr-message--valid', mdp !== '' && ok);
    p.classList.toggle('fr-message--info', mdp === '' || !ok);
  });
  const diff = mdp2 !== '' && mdp !== mdp2;
  $('c2-mdp2-group').classList.toggle('fr-input-group--error', diff); $('c2-mdp2-error').style.display = diff ? '' : 'none';
  $('c2-submit').disabled = !(document.querySelector('input[name="civilite"]:checked') && v('c2-prenom') && v('c2-nom') && v('c2-email') && regles && mdp === mdp2);
}
function c2Submit() {
  state.email = v('c2-email');
  /* Téléphone repris de Cerbère : le portable est prioritaire sur le fixe */
  state.telGestionnaire = v('c2-mobile') || v('c2-tel');
  state.codePays = v('c2-codepays');
  state.compteCree = true;
  ouvrirInscriptionEntreprise();
}
function ouvrirInscriptionEntreprise() {
  state.ent = entreprise(state.siren);
  state.selected = state.ent.etabs.length === 1 ? [0] : [];
  renderEtabs(); go('etab');
}

/* ---------- Connexion (Mobilic) : via Cerbère ou avec un compte Mobilic ---------- */
/* Choix du profil (entreprise ou salarié, contrôleur), puis page de connexion */
function ouvrirConnexion() { if (!['profil', 'connexion'].includes(current)) state.avantConnexion = current; go('profil'); }
function cxValidate() { $('cx-submit').disabled = !(v('cx-email') && $('cx-mdp').value); }

/* ---------- 2c. Cerbère : connexion à un compte existant ---------- */
function clValidate() { $('cl-submit').disabled = !(v('cl-email') && $('cl-mdp').value); }
function clSubmit() {
  /* Compte existant fictif : SIREN de test, sans téléphone */
  state.email = v('cl-email'); state.siren = '110014016'; state.telGestionnaire = ''; state.codePays = '';
  state.compteCree = false;
  ouvrirInscriptionEntreprise();
}

/* ---------- 3. Détails de l'entreprise ---------- */
const opts = (list, ph) => `<option value="" selected disabled hidden>${ph}</option>` + list.map(o => `<option>${esc(o)}</option>`).join('');
/* Champ téléphone (composant Mobilic) : indicatif pays + numéro */
const telField = (id, label, req) => `<div class="fr-input-group tel" id="${id}-group">
  <label class="fr-label" for="${id}">${label}${req ? ' <span class="required">*</span>' : ''}<span class="fr-hint-text">Format attendu : 01 99 00 12 34</span></label>
  <div class="tel__row">
    <select class="fr-select tel__code" id="${id}-code" aria-label="Indicatif du pays">${INDICATIFS.map(([f, c, p]) => `<option value="${c}" title="${p}">${f} ${c}</option>`).join('')}</select>
    <input class="fr-input" id="${id}" type="tel" autocomplete="tel-national"${req ? ' required' : ''}>
  </div>
</div>`;
function renderEtabs() {
  const ent = state.ent, seul = ent.etabs.length === 1;
  /* Alerte « compte créé » seulement à la sortie de la création du compte Cerbère */
  $('e-cree').hidden = !state.compteCree;
  /* Entreprise déjà inscrite : seulement l'alerte, pas de formulaire */
  $('e-deja').hidden = !ent.inscrite;
  ['e-intro', 'e-hint', 'etabs', 'e-actions'].forEach(id => $(id).hidden = !!ent.inscrite);
  if (ent.inscrite) { $('etabs').innerHTML = ''; return; }
  $('e-intro').textContent = seul ? 'Votre établissement :' : 'Veuillez sélectionner un ou plusieurs établissements :';
  $('etabs').innerHTML = ent.etabs.map((e, i) => {
    const id = 'et' + i, sel = state.selected.includes(i);
    const head = `<span class="fr-text--bold">${esc(e.adresse)}</span><span class="fr-text--sm mention">Nom : ${esc(e.nom)}</span><span class="fr-text--xs mention">SIRET : ${e.siret}<br>CODE NAF : ${esc(e.naf)}</span>`;
    return `<div class="etab${sel ? ' etab--selected etab--open' : ''}" id="${id}">
      ${seul ? `<p class="etab__head fr-mb-0">${head}</p>` : `<div class="fr-checkbox-group"><input type="checkbox" id="${id}-check" ${sel ? 'checked' : ''} onchange="toggleEtab(${i}, this.checked)"><label class="fr-label" for="${id}-check"><span class="etab__head">${head}</span></label></div>`}
      <div class="etab__body"><div class="etab__clip" ${sel ? '' : 'inert'}><div class="etab__fields">
        ${e.inscrit ? `<div class="fr-alert fr-alert--info"><h3 class="fr-alert__title">Cet établissement est déjà inscrit sur Mobilic</h3><p>Rapprochez-vous d'un gestionnaire de votre entreprise pour qu'il vous donne accès à son espace.</p></div>` : `<div class="fr-input-group"><label class="fr-label" for="${id}-nom">Nom usuel <span class="required">*</span></label><input class="fr-input" id="${id}-nom" required value="${esc(e.nom)}"></div>
        ${telField(id + '-tel', "Numéro de téléphone de l'entreprise", false)}
        <div class="fr-input-group" id="${id}-nb-group"><label class="fr-label" for="${id}-nb">Nombre de salariés concernés par Mobilic <span class="required">*</span><span class="fr-hint-text">Exemple : chauffeurs, accompagnateurs, agents…</span></label><input class="fr-input" id="${id}-nb" type="number" min="1" inputmode="numeric" required><p class="fr-error-text" id="${id}-nb-error" style="display:none">Indiquez au moins 1 salarié.</p></div>
        <div>
          <div class="etab__row">
            <div class="fr-select-group"><label class="fr-label" for="${id}-type">Type de transport routier <span class="required">*</span></label><select class="fr-select" id="${id}-type" required>${opts(TYPES, 'Sélectionner un type')}</select></div>
            <div class="fr-select-group fr-select-group--disabled" id="${id}-act-group"><label class="fr-label" for="${id}-act">Activité principale <span class="required">*</span></label><select class="fr-select" id="${id}-act" disabled>${opts(ACTIVITES, 'Sélectionner une activité')}</select></div>
          </div>
          <div class="fr-messages-group fr-mt-1w"><p class="fr-message fr-message--info">Ce type d'activité sera appliqué par défaut à tous les salariés de l'établissement. Vous pourrez le modifier ensuite pour chaque salarié.</p></div>
        </div>`}
      </div></div></div>
    </div>`;
  }).join('');
  eValidate();
}
function toggleEtab(i, on) {
  state.selected = on ? [...state.selected, i] : state.selected.filter(x => x !== i);
  const el = $('et' + i), clip = el.querySelector('.etab__clip');
  el.classList.toggle('etab--selected', on); clip.inert = !on;
  /* Une fois déplié, le masque est levé pour ne pas couper le contour de focus DSFR */
  clearTimeout(el._open); el.classList.remove('etab--open');
  if (on) el._open = setTimeout(() => el.classList.add('etab--open'), 250);
  eValidate();
}
function eValidate() {
  const etabs = state.ent ? state.ent.etabs : [];
  etabs.forEach((e, i) => {
    if (e.inscrit || !$(`et${i}-type`)) return;
    /* Activité principale : seulement pour le transport de marchandises, grisée sinon */
    const trm = $(`et${i}-type`).value === TRM, act = $(`et${i}-act`);
    if (act.disabled === trm) { act.disabled = !trm; act.required = trm; if (!trm) act.value = ''; $(`et${i}-act-group`).classList.toggle('fr-select-group--disabled', !trm); }
    /* Nombre de salariés : 1 au moins */
    const nb = v(`et${i}-nb`); fieldError(`et${i}-nb-group`, nb !== '' && !(Number(nb) >= 1));
  });
  /* Les établissements déjà inscrits ne comptent pas : au moins un autre doit être sélectionné et complet */
  const aInscrire = state.selected.filter(i => !etabs[i].inscrit);
  const complet = i => ['nom', 'nb', 'type'].every(k => v(`et${i}-${k}`) !== '') && Number(v(`et${i}-nb`)) >= 1 && ($(`et${i}-type`).value !== TRM || v(`et${i}-act`) !== '');
  $('e-submit').disabled = !(aInscrire.length > 0 && aInscrire.every(complet));
}

/* ---------- 4. Finalisation de l'inscription ---------- */
function renderSources() {
  /* Téléphone du gestionnaire : toujours demandé, prérempli avec celui de Cerbère (portable, sinon fixe) */
  if (!$('s-gtel')) {
    $('s-gtel-wrap').innerHTML = '<div class="fr-mb-4w">' + telField('s-gtel', 'Votre numéro de téléphone', true) + '</div>';
    $('s-gtel').value = state.telGestionnaire || '';
    const code = (state.codePays || '').replace(/\s/g, '').replace(/^00/, '+').replace(/^(\d)/, '+$1');
    if (code && [...$('s-gtel-code').options].some(o => o.value === code)) $('s-gtel-code').value = code;
  }
  sValidate();
  if ($('f-sources').children.length) return;
  $('f-sources').innerHTML = SOURCES.map((s, i) => `<div class="fr-fieldset__element"><div class="fr-radio-group"><input type="radio" name="source" id="src-${i}" value="${esc(s)}"><label class="fr-label" for="src-${i}">${esc(s)}</label></div></div>`).join('');
}

function sValidate() { $('s-submit').disabled = v('s-gtel') === ''; }

/* ---------- 5. Confirmation et webinaire ---------- */
function renderFin() {
  $('f-email').textContent = state.email || '';
  /* Prochain webinaire fictif : le jeudi qui suit, à 10 h */
  const d = new Date(); d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7 || 7));
  $('w-jour').textContent = d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
  $('w-num').textContent = d.getDate();
  $('w-mois').textContent = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') + ' ' + d.getFullYear();
  $('w-heure').textContent = '10:00';
  $('w-btn').disabled = false; $('w-btn').textContent = "S'inscrire";
  /* Aucun webinaire programmé : l'encart est masqué */
  $('webinaire').hidden = !!state.sansWebinaire;
}
function webinaire() { $('w-btn').disabled = true; $('w-btn').textContent = 'Inscription confirmée'; toast('Inscription au webinaire confirmée'); }

/* Compte Cerbère fictif pour les parcours de reprise */
function demoCompte() { state.email = 'camille.martin@example.fr'; state.siren = '123456789'; state.telGestionnaire = '06 39 98 12 34'; state.codePays = ''; state.compteCree = false; }
function resetAll() {
  document.querySelectorAll('input, select').forEach(el => { if (el.type === 'radio' || el.type === 'checkbox') el.checked = false; else el.value = ''; });
  document.querySelectorAll('.fr-input-group--error').forEach(g => fieldError(g.id, false));
  $('f-sources').innerHTML = ''; $('s-gtel-wrap').innerHTML = '';
  Object.keys(state).forEach(k => delete state[k]);
  current = 'metier'; go('metier');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') back(); });
window.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'cmd') return;
  if (m.name === 'flow-inscription' || m.name === 'reset') resetAll();
  /* Reprise à la connexion : compte créé mais entreprise pas encore inscrite */
  if (m.name === 'flow-reprise-entreprise') { resetAll(); demoCompte(); ouvrirInscriptionEntreprise(); }
  /* Reprise à la connexion : entreprise inscrite, finalisation pas terminée */
  if (m.name === 'flow-reprise-finalisation') { resetAll(); demoCompte(); state.repriseFinalisation = true; renderSources(); go('source'); }
  if (m.name === 'flow-sans-webinaire') { resetAll(); state.sansWebinaire = true; }
  if (m.name === 'back') back();
});
