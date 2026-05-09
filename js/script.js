document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky stack ─────────────────────────────────────────────────────────
     Кожна карточка прилипає коли кнопка внизу доходить до краю viewport.
     Наступна карточка виїжджає знизу і накладується поверх.
  ───────────────────────────────────────────────────────────────────────── */

  var SELECTORS = [
    '.article',
    '.article-block5',
    '.article-block6',
    '.article-block7',
    '.article-block8'
  ];

  var sections = SELECTORS.map(function (s) {
    return document.querySelector(s);
  }).filter(Boolean);

  if (sections.length < 2) return;

  var cards = sections.map(function (s) {
    return s.querySelector('.article__card');
  }).filter(Boolean);

  if (cards.length !== sections.length) return;

  function applyStack() {
    var vh  = window.innerHeight;
    var mob = window.innerWidth < 768;

    /* Скільки пікселів скролу дається наступній карточці щоб виїхати */
    var buf = mob ? 220 : 360;

    sections.forEach(function (section, i) {
      var card  = cards[i];
      var cardH = card.offsetHeight;

      /* Стекінг-контекст: наступна секція перекриває попередню */
      section.style.position = 'relative';
      section.style.zIndex   = String(i + 1);

      /* Sticky */
      card.style.position = 'sticky';

      /* top розрахунок:
         - Якщо карточка ≤ viewport: top = 20px (прилипає зверху, всі видно)
         - Якщо карточка > viewport: top = vh - cardH - 20 (від'ємне)
           → карточка прилипає коли її НИЖНІЙ КРАЙ (кнопка) = нижній край viewport
           → юзер бачить кнопку в останній момент перед тим як виїжджає наступна */
      var topPx = Math.min(20, vh - cardH - 20);
      card.style.top = topPx + 'px';

      /* Буфер скролу щоб наступна карточка встигла виїхати знизу.
         Для останньої секції — не чіпаємо (зберігається CSS padding-bottom). */
      if (i < sections.length - 1) {
        section.style.paddingBottom = buf + 'px';
      } else {
        section.style.paddingBottom = '';
      }
    });
  }

  applyStack();

  /* Перерахунок після повного завантаження (шрифти, зображення → висоти змінюються) */
  window.addEventListener('load', applyStack);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyStack, 150);
  }, { passive: true });

});
