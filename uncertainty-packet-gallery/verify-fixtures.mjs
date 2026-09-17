import { readFile } from 'node:fs/promises';
const fixtures = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)));
const required = ['id', 'label', 'status', 'question', 'claims', 'agreement', 'conflict', 'nextChecks', 'gaps'];
if (fixtures.length !== 3) throw new Error(`expected exactly three scenarios, found ${fixtures.length}`);
const ids = new Set();
for (const fixture of fixtures) {
  for (const key of required) if (!(key in fixture) || (Array.isArray(fixture[key]) && !fixture[key].length)) throw new Error(`${fixture.id || 'unnamed'} lacks ${key}`);
  if (ids.has(fixture.id)) throw new Error(`duplicate scenario id: ${fixture.id}`); ids.add(fixture.id);
  if (!fixture.conflict.trim()) throw new Error(`${fixture.id} hides conflict or indeterminacy`);
  for (const claim of fixture.claims) for (const key of ['text', 'source', 'confidence', 'stance']) if (!claim[key]) throw new Error(`${fixture.id} claim lacks ${key}`);
}
console.log(`fixture validation passed: ${fixtures.map(item => item.id).join(', ')}`);
