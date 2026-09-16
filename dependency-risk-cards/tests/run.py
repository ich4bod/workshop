"""Standard-library test runner for hosts without pytest installed."""
from pathlib import Path
from tempfile import TemporaryDirectory

from test_cli import (
    test_malformed_input_exits_nonzero_without_traceback,
    test_npm_report_is_deterministic_and_flags_risks,
    test_python_lock_marks_direct_and_transitive,
)

for test in (test_npm_report_is_deterministic_and_flags_risks, test_python_lock_marks_direct_and_transitive, test_malformed_input_exits_nonzero_without_traceback):
    with TemporaryDirectory() as directory:
        test(Path(directory))
    print(f"PASS {test.__name__}")
