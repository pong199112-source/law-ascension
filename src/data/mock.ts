export const mockPlayer = {
  name: "นักกฎหมายฝึกหัด",
  level: 17,
  xp: 650,
  totalMinutes: 86 * 60 + 35,
  streak: 7,
  examDate: "2026-10-27T00:00:00+07:00",
};

export const mockSubjects = [
  { id: "civil", name: "แพ่ง", level: 12, xp: 850, color: "#79a982" },
  { id: "criminal", name: "อาญา", level: 9, xp: 420, color: "#d5867c" },
  {
    id: "civil-procedure",
    name: "วิแพ่ง",
    level: 14,
    xp: 680,
    color: "#80a5c5",
  },
  {
    id: "criminal-procedure",
    name: "วิอาญา",
    level: 8,
    xp: 350,
    color: "#aa91c5",
  },
  { id: "court", name: "ระเบียบศาล", level: 10, xp: 560, color: "#c7a35d" },
];

export const mockQuests = [
  { subject: "civil-procedure", target: 60, title: "อ่านวิแพ่ง 60 นาที" },
  { subject: "criminal", target: 45, title: "อ่านอาญา 45 นาที" },
  { subject: "civil", target: 30, title: "อ่านแพ่ง 30 นาที" },
  { subject: "court", target: 20, title: "อ่านระเบียบศาล 20 นาที" },
  { subject: null, target: 180, title: "อ่านรวมวันนี้ครบ 3 ชั่วโมง" },
];

export const mockItems = [
  "แว่น",
  "ปากกา",
  "กระเป๋า",
  "นาฬิกา",
  "Tablet",
  "ID card",
];
