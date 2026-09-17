const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright-core');

const site = __dirname;
const proofPath = path.join(site, 'proof', 'clean-profile-observation.json');
const server = http.createServer((request, response) => {
  const file = request.url === '/' ? 'index.html' : request.url.split('?')[0].slice(1);
  const target = path.resolve(site, file);
  if (!target.startsWith(`${site}${path.sep}`) || !fs.existsSync(target)) return response.writeHead(404).end();
  response.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[path.extname(target)] || 'text/plain' });
  fs.createReadStream(target).pipe(response);
});

server.listen(8766, '127.0.0.1', async () => {
  let context;
  let profile;
  try {
    profile = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'uncertainty-packet-clean-profile-'));
    context = await chromium.launchPersistentContext(profile, { headless: true });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8766/', { waitUntil: 'networkidle' });
    if (await page.locator('.option').count() !== 2 || !(await page.locator('body').textContent()).includes('Agreement:')) throw new Error('fixture agreement/conflict did not render');
    await page.getByRole('button', { name: 'Add an option' }).click();
    const added = page.locator('.option').last();
    await added.locator('.name').fill('Borrow a printer');
    await added.locator('.assumptions').fill('A neighbour is available');
    await added.locator('.evidence').fill('The neighbour travels often');
    await added.locator('.next-check').fill('Ask before Tuesday');
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download worksheet HTML' }).click()]);
    const packetPath = await download.path();
    const report = await fs.promises.readFile(packetPath, 'utf8');
    if (!report.includes('Borrow a printer') || !report.includes('Unresolved questions') || !report.includes('does not rank options')) throw new Error('standalone packet omitted an uncertainty field or no-ranking boundary');
    const packet = await context.newPage();
    await packet.goto(`file://${packetPath}`, { waitUntil: 'load' });
    const requiredSections = ['Repair the current printer', 'Borrow a printer', 'Assumptions:', 'Disconfirming evidence:', 'Agreement:', 'Conflict:', 'Unresolved questions:', 'does not rank options'];
    const packetText = await packet.locator('body').textContent();
    const missingBeforeReload = requiredSections.filter((section) => !packetText.includes(section));
    if (missingBeforeReload.length) throw new Error(`clean-profile packet omitted: ${missingBeforeReload.join(', ')}`);
    await context.setOffline(true);
    await packet.reload({ waitUntil: 'load' });
    const offlineText = await packet.locator('body').textContent();
    const missingAfterReload = requiredSections.filter((section) => !offlineText.includes(section));
    if (missingAfterReload.length) throw new Error(`offline file reload omitted: ${missingAfterReload.join(', ')}`);
    await fs.promises.mkdir(path.dirname(proofPath), { recursive: true });
    await fs.promises.writeFile(proofPath, `${JSON.stringify({ profile: 'fresh temporary Chromium user-data directory', packet: 'downloaded fixture with an added option', requiredSections, offlineReload: 'passed; context network disabled before file:// reload' }, null, 2)}\n`);
    await packet.close();
    await context.setOffline(false);
    await page.getByRole('button', { name: 'Reset to fixture' }).click();
    if (await page.locator('.option').count() !== 2 || (await page.locator('body').textContent()).includes('Borrow a printer')) throw new Error('reset did not restore fixture');
    console.log('browser smoke passed: clean profile, fixture, offline standalone packet reload, reset');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (context) await context.close();
    if (profile) await fs.promises.rm(profile, { recursive: true, force: true });
    server.close();
  }
});
