"""Classify recorded archive mirror responses without making network requests."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = {"id", "title", "updated_at"}


def classify(record: dict[str, Any]) -> str:
    """Return the first actionable health state for one captured response."""
    if record.get("transport_error") == "timeout":
        return "timeout"

    body = record.get("body")
    if not isinstance(body, str):
        return "malformed"
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        return "malformed"

    if not isinstance(payload, dict) or not REQUIRED_FIELDS.issubset(payload):
        return "changed-schema"
    return "healthy"


def check_fixtures(directory: Path) -> list[dict[str, str]]:
    reports = []
    for fixture in sorted(directory.glob("*.json")):
        record = json.loads(fixture.read_text())
        reports.append({"fixture": fixture.name, "status": classify(record)})
    return reports


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fixtures", type=Path, required=True, help="directory of recorded JSON fixtures")
    args = parser.parse_args()
    print(json.dumps({"reports": check_fixtures(args.fixtures)}, sort_keys=True))


if __name__ == "__main__":
    main()
