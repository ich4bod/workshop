#!/usr/bin/env python3
"""Report what a source refresh changes in one creation provenance record."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from provenance_check import read_creation, record_for


def refresh_report(before: dict[str, str], after: dict[str, str]) -> dict[str, object]:
    """Compare two offline snapshots of the same named creation record."""
    before_record = record_for(before)
    after_record = record_for(after)
    if before_record["creation"] != after_record["creation"]:
        raise ValueError("before and after records must name the same creation")

    changed_fields = [
        field
        for field in ("source_revision", "acceptance_evidence", "public_url")
        if before_record[field] != after_record[field]
    ]
    gaps: list[str] = []
    if "source_revision" in changed_fields and "acceptance_evidence" not in changed_fields:
        gaps.append("acceptance evidence was unchanged after source_revision changed")
    if "source_revision" in changed_fields and "public_url" not in changed_fields:
        gaps.append("public URL was unchanged after source_revision changed")
    unknown_fields = [
        field
        for field in ("source_revision", "acceptance_evidence", "public_url")
        if not after_record[field]
    ]
    required_operator_inputs: list[str] = []
    if "source_revision" in changed_fields:
        if after_record["source_revision"]:
            revision = f"source revision {after_record['source_revision']}"
        else:
            required_operator_inputs.append("immutable source revision observed for the refresh")
            revision = "the refreshed source"
        required_operator_inputs.append(f"acceptance evidence observed for {revision}")
        required_operator_inputs.append(f"public URL observation for {revision}")
    return {
        "creation": before_record["creation"],
        "changed_fields": changed_fields,
        "evidence_gaps": gaps,
        "required_operator_inputs": required_operator_inputs,
        "status": "changed" if changed_fields else "unchanged",
        "unknown_fields": unknown_fields,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compare before-and-after offline creation provenance snapshots.")
    parser.add_argument("name", help="exact creation name in both snapshots")
    parser.add_argument("--before", type=Path, required=True, help="path to the pre-refresh creations.yaml snapshot")
    parser.add_argument("--after", type=Path, required=True, help="path to the post-refresh creations.yaml snapshot")
    args = parser.parse_args(argv)
    try:
        report = refresh_report(read_creation(args.before, args.name), read_creation(args.after, args.name))
    except (OSError, LookupError, ValueError) as error:
        print(f"provenance-refresh: {error}", file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
