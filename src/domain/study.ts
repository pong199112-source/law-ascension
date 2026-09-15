import {
  activityById,
  studyActivities,
  type ActivityId,
} from "../data/study.ts";

export const CHECKPOINT_MINUTES = 30;
export const MANUAL_XP_RATE = 0.85;
export const PARTIAL_XP_EFFICIENCY = 0.75;
export const DAILY_COMPLETION_BONUS_XP = 30;

export function addXp(level: number, xp: number, amount: number) {
  if (!Number.isSafeInteger(level) || level < 1)
    throw new RangeError("Level must be a positive integer");
  if (!Number.isSafeInteger(xp) || xp < 0 || xp >= 1000)
    throw new RangeError("XP must be a whole number from 0 to 999");
  if (!Number.isSafeInteger(amount) || amount < 0)
    throw new RangeError("XP amount must be a non-negative integer");
  const total = xp + amount;
  return { level: level + Math.floor(total / 1000), xp: total % 1000 };
}

export function timerXpForMinutes(activityId: ActivityId, minutes: number) {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 720)
    throw new RangeError("Study time must be 0-720 whole minutes");
  const { checkpointXp } = activityById(activityId);
  const checkpoints = Math.floor(minutes / CHECKPOINT_MINUTES);
  const remainingMinutes = minutes % CHECKPOINT_MINUTES;
  const partialXp = Math.round(
    (remainingMinutes / CHECKPOINT_MINUTES) *
      checkpointXp *
      PARTIAL_XP_EFFICIENCY,
  );
  return {
    checkpoints,
    checkpointXp: checkpoints * checkpointXp,
    partialXp,
    totalXp: checkpoints * checkpointXp + partialXp,
    remainingMinutes,
  };
}

export function manualXpForMinutes(activityId: ActivityId, minutes: number) {
  return Math.round(timerXpForMinutes(activityId, minutes).totalXp * MANUAL_XP_RATE);
}

export function calculateAccuracy(attempted?: number, correct?: number) {
  if (attempted === undefined && correct === undefined) return undefined;
  if (
    !Number.isInteger(attempted) ||
    attempted === undefined ||
    attempted < 1 ||
    !Number.isInteger(correct) ||
    correct === undefined ||
    correct < 0 ||
    correct > attempted
  )
    throw new RangeError("Question results are invalid");
  return Math.round((correct / attempted) * 100);
}

export function earnsDailyBonus(
  progress: Record<ActivityId, number>,
  alreadyAwarded: boolean,
) {
  return (
    !alreadyAwarded &&
    studyActivities.every(
      (activity) => progress[activity.id] >= activity.targetMinutes,
    )
  );
}
