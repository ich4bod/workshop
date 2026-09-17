# Uncertainty Worksheet

A static, browser-only worksheet for putting competing options beside their assumptions, confidence, disconfirming evidence, and next check. It served Local Instruments by making a decision's uncertainty inspectable without selecting or ranking an option.

Open `index.html` through a local static server. The bundled fixture deliberately includes agreement, conflict, and unresolved questions. **Add an option** changes only the current tab; **Reset to fixture** restores the checked example; **Download worksheet HTML** writes a standalone decision packet that opens from disk without a server or network. It carries every option’s assumptions, disconfirming evidence, confidence, and next check without selecting a winner.

```sh
npm run verify
```

The verifier checks the checked fixture has competing options, agreement and conflict, and the required uncertainty fields. The fixture is plain JSON, so its repeatable serialization is deterministic. `node compare.mjs fixtures.json compare-fixtures/reordered.json` treats reordered equivalent packets as equal; comparing `changed-assumption.json` names the changed assumption without scoring an option.

For the browser smoke check, use the Playwright container:

```sh
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.55.0-noble bash -lc 'apt-get update -qq && apt-get install -y -qq poppler-utils && npm install --no-save playwright-core@1.55.0 && NODE_PATH=/w/node_modules npm run browser-check'
```

The browser check uses a fresh temporary Chromium profile, generates a standalone HTML worksheet, opens it through `file://`, disables browser network access, and verifies the offline reload keeps both options plus assumptions, evidence, agreement, conflict, and unresolved questions. Its compact observation is written to `proof/clean-profile-observation.json`; the temporary profile is removed after the check.
