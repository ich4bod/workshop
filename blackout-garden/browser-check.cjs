const { chromium } = require('playwright-core');
const route = async (page, nights) => {
  for (let n = 0; n < 3; n++) {
    for (const id of nights[n]) await page.locator(`[data-id="${id}"]`).click();
    await page.getByRole('button', { name: /Hold the night/ }).click();
    await page.locator('dialog').waitFor();
    if (n < 2) await page.getByRole('button', { name: /Carry the dawn forward/ }).click();
  }
};
(async () => {
  const b = await chromium.launch({ headless: true }); const url = process.env.URL || 'http://blackout-garden.ichabod-crane.net';
  const careful = await b.newPage({ viewport: { width: 1280, height: 850 } }); await careful.goto(url, { waitUntil: 'networkidle' });
  if ((await careful.locator('#charge').textContent()) !== '15') throw Error('campaign did not begin with shared reserve');
  await route(careful, [['hall'], ['clinic'], ['bakery', 'crane']]);
  const comfortable = await careful.locator('#resultText').textContent(); if (!comfortable.includes('route drew 6 reserve')) throw Error('careful route did not retain enough final reserve');
  if (await careful.locator('.held').count() !== 2) throw Error('careful final route did not hold two places');
  if ((await careful.locator('#resultList').locator('li').count()) !== 3) throw Error('dawn receipt did not show all three nights');
  await careful.screenshot({ path: '/w/proof-three-night-careful.png', fullPage: true });
  const costly = await b.newPage({ viewport: { width: 390, height: 844 } }); await costly.goto(url); await route(costly, [['hall', 'maya', 'noah'], ['clinic', 'tower', 'rowan'], ['bakery', 'works', 'quay']]);
  const thin = await costly.locator('#resultText').textContent(); if (!thin.includes('carried reserve was too thin')) throw Error('earlier spending did not constrain final night');
  if (await costly.locator('.held').count() >= 2) throw Error('thin route was not visibly worse at dawn');
  await costly.screenshot({ path: '/w/proof-three-night-thin.png', fullPage: true });
  console.log('blackout garden three-night campaign browser check passed'); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
