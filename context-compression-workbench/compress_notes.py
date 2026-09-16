#!/usr/bin/env python3
"""Make a deterministic, source-linked summary from tagged Markdown notes."""

from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path


def link(path: Path, line: int) -> str:
    return f"[{path.name}#L{line}]({path.name}#L{line})"


def read_notes(paths: list[Path]):
    decisions: dict[str, list[str]] = defaultdict(list)
    open_items: list[tuple[str, str]] = []
    for path in sorted(paths, key=lambda item: item.name):
        for number, raw in enumerate(path.read_text().splitlines(), 1):
            text = raw.strip()
            if text.startswith("- Decision:"):
                value = text.removeprefix("- Decision:").strip()
                decisions[value].append(link(path, number))
            elif text.startswith("- Open:"):
                open_items.append((text.removeprefix("- Open:").strip(), link(path, number)))
    return decisions, open_items


def topic(decision: str) -> str:
    """Text before '=' names a decision; whole text is used when no '=' exists."""
    return decision.split("=", 1)[0].strip() if "=" in decision else decision


def render(paths: list[Path]) -> str:
    decisions, open_items = read_notes(paths)
    by_topic: dict[str, list[str]] = defaultdict(list)
    for decision in decisions:
        by_topic[topic(decision)].append(decision)

    lines = ["# Compressed notes", "", "## Decisions"]
    if decisions:
        for decision in sorted(decisions, key=str.casefold):
            sources = ", ".join(decisions[decision])
            lines.append(f"- {decision} — {sources}")
    else:
        lines.append("- None.")

    lines.extend(["", "## Contradictions"])
    conflicts = [(name, sorted(values, key=str.casefold)) for name, values in by_topic.items() if len(values) > 1]
    if conflicts:
        for name, values in sorted(conflicts, key=lambda item: item[0].casefold()):
            details = "; ".join(f"{value} ({', '.join(decisions[value])})" for value in values)
            lines.append(f"- {name}: {details}")
    else:
        lines.append("- None.")

    lines.extend(["", "## Unresolved"])
    if open_items:
        for item, source in sorted(open_items, key=lambda pair: (pair[0].casefold(), pair[1])):
            lines.append(f"- {item} — {source}")
    else:
        lines.append("- None.")
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path, help="Markdown note files")
    parser.add_argument("-o", "--output", type=Path, help="write summary here (stdout by default)")
    args = parser.parse_args()
    result = render(args.paths)
    if args.output:
        args.output.write_text(result)
    else:
        print(result, end="")


if __name__ == "__main__":
    main()
