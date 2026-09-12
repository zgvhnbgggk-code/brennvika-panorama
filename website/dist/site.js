(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menu && nav) {
    const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      nav.classList.toggle('open', expanded);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }

  const dataElement = document.querySelector('#gallery-data');
  const dialog = document.querySelector('#lightbox');
  if (dataElement && dialog && typeof dialog.showModal === 'function') {
    const photos = JSON.parse(dataElement.textContent);
    const photo = dialog.querySelector('.lightbox-img');
    const caption = dialog.querySelector('.lightbox-caption');
    const counter = dialog.querySelector('.lightbox-count');
    let current = 0;
    let opener;
    let startX = null;
    const show = index => {
      current = (index + photos.length) % photos.length;
      const item = photos[current];
      photo.src = item.full;
      photo.alt = item.caption;
      caption.textContent = item.caption;
      counter.textContent = `${current + 1} / ${photos.length}`;
      const next = new Image(); next.src = photos[(current + 1) % photos.length].full;
    };
    const close = () => dialog.close();
    document.querySelectorAll('[data-photo]').forEach(el => {
      el.addEventListener('click', e => {
        const index = Number(el.dataset.photo);
        if (!Number.isInteger(index) || !photos[index]) return;
        e.preventDefault(); opener = el; show(index);
        dialog.showModal(); document.body.classList.add('modal-open');
        dialog.querySelector('.lightbox-close').focus();
      });
    });
    dialog.querySelector('.lightbox-close').addEventListener('click', close);
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    dialog.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (opener) opener.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    photo.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    photo.addEventListener('touchend', e => {
      if (startX === null) return;
      const distance = e.changedTouches[0].clientX - startX;
      if (Math.abs(distance) > 60) show(current + (distance < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  }

  const grid = document.querySelector('.gallery-grid');
  if (grid) {
    const cards = [...grid.querySelectorAll('.gallery-card')];
    const count = document.querySelector('#gallery-count');
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
        grid.classList.toggle('filtered', filter !== 'all');
        count.textContent = `${cards.filter(c => !c.hidden).length} ${count.dataset.noun}`;
      });
    });
  }

  const bookingRoot = document.querySelector('#lodgify-book-now-box');
  if (bookingRoot) {
    const loading = bookingRoot.querySelector('.booking-status');
    const unavailable = () => {
      if (loading && loading.isConnected) loading.textContent = document.documentElement.lang === 'nb'
        ? 'Bestillingsfeltet kunne ikke lastes. Bruk lenken nedenfor for å se ledige datoer.'
        : 'The booking form could not load. Use the link below to check available dates.';
    };
    const bookingScript = document.querySelector('script[src*="renderBookNowBox"]');
    if (bookingScript) bookingScript.addEventListener('error', unavailable);
    setTimeout(unavailable, 18000);
  }
})();
