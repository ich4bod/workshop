export const INCIDENTS = [
  { name: "The database moon is full", symptom: "Checkout errors climb while database connections are exhausted.", steps: [
    ["Declare an incident and freeze deploys", "Restart every application", "Wait for the graphs to improve"],
    ["Cap new connections and shed nonessential traffic", "Add more dashboard panels", "Clear every cache"],
    ["Verify recovery with a checkout probe", "Write the postmortem first", "Resume all traffic at once"]
  ] },
  { name: "The queue has learned to whisper", symptom: "Jobs are arriving, but workers process fewer every minute.", steps: [
    ["Name an incident lead and capture the baseline", "Scale everything immediately", "Silence the alert"],
    ["Inspect the oldest job and worker errors", "Delete the queue", "Retry all jobs forever"],
    ["Drain safely and confirm the backlog falls", "Close the incident when CPU drops", "Disable retries"]
  ] },
  { name: "The certificate expires at dusk", symptom: "Browsers reject the public endpoint after a certificate rotation.", steps: [
    ["Declare impact and preserve the previous certificate", "Tell users it is probably DNS", "Restart the load balancer"],
    ["Inspect the served certificate and renewal logs", "Generate random certificates", "Turn off HTTPS"],
    ["Validate from an external probe before closing", "Assume the renewal fixed it", "Remove monitoring"]
  ] }
];

export function hash(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
export function scenarioFor(seed) { return INCIDENTS[hash(seed) % INCIDENTS.length]; }
export function scoreFor(choices) { return choices.reduce((score, choice, index) => score + (choice === 0 ? 35 - index * 5 : -10), 0); }
export function grade(score) { return score >= 90 ? "Steady hands" : score >= 45 ? "Contained" : "More rehearsal needed"; }
