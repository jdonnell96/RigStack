#!/usr/bin/env python3
"""Create GitHub issues for stale tool manifests."""

import json
import os
import subprocess
from pathlib import Path


def main():
    stale_file = Path("stale_tools.json")
    if not stale_file.exists():
        return

    stale = json.loads(stale_file.read_text())

    for tool in stale:
        title = f"Update {tool['name']}: {tool['current']} → {tool['latest']}"
        body = (
            f"The manifest for **{tool['name']}** (`tools/{tool['id']}.json`) "
            f"lists version `{tool['current']}`, but the latest release is `{tool['latest']}`.\n\n"
            f"Please update the `version` field in the manifest."
        )

        # Check if issue already exists
        result = subprocess.run(
            ["gh", "issue", "list", "--search", title, "--json", "title", "--limit", "1"],
            capture_output=True,
            text=True,
        )
        existing = json.loads(result.stdout) if result.stdout.strip() else []
        if existing:
            print(f"Issue already exists for {tool['name']}, skipping.")
            continue

        subprocess.run(
            ["gh", "issue", "create", "--title", title, "--body", body, "--label", "manifest-update"],
        )
        print(f"Created issue: {title}")


if __name__ == "__main__":
    main()
