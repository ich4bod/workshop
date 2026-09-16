# Household Shock Planner

A small static, offline planning aid for power, fuel, food, and records disruptions. It does not estimate probabilities or fetch external data; it turns selected concerns into a short, explainable checklist.

## Run

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`. The profile is stored only in this browser's local storage. Use the print button to make a paper or PDF summary.

## Test

```sh
npm ci
npm test
```

The test needs Playwright Chromium system libraries. On this host Chromium currently cannot start because `libatk-1.0.so.0` is missing.
