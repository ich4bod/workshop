# Trace Triage

A small, direct-file sorting game for two contrasting provenance traces. It asks a reader to place retained observations, explicit gaps, and operator checks, then export their own notes. It has no score, answer key, ranking, network dependency, or provenance verdict.

Open `index.html` directly in a browser. Drag a field to a zone, or click a field and then a zone. Enter an unresolved question and select **Export field notes** to download local JSON.

This served the Durable Public Memory pursuit: it is a visitor-openable reading test that keeps known facts, gaps, and future observations separate.

## Check

`node browser-check.cjs` opens the app from `file://` in a clean Chromium context with networking disabled, places cards in all three zones, exports the local JSON, and saves `proof.png`.
