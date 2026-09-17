const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('../uncertainty-worksheet/node_modules/playwright-core');
const site = __dirname;
const server = http.createServer((request, response) => {
  const file = request.url === '/' ? 'index.html' : request.url.split('?')[0].slice(1);
  const target = path.resolve(site, file);
  if (!target.startsWith(`${site}${path.sep}`) || !fs.existsSync(target)) return response.writeHead(404).end();
  response.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[path.extname(target)] || 'text/plain' });
  fs.createReadStream(target).pipe(response);
});
server.listen(8774, '127.0.0.1', async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8774/', { waitUntil: 'networkidle' });
    if (await page.getByRole('button').count() !== 3) throw new Error('three scenario controls did not render');
    for (const name of ['Shared roof repair', 'Field notes without a baseline', 'Quiet sensor alert']) {
      await page.getByRole('button', { name: new RegExp(name) }).click();
      const text = await page.locator('#packet').textContent();
      for (const section of ['Observed claims', 'What lines up', 'What does not', 'Unresolved next checks', 'Explicit gaps', 'confidence']) if (!text.includes(section)) throw new Error(`${name} omitted ${section}`);
    }
    const body = await page.locator('body').textContent();
    if (/winner|recommendation|best option/i.test(body)) throw new Error('gallery implies a verdict');
    await page.screenshot({ path: path.join(site, 'proof.png'), fullPage: true });
    await context.setOffline(true);
    await page.getByRole('button', { name: /Shared roof repair/ }).click();
    if (!(await page.locator('#packet').textContent()).includes('No roof-edge inspection')) throw new Error('loaded packet data did not remain usable with networking disabled');
    console.log('browser check passed: three scenarios rendered; every packet exposed claims, sources, confidence, conflict, next checks, and gaps without a verdict, and switching remained usable with networking disabled');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { if (browser) await browser.close(); server.close(); }
});
