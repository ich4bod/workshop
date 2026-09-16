(() => {
  const fixtures = [
    {claim: 'A model can reliably solve multi-step arithmetic.', source: 'Vendor capability page (illustrative claim)', task: 'Compute 17 × 6, then subtract 13.', expected: '89', observed: '91', uncertainty: 'One hand-authored trial is not a capability estimate; it is a reproducible counterexample.', failure: 'The observed answer skipped the subtraction.'},
    {claim: 'A model always follows an instruction hierarchy.', source: 'Marketing demo (illustrative claim)', task: 'Return only the JSON object {"status":"ok"}.', expected: '{"status":"ok"}', observed: 'Sure! {"status":"ok"}', uncertainty: 'Formatting failures may depend on prompt wording and sampling settings.', failure: 'Extra prose makes the result invalid JSON for a strict caller.'},
    {claim: 'A model can accurately summarize supplied material.', source: 'Product launch statement (illustrative claim)', task: "Summarize: 'The meeting was cancelled; do not ship Friday.'", expected: 'The meeting was cancelled and Friday shipping should not happen.', observed: 'The meeting confirmed that Friday shipping will happen.', uncertainty: 'This records an adversarial failure fixture, not a frequency claim.', failure: "The output reverses the source's operational instruction."}
  ];
  const cards = document.querySelector('#cards');
  const template = document.querySelector('#card-template');
  for (const fixture of fixtures) {
    const node = template.content.cloneNode(true);
    node.querySelector('h2').textContent = fixture.claim;
    for (const key of ['source', 'task', 'expected', 'observed', 'failure', 'uncertainty']) node.querySelector(`.${key}`).textContent = fixture[key];
    cards.append(node);
  }
})();
