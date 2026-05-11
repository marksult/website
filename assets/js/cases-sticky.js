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
    var title   = document.querySelector('.section-title');
    var wrapper = document.querySelector('.cases-wrapper');
    if (!title || !wrapper) return;

    var isFixed   = false;
    var fixedTop  = 0;
    var ph = document.createElement('div');

    function applyFixed() {
      if (isFixed) return;
      var r = title.getBoundingClientRect();
      fixedTop = r.top;
      ph.style.cssText = 'height:' + r.height + 'px;visibility:hidden;pointer-events:none;';
      title.parentNode.insertBefore(ph, title.nextSibling);
      title.style.cssText = 'position:fixed;top:' + fixedTop + 'px;left:0;right:0;z-index:0;pointer-events:none;';
      isFixed = true;
    }

    function removeFixed() {
      if (!isFixed) return;
      title.style.cssText = '';
      if (ph.parentNode) ph.parentNode.removeChild(ph);
      isFixed = false;
    }

    function onScroll() {
      var wRect = wrapper.getBoundingClientRect();
      var lastCard = wrapper.querySelector('.cases__card:last-child');
      var lRect = lastCard ? lastCard.getBoundingClientRect() : null;

      var past = wRect.top < 0 && lRect && lRect.bottom > 0;

      if (past) {
        applyFixed();
      } else {
        removeFixed();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', function () {
      removeFixed();
      onScroll();
    });

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
