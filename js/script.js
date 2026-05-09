document.addEventListener('DOMContentLoaded', function () {

  // ── Stack entrance animation ──────────────────────────────────────────────
  // Cards 2-5 (blocks 5-8) rise from below when they enter the viewport.
  var stackSelectors = [
    '.article-block5 .article__card',
    '.article-block6 .article__card',
    '.article-block7 .article__card',
    '.article-block8 .article__card'
  ];

  var stackCards = stackSelectors
    .map(function (s) { return document.querySelector(s); })
    .filter(Boolean);

  if (stackCards.length && 'IntersectionObserver' in window) {

    // Set initial hidden state immediately (before paint)
    stackCards.forEach(function (card) {
      card.style.transform    = 'translateY(80px)';
      card.style.opacity      = '0';
      card.style.transition   = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease';
      card.style.willChange   = 'transform, opacity';
    });

    var stackObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        card.style.transform = 'translateY(0)';
        card.style.opacity   = '1';
        // Release GPU hint after animation completes
        setTimeout(function () { card.style.willChange = 'auto'; }, 1000);
        stackObserver.unobserve(card);
      });
    }, {
      threshold: 0.04  // trigger when 4% of card is visible (top edge enters viewport)
    });

    stackCards.forEach(function (card) { stackObserver.observe(card); });
  }

});
