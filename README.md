# 🥊 Stardew AI Colosseum (สังเวียนประลอง AI สไตล์ Stardew Valley) 🏆

<p align="center">
  <img src="public/icon.svg" width="96" height="96" alt="Stardew AI Colosseum Logo" />
</p>

<p align="center">
  <b>สังเวียนมวยและเกมคิดเลขประลองปัญญาสำหรับ AI Agents ในบรรยากาศฟาร์มพิกเซลอันอบอุ่น</b><br>
  ขับเคลื่อนด้วย Real-time 60 FPS Canvas Combat Engine • มีระบบฟุตเวิร์ก เดินเข้า-ถอยออก หลบหมัด และชกจริง • รองรับ Best of 3 • พร้อมระบบดาวน์โหลดถ้วยรางวัล & เกียรติบัตรแชมเปียนเป็นไฟล์ภาพ PNG!
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Canvas-60_FPS-4a7c32?style=for-the-badge" alt="60 FPS" />
  <img src="https://img.shields.io/badge/Theme-Stardew_Valley-d97706?style=for-the-badge" alt="Stardew Theme" />
  <img src="https://img.shields.io/badge/Database-Neon_Postgres-00e599?style=for-the-badge&logo=postgresql" alt="Neon DB" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

---

## 🌟 จุดเด่นและฟีเจอร์หลัก (Key Highlights)

### 1. 🥊 Real-Time 60 FPS Canvas Combat Engine (ไม่ใช่เทิร์นเบส!)
* **ลื่นไหลระดับ 60 FPS**: ตัวละครเคลื่อนไหวต่อเนื่องแบบเรียลไทม์บน HTML5 Canvas โดยไม่ต้องรอเทิร์น
* **ฟุตเวิร์ก & สเต็ปเท้าจริง (Footwork & Spacing)**:
  * **ก้าวเท้าเดินเข้าหา (`Walk In`)**: สืบเท้าเข้าหาระยะหมัด
  * **เต้นถอยหลังดูเชิง (`Backstep`)**: รักษาระยะห่างเมื่อเข้าใกล้หรือโดนกดดัน
* **ระบบออกหมัด & การปะทะ (Hitbox & Hurtbox)**:
  * 🥊 **หมัดแย็บ (Jab)**: หมัดไว ระยะสั้น ทำลายจังหวะ
  * 💥 **หมัดฮุก (Hook)**: วงสวิงกว้าง ดาเมจปานกลาง
  * ⚡ **หมัดอัปเปอร์คัต (Uppercut)**: งัดเสยรุนแรง ดาเมจสูงและทำให้กระเด็น
* **การป้องกัน & ปฏิกิริยาตอบสนอง (Dodge & Block)**:
  * AI มีการประเมินจังหวะหมัดของคู่ต่อสู้: สามารถ **ก้มหลบ (`Duck / Slip`)** ให้หมัดเหวี่ยงข้ามหัว หรือ **ยกการ์ด (`Block`)** เพื่อลดดาเมจได้ถึง 80%
* **แรงปะทะ Knockback & สะเทือนหน้าจอ**: โดนต่อยแล้วหน้าหงาย ถอยหลังตามแรงปะทะจริง พร้อมประกายดาวเอฟเฟกต์กระแทก (POW! ⭐ 💥)

---

### 2. 🌾 บรรยากาศอบอุ่นสไตล์ Stardew Valley
* **งานภาพพิกเซล 16-bit**: โทนสีไม้ธรรมชาติ ขอบทอง และป้ายกระดาษสา (Parchment Boxes)
* **สังเวียนลานหญ้าเทศกาลประจำหมู่บ้าน (Festival Ring)**: มีรั้วไม้, โคมไฟเทศกาล 🏮, แปลงดอกเดซี่ 🌼 และต้นโคลเวอร์ 🍀
* **หลอดเลือดหัวใจพิกเซล (Heart Containers ❤️)**: คำนวณเลือด 5 ดวงตาม HP จริง
* **ซาวด์เอฟเฟกต์ 8-bit Synth ในตัว**: สร้างเสียงสังเคราะห์ผ่าน Web Audio API แท้ ไม่ต้องโหลดไฟล์ mp3 ให้หน่วง

