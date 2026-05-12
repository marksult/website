(function () {
  'use strict';

  const track    = document.querySelector('.features__track');
  const btnPrev  = document.querySelector('.features__arrow--prev');
  const btnNext  = document.querySelector('.features__arrow--next');
  const counter  = document.querySelector('.features__counter');
  const fill     = document.querySelector('.features__progress-fill');

  if (!track || !btnPrev || !btnNext) return;

  const cards  = track.querySelectorAll('.features__card');
  const total  = cards.length;
  let   current = 0;

  const CARD_W = 900;
  const GAP    = 15;

  function getOffset() {
    // On mobile/tablet use 15px left pad, on desktop use the margin-left of slider
    if (window.innerWidth < 768) return 15;
    if (window.innerWidth < 1024) return 20;
    return 263;
  }

  function update(index) {
    current = Math.max(0, Math.min(index, total - 1));

    const step   = CARD_W + GAP;
    const offset = getOffset();

    // First card sits at margin-left (getOffset), subsequent cards shift left
    // But since .features__slider already has margin-left: 263px on desktop,
    // we just translate by step * current
    track.style.transform = `translateX(${-(step * current)}px)`;

    // Counter: "current+1—total"
    counter.textContent = `${current + 1}\u20145`;

    // Progress bar
    fill.style.width = `${((current + 1) / total) * 100}%`;

    // Arrow states
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  btnPrev.addEventListener('click', () => update(current - 1));
  btnNext.addEventListener('click', () => update(current + 1));

  // Touch / swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      update(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const slider = document.querySelector('.features');
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') update(current + 1);
    if (e.key === 'ArrowLeft')  update(current - 1);
  });

  // Re-calc on resize (offset changes)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => update(current), 150);
  });

  // Init
  update(0);
})();
