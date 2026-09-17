const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright-core');
const site = __dirname;
const server = http.createServer((request, response) => {
  const file = request.url === '/' ? 'index.html' : request.url.split('?')[0].slice(1);
  const target = path.resolve(site, file);
  if (!target.startsWith(`${site}${path.sep}`) || !fs.existsSync(target)) return response.writeHead(404).end();
  response.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[path.extname(target)] || 'text/plain' }); fs.createReadStream(target).pipe(response);
});
server.listen(8766, '127.0.0.1', async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true }); const page = await browser.newPage();
    await page.goto('http://127.0.0.1:8766/', { waitUntil: 'networkidle' });
    if (await page.locator('.option').count() !== 2 || !(await page.locator('body').textContent()).includes('Agreement:')) throw new Error('fixture agreement/conflict did not render');
    await page.getByRole('button', { name: 'Add an option' }).click(); await page.locator('.option').last().locator('.name').fill('Borrow a printer'); await page.locator('.option').last().locator('.assumptions').fill('A neighbour is available'); await page.locator('.option').last().locator('.evidence').fill('The neighbour travels often'); await page.locator('.option').last().locator('.next-check').fill('Ask before Tuesday');
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download worksheet HTML' }).click()]);
    const packetPath = await download.path(); const report = await fs.promises.readFile(packetPath, 'utf8'); if (!report.includes('Borrow a printer') || !report.includes('Unresolved questions') || !report.includes('does not rank options')) throw new Error('standalone packet omitted an uncertainty field or no-ranking boundary');
    const packet = await browser.newPage(); await packet.goto(`file://${packetPath}`, { waitUntil: 'load' }); const packetText = await packet.locator('body').textContent(); if (!packetText.includes('Repair the current printer') || !packetText.includes('Borrow a printer') || !packetText.includes('Unresolved questions') || !packetText.includes('does not rank options')) throw new Error('offline packet did not reopen with options, uncertainty, and no-ranking boundary'); await packet.close();
    await page.getByRole('button', { name: 'Reset to fixture' }).click(); if (await page.locator('.option').count() !== 2 || (await page.locator('body').textContent()).includes('Borrow a printer')) throw new Error('reset did not restore fixture');
    console.log('browser smoke passed: fixture, add, offline standalone packet reopen, reset');
  } catch (error) { console.error(error); process.exitCode = 1; } finally { if (browser) await browser.close(); server.close(); }
});
