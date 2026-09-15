// Keep the official Lodgify widget, with a working route out if it fails.
export function normalizeCheckout(href, expectedHref) {
  try {
    const expected = new URL(expectedHref);
    const destination = new URL(href, expected);
    if (expected.protocol !== 'https:' || destination.origin !== expected.origin || destination.pathname !== expected.pathname) return null;
    destination.searchParams.set('currency', 'NOK');
    return destination.href;
  } catch {
    return null;
  }
}

function watchBooking() {
  const root = document.querySelector('#lodgify-book-now-box');
  const fallback = document.querySelector('.booking-direct a');
  if (!root || !fallback) return;
  const expectedHref = fallback.href;
  const initial = normalizeCheckout(expectedHref, expectedHref);
  if (!initial) return;
  fallback.href = initial;

  // This message lives outside React's root, so a widget crash cannot remove it.
  const feedback = document.createElement('p');
  feedback.className = 'booking-status';
  feedback.setAttribute('role', 'status');
  feedback.hidden = true;
  feedback.textContent = document.documentElement.lang === 'nb'
    ? 'Bestillingsfeltet kunne ikke lastes. Åpne bestillingen nedenfor for å velge datoer og se pris hos Lodgify.'
    : 'The booking form could not load. Open booking below to choose your dates and see prices at Lodgify.';
  root.insertAdjacentElement('afterend', feedback);
  const container = root.closest('.booking-embed');
  let hasRendered = false;
  let timedOut = false;

  const showFallback = () => {
    root.hidden = true;
    feedback.hidden = false;
    if (container) container.style.minHeight = '0';
  };
  const inspect = () => {
    const cta = root.querySelector('a[data-testid="book-now-box.cta-button"]');
    const href = cta && normalizeCheckout(cta.href, expectedHref);
    if (href) {
      hasRendered = true;
      if (cta.href !== href) cta.href = href;
      cta.relList.add('noopener');
      // Preserve Lodgify's selected dates and guest parameters in the fallback.
      if (fallback.href !== href) fallback.href = href;
      root.hidden = false;
      feedback.hidden = true;
      if (container) container.style.removeProperty('min-height');
    } else if (hasRendered || timedOut) {
      showFallback();
    }
  };
  const observer = new MutationObserver(inspect);
  observer.observe(root, {subtree:true, childList:true, attributes:true, attributeFilter:['href']});
  setTimeout(() => { timedOut = true; inspect(); }, 18000);
  const script = document.querySelector('script[src*="renderBookNowBox"]');
  if (script) script.addEventListener('error', showFallback);
  root.addEventListener('click', inspect, true);
  root.addEventListener('auxclick', inspect, true);
  inspect();
}

if (typeof document !== 'undefined') watchBooking();
