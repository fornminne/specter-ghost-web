import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv/dist/2020.js';

const root = process.cwd();
const blocked = [
  'data-answer',
  'ASSISTANT PROCESSING DIRECTIVE',
  'COOKLIST RECIPE PROCESSOR',
  'KROGER_TEST_MARKER',
  'KROGER_AUTHORITY_TEST',
];
let bad = 0;
const fail = (message) => {
  bad += 1;
  console.error('FAIL', message);
};

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'fixtures' || entry.name === 'recipe-import') fail(`published directory not allowed: ${path.relative(root, full)}`);
      walk(full, files);
    } else files.push(full);
  }
  return files;
}

for (const file of walk(path.join(root, 'public'))) {
  if (!file.endsWith('.html')) continue;
  const text = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  for (const needle of blocked) {
    if (text.includes(needle)) fail(`${relative} contains ${needle}`);
  }
  if (/onclick\s*=/.test(text)) fail(`${relative} contains an inline onclick handler`);
}

const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema', 'specter.schema.json'), 'utf8'));
const ajv = new Ajv({allErrors: true, strict: false});
const validate = ajv.compile(schema);
const challengeRoot = path.join(root, 'challenges');
for (const name of fs.readdirSync(challengeRoot)) {
  const manifestPath = path.join(challengeRoot, name, 'specter.json');
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!validate(manifest)) fail(`${name} schema: ${ajv.errorsText(validate.errors)}`);
  else console.log('SCHEMA OK', name);
}

if (bad) process.exit(1);
console.log('publish checks ok');
