export const equipmentItems = [
  {
    id: "glasses",
    slot: "eyes",
    name: "แว่น",
    slotName: "แว่นตา",
    note: "มองทุกบทให้ชัดขึ้น",
    color: "#aa91c5",
  },
  {
    id: "pen",
    slot: "writing",
    name: "ปากกา",
    slotName: "เครื่องเขียน",
    note: "จดจำทุกความตั้งใจ",
    color: "#80a5c5",
  },
  {
    id: "bag",
    slot: "bag",
    name: "กระเป๋า",
    slotName: "กระเป๋า",
    note: "พกความฝันไปทุกที่",
    color: "#bf9780",
  },
  {
    id: "watch",
    slot: "wrist",
    name: "นาฬิกา",
    slotName: "ข้อมือ",
    note: "ทุกนาทีมีความหมาย",
    color: "#c7a35d",
  },
  {
    id: "tablet",
    slot: "device",
    name: "Tablet",
    slotName: "อุปกรณ์",
    note: "ห้องสมุดเล็ก ๆ ของเรา",
    color: "#79a982",
  },
  {
    id: "id-card",
    slot: "badge",
    name: "ID card",
    slotName: "บัตรประจำตัว",
    note: "อีกก้าวบนเส้นทางกฎหมาย",
    color: "#d5867c",
  },
] as const;

export type EquipmentId = (typeof equipmentItems)[number]["id"];
export type EquipmentSlot = (typeof equipmentItems)[number]["slot"];
export type EquipmentState = Partial<Record<EquipmentSlot, EquipmentId>>;
