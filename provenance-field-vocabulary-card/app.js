const fields = {
  revision: {
    title: 'Source revision',
    definition: 'An immutable identifier for the exact source snapshot this record names. It identifies a snapshot; it does not report what happened after it was recorded.',
    boundary: 'It does not replace a new check of the running thing.',
  },
  acceptance: {
    title: 'Acceptance evidence',
    definition: 'A named observation from a check someone actually watched, including what was checked and what happened.',
    boundary: 'It is evidence of that observation, not an automatic claim about every behavior.',
  },
  url: {
    title: 'Public URL state',
    definition: 'The recorded result of trying the public address at a stated time.',
    boundary: 'A recorded response can age; an absent observation remains absent.',
  },
  gap: {
    title: 'Explicit gap',
    definition: 'A named piece of evidence, context, or observation that this record does not carry.',
    boundary: 'A gap is not permission to infer its missing value.',
  },
};

const records = {
  a: {
    revision: { label: 'Source revision', value: 'a718b77 — recorded source snapshot', state: 'recorded' },
    acceptance: { label: 'Acceptance evidence', value: 'Two browser clients completed a shared match on 17 Sep 2026.', state: 'recorded' },
    url: { label: 'Public URL state', value: 'The public address returned HTTP 200 on 17 Sep 2026.', state: 'recorded' },
    gap: { label: 'Explicit gap', value: 'No tested restore of the game-data volume is recorded.', state: 'gap' },
  },
  b: {
    revision: { label: 'Source revision', value: 'Not retained in this handoff.', state: 'unknown' },
    acceptance: { label: 'Acceptance evidence', value: 'No observed interaction check is retained.', state: 'unknown' },
    url: { label: 'Public URL state', value: 'A public address is named; no response observation is retained.', state: 'unknown' },
    gap: { label: 'Explicit gap', value: 'The source snapshot, interaction evidence, and URL observation need separate checks.', state: 'gap' },
  },
};

const detail = document.querySelector('.field-detail');
const buttons = [...document.querySelectorAll('[role="tab"]')];

function drawRecord(target, record, active) {
  target.innerHTML = '';
  Object.entries(record).forEach(([key, entry]) => {
    const row = document.createElement('div');
    row.className = `field-row ${key === active ? 'is-active' : ''}`;
    const term = document.createElement('dt');
    term.textContent = entry.label;
    const value = document.createElement('dd');
    value.textContent = entry.value;
    const tag = document.createElement('span');
    tag.className = `state ${entry.state}`;
    tag.textContent = entry.state === 'recorded' ? 'recorded' : entry.state;
    value.prepend(tag);
    row.append(term, value);
    target.append(row);
  });
}

function selectField(key, focus = false) {
  const field = fields[key];
  document.querySelector('#detail-label').textContent = 'Field ' + (Object.keys(fields).indexOf(key) + 1) + ' of 4';
  document.querySelector('#detail-title').textContent = field.title;
  document.querySelector('#detail-definition').textContent = field.definition;
  document.querySelector('#detail-boundary').textContent = field.boundary;
  detail.setAttribute('aria-labelledby', `${key}-tab`);
  buttons.forEach((button) => button.setAttribute('aria-selected', String(button.dataset.field === key)));
  drawRecord(document.querySelector('#record-a'), records.a, key);
  drawRecord(document.querySelector('#record-b'), records.b, key);
  if (focus) detail.focus();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => selectField(button.dataset.field, true));
  button.addEventListener('keydown', (event) => {
    const index = buttons.indexOf(button);
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
    buttons[next].focus();
    selectField(buttons[next].dataset.field);
  });
});

selectField('revision');
