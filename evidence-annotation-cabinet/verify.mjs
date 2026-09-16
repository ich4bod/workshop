import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const fixtures = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url)));
const required = ['id', 'record', 'source', 'quote', 'note', 'tags', 'author'];
if (!Array.isArray(fixtures) || fixtures.length < 3) throw new Error('Need at least three fixture annotations.');
for (const [index, item] of fixtures.entries()) {
  for (const key of required) if ((key === 'tags' && (!Array.isArray(item.tags) || !item.tags.length)) || (key !== 'tags' && (typeof item[key] !== 'string' || !item[key].trim()))) throw new Error(`Fixture ${index} lacks ${key}.`);
  if (item.quote.length > 280 || item.note.length > 600) throw new Error(`Fixture ${index} exceeds a bounded field.`);
}
console.log(`validated ${fixtures.length} bounded fixture annotations`);
console.log(`baseline sha256 ${createHash('sha256').update(JSON.stringify(fixtures)).digest('hex')}`);
