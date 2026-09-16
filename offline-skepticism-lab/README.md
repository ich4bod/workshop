# Offline Model Skepticism Lab

A static, local-only way to compare an illustrative model claim against a fixed task and a visible counterexample. It does not estimate general model quality. It makes uncertainty explicit and keeps a failure case reproducible.

## Run

Open `index.html` directly in a browser. The page has no external URLs or runtime fetches.

```sh
npm run verify
```

The verifier checks that every fixture includes claim, evidence, uncertainty, and failure fields; that it is a real mismatch; and emits a deterministic SHA-256 baseline for the fixture set.
