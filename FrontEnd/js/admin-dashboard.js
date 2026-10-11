(() => {
  const date = document.getElementById('dashboardDate');
  date.textContent = new Intl.DateTimeFormat('en', {timeZone:'Asia/Amman',month:'short',day:'numeric',weekday:'short'}).format(new Date());
  const search = document.getElementById('transactionSearch');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const rows = [...document.querySelectorAll('.admin-table tbody tr')];
  let active = 'all';
  function filterRows() {
    const query = search.value.trim().toLowerCase();
    rows.forEach(row => { row.hidden = (active !== 'all' && row.dataset.status !== active) || !row.textContent.toLowerCase().includes(query); });
    document.getElementById('emptyTransactions').hidden = rows.some(row => !row.hidden);
  }
  search.addEventListener('input', filterRows);
  filters.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterRows();
  }));
  document.getElementById('chartPeriod').addEventListener('change', event => {
    const weekly = event.target.value === 'week';
    const curve = weekly ? 'M0 72C30 74 45 50 75 54S115 30 140 40S185 15 210 27S250 12 280 20S325 5 360 8' : 'M0 68C35 65 45 75 75 61S110 62 140 45S190 64 210 42S250 20 280 28S325 8 360 12';
    document.getElementById('trendLine').setAttribute('d', curve);
    document.getElementById('trendArea').setAttribute('d', `${curve}V85H0Z`);
    document.querySelector('.line-chart svg').setAttribute('aria-label', `Illustrative cleared transaction activity trend for ${weekly ? 'this week' : 'today'}`);
    const labels = weekly ? ['Mon','Wed','Fri','Sun'] : ['00:00','06:00','12:00','18:00'];
    document.querySelectorAll('#chartAxis span').forEach((label, index) => { label.textContent = labels[index]; });
  });
})();
