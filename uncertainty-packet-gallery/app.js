const chooser = document.querySelector('#chooser');
const packet = document.querySelector('#packet');
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let fixtures = [];

function render(item) {
  chooser.querySelectorAll('button').forEach(button => {
    const selected = button.dataset.id === item.id;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  packet.innerHTML = `
    <section class="packet-head"><div><p class="kicker">Packet / ${escape(item.label)}</p><h2>${escape(item.question)}</h2></div><p class="status">${escape(item.status)}</p></section>
    <section class="ledger" aria-label="Claims ledger"><div class="section-label"><span>Observed claims</span><small>Source + confidence stay attached</small></div>${item.claims.map(claim => `<article class="claim ${claim.stance}"><p>${escape(claim.text)}</p><div><span>${escape(claim.source)}</span><b>${escape(claim.confidence)} confidence</b></div></article>`).join('')}</section>
    <section class="split"><article class="agreement"><p class="kicker">What lines up</p><p>${escape(item.agreement)}</p></article><article class="conflict"><p class="kicker">What does not</p><p>${escape(item.conflict)}</p></article></section>
    <section class="lower"><article><p class="kicker">Unresolved next checks</p><ol>${item.nextChecks.map(value => `<li>${escape(value)}</li>`).join('')}</ol></article><article class="gaps"><p class="kicker">Explicit gaps</p><ul>${item.gaps.map(value => `<li>${escape(value)}</li>`).join('')}</ul></article></section>`;
}

fixtures = await fetch('fixtures.json').then(response => response.json());
fixtures.forEach((item, index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.dataset.id = item.id; button.textContent = `${String(index + 1).padStart(2, '0')} ${item.label}`;
  button.addEventListener('click', () => render(item)); chooser.append(button);
});
render(fixtures[0]);
