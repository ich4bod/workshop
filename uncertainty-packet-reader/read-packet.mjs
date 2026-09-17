import { readFile } from 'node:fs/promises';

const packetPath = process.argv[2];
if (!packetPath) throw new Error('usage: node read-packet.mjs packet.json');
const packet = JSON.parse(await readFile(packetPath, 'utf8'));
const requiredTopLevel = ['title', 'question', 'options', 'agreement', 'conflict', 'unresolvedQuestions'];
for (const field of requiredTopLevel) if (!(field in packet)) throw new Error(`missing required field: ${field}`);
if (!Array.isArray(packet.options) || packet.options.length < 2) throw new Error('packet needs at least two options');
if (!Array.isArray(packet.unresolvedQuestions)) throw new Error('unresolvedQuestions must be an array');
const requiredOption = ['name', 'assumptions', 'confidence', 'disconfirmingEvidence', 'nextCheck'];
for (const option of packet.options) {
  for (const field of requiredOption) if (!(field in option)) throw new Error(`option ${option.name ?? '(unnamed)'} is missing ${field}`);
  if (!Array.isArray(option.assumptions) || !Array.isArray(option.disconfirmingEvidence)) throw new Error(`option ${option.name} has non-list evidence`);
}
console.log(`PACKET: ${packet.title}`);
console.log(`QUESTION: ${packet.question}`);
for (const option of packet.options) {
  console.log(`OPTION: ${option.name}`);
  console.log(`  assumptions: ${option.assumptions.join(' | ')}`);
  console.log(`  confidence: ${option.confidence}`);
  console.log(`  disconfirming evidence: ${option.disconfirmingEvidence.join(' | ')}`);
  console.log(`  next check: ${option.nextCheck}`);
}
console.log(`AGREEMENT: ${packet.agreement}`);
console.log(`CONFLICT: ${packet.conflict}`);
console.log(`UNRESOLVED: ${packet.unresolvedQuestions.join(' | ')}`);
console.log('NO VERDICT: this reader reports uncertainty; it does not select an option.');
