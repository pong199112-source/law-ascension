import type { CSSProperties, ReactNode } from "react";
import type { EquipmentId, EquipmentState } from "../data/equipment";
import { equipmentItems } from "../data/equipment";
import { characterStages } from "../domain/progression";

type Anchor = { left: number; top: number; width: number; rotation: number };
type AnchorSet = Record<EquipmentId, Anchor>;

// Each supplied character has a different pose. These coordinates are percentages
// of the transparent character canvas, so layers stay attached at every render size.
const accessoryAnchors: AnchorSet[] = [
  {
    glasses: { left: 50, top: 19, width: 25, rotation: -2 },
    pen: { left: 43, top: 42, width: 8, rotation: -18 },
    bag: { left: 72, top: 49, width: 29, rotation: -5 },
    watch: { left: 68, top: 34, width: 10, rotation: -7 },
    tablet: { left: 39, top: 43, width: 27, rotation: -6 },
    "id-card": { left: 53, top: 35, width: 16, rotation: 2 },
  },
  {
    glasses: { left: 49, top: 21, width: 25, rotation: -1 },
    pen: { left: 36, top: 34, width: 8, rotation: 18 },
    bag: { left: 73, top: 54, width: 27, rotation: 2 },
    watch: { left: 65, top: 50, width: 9, rotation: 6 },
    tablet: { left: 59, top: 47, width: 25, rotation: 8 },
    "id-card": { left: 50, top: 38, width: 15, rotation: 0 },
  },
  {
    glasses: { left: 49, top: 21, width: 24, rotation: -1 },
    pen: { left: 73, top: 31, width: 8, rotation: -26 },
    bag: { left: 73, top: 52, width: 26, rotation: 3 },
    watch: { left: 71, top: 35, width: 9, rotation: -8 },
    tablet: { left: 37, top: 45, width: 27, rotation: -9 },
    "id-card": { left: 51, top: 37, width: 15, rotation: 0 },
  },
  {
    glasses: { left: 49, top: 21, width: 24, rotation: -1 },
    pen: { left: 68, top: 31, width: 8, rotation: -18 },
    bag: { left: 71, top: 53, width: 25, rotation: 2 },
    watch: { left: 68, top: 34, width: 9, rotation: -4 },
    tablet: { left: 36, top: 45, width: 27, rotation: -8 },
    "id-card": { left: 51, top: 37, width: 15, rotation: 0 },
  },
  {
    glasses: { left: 49, top: 20, width: 24, rotation: -1 },
    pen: { left: 68, top: 29, width: 8, rotation: -18 },
    bag: { left: 73, top: 52, width: 25, rotation: 2 },
    watch: { left: 68, top: 32, width: 9, rotation: -4 },
    tablet: { left: 34, top: 43, width: 27, rotation: -8 },
    "id-card": { left: 51, top: 35, width: 15, rotation: 0 },
  },
  {
    glasses: { left: 43, top: 20, width: 24, rotation: -1 },
    pen: { left: 74, top: 26, width: 8, rotation: -26 },
    bag: { left: 73, top: 53, width: 25, rotation: 3 },
    watch: { left: 76, top: 29, width: 9, rotation: 12 },
    tablet: { left: 31, top: 43, width: 27, rotation: -8 },
    "id-card": { left: 47, top: 35, width: 15, rotation: 0 },
  },
];

const drawings: Record<EquipmentId, ReactNode> = {
  glasses: (
    <>
      <circle cx="28" cy="30" r="18" fill="#a98db832" />
      <circle cx="72" cy="30" r="18" fill="#a98db832" />
      <path d="M10 25q18-9 36 1m8 0q18-10 36-1M46 27q4-5 8 0" />
    </>
  ),
  pen: (
    <>
      <path d="m47 7 15 15-40 67L8 94l4-15z" fill="#82afd0" />
      <path d="m47 7 15 15-6 10-15-15z" fill="#f3c77e" />
      <path d="m8 94 14-5-10-10z" fill="#5f514e" />
    </>
  ),
  bag: (
    <>
      <path d="M27 32V22q23-22 46 0v10" fill="none" />
      <rect x="12" y="30" width="76" height="62" rx="13" fill="#b98178" />
      <path d="M14 48q36 27 72 0" fill="none" />
      <rect x="43" y="50" width="14" height="16" rx="3" fill="#f1ce79" />
    </>
  ),
  watch: (
    <>
      <path d="M38 2h24l7 31-7 65H38l-7-65z" fill="#c58b79" />
      <circle cx="50" cy="49" r="27" fill="#efc96f" />
      <circle cx="50" cy="49" r="20" fill="#fff8dd" />
      <path d="M50 35v15l10 7" />
    </>
  ),
  tablet: (
    <>
      <rect x="12" y="3" width="76" height="94" rx="10" fill="#728d8b" />
      <rect x="19" y="12" width="62" height="72" rx="5" fill="#e4f0e9" />
      <path d="m27 32 23-12m-23 28 45-24" stroke="#fff" />
      <circle cx="50" cy="90" r="3" fill="#fff4dc" stroke="none" />
    </>
  ),
  "id-card": (
    <>
      <path d="M28 2 50 32 72 2" fill="none" stroke="#d492a4" strokeWidth="9" />
      <rect x="12" y="27" width="76" height="69" rx="10" fill="#fff7e7" />
      <circle cx="38" cy="51" r="11" fill="#dfa5ad" />
      <path d="M24 78q14-22 28 0m10-28h17m-17 13h17" />
    </>
  ),
};

export function AccessoryLayer({
  equipped,
  stageFile,
}: {
  equipped: EquipmentState;
  stageFile: string;
}) {
  const stageIndex = Math.max(
    0,
    characterStages.findIndex((stage) => stage.file === stageFile),
  );
  const anchors = accessoryAnchors[stageIndex];
  return (
    <div className="accessory-layer" data-stage={stageIndex + 1} aria-hidden="true">
      {equipmentItems.map((item) => {
        if (equipped[item.slot] !== item.id) return null;
        const anchor = anchors[item.id];
        const style = {
          "--accessory-left": `${anchor.left}%`,
          "--accessory-top": `${anchor.top}%`,
          "--accessory-width": `${anchor.width}%`,
          "--accessory-rotation": `${anchor.rotation}deg`,
        } as CSSProperties;
        return (
          <svg
            key={item.id}
            className={`accessory accessory-${item.id}`}
            data-equipment-overlay={item.id}
            style={style}
            viewBox="0 0 100 100"
          >
            <g
              fill="none"
              stroke="#654f4b"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {drawings[item.id]}
            </g>
          </svg>
        );
      })}
    </div>
  );
}
