const form = document.querySelector('#recorder');
const preview = document.querySelector('#preview');
const exportButton = document.querySelector('#export');
const importInput = document.querySelector('#import');
const resetButton = document.querySelector('#reset');
let record = null;

const fields = [
  ['observations', 'Retained observations'],
  ['disagreements', 'Disagreements or tensions'],
  ['missingContext', 'Missing context'],
  ['unresolved', 'Unresolved items']
];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const lines = value => value.split('\n').map(item => item.trim()).filter(Boolean);
const fieldValue = id => document.querySelector(`#${id}`).value;

function buildRecord() {
  return {
    format: 'uncertainty-reader-handoff/v1',
    boundary: 'Reader response only. It retains observations and gaps without a verdict, ranking, or recommendation.',
    packet: fieldValue('packet').trim(),
    reader: fieldValue('reader').trim() || null,
    readAt: fieldValue('readAt') || null,
    observations: lines(fieldValue('observations')),
    disagreements: lines(fieldValue('disagreements')),
    missingContext: lines(fieldValue('missingContext')),
    unresolved: lines(fieldValue('unresolved'))
  };
}
function render(value) {
  const sections = fields.map(([key, label]) => {
    const entries = value[key];
    return `<article><h3>${label}</h3>${entries.length ? `<ul>${entries.map(item => `<li>${escape(item)}</li>`).join('')}</ul>` : '<p class="gap">No items recorded — explicit blank.</p>'}</article>`;
  }).join('');
  preview.innerHTML = `<div class="record-head"><p class="kicker">Reader handoff record</p><h2>${escape(value.packet)}</h2><p>${value.reader ? `Reader: ${escape(value.reader)}` : 'Reader label not recorded'}${value.readAt ? ` · Read at ${escape(value.readAt)}` : ''}</p></div>${sections}<p class="boundary-note">${escape(value.boundary)}</p>`;
}
function fill(value) {
  for (const id of ['packet', 'reader', 'readAt']) document.querySelector(`#${id}`).value = value[id] || '';
  for (const [id] of fields) document.querySelector(`#${id}`).value = (value[id] || []).join('\n');
}
form.addEventListener('submit', event => {
  event.preventDefault();
  record = buildRecord();
  render(record);
  exportButton.disabled = false;
});
exportButton.addEventListener('click', () => {
  if (!record) return;
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
  const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'reader-handoff-record.json' });
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
});
importInput.addEventListener('change', async () => {
  const file = importInput.files[0];
  if (!file) return;
  try {
    const value = JSON.parse(await file.text());
    if (value.format !== 'uncertainty-reader-handoff/v1' || typeof value.packet !== 'string' || !fields.every(([id]) => Array.isArray(value[id]))) throw new Error('not a reader handoff record');
    record = value; fill(value); render(value); exportButton.disabled = false;
  } catch (error) { preview.innerHTML = `<p class="error">Could not reload this file: ${escape(error.message)}.</p>`; }
  importInput.value = '';
});
resetButton.addEventListener('click', () => { form.reset(); record = null; exportButton.disabled = true; preview.innerHTML = '<p class="empty">Fill in the handoff above. Blank sections will remain explicit in the record.</p>'; });
