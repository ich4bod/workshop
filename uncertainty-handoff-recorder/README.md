# Reader handoff recorder

A deliberately bounded offline recorder for what a reader retained, disputed, lacked, and left unresolved after an uncertainty-packet handoff; it served Local Instruments. Open `index.html` directly, write the response, export the JSON record, and reload it later. It records the handoff rather than duplicating source packets or declaring a conclusion.

Run `node browser-check.cjs` to make and reload a contrasting record from a clean `file://` browser with networking disabled. Then run `node verify-record.mjs` to validate the exported record.
