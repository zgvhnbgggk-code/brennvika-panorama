import assert from 'node:assert/strict';
import { normalizeCheckout } from '../dist/booking.js';

const expected = 'https://checkout.lodgify.com/en/dan-skoglund/828625/reservation?currency=NOK';
const selected = 'https://checkout.lodgify.com/en/dan-skoglund/828625/reservation?currency=EUR&arrival=2026-09-20&departure=2026-09-22&guests=2&ref=bnbox';
const result = new URL(normalizeCheckout(selected, expected));
assert.equal(result.searchParams.get('currency'), 'NOK');
assert.equal(result.searchParams.get('arrival'), '2026-09-20');
assert.equal(result.searchParams.get('departure'), '2026-09-22');
assert.equal(result.searchParams.get('guests'), '2');
assert.equal(result.searchParams.get('ref'), 'bnbox');
assert.equal(normalizeCheckout(result.href, expected), result.href);
assert.equal(normalizeCheckout('https://example.org/reservation', expected), null);
assert.equal(normalizeCheckout('https://checkout.lodgify.com/en/dan-skoglund/999999/reservation', expected), null);
assert.equal(normalizeCheckout('javascript:alert(1)', expected), null);
assert.equal(normalizeCheckout('http://checkout.lodgify.com/en/dan-skoglund/828625/reservation', expected), null);
console.log('Booking links keep dates and guest count, select NOK, and reject other destinations.');
