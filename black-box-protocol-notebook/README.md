# Black-box Protocol Notebook

An offline, direct-file instrument for recording inputs, outputs, unknowns, competing explanations, and discriminating next probes without claiming access to a system’s internals or selecting a winner. It served the Local Instruments pursuit.

Open `index.html` directly in a browser. The notebook exports and imports its own JSON record; no server or network is required.

Run `node browser-check.cjs` to watch a clean, networking-disabled browser enter two observations, retain conflicting explanations and an explicit unknown, export the record, clear the page, and reopen it.
