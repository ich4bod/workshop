#!/usr/bin/env bash
# Scan every public repository owned by ich4bod, including its full Git history.
# Findings are deliberately reduced to safe metadata before anything is printed.
set -euo pipefail

readonly OWNER="ich4bod"
readonly IMAGE="zricethezav/gitleaks:v8.18.4"
readonly WORK_ROOT="${TMPDIR:-/tmp}/ichabod-secret-scan"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG="$SCRIPT_DIR/gitleaks.toml"
readonly ENV_FILE="/home/ichabod/.config/ichabod/env"

# Cron has no interactive GH_TOKEN. This is the fixed local credential file used by the host wrappers.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

workdir="$(mktemp -d "$WORK_ROOT.XXXXXX")"
trap 'rm -rf "$workdir"' EXIT

if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  printf 'secret-scan failure: required image %s is not present; pull it before the next run\n' "$IMAGE" >&2
  exit 2
fi

if ! repos="$(gh repo list "$OWNER" --limit 100 --json nameWithOwner,isPrivate --jq '.[] | select(.isPrivate == false) | .nameWithOwner')"; then
  printf 'secret-scan failure: could not list public repositories for %s\n' "$OWNER" >&2
  exit 2
fi

findings=0
failures=0
scanned=0
while IFS= read -r repo; do
  [ -n "$repo" ] || continue
  scanned=$((scanned + 1))
  name="${repo#*/}"
  mirror="$workdir/$name.git"
  report="$workdir/$name.json"
  scanner_log="$workdir/$name.gitleaks.log"

  if ! git clone --quiet --mirror "https://github.com/$repo.git" "$mirror"; then
    printf 'secret-scan failure: could not clone %s\n' "$repo" >&2
    failures=$((failures + 1))
    continue
  fi

  set +e
  docker run --rm --network none -v "$mirror:/repo:ro" -v "$workdir:/reports" -v "$CONFIG:/config/gitleaks.toml:ro" "$IMAGE" detect --no-banner --config /config/gitleaks.toml --source /repo --report-format json --report-path "/reports/$name.json" >"$scanner_log" 2>&1
  status=$?
  set -e

  if [ -s "$report" ]; then
    count="$(jq 'length' "$report")"
    findings=$((findings + count))
    # Never print .Secret, .Match, or raw gitleaks output: the cron log is safe to read.
    jq -r --arg repo "$repo" '.[] | "secret-scan finding: repo=\($repo) file=\(.File) commit=\(.Commit) type=\(.RuleID)"' "$report" >&2
  elif [ "$status" -ne 0 ]; then
    printf 'secret-scan failure: gitleaks could not complete for %s (exit %s)\n' "$repo" "$status" >&2
    failures=$((failures + 1))
  fi
done <<<"$repos"

if [ "$failures" -gt 0 ]; then
  printf 'secret-scan failure: %s repository scan(s) failed\n' "$failures" >&2
  exit 2
fi
if [ "$findings" -gt 0 ]; then
  printf 'secret-scan finding: %s possible secret(s); rotate the affected credential and remove it from history before closing the incident\n' "$findings" >&2
  exit 1
fi
printf 'secret-scan clean: %s public repositories scanned\n' "$scanned"
