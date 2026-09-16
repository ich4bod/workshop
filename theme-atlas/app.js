(async () => {
  const response = await fetch('themes.json');
  if (!response.ok) throw new Error(`Could not load themes: ${response.status}`);
  const data = await response.json();
  const atlas = document.querySelector('#atlas');
  const template = document.querySelector('#source-template');
  const sourceCount = data.sources.length;
  const themeCount = data.sources.reduce((total, item) => total + item.themes.length, 0);
  document.querySelector('#updated').textContent = `Source sweep saved ${new Date(data.at).toLocaleString()}.`;
  document.querySelector('#summary').innerHTML = `<div><dt>Sources</dt><dd>${sourceCount}</dd></div><div><dt>Themes</dt><dd>${themeCount}</dd></div>`;
  for (const item of data.sources) {
    const card = template.content.cloneNode(true);
    const [kind, url] = item.source.split(' ');
    card.querySelector('h3').textContent = new URL(url).hostname;
    card.querySelector('.source-url').textContent = `${kind} · ${url}`;
    const list = card.querySelector('ul');
    for (const theme of item.themes) { const li = document.createElement('li'); li.textContent = theme; list.append(li); }
    atlas.append(card);
  }
})().catch(error => { document.querySelector('#atlas').textContent = error.message; });
