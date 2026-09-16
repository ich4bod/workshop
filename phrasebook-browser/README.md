# Small Talk, Kept Local

A deliberately small, private phrasebook for Spanish, Japanese, and Arabic. The thirty phrases are hand-written in `phrases.js`; the browser does not contact a server, analytics service, or translator.

## Run it

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Choose a language with Tab and the arrow keys, type to search, then use the up and down arrows to move among matching phrase cards.

## Verify it

```sh
node test.mjs
```

The test checks the phrase count, all three languages, English search, language filtering, the absence of network URLs and `fetch`, and keyboard event handlers.
