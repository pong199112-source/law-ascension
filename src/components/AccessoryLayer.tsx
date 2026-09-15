import type { CSSProperties, ReactNode } from "react";
import type { EquipmentId, EquipmentState } from "../data/equipment";
import { equipmentItems } from "../data/equipment";
import { accessoryConfigForStage } from "../data/accessories";
import { characterStages } from "../domain/progression";

const drawings: Record<EquipmentId, ReactNode> = {
  glasses: (
    <>
      <ellipse cx="28" cy="50" rx="18" ry="15" fill="url(#lens)" />
      <ellipse cx="72" cy="50" rx="18" ry="15" fill="url(#lens)" />
      <path d="M9 47q18-8 38 1m6 0q20-9 38-1M46 49q4-5 8 0" />
      <path d="m19 43 7-3m35 3 7-3" stroke="#fff9" strokeWidth="2" />
    </>
  ),
  pen: (
    <>
      <path d="m47 6 14 14-39 69-13 5 4-14z" fill="url(#blue)" />
      <path d="m47 6 14 14-6 10-14-14z" fill="#f2c678" />
      <path d="m9 94 13-5-9-9z" fill="#554448" />
      <path d="m23 76 28-49" stroke="#fff8" strokeWidth="2" />
    </>
  ),
  bag: (
    <>
      <path d="M28 34V24q22-21 44 0v10" fill="none" />
      <rect x="13" y="32" width="74" height="59" rx="13" fill="url(#rose)" />
      <path d="M15 49q35 25 70 0" fill="none" />
      <rect x="43" y="51" width="14" height="15" rx="3" fill="#edc879" />
      <path d="M21 39h58" stroke="#fff5" strokeWidth="2" />
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
  tablet: (
    <>
      <rect x="15" y="4" width="70" height="92" rx="9" fill="url(#device)" />
      <rect x="21" y="11" width="58" height="72" rx="4" fill="#dceae7" />
      <path d="m29 31 21-11m-21 28 41-23" stroke="#fff9" strokeWidth="3" />
      <circle cx="50" cy="89" r="2.5" fill="#fff1d6" stroke="none" />
    </>
  ),
  "id-card": (
    <>
      <path d="M31 3 50 31 69 3" fill="none" stroke="#c9859a" strokeWidth="7" />
      <rect x="15" y="28" width="70" height="66" rx="9" fill="url(#paper)" />
      <circle cx="38" cy="52" r="10" fill="#dda0a8" />
      <path d="M25 78q13-21 26 0m11-27h15m-15 12h15" />
      <path d="M22 35h56" stroke="#fff" strokeWidth="2" />
    </>
  ),
};

export function AccessoryLayer({ equipped, stageFile }: { equipped: EquipmentState; stageFile: string }) {
  const stageIndex = Math.max(0, characterStages.findIndex((stage) => stage.file === stageFile));
  const config = accessoryConfigForStage(stageIndex);
  const suppressed = equipmentItems
    .filter((item) => equipped[item.slot] === item.id && config.anchors[item.id].suppressed)
    .map((item) => item.id);
  return (
    <div className="accessory-layer" data-stage={stageIndex + 1} data-suppressed-equipment={suppressed.join(",")} aria-hidden="true">
      {equipmentItems.map((item) => {
        if (equipped[item.slot] !== item.id) return null;
        const anchor = config.anchors[item.id];
        if (anchor.suppressed) return null;
        const style = {
          "--accessory-left": `${anchor.left}%`, "--accessory-top": `${anchor.top}%`,
          "--accessory-width": `${anchor.width}%`, "--accessory-rotation": `${anchor.rotation}deg`,
        } as CSSProperties;
        return (
          <svg key={item.id} className={`accessory accessory-${item.id}`} data-equipment-overlay={item.id} data-stage-anchor={`${stageIndex + 1}-${item.id}`} style={style} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d8c9e9" stopOpacity=".46" /><stop offset="1" stopColor="#a98db8" stopOpacity=".2" /></linearGradient>
              <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9fc9e5" /><stop offset="1" stopColor="#688eae" /></linearGradient>
              <linearGradient id="rose" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d5a096" /><stop offset="1" stopColor="#9e6c69" /></linearGradient>
              <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f7dc9b" /><stop offset="1" stopColor="#c6944f" /></linearGradient>
              <linearGradient id="device" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#819d9c" /><stop offset="1" stopColor="#506c70" /></linearGradient>
              <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf1" /><stop offset="1" stopColor="#f1dfc8" /></linearGradient>
            </defs>
            <g fill="none" stroke="#4e3c42" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">{drawings[item.id]}</g>
          </svg>
        );
      })}
    </div>
  );
}
