import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const fixtures = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)));
const required = ['id', 'record', 'source', 'quote', 'claim', 'confidence', 'observed', 'note', 'tags', 'author', 'history'];
if (!Array.isArray(fixtures) || fixtures.length < 3) throw new Error('Need at least three fixture annotations.');
for (const [index, item] of fixtures.entries()) {
  for (const key of required) if (((key === 'tags' || key === 'history') && (!Array.isArray(item[key]) || !item[key].length)) || (!['tags', 'history'].includes(key) && (typeof item[key] !== 'string' || !item[key].trim()))) throw new Error(`Fixture ${index} lacks ${key}.`);
  if (item.quote.length > 280 || item.note.length > 600) throw new Error(`Fixture ${index} exceeds a bounded field.`);
  for (const event of item.history) if (typeof event.at !== 'string' || typeof event.action !== 'string' || typeof event.note !== 'string') throw new Error(`Fixture ${index} has invalid history.`);
}
console.log(`validated ${fixtures.length} bounded fixture annotations`);
console.log(`baseline sha256 ${createHash('sha256').update(JSON.stringify(fixtures)).digest('hex')}`);

const river = fixtures.filter((item) => item.record === 'River gauge level');
if (river.length !== 2 || new Set(river.map((item) => item.claim)).size !== 2) throw new Error('Need two distinct river-gauge claims for comparison.');
