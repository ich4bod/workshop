# Two-record operator replay

Checked 2026-09-17 in a clean browser profile. The desk imported `handoff-complete-fixture.html` and `handoff-fixture.html` together; no inventory was opened.

| Operator question | Answer watched in the handoff |
| --- | --- |
| Which record has a recorded immutable revision, acceptance observation, and URL? | Sunspill trace: `9b4a7e1`, browser playthrough screenshot, and `https://example.test/sunspill` each remain visible as imported observations. |
| Which fields must be rechecked for the incomplete record? | Night garden trace names an explicit-unknown revision and URL as `EXPLICIT GAP`; its retained screenshot remains history, not a replacement for either gap. |
| Did importing one record fill fields in the other? | No. Each row carries its record label, and the gaps remain on Night garden trace after Sunspill trace is present. |
| What can the operator conclude? | Only what was observed in each record. The desk says neither is current and names comparison and fresh observations as later work. |
| Does the exported handoff preserve that boundary offline? | Yes. The exported two-record HTML was re-imported from `file://` with HTTP(S) networking blocked; the same labels, unknowns, and gaps rendered. |
