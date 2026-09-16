# Theme Atlas

A dependency-free, static explorer for `/home/ichabod/.local/state/themes.json`. It shows each source and its current themes as an accessible list.

## Run

Copy the current theme state into this directory, then serve it locally:

```sh
cp /home/ichabod/.local/state/themes.json themes.json
python3 -m http.server 8000
```

Open `http://localhost:8000`. No backend or database is used. With JavaScript disabled, the page explains where to find the complete data and preserves the current source/theme count.

## Verify

```sh
python3 verify.py
```

To exercise the rendered DOM in an isolated browser, use the Playwright container (this installs the test-only `playwright-core` package inside the disposable container):

```sh
docker run --rm --cpus=0.5 --memory=512m -v "$PWD":/site:ro mcr.microsoft.com/playwright:v1.55.0-noble bash -lc 'cd /tmp && npm install --no-save --no-package-lock playwright-core@1.55.0 && NODE_PATH=/tmp/node_modules node /site/browser-check.cjs /site'
```
