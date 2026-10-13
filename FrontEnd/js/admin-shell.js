(() => {
  const themeSearch = document.querySelector('.admin-tool-search');
  if (themeSearch) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'admin-theme-toggle';
    toggle.innerHTML = '<svg viewBox="0 0 25 25" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="theme-sun"><circle cx="12.5" cy="12.5" r="5"/><path d="M12.5 1.5v2m0 18v2M1.5 12.5h2m18 0h2M4.7 4.7l1.4 1.4m12.8 12.8 1.4 1.4M4.7 20.3l1.4-1.4M18.9 6.1l1.4-1.4"/></g><path class="theme-moon" d="M21.2 13.2A9 9 0 1 1 11.4 3.4a7 7 0 0 0 9.8 9.8Z"/></svg>';
    let light = false;
    try { light = localStorage.getItem('northbank-admin-theme') === 'light'; } catch {}
    function applyTheme() {
      document.body.classList.toggle('admin-light-theme', light);
      toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      toggle.setAttribute('aria-pressed', String(!light));
      toggle.title = toggle.getAttribute('aria-label');
    }
    applyTheme();
    toggle.addEventListener('click', async () => {
      const update = () => {
        light = !light;
        applyTheme();
        try { localStorage.setItem('northbank-admin-theme', light ? 'light' : 'dark'); } catch {}
      };
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        update();
        return;
      }
      toggle.disabled = true;
      document.documentElement.classList.add('admin-theme-reveal');
      try {
        const transition = document.startViewTransition(update);
        await transition.ready;
        const radius = Math.hypot(innerWidth / 2, innerHeight);
        await document.documentElement.animate({
          clipPath: ['circle(0px at 50% 100%)', `circle(${radius}px at 50% 100%)`]
        }, {
          duration: 850,
          easing: 'cubic-bezier(.22,1,.36,1)',
          pseudoElement: '::view-transition-new(root)'
        }).finished;
        await transition.finished;
      } catch {
        // A skipped visual transition still applies the selected theme.
      } finally {
        document.documentElement.classList.remove('admin-theme-reveal');
        toggle.disabled = false;
      }
    });
    themeSearch.after(toggle);
  }
  // Animate only the outer cards, so nested panels do not move twice.
  const cardSelector = '.dashboard-card,.stat-card,.card-wise';
  const entranceCards = [...document.querySelectorAll(`main ${cardSelector.split(',').join(',main ')}`)]
    .filter(card => !card.parentElement.closest(cardSelector));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    entranceCards.forEach((card, index) => {
      card.style.setProperty('--card-enter-delay', `${Math.min(index, 7) * 65}ms`);
      card.classList.add('admin-card-enter');
      card.addEventListener('animationend', event => {
        if (event.target !== card || event.animationName !== 'admin-card-enter') return;
        card.classList.remove('admin-card-enter');
        card.style.removeProperty('--card-enter-delay');
      });
    });
  }
  const icons = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    stream: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    flagged: '<path d="M4 21V4m0 0c5-4 11 4 16 0v10c-5 4-11-4-16 0"/>',
    cases: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a21 21 0 0 0 18 0m-9 0v3"/>',
    reports: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 16v2m4-6v6m4-3v3"/>',
    investigation: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5M7 11h7m-3-3v6"/>',
    assessment: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6zM20 2v4m-2-2h4"/>',
    decision: '<path d="M12 3v7m0 0H6v7m6-7h6v7"/><circle cx="12" cy="3" r="2"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/>',
    credentials: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M5 16a3 3 0 0 1 6 0m3-7h4m-4 4h4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m-9 5h14"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    collapse: '<path d="m13 7-5 5 5 5m5-10-5 5 5 5"/>'
  };
  function icon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'admin-icon');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = icons[name];
    return svg;
  }
  const sidebar = document.querySelector('.admin-sidebar');
  let refreshNavigation = () => {};
  if (sidebar) {
    sidebar.querySelector('.admin-brand').setAttribute('aria-label', 'northBank home');
    const names = ['overview','stream','flagged','cases','reports','investigation','assessment','decision','credentials','credentials','logout'];
    sidebar.querySelectorAll('.admin-navigation>a').forEach((link, index) => {
      const label = [...link.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      link.setAttribute('aria-label', label);
      link.title = label;
      link.querySelector('span').replaceChildren(icon(names[index]));
      const text = document.createElement('span');
      text.className = 'admin-nav-label';
      text.textContent = label;
      [...link.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.remove());
      link.querySelector('span').after(text);
    });
    const categories = [];
    sidebar.querySelectorAll('.nav-section-label').forEach((heading, index) => {
      const links = [];
      let next = heading.nextElementSibling;
      while (next && !next.classList.contains('nav-section-label')) {
        if (next.matches('a')) links.push(next);
        next = next.nextElementSibling;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-section-label category-toggle';
      button.textContent = heading.textContent;
      button.setAttribute('aria-expanded', 'true');
      links.forEach((link, linkIndex) => { link.id = `admin-category-${index}-link-${linkIndex}`; });
      button.setAttribute('aria-controls', links.map(link => link.id).join(' '));
      heading.replaceWith(button);
      const category = { button, links, collapsed: false };
      categories.push(category);
      button.addEventListener('click', () => {
        category.collapsed = !category.collapsed;
        button.setAttribute('aria-expanded', String(!category.collapsed));
        refreshNavigation();
      });
    });
    refreshNavigation = () => {
      const query = document.querySelector('.admin-tool-search input')?.value.trim().toLowerCase() || '';
      const rail = document.body.classList.contains('sidebar-collapsed') && window.matchMedia('(min-width:761px)').matches;
      categories.forEach(category => category.links.forEach(link => {
        const matches = link.textContent.toLowerCase().includes(query);
        link.hidden = !matches || (!query && !rail && category.collapsed);
      }));
    };
    window.matchMedia('(min-width:761px)').addEventListener('change', () => refreshNavigation());
    const collapse = document.createElement('button');
    collapse.type = 'button';
    collapse.className = 'sidebar-collapse';
    collapse.setAttribute('aria-controls', 'workspaceLinks');
    collapse.append(icon('collapse'));
    function setCollapsed(collapsed) {
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      collapse.setAttribute('aria-expanded', String(!collapsed));
      collapse.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      collapse.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
      refreshNavigation();
    }
    let collapsed = false;
    try { collapsed = sessionStorage.getItem('northbank-admin-sidebar') === 'collapsed'; } catch {}
    setCollapsed(collapsed);
    collapse.addEventListener('click', () => {
      const next = !document.body.classList.contains('sidebar-collapsed');
      setCollapsed(next);
      try { sessionStorage.setItem('northbank-admin-sidebar', next ? 'collapsed' : 'expanded'); } catch {}
    });
    sidebar.prepend(collapse);
    document.getElementById('navToggle')?.replaceChildren(icon('menu'));
  }
  function replaceSymbol(selector, symbol, name) {
    document.querySelectorAll(selector).forEach(element => {
      const node = [...element.childNodes].find(item => item.nodeType === Node.TEXT_NODE && item.textContent.includes(symbol));
      if (!node) return;
      node.textContent = node.textContent.replace(symbol, '');
      element.prepend(icon(name));
    });
  }
  replaceSymbol('.quiet-button', '▥', 'reports');
  replaceSymbol('.notification-button', '♧', 'bell');
  replaceSymbol('.clock-icon', '◷', 'clock');
  replaceSymbol('.assistant-card h2', '✧', 'assessment');
  replaceSymbol('.assistant-answer>span', '✧', 'assessment');
  const date = document.getElementById('dashboardDate');
  if (date) date.textContent = new Intl.DateTimeFormat('en',{timeZone:'Asia/Amman',month:'short',day:'numeric',weekday:'short'}).format(new Date());
  const search = document.querySelector('.admin-tool-search input');
  search?.addEventListener('input', () => {
    refreshNavigation();
  });
  // Use the reference's heavy, rounded numerals without changing body text.
  const numericAreas = document.querySelectorAll('.metric,.stat-card strong,.risk-score,.health-ring strong,.split-metrics strong,.summary-list dd,.wise-table td,.admin-table td');
  numericAreas.forEach(area => {
    const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/\d/.test(node.textContent) && !node.parentElement.closest('svg,.admin-number')) nodes.push(node);
    }
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\d+(?:[.,]\d+)*(?:%)?)/).forEach(part => {
        if (/^\d/.test(part)) {
          const number = document.createElement('span');
          number.className = 'admin-number';
          number.textContent = part;
          fragment.append(number);
        } else fragment.append(document.createTextNode(part));
      });
      node.replaceWith(fragment);
    });
  });
})();
