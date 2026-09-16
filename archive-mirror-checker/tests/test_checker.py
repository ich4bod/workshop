import json
import subprocess
import sys
import unittest
from pathlib import Path

from archive_mirror_checker import classify

FIXTURES = Path(__file__).parent / "fixtures"


class CheckerTests(unittest.TestCase):
    def test_each_failure_class_is_deterministic(self):
        expected = {
            "changed-schema.json": "changed-schema",
            "healthy.json": "healthy",
            "malformed.json": "malformed",
            "timeout.json": "timeout",
        }
        for name, status in expected.items():
            self.assertEqual(classify(json.loads((FIXTURES / name).read_text())), status)

    def test_cli_emits_machine_readable_report(self):
        result = subprocess.run(
            [sys.executable, "-m", "archive_mirror_checker", "--fixtures", str(FIXTURES)],
            check=True,
            capture_output=True,
            text=True,
        )
        reports = json.loads(result.stdout)["reports"]
        self.assertEqual({report["status"] for report in reports}, {"healthy", "timeout", "malformed", "changed-schema"})


if __name__ == "__main__":
    unittest.main()
