import { renderComparisonReport } from './report.mjs';

(() => {
  const storageKey = 'evidence-annotation-cabinet-v1';
  const form = document.querySelector('#annotation-form');
  const editor = document.querySelector('#editor');
  const cabinet = document.querySelector('#cabinet');
  const comparison = document.querySelector('#comparison');
  const filter = document.querySelector('#filter');
  const count = document.querySelector('#count');
  let annotations = [];

  const normalise = (item) => ({ ...item, tags: Array.isArray(item.tags) ? item.tags : String(item.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean), history: Array.isArray(item.history) ? item.history : [] });
  const persist = () => localStorage.setItem(storageKey, JSON.stringify(annotations));
  const openEditor = (item = {}) => {
    form.reset();
    document.querySelector('#editor-title').textContent = item.id ? 'Edit annotation' : 'New annotation';
    for (const name of ['id', 'record', 'source', 'author']) document.querySelector(`#annotation-${name}, #${name}`)?.setAttribute('value', item[name] || '');
    for (const name of ['quote', 'claim', 'note']) document.querySelector(`#${name}`).value = item[name] || '';
    document.querySelector('#confidence').value = item.confidence || 'medium';
    document.querySelector('#observed').value = item.observed || '';
    document.querySelector('#tags').value = (item.tags || []).join(', ');
    editor.hidden = false;
    document.querySelector('#record').focus();
  };
  const closeEditor = () => { editor.hidden = true; form.reset(); };
  const render = () => {
    const needle = filter.value.trim().toLowerCase();
    const visible = annotations.filter((item) => JSON.stringify(item).toLowerCase().includes(needle));
    cabinet.replaceChildren();
    for (const item of visible) {
      const card = document.querySelector('#card-template').content.firstElementChild.cloneNode(true);
      card.querySelector('h2').textContent = item.record;
      card.querySelector('.source').textContent = `Source: ${item.source}`;
      card.querySelector('.metadata').textContent = `Claim: ${item.claim || 'Not recorded'} · Confidence: ${item.confidence || 'Not recorded'} · Evidence date: ${item.observed || 'Not recorded'}`;
      card.querySelector('blockquote').textContent = item.quote;
      card.querySelector('.note').textContent = item.note;
      for (const tag of item.tags) { const li = document.createElement('li'); li.textContent = tag; card.querySelector('.tags').append(li); }
      card.querySelector('small').textContent = item.author ? `Annotated by ${item.author}` : 'Author not recorded';
      card.querySelector('.edit').addEventListener('click', () => openEditor(item));
      cabinet.append(card);
    }
    comparison.replaceChildren();
    const groups = new Map();
    for (const item of visible) groups.set(item.record, [...(groups.get(item.record) || []), item]);
    for (const [record, items] of groups) if (items.length > 1) {
      const section = document.createElement('section'); section.className = 'comparison';
      const heading = document.createElement('h2'); heading.tabIndex = -1; heading.textContent = `Compare: ${record}`; section.append(heading);
      const table = document.createElement('table'); table.innerHTML = '<thead><tr><th>Claim</th><th>Source</th><th>Confidence</th><th>Date</th></tr></thead>';
      const body = document.createElement('tbody');
      for (const item of items) { const row = document.createElement('tr'); for (const value of [item.claim, item.source, item.confidence, item.observed]) { const cell = document.createElement('td'); cell.textContent = value || 'Not recorded'; row.append(cell); } body.append(row); }
      table.append(body); section.append(table); comparison.append(section);
    }
    count.textContent = `${visible.length} of ${annotations.length} annotations`;
  };
  const start = async () => {
    const saved = localStorage.getItem(storageKey);
    annotations = saved ? JSON.parse(saved).map(normalise) : (await fetch('fixtures.json').then((response) => response.json())).map(normalise);
    if (!saved) persist();
    render();
  };
  document.querySelector('#new').addEventListener('click', () => openEditor());
  document.querySelector('#cancel').addEventListener('click', closeEditor);
  filter.addEventListener('input', render);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (name) => document.querySelector(`#${name}`).value.trim();
    const id = value('annotation-id') || `annotation-${crypto.randomUUID()}`;
    const index = annotations.findIndex((annotation) => annotation.id === id);
    const history = index === -1 ? [] : annotations[index].history;
    const item = normalise({ id, record: value('record'), source: value('source'), quote: value('quote'), claim: value('claim'), confidence: value('confidence'), observed: value('observed'), note: value('note'), tags: value('tags'), author: value('author'), history: [...history, { at: new Date().toISOString(), action: index === -1 ? 'created' : 'edited', note: index === -1 ? 'Created in cabinet.' : 'Edited in cabinet.' }] });
    if (index === -1) annotations.unshift(item); else annotations[index] = item;
    persist(); closeEditor(); render();
  });
  const download = (contents, type, filename) => {
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([contents], { type })), download: filename });
    link.click(); URL.revokeObjectURL(link.href);
  };
  document.querySelector('#export').addEventListener('click', () => {
    const packet = { format: 'evidence-annotation-cabinet/v1', exportedAt: new Date().toISOString(), annotations };
    download(JSON.stringify(packet, null, 2) + '\n', 'application/json', 'evidence-annotation-packet.json');
  });
  document.querySelector('#export-report').addEventListener('click', () => download(renderComparisonReport(annotations), 'text/html', 'evidence-comparison-report.html'));
  start().catch((error) => { cabinet.textContent = `Could not open local annotations: ${error.message}`; });
})();
