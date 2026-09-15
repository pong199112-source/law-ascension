import manifest from "../../public/assets/characters/manifest.json" with { type: "json" };

export const characterStages = manifest.stages;

export function characterForLevel(level: number) {
  if (!Number.isSafeInteger(level) || level < 1) {
    throw new RangeError("Level must be a positive integer");
  }
  const stage = characterStages.find(
    (entry) =>
      level >= entry.minLevel &&
      (entry.maxLevel === null || level <= entry.maxLevel),
  );
  if (!stage) throw new RangeError("No character stage for this level");
  return stage;
}

// Prototype balance only: 10 XP per minute, 1,000 XP per level.
export function addReadingXp(level: number, xp: number, minutes: number) {
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 720) {
    throw new RangeError(
      "Reading time must be between 1 and 720 whole minutes",
    );
  }
  const total = xp + minutes * 10;
  return { level: level + Math.floor(total / 1000), xp: total % 1000 };
}
