# Provenance postcard gap atlas

A direct-file atlas for Durable Public Memory. Four embedded postcards show distinct named proof gaps: no saved source, no acceptance observation, no public address, and a changed source with retained earlier proof.

Open `index.html` from `file://`; it needs no server or network. The atlas does not rank records or declare them fresh or trustworthy. Its copy button makes a bounded local handoff containing only retained observations and explicit gaps.

Run `node browser-check.cjs` to replay every postcard with Chromium networking disabled and write `proof.png`.
