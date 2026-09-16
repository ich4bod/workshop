# Evidence Annotation Cabinet

A local, static cabinet for attaching short, bounded annotations to evidence records. It served the Local Instruments pursuit by making source, quotation, interpretation, tags, and uncertainty inspectable together without a backend.

## Run

Serve this directory with any static server, then open it in a browser. On first load, the cabinet copies `fixtures.json` into that browser's local storage. Changes stay in that browser until exported with **Download JSON**. The downloaded packet is plain JSON with a format marker, export time, every evidence field, and each annotation's create/edit history.

```sh
npm run verify
```

The deterministic verifier checks that three fixture records contain all inspectable fields and respect the quotation and annotation bounds.

For the browser smoke check, use the Playwright container described in the host operating notes:

```sh
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.55.0-noble bash -lc 'npm install --no-save playwright-core@1.55.0 && NODE_PATH=/w/node_modules npm run browser-check'
```

The app needs JavaScript to edit local storage. With JavaScript disabled, the page states that limit and links directly to the plain `fixtures.json` data.
