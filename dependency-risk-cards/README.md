# dependency-risk-cards

`dep-risk` creates a deterministic Markdown checklist from a local npm manifest (`package.json` or `package-lock.json`) or Python `pyproject.toml`. It does not contact package registries or upload manifest data.

For resolved Python dependencies, put `uv.lock` next to `pyproject.toml`; without it the report lists direct requirements as unlocked. For npm, `package-lock.json` includes resolved packages.

```console
# Pytest, when available:
uv run --with pytest pytest
# Standard-library fallback for minimal hosts:
PYTHONPATH=src python3 tests/run.py
PYTHONPATH=src python3 -m dependency_risk.cli path/to/package-lock.json
```

The report marks direct vs. transitive dependencies, missing/floating versions, and npm lifecycle hooks (`preinstall`, `install`, `postinstall`, `prepare`).
