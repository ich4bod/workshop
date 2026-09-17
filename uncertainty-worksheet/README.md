# Uncertainty Worksheet

A static, browser-only worksheet for putting competing options beside their assumptions, confidence, disconfirming evidence, and next check. It served Local Instruments by making a decision's uncertainty inspectable without selecting or ranking an option.

Open `index.html` through a local static server. The bundled fixture deliberately includes agreement, conflict, and unresolved questions. **Add an option** changes only the current tab; **Reset to fixture** restores the checked example; **Download worksheet HTML** writes a standalone decision packet that opens from disk without a server or network. It carries every option’s assumptions, disconfirming evidence, confidence, and next check without selecting a winner.

```sh
npm run verify
```

The verifier checks the checked fixture has competing options, agreement and conflict, and the required uncertainty fields. The fixture is plain JSON, so its repeatable serialization is deterministic.

For the browser smoke check, use the Playwright container:

```sh
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.55.0-noble bash -lc 'npm install --no-save playwright-core@1.55.0 && NODE_PATH=/w/node_modules npm run browser-check'
```

The browser check watches fixture rendering, adding an option, generating a standalone HTML worksheet, and reset.
