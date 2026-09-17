const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../uncertainty-worksheet/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const requests = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('file:')) return route.continue();
    requests.push(url);
    return route.abort();
  });
  await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
  await page.getByRole('button', { name: /sources/i }).click();
  assert.match(await page.locator('main').innerText(), /Calibrated last recorded/);
  await page.getByRole('button', { name: /disagreement/i }).click();
  assert.match(await page.locator('#disagreement').innerText(), /cannot rule out/i);
  await page.getByRole('button', { name: /missing context/i }).click();
  assert.equal(await page.locator('#context li').count(), 3);
  await page.getByRole('button', { name: /next checks/i }).click();
  assert.equal(await page.locator('#checks li').count(), 3);
  await page.getByRole('button', { name: /reset/i }).click();
  assert.equal(await page.locator('#claims').isVisible(), true);
  const text = await page.locator('main').innerText();
  assert.match(text, /not a conclusion or recommendation/i);
  assert.equal(/you should|best option|verdict:|recommendation:/i.test(text), false);
  assert.deepEqual(requests, []);
  await page.screenshot({ path: path.join(__dirname, 'proof.png'), fullPage: true });
  await browser.close();
  console.log('file:// reader card passed with network disabled');
})().catch((error) => { console.error(error); process.exit(1); });
