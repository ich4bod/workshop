import assert from "node:assert/strict";
import { searchEntries } from "./data.js";

const cases = ["wifi", "bluetooth", "audio", "touchpad", "webcam", "resolution"];
for (const symptom of cases) {
  const matches = searchEntries(symptom);
  assert.ok(matches.length > 0, `${symptom} should find an entry`);
  for (const entry of matches) {
    assert.ok(entry.class, `${entry.id} needs a device class`);
    assert.ok(entry.clue, `${entry.id} needs an evidence clue`);
    assert.ok(entry.next, `${entry.id} needs a next check`);
  }
}
assert.equal(searchEntries("definitely absent").length, 0);
console.log(`Passed ${cases.length} symptom fixtures across ${searchEntries("").length} entries.`);
