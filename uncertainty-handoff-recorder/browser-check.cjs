const fs = require('fs');
const path = require('path');
const { chromium } = require('../uncertainty-worksheet/node_modules/playwright-core');
const site = __dirname;
const output = path.join(site, 'reader-handoff-record.json');
(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ acceptDownloads: true });
    await context.setOffline(true);
    const page = await context.newPage();
    await page.goto(`file://${path.join(site, 'index.html')}`, { waitUntil: 'load' });
    await page.locator('#packet').fill('Quiet sensor alert · file handoff');
    await page.locator('#reader').fill('Clean-profile replay');
    await page.locator('#observations').fill('The alert cleared after six minutes\nConfidence belongs to observations');
    await page.locator('#disagreements').fill('No competing explanation is present');
    await page.locator('#missingContext').fill('No continuous temperature trace');
    await page.locator('#unresolved').fill('Compare door-open events with the next alert');
    await page.getByRole('button', { name: 'Preview handoff' }).click();
    const text = await page.locator('#preview').textContent();
    for (const phrase of ['Retained observations', 'Disagreements or tensions', 'Missing context', 'Unresolved items']) if (!text.includes(phrase)) throw new Error(`preview omitted ${phrase}`);
    if (!(await page.locator('body').textContent()).includes('It does not score the reader or settle the packet.')) throw new Error('recording boundary omitted no-verdict language');
    const download = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export record' }).click()]).then(([item]) => item);
    await download.saveAs(output);
    const record = JSON.parse(fs.readFileSync(output, 'utf8'));
    if (record.format !== 'uncertainty-reader-handoff/v1' || record.observations.length !== 2 || record.unresolved[0] !== 'Compare door-open events with the next alert') throw new Error('export did not preserve entered handoff');
    await page.getByRole('button', { name: 'Start over' }).click();
    await page.locator('#import').setInputFiles(output);
    if (!(await page.locator('#preview').textContent()).includes('No continuous temperature trace')) throw new Error('reloaded record omitted missing context');
    if (/best reader|reader score|recommended conclusion/i.test(await page.locator('body').textContent())) throw new Error('recorder implies a ranking or verdict');
    await page.screenshot({ path: path.join(site, 'proof.png'), fullPage: true });
    console.log('browser check passed: a clean, network-disabled file:// browser entered, exported, reloaded, and displayed a reader handoff without a verdict or ranking');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { if (browser) await browser.close(); }
})();
