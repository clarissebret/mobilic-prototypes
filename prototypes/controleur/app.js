const $ = id => document.getElementById(id);
const v = id => $(id).value.trim();
const pad = n => String(n).padStart(2, '0');
/* Historique fictif des derniers contrôles, daté par rapport à aujourd'hui */
const daysAgo = n => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n); return d; };
const ctrl = (type, name, veh, time, lieu, bdc, ent, jours, inf) => ({ type, name, veh, time, lieu, bdc, ent, jours, inf });
const state = { control: null, bdc: null, notes: [], history: [
  { date: daysAgo(0), items: [
    ctrl('mobilic', 'Basset Hugo', 'GH-512-KL', '10:12', 'Aire de Paimpont-Brocéliande', 'remis', 'Transports Basset', '8 jours', 1),
    ctrl('lic', 'Allard Sophie', 'AB-123-CD', '08:05', 'Aire de Paimpont-Brocéliande', 'non', 'Déménagements Allard', '28 jours', 0)] },
  { date: daysAgo(1), items: [
    ctrl('mobilic', 'Pleyel Lucie', 'EF-456-GH', '15:40', 'Rennes', 'attente', 'Pleyel Logistique', '8 jours', 2),
    ctrl('lic', 'Letronc Yves', 'JK-789-LM', '11:30', 'Vitré', 'non', 'Letronc et Fils', '28 jours', 0)] },
  { date: daysAgo(5), items: [
    ctrl('mobilic', 'Marchal Inès', 'NP-246-QR', '09:20', 'Saint-Malo', 'remis', 'Marchal Express', '8 jours', 0)] }
] };

/* ---------- Navigation ---------- */
let current = 'home';
/* Sur grand écran, le contrôle (page du contrôle, bulletin, relevé) s'ouvre dans un panneau latéral par-dessus l'accueil */
const PANEL = ['control', 'bdc', 'infractions'];
function go(name) {
  const wasPanel = PANEL.includes(current), isPanel = PANEL.includes(name);
  current = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));
  document.body.classList.toggle('has-panel', isPanel);
  if (isPanel && !wasPanel) {   // animation d'entrée seulement à l'ouverture du panneau
    document.body.classList.add('panel-entering');
    setTimeout(() => document.body.classList.remove('panel-entering'), 400);
  }
  window.scrollTo(0, 0); if (isPanel) $('screen-' + name).scrollTop = 0;
  notify();
}
const currentStep = () => [1, 2, 3].find(i => !$('bdc-step-' + i).hidden);
let activeTab = 0;
function notify() {
  const form = current === 'form' || current === 'bdc' || current === 'infractions' || (current === 'control' && activeTab === 1 && rel.editing);
  parent.postMessage({ type: 'screen', name: current, form }, '*');
}
/* Retour : touche Échap ou clic sur le fond du panneau */
function back() {
  const open = document.querySelector('.fr-modal--opened');
  if (open) return closeModal(open.id);
  if (current === 'home') return;
  if (current === 'form') return go('home');
  if (current === 'control' && activeTab === 1 && rel.editing && rel.saved) return cancelReleve();
  if (current === 'control') return requestClose();
  if (current === 'bdc') { const s = currentStep(); return s > 1 ? bdcStep(s - 1) : go('control'); }
  if (current === 'infractions') return cancelInfractions();
}
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
}
function openModal(id) { const m = $(id); m.classList.add('fr-modal--opened'); m.setAttribute('aria-modal', 'true'); document.documentElement.style.overflow = 'hidden'; }
function closeModal(id) { const m = $(id); m.classList.remove('fr-modal--opened'); m.removeAttribute('aria-modal'); document.documentElement.style.overflow = ''; }
document.addEventListener('click', e => { if (e.target.classList && e.target.classList.contains('fr-modal')) closeModal(e.target.id); });

