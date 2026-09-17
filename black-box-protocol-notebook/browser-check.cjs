const fs = require('fs');
const path = require('path');
const { chromium } = require('../uncertainty-worksheet/node_modules/playwright-core');
const site = __dirname;
const output = path.join(site, 'protocol-notebook.json');
(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ acceptDownloads: true });
    await context.setOffline(true);
    const page = await context.newPage();
    await page.goto(`file://${path.join(site, 'index.html')}`, { waitUntil: 'load' });
    for (const [label, at, input, outputText, unknown] of [['cold restart','2026-09-17 14:10 UTC','power cycle after 5 minutes','indicator stayed amber','whether the service was ready'], ['warm retry','2026-09-17 14:16 UTC','submit the same request','indicator turned green','which condition changed']]) {
      await page.locator('#obs-label').fill(label); await page.locator('#obs-at').fill(at); await page.locator('#obs-input').fill(input); await page.locator('#obs-output').fill(outputText); await page.locator('#obs-unknown').fill(unknown); await page.getByRole('button', {name:'Add observation'}).click();
    }
    await page.locator('#hyp-name').fill('stale cache'); await page.locator('#hyp-support').fill('warm retry changed the visible indicator'); await page.locator('#hyp-weaken').fill('a clean restart repeats the amber state'); await page.getByRole('button', {name:'Add hypothesis'}).click();
    await page.locator('#hyp-name').fill('delayed upstream handshake'); await page.locator('#hyp-support').fill('time also changed between trials'); await page.locator('#hyp-weaken').fill('a fast retry after a flush succeeds'); await page.getByRole('button', {name:'Add hypothesis'}).click();
    await page.locator('#probe-name').fill('retry after cache flush'); await page.locator('#probe-signal').fill('green immediately would separate cache from delay'); await page.locator('#probe-why').fill('it tests both accounts without opening the box'); await page.getByRole('button', {name:'Add probe'}).click();
    const download = await Promise.all([page.waitForEvent('download'), page.getByRole('button', {name:'Export notebook'}).click()]).then(([item]) => item); await download.saveAs(output);
    const record = JSON.parse(fs.readFileSync(output, 'utf8'));
    if (record.format !== 'black-box-protocol-notebook/v1' || record.observations.length !== 2 || record.hypotheses.length !== 2 || record.probes.length !== 1 || !record.observations[0].unknown) throw new Error('export omitted a required distinct record');
    await page.getByRole('button', {name:'Clear bench'}).click(); await page.locator('#import').setInputFiles(output);
    const text = await page.locator('body').textContent();
    for (const phrase of ['cold restart','stale cache','delayed upstream handshake','retry after cache flush','whether the service was ready','Black-box boundary']) if (!text.includes(phrase)) throw new Error(`reopened notebook omitted ${phrase}`);
    if (/recommended|winner|best hypothesis/i.test(text)) throw new Error('notebook implies a ranked verdict');
    await page.screenshot({path:path.join(site,'proof.png'), fullPage:true});
    console.log('browser check passed: clean offline file:// profile preserved two observations, conflicting hypotheses, unknowns, and a next probe through export/import');
  } catch (error) { console.error(error); process.exitCode = 1; } finally { if (browser) await browser.close(); }
})();
