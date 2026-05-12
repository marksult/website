(function () {
  const CARD_WIDTH = 900;
  const CARD_GAP = 15;
  const TOTAL_CARDS = 5;

  let currentIndex = 0;

  const track = document.querySelector('.features__track');
  const prevBtn = document.querySelector('.features__arrow--prev');
  const nextBtn = document.querySelector('.features__arrow--next');
  const counter = document.querySelector('.features__counter');
  const progressFill = document.querySelector('.features__progress-fill');

  function updateSlider() {
    const offset = -(currentIndex * (CARD_WIDTH + CARD_GAP));
    track.style.transform = `translateX(${offset}px)`;

    // Update counter
    counter.textContent = `${currentIndex + 1}—${TOTAL_CARDS}`;

    // Update progress bar
    const progress = ((currentIndex + 1) / TOTAL_CARDS) * 100;
    progressFill.style.width = `${progress}%`;

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === TOTAL_CARDS - 1;
  }

  function goToSlide(index) {
    if (index < 0 || index >= TOTAL_CARDS) return;
    currentIndex = index;
    updateSlider();
  }

  function nextSlide() {
    if (currentIndex < TOTAL_CARDS - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Event listeners
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Initialize
  updateSlider();

  // Keyboard navigation (optional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
})();