/* ---------- Formulaire de création ---------- */
const required = ['f-activite', 'f-nom', 'f-prenom', 'f-jour', 'f-mois', 'f-annee', 'f-nat', 'f-immat'];
function validate() {
  const ok = required.every(id => v(id) !== '') && $('f-ent-nom').value !== '' && document.querySelector('input[name="page"]:checked');
  $('btn-create').disabled = !ok;
}
function showSirenError(msg) { $('siren-group').classList.add('fr-input-group--error'); const e = $('siren-error'); e.textContent = msg; e.style.display = ''; validate(); }
function hideSirenError() { $('siren-group').classList.remove('fr-input-group--error'); $('siren-error').style.display = 'none'; }
function clearCompany() { $('f-ent-nom').value = ''; $('f-ent-adr').value = ''; $('f-ent-adr').rows = 1; hideSirenError(); validate(); }
function searchSiren() {
  hideSirenError();
  const s = v('f-siren').replace(/\s/g, '');
  if (!s) return showSirenError("Saisissez le numéro SIREN de l'entreprise.");
  if (!/^\d{9}$/.test(s)) return showSirenError('Saisissez un numéro SIREN de 9 chiffres, par exemple 123 456 789.');
  if (s === '000000000') return showSirenError('Aucune entreprise ne correspond à ce numéro SIREN. Vérifiez le numéro saisi.');
  const known = s === '110014016';
  $('f-ent-nom').value = known ? 'DUPONT TRANSPORT SARL' : 'ENTREPRISE FICTIVE ' + s.slice(-3);
  $('f-ent-adr').value = known ? 'HOTEL DE BEAUVAU 1 PLACE BEAUVAU 75008 PARIS' : "12 RUE DE L'EXEMPLE 69003 LYON";
  $('f-ent-adr').rows = 2;
  validate();
}
function resetForm() {
  document.querySelectorAll('#lic-form input, #lic-form select, #lic-form textarea').forEach(el => {
    if (el.type === 'radio' || el.type === 'checkbox') el.checked = false; else el.value = '';
  });
  clearCompany();
}
/* Remplit le formulaire avec des données fictives. L'activité choisie par la personne qui teste est conservée. */
function fillDemo() {
  const act = $('f-activite').value;
  resetForm(); go('form');
  $('f-activite').value = act;
  $('f-nom').value = 'Vincent'; $('f-prenom').value = 'Arthur';
  $('f-jour').value = '12'; $('f-mois').value = '02'; $('f-annee').value = '1992';
  $('f-nat').value = 'France'; $('f-siren').value = '110014016'; searchSiren();
  $('f-immat').value = '1234ABC01'; $('page-non').checked = true;
  validate();
}
function fmt(d) { return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} à ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
function fmtLong(d) { return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ` à ${d.getHours()}:${pad(d.getMinutes())}`; }

function createControl() {
  state.control = {
    nom: v('f-nom'), prenom: v('f-prenom'), date: new Date(), ent: $('f-ent-nom').value, adr: $('f-ent-adr').value,
    act: $('f-activite').value, veh: v('f-immat').toUpperCase(), siren: v('f-siren'),
    jour: v('f-jour'), mois: v('f-mois'), annee: v('f-annee'), nat: $('f-nat').value
  };
  state.reopened = null;
  state.bdc = null; state.notes = []; state.infractions = catalog(state.control.act, state.control.date, radio('page') === 'Non');
  rel.editing = true; rel.saved = null; rel.draft = clone(state.infractions);
  renderTab(); renderTabBadge();
  renderControl(); renderBdc(); tab(0); go('control'); toast('Contrôle créé');
}

/* ---------- Page du contrôle ---------- */
function renderControl() {
  const c = state.control; if (!c) return;
  $('c-title').textContent = c.prenom + ' ' + c.nom;
  $('c-date').textContent = fmt(c.date);
  $('c-ent').textContent = c.ent; $('c-act').textContent = c.act; $('c-veh').textContent = c.veh;
  const since = new Date(c.date); since.setDate(since.getDate() - 56);
  $('c-since').textContent = 'Depuis le ' + fmt(since).split(' à ')[0];
  $('notes').innerHTML = state.notes.map(n => `<div class="note fr-text--sm fr-mb-1w">${n.replace(/</g, '&lt;')}</div>`).join('');
  $('notes-empty').hidden = state.notes.length > 0;
}
function tab(i) {
  activeTab = i;
  document.querySelectorAll('.ctrl-tabs button').forEach((b, j) => b.setAttribute('aria-selected', i === j));
  [0, 1, 2].forEach(j => $('tab-' + j).hidden = j !== i);
  if (i === 1 && state.control) { if (rel.editing && !rel.draft) startReleve(); else renderTab(); }
  notify();
}
function openDateModal() {
  const d = state.control.date;
  $('date-edit').value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  openModal('modal-date');
}
function saveDate() { const x = $('date-edit').value; if (x) state.control.date = new Date(x); renderControl(); closeModal('modal-date'); toast('Date et heure modifiées'); }
function toggleNote() { const ed = $('note-editor'); ed.hidden = !ed.hidden; if (!ed.hidden) $('note-text').focus(); }
function saveNote() { const x = v('note-text'); if (!x) return; state.notes.push(x); $('note-text').value = ''; $('note-editor').hidden = true; renderControl(); }

