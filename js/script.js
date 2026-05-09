document.addEventListener('DOMContentLoaded', function () {

  var SELS = [
    '.article',
    '.article-block5',
    '.article-block6',
    '.article-block7',
    '.article-block8'
  ];

  var sections = SELS.map(function (s) { return document.querySelector(s); }).filter(Boolean);
  if (sections.length < 2) return;

  /* Скидаємо залишки попередніх inline-стилів */
  sections.forEach(function (section) {
    var card = section.querySelector('.article__card');
    if (!card) return;
    card.style.cssText = '';
  });

  function setup() {
    var vh  = window.innerHeight;
    var mob = window.innerWidth < 768;

    sections.forEach(function (section, i) {
      var card  = section.querySelector('.article__card');
      if (!card) return;

      var cardH = card.offsetHeight;
      if (!cardH) return;

      /* Стекінг-контекст */
      section.style.position = 'relative';
      section.style.zIndex   = i + 1;

      /* Sticky на карточці:
         - Карточка <= viewport: top 20px (видно зверху)
         - Карточка > viewport: від'ємний top, щоб кнопка
           опинялась на нижньому краї viewport в момент прилипання */
      var topPx = Math.min(20, vh - cardH - 20);
      card.style.position = 'sticky';
      card.style.top      = topPx + 'px';

      /* Буфер після карточки — час щоб наступна виїхала знизу.
         Остання секція зберігає свій CSS padding. */
      if (i < sections.length - 1) {
        var buf = mob ? 220 : 360;
        section.style.paddingBottom = buf + 'px';
      } else {
        section.style.paddingBottom = '';
      }
    });
  }

  /* Запускаємо після повного завантаження (правильні висоти) */
  if (document.readyState === 'complete') {
    setup();
  } else {
    window.addEventListener('load', setup);
  }

  /* Підстраховка — деякі шрифти вантажаться пізніше */
  window.addEventListener('load', function () {
    setTimeout(setup, 300);
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  }, { passive: true });

});