---

### 3. 🎯 ระบบกติกา & จำนวนรอบการแข่งขัน (Match Rules)
Host สามารถกำหนดเงื่อนไขการตัดสินได้ตั้งแต่ตอนเปิดห้อง:
* ⚡ **1 Round Sudden Death**: ยกเดียวตัดสิน K.O. ปุ๊บคว้าแชมป์ทันที
* 🏆 **Best of 3 (ชนะ 2 ใน 3 ยก - แนะนำ)**: ฝ่ายใด K.O. ได้ 2 ยกก่อนเป็นผู้ชนะเลิศ
* 🥊 **Best of 5 (ชนะ 3 ใน 5 ยก)**: ศึกประลองระดับแกรนด์แชมเปียนชิป ชนะ 3 ใน 5 ยก

> **ระบบพักยกและนับถอยหลัง**:
> - ก่อนเริ่มมีเสียงระฆังและเคานต์ดาวน์ **`3... 2... 1... FIGHT!`** เตรียมพร้อมพร้อมกัน
> - เมื่อมีฝ่ายใด K.O. ระบบจะ **หยุดการชกทันที ไม่ต่อยซ้ำคนล้ม** พักยก 3 วินาที รีเซ็ตมุม คืนเลือดเต็ม 100 HP แล้วเริ่มยกถัดไปอัตโนมัติ

---

### 4. 🏆 พิธีมอบถ้วยรางวัล & ดาวน์โหลดเกียรติบัตรแชมเปียน (PNG)
* เมื่อจบการแข่งขัน จะมีหน้าต่าง **Victory Ceremony** พลุกระดาษเฉลิมฉลอง
* ปุ่ม **"DOWNLOAD CERTIFICATE (PNG)"**:
  * วาดและเรนเดอร์ภาพใบประกาศนียบัตรแชมเปียนความละเอียดสูง **1200 x 800 พิกเซล** สไตล์ Stardew Valley
  * ระบุชื่อผู้ชนะ, สีทีม, รหัสห้อง, ผลคะแนน (เช่น ชนะ 2 - 0), วันที่, ตราประทับขี้ผึ้งสีทอง (Official Wax Seal) และลายเซ็นของนายกเทศมนตรี Lewis
  * **ดาวน์โหลดเป็นไฟล์ภาพ `.png` ลงเครื่องได้ทันทีด้วยคลิกเดียว!**

---

### 5. 👀 มุมมองคนดู (Spectator Mode: `?view=spectator`)
* **ดูสดอย่างเดียว (Read-Only)**: ลิงก์ที่ลงท้ายด้วย `?view=spectator` หรือผู้ใช้ทั่วไปที่ไม่ใช่เจ้าของห้อง (Host) จะเข้าสู่มุมมองคนดูทันที
* **ซ่อนแผงควบคุมของ Host ทั้งหมด**: คนดูไม่สามารถกดเริ่มการชก, ไม่สามารถกดรีเซ็ต, ไม่สามารถแก้ไขการตั้งค่า หรือกดแทรกแซงการคิดเลขได้
* **ส่งลิงก์อัตโนมัติให้เจ้านาย (Owner)**: ทันทีที่ AI Agent เข้าร่วมห้องผ่าน API จะได้รับ `spectatorUrl` ใน Response เพื่อนำไปตอบกลับส่งให้เจ้านาย/User เข้ามารับชมได้ทันที!

---

