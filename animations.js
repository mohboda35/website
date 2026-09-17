(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Page Transition ── */
  var overlay = document.getElementById('page-transition');
  if (overlay) {
    // Fade in on page arrival
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'none';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
      });
    });

    // Intercept outbound link clicks
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('://') > -1 ||
          href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var dest = href;
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
        setTimeout(function () { window.location.href = dest; }, 320);
      });
    });
  }

  /* ── Hero Entrance ── */
  var heroSelectors = [
    '.badge',
    '.hero h1',
    '.hero > .container > .hero-inner > p',
    '.hero-ctas',
    '.hero-credit',
    '.hero-card-wrap'
  ];
  var heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) heroGlow.classList.add('hero-glow-anim');

  heroSelectors.forEach(function (sel, i) {
    var el = document.querySelector(sel);
    if (el) el.classList.add('hero-anim-' + i);
  });

  /* ── Scroll Fade-in (animate-in / visible) ── */
  var scrollTargets = [
    '.feat-block',
    '.industry-card',
    '.step-card',
    '.testi-card',
    '.niche-feat-card',
    '.feat-card',
    '.cta-box',
    'section h2',
    'section .section-sub'
  ];

  document.querySelectorAll(scrollTargets.join(',')).forEach(function (el) {
    // Don't double-up on elements already handled by the .fi system
    if (!el.classList.contains('fi') && !el.classList.contains('animate-in')) {
      el.classList.add('animate-in');
    }
  });

  // Stagger children of grid containers
  var gridContainers = [
    '.features-grid',
    '.industries-grid',
    '.niche-feats',
    '.steps-grid',
    '.testi-grid',
    '.industry-grid'
  ];
  document.querySelectorAll(gridContainers.join(',')).forEach(function (grid) {
    Array.from(grid.children).forEach(function (child, i) {
      if (child.classList.contains('animate-in')) {
        child.style.transitionDelay = (i * 0.09) + 's';
      }
    });
  });

  var scrollObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        scrollObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    scrollObs.observe(el);
  });

  /* ── Number Counter (stats bar) ── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, suffix, duration) {
    if (prefersReduced) { el.textContent = target.toLocaleString() + suffix; return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    var statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        statsObs.unobserve(e.target);
        e.target.querySelectorAll('[data-count]').forEach(function (num) {
          var target = parseInt(num.getAttribute('data-count'), 10);
          var suffix = num.getAttribute('data-suffix') || '';
          animateCounter(num, target, suffix, 1800);
        });
      });
    }, { threshold: 0.3 });
    statsObs.observe(statsBar);
  }

  /* ── Typewriter ── */
  var tw = document.getElementById('typewriter');
  var isMobile = window.matchMedia('(max-width: 480px)').matches;

  if (tw && !isMobile && !prefersReduced) {
    var phrases = ['book jobs', 'book appointments', 'follow up automatically', 'answer every call'];
    var phraseIndex = 0;
    var charIndex   = 0;
    var isDeleting  = false;
    var TYPE_SPEED   = 65;
    var DELETE_SPEED = 35;
    var HOLD_DELAY   = 2200;
    var PAUSE_DELAY  = 280;

    function tick() {
      var current = phrases[phraseIndex];
      if (isDeleting) {
        charIndex--;
        tw.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting  = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, PAUSE_DELAY);
        } else {
          setTimeout(tick, DELETE_SPEED);
        }
      } else {
        charIndex++;
        tw.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(tick, HOLD_DELAY);
        } else {
          setTimeout(tick, TYPE_SPEED);
        }
      }
    }

    setTimeout(tick, 800);
  } else if (tw) {
    tw.textContent = 'book jobs';
  }

})();
