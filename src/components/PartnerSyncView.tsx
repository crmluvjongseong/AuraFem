import React, { useState } from 'react';
import { UserProfile, CyclePrediction } from '../types';
import { PHASE_GUIDES } from '../data/femtechKnowledge';
import { Heart, Users, Bell, Share2, Copy, Check, MessageCircleHeart, AlertTriangle, Gift } from 'lucide-react';

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
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            AURA CARE LINK & REMINDERS
          </span>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            เชื่อมต่อคู่รัก & การแจ้งเตือน
          </h2>
        </div>

        {/* Perspective toggle */}
        <button
          onClick={() => setPartnerModeActive(!partnerModeActive)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-2xl transition-all border ${
            partnerModeActive
              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
        >
          {partnerModeActive ? 'มุมมองคู่รัก 👨‍💻' : 'ลองดูมุมมองแฟน 👁️'}
        </button>
      </div>

      {/* Partner Link Info */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                รหัสเชื่อมต่อสำหรับคู่รัก (Partner Care Code)
              </p>
              <p className="text-[11px] text-slate-500">
                ให้แฟนสแกนหรือใส่รหัสนี้เพื่อรับรู้สถานะฮอร์โมนโดยไม่ต้องเดาใจ
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-mono font-bold text-rose-600 flex-1 px-2">
            {user.partnerCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition-all shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-600">สถานะการเชื่อมต่อ:</span>
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            เชื่อมต่อกับ {user.partnerNickname || 'คู่รักของคุณ'} แล้ว
          </span>
        </div>
      </div>

      {/* Partner Perspective Dashboard */}
      <div className="bg-gradient-to-b from-rose-50/70 to-white rounded-3xl p-4 border border-rose-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <MessageCircleHeart className="w-3.5 h-3.5" />
            คู่มือดูแลแฟนวันนี้ (FOR PARTNER)
          </span>
          <span className="text-[10px] bg-rose-200/60 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
            {currentGuide.thaiName.split(' ')[0]}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-rose-100 shadow-2xs space-y-2">
          <p className="text-xs font-bold text-slate-800">
            💭 สภาวะอารมณ์ของ {user.nickname} ตอนนี้:
          </p>
          <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/50 p-2.5 rounded-xl">
            "{partnerGuide.emotionalState}"
          </p>
        </div>

        {/* Dos and Don'ts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* What to do */}
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1.5">
            <p className="text-xs font-bold text-emerald-900 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> สิ่งที่ควรทำ (ได้ใจเต็ม 100)
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
              {partnerGuide.whatToDo.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* What to avoid */}
          <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-1.5">
            <p className="text-xs font-bold text-rose-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> ประโยค/พฤติกรรมที่ควรเลี่ยง
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
              {partnerGuide.whatToAvoid.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended gifts/food */}
        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
          <p className="text-xs font-bold text-amber-900 flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-amber-600" /> ของฝากถูกใจวันนี้น้องออร่าแนะนำให้ซื้อไปฝาก:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {partnerGuide.careGiftsOrFood.map((gift, i) => (
              <span key={i} className="text-xs bg-white text-amber-800 px-2.5 py-0.5 rounded-lg border border-amber-200 font-medium shadow-2xs">
                🎁 {gift}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gentle Reminders Settings */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-rose-500" />
          การตั้งค่าแจ้งเตือนแบบนุ่มนวล (Gentle Notifications)
        </h3>

        <div className="space-y-2.5 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                เตือนล่วงหน้า 2 วัน ก่อนประจำเดือนมา
              </p>
              <p className="text-[10px] text-slate-500">
                แจ้งเตือนให้พกผ้าอนามัยและดื่มน้ำอุ่น
              </p>
            </div>
            <button
              onClick={() => setRemind2Days(!remind2Days)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                remind2Days ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  remind2Days ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                เตือนวันไข่ตก & ช่วงเจริญพันธุ์ (Fertile Window)
              </p>
              <p className="text-[10px] text-slate-500">
                มีประโยชน์ทั้งสำหรับการวางแผนมีบุตร หรือการคุมกำเนิด
              </p>
            </div>
            <button
              onClick={() => setRemindOvulation(!remindOvulation)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                remindOvulation ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  remindOvulation ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                เตือนดื่มน้ำ & พักสายตา
              </p>
              <p className="text-[10px] text-slate-500">
                ช่วยลดอาการปวดศีรษะและบวมน้ำระหว่างวัน
              </p>
            </div>
            <button
              onClick={() => setRemindHydration(!remindHydration)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                remindHydration ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  remindHydration ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
