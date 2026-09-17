const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname);
const url = 'file://' + path.join(root, 'index.html');
const forbidden = /\b(fresh|stale|better|best|score|rank|preferred)\b/i;

(async () => {
  const browser = await chromium.launch({ headless: true });
  let blocked = 0;
  for (const [name, viewport] of [['wide', { width: 1200, height: 900 }], ['narrow', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => route.request().url().startsWith('file:') ? route.continue() : (blocked++, route.abort()));
    const page = await context.newPage();
    await page.goto(url);
    const cards = page.locator('.record');
    if (await cards.count() !== 2) throw new Error('expected two contrasting records');
    for (const field of ['revision', 'acceptance', 'url', 'gap']) {
      await page.locator(`[data-field="${field}"]`).click();
      if (await page.locator('.field-row.is-active').count() !== 2) throw new Error(field + ' did not highlight both records');
      if (!await page.locator('#detail-title').textContent().then(t => t.length > 3)) throw new Error(field + ' has no definition');
    }
    const text = await page.locator('main').textContent();
    if (forbidden.test(text)) throw new Error('forbidden judgement label rendered: ' + text.match(forbidden)[0]);
    if (!/Not retained in this handoff/.test(text) || !/No observed interaction check is retained/.test(text)) throw new Error('unknown values were lost');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(name + ' viewport overflows');
    await page.screenshot({ path: path.join(root, `proof-${name}.png`), fullPage: true });
    await context.close();
  }
  await browser.close();
  if (blocked !== 0) throw new Error('unexpected non-file requests: ' + blocked);
  console.log('PASS: two records, four fields, unknowns retained, no judgement labels, file-only reloads');
})().catch(error => { console.error('FAIL:', error.message); process.exit(1); });
