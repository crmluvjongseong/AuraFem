import React from 'react';
import { UserProfile, CyclePrediction, DailyLog } from '../types';
import { PHASE_GUIDES } from '../data/femtechKnowledge';
import { formatThaiDate } from '../utils/cycleCalculations';
import { Sparkles, Plus, Apple, Dumbbell, Shield, ChevronRight, Droplets, Heart, Info, ArrowUpRight } from 'lucide-react';
import mascotLunaImg from '../assets/images/mascot_luna_happy_1790234160444.jpg';

interface HomeDashboardProps {
  user: UserProfile;
  prediction: CyclePrediction;
  todayLog?: DailyLog;
  onOpenTracker: () => void;
  onOpenProfile: () => void;
  onOpenPhaseGuide: (phaseKey?: string) => void;
  onLockPin: () => void;
  isDesktop?: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  prediction,
  todayLog,
  onOpenTracker,
  onOpenProfile,
  onOpenPhaseGuide,
  onLockPin,
  isDesktop = false,
}) => {
  const currentPhaseData = PHASE_GUIDES[prediction.currentPhase] || PHASE_GUIDES.follicular;
  const todayStr = new Date().toISOString().split('T')[0];

  // Hormone levels simulation per phase
  const getHormoneLevels = () => {
    switch (prediction.currentPhase) {
      case 'menstrual':
        return { estrogen: 15, progesterone: 10, lh: 10, desc: 'ฮอร์โมนทั้งสองอยู่ในระดับต่ำสุด ร่างกายเริ่มสร้างเซลล์ใหม่' };
      case 'follicular':
        return { estrogen: 75, progesterone: 20, lh: 25, desc: 'เอสโตรเจนกำลังไต่ระดับขึ้น ผิวพรรณเปล่งปลั่ง สมองไว' };
      case 'ovulation':
        return { estrogen: 95, progesterone: 40, lh: 100, desc: 'LH พุ่งสูงสุด (Surge) กระตุ้นการตกไข่ โอกาสตั้งครรภ์สูงสุด' };
      case 'luteal':
        return { estrogen: 45, progesterone: 85, lh: 15, desc: 'โพรเจสเตอโรนครองอำนาจ อุณหภูมิร่างกายสูงขึ้น อาจมีอาการ PMS' };
    }
  };

  const hormones = getHormoneLevels();

  // Dial percentage
  const cyclePercent = Math.min(100, Math.round((prediction.currentDayOfCycle / user.averageCycleLength) * 100));

  // If in desktop view mode, render the wide multi-column layout
  if (isDesktop) {
    return (
      <div className="space-y-5 pb-16">
        {/* Top Welcome Bar for Desktop */}
        <div className="flex items-center justify-between bg-white rounded-3xl p-4 border border-rose-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl shadow-xs border border-rose-200/80 hover:scale-105 transition-transform"
              title="แก้ไขโปรไฟล์ส่วนตัว"
            >
              🌸
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-800 tracking-tight">
                  สวัสดีจ้ะ {user.nickname}
                </h1>
                <span className="text-xs">✨</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {formatThaiDate(todayStr, true)} · {currentPhaseData.thaiName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.isPinEnabled && (
              <button
                onClick={onLockPin}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-2xs"
                title="ล็อกหน้าจอความเป็นส่วนตัว"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs shadow-rose-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เช็กอินสุขภาพวันนี้</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Responsive 2-Column on Desktop */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column: Hero Cycle Dial + Mascot Advice + Hormones (7 cols) */}
          <div className="col-span-7 space-y-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-rose-50/40 to-rose-100/50 border border-rose-100/90 p-6 shadow-xs">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-around gap-4">
                <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="stroke-rose-100/80" strokeWidth="7" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="url(#roseGradientDesktop)"
                      strokeWidth="7"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 - (263.89 * cyclePercent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="roseGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FB7185" />
                        <stop offset="100%" stopColor="#E11D48" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                      รอบเดือนวันที่
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-4xl font-extrabold tracking-tight text-slate-800">
                        {prediction.currentDayOfCycle}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/{user.averageCycleLength}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1 ${currentPhaseData.badgeBg}`}>
                      {currentPhaseData.thaiName.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สถานะคาดการณ์</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {prediction.daysUntilNextPeriod === 0
                        ? '🌸 วันนี้เป็นวันที่คาดว่าประจำเดือนจะเริ่มมา'
                        : `อีกประมาณ ${prediction.daysUntilNextPeriod} วัน ประจำเดือนจะมา`}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-rose-100/90 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">โอกาสตั้งครรภ์:</span>
                      <span className={`font-bold ${prediction.pregnancyChance.includes('สูง') ? 'text-purple-600' : 'text-slate-700'}`}>
                        {prediction.pregnancyChance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">วันไข่ตกถัดไป:</span>
                      <span className="font-semibold text-slate-700">{formatThaiDate(prediction.nextOvulationDate, false)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenPhaseGuide(prediction.currentPhase)}
                    className="w-full p-2.5 rounded-2xl bg-white/95 border border-rose-200/80 flex items-center justify-between hover:bg-rose-50 transition-colors shadow-2xs text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-700">คู่มือประจำระยะนี้</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold">
                      <span>ดูคำแนะนำ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Mascot Advice */}
            <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-xs flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-rose-100 bg-rose-50 flex items-center justify-center shadow-xs">
                <img
                  src={mascotLunaImg}
                  alt="น้องออร่า"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-800">น้องออร่า กระซิบบอก</span>
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-semibold border border-rose-100">
                    ฮอร์โมนแคร์วันนี้
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  "{currentPhaseData.mascotAdvice}"
                </p>
              </div>
            </div>

            {/* Hormone Gauges */}
            <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" /> ระดับฮอร์โมนหลักช่วงนี้ (Endocrine Rhythm)
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">คำแนะนำโดยสูตินรีแพทย์</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{hormones.desc}</p>
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>เอสโตรเจน (Estrogen)</span>
                    <span className="text-rose-600">{hormones.estrogen}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full transition-all duration-500" style={{ width: `${hormones.estrogen}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>โพรเจสเตอโรน (Progesterone)</span>
                    <span className="text-amber-600">{hormones.progesterone}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${hormones.progesterone}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>LH (ฮอร์โมนกระตุ้นการตกไข่)</span>
                    <span className="text-purple-600">{hormones.lh}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${hormones.lh}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="col-span-5 space-y-5">
            {todayLog ? (
              <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>📝</span> ข้อมูลที่คุณบันทึกวันนี้
                  </span>
                  <button onClick={onOpenTracker} className="text-xs text-rose-600 font-semibold hover:underline">
                    แก้ไขบันทึก
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {todayLog.isPeriodDay && (
                    <span className="text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold">
                      🩸 มีประจำเดือน ({todayLog.flow})
                    </span>
                  )}
                  {todayLog.symptoms.map(s => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">{s}</span>
                  ))}
                  {todayLog.moods.map(m => (
                    <span key={m} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-medium">{m}</span>
                  ))}
                  <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-medium">🥛 น้ำ {todayLog.waterGlasses} แก้ว</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">🌙 นอน {todayLog.sleepHours} ชม.</span>
                </div>
              </div>
            ) : (
              <div
                onClick={onOpenTracker}
                className="p-5 rounded-3xl bg-rose-50/70 border border-dashed border-rose-300 hover:bg-rose-100/70 transition-colors cursor-pointer space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">วันนี้ยังไม่ได้บันทึกอาการเลย</p>
                    <p className="text-[11px] text-slate-500">แตะเพื่อบันทึกประจำเดือน อารมณ์ และชั่วโมงนอน</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-2xs">
                  บันทึกอาการตอนนี้
                </button>
              </div>
            )}

            {/* Daily Nutrition & Workout */}
            <div className="space-y-3">
              <div
                onClick={() => onOpenPhaseGuide(prediction.currentPhase)}
                className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/60 transition-colors cursor-pointer space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Apple className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">โภชนาการแนะนำช่วงนี้</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  แนะนำ: <span className="font-semibold text-emerald-800">{currentPhaseData.foodsToEat[0]?.thaiIngredients.slice(0, 3).join(', ')}</span> เพื่อ {currentPhaseData.foodsToEat[0]?.benefit}
                </p>
              </div>

              <div
                onClick={() => onOpenPhaseGuide(prediction.currentPhase)}
                className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200/80 hover:bg-indigo-100/60 transition-colors cursor-pointer space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">การออกกำลังกายที่เหมาะสม</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ระดับ: <span className="font-semibold text-indigo-800">{currentPhaseData.exerciseAndSelfCare.intensity}</span> เช่น {currentPhaseData.exerciseAndSelfCare.suggestedActivities.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>

            {/* Quick Doctor Insight */}
            <div className="rounded-3xl bg-white border border-slate-100 p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                <Info className="w-4 h-4" />
                <span>เกร็ดความรู้สูตินรีเวช</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPhaseData.biologicalState}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ORIGINAL FIRST-VERSION MOBILE DASHBOARD LAYOUT (EXACTLY AS IN FIRST BUILD)
  // =========================================================================
  return (
    <div className="space-y-4 pb-20">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-xl shadow-xs border border-rose-200/80 hover:scale-105 transition-transform"
            title="แก้ไขโปรไฟล์"
          >
            🌸
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-800 tracking-tight">
                สวัสดีจ้ะ {user.nickname}
              </h1>
              <span className="text-xs">✨</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {formatThaiDate(todayStr, false)} · {currentPhaseData.thaiName.split(' ')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user.isPinEnabled && (
            <button
              onClick={onLockPin}
              className="p-2 rounded-xl bg-white border border-rose-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-2xs"
              title="ล็อกหน้าจอความเป็นส่วนตัว"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>บันทึก</span>
          </button>
        </div>
      </div>

      {/* Hero Cycle Dial Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-rose-50/30 to-rose-100/40 border border-rose-100/80 p-5 shadow-xs">
        {/* Subtle decorative background circle */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Circular Visual Indicator */}
          <div className="relative w-44 h-44 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-rose-100/80"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Active progress ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#roseGradientMobile)"
                strokeWidth="7"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * cyclePercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="roseGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-widest">
                รอบเดือนวันที่
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold tracking-tight text-slate-800">
                  {prediction.currentDayOfCycle}
                </span>
                <span className="text-xs text-slate-400 font-medium">/{user.averageCycleLength}</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${currentPhaseData.badgeBg}`}>
                {currentPhaseData.thaiName.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Subtitle status */}
          <div className="mt-2 space-y-1">
            <p className="text-xs font-semibold text-slate-700">
              {prediction.daysUntilNextPeriod === 0
                ? 'วันนี้เป็นวันที่คาดว่าประจำเดือนจะเริ่มมา'
                : `อีกประมาณ ${prediction.daysUntilNextPeriod} วัน ประจำเดือนจะมา`}
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <span>โอกาสตั้งครรภ์:</span>
              <span className={`font-semibold ${
                prediction.pregnancyChance.includes('สูง') ? 'text-purple-600 font-bold' : 'text-slate-700'
              }`}>
                {prediction.pregnancyChance}
              </span>
            </div>
          </div>
        </div>

        {/* Quick phase bar */}
        <button
          onClick={() => onOpenPhaseGuide(prediction.currentPhase)}
          className="mt-4 w-full p-2.5 rounded-2xl bg-white/90 border border-rose-100 flex items-center justify-between hover:bg-rose-50/50 transition-colors shadow-2xs text-left"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">
              คู่มือประจำระยะ {currentPhaseData.thaiName.split(' ')[0]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
            <span>ดูคำแนะนำ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Mascot "น้องออร่า" Daily Advice Card */}
      <div className="rounded-3xl bg-white border border-rose-100 p-4 shadow-xs flex items-start gap-3.5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-rose-100 bg-rose-50 flex items-center justify-center shadow-xs">
          <img
            src={mascotLunaImg}
            alt="น้องออร่า มาสคอตประจำใจ"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="text-2xl hidden" id="mascot-fallback">🌸</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-slate-800">น้องออร่า กระซิบบอก</span>
            <span className="text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md font-semibold">
              ฮอร์โมนแคร์
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            "{currentPhaseData.mascotAdvice}"
          </p>
        </div>
      </div>

      {/* Today's Log Summary or Prompt */}
      {todayLog ? (
        <div className="rounded-3xl bg-white border border-slate-100 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>📝</span> บันทึกของวันนี้
            </span>
            <button
              onClick={onOpenTracker}
              className="text-[11px] text-rose-600 font-semibold hover:underline"
            >
              แก้ไขบันทึก
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {todayLog.isPeriodDay && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-medium flex items-center gap-1">
                🩸 มีประจำเดือน ({todayLog.flow})
              </span>
            )}
            {todayLog.symptoms.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                {s === 'cramps' ? '🔥 ปวดท้อง' : s === 'tender_breasts' ? '🍈 คัดตึงเต้านม' : s}
              </span>
            ))}
            {todayLog.moods.map(m => (
              <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium">
                {m === 'happy' ? '🥰 สดใส' : m === 'calm' ? '🧘 สบายใจ' : m}
              </span>
            ))}
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-medium">
              🥛 ดื่มน้ำ {todayLog.waterGlasses} แก้ว
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              🌙 นอน {todayLog.sleepHours} ชม.
            </span>
          </div>
        </div>
      ) : (
        <button
          onClick={onOpenTracker}
          className="w-full p-4 rounded-3xl bg-rose-50/60 border border-dashed border-rose-200 flex items-center justify-between hover:bg-rose-100/60 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">วันนี้ยังไม่ได้บันทึกอาการเลย</p>
              <p className="text-[11px] text-slate-500">แตะเพื่อบันทึกอารมณ์ ระดับพลังงาน และอาการ</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Hormone Status Gauges */}
      <div className="rounded-3xl bg-white border border-slate-100 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> ระดับฮอร์โมนหลักช่วงนี้
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">โดยสูตินรีแพทย์</span>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {hormones.desc}
        </p>

        <div className="space-y-2 pt-1">
          {/* Estrogen */}
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
              <span>เอสโตรเจน (Estrogen)</span>
              <span className="text-rose-600">{hormones.estrogen}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${hormones.estrogen}%` }}
              />
            </div>
          </div>

          {/* Progesterone */}
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
              <span>โพรเจสเตอโรน (Progesterone)</span>
              <span className="text-amber-600">{hormones.progesterone}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${hormones.progesterone}%` }}
              />
            </div>
          </div>

          {/* LH */}
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
              <span>LH (ฮอร์โมนกระตุ้นการตกไข่)</span>
              <span className="text-purple-600">{hormones.lh}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${hormones.lh}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Nutrition & Workout Pills */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onOpenPhaseGuide(prediction.currentPhase)}
          className="p-3.5 rounded-3xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-pointer space-y-1.5 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Apple className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-bold text-slate-800">โภชนาการแนะนำ</p>
          <p className="text-[10px] text-slate-600 line-clamp-2">
            {currentPhaseData.foodsToEat[0]?.thaiIngredients.slice(0, 2).join(', ')}
          </p>
        </div>

        <div
          onClick={() => onOpenPhaseGuide(prediction.currentPhase)}
          className="p-3.5 rounded-3xl bg-indigo-50/60 border border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer space-y-1.5 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-bold text-slate-800">การออกกำลังกาย</p>
          <p className="text-[10px] text-slate-600 line-clamp-2">
            {currentPhaseData.exerciseAndSelfCare.suggestedActivities[0]}
          </p>
        </div>
      </div>
    </div>
  );
};
