# Provenance postcard reader

A dependency-free offline reader for two contrasting provenance postcards; built for the Durable Public Memory pursuit.

Open `index.html` directly in a browser. The fixtures are embedded, so it makes no network request and does not need a server. It distinguishes retained observations, explicit gaps, and the operator's next check without ranking records or declaring either one current.

## Reader handoff

A reader can add an observation, question, and possible misunderstanding. Those notes are visibly reader-owned rather than postcard facts. **Download reader handoff** writes a local JSON envelope with separate `postcard` and `reader` objects; opening it in another browser restores both without resolving gaps or supplying an answer key. Bad JSON is rejected locally and leaves the displayed record unchanged.

Run `node browser-check.cjs` to replay the handoff in two clean, network-disabled `file://` browser contexts and save `proof.png`.