function requestClose() {
  const b = state.bdc;
  if (!b) return openModal('modal-bdc');
  if (!b.paper && !b.sentEnt && !b.sentDrv) return openModal('modal-notsent');
  closeControl();
}
function closeControl() {
  closeModal('modal-bdc');
  const c = state.control, d = c.date, b = state.bdc;
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  let entry = state.history.find(h => h.date.getTime() === day.getTime());
  if (!entry) { entry = { date: day, items: [] }; state.history.unshift(entry); }
  const bdc = !b ? 'non' : (b.sentEnt || b.sentDrv || b.paper) ? 'remis' : 'attente';
  const lieu = b ? [b.commune, b.lieu].filter(Boolean).join(' ') : '';
  const inf = state.infractions.filter(i => i.sel.length).length;
  const item = ctrl('lic', c.nom + ' ' + c.prenom, c.veh, fmt(d).split(' à ')[1], lieu || '–', bdc, c.ent, '–', inf);
  item.snap = snapshot();
  if (state.reopened) { item.isNew = state.reopened.isNew; Object.assign(state.reopened, item); state.reopened = null; }
  else { item.isNew = true; entry.items.unshift(item); }
  $('hist-type').value = 'lic';
  resetForm(); go('home'); renderHistory(day); toast('Contrôle enregistré');
}
const BDC_BADGE = {
  remis: ['success', 'Remis'], attente: ['warning', "En attente d'envoi"], non: ['error', 'Non créé'] };
