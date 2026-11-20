/* ---------- Relevé des infractions (LIC papier / feuille de route) ----------
   Composant "Mobile / Accordéon d'infraction" : types 'lic' (seuil journalier ou hebdomadaire) et 'autre'.
   Une seule collection de NATINF par contrôle (state.infractions), partagée par l'onglet Infractions et l'étape 3 du BDC.
   Contextes de rendu : 't' = onglet Infractions (édition), 's' = onglet Infractions (synthèse), 'r' = étape 3 (lecture), 'e' = étape 3 (édition). */
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
const dayLabel = (s, year) => fromIso(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', ...(year ? { year: 'numeric' } : {}) });
const ddmm = d => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
const DESC = 'description';

function weeksBefore(d) {
  const monday = addDays(d, -((d.getDay() + 6) % 7));
  return [4, 3, 2, 1].map(k => { const s = addDays(monday, -7 * k); return `Semaine du ${ddmm(s)} au ${ddmm(addDays(s, 6))}`; });
}
/* Texte de la règle selon le secteur (section Figma "Texte NATINFs"). Sans texte : "description". */
function ruleFor(rules, act) {
  if (!rules) return DESC;
  if (act.startsWith('TRS')) return rules.TRS || DESC;
  if (act.startsWith('Déménagement')) return rules.DEM || DESC;
  if (act.startsWith('TRV')) return rules.TRV || DESC;
  if (act.includes('Courte')) return rules.TRMC || rules.TRM || DESC;
  if (act.includes('Longue')) return rules.TRML || rules.TRM || DESC;
  if (act.includes('Messagerie')) return rules.TRMM || rules.TRM || DESC;
  return rules.TRM || DESC;
}
function catalog(act, d, pageNonRemplie) {
  const weeks = weeksBefore(d), month = new Date(d.getFullYear(), d.getMonth(), 1);
  const items = [
    { natinf: '23103', label: 'Tenue non conforme du livret individuel de contrôle', seuil: 'jour' },
    { natinf: '11292', label: 'Dépassement(s) de la durée maximale du travail quotidien', seuil: 'jour',
      rules: { TRM: 'La durée du travail quotidien est limitée à 12h (article R. 3312-a51 du Code des transports).', TRV: 'La durée du travail quotidien est limitée à 10h (article D. 3312-6 du Code des transports). Attention, les dérogations ne sont pas intégrées dans Mobilic.' } },
    { natinf: '11298', label: 'Dépassement(s) de la durée maximale du travail hebdomadaire sur une semaine civile isolée', seuil: 'semaine',
      rules: { TRMC: 'La durée de travail hebdomadaire sur une semaine isolée est limitée à 52 heures (article R.3312-50 du Code des transports).', TRML: 'La durée de travail hebdomadaire sur une semaine isolée est limitée à 56 heures (article R.3312-50 du Code des transports).', TRMM: 'La durée de travail hebdomadaire sur une semaine isolée est limitée à 48 heures (article R.3312-50 du Code des transports)', TRV: 'La durée de travail hebdomadaire sur une semaine isolée est limitée à 48 heures (article L.3121-20 du Code du travail). Attention, les dérogations ne sont pas intégrées dans Mobilic.' } },
    { natinf: '13152', label: 'Non-respect(s) du repos hebdomadaire', seuil: 'semaine',
      rules: { TRM: 'Il est interdit de travailler plus de six jours dans la semaine (article L. 3132-1 du Code du travail). Le repos hebdomadaire doit durer au minimum 34h (article L. 3132-2 du Code du travail).', TRV: 'Il est interdit de travailler plus de six jours dans la semaine (article L. 3132-1 du Code du travail). Le repos hebdomadaire doit durer au minimum 34h (article L. 3132-2 du Code du travail).' } },
    { natinf: '20525', label: 'Non-respect(s) du repos quotidien', seuil: 'jour' },
    { natinf: '32083', label: 'Dépassement(s) de la durée maximale de travail de nuit', seuil: 'jour',
      rules: { TRM: "La durée du travail quotidien est limitée à 12h (article R. 3312-a51 du Code des transports). Si une partie du travail de la journée s'effectue entre minuit et 5 heures, la durée maximale du travail est réduite à 10 heures (L. 3312-1 du Code des transports).", TRV: 'La durée du travail quotidien est limitée à 10h (article D. 3312-6 du Code des transports). Attention, les dérogations ne sont pas intégrées dans Mobilic. La durée du travail quotidien compris entre minuit et 5 heures est limitée à 10h (L. 3312-1 du Code des transports).' } },
    { natinf: '35187', label: 'Non-respect(s) du temps de pause et/ou dépassement(s) de la durée maximale du travail ininterrompu', seuil: 'jour' }
  ];
  return items.map((it, k) => ({ id: 'n' + k, type: 'lic', ...it, rule: ruleFor(it.rules, act), sel: it.natinf === '23103' && pageNonRemplie ? [iso(d)] : [],
    ...(it.seuil === 'semaine' ? { weeks } : { month: new Date(month) }) }));
}
const selected = list => list.filter(i => i.sel.length);
const clone = list => list.map(i => ({ ...i, sel: [...i.sel], weeks: i.weeks && [...i.weeks], month: i.month && new Date(i.month) }));
const code = i => `NATINF ${i.natinf}`;
const sameSel = (a, b) => JSON.stringify(a.map(i => [i.id, [...i.sel].sort()])) === JSON.stringify(b.map(i => [i.id, [...i.sel].sort()]));

/* Rendu */
function calendarHTML(inf, ctx) {
  const m = inf.month, y = m.getFullYear(), mo = m.getMonth();
  const start = addDays(m, -((m.getDay() + 6) % 7));
  const today = iso(state.control.date), max = state.control.date;
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i), k = iso(d);
    if (i >= 35 && i % 7 === 0 && d.getMonth() !== mo) break;
    const out = d.getMonth() !== mo, future = d > max, on = inf.sel.includes(k);
    cells += `<button type="button" class="fr-text--xs fr-mb-0 cal__day${out ? ' cal__day--out' : ''}${on ? ' cal__day--on' : ''}${k === today ? ' cal__day--today' : ''}" ${future || out ? 'disabled' : ''} aria-pressed="${on}" aria-label="${dayLabel(k, true)}" onclick="infToggle('${ctx}','${inf.id}','${k}')">${d.getDate()}</button>`;
  }
  const years = [y - 1, y, y + 1].filter(v => v <= max.getFullYear());
  return `<div class="cal">
    <div class="cal__head fr-mb-1w">
      <button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-arrow-left-line" title="Mois précédent" onclick="infMonth('${ctx}','${inf.id}',-1)">Mois précédent</button>
      <span class="cal__selects">
        <span class="cal__selwrap"><select class="cal__sel fr-text--sm fr-mb-0" aria-label="Mois" onchange="infSetMonth('${ctx}','${inf.id}',this.value,null)">${MOIS.map((n, i) => `<option value="${i}" ${i === mo ? 'selected' : ''}>${n}</option>`).join('')}</select><span class="fr-icon-arrow-down-s-line" aria-hidden="true"></span></span>
        <span class="cal__selwrap"><select class="cal__sel fr-text--sm fr-mb-0" aria-label="Année" onchange="infSetMonth('${ctx}','${inf.id}',null,this.value)">${years.map(v => `<option ${v === y ? 'selected' : ''}>${v}</option>`).join('')}</select><span class="fr-icon-arrow-down-s-line" aria-hidden="true"></span></span>
      </span>
      <button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-arrow-right-line" title="Mois suivant" onclick="infMonth('${ctx}','${inf.id}',1)">Mois suivant</button>
    </div>
    <div class="cal__grid">${['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(j => `<span class="cal__wd fr-text--sm fr-mb-0">${j}</span>`).join('')}${cells}</div>
  </div>`;
}
function tagsHTML(inf, edit, ctx) {
  if (!inf.sel.length) return '';
  const items = [...inf.sel].sort().map(v => {
    const label = inf.seuil === 'semaine' ? v : dayLabel(v, inf.type === 'autre');
    return edit
      ? `<li><button type="button" class="fr-tag fr-tag--sm fr-tag--dismiss" aria-label="Retirer ${label}" onclick="infToggle('${ctx}','${inf.id}','${v}')">${label}</button></li>`
      : `<li><p class="fr-tag fr-tag--sm">${label}</p></li>`;
  }).join('');
  return `<ul class="fr-tags-group fr-mt-2w">${items}</ul>`;
}
function infractionHTML(inf, edit, ctx) {
  const n = inf.sel.length, open = !!inf.open, uid = `${ctx}-${inf.id}`;
  const content = `${inf.rule ? `<p class="inf__rule fr-text--sm fr-mb-0 mention">${inf.rule}</p>` : ''}
      ${!edit ? tagsHTML(inf, false, ctx)
        : inf.seuil === 'semaine'
          ? `<fieldset class="fr-fieldset inf__weeks fr-mt-3w fr-mb-0"><legend class="fr-fieldset__legend fr-fieldset__legend--regular">Sélectionnez la ou les semaines concernées :</legend>
              ${inf.weeks.map((w, i) => `<div class="fr-fieldset__element${i === inf.weeks.length - 1 ? ' fr-mb-0' : ''}"><div class="fr-checkbox-group fr-checkbox-group--sm"><input type="checkbox" id="${uid}-w${i}" ${inf.sel.includes(w) ? 'checked' : ''} onchange="infToggle('${ctx}','${inf.id}','${w}')"><label class="fr-label" for="${uid}-w${i}">${w}</label></div></div>`).join('')}
            </fieldset>`
          : `<p class="fr-mt-3w fr-mb-2w">Sélectionnez la ou les journées concernées :</p>${calendarHTML(inf, ctx)}${tagsHTML(inf, true, ctx)}`}`;
  return `<section class="fr-mb-3v inf${n ? ' inf--selected' : ''}${open ? ' inf--open' : ''}" id="inf-${uid}">
    <h3 class="inf__title">
      <button type="button" class="inf__btn${edit && inf.type === 'autre' ? ' inf__btn--delete' : ''}" aria-expanded="${open}" aria-controls="inf-body-${uid}" onclick="infOpen('${ctx}','${inf.id}',this)">
        <span class="inf__natinf fr-text--sm fr-text--bold fr-mb-0">${code(inf)}${n ? `<span class="fr-badge fr-badge--sm fr-badge--error fr-badge--no-icon">${n}<span class="fr-sr-only"> ${inf.seuil === 'semaine' ? 'semaine(s)' : 'journée(s)'} retenue(s)</span></span>` : ''}</span>
        <span class="inf__label${inf.type === 'autre' ? ' fr-text--sm fr-mb-0' : ''}">${inf.label}</span>
      </button>
    </h3>
    ${edit && inf.type === 'autre' ? `<button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-delete-line inf__delete" title="Supprimer l'infraction ${code(inf)}" onclick="infDelete('${ctx}','${inf.id}')">Supprimer</button>` : ''}
    <div class="inf__collapse" id="inf-body-${uid}"><div class="inf__inner"><div class="inf__body">${content}</div></div></div>
  </section>`;
}

/* Données par contexte */
const rel = { editing: true, saved: null, draft: null };   // onglet Infractions
let draft = null;                                            // étape 3 (édition)
const LIST = { t: () => rel.draft, s: () => state.infractions, r: () => state.infractions, e: () => draft };
const RENDER = { t: () => renderTab(), s: () => renderTab(), r: () => renderInfRead(), e: () => renderInfEdit() };
const findInf = (ctx, id) => LIST[ctx]().find(i => i.id === id);

function infOpen(ctx, id, btn) {   // un seul accordéon ouvert à la fois (comportement de groupe DSFR)
  const i = findInf(ctx, id), willOpen = !i.open;
  LIST[ctx]().forEach(x => x.open = false);
  i.open = willOpen;
  btn.closest('.inf').parentElement.querySelectorAll(':scope > .inf').forEach(el => {
    const on = el === btn.closest('.inf') && willOpen;
    el.classList.toggle('inf--open', on);
    el.querySelector('.inf__btn').setAttribute('aria-expanded', on);
  });
}
function infToggle(ctx, id, v) { const i = findInf(ctx, id); i.sel = i.sel.includes(v) ? i.sel.filter(x => x !== v) : [...i.sel, v]; RENDER[ctx](); }
function infMonth(ctx, id, delta) { const i = findInf(ctx, id); const m = new Date(i.month.getFullYear(), i.month.getMonth() + delta, 1); if (m <= state.control.date) i.month = m; RENDER[ctx](); }
function infSetMonth(ctx, id, mo, y) { const i = findInf(ctx, id); const m = new Date(y === null ? i.month.getFullYear() : +y, mo === null ? i.month.getMonth() : +mo, 1); if (m <= state.control.date) i.month = m; RENDER[ctx](); }
function infDelete(ctx, id) {
  if (ctx === 't') rel.draft = rel.draft.filter(i => i.id !== id); else draft = draft.filter(i => i.id !== id);
  RENDER[ctx](); toast('Infraction supprimée');
}

/* ----- Onglet Infractions du contrôle ----- */
function infCount() { return state.control ? selected(state.infractions).length : 0; }
function renderTabBadge() {
  const n = infCount(), b = $('tab-inf-badge');
  b.hidden = !n; b.firstChild.textContent = n;
  $('alert-count').textContent = n || 1;
}
function startReleve() { rel.draft = clone(state.infractions).map(i => ({ ...i, open: false })); rel.editing = true; renderTab(); }
function renderTab() {
  const el = $('tab-1');
  if (rel.editing) {
    el.innerHTML = `<div class="fr-container fr-pt-3w has-sticky">
        <p>Sélectionnez les infractions que vous souhaitez verbaliser à partir ${isTRS() ? 'de la feuille de route présentée' : 'du livret individuel de contrôle présenté'} :</p>
        <div id="tab-inf-list">${rel.draft.map(i => infractionHTML(i, true, 't')).join('')}</div>
        <button type="button" class="fr-btn fr-btn--tertiary fr-icon-add-line fr-btn--icon-left fr-mt-3v" onclick="openAddInf()">Ajouter une autre infraction</button>
      </div>
      <div class="sticky-actions">
        ${rel.saved ? `<button type="button" class="fr-btn fr-btn--secondary" onclick="cancelReleve()">Annuler</button>` : ''}
        <button type="button" class="fr-btn" onclick="saveReleve()">Enregistrer</button>
      </div>`;
  } else {
    el.innerHTML = `<div class="fr-container fr-pt-3w fr-pb-5w">
        <section>
          <div class="section-head fr-mb-3v"><h2 class="fr-h6 fr-mb-0">Infractions retenues</h2><button type="button" class="fr-btn fr-btn--secondary fr-btn--sm" onclick="startReleve()">Modifier</button></div>
          ${state.infractions.map(i => infractionHTML(i, false, 's')).join('')}
          <p class="fr-text--xs mention fr-mb-0">Dernière modification le ${fmt(rel.saved)}</p>
        </section>
        <section class="fr-mt-4w" id="bdc-section-inf"></section>
      </div>`;
    renderBdcInto($('bdc-section-inf'));
  }
  notify();
}
function saveReleve() {
  state.infractions = rel.draft.map(i => ({ ...i, open: false }));
  rel.saved = new Date(); rel.editing = false; rel.draft = null;
  renderTab(); renderTabBadge(); renderInfRead(); window.scrollTo(0, 0); toast('Relevé des infractions enregistré');
}
function confirmCancel() { cancelCtx === 'e' ? cancelInfractions(true) : cancelReleve(true); }
function cancelReleve(force) {
  if (!force && !sameSel(rel.draft, state.infractions)) { cancelCtx = 't'; return openModal('modal-cancel'); }
  closeModal('modal-cancel'); rel.editing = false; rel.draft = null; renderTab(); window.scrollTo(0, 0);
}

/* ----- Étape 3 du BDC ----- */
function renderInfRead() {
  const list = selected(state.infractions);
  $('b-natinfs').innerHTML = list.length ? list.map(i => infractionHTML(i, false, 'r')).join('') : '<p class="fr-text--sm mention fr-mb-0">Aucune infraction retenue.</p>';
}
function renderInfEdit() { $('inf-list').innerHTML = draft.map(i => infractionHTML(i, true, 'e')).join(''); }
function openInfractions() { draft = clone(state.infractions).map(i => ({ ...i, open: false })); renderInfEdit(); go('infractions'); }
let cancelCtx = 't';
function cancelInfractions(force) {
  if (!force && !sameSel(draft, state.infractions)) { cancelCtx = 'e'; return openModal('modal-cancel'); }
  closeModal('modal-cancel'); draft = null; bdcStep(3);
}
function saveInfractions() {
  state.infractions = draft.map(i => ({ ...i, open: false }));
  rel.saved = new Date(); rel.editing = false;
  renderInfRead(); renderTabBadge(); renderTab(); bdcStep(3); toast('Infractions retenues mises à jour');
}

/* ----- Autres infractions : parcours hors scope ----- */
function openAddInf() { toast("Ajout d'une autre infraction : hors scope"); }

/* ----- Remplissage automatique (panneau du prototype) ----- */
function fillInfractions(list) {
  const d = state.control.date;
  const pick = (natinf, vals) => { const i = list.find(x => x.natinf === natinf); if (i) i.sel = vals; };
  pick('23103', [iso(d)]);
  pick('35187', [iso(addDays(d, -2))]);
  pick('11292', [iso(addDays(d, -4)), iso(addDays(d, -1))]);
  const hebdo = list.find(x => x.natinf === '11298'); if (hebdo) hebdo.sel = [hebdo.weeks[2]];
}
function infDetail(i) { return i.seuil === 'semaine' ? i.sel.join(' ; ') : [...i.sel].sort().map(s => dayLabel(s, true)).join(' ; '); }
