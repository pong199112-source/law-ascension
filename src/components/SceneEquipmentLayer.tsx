import type { CSSProperties, ReactNode } from "react";
import type { EquipmentState } from "../data/equipment";
import {
  sceneEquipmentIds,
  sceneEquipmentLayout,
  wearableConfigForStage,
  type SceneEquipmentId,
} from "../data/accessories";
import { characterStages } from "../domain/progression";

const sceneDrawings: Record<SceneEquipmentId, ReactNode> = {
  tablet: (
    <>
      <path d="m37 78-8 14h42l-8-14" fill="#b99a7f" />
      <rect x="17" y="9" width="66" height="72" rx="8" fill="url(#screenFrame)" />
      <rect x="23" y="15" width="54" height="57" rx="4" fill="#dfece7" />
      <path d="m31 32 18-10m-18 25 37-21" stroke="#fff9" strokeWidth="3" />
      <circle cx="50" cy="76" r="2" fill="#f9e7c8" stroke="none" />
    </>
  ),
  pen: (
    <>
      <path d="m28 8 8 52m20-49-8 49m27-44L58 62" />
      <path d="m26 8 3-6 5 5m21 4 3-6 4 6m13 5 5-4-1 7" fill="#efbf76" />
      <path d="M18 53h54l-7 42H25z" fill="url(#cup)" />
      <path d="M26 65h38" stroke="#fff7" strokeWidth="2" />
    </>
  ),
  bag: (
    <>
      <path d="M30 34V24q20-20 40 0v10" />
      <rect x="12" y="32" width="76" height="60" rx="13" fill="url(#bagLeather)" />
      <path d="M14 50q36 24 72 0" />
      <rect x="43" y="52" width="14" height="15" rx="3" fill="#ecc673" />
      <path d="M22 39h56" stroke="#fff5" strokeWidth="2" />
    </>
  ),
};

const slots: Record<SceneEquipmentId, keyof EquipmentState> = {
  bag: "bag",
  tablet: "device",
  pen: "writing",
};

export function SceneEquipmentLayer({ equipped, stageFile }: { equipped: EquipmentState; stageFile: string }) {
  const stageIndex = Math.max(0, characterStages.findIndex((stage) => stage.file === stageFile));
  const config = wearableConfigForStage(stageIndex);
  const suppressed = sceneEquipmentIds.filter((id) => equipped[slots[id]] === id && config.sceneSuppressed.includes(id));
  return (
    <div className="scene-equipment-layer" data-scene-stage={stageIndex + 1} data-suppressed-scene-equipment={suppressed.join(",")} aria-hidden="true">
      {sceneEquipmentIds.map((id) => {
        if (equipped[slots[id]] !== id || config.sceneSuppressed.includes(id)) return null;
        const layout = sceneEquipmentLayout[id];
        const style = {
          "--scene-prop-left": `${layout.left}%`, "--scene-prop-top": `${layout.top}%`,
          "--scene-prop-width": `${layout.width}%`, "--scene-prop-rotation": `${layout.rotation}deg`,
        } as CSSProperties;
        return (
          <svg key={id} className={`scene-prop scene-prop-${id}`} data-scene-equipment={id} style={style} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="screenFrame" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#819e9c" /><stop offset="1" stopColor="#516e71" /></linearGradient>
              <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e9bdad" /><stop offset="1" stopColor="#bb827b" /></linearGradient>
              <linearGradient id="bagLeather" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d3a093" /><stop offset="1" stopColor="#936765" /></linearGradient>
            </defs>
            <g fill="none" stroke="#5a4547" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">{sceneDrawings[id]}</g>
          </svg>
        );
      })}
    </div>
  );
}
