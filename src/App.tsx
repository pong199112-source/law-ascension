import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { studyActivities, activityById, type ActivityId } from "./data/study";
import { equipmentItems } from "./data/equipment";
import type { EquipmentId, EquipmentState } from "./data/equipment";
import { activeCharacter, toggleEquipment } from "./domain/customization";
import { manualXpForMinutes, calculateAccuracy } from "./domain/study";
import { useStudyEngine } from "./hooks/useStudyEngine";
import { GameIcon } from "./components/GameIcon";
import { CharacterCollection } from "./components/CharacterCollection";
import { EquipmentPanel, EquippedSlots } from "./components/EquipmentPanel";
import { AccessoryLayer } from "./components/AccessoryLayer";
import { SceneEquipmentLayer } from "./components/SceneEquipmentLayer";
import { characterForLevel, characterStages } from "./domain/progression";
import { Progress } from "./components/Progress";
import { Modal } from "./components/Modal";

type Overlay = "manual" | "timer" | "history" | null;
const stageNames = [
  "ก้าวแรก",
  "นักกฎหมายฝึกหัด",
  "ข้าราชการกากี",
  "พร้อมปฏิบัติหน้าที่",
  "เติบโตอย่างมั่นใจ",
  "ความฝันที่เป็นจริง",
];
const formatSeconds = (value: number) =>
  `${Math.floor(value / 60)
    .toString()
    .padStart(2, "0")}:${(value % 60).toString().padStart(2, "0")}`;

