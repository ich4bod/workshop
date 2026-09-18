const { chromium } = require('playwright-core');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');

const pageUrl = process.env.PLAY_URL || pathToFileURL(resolve('index.html')).href;

(async () => {
  const browser = await chromium.launch({ headless: true });

  async function clockPage(name, width) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    if (!process.env.PLAY_URL) await context.route('**/*', route => route.request().url().startsWith('file:') ? route.continue() : route.abort());
    const page = await context.newPage();
    await page.goto(pageUrl);
    await page.screenshot({ path: `/tmp/interruption-clock-${name}-${width}.png`, fullPage: true });
    return { context, page };
  }

  async function choose(page, label) {
    await page.getByRole('button', { name: label }).click();
    await page.getByRole('button', { name: 'Let the clock clear →' }).click();
  }

  const blue = await clockPage('blue-opening', 1280);
  await blue.page.getByText('INTERVAL 01').waitFor();
  await choose(blue.page, 'Tag the blue valve');
  await blue.page.getByText('Blue valve: safe water route').waitFor();
  await choose(blue.page, 'Open the blue valve');
  await blue.page.getByText('INTERVAL 03').waitFor();
  await choose(blue.page, 'Send the cart by the blue route');
  await blue.page.getByText('The cart finds the dry road.').waitFor();
  await blue.page.screenshot({ path: '/tmp/interruption-clock-blue-dawn-1280.png', fullPage: true });
  await blue.context.close();

  const red = await clockPage('red-opening', 390);
  await red.page.getByText('INTERVAL 01').waitFor();
  await choose(red.page, 'Run the pump blind');
  await red.page.getByText('Nothing marked. Nothing certain.').waitFor();
  await red.page.getByRole('button', { name: 'Open the blue valve' }).click();
  await red.page.getByText('THE CLOCK LEFT NO BLUE CLUE.').waitFor();
  await choose(red.page, 'Pry the red valve');
  await red.page.getByText('Red valve: damaged line').waitFor();
  await choose(red.page, 'Send it by the red route');
  await red.page.getByText('The clock leaves a cost.').waitFor();
  await red.page.getByText('battery is gone').waitFor();
  await red.page.screenshot({ path: '/tmp/interruption-clock-red-dawn-390.png', fullPage: true });
  await red.context.close();

  await browser.close();
  console.log('Offline browser playthroughs passed: blue route reaches dry road; red route names its battery cost.');
})();
