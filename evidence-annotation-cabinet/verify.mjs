import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { renderComparisonReport } from './report.mjs';

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
const receipt = fixtures.filter((item) => item.record === 'Parts receipt');
if (receipt.length !== 2 || new Set(receipt.map((item) => item.claim)).size !== 1) throw new Error('Need two matching receipt claims for comparison.');
const report = renderComparisonReport(fixtures, '2026-09-17T00:00:00.000Z');
for (const text of ['Evidence comparison report', 'Comparison status:</strong> Agreement', 'Comparison status:</strong> Conflicting readings', 'Uncertainty / annotation', 'Field notebook, page 14', 'This report preserves conflicting readings; it does not rank them.']) if (!report.includes(text)) throw new Error(`Report lacks ${text}.`);
if (report.includes('fetch(') || report.includes('<script')) throw new Error('Report must remain standalone and static.');
console.log('validated standalone comparison report with agreement and conflict');
