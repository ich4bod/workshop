const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright-core');

const site = __dirname;
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((request, response) => {
  const filename = request.url === '/' ? 'index.html' : request.url.split('?')[0].slice(1);
  const target = path.resolve(site, filename);
  if (!target.startsWith(`${site}${path.sep}`) || !fs.existsSync(target)) return response.writeHead(404).end();
  response.writeHead(200, { 'content-type': types[path.extname(target)] || 'text/plain' });
  fs.createReadStream(target).pipe(response);
});
server.listen(8765, '127.0.0.1', async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const response = await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
    if (response.status() !== 200 || await page.locator('#cabinet article').count() !== 3) throw new Error('Fixture annotations did not load.');
    await page.getByRole('button', { name: 'New annotation' }).click();
    await page.locator('#record').fill('Pump log'); await page.locator('#source').fill('Log book 7'); await page.locator('#quote').fill('Pressure fell at 09:10.'); await page.locator('#note').fill('A concise operational note.'); await page.locator('#tags').fill('pump, urgent'); await page.getByRole('button', { name: 'Save annotation' }).click();
    await page.getByRole('button', { name: 'Edit' }).first().click(); await page.locator('#note').fill('Edited operational note.'); await page.getByRole('button', { name: 'Save annotation' }).click();
    await page.locator('#filter').fill('urgent');
    if (await page.locator('#cabinet article').count() !== 1 || !(await page.locator('#cabinet').textContent()).includes('Edited operational note.')) throw new Error('Filter or edit failed.');
    await page.reload({ waitUntil: 'networkidle' });
    if (!(await page.locator('#cabinet').textContent()).includes('Edited operational note.')) throw new Error('Saved annotation did not survive reload.');
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download JSON' }).click()]);
    const packet = JSON.parse(await fs.promises.readFile(await download.path(), 'utf8'));
    const saved = packet.annotations.find((item) => item.record === 'Pump log');
    if (packet.format !== 'evidence-annotation-cabinet/v1' || !saved || !saved.history.length || saved.source !== 'Log book 7') throw new Error('Export lost packet evidence or history.');
    const viewer = await browser.newContext(); const viewerPage = await viewer.newPage(); await viewerPage.setContent(`<pre>${JSON.stringify(packet)}</pre>`);
    if (!(await viewerPage.locator('pre').textContent()).includes('Edited operational note.')) throw new Error('A second offline viewer could not inspect the packet.');
    await viewer.close();
    const noJs = await browser.newContext({ javaScriptEnabled: false }); const fallback = await noJs.newPage(); await fallback.goto('http://127.0.0.1:8765/');
    if (!(await fallback.locator('.notice').textContent()).includes('JavaScript')) throw new Error('No-JavaScript limitation is not visible.');
    console.log('browser smoke passed: create, edit, filter, reload, and no-JS notice'); await noJs.close();
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { if (browser) await browser.close(); server.close(); }
});
