// Garde-fou : bloque la publication si un fichier du dépôt contient une donnée potentiellement confidentielle.
// Lancé en local (npm run check) et en intégration continue avant chaque déploiement.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' }).split('\n').filter(f => f && !f.endsWith('.png') && f !== 'package-lock.json');

// Adresses e-mail autorisées : exemples génériques uniquement.
// Domaines réservés aux exemples (RFC 2606 / 6761) : example.*, *.example.*, .test, .invalid.
const ALLOWED_EMAILS = [/^nom@domaine\.fr$/, /^contact@entreprise\.fr$/, /@([\w-]+\.)*example(\.(com|org|net|fr))?$/, /\.(test|invalid)$/,
  /^noreply@anthropic\.com$/, /@users\.noreply\.github\.com$/,
  /^jane@acme\.com$/,   // exemple fictif dans le skill tiers .claude/skills/break-ui
];

const RULES = [
  { name: 'Lien vers un fichier Figma', re: /figma\.com\/(design|file|board|proto|make)\//gi },
  { name: 'Adresse e-mail réelle', re: /[\w.+-]+@[\w-]+\.[\w.]+/g, allow: m => ALLOWED_EMAILS.some(r => r.test(m)) },
  // Numéros autorisés : plages réservées à la fiction par l'ARCEP (01 99 00 xx xx, 06 39 98 xx xx).
  { name: 'Numéro de téléphone', re: /(?<![\w/])0[1-9](?:[ .-]?\d{2}){4}(?!\d)/g, allow: m => /^0(1[ .-]?99[ .-]?00|6[ .-]?39[ .-]?98)/.test(m) },
  { name: 'Numéro de sécurité sociale', re: /\b[12]\s?\d{2}\s?(0[1-9]|1[0-2])\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}\b/g },
  { name: 'Jeton ou clé secrète', re: /\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})\b/g },
];

let problems = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      if (rule.allow && rule.allow(m[0])) continue;
      const line = text.slice(0, m.index).split('\n').length;
      console.error(`✗ ${rule.name} : ${file}:${line} → ${m[0]}`);
      problems++;
    }
  }
}
if (problems) {
  console.error(`\n${problems} élément(s) à retirer avant publication (voir CONFIDENTIALITE.md).`);
  process.exit(1);
}
console.log(`✓ Aucune donnée sensible détectée dans ${files.length} fichiers.`);
