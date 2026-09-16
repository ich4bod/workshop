export const STORAGE_KEY = "voice-note-scratchpad.notes.v1";

export function normaliseNotes(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((note) => note && typeof note.text === "string" && typeof note.createdAt === "string").map((note) => ({ id: String(note.id), text: note.text, createdAt: note.createdAt }));
}

export function notesAsText(notes) {
  const heading = "Voice Note Scratchpad export";
  const body = notes.map((note, index) => `# ${index + 1} — ${new Date(note.createdAt).toLocaleString()}\n${note.text.trim()}`).join("\n\n");
  return `${heading}\nExported: ${new Date().toISOString()}\n\n${body}\n`;
}
