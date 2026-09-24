import React, { useState } from 'react';
import { CyclePhase } from '../types';
import { PHASE_GUIDES } from '../data/femtechKnowledge';
import { Apple, AlertCircle, Dumbbell, HeartHandshake, Sparkles, BookOpen, Layers } from 'lucide-react';

interface NutritionPhaseGuideProps {
  initialPhase?: CyclePhase;
}

export const NutritionPhaseGuide: React.FC<NutritionPhaseGuideProps> = ({
  initialPhase = 'follicular'
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(initialPhase);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const currentGuide = PHASE_GUIDES[selectedPhase];

  const phaseTabs: { id: CyclePhase; label: string; icon: string; color: string }[] = [
    { id: 'menstrual', label: '1. ประจำเดือน', icon: '❄️', color: 'rose' },
    { id: 'follicular', label: '2. ฟอลลิคูลาร์', icon: '🌱', color: 'emerald' },
    { id: 'ovulation', label: '3. ตกไข่', icon: '☀️', color: 'purple' },
    { id: 'luteal', label: '4. ลูเทียล', icon: '🍂', color: 'amber' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            FEMTECH WELLNESS GUIDE
          </span>
          <h2 className="text-base font-bold text-slate-800">
            โภชนาการและการดูแล 4 ระยะ
          </h2>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            รายระยะ
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ตารางเปรียบเทียบ
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <>
          {/* Phase Segmented Buttons */}
          <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-rose-100 shadow-2xs">
            {phaseTabs.map((tab) => {
              const isActive = selectedPhase === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPhase(tab.id)}
                  className={`py-2 px-1 rounded-xl text-center transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 text-xs font-medium'
                  }`}
                >
                  <div className="text-sm">{tab.icon}</div>
                  <div className="text-[10px] truncate mt-0.5">{tab.label}</div>
                </button>
              );
            })}
          </div>

          {/* Phase Header Spotlight */}
          <div className={`p-4 rounded-3xl border border-rose-100 ${currentGuide.bgPastel} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${currentGuide.badgeBg}`}>
                {currentGuide.englishName}
              </span>
              <span className="text-xs font-medium text-slate-600">{currentGuide.daysRangeDesc}</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">{currentGuide.thaiName}</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              🧬 <span className="font-bold text-slate-900">ฮอร์โมนหลัก:</span> {currentGuide.keyHormones}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentGuide.hormoneDescription}
            </p>
          </div>

          {/* Thai Food Recommendations */}
          <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Apple className="w-4 h-4 text-emerald-500" />
              อาหารที่ควรรับประทาน (เน้นวัตถุดิบหาง่ายในไทย)
            </h4>
            <div className="space-y-2.5">
              {currentGuide.foodsToEat.map((food, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
                  <p className="text-xs font-bold text-emerald-900">{food.category}</p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {food.thaiIngredients.map((item, i) => (
                      <span key={i} className="text-[11px] bg-white text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 font-medium">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-1">💡 {food.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Foods to Avoid */}
          <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              อาหารที่ควรหลีกเลี่ยงหรือลดปริมาณ
            </h4>
            <div className="space-y-2">
              {currentGuide.foodsToAvoid.map((avoid, idx) => (
                <div key={idx} className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-1">
                  <p className="text-xs font-bold text-rose-900">{avoid.category}</p>
                  <p className="text-xs text-rose-700">
                    <span className="font-medium">ตัวอย่าง:</span> {avoid.examples.join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    ⚠️ <span className="font-semibold">เหตุผล:</span> {avoid.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptom Management */}
          <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-purple-500" />
              คำแนะนำจากสูตินรีแพทย์ & นักโภชนาการ
            </h4>
            <div className="space-y-3">
              {currentGuide.symptomCare.map((care, idx) => (
                <div key={idx} className="p-3 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-1.5">
                  <p className="text-xs font-bold text-purple-900">{care.symptom}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    🩺 <span className="font-semibold text-purple-950">คำแนะนำสูตินรีแพทย์:</span> {care.gynecologistAdvice}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    🥗 <span className="font-semibold text-emerald-800">เคล็ดลับโภชนาการ:</span> {care.nutritionistTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise & Self-care */}
          <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-indigo-500" />
              การออกกำลังกาย & พิธีกรรมดูแลตัวเอง (Self-care)
            </h4>
            <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-900">ระดับความหนัก:</span>
                <span className="font-bold text-indigo-700">{currentGuide.exerciseAndSelfCare.intensity}</span>
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-semibold">กิจกรรมแนะนำ:</span> {currentGuide.exerciseAndSelfCare.suggestedActivities.join(' · ')}
              </div>
              <p className="text-xs text-slate-600 pt-1 border-t border-indigo-100/60 leading-relaxed">
                🕯️ <span className="font-semibold text-indigo-900">พิธีกรรมผ่อนคลาย:</span> {currentGuide.exerciseAndSelfCare.selfCareRitual}
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Full Comparative Table */
        <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3 overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-800">
            ตารางสรุปเปรียบเทียบฮอร์โมนและการดูแลครบ 4 ระยะ
          </h3>
          <div className="min-w-[500px]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/60 text-slate-700">
                  <th className="p-2.5 font-bold">ระยะ (Phase)</th>
                  <th className="p-2.5 font-bold">ฮอร์โมนหลัก</th>
                  <th className="p-2.5 font-bold">อาหารไทยแนะนำ</th>
                  <th className="p-2.5 font-bold">อาหารที่ควรเลี่ยง</th>
                  <th className="p-2.5 font-bold">การออกกำลังกาย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(PHASE_GUIDES).map((guide) => (
                  <tr key={guide.phase} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-semibold text-slate-800 align-top">
                      <div className="font-bold">{guide.thaiName.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400">{guide.daysRangeDesc}</div>
                    </td>
                    <td className="p-2.5 text-slate-600 align-top leading-relaxed">
                      {guide.keyHormones}
                    </td>
                    <td className="p-2.5 text-slate-700 align-top">
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {guide.foodsToEat[0]?.thaiIngredients.slice(0, 3).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2.5 text-rose-700 align-top">
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {guide.foodsToAvoid[0]?.examples.slice(0, 2).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2.5 text-slate-700 align-top">
                      <div className="font-semibold text-indigo-700">{guide.exerciseAndSelfCare.intensity}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {guide.exerciseAndSelfCare.suggestedActivities[0]}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
