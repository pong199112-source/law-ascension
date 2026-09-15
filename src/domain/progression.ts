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
