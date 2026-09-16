import { STORAGE_KEY, normaliseNotes, notesAsText } from "./lib.js";

const draft = document.querySelector("#draft");
const notesElement = document.querySelector("#notes");
const count = document.querySelector("#count");
const status = document.querySelector("#status");
const template = document.querySelector("#note-template");
let notes = load();

function load() {
  try { return normaliseNotes(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { return []; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); }
function announce(message) { status.textContent = message; }
function render() {
  notesElement.replaceChildren();
  count.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
  if (!notes.length) { notesElement.innerHTML = "<p class=\"empty\">No notes yet. Your first one stays on this device.</p>"; return; }
  notes.forEach((note) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const field = item.querySelector("textarea");
    field.value = note.text;
    field.addEventListener("input", () => { note.text = field.value; persist(); announce("Saved locally."); });
    item.querySelector("time").dateTime = note.createdAt;
    item.querySelector("time").textContent = new Date(note.createdAt).toLocaleString();
    item.querySelector(".delete").addEventListener("click", () => { notes = notes.filter(({ id }) => id !== note.id); persist(); render(); announce("Note deleted."); });
    notesElement.append(item);
  });
}

document.querySelector("#save").addEventListener("click", () => {
  const text = draft.value.trim();
  if (!text) { announce("Write something before saving."); draft.focus(); return; }
  notes.unshift({ id: crypto.randomUUID(), text, createdAt: new Date().toISOString() });
  persist(); draft.value = ""; render(); announce("Note saved locally.");
});
draft.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") document.querySelector("#save").click(); });
document.querySelector("#export").addEventListener("click", () => {
  const blob = new Blob([notesAsText(notes)], { type: "text/plain;charset=utf-8" });
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "voice-notes.txt" });
  link.click(); URL.revokeObjectURL(link.href); announce(`Exported ${notes.length} notes as voice-notes.txt.`);
});
render();
