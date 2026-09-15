export const studyActivities = [
  {
    id: "reading",
    name: "อ่านเนื้อหา",
    shortName: "อ่านเนื้อหา",
    targetMinutes: 240,
    checkpointXp: 20,
    icon: "book",
  },
  {
    id: "questions",
    name: "ทำข้อสอบ",
    shortName: "ทำข้อสอบ",
    targetMinutes: 30,
    checkpointXp: 25,
    icon: "pen",
  },
  {
    id: "summary",
    name: "ดูสรุป / Infographic",
    shortName: "สรุป / Infographic",
    targetMinutes: 30,
    checkpointXp: 15,
    icon: "id-card",
  },
  {
    id: "lecture",
    name: "Lecture / ทำความเข้าใจ",
    shortName: "Lecture / ทำความเข้าใจ",
    targetMinutes: 30,
    checkpointXp: 18,
    icon: "headphones",
  },
] as const;

export type ActivityId = (typeof studyActivities)[number]["id"];
export type StudyMethod = "timer" | "manual";

export const activityById = (id: ActivityId) => {
  const activity = studyActivities.find((entry) => entry.id === id);
  if (!activity) throw new RangeError("Unknown study activity");
  return activity;
};

export const initialMissionProgress = (): Record<ActivityId, number> => ({
  reading: 0,
  questions: 0,
  summary: 0,
  lecture: 0,
});
