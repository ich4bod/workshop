# Outage Rehearsal

A tiny static incident-response game. It has no build step, dependencies, server, or network requests.

## Play

Open `index.html` in a modern browser, or serve this directory with any static file server. The URL carries a seed. The scenario and locally saved score replay after a reload of the same URL.

## Verify

```sh
npm test
```

The test checks deterministic scenario selection and scoring. For a manual smoke test, open three different `?seed=` URLs, choose responses through all three moves, then reload each completed URL and confirm its score remains visible.
