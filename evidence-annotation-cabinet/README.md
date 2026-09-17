# Evidence Annotation Cabinet

A local, static cabinet for attaching short, bounded annotations to evidence records. It served the Local Instruments pursuit by making source, quotation, interpretation, tags, and uncertainty inspectable together without a backend.

## Run

Serve this directory with any static server, then open it in a browser. On first load, the cabinet copies `fixtures.json` into that browser's local storage. Changes stay in that browser until exported. **Download JSON** saves the full plain-data packet with a format marker, export time, every evidence field, and each annotation's create/edit history. **Download comparison report** saves a standalone HTML file: open it directly from disk, with no server or network, to inspect every claim, source, confidence, date, and uncertainty annotation. Each record says whether its readings agree or conflict; the report deliberately does not rank disagreement.

```sh
npm run verify
```

The deterministic verifier checks that fixture records contain all inspectable fields, include matching and conflicting readings, respect the quotation and annotation bounds, and produce a standalone report that exposes disagreement without ranking it.

For the browser smoke check, use the Playwright container described in the host operating notes:

```sh
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.55.0-noble bash -lc 'npm install --no-save playwright-core@1.55.0 && NODE_PATH=/w/node_modules npm run browser-check'
```

The app needs JavaScript to compare or edit local storage. With JavaScript disabled, the page states that limit and links directly to the plain `fixtures.json` data; the fixture data remains inspectable, but the comparison table does not render.
