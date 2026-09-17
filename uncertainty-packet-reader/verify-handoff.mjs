import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (fixture) => execFileSync(process.execPath, ['read-packet.mjs', `fixtures/${fixture}`], { cwd: here, encoding: 'utf8' });
const complete = read('two-options.json');
const incomplete = read('missing-evidence.json');
const requiredContext = ['OPTION: Repair the current printer', 'OPTION: Buy a compact thermal printer', 'assumptions: A replacement roller is available | The intermittent fault is mechanical', 'AGREEMENT:', 'CONFLICT:', 'UNRESOLVED:', 'NO VERDICT:'];
for (const line of requiredContext) {
  if (!complete.includes(line) || !incomplete.includes(line)) throw new Error(`both reports must preserve context: ${line}`);
}
if (complete.includes('GAP:')) throw new Error('complete fixture unexpectedly reports a gap');
for (const gap of ['GAP: Repair the current printer has no disconfirming evidence recorded.', 'GAP: Repair the current printer has no next check recorded.']) {
  if (!incomplete.includes(gap)) throw new Error(`missing-evidence fixture did not name its gap: ${gap}`);
}
if (/winner|recommend|score/i.test(incomplete)) throw new Error('gap report introduced a verdict');
const proof = resolve(here, 'proof', 'missing-evidence-observation.txt');
await mkdir(dirname(proof), { recursive: true });
await writeFile(proof, `COMPLETE PACKET\n${complete}\nMISSING-EVIDENCE PACKET\n${incomplete}`);
console.log('handoff verification passed: complete and missing-evidence reports preserve context, name gaps, and make no verdict');
