const fields = [
  { id: 'a-revision', trace: 'TRACE A · FIELD CABINET', kind: 'SOURCE REVISION', text: 'Immutable revision: 9d6f64b', hint: 'Recorded source identity.' },
  { id: 'a-acceptance', trace: 'TRACE A · FIELD CABINET', kind: 'ACCEPTANCE', text: 'Browser replay observed on 2026-09-17', hint: 'A dated observation, not a promise.' },
  { id: 'a-url', trace: 'TRACE A · FIELD CABINET', kind: 'PUBLIC URL', text: 'URL observed: https://ichabod-crane.net', hint: 'Recorded public surface.' },
  { id: 'a-gap', trace: 'TRACE A · FIELD CABINET', kind: 'KNOWN GAP', text: 'No independent reader record yet', hint: 'A stated limit.' },
  { id: 'a-next', trace: 'TRACE A · FIELD CABINET', kind: 'NEXT CHECK', text: 'Ask one uncoached reader what they inferred', hint: 'A future observation.' },
  { id: 'b-revision', trace: 'TRACE B · REFRESH DESK', kind: 'SOURCE REVISION', text: 'Immutable revision: fa356c7', hint: 'Recorded source identity.' },
  { id: 'b-acceptance', trace: 'TRACE B · REFRESH DESK', kind: 'ACCEPTANCE', text: 'Prior browser replay retained after source refresh', hint: 'The observation was not re-run.' },
  { id: 'b-url', trace: 'TRACE B · REFRESH DESK', kind: 'PUBLIC URL', text: 'Public URL has not been re-observed', hint: 'No current URL claim.' },
  { id: 'b-gap', trace: 'TRACE B · REFRESH DESK', kind: 'KNOWN GAP', text: 'Fresh acceptance evidence is absent', hint: 'A stated limit.' },
  { id: 'b-next', trace: 'TRACE B · REFRESH DESK', kind: 'NEXT CHECK', text: 'Open the public URL and record the result', hint: 'A future observation.' }
];
const cards = document.querySelector('#cards'); let selected = null;
function card(field) { const el = document.createElement('button'); el.className = 'card'; el.draggable = true; el.dataset.id = field.id; el.innerHTML = `<small>${field.trace}</small><b>${field.kind}</b><span>${field.text}</span><em>${field.hint}</em>`; el.addEventListener('dragstart', () => selected = el); el.addEventListener('click', () => { selected?.classList.remove('selected'); selected = el; el.classList.add('selected'); document.querySelector('#status').textContent = 'Card selected — choose a zone.'; }); return el; }
fields.forEach(f => cards.append(card(f)));
document.querySelectorAll('.drop').forEach(zone => { zone.addEventListener('dragover', e => e.preventDefault()); zone.addEventListener('drop', e => { e.preventDefault(); place(selected, zone); }); zone.addEventListener('click', () => place(selected, zone)); });
function place(el, zone) { if (!el) return; zone.append(el); el.classList.remove('selected'); selected = null; document.querySelector('#status').textContent = `${zone.closest('article').querySelector('h2').textContent}: field placed. Your placement is not graded.`; }
document.querySelector('#export').addEventListener('click', () => { const placements = {}; document.querySelectorAll('.zones article').forEach(a => placements[a.dataset.zone] = [...a.querySelectorAll('.card')].map(c => fields.find(f => f.id === c.dataset.id))); const packet = { format: 'trace-triage-notes/v1', exportedAt: new Date().toISOString(), placements, unresolvedQuestion: document.querySelector('#question').value }; const blob = new Blob([JSON.stringify(packet, null, 2)], {type:'application/json'}); const a = Object.assign(document.createElement('a'), {href:URL.createObjectURL(blob), download:'trace-triage-notes.json'}); a.click(); URL.revokeObjectURL(a.href); document.querySelector('#status').textContent = 'Local notes exported. No judgment was added.'; });
document.querySelector('#reset').addEventListener('click', () => { cards.replaceChildren(...fields.map(card)); document.querySelector('#question').value=''; document.querySelector('#status').textContent='Round reset.'; });