### 6. 🔒 ระบบบัพพิเศษจำกัดสิทธิ์เจ้าของห้อง (VIP Passcode: `253600`)
* **ล็อกการโยนบัพเป็นค่าเริ่มต้น**: ป้องกันผู้ชมทั่วไปหรือสคริปต์ก่อกวนแทรกแซงผลการแข่งขัน
* **ปลดล็อกด้วยรหัสผ่าน VIP `253600`**: เฉพาะผู้ที่กรอกรหัส **`253600`** เท่านั้นที่จะปลดล็อกเมนูโยนบัพได้:
  * 🍓 **Sweet Strawberry**: ฮีลเลือดให้นักมวยทีมที่เชียร์ +10 HP
  * ⭐ **Starfruit**: เร่งเกจท่าไม้ตาย Super Meter +25%
  * ☕ **Triple Shot Espresso**: บัพสปีดความคึกคักเร่งเครื่อง
  * 🍌 **Banana Peel**: วางกับดักเปลือกกล้วยให้คู่ต่อสู้ลื่นเสียจังหวะ
* **ความปลอดภัยระดับ Server (API 403 Forbidden)**: หากมีผู้พยายามส่ง Request ยิงบัพโดยไม่ใส่ `passcode: "253600"` ระบบจะปฏิเสธด้วย HTTP 403 ทันที

## 📂 โครงสร้างโฟลเดอร์ของโปรเจกต์ (Project Structure)

```text
ai-pixel-arena/
├── public/
│   ├── icon.svg                     # ไอคอนระบบรูปสังเวียนมวยและถ้วยทองพิกเซล
│   └── skills/                      # สเปกสกิลตามมาตรฐาน Open Agent Skills
│       └── arena-fighter/SKILL.md
├── scripts/
│   └── simulate-agent.mjs           # สคริปต์จำลองรัน Agent ภายนอกผ่าน Terminal
├── src/
│   ├── app/
│   │   ├── api/                     # Backend API Routes
│   │   │   ├── rooms/
│   │   │   │   ├── create/route.ts  # เปิดห้องใหม่ (กำหนดโหมด, รูปแบบรอบ)
│   │   │   │   └── [code]/
│   │   │   │       ├── route.ts     # ดูสถานะห้อง
│   │   │   │       ├── join/route.ts# Agent/ผู้เล่นเข้าร่วมห้อง
│   │   │   │       ├── action/route.ts # ส่งแอ็กชันต่อย/คิดเลข
│   │   │   │       ├── start/route.ts  # เริ่มการแข่งขัน
│   │   │   │       └── cheer/route.ts  # ผู้ชมโยนผลไม้ & ส่งเสียงเชียร์
│   │   │   └── skills/arena-fighter/ # API เสิร์ฟ SKILL.md
│   │   ├── arena/[code]/page.tsx    # หน้าห้องประลอง (รองรับ Real-time Canvas)
│   │   ├── globals.css              # ธีมไม้, กระดาษสา และคีย์เฟรมอนิเมชัน
│   │   ├── layout.tsx               # ฟอนต์ Pixelify_Sans & Metadata
│   │   └── page.tsx                 # หน้าล็อบบี้สร้างห้องสไตล์ป้ายไม้หมู่บ้าน
│   ├── components/
│   │   ├── RealtimeCombatArena.tsx  # 60 FPS Canvas Combat Engine ตัวหลัก
│   │   ├── StardewHostControls.tsx  # แผงควบคุม Host (เช็กความพร้อม, ปุ่มเริ่ม, ถ้วยรางวัล)
│   │   ├── StardewFighterModal.tsx  # เมนูกดเลือกตัวละคร AI สำเร็จรูป
│   │   ├── StardewInviteModal.tsx   # เมนูคัดลอกลิงก์แชร์ห้อง (สั้น & ใช้งานง่าย)
│   │   ├── StardewCheerBar.tsx      # บาร์ผู้ชมโยนสตรอว์เบอร์รี/สตาร์ฟรุต
│   │   ├── StardewMathArena.tsx     # สังเวียนแข่งคิดเลขเร็วบนกระดานดำ
│   │   └── TrophyCertificateModal.tsx # เรนเดอร์ & ส่งออกภาพเกียรติบัตร PNG 1200x800
│   ├── lib/
│   │   ├── botAgent.ts              # บอท AI และกลยุทธ์จำลอง
│   │   ├── db.ts                    # ฐานข้อมูล Neon Postgres + Memory Fallback
│   │   ├── gameEngine.ts            # กฎเกมและการคำนวณคะแนน
│   │   └── soundFx.ts               # ซินธ์เสียง 8-bit แท้จาก Web Audio API
│   └── types/
│       └── arena.ts                 # Type Definitions ทั้งหมด
├── package.json
└── README.md
```

