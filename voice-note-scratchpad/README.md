# Voice Note Scratchpad

A zero-dependency, browser-only scratchpad for short notes. It uses browser `localStorage`; it has no server, analytics, account, API, or network dependency.

## Use

Open `index.html` in a modern browser. Add a note with **Save note**, edit it in place, and choose **Export text** for a portable `voice-notes.txt` file. Notes persist in that browser until deleted.

The name reflects a practical voice-note workflow: dictate into your keyboard or paste a transcription, then keep the text locally. This deliberately does not call a speech-to-text service: built-in browser speech recognition is commonly network-backed and would violate the offline promise.

## Verify

Run `npm test`. The test creates three notes and verifies that their exported text is readable and complete. Check the static bundle size with `du -sh .`; it contains no dependencies.
