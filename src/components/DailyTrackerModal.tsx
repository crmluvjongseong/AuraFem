import React, { useState } from 'react';
import { DailyLog, PeriodFlow, BloodColor, CervicalMucus } from '../types';
import { SYMPTOM_DEFINITIONS, MOOD_DEFINITIONS, FLOW_OPTIONS, BLOOD_COLORS } from '../data/femtechKnowledge';
import { X, Check, Droplets, Moon, BatteryMedium, Sparkles, Smile, Flame, Plus, Minus } from 'lucide-react';
import { formatThaiDate } from '../utils/cycleCalculations';

interface DailyTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  existingLog?: DailyLog;
  onSaveLog: (log: DailyLog) => void;
}

export const DailyTrackerModal: React.FC<DailyTrackerModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  existingLog,
  onSaveLog
}) => {
  const [selectedDate, setSelectedDate] = useState(dateStr);
  const [isPeriodDay, setIsPeriodDay] = useState(existingLog?.isPeriodDay ?? false);
  const [flow, setFlow] = useState<PeriodFlow>(existingLog?.flow ?? 'none');
  const [bloodColor, setBloodColor] = useState<BloodColor | undefined>(existingLog?.bloodColor);
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptoms ?? []);
  const [moods, setMoods] = useState<string[]>(existingLog?.moods ?? []);
  const [energyLevel, setEnergyLevel] = useState<number>(existingLog?.energyLevel ?? 3);
  const [sleepHours, setSleepHours] = useState<number>(existingLog?.sleepHours ?? 7.5);
  const [stressLevel, setStressLevel] = useState<number>(existingLog?.stressLevel ?? 2);
  const [waterGlasses, setWaterGlasses] = useState<number>(existingLog?.waterGlasses ?? 8);
  const [cervicalMucus, setCervicalMucus] = useState<CervicalMucus | undefined>(existingLog?.cervicalMucus);
  const [hadSex, setHadSex] = useState<boolean>(existingLog?.hadSex ?? false);
  const [isProtectedSex, setIsProtectedSex] = useState<boolean>(existingLog?.isProtectedSex ?? true);
  const [note, setNote] = useState<string>(existingLog?.note ?? '');

  if (!isOpen) return null;

  const toggleSymptom = (id: string) => {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleMood = (id: string) => {
    setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const logData: DailyLog = {
      date: selectedDate,
      isPeriodDay: isPeriodDay || (flow !== 'none'),
      flow: isPeriodDay && flow === 'none' ? 'light' : flow,
      bloodColor: isPeriodDay ? bloodColor : undefined,
      symptoms,
      moods,
      energyLevel,
      sleepHours,
      stressLevel,
      waterGlasses,
      cervicalMucus,
      hadSex,
      isProtectedSex: hadSex ? isProtectedSex : undefined,
      note: note.trim()
    };
    onSaveLog(logData);
    onClose();
  };

  const mucusOptions: { id: CervicalMucus; label: string; desc: string }[] = [
    { id: 'dry', label: 'แห้ง (Dry)', desc: 'ช่วงหลังหมดประจำเดือน' },
    { id: 'sticky', label: 'เหนียวข้น (Sticky)', desc: 'ฮอร์โมนเริ่มปรับ' },
    { id: 'creamy', label: 'ขาวครีม (Creamy)', desc: 'ก่อนเข้าช่วงตกไข่' },
    { id: 'egg_white', label: 'ไข่ขาวดิบ ยืดได้ (Egg-White)', desc: 'ช่วงไข่ตก โอกาสท้องสูงสุด!' },
    { id: 'watery', label: 'ใสเป็นน้ำ (Watery)', desc: 'ช่วงฮอร์โมนเอสโตรเจนสูง' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-rose-100 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
              DAILY WELLNESS CHECK-IN
            </span>
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              บันทึกสุขภาพประจำวัน 🌸
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - scrollable */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
          {/* Date Picker */}
          <div className="flex items-center justify-between bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
            <div>
              <p className="text-xs font-semibold text-slate-700">วันที่บันทึก</p>
              <p className="text-xs text-rose-600">{formatThaiDate(selectedDate)}</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-rose-200 rounded-xl focus:outline-none focus:border-rose-400 text-slate-700 font-medium"
            />
          </div>

          {/* Period Bleeding Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-rose-500" />
                มีประจำเดือนวันนี้หรือไม่
              </label>
              <button
                type="button"
                onClick={() => {
                  const nextState = !isPeriodDay;
                  setIsPeriodDay(nextState);
                  if (!nextState) setFlow('none');
                  else if (flow === 'none') setFlow('light');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  isPeriodDay
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isPeriodDay ? 'มีประจำเดือน 🩸' : 'ไม่มีประจำเดือน'}
              </button>
            </div>

            {isPeriodDay && (
              <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-3">
                <p className="text-[11px] font-semibold text-slate-600">ปริมาณเลือด</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FLOW_OPTIONS.filter(f => f.id !== 'none').map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFlow(f.id as PeriodFlow)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        flow === f.id
                          ? 'border-rose-400 bg-white shadow-sm ring-1 ring-rose-400'
                          : 'border-slate-100 bg-white/70 hover:border-rose-200'
                      }`}
                    >
                      <div className="text-sm">{f.icon}</div>
                      <p className="text-xs font-semibold text-slate-800 mt-1">{f.label}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{f.desc}</p>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] font-semibold text-slate-600 pt-1">สีของเลือด</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOOD_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setBloodColor(c.id as BloodColor)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        bloodColor === c.id
                          ? 'border-rose-400 bg-white shadow-sm ring-1 ring-rose-400'
                          : 'border-slate-100 bg-white/70 hover:border-rose-200'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.color} shrink-0`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{c.label}</p>
                        <p className="text-[10px] text-slate-500 truncate">{c.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Physical Symptoms */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                อาการทางร่างกาย (กดเลือกไอคอน)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {symptoms.length > 0 ? `เลือกแล้ว ${symptoms.length} อาการ` : 'เลือกได้หลายข้อ'}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SYMPTOM_DEFINITIONS.map((sym) => {
                const isSelected = symptoms.includes(sym.id);
                return (
                  <button
                    type="button"
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-rose-300 bg-rose-50/80 text-rose-900 shadow-xs'
                        : 'border-slate-100 bg-slate-50/60 hover:bg-rose-50/30 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{sym.icon}</span>
                    <span className="text-xs font-medium truncate">{sym.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Moods */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-500" />
                อารมณ์และความรู้สึก
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {moods.length > 0 ? `เลือกแล้ว ${moods.length} อารมณ์` : 'สะท้อนความในใจ'}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOOD_DEFINITIONS.map((m) => {
                const isSelected = moods.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleMood(m.id)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-amber-300 bg-amber-50/80 text-amber-900 shadow-xs'
                        : 'border-slate-100 bg-slate-50/60 hover:bg-amber-50/30 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-[11px] font-medium truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy & Sleep & Water */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Energy */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <BatteryMedium className="w-3.5 h-3.5 text-emerald-500" /> ระดับพลังงาน
                </span>
                <span className="text-xs font-bold text-emerald-600">{energyLevel} / 5</span>
              </div>
              <div className="flex gap-1 justify-between">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      energyLevel >= lvl
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" /> นอนหลับ
                </span>
                <span className="text-xs font-bold text-indigo-600">{sleepHours} ชม.</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSleepHours(Math.max(3, sleepHours - 0.5))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-semibold text-slate-700">{sleepHours}h</span>
                <button
                  type="button"
                  onClick={() => setSleepHours(Math.min(14, sleepHours + 0.5))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Water */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" /> ดื่มน้ำ
                </span>
                <span className="text-xs font-bold text-sky-600">{waterGlasses} แก้ว</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-semibold text-slate-700">🥛 {waterGlasses}</span>
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.min(20, waterGlasses + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Cervical Mucus & Intimacy */}
          <div className="space-y-3 p-3 bg-purple-50/40 rounded-2xl border border-purple-100">
            <div>
              <p className="text-xs font-semibold text-purple-900 mb-1">
                มูกช่องคลอด (สัญญาณบอกวันไข่ตก)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {mucusOptions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCervicalMucus(cervicalMucus === m.id ? undefined : m.id)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      cervicalMucus === m.id
                        ? 'bg-purple-100/90 border-purple-400 text-purple-900 font-semibold'
                        : 'bg-white border-purple-100 text-slate-700 hover:bg-purple-50/50'
                    }`}
                  >
                    <div>{m.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-100">
              <span className="text-xs font-semibold text-purple-900">มีเพศสัมพันธ์วันนี้</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHadSex(!hadSex)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    hadSex ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {hadSex ? 'มี 💕' : 'ไม่มี'}
                </button>
                {hadSex && (
                  <button
                    type="button"
                    onClick={() => setIsProtectedSex(!isProtectedSex)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      isProtectedSex
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-rose-300 bg-rose-50 text-rose-700'
                    }`}
                  >
                    {isProtectedSex ? 'ป้องกัน 🛡️' : 'ไม่ป้องกัน ⚠️'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              โน้ตความรู้สึกหรือสิ่งที่เกิดขึ้นเพิ่มเติม
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น วันนี้กินน้ำขิงแล้วรู้สึกสบายท้องขึ้นมาก, ประชุมเหนื่อย..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 text-slate-700 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="pt-3 border-t border-rose-100 shrink-0">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            บันทึกข้อมูลสุขภาพวันนี้
          </button>
        </div>
      </div>
    </div>
  );
};
