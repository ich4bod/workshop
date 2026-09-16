# Context compression workbench

A tiny, offline command-line experiment for compressing tagged Markdown notes into a deterministic summary. It needs only Python's standard library and makes no network or model/API calls.

## Input

Use one or more Markdown files containing exact tagged bullets:

```markdown
- Decision: retry budget = 3
- Open: choose an output filename
```

The text before `=` identifies a decision topic. Differing values for one topic are reported as contradictions. Every retained item includes a relative `file#Lline` Markdown link.

## Run

```bash
python3 compress_notes.py fixtures/*.md -o summary.md
python3 -m unittest -v
```

The included fixture has repeated decisions, a conflicting retry budget, and two unresolved items. The tests verify source links, conflict reporting, retention of both unresolved items, and byte-identical CLI output on two runs.
