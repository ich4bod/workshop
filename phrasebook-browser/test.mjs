import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { phrases, filterPhrases, nextLanguage, nextResult } from './phrases.js';

assert.equal(phrases.length, 30, 'dataset has 30 phrases');
assert.deepEqual([...new Set(phrases.map((phrase) => phrase.language))], ['Spanish', 'Japanese', 'Arabic']);
assert.equal(filterPhrases('bathroom').length, 3, 'English search finds a phrase in every language');
assert.equal(filterPhrases('thank', 'Japanese').length, 1, 'language filter narrows search');
assert.equal(filterPhrases('', 'Arabic').length, 10, 'language filter returns Arabic set');
assert.equal(nextLanguage('Spanish', 1), 'Japanese', 'right arrow advances language selection');
assert.equal(nextLanguage('All', -1), 'Arabic', 'left arrow wraps language selection');
assert.equal(nextResult(0, 1, 3), 1, 'down arrow selects next result');
assert.equal(nextResult(2, 1, 3), 2, 'down arrow stops at final result');
const assets = await Promise.all(['index.html', 'app.js', 'phrases.js', 'style.css'].map((file) => readFile(file, 'utf8')));
assert.ok(assets.every((asset) => !/https?:\/\/|fetch\s*\(/i.test(asset)), 'app has no network URL or fetch call');
const app = assets[1];
assert.match(app, /languageNav\.addEventListener\('keydown'/, 'language chooser has keyboard navigation');
assert.match(app, /results\.addEventListener\('keydown'/, 'results have keyboard navigation');
console.log('All phrasebook checks passed.');
