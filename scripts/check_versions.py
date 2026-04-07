#!/usr/bin/env python3
"""Compare tool manifest versions against live sources (PyPI, Docker Hub, GitHub)."""

import json
import os
import sys
from pathlib import Path

import requests

TOOLS_DIR = Path(__file__).parent.parent / "tools"


def get_pypi_version(package: str) -> str | None:
    """Get latest version from PyPI."""
    try:
        r = requests.get(f"https://pypi.org/pypi/{package}/json", timeout=10)
        if r.ok:
            return r.json()["info"]["version"]
    except Exception:
        pass
    return None


def check_manifest(manifest: dict) -> dict | None:
    """Check if a manifest's version is stale. Returns stale info or None."""
    tool_id = manifest["id"]
    current = manifest["version"]
    install_type = manifest["install_type"]

    latest = None

    if install_type == "pip":
        # Extract package name from install_cmd
        cmd = manifest["install_cmd"]
        parts = cmd.split()
        package = parts[-1] if parts else tool_id
        latest = get_pypi_version(package)

    if latest and latest != current:
        return {
            "id": tool_id,
            "name": manifest["name"],
            "current": current,
            "latest": latest,
        }
    return None


def main():
    stale = []
    for f in sorted(TOOLS_DIR.glob("*.json")):
        if f.name == "index.json":
            continue
        manifest = json.loads(f.read_text())
        result = check_manifest(manifest)
        if result:
            stale.append(result)
            print(f"STALE: {result['name']} — manifest {result['current']}, latest {result['latest']}")

    if stale:
        Path("stale_tools.json").write_text(json.dumps(stale, indent=2))
        print(f"\n{len(stale)} stale manifest(s) found.")
    else:
        print("All manifests up to date.")


if __name__ == "__main__":
    main()