function dayTitle(d) {
  const n = Math.round((daysAgo(0) - d) / 864e5);
  if (n === 0) return 'Aujourd’hui';
  const l = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return l.charAt(0).toUpperCase() + l.slice(1);
}
/* Derniers contrôles : un accordéon DSFR par jour, avec un tableau DSFR défilant horizontalement */
function renderHistory(openDay) {
  const type = $('hist-type').value;
  $('history').innerHTML = state.history.map((h, k) => {
    const items = h.items.filter(it => it.type === type);
    const open = openDay ? h.date.getTime() === openDay.getTime() : k === 0;
    const id = 'hist-' + k;
    const rows = items.map((it, i) => {
      const [kind, label] = BDC_BADGE[it.bdc];
      return `<tr onclick="openHistory(${k}, ${i})"><td><a href="#" class="row-link" onclick="event.preventDefault()">${it.name}</a>${it.isNew ? ' <span class="fr-badge fr-badge--sm fr-badge--new fr-badge--no-icon">Nouveau</span>' : ''}</td><td>${it.veh}</td><td>${it.time}</td><td>${it.lieu}</td>
        <td>${it.type === 'mobilic' ? 'Mobilic' : 'LIC papier'}</td><td><span class="fr-badge fr-badge--sm fr-badge--${kind} fr-badge--no-icon">${label}</span></td>
        <td>${it.ent}</td><td>${it.jours}</td><td>${it.inf}</td></tr>`;
    }).join('');
    return `<section class="fr-accordion">
      <h3 class="fr-accordion__title"><button type="button" class="fr-accordion__btn" aria-expanded="${open}" aria-controls="${id}" onclick="toggleAcc(this)">${dayTitle(h.date)}</button></h3>
      <div class="fr-collapse${open ? ' fr-collapse--expanded' : ''}" id="${id}">
        ${items.length ? `<div class="fr-table fr-table--no-caption mobilic-table mobilic-table--clickable fr-mt-0 fr-mb-0"><div class="fr-table__wrapper"><div class="fr-table__container"><div class="fr-table__content">
          <table><caption>Contrôles du ${dayTitle(h.date).toLowerCase()}</caption>
            <thead><tr><th scope="col">Salarié</th><th scope="col">Véhicule</th><th scope="col">Heure</th><th scope="col">Lieu de contrôle</th><th scope="col">Type</th>
              <th scope="col">Bulletin de contrôle</th><th scope="col">Nom entreprise</th><th scope="col">Jours contrôlés</th><th scope="col">Infractions retenues</th></tr></thead>
            <tbody>${rows}</tbody></table></div></div></div></div>`
        : '<p class="fr-text--sm mention fr-mb-0">Aucun contrôle de ce type.</p>'}
      </div>
    </section>`;
  }).join('');
}
/* Rouvrir un contrôle depuis « Derniers contrôles » */
function snapshot() {
  return { control: { ...state.control, date: new Date(state.control.date) }, bdc: state.bdc && { ...state.bdc },
    notes: [...state.notes], infractions: clone(state.infractions), saved: rel.saved && new Date(rel.saved) };
}
function openHistory(k, i) {
  const h = state.history[k], it = h.items.filter(x => x.type === $('hist-type').value)[i];
  if (it.type === 'mobilic') return toast('Contrôle Mobilic : hors scope');
  let s = it.snap;
  if (!s) {   /* contrôle fictif : reconstitué à partir de la ligne */
    const [nom, prenom] = it.name.split(' '), date = new Date(h.date), [hh, mm] = it.time.split(':');
    date.setHours(+hh, +mm);
    s = { control: { nom, prenom, date, ent: it.ent, adr: '', act: 'TRM - Courte distance', veh: it.veh, siren: '110014016', jour: '', mois: '', annee: '', nat: 'France' },
      bdc: null, notes: [], infractions: catalog('TRM - Courte distance', date, false), saved: date };
  }
  state.control = { ...s.control, date: new Date(s.control.date) }; state.bdc = s.bdc && { ...s.bdc };
  state.notes = [...s.notes]; state.infractions = clone(s.infractions); state.reopened = it;
  rel.saved = s.saved ? new Date(s.saved) : null; rel.editing = !rel.saved; rel.draft = rel.editing ? clone(state.infractions) : null;
  renderTab(); renderTabBadge(); renderControl(); renderBdc(); tab(0); go('control');
}
/* Ouverture / fermeture d'un accordéon DSFR sans le JS du DSFR */
function toggleAcc(btn) {
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open);
  $(btn.getAttribute('aria-controls')).classList.toggle('fr-collapse--expanded', open);
}

