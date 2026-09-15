# LAW ASCENSION

เกมอ่านหนังสือกฎหมายแบบ RPG สำหรับเล่นคนเดียว เปลี่ยนเวลาที่อ่านจริงให้เป็น XP, Level, Daily Quest, Streak และการพัฒนาตัวละคร

## 5 วิชา
- แพ่ง
- อาญา
- วิแพ่ง
- วิอาญา
- ระเบียบศาล

## Character Progression
- Lv. 1–9 — เสื้อยืดธรรมดา
- Lv. 10–19 — ชุดสูท
- Lv. 20–29 — ชุดข้าราชการกากีขั้นต้น
- Lv. 30–39 — ชุดข้าราชการกากี + อุปกรณ์
- Lv. 40–49 — ชุดข้าราชการกากีขั้นสูง
- Lv. 50+ — ชุดปกติขาว

## Tech direction
- React
- TypeScript
- Vite
- Cloudflare Workers
- Cloudflare Vite Plugin
- Cloudflare D1 ใน Phase ถัดไป

เริ่มจาก `CODEX_MASTER_PROMPT.md` และ `docs/PHASE-1-SPEC.md`

## Phase 1 — Local prototype

ใช้ Node.js 24+ และ npm ติดตั้งและเปิดด้วย:

```sh
npm install
npm run cf-typegen
npm run dev
```

เปิด http://127.0.0.1:5173 — React + TypeScript ผ่าน Vite และ Cloudflare Vite Plugin โดยจำลอง Workers ในเครื่อง ไม่มีการ deploy

### ทดลอง UI

- เริ่มต้น Lv.17 ชุดสูท, 650/1,000 XP, อ่านสะสม 86 ชม. 35 นาที และ streak จำลอง 7 วัน
- “เริ่มอ่านวันนี้” ใช้ flow เลือกวิชา → เลือกกิจกรรม → เริ่มจับเวลา โดยวิชาและกิจกรรมเป็นข้อมูลคนละแกน
- กิจกรรมมี อ่านเนื้อหา, ทำข้อสอบ, ดูสรุป / Infographic และ Lecture / ทำความเข้าใจ เป้าหมายเริ่มต้นแก้ได้จาก `src/data/study.ts`
- Timer บันทึก checkpoint และให้ XP อัตโนมัติทุก 30 นาทีโดยไม่หยุดเวลา: อ่าน 20, ข้อสอบ 25, สรุป 15 และ Lecture 18 XP ต่อ checkpoint
- เมื่อจบ Session เศษเวลา 1–29 นาทีได้ XP แบบ prorated ที่ efficiency 75%; ตัวอย่างอ่าน 47 นาทีได้ 20 + 9 = 29 XP และภารกิจนับครบ 47 นาที
- “เพิ่มเวลาเอง” เลือกทั้งวิชา กิจกรรม และเวลา 1–720 นาที ได้ 85% ของ Timer XP แต่เวลาสะสมและภารกิจนับเต็ม
- XP เพิ่มพร้อมกันทั้ง Overall และวิชาที่เลือก; 1,000 XP = 1 Level และครบเป้าหมายกิจกรรมทั้ง 4 รับโบนัส +30 Overall XP อัตโนมัติหนึ่งครั้ง
- Session ทำข้อสอบกรอกจำนวนข้อและจำนวนที่ถูกได้แบบไม่บังคับ History จะแสดง Accuracy โดยคะแนนไม่กระทบ XP
- กดชุดที่ปลดล็อกแล้วเพื่อย้อนกลับไปใช้ชุดเดิมได้ การเลือกเองจะคงอยู่แม้ Level เพิ่ม และสลับกลับเป็นโหมดอัตโนมัติได้
- ไอเทม 6 ชิ้นกดสวม/ถอดแล้วเห็น SVG โปร่งใสซ้อนบนตัวละครทันที ใช้ anchor แยกตาม pose ของชุดทั้ง 6 ขั้น และสถานะตรงกับ slot/inventory
- ทุกอย่างอยู่ใน React state; รีเฟรชแล้วกลับสู่ mock เริ่มต้น ไม่มีการบันทึกข้ามการเปิดหน้า
- Daily Mission ติดตามกิจกรรมด้วยเวลาจริง ไม่ผูกกับวิชา; streak เป็น mock และวันสอบนับถอยหลังจากเวลาจริง

### ไฟล์หลัก

- `src/App.tsx` — หน้า Home และการเชื่อม interaction
- `src/components/AccessoryLayer.tsx` — SVG accessory 6 ชิ้นและ anchor configuration สำหรับ character poses ทั้ง 6 ขั้น
- `src/components/` — HUD icons, ตู้เสื้อผ้า, equipment slots, Progress และ native dialog
- `src/data/mock.ts`, `src/data/study.ts` — player, วิชา, activity goals และ XP config
- `src/domain/study.ts`, `src/hooks/useStudyEngine.ts` — checkpoint, partial/manual XP, mission bonus และ mock session state
- `src/domain/progression.ts`, `src/domain/customization.ts` — character Level, การเลือกชุด และ equip state
- `src/style.css` — desktop/tablet/mobile layouts, animation และ reduced motion
- `public/assets/characters/manifest.json` — source of truth ของ 6 ระดับ
- `worker/index.ts`, `wrangler.jsonc`, `vite.config.ts` — Workers / static asset / Vite configuration
- `tests/home.spec.ts` — ตรวจ runtime, responsive, timer และ flow การเพิ่มเวลา

### Validation

```sh
npm run check:assets
npm run typecheck
npm run lint
npm test
npm run build
# เปิด npm run dev ในอีก terminal ก่อนรันทดสอบเบราว์เซอร์
npm run test:e2e
```

Browser test ใช้ Google Chrome ที่ติดตั้งในเครื่อง ผ่าน Playwright แบบ headless และบันทึกภาพใน `docs/screenshots/` ตรวจขนาด 1440, 1024, 768, 390 และ 320px

ตรวจ build ที่เสิร์ฟผ่าน local Workers ด้วย `npm run preview` (ปกติ port 4173) แล้วกำหนด `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173` ก่อนรัน `npm run test:e2e`

Asset Pack ฉบับสมบูรณ์ถูกแตกและตรวจครบแล้ว จึงไม่เก็บ ZIP ซ้ำใน branch ภาพตัวละครทั้ง 6 ไม่ถูกแก้ไขหรือสร้างใหม่ Reference อยู่ใน `design-reference/` เพื่ออ้างอิงการออกแบบเท่านั้น ไม่ถูกเสิร์ฟเป็นหน้าเว็บ ฉากและ accessory SVG แยก layer จาก character assets ฟอนต์ Noto Sans Thai และ Nunito เสิร์ฟจาก dependency ภายในโปรเจกต์

**ขอบเขต:** จบที่ Phase 1 UI review เท่านั้น ยังไม่มี D1, Auth/Login, PIN, R2 หรือ production deploy
