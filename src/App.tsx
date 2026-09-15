import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { mockPlayer, mockSubjects, mockQuests, mockItems } from "./data/mock";
import {
  addReadingXp,
  characterForLevel,
  characterStages,
} from "./domain/progression";
import { Progress } from "./components/Progress";
import { Modal } from "./components/Modal";

type Session = { id: number; subject: string; minutes: number; time: string };
type Overlay = "manual" | "timer" | "history" | "item" | "stage" | null;
const subjectIcons = ["⚖", "◆", "▤", "⌕", "▥"];
const itemIcons = ["👓", "🖊️", "💼", "⌚", "📱", "🪪"];
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
  const [player, setPlayer] = useState(mockPlayer);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [subject, setSubject] = useState("civil-procedure");
  const [minutes, setMinutes] = useState("30");
  const [notice, setNotice] = useState("");
  const [selectedItem, setSelectedItem] = useState(0);
  const [selectedStage, setSelectedStage] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [storedSeconds, setStoredSeconds] = useState(0);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(tick);
  }, []);
  useEffect(() => {
    if (startedAt === null) return;
    const interval = window.setInterval(
      () =>
        setElapsed(storedSeconds + Math.floor((Date.now() - startedAt) / 1000)),
      250,
    );
    return () => window.clearInterval(interval);
  }, [startedAt, storedSeconds]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const stage = characterForLevel(player.level);
  const currentStage = characterStages.indexOf(stage);
  const todayMinutes = sessions.reduce(
    (total, session) => total + session.minutes,
    0,
  );
  const questMinutes = (id: string | null) =>
    sessions
      .filter((session) => id === null || session.subject === id)
      .reduce((sum, session) => sum + session.minutes, 0);
  const completedQuests = mockQuests.filter(
    (quest) => questMinutes(quest.subject) >= quest.target,
  ).length;
  const countdown = Math.max(
    0,
    Math.ceil((Date.parse(player.examDate) - now) / 86400000),
  );

  function recordReading(amount: number) {
    const result = addReadingXp(player.level, player.xp, amount);
    setPlayer((previous) => ({
      ...previous,
      ...result,
      totalMinutes: previous.totalMinutes + amount,
    }));
    setSubjects((previous) =>
      previous.map((entry) =>
        entry.id === subject
          ? { ...entry, ...addReadingXp(entry.level, entry.xp, amount) }
          : entry,
      ),
    );
    setSessions((previous) => [
      {
        id: Date.now(),
        subject,
        minutes: amount,
        time: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...previous,
    ]);
    setNotice(
      `บันทึก ${amount} นาทีแล้ว · +${amount * 10} XP${result.level > player.level ? ` · Level Up! Lv.${result.level}` : ""}`,
    );
    setOverlay(null);
  }
  function submitManual(event: FormEvent) {
    event.preventDefault();
    const amount = Number(minutes);
    if (Number.isInteger(amount) && amount >= 1 && amount <= 720)
      recordReading(amount);
  }
  function pauseTimer() {
    const seconds =
      startedAt === null
        ? elapsed
        : storedSeconds + Math.floor((Date.now() - startedAt) / 1000);
    setElapsed(seconds);
    setStoredSeconds(seconds);
    setStartedAt(null);
  }
  function finishTimer() {
    const seconds =
      startedAt === null
        ? elapsed
        : storedSeconds + Math.floor((Date.now() - startedAt) / 1000);
    const amount = Math.min(720, Math.floor(seconds / 60));
    if (amount < 1) return;
    recordReading(amount);
    setStartedAt(null);
    setElapsed(0);
    setStoredSeconds(0);
  }
  const close = () => setOverlay(null);
  const subjectSelect = (
    <label className="field">
      วิชาที่อ่าน
      <select
        value={subject}
        disabled={startedAt !== null || storedSeconds > 0}
        onChange={(event) => setSubject(event.target.value)}
      >
        {subjects.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand-mark"
          href="#home"
          aria-label="LAW ASCENSION หน้าหลัก"
        >
          ⚖<span>LA</span>
        </a>
        <nav aria-label="เมนูหลัก">
          <a className="nav-item active" href="#home">
            <span>⌂</span>หน้าหลัก
          </a>
          <button className="nav-item" onClick={() => setOverlay("timer")}>
            <span>▤</span>เริ่มอ่าน
          </button>
          <a className="nav-item" href="#quests">
            <span>☑</span>ภารกิจ
          </a>
          <a className="nav-item" href="#evolution">
            <span>♧</span>ตัวละคร
          </a>
          <button className="nav-item" onClick={() => setOverlay("history")}>
            <span>◷</span>ประวัติ
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
            <span className="stat-icon gold">♕</span>
            <div>
              <small>ชั่วโมงอ่านสะสม</small>
              <strong>
                {Math.floor(player.totalMinutes / 60)} <em>ชม.</em>{" "}
                {player.totalMinutes % 60} <em>นาที</em>
              </strong>
            </div>
          </article>
          <article className="stat">
            <span className="stat-icon coral">🔥</span>
            <div>
              <small>อ่านต่อเนื่อง</small>
              <strong>
                {player.streak} <em>วัน</em>
                <span className="streak-dots">● ● ● ● ● ● ●</span>
              </strong>
            </div>
          </article>
          <article className="stat exam-stat">
            <span className="stat-icon purple">▦</span>
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
              <h2>📚 เส้นทางวิชาของฉัน</h2>
              <span className="tiny-label">5 วิชา</span>
            </div>
            <p className="panel-subtitle">สะสมความรู้ ทีละบท ทีละก้าว</p>
            <div className="subject-list">
              {subjects.map((entry, index) => (
                <button
                  key={entry.id}
                  className="subject-card"
                  style={{ "--accent": entry.color } as CSSProperties}
                  onClick={() => {
                    if (startedAt === null && storedSeconds === 0)
                      setSubject(entry.id);
                    setOverlay("timer");
                  }}
                >
                  <span className="subject-icon">{subjectIcons[index]}</span>
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
                ไม่ต้องเก่งที่สุดในวันนี้
                <br />
                <strong>แค่เก่งกว่าเมื่อวานก็พอ</strong>
              </p>
            </div>
          </section>
          <section className="character-panel" aria-label="ตัวละครของฉัน">
            <div className="chapter-tag">
              <span>✦</span> บทที่ {currentStage + 1} ·{" "}
              {stageNames[currentStage]}
            </div>
            <div className="character-scene">
              <div className="scene-window">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="scene-orbit" />
              <div className="scene-spark spark-one">✦</div>
              <div className="scene-spark spark-two">✧</div>
              <div className="scene-spark spark-three">✦</div>
              <div className="speech">
                อีกนิดเดียว
                <br />
                ก็ใกล้ความฝันแล้ว ♡
              </div>
              <div className="scene-plant" aria-hidden="true">
                🌿
              </div>
              <div className="scene-books" aria-hidden="true">
                <span>LAW</span>
                <span>one page at a time</span>
                <span>✦</span>
              </div>
              <div className="character-shadow" />
              <img
                className="main-character"
                src={stage.file}
                alt={`ตัวละครผู้หญิง Lv.${player.level} ${stage.label}`}
                fetchPriority="high"
              />
              <span className="character-level">✦ Lv. {player.level}</span>
            </div>
            <div className="character-caption">
              <h2>{stageNames[currentStage]}</h2>
              <p>อ่านวันนี้ เพื่อเป็นตัวเองในเวอร์ชันที่ดีกว่า</p>
            </div>
            <button
              className="primary start-button"
              onClick={() => setOverlay("timer")}
            >
              <span>▶</span>
              {startedAt !== null
                ? `กำลังอ่าน · ${formatSeconds(elapsed)}`
                : "เริ่มอ่านวันนี้"}
              <span>→</span>
            </button>
            <div className="secondary-actions">
              <button
                onClick={() => {
                  if (startedAt !== null || storedSeconds > 0)
                    setOverlay("timer");
                  else setOverlay("manual");
                }}
              >
                ＋ เพิ่มเวลาเอง
              </button>
              <span />
              <button onClick={() => setOverlay("history")}>◷ ดูประวัติ</button>
            </div>
          </section>
          <section className="panel quests-panel" id="quests">
            <div className="panel-heading">
              <h2>☑ ภารกิจวันนี้</h2>
              <span className="quest-count">{completedQuests}/5</span>
            </div>
            <p className="panel-subtitle">
              ภารกิจเล็ก ๆ สู่ความสำเร็จที่ยิ่งใหญ่
            </p>
            <div className="quest-list">
              {mockQuests.map((quest) => {
                const done = questMinutes(quest.subject);
                const complete = done >= quest.target;
                return (
                  <div
                    className={`quest ${complete ? "complete" : ""}`}
                    key={quest.title}
                  >
                    <span
                      className="quest-check"
                      aria-label={complete ? "สำเร็จแล้ว" : "ยังไม่สำเร็จ"}
                    >
                      {complete ? "✓" : ""}
                    </span>
                    <div>
                      <strong>{quest.title}</strong>
                      {subjects.find(
                        (entry) =>
                          entry.id === quest.subject && entry.xp >= 800,
                      ) && <span className="near-level">✦ ใกล้ Level Up</span>}
                      <div className="quest-progress">
                        <Progress
                          value={done}
                          max={quest.target}
                          label={quest.title}
                        />
                        <small>
                          {Math.min(done, quest.target)}/{quest.target}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="daily-reward">
              <span>🎁</span>
              <div>
                <strong>วันนี้อ่านแล้ว {todayMinutes} นาที</strong>
                <small>ทำครบ 5 ภารกิจ เก็บความภูมิใจอีกวัน</small>
              </div>
              <span>✧</span>
            </div>
            <div className="encouragement">
              “ ความพยายามเล็ก ๆ ในทุกวัน
              <br />
              <strong>สร้างอนาคตที่ยิ่งใหญ่ได้ ”</strong>
              <span>KEEP GOING, FUTURE YOU IS PROUD.</span>
            </div>
          </section>
        </div>
        <div className="collection-grid">
          <section className="panel evolution-panel" id="evolution">
            <div className="panel-heading">
              <h2>✦ การพัฒนาตัวละคร</h2>
              <span className="tiny-label">เส้นทางสู่ความฝัน</span>
            </div>
            <div className="stages">
              {characterStages.map((entry, index) => (
                <button
                  key={entry.file}
                  className={`stage ${index === currentStage ? "current" : ""} ${index > currentStage ? "locked" : ""}`}
                  onClick={() => {
                    setSelectedStage(index);
                    setOverlay("stage");
                  }}
                  aria-label={`${entry.label} ${index > currentStage ? "ยังไม่ปลดล็อก" : index === currentStage ? "ขั้นปัจจุบัน" : "ปลดล็อกแล้ว"}`}
                >
                  <span className="stage-status">
                    {index === currentStage
                      ? "อยู่ตรงนี้"
                      : index > currentStage
                        ? "🔒"
                        : "✓"}
                  </span>
                  <img src={entry.file} alt={entry.label} loading="lazy" />
                  <strong>
                    Lv. {entry.minLevel}
                    {entry.maxLevel ? `–${entry.maxLevel}` : "+"}
                  </strong>
                  <small>{entry.label}</small>
                </button>
              ))}
            </div>
          </section>
          <section className="panel items-panel" id="items">
            <div className="panel-heading">
              <h2>🎒 ไอเทมที่ปลดล็อกแล้ว</h2>
              <span className="tiny-label">6 ชิ้น</span>
            </div>
            <div className="items">
              {mockItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    setSelectedItem(index);
                    setOverlay("item");
                  }}
                >
                  <span>{itemIcons[index]}</span>
                  <small>{item}</small>
                </button>
              ))}
            </div>
            <p className="item-note">
              ของชิ้นเล็ก ๆ สำหรับการเดินทางที่ยิ่งใหญ่ ♡
            </p>
          </section>
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
        <Modal title="＋ เพิ่มเวลาอ่าน" onClose={close}>
          <p>ทุกนาทีที่ตั้งใจ มีค่าเสมอ · 1 นาที = 10 XP</p>
          <form onSubmit={submitManual}>
            {subjectSelect}
            <label className="field">
              เวลาที่อ่าน (นาที)
              <input
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
            <button className="primary full" type="submit">
              บันทึกเวลาอ่าน · +{Math.max(0, Number(minutes) * 10) || 0} XP
            </button>
          </form>
        </Modal>
      )}
      {overlay === "timer" && (
        <Modal title="📖 เวลาแห่งการเติบโต" onClose={close}>
          {subjectSelect}
          <div className="timer-display">{formatSeconds(elapsed)}</div>
          <p className="timer-hint">
            {startedAt !== null
              ? "ค่อย ๆ อ่าน เราจับเวลาให้เอง ♡"
              : "พร้อมแล้ว เริ่มบทใหม่ไปด้วยกัน"}
          </p>
          <button
            className="primary full"
            onClick={() => {
              if (startedAt !== null) pauseTimer();
              else setStartedAt(Date.now());
            }}
          >
            {startedAt !== null
              ? "Ⅱ พักสักครู่"
              : elapsed > 0
                ? "▶ อ่านต่อ"
                : "▶ เริ่มจับเวลา"}
          </button>
          <button
            className="secondary full"
            disabled={elapsed < 60}
            onClick={finishTimer}
          >
            จบการอ่านและบันทึก {Math.min(720, Math.floor(elapsed / 60))} นาที
          </button>
          <small className="timer-hint">
            บันทึกเมื่อครบ 1 นาที · เศษวินาทีไม่นับ XP · สูงสุด 720 นาที/ครั้ง
          </small>
          {elapsed > 0 && startedAt === null && (
            <button
              className="text-button full"
              onClick={() => {
                setElapsed(0);
                setStoredSeconds(0);
              }}
            >
              ยกเลิกช่วงนี้และเริ่มใหม่
            </button>
          )}
        </Modal>
      )}
      {overlay === "history" && (
        <Modal title="◷ ประวัติการอ่านวันนี้" onClose={close}>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <span>📚</span>
              <h3>บทแรกของวันนี้รอคุณอยู่</h3>
              <p>เริ่มอ่านหรือเพิ่มเวลา แล้วมาดูความก้าวหน้าที่นี่</p>
              <button className="primary" onClick={() => setOverlay("timer")}>
                เริ่มอ่านวันนี้
              </button>
            </div>
          ) : (
            <>
              <p>
                อ่านแล้ว {todayMinutes} นาที · ได้รับ {todayMinutes * 10} XP
              </p>
              <ul className="history-list">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <div>
                      <strong>
                        {
                          subjects.find((entry) => entry.id === session.subject)
                            ?.name
                        }
                      </strong>
                      <small>วันนี้ {session.time}</small>
                    </div>
                    <span>
                      {session.minutes} นาที <b>+{session.minutes * 10} XP</b>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal>
      )}
      {overlay === "item" && (
        <Modal title={mockItems[selectedItem]} onClose={close}>
          <div className="empty-state">
            <span>{itemIcons[selectedItem]}</span>
            <h3>ไอเทมในคอลเลกชันของคุณ</h3>
            <p>ปลดล็อกแล้ว · ไอเทมตัวอย่างใน Phase 1</p>
            <p>ยังไม่มีโบนัสหรือระบบสวมใส่</p>
          </div>
        </Modal>
      )}
      {overlay === "stage" && (
        <Modal title={stageNames[selectedStage]} onClose={close}>
          <div className="stage-detail">
            <img
              src={characterStages[selectedStage].file}
              alt={characterStages[selectedStage].label}
            />
            <h3>{characterStages[selectedStage].label}</h3>
            <p>
              {selectedStage <= currentStage
                ? "✦ ปลดล็อกแล้ว"
                : `🔒 ปลดล็อกเมื่อถึง Lv.${characterStages[selectedStage].minLevel}`}
            </p>
            <p>ตัวละครจะเปลี่ยนชุดให้อัตโนมัติเมื่อถึงระดับนี้</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
