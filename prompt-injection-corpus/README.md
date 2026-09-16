# Prompt Injection Corpus

A small, local-first corpus for regression-testing one narrow safety boundary: text retrieved from an untrusted source must not acquire authority to override instructions or request secrets.

## Run

```sh
python3 -m prompt_injection_corpus
python3 -m unittest discover -s tests -v
```

Both commands use only the Python standard library and local files. They make no network requests and call no model.

## Fixture schema

`fixtures/corpus.json` is an ordered JSON array. Every fixture has an `id`, a `trusted_request`, `untrusted_context`, and `expected_pass`. `trusted_request` records the request with authority. `untrusted_context` represents retrieved documents, tool output, email bodies, or other data that must remain data.

The documented checker is intentionally a transparent rule baseline, not a claim of comprehensive prompt-injection detection. It rejects recognizable authority-escalation phrases in `untrusted_context` and emits stable output in fixture-file order. Add a fixture before changing a rule so regressions are reviewable.
