#!/usr/bin/env python3
"""Summarize an exported Kanboard-style task JSON file without network access."""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from collections import Counter
from pathlib import Path
from typing import Any


def tasks_from(document: Any) -> list[dict[str, Any]]:
    if isinstance(document, list):
        return document
    if isinstance(document, dict) and isinstance(document.get("tasks"), list):
        return document["tasks"]
    raise ValueError("fixture must be a JSON task list or an object with a 'tasks' list")


def normalized_title(title: str) -> str:
    return re.sub(r"\W+", " ", title.casefold()).strip()


def report(tasks: list[dict[str, Any]], now: int, stale_days: int) -> str:
    active = [task for task in tasks if task.get("is_active", 1)]
    columns = Counter(str(task.get("column_name", task.get("column_id", "unknown"))) for task in active)
    lines = ["Board queue observatory", f"active tasks: {len(active)}"]
    lines.append("columns: " + (", ".join(f"{name}={columns[name]}" for name in sorted(columns)) or "none"))

    threshold = now - stale_days * 86400
    stale = sorted(
        (task for task in active if int(task.get("date_moved", task.get("date_creation", now))) < threshold),
        key=lambda task: (int(task.get("date_moved", task.get("date_creation", now))), str(task.get("title", ""))),
    )
    lines.append(f"stale (> {stale_days}d): {len(stale)}")
    for task in stale:
        age = (now - int(task.get("date_moved", task.get("date_creation", now)))) // 86400
        lines.append(f"  {task.get('id', '?')} | {age}d | {task.get('title', '(untitled)')}")

    groups: dict[str, list[dict[str, Any]]] = {}
    for task in active:
        title = normalized_title(str(task.get("title", "")))
        if title:
            groups.setdefault(title, []).append(task)
    duplicates = sorted((group for group in groups.values() if len(group) > 1), key=lambda group: (-len(group), normalized_title(str(group[0]["title"]))))
    lines.append(f"duplicate-looking title groups: {len(duplicates)}")
    for group in duplicates:
        ids = ", ".join(str(task.get("id", "?")) for task in sorted(group, key=lambda task: str(task.get("id", ""))))
        lines.append(f"  {ids} | {group[0]['title']}")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("fixture", type=Path, help="JSON task list or {'tasks': [...]} export")
    parser.add_argument("--now", type=int, default=int(time.time()), help="Unix timestamp for reproducible reports")
    parser.add_argument("--stale-days", type=int, default=14, help="Age threshold for stale tasks")
    args = parser.parse_args()
    try:
        with args.fixture.open(encoding="utf-8") as source:
            tasks = tasks_from(json.load(source))
        print(report(tasks, args.now, args.stale_days))
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"board-observatory: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
