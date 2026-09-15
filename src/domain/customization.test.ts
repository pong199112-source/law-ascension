import { test } from "node:test";
import assert from "node:assert/strict";
import { activeCharacter, toggleEquipment } from "./customization.ts";
import { characterStages } from "./progression.ts";
import { equipmentItems } from "../data/equipment.ts";
import type { EquipmentState } from "../data/equipment.ts";

test("Lv.35 can wear all unlocked stages, but never a locked or unknown outfit", () => {
  for (const stage of characterStages.slice(0, 4))
    assert.equal(activeCharacter(35, stage.file), stage);
  for (const stage of characterStages.slice(4))
    assert.throws(() => activeCharacter(35, stage.file), RangeError);
  assert.throws(() => activeCharacter(35, "unknown.webp"), RangeError);
});
test("manual outfit survives future unlocks; automatic mode advances until explicitly selected", () => {
  const suit = characterStages[1];
  assert.equal(activeCharacter(17, null), suit);
  assert.equal(activeCharacter(20, null), characterStages[2]);
  for (const level of [20, 35, 40, 50, 99])
    assert.equal(activeCharacter(level, suit.file), suit);
  assert.equal(activeCharacter(50, null), characterStages[5]);
});
test("equipment toggles each slot independently without changing the previous state", () => {
  let state: EquipmentState = {};
  for (const item of equipmentItems) {
    const previous = state;
    state = toggleEquipment(state, item.id);
    assert.equal(previous[item.slot], undefined);
    assert.equal(state[item.slot], item.id);
  }
  assert.equal(Object.keys(state).length, 6);
  const removed = toggleEquipment(state, "glasses");
  assert.equal(removed.eyes, undefined);
  assert.equal(removed.bag, "bag");
  assert.equal(state.eyes, "glasses");
  assert.throws(() => toggleEquipment(state, "unknown"), RangeError);
});
