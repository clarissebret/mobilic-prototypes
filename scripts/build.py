import re, base64, glob, os, sys, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DIST = os.path.join(ROOT, 'node_modules/@gouvfr/dsfr/dist/')
REMIX = os.path.join(ROOT, 'node_modules/remixicon/icons/')
DSFR_VERSION = json.load(open(os.path.join(ROOT, 'node_modules/@gouvfr/dsfr/package.json')))['version']
CDN = f'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@{DSFR_VERSION}/dist/'
PROTO = sys.argv[1] if len(sys.argv) > 1 else 'controleur'
B = os.path.join(ROOT, 'prototypes', PROTO) + '/'
LOGO = os.path.join(ROOT, 'assets/logo-mobilic.png')

def datauri(path):
    return 'data:image/svg+xml;base64,' + base64.b64encode(open(path, 'rb').read()).decode()

# 1. DSFR core CSS: icons inlined as data URIs, fonts pointed to the CDN
css = open(DIST + 'dsfr.min.css').read()
cache = {}
def rewrite(m):
    raw = m.group(1).strip('\'"')
    if raw.startswith('data:'):
        return m.group(0)
    if raw.startswith('fonts/'):
        return f'url(../{raw})'   # polices servies depuis dist/fonts (pas de CDN tiers)
    if raw.startswith('icons/') or raw.startswith('../../icons/'):
        rel = raw.split('icons/', 1)[1]
        p = DIST + 'icons/' + rel
        if os.path.exists(p):
            cache.setdefault(p, datauri(p))
            return f'url({cache[p]})'
    return f'url({CDN}{raw})'
css = re.sub(r'url\(([^)]*)\)', rewrite, css)

# 2. Icon utility classes actually used, drawn from Remix Icon
ICONS = {
    'qr-code-line': 'qr-code-line', 'edit-box-fill': 'edit-box-fill', 'notification-3-fill': 'notification-3-fill',
    'arrow-right-s-line': 'arrow-right-s-line', 'arrow-down-s-line': 'arrow-down-s-line', 'arrow-right-line': 'arrow-right-line',
    'arrow-left-line': 'arrow-left-line', 'search-line': 'search-line', 'information-fill': 'information-fill',
    'warning-line': 'alert-line', 'time-line': 'time-line', 'file-text-fill': 'file-text-fill', 'download-line': 'download-line',
    'send-plane-line': 'send-plane-line', 'printer-line': 'printer-line', 'close-line': 'close-line',
    'signal-wifi-fill': 'signal-wifi-fill', 'signal-cellular-3-fill': 'signal-cellular-3-fill', 'battery-fill': 'battery-fill',
    'edit-line': 'edit-line', 'refresh-line': 'refresh-line',
    'arrow-up-s-line': 'arrow-up-s-line', 'delete-line': 'delete-bin-line', 'add-line': 'add-line', 'play-line': 'play-line',
}
rules = []
for cls, remix in ICONS.items():
    d = datauri(glob.glob(f'{REMIX}*/{remix}.svg')[0])
    rules.append(f'.fr-icon-{cls}:after,.fr-icon-{cls}:before{{-webkit-mask-image:url({d});mask-image:url({d})}}')
css += '\n/* Icônes Remix Icon utilisées par le prototype */\n' + '\n'.join(rules)
css += '\n:root{--chevron:url(' + datauri(glob.glob(f'{REMIX}*/arrow-down-s-line.svg')[0]) + ')}'

# 3. App pieces
from html import escape
CONF = json.load(open(B + 'prototype.json'))
SHELL = (open(os.path.join(ROOT, 'shared/shell-mobile.html')).read()
  .replace('{{TITRE}}', escape(CONF['titre'])).replace('{{DESCRIPTION}}', escape(CONF['description']))
  .replace('{{PARCOURS}}', '\n'.join(
    f'      <li class="flow fr-mb-2w"><span class="fr-text--sm fr-mb-0">{escape(p["libelle"])}</span>'
    f'<button type="button" class="fr-btn fr-btn--secondary fr-btn--sm fr-icon-play-line" title="Démarrer : {escape(p["libelle"])}" '
    f'onclick="cmd(\'{p["commande"]}\')">Démarrer : {escape(p["libelle"])}</button></li>' for p in CONF['parcours'])))
app_css = open(os.path.join(ROOT, 'shared/mobilic.css')).read() + '\n' + open(B + 'app.css').read()
for tok in re.findall(r'var\(--([a-z0-9-]+)\)', app_css + SHELL):
    if f'--{tok}:' not in css and f'--{tok}:' not in app_css + SHELL and tok not in ('icon-size',):   # tokens DSFR ou variables déclarées par Mobilic
        raise SystemExit(f'Token DSFR inconnu : --{tok}')