export default function App() {
  const study = useStudyEngine();
  const { player, subjects, sessions, missionProgress, bonusAwarded, todayMinutes,
    subject, setSubject, activity, setActivity, elapsed, startedAt, timerLocked,
    notice, setNotice } = study;
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [minutes, setMinutes] = useState("30");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [formError, setFormError] = useState("");
  const [manualOutfit, setManualOutfit] = useState<string | null>(null);
  const [equipped, setEquipped] = useState<EquipmentState>({});
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(tick);
  }, []);
  const stage = activeCharacter(player.level, manualOutfit);
  const currentStage = characterStages.indexOf(characterForLevel(player.level));
  function chooseOutfit(file: string | null) {
    activeCharacter(player.level, file);
    setManualOutfit(file);
    setNotice(
      file === null
        ? "เปิดเลือกชุดอัตโนมัติตาม Level แล้ว"
        : "เปลี่ยนชุดแล้ว · อุปกรณ์ย้ายตามท่าของชุดใหม่แล้ว",
    );
  }
  function equipItem(id: EquipmentId) {
    const item = equipmentItems.find((entry) => entry.id === id)!;
    setNotice(`${equipped[item.slot] === id ? "ถอด" : "สวม"}${item.name}แล้ว`);
    setEquipped((previous) => toggleEquipment(previous, id));
  }
  const completedMissions = studyActivities.filter(
    (entry) => missionProgress[entry.id] >= entry.targetMinutes,
  ).length;
  const countdown = Math.max(
    0,
    Math.ceil((Date.parse(player.examDate) - now) / 86400000),
  );

  function optionalResults() {
    if (activity !== "questions" || (!attempted && !correct)) return {};
    try {
      const attemptedValue = Number(attempted), correctValue = Number(correct);
      calculateAccuracy(attemptedValue, correctValue);
      setFormError("");
      return { attempted: attemptedValue, correct: correctValue };
    } catch {
      setFormError("กรอกจำนวนข้อทั้งสองช่อง และจำนวนข้อถูกต้องต้องไม่เกินจำนวนข้อที่ทำ");
      return null;
    }
  }
  function submitManual(event: FormEvent) {
    event.preventDefault();
    const amount = Number(minutes);
    const results = optionalResults();
    if (results && Number.isInteger(amount) && amount >= 1 && amount <= 720) {
      study.recordManual(amount, results.attempted, results.correct);
      setOverlay(null);
    }
  }
  const close = () => setOverlay(null);
  const selectors = (
    <div className="study-selectors">
      <label className="field"><span><b>1</b> เลือกวิชา</span><select aria-label="เลือกวิชา" value={subject} disabled={timerLocked} onChange={(event) => setSubject(event.target.value)}>{subjects.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
      <label className="field"><span><b>2</b> เลือกรูปแบบการเรียน</span><select aria-label="เลือกรูปแบบการเรียน" value={activity} disabled={timerLocked} onChange={(event) => { setActivity(event.target.value as ActivityId); setAttempted(""); setCorrect(""); }}>{studyActivities.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
    </div>
  );
  const questionFields = activity === "questions" && <fieldset className="question-results"><legend>ผลข้อสอบ (ไม่บังคับ · ไม่กระทบ XP)</legend><label>จำนวนข้อที่ทำ<input aria-label="จำนวนข้อที่ทำ" type="number" min="1" value={attempted} onChange={(event) => setAttempted(event.target.value)} /></label><label>ตอบถูก<input aria-label="จำนวนข้อที่ตอบถูก" type="number" min="0" value={correct} onChange={(event) => setCorrect(event.target.value)} /></label>{attempted && correct && Number(correct) <= Number(attempted) && <strong>Accuracy {calculateAccuracy(Number(attempted), Number(correct))}%</strong>}</fieldset>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand-mark"
          href="#home"
          aria-label="LAW ASCENSION หน้าหลัก"
        >
          <GameIcon name="civil" />
          <span>LA</span>
        </a>
        <nav aria-label="เมนูหลัก">
          <a className="nav-item active" href="#home">
            <GameIcon name="home" />
            หน้าหลัก
          </a>
          <button className="nav-item" onClick={() => setOverlay("timer")}>
            <GameIcon name="book" />
            เริ่มอ่าน
          </button>
          <a className="nav-item" href="#quests">
            <GameIcon name="quest" />
            ภารกิจ
          </a>
          <a className="nav-item" href="#evolution">
            <GameIcon name="wardrobe" />
            ตัวละคร
          </a>
          <button className="nav-item" onClick={() => setOverlay("history")}>
            <GameIcon name="history" />
            ประวัติ
          </button>
        </nav>
        <div className="sidebar-bottom">
          <span>✦</span>ทีละนิด
          <br />
          ก็เติบโตได้
        </div>
      </aside>
      <main id="home" className="main-content">
        <header className="topbar">
          <div>
            <div className="wordmark">
              LAW <span>ASCENSION</span>
              <i>✦</i>
            </div>
            <p>เปลี่ยนทุกหน้าที่อ่าน เป็นอีกก้าวของความฝัน</p>
          </div>
          <div className="profile">
            <span className="profile-avatar">
              <img src={stage.file} alt="" />
            </span>
            <div>
              <strong>นักกฎหมายฝึกหัด</strong>
              <small>เส้นทางของฉัน · Lv.{player.level}</small>
            </div>
            <span className="profile-spark">✧</span>
          </div>
        </header>
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h1>
              วันนี้ มาเก่งขึ้นอีกนิดกัน <span>☀</span>
            </h1>
          </div>
          <span className="date-pill">✦ ทุกนาทีมีความหมาย</span>
        </section>
        <div className="game-room">
          <div className="room-backdrop" aria-hidden="true" />
          <div className="room-foreground" aria-hidden="true" />
          <div className="room-location">
            <span className="location-dot" /> ห้องอ่านหนังสือ ·
            แสงเช้าแห่งความฝัน <span>✦</span>
          </div>
          <section className="stats" aria-label="ภาพรวมการอ่าน">
            <article className="stat level-stat">
              <div className="level-medal">
                {player.level}
                <small>LEVEL</small>
              </div>
              <div className="level-info">
                <div className="stat-top">
                  <strong>Overall Level</strong>
                  <span>Lv.{player.level + 1} ↗</span>
                </div>
                <Progress value={player.xp} label="Overall XP" />
                <small>
                  {player.xp.toLocaleString()} / 1,000 XP{" "}
                  <span>อีก {1000 - player.xp} XP เติบโตอีกขั้น!</span>
                </small>
              </div>
            </article>
            <article className="stat">
              <span className="stat-icon gold">
                <GameIcon name="crown" />
              </span>
              <div>
                <small>ชั่วโมงอ่านสะสม</small>
                <strong>
                  {Math.floor(player.totalMinutes / 60)} <em>ชม.</em>{" "}
                  {player.totalMinutes % 60} <em>นาที</em>
                </strong>
              </div>
            </article>
            <article className="stat">
              <span className="stat-icon coral">
                <GameIcon name="flame" />
              </span>
              <div>
                <small>อ่านต่อเนื่อง</small>
                <strong>
                  {player.streak} <em>วัน</em>
                  <span className="streak-dots">● ● ● ● ● ● ●</span>
                </strong>
              </div>
            </article>
            <article className="stat exam-stat">
              <span className="stat-icon purple">
                <GameIcon name="calendar" />
              </span>
              <div>
                <small>นับถอยหลังสู่วันสอบ</small>
                <strong>
                  {countdown} <em>วัน</em>
                </strong>
                <small>
                  {new Date(player.examDate).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Bangkok",
                  })}{" "}
                  · ไปให้ถึงฝัน!
                </small>
              </div>
            </article>
          </section>
          <div className="adventure-grid">
            <section className="panel subjects-panel" id="subjects">
              <div className="panel-heading">
                <h2>
                  <GameIcon name="book" /> เส้นทางวิชาของฉัน
                </h2>
                <span className="tiny-label">เลือกวิชาทุก Session</span>
              </div>
              <p className="panel-subtitle">XP และ Level แยกตามวิชาที่คุณเลือกเรียน</p>
              <div className="subject-list">
                {subjects.map((entry) => (
                  <button
                    key={entry.id}
                    className="subject-card"
                    style={{ "--accent": entry.color } as CSSProperties}
                    onClick={() => {
                      if (!timerLocked) setSubject(entry.id);
                      setOverlay("timer");
                    }}
                  >
                    <span
                      className="subject-icon"
                      style={{ "--icon-color": entry.color } as CSSProperties}
                    >
                      <GameIcon name={entry.id} />
                    </span>
                    <div>
                      <div className="subject-title">
                        <strong>{entry.name}</strong>
                        <span>Lv. {entry.level}</span>
                      </div>
                      <Progress value={entry.xp} label={`${entry.name} XP`} />
                      <small>{entry.xp} / 1,000 XP</small>
                    </div>
                    <span className="subject-arrow">›</span>
                  </button>
                ))}
              </div>
              <div className="study-tip">
                <span>✧</span>
                <p>
                  เลือกวิชาตามตารางจริงของวันนี้
                  <br />
                  <strong>ทุกกิจกรรมสะสม XP ให้วิชานั้น</strong>
                </p>
              </div>
            </section>
            <section className="character-panel" aria-label="ตัวละครของฉัน">
              <div className="chapter-tag">
                <span>✦</span> บทที่ {currentStage + 1} ·{" "}
                {stageNames[currentStage]}
              </div>
              <div className="character-scene">
                <div className="scene-spark spark-one">✦</div>
                <div className="scene-spark spark-two">✧</div>
                <div className="scene-spark spark-three">✦</div>
                <div className="speech">
                  อีกนิดเดียว
                  <br />
                  ก็ใกล้ความฝันแล้ว ♡
                </div>
                <div className="character-shadow" />
                <SceneEquipmentLayer equipped={equipped} stageFile={stage.file} />
                <div className="character-avatar">
                  <img className="main-character" src={stage.file} alt={`ตัวละครผู้หญิง Lv.${player.level} ${stage.label}`} fetchPriority="high" />
                  <AccessoryLayer equipped={equipped} stageFile={stage.file} />
                </div>
                <span className="character-level">✦ Lv. {player.level}</span>
              </div>
              <div className="character-caption">
                <h2>{stageNames[currentStage]}</h2>
                <p className="wearing-outfit">
                  ใช้อยู่: {stage.label}{" "}
                  <span>
                    {manualOutfit === null ? "อัตโนมัติ" : "เลือกเอง"}
                  </span>
                </p>
              </div>
              <EquippedSlots equipped={equipped} onToggle={equipItem} />
              <button
                className="primary start-button"
                onClick={() => setOverlay("timer")}
              >
                <span>▶</span>
                {startedAt !== null
                  ? `กำลังเรียน · ${formatSeconds(elapsed)}`
                  : "เริ่มอ่านวันนี้"}
                <span>→</span>
              </button>
              <div className="secondary-actions">
                <button
                  onClick={() => {
                    if (timerLocked) setOverlay("timer");
                    else setOverlay("manual");
                  }}
                >
                  ＋ เพิ่มเวลาเอง
                </button>
                <span />
                <button onClick={() => setOverlay("history")}>
                  ◷ ดูประวัติ
                </button>
              </div>
            </section>
            <section className="panel quests-panel" id="quests">
              <div className="panel-heading">
                <h2>
                  <GameIcon name="quest" /> ภารกิจวันนี้
                </h2>
                <span className="quest-count">{completedMissions}/4</span>
              </div>
              <p className="panel-subtitle">
                ทำกิจกรรมกับวิชาไหนก็ได้ · Progress นับเวลาจริง
              </p>
              <div className="quest-list">
                {studyActivities.map((quest) => {
                  const done = missionProgress[quest.id];
                  const complete = done >= quest.targetMinutes;
                  return (
                    <div
                      className={`quest activity-quest ${complete ? "complete" : ""}`}
                      key={quest.id}
                    >
                      <span className="quest-activity-icon"><GameIcon name={quest.icon} /></span>
                      <div>
                        <strong>{quest.name}</strong>
                        {complete && <span className="mission-complete">✓ สำเร็จ</span>}
                        <div className="quest-progress">
                          <Progress
                            value={done}
                            max={quest.targetMinutes}
                            label={`${quest.name} mission`}
                          />
                          <small>{done}/{quest.targetMinutes} นาที</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={`daily-reward ${bonusAwarded ? "reward-claimed" : ""}`}>
                <GameIcon name="gift" />
                <div>
                  <strong>วันนี้เรียนแล้ว {todayMinutes} นาที</strong>
                  <small>{bonusAwarded ? "รับโบนัสครบทุกกิจกรรมแล้ว +30 Overall XP" : "ครบทั้ง 4 กิจกรรม รับ +30 Overall XP อัตโนมัติ"}</small>
                </div>
                <span>{bonusAwarded ? "✓" : "✧"}</span>
              </div>
              <div className="encouragement">
                “ เลือกวิชาตามแผนของคุณ
                <br />
                <strong>แล้วเติบโตจากทุกกิจกรรม ”</strong>
                <span>KEEP GOING, FUTURE YOU IS PROUD.</span>
              </div>
            </section>
          </div>
          <div className="collection-grid">
            <CharacterCollection
              level={player.level}
              activeFile={stage.file}
              manualFile={manualOutfit}
              onSelect={chooseOutfit}
              equipped={equipped}
            />
            <EquipmentPanel equipped={equipped} onToggle={equipItem} />
          </div>
        </div>
        <footer>
          <span>
            LAW ASCENSION <b>✦</b> SMALL STEPS. BRIGHT FUTURE.
          </span>
          <small>
            Phase 1 · ทดลองเล่นด้วยข้อมูลจำลอง · รีเฟรชเพื่อเริ่มใหม่
          </small>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          ✦ {notice}
        </div>
      )}
      {overlay === "manual" && (
        <Modal title="＋ เพิ่มเวลาเรียน" onClose={close}>
          <p>เลือกวิชาและกิจกรรม · เพิ่มเวลาเองได้ 85% ของ XP จาก Timer</p>
          <form onSubmit={submitManual}>
            {selectors}
            <label className="field">
              เวลาที่เรียน (นาที)
              <input
                aria-label="เวลาที่เรียน (นาที)"
                type="number"
                min="1"
                max="720"
                step="1"
                required
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
              />
            </label>
            <div className="quick-times">
              {[15, 30, 60, 120].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={minutes === String(value) ? "selected" : ""}
                  onClick={() => setMinutes(String(value))}
                >
                  {value} นาที
                </button>
              ))}
            </div>
            {questionFields}
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button className="primary full" type="submit">
              บันทึกเวลา · +{Number(minutes) > 0 && Number(minutes) <= 720 ? manualXpForMinutes(activity, Number(minutes)) : 0} XP
            </button>
          </form>
        </Modal>
      )}
      {overlay === "timer" && (
        <Modal title="เวลาแห่งการเติบโต" onClose={close}>
          {selectors}
          <div className="session-summary"><span>{subjects.find((entry) => entry.id === subject)?.name}</span><b>·</b><span>{activityById(activity).name}</span><strong>ทุก 30 นาที +{activityById(activity).checkpointXp} XP</strong></div>
          <div className="timer-display">{formatSeconds(elapsed)}</div>
          <p className="timer-hint">
            {startedAt !== null
              ? "จับเวลาอยู่ · checkpoint บันทึกให้อัตโนมัติ ♡"
              : elapsed > 0 ? "พักอยู่ เวลาจะไม่เพิ่ม" : "เลือกครบแล้ว เริ่ม Session ได้เลย"}
          </p>
          <button
            className="primary full"
            onClick={() => {
              if (startedAt !== null) study.pauseTimer();
              else study.startTimer();
            }}
          >
            {startedAt !== null
                ? "Ⅱ พักสักครู่"
              : elapsed > 0
                ? "▶ เรียนต่อ"
                : "▶ เริ่มจับเวลา"}
          </button>
          {questionFields}
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button
            className="secondary full"
            disabled={elapsed < 60}
            onClick={() => { const results = optionalResults(); if (results) { study.finishTimer(results.attempted, results.correct); setOverlay(null); setAttempted(""); setCorrect(""); } }}
          >
            จบ Session และบันทึก {Math.min(720, Math.floor(elapsed / 60))} นาที
          </button>
          <small className="timer-hint">
            Checkpoint ทุก 30 นาที · เวลาที่เหลือได้ XP แบบ prorated · สูงสุด 720 นาที
          </small>
          {elapsed > 0 && startedAt === null && (
            <button
              className="text-button full"
              onClick={study.discardPartial}
            >
              จบช่วงนี้โดยไม่บันทึกเศษเวลาที่ยังไม่ครบ
            </button>
          )}
        </Modal>
      )}
      {overlay === "history" && (
        <Modal title="◷ ประวัติการเรียนวันนี้" onClose={close}>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <span>📚</span>
              <h3>Session แรกของวันนี้รอคุณอยู่</h3>
              <p>เลือกวิชา เลือกกิจกรรม แล้วเริ่มจับเวลาได้เลย</p>
              <button className="primary" onClick={() => setOverlay("timer")}>
                เริ่มอ่านวันนี้
              </button>
            </div>
          ) : (
            <>
              <p>เรียนแล้ว {todayMinutes} นาที · {sessions.length} Session</p>
              <ul className="history-list">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <div>
                      <strong>
                        {subjects.find((entry) => entry.id === session.subjectId)?.name} · {activityById(session.activityId).shortName}
                      </strong>
                      <small>วันนี้ {session.time} · {session.method === "timer" ? "Timer" : "เพิ่มเอง"}{session.active ? " · กำลังจับเวลา" : ""}</small>
                      {session.attempted !== undefined && <small>{session.attempted} ข้อ · ถูก {session.correct} · Accuracy {session.accuracy}%</small>}
                    </div>
                    <span>
                      {session.minutes} นาที <b>+{session.xp} XP</b>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
