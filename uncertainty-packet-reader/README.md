# Uncertainty Packet Reader

A dependency-free, offline reader for uncertainty worksheet packets; it served Local Instruments by testing that a decision's assumptions, evidence, disagreement, and open questions survive handoff without choosing a winner.

```sh
node read-packet.mjs fixtures/two-options.json
```

It imports no worksheet code, has no network client, rejects missing required fields, and prints each option without a score, ordering, or recommendation.
