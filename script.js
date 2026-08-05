'use strict';

const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

function onScroll() {
  if (window.scrollY > 8) nav.classList.add('scrolled');
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
    if (targetId === '#' || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight + 8;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fadeTargets = document.querySelectorAll('.fade-up');

if (!('IntersectionObserver' in window) || reduceMotion) {
  fadeTargets.forEach(el => el.classList.add('visible'));
} else {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  fadeTargets.forEach(el => fadeObserver.observe(el));
}

/* metric count-up */
const metricValues = document.querySelectorAll('.metric-value');

function formatMetric(el, value) {
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || '';
  return value.toFixed(decimals) + suffix;
}

function countUp(el) {
  const target = Number(el.dataset.value);
  if (!isFinite(target)) return;
  const duration = 1100;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatMetric(el, target * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  el.textContent = formatMetric(el, 0);
  requestAnimationFrame(step);
}

if (metricValues.length) {
  if (!('IntersectionObserver' in window) || reduceMotion) {
    metricValues.forEach(el => { el.textContent = formatMetric(el, Number(el.dataset.value)); });
  } else {
    const metricObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            metricObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    metricValues.forEach(el => metricObserver.observe(el));
  }
}

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(theme) {
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

const discordBtn = document.getElementById('discord-handle');
if (discordBtn) {
  const hintEl = discordBtn.querySelector('.contact-primary-hint');
  const original = hintEl ? hintEl.textContent : '';
  discordBtn.addEventListener('click', () => {
    const handle = discordBtn.dataset.handle;
    if (!handle) return;
    navigator.clipboard.writeText(handle).then(() => {
      if (!hintEl) return;
      discordBtn.classList.add('copied');
      hintEl.textContent = 'Copied';
      setTimeout(() => {
        discordBtn.classList.remove('copied');
        hintEl.textContent = original;
      }, 1600);
    }).catch(() => {});
  });
}

onScroll();
