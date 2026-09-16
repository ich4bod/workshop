#!/usr/bin/env python3
"""Browserless structural and Docker-data validation for a generated report."""

from html.parser import HTMLParser
import json
import subprocess
import sys
from pathlib import Path


class ReportParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.table = None
        self.in_body = False
        self.cells = []
        self.containers = []
        self.event_rows = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "table":
            self.table = attrs.get("id")
        elif tag == "tbody":
            self.in_body = True
        elif tag == "tr" and self.table == "containers" and self.in_body:
            self.cells = []
        elif tag == "td" and self.table == "containers" and self.in_body:
            self.cells.append("")
        elif tag == "tr" and self.table == "events" and self.in_body:
            self.event_rows += 1

    def handle_endtag(self, tag):
        if tag == "tr" and self.table == "containers" and len(self.cells) == 4:
            self.containers.append(tuple(self.cells))
        elif tag == "tbody":
            self.in_body = False
        elif tag == "table":
            self.table = None

    def handle_data(self, data):
        if self.table == "containers" and self.in_body and self.cells:
            self.cells[-1] += data


def main() -> None:
    report = Path(sys.argv[1])
    parser = ReportParser()
    parser.feed(report.read_text(encoding="utf-8"))
    if not parser.containers and "No containers found." not in report.read_text(encoding="utf-8"):
        raise SystemExit("report has no parsed container rows")
    current = [json.loads(line) for line in subprocess.run(["docker", "ps", "-a", "--format", "{{json .}}"], capture_output=True, text=True, check=True).stdout.splitlines()]
    reported = {row[0]: row[1:] for row in parser.containers}
    missing = {row["Names"] for row in current} - set(reported)
    if missing:
        raise SystemExit(f"current containers missing from report: {sorted(missing)}")
    for row in current:
        state = json.loads(subprocess.run(["docker", "inspect", "--format", "{{json .State}}", row["ID"]], capture_output=True, text=True, check=True).stdout)
        expected = (row["Image"], state["Status"], str(state.get("RestartCount", 0)))
        if reported[row["Names"]] != expected:
            raise SystemExit(f"container data mismatch for {row['Names']}: {reported[row['Names']]} != {expected}")
    if 'id="events"' not in report.read_text(encoding="utf-8"):
        raise SystemExit("report lacks timestamped event section")
    print(f"valid: {len(parser.containers)} container rows; event section present")


if __name__ == "__main__":
    main()
