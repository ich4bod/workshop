#!/usr/bin/env python3
"""Render an offline, field-grouped provenance gap report from creations.yaml."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from provenance_check import record_for

RECORD_START = re.compile(r"^- name: (.+)$")
FIELD = re.compile(r"^  ([a-z_]+):(?: (.*))?$")


def clean(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def read_creations(path: Path) -> list[dict[str, str]]:
    """Read every flat creation record without maintaining another inventory."""
    records: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for line in path.read_text(encoding="utf-8").splitlines():
        start = RECORD_START.match(line)
        if start:
            if current:
                records.append(current)
            current = {"name": clean(start.group(1))}
        elif current and (field := FIELD.match(line)):
            current[field.group(1)] = clean(field.group(2) or "")
    if current:
        records.append(current)
    return records


def gaps_for(record: dict[str, object], observed: str | None) -> list[tuple[str, str]]:
    gaps: list[tuple[str, str]] = []
    revision = record["source_revision"]
    if not revision:
        gaps.append(("Source revision", "absent"))
    elif observed is None:
        gaps.append(("Source revision", "unknown (no observed revision)"))
    elif revision != observed:
        gaps.append(("Source revision", f"stale (recorded {revision}; observed {observed})"))
    if not record["acceptance_evidence"]:
        gaps.append(("Acceptance evidence", "absent (unknown)"))
    if not record["public_url"]:
        gaps.append(("Public URL", "absent"))
    return gaps


def render(creations: list[dict[str, str]], observations: dict[str, str]) -> str:
    """Return deterministic Markdown grouped by provenance field, never ranked."""
    grouped: dict[str, list[tuple[str, str]]] = {"Source revision": [], "Acceptance evidence": [], "Public URL": []}
    clear: list[str] = []
    for creation in sorted(creations, key=lambda item: item["name"]):
        record = record_for(creation)
        gaps = gaps_for(record, observations.get(creation["name"]))
        if not gaps:
            clear.append(creation["name"])
        for field, detail in gaps:
            grouped[field].append((creation["name"], detail))

    lines = ["# Provenance audit gap report", "", "This report reads the existing creations inventory. It lists observed gaps without ranking records or proposing remediation.", ""]
    for field, entries in grouped.items():
        lines.extend([f"## {field}", ""])
        if entries:
            lines.extend(f"- **{name}** — {detail}" for name, detail in entries)
        else:
            lines.append("- No observed gaps.")
        lines.append("")
    lines.extend(["## Zero-gap records", ""])
    if clear:
        lines.extend(f"- **{name}** — source revision matched an observation; acceptance evidence and public URL are present." for name in clear)
    else:
        lines.append("- None. A missing observation is an unknown source-revision state, not zero gaps.")
    return "\n".join(lines) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Render a field-grouped offline provenance gap report.")
    parser.add_argument("--creations", type=Path, required=True, help="path to data/creations.yaml")
    parser.add_argument("--observations", type=Path, required=True, help="JSON object mapping creation names to observed immutable revisions")
    args = parser.parse_args(argv)
    try:
        observations = json.loads(args.observations.read_text(encoding="utf-8"))
        if not isinstance(observations, dict) or not all(isinstance(key, str) and isinstance(value, str) for key, value in observations.items()):
            raise ValueError("observations must be a JSON object of creation names to revisions")
        print(render(read_creations(args.creations), observations), end="")
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"provenance-gap-report: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
