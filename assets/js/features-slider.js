(function () {
  'use strict';

  const track   = document.querySelector('.features__track');
  const btnPrev = document.querySelector('.features__nav-btn--prev');
  const btnNext = document.querySelector('.features__nav-btn--next');
  const counter = document.querySelector('.features__nav-counter');
  const fill    = document.querySelector('.features__nav-line-fill');

  if (!track || !btnPrev || !btnNext) return;

  const origCards = Array.from(track.querySelectorAll('.features__card'));
  const total = origCards.length;

  /* -- Prepend clones (same order) -- */
  var beforeFrag = document.createDocumentFragment();
  origCards.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    beforeFrag.appendChild(clone);
  });
  track.insertBefore(beforeFrag, track.firstChild);

  /* -- Append clones -- */
  origCards.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  /* current points to the first real card (offset = total clones before) */
  var current = total;
  var busy = false;

  function getStep() {
    var cards = track.querySelectorAll('.features__card');
    if (!cards.length) return 0;
    var gap = parseFloat(getComputedStyle(track).gap) || 10;
    return cards[0].offsetWidth + gap;
  }

  function moveTo(index, animate) {
    track.style.transition = animate
      ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';
    track.style.transform = 'translateX(' + (-getStep() * index) + 'px)';
  }

  function updateUI() {
    var idx = ((current - total) % total + total) % total; /* 0..total-1 */
    counter.textContent = (idx + 1) + '—5';
    fill.style.width = ((idx + 1) / total * 100) + '%';
  }

  function go(newIndex) {
    if (busy) return;
    busy = true;
    current = newIndex;
    moveTo(current, true);
    updateUI();
  }

  track.addEventListener('transitionend', function (e) {
    if (e.propertyName !== 'transform') return;
    busy = false;
    /* silently jump back into the real zone */
    if (current < total) {
      current += total;
      moveTo(current, false);
    } else if (current >= total * 2) {
      current -= total;
      moveTo(current, false);
    }
  });

  btnPrev.addEventListener('click', function () { go(current - 1); });
  btnNext.addEventListener('click', function () { go(current + 1); });

  /* Touch swipe */
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) go(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    var section = document.querySelector('.features');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'ArrowLeft')  go(current - 1);
  });

  /* Resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { moveTo(current, false); }, 150);
  });

  /* Init */
  moveTo(current, false);
  updateUI();
})();
