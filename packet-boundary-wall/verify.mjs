import vm from 'node:vm';import fs from 'node:fs';
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(new URL('./fixtures.js',import.meta.url),'utf8'),sandbox);const fragments=sandbox.window.FRAGMENTS;
if(!Array.isArray(fragments)||fragments.length!==6)throw Error('expected six contrasting fragments');
for(const f of fragments){for(const key of ['id','kind','state','title','facts','conflict','check','gaps'])if(!f[key]||(Array.isArray(f[key])&&!f[key].length))throw Error(`${f.id} lacks ${key}`);if(f.facts.length<2)throw Error(`${f.id} lacks retained facts`)}
for(const kind of ['incident','decision','handoff']){const pair=fragments.filter(f=>f.kind===kind);if(pair.length!==2||!pair.some(f=>f.state==='open gap')||!pair.some(f=>f.state==='more retained'))throw Error(`${kind} lacks a contrast pair`)}
console.log('fixture check passed: six contrast fragments retain facts, conflict, recipient check, and gaps without normalizing incomplete packets');
