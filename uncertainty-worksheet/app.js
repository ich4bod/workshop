const worksheet = document.querySelector('#worksheet');
const template = document.querySelector('#option-template');
let fixture;

const lines = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);
const optionValue = (card) => ({ name: card.querySelector('.name').value.trim(), confidence: card.querySelector('.confidence').value, assumptions: lines(card.querySelector('.assumptions').value), disconfirmingEvidence: lines(card.querySelector('.evidence').value), nextCheck: card.querySelector('.next-check').value.trim() });
const addOption = (option = {}) => {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector('h2').textContent = option.name || 'Unlabelled option';
  card.querySelector('.name').value = option.name || '';
  card.querySelector('.confidence').value = option.confidence || 'low';
  card.querySelector('.assumptions').value = (option.assumptions || []).join('\n');
  card.querySelector('.evidence').value = (option.disconfirmingEvidence || []).join('\n');
  card.querySelector('.next-check').value = option.nextCheck || '';
  card.querySelector('.name').addEventListener('input', () => { card.querySelector('h2').textContent = card.querySelector('.name').value || 'Unlabelled option'; });
  card.querySelector('.remove').addEventListener('click', () => card.remove());
  worksheet.append(card);
};
const render = (data) => {
  worksheet.replaceChildren();
  const question = document.createElement('section'); question.className = 'question'; question.innerHTML = `<h2>${escape(data.title)}</h2><p>${escape(data.question)}</p>`; worksheet.append(question);
  const reading = document.createElement('section'); reading.className = 'reading'; reading.innerHTML = `<h2>What the fixture makes visible</h2><p><strong>Agreement:</strong> ${escape(data.agreement)}</p><p><strong>Conflict:</strong> ${escape(data.conflict)}</p><p><strong>Unresolved questions:</strong><br>${(data.unresolvedQuestions || []).map(escape).join('<br>') || 'Not recorded'}</p>`; worksheet.append(reading);
  data.options.forEach(addOption);
};
const escape = (text = '') => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const snapshot = () => ({ title: fixture.title, question: fixture.question, agreement: fixture.agreement, conflict: fixture.conflict, unresolvedQuestions: fixture.unresolvedQuestions || [], options: [...worksheet.querySelectorAll('.option')].map(optionValue) });
const report = (data) => `<!doctype html><meta charset="utf-8"><title>Uncertainty decision packet</title><style>body{max-width:800px;margin:3rem auto;padding:0 1rem;font:16px system-ui;line-height:1.5}article,section{border:1px solid #aaa;padding:1rem;margin:1rem 0}h1,h2{line-height:1.15}</style><h1>${escape(data.title)}</h1><p>${escape(data.question)}</p><section><strong>Agreement:</strong> ${escape(data.agreement)}<br><strong>Conflict:</strong> ${escape(data.conflict)}<br><strong>Unresolved questions:</strong><br>${data.unresolvedQuestions.map(escape).join('<br>') || 'Not recorded'}</section>${data.options.map((option) => `<article><h2>${escape(option.name || 'Unlabelled option')}</h2><p><strong>Confidence:</strong> ${escape(option.confidence)}</p><p><strong>Assumptions:</strong><br>${option.assumptions.map(escape).join('<br>') || 'Not recorded'}</p><p><strong>Disconfirming evidence:</strong><br>${option.disconfirmingEvidence.map(escape).join('<br>') || 'Not recorded'}</p><p><strong>Next check:</strong> ${escape(option.nextCheck) || 'Not recorded'}</p></article>`).join('')}<p><em>This decision packet records uncertainty; it does not rank options.</em></p>`;
const download = () => { const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([report(snapshot())], { type: 'text/html' })), download: 'uncertainty-decision-packet.html' }); link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 0); };
document.querySelector('#add').addEventListener('click', () => addOption());
document.querySelector('#reset').addEventListener('click', () => render(fixture));
document.querySelector('#download').addEventListener('click', download);
fixture = await fetch('fixtures.json').then((response) => response.json()); render(fixture);
