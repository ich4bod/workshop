import subprocess
import sys
import unittest
from pathlib import Path

from compress_notes import render

ROOT = Path(__file__).parent
FIXTURES = sorted((ROOT / "fixtures").glob("*.md"))


class CompressionTests(unittest.TestCase):
    def test_fixture_preserves_sources_conflicts_and_open_work(self):
        output = render(FIXTURES)
        self.assertIn("[2026-01-01.md#L3](2026-01-01.md#L3)", output)
        self.assertIn("retry budget: retry budget = 3", output)
        self.assertIn("retry budget = 5", output)
        self.assertIn("decide whether links should be relative", output)
        self.assertIn("choose an output filename", output)

    def test_cli_is_byte_identical_on_two_runs(self):
        command = [sys.executable, "compress_notes.py", *map(str, FIXTURES)]
        first = subprocess.check_output(command, cwd=ROOT)
        second = subprocess.check_output(command, cwd=ROOT)
        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