/* ---------- Bulletin de contrôle ---------- */
const PLACES = {
  'AIN': { 'BOURG EN BRESSE': ['PARC DES EXPOSITIONS', 'AIRE DE LA BRESSE'] },
  'ILLE-ET-VILAINE': { 'PAIMPONT': ['BROCÉLIANDE'], 'RENNES': ['ROCADE NORD', 'PORTE DE SAINT-MALO'] },
  'PARIS': { 'PARIS': ['PORTE DE LA CHAPELLE', "PORTE D'ITALIE"] }
};
const ACT_PDF = {
  'TRM - Courte distance': 'Transport de marchandise - Courte distance',
  'TRM - Longue distance': 'Transport de marchandise - Longue distance',
  'TRM - Messagerie, Fonds et valeur': 'Transport de marchandise - Messagerie, fonds et valeurs',
  'TRV': 'Transport de voyageurs',
  'TRS': 'Transport sanitaire'
};
const isTRS = () => !!state.control && state.control.act.startsWith('TRS');
function fillSelect(sel, opts, ph) { sel.innerHTML = `<option value="" selected disabled hidden>${ph}</option>` + opts.map(o => `<option>${o}</option>`).join(''); }
function bdcPlaces(fromCommune) {
  const d = $('b-dept').value, c = $('b-commune').value;
  if (!fromCommune) { fillSelect($('b-commune'), Object.keys(PLACES[d] || {}), 'Sélectionner une commune'); fillSelect($('b-lieu'), [], 'Sélectionner un lieu'); }
  else fillSelect($('b-lieu'), (PLACES[d] || {})[c] || [], 'Sélectionner un lieu');
  bdcValidate();
}
function bdcPoids() { $('b-poids-reel-wrap').hidden = isTRS() || $('b-poids').value !== 'Poids réel constaté'; }
function stepValid(n) {
  const fields = [...$('bdc-step-' + n).querySelectorAll('input[required], select[required]')].filter(el => !el.closest('[hidden]'));
  if (!fields.every(f => f.value.trim() !== '')) return false;
  if (n === 2 && !isTRS() && !document.querySelector('input[name="b-type"]:checked')) return false;
  return true;
}
function bdcValidate() { $('b-next-1').disabled = !stepValid(1); $('b-next-2').disabled = !stepValid(2); $('b-save').disabled = !stepValid(3); }
function bdcStep(n) { [1, 2, 3].forEach(i => $('bdc-step-' + i).hidden = i !== n); bdcValidate(); go('bdc'); }
function startBdc() {
  const c = state.control;
  if (!state.bdc) {
    document.querySelectorAll('#bdc-form input, #bdc-form select, #bdc-form textarea').forEach(el => {
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = false; else if (el.tagName !== 'SELECT' || el.id === 'b-dept' || el.id === 'b-nat' || el.id === 'b-pays' || el.id === 'b-poids') el.value = '';
    });
    fillSelect($('b-commune'), [], 'Sélectionner une commune'); fillSelect($('b-lieu'), [], 'Sélectionner un lieu');
    $('b-nom').value = c.nom; $('b-prenom').value = c.prenom;
    $('b-jour').value = c.jour; $('b-mois').value = c.mois; $('b-annee').value = c.annee; $('b-nat').value = c.nat;
    $('b-siren').value = c.siren; $('b-ent').value = c.ent; $('b-adr').value = c.adr; $('b-immat').value = c.veh;
    $('b-agent').value = '45602COX';
    bdcPoids();
  }
  document.querySelectorAll('#bdc-form .not-trs').forEach(el => el.hidden = isTRS());
  bdcPoids();
  renderInfRead();
  bdcStep(1);
}
const radio = name => (document.querySelector(`input[name="${name}"]:checked`) || {}).value || '';
function bdcSave() {
  const first = !state.bdc;
  state.bdc = Object.assign(state.bdc || { num: String(Math.floor(100000000 + Math.random() * 899999999)), paper: false, sentEnt: false, sentDrv: false }, {
    edited: new Date(), commune: v('b-commune'), lieu: v('b-lieu'),
    nom: v('b-nom'), prenom: v('b-prenom'), naissance: `${v('b-jour').padStart(2, '0')}/${v('b-mois').padStart(2, '0')}/${v('b-annee')}`, nat: v('b-nat'),
    siren: v('b-siren'), ent: v('b-ent'), adr: v('b-adr'), immat: v('b-immat').toUpperCase(), pays: v('b-pays'),
    prov: v('b-prov'), dest: v('b-dest'), type: radio('b-type'), march: v('b-march'), lic: v('b-lic'), copie: v('b-copie'),
    poids: $('b-poids').value === 'Poids réel constaté' ? (v('b-poids-reel') ? v('b-poids-reel') + ' tonnes' : '') : $('b-poids').value,
    immo: radio('b-immo'), agent: v('b-agent'), obs: v('b-obs')
  });
  renderBdc(); go('control'); toast(first ? 'Bulletin de contrôle créé' : 'Bulletin de contrôle modifié');
}
function renderBdc() {
  renderBdcInto($('bdc-section'));
  if ($('bdc-section-inf')) renderBdcInto($('bdc-section-inf'));
}
function renderBdcInto(el) {
  const b = state.bdc;
  if (!b) {
    el.innerHTML = `<div class="section-head fr-mb-3v"><h2 class="fr-h6 fr-mb-0">Bulletin de contrôle</h2><button type="button" class="fr-btn fr-btn--sm" onclick="startBdc()">Créer</button></div>
      <p class="fr-text--sm mention">Vous pourrez le transmettre à l'entreprise de manière dématérialisée.</p>`;
    return;
  }
  const sent = b.sentEnt || b.sentDrv;
  const badges = [b.sentDrv && 'Remis au conducteur (via email)', b.sentEnt && "Envoyé à l'entreprise"].filter(Boolean)
    .map(s => `<li><p class="fr-badge fr-badge--sm fr-badge--info">${s}</p></li>`).join('');
  el.innerHTML = `<div class="section-head fr-mb-3v"><h2 class="fr-h6 fr-mb-0">Bulletin de contrôle</h2><button type="button" class="fr-btn fr-btn--tertiary fr-btn--sm" onclick="startBdc()">Modifier</button></div>
    <div class="bdc-card">
      <div class="bdc-card__title"><span class="fr-icon-file-text-fill" aria-hidden="true"></span><div><p class="fr-text--bold fr-mb-0">Bulletin ${b.num}</p><p class="fr-text--sm mention fr-mb-0">édité le ${fmtLong(b.edited)}</p></div></div>
      ${sent ? `<ul class="fr-badges-group fr-mt-2w">${badges}</ul>` : `<div class="fr-checkbox-group fr-checkbox-group--sm fr-mt-2w"><input type="checkbox" id="b-paper" ${b.paper ? 'checked' : ''} onchange="state.bdc.paper=this.checked"><label class="fr-label" for="b-paper">Remis au format papier</label></div>`}
      <div class="bdc-card__actions fr-mt-3v">
        <button type="button" class="fr-btn fr-btn--sm fr-btn--secondary fr-icon-download-line fr-btn--icon-left" onclick="openPdf()">Télécharger</button>
        <button type="button" class="fr-btn fr-btn--sm fr-icon-send-plane-line fr-btn--icon-left" onclick="openSend()">Envoyer</button>
      </div>
    </div>`;
}
function openSend() { $('send-ent').value = ''; $('send-copy').checked = false; $('send-drv-wrap').hidden = true; openModal('modal-send'); }
function bdcSend() {
  const ent = v('send-ent'), drv = $('send-copy').checked ? v('send-drv') : '';
  if (!ent && !drv) return toast('Renseignez au moins une adresse e-mail');
  if (ent) state.bdc.sentEnt = true;
  if (drv) state.bdc.sentDrv = true;
  closeModal('modal-send'); renderBdc(); toast('Bulletin envoyé');
}
function openPdf() {
  const b = state.bdc, c = state.control, trs = isTRS(), d = c.date, end = b.edited;
  const row = (k, val) => `<div class="pdf-row"><span>${k}</span><span>${val || '-'}</span></div>`;
  const head = `<div class="pdf-head"><p class="fr-logo">République<br>française</p><div><strong>Bulletin de contrôle en bord de route (Mobilic)</strong><span>Précisions sur l'organisation</span></div></div>`;
  const lieu = [b.commune, b.lieu].filter(Boolean).join(' ').toLowerCase().replace(/(^|\s)\S/g, m => m.toUpperCase());
  const page1 = `<div class="pdf-page">${head}
    <div class="pdf-block"><h3>Opération de contrôle</h3>
      ${row('N° de bulletin de contrôle :', `${b.siren}-${d.getFullYear()}-${b.agent}`)}
      ${row('Date de contrôle :', fmt(d).split(' à ')[0])}
      ${row('Horaire de contrôle :', `${d.getHours()}:${pad(d.getMinutes())} – ${end.getHours()}:${pad(end.getMinutes())}`)}
      ${row('Lieu de contrôle :', lieu)}</div>
    <div class="pdf-block"><h3>Entreprise</h3>
      ${row('N° SIREN :', b.siren)}${row('Entreprise de rattachement :', b.ent)}${row("Adresse de l'entreprise :", b.adr)}
      ${row("Type d'activité :", ACT_PDF[c.act] || c.act)}
      ${trs ? '' : row('N° de la licence :', b.lic) + row('N° de la copie conforme de la licence :', b.copie)}</div>
    <div class="pdf-cols">
      ${trs ? '' : `<div class="pdf-block"><h3>Opération de transport</h3>${row('Provenance :', b.prov)}${row('Destination :', b.dest)}${row('Type de transport :', b.type)}${row('Marchandise :', b.march)}</div>`}
      <div class="pdf-block"><h3>Conducteur au moment du contrôle</h3>${row('Nom :', b.nom)}${row('Prénom :', b.prenom)}${row('Nationalité :', b.nat)}${row('Date de naissance :', b.naissance)}</div>
    </div>
    <div class="pdf-block"><h3>Véhicule</h3>${row("N° d'immatriculation :", b.immat)}${row("Pays d'immatriculation :", b.pays)}${trs ? '' : row('Poids du véhicule :', b.poids)}</div>
    <div class="pdf-block pdf-inline"><h3>Infraction(s) relevée(s)</h3><span>Tableau récapitulatif des infractions relevées en annexe</span></div>
    <div class="pdf-block pdf-inline"><h3>Immobilisation du véhicule :</h3><span>${b.immo || '-'}</span></div>
    <div class="pdf-block pdf-inline pdf-obs"><h3>Observations :</h3><span>${(b.obs || '-').replace(/</g, '&lt;')}</span></div>
    <div class="pdf-block pdf-inline"><h3 class="pdf-plain">Agent de contrôle :</h3><span>${b.agent}</span></div>
    <p class="pdf-foot">Précisions sur l'organisation</p>
    <p class="pdf-foot">Concernant le traitement de vos données à caractère personnel, toutes les informations sont disponibles dans la politique de confidentialité sur mobilic.beta.gouv.fr</p>
  </div>`;
  const page2 = `<div class="pdf-page pdf-page--landscape">${head}
    <table class="pdf-table"><thead><tr><th>NATINF</th><th>Infraction</th><th>Nombre</th><th>Détail</th></tr></thead>
    <tbody>${selected(state.infractions).map(i => `<tr><td>${i.natinf}</td><td>${i.label}</td><td>${i.sel.length}</td><td>${infDetail(i)}</td></tr>`).join('') || '<tr><td colspan="4">Aucune infraction retenue</td></tr>'}</tbody></table>
    <p class="pdf-foot">Les infractions mentionnées au PV pourront être différentes de celles relevées au sein du présent bulletin de contrôle.</p>
  </div>`;
  parent.postMessage({ type: 'pdf', html: page1 + page2 }, '*');
}

