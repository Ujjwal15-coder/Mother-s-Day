/* ==========================================================
   Mother's Day — Cinematic Experience  |  script.js
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- helpers ---------- */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* ==========================================================
     1. OPENING SCENE
     ========================================================== */
  const openingScene = $('#opening-scene');
  const openingText  = $('.opening-text');
  const enterBtn     = $('#enter-btn');

  // Fade in opening text
  setTimeout(() => {
    openingText.style.transition = 'opacity 3s ease';
    openingText.style.opacity = '1';
  }, 500);

  // Fade in button
  setTimeout(() => {
    enterBtn.style.transition = 'opacity 2s ease';
    enterBtn.style.opacity = '1';
  }, 3500);

  enterBtn.addEventListener('click', () => {
    openingScene.classList.add('fade-out');
    setTimeout(() => {
      openingScene.style.display = 'none';
      startExperience();
    }, 1500);
  });

  /* ==========================================================
     2. PARTICLES CANVAS  (golden glowing particles)
     ========================================================== */
  const canvas = $('#particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = rand(0, canvas.width);
      this.y = rand(0, canvas.height);
      this.size = rand(1, 3);
      this.speedX = rand(-0.3, 0.3);
      this.speedY = rand(-0.5, -0.1);
      this.opacity = rand(0.1, 0.5);
      this.fadeDir = rand(0, 1) > 0.5 ? 1 : -1;
      this.hue = rand(35, 55); // golden
    }
    update() {
      // parallax with mouse
      const dx = (mouseX - canvas.width / 2) * 0.0003;
      const dy = (mouseY - canvas.height / 2) * 0.0003;
      this.x += this.speedX + dx;
      this.y += this.speedY + dy;
      this.opacity += this.fadeDir * 0.003;
      if (this.opacity <= 0.05 || this.opacity >= 0.6) this.fadeDir *= -1;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
      ctx.shadowColor = `hsla(${this.hue}, 80%, 75%, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }

  /* ==========================================================
     3. BALLOONS
     ========================================================== */
  const balloonContainer = $('#balloon-container');
  const balloonColors = [
    'rgba(242,209,209,0.6)',
    'rgba(183,110,121,0.5)',
    'rgba(212,160,167,0.5)',
    'rgba(245,215,142,0.4)',
    'rgba(250,243,232,0.5)',
  ];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = rand(5, 95) + '%';
    balloon.style.background = balloonColors[Math.floor(rand(0, balloonColors.length))];
    balloon.style.width  = rand(30, 55) + 'px';
    balloon.style.height = rand(38, 65) + 'px';
    const dur = rand(12, 25);
    balloon.style.animation = `float-up ${dur}s linear forwards`;
    balloon.style.animationDelay = rand(0, 5) + 's';
    balloonContainer.appendChild(balloon);
    setTimeout(() => balloon.remove(), (dur + 6) * 1000);
  }

  function startBalloons() {
    for (let i = 0; i < 6; i++) setTimeout(() => createBalloon(), i * 800);
    setInterval(() => createBalloon(), 4000);
  }

  /* ==========================================================
     4. PETALS
     ========================================================== */
  function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = rand(0, 100) + '%';
    petal.style.top  = '-20px';
    const dur = rand(8, 16);
    const sway = rand(-60, 60);
    petal.style.opacity = rand(0.2, 0.5).toString();
    petal.style.transform = `rotate(${rand(0, 360)}deg)`;
    const size = rand(8, 16);
    petal.style.width  = size + 'px';
    petal.style.height = size + 'px';

    document.body.appendChild(petal);

    let start = null;
    function fall(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      const progress = elapsed / dur;
      if (progress >= 1) { petal.remove(); return; }
      const y = progress * (window.innerHeight + 40);
      const x = Math.sin(elapsed * 0.8) * sway;
      const r = elapsed * 30;
      petal.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      petal.style.opacity = (1 - progress) * 0.45;
      requestAnimationFrame(fall);
    }
    requestAnimationFrame(fall);
  }

  function startPetals() {
    for (let i = 0; i < 4; i++) setTimeout(() => createPetal(), i * 600);
    setInterval(() => createPetal(), 3000);
  }

  /* ==========================================================
     5. FLOATING HEARTS
     ========================================================== */
  function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = '❤️';
    heart.style.left = x + 'px';
    heart.style.top  = y + 'px';
    heart.style.fontSize = rand(1, 2.5) + 'rem';
    document.body.appendChild(heart);

    let start = null;
    const dur = rand(3, 6);
    const drift = rand(-40, 40);
    function rise(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      const progress = elapsed / dur;
      if (progress >= 1) { heart.remove(); return; }
      heart.style.transform = `translate(${Math.sin(elapsed) * drift}px, ${-progress * 300}px)`;
      heart.style.opacity = (1 - progress) * 0.7;
      requestAnimationFrame(rise);
    }
    requestAnimationFrame(rise);
  }

  function startHearts() {
    setInterval(() => {
      spawnHeart(rand(50, window.innerWidth - 50), rand(100, window.innerHeight));
    }, 2500);
  }

  /* ==========================================================
     6. HERO ANIMATION
     ========================================================== */
  function animateHero() {
    const frame    = $('#hero-frame');
    const title    = $('#hero-title');
    const subtitle = $('#hero-subtitle');

    // Cinematic zoom-in reveal
    setTimeout(() => {
      frame.style.transition = 'opacity 2s ease, transform 2.5s cubic-bezier(0.16,1,0.3,1)';
      frame.style.opacity = '1';
      frame.style.transform = 'scale(1)';
    }, 300);

    setTimeout(() => {
      title.style.transition = 'opacity 2s ease, transform 1.5s ease';
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }, 1800);

    setTimeout(() => {
      subtitle.style.transition = 'opacity 2s ease';
      subtitle.style.opacity = '1';
    }, 2800);

    // Burst hearts around hero
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const rect = frame.getBoundingClientRect();
          spawnHeart(
            rect.left + rand(0, rect.width),
            rect.top + rand(0, rect.height)
          );
        }, i * 300);
      }
    }, 2000);
  }

  /* ==========================================================
     7. SCROLL-DRIVEN REVEALS (IntersectionObserver)
     ========================================================== */
  function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    $$('.memory-card').forEach((c, i) => {
      c.style.transitionDelay = (i % 2) * 0.2 + 's';
      observer.observe(c);
    });

    // Memories heading
    const memHead = $('.memories-heading');
    const headObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        memHead.style.transition = 'opacity 1.5s ease';
        memHead.style.opacity = '1';
        headObs.unobserve(memHead);
      }
    }, { threshold: 0.3 });
    headObs.observe(memHead);

    // Gift heading
    const giftHead = $('.gift-heading');
    const giftObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        giftHead.style.transition = 'opacity 1.5s ease';
        giftHead.style.opacity = '1';
        giftObs.unobserve(giftHead);
      }
    }, { threshold: 0.3 });
    giftObs.observe(giftHead);

    // Finale text
    const finaleText = $('#finale-text');
    const finaleObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        finaleText.style.transition = 'opacity 3s ease';
        finaleText.style.opacity = '1';
        finaleObs.unobserve(finaleText);
      }
    }, { threshold: 0.3 });
    finaleObs.observe(finaleText);
  }

  /* ==========================================================
     8. GIFT BOX INTERACTION
     ========================================================== */
  function initGift() {
    const wrapper = $('#gift-box-wrapper');
    const reveal  = $('#gift-reveal');
    const hint    = $('#gift-hint');
    const loveText = $('#love-text');
    let opened = false;

    wrapper.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      wrapper.classList.add('opened');
      hint.style.opacity = '0';

      // Particle burst
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const rect = wrapper.getBoundingClientRect();
          spawnHeart(
            rect.left + rect.width / 2 + rand(-80, 80),
            rect.top + rand(-60, 60)
          );
        }, i * 80);
      }

      // Show reveal
      setTimeout(() => {
        wrapper.style.transition = 'opacity 1s ease, transform 1s ease';
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'scale(0.8)';
        wrapper.style.pointerEvents = 'none';
      }, 1200);

      setTimeout(() => {
        reveal.classList.add('visible');
        reveal.style.transition = 'opacity 2s ease';
        setTimeout(() => { reveal.style.opacity = '1'; }, 50);
      }, 2000);

      setTimeout(() => {
        loveText.style.transition = 'opacity 2s ease, transform 1.5s ease';
        loveText.style.opacity = '1';
        loveText.style.transform = 'scale(1)';
      }, 3500);
    });
  }

  /* ==========================================================
     9. QUOTES CAROUSEL
     ========================================================== */
  function initQuotes() {
    const quotes = $$('.quote-item');
    const dots   = $$('.quote-dot');
    let current  = 0;
    const total  = quotes.length;

    function show(idx) {
      quotes.forEach(q => q.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      quotes[idx].classList.add('active');
      dots[idx].classList.add('active');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        current = parseInt(dot.dataset.index);
        show(current);
      });
    });

    setInterval(() => {
      current = (current + 1) % total;
      show(current);
    }, 5000);
  }

  /* ==========================================================
     10. CTA — OPEN MY HEART
     ========================================================== */
  function initCTA() {
    const btn  = $('#cta-button');
    const note = $('#final-note');
    let revealed = false;

    btn.addEventListener('click', () => {
      if (revealed) return;
      revealed = true;

      // Hearts burst
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          spawnHeart(
            rand(100, window.innerWidth - 100),
            rand(window.innerHeight * 0.3, window.innerHeight * 0.7)
          );
        }, i * 120);
      }

      btn.style.transition = 'opacity 1s ease, transform 1s ease';
      btn.style.opacity = '0.3';
      btn.style.transform = 'scale(0.9)';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        note.classList.add('visible');
        note.style.transition = 'opacity 2.5s ease';
        setTimeout(() => { note.style.opacity = '1'; }, 50);
      }, 800);
    });
  }

  /* ==========================================================
     11. PARALLAX ON MOUSE MOVE
     ========================================================== */
  function initParallax() {
    const heroFrame = $('#hero-frame');
    document.addEventListener('mousemove', (e) => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      if (heroFrame) {
        heroFrame.style.transform = `scale(1) translate(${cx * 8}px, ${cy * 6}px)`;
      }
    });
  }

  /* ==========================================================
     START EXPERIENCE
     ========================================================== */
  function startExperience() {
    initParticles();
    animateParticles();
    startBalloons();
    startPetals();
    startHearts();
    animateHero();
    initScrollReveals();
    initGift();
    initQuotes();
    initCTA();
    initParallax();
  }

});
