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

  /* ─── helpers ─────────────────────────────────────────── */

  function cardWidth() {
    return cards[0].getBoundingClientRect().width;
  }

  function getGap() {
    return parseFloat(getComputedStyle(track).gap) || 10;
  }

  function getStep() {
    return cardWidth() + getGap();
  }

  function setX(x, animate) {
    track.style.transition = animate
      ? 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    track.style.transform  = 'translate3d(' + x + 'px, 0, 0)';
  }

  function updateUI() {
    counter.textContent  = (current + 1) + '—5';
    fill.style.width     = ((current + 1) / total * 100) + '%';
    btnPrev.disabled     = current === 0;
    btnNext.disabled     = current === total - 1;
  }

  function goTo(index, animate) {
    current = Math.max(0, Math.min(index, total - 1));
    setX(-getStep() * current, animate);
    updateUI();
  }

  /* ─── buttons ──────────────────────────────────────────── */

  btnPrev.addEventListener('click', function () { goTo(current - 1, true); });
  btnNext.addEventListener('click', function () { goTo(current + 1, true); });

  /* ─── keyboard ─────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    var s = document.querySelector('.features');
    if (!s) return;
    var r = s.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowRight') goTo(current + 1, true);
    if (e.key === 'ArrowLeft')  goTo(current - 1, true);
  });

  /* ─── touch (registered on slider, not track) ──────────── */
  /*                                                           */
  /*  CSS touch-action:pan-y on .features__slider lets the    */
  /*  browser handle vertical scroll natively, so we never    */
  /*  need e.preventDefault() — all handlers stay passive:true */
  /*  and work identically on Safari & Chrome.                */

  var touchStartX = 0;
  var touchStartY = 0;
  var touchStartT = 0;
  var touchBase   = 0;
  var touchActive = false;
  var rafId       = null;
  var pendingX    = 0;

  function applyRaf() {
    rafId = null;
    track.style.transform = 'translate3d(' + pendingX + 'px, 0, 0)';
  }

  slider.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartT = Date.now();
    touchBase   = -getStep() * current;
    touchActive = true;

    track.style.transition = 'none';
  }, { passive: true });

  slider.addEventListener('touchmove', function (e) {
    if (!touchActive || e.touches.length !== 1) return;

    var dx  = e.touches[0].clientX - touchStartX;
    var dy  = e.touches[0].clientY - touchStartY;

    /* Ignore clearly vertical scrolls */
    if (Math.abs(dy) > Math.abs(dx) * 1.5) return;

    /* Resistance at first/last card */
    var offset = dx;
    if ((current === 0 && dx > 0) || (current === total - 1 && dx < 0)) {
      offset = dx * 0.2;
    }

    pendingX = touchBase + offset;
    if (!rafId) rafId = requestAnimationFrame(applyRaf);
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    if (!touchActive) return;
    touchActive = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

    var dx  = e.changedTouches[0].clientX - touchStartX;
    var dt  = Math.max(Date.now() - touchStartT, 1);
    var vel = Math.abs(dx) / dt;                    /* px / ms */
    var thr = Math.min(getStep() * 0.25, 80);       /* max 80px */

    var next = current;
    if      (dx < -thr || (vel > 0.3 && dx < -8))  next = current + 1;
    else if (dx >  thr || (vel > 0.3 && dx >  8))  next = current - 1;

    goTo(next, true);
  }, { passive: true });

  slider.addEventListener('touchcancel', function () {
    if (!touchActive) return;
    touchActive = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    goTo(current, true);
  }, { passive: true });

  /* ─── resize ───────────────────────────────────────────── */

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { goTo(current, false); }, 150);
  });

  /* ─── init ─────────────────────────────────────────────── */

  goTo(0, false);

}());
