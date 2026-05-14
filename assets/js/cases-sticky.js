(function () {
  var CARD_OFFSET = 20;

  function updateCardTops() {
    var vh    = window.innerHeight;
    var cards = document.querySelectorAll('.cases__card');

    /* Read all heights first (one reflow) */
    var heights = [];
    cards.forEach(function (card) {
      heights.push(card.getBoundingClientRect().height);
    });

    /* Write all tops after (no extra reflow) */
    cards.forEach(function (card, i) {
      var top = vh - heights[i] - CARD_OFFSET;
      card.style.top = Math.min(top, 0) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCardTops);
  } else {
    updateCardTops();
  }

  window.addEventListener('load', updateCardTops);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCardTops, 150);
  });
}());
