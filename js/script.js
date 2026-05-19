// Guarantees cards scroll animation
(function() {
  'use strict';

  var cardsWrap = document.querySelector('.guarantees__cards-wrap');
  if (!cardsWrap) return;

  var cards = cardsWrap.querySelectorAll('.guarantees__card');
  var hasAnimated = false;

  function checkScroll() {
    if (hasAnimated) return;

    var rect = cardsWrap.getBoundingClientRect();
    var triggerPoint = window.innerHeight * 0.75;

    if (rect.top < triggerPoint && rect.bottom > 0) {
      cards.forEach(function(card) {
        card.classList.add('animate');
      });
      hasAnimated = true;
      window.removeEventListener('scroll', checkScroll);
    }
  }

  // Check on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkScroll);
  } else {
    checkScroll();
  }

  // Check on scroll
  window.addEventListener('scroll', checkScroll, { passive: true });
})();
