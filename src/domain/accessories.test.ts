import { test } from "node:test";
import assert from "node:assert/strict";
import { equipmentItems } from "../data/equipment.ts";
import { stageAccessoryConfigs } from "../data/accessories.ts";

test("all six poses define safe anchors for every equipment item", () => {
  assert.equal(stageAccessoryConfigs.length, 6);
  for (const [index, config] of stageAccessoryConfigs.entries()) {
    assert.equal(config.stage, index + 1);
    assert.deepEqual(Object.keys(config.anchors).sort(), equipmentItems.map((item) => item.id).sort());
    for (const anchor of Object.values(config.anchors)) {
      assert.ok(anchor.left >= 20 && anchor.left <= 85);
      assert.ok(anchor.top >= 15 && anchor.top <= 60);
      assert.ok(anchor.width >= 4 && anchor.width <= 21);
      assert.ok(anchor.rotation >= -30 && anchor.rotation <= 15);
    }
  }
});

test("duplicate props are suppressed without removing their equipment configuration", () => {
  assert.equal(stageAccessoryConfigs[0].anchors.bag.suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[1].anchors.bag.suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[1].anchors.tablet.suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[2].anchors.pen.suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[2].anchors.bag.suppressed, "pose");
  assert.equal(stageAccessoryConfigs[3].anchors.watch.suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[4].anchors.tablet.suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[5].anchors["id-card"].suppressed, "base-art");
  assert.equal(stageAccessoryConfigs[5].anchors.bag.suppressed, "pose");
});
