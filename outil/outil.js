/* Outil de prototypage : barre de contrôle (parcours, format, remplissage, inspection) et inspecteur.
   Séparé du code des prototypes : il lit le DOM de l'iframe (même origine) et lui envoie les commandes existantes.
   Documentation : composants/outil-prototypage.md */
(() => {
'use strict';
const DATA = JSON.parse(document.getElementById('outil-data').textContent);
const $ = id => document.getElementById(id);
const frame = $('app'), device = $('device'), box = $('device-box'), vue = $('vue'), calque = $('calque'), outil = $('outil');
const barre = $('barre'), liste = $('parcours-liste'), recherche = $('parcours-recherche'), options = $('parcours-options');
const inspecteur = $('inspecteur');
const doc = () => frame.contentDocument, win = () => frame.contentWindow;
const clamp = (min, v, max) => Math.max(min, Math.min(v, max));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const stock = (zone => ({
  lire(k, d) { try { const v = zone().getItem('outil.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  ecrire(k, v) { try { zone().setItem('outil.' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
}));
const local = stock(() => localStorage);
function annoncer(t) { const a = $('outil-annonce'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 50); }

/* ---------- Info-bulles DSFR (affichées sans le JS du DSFR) ---------- */
function infobulle(btn, tt) {
  const placer = () => {
    tt.classList.add('fr-placement--top');
    const r = btn.getBoundingClientRect(), t = tt.getBoundingClientRect();
    const left = clamp(8, r.left + r.width / 2 - t.width / 2, innerWidth - t.width - 8);
    tt.style.left = left + 'px'; tt.style.top = (r.top - t.height - 4) + 'px';
    tt.style.setProperty('--arrow-x', (r.left + r.width / 2 - left - t.width / 2) + 'px');
  };
  const montrer = () => { if (!liste.hidden) return; tt.classList.add('fr-tooltip--shown'); tt.setAttribute('aria-hidden', 'false'); placer(); };
  const cacher = () => { tt.classList.remove('fr-tooltip--shown'); tt.setAttribute('aria-hidden', 'true'); };
  btn.addEventListener('mouseenter', montrer); btn.addEventListener('focus', montrer);
  btn.addEventListener('mouseleave', cacher); btn.addEventListener('blur', cacher); btn.addEventListener('click', cacher);
  return { montrer, cacher, placer };
}
const ttParcours = infobulle($('parcours-bouton'), $('tt-parcours'));
const ttRemplir = infobulle($('remplir'), $('tt-remplir'));
infobulle($('inspecter'), $('tt-inspecter'));

/* ---------- Barre : rôle toolbar, flèches entre les contrôles ---------- */
const controles = () => [...barre.querySelectorAll('button, input[type="radio"], select')].filter(el => el.getClientRects().length);
function activer(i, focus) {
  const c = controles(); i = (i + c.length) % c.length;
  c.forEach((el, k) => { el.tabIndex = k === i ? 0 : -1; });
  if (focus) c[i].focus();
}
barre.addEventListener('keydown', e => {
  const c = controles(), i = c.indexOf(document.activeElement);
  if (i < 0) return;
  const cible = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: c.length - 1 }[e.key];
  if (cible === undefined) return;
  e.preventDefault(); activer(cible, true);
});
barre.addEventListener('focusin', e => { const i = controles().indexOf(e.target); if (i >= 0) activer(i); });

/* ---------- Format d'écran ---------- */
const DESKTOP = 1440;
let format = local.lire('format', { mode: 'mobile', telephone: '360x740' });
if (!['360x640', '360x740', '412x915'].includes(format.telephone)) format.telephone = '360x740';
let echelle = 1;
function appliquerFormat() {
  $('format-' + format.mode).checked = true;
  $('telephone').value = format.telephone;
  $('telephone').hidden = format.mode !== 'mobile';
  device.classList.toggle('device--desktop', format.mode === 'desktop');
  local.ecrire('format', format);
  ajuster(); activer(controles().indexOf(document.activeElement) >= 0 ? controles().indexOf(document.activeElement) : 0);
}
function ajuster() {
  const cs = getComputedStyle(vue), root = document.documentElement.style;
  const aw = vue.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const ah = vue.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  let k;
  if (format.mode === 'mobile') {
    const [w, h] = format.telephone.split('x').map(Number);
    root.setProperty('--w', w + 'px'); root.setProperty('--h', h + 'px');
    k = Math.min(1, aw / device.offsetWidth, ah / device.offsetHeight);
  } else {
    k = Math.min(1, aw / DESKTOP);
    root.setProperty('--w', DESKTOP + 'px'); root.setProperty('--h', Math.max(200, Math.floor(ah / k)) + 'px');
  }
  device.style.transform = `scale(${k})`;
  box.style.width = device.offsetWidth * k + 'px'; box.style.height = device.offsetHeight * k + 'px';
  echelle = k;
  const z = $('zoom'); z.hidden = k >= 0.995;
  z.innerHTML = `<span class="fr-sr-only">Affichage réduit à </span>${Math.round(k * 100)} %`;
  dessiner();
}
$('format').addEventListener('change', e => { format.mode = e.target.value; appliquerFormat(); annoncer(e.target.value === 'mobile' ? 'Format mobile' : 'Format desktop, 1440 px'); });
$('telephone').addEventListener('change', e => { format.telephone = e.target.value; appliquerFormat(); });
new ResizeObserver(ajuster).observe(vue);

/* ---------- Parcours ---------- */
const iface = DATA.interfaces.find(i => i.id === DATA.interface);
let enCours = null; // l'app repart de l'accueil à chaque chargement
let actif = -1;
function libelleParcours() {
  const p = iface.parcours.find(x => x.commande === enCours);
  $('parcours-libelle').textContent = `${iface.nom} · ${p ? p.libelle : 'Choisir un parcours'}`;
}
function rendreListe() {
  const q = norm(recherche.value.trim());
  let html = '', n = 0;
  DATA.interfaces.forEach(it => {
    const ps = it.parcours.filter(p => norm(p.libelle).includes(q));
    if (!ps.length) return;
    html += `<div role="group" aria-labelledby="pg-${it.id}"><p class="outil-liste__groupe outil-mention fr-text--xs fr-text--bold fr-mb-0" id="pg-${it.id}">${esc(it.nom)}</p>`;
    ps.forEach(p => {
      const sel = it.id === DATA.interface && p.commande === enCours;
      html += `<div class="outil-option fr-text--sm fr-mb-0" role="option" id="po-${n}" data-interface="${it.id}" data-commande="${esc(p.commande)}" aria-selected="${sel}">`
        + `<span>${esc(p.libelle)}</span><span class="fr-icon-check-line fr-icon--sm" aria-hidden="true"></span></div>`;
      n++;
    });
    html += '</div>';
  });
  options.innerHTML = html;
  $('parcours-vide').hidden = n > 0;
  $('parcours-vide').textContent = n ? '' : 'Aucun parcours ne correspond à votre recherche';
  surligner(n ? 0 : -1);
}
function surligner(i) {
  const os = [...options.querySelectorAll('[role="option"]')];
  actif = os.length ? (i + os.length) % os.length : -1;
  os.forEach((o, k) => o.classList.toggle('outil-option--active', k === actif));
  if (actif >= 0) { recherche.setAttribute('aria-activedescendant', os[actif].id); os[actif].scrollIntoView({ block: 'nearest' }); }
  else recherche.removeAttribute('aria-activedescendant');
}
function ouvrirListe() {
  ttParcours.cacher();
  recherche.value = ''; rendreListe(); liste.hidden = false;
  const r = $('parcours-bouton').getBoundingClientRect();
  liste.style.left = clamp(16, r.left, innerWidth - liste.offsetWidth - 16) + 'px';
  liste.style.bottom = (innerHeight - r.top + 4) + 'px';
  $('parcours-bouton').setAttribute('aria-expanded', 'true');
  recherche.focus();
}
function fermerListe(rendreFocus) {
  if (liste.hidden) return;
  liste.hidden = true; $('parcours-bouton').setAttribute('aria-expanded', 'false');
  if (rendreFocus) $('parcours-bouton').focus();
}
function choisirParcours(ifaceId, commande) {
  fermerListe(true);
  if (ifaceId !== DATA.interface) { location.href = `../${ifaceId}/#parcours=${encodeURIComponent(commande)}`; return; }
  const p = iface.parcours.find(x => x.commande === commande);
  const recommencer = commande === enCours;
  deselectionner();
  cmd(commande);
  enCours = commande; libelleParcours();
  annoncer(`${recommencer ? 'Parcours recommencé' : 'Parcours'} : ${p.libelle}. Premier écran affiché.`);
}
$('parcours-bouton').addEventListener('click', () => liste.hidden ? ouvrirListe() : fermerListe(true));
recherche.addEventListener('input', rendreListe);
recherche.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); surligner(actif + 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); surligner(actif - 1); }
  else if (e.key === 'Enter' && actif >= 0) { e.preventDefault(); const o = options.querySelectorAll('[role="option"]')[actif]; choisirParcours(o.dataset.interface, o.dataset.commande); }
  else if (e.key === 'Tab') fermerListe(false);
});
options.addEventListener('click', e => { const o = e.target.closest('[role="option"]'); if (o) choisirParcours(o.dataset.interface, o.dataset.commande); });
document.addEventListener('mousedown', e => { if (!liste.hidden && !liste.contains(e.target) && !$('parcours-bouton').contains(e.target)) fermerListe(false); });

