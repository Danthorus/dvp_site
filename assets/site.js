// This file has been created (totally or partially) with the assistance of artificial intelligence tools.
// All content has been generated under the direct supervision of a named individual,
// and under the AI.Backbone Orchestrator Compliance framework

const root = document.documentElement;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const header = document.querySelector('.site-header');
const chapterSections = [...document.querySelectorAll('[data-chapter]')];
const chapterLinks = document.querySelectorAll('[data-chapter-link]');
const revealTargets = document.querySelectorAll('.intro-copy, .intro-photo, .page-hero-copy, .page-hero-photo, .article-section, .price-card, .sale-copy, .contact-details, .contact-form-wrap');
const activeReveals = new Set();
let manuallyPaused = false;
let revealObserver;
let scrollFrame = null;
let headerHeight = header.offsetHeight;

function updateReadingState() {
  scrollFrame = null;
  const maximum = Math.max(1, root.scrollHeight - innerHeight);
  root.style.setProperty('--reading-progress', String(Math.min(1, Math.max(0, scrollY / maximum))));
  const current = chapterSections.find(section => {
    const box = section.getBoundingClientRect();
    return box.top <= headerHeight + 80 && box.bottom > headerHeight + 80;
  }) || chapterSections[0];
  if (root.dataset.currentChapter === current.id) return;
  root.dataset.currentChapter = current.id;
  for (const link of chapterLinks) {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

function scheduleReadingState() {
  if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateReadingState);
}

function updateHeaderHeight() {
  headerHeight = header.offsetHeight;
  root.style.setProperty('--header-height', `${headerHeight}px`);
  scheduleReadingState();
}

function stopReadingState() {
  removeEventListener('scroll', scheduleReadingState);
  removeEventListener('resize', updateHeaderHeight);
  if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
  scrollFrame = null;
}

function startReadingState() {
  addEventListener('scroll', scheduleReadingState, { passive: true });
  addEventListener('resize', updateHeaderHeight);
  updateHeaderHeight();
}

function stopReveals() {
  revealObserver?.disconnect();
  for (const animation of activeReveals) animation.cancel();
  activeReveals.clear();
}

function applyMotionPreference() {
  stopReveals();
  const paused = manuallyPaused || motionPreference.matches;
  root.dataset.motion = paused ? 'paused' : 'active';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = motionPreference.matches;
  motionButton.setAttribute('aria-label', motionPreference.matches
    ? 'Animations réduites selon vos préférences'
    : paused ? 'Reprendre les animations' : 'Mettre les animations en pause');
  if (paused) return;

  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      revealObserver.unobserve(entry.target);
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 1000, easing: 'cubic-bezier(.16, 1, .3, 1)' });
      activeReveals.add(animation);
      animation.finished.then(
        () => activeReveals.delete(animation),
        () => activeReveals.delete(animation),
      );
    }
  }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
  for (const target of revealTargets) revealObserver.observe(target);
}

motionButton.addEventListener('click', () => {
  manuallyPaused = !manuallyPaused;
  applyMotionPreference();
});
motionPreference.addEventListener('change', applyMotionPreference);
addEventListener('pagehide', () => {
  stopReadingState();
  stopReveals();
});
addEventListener('pageshow', event => {
  if (event.persisted) {
    startReadingState();
    applyMotionPreference();
  }
});
startReadingState();
applyMotionPreference();

const menu = document.querySelector('#navigation');
const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => {
  menu.showModal();
  menuButton.setAttribute('aria-expanded', 'true');
});
menu.addEventListener('close', () => menuButton.setAttribute('aria-expanded', 'false'));
document.querySelector('[data-close-menu]').addEventListener('click', () => menu.close());
for (const link of menu.querySelectorAll('[data-chapter-link]')) {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    menu.close();
    document.getElementById(link.hash.slice(1)).focus({ preventScroll: true });
  });
}

for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href], button:not([disabled])')]
      .filter(control => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
}

const lightbox = document.querySelector('#lightbox');
const links = [...document.querySelectorAll('[data-lightbox]')];
const photo = lightbox.querySelector('img');
const caption = lightbox.querySelector('figcaption');
const previous = lightbox.querySelector('.lightbox-prev');
const next = lightbox.querySelector('.lightbox-next');
let galleryLinks = [];
let activeIndex = 0;
let returnFocus;

function displayPhoto(index) {
  activeIndex = index;
  const source = galleryLinks[index].querySelector('img');
  photo.src = galleryLinks[index].href;
  photo.alt = source.alt;
  caption.textContent = `${index + 1} / ${galleryLinks.length} — ${source.alt}`;
  previous.setAttribute('aria-disabled', String(index === 0));
  next.setAttribute('aria-disabled', String(index === galleryLinks.length - 1));
  previous.hidden = galleryLinks.length === 1;
  next.hidden = galleryLinks.length === 1;
}

for (const link of links) {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    returnFocus = link;
    galleryLinks = [...link.closest('[data-chapter]').querySelectorAll('[data-lightbox]')];
    displayPhoto(galleryLinks.indexOf(link));
    lightbox.showModal();
  });
}
previous.addEventListener('click', () => { if (activeIndex > 0) displayPhoto(activeIndex - 1); });
next.addEventListener('click', () => { if (activeIndex < galleryLinks.length - 1) displayPhoto(activeIndex + 1); });
lightbox.querySelector('[data-close-lightbox]').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && activeIndex > 0) {
    event.preventDefault();
    displayPhoto(activeIndex - 1);
  }
  if (event.key === 'ArrowRight' && activeIndex < galleryLinks.length - 1) {
    event.preventDefault();
    displayPhoto(activeIndex + 1);
  }
});
lightbox.addEventListener('close', () => returnFocus?.focus());
photo.addEventListener('error', () => {
  caption.textContent = 'La photo n’a pas pu être chargée. Fermez cet aperçu puis réessayez.';
});

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    const subject = encodeURIComponent(`Renseignements — ${name}`);
    const body = encodeURIComponent(`Nom : ${name}\nAdresse e-mail : ${email}\n\n${message}`);
    const result = form.querySelector('.form-result');
    const draft = form.querySelector('[data-mail-draft]');
    draft.href = `mailto:${form.dataset.recipient}?subject=${subject}&body=${body}`;
    result.hidden = false;
    draft.focus();
  });
  form.addEventListener('input', () => {
    form.querySelector('.form-result').hidden = true;
    form.querySelector('[data-mail-draft]').removeAttribute('href');
  });
}
