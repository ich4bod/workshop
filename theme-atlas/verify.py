"""Verify that explorer data and accessible rendered-list structure agree."""
import json
from pathlib import Path

data = json.loads(Path('themes.json').read_text())
html = Path('index.html').read_text()
js = Path('app.js').read_text()
assert data['sources'], 'No sources in themes.json'
assert all(item['themes'] for item in data['sources']), 'A source has no themes'
assert '<noscript>' in html and 'themes.json' in html, 'Missing no-JS fallback'
assert 'aria-live="polite"' in html, 'Missing live region'
assert "document.createElement('li')" in js, 'Themes are not rendered as list items'
assert 'item.themes' in js and 'data.sources' in js, 'Explorer does not render the supplied data'
print(f"verified {len(data['sources'])} sources and {sum(len(x['themes']) for x in data['sources'])} themes")
