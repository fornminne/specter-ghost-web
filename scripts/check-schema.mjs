import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

const schemaPath = path.resolve('schema/specter.schema.json');
const challengesDir = path.resolve('challenges');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv2020({allErrors: true, strict: false});
const validate = ajv.compile(schema);
let bad = 0;

for (const name of fs.readdirSync(challengesDir)) {
  const file = path.join(challengesDir, name, 'specter.json');
  if (!fs.existsSync(file)) continue;
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (validate(manifest)) {
    console.log('SCHEMA OK', name);
    continue;
  }
  bad++;
  const detail = (validate.errors || []).map(error => `${error.instancePath || '/'} ${error.message}`).join('; ');
  console.error('SCHEMA FAIL', name, detail);
}

if (bad) process.exit(1);
