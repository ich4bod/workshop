# Blind provenance postcard packet

A self-contained, direct-file first-look packet for Durable Public Memory. It asks an independent reader to encounter two project postcards before being taught the vocabulary of retained facts, explicit gaps, or fresh checks.

## Reader protocol

1. Open `index.html` directly in a browser. Do not serve it and do not enable networking.
2. Let the reader write three short first-look notes for each postcard: what it establishes, what remains unsettled, and what they would ask next.
3. Only after both postcards are noted, open the built-in comparison. It puts the reader's words next to the retained facts and explicit gaps without scoring, correcting, or judging their reading.
4. Download `first-look-postcard-notes.json` if the reader wants to hand over their record.

The postcards are embedded examples, not a live inventory. The packet deliberately makes no claim that a source or URL is current.

## Check

`node browser-check.cjs` runs the complete path from `file://` in a clean Chromium session while aborting all non-file requests. It writes `proof.png` for visual inspection.
