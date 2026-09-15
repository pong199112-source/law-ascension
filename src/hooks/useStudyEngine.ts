import { useEffect, useRef, useState } from "react";
import { mockPlayer, mockSubjects } from "../data/mock";
import {
  activityById,
  initialMissionProgress,
  type ActivityId,
  type StudyMethod,
} from "../data/study";
import {
  addXp,
  calculateAccuracy,
  DAILY_COMPLETION_BONUS_XP,
  earnsDailyBonus,
  manualXpForMinutes,
  timerXpForMinutes,
} from "../domain/study";

export type StudySession = {
  id: number;
  subjectId: string;
  activityId: ActivityId;
  minutes: number;
  xp: number;
  method: StudyMethod;
  time: string;
  attempted?: number;
  correct?: number;
  accuracy?: number;
  active?: boolean;
};

const timeLabel = () =>
  new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

export function useStudyEngine() {
  const [player, setPlayer] = useState(mockPlayer);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [missionProgress, setMissionProgress] = useState(initialMissionProgress);
  const progressRef = useRef(missionProgress);
  const bonusRef = useRef(false);
  const [bonusAwarded, setBonusAwarded] = useState(false);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [subject, setSubject] = useState("civil-procedure");
  const [activity, setActivity] = useState<ActivityId>("reading");
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [storedSeconds, setStoredSeconds] = useState(0);
  const [notice, setNotice] = useState("");
  const checkpointRef = useRef(0);
  const timerXpRef = useRef(0);
  const sessionIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (startedAt === null) return;
    const interval = window.setInterval(
      () => setElapsed(storedSeconds + Math.floor((Date.now() - startedAt) / 1000)),
      250,
    );
    return () => window.clearInterval(interval);
  }, [startedAt, storedSeconds]);
  useEffect(() => {
    if (startedAt === null) return;
    const completed = Math.floor(elapsed / 1800);
    if (completed > checkpointRef.current) creditCheckpoints(completed);
    // The selector is locked while timing, so the checkpoint function uses the
    // same subject/activity for the lifetime of this session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, startedAt]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function award(subjectId: string, activityId: ActivityId, minutes: number, xp: number) {
    if (minutes <= 0 && xp <= 0) return false;
    const next = { ...progressRef.current, [activityId]: progressRef.current[activityId] + minutes };
    progressRef.current = next;
    setMissionProgress(next);
    setTodayMinutes((value) => value + minutes);
    const bonus = earnsDailyBonus(next, bonusRef.current);
    if (bonus) { bonusRef.current = true; setBonusAwarded(true); }
    setPlayer((previous) => ({
      ...previous,
      ...addXp(previous.level, previous.xp, xp + (bonus ? DAILY_COMPLETION_BONUS_XP : 0)),
      totalMinutes: previous.totalMinutes + minutes,
    }));
    setSubjects((previous) => previous.map((entry) =>
      entry.id === subjectId ? { ...entry, ...addXp(entry.level, entry.xp, xp) } : entry,
    ));
    return bonus;
  }

  function upsertTimer(totalMinutes: number, totalXp: number, active: boolean, details = {}) {
    const id = sessionIdRef.current;
    if (id === null) return;
    setSessions((previous) => {
      const existing = previous.find((entry) => entry.id === id);
      const next: StudySession = {
        id, subjectId: subject, activityId: activity, minutes: totalMinutes,
        xp: totalXp, method: "timer", time: existing?.time ?? timeLabel(), active, ...details,
      };
      return existing ? previous.map((entry) => entry.id === id ? next : entry) : [next, ...previous];
    });
  }

  function creditCheckpoints(completed: number) {
    const count = completed - checkpointRef.current;
    if (count <= 0) return;
    checkpointRef.current = completed;
    const xp = count * activityById(activity).checkpointXp;
    timerXpRef.current += xp;
    const bonus = award(subject, activity, count * 30, xp);
    upsertTimer(completed * 30, timerXpRef.current, true);
    setNotice(`✨ CHECKPOINT · ${subjects.find((entry) => entry.id === subject)?.name} · ${activityById(activity).shortName} ${completed * 30} นาที · +${xp} XP${bonus ? " · โบนัส +30 XP" : ""}`);
  }

  function resultDetails(attempted?: number, correct?: number) {
    const accuracy = calculateAccuracy(attempted, correct);
    return accuracy === undefined ? {} : { attempted, correct, accuracy };
  }

  function recordManual(minutes: number, attempted?: number, correct?: number) {
    const details = resultDetails(attempted, correct);
    const xp = manualXpForMinutes(activity, minutes);
    const bonus = award(subject, activity, minutes, xp);
    setSessions((previous) => [{
      id: Date.now(), subjectId: subject, activityId: activity, minutes, xp,
      method: "manual", time: timeLabel(), ...details,
    }, ...previous]);
    setNotice(`เพิ่มเวลา ${minutes} นาที · +${xp} XP${bonus ? " · โบนัส +30 XP" : ""}`);
    return xp;
  }

  function startTimer() {
    if (elapsed > 0) setStartedAt(Date.now());
    else {
      sessionIdRef.current = Date.now(); checkpointRef.current = 0; timerXpRef.current = 0;
      setStartedAt(Date.now());
    }
  }
  function pauseTimer() {
    const seconds = startedAt === null ? elapsed : storedSeconds + Math.floor((Date.now() - startedAt) / 1000);
    setElapsed(seconds); setStoredSeconds(seconds); setStartedAt(null);
  }
  function finishTimer(attempted?: number, correct?: number) {
    const details = resultDetails(attempted, correct);
    const seconds = startedAt === null ? elapsed : storedSeconds + Math.floor((Date.now() - startedAt) / 1000);
    const minutes = Math.min(720, Math.floor(seconds / 60));
    if (minutes < 1) throw new RangeError("Session must be at least one minute");
    const result = timerXpForMinutes(activity, minutes);
    const missing = result.checkpoints - checkpointRef.current;
    const incrementalMinutes = minutes - checkpointRef.current * 30;
    const incrementalXp = missing * activityById(activity).checkpointXp + result.partialXp;
    const bonus = award(subject, activity, incrementalMinutes, incrementalXp);
    timerXpRef.current += incrementalXp;
    upsertTimer(minutes, timerXpRef.current, false, details);
    const totalXp = timerXpRef.current;
    setNotice(`จบ Session ${minutes} นาที · +${totalXp} XP${bonus ? " · โบนัส +30 XP" : ""}`);
    resetTimer();
    return totalXp;
  }
  function resetTimer() {
    setStartedAt(null); setElapsed(0); setStoredSeconds(0);
    checkpointRef.current = 0; timerXpRef.current = 0; sessionIdRef.current = null;
  }
  function discardPartial() {
    if (checkpointRef.current > 0) upsertTimer(checkpointRef.current * 30, timerXpRef.current, false);
    resetTimer();
  }

  return {
    player, subjects, sessions, missionProgress, bonusAwarded, todayMinutes,
    subject, setSubject, activity, setActivity, elapsed, startedAt, storedSeconds,
    timerLocked: startedAt !== null || storedSeconds > 0, notice, setNotice,
    recordManual, startTimer, pauseTimer, finishTimer, discardPartial,
  };
}
