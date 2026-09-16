const { test, expect } = require('@playwright/test');

test('plays the haunted shift with a keyboard and resets', async ({ page }) => {
  await page.goto('/');
  const command = page.locator('#command');
  await expect(command).toBeFocused();
  await expect(page.locator('#screen')).toContainText('NIGHT SHIFT OS');
  for (const text of ['spool', 'read message', 'answer']) { await command.fill(text); await command.press('Enter'); }
  await expect(page.locator('#screen')).toContainText('Dawn finds the room');
  await command.fill('reset'); await command.press('Enter');
  await expect(page.locator('#screen')).toContainText('A message waits in the spooler');
});

test('has no third-party requests and a visible focus indicator', async ({ page }) => {
  const requests = []; page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.locator('#command').focus();
  await expect(page.locator('#command')).toBeFocused();
  await expect(page.locator('#command')).toHaveCSS('outline-style', 'solid');
  expect(requests.every(url => url.startsWith('http://127.0.0.1:4173/'))).toBeTruthy();
});
