(function () {
  var CARD_OFFSET = 20;

  /* ── sticky cards ─────────────────────────────────────── */
  function updateCardTops() {
    var vh = window.innerHeight;
    document.querySelectorAll('.cases__card').forEach(function (card) {
      var h = card.offsetHeight;
      card.style.top = (vh - h - CARD_OFFSET) + 'px';
    });
  }

  /* ── fixed heading ────────────────────────────────────── */
  function initFixedTitle() {
    var title = document.querySelector('.section-title');
    var wrapper = document.querySelector('.cases-wrapper');
    if (!title || !wrapper) return;

    /* create invisible placeholder to preserve layout space */
    var placeholder = title.cloneNode(true);
    placeholder.classList.add('section-title--placeholder');
    placeholder.removeAttribute('id');
    title.parentNode.insertBefore(placeholder, title.nextSibling);

    function onScroll() {
      var wrapperRect = wrapper.getBoundingClientRect();
      var lastCard = wrapper.querySelector('.cases__card:last-child');
      var lastCardRect = lastCard ? lastCard.getBoundingClientRect() : null;

      /* fix heading while wrapper is on screen and last card hasn't passed */
      var inRange = wrapperRect.top <= 0 && lastCardRect && lastCardRect.bottom > 0;

      if (inRange) {
        var titleRect = placeholder.getBoundingClientRect();
        title.classList.add('section-title--fixed');
        title.style.top = titleRect.top + 'px';
      } else {
        title.classList.remove('section-title--fixed');
        title.style.top = '';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── init ─────────────────────────────────────────────── */
  function init() {
    updateCardTops();
    initFixedTitle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', updateCardTops);
  window.addEventListener('resize', updateCardTops);
})();
