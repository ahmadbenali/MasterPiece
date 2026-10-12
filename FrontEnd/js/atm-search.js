(() => {
  const form = document.getElementById('atmSearchForm');
  const input = document.getElementById('atmPlaceSearch');
  const rows = [...document.querySelectorAll('[data-atm-place]')];
  function search() {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = rows.filter(row => {
      const text = `${row.dataset.atmPlace} ${row.textContent}`.toLowerCase();
      row.hidden = !terms.every(term => text.includes(term));
      return !row.hidden;
    });
    document.getElementById('atmSearchStatus').textContent = matches.length
      ? `${matches.length} sample location${matches.length === 1 ? '' : 's'} found.`
      : 'No sample locations match this place. Try Amman or Irbid.';
    const caption = document.querySelector('.map-caption strong');
    caption.textContent = matches.length === 1 ? matches[0].querySelector('strong').textContent : matches.length ? 'Sample locations' : 'No matching locations';
    document.querySelector('.map-pin').hidden = !matches.length;
  }
  form.addEventListener('submit', event => { event.preventDefault(); search(); });
  input.addEventListener('input', search);
})();
