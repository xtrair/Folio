'use strict';

const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

function onScroll() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  updateActiveLink();
}

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight + 28;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

function initFadeObserver() {
  document.querySelectorAll('.projects-grid, .skills-grid, .about-visual, .games-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => { child.dataset.delay = i * 70; });
  });
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
}

function initLeaderboard() {
  const lb = document.querySelector('.leaderboard');
  if (!lb) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rows = entry.target.querySelectorAll('.lb-row');
          rows.forEach((row, i) => {
            const fill = row.querySelector('.lb-bar-fill');
            const w = row.dataset.width;
            setTimeout(() => { if (fill) fill.style.width = w + '%'; }, i * 80 + 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(lb);
}

function initAvatar() {
  const stage = document.getElementById('avatarStage');
  const eyes = document.getElementById('eyes');
  if (!stage || !eyes) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const maxEye = 4;
    const dist = Math.hypot(dx, dy) || 1;
    const ex = (dx / dist) * Math.min(maxEye, dist / 80);
    const ey = (dy / dist) * Math.min(maxEye, dist / 80);
    eyes.style.transform = `translate(${ex}px, ${ey}px)`;

    const tiltX = -(dy / window.innerHeight) * 6;
    const tiltY = (dx / window.innerWidth) * 10;
    stage.style.setProperty('--tilt-x', tiltX + 'deg');
    stage.style.setProperty('--tilt-y', tiltY + 'deg');
  });
}

function initStatusBar() {
  const clock = document.getElementById('clock');
  const ping = document.getElementById('ping');
  const players = document.getElementById('players');

  function tickClock() {
    if (!clock) return;
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} UTC${d.getTimezoneOffset() <= 0 ? '+' : '-'}${Math.abs(d.getTimezoneOffset()/60)}`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  if (ping) {
    setInterval(() => {
      ping.textContent = (10 + Math.floor(Math.random() * 14));
    }, 2200);
  }

  if (players) {
    let p = 1;
    setInterval(() => {
      const delta = Math.random() < 0.5 ? -1 : 1;
      p = Math.max(1, Math.min(7, p + delta));
      players.textContent = p;
    }, 4000);
  }
}

function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.project-card, .game-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 3;
      const tiltY = ((cx - x) / cx) * 3;
      card.style.setProperty('transition', 'transform 0.1s ease, box-shadow var(--transition)');
      card.style.transform = `translate(-4px, -4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = '';
      card.style.transform = '';
    });
  });
}

function initHeroAnimation() {
  const heroLeft = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  [heroLeft, heroRight].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = i === 0 ? 'translateX(-20px)' : 'translateX(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    }, 200 + i * 150);
  });
}

function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(226,35,26,0.08) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animate() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  initFadeObserver();
  initLeaderboard();
  initAvatar();
  initStatusBar();
  initCardTilt();
  initHeroAnimation();
  initCursorGlow();
  onScroll();
});
