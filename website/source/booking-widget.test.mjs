import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setImmediate as mutationsSettled } from 'node:timers/promises';
import test from 'node:test';
import { SourceTextModule } from 'node:vm';
import { JSDOM } from 'jsdom';

const guard = await readFile(new URL('../dist/booking.js', import.meta.url), 'utf8');
const booking = JSON.parse(await readFile(new URL('booking.json', import.meta.url), 'utf8'));

async function fixture(t, language) {
  const embed = language === 'nb' ? booking.embed_no : booking.embed_en;
  const dom = new JSDOM(`<html lang="${language}"><div class="booking-embed">${embed}</div>
    <div class="booking-direct"><a href="${booking.checkout}">Checkout</a></div></html>`,
    { runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { document } = dom.window;
  let onTimeout;
  dom.window.setTimeout = callback => { onTimeout = callback; };
  const module = new SourceTextModule(guard, { context: dom.getInternalVMContext() });
  await module.link(() => { throw new Error('Unexpected module import'); });
  await module.evaluate();
  const root = document.querySelector('#lodgify-book-now-box');
  const status = root.nextElementSibling;
  const fallback = document.querySelector('.booking-direct a');

  async function render(url) {
    const cta = document.createElement('a');
    cta.dataset.testid = 'book-now-box.cta-button';
    cta.href = url;
    root.replaceChildren(cta);
    await mutationsSettled();
    return cta;
  }
  return { document, root, status, fallback, render, timeout: () => onTimeout() };
}

test('widget failure after selection shows a separate status and keeps the last stay', async t => {
  const { root, status, fallback, render } = await fixture(t, 'nb');
  const selected = new URL(booking.checkout);
  Object.entries({ currency: 'EUR', arrival: '2027-03-10', departure: '2027-03-13', guests: '4' })
    .forEach(([key, value]) => selected.searchParams.set(key, value));
  const cta = await render(selected.href);
  selected.searchParams.set('currency', 'NOK');
  assert.equal(cta.href, selected.href);
  assert.equal(status.hidden, true);

  root.replaceChildren();
  await mutationsSettled();
  assert.equal(root.hidden, true);
  assert.equal(status.hidden, false);
  assert.match(status.textContent, /Bestillingsfeltet kunne ikke lastes/);
  assert.equal(status.getAttribute('role'), 'status');
  assert.equal(fallback.href, selected.href);
  assert.equal(fallback.closest('[hidden]'), null);
});

test('failed provider script shows English feedback and a usable checkout', async t => {
  const { document, root, status, fallback } = await fixture(t, 'en');
  document.querySelector('script[src]').dispatchEvent(new document.defaultView.Event('error'));
  assert.equal(root.hidden, true);
  assert.equal(status.hidden, false);
  assert.match(status.textContent, /The booking form could not load/);
  assert.equal(fallback.href, booking.checkout);
});

test('slow widget can recover after timeout and clear the fallback message', async t => {
  const { root, status, render, timeout } = await fixture(t, 'en');
  timeout();
  assert.equal(root.hidden, true);
  assert.equal(status.hidden, false);
  await render(booking.checkout);
  assert.equal(root.hidden, false);
  assert.equal(status.hidden, true);
  assert.equal(root.closest('.booking-embed').style.minHeight, '');
});
