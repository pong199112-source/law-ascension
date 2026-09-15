# Phase 1 validation

ตรวจเมื่อ 15 กันยายน 2026 บน Windows / Node.js 24.18.0 / Chrome ผ่าน Playwright

## ผลการตรวจ

| รายการ | ผล |
| --- | --- |
| npm install | ผ่าน; dependency audit ไม่พบ vulnerability |
| npm run cf-typegen | ผ่าน; สร้าง Worker runtime types จาก Wrangler |
| npm run check:assets | ผ่าน: 6 characters + 2 design references |
| npm run typecheck | ผ่าน |
| npm run lint | ผ่าน |
| npm test | ผ่าน 5 tests: Level/XP, เลือกชุด, manual selection และ equipment state |
| npm run build | ผ่านทั้ง Workers และ client bundles |
| npm run test:e2e บน Vite dev | ผ่าน 2 tests |
| npm run test:e2e บน local Workers build preview | ผ่าน 2 tests |
| console / page errors / HTTP errors ใน browser test | ไม่พบ |
| git diff --check | ผ่าน |

## สิ่งที่ browser tests ตรวจจริง

- ขนาด viewport 1440, 1024, 768, 390 และ 320px: ไม่มี horizontal page overflow
- รูปทุกตัวโหลดสำเร็จ, หน้าแรกเป็นชุดสูท Lv.17
- Mobile: ตัวละครอยู่ก่อนรายวิชา, วิวัฒนาการเป็น horizontal scroll ภายใน panel
- ปฏิเสธเวลา 0 นาที, เพิ่มวิแพ่ง 240 นาทีแล้วเป็น Lv.20 / 50 XP และภาพชุดกากี
- ภารกิจรายวิชาและอ่านรวมสำเร็จ, ประวัติมีรายการถูกต้อง
- เลือกชุดสูทย้อนหลังที่ Lv.20, เพิ่มเป็น Lv.21 แล้วยังคงชุดสูท และเปิดโหมดอัตโนมัติเพื่อกลับชุดกากี
- ชุดที่ล็อกเลือกไม่ได้; ไอเทมสวม/ถอดแล้วอัปเดตทั้ง slot และกระเป๋า
- จับเวลา 65 วินาที → พัก 30 วินาทีโดยเวลาอ่านไม่เพิ่ม → อ่านต่อ 60 วินาที → บันทึก 2 นาที / 20 XP
- รีเฟรชคืนค่า mock เริ่มต้น
- Mobile touch: เพิ่มแพ่ง 30 นาที, Level รายวิชาเพิ่ม, เลือกกลับไปใช้เสื้อยืด และสวม/ถอดปากกา

## Visual review

ตรวจ screenshot Desktop และ Mobile ด้วยสายตา: ใช้ตัวละครจากชุดที่ผู้ใช้แนบเท่านั้น มีฉากห้องอ่านหนังสือ SVG แยกชั้น background/foreground, ชุดไอคอนวิชาที่วาดในระบบเดียวกัน, วิชาอยู่ซ้ายและภารกิจอยู่ขวาบน desktop; mobile เรียงใหม่ ใช้เมนูล่าง และเห็นตัวละคร อุปกรณ์กับปุ่มเริ่มอ่านครบใน viewport 390×844

- [Desktop](screenshots/desktop.png)
- [Mobile full page](screenshots/mobile.png)
- [Mobile viewport](screenshots/mobile-viewport.png)

Screenshots บันทึกจาก local Workers preview ของ build ที่ผ่าน tests ฟอนต์ถูกเสิร์ฟในเครื่อง

## ขอบเขตของผลตรวจ

ทดสอบ Chrome desktop และ mobile emulation; ไม่ได้ตรวจบนอุปกรณ์ iOS/Android จริงหรือ Safari ข้อมูล ชุดที่เลือก และไอเทมที่สวมอยู่ในหน่วยความจำและรีเซ็ตเมื่อ refresh; streak และภารกิจเป็น mock สำหรับทดลองในหน้าเดียว ไอเทมไม่มีโบนัส

ไม่ได้ทำ D1, Login/Auth, PIN, R2, production deploy หรือ Phase 2 รอผู้ใช้ตรวจ UI ก่อนเริ่มงานระยะถัดไป
