import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const fixture = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)));
assert.equal(fixture.options.length, 2, 'fixture needs competing options');
for (const option of fixture.options) {
  for (const field of ['name', 'confidence', 'nextCheck']) assert.ok(option[field], `${field} is required`);
  assert.ok(option.assumptions.length && option.disconfirmingEvidence.length, 'each option needs assumptions and disconfirming evidence');
}
assert.ok(fixture.agreement && fixture.conflict, 'fixture needs agreement and conflict');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
assert.equal(hash(fixture), hash(JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)))), 'fixture serialization must be deterministic');
const app = await readFile(new URL('./app.js', import.meta.url), 'utf8');
const page = await readFile(new URL('./index.html', import.meta.url), 'utf8');
assert.ok(app.includes('does not rank options') && page.includes('Download worksheet HTML'), 'export must retain the no-ranking boundary');
console.log('fixture verification passed: competing options, agreement/conflict, inspectable uncertainty fields, deterministic source data');
