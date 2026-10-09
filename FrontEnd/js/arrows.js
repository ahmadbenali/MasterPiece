// Use one angular arrow shape for static and dynamically updated labels.
(() => {
  const directions = {
    '→': 'right', '←': 'left', '↑': 'up', '↓': 'down',
    '↗': 'up-right', '↘': 'down-right', '↙': 'down-left', '↖': 'up-left'
  };
  function replaceArrows(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest('script,style,textarea,svg') && /[→←↑↓↗↘↙↖]/.test(node.data)) nodes.push(node);
    }
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.data.split(/([→←↑↓↗↘↙↖])/).forEach(part => {
        if (!directions[part]) { fragment.append(document.createTextNode(part)); return; }
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 80 80');
        svg.setAttribute('class', `ui-arrow ui-arrow-${directions[part]}`);
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = '<path d="M8 40H66M42 16L66 40L42 64" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="butt" stroke-linejoin="round"/>';
        fragment.append(svg);
      });
      node.replaceWith(fragment);
    });
  }
  const observer = new MutationObserver(() => {
    observer.disconnect();
    replaceArrows(document.body);
    observe();
  });
  function observe() { observer.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  replaceArrows(document.body);
  observe();
})();