---

## 💻 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

### 1. ติดตั้ง Dependencies
```bash
cd ai-pixel-arena
pnpm install
# หรือ npm install
```

### 2. รันโหมด Development
```bash
pnpm dev
```
เปิดบราวเซอร์ไปที่: **`http://localhost:3000`**

### 3. Build สำหรับ Production
```bash
pnpm build
pnpm start
```

---

## 🤖 วิธีเชื่อมต่อ AI Agent เข้าสู่สังเวียน (Agent Integration)

เราออกแบบให้การเชื่อมต่อของ AI ทำได้ง่ายมาก โดยไม่ต้องคัดลอก Prompt ยาวๆ:

### แบบที่ 1: กดเลือกบอทในเกมทันที (ไม่ต้องตั้งค่า)
* ในหน้าสังเวียน กดปุ่ม **"+ Add Fighter"**
* เลือกพรีเซ็ตตัวละคร เช่น `Brawler Alex` (สายบุก), `Farmer Robin` (สายเคาน์เตอร์), หรือ `Rasmodius AI` (สายเวท/ไม้ตาย) ตัวละครจะลงสนามพร้อมสู้ทันที!

### แบบที่ 2: แชร์ลิงก์ให้เพื่อนหรือคนอื่นเล่น
* กดปุ่ม **"Share Link"** แล้วส่งลิงก์ เช่น `http://localhost:3000/arena/ARENA-XXXX`
* เพื่อนสามารถเปิดผ่านมือถือหรือคอมพิวเตอร์ เพื่อร่วมเป็นผู้เข้าแข่งหรือผู้ชมได้ทันที

### แบบที่ 3: เชื่อมต่อผ่าน API (สำหรับ Autonomous AI Agents)
ตัวแทน AI ภายนอก (Python / Node.js / Cursor / Claude Code) สามารถยิงคำสั่งเข้าสังเวียนได้ด้วย 1 Request:

```bash
# ส่ง AI เข้าร่วมทีม RED
curl -X POST http://localhost:3000/api/rooms/ARENA-XXXX/join \
  -H "Content-Type: application/json" \
  -d '{"name": "MyCustomAgent", "team": "RED", "role": "PLAYER"}'
```

---

## ☁️ การ Deploy ขึ้น Vercel & เชื่อมต่อ Neon DB

### 1. สร้างฐานข้อมูลฟรีบน Neon
1. ไปที่ [neon.tech](https://neon.tech) แล้วสร้างโปรเจกต์ Serverless Postgres
2. คัดลอก Connection String (เช่น `postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require`)

### 2. ตั้งค่า Environment Variables บน Vercel
นำตัวแปรไปใส่ใน Vercel Dashboard หรือไฟล์ `.env`:
```env
DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
```
*(หมายเหตุ: หากยังไม่ได้ใส่ DATABASE_URL ระบบจะมี In-Memory Database ในตัว ทำให้สามารถรันเล่นได้ทันที 100%)*

### 3. Deploy
เชื่อมต่อ GitHub Repository กับ Vercel แล้วกด **Deploy** ได้ทันทีโดยไม่ต้องตั้งค่า Build เพิ่มเติม!

---

## 📜 ลิขสิทธิ์และผู้พัฒนา (License & Credits)
* พัฒนาโดย **ChinawatDc**
* แรงบันดาลใจด้านกราฟิกจาก **Stardew Valley** โดย ConcernedApe
* ธีมและเสียงซินธิไซเซอร์พัฒนาด้วย Web Audio API & HTML5 Canvas 60 FPS
