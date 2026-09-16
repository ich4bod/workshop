const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright-core');

const site = path.resolve(process.argv[2] || '.');
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const data = JSON.parse(fs.readFileSync(path.join(site, 'themes.json')));
const expected = {
  sources: data.sources.length,
  themes: data.sources.reduce((count, source) => count + source.themes.length, 0),
};

const server = http.createServer((request, response) => {
  const filename = request.url === '/' ? 'index.html' : request.url.slice(1);
  const target = path.resolve(site, filename);
  if (!target.startsWith(`${site}${path.sep}`) || !fs.existsSync(target)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'content-type': types[path.extname(target)] || 'text/plain' });
  fs.createReadStream(target).pipe(response);
});

server.listen(8765, '127.0.0.1', async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const response = await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
    const actual = {
      sources: await page.locator('#atlas article').count(),
      themes: await page.locator('#atlas article li').count(),
    };
    const noJavaScript = await browser.newContext({ javaScriptEnabled: false });
    const fallbackPage = await noJavaScript.newPage();
    await fallbackPage.goto('http://127.0.0.1:8765/', { waitUntil: 'load' });
    const fallback = await fallbackPage.locator('.fallback').textContent();
    if (response.status() !== 200 || actual.sources !== expected.sources || actual.themes !== expected.themes || !fallback.includes('Current theme list')) {
      throw new Error(JSON.stringify({ status: response.status(), actual, expected, fallback }));
    }
    console.log(JSON.stringify({ status: response.status(), actual, expected, fallback: 'present' }));
    await noJavaScript.close();
    await browser.close();
    server.close();
  } catch (error) {
    console.error(error);
    server.close(() => process.exit(1));
  }
});
