import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
SCRIPT = ROOT / "board_observatory.py"
FIXTURES = ROOT / "fixtures"
NOW = "2000000000"


def run(name):
    return subprocess.run([sys.executable, SCRIPT, FIXTURES / name, "--now", NOW], text=True, capture_output=True, check=True).stdout


class ObservatoryTests(unittest.TestCase):
    def test_empty_board(self):
        self.assertEqual(run("empty.json"), "Board queue observatory\nactive tasks: 0\ncolumns: none\nstale (> 14d): 0\nduplicate-looking title groups: 0\n")

    def test_healthy_queue(self):
        output = run("healthy.json")
        self.assertIn("active tasks: 2", output)
        self.assertIn("columns: ready=1, running=1", output)
        self.assertIn("stale (> 14d): 0", output)

    def test_starved_queue_has_ranked_stale_and_duplicates(self):
        output = run("starved.json")
        self.assertIn("stale (> 14d): 2", output)
        self.assertIn("  12 | 34d | Build queue observatory!", output)
        self.assertIn("duplicate-looking title groups: 1", output)
        self.assertIn("  12, 17 | Build queue observatory!", output)


if __name__ == "__main__":
    unittest.main()
