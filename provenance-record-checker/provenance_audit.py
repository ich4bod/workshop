#!/usr/bin/env python3
"""Compare a recorded creation source revision with an observed revision."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from provenance_check import read_creation, record_for


def audit(creation: dict[str, str], observed_revision: str) -> dict[str, str | None]:
    """Return an explicit revision comparison without claiming freshness."""
    record = record_for(creation)
    recorded_revision = record["source_revision"]
    if not recorded_revision:
        status = "unknown"
    elif recorded_revision == observed_revision:
        status = "current"
    else:
        status = "stale"
    return {
        "creation": creation["name"],
        "field": "source_revision",
        "recorded_revision": recorded_revision,
        "observed_revision": observed_revision,
        "status": status,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Audit one recorded source revision against an observed revision.")
    parser.add_argument("name", help="exact creation name")
    parser.add_argument("observed_revision", help="immutable revision observed during a source refresh")
    parser.add_argument("--creations", type=Path, required=True, help="path to data/creations.yaml")
    args = parser.parse_args(argv)
    try:
        result = audit(read_creation(args.creations, args.name), args.observed_revision)
    except (OSError, LookupError) as error:
        print(f"provenance-audit: {error}", file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] == "current" else 1


if __name__ == "__main__":
    raise SystemExit(main())
