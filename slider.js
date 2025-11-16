(function() {
  class SmoothCarousel {
    constructor(root) {
      this.root = root;
      this.container = root.querySelector('.slider-container');
      this.slides = Array.from(root.querySelectorAll('.carousel-slide'));
      this.prevBtn = root.querySelector('.carousel-prev');
      this.nextBtn = root.querySelector('.carousel-next');
      this.dotsContainer = root.parentElement.querySelector('.carousel-dots') || root.querySelector('.carousel-dots');
      
      this.index = 0;
      this.isAnimating = false;
      this.slideWidth = 0;
      this.gap = 24;
      
      this.init();
    }

    init() {
      const imgs = Array.from(this.root.querySelectorAll('img'));
      const promises = imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => {
          img.addEventListener('load', res);
          img.addEventListener('error', res);
        });
      });
      
      Promise.all(promises).then(() => {
        setTimeout(() => this.setup(), 50);
      });
    }

    setup() {
      this.slideWidth = this.slides[0].offsetWidth;
      this.createDots();
      this.attachEventListeners();
      this.goToSlide(2);
    }

    createDots() {
      this.slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => this.goToSlide(i));
        this.dotsContainer.appendChild(dot);
      });
    }

    attachEventListeners() {
      this.prevBtn.addEventListener('click', () => this.goToSlide(this.index - 1));
      this.nextBtn.addEventListener('click', () => this.goToSlide(this.index + 1));
      
      // Keyboard
      this.root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.goToSlide(this.index - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); this.goToSlide(this.index + 1); }
        else if (e.key === 'Home') { e.preventDefault(); this.goToSlide(0); }
        else if (e.key === 'End') { e.preventDefault(); this.goToSlide(this.slides.length - 1); }
        else if (/^[1-9]$/.test(e.key)) {
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= this.slides.length) { e.preventDefault(); this.goToSlide(num - 1); }
        }
      });
      
      window.addEventListener('resize', () => this.updatePosition());
    }

    goToSlide(i) {
      if (this.isAnimating) return;
      
      this.index = (i + this.slides.length) % this.slides.length;
      this.updatePosition();
      this.updateDots();
      this.updateClasses();
    }

    updatePosition() {
      const containerWidth = this.root.offsetWidth;
      const totalStep = this.slideWidth + this.gap;
      const padding = 60;
      
      let offset = this.index * totalStep - (containerWidth - this.slideWidth) / 2 + padding;

      const maxOffset = Math.max(0, (this.slides.length * totalStep) - containerWidth + padding);
      offset = Math.max(0, Math.min(offset, maxOffset));
      
      this.container.style.transform = `translateX(${-offset}px)`;
    }

    updateDots() {
      const dots = Array.from(this.dotsContainer.querySelectorAll('.carousel-dot'));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === this.index));
    }

    updateClasses() {
      this.slides.forEach((s, i) => {
        s.classList.toggle('active', i === this.index);
        s.classList.toggle('prev', i === (this.index - 1 + this.slides.length) % this.slides.length);
        s.classList.toggle('next', i === (this.index + 1) % this.slides.length);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.smooth-carousel').forEach(el => {
      new SmoothCarousel(el);
    });
  });
})();
