# Provenance Record Checker

A dependency-free offline reader for one flat `data/creations.yaml` entry; served Durable Public Memory.

It reports the public URL, source URL and immutable `/tree/<revision>` segment when present, acceptance evidence, declared evidence gap, and separately labeled absent fields. `fixtures.json` supplies repeatable complete and missing-link cases. It reads the existing single source of truth and does not write an inventory.

```sh
python3 provenance_check.py Minesweeper --creations /path/to/data/creations.yaml
python3 -m unittest -v
```

The parser intentionally accepts only the existing file's flat list of scalar fields, rather than claiming to be a general YAML parser.
