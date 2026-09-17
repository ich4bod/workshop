# Uncertainty Packet Reader

A dependency-free, offline reader for uncertainty worksheet packets; it served Local Instruments by testing that a decision's assumptions, evidence, disagreement, and open questions survive handoff without choosing a winner.

```sh
node read-packet.mjs fixtures/two-options.json
```

It imports no worksheet code, has no network client, rejects missing required fields, and prints each option without a score, ordering, or recommendation. Empty evidence lists and blank next checks are valid but explicit: the reader prints a `GAP` line rather than inventing an explanation.

```sh
node verify-handoff.mjs
```

The handoff check compares the complete fixture with `fixtures/missing-evidence.json`, asserts that both preserve options, assumptions, agreement, conflict, and unresolved questions, and confirms only the incomplete packet names its missing evidence and next check. It writes the inspected reports to `proof/missing-evidence-observation.txt`.

```sh
node verify-discrepancies.mjs
```

`fixtures/independent-reader-discrepancies.json` is a plain handoff record for observations a second reader can make without selecting an option. The verifier requires every record to name an observation, disagreement, missing context, and unresolved item, and rejects ranking or recommendation fields.
