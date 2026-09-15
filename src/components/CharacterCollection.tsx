import { useState } from "react";
import { characterStages } from "../domain/progression";
import { Modal } from "./Modal";
import { GameIcon } from "./GameIcon";

export function CharacterCollection({
  level,
  activeFile,
  manualFile,
  onSelect,
}: {
  level: number;
  activeFile: string;
  manualFile: string | null;
  onSelect: (file: string | null) => void;
}) {
  const [inspectedFile, setInspectedFile] = useState<string | null>(null);
  const inspected = characterStages.find(
    (stage) => stage.file === inspectedFile,
  );
  return (
    <section className="panel evolution-panel" id="evolution">
      <div className="panel-heading">
        <h2>
          <GameIcon name="wardrobe" /> ตู้เสื้อผ้าของฉัน
        </h2>
        <span className="tiny-label">
          ปลดล็อก{" "}
          {characterStages.filter((stage) => stage.minLevel <= level).length}/6
          ชุด
        </span>
      </div>
      <div className="outfit-mode">
        <span>
          {manualFile === null
            ? "เลือกชุดอัตโนมัติตาม Level"
            : "เก็บชุดที่คุณเลือกไว้ แม้ Level เพิ่ม"}
        </span>
        <button
          className="auto-outfit"
          onClick={() => onSelect(null)}
          aria-pressed={manualFile === null}
        >
          อัตโนมัติ <span>{manualFile === null ? "เปิด" : "ปิด"}</span>
        </button>
      </div>
      <div className="stages">
        {characterStages.map((stage) => {
          const locked = stage.minLevel > level;
          const wearing = stage.file === activeFile;
          return (
            <button
              key={stage.file}
              className={`stage ${wearing ? "current" : ""} ${locked ? "locked" : ""}`}
              onClick={() => setInspectedFile(stage.file)}
              aria-label={`${stage.label} ${locked ? "ยังไม่ปลดล็อก" : wearing ? "ใช้อยู่" : "ปลดล็อกแล้ว"}`}
              aria-pressed={wearing}
            >
              <span className="stage-status">
                {wearing ? "ใช้อยู่" : locked ? <GameIcon name="lock" /> : "✓"}
              </span>
              <img src={stage.file} alt={stage.label} loading="lazy" />
              <strong>
                Lv. {stage.minLevel}
                {stage.maxLevel ? `–${stage.maxLevel}` : "+"}
              </strong>
              <small>{stage.label}</small>
            </button>
          );
        })}
      </div>
      {inspected && (
        <Modal title={inspected.label} onClose={() => setInspectedFile(null)}>
          <div className="stage-detail">
            <img src={inspected.file} alt={inspected.label} />
            <p>
              {inspected.minLevel > level
                ? `ปลดล็อกเมื่อถึง Lv.${inspected.minLevel}`
                : inspected.file === activeFile
                  ? "ใช้อยู่"
                  : "ปลดล็อกแล้ว · เลือกชุดที่เป็นคุณ"}
            </p>
            <button
              className="primary full"
              disabled={inspected.minLevel > level}
              onClick={() => {
                onSelect(inspected.file);
                setInspectedFile(null);
              }}
            >
              {inspected.minLevel > level ? "ยังไม่ปลดล็อก" : "ใช้ชุดนี้"}
            </button>
            <p className="selection-note">
              เลือกเองแล้ว ชุดจะคงเดิมเมื่อ Level เพิ่ม
              <br />
              เปิดอัตโนมัติได้ที่ตู้เสื้อผ้า
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
}
