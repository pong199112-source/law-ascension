# LAW ASCENSION — Phase 1 UI Prototype

## Goal
สร้าง Foundation + หน้า Home Prototype ที่ใช้งานได้จริง และให้ภาพรวมใกล้ `design-reference/dashboard-reference.png` มากที่สุด โดยใช้ assets ตัวละครจริงจาก `public/assets/characters/`

## Non-negotiable
- React + TypeScript + Vite + Cloudflare Workers + Cloudflare Vite Plugin
- UI ต้องเป็น component จริง ไม่ใช่เอา mockup ทั้งรูปมาแปะ
- ภาษาไทยเป็นหลัก
- Mobile ต้อง reflow ใหม่ ไม่ใช่ย่อ desktop
- ใช้ตัวละครจากไฟล์ที่ให้เท่านั้น ห้าม regenerate
- Phase 1 ใช้ mock data เท่านั้น
- ยังไม่ทำ D1, login, auth, R2, production deploy

## Home Screen
ด้านบน:
- LAW ASCENSION
- Overall Level เช่น Lv.17
- XP progress
- ชั่วโมงอ่านสะสม เช่น 86 ชม. 35 นาที
- Streak เช่น 7 วัน
- Countdown เช่น 42 วันถึงสอบ

วิชา 5 วิชา:
1. แพ่ง — Lv.12
2. อาญา — Lv.9
3. วิแพ่ง — Lv.14
4. วิอาญา — Lv.8
5. ระเบียบศาล — Lv.10

แต่ละวิชาแสดง icon, level, XP bar และสีแยกกัน

## Daily Quests
ตัวอย่าง mock:
- อ่านวิแพ่ง 60 นาที — 0/60
- อ่านอาญา 45 นาที — 0/45
- อ่านแพ่ง 30 นาที — 0/30 + badge ใกล้ Level Up
- อ่านระเบียบศาล 20 นาที — 0/20
- อ่านรวมวันนี้ครบ 3 ชั่วโมง — 0/180

ปุ่มหลัก: เริ่มอ่านวันนี้
ปุ่มรอง: + เพิ่มเวลาเอง / ดูประวัติ

## Character logic
ใช้ `public/assets/characters/manifest.json` เป็น source of truth
- Lv. 1–9 casual
- Lv. 10–19 suit
- Lv. 20–29 khaki
- Lv. 30–39 khaki plus
- Lv. 40–49 khaki advanced
- Lv. 50+ white uniform

ตั้ง mock player level = 17 เพื่อให้หน้าแรกแสดงชุดสูท
ต้องสามารถแก้ level ใน mock data แล้วภาพตัวละครสลับอัตโนมัติ

## Character Progression Panel
แสดง thumbnail 6 ขั้นในแนวนอนบน desktop และ horizontal scroll บน mobile
- current stage highlight
- locked stages มองเห็นได้แต่ลด opacity + lock icon

## Item Panel
placeholder เท่านั้น:
- แว่น
- ปากกา
- กระเป๋า
- นาฬิกา
- Tablet
- ID card

## Visual style
- 2D cartoon/chibi
- warm, cozy, playful
- rounded cards
- soft shadows
- clean typography
- modern ไม่เชย
- ไม่ใช่ business dashboard
- animation เบา ๆ: character breathe/float, hover/tap, progress transition

## Completion checklist
- install dependencies
- typecheck
- lint หากตั้งไว้
- build ผ่าน
- ไม่มี console error
- ตรวจ desktop + mobile
- สรุปไฟล์หลัก
- ระบุสิ่งที่ defer ไป Phase 2
- อย่าเริ่ม Phase 2 จน UI ผ่าน
