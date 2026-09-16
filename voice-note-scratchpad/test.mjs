import assert from "node:assert/strict";
import { normaliseNotes, notesAsText } from "./lib.js";

const notes = normaliseNotes([
  { id: "a", text: "First remembered thought", createdAt: "2026-01-02T03:04:05.000Z" },
  { id: "b", text: "Second remembered thought", createdAt: "2026-01-02T03:05:05.000Z" },
  { id: "c", text: "Third remembered thought", createdAt: "2026-01-02T03:06:05.000Z" },
]);
assert.equal(notes.length, 3);
const exported = notesAsText(notes);
assert.match(exported, /Voice Note Scratchpad export/);
for (const note of notes) assert.ok(exported.includes(note.text));
assert.deepEqual(normaliseNotes("bad data"), []);
console.log("Three notes export as readable text.");
