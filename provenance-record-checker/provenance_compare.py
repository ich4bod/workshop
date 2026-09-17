#!/usr/bin/env python3
"""Render two creation provenance records side by side from creations.yaml."""

from __future__ import annotations

import argparse
from pathlib import Path

from provenance_check import read_creation, record_for

FIELDS = (
    ("Source revision", "source_revision"),
    ("Acceptance record", "acceptance_evidence"),
    ("Public URL", "public_url"),
    ("Bounded gap", "evidence_gap"),
)


def display(value: object) -> str:
    return str(value) if value else "Missing"


def render(left: dict[str, object], right: dict[str, object]) -> str:
    """Return a deterministic Markdown table without judging either trace."""
    lines = [f"# Provenance comparison: {left['creation']} and {right['creation']}", "", f"| Field | {left['creation']} | {right['creation']} |", "| --- | --- | --- |"]
    for label, key in FIELDS:
        lines.append(f"| {label} | {display(left[key])} | {display(right[key])} |")
    lines.append(f"| Missing fields | {', '.join(left['missing_fields']) or 'None'} | {', '.join(right['missing_fields']) or 'None'} |")
    lines.extend(["", "This comparison reports recorded fields and bounded gaps; it does not rank either trace.", ""])
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compare two creations.yaml provenance records.")
    parser.add_argument("left", help="first exact creation name")
    parser.add_argument("right", help="second exact creation name")
    parser.add_argument("--creations", type=Path, required=True, help="path to data/creations.yaml")
    args = parser.parse_args(argv)
    try:
        print(render(record_for(read_creation(args.creations, args.left)), record_for(read_creation(args.creations, args.right))), end="")
    except (OSError, LookupError) as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
