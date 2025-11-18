function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// Stamp positions for each country on passport (in percentages for responsive sizing)
const stampPositions = {
  france: { top: '12%', left: '8%', rotation: '-15deg' },
  usa: { top: '18%', left: '30%', rotation: '12deg' },
  india: { top: '8%', left: '55%', rotation: '-8deg' },
  japan: { top: '20%', left: '70%', rotation: '18deg' }
};

// Function to add stamp to passport
window.addStampToPassport = function(country, stampSrc) {
  // Store the stamp data in localStorage
  localStorage.setItem(`stamp-${country}`, stampSrc);
  // Mark in sessionStorage so index can display these stamps once after redirect
  try {
    sessionStorage.setItem('showStampsOnce', '1');
  } catch (e) {
    // sessionStorage may be unavailable in some environments; ignore
  }
  // Redirect to home page with hash to scroll to passport
  window.location.href = 'index.html#passport';
};

document.addEventListener('DOMContentLoaded', () => {
  const globeContainer = document.getElementById('globeContainer');
  const globeSection = document.getElementById('globe');
  if (!globeContainer || !globeSection) return;

  let targetScale = 1;
  let currentScale = 1;

  let targetY = 0;
  let currentY = 0;

  let globeActive = false;
  let locked = false; 
  let lastScrollY = window.scrollY;
  let lastDir = null;

  globeContainer.style.transformOrigin = 'center center';

  function animate() {
    currentScale = lerp(currentScale, targetScale, 0.1);
    currentY = lerp(currentY, targetY, 0.1);

    globeContainer.style.transform = `scale(${currentScale}) translateY(${currentY}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  
  function onScroll() {
    const rect = globeSection.getBoundingClientRect();
    const vh = window.innerHeight;

    const progress = Math.min(Math.max((vh - rect.top) / vh, 0), 1);

 
    const scrollY = window.scrollY;
    const dir = (scrollY > lastScrollY) ? 'down' : (scrollY < lastScrollY ? 'up' : lastDir);
    lastScrollY = scrollY;
    lastDir = dir;

    const computedScale = 1 + progress * 1.2;
    const computedY = progress * 80;

    if (dir === 'down' && computedScale > 1.02) {
      locked = true;
    }
    
    if (dir === 'up') {
      locked = false;
    }

    if (locked) {
      targetScale = Math.max(targetScale, computedScale);
      targetY = Math.max(targetY, computedY);
    } else {
      targetScale = computedScale;
      targetY = computedY;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});