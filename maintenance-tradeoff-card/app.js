const lines = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);
const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const fixture = await fetch('fixtures.json').then((response) => response.json());
const choices = document.querySelector('#choices');
document.querySelector('#question').textContent = fixture.question;
document.querySelector('#review-date').textContent = fixture.reviewDate;
document.querySelector('#disagreement').textContent = fixture.disagreement;
for (const choice of fixture.choices) {
  const card = document.querySelector('#choice').content.firstElementChild.cloneNode(true);
  card.querySelector('h2').textContent = choice.name;
  card.querySelector('.confidence').value = choice.confidence;
  for (const field of ['risks', 'evidence', 'missing']) card.querySelector(`.${field}`).value = choice[field].join('\n');
  choices.append(card);
}
const snapshot = () => ({ ...fixture, choices: [...choices.querySelectorAll('article')].map((card) => ({ name: card.querySelector('h2').textContent, confidence: card.querySelector('.confidence').value.trim(), risks: lines(card.querySelector('.risks').value), evidence: lines(card.querySelector('.evidence').value), missing: lines(card.querySelector('.missing').value) })) });
const list = (items) => items.length ? `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>` : '<p>Not recorded</p>';
const report = (data) => `<!doctype html><meta charset="utf-8"><title>Maintenance tradeoff report</title><style>body{max-width:900px;margin:2rem auto;padding:0 1rem;font:16px system-ui;line-height:1.5}article,header{border:1px solid #999;padding:1rem;margin:1rem 0}</style><header><h1>${escape(data.title)}</h1><p>${escape(data.question)}</p><p><strong>Review date:</strong> ${escape(data.reviewDate)}</p><p><strong>Disagreement:</strong> ${escape(data.disagreement)}</p></header>${data.choices.map((choice) => `<article><h2>${escape(choice.name)}</h2><p><strong>Confidence:</strong> ${escape(choice.confidence) || 'Not recorded'}</p><strong>Risks:</strong>${list(choice.risks)}<strong>Evidence links or notes:</strong>${list(choice.evidence)}<strong>Missing fields or evidence:</strong>${list(choice.missing)}</article>`).join('')}<p><em>This card records tradeoffs; it does not score or recommend a choice.</em></p>`;
document.querySelector('#download').addEventListener('click', () => { const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([report(snapshot())], { type: 'text/html' })), download: 'maintenance-tradeoff-report.html' }); link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 0); });
