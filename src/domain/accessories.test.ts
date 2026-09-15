import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sceneEquipmentIds,
  sceneEquipmentLayout,
  stageWearableConfigs,
  wearableIds,
} from "../data/accessories.ts";

test("all six poses define safe anchors for the three natural wearables", () => {
  assert.equal(stageWearableConfigs.length, 6);
  for (const [index, config] of stageWearableConfigs.entries()) {
    assert.equal(config.stage, index + 1);
    assert.deepEqual(Object.keys(config.anchors).sort(), [...wearableIds].sort());
    for (const anchor of Object.values(config.anchors)) {
      assert.ok(anchor.left >= 20 && anchor.left <= 85);
      assert.ok(anchor.top >= 15 && anchor.top <= 55);
      assert.ok(anchor.width >= 4 && anchor.width <= 21);
      assert.ok(anchor.rotation >= -15 && anchor.rotation <= 15);
    }
  }
});

test("bag, tablet and pen use one responsive scene layout", () => {
  assert.deepEqual(Object.keys(sceneEquipmentLayout).sort(), [...sceneEquipmentIds].sort());
  for (const prop of Object.values(sceneEquipmentLayout)) {
    assert.ok(prop.left >= 0 && prop.left <= 100);
    assert.ok(prop.top >= 60 && prop.top <= 90);
    assert.ok(prop.width >= 10 && prop.width <= 20);
  }
});

test("base-art suppression is stage-specific and leaves equipment state untouched", () => {
  assert.deepEqual(stageWearableConfigs[0].sceneSuppressed, ["bag"]);
  assert.deepEqual(stageWearableConfigs[1].sceneSuppressed, ["bag"]);
  assert.deepEqual(stageWearableConfigs[2].sceneSuppressed, ["tablet", "pen"]);
  assert.equal(stageWearableConfigs[3].anchors.watch.suppressed, "base-art");
  assert.equal(stageWearableConfigs[4].anchors["id-card"].suppressed, "base-art");
  assert.deepEqual(stageWearableConfigs[5].sceneSuppressed, ["tablet"]);
});
