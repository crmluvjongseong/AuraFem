import React, { useState } from 'react';
import { UserProfile, UserGoal } from '../types';
import { AVATAR_OPTIONS } from '../data/femtechKnowledge';
import { Check, Heart, Sparkles, User, Calendar, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  isInitialSetup?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  isInitialSetup = false,
}) => {
  const [nickname, setNickname] = useState(currentProfile.nickname);
  const [username, setUsername] = useState(currentProfile.username);
  const [avatarId, setAvatarId] = useState(currentProfile.avatarId);
  const [goal, setGoal] = useState<UserGoal>(currentProfile.goal);
  const [cycleLength, setCycleLength] = useState(currentProfile.averageCycleLength);
  const [periodDuration, setPeriodDuration] = useState(currentProfile.averagePeriodDuration);
  const [lastStart, setLastStart] = useState(currentProfile.lastPeriodStartDate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...currentProfile,
      nickname: nickname.trim() || 'เพื่อนสาวออร่า',
      username: username.trim() || 'aurafem_user',
      avatarId,
      goal,
      averageCycleLength: Number(cycleLength),
      averagePeriodDuration: Number(periodDuration),
      lastPeriodStartDate: lastStart
    });
    onClose();
  };

  const goalsList: { id: UserGoal; title: string; desc: string; icon: string }[] = [
    {
      id: 'track_period',
      title: 'ติดตามรอบเดือนปกติ',
      desc: 'รู้ล่วงหน้าว่ารอบเดือนจะมาวันไหน สังเกตอาการและวางแผนกิจกรรม',
      icon: '🌸'
    },
    {
      id: 'trying_to_conceive',
      title: 'เตรียมพร้อมมีบุตร (TTC)',
      desc: 'โฟกัสวันไข่ตก ช่วงเจริญพันธุ์สูงสุด และจังหวะปฏิสนธิที่ดีที่สุด',
      icon: '🍼'
    },
    {
      id: 'contraception',
      title: 'สังเกตระยะปลอดภัย & คุมกำเนิด',
      desc: 'เข้าใจหน้าต่างการเจริญพันธุ์ (Fertile Window) และความเสี่ยง',
      icon: '🛡️'
    },
    {
      id: 'pcos_health',
      title: 'ดูแลรอบเดือนไม่สม่ำเสมอ / PCOS',
      desc: 'บันทึกอาการและแนวโน้มฮอร์โมน เพื่อส่งรายงานให้สูตินรีแพทย์',
      icon: '🩺'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg md:max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-rose-100 my-4 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-base font-bold text-slate-800">
              {isInitialSetup ? 'ยินดีต้อนรับสู่ AuraFem' : 'แก้ไขข้อมูลสุขภาพส่วนตัว'}
            </h2>
          </div>
          {!isInitialSetup && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5 flex-1 overflow-y-auto pr-1">
          {/* Avatar selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              เลือกอวาตาร์ประจำตัวสุดน่ารัก
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setAvatarId(opt.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                    avatarId === opt.id
                      ? 'border-rose-400 bg-rose-50 shadow-sm scale-105'
                      : 'border-slate-100 hover:border-rose-200 bg-slate-50/50'
                  }`}
                  title={opt.name}
                >
                  <span className="text-2xl">{opt.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ชื่อเล่นที่อยากให้เรียก
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder="เช่น มีนา, ฝ้าย, เมย์"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ชื่อผู้ใช้ (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="เช่น meena.s"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              เป้าหมายสุขภาพของคุณตอนนี้
            </label>
            <div className="space-y-2">
              {goalsList.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    goal === g.id
                      ? 'border-rose-400 bg-rose-50/60 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-xl mt-0.5">{g.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{g.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{g.desc}</p>
                  </div>
                  {goal === g.id && (
                    <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cycle Stats */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>ความยาวรอบเดือนเฉลี่ย</span>
                <span className="text-rose-600 font-bold">{cycleLength} วัน</span>
              </div>
              <input
                type="range"
                min="21"
                max="40"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>21 วัน</span>
                <span>มาตรฐาน 28 วัน</span>
                <span>40 วัน</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>ระยะเวลาที่มีประจำเดือน</span>
                <span className="text-rose-600 font-bold">{periodDuration} วัน</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>3 วัน</span>
                <span>มาตรฐาน 5 วัน</span>
                <span>8 วัน</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันแรกที่ประจำเดือนรอบล่าสุดเริ่มมา
              </label>
              <input
                type="date"
                value={lastStart}
                onChange={(e) => setLastStart(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-rose-500/20"
          >
            {isInitialSetup ? 'เริ่มต้นดูแลตัวเองกันเลย 💕' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </form>
      </div>
    </div>
  );
};