/* ---------- Remplissage des formulaires ---------- */
let formApp = false;
function portee() { const d = doc(); return d.querySelector('.fr-modal--opened') || d.querySelector('.screen.active') || d.body; }
function champs() {
  const p = portee();
  if (!p) return [];
  return [...p.querySelectorAll('input, select, textarea')].filter(el => !el.disabled && !el.readOnly
    && !['hidden', 'button', 'submit', 'reset', 'image', 'file'].includes(el.type) && el.getClientRects().length);
}
function remplissable() { const p = portee(); return !!p && (formApp || p.classList.contains('fr-modal')) && champs().length > 0; }
function majRemplir() {
  const ok = remplissable(), b = $('remplir');
  if (ok) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true');
  $('tt-remplir').textContent = ok ? 'Remplir le formulaire (R)' : 'Aucun formulaire sur cet écran';
  if ($('tt-remplir').classList.contains('fr-tooltip--shown')) ttRemplir.placer();
}
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/* Valeur fictive selon le type du champ, quand remplissage.json n'en déclare pas. Les dates successives sont croissantes (début avant fin). */
function generique(el, rang) {
  const indice = norm(`${el.id} ${el.name} ${el.labels && el.labels[0] ? el.labels[0].textContent : ''}`);
  if (el.type === 'date' || el.type === 'datetime-local') {
    const d = new Date(); d.setDate(d.getDate() + rang);
    let v = iso(d);
    const min = (el.min || '').slice(0, 10), max = (el.max || '').slice(0, 10);
    if (min && v < min) v = min;
    if (max && v > max) v = max;
    return el.type === 'date' ? v : v + 'T09:00';
  }
  if (el.type === 'time') return '09:00';
  if (el.type === 'number' || el.type === 'range') return el.min || '1';
  if (el.type === 'email') return 'contact@entreprise.fr';
  if (el.type === 'url') return 'https://www.example.fr';
  if (el.type === 'tel' || el.type === 'search' || el.type === 'password' || el.type === 'color') return null;
  if (indice.includes('immat')) return 'AB-123-CD';
  if (el.inputMode === 'numeric' || el.inputMode === 'decimal') return '1';
  const t = 'Texte fictif';
  return el.maxLength > 0 ? t.slice(0, el.maxLength) : t;
}
function emettre(el) {
  const W = win();
  el.dispatchEvent(new W.Event('input', { bubbles: true }));
  el.dispatchEvent(new W.Event('change', { bubbles: true }));
}
function remplir() {
  if (!remplissable()) { annoncer('Aucun formulaire sur cet écran'); return; }
  const V = (DATA.remplissage || {}).valeurs || {}, A = (DATA.remplissage || {}).apres || {};
  const faits = new Set();
  let n = 0, dates = 0;
  const apres = el => { if (A[el.id]) { const b = doc().querySelector(A[el.id]); if (b) b.click(); } };
  for (let tour = 0; tour < 200; tour++) {
    const tous = champs(), el = tous.find(c => !faits.has(c));
    if (!el) break;
    faits.add(el);
    if (el.type === 'radio') {
      const groupe = tous.filter(c => c.type === 'radio' && c.name === el.name);
      groupe.forEach(c => faits.add(c));
      if (groupe.some(c => c.checked)) continue;
      const choix = groupe.find(c => c.id === V[el.name]) || groupe[0];
      choix.checked = true; emettre(choix); n++;
    } else if (el.type === 'checkbox') {
      if (el.required && !el.checked) { el.checked = true; emettre(el); n++; }
    } else if (el.tagName === 'SELECT') {
      if (el.value) continue;
      const os = [...el.options].filter(o => !o.disabled && o.value !== '');
      const o = os.find(x => x.value === V[el.id] || x.text === V[el.id]) || os[0];
      if (!o) continue;
      el.value = o.value; emettre(el); n++; apres(el);
    } else {
      if (el.value.trim()) continue;
      const v = V[el.id] !== undefined ? V[el.id] : generique(el, dates);
      if (v == null) continue;
      if (el.type === 'date' || el.type === 'datetime-local') dates++;
      el.value = v; emettre(el); n++; apres(el);
    }
  }
  annoncer(n ? `${n} champ${n > 1 ? 's' : ''} rempli${n > 1 ? 's' : ''}` : 'Tous les champs sont déjà remplis');
  dessiner();
}
$('remplir').addEventListener('click', remplir);
window.addEventListener('message', e => {
  if (e.source !== win()) return;
  const m = e.data || {};
  if (m.type === 'screen') { formApp = !!m.form; majRemplir(); dessiner(); }
});

