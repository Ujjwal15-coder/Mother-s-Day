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
     5. ADVANCED SVG HEARTS
     ========================================================== */
  const heartGradients = [
    { id: 'rose',   stops: ['#e88ca5', '#b76e79', '#8b4557'] },
    { id: 'gold',   stops: ['#f5d78e', '#d4a855', '#c4913a'] },
    { id: 'pink',   stops: ['#f7c5c5', '#e8a0a0', '#d47e8e'] },
    { id: 'blush',  stops: ['#f2d1d1', '#d4a0a7', '#b76e79'] },
    { id: 'sunset', stops: ['#f5d78e', '#e8a0a0', '#b76e79'] },
  ];

  function createHeartSVG(size, gradientId) {
    const grad = heartGradients.find(g => g.id === gradientId) || heartGradients[0];
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg-${grad.id}-${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${grad.stops[0]}"/>
          <stop offset="50%" stop-color="${grad.stops[1]}"/>
          <stop offset="100%" stop-color="${grad.stops[2]}"/>
        </linearGradient>
      </defs>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#hg-${grad.id}-${Date.now()})" opacity="0.9"/>
    </svg>`;
  }

  function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('svg-heart');
    const size = rand(16, 38);
    const gradTypes = ['rose', 'gold', 'pink', 'blush', 'sunset'];
    const gradId = gradTypes[Math.floor(rand(0, gradTypes.length))];
    heart.innerHTML = createHeartSVG(size, gradId);

    // Random glow class
    if (Math.random() > 0.5) heart.classList.add(Math.random() > 0.5 ? 'glow-rose' : 'glow-gold');

    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    document.body.appendChild(heart);

    let start = null;
    const dur = rand(3, 7);
    const drift = rand(-50, 50);
    const rotSpeed = rand(-90, 90);
    const riseHeight = rand(250, 450);

    function rise(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      const progress = elapsed / dur;
      if (progress >= 1) { heart.remove(); return; }

      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const yMove = -eased * riseHeight;
      const xMove = Math.sin(elapsed * 1.5) * drift;
      const rot = elapsed * rotSpeed;
      const scale = 1 - progress * 0.3;

      heart.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${rot}deg) scale(${scale})`;
      heart.style.opacity = (1 - Math.pow(progress, 2)) * 0.85;
      requestAnimationFrame(rise);
    }
    requestAnimationFrame(rise);
  }

  // Spawn a burst of hearts (used for gift/CTA)
  function heartBurst(cx, cy, count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        spawnHeart(cx + rand(-100, 100), cy + rand(-80, 80));
      }, i * 60);
    }
  }

  function startHearts() {
    setInterval(() => {
      spawnHeart(rand(50, window.innerWidth - 50), rand(100, window.innerHeight));
    }, 2000);
  }

  /* ==========================================================
     5b. SPARKLE SYSTEM
     ========================================================== */
  function spawnSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    const size = rand(2, 5);
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    document.body.appendChild(sparkle);

    let start = null;
    const dur = rand(1.5, 3);
    function fade(ts) {
      if (!start) start = ts;
      const progress = ((ts - start) / 1000) / dur;
      if (progress >= 1) { sparkle.remove(); return; }
      const scale = Math.sin(progress * Math.PI);
      sparkle.style.transform = `scale(${scale}) translateY(${-progress * 40}px)`;
      sparkle.style.opacity = scale * 0.8;
      requestAnimationFrame(fade);
    }
    requestAnimationFrame(fade);
  }

  function startSparkles() {
    setInterval(() => {
      spawnSparkle(rand(0, window.innerWidth), rand(0, window.innerHeight));
    }, 800);
  }

  /* ==========================================================
     5c. MOUSE TRAIL HEARTS
     ========================================================== */
  let lastMouseHeart = 0;
  function initMouseTrailHearts() {
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMouseHeart > 400) {
        lastMouseHeart = now;
        if (Math.random() > 0.6) {
          spawnHeart(e.clientX + rand(-20, 20), e.clientY + rand(-10, 10));
        }
      }
    });
  }

  /* ==========================================================
     5d. FLOATING LANTERNS (for finale)
     ========================================================== */
  function initFinalieLanterns() {
    const finale = document.getElementById('finale');
    if (!finale) return;

    function createLantern() {
      const lantern = document.createElement('div');
      lantern.classList.add('lantern');
      lantern.style.left = rand(5, 95) + '%';
      lantern.style.bottom = '-30px';
      const size = rand(10, 20);
      lantern.style.width = size + 'px';
      lantern.style.height = (size * 1.3) + 'px';
      finale.appendChild(lantern);

      let start = null;
      const dur = rand(10, 20);
      const sway = rand(-30, 30);

      function fly(ts) {
        if (!start) start = ts;
        const progress = ((ts - start) / 1000) / dur;
        if (progress >= 1) { lantern.remove(); return; }
        const y = -progress * finale.offsetHeight * 1.2;
        const x = Math.sin(progress * Math.PI * 2) * sway;
        lantern.style.transform = `translate(${x}px, ${y}px)`;
        lantern.style.opacity = Math.sin(progress * Math.PI) * 0.7;
        requestAnimationFrame(fly);
      }
      requestAnimationFrame(fly);
    }

    // Start lanterns when finale is visible
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        for (let i = 0; i < 5; i++) setTimeout(() => createLantern(), i * 1500);
        setInterval(() => createLantern(), 3000);
        obs.unobserve(finale);
      }
    }, { threshold: 0.2 });
    obs.observe(finale);
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
      const rect = frame.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
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

      // Big heart burst from the gift
      const rect = wrapper.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

      // Sparkle burst
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          spawnSparkle(
            rect.left + rect.width / 2 + rand(-100, 100),
            rect.top + rect.height / 2 + rand(-80, 80)
          );
        }, i * 100);
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

      // Massive heart burst
      heartBurst(window.innerWidth / 2, window.innerHeight / 2, 30);

      // Sparkle shower
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          spawnSparkle(rand(100, window.innerWidth - 100), rand(100, window.innerHeight - 100));
        }, i * 100);
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
    startSparkles();
    animateHero();
    initScrollReveals();
    initGift();
    initQuotes();
    initCTA();
    initParallax();
    initMouseTrailHearts();
    initFinalieLanterns();
  }

});
