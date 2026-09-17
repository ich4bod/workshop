import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from provenance_check import read_creation, record_for


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
