import type { EquipmentId } from "./equipment";

export type AccessoryAnchor = {
  left: number;
  top: number;
  width: number;
  rotation: number;
  suppressed?: "base-art" | "pose";
};

export type StageAccessoryConfig = {
  stage: number;
  label: string;
  anchors: Record<EquipmentId, AccessoryAnchor>;
};

// Coordinates use the original 512×768 transparent character canvas.
// Suppression keeps the equipment state active while avoiding a duplicate item
// already painted into a supplied character or an implausible floating prop.
export const stageAccessoryConfigs: StageAccessoryConfig[] = [
  {
    stage: 1,
    label: "Lv.1–9 casual",
    anchors: {
      glasses: { left: 50.2, top: 19.4, width: 20.5, rotation: -1 },
      pen: { left: 41.5, top: 42.8, width: 4.8, rotation: -7 },
      bag: { left: 74, top: 50, width: 13, rotation: -4, suppressed: "base-art" },
      watch: { left: 68.5, top: 34.2, width: 5.2, rotation: -8 },
      tablet: { left: 42.5, top: 43.2, width: 15.5, rotation: -5, suppressed: "base-art" },
      "id-card": { left: 55.5, top: 34.5, width: 7.2, rotation: 3 },
    },
  },
  {
    stage: 2,
    label: "Lv.10–19 suit",
    anchors: {
      glasses: { left: 48.8, top: 21.1, width: 19.5, rotation: 0 },
      pen: { left: 58.5, top: 43.2, width: 4.4, rotation: 8 },
      bag: { left: 74, top: 54, width: 13, rotation: 2, suppressed: "base-art" },
      watch: { left: 64.2, top: 49.3, width: 5, rotation: 7 },
      tablet: { left: 61.3, top: 45.7, width: 14.5, rotation: 8, suppressed: "base-art" },
      "id-card": { left: 45.7, top: 36.5, width: 7, rotation: -2 },
    },
  },
  {
    stage: 3,
    label: "Lv.20–29 khaki",
    anchors: {
      glasses: { left: 49.2, top: 21.6, width: 19.2, rotation: 0 },
      pen: { left: 75, top: 31.5, width: 4.5, rotation: -27, suppressed: "base-art" },
      bag: { left: 73.5, top: 53.5, width: 14, rotation: 4, suppressed: "pose" },
      watch: { left: 72.6, top: 36.9, width: 4.8, rotation: -9 },
      tablet: { left: 37.5, top: 43.8, width: 15, rotation: -9, suppressed: "base-art" },
      "id-card": { left: 53, top: 36.5, width: 7, rotation: 0, suppressed: "base-art" },
    },
  },
  {
    stage: 4,
    label: "Lv.30–39 khaki plus",
    anchors: {
      glasses: { left: 48.7, top: 21.2, width: 19, rotation: 0 },
      pen: { left: 69.4, top: 31.4, width: 4.4, rotation: -17 },
      bag: { left: 72, top: 53, width: 13, rotation: 2, suppressed: "base-art" },
      watch: { left: 68.5, top: 33.8, width: 4.8, rotation: -4, suppressed: "base-art" },
      tablet: { left: 36, top: 44.5, width: 15, rotation: -8, suppressed: "base-art" },
      "id-card": { left: 52, top: 36.4, width: 7, rotation: 0, suppressed: "base-art" },
    },
  },
  {
    stage: 5,
    label: "Lv.40–49 khaki advanced",
    anchors: {
      glasses: { left: 48.8, top: 20.8, width: 19, rotation: 0 },
      pen: { left: 36.2, top: 39.2, width: 4.2, rotation: 2 },
      bag: { left: 74, top: 52, width: 13, rotation: 2, suppressed: "base-art" },
      watch: { left: 69.4, top: 31.8, width: 4.8, rotation: -3, suppressed: "base-art" },
      tablet: { left: 34, top: 42.5, width: 15, rotation: -8, suppressed: "base-art" },
      "id-card": { left: 52, top: 35.2, width: 7, rotation: 0, suppressed: "base-art" },
    },
  },
  {
    stage: 6,
    label: "Lv.50+ white uniform",
    anchors: {
      glasses: { left: 43.4, top: 20.4, width: 18.8, rotation: 0 },
      pen: { left: 34.5, top: 40.2, width: 4.2, rotation: -6 },
      bag: { left: 29, top: 56, width: 13, rotation: -5, suppressed: "pose" },
      watch: { left: 78.6, top: 29.4, width: 4.7, rotation: 14 },
      tablet: { left: 31.5, top: 42.3, width: 15, rotation: -8, suppressed: "base-art" },
      "id-card": { left: 48, top: 35, width: 7, rotation: 0, suppressed: "base-art" },
    },
  },
];

export function accessoryConfigForStage(stageIndex: number) {
  const config = stageAccessoryConfigs[stageIndex];
  if (!config) throw new RangeError("Unknown character stage");
  return config;
}