/* ---------- Commandes du panneau "Liens rapides" ---------- */
function resetAll() {
  state.control = null; state.bdc = null; state.notes = []; state.infractions = null; state.reopened = null; rel.editing = true; rel.saved = null; rel.draft = null; activeTab = 0;
  state.history = state.history.filter(h => (h.items = h.items.filter(i => !i.isNew)).length);
  resetForm(); $('hist-type').value = 'mobilic';
  document.querySelectorAll('.fr-modal--opened').forEach(m => closeModal(m.id));
  }
function fillBdc() {
  const s = currentStep();
  if (s === 1) { $('b-dept').value = 'ILLE-ET-VILAINE'; bdcPlaces(); $('b-commune').value = 'PAIMPONT'; bdcPlaces(true); $('b-lieu').value = 'BROCÉLIANDE'; }
  if (s === 2) {
    $('b-pays').value = 'FRANCE'; $('im-non').checked = true;
    if (!isTRS()) { $('b-prov').value = 'Rennes'; $('b-dest').value = 'Paris'; $('tt-int').checked = true; $('b-march').value = 'Colis'; $('b-lic').value = '2026/53/0001234'; }
  }
  if (s === 3) { $('b-agent').value = '45602COX'; $('b-obs').value = 'Conducteur coopératif.'; }
  bdcValidate();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && current !== 'home') back(); });
window.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'cmd') return;
  if (m.name === 'flow-lic') { resetAll(); go('form'); }
  if (m.name === 'fill') {
    if (current === 'form') fillDemo();
    else if (current === 'bdc') fillBdc();
    else if (current === 'infractions') { fillInfractions(draft); renderInfEdit(); }
    else if (current === 'control' && activeTab === 1 && rel.editing) { fillInfractions(rel.draft); renderTab(); }
  }
  if (m.name === 'back') back();
  if (m.name === 'reset') resetAll();
});
renderHistory(); go('home');
