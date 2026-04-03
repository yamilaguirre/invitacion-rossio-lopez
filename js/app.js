(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ═══════════ LOADING SCREEN ═══════════ */
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    setTimeout(() => {
      $('#loading-screen').classList.add('hidden');
      document.body.style.overflow = '';
      initSparkles();
      startHeroEntrance();
    }, 2600);
  });

  /* ═══════════ SPARKLE LAYER ═══════════ */
  function initSparkles() {
    const layer = $('#sparkle-layer');
    const sizes = [3, 4, 3, 5, 4];
    for (let i = 0; i < 28; i++) {
      const dot = document.createElement('span');
      dot.className = 'sparkle-dot';
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      dot.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${2 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      layer.appendChild(dot);
    }
  }

  /* ═══════════ SCROLL PROGRESS ═══════════ */
  const progressBar = $('#scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) progressBar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });

  /* ═══════════ AUDIO ═══════════ */
  const audioBtn = $('#audio-btn');
  const bgMusic = $('#bg-music');
  bgMusic.volume = 0.45;

  audioBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        audioBtn.classList.add('playing');
        audioBtn.querySelector('.audio-label').textContent = 'Pausar';
      }).catch(() => {});
    } else {
      bgMusic.pause();
      audioBtn.classList.remove('playing');
      audioBtn.querySelector('.audio-label').textContent = 'Música';
    }
  });

  /* ═══════════ HERO ENTRANCE ═══════════ */
  function startHeroEntrance() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.crown-icon',   { opacity: 0, scale: 0.5, duration: .8 })
      .from('.hero-eyebrow', { opacity: 0, y: 20, duration: .6 }, '-=.3')
      .from('.hero-title',   { opacity: 0, y: 40, duration: .8 }, '-=.3')
      .from('.hero-sub, .hero-name', { opacity: 0, y: 20, duration: .6, stagger: .15 }, '-=.4')
      .from('.hero-divider', { opacity: 0, scaleX: 0, duration: .8 }, '-=.3')
      .from('.hero-scroll, .scroll-chevron', { opacity: 0, y: 10, duration: .5 }, '-=.2');

    initScrollAnimations();
  }

  /* ═══════════ SCROLL ANIMATIONS ═══════════ */
  function initScrollAnimations() {

    /* Generic fade-in for all .fade-in elements */
    $$('.fade-in').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 87%',
        onEnter: () => el.classList.add('visible'),
      });
    });

    /* Hero parallax */
    gsap.to('#hero .hero-content', {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    /* Carta paper entrance */
    gsap.from('.carta-paper', {
      y: 60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#carta-section', start: 'top 70%' },
    });

    /* Detail cards stagger */
    gsap.from('.detalle-card', {
      y: 40, opacity: 0, duration: .7, ease: 'power2.out', stagger: .15,
      scrollTrigger: { trigger: '.detalles-cards', start: 'top 80%' },
    });

    /* Razon items */
    $$('.razon-photo').forEach(el => {
      gsap.from(el, {
        x: el.closest('.razon-item.reverse') ? 40 : -40,
        opacity: 0, duration: .9, ease: 'power2.out',
        scrollTrigger: { trigger: el.closest('.razon-item'), start: 'top 75%' },
      });
    });
    $$('.razon-text').forEach(el => {
      gsap.from(el, {
        x: el.closest('.razon-item.reverse') ? -40 : 40,
        opacity: 0, duration: .9, ease: 'power2.out',
        scrollTrigger: { trigger: el.closest('.razon-item'), start: 'top 75%' },
      });
    });

    /* Closing confetti and hearts */
    ScrollTrigger.create({
      trigger: '#cierre-section',
      start: 'top 55%',
      onEnter: launchClosingConfetti,
      once: true,
    });

    /* Cierre title */
    gsap.from('.cierre-icon', {
      scale: 0, opacity: 0, rotation: -15, duration: 1, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '#cierre-section', start: 'top 65%' },
    });
  }

  /* ═══════════ CLOSING CONFETTI ═══════════ */
  function launchClosingConfetti() {
    const goldColors = ['#D4AF37', '#FFE066', '#C8960C', '#E8D5A0', '#B8960C', '#FFF0A0'];
    const end = Date.now() + 5000;

    (function rain() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.65 },
        colors: goldColors,
        shapes: ['circle', 'square'],
        gravity: 1.2,
        scalar: 0.9,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.65 },
        colors: goldColors,
        shapes: ['circle', 'square'],
        gravity: 1.2,
        scalar: 0.9,
      });
      if (Date.now() < end) requestAnimationFrame(rain);
    })();
  }

  /* ═══════════ MUSIC AUTO-INVITE ═══════════ */
  // Try to play music when user first scrolls (better browser compatibility)
  let musicAttempted = false;
  window.addEventListener('scroll', () => {
    if (musicAttempted) return;
    musicAttempted = true;
    bgMusic.play().then(() => {
      audioBtn.classList.add('playing');
      audioBtn.querySelector('.audio-label').textContent = 'Pausar';
    }).catch(() => {});
  }, { once: true, passive: true });

})();
