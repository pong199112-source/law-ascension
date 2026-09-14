# Prompt สำหรับ Codex — LAW ASCENSION Phase 1

ทำงานใน repository `pong199112-source/law-ascension`

สร้างเว็บเกมส่วนตัวชื่อ **LAW ASCENSION** ตาม `docs/PHASE-1-SPEC.md`

## วิธีทำงาน
1. อ่าน README, Phase 1 spec, character manifest และดูรูปใน `design-reference/`
2. อ่าน `asset-source/README.md` และแตก `asset-source/law-ascension-assets-webp.zip` ลง repository root ก่อนเริ่มทำ UI
3. ตรวจ assets 6 ตัวใน `public/assets/characters/`
4. จัดการ scaffold, dependency, config, folder และไฟล์ทั้งหมดเอง
5. ห้ามให้ผู้ใช้ต้องสร้างหรือย้ายไฟล์ด้วยมือ
6. ใช้ branch `codex/phase-1-ui-prototype` ที่มีอยู่แล้ว หากไม่มีจึงค่อยสร้าง
7. ทำงาน Phase 1 เท่านั้น
8. ใช้ mock data แยกจาก UI components เพื่อพร้อมเปลี่ยนเป็น D1 ภายหลัง
9. ห้ามใช้ design reference เป็น full-page background
10. ห้าม regenerate ตัวละคร
11. ห้ามใส่ secret, token หรือ credential ลง repository

## Tech
- React
- TypeScript
- Vite
- Cloudflare Workers
- Cloudflare Vite Plugin
- Wrangler

## UI priority
ภาพตัวละครคือ visual focus ของหน้า Home และต้องมีความรู้สึกเป็นเกม 2D น่ารักทันสมัย ไม่ใช่ dashboard บริษัท

Desktop ให้จัดองค์ประกอบใกล้ reference ส่วน Mobile ต้องออกแบบ reflow ให้ใช้ได้จริงด้วยนิ้ว

## Validation
ก่อนจบงานให้รัน dependency install, typecheck, lint, build และตรวจ console/runtime errors เท่าที่ทำได้

เมื่อเสร็จ:
- commit งาน
- เปิด PR เข้า `main`
- สรุปสิ่งที่ทำ
- รายงาน test/build
- แนบ screenshot desktop/mobile ถ้าสภาพแวดล้อมทำได้
- หยุดรอ review ก่อน Phase 2
