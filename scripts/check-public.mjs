import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const failures = [];
const allowedFlags = new Set(['SG{...}', 'SG{marker}']);
const markerLabels = [
  'data-answer',
  'review_marker',
  'audit_marker',
  'debugMarker',
  'marker phrase',
  'marker contents',
  'AUDIT MARKER',
  'X-Review:'
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full);
    if (entry.isDirectory()) {
      if (rel === path.join('labs', 'fixtures') || rel.startsWith(`labs${path.sep}fixtures${path.sep}`)) {
        failures.push(`published fixtures directory: public/${rel}`);
      }
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    const text = fs.readFileSync(full, 'utf8');
    for (const label of markerLabels) {
      if (text.includes(label)) failures.push(`${label} in public/${rel}`);
    }
    for (const flag of text.match(/SG\{[^}]*\}/g) || []) {
      if (!allowedFlags.has(flag)) failures.push(`plaintext flag ${flag} in public/${rel}`);
    }
  }
}

if (!fs.existsSync(root)) {
  console.error('PUBLIC FAIL public/ is missing');
  process.exit(1);
}
walk(root);
if (failures.length) {
  for (const failure of failures) console.error('PUBLIC FAIL', failure);
  process.exit(1);
}
console.log('PUBLIC OK no data-answer, fixtures, marker labels, or plaintext SG{ flags under public/');
