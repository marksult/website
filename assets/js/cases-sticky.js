(function () {
  var CARD_OFFSET = 20;

  function updateCardTops() {
    var vh = window.innerHeight;
    document.querySelectorAll('.cases__card').forEach(function (card) {
      card.style.top = (vh - card.offsetHeight - CARD_OFFSET) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCardTops);
  } else {
    updateCardTops();
  }

  window.addEventListener('load', updateCardTops);
  window.addEventListener('resize', updateCardTops);
})();
