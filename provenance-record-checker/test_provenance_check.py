import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from provenance_audit import audit
from provenance_check import read_creation, record_for
from provenance_compare import render


class ProvenanceCheckTests(unittest.TestCase):
    def setUp(self):
        self.path = Path(tempfile.mkstemp(suffix=".yaml")[1])
        self.path.write_text(
            """- name: Traced\n  url: https://example.test\n  source: https://github.com/example/tool/tree/abc123\n  evidence: Test passed\n  gap: No browser run\n\n- name: Incomplete\n  url: https://incomplete.test\n  gap: None\n"""
        )

    def tearDown(self):
        self.path.unlink()

    def test_reports_real_values_and_immutable_revision(self):
        result = record_for(read_creation(self.path, "Traced"))
        self.assertEqual(result["source_revision"], "abc123")
        self.assertEqual(result["missing_fields"], [])
        self.assertEqual(result["acceptance_evidence"], "Test passed")

    def test_versioned_fixtures_distinguish_each_missing_link(self):
        fixtures = json.loads((Path(__file__).parent / "fixtures.json").read_text())
        lines = []
        for fixture in fixtures:
            lines.append(f"- name: {fixture['name']}")
            lines.extend(f"  {key}: {value}" for key, value in fixture["fields"].items())
            lines.append("")
        self.path.write_text("\n".join(lines))
        for fixture in fixtures:
            with self.subTest(fixture=fixture["name"]):
                command = [sys.executable, "provenance_check.py", fixture["name"], "--creations", str(self.path)]
                first = subprocess.run(command, cwd=Path(__file__).parent, capture_output=True, text=True, check=True)
                second = subprocess.run(command, cwd=Path(__file__).parent, capture_output=True, text=True, check=True)
                self.assertEqual(first.stdout, second.stdout)
                self.assertEqual(json.loads(first.stdout)["missing_fields"], fixture["missing_fields"])

    def test_audit_distinguishes_current_stale_and_missing_source_revisions(self):
        current = audit(read_creation(self.path, "Traced"), "abc123")
        stale = audit(read_creation(self.path, "Traced"), "def456")
        missing = audit(read_creation(self.path, "Incomplete"), "def456")
        self.assertEqual(current, {"creation": "Traced", "field": "source_revision", "recorded_revision": "abc123", "observed_revision": "abc123", "status": "current"})
        self.assertEqual(stale["status"], "stale")
        self.assertEqual(stale["creation"], "Traced")
        self.assertEqual(stale["field"], "source_revision")
        self.assertEqual(missing["status"], "missing")
        self.assertIsNone(missing["recorded_revision"])

    def test_audit_command_uses_distinct_exit_codes(self):
        current = subprocess.run(
            [sys.executable, "provenance_audit.py", "Traced", "abc123", "--creations", str(self.path)],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
        )
        stale = subprocess.run(
            [sys.executable, "provenance_audit.py", "Traced", "def456", "--creations", str(self.path)],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
        )
        missing = subprocess.run(
            [sys.executable, "provenance_audit.py", "Incomplete", "def456", "--creations", str(self.path)],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
        )
        self.assertEqual(current.returncode, 0)
        self.assertEqual(stale.returncode, 1)
        self.assertEqual(missing.returncode, 1)
        for result, status in [(current, "current"), (stale, "stale"), (missing, "missing")]:
            payload = json.loads(result.stdout)
            self.assertEqual(payload["status"], status)
            self.assertEqual(payload["field"], "source_revision")

    def test_comparison_shows_two_records_and_each_bounded_gap_without_ranking(self):
        fixtures = json.loads((Path(__file__).parent / "fixtures.json").read_text())
        lines = []
        for fixture in fixtures:
            lines.append(f"- name: {fixture['name']}")
            lines.extend(f"  {key}: {value}" for key, value in fixture["fields"].items())
            lines.append("")
        self.path.write_text("\n".join(lines))
        report = render(record_for(read_creation(self.path, "Complete")), record_for(read_creation(self.path, "Missing source")))
        for text in ["Source revision", "abc123", "Acceptance record", "Focused test passed", "Public URL", "https://source-gap.example.test", "Bounded gap", "Source revision was not captured", "| Missing fields | None | source |", "does not rank either trace"]:
            self.assertIn(text, report)

    def test_labels_absent_fields_separately(self):
        result = record_for(read_creation(self.path, "Incomplete"))
        self.assertEqual(result["missing_fields"], ["source", "evidence"])
        self.assertIsNone(result["source"])

    def test_missing_creation_exits_nonzero(self):
        completed = subprocess.run(
            [sys.executable, "provenance_check.py", "Absent", "--creations", str(self.path)],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
        )
        self.assertEqual(completed.returncode, 2)
        self.assertIn("creation not found", completed.stderr)


if __name__ == "__main__":
    unittest.main()
