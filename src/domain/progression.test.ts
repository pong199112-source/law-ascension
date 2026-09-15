import { test } from "node:test";
import assert from "node:assert/strict";
import { characterForLevel, addReadingXp } from "./progression.ts";

test("all stage boundaries and uncapped final stage use the approved manifest", () => {
  for (const [level, name] of [
    [1, "casual"],
    [9, "casual"],
    [10, "suit"],
    [17, "suit"],
    [19, "suit"],
    [20, "khaki"],
    [29, "khaki"],
    [30, "khaki-plus"],
    [39, "khaki-plus"],
    [40, "khaki-advanced"],
    [49, "khaki-advanced"],
    [50, "white-uniform"],
    [999, "white-uniform"],
  ] as const) {
    assert.ok(characterForLevel(level).file.endsWith(`${name}.webp`));
  }
  for (const level of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => characterForLevel(level), RangeError);
  }
});

test("reading XP can cross several levels and keeps remaining XP", () => {
  assert.deepEqual(addReadingXp(17, 650, 240), { level: 20, xp: 50 });
  assert.ok(
    characterForLevel(addReadingXp(17, 650, 240).level).file.endsWith(
      "-khaki.webp",
    ),
  );
  for (const minutes of [0, -1, 1.5, 721, NaN]) {
    assert.throws(() => addReadingXp(17, 650, minutes), RangeError);
  }
});
