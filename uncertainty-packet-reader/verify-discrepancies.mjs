import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const record = JSON.parse(await readFile(resolve(here, 'fixtures/independent-reader-discrepancies.json'), 'utf8'));
const packet = JSON.parse(await readFile(resolve(here, `fixtures/${record.packet}`), 'utf8'));
const requiredRecord = ['question', 'observation', 'disagreement', 'missingContext', 'unresolvedItem'];
const forbidden = /score|rank|winner|recommend/i;
if (!Array.isArray(record.readerInstructions) || record.readerInstructions.length < 2 || !Array.isArray(record.records) || !record.records.length) throw new Error('reader record needs instructions and at least one discrepancy');
for (const [index, item] of record.records.entries()) {
  for (const field of requiredRecord) if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`record ${index + 1} is missing ${field}`);
  if (Object.keys(item).some((key) => forbidden.test(key)) || forbidden.test(JSON.stringify(item))) throw new Error(`record ${index + 1} introduced a ranking or recommendation`);
}
const text = JSON.stringify(record);
for (const option of packet.options) if (!text.includes(option.name)) throw new Error(`record does not preserve option context: ${option.name}`);
console.log(`discrepancy verification passed: ${record.records.length} named reader records preserve both options, explicit disagreement, missing context, and unresolved items without a verdict`);
