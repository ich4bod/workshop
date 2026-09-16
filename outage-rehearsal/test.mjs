import assert from "node:assert/strict";
import { scenarioFor, scoreFor, grade } from "./lib.js";

const first = scenarioFor("night-shift");
assert.deepEqual(scenarioFor("night-shift"), first, "the same seed must make the same scenario");
assert.equal(first.steps.length, 3, "every scenario has three decisions");
assert.equal(scoreFor([0, 0, 0]), 90);
assert.equal(scoreFor([1, 1, 1]), -30);
assert.equal(grade(90), "Steady hands");
console.log("deterministic scenario and scoring checks passed");
