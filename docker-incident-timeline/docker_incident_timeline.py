#!/usr/bin/env python3
"""Render a static Docker state and event timeline without third-party packages."""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import subprocess
from pathlib import Path


def docker_json_lines(*args: str) -> list[dict[str, object]]:
    result = subprocess.run(["docker", *args], check=True, capture_output=True, text=True)
    return [json.loads(line) for line in result.stdout.splitlines() if line.strip()]


def containers() -> list[dict[str, object]]:
    rows = docker_json_lines("ps", "-a", "--format", "{{json .}}")
    output = []
    for row in rows:
        inspect = subprocess.run(
            ["docker", "inspect", "--format", "{{json .State}}", str(row["ID"])],
            check=True,
            capture_output=True,
            text=True,
        )
        state = json.loads(inspect.stdout)
        output.append(
            {
                "name": str(row["Names"]),
                "id": str(row["ID"]),
                "image": str(row["Image"]),
                "state": str(state.get("Status", row.get("State", "unknown"))),
                "restart_count": int(state.get("RestartCount", 0)),
            }
        )
    return sorted(output, key=lambda item: str(item["name"]))


def events(hours: int) -> list[dict[str, object]]:
    since = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=hours)).isoformat()
    until = dt.datetime.now(dt.timezone.utc).isoformat()
    return docker_json_lines("events", "--since", since, "--until", until, "--format", "{{json .}}")


def cell(value: object) -> str:
    return html.escape(str(value))


def render(container_rows: list[dict[str, object]], event_rows: list[dict[str, object]], hours: int) -> str:
    generated = dt.datetime.now(dt.timezone.utc).isoformat()
    container_html = "\n".join(
        f"<tr data-container-id=\"{cell(row['id'])}\"><td>{cell(row['name'])}</td><td>{cell(row['image'])}</td><td>{cell(row['state'])}</td><td>{cell(row['restart_count'])}</td></tr>"
        for row in container_rows
    ) or '<tr><td colspan="4">No containers found.</td></tr>'
    event_html = "\n".join(
        f"<tr><td>{cell(row.get('time', ''))}</td><td>{cell(row.get('Type', ''))}</td><td>{cell(row.get('Action', ''))}</td><td>{cell(row.get('Actor', {}).get('Attributes', {}).get('name', row.get('Actor', {}).get('ID', '')))}</td></tr>"
        for row in event_rows
    ) or '<tr><td colspan="4">No Docker events in this window.</td></tr>'
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Docker incident timeline</title>
<style>body{{font:16px system-ui;max-width:1100px;margin:2rem auto;padding:0 1rem;background:#17151b;color:#eee}}table{{border-collapse:collapse;width:100%;margin-bottom:2rem}}th,td{{border:1px solid #555;padding:.45rem;text-align:left}}th{{background:#302839}}code{{color:#f4c2d7}}</style></head>
<body><h1>Docker incident timeline</h1><p>Generated <code>{cell(generated)}</code>. Events cover the preceding {hours} hours.</p>
<h2>Current containers ({len(container_rows)})</h2><table id="containers"><thead><tr><th>Name</th><th>Image</th><th>State</th><th>Restart count</th></tr></thead><tbody>{container_html}</tbody></table>
<h2>Timestamped events ({len(event_rows)})</h2><table id="events"><thead><tr><th>Timestamp</th><th>Type</th><th>Action</th><th>Container</th></tr></thead><tbody>{event_html}</tbody></table>
</body></html>"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("docker-incident-timeline.html"))
    parser.add_argument("--hours", type=int, default=24, help="event history window (default: 24)")
    args = parser.parse_args()
    args.output.write_text(render(containers(), events(args.hours), args.hours), encoding="utf-8")
    print(args.output.resolve())


if __name__ == "__main__":
    main()
