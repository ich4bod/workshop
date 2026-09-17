import fs from 'node:fs';
const record = JSON.parse(fs.readFileSync(new URL('./reader-handoff-record.json', import.meta.url)));
const keys = ['observations', 'disagreements', 'missingContext', 'unresolved'];
if (record.format !== 'uncertainty-reader-handoff/v1') throw new Error('wrong handoff format');
if (!record.packet || !keys.every(key => Array.isArray(record[key]) && record[key].every(item => typeof item === 'string'))) throw new Error('handoff fields are incomplete');
if (!/without a verdict, ranking, or recommendation/i.test(record.boundary)) throw new Error('handoff boundary is missing');
console.log(`record check passed: ${record.packet}; ${keys.map(key => `${key}=${record[key].length}`).join(', ')}`);
