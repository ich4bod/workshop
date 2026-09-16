import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const fixtures = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)));
const required = ['claim', 'source', 'task', 'expected', 'observed', 'uncertainty', 'failure'];
if (!Array.isArray(fixtures) || fixtures.length < 3) throw new Error('Need at least three task fixtures.');
for (const [index, fixture] of fixtures.entries()) {
  for (const key of required) if (typeof fixture[key] !== 'string' || !fixture[key].trim()) throw new Error(`Fixture ${index} lacks ${key}.`);
  if (fixture.expected === fixture.observed) throw new Error(`Fixture ${index} is not a failure case.`);
}
const baseline = createHash('sha256').update(JSON.stringify(fixtures)).digest('hex');
console.log(`validated ${fixtures.length} fixtures`);
console.log(`baseline sha256 ${baseline}`);
