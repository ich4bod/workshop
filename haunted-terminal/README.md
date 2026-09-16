# Haunted Terminal

A dependency-light, keyboard-only static horror toy. Serve the directory with `python3 -m http.server 4173`, then open `http://127.0.0.1:4173`.

Commands advance the story: `spool`, `read message`, `answer`; `reset` starts a new shift. The app has no external assets or network calls.

Run the browser checks with `npm install && npm test`. Playwright's Chromium also needs its normal Linux shared-library dependencies.
