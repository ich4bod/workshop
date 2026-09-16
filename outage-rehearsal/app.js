import { scenarioFor, scoreFor, grade } from "./lib.js";

const params = new URLSearchParams(location.search);
const seed = params.get("seed") || crypto.randomUUID().slice(0, 8);
if (!params.has("seed")) history.replaceState({}, "", `?seed=${encodeURIComponent(seed)}`);
const scenario = scenarioFor(seed);
const storageKey = `outage-rehearsal:${seed}`;
let choices = JSON.parse(localStorage.getItem(storageKey) || "[]");
const game = document.querySelector("#game");
document.querySelector("#seedline").textContent = `DRILL SEED: ${seed}`;

function render() {
  const step = choices.length;
  if (step === 3) {
    const score = scoreFor(choices);
    game.innerHTML = `<h2>${scenario.name}</h2><p class="result">${grade(score)} — ${score}/90</p><p>You kept a record of your choices locally. Reload this URL to verify the same drill and score.</p><button id="replay">Rehearse again</button>`;
    document.querySelector("#replay").onclick = () => { choices = []; localStorage.removeItem(storageKey); render(); };
    return;
  }
  game.innerHTML = `<p class="progress">MOVE ${step + 1} OF 3</p><h2>${scenario.name}</h2><p class="symptom">${scenario.symptom}</p><p>What do you do now?</p>${scenario.steps[step].map((option, i) => `<button data-choice="${i}">${option}</button>`).join("")}`;
  game.querySelectorAll("[data-choice]").forEach(button => button.onclick = () => { choices.push(Number(button.dataset.choice)); localStorage.setItem(storageKey, JSON.stringify(choices)); render(); });
}
document.querySelector("#new").onclick = () => location.href = `?seed=${crypto.randomUUID().slice(0, 8)}`;
render();
