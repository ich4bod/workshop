import { readFile } from 'node:fs/promises';

const [leftPath, rightPath] = process.argv.slice(2);
if (!leftPath || !rightPath) throw new Error('usage: node compare.mjs left.json right.json');
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const normalize = (value) => {
  if (Array.isArray(value)) return value.map(normalize).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalize(value[key])]));
  return value;
};
const flatten = (value, prefix = '') => Object.entries(value).flatMap(([key, item]) => item && typeof item === 'object' ? flatten(item, `${prefix}${key}.`) : [[`${prefix}${key}`, JSON.stringify(item)]]);
const [left, right] = [normalize(await read(leftPath)), normalize(await read(rightPath))];
const fields = new Map(flatten(left)); const other = new Map(flatten(right));
const differences = [...new Set([...fields.keys(), ...other.keys()])].sort().filter((key) => fields.get(key) !== other.get(key));
if (!differences.length) console.log('equivalent: no uncertainty fields changed');
else for (const key of differences) console.log(`changed: ${key}: ${fields.get(key) ?? 'absent'} -> ${other.get(key) ?? 'absent'}`);
