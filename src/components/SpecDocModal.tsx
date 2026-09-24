import React, { useState } from 'react';
import { X, BookOpen, Copy, Check, ChevronDown, ChevronRight, Layers, Database, Code, Heart, Sparkles } from 'lucide-react';
import { APP_NAMING_IDEAS } from '../data/femtechKnowledge';

interface SpecDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecDocModal: React.FC<SpecDocModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 1, title: '1. BRANDING, VISUAL STYLE & APP NAMING' },
    { id: 2, title: '2. USER ONBOARDING & PROFILE MANAGEMENT' },
    { id: 3, title: '3. CORE FEATURES & FUNCTIONALITIES' },
    { id: 4, title: '4. PHASE-BASED HEALTH & NUTRITION GUIDE' },
    { id: 5, title: '5. DATA SUMMARY & MEDICAL REPORT' },
    { id: 6, title: '6. UI/UX DESIGN & WIREFRAME BLUEPRINT' },
    { id: 7, title: '7. TECHNICAL ARCHITECTURE & DATABASE SCHEMA' },
  ];

  const sqlSchemaCode = `-- ==========================================
-- AURA-FEMTECH: POSTGRESQL PRODUCTION SCHEMA
-- ==========================================

-- 1. ตารางข้อมูลผู้ใช้งาน (Users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    nickname VARCHAR(60) NOT NULL,
    avatar_id VARCHAR(50) DEFAULT 'mascot',
    goal VARCHAR(30) DEFAULT 'track_period', -- 'track_period', 'trying_to_conceive', 'contraception', 'pcos_health'
    average_cycle_length INT DEFAULT 28 CHECK (average_cycle_length BETWEEN 20 AND 60),
    average_period_duration INT DEFAULT 5 CHECK (average_period_duration BETWEEN 2 AND 10),
    pin_hash VARCHAR(255),
    is_pin_enabled BOOLEAN DEFAULT FALSE,
    partner_code VARCHAR(16) UNIQUE,
    partner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตารางประวัติรอบเดือน (Cycles)
CREATE TABLE cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length_days INT,
    period_duration_days INT NOT NULL DEFAULT 5,
    is_ovulation_confirmed BOOLEAN DEFAULT FALSE,
    estimated_ovulation_date DATE,
    is_abnormal BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cycles_user_start ON cycles(user_id, start_date DESC);

-- 3. ตารางบันทึกประจำวัน (DailyLogs)
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    is_period_day BOOLEAN DEFAULT FALSE,
    flow_level VARCHAR(20), -- 'none', 'spotting', 'light', 'medium', 'heavy'
    blood_color VARCHAR(30), -- 'bright_red', 'dark_red', 'brown', 'pink'
    cervical_mucus VARCHAR(30), -- 'dry', 'sticky', 'creamy', 'egg_white', 'watery'
    energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
    sleep_hours NUMERIC(3,1),
    stress_level INT CHECK (stress_level BETWEEN 1 AND 5),
    water_glasses INT DEFAULT 0,
    had_intercourse BOOLEAN DEFAULT FALSE,
    is_protected_sex BOOLEAN DEFAULT TRUE,
    bbt_celsius NUMERIC(4,2), -- Basal Body Temperature e.g. 36.65
    user_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, log_date)
);
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date DESC);

-- 4. ตารางคลังอาการ (Symptoms Master)
CREATE TABLE symptoms (
    id VARCHAR(50) PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'physical', 'digestive', 'energy', 'emotional'
    icon_name VARCHAR(50) NOT NULL
);

-- 5. ตารางเชื่อมโยงอาการที่บันทึกในแต่ละวัน (DailyLog_Symptoms)
CREATE TABLE daily_log_symptoms (
    log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
    symptom_id VARCHAR(50) NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
    severity INT DEFAULT 1 CHECK (severity BETWEEN 1 AND 3),
    PRIMARY KEY (log_id, symptom_id)
);

-- 6. ตารางคำแนะนำฮอร์โมนและโภชนาการ (Recommendations)
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_phase VARCHAR(20) NOT NULL, -- 'menstrual', 'follicular', 'ovulation', 'luteal'
    category VARCHAR(30) NOT NULL, -- 'food_eat', 'food_avoid', 'exercise', 'self_care'
    title VARCHAR(150) NOT NULL,
    content_th TEXT NOT NULL,
    gynecologist_note TEXT,
    nutritionist_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const algorithmCode = `/**
 * FemTech Cycle Prediction Algorithm (Clinical Standard)
 * Based on 14-day Biological Luteal Phase Constant
 */
