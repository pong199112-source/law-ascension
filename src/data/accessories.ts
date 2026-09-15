export type WearableId = "glasses" | "watch" | "id-card";
export type SceneEquipmentId = "bag" | "tablet" | "pen";
export type SuppressionReason = "base-art" | "pose";

export type WearableAnchor = {
  left: number;
  top: number;
  width: number;
  rotation: number;
  suppressed?: SuppressionReason;
};

export const wearableIds: WearableId[] = ["glasses", "watch", "id-card"];
export const sceneEquipmentIds: SceneEquipmentId[] = ["bag", "tablet", "pen"];

// Only natural wearables stay on the 512×768 character canvas. Scene props use
// one stable responsive layout instead of pose-by-pose body anchors.
export const stageWearableConfigs: Array<{
  stage: number;
  label: string;
  anchors: Record<WearableId, WearableAnchor>;
  sceneSuppressed: SceneEquipmentId[];
}> = [
  {
    stage: 1,
    label: "Lv.1–9 casual",
    anchors: {
      glasses: { left: 50.2, top: 19.4, width: 20.5, rotation: -1 },
      watch: { left: 68.5, top: 34.2, width: 5.2, rotation: -8 },
      "id-card": { left: 55.5, top: 34.5, width: 6.4, rotation: 3 },
    },
    sceneSuppressed: ["bag"],
  },
  {
    stage: 2,
    label: "Lv.10–19 suit",
    anchors: {
      glasses: { left: 48.8, top: 21.1, width: 19.5, rotation: 0 },
      watch: { left: 64.2, top: 49.3, width: 5, rotation: 7 },
      "id-card": { left: 45.7, top: 36.5, width: 6.2, rotation: -2 },
    },
    sceneSuppressed: ["bag"],
  },
  {
    stage: 3,
    label: "Lv.20–29 khaki",
    anchors: {
      glasses: { left: 49.2, top: 21.6, width: 19.2, rotation: 0 },
      watch: { left: 72.6, top: 36.9, width: 4.8, rotation: -9 },
      "id-card": { left: 53, top: 36.5, width: 6, rotation: 0, suppressed: "base-art" },
    },
    sceneSuppressed: ["tablet", "pen"],
  },
  {
    stage: 4,
    label: "Lv.30–39 khaki plus",
    anchors: {
      glasses: { left: 48.7, top: 21.2, width: 19, rotation: 0 },
      watch: { left: 68.5, top: 33.8, width: 4.8, rotation: -4, suppressed: "base-art" },
      "id-card": { left: 52, top: 36.4, width: 6, rotation: 0, suppressed: "base-art" },
    },
    sceneSuppressed: ["bag"],
  },
  {
    stage: 5,
    label: "Lv.40–49 khaki advanced",
    anchors: {
      glasses: { left: 48.8, top: 20.8, width: 19, rotation: 0 },
      watch: { left: 69.4, top: 31.8, width: 4.8, rotation: -3, suppressed: "base-art" },
      "id-card": { left: 52, top: 35.2, width: 6, rotation: 0, suppressed: "base-art" },
    },
    sceneSuppressed: ["bag"],
  },
  {
    stage: 6,
    label: "Lv.50+ white uniform",
    anchors: {
      glasses: { left: 43.4, top: 20.4, width: 18.8, rotation: 0 },
      watch: { left: 78.6, top: 29.4, width: 4.7, rotation: 14 },
      "id-card": { left: 48, top: 35, width: 6, rotation: 0, suppressed: "base-art" },
    },
    sceneSuppressed: ["tablet"],
  },
];

export const sceneEquipmentLayout: Record<SceneEquipmentId, {
  left: number;
  top: number;
  width: number;
  rotation: number;
}> = {
  tablet: { left: 12, top: 70, width: 18, rotation: -5 },
  pen: { left: 83, top: 72, width: 13, rotation: 2 },
  bag: { left: 86, top: 83, width: 20, rotation: 4 },
};

export function wearableConfigForStage(stageIndex: number) {
  const config = stageWearableConfigs[stageIndex];
  if (!config) throw new RangeError("Unknown character stage");
  return config;
}
