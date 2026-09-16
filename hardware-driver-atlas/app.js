import { entries, searchEntries } from "./data.js";

const search = document.querySelector("#search");
const results = document.querySelector("#results");
const count = document.querySelector("#count");

function card(entry) {
  return `<article><h2>${entry.title}</h2><p><strong>Device class</strong> ${entry.class}</p><p><strong>Evidence clue</strong> <code>${entry.clue}</code></p><p><strong>Safe next check</strong> ${entry.next}</p></article>`;
}

function render() {
  const matched = searchEntries(search.value);
  count.textContent = `${matched.length} of ${entries.length} entries`;
  results.innerHTML = matched.length ? matched.map(card).join("") : "<p class=empty>No close match. Try a symptom, device class, or command.</p>";
}

search.addEventListener("input", render);
render();
