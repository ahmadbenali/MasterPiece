(() => {
  const key = 'northbank-preview-agents';
  let agents = [{id:'sample-1',name:'Jordan Davis',email:'j.davis@northbank.com',active:true},{id:'sample-2',name:'Maya Lee',email:'maya.lee@example.com',active:true}];
  try { const saved = JSON.parse(localStorage.getItem(key)); if (Array.isArray(saved)) agents = saved.filter(a => a && typeof a.id === 'string' && typeof a.name === 'string' && typeof a.email === 'string'); } catch {}
  const editor = document.getElementById('agentEditor');
  const form = document.getElementById('agentForm');
  const deletion = document.getElementById('agentDeleteDialog');
  const status = document.getElementById('agentStatus');
  let editing;
  let deleting;
  function save(next) { try { localStorage.setItem(key,JSON.stringify(next)); agents = next; render(); return true; } catch { status.textContent = 'Unable to save: browser storage is unavailable.'; return false; } }
  function open(agent) {
    editing = agent?.id;
    form.reset(); form.elements.name.value = agent?.name || ''; form.elements.email.value = agent?.email || '';
    document.getElementById('agentEditorTitle').textContent = agent ? 'Edit agent' : 'Add agent';
    document.getElementById('agentFormError').textContent = '';
    editor.showModal();
  }
  function render() {
    const rows = document.getElementById('agentRows'); rows.replaceChildren();
    const query = document.getElementById('agentSearch').value.toLowerCase().trim();
    const visible = agents.filter(a => `${a.name} ${a.email}`.toLowerCase().includes(query));
    document.getElementById('agentEmpty').hidden = !!visible.length;
    visible.forEach(agent => {
      const row = document.createElement('tr');
      [agent.name,agent.email,agent.active ? 'Active' : 'Suspended'].forEach(value => { const td = document.createElement('td'); td.textContent = value; row.append(td); });
      const actions = document.createElement('td');
      [['Edit',() => open(agent)], [agent.active ? 'Suspend' : 'Reactivate',() => { if(save(agents.map(a => a.id === agent.id ? {...a,active:!a.active} : a))) status.textContent = 'Agent preview status updated.'; }], ['Delete',() => { deleting = agent.id; document.getElementById('agentDeleteCopy').textContent = `Delete ${agent.name} (${agent.email}) from this preview? No real credentials will be changed.`; deletion.showModal(); }]].forEach(([label,action]) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = `btn-wise btn-outline${label === 'Delete' ? ' management-delete' : ''}`; button.textContent = label; button.addEventListener('click',action); actions.append(button);
      });
      row.append(actions); rows.append(row);
    });
  }
  document.getElementById('addAgent').addEventListener('click',() => open());
  document.getElementById('agentSearch').addEventListener('input',render);
  document.getElementById('cancelAgentEditor').addEventListener('click',() => editor.close());
  document.getElementById('cancelAgentDelete').addEventListener('click',() => deletion.close());
  document.getElementById('confirmAgentDelete').addEventListener('click',() => { if (save(agents.filter(a => a.id !== deleting))) { deletion.close(); status.textContent = 'Agent deleted from this preview.'; } });
  form.addEventListener('submit',event => {
    event.preventDefault();
    const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim();
    if (!name || agents.some(a => a.id !== editing && a.email.toLowerCase() === email.toLowerCase())) { document.getElementById('agentFormError').textContent = !name ? 'Enter a name.' : 'An agent with this email already exists.'; return; }
    const next = editing ? agents.map(a => a.id === editing ? {...a,name,email} : a) : [...agents,{id:crypto.randomUUID(),name,email,active:true}];
    if (save(next)) { editor.close(); status.textContent = editing ? 'Agent details updated.' : 'Agent added to this preview.'; }
  });
  render();
})();
