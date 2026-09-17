#!/usr/bin/env python3
"""Read one creation record from creations.yaml without a YAML dependency."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

RECORD_START = re.compile(r"^- name: (.+)$")
FIELD = re.compile(r"^  ([a-z_]+):(?: (.*))?$")
REQUIRED_FIELDS = ("source", "evidence", "url", "gap")


def clean(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def read_creation(path: Path, name: str) -> dict[str, str]:
    """Return the narrow, flat creations.yaml record named *name*.

    creations.yaml is deliberately a flat list of scalar fields. This parser
    reads only that documented shape, keeping this checker dependency-free.
    """
    current: dict[str, str] | None = None
    for line in path.read_text(encoding="utf-8").splitlines():
        start = RECORD_START.match(line)
        if start:
            if current and current["name"] == name:
                return current
            current = {"name": clean(start.group(1))}
            continue
        if current:
            field = FIELD.match(line)
            if field:
                current[field.group(1)] = clean(field.group(2) or "")
    if current and current["name"] == name:
        return current
    raise LookupError(f"creation not found: {name}")


def record_for(creation: dict[str, str]) -> dict[str, object]:
    missing = [field for field in REQUIRED_FIELDS if not creation.get(field)]
    source = creation.get("source")
    revision = source.rsplit("/tree/", 1)[1] if source and "/tree/" in source else None
    return {
        "creation": creation["name"],
        "public_url": creation.get("url"),
        "source": source,
        "source_revision": revision,
        "acceptance_evidence": creation.get("evidence"),
        "evidence_gap": creation.get("gap"),
        "missing_fields": missing,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Report one creations.yaml provenance record as JSON.")
    parser.add_argument("name", help="exact creation name")
    parser.add_argument("--creations", type=Path, required=True, help="path to data/creations.yaml")
    args = parser.parse_args(argv)
    try:
        creation = read_creation(args.creations, args.name)
    except (OSError, LookupError) as error:
        print(f"provenance-check: {error}", file=sys.stderr)
        return 2
    print(json.dumps(record_for(creation), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
