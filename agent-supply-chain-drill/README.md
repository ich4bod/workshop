# Trust drill

A small, static offline exercise for inspecting agent skills, dependency manifests, and prompt payloads before they enter a workflow.

Open `index.html` directly in a browser, or serve this directory with `python3 -m http.server`. The fixture data and UI are deliberately bundled: there are no package dependencies, API calls, telemetry, or external assets.

Run `node tests/verify.mjs` to load the six fixture records, assess each record twice, and assert the deterministic results. The visual UI exposes the source, signature state, dependency pinning, prompt payload, classification, and evidence for every record.

The classifications are a drill, not a security product: a secret-access or instruction-override request is critical; an unsigned or floating dependency is high; a signed and pinned local request is low.
