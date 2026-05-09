document.addEventListener('DOMContentLoaded', function () {

  /* Скидаємо inline-стилі від попередніх версій анімації */
  var els = document.querySelectorAll(
    '.article, .article-block5, .article-block6, .article-block7, .article-block8, ' +
    '.article .article__card, .article-block5 .article__card, ' +
    '.article-block6 .article__card, .article-block7 .article__card, ' +
    '.article-block8 .article__card'
  );
  els.forEach(function (el) { el.style.cssText = ''; });

});
