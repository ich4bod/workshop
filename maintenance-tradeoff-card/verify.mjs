import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const fixture = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)));
assert.equal(fixture.choices.length, 4, 'fixture must have four choices');
for (const choice of fixture.choices) {
  assert.ok(choice.name && choice.confidence && choice.risks.length, 'each choice needs name, confidence, and risk');
  assert.ok(Array.isArray(choice.evidence) && Array.isArray(choice.missing), 'evidence and missing fields stay explicit');
}
assert.ok(fixture.reviewDate && fixture.disagreement, 'fixture needs review date and disagreement');
const app = await readFile(new URL('./app.js', import.meta.url), 'utf8');
assert.ok(app.includes('does not score or recommend') && app.includes('Not recorded'), 'report retains no-recommendation and missing-field boundaries');
console.log('fixture verification passed: four choices, risks, evidence, confidence, review date, disagreement, and explicit missing fields');