/* ---------- Inspection : survol, sélection, calque ---------- */
let inspection = false, survol = null, selection = [];
const LIBELLES = [
  [/^fr-btns-group$/, 'Groupe de boutons DSFR', 'ButtonsGroup'], [/^fr-btn$/, 'Bouton DSFR', 'Button'],
  [/^fr-input-group$/, 'Champ de saisie DSFR', 'Input'], [/^fr-input$/, 'Champ de saisie DSFR', 'Input'],
  [/^fr-select-group$/, 'Liste déroulante DSFR', 'Select'], [/^fr-select$/, 'Liste déroulante DSFR', 'Select'],
  [/^fr-search-bar$/, 'Barre de recherche DSFR', 'SearchBar'], [/^fr-radio-group$/, 'Bouton radio DSFR', 'RadioButtons'],
  [/^fr-checkbox-group$/, 'Case à cocher DSFR', 'Checkbox'], [/^fr-fieldset$/, 'Groupe de champs DSFR', 'Fieldset'],
  [/^fr-segmented$/, 'Contrôle segmenté DSFR', 'SegmentedControl'], [/^fr-toggle$/, 'Interrupteur DSFR', 'ToggleSwitch'],
  [/^fr-alert$/, 'Alerte DSFR', 'Alert'], [/^fr-badge$/, 'Badge DSFR', 'Badge'], [/^fr-tag$/, 'Tag DSFR', 'Tag'],
  [/^fr-card$/, 'Carte DSFR', 'Card'], [/^fr-tile$/, 'Tuile DSFR', 'Tile'], [/^fr-accordion$/, 'Accordéon DSFR', 'Accordion'],
  [/^fr-modal$/, 'Modale DSFR', 'createModal'], [/^fr-stepper$/, 'Indicateur d\'étapes DSFR', 'Stepper'],
  [/^fr-table$/, 'Tableau DSFR', 'Table'], [/^fr-tabs$/, 'Onglets DSFR', 'Tabs'], [/^fr-header$/, 'En-tête DSFR', 'Header'],
  [/^fr-footer$/, 'Pied de page DSFR', 'Footer'], [/^fr-callout$/, 'Mise en avant DSFR', 'CallOut'], [/^fr-notice$/, 'Bandeau d\'information DSFR', 'Notice'],
  [/^fr-breadcrumb$/, 'Fil d\'Ariane DSFR', 'Breadcrumb'], [/^fr-highlight$/, 'Mise en exergue DSFR', 'Highlight'],
  [/^fr-pagination$/, 'Pagination DSFR', 'Pagination'], [/^fr-link$/, 'Lien DSFR', null], [/^fr-logo$/, 'Bloc marque DSFR', null],
  [/^mobilic-table$/, 'Tableau Mobilic', 'Table'], [/^choice$/, 'Tuile de choix Mobilic', null], [/^ctrl-tabs$/, 'Onglets du contrôle Mobilic', null],
  [/^sticky-actions$/, 'Barre d\'actions fixe Mobilic', null], [/^inf/, 'Accordéon d\'infraction Mobilic', null],
  [/^fr-icon-/, 'Icône DSFR', null]
];
function identite(el) {
  for (const [re, type, react] of LIBELLES) for (const c of el.classList) if (re.test(c)) return { type, react, classe: c };
  const tag = el.tagName.toLowerCase();
  return { type: tag === 'img' ? 'Image' : tag === 'svg' ? 'Image vectorielle' : `Élément ${tag}`, react: null, classe: null };
}
function nom(el) {
  const id = identite(el);
  if (id.classe) return id.classe;
  const c = [...el.classList].find(x => !/^fr-(m|p)[trblxy]?-|^fr-text|^fr-h\d|^fr-mb|^fr-mt/.test(x));
  return c || el.tagName.toLowerCase();
}
const px = v => `${Math.round(v * 10) / 10} px`;
const dims = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width * 10) / 10} × ${Math.round(r.height * 10) / 10}`; };

function rectCadre() {
  const f = frame.getBoundingClientRect(), c = calque.getBoundingClientRect();
  return { x: f.left - c.left, y: f.top - c.top, w: f.width, h: f.height };
}
function boite(r, cls) {
  return `<div class="${cls}" style="left:${r.left * echelle}px;top:${r.top * echelle}px;width:${r.width * echelle}px;height:${r.height * echelle}px"></div>`;
}
let zone = null;
function dessiner() {
  if (!doc() || !doc().body) return;
  const c = rectCadre();
  let html = '';
  const vivant = el => el && el.isConnected && el.getClientRects().length;
  selection.filter(vivant).forEach(el => { html += boite(el.getBoundingClientRect(), 'outil-contour outil-contour--selection'); });
  if (zone) zone.forEach(r => { html += boite(r, 'outil-zone'); });
  const cible = inspection && vivant(survol) ? survol : null;
  if (cible) {
    const r = cible.getBoundingClientRect();
    if (!selection.includes(cible)) html += boite(r, 'outil-contour');
    const haut = r.top * echelle > 24;
    html += `<p class="outil-etiquette fr-text--xs fr-mb-0" style="left:${Math.max(0, r.left * echelle)}px;top:${haut ? r.top * echelle : r.bottom * echelle}px;transform:translateY(${haut ? '-100%' : '0'})">${esc(nom(cible))} · ${dims(cible)}</p>`;
  }
  calque.innerHTML = `<div class="outil-calque__cadre" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px">${html}</div>`;
}
function basculerInspection(etat, clavier) {
  inspection = etat === undefined ? !inspection : etat;
  $('inspecter').setAttribute('aria-pressed', String(inspection));
  if (!inspection) { survol = null; deselectionner(); annoncer('Mode inspection désactivé'); }
  else if (clavier) {
    survol = portee(); frame.focus();
    annoncer('Mode inspection activé. Flèches haut et bas pour passer au parent ou à l\'enfant, gauche et droite entre éléments voisins, Entrée pour sélectionner, Échap pour quitter.');
  } else annoncer('Mode inspection activé. Cliquez sur un élément du prototype.');
  dessiner();
}
function selectionner(el, ajout) {
  if (ajout) selection = selection.includes(el) ? selection.filter(x => x !== el) : selection.concat(el);
  else selection = [el];
  if (!selection.length) return deselectionner();
  ouvrirInspecteur(); dessiner();
  annoncer(`Sélectionné : ${selection.length > 1 ? selection.length + ' éléments' : nom(el) + ', ' + identite(el).type}`);
}
function deselectionner() {
  const ouvert = !inspecteur.hidden;
  selection = []; zone = null;
  inspecteur.hidden = true; outil.classList.remove('outil--inspecteur');
  if (ouvert) annoncer('Inspecteur fermé');
  dessiner();
}
$('inspecter').addEventListener('click', e => basculerInspection(undefined, e.detail === 0));
$('insp-fermer').addEventListener('click', () => { deselectionner(); $('inspecter').focus(); });
$('insp-agrandir').addEventListener('click', e => {
  const on = inspecteur.classList.toggle('outil-inspecteur--agrandi');
  e.currentTarget.setAttribute('aria-pressed', String(on));
  e.currentTarget.classList.toggle('fr-icon-arrow-up-s-line', !on); e.currentTarget.classList.toggle('fr-icon-arrow-down-s-line', on);
  e.currentTarget.textContent = on ? 'Réduire l\'inspecteur' : 'Agrandir l\'inspecteur';
});

/* Navigation au clavier en mode inspection */
function naviguer(e) {
  const d = doc(), cur = survol && survol.isConnected ? survol : (selection[0] || portee());
  const visible = el => el && el.getClientRects().length;
  let next = null;
  if (e.key === 'ArrowUp') next = cur.parentElement && cur !== d.body ? cur.parentElement : null;
  else if (e.key === 'ArrowDown') next = [...cur.children].find(visible);
  else if (e.key === 'ArrowRight') { next = cur.nextElementSibling; while (next && !visible(next)) next = next.nextElementSibling; }
  else if (e.key === 'ArrowLeft') { next = cur.previousElementSibling; while (next && !visible(next)) next = next.previousElementSibling; }
  else if (e.key === 'Enter') { e.preventDefault(); selectionner(cur, e.shiftKey); return true; }
  else return false;
  e.preventDefault();
  if (next) { survol = next; next.scrollIntoView({ block: 'nearest' }); dessiner(); annoncer(`${nom(next)}, ${identite(next).type}, ${dims(next)}`); }
  return true;
}