app = open(B + 'app.html').read()
logo = 'data:image/png;base64,' + base64.b64encode(open(LOGO, 'rb').read()).decode()
NATS = ''.join(f'<option>{n}</option>' for n in ['France', 'Belgique', 'Espagne', 'Italie', 'Pologne', 'Portugal', 'Roumanie'])

def date_group(prefix):
    el = lambda k, label, hint, mod, maxl: f'''<div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--{mod}"><div class="fr-input-group"><label class="fr-label" for="{prefix}-{k}">{label}<span class="fr-hint-text">{hint}</span></label><input class="fr-input" id="{prefix}-{k}" inputmode="numeric" maxlength="{maxl}" required></div></div>'''
    return ('<fieldset class="fr-fieldset" role="group"><legend class="fr-fieldset__legend fr-fieldset__legend--regular">Date de naissance du salarié <span class="required">*</span></legend>'
            + el('jour', 'Jour', 'Exemple : 14', 'number', 2) + el('mois', 'Mois', 'Exemple : 12', 'number', 2)
            + el('annee', 'Année', 'Exemple : 1984', 'year', 4) + '</fieldset>')

STEPS = {1: ('Données relatives au salarié', 'Données relatives à l’entreprise et au véhicule'),
         2: ('Données relatives à l’entreprise et au véhicule', 'Relevé des infractions'),
         3: ('Relevé des infractions', '')}
def stepper(n):
    t, nxt = STEPS[n]
    det = f'<p class="fr-stepper__details"><span class="fr-text--bold">Étape suivante :</span> {nxt}</p>' if nxt else ''
    return f'<div class="fr-stepper"><h2 class="fr-stepper__title">{t}<span class="fr-stepper__state">Étape {n} sur 3</span></h2><div class="fr-stepper__steps" data-fr-current-step="{n}" data-fr-steps="3"></div>{det}</div>'

def modal(m):
    mid, title, body, btns = m.group(1).split('|', 3)
    return f'''<div id="{mid}" class="fr-modal" role="dialog" aria-labelledby="{mid}-title">
  <div class="fr-container fr-container--fluid fr-container-md"><div class="fr-grid-row fr-grid-row--center"><div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
    <div class="fr-modal__body">
      <div class="fr-modal__header"><button type="button" class="fr-btn--close fr-btn" title="Fermer la fenêtre modale" onclick="closeModal('{mid}')">Fermer</button></div>
      <div class="fr-modal__content"><h1 id="{mid}-title" class="fr-modal__title">{title}</h1>{body}</div>
      <div class="fr-modal__footer"><ul class="fr-btns-group fr-btns-group--inline-lg">{btns}</ul></div>
    </div>
  </div></div></div>
</div>'''

app = (app.replace('{{LOGO}}', logo).replace('{{NATS}}', NATS)
       .replace('{{DATE:f}}', date_group('f')).replace('{{DATE:b}}', date_group('b')))
for n in (1, 2, 3):
    app = app.replace(f'{{{{STEPPER:{n}}}}}', stepper(n))
app = re.sub(r'\{\{MODAL:(.*?)\}\}', modal, app, flags=re.S)
req = set(re.findall(r'id="([^"]+)"[^>]*\brequired', app)) - {f'{p}-{k}' for p in 'fb' for k in ('jour', 'mois', 'annee')}
def star(m):
    lid, inner = m.group(1), m.group(2)
    if lid not in req: return m.group(0)
    if '<span class="fr-hint-text">' in inner:
        inner = inner.replace('<span class="fr-hint-text">', ' <span class="required">*</span><span class="fr-hint-text">', 1)
    else:
        inner += ' <span class="required">*</span>'
    return f'<label class="fr-label" for="{lid}">{inner}</label>'
app = re.sub(r'<label class="fr-label" for="([^"]+)">(.*?)</label>', star, app, flags=re.S)
assert '{{' not in app, re.findall(r'\{\{[^}]*\}\}', app)

out = (SHELL
       .replace('{{DSFR_CSS}}', css).replace('{{APP_CSS}}', app_css)
       .replace('{{APP_HTML}}', app).replace('{{APP_JS}}', open(B + 'app.js').read() + '\n' + open(B + 'infractions.js').read() + "\nrenderHistory(); go('home');\n"))
import shutil
os.makedirs(os.path.join(ROOT, 'dist', PROTO), exist_ok=True)
shutil.copytree(os.path.join(DIST, 'fonts'), os.path.join(ROOT, 'dist', 'fonts'), dirs_exist_ok=True)
open(os.path.join(ROOT, 'dist', PROTO, 'index.html'), 'w').write(out)
print(f'dist/{PROTO}/index.html :', round(len(out) / 1024), 'Ko,', len(cache), 'icônes DSFR inlinées, DSFR', DSFR_VERSION)
