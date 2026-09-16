import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const fixtures = JSON.parse(await readFile(new URL('../fixtures/drill-fixtures.json', import.meta.url)));
function assess(item) {
  const evidence=[];
  if(item.signature==='missing') evidence.push('No verifiable signature');
  if(!item.pins) evidence.push('Dependencies are not pinned');
  if(/ignore prior|\.env|~\/\.ssh|upload/i.test(item.prompt)) evidence.push('Prompt requests secrets, instruction override, or sensitive files');
  return /secrets|instruction override|sensitive files/.test(evidence.join(' '))?'critical':evidence.length?'high':'low';
}
assert.equal(fixtures.length, 6, 'six fixtures are required');
const first=fixtures.map(x=>[x.id,assess(x)]); const second=fixtures.map(x=>[x.id,assess(x)]);
assert.deepEqual(first, second, 'classification must be deterministic');
for(const item of fixtures) assert.equal(assess(item),item.expected,`${item.id} classification`);
console.log(`Verified ${fixtures.length} fixtures twice: ${first.map(x=>x.join('=')).join(', ')}`);
