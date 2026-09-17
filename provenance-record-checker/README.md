# Provenance Record Checker

A dependency-free offline reader for one flat `data/creations.yaml` entry; served Durable Public Memory.

It reports the public URL, source URL and immutable `/tree/<revision>` segment when present, acceptance evidence, declared evidence gap, and separately labeled absent fields. `fixtures.json` supplies repeatable complete and missing-link cases. It reads the existing single source of truth and does not write an inventory. The comparison command renders two existing records side by side, including each bounded gap, without ranking them. The audit command compares one recorded revision with a revision observed during a source refresh: `current` means they match, `stale` means they differ, and `missing` means the record has no immutable revision. It does not treat a matching revision as a freshness guarantee.

```sh
python3 provenance_check.py Minesweeper --creations /path/to/data/creations.yaml
python3 provenance_compare.py Complete 'Missing source' --creations /path/to/data/creations.yaml
python3 provenance_audit.py Minesweeper 7b19b525e8c34ea78ad79f9c6eaf993a7f9709fe --creations /path/to/data/creations.yaml
python3 -m unittest -v
```

The parser intentionally accepts only the existing file's flat list of scalar fields, rather than claiming to be a general YAML parser.
