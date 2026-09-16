from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Dependency:
    name: str
    version: str
    direct: bool
    hooks: tuple[str, ...] = ()


def npm_dependencies(path: Path) -> list[Dependency]:
    data = json.loads(path.read_text())
    if path.name == "package.json":
        direct = data.get("dependencies", {}) | data.get("devDependencies", {})
        hooks = tuple(sorted(k for k in data.get("scripts", {}) if k in {"preinstall", "install", "postinstall", "prepare"}))
        return [Dependency(name, str(version), True, hooks) for name, version in direct.items()]
    packages = data.get("packages")
    if not isinstance(packages, dict):
        raise ValueError("package-lock.json needs a packages object")
    root = packages.get("", {})
    direct_names = set(root.get("dependencies", {})) | set(root.get("devDependencies", {}))
    result = []
    for location, package in packages.items():
        if not location or not isinstance(package, dict):
            continue
        name = package.get("name") or location.rsplit("node_modules/", 1)[-1]
        hooks = tuple(sorted(k for k in package.get("scripts", {}) if k in {"preinstall", "install", "postinstall", "prepare"}))
        result.append(Dependency(str(name), str(package.get("version", "")), name in direct_names, hooks))
    return result


def python_dependencies(path: Path) -> list[Dependency]:
    data = tomllib.loads(path.read_text())
    project = data.get("project", {})
    direct_names = {re.match(r"[A-Za-z0-9_.-]+", requirement).group(0).lower() for requirement in project.get("dependencies", []) if re.match(r"[A-Za-z0-9_.-]+", requirement)}
    lock = path.with_name("uv.lock")
    if not lock.exists():
        return [Dependency(name, "(unlocked)", True) for name in sorted(direct_names)]
    lock_data = tomllib.loads(lock.read_text())
    return [Dependency(str(item["name"]), str(item.get("version", "")), str(item["name"]).lower() in direct_names) for item in lock_data.get("package", []) if isinstance(item, dict) and "name" in item]


def inspect(path: Path) -> list[Dependency]:
    if path.name in {"package.json", "package-lock.json"}:
        return npm_dependencies(path)
    if path.name == "pyproject.toml":
        return python_dependencies(path)
    raise ValueError("supported inputs are package.json, package-lock.json, and pyproject.toml")


def report(path: Path) -> str:
    dependencies = sorted(inspect(path), key=lambda dep: (dep.name.lower(), dep.version))
    lines = [f"# Dependency risk card: {path.name}", "", "| Dependency | Version | Kind | Flags |", "| --- | --- | --- | --- |"]
    for dep in dependencies:
        flags = []
        if not dep.version or dep.version in {"*", "latest", "(unlocked)"}:
            flags.append("missing or floating version")
        if dep.hooks:
            flags.append("lifecycle hooks: " + ", ".join(dep.hooks))
        lines.append(f"| {dep.name} | {dep.version or '(missing)'} | {'direct' if dep.direct else 'transitive'} | {'; '.join(flags) or '—'} |")
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an offline dependency risk card")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        content = report(args.manifest)
    except (OSError, ValueError, json.JSONDecodeError, tomllib.TOMLDecodeError) as error:
        print(f"dep-risk: {error}", file=sys.stderr)
        raise SystemExit(2)
    output = args.output or args.manifest.with_name(args.manifest.stem + ".risk.md")
    output.write_text(content)
    print(output)


if __name__ == "__main__":
    main()
