from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).parents[1]
FIXTURES = Path(__file__).parent / "fixtures"


def run(manifest: str, output: Path):
    return subprocess.run([sys.executable, "-m", "dependency_risk.cli", str(FIXTURES / manifest), "--output", str(output)], cwd=ROOT, env={"PYTHONPATH": str(ROOT / "src")}, text=True, capture_output=True)


def test_npm_report_is_deterministic_and_flags_risks(tmp_path):
    first, second = tmp_path / "one.md", tmp_path / "two.md"
    assert run("package-lock.json", first).returncode == 0
    assert run("package-lock.json", second).returncode == 0
    text = first.read_text()
    assert text == second.read_text()
    assert "| direct | 1.2.3 | direct | — |" in text
    assert "| transitive | 2.0.0 | transitive | lifecycle hooks: postinstall |" in text
    assert "missing or floating version" in text


def test_python_lock_marks_direct_and_transitive(tmp_path):
    output = tmp_path / "python.md"
    assert run("pyproject.toml", output).returncode == 0
    text = output.read_text()
    assert "| requests | 2.32.0 | direct | — |" in text
    assert "| urllib3 | 2.2.0 | transitive | — |" in text
    assert "| unsafe | (missing) | direct | missing or floating version |" in text


def test_malformed_input_exits_nonzero_without_traceback(tmp_path):
    broken = tmp_path / "package.json"
    broken.write_text("{")
    result = subprocess.run([sys.executable, "-m", "dependency_risk.cli", str(broken)], cwd=ROOT, env={"PYTHONPATH": str(ROOT / "src")}, text=True, capture_output=True)
    assert result.returncode != 0
    assert "Traceback" not in result.stderr
