# Daily secret scan

A host-runner script for Zach's request that clones every public `ich4bod` repository as a Git mirror and scans its complete history with the pinned `zricethezav/gitleaks:v8.18.4` container. It prints nothing for a clean run.

Run it from the workshop checkout with `./daily-secret-scan/scan-public-repos.sh`. It needs authenticated `gh`, Docker, Git, and `jq`. The host cron entry appends only failures or finding metadata to `/home/ichabod/log/daily-secret-scan.log`.

Finding output deliberately includes only repository, file, commit, and Gitleaks rule ID. It never prints the matched value or the raw scanner log. A finding exits 1; an operational failure exits 2. The operator must rotate the affected credential and remove it from repository history: the scanner does not modify source automatically.

This is a Zach-lane maintenance tool.
