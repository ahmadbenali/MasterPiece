(() => {
  'use strict';
  const key = 'northbank-login-reveal';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let origin;

  // Capture before the mobile navigation closes and moves its access links.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('/login/login.html') ||
        (url.search && url.search !== '?mode=signup') || reducedMotion.matches) return;
    const bounds = (link.querySelector('.login-pill-label') || link).getBoundingClientRect();
    origin = {
      x: (bounds.left + bounds.width / 2) / innerWidth,
      y: (bounds.top + bounds.height / 2) / innerHeight,
      destination: url.href,
      time: Date.now()
    };
  }, true);

  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    if (!origin || reducedMotion.matches || event.activation?.entry.url !== origin.destination) {
      event.viewTransition.skipTransition();
      return;
    }
    try {
      sessionStorage.setItem(key, JSON.stringify(origin));
    } catch {
      event.viewTransition.skipTransition();
    }
  });

  window.addEventListener('pagereveal', async (event) => {
    if (!event.viewTransition) return;
    let saved;
    try {
      saved = JSON.parse(sessionStorage.getItem(key));
      sessionStorage.removeItem(key);
    } catch { /* Storage may be disabled; ordinary navigation still works. */ }
    if (!saved || saved.destination !== location.href || Date.now() - saved.time > 15000 ||
        reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    try {
      await event.viewTransition.ready;
      const x = saved.x * innerWidth;
      const y = saved.y * innerHeight;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.documentElement.animate([
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${Math.ceil(radius)}px at ${x}px ${y}px)` }
      ], {
        duration: 1800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'both',
        pseudoElement: '::view-transition-new(root)'
      });
    } catch {
      event.viewTransition.skipTransition();
    }
  });
})();
