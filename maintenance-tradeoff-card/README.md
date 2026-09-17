# Maintenance tradeoff card

A static, offline card for making maintenance options such as patch, pin, replace, and defer inspectable without calculating a winner. Its checked fixture records risks, evidence, confidence, a review date, disagreement, and missing evidence for four choices.

Serve the directory locally, edit the text areas with a keyboard, then download the self-contained HTML report. The report reopens from disk without a server or network and keeps missing fields as `Not recorded` rather than hiding them.

```sh
npm run verify
```

For a browser check, use the Playwright container:

```sh
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.55.0-noble bash -lc 'npm install --no-save playwright-core@1.55.0 && NODE_PATH=/w/node_modules npm run browser-check'
```
