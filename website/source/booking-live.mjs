import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';
import { checkStay } from './booking-scenario.mjs';

const [arrival, departure, guestArg, layout = 'desktop'] = process.argv.slice(2);
const guests = Number(guestArg);
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
assert.ok(validDate(arrival) && validDate(departure) &&
  (Date.parse(departure) - Date.parse(arrival)) >= 2 * 86400000 &&
  Number.isInteger(guests) && guests >= 1 && guests <= 4 && ['desktop', 'mobile'].includes(layout),
  'Usage: npm run test:live -- YYYY-MM-DD YYYY-MM-DD GUESTS [desktop|mobile]. Choose an available stay of at least two nights.');

const browser = await chromium.launch();
try {
  for (const [path, direct] of [['/bestill/', false], ['/en/book/', true]]) {
    const context = await browser.newContext(layout === 'mobile' ? devices['Pixel 7'] : { locale: 'en-US' });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('https://preview.brennvik-panorama.pages.dev' + path);
      const quote = await checkStay(page, async link => {
        const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
        return { checkout: popup, url: () => popup.url() };
      }, { arrival, departure, guests, direct });
      assert.deepEqual(errors, [], 'Uncaught preview script error');
      console.log(path, layout, quote);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
