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
    const cardW = card.offsetWidth;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || parseInt(style.columnGap) || 10;
    return cardW + gap;
  }

  function update(index) {
    current = Math.max(0, Math.min(index, total - 1));

    const step = getStep();
    track.style.transform = 'translateX(' + (-(step * current)) + 'px)';

    counter.textContent = (current + 1) + '\u20145';

    fill.style.width = ((current + 1) / total * 100) + '%';

    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  btnPrev.addEventListener('click', function () { update(current - 1); });
  btnNext.addEventListener('click', function () { update(current + 1); });

  /* Touch swipe */
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      update(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    var section = document.querySelector('.features');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') update(current + 1);
    if (e.key === 'ArrowLeft')  update(current - 1);
  });

  /* Resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { update(current); }, 150);
  });

  update(0);
})();
