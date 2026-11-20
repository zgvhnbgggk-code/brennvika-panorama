// Shared by the Playwright runner and interactive browser checks. Stops at the quote.
import assert from 'node:assert/strict';

const dayName = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' });
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

async function chooseDay(page, isoDate) {
  const date = new Date(isoDate + 'T00:00:00Z');
  const month = monthName.format(date);
  await page.getByRole('grid').first().waitFor({ state: 'visible' });
  const grid = page.getByRole('grid', { name: month, exact: true });
  for (let i = 0; !(await grid.count()) && i < 24; i++) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  assert.ok(await grid.count(), 'Calendar does not offer ' + month);
  const day = grid.getByRole('button', { name: dayName.format(date), exact: true });
  assert.ok(await day.isEnabled(), 'Unavailable test date ' + isoDate);
  await day.click();
}

export async function checkStay(page, openCheckout, { arrival, departure, guests, direct }) {
  const root = page.locator('#lodgify-book-now-box');
  const button = name => root.getByRole('button', { name, exact: true });
  await button('open date-picker').click();
  await chooseDay(page, arrival);
  await chooseDay(page, departure);
  for (let i = 1; i < guests; i++) await button('Add').click();

  const cta = root.locator('a[data-testid="book-now-box.cta-button"]');
  const fallback = page.locator('.booking-direct a');
  const { checkout, url } = await openCheckout(direct ? fallback : cta);
  await checkout.getByRole('heading', { name: 'Your contact details' }).waitFor({ state: 'visible' });
  await checkout.getByText('Brennvika Panorama', { exact: true }).waitFor({ state: 'visible' });
  const dateRange = [arrival, departure].map(date => shortDate.format(new Date(date + 'T00:00:00Z'))).join(' - ');
  await checkout.getByText(dateRange, { exact: true }).waitFor({ state: 'visible' });
  await checkout.getByText(guests + (guests === 1 ? ' guest' : ' guests'), { exact: true }).waitFor({ state: 'visible' });
  await checkout.getByText('Total (NOK)', { exact: true }).waitFor({ state: 'visible' });

  const dest = new URL(await url());
  assert.equal(dest.origin, 'https://checkout.lodgify.com');
  assert.equal(dest.pathname, '/dan-skoglund/828625/contact');
  assert.equal(dest.searchParams.get('arrival'), arrival);
  assert.equal(dest.searchParams.get('departure'), departure);
  assert.equal(dest.searchParams.get('currency'), 'NOK');
  assert.equal(dest.searchParams.get('adults') ?? dest.searchParams.get('guests'), String(guests));

  const summary = (await checkout.locator('body').innerText()).replaceAll('\u00a0', ' ');
  const amount = pattern => {
    const match = summary.match(pattern);
    assert.ok(match, 'Missing price line: ' + pattern);
    return Math.round(Number(match[1].replaceAll(',', '')) * 100);
  };
  const total = amount(/Total\s*\(NOK\)\s*NOK\s*([\d,]+\.\d{2})/i);
  const rent = amount(/Rental\s*NOK\s*([\d,]+\.\d{2})/i);
  const fees = amount(/Fees\s*NOK\s*([\d,]+\.\d{2})/i);
  assert.ok(total > 0);
  assert.equal(total, rent + fees, 'Checkout total differs from rent after discounts plus fees');
  const formatted = (total / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const escaped = formatted.replaceAll('.', '\\.');
  await root.getByText(new RegExp('^(?:kr|NOK)\\s*' + escaped + '$', 'i')).waitFor({ state: 'visible' });
  return { arrival, departure, guests, rentalNOK: rent / 100, feesNOK: fees / 100, totalNOK: total / 100 };
}
