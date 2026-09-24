import React, { useState } from 'react';
import { UserProfile, CyclePrediction } from '../types';
import { PHASE_GUIDES } from '../data/femtechKnowledge';
import { Heart, Users, Bell, Share2, Copy, Check, MessageCircleHeart, AlertTriangle, Gift, ShieldAlert, Sparkles } from 'lucide-react';

interface PartnerSyncViewProps {
  user: UserProfile;
  prediction: CyclePrediction;
  onUpdatePartnerSettings: (updated: Partial<UserProfile>) => void;
}

export const PartnerSyncView: React.FC<PartnerSyncViewProps> = ({
  user,
  prediction,
  onUpdatePartnerSettings
}) => {
  const [copied, setCopied] = useState(false);
  const [partnerModeActive, setPartnerModeActive] = useState(false);
  const [remind2Days, setRemind2Days] = useState(true);
  const [remindOvulation, setRemindOvulation] = useState(true);
  const [remindHydration, setRemindHydration] = useState(false);

  const currentGuide = PHASE_GUIDES[prediction.currentPhase];
  const partnerGuide = currentGuide.partnerCareGuide;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.partnerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            AURA CARE LINK & REMINDERS
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            โหมดเชื่อมต่อคนรัก & การดูแลเอาใจใส่
          </h2>
        </div>

        {/* Perspective toggle */}
        <button
          onClick={() => setPartnerModeActive(!partnerModeActive)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-2xl transition-all border self-start sm:self-auto ${
            partnerModeActive
              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
        >
          {partnerModeActive ? 'มุมมองคู่รัก 👨‍💻' : 'ลองสลับดูมุมมองแฟน 👁️'}
        </button>
      </div>

      {/* Responsive Grid: 2-Column on Tablet/Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Link Code + Partner Advice (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Partner Link Info Card */}
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">รหัสเชื่อมต่อส่วนตัว (Aura Care Code)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ส่งรหัสนี้ให้แฟนเพื่อให้เข้าถึงคำแนะนำการดูแลในแต่ละวัน
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold">
                {user.isPartnerLinked ? 'เชื่อมต่อแล้ว' : 'รอการเชื่อมต่อ'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 font-mono font-bold text-sm tracking-wider text-slate-800 text-center">
                {user.partnerCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

          {/* Partner Perspective Care Card */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-white border border-rose-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
              <MessageCircleHeart className="w-4 h-4 text-rose-500" />
              <span>คู่มือการดูแลสำหรับคนรักในระยะ: {currentGuide.thaiName.split(' ')[0]}</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-rose-100 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase">สภาวะอารมณ์และระดับพลังงานของแฟนช่วงนี้:</p>
              <p className="text-xs text-slate-700 font-medium">"{partnerGuide.emotionalState}"</p>
            </div>

            {/* Do's & Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-2">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> สิ่งที่แฟนต้องการ / ควรทำ:
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {partnerGuide.whatToDo.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 space-y-2">
                <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> สิ่งที่ควรหลีกเลี่ยง:
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {partnerGuide.whatToAvoid.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Gift ideas + Notification Toggles (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Care Gifts & Food Ideas */}
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold pb-2 border-b border-rose-50">
              <Gift className="w-4 h-4" />
              <span>ของขวัญหรือเมนูเอาใจใส่ช่วงนี้</span>
            </div>

            <div className="space-y-2">
              {partnerGuide.careGiftsOrFood.map((gift, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100/70 text-xs text-slate-700 flex items-center gap-2">
                  <span className="text-base">💝</span>
                  <span className="font-medium">{gift}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gentle Notification Settings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 text-xs font-bold pb-2 border-b border-slate-100">
              <Bell className="w-4 h-4 text-purple-500" />
              <span>การแจ้งเตือนคู่รักแบบละมุนตา (Gentle Push)</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">แจ้งเตือนก่อนประจำเดือนมา 2 วัน</p>
                  <p className="text-[11px] text-slate-400">ส่งข้อความเตรียมขนมและแผ่นประคบร้อน</p>
                </div>
                <input
                  type="checkbox"
                  checked={remind2Days}
                  onChange={(e) => setRemind2Days(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">แจ้งเตือนช่วงระยะเจริญพันธุ์ / วันไข่ตก</p>
                  <p className="text-[11px] text-slate-400">สำหรับคู่ที่วางแผนมีบุตร</p>
                </div>
                <input
                  type="checkbox"
                  checked={remindOvulation}
                  onChange={(e) => setRemindOvulation(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">เตือนแฟนให้ดื่มน้ำและพักผ่อน</p>
                  <p className="text-[11px] text-slate-400">วันที่มีอาการปวดท้องหรือเพลีย</p>
                </div>
                <input
                  type="checkbox"
                  checked={remindHydration}
                  onChange={(e) => setRemindHydration(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
