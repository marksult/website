(function () {
  'use strict';

  var track   = document.querySelector('.features__track');
  var btnPrev = document.querySelector('.features__nav-btn--prev');
  var btnNext = document.querySelector('.features__nav-btn--next');
  var counter = document.querySelector('.features__nav-counter');
  var fill    = document.querySelector('.features__nav-line-fill');

  if (!track || !btnPrev || !btnNext) return;

  var cards = track.querySelectorAll('.features__card');
  var total = cards.length;
  var current = 0;

  function getStep() {
    var gap = parseFloat(getComputedStyle(track).gap) || 10;
    return cards[0].offsetWidth + gap;
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
    var section = document.querySelector('.features');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') snapTo(current + 1, true);
    if (e.key === 'ArrowLeft')  snapTo(current - 1, true);
  });

  /* ── Touch swipe ── */
  var startX = 0;
  var startY = 0;
  var startT = 0;
  var locked = null; /* null | 'h' | 'v' */
  var dragging = false;
  var base = 0;

  track.addEventListener('touchstart', function (e) {
    startX   = e.touches[0].clientX;
    startY   = e.touches[0].clientY;
    startT   = Date.now();
    locked   = null;
    dragging = false;
    base     = -getStep() * current;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    var dx = e.touches[0].clientX - startX;
    var dy = e.touches[0].clientY - startY;

    /* Lock direction on first significant move */
    if (locked === null) {
      if (Math.abs(dx) > Math.abs(dy)) {
        locked = 'h';
      } else {
        locked = 'v';
        return;
      }
    }
    if (locked === 'v') return;

    /* Horizontal — prevent page scroll */
    e.preventDefault();
    dragging = true;

    /* Edge resistance */
    var offset = dx;
    if ((current === 0 && dx > 0) || (current === total - 1 && dx < 0)) {
      offset = dx * 0.2;
    }

    track.style.transform = 'translateX(' + (base + offset) + 'px)';
  }, { passive: false });

  track.addEventListener('touchend', function (e) {
    if (!dragging) return;

    var dx  = e.changedTouches[0].clientX - startX;
    var dt  = Math.max(Date.now() - startT, 1);
    var vel = Math.abs(dx) / dt;
    var threshold = getStep() * 0.2;

    var next = current;
    if      (dx < -threshold || (vel > 0.4 && dx < 0)) next = current + 1;
    else if (dx >  threshold || (vel > 0.4 && dx > 0)) next = current - 1;

    snapTo(next, true);
  }, { passive: true });

  track.addEventListener('touchcancel', function () {
    snapTo(current, true);
  }, { passive: true });

  /* ── Resize ── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { snapTo(current, false); }, 150);
  });

  /* ── Init ── */
  snapTo(0, false);
})();
