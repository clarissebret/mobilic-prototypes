// Génère la page d'accueil (dist/index.html) qui liste les prototypes publiés.
import { readdirSync, writeFileSync, existsSync } from 'node:fs';

const PROTOTYPES = {
  'controle-lic-papier': {
    titre: 'Contrôle LIC papier / feuille de route',
    description: "Interface contrôleur (mobile) : création du contrôle, relevé des infractions, édition et envoi du bulletin de contrôle. Inclut le secteur TRS.",
  },
};

const items = readdirSync('dist', { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(`dist/${d.name}/index.html`) && PROTOTYPES[d.name])
  .map(d => `<li class="fr-mb-3w"><h2 class="fr-h5 fr-mb-1w"><a class="fr-link fr-link--lg" href="./${d.name}/">${PROTOTYPES[d.name].titre}</a></h2><p class="fr-mb-0">${PROTOTYPES[d.name].description}</p></li>`)
  .join('\n');

writeFileSync('dist/index.html', `<!DOCTYPE html>
<html lang="fr" data-fr-scheme="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Prototypes Mobilic</title>
<style>
@font-face{font-family:Marianne;src:url(fonts/Marianne-Regular.woff2) format("woff2");font-weight:400}
@font-face{font-family:Marianne;src:url(fonts/Marianne-Bold.woff2) format("woff2");font-weight:700}
body{font-family:Marianne,arial,sans-serif;margin:0;color:#161616;line-height:1.5}
main{max-width:48rem;margin:0 auto;padding:3rem 1.5rem}
h1{font-size:2rem;margin:0 0 1rem}
.fr-h5{font-size:1.25rem;margin:0}
.fr-link{color:#000091}
ul{list-style:none;padding:0;margin:2rem 0 0}
.fr-mb-1w{margin-bottom:.5rem}.fr-mb-3w{margin-bottom:1.5rem}.fr-mb-0{margin-bottom:0}
.notice{background:#e8edff;padding:1rem 1.5rem}
</style></head>
<body><main>
<h1>Prototypes Mobilic</h1>
<p class="notice">Prototypes de conception, à destination de l'équipe. Toutes les données affichées sont fictives.</p>
<ul>
${items}
</ul>
</main></body></html>
`);
console.log('dist/index.html généré');
