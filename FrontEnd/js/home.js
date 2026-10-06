'use strict';

// Presentation interactions only. No rates, transactions, account data or storage.
const byId = (id) => document.getElementById(id);
const header = document.querySelector('.site-header');
const shell = byId('navPanelShell');
const backdrop = byId('menuBackdrop');
const triggers = [...document.querySelectorAll('[data-menu]')];
const desktop = window.matchMedia('(min-width: 769px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeMenu = null;
let closeTimer;
let suppressFocus = false;

function resizeMenu() {
  if (!activeMenu) return;
  const height = byId(`${activeMenu}Menu`).scrollHeight;
  shell.style.setProperty('--menu-height', `${height}px`);
}

function openMenu(name) {
  if (!desktop.matches) return;
  clearTimeout(closeTimer);
  activeMenu = name;
  triggers.forEach((trigger) => {
    const active = trigger.dataset.menu === name;
    trigger.setAttribute('aria-expanded', String(active));
    const panel = byId(`${trigger.dataset.menu}Menu`);
    panel.classList.toggle('is-active', active);
    panel.inert = !active;
  });
  shell.inert = false;
  shell.setAttribute('aria-hidden', 'false');
  header.classList.remove('is-scrolled-away');
  header.classList.add('is-menu-open');
  backdrop.classList.add('is-visible');
  resizeMenu();
}

function closeMenu({ restoreFocus = false } = {}) {
  clearTimeout(closeTimer);
  const previousTrigger = triggers.find((trigger) => trigger.dataset.menu === activeMenu);
  activeMenu = null;
  header.classList.remove('is-menu-open');
  backdrop.classList.remove('is-visible');
  shell.style.setProperty('--menu-height', '0px');
  shell.inert = true;
  shell.setAttribute('aria-hidden', 'true');
  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    const panel = byId(`${trigger.dataset.menu}Menu`);
    panel.classList.remove('is-active');
    panel.inert = true;
  });
  if (restoreFocus && previousTrigger) {
    suppressFocus = true;
    previousTrigger.focus({ preventScroll: true });
    suppressFocus = false;
  }
}

triggers.forEach((trigger) => {
  trigger.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') openMenu(trigger.dataset.menu);
  });
  trigger.addEventListener('focus', () => {
    if (!suppressFocus) openMenu(trigger.dataset.menu);
  });
  trigger.addEventListener('click', (event) => {
    if (event.detail === 0 && activeMenu === trigger.dataset.menu) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu(trigger.dataset.menu);
    }
  });
});
header.addEventListener('pointerenter', () => clearTimeout(closeTimer));
header.addEventListener('pointerleave', () => {
  closeTimer = setTimeout(() => closeMenu(), 130);
});
header.addEventListener('focusout', (event) => {
  if (!header.contains(event.relatedTarget)) closeMenu();
});
backdrop.addEventListener('pointerenter', () => {
  closeTimer = setTimeout(() => closeMenu(), 100);
});
backdrop.addEventListener('click', () => closeMenu());
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) closeMenu();
});

// Touch navigation uses expandable lists rather than hover.
const mobileToggle = byId('mobileToggle');
function closeMobileMenu() {
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Open menu');
  byId('mobileMenu').hidden = true;
}
mobileToggle.addEventListener('click', () => {
  closeMenu();
  const open = mobileToggle.getAttribute('aria-expanded') === 'true';
  byId('mobileMenu').hidden = open;
  mobileToggle.setAttribute('aria-expanded', String(!open));
  mobileToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
});
document.querySelectorAll('[data-mobile-panel]').forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    button.querySelector('span').textContent = open ? '+' : '−';
    byId(button.dataset.mobilePanel).hidden = open;
  });
});
header.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
    closeMobileMenu();
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu({ restoreFocus: true });
    closeMobileMenu();
  }
});
window.addEventListener('resize', () => {
  if (desktop.matches) {
    closeMobileMenu();
    resizeMenu();
  } else {
    closeMenu();
  }
});

// Hide the sticky header when scrolling down; slide it back on upward scroll.
let lastScroll = window.scrollY;
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const current = window.scrollY;
    const change = current - lastScroll;
    if (Math.abs(change) > 4) {
      const mobileOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
      header.classList.toggle('is-scrolled-away', current > 150 && change > 0 && !activeMenu && !mobileOpen);
      lastScroll = current;
    }
    if (current < 80) header.classList.remove('is-scrolled-away');
    scrollQueued = false;
  });
}, { passive: true });

// Static informational popups: these do not submit or calculate anything.
const info = byId('infoDialog');
function showInfo(title, copy) {
  closeMenu();
  byId('infoTitle').textContent = title;
  byId('infoText').textContent = copy;
  info.showModal();
}
byId('rateButton').addEventListener('click', () => showInfo('The mid-market exchange rate', 'An upfront exchange rate with no hidden markup. The quote on this page is a fixed visual example.'));
byId('learnRate').addEventListener('click', () => showInfo('Our rate is out in the open', 'The rate and fee are shown separately, so you can see exactly what the example transfer looks like. This static page does not request live prices.'));
byId('feeButton').addEventListener('click', () => showInfo('Your fee, upfront', 'This example displays a fee of 5.47 USD, included in the 1,000.00 USD amount. It is a display sample, not a transaction.'));
byId('sendButton').addEventListener('click', () => showInfo('Send money', 'This is a static frontend showcase. The transfer card is for presentation only.'));
byId('calculator').addEventListener('submit', (event) => event.preventDefault());

