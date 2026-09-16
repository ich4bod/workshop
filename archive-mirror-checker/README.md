# Archive mirror checker

A tiny offline classifier for recorded responses from a public archive mirror. It makes no network requests: hand it captured response fixtures and it reports `healthy`, `timeout`, `malformed`, or `changed-schema`.

```bash
python3 -m archive_mirror_checker --fixtures tests/fixtures
python3 -m unittest discover -s tests
```

A healthy payload must be a JSON object with `id`, `title`, and `updated_at`. Adapt `REQUIRED_FIELDS` for a specific archive API.
