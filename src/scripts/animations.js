// Scroll Reveal
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated Counters
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      const isPercent = counter.innerText.includes('%');
      const updateCount = () => {
        const count = +counter.innerText.replace(/[+%]/g, '');
        const inc = target / 100;
        if (count < target) {
          counter.innerText = Math.ceil(count + inc) + (isPercent ? '%' : '+');
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target + (isPercent ? '%' : '+');
        }
      };
      updateCount();
      observer.unobserve(counter);
    }
  });
}, { threshold: 1 });

document.querySelectorAll('[data-target]').forEach(c => counterObserver.observe(c));

// Particle Canvas
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function setCanvasSize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', setCanvasSize);
  setCanvasSize();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = 'rgba(173, 198, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const n = (canvas.width * canvas.height) / 15000;
    for (let i = 0; i < n; i++) particlesArray.push(new Particle());
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(173, 198, 255, ${0.15 - distance / 800})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// Parallax Ambient Background
window.addEventListener('scroll', () => {
  const ambientBg = document.getElementById('ambient-bg');
  if (ambientBg) ambientBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
});