interface CycleInput {
  lastPeriodStartDate: Date;
  userAverageCycleLength: number; // e.g. 28 days
  periodDuration: number;         // e.g. 5 days
  pastCycles: { cycleLength: number }[];
}

export function predictCycleEvents(input: CycleInput) {
  const { lastPeriodStartDate, userAverageCycleLength, periodDuration, pastCycles } = input;

  // 1. คำนวณค่าเฉลี่ยความยาวรอบเดือนถ่วงน้ำหนัก
  let effectiveCycleLength = userAverageCycleLength;
  if (pastCycles.length >= 2) {
    const sum = pastCycles.reduce((acc, c) => acc + c.cycleLength, 0);
    effectiveCycleLength = Math.round(sum / pastCycles.length);
  }

  // 2. คำนวณวันเริ่มประจำเดือนรอบถัดไป
  // Next Period Start Date = Start Date + Cycle Length
  const nextPeriodDate = new Date(lastPeriodStartDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + effectiveCycleLength);

  // 3. คำนวณวันไข่ตก (Ovulation Day)
  // ทางสูตินรีเวช: Luteal Phase มักคงที่ 14 วันก่อนประจำเดือนรอบถัดไป
  // Ovulation Date = Next Period Date - 14 วัน
  const ovulationDate = new Date(nextPeriodDate);
  ovulationDate.setDate(ovulationDate.getDate() - 14);

  // 4. คำนวณหน้าต่างเจริญพันธุ์ (Fertile Window)
  // อสุจิมีชีวิตในโพรงมดลูกได้สูงสุด 5 วัน + ไข่อยู่ได้ 1 วัน
  // Fertile Window = Ovulation Date - 5 วัน จนถึง Ovulation Date + 1 วัน
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  return {
    effectiveCycleLength,
    nextPeriodDate,
    ovulationDate,
    fertileWindow: {
      start: fertileStart,
      end: fertileEnd
    }
  };
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-rose-100 my-4 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/40">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
              FEMTECH PRODUCT DESIGN & ARCHITECTURE DOCUMENT
            </span>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-500" />
              คู่มือสถาปัตยกรรมและการพัฒนาแอปพลิเคชัน AuraFem (ฉบับสมบูรณ์)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto gap-2 px-6 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0 text-xs font-semibold">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700 text-xs leading-relaxed">
          {activeSection === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                1. BRANDING, VISUAL STYLE & APP NAMING (การตั้งชื่อ สไตล์ภาพ และอัตลักษณ์แบรนด์)
              </h3>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">
                  1.1 ไอเดียชื่อแอปพลิเคชัน 8 ชื่อ แบ่งตาม 3 แนวคิด พร้อม Tagline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {APP_NAMING_IDEAS.map((cat, idx) => (
                    <div key={idx} className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
                      <p className="font-bold text-rose-900 text-[11px]">{cat.category}</p>
                      <div className="space-y-1.5">
                        {cat.names.map((n, i) => (
                          <div key={i} className="p-2 bg-white rounded-xl border border-rose-100/60">
                            <p className="font-bold text-slate-800 text-xs">{n.name}</p>
                            <p className="text-[10px] text-slate-500 italic mt-0.5">"{n.tagline}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  1.2 Mood & Tone และ Color Palette ในสไตล์ "Minimalist & Cute"
                </h4>
                <p>
                  ใช้ทฤษฎีสี 60-30-10 เพื่อสร้างความผ่อนคลาย (Stress-Free Healthcare) ไม่ให้ผู้ใช้รู้สึกเหมือนกำลังเปิดโปรแกรมโรงพยาบาล:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#FFF8F8] border border-rose-100 text-slate-800">
                    <p className="font-bold">60% Canvas</p>
                    <p className="text-[10px] text-slate-500">#FFF8F8 Warm Whisper</p>
                    <p className="text-[9px] text-slate-400 mt-1">พื้นหลังขาวละมุนตา ลดแสงจ้า</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFE4E6] border border-rose-200 text-rose-900">
                    <p className="font-bold">30% Surfaces</p>
                    <p className="text-[10px] text-rose-700">#FFE4E6 Soft Blush</p>
                    <p className="text-[9px] text-rose-600 mt-1">การ์ดเนื้อหา ขอบเขตละมุน</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E11D48] text-white">
                    <p className="font-bold">10% Primary Action</p>
                    <p className="text-[10px] text-rose-100">#E11D48 Rose Berry</p>
                    <p className="text-[9px] text-rose-200 mt-1">ปุ่ม CTA และจุดเน้นสำคัญ</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#8B5CF6] text-white">
                    <p className="font-bold">Phase Accents</p>
                    <p className="text-[10px] text-purple-100">#8B5CF6 Lilac, #10B981</p>
                    <p className="text-[9px] text-purple-200 mt-1">สีแทน 4 ระยะฮอร์โมน</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  1.3 สัญลักษณ์และมาสคอต "น้องออร่า (Luna Mascot)"
                </h4>
                <p>
                  มาสคอตคือหยดน้ำสีพีช-ชมพูพาสเทลที่มีใบไม้งอกเล็กๆ สื่อถึง "การกำเนิดและความเป็นธรรมชาติ" แสดงสีหน้าและให้คำแนะนำแบบอบอุ่น ไม่ใช้คำศัพท์การแพทย์ที่น่ากลัว เพื่อลดความกังวลใจเรื่องสุขภาพและอาการ PMS
                </p>
              </div>
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                2. USER ONBOARDING & PROFILE MANAGEMENT (ระบบบัญชีและการตั้งค่าผู้ใช้)
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <span className="font-bold text-slate-800">ระบบเข้าสู่ระบบ:</span> รองรับ Email/Password พร้อม Social Login (Apple ID, Google One-Tap) ออกแบบแบบ Low-Friction สามารถเลือกใช้งานแบบ Guest Mode ได้ทันที และซิงค์ขึ้น Cloud ในภายหลัง
                </li>
                <li>
                  <span className="font-bold text-slate-800">Onboarding Flow 4 ขั้นตอน:</span>
                  <ol className="list-decimal list-inside pl-4 mt-1 space-y-1 text-slate-600">
                    <li>ตั้งชื่อเล่น (Nickname) และเลือกอวาตาร์น่ารัก</li>
                    <li>เลือกเป้าหมายสุขภาพ: ติดตามรอบเดือนปกติ / เตรียมพร้อมมีบุตร / คุมกำเนิดธรรมชาติ / สังเกตสุขภาพ PCOS</li>
                    <li>ระบุประวัติเบื้องต้น: ความยาวรอบเดือนเฉลี่ย (Default 28 วัน) และระยะเวลาที่มีประจำเดือน (Default 5 วัน)</li>
                    <li>ใส่วันแรกที่ประจำเดือนรอบล่าสุดเริ่มมา เพื่อให้ระบบทำนายรอบและระยะฮอร์โมนได้ทันที</li>
                  </ol>
                </li>
                <li>
                  <span className="font-bold text-slate-800">ระบบความเป็นส่วนตัว (PIN Lock & Privacy Screen):</span> มีรหัส PIN 4 หลักเพื่อป้องกันคนรอบข้างเปิดดูโทรศัพท์ พร้อมฟังก์ชัน Mask ข้อมูลอัตโนมัติเมื่อพับหน้าจอ
                </li>
              </ul>
            </div>
          )}

          {activeSection === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                3. CORE FEATURES & FUNCTIONALITIES (ระบบการทำงานหลัก)
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800">1. Period & Symptom Tracker (ระบบบันทึกเน้นไอคอน)</h4>
                  <p className="mt-1 text-slate-600">
                    ลดความเหนื่อยล้าในการพิมพ์ด้วยการแตะเลือกไอคอนน่ารัก: ปริมาณเลือด (Spotting, Light, Medium, Heavy), สีเลือด (แดงสด, แดงเข้ม, น้ำตาล, ชมพู), อาการทางกาย (ปวดท้อง, คัดตึงเต้านม, ปวดหลัง, สิวฮอร์โมน), อารมณ์, พลังงาน, การนอน และการดื่มน้ำ
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800">2. Cycle Analytics & 4 Phases Prediction (การทำนาย 4 ระยะ)</h4>
                  <p className="mt-1 text-slate-600">
                    วิเคราะห์ฮอร์โมน 4 ระยะ: Menstrual (วันที่มีเลือด), Follicular (ไข่กำลังสุก ผิวใส), Ovulation (ไข่ตก เจริญพันธุ์สูงสุด), Luteal (เตรียมมดลูก มี PMS) พร้อมคำนวณวันไข่ตกและวันรอบถัดไปแบบเรียลไทม์
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800">3. Partner Sync & Gentle Reminders (ระบบคู่รัก & แจ้งเตือน)</h4>
                  <p className="mt-1 text-slate-600">
                    "AuraCare Link" เชื่อมต่อกับแฟนผ่านรหัสโค้ด แปลงข้อมูลฮอร์โมนของผู้หญิงให้เป็นคู่มือดูแลที่ผู้ชายเข้าใจง่าย (สิ่งที่ควรทำ, คำพูดที่ควรเลี่ยง, ขนมที่ควรซื้อมาฝาก) พร้อมเตือนล่วงหน้า 2 วันก่อนเมนส์มาอย่างนุ่มนวล
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                4. PHASE-BASED HEALTH & NUTRITION GUIDE (คำแนะนำโภชนาการและการรับมือ)
              </h3>
              <p className="text-slate-600">
                พัฒนาโดยทีมสูตินรีแพทย์และนักโภชนาการคลินิก คัดสรรวัตถุดิบที่หาซื้อง่ายในตลาดไทยและซูเปอร์มาร์เก็ต:
              </p>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-rose-50 text-rose-950 font-bold">
                    <tr>
                      <th className="p-2 border-b">ระยะ</th>
                      <th className="p-2 border-b">ฮอร์โมนเด่น</th>
                      <th className="p-2 border-b">อาหารไทยแนะนำ</th>
                      <th className="p-2 border-b">อาหารที่ควรเลี่ยง</th>
                      <th className="p-2 border-b">การจัดการอาการ & กิจกรรม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-bold text-rose-600">1. Menstrual (วัน 1-5)</td>
                      <td className="p-2">Estrogen & Progesterone ต่ำสุด</td>
                      <td className="p-2">แกงเลียง, น้ำขิงอุ่น, เลือดหมู/ตับ, ปลาทูทอด</td>
                      <td className="p-2 text-rose-700">น้ำแข็งไส, กาแฟเข้ม, ส้มตำรสเค็มจัด</td>
                      <td className="p-2">ประคบกระเป๋าน้ำร้อน, โยคะยืดเหยียดเบาๆ, นอนหลับ 8 ชม.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-emerald-600">2. Follicular (วัน 6-13)</td>
                      <td className="p-2">FSH & Estrogen พุ่งสูงขึ้น</td>
                      <td className="p-2">คะน้าฮ่องกง, กะหล่ำปลี, อกไก่, ข้าวหมาก, กิมจิ</td>
                      <td className="p-2 text-rose-700">แอลกอฮอล์จัด, เบเกอรี่เนยเทียม</td>
                      <td className="p-2">พลังงานสูงสุด เวทเทรนนิ่ง วิ่งจ๊อกกิ้ง มาส์กหน้าบำรุงผิว</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-purple-600">3. Ovulation (วัน 14-16)</td>
                      <td className="p-2">LH Surge & Testosterone สูง</td>
                      <td className="p-2">ฝรั่งสด, มะเขือเทศราชินี, อะโวคาโด, ไข่ต้มยางมะตูม</td>
                      <td className="p-2 text-rose-700">ของทอดน้ำมันซ้ำ, ไขมันทรานส์</td>
                      <td className="p-2">HIIT คาร์ดิโอ, วันเจริญพันธุ์สูงสุด, ดื่มน้ำลดเสียดท้อง</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-amber-600">4. Luteal (วัน 17-28)</td>
                      <td className="p-2">Progesterone สูงแล้วตกลง</td>
                      <td className="p-2">กล้วยน้ำว้า, ดาร์กช็อกโกแลต, ข้าวกล้อง, มันหวานนึ่ง</td>
                      <td className="p-2 text-rose-700">ขนมกรุบกรอบเค็มจัด, ชาเย็นหวานจัด</td>
                      <td className="p-2">เสริมแมกนีเซียมและ B6 บรรเทา PMS, พิลาทิส, จัดบ้านผ่อนคลาย</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                5. DATA SUMMARY & MEDICAL REPORT (ระบบสรุปผล)
              </h3>
              <p>
                ออกแบบขึ้นเพื่อตอบโจทย์ปัญหาจริงที่คนไข้มักจำไม่ได้ว่า "รอบเดือนมาวันไหน ปวดเมื่อไหร่":
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-800">1. Dashboard Analytics</h4>
                  <p className="text-slate-600">
                    กราฟแท่งประวัติ 6 รอบเดือนย้อนหลัง, ค่าเบี่ยงเบนมาตรฐาน (SD) แสดงความสม่ำเสมอ, และสถิติอาการพบบ่อยช่วยแยกแยะระหว่างอาการปวดปกติกับภาวะเยื่อบุโพรงมดลูกเจริญผิดที่
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-800">2. Medical PDF Export Sheet</h4>
                  <p className="text-slate-600">
                    ฟอร์มรายงานระดับคลินิก มีสัญลักษณ์ทางการแพทย์ ข้อมูล Demographic, ตารางสรุปรอบเดือน, ผลการคัดกรองเบื้องต้นตามเกณฑ์ Rotterdam Criteria 2003 สำหรับภาวะถุงน้ำในรังไข่หลายใบ (PCOS) พร้อมช่องให้แพทย์เซ็นชื่อ
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                6. UI/UX DESIGN & WIREFRAME BLUEPRINT (การออกแบบหน้าตาโปรแกรม)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-1">
                  <p className="font-bold text-rose-900">หน้า 1: Onboarding & Profile Setup</p>
                  <p className="text-slate-600">
                    Layout: หน้าต่างต้อนรับมีภาพอวาตาร์น่ารักให้เลือก, ฟิลด์กรอกชื่อเล่น, การ์ดเลือก 4 เป้าหมาย, และสไลเดอร์ปรับความยาวรอบเดือน 21-40 วัน
                  </p>
                </div>
                <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-1">
                  <p className="font-bold text-rose-900">หน้า 2: Home Phase Screen</p>
                  <p className="text-slate-600">
                    Layout: Cycle Progress Wheel ตรงกลางบอกวันและระยะฮอร์โมน, การ์ดคำแนะนำน้องออร่าพร้อมมาสคอต, เกจวัดฮอร์โมน 3 ตัว (Estrogen, Progesterone, LH) และปุ่ม Quick Log
                  </p>
                </div>
                <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-1">
                  <p className="font-bold text-rose-900">หน้า 3: Daily Tracker</p>
                  <p className="text-slate-600">
                    Layout: ปริมาณและสีเลือดแบบการ์ดแตะเลือก, กริดไอคอนอาการทางกายและอารมณ์, ตัวปรับระดับพลังงาน (1-5), ตัวนับแก้วน้ำ และชนิดมูกช่องคลอด
                  </p>
                </div>
                <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-1">
                  <p className="font-bold text-rose-900">หน้า 4: Health Summary & Medical Report</p>
                  <p className="text-slate-600">
                    Layout: การ์ดดัชนีความสม่ำเสมอ, กราฟแท่งเปรียบเทียบรอบเดือน, ตารางประเมิน PCOS, และปุ่มพิมพ์รายงานผลสำหรับยื่นให้แพทย์
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 7 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                7. TECHNICAL ARCHITECTURE & DATABASE SCHEMA (การพัฒนาเชิงเทคนิค)
              </h3>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">7.1 Recommended Tech Stack</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">Frontend</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">React SPA + TypeScript + Tailwind CSS (Vite / React Native สำหรับ iOS/Android)</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">Backend</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Node.js + Express / NestJS (REST API + WebSocket สำหรับ Partner Sync)</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">Database & Security</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">PostgreSQL + Drizzle ORM, Redis สำหรับ Cache และเกณฑ์ความปลอดภัย HIPAA/PDPA</p>
                  </div>
                </div>
              </div>

              {/* SQL Schema */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-purple-500" />
                    7.2 โครงสร้างฐานข้อมูล PostgreSQL Production Schema
                  </h4>
                  <button
                    onClick={() => handleCopy(sqlSchemaCode, 'sql')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    {copiedCode === 'sql' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'sql' ? 'คัดลอกแล้ว' : 'คัดลอก SQL'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-64">
                  {sqlSchemaCode}
                </pre>
              </div>

              {/* Algorithm */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-500" />
                    7.3 อัลกอริทึมคำนวณวันไข่ตกและวันเริ่มประจำเดือน (TypeScript Algorithm)
                  </h4>
                  <button
                    onClick={() => handleCopy(algorithmCode, 'algo')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    {copiedCode === 'algo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'algo' ? 'คัดลอกแล้ว' : 'คัดลอก Code'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-64">
                  {algorithmCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
