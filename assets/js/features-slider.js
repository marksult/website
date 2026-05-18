(function () {
  'use strict';

  var slider  = document.querySelector('.features__slider');
  var track   = document.querySelector('.features__track');
  var btnPrev = document.querySelector('.features__nav-btn--prev');
  var btnNext = document.querySelector('.features__nav-btn--next');
  var counter = document.querySelector('.features__nav-counter');
  var fill    = document.querySelector('.features__nav-line-fill');

  if (!slider || !track || !btnPrev || !btnNext) return;

  var cards   = track.querySelectorAll('.features__card');
  var total   = cards.length;
  var current = 0;

  function getStep() {
    var gap = parseFloat(getComputedStyle(track).gap) || 10;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function updateUI() {
    counter.textContent = (current + 1) + '—5';
    fill.style.width    = (current / (total - 1) * 100) + '%';
    btnPrev.disabled    = current === 0;
    btnNext.disabled    = current === total - 1;
  }

  function goTo(index, animate, isTouch) {
    current = Math.max(0, Math.min(index, total - 1));
    if (!animate) {
      track.style.transition = 'none';
    } else if (isTouch) {
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      track.style.transition = 'transform 0.6s cubic-bezier(0.45, 0, 0.15, 1)';
    }
    track.style.transform = 'translate3d(' + (-getStep() * current) + 'px,0,0)';
    updateUI();
  }

  /* ── buttons ── */
  btnPrev.addEventListener('click', function () { goTo(current - 1, true); });
  btnNext.addEventListener('click', function () { goTo(current + 1, true); });

  /* ── keyboard ── */
  document.addEventListener('keydown', function (e) {
    var s = document.querySelector('.features');
    if (!s) return;
    var r = s.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowRight') goTo(current + 1, true);
    if (e.key === 'ArrowLeft')  goTo(current - 1, true);
  });

  /* ── touch ── */
  var startX      = 0;
  var startY      = 0;
  var startT      = 0;
  var base        = 0;
  var cachedStep  = 0;
  var dir         = null;  /* null | 'h' | 'v' */
  var active      = false;

  slider.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    cachedStep = getStep();           /* cache once — no reflow during drag */
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startT = Date.now();
    base   = -cachedStep * current;
    dir    = null;
    active = true;
    track.style.transition = 'none';
  }, { passive: true });

  slider.addEventListener('touchmove', function (e) {
    if (!active || e.touches.length !== 1) return;

    var dx  = e.touches[0].clientX - startX;
    var dy  = e.touches[0].clientY - startY;
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);

    /* Lock direction after 4px */
    if (dir === null) {
      if (adx < 4 && ady < 4) return;
      dir = adx >= ady ? 'h' : 'v';
    }

    if (dir === 'v') return;

    /* Stop page scroll for horizontal swipe */
    e.preventDefault();

    /* Edge resistance */
    var offset = dx;
    if ((current === 0 && dx > 0) || (current === total - 1 && dx < 0)) {
      offset = dx * 0.18;
    }

    track.style.transform = 'translate3d(' + (base + offset) + 'px,0,0)';
  }, { passive: false });

  slider.addEventListener('touchend', function (e) {
    if (!active) return;
    active = false;
    if (dir === 'v') return;

    var dx  = e.changedTouches[0].clientX - startX;
    var dt  = Math.max(Date.now() - startT, 1);
    var vel = Math.abs(dx) / dt;
    var thr = Math.min(cachedStep * 0.22, 70);

    var next = current;
    if      (dx < -thr || (vel > 0.3 && dx < -6)) next = current + 1;
    else if (dx >  thr || (vel > 0.3 && dx >  6)) next = current - 1;

    goTo(next, true, true);
  }, { passive: true });

  slider.addEventListener('touchcancel', function () {
    if (!active) return;
    active = false;
    goTo(current, true, true);
  }, { passive: true });

  /* ── resize ── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { goTo(current, false); }, 150);
  });

  /* Peek clone: card 1 peeks on the right when on last card */
  var peek = cards[0].cloneNode(true);
  peek.setAttribute('aria-hidden', 'true');
  peek.setAttribute('tabindex', '-1');
  track.appendChild(peek);

  goTo(0, false);
}());
