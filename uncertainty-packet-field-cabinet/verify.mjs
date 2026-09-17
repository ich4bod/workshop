import vm from 'node:vm';import fs from 'node:fs';
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(new URL('./packets.js',import.meta.url),'utf8'),sandbox);const packets=sandbox.window.PACKETS;
if(!Array.isArray(packets)||packets.length!==3)throw Error('expected three packet shapes');
for(const packet of packets){for(const key of ['id','tab','claims','conflict','nextChecks','gaps'])if(!packet[key]||(Array.isArray(packet[key])&&!packet[key].length))throw Error(`${packet.id} missing ${key}`);if(!Array.isArray(packet.claims)||packet.claims.length<2)throw Error(`${packet.id} needs claims`)}
console.log('fixture check passed: three distinct packets retain claims, conflict, next checks, and explicit gaps');