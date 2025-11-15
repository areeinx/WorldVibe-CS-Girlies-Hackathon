    function lerp(start, end, t) {
      return start * (1 - t) + end * t;
    }

    const globe = document.getElementById('globeContainer');
    let targetScale = 1;
    let currentScale = 1;

    let targetY = 0;
    let currentY = 0;

    function animate() {
      currentScale = lerp(currentScale, targetScale, 0.1);
      currentY = lerp(currentY, targetY, 0.1);

      globe.style.transform = `scale(${currentScale}) translateY(${currentY}px)`;
      requestAnimationFrame(animate);
    }

    animate();

    
    window.addEventListener('scroll', () => {
      let scrollY = window.scrollY;
      let viewportH = window.innerHeight;

      if (scrollY <= viewportH) {
        // Zoom in
        targetScale = 1 + scrollY / viewportH * 1.2;
        targetY = scrollY * 0.1;
      } else {
        let offset = scrollY - viewportH;
        targetScale = 2 - offset / viewportH * 1.2;
        if (targetScale < 1) targetScale = 1;
        targetY = offset * 0.2;
      }
    });