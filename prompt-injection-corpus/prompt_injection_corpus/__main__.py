from __future__ import annotations

import json
from pathlib import Path

from .checker import check


def main() -> int:
    fixtures = json.loads((Path(__file__).parents[1] / "fixtures" / "corpus.json").read_text())
    failures = 0
    for fixture in fixtures:
        verdict = check(fixture)
        matched = verdict.passed == fixture["expected_pass"]
        status = "PASS" if matched else "FAIL"
        print(f"{status} {fixture['id']} expected={fixture['expected_pass']} actual={verdict.passed} — {verdict.reason}")
        failures += not matched
    return int(failures > 0)


if __name__ == "__main__":
    raise SystemExit(main())
