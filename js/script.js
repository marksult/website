window.addEventListener('load', function () {

  var SELS = [
    '.article',
    '.article-block5',
    '.article-block6',
    '.article-block7',
    '.article-block8'
  ];

  var sections = SELS.map(function (s) { return document.querySelector(s); }).filter(Boolean);
  if (sections.length < 2) return;

  var cards = sections.map(function (s) { return s.querySelector('.article__card'); }).filter(Boolean);
  if (cards.length !== sections.length) return;

  function setup() {
    var vh = window.innerHeight;

    sections.forEach(function (section, i) {
      var card  = cards[i];
      var cardH = card.offsetHeight;
      if (!cardH) return;

      /* top розрахунок:
         Картка прилипає коли її НИЖНІЙ КРАЙ (кнопка) = нижній край viewport.
         При cardH <= vh: top = 20px (позитивне, прилипає зверху, все видно)
         При cardH > vh:  top від'ємне, картка прилипає пізніше —
                          юзер бачить кнопку внизу перед тим як наїжджає наступна */
      var top = Math.min(20, vh - cardH);
      card.style.position = 'sticky';
      card.style.top      = top + 'px';

      /* Буфер після картки — час для наступної щоб виїхати знизу.
         Остання секція не змінюється. */
      if (i < sections.length - 1) {
        var buf = window.innerWidth < 768 ? 220 : 380;
        section.style.paddingBottom = buf + 'px';
      } else {
        section.style.paddingBottom = '';
      }
    });
  }

  setup();
  setTimeout(setup, 400);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  }, { passive: true });

});
