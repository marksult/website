(function () {
  'use strict';

  const track   = document.querySelector('.features__track');
  const btnPrev = document.querySelector('.features__nav-btn--prev');
  const btnNext = document.querySelector('.features__nav-btn--next');
  const counter = document.querySelector('.features__nav-counter');
  const fill    = document.querySelector('.features__nav-line-fill');

  if (!track || !btnPrev || !btnNext) return;

  const cards = track.querySelectorAll('.features__card');
  const total = cards.length;
  let current = 0;

  function getStep() {
    const card = cards[0];
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 10;
    return card.offsetWidth + gap;
  }

  function updateUI() {
    counter.textContent = (current + 1) + '—5';
    fill.style.width = ((current + 1) / total * 100) + '%';
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  function snapTo(index, animate) {
    current = Math.max(0, Math.min(index, total - 1));
    track.style.transition = animate
      ? 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    track.style.transform = 'translateX(' + (-getStep() * current) + 'px)';
    updateUI();
  }

  /* ── Arrow buttons ── */
  btnPrev.addEventListener('click', function () { snapTo(current - 1, true); });
  btnNext.addEventListener('click', function () { snapTo(current + 1, true); });

  /* ── Keyboard ── */
  document.addEventListener('keydown', function (e) {
    const section = document.querySelector('.features');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') snapTo(current + 1, true);
    if (e.key === 'ArrowLeft')  snapTo(current - 1, true);
  });

  /* ── Touch swipe with live drag ── */
  let touchStartX   = 0;
  let touchStartY   = 0;
  let touchStartT   = 0;
  let baseTranslate = 0;
  let isDragging    = false;
  let isScrolling   = null; /* null = unknown, true = vertical, false = horizontal */

  track.addEventListener('touchstart', function (e) {
    touchStartX   = e.touches[0].clientX;
    touchStartY   = e.touches[0].clientY;
    touchStartT   = Date.now();
    baseTranslate = -getStep() * current;
    isDragging    = false;
    isScrolling   = null;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;

    /* Determine scroll direction once */
    if (isScrolling === null) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
        isScrolling = false; /* horizontal swipe */
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
        isScrolling = true;  /* vertical scroll */
      } else {
        return;
      }
    }

    if (isScrolling) return; /* let page scroll naturally */

    isDragging = true;

    /* Resistance at edges */
    let offset = dx;
    const atStart = current === 0        && dx > 0;
    const atEnd   = current === total - 1 && dx < 0;
    if (atStart || atEnd) offset = dx * 0.25;

    track.style.transform = 'translateX(' + (baseTranslate + offset) + 'px)';
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;

    const dx       = e.changedTouches[0].clientX - touchStartX;
    const dt       = Math.max(Date.now() - touchStartT, 1);
    const velocity = Math.abs(dx) / dt; /* px/ms */
    const step     = getStep();
    const threshold = step * 0.25;      /* 25% of card width */
    const fastSwipe = velocity > 0.3;   /* fast flick */

    let newIndex = current;
    if      (dx < -threshold || (fastSwipe && dx < 0)) newIndex = current + 1;
    else if (dx >  threshold || (fastSwipe && dx > 0)) newIndex = current - 1;

    snapTo(newIndex, true);
  }, { passive: true });

  /* ── Resize ── */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { snapTo(current, false); }, 150);
  });

  /* ── Init ── */
  snapTo(0, false);
})();
