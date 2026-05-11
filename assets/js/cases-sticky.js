(function () {
  var OFFSET = 20;

  function updateStickyTops() {
    var vh = window.innerHeight;
    document.querySelectorAll('.cases__card').forEach(function (card) {
      var cardH = card.offsetHeight;
      var top = cardH > vh ? vh - cardH - OFFSET : OFFSET;
      card.style.top = top + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateStickyTops);
  } else {
    updateStickyTops();
  }

  window.addEventListener('resize', updateStickyTops);
})();
