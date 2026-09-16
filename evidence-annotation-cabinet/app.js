(() => {
  const storageKey = 'evidence-annotation-cabinet-v1';
  const form = document.querySelector('#annotation-form');
  const editor = document.querySelector('#editor');
  const cabinet = document.querySelector('#cabinet');
  const filter = document.querySelector('#filter');
  const count = document.querySelector('#count');
  let annotations = [];

  const normalise = (item) => ({ ...item, tags: Array.isArray(item.tags) ? item.tags : String(item.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean), history: Array.isArray(item.history) ? item.history : [] });
  const persist = () => localStorage.setItem(storageKey, JSON.stringify(annotations));
  const openEditor = (item = {}) => {
    form.reset();
    document.querySelector('#editor-title').textContent = item.id ? 'Edit annotation' : 'New annotation';
    for (const name of ['id', 'record', 'source', 'quote', 'note', 'author']) document.querySelector(`#annotation-${name}, #${name}`)?.setAttribute('value', item[name] || '');
    for (const name of ['quote', 'note']) document.querySelector(`#${name}`).value = item[name] || '';
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
      card.querySelector('blockquote').textContent = item.quote;
      card.querySelector('.note').textContent = item.note;
      for (const tag of item.tags) { const li = document.createElement('li'); li.textContent = tag; card.querySelector('.tags').append(li); }
      card.querySelector('small').textContent = item.author ? `Annotated by ${item.author}` : 'Author not recorded';
      card.querySelector('.edit').addEventListener('click', () => openEditor(item));
      cabinet.append(card);
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
    const item = normalise({ id, record: value('record'), source: value('source'), quote: value('quote'), note: value('note'), tags: value('tags'), author: value('author'), history: [...history, { at: new Date().toISOString(), action: index === -1 ? 'created' : 'edited', note: index === -1 ? 'Created in cabinet.' : 'Edited in cabinet.' }] });
    if (index === -1) annotations.unshift(item); else annotations[index] = item;
    persist(); closeEditor(); render();
  });
  document.querySelector('#export').addEventListener('click', () => {
    const packet = { format: 'evidence-annotation-cabinet/v1', exportedAt: new Date().toISOString(), annotations };
    const blob = new Blob([JSON.stringify(packet, null, 2) + '\n'], { type: 'application/json' });
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'evidence-annotation-packet.json' });
    link.click(); URL.revokeObjectURL(link.href);
  });
  start().catch((error) => { cabinet.textContent = `Could not open local annotations: ${error.message}`; });
})();
