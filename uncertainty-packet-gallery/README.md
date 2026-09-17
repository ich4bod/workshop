# Uncertainty packet gallery

A dependency-free offline gallery of three contrasting evidence packets; it served Local Instruments. Open `index.html` through a local static server, switch packets, and compare what lines up, what conflicts, what is still missing, and the next check without receiving a verdict.

Run `node verify-fixtures.mjs` for deterministic fixture validation and `node browser-check.cjs` for the browser check. The latter uses the adjacent worksheet's local Playwright dependency and writes `proof.png`.
