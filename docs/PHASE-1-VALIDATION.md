# Phase 1 validation

ตรวจเมื่อ 15 กันยายน 2026 บน Windows / Node.js 24.18.0 / Google Chrome ผ่าน Playwright โดยใช้ production Workers preview ที่ `http://127.0.0.1:4173`

## ผลการตรวจ

| รายการ | ผล |
| --- | --- |
| npm run check:assets | ผ่าน: character ต้นฉบับ 6 ภาพ, design references 2 ภาพ และ environment 2 layers |
| npm run typecheck | ผ่าน |
| npm run lint | ผ่าน ไม่มี error/warning |
| npm test | ผ่าน 10 tests |
| npm run test:e2e | ผ่าน 6 tests บน production preview |
| npm run build | ผ่านทั้ง Workers และ client bundles |
| console / page / HTTP errors | ไม่พบใน browser test |
| git diff --check | ผ่าน |

## Unit tests

- Character manifest ครบทุกขอบเขต Level และ manual outfit ยังคงทำงาน
- Equipment state สวม/ถอดแต่ละ slot โดยไม่แก้ state เดิม
- Activity checkpoint ที่ 30 และ 60 นาทีให้ XP ถูกต้อง
- Session อ่าน 47 นาทีได้ 20 checkpoint XP + 9 partial XP = 29 XP
- Manual entry ได้ 85% ของ Timer XP
- XP เพิ่มกับ track ของวิชาที่เลือกและข้าม Level ได้ถูกต้อง
- Question result เป็น optional; 28 ข้อ ถูก 22 ได้ Accuracy 79%
- Daily completion bonus พร้อมรับเพียงครั้งเดียว

## Browser tests และ visual review

- Layered accessories แสดง/หายทันทีเมื่อ equip/unequip และสถานะตรงกันใน slot กับ inventory
- เปลี่ยนจากชุดสูทเป็นเสื้อยืดแล้ว accessory ยังคงอยู่และเปลี่ยนไปใช้ anchor ของ stage ใหม่
- ตรวจ responsive ที่ 1440, 1024, 768, 390 และ 320px โดยไม่มี horizontal overflow
- Mobile reflow วางตัวละครก่อน Subject panel และเมนูเป็น bottom navigation
- Manual วิแพ่ง + ทำข้อสอบ 30 นาทีได้ 21 XP, Subject XP เพิ่ม, Mission เพิ่ม 30 นาที และ History แสดง Accuracy
- Timer checkpoint 30/60 นาทีเพิ่มเวลาและ XP อัตโนมัติ; เมื่อจบที่ 60 นาทีไม่ double count
- Timer 47 นาทีบันทึกเวลาจริง 47 นาทีและ +29 XP
- ทำข้อสอบครบ 30 นาทีถือเป็น checkpoint เต็ม +25 XP และเก็บผลข้อสอบ optional
- ทำครบเป้าหมายกิจกรรมทั้ง 4 ได้โบนัส +30 Overall XP ครั้งเดียว
- Screenshot ใหม่บันทึกจาก production build พร้อม accessory layers:
  - [Desktop](screenshots/desktop.png)
  - [Mobile full page](screenshots/mobile.png)
  - [Mobile viewport](screenshots/mobile-viewport.png)

## ขอบเขต

ข้อมูลทั้งหมดเป็น React mock state และรีเซ็ตเมื่อ refresh ไม่มี D1, persistence, Login/Auth/PIN, R2, production deploy หรือ Phase 2 ภาพ character WebP ต้นฉบับทั้ง 6 ไม่ถูกแก้ไขหรือ regenerate และลบ source ZIP ที่ซ้ำหลังยืนยันว่า extracted assets ครบแล้ว
