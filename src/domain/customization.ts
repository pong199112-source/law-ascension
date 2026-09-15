import { equipmentItems } from "../data/equipment.ts";
import type { EquipmentState } from "../data/equipment.ts";
import { characterForLevel, characterStages } from "./progression.ts";

// null preserves automatic progression. A manual choice remains pinned after level-up.
export function activeCharacter(level: number, manualFile: string | null) {
  const automatic = characterForLevel(level);
  if (manualFile === null) return automatic;
  const selected = characterStages.find((stage) => stage.file === manualFile);
  if (!selected || selected.minLevel > level)
    throw new RangeError("This outfit is not unlocked");
  return selected;
}

export function toggleEquipment(
  current: EquipmentState,
  itemId: string,
): EquipmentState {
  const item = equipmentItems.find((entry) => entry.id === itemId);
  if (!item) throw new RangeError("Unknown equipment");
  const next = { ...current };
  if (next[item.slot] === item.id) delete next[item.slot];
  else next[item.slot] = item.id;
  return next;
}
