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
    var wrapper = document.querySelector('.cases-wrapper');
    if (!title || !wrapper) return;

    /* placeholder preserves layout space when title becomes fixed */
    var ph = document.createElement('div');
    ph.style.cssText = 'display:none;visibility:hidden;pointer-events:none;';
    wrapper.insertBefore(ph, title);

    var isFixed  = false;
    var m        = {};

    function measure() {
      var tRect = title.getBoundingClientRect();
      var wRect = wrapper.getBoundingClientRect();
      var scrollY = window.pageYOffset;

      m.wrapperAbsY  = wRect.top  + scrollY;   /* absolute top of wrapper  */
      m.wrapperAbsH  = wrapper.offsetHeight;
      m.titleAbsY    = tRect.top  + scrollY;   /* absolute top of title    */
      m.titleH       = tRect.height;

      /*
        When wrapper's top reaches viewport top (scrollY == wrapperAbsY),
        the title's viewport Y = titleAbsY - wrapperAbsY  →  always constant.
      */
      m.fixedTop     = m.titleAbsY - m.wrapperAbsY;
      m.triggerAt    = m.wrapperAbsY;                           /* enter  */
      m.stopAt       = m.wrapperAbsY + m.wrapperAbsH - m.titleH; /* leave  */

      ph.style.height = m.titleH + 'px';
    }

    function applyFixed() {
      if (isFixed) return;
      var marginTop = parseFloat(window.getComputedStyle(title).marginTop) || 0;
      ph.style.height = (m.titleH + marginTop) + 'px';
      ph.style.display = 'block';
      title.style.cssText =
        'position:fixed;top:' + m.fixedTop + 'px' +
        ';left:0;right:0;z-index:0;pointer-events:none;';
      isFixed = true;
    }

    function removeFixed() {
      if (!isFixed) return;
      ph.style.display = 'none';
      title.style.cssText = '';
      isFixed = false;
    }

    function onScroll() {
      var scrollY = window.pageYOffset;
      if (scrollY >= m.triggerAt && scrollY < m.stopAt) {
        applyFixed();
      } else {
        removeFixed();
      }
    }

    function init() {
      removeFixed();
      measure();
      onScroll();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', init);
    window.addEventListener('load',   init);

    init();
  }

  /* ── boot ─────────────────────────────────────────────── */
  function boot() {
    updateCardTops();
    initFixedTitle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('load',   updateCardTops);
  window.addEventListener('resize', updateCardTops);
})();
