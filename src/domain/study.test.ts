import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addXp,
  calculateAccuracy,
  earnsDailyBonus,
  manualXpForMinutes,
  timerXpForMinutes,
} from "./study.ts";

test("30 and 60 minute checkpoints award once without a partial remainder", () => {
  assert.deepEqual(timerXpForMinutes("reading", 30), {
    checkpoints: 1,
    checkpointXp: 20,
    partialXp: 0,
    totalXp: 20,
    remainingMinutes: 0,
  });
  assert.equal(timerXpForMinutes("reading", 60).totalXp, 40);
  assert.equal(timerXpForMinutes("questions", 30).totalXp, 25);
});

test("47 minutes preserve real time and combine checkpoint with reduced partial XP", () => {
  const result = timerXpForMinutes("reading", 47);
  assert.equal(result.checkpointXp, 20);
  assert.equal(result.partialXp, 9);
  assert.equal(result.totalXp, 29);
  assert.equal(result.remainingMinutes, 17);
});

test("manual study awards 85 percent of timer XP", () => {
  assert.equal(manualXpForMinutes("reading", 30), 17);
  assert.equal(manualXpForMinutes("questions", 30), 21);
});

test("XP applies to any selected progression track", () => {
  assert.deepEqual(addXp(17, 990, 25), { level: 18, xp: 15 });
  assert.deepEqual(addXp(14, 680, 25), { level: 14, xp: 705 });
});

test("optional question results validate and calculate rounded accuracy", () => {
  assert.equal(calculateAccuracy(), undefined);
  assert.equal(calculateAccuracy(28, 22), 79);
  assert.throws(() => calculateAccuracy(10, 11), RangeError);
  assert.throws(() => calculateAccuracy(0, 0), RangeError);
});

test("daily completion bonus becomes available only once", () => {
  const complete = { reading: 240, questions: 30, summary: 30, lecture: 30 };
  assert.equal(earnsDailyBonus(complete, false), true);
  assert.equal(earnsDailyBonus(complete, true), false);
  assert.equal(earnsDailyBonus({ ...complete, lecture: 29 }, false), false);
});