// Cosmetic currency controls change their labels and flags only.
const currencyFlags = {
  USD: '../assets/usd.svg', EUR: '../assets/eur.svg', GBP: '../assets/gbp.svg',
  JPY: '../assets/flags/jp.svg', CAD: '../assets/flags/ca.svg', AUD: '../assets/flags/au.svg'
};
function updateCurrencyFlags() {
  byId('sendFlag').src = currencyFlags[byId('sendCurrency').value];
  byId('receiveFlag').src = currencyFlags[byId('receiveCurrency').value];
}
['sendCurrency', 'receiveCurrency'].forEach((id) => byId(id).addEventListener('change', updateCurrencyFlags));
byId('swap').addEventListener('click', () => {
  const previous = byId('sendCurrency').value;
  byId('sendCurrency').value = byId('receiveCurrency').value;
  byId('receiveCurrency').value = previous;
  updateCurrencyFlags();
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
info.querySelector('.dialog-done').addEventListener('click', () => info.close());
['localeButton', 'mobileLocale'].forEach((id) => {
  byId(id).addEventListener('click', () => {
    closeMenu();
    byId('localeDialog').showModal();
  });
});
byId('localeForm').addEventListener('submit', (event) => {
  event.preventDefault();
  byId('localeDialog').close();
});

// Review deck: the outgoing card shrinks behind the incoming card.
let reviewIndex = 0;
const reviews = [...document.querySelectorAll('.review-card')];
const reviewStatus = document.createElement('p');
reviewStatus.className = 'visually-hidden';
reviewStatus.setAttribute('aria-live', 'polite');
document.querySelector('.reviews-heading').append(reviewStatus);
function updateReviews() {
  const width = reviews[0].getBoundingClientRect().width;
  reviews.forEach((card, index) => {
    const distance = index - reviewIndex;
    const behind = distance < 0;
    const x = behind ? -Math.min(120, 90 + (-distance - 1) * 12) : distance * (width + 28);
    const scale = behind ? Math.max(0.62, 0.76 - (-distance - 1) * 0.04) : 1;
    card.style.transform = `translateX(${x}px) scale(${scale})`;
    card.style.opacity = distance < -1 ? '0' : behind ? '0.4' : '1';
    card.style.zIndex = String(behind ? 10 + index : 100 - index);
    card.inert = index !== reviewIndex;
    card.setAttribute('aria-hidden', String(index !== reviewIndex));
  });
  byId('prevReview').disabled = reviewIndex === 0;
  byId('nextReview').disabled = reviewIndex === reviews.length - 1;
  reviewStatus.textContent = `Review ${reviewIndex + 1} of ${reviews.length}`;
}
byId('prevReview').addEventListener('click', () => {
  reviewIndex = Math.max(0, reviewIndex - 1);
  updateReviews();
});
byId('nextReview').addEventListener('click', () => {
  reviewIndex = Math.min(reviews.length - 1, reviewIndex + 1);
  updateReviews();
});
window.addEventListener('resize', updateReviews);
updateReviews();

// Seamless decorative currency strip.
const ribbon = document.querySelector('.ribbon-flags');
const flags = [...ribbon.querySelectorAll('img')].slice(0, 6);
const group = document.createElement('div');
group.className = 'ribbon-group';
group.append(...flags);
ribbon.replaceChildren(group);
const duplicate = group.cloneNode(true);
duplicate.setAttribute('aria-hidden', 'true');
ribbon.append(duplicate);

// Staggered entrance and one-time scroll reveals, as in the supplied recording.
const revealTargets = document.querySelectorAll('.section-intro, .trust-grid, .platform-feature, .security-grid > article, .mission-section h2, .app-panel');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealTargets.forEach((element, index) => {
    element.classList.add('scroll-reveal');
    if (element.closest('.security-grid')) element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
    observer.observe(element);
  });
}
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('is-ready')));

const animationButton = byId('animationToggle');
const securityVideo = byId('securityVideo');
animationButton.addEventListener('click', () => {
  const paused = !securityVideo.paused;
  if (paused) securityVideo.pause();
  else securityVideo.play().catch(() => {});
  animationButton.setAttribute('aria-pressed', String(paused));
  animationButton.setAttribute('aria-label', paused ? 'Play security animation' : 'Pause security animation');
  animationButton.textContent = paused ? '▷' : 'Ⅱ';
});
function applyMotionPreference() {
  if (!reducedMotion.matches) return;
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('.scroll-reveal').forEach((element) => element.classList.add('is-visible'));
  animationButton.setAttribute('aria-label', 'Play security animation');
  animationButton.setAttribute('aria-pressed', 'true');
  animationButton.textContent = '▷';
}
reducedMotion.addEventListener('change', applyMotionPreference);
applyMotionPreference();
