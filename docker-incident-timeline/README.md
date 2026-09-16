# Docker incident timeline

A dependency-free local command that renders Docker container state and recent Docker events into a standalone HTML report.

## Run

```sh
python3 docker_incident_timeline.py --output report.html --hours 24
python3 validate_report.py report.html
```

The generator uses the local Docker socket through the Docker CLI. It records every current container's name, image, runtime state, and restart count. It also asks Docker for timestamped events from the selected history window. Docker does not retain events indefinitely, so an empty event table is valid and is rendered explicitly.

`validate_report.py` uses Python's standard-library `HTMLParser`, then compares the parsed container names to `docker ps -a`; it exits nonzero if the report omits a current container or lacks the event table.
