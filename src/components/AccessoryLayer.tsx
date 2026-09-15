import type { CSSProperties, ReactNode } from "react";
import type { EquipmentState } from "../data/equipment";
import {
  wearableConfigForStage,
  wearableIds,
  type WearableId,
} from "../data/accessories";
import { characterStages } from "../domain/progression";

const drawings: Record<WearableId, ReactNode> = {
  glasses: (
    <>
      <ellipse cx="28" cy="50" rx="18" ry="15" fill="url(#lens)" />
      <ellipse cx="72" cy="50" rx="18" ry="15" fill="url(#lens)" />
      <path d="M9 47q18-8 38 1m6 0q20-9 38-1M46 49q4-5 8 0" />
      <path d="m19 43 7-3m35 3 7-3" stroke="#fff9" strokeWidth="2" />
    </>
  ),
  watch: (
    <>
      <path d="M39 3h22l6 31-6 63H39l-6-63z" fill="#bc8878" />
      <circle cx="50" cy="49" r="25" fill="url(#gold)" />
      <circle cx="50" cy="49" r="18" fill="#fff7dc" />
      <path d="M50 36v14l10 6" />
      <path d="M42 30h16" stroke="#fff7" strokeWidth="2" />
    </>
  ),
  "id-card": (
    <>
      <path d="M31 3 50 31 69 3" fill="none" stroke="#c9859a" strokeWidth="7" />
      <rect x="15" y="28" width="70" height="66" rx="9" fill="url(#paper)" />
      <circle cx="38" cy="52" r="10" fill="#dda0a8" />
      <path d="M25 78q13-21 26 0m11-27h15m-15 12h15" />
    </>
  ),
};

export function AccessoryLayer({ equipped, stageFile }: { equipped: EquipmentState; stageFile: string }) {
  const stageIndex = Math.max(0, characterStages.findIndex((stage) => stage.file === stageFile));
  const config = wearableConfigForStage(stageIndex);
  const suppressed = wearableIds.filter((id) => equipped[id === "glasses" ? "eyes" : id === "watch" ? "wrist" : "badge"] === id && config.anchors[id].suppressed);
  return (
    <div className="accessory-layer" data-stage={stageIndex + 1} data-suppressed-wearables={suppressed.join(",")} aria-hidden="true">
      {wearableIds.map((id) => {
        const slot = id === "glasses" ? "eyes" : id === "watch" ? "wrist" : "badge";
        if (equipped[slot] !== id) return null;
        const anchor = config.anchors[id];
        if (anchor.suppressed) return null;
        const style = {
          "--accessory-left": `${anchor.left}%`, "--accessory-top": `${anchor.top}%`,
          "--accessory-width": `${anchor.width}%`, "--accessory-rotation": `${anchor.rotation}deg`,
        } as CSSProperties;
        return (
          <svg key={id} className={`accessory accessory-${id}`} data-equipment-overlay={id} data-stage-anchor={`${stageIndex + 1}-${id}`} style={style} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d8c9e9" stopOpacity=".46" /><stop offset="1" stopColor="#a98db8" stopOpacity=".2" /></linearGradient>
              <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f7dc9b" /><stop offset="1" stopColor="#c6944f" /></linearGradient>
              <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf1" /><stop offset="1" stopColor="#f1dfc8" /></linearGradient>
            </defs>
            <g fill="none" stroke="#4e3c42" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">{drawings[id]}</g>
          </svg>
        );
      })}
    </div>
  );
}
