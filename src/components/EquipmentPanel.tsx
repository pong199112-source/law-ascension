import { equipmentItems } from "../data/equipment";
import type { EquipmentId, EquipmentState } from "../data/equipment";
import { GameIcon } from "./GameIcon";

type Props = { equipped: EquipmentState; onToggle: (id: EquipmentId) => void };
export function EquipmentPanel({ equipped, onToggle }: Props) {
  return (
    <section className="panel items-panel" id="items">
      <div className="panel-heading">
        <h2>
          <GameIcon name="bag" /> กระเป๋าไอเทม
        </h2>
        <span className="tiny-label">
          สวมอยู่ {Object.keys(equipped).length}/6
        </span>
      </div>
      <p className="panel-subtitle">ไอเทมที่ปลดล็อกแล้ว · กดเพื่อสวมหรือถอด</p>
      <div className="items">
        {equipmentItems.map((item) => {
          const active = equipped[item.slot] === item.id;
          return (
            <button
              key={item.id}
              className={`equipment-item ${active ? "equipped" : ""}`}
              onClick={() => onToggle(item.id)}
              aria-label={`${active ? "ถอด" : "สวม"}${item.name}`}
              aria-pressed={active}
            >
              <span className="equipment-check">{active ? "✓" : "+"}</span>
              <GameIcon name={item.id} />
              <strong>{item.name}</strong>
              <small>{active ? "สวมอยู่" : item.slotName}</small>
            </button>
          );
        })}
      </div>
      <p className="item-note">จัดชุดพร้อมอ่าน ในแบบของคุณ</p>
    </section>
  );
}

export function EquippedSlots({ equipped, onToggle }: Props) {
  return (
    <div className="loadout">
      <span className="loadout-label">
        อุปกรณ์ที่สวม <b>{Object.keys(equipped).length}/6</b>
      </span>
      <div className="equipment-slots">
        {equipmentItems.map((item) => {
          const active = equipped[item.slot] === item.id;
          return (
            <button
              key={item.id}
              className={`equipment-slot ${active ? "equipped" : ""}`}
              aria-label={`${active ? "ถอด" : "สวม"}${item.name}`}
              aria-pressed={active}
              title={`${item.slotName}: ${active ? item.name : "ว่าง"}`}
              onClick={() => onToggle(item.id)}
            >
              <GameIcon name={item.id} />
              <span>{active ? "✓" : "+"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
