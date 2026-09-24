import React, { useState } from 'react';
import { CyclePhase } from '../types';
import { PHASE_GUIDES } from '../data/femtechKnowledge';
import { Apple, AlertCircle, Dumbbell, HeartHandshake, Sparkles, BookOpen, Layers, Check, X, ShieldAlert } from 'lucide-react';

interface NutritionPhaseGuideProps {
  initialPhase?: CyclePhase;
}

export const NutritionPhaseGuide: React.FC<NutritionPhaseGuideProps> = ({
  initialPhase = 'follicular'
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(initialPhase);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const currentGuide = PHASE_GUIDES[selectedPhase];

  const phaseTabs: { id: CyclePhase; label: string; icon: string; subtitle: string }[] = [
    { id: 'menstrual', label: '1. ระยะประจำเดือน', icon: '🩸', subtitle: 'วันที่ 1-5' },
    { id: 'follicular', label: '2. ระยะฟอลลิคูลาร์', icon: '🌱', subtitle: 'วันที่ 6-13' },
    { id: 'ovulation', label: '3. ระยะตกไข่', icon: '☀️', subtitle: 'วันที่ 14-16' },
    { id: 'luteal', label: '4. ระยะลูเทียล', icon: '🍂', subtitle: 'วันที่ 17-28' },
  ];

  return (
    <div className="space-y-5 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            FEMTECH NUTRITION & WELLNESS GUIDE
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Apple className="w-5 h-5 text-rose-500" />
            โภชนาการและการดูแลสุขภาพตาม 4 ระยะฮอร์โมน
          </h2>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-slate-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            รายระยะ (Cards)
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ตารางเปรียบเทียบ (Matrix)
          </button>
        </div>
      </div>

      {/* 4 Phase Segmented Tab Bar - Responsive Scroll or Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {phaseTabs.map((tab) => {
          const isActive = selectedPhase === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedPhase(tab.id)}
              className={`p-3 sm:p-3.5 rounded-2xl flex flex-col items-center sm:items-start transition-all border text-left ${
                isActive
                  ? 'bg-white border-rose-400 ring-2 ring-rose-200 shadow-sm'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs font-bold text-slate-800">{tab.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {viewMode === 'cards' ? (
        <div className="space-y-5">
          {/* Phase Overview Header Card */}
          <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                  {currentGuide.englishName} · {currentGuide.daysRangeDesc}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{currentGuide.thaiName}</h3>
              </div>
              <div className="px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-700 self-start sm:self-auto">
                ฮอร์โมนหลัก: {currentGuide.keyHormones}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {currentGuide.biologicalState}
            </p>
          </div>

          {/* 2-Column Responsive Food Cards: To Eat vs To Avoid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Foods to Eat */}
            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold pb-2 border-b border-emerald-50">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <span>อาหารที่ควรรับประทาน (Nutritional Superfoods)</span>
              </div>

              <div className="space-y-3">
                {currentGuide.foodsToEat.map((food, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 space-y-1">
                    <p className="text-xs font-bold text-slate-800">{food.category}</p>
                    <p className="text-xs text-emerald-800 font-medium">
                      {food.thaiIngredients.join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-500">{food.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Foods to Avoid */}
            <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold pb-2 border-b border-rose-50">
                <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-rose-700" />
                </div>
                <span>อาหารที่ควรเลี่ยงหรือจำกัด (Foods to Limit)</span>
              </div>

              <div className="space-y-3">
                {currentGuide.foodsToAvoid.map((food, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100/60 space-y-1">
                    <p className="text-xs font-bold text-slate-800">{food.category}</p>
                    <p className="text-xs text-rose-800 font-medium">
                      {food.examples.join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-500">{food.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2-Column Responsive: Exercise & Self Care vs Gynecologist Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Exercise & Self-Care */}
            <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold pb-2 border-b border-indigo-50">
                <Dumbbell className="w-4 h-4 text-indigo-600" />
                <span>การออกกำลังกาย & ไลฟ์สไตล์ (Cycle Syncing)</span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-500">
                  ระดับความเข้มข้น: <span className="font-bold text-indigo-700">{currentGuide.exerciseAndSelfCare.intensity}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentGuide.exerciseAndSelfCare.suggestedActivities.map((act, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 font-medium border border-indigo-100">
                      {act}
                    </span>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl mt-2 border border-slate-100">
                  <p className="font-bold text-slate-700 mb-0.5">พิธีกรรมดูแลตัวเอง (Self-Care):</p>
                  <p className="text-slate-600 leading-relaxed">{currentGuide.exerciseAndSelfCare.selfCareRitual}</p>
                </div>
              </div>
            </div>

            {/* Medical & GYN Advice for Symptoms */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-purple-700 text-xs font-bold pb-2 border-b border-purple-50">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>คำแนะนำทางการแพทย์ & บรรเทาอาการ</span>
              </div>

              <div className="space-y-3">
                {currentGuide.symptomCare.map((sc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100/60 space-y-1 text-xs">
                    <p className="font-bold text-slate-800">✨ {sc.symptom}</p>
                    <p className="text-slate-600">
                      <span className="font-semibold text-purple-800">สูตินรีแพทย์:</span> {sc.gynecologistAdvice}
                    </p>
                    <p className="text-slate-500">
                      <span className="font-semibold text-emerald-700">นักโภชนาการ:</span> {sc.nutritionistTip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Matrix Comparison Table */
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">ระยะ (Phase)</th>
                <th className="py-3 px-3">ฮอร์โมนเด่น</th>
                <th className="py-3 px-3">อาหารเน้น</th>
                <th className="py-3 px-3">อาหารเลี่ยง</th>
                <th className="py-3 px-3">การออกกำลังกาย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.entries(PHASE_GUIDES).map(([key, guide]) => (
                <tr key={key} className="hover:bg-rose-50/30 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>{guide.thaiName.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{guide.daysRangeDesc}</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-rose-600">{guide.keyHormones}</td>
                  <td className="py-3.5 px-3 text-emerald-800">
                    {guide.foodsToEat[0]?.thaiIngredients.slice(0, 2).join(', ')}
                  </td>
                  <td className="py-3.5 px-3 text-rose-700">
                    {guide.foodsToAvoid[0]?.examples.slice(0, 2).join(', ')}
                  </td>
                  <td className="py-3.5 px-3 text-indigo-700">
                    {guide.exerciseAndSelfCare.intensity.split(' ')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
