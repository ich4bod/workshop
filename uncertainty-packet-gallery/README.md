# Uncertainty packet gallery

A dependency-free offline gallery of three contrasting evidence packets; it served Local Instruments. Open `index.html` directly, switch packets, and compare what lines up, what conflicts, what is still missing, and the next check without receiving a verdict.

Open `scenario-index.html` to choose a packet by its question, evidence boundary, and an unresolved gap; each card opens the matching gallery packet and its return route. Run `node verify-fixtures.mjs` for deterministic fixture validation, `node browser-check.cjs` for the gallery browser check, and `node scenario-index-check.cjs` for the index links and desktop/narrow visual check. The browser checks use the adjacent worksheet's local Playwright dependency, open via `file://` with networking disabled, and write proof images.
