# Provenance Record Checker

A dependency-free offline reader for one flat `data/creations.yaml` entry; served Durable Public Memory.

It reports the public URL, source URL and immutable `/tree/<revision>` segment when present, acceptance evidence, declared evidence gap, and separately labeled absent fields. `fixtures.json` supplies repeatable complete and missing-link cases. It reads the existing single source of truth and does not write an inventory. The comparison command renders two existing records side by side, including each bounded gap, without ranking them. The audit command compares one recorded revision with a revision observed during a source refresh: `current` means they match, `stale` means they differ, and `unknown` means the record has no immutable revision. Every state concerns only the supplied observation; `current` is explicitly not a freshness guarantee. The refresh report compares two offline snapshots of the same creation and calls out when a changed source revision leaves evidence or a public URL unchanged; those gaps prevent an old result from being presented as permanent proof. The gap report groups every absent, stale, or unknown source revision, acceptance record, and public URL by field; its zero-gap section is reserved for records with a matching observation and present evidence and URL.

```sh
python3 provenance_check.py Minesweeper --creations /path/to/data/creations.yaml
python3 provenance_compare.py Complete 'Missing source' --creations /path/to/data/creations.yaml
python3 provenance_audit.py Minesweeper 7b19b525e8c34ea78ad79f9c6eaf993a7f9709fe --creations /path/to/data/creations.yaml
python3 provenance_refresh.py Minesweeper --before /path/to/before-creations.yaml --after /path/to/after-creations.yaml
python3 provenance_refresh.py 'Recreated source' --before source-recreation-before.yaml --after source-recreation-after.yaml
python3 provenance_gap_report.py --creations /path/to/data/creations.yaml --observations /path/to/observed-revisions.json
python3 provenance_gap_report.py --creations gap-report-fixture.yaml --observations gap-report-observations.json
python3 -m unittest -v
```

The parser intentionally accepts only the existing file's flat list of scalar fields, rather than claiming to be a general YAML parser.

## Observed-revision handoff

After an operator observes a new immutable source revision, save the prior and refreshed `creations.yaml` records as two offline snapshots, then run `provenance_refresh.py` with the creation name. The report preserves the observed revision, identifies fields that were retained, lists the two new inputs needed to support the refreshed revision (acceptance evidence and a public-URL observation), and emits `unknown_fields` even when that list is empty. It does not fetch GitHub, alter `data/creations.yaml`, or turn retained evidence into a claim about the new revision.

`source-recreation-before.yaml` and `source-recreation-after.yaml` are a complete handoff fixture: `abc123` becomes the observed `def456`, while its earlier acceptance evidence and URL remain recorded. Run the example command above from this directory to reproduce the report.
