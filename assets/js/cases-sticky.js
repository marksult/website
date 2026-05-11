(function () {
  var CARD_OFFSET = 20;

  /* ── sticky cards ─────────────────────────────────────── */
  function updateCardTops() {
    var vh = window.innerHeight;
    document.querySelectorAll('.cases__card').forEach(function (card) {
      card.style.top = (vh - card.offsetHeight - CARD_OFFSET) + 'px';
    });
  }

  /* ── fixed heading ────────────────────────────────────── */
  function initFixedTitle() {
    var title   = document.querySelector('.section-title');
    var cases   = document.querySelector('.cases');
    if (!title || !cases) return;

    var ph = document.createElement('div');
    ph.style.cssText = 'visibility:hidden;pointer-events:none;';
    title.parentNode.insertBefore(ph, title.nextSibling);

    var isFixed = false;
    var metrics = {};

    function recalc() {
      /* page-absolute positions — reliable on all breakpoints */
      metrics.titleH  = title.offsetHeight;
      metrics.titleY  = title.getBoundingClientRect().top + window.pageYOffset;
      metrics.casesY  = cases.getBoundingClientRect().top  + window.pageYOffset;
      metrics.casesH  = cases.offsetHeight;

      ph.style.height = metrics.titleH + 'px';

      if (isFixed) {
        removeFixed();
        onScroll();
      }
    }

    function applyFixed() {
      if (isFixed) return;
      title.style.cssText =
        'position:fixed;top:' + (metrics.titleY - window.pageYOffset) + 'px' +
        ';left:0;right:0;z-index:0;pointer-events:none;';
      isFixed = true;
    }

    function removeFixed() {
      if (!isFixed) return;
      title.style.cssText = '';
      isFixed = false;
    }

    function onScroll() {
      var scrollY   = window.pageYOffset;
      var triggerAt = metrics.titleY;                       /* when heading natural pos reached */
      var stopAt    = metrics.casesY + metrics.casesH;     /* after last card */

      if (scrollY >= triggerAt && scrollY < stopAt - metrics.titleH) {
        applyFixed();
      } else {
        removeFixed();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', function () {
      removeFixed();
      recalc();
    });

    /* wait for fonts + images then recalc */
    window.addEventListener('load', function () {
      recalc();
      onScroll();
    });

    recalc();
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
