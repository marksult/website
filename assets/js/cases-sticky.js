(function () {
  var OFFSET = 20;

  function updateStickyTops() {
    var vh = window.innerHeight;
    document.querySelectorAll('.cases__card').forEach(function (card) {
      var cardH = card.offsetHeight;
      card.style.top = (vh - cardH - OFFSET) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateStickyTops);
  } else {
    updateStickyTops();
  }

  window.addEventListener('load', updateStickyTops);
  window.addEventListener('resize', updateStickyTops);
})();