/* Échap : liste ouverte, puis sélection, puis mode inspection */
function echap() {
  if (!liste.hidden) { fermerListe(true); return true; }
  if (selection.length) { deselectionner(); return true; }
  if (inspection) { basculerInspection(false); return true; }
  return false;
}
function clavier(e, dansCadre) {
  if (e.key === 'Escape') { if (echap()) e.preventDefault(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (inspection && dansCadre && naviguer(e)) return;
  const t = e.target;
  if (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || (t.tagName === 'INPUT' && !['radio', 'checkbox', 'button'].includes(t.type))) return;
  const k = e.key.toLowerCase();
  if (k === 'i') { e.preventDefault(); basculerInspection(undefined, true); }
  else if (k === 'r') { e.preventDefault(); remplir(); }
  else if (k === 'p') { e.preventDefault(); ouvrirListe(); }
}
document.addEventListener('keydown', e => clavier(e, false));

/* Écoute de l'iframe (même origine) */
let installe = null;
function installer() {
  const d = doc();
  if (!d || !d.body || installe === d) return;
  installe = d;
  const bloquer = e => { if (!inspection) return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };
  ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'submit'].forEach(t => d.addEventListener(t, bloquer, true));
  d.addEventListener('click', e => { if (!inspection) return; bloquer(e); selectionner(e.target.nodeType === 1 ? e.target : e.target.parentElement, e.shiftKey); }, true);
  d.addEventListener('mousemove', e => { if (inspection && survol !== e.target) { survol = e.target; dessiner(); } }, true);
  d.addEventListener('mouseleave', () => { if (inspection) { survol = null; dessiner(); } });
  d.addEventListener('keydown', e => clavier(e, true), true);
  d.addEventListener('mousedown', () => fermerListe(false));
  win().addEventListener('scroll', () => dessiner(), true);
  win().addEventListener('resize', () => dessiner());
  let attente = 0;
  new (win().MutationObserver)(() => { cancelAnimationFrame(attente); attente = requestAnimationFrame(() => { majRemplir(); dessiner(); if (!inspecteur.hidden) rafraichir(); }); })
    .observe(d.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
  majRemplir();
  const h = location.hash.match(/^#parcours=(.+)$/);
  if (h) { history.replaceState(null, '', location.pathname); const c = decodeURIComponent(h[1]); if (iface.parcours.some(p => p.commande === c)) setTimeout(() => choisirParcours(DATA.interface, c), 0); }
}
frame.addEventListener('load', installer);
if (doc() && doc().readyState === 'complete') installer();

/* ---------- Lecture des styles : règles, déclarations, tokens ---------- */
let REGLES = null, TOKENS = null;
function regles() {
  if (REGLES) return REGLES;
  REGLES = []; TOKENS = { clair: new Map(), sombre: new Map() };
  const parcourir = (liste, src, media) => {
    for (const r of liste) {
      if (r.selectorText !== undefined && r.style) {
        REGLES.push({ r, src, media, ordre: REGLES.length });
        if (!media && (r.selectorText === ':root' || r.selectorText === ':root[data-fr-theme=dark]' || r.selectorText === ':root[data-fr-theme="dark"]')) {
          const m = r.selectorText === ':root' ? TOKENS.clair : TOKENS.sombre;
          for (const p of r.style) if (p.startsWith('--')) m.set(p, r.style.getPropertyValue(p).trim());
        }
      } else if (r.cssRules) parcourir(r.cssRules, src, r.media ? r.media.mediaText : media);
    }
  };
  [...doc().styleSheets].forEach(s => { try { parcourir(s.cssRules, s.ownerNode && s.ownerNode.id === 'mobilic' ? 'mobilic' : 'dsfr', null); } catch (e) { /* feuille illisible */ } });
  return REGLES;
}
function specificite(sel) {
  const s = sel.replace(/:where\([^()]*\)/g, '').replace(/:(not|is|has)\(([^()]*)\)/g, ' $2');
  const a = (s.match(/#[\w-]+/g) || []).length;
  const b = (s.match(/\.[\w-]+|\[[^\]]+\]|(^|[^:]):[\w-]+/g) || []).length;
  const c = (s.replace(/\[[^\]]+\]/g, '').match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length + (s.match(/::[\w-]+/g) || []).length;
  return a * 10000 + b * 100 + c;
}
const decouper = sel => sel.split(/,(?![^(]*\))/).map(x => x.trim());
const mediaOk = {};
function correspondances(el, avecEtats) {
  const W = win();
  return regles().filter(({ r, media }) => {
    if (media && !(mediaOk[media] ??= W.matchMedia(media).matches)) return false;
    return decouper(r.selectorText).some(s => { try { return el.matches(avecEtats ? s.replace(/:(hover|active|focus-visible|focus-within|focus)\b/g, '') || '*' : s); } catch (e) { return false; } });
  }).map(x => {
    const sp = Math.max(...decouper(x.r.selectorText).map(s => { try { return el.matches(s) ? specificite(s) : -1; } catch (e) { return -1; } }));
    return { ...x, sp };
  });
}
const RACCOURCIS = {
  'background-color': ['background'], 'background-image': ['background'], color: [],
  'border-top-color': ['border-color', 'border-top', 'border'], 'border-top-width': ['border-width', 'border-top', 'border'],
  'border-top-style': ['border-style', 'border-top', 'border'], 'box-shadow': [], 'border-top-left-radius': ['border-radius'],
  'padding-top': ['padding'], 'padding-right': ['padding'], 'padding-bottom': ['padding'], 'padding-left': ['padding'],
  'margin-top': ['margin'], 'margin-right': ['margin'], 'margin-bottom': ['margin'], 'margin-left': ['margin'],
  'font-size': ['font'], 'font-weight': ['font'], 'line-height': ['font'], 'font-family': ['font'],
  width: [], height: [], gap: [], 'row-gap': ['gap'], 'column-gap': ['gap'], opacity: [], filter: [], 'outline-color': ['outline']
};
const HERITEES = ['color', 'font-size', 'font-weight', 'line-height', 'font-family', 'text-align'];
const cacheCorr = new WeakMap();
/* Déclaration gagnante d'une propriété : style en ligne, !important, spécificité puis ordre ; héritage pour le texte. */
function declaration(el, prop, profondeur = 0) {
  const noms = [prop].concat(RACCOURCIS[prop] || []);
  const lire = st => { for (const n of noms) { const v = st.getPropertyValue(n); if (v) return { v: v.trim(), imp: st.getPropertyPriority(n) === 'important', p: n }; } return null; };
  if (!cacheCorr.has(el)) cacheCorr.set(el, correspondances(el, false));
  let best = null;
  for (const x of cacheCorr.get(el)) {
    const d = lire(x.r.style); if (!d) continue;
    const score = [d.imp ? 1 : 0, 0, x.sp, x.ordre];
    if (!best || comparer(score, best.score) >= 0) best = { ...d, score, source: x.src, selecteur: x.r.selectorText };
  }
  const inl = lire(el.style);
  if (inl && (!best || inl.imp || !best.imp)) best = { ...inl, score: [inl.imp ? 1 : 0, 1, 0, 0], source: 'inline', selecteur: 'style' };
  if (!best && HERITEES.includes(prop) && el.parentElement && profondeur < 30) {
    const h = declaration(el.parentElement, prop, profondeur + 1);
    return h ? { ...h, herite: h.herite || el.parentElement } : null;
  }
  return best;
}
function comparer(a, b) { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; }
const tokenDe = v => { const m = /var\((--[\w-]+)/.exec(v || ''); return m ? m[1] : null; };
function chaine(nomTok, theme) {
  regles();
  const res = [], vus = new Set();
  let n = nomTok;
  while (n && !vus.has(n)) {
    vus.add(n);
    const v = theme === 'sombre' ? (TOKENS.sombre.get(n) ?? TOKENS.clair.get(n)) : TOKENS.clair.get(n);
    if (v === undefined) { res.push({ nom: n, introuvable: true }); break; }
    res.push({ nom: n, valeur: v });
    const m = /^var\((--[\w-]+)\)$/.exec(v);
    n = m ? m[1] : null;
  }
  return res;
}
const finale = ch => ch.length && !ch[ch.length - 1].introuvable ? ch[ch.length - 1].valeur : null;
function existe(nomTok, el) { regles(); return TOKENS.clair.has(nomTok) || TOKENS.sombre.has(nomTok) || !!win().getComputedStyle(el).getPropertyValue(nomTok).trim(); }
function hex(v) {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(v || '');
  if (!m) return v;
  if (m[4] !== undefined && m[4] !== '1') return v;
  return '#' + [m[1], m[2], m[3]].map(x => Number(x).toString(16).padStart(2, '0')).join('');
}
const UTILITAIRE = /^\.fr-(m|p)[trblxy]?-n?\d+[vw]?$|^\.fr-text--(xs|sm|lg|lead|bold|regular|heavy)$|^\.fr-h[1-6]$/;

/* ---------- Propriétés ---------- */
const transparent = v => !v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent';
const quatre = (cs, p) => ['top', 'right', 'bottom', 'left'].map(s => parseFloat(cs.getPropertyValue(`${p}-${s}${p === 'border' ? '-width' : ''}`)) || 0);
const ecrire4 = v => v.every(x => x === v[0]) ? px(v[0]) : v.map(x => Math.round(x * 10) / 10).join(' · ') + ' px';
function largeurMode(el, cs, axe) {
  const d = declaration(el, axe);
  if (d && !/^(auto|fit-content|max-content|min-content)$/.test(d.v)) return /%$/.test(d.v) && d.v === '100%' ? 'Remplit le parent' : 'Fixe';
  const pcs = el.parentElement ? win().getComputedStyle(el.parentElement) : null;
  const flexP = pcs && /flex/.test(pcs.display), ligne = flexP && !/column/.test(pcs.flexDirection);
  if (axe === 'width') {
    if (/^inline|table-cell/.test(cs.display) || /absolute|fixed/.test(cs.position) || cs.float !== 'none') return 'Adaptée au contenu';
    if (flexP) return ligne ? (parseFloat(cs.flexGrow) > 0 ? 'Remplit le parent' : 'Adaptée au contenu') : (/stretch|normal/.test(cs.alignSelf === 'auto' ? pcs.alignItems : cs.alignSelf) ? 'Remplit le parent' : 'Adaptée au contenu');
    return 'Remplit le parent';
  }
  if (flexP && ((ligne && /stretch|normal/.test(cs.alignSelf === 'auto' ? pcs.alignItems : cs.alignSelf)) || (!ligne && parseFloat(cs.flexGrow) > 0))) return 'Remplit le parent';
  return 'Adaptée au contenu';
}
/* Une ligne : libellé, valeur, et éventuellement token ou classe DSFR qui la porte. */
function ligne(groupe, label, valeur, opts = {}) { return { groupe, label, valeur: String(valeur), ...opts }; }
function avecToken(el, prop, valeur) {
  const d = declaration(el, prop);
  if (!d) return { valeur };
  const t = tokenDe(d.v);
  if (t) return { valeur, token: t, introuvable: !existe(t, el) };
  if (d.source === 'dsfr' && UTILITAIRE.test(d.selecteur)) return { valeur, classe: d.selecteur.slice(1) };
  return { valeur };
}
function proprietes(el) {
  const W = win(), cs = W.getComputedStyle(el), r = el.getBoundingClientRect();
  const out = [];
  const p = el.parentElement, pr = p ? p.getBoundingClientRect() : { left: 0, top: 0 };
  // Structure
  const lm = largeurMode(el, cs, 'width'), hm = largeurMode(el, cs, 'height');
  out.push(ligne('Structure', 'Largeur', lm === 'Fixe' ? px(r.width) : lm, { mention: lm === 'Fixe' ? 'Fixe' : `Mesurée : ${px(r.width)}` }));
  out.push(ligne('Structure', 'Hauteur', hm === 'Fixe' ? px(r.height) : hm, { mention: hm === 'Fixe' ? 'Fixe' : `Mesurée : ${px(r.height)}` }));
  out.push(ligne('Structure', 'Position', `X ${Math.round((r.left - pr.left) * 10) / 10} · Y ${Math.round((r.top - pr.top) * 10) / 10}`, { mention: p ? `Par rapport au parent : ${nom(p)}` : '' }));
  if (/flex|grid/.test(cs.display)) {
    const col = /grid/.test(cs.display) ? 'Grille' : /column/.test(cs.flexDirection) ? 'Pile verticale' : 'Ligne horizontale';
    out.push(ligne('Structure', 'Mise en page', col, { mention: `display: ${cs.display}${/flex/.test(cs.display) ? '; flex-direction: ' + cs.flexDirection : ''}` }));
    const g = parseFloat(cs.rowGap) || parseFloat(cs.columnGap) || 0;
    if (g) out.push(ligne('Structure', 'Espacement', cs.rowGap === cs.columnGap || /column/.test(cs.flexDirection) ? px(parseFloat(cs.rowGap) || g) : px(parseFloat(cs.columnGap) || g), { zone: 'gap' }));
  }
  const pad = quatre(cs, 'padding');
  if (pad.some(Boolean)) out.push(ligne('Structure', 'Padding', ecrire4(pad), { zone: 'padding', ...avecToken(el, 'padding-top', ecrire4(pad)) }));
  const mar = quatre(cs, 'margin');
  if (mar.some(Boolean)) out.push(ligne('Structure', 'Marge', ecrire4(mar), { zone: 'margin', ...avecToken(el, 'margin-bottom', ecrire4(mar)) }));
  // Apparence
  if (!transparent(cs.backgroundColor)) out.push(ligne('Apparence', 'Fond', hex(cs.backgroundColor), { couleur: cs.backgroundColor, ...avecToken(el, 'background-color', hex(cs.backgroundColor)) }));
  if (cs.backgroundImage !== 'none' && !/^url\(.data:image\/svg/.test(cs.backgroundImage)) out.push(ligne('Apparence', 'Image de fond', cs.backgroundImage.length > 80 ? cs.backgroundImage.slice(0, 80) + '…' : cs.backgroundImage, avecToken(el, 'background-image', '')));
  const rad = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map(c => parseFloat(cs.getPropertyValue(`border-${c}-radius`)) || 0);
  if (rad.some(Boolean)) out.push(ligne('Apparence', 'Rayon', ecrire4(rad)));
  if (parseFloat(cs.opacity) < 1) out.push(ligne('Apparence', 'Opacité', Math.round(parseFloat(cs.opacity) * 100) + ' %'));
  const bw = quatre(cs, 'border');
  if (bw.some(Boolean)) {
    out.push(ligne('Bordure', 'Épaisseur', ecrire4(bw)));
    out.push(ligne('Bordure', 'Style', cs.borderTopStyle));
    out.push(ligne('Bordure', 'Couleur', hex(cs.borderTopColor), { couleur: cs.borderTopColor, ...avecToken(el, 'border-top-color', hex(cs.borderTopColor)) }));
  }
  if (cs.boxShadow !== 'none') {
    const d = declaration(el, 'box-shadow'), auteur = d ? decouper(d.v) : [];
    decouper(cs.boxShadow).forEach((s, i) => {
      const t = tokenDe(auteur[i]);
      out.push(ligne('Effets', `Ombre ${i + 1}`, s, { mention: /inset/.test(s) ? 'Intérieure' : 'Portée', ...(t ? { token: t, introuvable: !existe(t, el) } : {}) }));
    });
  }
  if (cs.filter !== 'none') out.push(ligne('Effets', 'Filtre', cs.filter));
  // Texte
  const aTexte = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName);
  if (aTexte) {
    const typo = [...el.classList].find(c => /^fr-(text--(xs|sm|lg|lead)|h[1-6])$/.test(c));
    if (typo) out.push(ligne('Texte', 'Style DSFR', typo));
    out.push(ligne('Texte', 'Police', cs.fontFamily.split(',')[0].replace(/"/g, '')));
    out.push(ligne('Texte', 'Taille', `${px(parseFloat(cs.fontSize))} / ${cs.lineHeight === 'normal' ? 'normal' : px(parseFloat(cs.lineHeight))}`, avecToken(el, 'font-size', '')));
    out.push(ligne('Texte', 'Graisse', cs.fontWeight));
    out.push(ligne('Texte', 'Couleur', hex(cs.color), { couleur: cs.color, ...avecToken(el, 'color', hex(cs.color)) }));
    if (cs.textAlign !== 'start' && cs.textAlign !== 'left') out.push(ligne('Texte', 'Alignement', cs.textAlign));
  }
  return out;
}
const GROUPES = ['Structure', 'Apparence', 'Bordure', 'Effets', 'Texte'];
function fusion(listes) {
  if (listes.length === 1) return listes[0];
  const cles = [];
  listes.forEach(l => l.forEach(x => { const k = x.groupe + '|' + x.label; if (!cles.includes(k)) cles.push(k); }));
  return cles.map(k => {
    const xs = listes.map(l => l.find(x => x.groupe + '|' + x.label === k));
    const sig = x => x ? `${x.token || ''}|${x.valeur}` : '∅';
    const pareil = xs.every(x => sig(x) === sig(xs[0]));
    const [groupe, label] = k.split('|');
    return pareil ? { ...xs[0], mention: '', zone: null } : { groupe, label, valeur: 'Mixte', mixte: true };
  });
}
function boutonValeur(texte, copie, cls = '', avant = '') {
  return `<button type="button" class="outil-valeur fr-text--sm fr-mb-0 ${cls}" data-copie="${esc(copie)}" title="Copier ${esc(copie)}">${avant}<span>${esc(texte)}</span></button>`;
}
function rendreProprietes() {
  const els = selection.filter(x => x.isConnected);
  if (!els.length) { $('panneau-proprietes').innerHTML = '<p class="fr-text--sm fr-mb-0">Sélectionnez un élément pour voir ses propriétés</p>'; return; }
  const lignes = fusion(els.map(proprietes));
  let html = '';
  GROUPES.forEach(g => {
    const ls = lignes.filter(x => x.groupe === g);
    if (!ls.length) return;
    html += `<section class="outil-groupe fr-pt-2w fr-pb-1w"><h3 class="fr-text--sm fr-text--bold fr-mb-1w">${g}</h3>`;
    ls.forEach(x => {
      const pastille = x.couleur ? `<span class="outil-pastille" style="background-color:${esc(x.couleur)}"></span>` : '';
      let v = '';
      if (x.mixte) v = `<span class="fr-text--sm fr-mb-0 outil-mention">Mixte</span>`;
      else {
        if (x.token) v += boutonValeur(x.token, `var(${x.token})`, 'outil-valeur--token', pastille);
        if (x.classe) v += boutonValeur(x.classe, x.classe, 'outil-valeur--token');
        if (x.valeur) v += boutonValeur(x.valeur, x.valeur, x.token || x.classe ? 'outil-mention' : '', x.token ? '' : pastille);
        if (x.introuvable) v += '<p class="fr-text--xs fr-mb-0 outil-mention">Variable introuvable, valeur d\'origine affichée</p>';
        if (x.mention) v += `<p class="fr-text--xs fr-mb-0 outil-mention">${esc(x.mention)}</p>`;
      }
      html += `<div class="outil-prop fr-mb-1w"${x.zone ? ` data-zone="${x.zone}"` : ''}><p class="fr-text--sm fr-mb-0">${esc(x.label)}</p><div class="outil-prop__valeurs">${v}</div></div>`;
    });
    html += '</section>';
  });
  $('panneau-proprietes').innerHTML = html;
}
/* Mise en évidence des espacements dans le prototype */
function zones(el, type) {
  const cs = win().getComputedStyle(el), r = el.getBoundingClientRect();
  const R = (left, top, width, height) => ({ left, top, width, height });
  if (type === 'padding' || type === 'margin') {
    const b = quatre(cs, 'border'), v = quatre(cs, type);
    const o = type === 'padding' ? { l: r.left + b[3], t: r.top + b[0], w: r.width - b[1] - b[3], h: r.height - b[0] - b[2] }
      : { l: r.left - v[3], t: r.top - v[0], w: r.width + v[1] + v[3], h: r.height + v[0] + v[2] };
    return [R(o.l, o.t, o.w, v[0]), R(o.l, o.t + o.h - v[2], o.w, v[2]), R(o.l, o.t + v[0], v[3], o.h - v[0] - v[2]), R(o.l + o.w - v[1], o.t + v[0], v[1], o.h - v[0] - v[2])].filter(x => x.width > 0 && x.height > 0);
  }
  const enfants = [...el.children].filter(c => c.getClientRects().length).map(c => c.getBoundingClientRect());
  const col = /column/.test(cs.flexDirection);
  const res = [];
  for (let i = 1; i < enfants.length; i++) {
    const a = enfants[i - 1], b = enfants[i];
    if (col && b.top > a.bottom) res.push(R(r.left, a.bottom, r.width, b.top - a.bottom));
    else if (!col && b.left > a.right) res.push(R(a.right, Math.min(a.top, b.top), b.left - a.right, Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top)));
  }
  return res;
}
const panneauProps = $('panneau-proprietes');
const montrerZone = e => { const z = e.target.closest('[data-zone]'); const nz = z && selection.length === 1 ? zones(selection[0], z.dataset.zone) : null; if (nz !== zone) { zone = nz; dessiner(); } };
panneauProps.addEventListener('mouseover', montrerZone); panneauProps.addEventListener('focusin', montrerZone);
panneauProps.addEventListener('mouseleave', () => { zone = null; dessiner(); });

/* Copie d'une valeur ou du code */
function copier(texte, bouton) {
  const fin = () => {
    annoncer('Copié');
    const span = bouton.querySelector('span:last-child') || bouton, avant = span.textContent;
    if (bouton.dataset.copieEnCours) return;
    bouton.dataset.copieEnCours = '1'; span.textContent = 'Copié';
    setTimeout(() => { span.textContent = avant; delete bouton.dataset.copieEnCours; }, 1200);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(fin, () => { secours(texte); fin(); });
  else { secours(texte); fin(); }
}
function secours(texte) { const t = document.createElement('textarea'); t.value = texte; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) { /* rien */ } t.remove(); }
inspecteur.addEventListener('click', e => { const b = e.target.closest('[data-copie]'); if (b) copier(b.dataset.copie, b); });

/* ---------- Tokens ---------- */
const PROPS_TOKENS = [['background-color', 'Fond'], ['color', 'Texte'], ['border-top-color', 'Bordure'], ['box-shadow', 'Ombre'], ['background-image', 'Image de fond'], ['outline-color', 'Contour']];
function rendreTokens() {
  const el = selection.find(x => x.isConnected);
  if (!el) { $('panneau-tokens').innerHTML = '<p class="fr-text--sm fr-mb-0">Sélectionnez un élément pour voir ses tokens</p>'; return; }
  const cs = win().getComputedStyle(el);
  let html = `<p class="fr-text--xs fr-mb-2w outil-mention">Thème affiché : clair. ${selection.length > 1 ? 'Premier élément de la sélection.' : ''}</p>`;
  let k = 0;
  PROPS_TOKENS.forEach(([prop, label]) => {
    const calc = cs.getPropertyValue(prop);
    if (prop === 'background-image' ? calc === 'none' : prop === 'box-shadow' ? calc === 'none' : prop === 'border-top-color' ? !parseFloat(cs.borderTopWidth) : prop === 'outline-color' ? cs.outlineStyle === 'none' : transparent(calc)) return;
    const d = declaration(el, prop);
    const toks = d ? [...d.v.matchAll(/var\((--[\w-]+)/g)].map(m => m[1]) : [];
    html += `<section class="outil-groupe fr-pt-2w fr-pb-1w"><h3 class="fr-text--sm fr-text--bold fr-mb-1w">${label}</h3>`;
    if (!toks.length) {
      html += boutonValeur(hex(calc), hex(calc), '', prop.includes('color') ? `<span class="outil-pastille" style="background-color:${esc(calc)}"></span>` : '');
      html += '<p class="fr-text--xs fr-mb-0 outil-mention">Valeur fixe, aucune variable liée</p>';
    }
    toks.forEach(t => {
      if (!existe(t, el)) {
        html += boutonValeur(hex(calc), hex(calc)) + `<p class="fr-text--xs fr-mb-0 outil-mention">Variable introuvable, valeur d'origine affichée (${esc(t)})</p>`;
        return;
      }
      const cl = chaine(t, 'clair'), so = chaine(t, 'sombre'), fc = finale(cl) || '', fs = finale(so) || '';
      const id = `chaine-${k++}`;
      html += `<div class="fr-mb-1w">${boutonValeur(t, `var(${t})`, 'outil-valeur--token', fc && !/var\(/.test(fc) ? `<span class="outil-pastille" style="background-color:${esc(fc)}"></span>` : '')}`
        + `<div class="outil-prop"><p class="fr-text--xs fr-mb-0 outil-mention">Clair</p><div class="outil-prop__valeurs">${boutonValeur(fc, fc)}</div></div>`
        + `<div class="outil-prop"><p class="fr-text--xs fr-mb-0 outil-mention">Sombre</p><div class="outil-prop__valeurs">${boutonValeur(fs, fs)}</div></div>`;
      if (cl.length > 1 || so.length > 1) {
        const ligneCh = ch => ch.map(x => esc(x.nom)).join(' → ') + (finale(ch) ? ' → ' + esc(finale(ch)) : '');
        html += `<button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-arrow-down-s-line" aria-expanded="false" aria-controls="${id}" data-chaine>Afficher la chaîne d'alias</button>`
          + `<div id="${id}" hidden><p class="outil-chaine fr-text--xs fr-mb-1v">Clair : ${ligneCh(cl)}</p><p class="outil-chaine fr-text--xs fr-mb-0">Sombre : ${ligneCh(so)}</p></div>`;
      }
      html += '</div>';
    });
    html += '</section>';
  });
  if (!k && !/<section/.test(html)) html += '<p class="fr-text--sm fr-mb-0">Aucune couleur ni ombre sur cet élément.</p>';
  $('panneau-tokens').innerHTML = html;
}
$('panneau-tokens').addEventListener('click', e => {
  const b = e.target.closest('[data-chaine]'); if (!b) return;
  const on = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', String(on)); $(b.getAttribute('aria-controls')).hidden = !on;
  b.textContent = on ? 'Masquer la chaîne d\'alias' : 'Afficher la chaîne d\'alias';
  b.classList.toggle('fr-icon-arrow-down-s-line', !on); b.classList.toggle('fr-icon-arrow-up-s-line', on);
});

/* ---------- Code : React (JSX) et CSS propre à Mobilic ---------- */
let langage = local.lire('langage', 'react');
if (!['react', 'css'].includes(langage)) langage = 'react';
const ATTRS = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', inputmode: 'inputMode', autocomplete: 'autoComplete', colspan: 'colSpan', rowspan: 'rowSpan', srcset: 'srcSet', viewbox: 'viewBox', 'stroke-width': 'strokeWidth', 'stroke-linejoin': 'strokeLinejoin' };
const VIDES = ['input', 'img', 'br', 'hr', 'meta', 'link', 'source'];
const BOOLEENS = ['disabled', 'required', 'hidden', 'checked', 'selected', 'readonly', 'multiple'];
function jsx(el, niveau, nonSupporte) {
  const ind = '  '.repeat(niveau), tag = el.tagName.toLowerCase();
  const attrs = [];
  for (const a of el.attributes) {
    if (/^on/.test(a.name)) { nonSupporte.add(`${a.name} (gestionnaire en ligne, à remplacer par une prop ${a.name.replace(/^on(.)/, (m, c) => 'on' + c.toUpperCase())})`); continue; }
    const n = ATTRS[a.name] || a.name;
    if (a.name === 'style') {
      const o = [...el.style].map(p => `${p.replace(/-([a-z])/g, (m, c) => c.toUpperCase())}: '${el.style.getPropertyValue(p).replace(/'/g, "\\'")}'`).join(', ');
      attrs.push(`style={{ ${o} }}`);
    } else if (BOOLEENS.includes(a.name) && (a.value === '' || a.value === a.name)) attrs.push(a.name === 'readonly' ? 'readOnly' : a.name === 'checked' ? 'defaultChecked' : a.name === 'selected' ? 'selected' : n);
    else attrs.push(`${n}="${(a.value.length > 60 && /^data:/.test(a.value) ? a.value.slice(0, 40) + '…' : a.value).replace(/"/g, '&quot;')}"`);
  }
  const ouvre = `${ind}<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  const enfants = [...el.childNodes].filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
  if (VIDES.includes(tag) || !enfants.length) return ouvre + ' />';
  if (enfants.length === 1 && enfants[0].nodeType === 3) return `${ouvre}>${texteJsx(enfants[0].textContent)}</${tag}>`;
  if (niveau >= 4) return `${ouvre}>{/* … */}</${tag}>`;
  const lignes = enfants.slice(0, 12).map(n => n.nodeType === 3 ? ind + '  ' + texteJsx(n.textContent) : jsx(n, niveau + 1, nonSupporte));
  if (enfants.length > 12) lignes.push(`${ind}  {/* … ${enfants.length - 12} autres éléments */}`);
  return `${ouvre}>\n${lignes.join('\n')}\n${ind}</${tag}>`;
}
const texteJsx = t => t.trim().replace(/\s+/g, ' ').replace(/[{}<>]/g, c => `{'${c}'}`);
const DEFAUTS = { opacity: ['1'], transform: ['none', 'rotate(0)', 'rotate(0deg)'], rotate: ['0', '0deg', 'none'] };
function cssPropre(el) {
  const rs = correspondances(el, true).filter(x => x.src === 'mobilic');
  const blocs = rs.map(({ r, media }) => {
    const decl = [...r.style].length ? r.style.cssText.split(/;\s*/).filter(Boolean) : [];
    const garde = decl.filter(d => { const [p, ...v] = d.split(':'); return !(DEFAUTS[p.trim()] || []).includes(v.join(':').trim()); });
    if (!garde.length) return '';
    const corps = `${decouper(r.selectorText).join(',\n')} {\n${garde.map(d => '  ' + d.trim() + ';').join('\n')}\n}`;
    return media ? `@media ${media} {\n${corps.replace(/^/gm, '  ')}\n}` : corps;
  }).filter(Boolean);
  const inl = el.getAttribute('style');
  if (inl) blocs.push(`/* Style en ligne */\n${el.tagName.toLowerCase()} {\n${inl.split(/;\s*/).filter(Boolean).filter(d => { const [p, ...v] = d.split(':'); return !(DEFAUTS[p.trim()] || []).includes(v.join(':').trim()); }).map(d => '  ' + d.trim() + ';').join('\n')}\n}`);
  if (!blocs.length) return `/* Aucun style propre à Mobilic : l'élément utilise uniquement les classes DSFR. */\n/* Classes : ${[...el.classList].join(' ') || 'aucune'} */`;
  return blocs.join('\n\n');
}
function code(el) {
  if (langage === 'css') return cssPropre(el);
  const ns = new Set(), corps = jsx(el, 0, ns), id = identite(el);
  const tete = [];
  if (id.react) tete.push(`// Composant react-dsfr équivalent : <${id.react} />`);
  ns.forEach(x => tete.push(`// Non supporté en React : ${x}`));
  return (tete.length ? tete.join('\n') + '\n' : '') + corps;
}
function rendreCode() {
  const els = selection.filter(x => x.isConnected);
  if (!els.length) { $('panneau-code').innerHTML = '<p class="fr-text--sm fr-mb-0">Sélectionnez un élément pour voir son code</p>'; return; }
  const texte = els.map(code).join('\n\n');
  $('panneau-code').innerHTML = `<div class="outil-actions fr-mb-2w">
    <fieldset class="fr-segmented fr-segmented--sm fr-segmented--no-legend"><legend class="fr-segmented__legend">Langage</legend><div class="fr-segmented__elements">
      <div class="fr-segmented__element"><input value="react" type="radio" id="lang-react" name="langage"${langage === 'react' ? ' checked' : ''}><label class="fr-label" for="lang-react">React</label></div>
      <div class="fr-segmented__element"><input value="css" type="radio" id="lang-css" name="langage"${langage === 'css' ? ' checked' : ''}><label class="fr-label" for="lang-css">CSS</label></div>
    </div></fieldset>
    <button type="button" class="fr-btn fr-btn--secondary fr-btn--sm" data-copie="${esc(texte)}"><span>Copier</span></button></div>
    <pre class="outil-code fr-text--xs fr-mb-0"><code>${esc(texte)}</code></pre>`;
}
$('panneau-code').addEventListener('change', e => { if (e.target.name === 'langage') { langage = e.target.value; local.ecrire('langage', langage); rendreCode(); $('lang-' + langage).focus(); } });

/* ---------- Assets ---------- */
let assetFormat = 'png', assetEchelle = 1;
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'asset';
function visibleEl(el) {
  const cs = win().getComputedStyle(el), r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
}
function assets(el) {
  const res = [];
  [el, ...el.querySelectorAll('*')].forEach(n => {
    if (!visibleEl(n)) return;
    const tag = n.tagName.toLowerCase(), r = n.getBoundingClientRect();
    if (tag === 'img' && n.currentSrc) res.push({ nom: slug(n.alt || 'image'), raster: n.currentSrc, w: r.width, h: r.height, fond: fondDe(n) });
    else if (tag === 'svg') res.push({ nom: slug(n.getAttribute('aria-label') || nom(n.parentElement) || 'svg'), svg: n.outerHTML, w: r.width, h: r.height, fond: fondDe(n), couleur: win().getComputedStyle(n).color });
    const icone = [...n.classList].find(c => c.startsWith('fr-icon-'));
    if (icone) {
      for (const pseudo of ['::before', '::after']) {
        const ps = win().getComputedStyle(n, pseudo), m = (ps.maskImage && ps.maskImage !== 'none' ? ps.maskImage : ps.webkitMaskImage) || '';
        const b64 = /url\("?data:image\/svg\+xml;base64,([^")]+)/.exec(m);
        if (!b64 || ps.display === 'none') continue;
        const w = parseFloat(ps.width) || 24, h = parseFloat(ps.height) || 24;
        res.push({ nom: icone, svg: atob(b64[1]), w, h, couleur: ps.backgroundColor, fond: fondDe(n) });
        break;
      }
    }
  });
  return res;
}
function fondDe(n) { for (let x = n; x; x = x.parentElement) { const b = win().getComputedStyle(x).backgroundColor; if (!transparent(b)) return b; } return win().getComputedStyle(doc().body).backgroundColor; }
function svgTexte(a) {
  if (a.raster) return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${a.w}" height="${a.h}" viewBox="0 0 ${a.w} ${a.h}"><image width="${a.w}" height="${a.h}" href="${a.raster}" xlink:href="${a.raster}"/></svg>`;
  const d = new DOMParser().parseFromString(a.svg, 'image/svg+xml').documentElement;
  d.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); d.setAttribute('width', a.w); d.setAttribute('height', a.h);
  if (!d.getAttribute('viewBox')) d.setAttribute('viewBox', `0 0 ${a.w} ${a.h}`);
  if (a.couleur && !transparent(a.couleur)) { d.setAttribute('fill', hex(a.couleur)); d.setAttribute('color', hex(a.couleur)); }
  return new XMLSerializer().serializeToString(d);
}
async function rendre(a, fmt, k) {
  const svg = svgTexte(a);
  if (fmt === 'svg') return new Blob([svg], { type: 'image/svg+xml' });
  const img = new Image();
  img.src = a.raster || 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(a.w * k)); c.height = Math.max(1, Math.round(a.h * k));
  const g = c.getContext('2d');
  if (fmt === 'jpg') { g.fillStyle = a.fond; g.fillRect(0, 0, c.width, c.height); }
  g.drawImage(img, 0, 0, c.width, c.height);
  return new Promise(ok => c.toBlob(ok, fmt === 'jpg' ? 'image/jpeg' : 'image/png', 0.92));
}
function nomsFichiers(liste) {
  const vus = {};
  return liste.map(a => {
    let base = slug(a.nom);
    vus[base] = (vus[base] || 0) + 1;
    if (vus[base] > 1) base += '-' + vus[base];
    return base + (assetFormat !== 'svg' && assetEchelle > 1 ? `@${assetEchelle}x` : '') + '.' + assetFormat;
  });
}
let assetsCourants = [];
function rendreAssets() {
  const el = selection.filter(x => x.isConnected);
  const p = $('panneau-assets');
  if (!el.length) { p.innerHTML = '<p class="fr-text--sm fr-mb-0">Sélectionnez un élément pour exporter ses images et icônes</p>'; return; }
  if (el.every(x => !visibleEl(x) || !x.getClientRects().length)) { p.innerHTML = '<p class="fr-text--sm fr-mb-0">Rien à exporter : cet élément est vide ou masqué</p>'; assetsCourants = []; return; }
  assetsCourants = el.flatMap(assets);
  if (!assetsCourants.length) { p.innerHTML = '<p class="fr-text--sm fr-mb-0">Aucune image ni icône dans cet élément.</p>'; return; }
  const seg = (name, label, vals, cur) => `<fieldset class="fr-segmented fr-segmented--sm fr-mb-2w"><legend class="fr-segmented__legend fr-text--sm">${label}</legend><div class="fr-segmented__elements">`
    + vals.map(([v, l]) => `<div class="fr-segmented__element"><input value="${v}" type="radio" id="${name}-${v}" name="${name}"${String(cur) === String(v) ? ' checked' : ''}><label class="fr-label" for="${name}-${v}">${l}</label></div>`).join('') + '</div></fieldset>';
  const noms = nomsFichiers(assetsCourants);
  p.innerHTML = seg('asset-format', 'Format', [['png', 'PNG'], ['jpg', 'JPG'], ['svg', 'SVG']], assetFormat)
    + (assetFormat === 'svg' ? '<p class="fr-text--xs fr-mb-2w outil-mention">SVG : format vectoriel, sans échelle.</p>' : seg('asset-echelle', 'Échelle', [[1, '1x'], [2, '2x'], [3, '3x'], [4, '4x']], assetEchelle))
    + '<p class="fr-text--sm fr-text--bold fr-mb-1w">Aperçu</p><div class="outil-apercu fr-mb-2w" id="asset-apercu"></div>'
    + `<fieldset class="fr-fieldset fr-mb-0"><legend class="fr-fieldset__legend fr-fieldset__legend--regular fr-text--sm">Assets à exporter</legend>`
    + assetsCourants.map((a, i) => `<div class="fr-fieldset__element"><div class="fr-checkbox-group fr-checkbox-group--sm"><input type="checkbox" id="asset-${i}" checked data-asset="${i}"><label class="fr-label" for="asset-${i}"><span class="outil-asset"><span class="outil-asset__vignette" id="asset-vignette-${i}"></span><span class="outil-asset__nom">${esc(noms[i])}</span></span></label></div></div>`).join('')
    + '</fieldset><button type="button" class="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-download-line" id="asset-exporter">Télécharger</button>';
  apercus();
}
async function apercus() {
  const fmt = assetFormat, k = assetEchelle, liste0 = assetsCourants;
  for (let i = 0; i < liste0.length; i++) {
    let blob; try { blob = await rendre(liste0[i], fmt, k); } catch (e) { continue; }
    if (liste0 !== assetsCourants || fmt !== assetFormat || k !== assetEchelle) return;
    const url = URL.createObjectURL(blob);
    const v = $('asset-vignette-' + i); if (v) v.innerHTML = `<img src="${url}" alt="">`;
    if (i === 0) $('asset-apercu').innerHTML = `<img src="${url}" alt="Aperçu de ${esc(nomsFichiers(liste0)[0])}">`;
  }
}
$('panneau-assets').addEventListener('change', e => {
  if (e.target.name === 'asset-format') { assetFormat = e.target.value; rendreAssets(); $('asset-format-' + assetFormat).focus(); }
  if (e.target.name === 'asset-echelle') { assetEchelle = Number(e.target.value); rendreAssets(); $('asset-echelle-' + assetEchelle).focus(); }
});
$('panneau-assets').addEventListener('click', async e => {
  if (e.target.id !== 'asset-exporter') return;
  const noms = nomsFichiers(assetsCourants);
  const choisis = [...$('panneau-assets').querySelectorAll('[data-asset]:checked')].map(c => Number(c.dataset.asset));
  if (!choisis.length) { annoncer('Aucun asset coché'); return; }
  const fichiers = [];
  for (const i of choisis) fichiers.push({ nom: noms[i], blob: await rendre(assetsCourants[i], assetFormat, assetEchelle) });
  if (fichiers.length === 1) telecharger(fichiers[0].blob, fichiers[0].nom);
  else telecharger(await zip(fichiers), slug(nom(selection[0])) + '.zip');
  annoncer(`${fichiers.length > 1 ? fichiers.length + ' assets téléchargés dans une archive' : 'Asset téléchargé'}`);
});
function telecharger(blob, nomFichier) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nomFichier;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
/* Archive ZIP sans compression (aucune dépendance) */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = d => { let c = 0xFFFFFFFF; for (const b of d) c = CRC[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
async function zip(fichiers) {
  const enc = new TextEncoder(), parts = [], central = [];
  let offset = 0;
  const entete = (taille, champs) => { const b = new DataView(new ArrayBuffer(taille)); champs.forEach(([o, v, n]) => n === 4 ? b.setUint32(o, v, true) : b.setUint16(o, v, true)); return new Uint8Array(b.buffer); };
  for (const f of fichiers) {
    const nomB = enc.encode(f.nom), data = new Uint8Array(await f.blob.arrayBuffer()), crc = crc32(data);
    const loc = entete(30, [[0, 0x04034b50, 4], [4, 20], [6, 0x0800], [8, 0], [10, 0], [12, 0x21], [14, crc, 4], [18, data.length, 4], [22, data.length, 4], [26, nomB.length], [28, 0]]);
    central.push(entete(46, [[0, 0x02014b50, 4], [4, 20], [6, 20], [8, 0x0800], [10, 0], [12, 0], [14, 0x21], [16, crc, 4], [20, data.length, 4], [24, data.length, 4], [28, nomB.length], [30, 0], [32, 0], [34, 0], [36, 0], [38, 0, 4], [42, offset, 4]]), nomB);
    parts.push(loc, nomB, data);
    offset += loc.length + nomB.length + data.length;
  }
  const tailleCentrale = central.reduce((s, x) => s + x.length, 0);
  const fin = entete(22, [[0, 0x06054b50, 4], [4, 0], [6, 0], [8, fichiers.length], [10, fichiers.length], [12, tailleCentrale, 4], [16, offset, 4], [20, 0]]);
  return new Blob([...parts, ...central, fin], { type: 'application/zip' });
}

/* ---------- Panneau inspecteur : ouverture, onglets ---------- */
const onglets = [...inspecteur.querySelectorAll('[role="tab"]')];
let onglet = 'proprietes';
function rafraichir() {
  const els = selection.filter(x => x.isConnected);
  if (!els.length) return;
  $('insp-nom').textContent = els.length > 1 ? `${els.length} éléments` : nom(els[0]);
  $('insp-type').textContent = els.length > 1 ? 'Sélection multiple' : identite(els[0]).type;
  ({ proprietes: rendreProprietes, code: rendreCode, tokens: rendreTokens, assets: rendreAssets })[onglet]();
}
function ouvrirInspecteur() {
  inspecteur.hidden = false; outil.classList.add('outil--inspecteur');
  rafraichir();
}
function choisirOnglet(o, focus) {
  onglet = o.id.replace('onglet-', '');
  onglets.forEach(x => { const on = x === o; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
  if (focus) o.focus();
  rafraichir();
}
onglets.forEach((o, i) => {
  o.addEventListener('click', () => choisirOnglet(o));
  o.addEventListener('keydown', e => {
    const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: onglets.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault(); choisirOnglet(onglets[(j + onglets.length) % onglets.length], true);
  });
});

/* ---------- Démarrage ---------- */
libelleParcours();
appliquerFormat();
activer(0);
})();
