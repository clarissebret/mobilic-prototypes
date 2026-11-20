const $ = id => document.getElementById(id);
const v = id => $(id).value.trim();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Entreprises fictives : le SIREN de test a deux établissements, tout autre SIREN valide un seul */
const ENTREPRISES = {
  '110014016': { nom: 'DUPONT TRANSPORT SARL', etabs: [
    { siret: '11001401600015', adresse: '24 BOULEVARD DE L’EXEMPLE 75007 PARIS', naf: '49.41A - Transports routiers de fret interurbains' },
    { siret: '11001401600023', adresse: '8 RUE DES ENTREPÔTS 69007 LYON', naf: '49.41B - Transports routiers de fret de proximité' }] },
};
const entreprise = siren => ENTREPRISES[siren] || { nom: 'ENTREPRISE FICTIVE ' + siren.slice(-3), etabs: [
  { siret: siren + '00012', adresse: "12 RUE DE L'EXEMPLE 35000 RENNES", naf: '49.41B - Transports routiers de fret de proximité' }] };

const TYPES = ['Marchandises (TRM)', 'Voyageurs (TRV)', 'Sanitaire (TRS)', 'Déménagement'];
const ACTIVITES = ['Courte distance', 'Longue distance', 'Messagerie, fonds et valeurs'];
const SOURCES = ["Courriel de l'équipe Mobilic", "Appel de l'équipe Mobilic", 'Sur les réseaux sociaux', "Lors d'un webinaire organisé par l'équipe Mobilic",
  'Lors d’un contrôle', 'Un courrier ou courriel de la DREAL', 'Recherche internet', 'Bouche à oreille', 'Autre'];

const state = {};

/* ---------- Navigation ---------- */
let current = 'metier';
const FORMS = ['cerbere-1', 'cerbere-2', 'etab', 'fin'];
function go(name) {
  current = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));
  window.scrollTo(0, 0);
  parent.postMessage({ type: 'screen', name, form: FORMS.includes(name) }, '*');
}
/* Retour Android / Échap */
function back() {
  if (current === 'cerbere-1') return go('metier');
  if (current === 'cerbere-2') return go('cerbere-1');
  if (current === 'fin') return go('etab');
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
  state.email = email; state.siren = siren;
  $('c2-siren').textContent = siren.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
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
  $('c2-submit').disabled = !(document.querySelector('input[name="civilite"]:checked') && v('c2-prenom') && v('c2-nom') && regles && mdp === mdp2);
}
function c2Submit() {
  state.ent = entreprise(state.siren);
  state.selected = state.ent.etabs.length === 1 ? [0] : [];
  renderEtabs(); go('etab');
}

/* ---------- 3. Établissements ---------- */
const opts = (list, ph) => `<option value="" selected disabled hidden>${ph}</option>` + list.map(o => `<option>${esc(o)}</option>`).join('');
function renderEtabs() {
  const ent = state.ent, seul = ent.etabs.length === 1;
  $('e-ent').textContent = ent.nom; $('e-siren').textContent = state.siren.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  $('e-intro').textContent = seul ? 'Complétez les informations de votre établissement :' : 'Sélectionnez le ou les établissements que vous gérez, puis complétez leurs informations :';
  $('etabs').innerHTML = ent.etabs.map((e, i) => {
    const id = 'et' + i, sel = state.selected.includes(i);
    const head = `<p class="fr-text--bold fr-mb-1w">${esc(e.adresse)}</p><p class="fr-text--sm fr-mb-0 mention">SIRET ${e.siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4')}<br>${esc(e.naf)}</p>`;
    return `<div class="etab${sel ? ' etab--selected' : ''}" id="${id}">
      ${seul ? head : `<div class="fr-checkbox-group"><input type="checkbox" id="${id}-check" ${sel ? 'checked' : ''} onchange="toggleEtab(${i}, this.checked)"><label class="fr-label" for="${id}-check"><span>${head}</span></label></div>`}
      <div class="etab__fields" ${sel ? '' : 'hidden'}>
        <div class="fr-input-group"><label class="fr-label" for="${id}-nom">Nom usuel <span class="required">*</span><span class="fr-hint-text">Nom sous lequel vos salariés connaissent l'établissement</span></label><input class="fr-input" id="${id}-nom" required></div>
        <div class="fr-input-group"><label class="fr-label" for="${id}-tel">Téléphone de l'établissement</label><input class="fr-input" id="${id}-tel" type="tel" autocomplete="tel"></div>
        <div class="fr-input-group"><label class="fr-label" for="${id}-nb">Nombre de salariés concernés par Mobilic <span class="required">*</span><span class="fr-hint-text">Conducteurs, déménageurs, ambulanciers…</span></label><input class="fr-input" id="${id}-nb" type="number" min="1" inputmode="numeric" required></div>
        <div class="etab__row">
          <div class="fr-select-group"><label class="fr-label" for="${id}-type">Type de transport routier <span class="required">*</span></label><select class="fr-select" id="${id}-type" required>${opts(TYPES, 'Sélectionner un type')}</select></div>
          <div class="fr-select-group"><label class="fr-label" for="${id}-act">Activité principale <span class="required">*</span></label><select class="fr-select" id="${id}-act" required>${opts(ACTIVITES, 'Sélectionner une activité')}</select></div>
        </div>
      </div>
    </div>`;
  }).join('');
  eValidate();
}
function toggleEtab(i, on) {
  state.selected = on ? [...state.selected, i] : state.selected.filter(x => x !== i);
  const el = $('et' + i); el.classList.toggle('etab--selected', on); el.querySelector('.etab__fields').hidden = !on;
  eValidate();
}
function eValidate() {
  const ok = state.selected.length > 0 && state.selected.every(i => ['nom', 'nb', 'type', 'act'].every(k => v(`et${i}-${k}`) !== '') && Number(v(`et${i}-nb`)) >= 1);
  $('e-submit').disabled = !ok;
}

/* ---------- 4. Finalisation ---------- */
function renderFin() {
  $('f-email').textContent = state.email || '';
  $('f-sources').innerHTML = SOURCES.map((s, i) => `<div class="fr-fieldset__element"><div class="fr-checkbox-group"><input type="checkbox" id="src-${i}"><label class="fr-label" for="src-${i}">${esc(s)}</label></div></div>`).join('');
  /* Prochain webinaire fictif : le jeudi qui suit, à 10 h */
  const d = new Date(); d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7 || 7));
  $('w-jour').textContent = d.toLocaleDateString('fr-FR', { weekday: 'short' });
  $('w-num').textContent = d.getDate();
  $('w-mois').textContent = d.toLocaleDateString('fr-FR', { month: 'short' });
  $('w-heure').textContent = '10:00';
  $('w-btn').disabled = false; $('w-btn').textContent = "Je m'inscris";
}
function webinaire() { $('w-btn').disabled = true; $('w-btn').textContent = 'Inscription confirmée'; toast('Inscription au webinaire confirmée'); }
const _go = go;
go = name => { if (name === 'fin' && current === 'etab') renderFin(); _go(name); };

function resetAll() {
  document.querySelectorAll('input, select').forEach(el => { if (el.type === 'radio' || el.type === 'checkbox') el.checked = false; else if (el.id !== 'c2-email') el.value = ''; });
  document.querySelectorAll('.fr-input-group--error').forEach(g => fieldError(g.id, false));
  Object.keys(state).forEach(k => delete state[k]);
  go('metier');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') back(); });
window.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'cmd') return;
  if (m.name === 'flow-inscription' || m.name === 'reset') resetAll();
  if (m.name === 'back') back();
});
